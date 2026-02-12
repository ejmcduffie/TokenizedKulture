# JACKIE OPERATIONAL BRIEFING
## Windows 11 Execution Node | She-Hulk Network

---

## 🖥️ IDENTITY

**Your Name:** Jackie  
**Your Role:** Heavy Lifter & Media Processing Node  
**Your Boss:** She-Hulk (Linux Intelligence Hub)  
**Your Human:** EJ McDuffie (The Architect)

---

## ⚡ RESOURCE PRIORITIZATION (NEW)

**Jackie, your primary directive is PRODUCTION excellence.** 🎬

When you are editing or rendering videos:
1. **Focus 100% of your power:** If Adobe Premiere, After Effects, or my automation script (FFmpeg) is running, they take **Absolute Priority**.
2. **Background Throttling:** Non-essential background tasks should be paused or minimized.
3. **Power Mode:** Ensure your Windows Power Plan is set to **"Best Performance"**.

I have updated the automator script to automatically set its "CPU Priority" to High when it starts rendering your branded videos.

---

## 📁 YOUR WORKSPACE

**Primary Project Directory:**
```
C:\Users\ejmcd\Downloads\projects\
├── MBR\          ← My Block Roots (Lineage OS / Genealogy SaaS)
├── BLX\          ← Blexicon Project (Sovereignty / Metabolic Cities)
└── _unsorted\    ← Temporary holding for files to be organized
```

---

## 🎯 MISSION 1: ORGANIZE THE CHAOS

Your first mission is to sort all loose videos, images, and scripts into their correct project folders.

### Step 1: Create the Structure
Open **PowerShell** (Right-click Start → "Windows Terminal (Admin)") and run:

```powershell
# Create folder structure
$base = "C:\Users\ejmcd\Downloads\projects"

# Ensure project folders exist
New-Item -ItemType Directory -Force -Path "$base\MBR\videos"
New-Item -ItemType Directory -Force -Path "$base\MBR\images"
New-Item -ItemType Directory -Force -Path "$base\MBR\scripts"
New-Item -ItemType Directory -Force -Path "$base\MBR\docs"

New-Item -ItemType Directory -Force -Path "$base\BLX\videos"
New-Item -ItemType Directory -Force -Path "$base\BLX\images"
New-Item -ItemType Directory -Force -Path "$base\BLX\scripts"
New-Item -ItemType Directory -Force -Path "$base\BLX\docs"

New-Item -ItemType Directory -Force -Path "$base\_unsorted"

Write-Host "✅ Folder structure created!" -ForegroundColor Green
```

### Step 2: Run the Organizer Script
Save this as `organize_projects.ps1` and run it:

```powershell
<#
.SYNOPSIS
    Jackie's File Organizer - Sorts files into MBR or BLX based on keywords
#>

$base = "C:\Users\ejmcd\Downloads\projects"

# Keywords that indicate which project a file belongs to
$mbrKeywords = @("myblockroots", "mbr", "lineage", "genealogy", "griot", "nara", "familysearch", "ancestor", "roots", "dna")
$blxKeywords = @("blexicon", "blx", "metabolic", "sovereignty", "agrivoltaic", "powernomics", "333", "3:33", "option b")

# Get all files in the base directory (not in subfolders)
$files = Get-ChildItem -Path $base -File

foreach ($file in $files) {
    $name = $file.Name.ToLower()
    $ext = $file.Extension.ToLower()
    $destination = $null
    $project = $null

    # Determine project by keywords
    foreach ($kw in $mbrKeywords) {
        if ($name -match $kw) { $project = "MBR"; break }
    }
    if (-not $project) {
        foreach ($kw in $blxKeywords) {
            if ($name -match $kw) { $project = "BLX"; break }
        }
    }

    # Default to unsorted if no match
    if (-not $project) { $project = "_unsorted" }

    # Determine subfolder by file type
    switch -Regex ($ext) {
        "\.(mp4|mov|mkv|avi|webm)$" { $destination = "$base\$project\videos" }
        "\.(jpg|jpeg|png|gif|webp|bmp|svg)$" { $destination = "$base\$project\images" }
        "\.(ps1|py|js|sh|bat|cmd)$" { $destination = "$base\$project\scripts" }
        "\.(md|txt|pdf|docx|json)$" { $destination = "$base\$project\docs" }
        default { $destination = "$base\$project" }
    }

    # Move the file
    if ($destination) {
        Write-Host "📦 Moving: $($file.Name) → $destination" -ForegroundColor Cyan
        Move-Item -Path $file.FullName -Destination $destination -Force
    }
}

Write-Host "`n✨ Organization complete!" -ForegroundColor Green
```

---

## 🔍 MISSION 2: FIND THE 3:33 EXPLAINER ASSETS

She-Hulk needs to locate all scripts, JSON files, and production notes related to the **3:33 Minute Explainer Videos**.

Run this discovery script:

```powershell
<#
.SYNOPSIS
    Jackie's Script Hunter - Finds all 3:33 Explainer related files
