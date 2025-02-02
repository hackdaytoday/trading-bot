import { Strategy, TradeSignal } from '../types';

export class GoldScalpingStrategy implements Strategy {
  public name = 'Gold Scalping Strategy';
  public symbol = 'XAUUSD';
  public interval = 5000; // Check every 5 seconds
  public volume = 0.01;

  // Strategy parameters
  private stopLossPips = 50; // $0.50 for gold
  private takeProfitPips = 100; // $1.00 for gold
  private pipSize = 0.01; // Gold pip size is $0.01
  private minSpread = 0.10; // 10 cents minimum spread
  private maxSpread = 0.50; // 50 cents maximum spread
  private retryAttempts = 3;
  private retryDelay = 1000;
  private minCandleCount = 20;
  private lastTradeType: 'buy' | 'sell' | null = null;

  public async analyze(connection: any): Promise<TradeSignal | null> {
    if (!connection) {
      console.warn('No connection provided to Gold Scalping Strategy');
      return null;
    }

    try {
      // Get current price
      const currentPrice = await this.getPrice(connection);
      if (!currentPrice) {
        return null;
      }

      // Alternate between buy and sell orders
      const tradeType = this.lastTradeType === 'buy' ? 'sell' : 'buy';
      this.lastTradeType = tradeType;

      // Generate trade signal
      return {
        type: tradeType,
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: this.calculateStopLoss(tradeType, tradeType === 'buy' ? currentPrice.ask : currentPrice.bid),
        takeProfit: this.calculateTakeProfit(tradeType, tradeType === 'buy' ? currentPrice.ask : currentPrice.bid)
      };

    } catch (error) {
      console.warn('Gold scalping analysis warning:', error);
      return null;
    }
  }

  private async getPrice(connection: any): Promise<{ bid: number; ask: number } | null> {
    for (let i = 0; i < this.retryAttempts; i++) {
      try {
        const price = await connection.getSymbolPrice(this.symbol);
        if (this.validatePrice(price)) {
          return price;
        }
      } catch (error) {
        console.warn(`Price fetch attempt ${i + 1} failed:`, error);
        if (i === this.retryAttempts - 1) return null;
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
    return null;
  }

  private validatePrice(price: any): boolean {
    if (!price || typeof price !== 'object') {
      return false;
    }

    if (typeof price.bid !== 'number' || typeof price.ask !== 'number') {
      return false;
    }

    if (isNaN(price.bid) || isNaN(price.ask)) {
      return false;
    }

    if (price.bid <= 0 || price.ask <= 0) {
      return false;
    }

    if (price.ask <= price.bid) {
      return false;
    }

    return true;
  }

  private calculateStopLoss(type: 'buy' | 'sell', price: number): number {
    const pipsToPrice = this.stopLossPips * this.pipSize;
    return type === 'buy'
      ? Math.round((price - pipsToPrice) * 100) / 100
      : Math.round((price + pipsToPrice) * 100) / 100;
  }

  private calculateTakeProfit(type: 'buy' | 'sell', price: number): number {
    const pipsToPrice = this.takeProfitPips * this.pipSize;
    return type === 'buy'
      ? Math.round((price + pipsToPrice) * 100) / 100
      : Math.round((price - pipsToPrice) * 100) / 100;
  }
}