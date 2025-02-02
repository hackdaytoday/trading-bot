import { TradingBot } from './botLogic';
import { StrategyManager } from './strategyManager';
import { BotConfig, Strategy } from './types';

class BotService {
  private bot: TradingBot;
  private strategyManager: StrategyManager;
  private config: BotConfig;

  constructor() {
    this.config = {
      riskPerTrade: 0.02,
      atrPeriod: 14,
      atrMultiplierSL: 1.5,
      atrMultiplierTP: 2.0,
      tradingStartHour: 0,
      tradingEndHour: 24,
      trailingStopPips: 20,
      trailingActivationPips: 40,
      macdFastPeriod: 12,
      macdSlowPeriod: 26,
      macdSignalPeriod: 9,
      maxPositions: 5,
      maxDrawdownPercent: 10,
      notifications: {
        trades: true,
        signals: true,
        news: false
      },
      autoClose: true
    };

    this.bot = new TradingBot(this.config);
    this.strategyManager = new StrategyManager();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.bot.on('trade', (trade) => {
      console.log('Trade executed:', trade);
    });

    this.bot.on('error', (error) => {
      console.warn('Bot warning:', error.message);
    });

    this.bot.on('started', () => {
      console.log('Bot started trading');
    });

    this.bot.on('stopped', () => {
      console.log('Bot stopped trading');
    });

    // Add strategy events
    this.bot.on('strategy_signal', (signal) => {
      console.log('Strategy signal received:', signal);
    });

    this.bot.on('strategy_error', (error) => {
      console.error('Strategy error:', error);
    });
  }

  public getBotStatus() {
    try {
      const status = this.bot.getStatus();
      const activeStrategy = this.strategyManager.getActiveStrategy();
      return {
        ...status,
        activeStrategy: activeStrategy?.name || null
      };
    } catch (error) {
      console.warn('Bot status warning:', error);
      return {
        isRunning: false,
        lastUpdate: new Date(),
        errorCount: 0,
        positions: 0,
        strategy: 'None'
      };
    }
  }

  public async startBot(connection: any, strategyName?: string): Promise<void> {
    if (!connection) {
      throw new Error('MetaTrader connection required');
    }

    try {
      console.log('Starting bot initialization...');

      // Set or verify strategy
      if (strategyName) {
        console.log('Setting strategy:', strategyName);
        this.strategyManager.setActiveStrategy(strategyName);
      }

      const strategy = this.strategyManager.getActiveStrategy();
      if (!strategy) {
        throw new Error('No strategy selected');
      }

      // Set strategy in bot
      console.log('Configuring bot with strategy:', strategy.name);
      this.bot.setStrategy(strategy);

      // Start the bot
      console.log('Starting bot with connection...');
      await this.bot.start(connection);
      console.log('Bot started successfully');

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start bot';
      console.error('Failed to start bot:', message);
      throw new Error(message);
    }
  }

  public stopBot(): void {
    try {
      this.bot.stop();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to stop bot';
      console.error('Failed to stop bot:', message);
      throw new Error(message);
    }
  }

  public getStrategies(): Strategy[] {
    return this.strategyManager.getAllStrategies();
  }

  public updateStrategySettings(name: string, settings: Partial<Strategy>): void {
    this.strategyManager.updateStrategySettings(name, settings);
    
    // If this is the active strategy, update the bot
    const activeStrategy = this.strategyManager.getActiveStrategy();
    if (activeStrategy && activeStrategy.name === name) {
      this.bot.setStrategy(activeStrategy);
    }
  }

  public async updateConfig(newConfig: Partial<BotConfig>): Promise<void> {
    try {
      // Validate new config
      if (newConfig.maxDrawdownPercent !== undefined) {
        if (newConfig.maxDrawdownPercent <= 0 || newConfig.maxDrawdownPercent > 100) {
          throw new Error('Max drawdown must be between 0 and 100');
        }
      }

      if (newConfig.riskPerTrade !== undefined) {
        if (newConfig.riskPerTrade <= 0 || newConfig.riskPerTrade > 0.1) {
          throw new Error('Risk per trade must be between 0 and 0.1 (10%)');
        }
      }

      if (newConfig.maxPositions !== undefined) {
        if (newConfig.maxPositions <= 0 || newConfig.maxPositions > 10) {
          throw new Error('Max positions must be between 1 and 10');
        }
      }

      // Update config
      this.config = {
        ...this.config,
        ...newConfig
      };

      // Update bot with new config
      this.bot.updateConfig(this.config);

      console.log('Bot configuration updated:', this.config);
    } catch (error) {
      console.error('Failed to update bot configuration:', error);
      throw error;
    }
  }

  public cleanup(): void {
    try {
      this.stopBot();
      this.bot.cleanup();
    } catch (error) {
      console.warn('Bot cleanup warning:', error);
    }
  }
}

export const botService = new BotService();