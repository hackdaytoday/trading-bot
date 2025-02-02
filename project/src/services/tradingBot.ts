import { EventEmitter } from 'events';
import { Strategy, TradeSignal, BotConfig, BotStatus } from './types';
import { XAUUSDStrategy } from './strategies/XAUUSDStrategy';

export class TradingBot extends EventEmitter {
  private running: boolean = false;
  private connection: any = null;
  private config: BotConfig;
  private strategy: Strategy;
  private checkInterval: number = 5000;
  private errorCount: number = 0;
  private maxErrors: number = 15;
  private intervalId: NodeJS.Timeout | null = null;
  private lastTradeTime: number = 0;
  private minTradeInterval: number = 300000; // 5 minut
  private lastUpdate: Date = new Date();

  constructor(config: BotConfig) {
    super();
    this.config = config;
    this.strategy = new XAUUSDStrategy();
  }

  public async start(connection: any): Promise<void> {
    if (this.running) {
      throw new Error('Bot is already running');
    }

    if (!connection) {
      throw new Error('No connection to MetaTrader API');
    }

    // Poczekaj na synchronizację terminala
    while (!connection.terminalState?.synchronized) {
      console.log("Waiting for MetaTrader synchronization...");
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    try {
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
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.emit('stopped', { time: new Date() });
    console.log('Trading bot stopped');
  }

  private async onTick(): Promise<void> {
    if (!this.running || !this.connection?.terminalState?.synchronized) {
      return;
    }

    try {
      const now = Date.now();
      if (now - this.lastTradeTime < this.minTradeInterval) {
        return;
      }

      const signal = await this.strategy.analyze(this.connection);
      if (signal) {
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
      if (!this.running || !this.connection?.terminalState?.synchronized) {
        throw new Error('Cannot execute trade - connection not ready');
      }

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
}
