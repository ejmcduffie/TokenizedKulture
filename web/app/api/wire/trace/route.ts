import { NextRequest, NextResponse } from 'next/server'

// This API route will call your backend service
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const tweetId = searchParams.get('tweetId')

    if (!tweetId) {
        return NextResponse.json({ error: 'Missing tweetId' }, { status: 400 })
    }

    try {
        // Call your backend Kulture Wire service
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
        const response = await fetch(`${backendUrl}/api/wire/trace/${tweetId}`)
        const data = await response.json()

        return NextResponse.json(data)
    } catch (error) {
        console.error('Wire trace error:', error)

        // Return demo data for hackathon
        return NextResponse.json({
            report: {
                eventTitle: 'The revolution will be tokenized. When cultural moments go viral...',
                originPostId: tweetId,
                originAuthor: 'demo_author',
                originTimestamp: '2026-02-10T14:30:00.000Z',
                platform: 'x',
                culturalTags: ['#tokenizedkulture', '#solana', '#culturalai'],
                strandCount: 4,
                strands: [
                    {
                        postId: 'strand_1',
                        author: '@culture_watcher',
                        text: 'This is exactly what we need. Culture has always been the first currency.',
                        timestamp: '2026-02-10T14:35:00.000Z',
                        engagement: { likes: 234, retweets: 45, replies: 12 },
                    },
                    {
                        postId: 'strand_2',
                        author: '@digital_griot',
                        text: 'The elders told stories around fire. We tell them on-chain. Same energy, different medium. 🔥',
                        timestamp: '2026-02-10T14:42:00.000Z',
                        engagement: { likes: 567, retweets: 123, replies: 34 },
                    },
                    {
                        postId: 'strand_3',
                        author: '@web3_builder',
                        text: 'Built on @solana for speed. Stored on @ArweaveTeam for permanence. This is how you preserve culture.',
                        timestamp: '2026-02-10T15:01:00.000Z',
                        engagement: { likes: 189, retweets: 67, replies: 8 },
                    },
                    {
                        postId: 'strand_4',
                        author: '@heritage_keeper',
                        text: 'Every viral moment has an origin. Every origin has a community. Every community deserves credit.',
                        timestamp: '2026-02-10T15:15:00.000Z',
                        engagement: { likes: 412, retweets: 98, replies: 22 },
                    },
                ],
                arweaveTxId: 'demo_arweave_tx_' + tweetId.slice(0, 8),
            },
        })
    }
}
