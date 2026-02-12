import { PublicKey } from '@solana/web3.js';

export interface AgentConfig {
  name: string;
  privateKey: string;
  rpcUrl: string;
  openaiApiKey: string;
  tradingEnabled: boolean;
  maxPositionSizeSol: number;
  riskTolerance: 'low' | 'medium' | 'high';
  slippageTolerance: number;
  decisionIntervalMinutes: number;
}

export interface TokenInfo {
  mint: PublicKey;
  symbol: string;
  name: string;
  decimals: number;
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  liquidityUsd: number;
}

export interface CulturalMetrics {
  socialMentions: number;
  sentimentScore: number; // -1 to 1
  trendingScore: number; // 0 to 100
  communityGrowth: number;
  influencerMentions: number;
  viralPotential: number; // 0 to 100
}

export interface TradingSignal {
  action: 'buy' | 'sell' | 'hold';
  confidence: number; // 0 to 1
  reasoning: string;
  targetPrice?: number;
  stopLoss?: number;
  positionSize: number; // in SOL
  strategy: string;
}

export interface Position {
  mint: PublicKey;
  symbol: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  entryTime: Date;
}

export interface AgentDecision {
  timestamp: Date;
  action: string;
  reasoning: string;
  data: any;
  confidence: number;
  result?: string;
}

export interface MarketData {
  token: TokenInfo;
  cultural: CulturalMetrics;
  technical: {
    rsi: number;
    macd: number;
    volume: number;
    support: number;
    resistance: number;
  };
}

export interface StrategyResult {
  signal: TradingSignal;
  metadata: {
    strategyName: string;
    dataPoints: number;
    confidence: number;
    reasoning: string;
  };
}
