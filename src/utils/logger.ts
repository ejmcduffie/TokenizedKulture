import winston from 'winston';
import { AgentDecision } from '../types/index.js';

class AgentLogger {
  private logger: winston.Logger;
  private decisions: AgentDecision[] = [];

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'tokenize-culture-agent' },
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    });
  }

  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  error(message: string, error?: Error) {
    this.logger.error(message, { error: error?.message, stack: error?.stack });
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }

  logDecision(decision: AgentDecision) {
    this.decisions.push(decision);
    this.info('🤖 Agent Decision', {
      action: decision.action,
      reasoning: decision.reasoning,
      confidence: decision.confidence,
      timestamp: decision.timestamp
    });
  }

  getDecisionHistory(): AgentDecision[] {
    return [...this.decisions];
  }

  getPerformanceMetrics() {
    const totalDecisions = this.decisions.length;
    const avgConfidence = this.decisions.reduce((sum, d) => sum + d.confidence, 0) / totalDecisions;
    
    return {
      totalDecisions,
      avgConfidence,
      successfulDecisions: this.decisions.filter(d => d.result === 'success').length,
      recentDecisions: this.decisions.slice(-10)
    };
  }

  logTrade(action: string, symbol: string, amount: number, price: number, reasoning: string) {
    this.info(`💰 Trade Executed: ${action.toUpperCase()} ${amount} ${symbol} at $${price}`, {
      action,
      symbol,
      amount,
      price,
      reasoning
    });
  }

  logError(context: string, error: Error) {
    this.error(`❌ Error in ${context}`, error);
  }

  logCulturalTrend(symbol: string, trendScore: number, sentiment: number) {
    this.info(`🎭 Cultural Trend Detected: ${symbol}`, {
      symbol,
      trendScore,
      sentiment,
      timestamp: new Date()
    });
  }
}

export const logger = new AgentLogger();
