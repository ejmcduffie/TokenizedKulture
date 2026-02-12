#!/bin/bash

# Quick backend-only test (no frontend dependencies needed)

set -e

echo "🧪 Testing Backend Only..."
echo ""

cd /home/supanegro/Documents/PROJECTS/TokenizeOurCulture

# Run integration tests
npx tsx tests/integration.test.ts

echo ""
echo "✅ Backend tests complete!"
echo ""
echo "To test the frontend:"
echo "  cd web"
echo "  npm install  # (currently running...)"
echo "  npm run dev"
