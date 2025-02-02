import { Strategy, TradeSignal } from '../types';

export class AIScalpingStrategy implements Strategy {
  public name = 'AI Quantum Scalper';
  public symbol = 'EURUSD';
  public interval = 5000; // 5 second interval
  public volume = 0.01;

  private config = {
    ticksRequired: 100,
    minSpread: 0.00010,
    maxSpread: 0.00030,
    minVolume: 100,
    profitPips: 3,
    stopLossPips: 5,
    rsiPeriod: 7,
    rsiOverbought: 70,
    rsiOversold: 30
  };

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) return null;

      const ticks = await connection.getTickData(this.symbol, this.config.ticksRequired);
      if (!this.validateTicks(ticks)) return null;

      const indicators = {
        rsi: this.calculateRSI(ticks.map(t => t.price)),
        spread: price.ask - price.bid,
        volume: this.calculateVolume(ticks),
        momentum: this.calculateMomentum(ticks)
      };

      return this.generateSignal(price, indicators);
    } catch (error) {
      console.error('AI Scalping analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return (
      price &&
      typeof price.bid === 'number' &&
      typeof price.ask === 'number' &&
      price.ask - price.bid >= this.config.minSpread &&
      price.ask - price.bid <= this.config.maxSpread
    );
  }

  private validateTicks(ticks: any[]): boolean {
    return Array.isArray(ticks) && ticks.length >= this.config.ticksRequired;
  }

  private calculateRSI(prices: number[]): number {
    const period = this.config.rsiPeriod;
    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? -change : 0);
    
    const avgGain = gains.slice(-period).reduce((a, b) => a + b) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b) / period;
    
    return 100 - (100 / (1 + avgGain / (avgLoss || 1)));
  }

  private calculateVolume(ticks: any[]): number {
    return ticks.slice(-10).reduce((sum, tick) => sum + tick.volume, 0);
  }

  private calculateMomentum(ticks: any[]): number {
    const prices = ticks.map(t => t.price);
    const current = prices[prices.length - 1];
    const previous = prices[prices.length - 10];
    return (current - previous) / previous * 100;
  }

  private generateSignal(
    price: { bid: number; ask: number },
    indicators: {
      rsi: number;
      spread: number;
      volume: number;
      momentum: number;
    }
  ): TradeSignal | null {
    // Buy conditions
    const buyConditions = 
      indicators.rsi < this.config.rsiOversold &&
      indicators.volume > this.config.minVolume &&
      indicators.momentum > 0;

    // Sell conditions
    const sellConditions = 
      indicators.rsi > this.config.rsiOverbought &&
      indicators.volume > this.config.minVolume &&
      indicators.momentum < 0;

    if (buyConditions) {
      return {
        type: 'buy',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: price.ask - this.config.stopLossPips * 0.0001,
        takeProfit: price.ask + this.config.profitPips * 0.0001
      };
    }

    if (sellConditions) {
      return {
        type: 'sell',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: price.bid + this.config.stopLossPips * 0.0001,
        takeProfit: price.bid - this.config.profitPips * 0.0001
      };
    }

    return null;
  }
}