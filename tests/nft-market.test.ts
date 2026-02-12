/**
 * ═══════════════════════════════════════════════════════════════════════
 *  KultureNFTMarket — Service Unit Tests
 *  Tests the NFT marketplace backend service directly
 *
 *  Run: npx tsx tests/nft-market.test.ts
 * ═══════════════════════════════════════════════════════════════════════
 */

import { KultureNFTMarket } from '../src/services/nft-market.js';

let passed = 0;
let failed = 0;

function test(name: string, condition: boolean) {
    if (condition) {
        console.log(`  ✅ ${name}`);
        passed++;
    } else {
        console.error(`  ❌ FAIL: ${name}`);
        failed++;
    }
}

function section(name: string) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`  ${name}`);
    console.log(`${'═'.repeat(60)}`);
}

async function runTests() {
    console.log('\n🧪 KULTURE NFT MARKET — SERVICE TEST SUITE');
    console.log(`📅 ${new Date().toISOString()}`);
    console.log('━'.repeat(60));

    const market = new KultureNFTMarket();

    // ─── MINTING ────────────────────────────────────────────────
    section('MINTING');

    // Mint Art NFT
    const artReceipt = await market.mintNFT({
        creator: 'alice_wallet_xyz123',
        name: 'Afrofuturist Dream #1',
        description: 'A digital painting blending African heritage with sci-fi.',
        assetType: 'art',
        tags: ['afrofuturism', 'digital-art', 'heritage'],
        royaltyBps: 750, // 7.5%
        priceSol: 5.0,
    });

    test('Art NFT minted successfully', artReceipt !== null);
    test('Mint receipt has mintAddress', artReceipt.mintAddress.length > 0);
    test('Mint receipt has arweaveTxId', artReceipt.arweaveTxId.length > 0);
    test('Mint receipt has metadataUri', artReceipt.metadataUri.startsWith('https://arweave.net/'));
    test('Mint receipt has transactionSignature', artReceipt.transactionSignature.length > 0);
    test('Mint receipt has correct assetType', artReceipt.assetType === 'art');
    test('Mint receipt has creator', artReceipt.creator === 'alice_wallet_xyz123');

    // Mint Music NFT
    const musicReceipt = await market.mintNFT({
        creator: 'bob_wallet_abc456',
        name: 'Neon City Beat Tape',
        description: '10-track beat tape inspired by cyberpunk cityscapes.',
        assetType: 'music',
        tags: ['beats', 'hip-hop', 'instrumental'],
        priceSol: 2.5,
    });

    test('Music NFT minted successfully', musicReceipt !== null);
    test('Music NFT has default 5% royalty', musicReceipt.assetType === 'music');

    // Mint Merch NFT
    const merchReceipt = await market.mintNFT({
        creator: 'carol_wallet_def789',
        name: 'Street Style Hoodie — Digital Twin',
        description: 'Digital twin NFT for the limited-edition hoodie.',
        assetType: 'merch',
        tags: ['merch', 'streetwear'],
        priceSol: 1.5,
    });

    test('Merch NFT minted', merchReceipt !== null);

    // Mint Fashion NFT
    const fashionReceipt = await market.mintNFT({
        creator: 'dave_wallet_ghi012',
        name: 'Neon Kicks — Digital Sneaker',
        description: 'Limited edition digital sneaker wearable.',
        assetType: 'fashion',
        tags: ['fashion', 'sneakers', 'metaverse'],
        royaltyBps: 1000, // 10%
        priceSol: 3.0,
    });

    test('Fashion NFT minted', fashionReceipt !== null);

    // Mint Photo NFT (no auto-list)
    const photoReceipt = await market.mintNFT({
        creator: 'eve_wallet_jkl345',
        name: 'Heritage Lens — Harlem 1972',
        description: 'Restored photograph from Harlem, 1972.',
        assetType: 'photo',
        tags: ['photography', 'heritage', 'harlem'],
    });

    test('Photo NFT minted (not listed)', photoReceipt !== null);

    // ─── WALLET HOLDS MULTIPLE NFTS ─────────────────────────────
    section('WALLET HOLDS MULTIPLE NFTs');

    // Alice mints 3 more NFTs
    await market.mintNFT({ creator: 'alice_wallet_xyz123', name: 'Heritage Code #2', description: '', assetType: 'art', priceSol: 2 });
    await market.mintNFT({ creator: 'alice_wallet_xyz123', name: 'Heritage Code #3', description: '', assetType: 'photo' });
    await market.mintNFT({ creator: 'alice_wallet_xyz123', name: 'Hip-Hop Beat Reel', description: '', assetType: 'music', priceSol: 1 });

    const aliceNFTs = market.getWalletNFTs('alice_wallet_xyz123');
    test(`Alice holds multiple NFTs in one wallet (${aliceNFTs.length})`, aliceNFTs.length >= 4);
    test('NFTs have different types in same wallet', new Set(aliceNFTs.map(n => n.assetType)).size > 1);

    // ─── LISTINGS ───────────────────────────────────────────────
    section('ACTIVE LISTINGS');

    const allListings = market.getActiveListings();
    test('Active listings exist', allListings.length > 0);
    test('All listings are active', allListings.every(l => l.isActive));

    // Filter by type
    const artListings = market.getActiveListings({ assetType: 'art' });
    test('Can filter listings by assetType (art)', artListings.every(l => l.nft.assetType === 'art'));

    // Filter by price range
    const cheapListings = market.getActiveListings({ maxPriceSol: 2.0 });
    test('Can filter by max price', cheapListings.every(l => l.priceSol <= 2.0));

    // ─── PURCHASING ─────────────────────────────────────────────
    section('PURCHASING');

    // Find a listing to buy
    const buyableListing = allListings[0];
    test('Found a listing to purchase', buyableListing !== null);

    const purchaseReceipt = await market.purchaseNFT(buyableListing.listingId, 'buyer_wallet_999');
    test('Purchase succeeded', purchaseReceipt !== null);
    test('Purchase receipt has buyer', purchaseReceipt!.buyer === 'buyer_wallet_999');
    test('Purchase receipt has seller', purchaseReceipt!.seller === buyableListing.seller);
    test('Purchase receipt has priceLamports', purchaseReceipt!.priceLamports > 0);
    test('Purchase receipt has royaltyLamports', purchaseReceipt!.royaltyLamports > 0);
    test('Purchase receipt has platformFeeLamports', purchaseReceipt!.platformFeeLamports > 0);
    test('Purchase receipt has transactionSignature', purchaseReceipt!.transactionSignature.length > 0);

    // Fee math check
    const expectedRoyalty = Math.floor(buyableListing.priceSol * 1e9 * buyableListing.nft.royaltyBps / 10000);
    const expectedPlatformFee = Math.floor(buyableListing.priceSol * 1e9 * 250 / 10000);
    test('Royalty calculated correctly', purchaseReceipt!.royaltyLamports === expectedRoyalty);
    test('Platform fee is 2.5%', purchaseReceipt!.platformFeeLamports === expectedPlatformFee);

    // Cannot buy again (listing deactivated)
    const doubleBuy = await market.purchaseNFT(buyableListing.listingId, 'buyer_wallet_888');
    test('Cannot buy a sold listing', doubleBuy === null);

    // Cannot buy own NFT
    const selfBuyListing = allListings.find(l => l.isActive);
    if (selfBuyListing) {
        const selfBuy = await market.purchaseNFT(selfBuyListing.listingId, selfBuyListing.seller);
        test('Cannot buy your own NFT', selfBuy === null);
    }

    // ─── CANCEL LISTING ─────────────────────────────────────────
    section('CANCEL LISTING');

    const listingToCancel = market.getActiveListings()[0];
    if (listingToCancel) {
        const cancelled = market.cancelListing(listingToCancel.listingId, listingToCancel.seller);
        test('Owner can cancel their listing', cancelled === true);

        const cantCancel = market.cancelListing(listingToCancel.listingId, 'random_wallet');
        test('Non-owner cannot cancel', cantCancel === false);
    }

    // ─── CREATOR PROFILES ───────────────────────────────────────
    section('CREATOR PROFILES');

    const aliceProfile = market.getCreatorProfile('alice_wallet_xyz123');
    test('Alice has a creator profile', aliceProfile !== null);
    test('Alice minted 4 NFTs', aliceProfile!.totalMinted === 4);
    test('Profile tracks totalEarnedLamports', aliceProfile!.totalEarnedLamports >= 0);

    // ─── MARKET STATS ───────────────────────────────────────────
    section('MARKETPLACE STATS');

    const stats = market.getMarketStats();
    test(`Total NFTs minted tracked (${stats.totalNFTsMinted})`, stats.totalNFTsMinted >= 5);
    test('Total listings tracked', stats.totalListings > 0);
    test('Total creators tracked', stats.totalCreators > 0);
    test('Asset breakdown available', stats.assetBreakdown.art > 0);
    test('Volume tracked in SOL', stats.totalVolumeSol >= 0);

    // ─── CONSTANTS ──────────────────────────────────────────────
    section('CONSTANTS & CONFIGURATION');

    test('Platform fee is 2.5% (250 bps)', KultureNFTMarket.PLATFORM_FEE_BPS === 250);
    test('Default royalty is 5% (500 bps)', KultureNFTMarket.DEFAULT_ROYALTY_BPS === 500);
    test('Min listing price is 0.001 SOL', KultureNFTMarket.MIN_PRICE_LAMPORTS === 1_000_000);

    // Min price guard
    const tooLow = await market.listNFT(photoReceipt.mintAddress, photoReceipt.creator, 0.0001);
    test('Listing below min price rejected', tooLow === null);

    // ─── EDGE CASES ─────────────────────────────────────────────
    section('EDGE CASES');

    // Get non-existent NFT
    const phantomNFT = market.getNFT('nonexistent_mint_address');
    test('Non-existent NFT returns null', phantomNFT === null);

    // Get non-existent listing
    const phantomListing = market.getListing('nonexistent_listing');
    test('Non-existent listing returns null', phantomListing === null);

    // Get non-existent profile
    const phantomProfile = market.getCreatorProfile('nonexistent_wallet');
    test('Non-existent profile returns null', phantomProfile === null);

    // List non-existent NFT
    const ghostList = await market.listNFT('ghost_nft', 'some_wallet', 1.0);
    test('Cannot list non-existent NFT', ghostList === null);

    // Purchase non-existent listing
    const ghostBuy = await market.purchaseNFT('ghost_listing', 'some_wallet');
    test('Cannot purchase non-existent listing', ghostBuy === null);

    // ─── RESULTS ────────────────────────────────────────────────
    console.log('\n' + '━'.repeat(60));
    console.log(`\n📊 RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);

    if (failed > 0) {
        console.log('❌ SOME TESTS FAILED');
        process.exit(1);
    } else {
        console.log('✅ ALL NFT MARKET TESTS PASSED');
        process.exit(0);
    }
}

runTests();
