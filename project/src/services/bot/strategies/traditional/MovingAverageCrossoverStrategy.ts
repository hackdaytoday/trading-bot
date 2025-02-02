import { Strategy, TradeSignal } from '../../types';
import { EventEmitter } from 'events';

export class MovingAverageCrossoverStrategy extends EventEmitter implements Strategy {
  public name = 'Moving Average Crossover';
  public symbol = 'EURUSD';
  public interval = 15000; // 15 second interval
  public volume = 0.01;

  private config = {
    fastPeriod: 10,
    slowPeriod: 20,
    confirmationPeriod: 3,
    minTrendStrength: 0.001,
    stopLossMultiplier: 1.5,
    takeProfitMultiplier: 2.0
  };

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) return null;

      const candles = await connection.getCandles(this.symbol, '5m', this.config.slowPeriod + 5);
      if (!this.validateCandles(candles)) return null;

      const closes = candles.map(c => c.close);
      const fastMA = this.calculateSMA(closes, this.config.fastPeriod);
      const slowMA = this.calculateSMA(closes, this.config.slowPeriod);
      const trendStrength = this.calculateTrendStrength(fastMA, slowMA);

      // Check for crossover
      const signal = this.detectCrossover(fastMA, slowMA);
      if (!signal || Math.abs(trendStrength) < this.config.minTrendStrength) {
        return null;
      }

      // Calculate ATR for dynamic stop loss and take profit
      const atr = this.calculateATR(candles);

      return this.generateSignal(price, signal, atr);
    } catch (error) {
      console.error('MA Crossover analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return price && typeof price.bid === 'number' && typeof price.ask === 'number';
  }

  private validateCandles(candles: any[]): boolean {
    return Array.isArray(candles) && candles.length >= this.config.slowPeriod;
  }

  private calculateSMA(prices: number[], period: number): number[] {
    const sma = [];
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  }

  private calculateATR(candles: any[]): number {
    const period = 14;
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    const closes = candles.map(c => c.close);

    const tr = highs.map((high, i) => {
      if (i === 0) return high - lows[i];
      const yesterdayClose = closes[i - 1];
      return Math.max(
        high - lows[i],
        Math.abs(high - yesterdayClose),
        Math.abs(lows[i] - yesterdayClose)
      );
    });

    return tr.reduce((sum, val) => sum + val, 0) / tr.length;
  }

  private calculateTrendStrength(fastMA: number[], slowMA: number[]): number {
    const last = fastMA.length - 1;
    return (fastMA[last] - slowMA[last]) / slowMA[last];
  }

  private detectCrossover(fastMA: number[], slowMA: number[]): 'buy' | 'sell' | null {
    const last = fastMA.length - 1;
    const prev = last - 1;

    // Bullish crossover
    if (fastMA[prev] <= slowMA[prev] && fastMA[last] > slowMA[last]) {
      return 'buy';
    }

    // Bearish crossover
    if (fastMA[prev] >= slowMA[prev] && fastMA[last] < slowMA[last]) {
      return 'sell';
    }

    return null;
  }

  private generateSignal(
    price: { bid: number; ask: number },
    type: 'buy' | 'sell',
    atr: number
  ): TradeSignal {
    const stopLoss = atr * this.config.stopLossMultiplier;
    const takeProfit = atr * this.config.takeProfitMultiplier;

    return {
      type,
      symbol: this.symbol,
      volume: this.volume,
      stopLoss: type === 'buy'
        ? price.ask - stopLoss
        : price.bid + stopLoss,
      takeProfit: type === 'buy'
        ? price.ask + takeProfit
        : price.bid - takeProfit
    };
  }
}