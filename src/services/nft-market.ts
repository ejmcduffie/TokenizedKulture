import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import {
    NFTAssetType,
    NFTMetadata,
    NFTListing,
    MintReceipt,
    PurchaseReceipt,
    CreatorProfile,
} from '../types/video-metadata.js';
import { ArweaveVault } from './arweave-vault.js';
import { logger } from '../utils/logger.js';

/**
 * KultureNFTMarket — NFT Marketplace for Cultural Assets
 *
 * Allows artists to mint and sell cultural assets as NFTs on Solana:
 *   • Art & Photos — digital artwork, photography
 *   • Music & Audio — tracks, beats, stems
 *   • Merch — digital twins of physical merchandise
 *   • Fashion — digital wearables and fashion pieces
 *   • Video — cinematic content
 *
 * Architecture:
 *   • Minting uses Metaplex Token Metadata standard
 *   • Asset files stored permanently on Arweave (via ArweaveVault)
 *   • Compressed NFTs (cNFTs) available for cheap batch mints
 *   • Each wallet holds unlimited NFTs natively (Solana SPL tokens)
 *   • Royalties enforced via Metaplex royalty standard
 *   • Platform takes 2.5% fee on secondary sales
 *
 * Demo Mode:
 *   Without a Solana private key, mint operations return mock data
 *   with deterministic addresses for testing.
 */
export class KultureNFTMarket {
    private connection: Connection;
    private vault: ArweaveVault;

    // In-memory stores (production: on-chain + database)
    private nfts: Map<string, NFTMetadata> = new Map();
    private listings: Map<string, NFTListing> = new Map();
    private creators: Map<string, CreatorProfile> = new Map();

    /** Platform fee on secondary sales (2.5%) */
    static readonly PLATFORM_FEE_BPS = 250;
    /** Default creator royalty (5%) */
    static readonly DEFAULT_ROYALTY_BPS = 500;
    /** Minimum listing price in lamports (0.001 SOL) */
    static readonly MIN_PRICE_LAMPORTS = 1_000_000;

    constructor() {
        const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
        this.connection = new Connection(rpcUrl, 'confirmed');
        this.vault = new ArweaveVault();

        logger.info('🎨 KultureNFTMarket initialized');
        logger.info('   Solana NFTs use SPL tokens — each wallet holds unlimited NFTs');
        logger.info('   Asset storage: Arweave (permanent)');
        logger.info('   Standard: Metaplex Token Metadata');
    }

    // ═══════════════════════════════════════════════════════════════
    //  MINTING
    // ═══════════════════════════════════════════════════════════════

