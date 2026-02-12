import { NextRequest, NextResponse } from 'next/server'

// Mock data for hackathon demo
const mockVideos = [
    {
        title: 'The 1870 Brick Wall',
        creator: 'creator_alice',
        durationSeconds: 213,
        arweaveTxId: 'demo_tx_001',
        kulturePoints: 66,
        votes: 127,
        uploadedAt: '2026-02-01T12:00:00Z',
    },
    {
        title: 'Digital Griot Awakening',
        creator: 'creator_bob',
        durationSeconds: 180,
        arweaveTxId: 'demo_tx_002',
        kulturePoints: 54,
        votes: 89,
        uploadedAt: '2026-02-03T15:30:00Z',
    },
    {
        title: 'The Heritage Protocol',
        creator: 'creator_carol',
        durationSeconds: 240,
        arweaveTxId: 'demo_tx_003',
        kulturePoints: 72,
        votes: 45,
        uploadedAt: '2026-02-05T09:15:00Z',
    },
]

export async function GET() {
    // In production: fetch from your backend service
    const prizePoolSol = mockVideos.reduce((sum, v) => sum + v.votes * 0.0009, 0)

    return NextResponse.json({
        videos: mockVideos.sort((a, b) => b.votes - a.votes),
        prizePoolSol,
    })
}
