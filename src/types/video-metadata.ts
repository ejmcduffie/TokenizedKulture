/**
 * Video Metadata Schema — The AI Learning Layer
 *
 * This schema is embedded as Arweave transaction tags so that
 * AI agents can query and learn cinematic techniques from
 * permanently stored video content.
 */

/** Individual shot within a video */
export interface ShotMetadata {
    /** Timecode range, e.g. "0:00-0:10" */
    timestamp: string;
    /** Shot classification */
    type: 'Text/Atmosphere' | 'UI/Product' | 'Symbolic/Historical' | 'Character/Abstract'
    | 'Tech Abstract' | 'Blockchain' | 'UI/Mobile' | 'UI/Dashboard' | 'Macro/Cosmic'
    | 'Branding' | 'UI Extreme Close-up' | 'Abstract/Data' | '3D/Map' | string;
    /** Descriptive visual prompt used for grounding */
    visual: string;
    /** Camera motion type */
    cameraMotion: CameraMotion;
    /** Motion intensity 1-6 */
    motionIntensity: number;
    /** Lighting description */
    lighting: string;
    /** Color grading / palette */
    colorGrade: string;
    /** Post-processing effects applied */
    effects: string[];
    /** The exact generative AI prompt used */
    genPrompt: string;
    /** Whether this shot is AI-generated */
    isAiGenerated: boolean;
    /** Which AI engine produced it (if any) */
    aiEngine?: 'Runway Gen-3 Alpha' | 'Veo' | 'Midjourney' | 'Flux' | 'DALL-E' | string;
}

export type CameraMotion =
    | 'Static'
    | 'Static with Internal Motion'
    | 'Slow Zoom In'
    | 'Zoom Out'
    | 'Pan Down'
    | 'Pan Right'
    | 'Orbit Right'
    | 'Handheld/Shake'
    | 'Truck Right'
    | 'Crane Up'
    | 'Push In'
    | 'Rotate'
    | string;

/** Full video metadata document stored on Arweave */
export interface VideoMetadata {
    /** Video title */
    title: string;
    /** Creator's Solana wallet address */
    creator: string;
    /** Duration in seconds */
    durationSeconds: number;
    /** Aesthetic profile description */
    aesthetic: string;
    /** Target resolution (e.g. "16:9") */
    resolution: string;
    /** All shots composing this video */
    shots: ShotMetadata[];
    /** Aggregate computed metrics */
    aggregate: {
        totalShots: number;
        aiGeneratedPercentage: number;
        dominantMotion: CameraMotion;
        dominantMood: string;
        uniqueEffects: string[];
    };
    /** Platform metadata */
    platform: {
        uploadTimestamp: string;
        arweaveTxId?: string;
        kulturePoints: number;
    };
}

/** Kulture Wire Report — origin-traced viral moment */
export interface WireReport {
    eventTitle: string;
    originPostId: string;
    originAuthor: string;
    originTimestamp: string;
    platform: 'twitter' | 'x' | 'threads' | string;
    culturalTags: string[];
    strandCount: number;
    strands: WireStrand[];
    arweaveTxId?: string;
}

export interface WireStrand {
    postId: string;
    author: string;
    text: string;
    timestamp: string;
    engagement: {
        likes: number;
        retweets: number;
        replies: number;
    };
}

/** Raffle staking entry */
export interface RaffleEntry {
    wallet: string;
    kulturePoints: number;
    uploads: number;
    wireReports: number;
    registeredAt: string;
}

/** Raffle drawing result */
export interface RaffleResult {
    epoch: number; // year
    prizePoolLamports: number;
    winners: {
        rank: number;
        wallet: string;
        prizeLamports: number;
        percentage: number;
    }[];
    vrfSeed: string;
    executedAt: string;
    transactionSignature: string;
}

// ═══════════════════════════════════════════════════════════════════
//  NFT MARKETPLACE TYPES
// ═══════════════════════════════════════════════════════════════════

/** Supported asset categories for minting */
export type NFTAssetType = 'art' | 'music' | 'photo' | 'merch' | 'fashion' | 'video';

/** NFT metadata stored on Arweave, linked to the on-chain token */
export interface NFTMetadata {
    /** Unique NFT ID (mint address on-chain) */
    mintAddress: string;
    /** Human-readable name */
    name: string;
    /** Description of the piece */
    description: string;
    /** Asset type category */
    assetType: NFTAssetType;
    /** Creator's Solana wallet address */
    creator: string;
    /** Arweave TX ID for the asset file (image, audio, etc.) */
    assetArweaveTxId: string;
    /** Arweave TX ID for the JSON metadata */
    metadataArweaveTxId: string;
    /** URI for the asset preview (Arweave gateway URL) */
    assetUri: string;
    /** Collection this NFT belongs to (creator's collection mint) */
    collectionMint?: string;
    /** Royalty basis points (e.g., 500 = 5%) */
    royaltyBps: number;
    /** Supply: 1 for 1/1, higher for editions */
    supply: number;
    /** Max supply (0 = unlimited editions) */
    maxSupply: number;
    /** Cultural tags for discovery */
    tags: string[];
    /** Additional properties depending on asset type */
    properties: Record<string, string | number | boolean>;
    /** ISO timestamp */
    mintedAt: string;
}

/** A listing on the marketplace */
export interface NFTListing {
    /** Listing ID */
    listingId: string;
    /** The NFT being listed */
    mintAddress: string;
    /** Seller's wallet */
    seller: string;
    /** Price in lamports */
    priceLamports: number;
    /** Price in SOL (convenience) */
    priceSol: number;
    /** Whether the listing is active */
    isActive: boolean;
    /** ISO timestamp of listing creation */
    listedAt: string;
    /** ISO timestamp if sold */
    soldAt?: string;
    /** Buyer wallet if sold */
    buyer?: string;
    /** Transaction signature of sale */
    saleTxSignature?: string;
}

/** Receipt returned after minting an NFT */
export interface MintReceipt {
    mintAddress: string;
    creator: string;
    assetType: NFTAssetType;
    name: string;
    arweaveTxId: string;
    metadataUri: string;
    transactionSignature: string;
    timestamp: string;
}

/** Receipt returned after purchasing an NFT */
export interface PurchaseReceipt {
    listingId: string;
    mintAddress: string;
    buyer: string;
    seller: string;
    priceLamports: number;
    royaltyLamports: number;
    platformFeeLamports: number;
    transactionSignature: string;
    timestamp: string;
}

/** Creator profile for the marketplace */
export interface CreatorProfile {
    wallet: string;
    displayName: string;
    bio: string;
    totalMinted: number;
    totalSold: number;
    totalEarnedLamports: number;
    collections: string[];
    joinedAt: string;
}