    /**
     * Mint a new NFT.
     *
     * Flow:
     *  1. Upload asset file to Arweave (image, audio, etc.)
     *  2. Build Metaplex-compatible JSON metadata
     *  3. Upload JSON metadata to Arweave
     *  4. Create SPL token with supply=1 (the NFT)
     *  5. Attach metadata via Metaplex Token Metadata Program
     *  6. Return mint receipt
     *
     * In demo mode: steps 4-5 are simulated.
     */
    async mintNFT(params: {
        creator: string;
        name: string;
        description: string;
        assetType: NFTAssetType;
        assetData?: string; // base64 or URL — in production, raw file bytes
        tags?: string[];
        royaltyBps?: number;
        supply?: number;
        maxSupply?: number;
        properties?: Record<string, string | number | boolean>;
        priceSol?: number;
    }): Promise<MintReceipt> {
        logger.info(`🎨 Minting NFT: "${params.name}" (${params.assetType}) by ${params.creator.slice(0, 8)}...`);

        const royaltyBps = params.royaltyBps ?? KultureNFTMarket.DEFAULT_ROYALTY_BPS;
        const supply = params.supply ?? 1;
        const maxSupply = params.maxSupply ?? 0;
        const tags = params.tags ?? [];
        const properties = params.properties ?? {};

        // Step 1: Upload asset to Arweave
        const assetArweaveTxId = await this.uploadAssetToArweave(
            params.assetType,
            params.name,
            params.assetData
        );

        // Step 2: Build Metaplex-compatible JSON metadata
        const metaplexMetadata = this.buildMetaplexJson({
            name: params.name,
            description: params.description,
            assetType: params.assetType,
            assetArweaveTxId,
            creator: params.creator,
            royaltyBps,
            tags,
            properties,
        });

        // Step 3: Upload JSON metadata to Arweave
        const metadataArweaveTxId = await this.uploadMetadataJson(metaplexMetadata);
        const metadataUri = `https://arweave.net/${metadataArweaveTxId}`;

        // Step 4: Create the on-chain NFT (demo mode: generate deterministic mint address)
        const mintAddress = this.generateMintAddress(params.creator, params.name);

        // Step 5: Store NFT record
        const nftMetadata: NFTMetadata = {
            mintAddress,
            name: params.name,
            description: params.description,
            assetType: params.assetType,
            creator: params.creator,
            assetArweaveTxId,
            metadataArweaveTxId,
            assetUri: `https://arweave.net/${assetArweaveTxId}`,
            royaltyBps,
            supply,
            maxSupply,
            tags,
            properties,
            mintedAt: new Date().toISOString(),
        };

        this.nfts.set(mintAddress, nftMetadata);

        // Update creator profile
        this.updateCreatorProfile(params.creator, 'mint');

        // Auto-list if price specified
        if (params.priceSol && params.priceSol > 0) {
            await this.listNFT(mintAddress, params.creator, params.priceSol);
        }

        const receipt: MintReceipt = {
            mintAddress,
            creator: params.creator,
            assetType: params.assetType,
            name: params.name,
            arweaveTxId: assetArweaveTxId,
            metadataUri,
            transactionSignature: `mint_${Date.now()}_${mintAddress.slice(0, 8)}`,
            timestamp: new Date().toISOString(),
        };

        logger.info(`✅ NFT minted: "${params.name}" → ${mintAddress}`);
        logger.info(`   Asset: https://arweave.net/${assetArweaveTxId}`);
        logger.info(`   Metadata: ${metadataUri}`);
        logger.info(`   Royalty: ${royaltyBps / 100}%`);

        return receipt;
    }

    // ═══════════════════════════════════════════════════════════════
    //  LISTING & BUYING
    // ═══════════════════════════════════════════════════════════════

    /**
     * List an NFT for sale on the marketplace.
     * In production: creates an escrow account holding the NFT.
     */
    async listNFT(mintAddress: string, seller: string, priceSol: number): Promise<NFTListing | null> {
        const nft = this.nfts.get(mintAddress);
        if (!nft) {
            logger.warn(`❌ Cannot list: NFT ${mintAddress} not found`);
            return null;
        }

        if (nft.creator !== seller) {
            // In production: check actual on-chain ownership
            // For demo: only creator can list
            logger.warn(`❌ Cannot list: ${seller} does not own NFT ${mintAddress}`);
            return null;
        }

        const priceLamports = Math.floor(priceSol * 1e9);
        if (priceLamports < KultureNFTMarket.MIN_PRICE_LAMPORTS) {
            logger.warn(`❌ Price too low: ${priceSol} SOL (min: ${KultureNFTMarket.MIN_PRICE_LAMPORTS / 1e9} SOL)`);
            return null;
        }

        const listing: NFTListing = {
            listingId: `listing_${Date.now()}_${mintAddress.slice(0, 8)}`,
            mintAddress,
            seller,
            priceLamports,
            priceSol,
            isActive: true,
            listedAt: new Date().toISOString(),
        };

        this.listings.set(listing.listingId, listing);

        logger.info(`📋 Listed: "${nft.name}" at ${priceSol} SOL`);
        return listing;
    }

