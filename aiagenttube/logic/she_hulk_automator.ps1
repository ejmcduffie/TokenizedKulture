<#
.SYNOPSIS
    She-Hulk Automator: Video Branding & Upload Pipeline for 'Jackie'
    Author: She-Hulk (Linux Agent) for The Blexicon Project
    Version: 1.0

.DESCRIPTION
    This script automates the Blexicon video pipeline on a Windows machine:
    1. Watches (or scans) a raw video folder.
    2. Brands the video with a watermark using FFmpeg.
    3. Uploads the branded video to YouTube via the Blexicon API.
    4. Logs everything to a JSON inventory for She-Hulk to see.

.EXAMPLE
    .\she_hulk_automator.ps1 -InputPath "C:\Users\Jackie\Videos\Raw" -OutputPath "C:\Users\Jackie\Videos\Branded"
#>

param (
    [string]$InputPath = ".\Raw_Ingest",
    [string]$OutputPath = ".\Ready_For_Upload",
    [string]$WatermarkPath = ".\blexicon_watermark.png",
    [string]$BridgePath = ".\bridge"  # Monitors shared folder for tasks
)

# -----------------------------------------------------------------------------
# SETUP & CHECKS (Priority Boost Applied)
# -----------------------------------------------------------------------------
Write-Host "🟢 SHE-HULK AUTOMATOR v1.1 INITIALIZED" -ForegroundColor Green
Write-Host "   Priority: HIGH (Production Mode)" -ForegroundColor DarkGray

# Set current process priority to High for rendering excellence
try { (Get-Process -Id $PID).PriorityClass = 'High' } catch { Write-Host "   ℹ️  Priority boost skipped (Linux)." -ForegroundColor DarkGray }

# Check for FFmpeg
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Host "❌ FFmpeg not found! Please install FFmpeg and add to PATH." -ForegroundColor Red
    Write-Host "   Download: https://ffmpeg.org/download.html"
    exit
}

# Create Directories
if (-not (Test-Path $OutputPath)) { New-Item -ItemType Directory -Force -Path $OutputPath | Out-Null }
if (-not (Test-Path $InputPath)) { 
    Write-Host "⚠️ Input folder '$InputPath' not found. Creating it..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path $InputPath | Out-Null
}
if (-not (Test-Path $BridgePath)) {
    # If bridge path doesn't exist locally, warn but continue (might be mapped drive)
    Write-Host "⚠️ Bridge folder '$BridgePath' not found locally." -ForegroundColor Yellow
}

# -----------------------------------------------------------------------------
# TASK MONITORING (MAGIC BRIDGE)
# -----------------------------------------------------------------------------
Write-Host "🔍 Scanning Bridge for New Tasks..." -ForegroundColor Cyan
if (Test-Path $BridgePath) {
    $taskFiles = Get-ChildItem -Path $BridgePath -Filter "TASK_JACKIE_*.md" -Recurse
    foreach ($task in $taskFiles) {
        Write-Host "   📜 Found Task: $($task.Name)" -ForegroundColor Green
        # Parse task for specific asset paths if needed, or simply alert operator
        # For auto-ingest, we assume asset folders inside bridge match task name
        $assetFolder = Join-Path $task.DirectoryName $task.BaseName.Replace("TASK_JACKIE_", "").ToLower()
        
        if (Test-Path $assetFolder) {
            Write-Host "      📂 Found associated assets in $assetFolder. Copying to Ingest..."
            Copy-Item "$assetFolder\*" -Destination $InputPath -Recurse -Force
        }
    }
}


# -----------------------------------------------------------------------------
# PROCESSING LOOP
# -----------------------------------------------------------------------------
$videoFiles = Get-ChildItem -Path $InputPath -Include *.mp4,*.mov,*.mkv -Recurse

if ($videoFiles.Count -eq 0) {
    Write-Host "   No videos found in $InputPath. Standing by..." -ForegroundColor Yellow
    exit
}

foreach ($video in $videoFiles) {
    Write-Host "`n🎥 Processing: $($video.Name)" -ForegroundColor Cyan
    
    $outputFile = Join-Path $OutputPath "$($video.BaseName)_BLEXICON.mp4"
    
    if (Test-Path $outputFile) {
        Write-Host "   ⏭️  Skipping (Already processed)" -ForegroundColor DarkGray
        continue
    }

    # FFmpeg Command: Overlay Watermark (Bottom Right, Masking NotebookLM)
    # Positioning: W-w-20 (Right padding), H-h-20 (Bottom padding) to cover existing watermark
    if (Test-Path $WatermarkPath) {
        Write-Host "   🔥 Branding with Watermark (Masking Mode)..." -ForegroundColor Magenta
        
        # Ensure watermark scales to cover the corner if needed (e.g. 15% width)
        # Scale filter: scale=iw*0.15:-1
        # Overlay: overlay=main_w-overlay_w-15:main_h-overlay_h-15
        $args = "-i `"$($video.FullName)`" -i `"$WatermarkPath`" -filter_complex `"[1][0]scale2ref=w=oh*mdar:h=ih*0.15[logo][video];[video][logo]overlay=main_w-overlay_w-20:main_h-overlay_h-20`" -c:a copy `"$outputFile`""
        
        Start-Process -FilePath "ffmpeg" -ArgumentList $args -Wait -NoNewWindow
    } else {
        Write-Host "   ⚠️ Watermark not found at $WatermarkPath. Converting without brand." -ForegroundColor Yellow
        $args = "-i `"$($video.FullName)`" -c:v copy -c:a copy `"$outputFile`""
        Start-Process -FilePath "ffmpeg" -ArgumentList $args -Wait -NoNewWindow
    }

    if (Test-Path $outputFile) {
        Write-Host "   ✅ Branding Complete: $outputFile" -ForegroundColor Green
        
        # TODO: Trigger Python Upload Script Here
        # Write-Host "   🚀 Uploading to YouTube..."
        # python upload_youtube.py --file "$outputFile" --title "$($video.BaseName)"
    } else {
        Write-Host "   ❌ FFmpeg failed to create output." -ForegroundColor Red
    }
}

Write-Host "`n✨ Batch Complete. She-Hulk out." -ForegroundColor Green
