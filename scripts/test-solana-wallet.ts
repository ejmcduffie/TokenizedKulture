#!/usr/bin/env tsx
/**
 * Simple Solana Wallet Test
 * 
 * This script tests your Solana wallet connection and balance.
 * Run: npx tsx scripts/test-solana-wallet.ts
 */

import { config } from 'dotenv';
config(); // Load .env file

import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';

async function testSolanaWallet() {
    console.log('\n🧪 Testing Solana Wallet Connection...\n');

    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    const privateKeyBase58 = process.env.SOLANA_PRIVATE_KEY;

    if (!privateKeyBase58) {
        console.error('❌ SOLANA_PRIVATE_KEY not found in .env');
        console.log('\n💡 Add your private key to .env:');
        console.log('   SOLANA_PRIVATE_KEY=your_base58_key_here\n');
        process.exit(1);
    }

    try {
        // Decode the private key
        const privateKeyBytes = bs58.decode(privateKeyBase58);
        const keypair = Keypair.fromSecretKey(privateKeyBytes);
        const publicKey = keypair.publicKey;

        console.log('✅ Wallet loaded successfully');
        console.log(`   Public Key: ${publicKey.toBase58()}\n`);

        // Connect to Solana
        const connection = new Connection(rpcUrl, 'confirmed');
        console.log(`📡 Connected to: ${rpcUrl}`);

        // Get network version to verify connection
        const version = await connection.getVersion();
        console.log(`   Solana Version: ${version['solana-core']}\n`);

        // Get balance
        const balance = await connection.getBalance(publicKey);
        const balanceSOL = balance / LAMPORTS_PER_SOL;

        console.log('💰 Wallet Balance:');
        console.log(`   ${balance} lamports`);
        console.log(`   ${balanceSOL.toFixed(4)} SOL\n`);

        if (balance === 0) {
            console.log('⚠️  Your wallet has 0 SOL');
            console.log('\n💡 Get Devnet SOL from the faucet:');
            console.log(`   solana airdrop 2 ${publicKey.toBase58()}\n`);
        } else {
            console.log('✅ Wallet is funded and ready to use!\n');
        }

        // Test a simple transaction (get recent blockhash)
        const { blockhash } = await connection.getLatestBlockhash();
        console.log('🔗 Latest Blockhash:');
        console.log(`   ${blockhash.slice(0, 20)}...\n`);

        console.log('═'.repeat(60));
        console.log('✅ Solana wallet test PASSED');
        console.log('═'.repeat(60));
        console.log('\n🎉 Your wallet is ready for:');
        console.log('   • Minting NFTs');
        console.log('   • Voting in contests');
        console.log('   • Uploading to Arweave (via Irys)\n');

    } catch (error: any) {
        console.error('\n❌ Test failed:', error.message);

        if (error.message.includes('Invalid base58')) {
            console.log('\n💡 TIP: Check that your SOLANA_PRIVATE_KEY is in base58 format');
            console.log('   Run: solana-keygen export ~/.config/solana/devnet-wallet.json');
        }

        process.exit(1);
    }
}

testSolanaWallet();