    /**
     * Purchase a listed NFT.
     *
     * Flow:
     *  1. Verify listing is active
     *  2. Transfer SOL from buyer to seller (minus fees)
     *  3. Transfer NFT from escrow to buyer
     *  4. Pay royalties to creator
     *  5. Pay platform fee
     *
     * In demo mode: all transfers are simulated.
     */
    async purchaseNFT(listingId: string, buyer: string): Promise<PurchaseReceipt | null> {
        const listing = this.listings.get(listingId);
        if (!listing) {
            logger.warn(`❌ Listing ${listingId} not found`);
            return null;
        }

        if (!listing.isActive) {
            logger.warn(`❌ Listing ${listingId} is no longer active`);
            return null;
        }

        if (listing.seller === buyer) {
            logger.warn(`❌ Cannot buy your own NFT`);
            return null;
        }

        const nft = this.nfts.get(listing.mintAddress);
        if (!nft) {
            logger.warn(`❌ NFT ${listing.mintAddress} not found`);
            return null;
        }

        // Calculate fee breakdown
        const royaltyLamports = Math.floor(listing.priceLamports * nft.royaltyBps / 10000);
        const platformFeeLamports = Math.floor(listing.priceLamports * KultureNFTMarket.PLATFORM_FEE_BPS / 10000);
        const sellerReceives = listing.priceLamports - royaltyLamports - platformFeeLamports;

        // Mark listing as sold
        listing.isActive = false;
        listing.soldAt = new Date().toISOString();
        listing.buyer = buyer;
        listing.saleTxSignature = `sale_${Date.now()}_${buyer.slice(0, 8)}`;

        // Transfer ownership (in demo: update the creator field to buyer)
        // In production: SPL token transfer from escrow to buyer
        const originalCreator = nft.creator; // preserve for royalty
        // Note: we don't change nft.creator — that's the original creator for royalties
        // Ownership is tracked by the on-chain token account

        // Update creator earnings
        this.updateCreatorProfile(listing.seller, 'sale', sellerReceives);
        if (originalCreator !== listing.seller) {
            // Secondary sale — royalties go to original creator
            this.updateCreatorProfile(originalCreator, 'royalty', royaltyLamports);
        }

        const receipt: PurchaseReceipt = {
            listingId,
            mintAddress: listing.mintAddress,
            buyer,
            seller: listing.seller,
            priceLamports: listing.priceLamports,
            royaltyLamports,
            platformFeeLamports,
            transactionSignature: listing.saleTxSignature!,
            timestamp: listing.soldAt!,
        };

        logger.info(`💰 SOLD: "${nft.name}"`);
        logger.info(`   Buyer: ${buyer.slice(0, 8)}...`);
        logger.info(`   Price: ${listing.priceSol} SOL`);
        logger.info(`   Seller receives: ${(sellerReceives / 1e9).toFixed(4)} SOL`);
        logger.info(`   Creator royalty: ${(royaltyLamports / 1e9).toFixed(4)} SOL (${nft.royaltyBps / 100}%)`);
        logger.info(`   Platform fee: ${(platformFeeLamports / 1e9).toFixed(4)} SOL (${KultureNFTMarket.PLATFORM_FEE_BPS / 100}%)`);

        return receipt;
    }

    /**
     * Cancel an active listing.
     */
    cancelListing(listingId: string, seller: string): boolean {
        const listing = this.listings.get(listingId);
        if (!listing || listing.seller !== seller || !listing.isActive) {
            return false;
        }

        listing.isActive = false;
        logger.info(`🚫 Listing cancelled: ${listingId}`);
        return true;
    }

    // ═══════════════════════════════════════════════════════════════
    //  QUERIES
    // ═══════════════════════════════════════════════════════════════

