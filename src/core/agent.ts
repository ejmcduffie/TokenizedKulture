import { SolanaAgentKit, KeypairWallet } from 'solana-agent-kit';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

import { AgentConfig, AgentDecision, TradingSignal, Position } from '../types/index.js';
import { logger } from '../utils/logger.js';
import { CulturalAnalyzer } from '../collectors/cultural-analyzer.js';
import { TradingEngine } from '../strategies/trading-engine.js';
import { RiskManager } from '../core/risk-manager.js';
import { KultureWire } from '../services/kulture-wire.js';
import { ArweaveVault } from '../services/arweave-vault.js';
import { KultureVoteClient } from '../services/raffle-client.js';

export class TokenizeCultureAgent {
  private agent!: SolanaAgentKit;
  private config: AgentConfig;
  private culturalAnalyzer: CulturalAnalyzer;
  private tradingEngine!: TradingEngine;
  private riskManager: RiskManager;
  private kultureWire: KultureWire;
  private vault: ArweaveVault;
  private raffle: KultureVoteClient;
  private positions: Position[] = [];
  private isRunning = false;

  constructor(config: AgentConfig) {
    this.config = config;

    // Initialize Solana Agent Kit (graceful — may fail without valid key)
    try {
      if (config.privateKey) {
        const keyPair = Keypair.fromSecretKey(bs58.decode(config.privateKey));
        const wallet = new KeypairWallet(keyPair, config.rpcUrl);

        this.agent = new SolanaAgentKit(
          wallet,
          config.rpcUrl,
          { OPENAI_API_KEY: config.openaiApiKey }
        ) as any;

        this.tradingEngine = new TradingEngine(this.agent);
      } else {
        logger.warn('⚠️  No private key — Solana Agent Kit running in read-only mode');
        this.tradingEngine = new TradingEngine(null as any);
      }
    } catch (err) {
      logger.warn('⚠️  Solana Agent Kit init failed — continuing in demo mode');
      this.tradingEngine = new TradingEngine(null as any);
    }

    // Initialize the three pillars
    this.culturalAnalyzer = new CulturalAnalyzer();
    this.riskManager = new RiskManager(config);
    this.kultureWire = new KultureWire();
    this.vault = new ArweaveVault();
    this.raffle = new KultureVoteClient();

    logger.info(`🤖 ${config.name} initialized successfully`);
    logger.info('   🎬 Pillar 1: AI Video Vault (Arweave) — READY');
    logger.info('   📰 Pillar 2: Kulture Wire (Origin Tracker) — READY');
    logger.info('   🎰 Pillar 3: Annual Raffle (Solana) — READY');
  }

  async start() {
    if (this.isRunning) {
      logger.warn('Agent is already running');
      return;
    }

    this.isRunning = true;
    logger.info(`🚀 Starting ${this.config.name}...`);

    // Log initial decision
    this.logDecision({
      timestamp: new Date(),
      action: 'AGENT_START',
      reasoning: 'Agent initialization complete, beginning autonomous operation across all three pillars',
      confidence: 1.0,
      data: { config: this.config }
    });

    // Run Kulture Wire scan on startup
    await this.runKultureWireScan();

    // Start main decision loop
    this.startDecisionLoop();
  }

  async stop() {
    this.isRunning = false;
    logger.info('🛑 Agent stopped');
  }

  private async startDecisionLoop() {
    while (this.isRunning) {
      try {
        await this.makeDecision();
        await this.sleep(this.config.decisionIntervalMinutes * 60 * 1000);
      } catch (error) {
        logger.logError('Decision Loop', error as Error);
        await this.sleep(30000);
      }
    }
  }

  private async makeDecision() {
    logger.info('🧠 Making autonomous decision...');

    try {
      // 1. Analyze cultural trends
      const culturalData = await this.culturalAnalyzer.analyzeTrends();

      // 2. Generate trading signals
      const signals = await this.tradingEngine.generateSignals(culturalData);

      // 3. Apply risk management
      const filteredSignals = this.riskManager.filterSignals(signals, this.positions);

      // 4. Execute trades
      for (const signal of filteredSignals) {
        await this.executeSignal(signal);
      }

      // 5. Update positions
      await this.updatePositions();

      // 6. Periodic Kulture Wire scan (every 3rd cycle)
      if (Math.random() < 0.33) {
        await this.runKultureWireScan();
      }

      this.logDecision({
        timestamp: new Date(),
        action: 'DECISION_CYCLE',
        reasoning: `Analyzed ${culturalData.length} tokens, generated ${signals.length} signals, executed ${filteredSignals.length} trades`,
        confidence: 0.8,
        data: { culturalData: culturalData.length, signals: signals.length, executed: filteredSignals.length }
      });

    } catch (error) {
      logger.logError('Decision Making', error as Error);
    }
  }

  /**
   * Kulture Wire — scan trending topics and archive origin threads
   */
  private async runKultureWireScan() {
    logger.info('📰 Running Kulture Wire scan...');
    try {
      const reports = await this.kultureWire.scanTrending();
      for (const report of reports) {
        logger.info(`📰 Wire Report: "${report.eventTitle}" — ${report.strandCount} strands`);
        if (report.arweaveTxId) {
          logger.info(`   💾 Archived on Arweave: ${report.arweaveTxId}`);
        }
      }
    } catch (error) {
      logger.logError('Kulture Wire Scan', error as Error);
    }
  }

  private async executeSignal(signal: TradingSignal) {
    if (!this.config.tradingEnabled) {
      logger.info('📊 Trading disabled - signal logged only', { signal });
      return;
    }

    try {
      logger.info(`🎯 Executing ${signal.action} signal`, { signal });

      const result = await this.tradingEngine.executeSignal(signal);

      this.logDecision({
        timestamp: new Date(),
        action: `TRADE_${signal.action.toUpperCase()}`,
        reasoning: signal.reasoning,
        confidence: signal.confidence,
        data: signal,
        result: result ? 'success' : 'failed'
      });

    } catch (error) {
      logger.logError('Signal Execution', error as Error);
    }
  }

  private async updatePositions() {
    // Update current positions with latest prices
  }

  private logDecision(decision: AgentDecision) {
    logger.logDecision(decision);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ─── Public API for monitoring ────────────────────────────────

  getPositions(): Position[] {
    return [...this.positions];
  }

  getDecisionHistory(): AgentDecision[] {
    return logger.getDecisionHistory();
  }

  getPerformanceMetrics() {
    return logger.getPerformanceMetrics();
  }

  getRaffleStandings() {
    return this.raffle.getStandings();
  }
}
