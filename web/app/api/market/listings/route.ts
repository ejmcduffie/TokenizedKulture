import { NextRequest, NextResponse } from 'next/server'

// Mock marketplace listings for hackathon demo
const mockListings = [
    {
        listingId: 'listing_demo_001',
        mintAddress: 'KultureNFT_NeonCityBeatTape_001',
        seller: 'CyberArtist_wallet_abc123',
        priceLamports: 2_500_000_000,
        priceSol: 2.5,
        isActive: true,
        listedAt: '2026-02-08T10:00:00Z',
        nft: {
            mintAddress: 'KultureNFT_NeonCityBeatTape_001',
            name: 'Neon City Beat Tape',
            description: 'A 10-track beat tape inspired by cyberpunk cityscapes and neon-lit alleyways.',
            assetType: 'music',
            creator: 'CyberArtist_wallet_abc123',
            assetUri: 'https://arweave.net/demo_beat_tape_asset',
            royaltyBps: 500,
            tags: ['beats', 'cyberpunk', 'hip-hop', 'instrumental'],
            mintedAt: '2026-02-08T09:45:00Z',
        },
    },
    {
        listingId: 'listing_demo_002',
        mintAddress: 'KultureNFT_AfrofuturistDream_002',
        seller: 'DigitalGriot_wallet_def456',
        priceLamports: 5_000_000_000,
        priceSol: 5.0,
        isActive: true,
        listedAt: '2026-02-09T14:30:00Z',
        nft: {
            mintAddress: 'KultureNFT_AfrofuturistDream_002',
            name: 'Afrofuturist Dream #1',
            description: 'A digital artwork blending African heritage with futuristic sci-fi aesthetics.',
            assetType: 'art',
            creator: 'DigitalGriot_wallet_def456',
            assetUri: 'https://arweave.net/demo_afrofuturist_art',
            royaltyBps: 750,
            tags: ['afrofuturism', 'digital-art', 'heritage', 'sci-fi'],
            mintedAt: '2026-02-09T14:00:00Z',
        },
    },
    {
        listingId: 'listing_demo_003',
        mintAddress: 'KultureNFT_StreetStyleHoodie_003',
        seller: 'FashionDAO_wallet_ghi789',
        priceLamports: 1_500_000_000,
        priceSol: 1.5,
        isActive: true,
        listedAt: '2026-02-10T08:15:00Z',
        nft: {
            mintAddress: 'KultureNFT_StreetStyleHoodie_003',
            name: 'Street Style Hoodie — Digital Twin',
            description: 'Digital twin NFT for the limited-edition Street Style hoodie. Holders get the physical item shipped.',
            assetType: 'merch',
            creator: 'FashionDAO_wallet_ghi789',
            assetUri: 'https://arweave.net/demo_hoodie_merch',
            royaltyBps: 500,
            tags: ['merch', 'streetwear', 'fashion', 'physical-digital'],
            mintedAt: '2026-02-10T08:00:00Z',
        },
    },
    {
        listingId: 'listing_demo_004',
        mintAddress: 'KultureNFT_HeritageLens_004',
        seller: 'PhotoGrapher_wallet_jkl012',
        priceLamports: 800_000_000,
        priceSol: 0.8,
        isActive: true,
        listedAt: '2026-02-11T16:45:00Z',
        nft: {
            mintAddress: 'KultureNFT_HeritageLens_004',
            name: 'Heritage Lens — Harlem 1972',
            description: 'Restored photograph from Harlem, 1972. Digitized and preserved permanently on chain.',
            assetType: 'photo',
            creator: 'PhotoGrapher_wallet_jkl012',
            assetUri: 'https://arweave.net/demo_harlem_photo',
            royaltyBps: 500,
            tags: ['photography', 'heritage', 'harlem', 'historical'],
            mintedAt: '2026-02-11T16:30:00Z',
        },
    },
    {
        listingId: 'listing_demo_005',
        mintAddress: 'KultureNFT_NeonKicks_005',
        seller: 'FashionDAO_wallet_ghi789',
        priceLamports: 3_000_000_000,
        priceSol: 3.0,
        isActive: true,
        listedAt: '2026-02-12T06:00:00Z',
        nft: {
            mintAddress: 'KultureNFT_NeonKicks_005',
            name: 'Neon Kicks — Digital Sneaker',
            description: 'Limited edition digital sneaker. Wearable in the metaverse, collectible on-chain.',
            assetType: 'fashion',
            creator: 'FashionDAO_wallet_ghi789',
            assetUri: 'https://arweave.net/demo_neon_kicks',
            royaltyBps: 1000,
            tags: ['fashion', 'sneakers', 'metaverse', 'wearable', 'limited-edition'],
            mintedAt: '2026-02-12T05:45:00Z',
        },
    },
]

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const assetType = searchParams.get('assetType')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    let filtered = mockListings.filter(l => l.isActive)

    if (assetType) {
        filtered = filtered.filter(l => l.nft.assetType === assetType)
    }
    if (minPrice) {
        filtered = filtered.filter(l => l.priceSol >= parseFloat(minPrice))
    }
    if (maxPrice) {
        filtered = filtered.filter(l => l.priceSol <= parseFloat(maxPrice))
    }

    return NextResponse.json({
        listings: filtered,
        total: filtered.length,
        stats: {
            totalNFTsMinted: mockListings.length + 12, // show more than listed
            activeListings: filtered.length,
            totalVolumeSol: 42.5,
            totalCreators: 8,
        },
    })
}
