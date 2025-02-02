import { Strategy, TradeSignal } from '../types';

export class AIMartingaleStrategy implements Strategy {
  public name = 'AI Martingale Master';
  public symbol = 'EURUSD';
  public interval = 5000; // 5 second interval
  public volume = 0.01;

  private baseVolume = 0.01;
  private currentVolume = 0.01;
  private maxVolume = 1.0;
  private lastTradeResult: 'win' | 'loss' | null = null;
  private consecutiveLosses = 0;
  private maxConsecutiveLosses = 6;

  private config = {
    volumeMultiplier: 2.0,
    minProfit: 10, // pips
    maxSpread: 0.0003,
    volatilityThreshold: 0.0005,
    recoveryFactor: 1.5
  };

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      // Get current price and market conditions
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) return null;

      // Get recent candles for volatility analysis
      const candles = await connection.getCandles(this.symbol, '1m', 20);
      if (!this.validateCandles(candles)) return null;

      // Calculate market conditions
      const volatility = this.calculateVolatility(candles);
      const trend = this.analyzeTrend(candles);
      const momentum = this.calculateMomentum(candles);

      // Check if market conditions are suitable
      if (!this.isMarketSuitable(volatility, price.ask - price.bid)) {
        this.resetStrategy();
        return null;
      }

      // Generate trading signal based on Martingale logic
      return this.generateSignal(price, { volatility, trend, momentum });

    } catch (error) {
      console.error('Martingale analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return (
      price &&
      typeof price.bid === 'number' &&
      typeof price.ask === 'number' &&
      price.ask - price.bid <= this.config.maxSpread
    );
  }

  private validateCandles(candles: any[]): boolean {
    return Array.isArray(candles) && candles.length >= 20;
  }

  private calculateVolatility(candles: any[]): number {
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    const ranges = highs.map((h, i) => h - lows[i]);
    return ranges.reduce((sum, range) => sum + range, 0) / ranges.length;
  }

  private analyzeTrend(candles: any[]): 'up' | 'down' | 'sideways' {
    const closes = candles.map(c => c.close);
    const sma5 = this.calculateSMA(closes, 5);
    const sma20 = this.calculateSMA(closes, 20);

    if (sma5 > sma20 * 1.001) return 'up';
    if (sma5 < sma20 * 0.999) return 'down';
    return 'sideways';
  }

  private calculateSMA(data: number[], period: number): number {
    return data.slice(-period).reduce((sum, val) => sum + val, 0) / period;
  }

  private calculateMomentum(candles: any[]): number {
    const closes = candles.map(c => c.close);
    return (closes[closes.length - 1] - closes[0]) / closes[0] * 100;
  }

  private isMarketSuitable(volatility: number, spread: number): boolean {
    return (
      volatility <= this.config.volatilityThreshold &&
      spread <= this.config.maxSpread &&
      this.consecutiveLosses < this.maxConsecutiveLosses
    );
  }

  private adjustVolume(result: 'win' | 'loss'): void {
    if (result === 'win') {
      this.currentVolume = this.baseVolume;
      this.consecutiveLosses = 0;
    } else {
      this.consecutiveLosses++;
      this.currentVolume = Math.min(
        this.currentVolume * this.config.volumeMultiplier,
        this.maxVolume
      );
    }
  }

  private resetStrategy(): void {
    this.currentVolume = this.baseVolume;
    this.consecutiveLosses = 0;
    this.lastTradeResult = null;
  }

  private generateSignal(
    price: { bid: number; ask: number },
    conditions: {
      volatility: number;
      trend: 'up' | 'down' | 'sideways';
      momentum: number;
    }
  ): TradeSignal | null {
    // Only trade if we have a clear trend
    if (conditions.trend === 'sideways') {
      return null;
    }

    // Calculate take profit and stop loss based on volatility
    const pipSize = 0.0001;
    const takeProfitPips = Math.max(
      this.config.minProfit,
      Math.round(conditions.volatility / pipSize)
    );
    const stopLossPips = Math.round(takeProfitPips * this.config.recoveryFactor);

    // Generate signal based on trend and momentum
    if (conditions.trend === 'up' && conditions.momentum > 0) {
      return {
        type: 'buy',
        symbol: this.symbol,
        volume: this.currentVolume,
        stopLoss: price.ask - stopLossPips * pipSize,
        takeProfit: price.ask + takeProfitPips * pipSize
      };
    }

    if (conditions.trend === 'down' && conditions.momentum < 0) {
      return {
        type: 'sell',
        symbol: this.symbol,
        volume: this.currentVolume,
        stopLoss: price.bid + stopLossPips * pipSize,
        takeProfit: price.bid - takeProfitPips * pipSize
      };
    }

    return null;
  }
}