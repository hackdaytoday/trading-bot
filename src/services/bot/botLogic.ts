import { EventEmitter } from 'events';
import { Strategy, TradeSignal, BotConfig, BotStatus } from './types';

export class TradingBot extends EventEmitter {
  private running: boolean = false;
  private connection: any = null;
  private config: BotConfig;
  private strategy: Strategy | null = null;
  private checkInterval: number = 5000;
  private errorCount: number = 0;
  private maxErrors: number = 15;
  private intervalId: NodeJS.Timeout | null = null;
  private lastTradeTime: number = 0;
  private minTradeInterval: number = 300000; // 5 minutes
  private lastUpdate: Date = new Date();

  constructor(config: BotConfig) {
    super();
    this.config = config;
  }

  public setStrategy(strategy: Strategy): void {
    this.strategy = strategy;
    console.log('Strategy set:', strategy.name);
  }

  public async start(connection: any): Promise<void> {
    if (this.running) {
      throw new Error('Bot is already running');
    }

    if (!connection) {
      throw new Error('No connection provided');
    }

    if (!this.strategy) {
      throw new Error('No strategy selected');
    }

    try {
      // Wait for terminal synchronization
      while (!connection.terminalState?.synchronized) {
        console.log("Waiting for MetaTrader synchronization...");
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      this.connection = connection;
      this.running = true;
      this.lastUpdate = new Date();
      this.errorCount = 0;

      this.intervalId = setInterval(() => {
        this.onTick().catch(this.handleError.bind(this));
      }, this.checkInterval);

      this.emit('started', { time: new Date() });
      console.log('Trading bot started successfully');
    } catch (error) {
      this.running = false;
      this.connection = null;
      throw error;
    }
  }

  public stop(): void {
    if (!this.running) return;
    
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.emit('stopped', { time: new Date() });
    console.log('Trading bot stopped');
  }

  private async onTick(): Promise<void> {
    if (!this.running || !this.connection || !this.strategy) {
      return;
    }

    try {
      // Verify connection state
      if (!this.connection.terminalState?.synchronized) {
        console.log('Waiting for terminal synchronization...');
        return;
      }

      const now = Date.now();
      if (now - this.lastTradeTime < this.minTradeInterval) {
        return;
      }

      // Get current positions
      const positions = await this.connection.getPositions();
      
      // Check position limits
      if (positions.length >= this.config.maxPositions) {
        console.log('Maximum positions reached, skipping analysis');
        return;
      }

      // Get strategy signal
      console.log('Analyzing market with strategy:', this.strategy.name);
      const signal = await this.strategy.analyze(this.connection);
      
      if (signal) {
        console.log('Strategy signal received:', signal);
        await this.executeTrade(signal);
        this.lastTradeTime = now;
      }

      this.lastUpdate = new Date();
      this.errorCount = 0;

    } catch (error) {
      this.handleError(error);
    }
  }

  private async executeTrade(signal: TradeSignal): Promise<void> {
    try {
      console.log('Executing trade:', signal);

      // Verify connection
      if (!this.connection?.terminalState?.synchronized) {
        throw new Error('Terminal not synchronized for trade execution');
      }

      // Check existing positions for the symbol
      const positions = await this.connection.getPositions();
      const symbolPositions = positions.filter((p: any) => p.symbol === signal.symbol);

      if (symbolPositions.length > 0) {
        console.log('Existing positions found for symbol, skipping trade');
        return;
      }

      // Execute the trade
      let result;
      if (signal.type === 'buy') {
        result = await this.connection.createMarketBuyOrder(
          signal.symbol,
          signal.volume,
          signal.stopLoss,
          signal.takeProfit
        );
      } else {
        result = await this.connection.createMarketSellOrder(
          signal.symbol,
          signal.volume,
          signal.stopLoss,
          signal.takeProfit
        );
      }

      console.log('Trade executed successfully:', result);
      this.emit('trade', { signal, result, time: new Date() });

    } catch (error) {
      console.error('Trade execution error:', error);
      throw error;
    }
  }

  private handleError(error: unknown): void {
    this.errorCount++;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    this.emit('error', {
      message: errorMessage,
      count: this.errorCount,
      time: new Date()
    });

    if (this.errorCount >= this.maxErrors) {
      console.error('Max errors reached, stopping bot');
      this.stop();
    }
  }

  public getStatus(): BotStatus {
    return {
      isRunning: this.running,
      lastUpdate: this.lastUpdate,
      errorCount: this.errorCount,
      positions: 0,
      strategy: this.strategy?.name || 'None'
    };
  }

  public cleanup(): void {
    try {
      if (!this.running) return;
      console.log("Cleaning up bot resources...");
      this.stop();
      this.removeAllListeners();
      this.connection = null;
      this.strategy = null;
      this.lastTradeTime = 0;
      this.errorCount = 0;
    } catch (error) {
      console.error("Bot cleanup error:", error);
    }
  }
}