# 🚀 Getting Devnet SOL & Testing Uploads

## Prerequisites
- Solana CLI installed (`solana --version`)
- jq installed (`sudo apt install jq`)
- base58 encoder (`npm install -g base58-cli`)

---

## Part 1: Get Devnet SOL (Free)

### Step 1: Generate Keypair from Seed Phrase

```bash
# Create config directory
mkdir -p ~/.config/solana

# Recover keypair (will prompt for seed phrase)
solana-keygen recover 'prompt:?key=0/0' --outfile ~/.config/solana/devnet-wallet.json
```

**When prompted, enter your seed phrase:**
```
resist rough weapon lounge range shop gossip broken upset oppose quiz eight
```

### Step 2: Get Your Public Address

```bash
solana-keygen pubkey ~/.config/solana/devnet-wallet.json
```

**Copy the output** (your wallet address, e.g., `7xK...abc`)

### Step 3: Request Devnet SOL

```bash
# Set network to devnet
solana config set --url https://api.devnet.solana.com

# Request 2 SOL (repeat up to 5 times for 10 SOL total)
solana airdrop 2 $(solana-keygen pubkey ~/.config/solana/devnet-wallet.json)

# Check balance
solana balance $(solana-keygen pubkey ~/.config/solana/devnet-wallet.json)
```

You should see: `2 SOL` (or more if you ran airdrop multiple times)

### Step 4: Extract Private Key for `.env`

```bash
# Get base58 private key
solana-keygen export ~/.config/solana/devnet-wallet.json
```

**Copy the output** and add to your `.env`:

```bash
# Add this line to .env
SOLANA_PRIVATE_KEY=<paste_the_base58_key_here>
```

---

## Part 2: Test Arweave Upload

### Check if Irys SDK is installed

```bash
cd /home/supanegro/Documents/PROJECTS/TokenizeOurCulture
npm list @irys/sdk
```

If not installed:
```bash
npm install @irys/sdk
```

### Run the test upload script

```bash
npx tsx scripts/test-arweave-upload.ts
```

**Expected output:**
```
🧪 Testing Arweave Upload via Irys...

📍 Connected to Irys Devnet
   Wallet: zZPCcWEoscC7rSHEv9Nv1ZThnNXUk4VgCVbEPvqfNhQ

💰 Irys Balance: 0.1 SOL

📄 Test file created: test-upload.txt
   Size: 234 bytes (0.23 KB)
   ✅ Within FREE 100 KB tier

⬆️  Uploading to Arweave...
✅ Upload successful!

📦 Transaction ID: abc123...xyz
🔗 Permanent Link: https://arweave.net/abc123...xyz
🔗 Gateway Link: https://gateway.irys.xyz/abc123...xyz

🧹 Test file cleaned up

════════════════════════════════════════════════════════════
✅ Arweave upload test PASSED
════════════════════════════════════════════════════════════
```

### Arweave Storage Costs

| File Type | Size | Cost | Notes |
|---|---|---|---|
| **Text/JSON** | < 100 KB | **FREE** ✅ | Metadata, descriptions |
| **Small Image** | 50-100 KB | **FREE** ✅ | Thumbnails |
| **HD Video** | 10-100 MB | ~$0.01-0.10 | Compressed clips |
| **4K Video** | 500 MB - 2 GB | ~$0.50-2.00 | Full productions |

**For the hackathon:** Stick to text files and metadata (all FREE). For demo videos, use short compressed clips under 10 MB (~1 cent each).

### If you get "Insufficient balance" error

Fund your Irys account with Devnet SOL:

```bash
npx @irys/sdk fund 100000 -n devnet -t solana -w ~/.config/solana/devnet-wallet.json
```

This deposits 0.0001 SOL to Irys (enough for thousands of test uploads).

---

## Part 3: Verify Everything Works

### Run all tests

```bash
# Backend tests
npx tsx tests/integration.test.ts
npx tsx tests/nft-market.test.ts
npx tsx tests/functional-test.ts

# Start dev server
cd web
npm run dev
```

Visit `http://localhost:3000` and try:
1. **Vault** → Upload a video (will use real Arweave)
2. **Market** → Mint an NFT (will create real SPL token)
3. **Contest** → Vote (will cost 0.0009 Devnet SOL)

---

## Troubleshooting

### "solana-keygen: command not found"
Install Solana CLI:
```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

### "base58: command not found"
```bash
npm install -g base58-cli
```

### "Insufficient balance" on Irys
```bash
# Check Irys balance
npx @irys/sdk balance <your-wallet-address> -n devnet -t solana

# Fund it
npx @irys/sdk fund 100000 -n devnet -t solana -w ~/.config/solana/devnet-wallet.json
```

### Devnet faucet rate limit
If you hit the rate limit, use alternative faucets:
- https://faucet.solana.com
- https://solfaucet.com

---

## Summary

✅ **Devnet SOL**: Free from faucets, used for transactions  
✅ **Arweave/Irys**: Free $100k credits (check with hackathon organizers)  
✅ **Test File**: Uploads a text file to verify everything works  
✅ **Security**: Private key never shown in terminal logs  

Once you complete these steps, the platform will work with **real blockchain transactions** instead of demo mode!
