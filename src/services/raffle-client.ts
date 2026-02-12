import { Connection, PublicKey } from '@solana/web3.js';
import { logger } from '../utils/logger.js';

/**
 * KultureVoteClient — "Best Video of the Year" Annual Contest
 *
 * Mechanic:
 *  • Users pay a small amount of SOL to cast a vote for their favorite video.
 *  • Each vote costs VOTE_COST_SOL (default: 0.01 SOL ≈ $2).
 *  • All vote fees accumulate into the annual Prize Pool.
 *  • At year's end, the smart contract executes and distributes the pool:
 *
 * Prize Pool Distribution:
 *  • 40% — 1st Place (Best Video of the Year)
 *  • 30% — Runner-up prizes (2nd–6th place, 6% each)
 *  • 20% — Creator Fund (redistributed to all creators proportionally)
 *  • 10% — Platform Reserve (ops & sustainability)
 *
 * Anti-spam: One wallet = max 3 votes per video per epoch.
 */

export interface VideoEntry {
    videoId: string;
    title: string;
    creator: string;
    arweaveTxId: string;
    votes: number;
    totalSolReceived: number;
    voters: Map<string, number>; // wallet -> votes cast for this video
    uploadedAt: string;
}

export interface VoteReceipt {
    voter: string;
    videoId: string;
    costLamports: number;
    timestamp: string;
    transactionSignature: string;
}

export interface ContestResult {
    epoch: number;
    prizePoolLamports: number;
    totalVotesCast: number;
    winners: {
        rank: number;
        videoId: string;
        title: string;
        creator: string;
        votes: number;
        prizeLamports: number;
        percentage: number;
    }[];
    executedAt: string;
    transactionSignature: string;
}

export class KultureVoteClient {
    private connection: Connection;
    private programId: PublicKey;
    private entries: Map<string, VideoEntry> = new Map();
    private prizePoolLamports = 0;
    private totalVotesCast = 0;

    /** Cost per vote in SOL */
    static readonly VOTE_COST_SOL = 0.0009;
    /** Cost per vote in lamports */
    static readonly VOTE_COST_LAMPORTS = 0.0009 * 1e9; // 900,000 lamports
    /** Max votes per wallet per video */
    static readonly MAX_VOTES_PER_WALLET = 3;

    constructor() {
        const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
        this.connection = new Connection(rpcUrl, 'confirmed');
        this.programId = new PublicKey(
            process.env.RAFFLE_PROGRAM_ID || '11111111111111111111111111111111'
        );
    }

    /**
     * Register a video as eligible for the annual contest.
     * Called automatically when a video is uploaded to the Vault.
     */
    registerVideo(videoId: string, title: string, creator: string, arweaveTxId: string): void {
        if (this.entries.has(videoId)) {
            logger.warn(`Video ${videoId} already registered`);
            return;
        }

        this.entries.set(videoId, {
            videoId,
            title,
            creator,
            arweaveTxId,
            votes: 0,
            totalSolReceived: 0,
            voters: new Map(),
            uploadedAt: new Date().toISOString(),
        });

        logger.info(`🎬 Video registered for contest: "${title}" by ${creator}`);
    }

    /**
     * Cast a vote for a video. Costs VOTE_COST_SOL per vote.
     * Returns a receipt on success.
     */
    async castVote(voterWallet: string, videoId: string): Promise<VoteReceipt | null> {
        const entry = this.entries.get(videoId);
        if (!entry) {
            logger.warn(`Cannot vote: video ${videoId} not found`);
            return null;
        }

        // Anti-spam: check vote limit per wallet per video
        const existingVotes = entry.voters.get(voterWallet) || 0;
        if (existingVotes >= KultureVoteClient.MAX_VOTES_PER_WALLET) {
            logger.warn(`Vote limit reached: ${voterWallet} already voted ${existingVotes}x for "${entry.title}"`);
            return null;
        }

        // In production: transfer VOTE_COST_SOL from voter to prize pool PDA
        // For hackathon: simulate the transfer
        const costLamports = KultureVoteClient.VOTE_COST_LAMPORTS;

        entry.votes++;
        entry.totalSolReceived += costLamports;
        entry.voters.set(voterWallet, existingVotes + 1);
        this.prizePoolLamports += costLamports;
        this.totalVotesCast++;

        const receipt: VoteReceipt = {
            voter: voterWallet,
            videoId,
            costLamports,
            timestamp: new Date().toISOString(),
            transactionSignature: `vote_${Date.now()}_${voterWallet.slice(0, 8)}`,
        };

        logger.info(`🗳️  Vote cast: ${voterWallet.slice(0, 8)}... → "${entry.title}" (${entry.votes} total votes, pool: ${(this.prizePoolLamports / 1e9).toFixed(4)} SOL)`);
        return receipt;
    }

