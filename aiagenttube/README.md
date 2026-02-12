# 📺 aiagenttube: YouTube AI Agent with Embedded Shot Metadata

## 🎯 Overview
This module isolates the YouTube automation and AI production logic from the TokenizeOurCulture codebase. It focuses on the **Digital Griot** and **She-Hulk/Jackie** node interaction, specifically designed for autonomous video generation with embedded camera shot metadata.

## 🧠 AI Learning via Metadata
The core of this "aspect" is the **Production Manifest** system. These manifests serve as the training/instructional data for generative AI (Runway Gen-3 Alpha, Veo), ensuring the agent "learns" cinematic consistency.

### Key Metadata Fields:
- **Type**: Categorizes the shot (UI, Abstract, Character, Macro).
- **Visual**: Descriptive prompt for visual grounding.
- **Gen-3 Prompt**: Optimized prompt for temporal consistency.
- **Motion Metadata**: Explicitly maps camera movements (Pan, Zoom, Orbit, Truck) with intensity levels.

## 🏗️ Folder Structure
- **`/manifests`**: Contains the `runway_gen3_manifest.md` and `video_production_strategy_333.md`. These contain the rich metadata pairing shots with specific AI prompts.
- **`/logic`**: Contains `she_hulk_automator.ps1`, which orchestrates the batch branding and prepares files for the YouTube pipeline.
- **`/docs`**: Contains operational briefings like `JACKIE_BRIEFING.md` which define the cinematic "Tech-Noir" style guidelines.

## 🚀 Hackathon Alignment
This sub-project demonstrates **Autonomous Content Creation**. By embedding metadata directly into the generation manifests, the agent can recursively improve its shot selection based on performance metrics (e.g., higher engagement on "Macro" shots vs "Wide" shots).

---
*Built for the Solana AI Agent Hackathon 2026*