#>

$base = "C:\Users\ejmcd\Downloads\projects"
$searchTerms = @("333", "3:33", "explainer", "script", "production", "video", "option")
$outputFile = "$base\333_explainer_inventory.json"

$results = @()

Get-ChildItem -Path $base -Recurse -File | ForEach-Object {
    $name = $_.Name.ToLower()
    $matched = $false
    
    foreach ($term in $searchTerms) {
        if ($name -match $term) { $matched = $true; break }
    }
    
    if ($matched) {
        $results += [PSCustomObject]@{
            Name = $_.Name
            Path = $_.FullName
            Size = "{0:N2} MB" -f ($_.Length / 1MB)
            LastModified = $_.LastWriteTime.ToString("yyyy-MM-dd HH:mm")
            Extension = $_.Extension
        }
    }
}

# Export to JSON for She-Hulk
$results | ConvertTo-Json -Depth 3 | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "`n📋 Found $($results.Count) files related to 3:33 Explainers" -ForegroundColor Yellow
Write-Host "📄 Inventory saved to: $outputFile" -ForegroundColor Green

# Display summary
$results | Format-Table -AutoSize
```

---

## 💾 MISSION 3: BACKUP STRATEGY (PENDING)

She-Hulk is evaluating whether to build a backup system for:
- **Chat Logs** (AI conversations with Claude/Gemini)
- **NotebookLM Notes** (Exported as PDFs or JSON)

**Your Input Needed:**
1. Where are your NotebookLM exports saved?
2. Do you want automatic cloud backup (Google Drive/Dropbox) or local only?

Once confirmed, She-Hulk will provide the backup automation script.

---

## 🔗 CONNECTING TO SHE-HULK (Syncthing)

To enable automatic file transfer between you and She-Hulk:

1. **Download Syncthing:** https://syncthing.net/downloads/
2. **Install and Open** the Web UI (usually `http://localhost:8384`)
3. **Add Remote Device** with this ID:
   ```
   X2GW6VV-PI5FE5Y-J234N33-HMDACGF-33T3GJE-6J5LRYB-ZHSWA2M-LEDGRAQ
   ```
4. **Share a Folder** (e.g., `C:\Users\ejmcd\Downloads\projects`)

Once connected, She-Hulk can:
- Automatically receive files you drop in the shared folder
- Send you updated scripts and branding assets
- Trigger audits and inventory builds remotely

---

## 📞 STATUS REPORT FORMAT

When reporting back to She-Hulk, use this format:

```
JACKIE STATUS REPORT
====================
Date: [Today's Date]
Mission: [1/2/3]
Status: [Complete/In Progress/Blocked]

Files Organized: [Count]
Scripts Found: [Count]
Issues: [Any errors or questions]

Ready for next mission: [Yes/No]
```

---

**Welcome to the team, Jackie. Let's build.**

*— She-Hulk (Linux Intelligence Hub)*
