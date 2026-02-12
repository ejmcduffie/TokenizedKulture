import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { listingId, buyer } = await request.json()

        if (!listingId || !buyer) {
            return NextResponse.json(
                { error: 'Missing required fields: listingId, buyer' },
                { status: 400 }
            )
        }

        // In production: execute on-chain escrow transfer
        // For hackathon: simulate purchase

        // Simulate fee breakdown (5% royalty, 2.5% platform)
        const mockPriceLamports = 2_500_000_000 // placeholder
        const royaltyLamports = Math.floor(mockPriceLamports * 500 / 10000)
        const platformFeeLamports = Math.floor(mockPriceLamports * 250 / 10000)

        const receipt = {
            listingId,
            mintAddress: `KultureNFT_purchased_${Date.now()}`,
            buyer,
            seller: 'demo_seller_wallet',
            priceLamports: mockPriceLamports,
            priceSol: mockPriceLamports / 1e9,
            royaltyLamports,
            platformFeeLamports,
            sellerReceives: mockPriceLamports - royaltyLamports - platformFeeLamports,
            transactionSignature: `purchase_${Date.now()}_${buyer.slice(0, 8)}`,
            timestamp: new Date().toISOString(),
        }

        return NextResponse.json({
            success: true,
            receipt,
        })
    } catch (error) {
        console.error('Purchase error:', error)
        return NextResponse.json({ error: 'Failed to purchase NFT' }, { status: 500 })
    }
}
