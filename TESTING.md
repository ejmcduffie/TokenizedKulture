# 🧪 Local Testing Guide

## Step 1: Install Frontend Dependencies

```bash
cd web
npm install
```

This will install:
- Next.js 14
- Solana Wallet Adapter
- TailwindCSS
- Lucide React icons
- All other dependencies

## Step 2: Start Development Server

```bash
npm run dev
```

The app will start at **http://localhost:3000**

## Step 3: Test Each Page

### Landing Page (`/`)
- ✅ Hero section with gradient text
- ✅ Three-pillar cards (hover effects)
- ✅ Stats section

### Kulture Wire (`/wire`)
- ✅ Search bar (paste any tweet ID or URL)
- ✅ Origin verification badge
- ✅ Thread timeline with engagement metrics
- ✅ Fact-check summary (Snopes-style)

**Test with:** Any tweet ID (e.g., `1234567890`)
- The demo API will return mock data

### Vote Contest (`/contest`)
- ✅ Connect wallet button (Phantom/Solflare)
- ✅ Leaderboard with mock videos
- ✅ Vote button (0.0009 SOL)
- ✅ Prize pool tracker

**To test voting:**
1. Install Phantom wallet extension
2. Switch to Devnet
3. Get devnet SOL from faucet: https://faucet.solana.com
4. Connect wallet
5. Click "Vote"

## Step 4: Test Backend Integration (Optional)

In a separate terminal:

```bash
# Start the backend agent
npm run dev
```

This starts the agent at **http://localhost:3001** (or whatever port is configured).

The frontend API routes will proxy to this backend.

## Step 5: Check for Errors

Open browser console (F12) and check for:
- ❌ Network errors
- ❌ TypeScript errors
- ❌ Wallet connection issues

## Common Issues

### "Cannot find module 'next'"
```bash
cd web
rm -rf node_modules package-lock.json
npm install
```

### Wallet won't connect
- Make sure Phantom is installed
- Switch to Devnet in wallet settings
- Refresh the page

### Port 3000 already in use
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

## Next: Deploy to VPS

Once local testing passes, see `DEPLOYMENT.md` for VPS deployment.
