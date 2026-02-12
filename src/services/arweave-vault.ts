import axios from 'axios';
import { VideoMetadata, ShotMetadata } from '../types/video-metadata.js';
import { logger } from '../utils/logger.js';

/**
 * ArweaveVault — Permanent storage for video metadata on the Permaweb.
 *
 * Each video upload becomes an Arweave transaction whose tags contain
 * the full cinematic metadata (shots, camera motions, lighting, effects).
 * This creates a structured, queryable corpus that AI agents can learn from.
 *
 * Uses Irys (formerly Bundlr) for bundled uploads with instant confirmation.
 */
export class ArweaveVault {
    private gatewayUrl: string;
    private irysUrl: string;

    constructor() {
        this.gatewayUrl = process.env.ARWEAVE_GATEWAY || 'https://arweave.net';
        this.irysUrl = process.env.IRYS_NODE || 'https://node2.irys.xyz';
    }

    /**
     * Upload video metadata to Arweave as a permanent, tagged transaction.
     * Returns the Arweave transaction ID.
     */
    async uploadMetadata(metadata: VideoMetadata): Promise<string> {
        logger.info(`📦 Uploading metadata for "${metadata.title}" to Arweave...`);

        try {
            const tags = this.buildTags(metadata);
            const data = JSON.stringify(metadata, null, 2);

            // In production: sign with Arweave wallet via Irys SDK
            // For hackathon: POST to Irys HTTP API or mock the upload
            const txId = await this.postToIrys(data, tags);

            logger.info(`✅ Metadata stored permanently — TX: ${txId}`);
            return txId;
        } catch (error) {
            logger.logError('ArweaveVault.uploadMetadata', error as Error);
            throw error;
        }
    }

    /**
     * Query the Arweave GraphQL gateway for videos matching specific
     * cinematic criteria. AI agents use this to learn shot composition.
     */
    async queryByMotion(motionType: string): Promise<VideoMetadata[]> {
        const query = `
      query {
        transactions(
          tags: [
            { name: "App-Name", values: ["TokenizedKulture"] },
            { name: "Dominant-Motion", values: ["${motionType}"] }
          ]
          first: 20
        ) {
          edges {
            node {
              id
              tags { name value }
            }
          }
        }
      }
    `;

        try {
            const response = await axios.post(`${this.gatewayUrl}/graphql`, { query });
            const edges = response.data?.data?.transactions?.edges || [];

            const results: VideoMetadata[] = [];
            for (const edge of edges) {
                const fullData = await this.fetchTransaction(edge.node.id);
                if (fullData) results.push(fullData);
            }

            return results;
        } catch (error) {
            logger.logError('ArweaveVault.queryByMotion', error as Error);
            return [];
        }
    }

    /**
     * Fetch the full metadata document from an Arweave TX ID.
     */
    async fetchTransaction(txId: string): Promise<VideoMetadata | null> {
        try {
            const response = await axios.get(`${this.gatewayUrl}/${txId}`, { timeout: 10_000 });
            return response.data as VideoMetadata;
        } catch {
            return null;
        }
    }

    /**
     * Build Arweave tags from metadata for indexing/querying.
     * Tags are the primary discovery mechanism on Arweave.
     */
    private buildTags(metadata: VideoMetadata): Array<{ name: string; value: string }> {
        return [
            { name: 'Content-Type', value: 'application/json' },
            { name: 'App-Name', value: 'TokenizedKulture' },
            { name: 'App-Version', value: '1.0.0' },
            { name: 'Type', value: 'video-metadata' },
            { name: 'Title', value: metadata.title },
            { name: 'Creator', value: metadata.creator },
            { name: 'Duration', value: String(metadata.durationSeconds) },
            { name: 'Aesthetic', value: metadata.aesthetic },
            { name: 'Total-Shots', value: String(metadata.aggregate.totalShots) },
            { name: 'AI-Percentage', value: String(metadata.aggregate.aiGeneratedPercentage) },
            { name: 'Dominant-Motion', value: metadata.aggregate.dominantMotion },
            { name: 'Dominant-Mood', value: metadata.aggregate.dominantMood },
            { name: 'Kulture-Points', value: String(metadata.platform.kulturePoints) },
            // Index unique effects for AI agent discovery
            ...metadata.aggregate.uniqueEffects.map((effect) => ({
                name: 'Effect',
                value: effect,
            })),
            // Index each shot type for compositional queries
            ...Array.from(new Set(metadata.shots.map((s) => s.type))).map((t) => ({
                name: 'Shot-Type',
                value: t,
            })),
        ];
    }

    /**
     * Post data to Irys for bundled Arweave upload.
     * In production this uses the @irys/sdk with a wallet signer.
     * For the hackathon demo, this returns a mock TX ID.
     */
    private async postToIrys(
        data: string,
        tags: Array<{ name: string; value: string }>
    ): Promise<string> {
        // Check if we have an Arweave wallet configured
        const walletKey = process.env.ARWEAVE_WALLET_KEY;

        if (!walletKey) {
            // Demo mode: generate a deterministic mock TX ID
            const hash = Buffer.from(data.slice(0, 64)).toString('base64url').slice(0, 43);
            logger.warn(`⚠️  No ARWEAVE_WALLET_KEY — demo mode TX: ${hash}`);
            return hash;
        }

        // Production upload via Irys HTTP API
        try {
            const response = await axios.post(`${this.irysUrl}/tx/arweave`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    ...tags.reduce((acc, t) => ({ ...acc, [`x-tag-${t.name}`]: t.value }), {}),
                },
            });
            return response.data?.id || 'unknown';
        } catch (error) {
            logger.logError('ArweaveVault.postToIrys', error as Error);
            throw error;
        }
    }

    /**
     * Compute Kulture Points earned for a video upload.
     * Points are based on metadata richness — richer metadata = more points.
     */
    static computeKulturePoints(metadata: VideoMetadata): number {
        let points = 10; // Base upload reward

        // Bonus for metadata completeness
        points += metadata.shots.length * 2;
        points += metadata.aggregate.uniqueEffects.length * 3;

        // Bonus for AI transparency (declaring which shots are AI-generated)
        const declaredShots = metadata.shots.filter((s) => s.isAiGenerated !== undefined).length;
        const transparencyRatio = declaredShots / Math.max(metadata.shots.length, 1);
        points += Math.floor(transparencyRatio * 20);

        // Bonus for detailed lighting/color descriptions
        const detailedShots = metadata.shots.filter(
            (s) => s.lighting.length > 10 && s.colorGrade.length > 5
        ).length;
        points += detailedShots * 5;

        return points;
    }
}