    /**
     * Get all active marketplace listings.
     */
    getActiveListings(filters?: {
        assetType?: NFTAssetType;
        minPriceSol?: number;
        maxPriceSol?: number;
        creator?: string;
    }): Array<NFTListing & { nft: NFTMetadata }> {
        let results: Array<NFTListing & { nft: NFTMetadata }> = [];

        for (const listing of this.listings.values()) {
            if (!listing.isActive) continue;

            const nft = this.nfts.get(listing.mintAddress);
            if (!nft) continue;

            // Apply filters
            if (filters?.assetType && nft.assetType !== filters.assetType) continue;
            if (filters?.minPriceSol && listing.priceSol < filters.minPriceSol) continue;
            if (filters?.maxPriceSol && listing.priceSol > filters.maxPriceSol) continue;
            if (filters?.creator && nft.creator !== filters.creator) continue;

            results.push({ ...listing, nft });
        }

        return results.sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime());
    }

    /**
     * Get all NFTs owned by a wallet.
     * In production: query on-chain token accounts.
     * In demo: return NFTs created by this wallet.
     */
    getWalletNFTs(wallet: string): NFTMetadata[] {
        return Array.from(this.nfts.values()).filter(nft => nft.creator === wallet);
    }

    /**
     * Get a single NFT by mint address.
     */
    getNFT(mintAddress: string): NFTMetadata | null {
        return this.nfts.get(mintAddress) || null;
    }

    /**
     * Get a listing by ID.
     */
    getListing(listingId: string): NFTListing | null {
        return this.listings.get(listingId) || null;
    }

    /**
     * Get creator profile.
     */
    getCreatorProfile(wallet: string): CreatorProfile | null {
        return this.creators.get(wallet) || null;
    }

    /**
     * Get marketplace stats.
     */
    getMarketStats(): {
        totalNFTsMinted: number;
        totalListings: number;
        activeListings: number;
        totalVolumeLamports: number;
        totalVolumeSol: number;
        totalCreators: number;
        assetBreakdown: Record<NFTAssetType, number>;
    } {
        let totalVolumeLamports = 0;
        let activeListings = 0;
        const assetBreakdown: Record<string, number> = {
            art: 0, music: 0, photo: 0, merch: 0, fashion: 0, video: 0,
        };

        for (const listing of this.listings.values()) {
            if (listing.isActive) activeListings++;
            if (!listing.isActive && listing.buyer) {
                totalVolumeLamports += listing.priceLamports;
            }
        }

        for (const nft of this.nfts.values()) {
            assetBreakdown[nft.assetType] = (assetBreakdown[nft.assetType] || 0) + 1;
        }

        return {
            totalNFTsMinted: this.nfts.size,
            totalListings: this.listings.size,
            activeListings,
            totalVolumeLamports,
            totalVolumeSol: totalVolumeLamports / 1e9,
            totalCreators: this.creators.size,
            assetBreakdown: assetBreakdown as Record<NFTAssetType, number>,
        };
    }

    // ═══════════════════════════════════════════════════════════════
    //  INTERNAL HELPERS
    // ═══════════════════════════════════════════════════════════════

    /**
     * Upload the asset file to Arweave.
     * Returns the Arweave transaction ID.
     */
    private async uploadAssetToArweave(
        assetType: NFTAssetType,
        name: string,
        assetData?: string
    ): Promise<string> {
        // In production: upload actual file bytes via Irys
        // For demo: generate deterministic hash
        const mockData = JSON.stringify({ assetType, name, data: assetData || 'demo' });
        const hash = Buffer.from(mockData.slice(0, 64)).toString('base64url').slice(0, 43);

        logger.info(`📦 Asset uploaded to Arweave: ${hash}`);
        return hash;
    }

    /**
     * Upload JSON metadata to Arweave.
     * Returns the Arweave transaction ID.
     */
    private async uploadMetadataJson(metadata: Record<string, any>): Promise<string> {
        const data = JSON.stringify(metadata, null, 2);
        const hash = Buffer.from(data.slice(0, 64)).toString('base64url').slice(0, 43);

        logger.info(`📄 Metadata JSON uploaded to Arweave: ${hash}`);
        return hash;
    }

    /**
     * Build Metaplex-compatible JSON metadata.
     * Follows the Metaplex Token Metadata standard:
     * https://docs.metaplex.com/programs/token-metadata/token-standard
     */
    private buildMetaplexJson(params: {
        name: string;
        description: string;
        assetType: NFTAssetType;
        assetArweaveTxId: string;
        creator: string;
        royaltyBps: number;
        tags: string[];
        properties: Record<string, string | number | boolean>;
    }): Record<string, any> {
        const contentType = this.getContentType(params.assetType);

        return {
            name: params.name,
            symbol: 'KULTURE',
            description: params.description,
            seller_fee_basis_points: params.royaltyBps,
            image: `https://arweave.net/${params.assetArweaveTxId}`,
            animation_url: params.assetType === 'music' || params.assetType === 'video'
                ? `https://arweave.net/${params.assetArweaveTxId}`
                : undefined,
            external_url: 'https://tokenizedkulture.com',
            attributes: [
                { trait_type: 'Asset Type', value: params.assetType },
                { trait_type: 'Platform', value: 'Tokenized Kulture' },
                ...params.tags.map(tag => ({ trait_type: 'Tag', value: tag })),
                ...Object.entries(params.properties).map(([key, value]) => ({
                    trait_type: key,
                    value: String(value),
                })),
            ],
            properties: {
                files: [{
                    uri: `https://arweave.net/${params.assetArweaveTxId}`,
                    type: contentType,
                }],
                category: this.getMetaplexCategory(params.assetType),
                creators: [{
                    address: params.creator,
                    share: 100,
                }],
            },
            collection: {
                name: 'Tokenized Kulture',
                family: 'Kulture',
            },
        };
    }

    private mintCounter = 0;

    /**
     * Generate a unique mock mint address.
     * In production: this would be the actual SPL token mint address.
     */
    private generateMintAddress(creator: string, name: string): string {
        this.mintCounter++;
        // Use crypto UUID for guaranteed uniqueness in demo mode
        const uuid = crypto.randomUUID().replace(/-/g, '');
        return `Kulture${uuid.slice(0, 38)}`;
    }

    /**
     * Update or create a creator profile.
     */
    private updateCreatorProfile(
        wallet: string,
        event: 'mint' | 'sale' | 'royalty',
        amountLamports: number = 0
    ): void {
        let profile = this.creators.get(wallet);

        if (!profile) {
            profile = {
                wallet,
                displayName: `Creator_${wallet.slice(0, 8)}`,
                bio: '',
                totalMinted: 0,
                totalSold: 0,
                totalEarnedLamports: 0,
                collections: [],
                joinedAt: new Date().toISOString(),
            };
            this.creators.set(wallet, profile);
        }

        switch (event) {
            case 'mint':
                profile.totalMinted++;
                break;
            case 'sale':
                profile.totalSold++;
                profile.totalEarnedLamports += amountLamports;
                break;
            case 'royalty':
                profile.totalEarnedLamports += amountLamports;
                break;
        }
    }

    /**
     * Get MIME content type for asset type.
     */
    private getContentType(assetType: NFTAssetType): string {
        switch (assetType) {
            case 'art': return 'image/png';
            case 'photo': return 'image/jpeg';
            case 'music': return 'audio/mpeg';
            case 'video': return 'video/mp4';
            case 'merch': return 'image/png';
            case 'fashion': return 'image/png';
            default: return 'application/octet-stream';
        }
    }

    /**
     * Get Metaplex category for asset type.
     */
    private getMetaplexCategory(assetType: NFTAssetType): string {
        switch (assetType) {
            case 'art': return 'image';
            case 'photo': return 'image';
            case 'music': return 'audio';
            case 'video': return 'video';
            case 'merch': return 'image';
            case 'fashion': return 'image';
            default: return 'image';
        }
    }
}
