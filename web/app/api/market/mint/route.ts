import { NextRequest, NextResponse } from 'next/server'

// In production: import KultureNFTMarket and use a singleton
// For hackathon: inline mock minting logic

let mintCounter = 0

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, description, assetType, creator, tags, royaltyBps, priceSol } = body

        if (!name || !assetType || !creator) {
            return NextResponse.json(
                { error: 'Missing required fields: name, assetType, creator' },
                { status: 400 }
            )
        }

        const validTypes = ['art', 'music', 'photo', 'merch', 'fashion', 'video']
        if (!validTypes.includes(assetType)) {
            return NextResponse.json(
                { error: `Invalid assetType. Must be one of: ${validTypes.join(', ')}` },
                { status: 400 }
            )
        }

        mintCounter++

        // Simulate Arweave upload + Metaplex mint
        const mintAddress = `Kulture${Buffer.from(`${name}_${creator}_${Date.now()}`).toString('base64url').slice(0, 32)}`
        const arweaveTxId = `ar_${Buffer.from(`asset_${name}_${mintCounter}`).toString('base64url').slice(0, 43)}`
        const metadataUri = `https://arweave.net/${arweaveTxId}`

        const receipt = {
            mintAddress,
            creator,
            assetType,
            name,
            description: description || '',
            arweaveTxId,
            metadataUri,
            royaltyBps: royaltyBps || 500, // 5% default
            tags: tags || [],
            transactionSignature: `mint_${Date.now()}_${creator.slice(0, 8)}`,
            timestamp: new Date().toISOString(),
        }

        // If price specified, auto-create listing
        let listing = null
        if (priceSol && priceSol > 0) {
            listing = {
                listingId: `listing_${Date.now()}_${mintAddress.slice(0, 8)}`,
                mintAddress,
                seller: creator,
                priceLamports: Math.floor(priceSol * 1e9),
                priceSol,
                isActive: true,
                listedAt: new Date().toISOString(),
            }
        }

        return NextResponse.json({
            success: true,
            receipt,
            listing,
        })
    } catch (error) {
        console.error('Mint error:', error)
        return NextResponse.json({ error: 'Failed to mint NFT' }, { status: 500 })
    }
}
