import { Strategy, TradeSignal } from '../../types';
import { EventEmitter } from 'events';

export class BollingerBreakoutStrategy extends EventEmitter implements Strategy {
  public name = 'Bollinger Bands Breakout';
  public symbol = 'EURUSD';
  public interval = 10000; // 10 second interval
  public volume = 0.01;

  private config = {
    period: 20,
    stdDev: 2,
    volumeThreshold: 1.5,
    minVolatility: 0.0001,
    confirmationCandles: 2
  };

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) return null;

      const candles = await connection.getCandles(this.symbol, '5m', this.config.period + 5);
      if (!this.validateCandles(candles)) return null;

      const closes = candles.map(c => c.close);
      const volumes = candles.map(c => c.volume);

      const bollinger = this.calculateBollinger(closes);
      const volumeIncrease = this.checkVolumeIncrease(volumes);
      const volatility = this.calculateVolatility(closes);

      if (volatility < this.config.minVolatility || !volumeIncrease) {
        return null;
      }

      return this.generateSignal(price, bollinger);
    } catch (error) {
      console.error('Bollinger Breakout analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return price && typeof price.bid === 'number' && typeof price.ask === 'number';
  }

  private validateCandles(candles: any[]): boolean {
    return Array.isArray(candles) && candles.length >= this.config.period;
  }

  private calculateBollinger(prices: number[]): {
    upper: number;
    middle: number;
    lower: number;
  } {
    const period = this.config.period;
    const stdDev = this.config.stdDev;
    
    const sma = prices.slice(-period).reduce((a, b) => a + b) / period;
    
    const squaredDiffs = prices.slice(-period).map(price => Math.pow(price - sma, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b) / period;
    const standardDeviation = Math.sqrt(variance);
    
    return {
      upper: sma + standardDeviation * stdDev,
      middle: sma,
      lower: sma - standardDeviation * stdDev
    };
  }

  private checkVolumeIncrease(volumes: number[]): boolean {
    const recentVolume = volumes[volumes.length - 1];
    const avgVolume = volumes
      .slice(-this.config.period)
      .reduce((a, b) => a + b) / this.config.period;
    
    return recentVolume > avgVolume * this.config.volumeThreshold;
  }

  private calculateVolatility(prices: number[]): number {
    const returns = prices.slice(1).map((price, i) => 
      Math.abs((price - prices[i]) / prices[i])
    );
    return returns.reduce((a, b) => a + b) / returns.length;
  }

  private generateSignal(
    price: { bid: number; ask: number },
    bollinger: { upper: number; middle: number; lower: number }
  ): TradeSignal | null {
    const currentPrice = (price.bid + price.ask) / 2;
    const bandWidth = bollinger.upper - bollinger.lower;

    // Buy signal - price breaks above upper band
    if (currentPrice > bollinger.upper) {
      return {
        type: 'buy',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: price.ask - bandWidth * 0.5,
        takeProfit: price.ask + bandWidth
      };
    }

    // Sell signal - price breaks below lower band
    if (currentPrice < bollinger.lower) {
      return {
        type: 'sell',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: price.bid + bandWidth * 0.5,
        takeProfit: price.bid - bandWidth
      };
    }

    return null;
  }
}