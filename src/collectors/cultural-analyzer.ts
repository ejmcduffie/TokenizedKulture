import axios from 'axios';
import { MarketData, CulturalMetrics, TokenInfo } from '../types/index.js';
import { logger } from '../utils/logger.js';

/**
 * CulturalAnalyzer — Discovers and scores cultural tokens on Solana.
 *
 * Data sources:
 *  • Jupiter aggregator (token list + prices)
 *  • CoinGecko (market cap, volume, social links)
 *  • Heuristic sentiment scorer (keyword + momentum)
 */
export class CulturalAnalyzer {
    private coingeckoApiKey: string;
    private jupiterBaseUrl = 'https://quote-api.jup.ag/v6';

    constructor() {
        this.coingeckoApiKey = process.env.COINGECKO_API_KEY || '';
    }

    /**
     * Main entry point — returns an array of MarketData for tokens
     * that pass the cultural relevance filter.
     */
    async analyzeTrends(): Promise<MarketData[]> {
        logger.info('🎭 Analyzing cultural trends on Solana...');

        try {
            const tokens = await this.fetchTrendingTokens();
            const marketData: MarketData[] = [];

            for (const token of tokens) {
                const cultural = this.scoreCulturalRelevance(token);

                // Only surface tokens with meaningful cultural signal
                if (cultural.trendingScore > 20) {
                    marketData.push({
                        token,
                        cultural,
                        technical: this.computeTechnicalIndicators(token),
                    });

                    logger.logCulturalTrend(token.symbol, cultural.trendingScore, cultural.sentimentScore);
                }
            }

            logger.info(`🎭 Found ${marketData.length} culturally relevant tokens`);
            return marketData;
        } catch (error) {
            logger.logError('CulturalAnalyzer.analyzeTrends', error as Error);
            return [];
        }
    }

    /**
     * Fetch trending Solana tokens from Jupiter / CoinGecko.
     * Falls back to a curated seed list when API keys are missing.
     */
    private async fetchTrendingTokens(): Promise<TokenInfo[]> {
        try {
            // Attempt CoinGecko trending
            const response = await axios.get(
                'https://api.coingecko.com/api/v3/search/trending',
                {
                    headers: this.coingeckoApiKey
                        ? { 'x-cg-demo-api-key': this.coingeckoApiKey }
                        : {},
                    timeout: 10_000,
                }
            );

            const coins = response.data?.coins || [];
            return coins.slice(0, 10).map((c: any) => this.mapCoinGeckoToken(c.item));
        } catch {
            logger.warn('CoinGecko unavailable — using seed token list');
            return this.getSeedTokens();
        }
    }

    private mapCoinGeckoToken(item: any): TokenInfo {
        return {
            mint: item.id || 'unknown',
            symbol: item.symbol?.toUpperCase() || '???',
            name: item.name || 'Unknown',
            decimals: 9,
            price: item.data?.price ?? 0,
            marketCap: item.data?.market_cap ?? 0,
            volume24h: item.data?.total_volume ?? 0,
            priceChange24h: item.data?.price_change_percentage_24h ?? 0,
            liquidityUsd: 0,
        } as any;
    }

    /**
     * Heuristic cultural scoring.
     * In production this would use NLP sentiment from X/Twitter, but
     * for the hackathon we use keyword matching + momentum signals.
     */
    private scoreCulturalRelevance(token: TokenInfo): CulturalMetrics {
        const culturalKeywords = [
            'culture', 'art', 'music', 'meme', 'community', 'heritage',
            'identity', 'roots', 'griot', 'afro', 'soul', 'vibe',
            'creator', 'nft', 'movement', 'legacy', 'story',
        ];

        const name = `${token.name} ${token.symbol}`.toLowerCase();
        const keywordHits = culturalKeywords.filter((kw) => name.includes(kw)).length;

        // Momentum-based trending score
        const momentumScore = Math.min(Math.abs(token.priceChange24h) * 2, 50);
        const volumeScore = Math.min(token.volume24h / 100_000, 30);
        const trendingScore = Math.min(keywordHits * 15 + momentumScore + volumeScore, 100);

        // Simplified sentiment (positive momentum = positive sentiment)
        const sentimentScore = token.priceChange24h > 0 ? 0.6 : -0.3;

        return {
            socialMentions: Math.floor(Math.random() * 500) + 10, // placeholder
            sentimentScore,
            trendingScore,
            communityGrowth: 0,
            influencerMentions: 0,
            viralPotential: trendingScore * 0.7,
        };
    }

    private computeTechnicalIndicators(token: TokenInfo) {
        return {
            rsi: 50 + (token.priceChange24h > 0 ? 10 : -10),
            macd: token.priceChange24h * 0.01,
            volume: token.volume24h,
            support: token.price * 0.9,
            resistance: token.price * 1.1,
        };
    }

    /** Curated seed list for demo / offline mode */
    private getSeedTokens(): TokenInfo[] {
        return [
            {
                mint: 'BONK_MINT', symbol: 'BONK', name: 'Bonk',
                decimals: 5, price: 0.00003, marketCap: 2_000_000_000,
                volume24h: 50_000_000, priceChange24h: 12.5, liquidityUsd: 10_000_000,
            },
            {
                mint: 'WIF_MINT', symbol: 'WIF', name: 'dogwifhat',
                decimals: 6, price: 2.50, marketCap: 2_500_000_000,
                volume24h: 80_000_000, priceChange24h: -3.2, liquidityUsd: 15_000_000,
            },
            {
                mint: 'SAMO_MINT', symbol: 'SAMO', name: 'Samoyed Coin Community',
                decimals: 9, price: 0.012, marketCap: 50_000_000,
                volume24h: 1_000_000, priceChange24h: 5.8, liquidityUsd: 2_000_000,
            },
        ] as any[];
    }
}
