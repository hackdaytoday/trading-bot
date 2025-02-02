import { metaApiService } from './metaapi';

export class AITradingBot {
  private isRunning: boolean = false;
  private lastTradeTime: number = 0;
  private minTradeInterval: number = 300000; // 5 minut

  async start() {
    if (this.isRunning) {
      throw new Error('AI Trading Bot is already running');
    }

    if (!metaApiService.isConnected()) {
      throw new Error('MetaTrader connection required');
    }

    this.isRunning = true;
    console.log("AI Trading Bot started successfully");
  }

  async executeTrade(signal: any) {
    if (Date.now() - this.lastTradeTime < this.minTradeInterval) {
      console.log("Trade skipped due to minTradeInterval");
      return;
    }

    try {
      await metaApiService.executeTrade(signal);
      this.lastTradeTime = Date.now();
    } catch (error) {
      console.error("Trade execution error:", error);
    }
  }

  stop() {
    this.isRunning = false;
    console.log("AI Trading Bot stopped");
  }
}

export const aiTradingBot = new AITradingBot();
