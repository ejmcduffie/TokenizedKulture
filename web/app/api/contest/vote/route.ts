import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { videoId, voter } = await request.json()

        if (!videoId || !voter) {
            return NextResponse.json({ error: 'Missing videoId or voter' }, { status: 400 })
        }

        // In production: create Solana transaction and send to backend
        // For hackathon: simulate vote
        const receipt = {
            voter,
            videoId,
            costLamports: 900000, // 0.0009 SOL
            timestamp: new Date().toISOString(),
            transactionSignature: `vote_${Date.now()}_${voter.slice(0, 8)}`,
        }

        return NextResponse.json({
            success: true,
            receipt,
        })
    } catch (error) {
        console.error('Vote error:', error)
        return NextResponse.json({ error: 'Failed to process vote' }, { status: 500 })
    }
}
