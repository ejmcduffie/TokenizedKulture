#!/usr/bin/env tsx
/**
 * Test Arweave Upload with Text File
 * 
 * This script:
 * 1. Checks your Arweave balance
 * 2. Uploads a test text file to Arweave via Irys
 * 3. Returns the permanent link
 * 
 * Run: npx tsx scripts/test-arweave-upload.ts
 */

import Irys from '@irys/sdk';
import fs from 'fs';
import path from 'path';

async function testArweaveUpload() {
    console.log('\n🧪 Testing Arweave Upload via Irys...\n');

    // Your Arweave wallet address from .env
    const walletAddress = process.env.ARWEAVE_WALLET_ADDRESS || 'zZPCcWEoscC7rSHEv9Nv1ZThnNXUk4VgCVbEPvqfNhQ';
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';

    try {
        // Initialize Irys client (using Solana devnet for payment)
        const irys = new Irys({
            url: 'https://devnet.irys.xyz', // Devnet node (free for testing)
            token: 'solana',
            key: process.env.SOLANA_PRIVATE_KEY, // Will use this once you add it
            config: {
                providerUrl: rpcUrl, // Use devnet RPC
            },
        });

        console.log('📍 Connected to Irys Devnet');
        console.log(`   Wallet: ${walletAddress}\n`);

        // Check balance
        const balance = await irys.getLoadedBalance();
        console.log(`💰 Irys Balance: ${irys.utils.fromAtomic(balance)} SOL\n`);

        // Create a test text file
        const testContent = `
🎨 Tokenized Kulture — Test Upload
═══════════════════════════════════

This is a test file uploaded to Arweave via Irys.

Timestamp: ${new Date().toISOString()}
Wallet: ${walletAddress}

Cultural Data:
- Platform: Tokenized Kulture
- Storage: Arweave (Permanent)
- Network: Devnet
- Purpose: NFT Metadata Test

This file will exist forever on the permaweb.
        `.trim();

        const testFilePath = path.join(process.cwd(), 'test-upload.txt');
        fs.writeFileSync(testFilePath, testContent);

        const fileSizeBytes = testContent.length;
        const fileSizeKB = (fileSizeBytes / 1024).toFixed(2);
        const isFree = fileSizeBytes <= 100 * 1024;

        console.log('📄 Test file created: test-upload.txt');
        console.log(`   Size: ${fileSizeBytes} bytes (${fileSizeKB} KB)`);
        console.log(`   ${isFree ? '✅ Within FREE 100 KB tier' : '⚠️  Exceeds free tier'}\n`);

        // Upload to Arweave
        console.log('⬆️  Uploading to Arweave...');
        const receipt = await irys.uploadFile(testFilePath, {
            tags: [
                { name: 'Content-Type', value: 'text/plain' },
                { name: 'App-Name', value: 'TokenizedKulture' },
                { name: 'Type', value: 'Test' },
                { name: 'Timestamp', value: new Date().toISOString() },
            ],
        });

        console.log('✅ Upload successful!\n');
        console.log(`📦 Transaction ID: ${receipt.id}`);
        console.log(`🔗 Permanent Link: https://arweave.net/${receipt.id}`);
        console.log(`🔗 Gateway Link: https://gateway.irys.xyz/${receipt.id}\n`);

        // Clean up test file
        fs.unlinkSync(testFilePath);
        console.log('🧹 Test file cleaned up\n');

        console.log('═'.repeat(60));
        console.log('✅ Arweave upload test PASSED');
        console.log('═'.repeat(60));

    } catch (error: any) {
        console.error('\n❌ Upload failed:', error.message);

        if (error.message.includes('SOLANA_PRIVATE_KEY')) {
            console.log('\n💡 TIP: Add your SOLANA_PRIVATE_KEY to .env first');
            console.log('   Follow the steps in the terminal to generate it.');
        }

        if (error.message.includes('Insufficient balance')) {
            console.log('\n💡 TIP: Fund your Irys account:');
            console.log('   npx @irys/sdk fund 100000 -n devnet -t solana -w <your-wallet.json>');
        }

        process.exit(1);
    }
}

testArweaveUpload();
