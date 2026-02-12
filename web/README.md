# Tokenized Kulture — Frontend

Premium Next.js 14 web app with Solana wallet integration.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
NEXT_PUBLIC_ARWEAVE_GATEWAY=https://arweave.net
BACKEND_URL=http://localhost:3001
```

## Features

### 🎬 AI Video Vault (`/vault`)
- Upload videos with cinematic metadata
- View Kulture Points leaderboard
- Arweave permanent storage links

### 📰 Kulture Wire (`/wire`)
- Snopes-style fact-checking UI
- Trace viral tweets to origin threads
- Permanent archival verification badges

### 🏆 Vote Contest (`/contest`)
- Leaderboard with live vote counts
- Phantom/Solflare wallet integration
- Prize pool tracker

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS + custom glassmorphism utilities
- **Wallet:** Solana Wallet Adapter
- **Icons:** Lucide React
- **Fonts:** Inter + Outfit (Google Fonts)

## Design System

### Colors
- `kulture-gold`: #D4AF37
- `kulture-emerald`: #50C878
- `kulture-noir`: #0A0A0A
- `kulture-slate`: #1E293B

### Utilities
- `.glass-panel` — glassmorphism effect
- `.text-gradient` — gold-to-emerald gradient text
- `.glow-gold` / `.glow-emerald` — glow effects

## Deployment

See `../DEPLOYMENT.md` for VPS deployment instructions.

For Vercel/Netlify:
```bash
npm run build
# Deploy the .next folder
```
