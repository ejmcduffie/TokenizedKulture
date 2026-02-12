import { AgentConfig, TradingSignal, Position } from '../types/index.js';
import { logger } from '../utils/logger.js';

export class RiskManager {
  private config: AgentConfig;
  private maxDrawdown = 0.15; // 15% max drawdown
  private maxPositions = 5;
  private maxPositionSize: number;

  constructor(config: AgentConfig) {
    this.config = config;
    this.maxPositionSize = config.maxPositionSizeSol;
  }

  filterSignals(signals: TradingSignal[], positions: Position[]): TradingSignal[] {
    const filteredSignals: TradingSignal[] = [];

    for (const signal of signals) {
      if (this.shouldExecuteSignal(signal, positions)) {
        // Adjust position size based on risk
        const adjustedSignal = this.adjustPositionSize(signal, positions);
        filteredSignals.push(adjustedSignal);
      } else {
        logger.warn(`Signal rejected by risk manager: ${signal.reasoning}`, {
          action: signal.action,
          confidence: signal.confidence,
          positionSize: signal.positionSize
        });
      }
    }

    return filteredSignals;
  }

  private shouldExecuteSignal(signal: TradingSignal, positions: Position[]): boolean {
    // Check if we have too many positions
    if (signal.action === 'buy' && positions.length >= this.maxPositions) {
      logger.warn('Max positions reached, rejecting buy signal');
      return false;
    }

    // Check position size limits
    if (signal.positionSize > this.maxPositionSize) {
      logger.warn(`Position size ${signal.positionSize} exceeds max ${this.maxPositionSize}`);
      return false;
    }

    // Check confidence threshold
    const minConfidence = this.getMinConfidenceThreshold();
    if (signal.confidence < minConfidence) {
      logger.warn(`Signal confidence ${signal.confidence} below threshold ${minConfidence}`);
      return false;
    }

    // Check portfolio risk
    const portfolioRisk = this.calculatePortfolioRisk(positions);
    if (portfolioRisk > 0.8) { // 80% risk threshold
      logger.warn(`Portfolio risk ${portfolioRisk} too high`);
      return false;
    }

    return true;
  }

  private adjustPositionSize(signal: TradingSignal, positions: Position[]): TradingSignal {
    let adjustedSize = signal.positionSize;

    // Risk-based position sizing
    const riskMultiplier = this.getRiskMultiplier(signal.confidence);
    adjustedSize *= riskMultiplier;

    // Portfolio concentration limits
    const totalPortfolioValue = this.calculateTotalPortfolioValue(positions);
    const maxPositionValue = totalPortfolioValue * 0.3; // Max 30% per position
    
    if (adjustedSize > maxPositionValue) {
      adjustedSize = maxPositionValue;
    }

    // Ensure minimum viable position
    const minPosition = 0.01; // 0.01 SOL minimum
    if (adjustedSize < minPosition) {
      adjustedSize = minPosition;
    }

    return {
      ...signal,
      positionSize: adjustedSize
    };
  }

  private getMinConfidenceThreshold(): number {
    switch (this.config.riskTolerance) {
      case 'low': return 0.8;
      case 'medium': return 0.6;
      case 'high': return 0.4;
      default: return 0.6;
    }
  }

  private getRiskMultiplier(confidence: number): number {
    // Higher confidence = larger position
    return Math.min(confidence * 1.5, 1.0);
  }

  private calculatePortfolioRisk(positions: Position[]): number {
    if (positions.length === 0) return 0;

    const totalValue = this.calculateTotalPortfolioValue(positions);
    const unrealizedLoss = positions
      .filter(p => p.pnl < 0)
      .reduce((sum, p) => sum + Math.abs(p.pnl), 0);

    return unrealizedLoss / totalValue;
  }

  private calculateTotalPortfolioValue(positions: Position[]): number {
    return positions.reduce((sum, p) => sum + (p.amount * p.currentPrice), 0);
  }

  // Stop loss and take profit logic
  shouldClosePosition(position: Position): { action: 'close' | 'hold', reason?: string } {
    // Stop loss check
    if (position.pnlPercent <= -0.1) { // 10% stop loss
      return { action: 'close', reason: 'Stop loss triggered' };
    }

    // Take profit check
    if (position.pnlPercent >= 0.5) { // 50% take profit
      return { action: 'close', reason: 'Take profit triggered' };
    }

    // Time-based exit (hold for max 24 hours)
    const holdTime = Date.now() - position.entryTime.getTime();
    if (holdTime > 24 * 60 * 60 * 1000) {
      return { action: 'close', reason: 'Time-based exit' };
    }

    return { action: 'hold' };
  }

  getPortfolioMetrics(positions: Position[]) {
    const totalValue = this.calculateTotalPortfolioValue(positions);
    const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);
    const winningPositions = positions.filter(p => p.pnl > 0).length;
    const winRate = positions.length > 0 ? winningPositions / positions.length : 0;

    return {
      totalValue,
      totalPnL,
      winRate,
      positionCount: positions.length,
      portfolioRisk: this.calculatePortfolioRisk(positions)
    };
  }
}
