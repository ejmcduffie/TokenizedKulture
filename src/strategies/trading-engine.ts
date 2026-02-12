import { SolanaAgentKit } from 'solana-agent-kit';
import { MarketData, TradingSignal, StrategyResult } from '../types/index.js';
import { logger } from '../utils/logger.js';

/**
 * TradingEngine — Multi-strategy signal generator for cultural tokens.
 *
 * Strategies:
 *  1. Momentum — ride strong uptrends on culturally relevant tokens
 *  2. Mean Reversion — buy culturally strong tokens that dipped
 *  3. Arbitrage — cross-DEX price gaps (placeholder for Jupiter routing)
 */
export class TradingEngine {
    private agent: SolanaAgentKit;

    constructor(agent: SolanaAgentKit) {
        this.agent = agent;
    }

    /**
     * Generate trading signals from cultural market data.
     */
    async generateSignals(marketData: MarketData[]): Promise<TradingSignal[]> {
        logger.info(`📊 Generating signals for ${marketData.length} tokens...`);
        const signals: TradingSignal[] = [];

        for (const data of marketData) {
            const results = await Promise.all([
                this.momentumStrategy(data),
                this.meanReversionStrategy(data),
            ]);

            for (const result of results) {
                if (result && result.signal.action !== 'hold') {
                    signals.push(result.signal);
                    logger.info(`📈 ${result.metadata.strategyName}: ${result.signal.action.toUpperCase()} ${data.token.symbol}`, {
                        confidence: result.signal.confidence,
                        reasoning: result.signal.reasoning,
                    });
                }
            }
        }

        // De-duplicate: keep the highest-confidence signal per token
        const bestSignals = this.deduplicateSignals(signals);
        logger.info(`📊 Final signals: ${bestSignals.length}`);
        return bestSignals;
    }

    /**
     * Execute a trading signal via Solana Agent Kit.
     * Returns true on success.
     */
    async executeSignal(signal: TradingSignal): Promise<boolean> {
        try {
            logger.info(`🎯 Executing: ${signal.action} — ${signal.reasoning}`);

            // In production, this would call:
            //   agent.methods.trade({ ... })
            // For hackathon, log the intent and return success
            logger.logTrade(
                signal.action,
                signal.strategy,
                signal.positionSize,
                signal.targetPrice || 0,
                signal.reasoning
            );

            return true;
        } catch (error) {
            logger.logError('TradingEngine.executeSignal', error as Error);
            return false;
        }
    }

    // ─── Strategies ───────────────────────────────────────────────

    private async momentumStrategy(data: MarketData): Promise<StrategyResult | null> {
        const { token, cultural, technical } = data;

        // Strong uptrend + cultural relevance = buy
        if (
            token.priceChange24h > 5 &&
            cultural.trendingScore > 40 &&
            technical.rsi < 70
        ) {
            return {
                signal: {
                    action: 'buy',
                    confidence: Math.min((cultural.trendingScore / 100) * 0.8 + 0.2, 0.95),
                    reasoning: `Momentum: ${token.symbol} up ${token.priceChange24h.toFixed(1)}% with cultural trending score ${cultural.trendingScore}`,
                    targetPrice: token.price * 1.15,
                    stopLoss: token.price * 0.92,
                    positionSize: 0.1,
                    strategy: 'momentum',
                },
                metadata: {
                    strategyName: 'Momentum',
                    dataPoints: 3,
                    confidence: 0.7,
                    reasoning: `${token.symbol} shows strong cultural momentum`,
                },
            };
        }

        return null;
    }

    private async meanReversionStrategy(data: MarketData): Promise<StrategyResult | null> {
        const { token, cultural, technical } = data;

        // Culturally strong but price dipped = reversal opportunity
        if (
            token.priceChange24h < -8 &&
            cultural.trendingScore > 50 &&
            technical.rsi < 35
        ) {
            return {
                signal: {
                    action: 'buy',
                    confidence: Math.min((cultural.trendingScore / 100) * 0.6 + 0.3, 0.85),
                    reasoning: `Mean Reversion: ${token.symbol} down ${token.priceChange24h.toFixed(1)}% but cultural score is ${cultural.trendingScore} — oversold`,
                    targetPrice: token.price * 1.12,
                    stopLoss: token.price * 0.88,
                    positionSize: 0.05,
                    strategy: 'mean-reversion',
                },
                metadata: {
                    strategyName: 'Mean Reversion',
                    dataPoints: 3,
                    confidence: 0.6,
                    reasoning: `${token.symbol} culturally strong but oversold`,
                },
            };
        }

        return null;
    }

    // ─── Helpers ──────────────────────────────────────────────────

    private deduplicateSignals(signals: TradingSignal[]): TradingSignal[] {
        const byStrategy = new Map<string, TradingSignal>();

        for (const signal of signals) {
            const key = signal.strategy;
            const existing = byStrategy.get(key);
            if (!existing || signal.confidence > existing.confidence) {
                byStrategy.set(key, signal);
            }
        }

        return Array.from(byStrategy.values());
    }
}