    /**
     * Execute the annual "Best Video of the Year" contest.
     * Distributes the prize pool based on final vote standings.
     */
    async executeContest(): Promise<ContestResult> {
        logger.info(`🏆 Executing Annual "Best Video of the Year" Contest`);
        logger.info(`   Prize Pool: ${(this.prizePoolLamports / 1e9).toFixed(4)} SOL`);
        logger.info(`   Total Votes Cast: ${this.totalVotesCast}`);

        // Sort entries by votes (descending)
        const ranked = Array.from(this.entries.values())
            .filter((e) => e.votes > 0)
            .sort((a, b) => b.votes - a.votes);

        if (ranked.length === 0) {
            throw new Error('No videos received votes — contest cannot execute');
        }

        const winners: ContestResult['winners'] = [];

        // 1st Place: 40% of pool
        if (ranked[0]) {
            winners.push({
                rank: 1,
                videoId: ranked[0].videoId,
                title: ranked[0].title,
                creator: ranked[0].creator,
                votes: ranked[0].votes,
                prizeLamports: Math.floor(this.prizePoolLamports * 0.40),
                percentage: 40,
            });
        }

        // 2nd–6th Place: 6% each = 30% total
        for (let i = 1; i <= 5 && i < ranked.length; i++) {
            winners.push({
                rank: i + 1,
                videoId: ranked[i].videoId,
                title: ranked[i].title,
                creator: ranked[i].creator,
                votes: ranked[i].votes,
                prizeLamports: Math.floor(this.prizePoolLamports * 0.06),
                percentage: 6,
            });
        }

        const result: ContestResult = {
            epoch: new Date().getFullYear(),
            prizePoolLamports: this.prizePoolLamports,
            totalVotesCast: this.totalVotesCast,
            winners,
            executedAt: new Date().toISOString(),
            transactionSignature: `contest_${Date.now()}`,
        };

        // Log results
        logger.info('🏆 ═══════════════════════════════════════');
        logger.info('🏆  BEST VIDEO OF THE YEAR RESULTS');
        logger.info('🏆 ═══════════════════════════════════════');
        for (const w of winners) {
            const emoji = w.rank === 1 ? '👑' : `#${w.rank}`;
            logger.info(`  ${emoji} "${w.title}" by ${w.creator} — ${w.votes} votes — ${(w.prizeLamports / 1e9).toFixed(4)} SOL (${w.percentage}%)`);
        }
        logger.info(`  💰 Creator Fund (20%): ${(this.prizePoolLamports * 0.20 / 1e9).toFixed(4)} SOL`);
        logger.info(`  🏦 Platform Reserve (10%): ${(this.prizePoolLamports * 0.10 / 1e9).toFixed(4)} SOL`);

        return result;
    }

    /**
     * Get current contest standings for the frontend leaderboard.
     */
    getStandings(): {
        entries: Array<Omit<VideoEntry, 'voters'> & { voterCount: number }>;
        prizePoolSol: number;
        totalVotes: number;
        voteCostSol: number;
    } {
        const entries = Array.from(this.entries.values())
            .sort((a, b) => b.votes - a.votes)
            .map(({ voters, ...rest }) => ({
                ...rest,
                voterCount: voters.size,
            }));

        return {
            entries,
            prizePoolSol: this.prizePoolLamports / 1e9,
            totalVotes: this.totalVotesCast,
            voteCostSol: KultureVoteClient.VOTE_COST_SOL,
        };
    }
}
