/**
 * Lightweight Solana Vote Program (Native, no Anchor)
 * 
 * For the hackathon, this implements vote tracking client-side.
 * In production, this would be a deployed Solana program.
 * 
 * Vote mechanics:
 * - 0.0009 SOL per vote
 * - Max 3 votes per wallet per video
 * - Votes accumulate in prize pool PDA
 * - Admin can execute contest and distribute prizes
 */

import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Keypair,
    sendAndConfirmTransaction,
} from '@solana/web3.js'

export const VOTE_COST_LAMPORTS = 0.0009 * LAMPORTS_PER_SOL // 900,000 lamports
export const MAX_VOTES_PER_WALLET = 3

export interface VoteState {
    videoId: string
    voter: string
    voteCount: number
    timestamp: number
}

export class VoteProgram {
    private connection: Connection
    private prizePoolPubkey: PublicKey
    private voteStates: Map<string, VoteState> = new Map()

    constructor(connection: Connection, prizePoolPubkey: PublicKey) {
        this.connection = connection
        this.prizePoolPubkey = prizePoolPubkey
    }

    /**
     * Cast a vote for a video
     * Transfers 0.0009 SOL from voter to prize pool
     */
    async castVote(
        voterKeypair: Keypair,
        videoId: string
    ): Promise<{ signature: string; receipt: VoteState }> {
        const stateKey = `${voterKeypair.publicKey.toBase58()}_${videoId}`
        const existingState = this.voteStates.get(stateKey)

        // Check vote limit
        if (existingState && existingState.voteCount >= MAX_VOTES_PER_WALLET) {
            throw new Error(`Vote limit reached: max ${MAX_VOTES_PER_WALLET} votes per video`)
        }

        // Create transfer transaction
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: voterKeypair.publicKey,
                toPubkey: this.prizePoolPubkey,
                lamports: VOTE_COST_LAMPORTS,
            })
        )

        // Send transaction
        const signature = await sendAndConfirmTransaction(
            this.connection,
            transaction,
            [voterKeypair]
        )

        // Update vote state
        const newState: VoteState = {
            videoId,
            voter: voterKeypair.publicKey.toBase58(),
            voteCount: (existingState?.voteCount || 0) + 1,
            timestamp: Date.now(),
        }
        this.voteStates.set(stateKey, newState)

        return { signature, receipt: newState }
    }

    /**
     * Get current prize pool balance
     */
    async getPrizePoolBalance(): Promise<number> {
        const balance = await this.connection.getBalance(this.prizePoolPubkey)
        return balance / LAMPORTS_PER_SOL
    }

    /**
     * Execute contest and distribute prizes
     * (Admin only in production)
     */
    async executeContest(
        adminKeypair: Keypair,
        winners: Array<{ wallet: PublicKey; percentage: number }>
    ): Promise<string[]> {
        const prizePoolBalance = await this.connection.getBalance(this.prizePoolPubkey)
        const signatures: string[] = []

        for (const winner of winners) {
            const amount = Math.floor(prizePoolBalance * (winner.percentage / 100))

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: this.prizePoolPubkey,
                    toPubkey: winner.wallet,
                    lamports: amount,
                })
            )

            const signature = await sendAndConfirmTransaction(
                this.connection,
                transaction,
                [adminKeypair]
            )

            signatures.push(signature)
        }

        return signatures
    }

    /**
     * Get vote count for a specific voter + video
     */
    getVoteCount(voter: string, videoId: string): number {
        const stateKey = `${voter}_${videoId}`
        return this.voteStates.get(stateKey)?.voteCount || 0
    }
}

/**
 * Helper: Create a prize pool PDA (Program Derived Address)
 * In production, this would be derived from the program ID
 */
export function createPrizePoolKeypair(): Keypair {
    return Keypair.generate()
}
