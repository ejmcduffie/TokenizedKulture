import 'dotenv/config';
import { TokenizeCultureAgent } from './core/agent.js';
import { AgentConfig } from './types/index.js';
import { logger } from './utils/logger.js';

async function main() {
    logger.info('🌍 Tokenized Kulture Agent — Booting...');

    const config: AgentConfig = {
        name: process.env.AGENT_NAME || 'TokenizedKulture-Agent',
        privateKey: process.env.SOLANA_PRIVATE_KEY || '',
        rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
        openaiApiKey: process.env.OPENAI_API_KEY || '',
        tradingEnabled: process.env.TRADING_ENABLED === 'true',
        maxPositionSizeSol: parseFloat(process.env.MAX_POSITION_SIZE_SOL || '1.0'),
        riskTolerance: (process.env.RISK_TOLERANCE as 'low' | 'medium' | 'high') || 'medium',
        slippageTolerance: parseFloat(process.env.SLIPPAGE_TOLERANCE || '0.03'),
        decisionIntervalMinutes: parseInt(process.env.DECISION_INTERVAL_MINUTES || '5', 10),
    };

    // Validate critical config
    if (!config.privateKey) {
        logger.warn('⚠️  SOLANA_PRIVATE_KEY not set — running in read-only / demo mode');
    }
    if (!config.openaiApiKey) {
        logger.warn('⚠️  OPENAI_API_KEY not set — cultural analysis will use heuristics only');
    }

    const agent = new TokenizeCultureAgent(config);

    // Graceful shutdown
    const shutdown = async () => {
        logger.info('🛑 Shutdown signal received...');
        await agent.stop();
        process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    await agent.start();
}

main().catch((err) => {
    logger.error('Fatal error during agent startup', err);
    process.exit(1);
});
