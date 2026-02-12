#!/bin/bash

# Tokenized Kulture — Local Test Script

set -e

echo "🧪 Tokenized Kulture — Local Testing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the TokenizeOurCulture root directory"
    exit 1
fi

# Step 1: Install frontend dependencies
echo ""
echo "📦 Step 1: Installing frontend dependencies..."
cd web
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed (skipping)"
fi

# Step 2: Run backend tests
echo ""
echo "🧪 Step 2: Running backend integration tests..."
cd ..
npx tsx tests/integration.test.ts

if [ $? -eq 0 ]; then
    echo "✅ All backend tests passed"
else
    echo "❌ Backend tests failed"
    exit 1
fi

# Step 3: Start frontend dev server
echo ""
echo "🚀 Step 3: Starting frontend dev server..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Frontend will start at: http://localhost:3000"
echo ""
echo "📋 Test checklist:"
echo "  1. Visit http://localhost:3000 (landing page)"
echo "  2. Click 'Trace Origins' → /wire (Kulture Wire)"
echo "  3. Paste any tweet ID and click 'Trace Origin'"
echo "  4. Click 'Explore Vault' → /contest (Vote Contest)"
echo "  5. Connect Phantom wallet (Devnet)"
echo "  6. Try voting for a video"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd web
npm run dev
