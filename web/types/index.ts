export interface WireReport {
    eventTitle: string
    originPostId: string
    originAuthor: string
    originTimestamp: string
    platform: 'x' | 'twitter'
    culturalTags: string[]
    strandCount: number
    strands: WireStrand[]
    arweaveTxId?: string
}

export interface WireStrand {
    postId: string
    author: string
    text: string
    timestamp: string
    engagement: {
        likes: number
        retweets: number
        replies: number
    }
}

export interface VideoMetadata {
    title: string
    creator: string
    durationSeconds: number
    arweaveTxId?: string
    kulturePoints: number
    votes: number
    uploadedAt: string
}

export interface VoteReceipt {
    voter: string
    videoId: string
    costLamports: number
    timestamp: string
    transactionSignature: string
}
