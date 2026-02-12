# Video Production Strategy (3:33 Explainer)

This document consolidates the production plan, asset inventory, and narratives for the 3:33 minute explainer videos for the Blexicon Project and My Block Roots.

## 1. Project Overview
- **Duration**: 213 seconds (3:33).
- **Core Strategy**: Utilize high-fidelity AI-generated assets and automated compositing via the Clawdbot agent system.
- **Branding**: "Expert Mode" aesthetic with cinematic heritage and emerald-tech fusion.

## 2. Production Plans

### A. The Blexicon Vision (Option B - Static Frame)
- **Voiceover**: Female (authoritative, authoritative).
- **Music**: Afrofuturist, rhythmic.
- **Workflow**: Midjourney/Flux static frames + After Effects Ken Burns automation.
- **Automation**: `blexicon_ae_automation.jsx` sequences 21 assets into 17 scenes.

### B. My Block Roots: Own Your Heritage (Option A - Full Animation)
- **Voiceover**: Male ("Leroy" persona).
- **Music**: Cinematic heritage.
- **Workflow**: Runway Gen-3 + Veo 3 overlays + After Effects.
- **Mascot**: Includes the "Leroy" persona and the History Block Cube product reveal.

## 3. Asset Inventory

### Character Reference Sheets
- **Dr. Amina Harris (BLX)**: `dr_amina_reference_1769638936150.png`
- **Amara Thompson (MBR)**: `amara_character_reference_1769638891906.png`
- **Grandma Rose Thompson (MBR)**: `grand Rose_reference_1769638921007.png`

### Environments & Hero Products
- **Metabolic City Aerial**: `metabolic_city_aerial_1769639018469.png`
- **History Block Cube**: `history_block_cube_1769639004784.png` (MBR hero reveal).
- **Agrivoltaic Farm**: `agrivoltaic_farm_scene_1769639033489.png`

### Forensic Remediation Status (Jan 31, 2026)
- **Objective**: Identification and remediation of NotebookLM-generated assets (removing watermarks/credits).
- **Total Count**: 52 assets identified (48 BLX, 4 MBR).
- **Sample PoC**: `The_Trust_Machine.mp4` (BLX) and `The_Heritage_Protocol.mp4` (MBR) are undergoing processing on the Jackie node.

## 4. Scene Manifests & Automation Logic
Production follows a structured 3-act narrative (Disconnect -> Awakening -> Legacy). The `Clawdbot` agent handles:
1.  **Batch Generation**: Based on Runway/Midjourney manifests.
2.  **Compositing**: Automatic composition setup in Adobe After Effects.
3.  **Remediation**: FFmpeg-based masking and priority rendering on the Windows 11 Jackie node.

---
*Status: Portfolio Consolidated for Scale (Jan 31, 2026)*
