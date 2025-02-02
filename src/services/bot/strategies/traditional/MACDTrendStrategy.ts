import { Strategy, TradeSignal } from '../../types';
import { EventEmitter } from 'events';

export class MACDTrendStrategy extends EventEmitter implements Strategy {
  public name = 'MACD Trend';
  public symbol = 'EURUSD';
  public interval = 15000; // 15 second interval
  public volume = 0.01;

  private config = {
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    minHistogram: 0.0001,
    confirmationPeriod: 2,
    atrPeriod: 14,
    stopLossMultiplier: 1.5,
    takeProfitMultiplier: 2.0
  };

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) return null;

      const candles = await connection.getCandles(this.symbol, '5m', this.config.slowPeriod + 10);
      if (!this.validateCandles(candles)) return null;

      const closes = candles.map(c => c.close);
      const macd = this.calculateMACD(closes);
      const atr = this.calculateATR(candles);

      // Check for MACD crossover
      const signal = this.detectCrossover(macd);
      if (!signal) return null;

      return this.generateSignal(price, signal, atr);
    } catch (error) {
      console.error('MACD Trend analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return price && typeof price.bid === 'number' && typeof price.ask === 'number';
  }

  private validateCandles(candles: any[]): boolean {
    return Array.isArray(candles) && candles.length >= this.config.slowPeriod;
  }

  private calculateMACD(prices: number[]): {
    macd: number[];
    signal: number[];
    histogram: number[];
  } {
    const fastEMA = this.calculateEMA(prices, this.config.fastPeriod);
    const slowEMA = this.calculateEMA(prices, this.config.slowPeriod);
    
    const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
    const signalLine = this.calculateEMA(macdLine, this.config.signalPeriod);
    const histogram = macdLine.map((macd, i) => macd - signalLine[i]);

    return {
      macd: macdLine,
      signal: signalLine,
      histogram
    };
  }

  private calculateEMA(prices: number[], period: number): number[] {
    const multiplier = 2 / (period + 1);
    const ema = [prices[0]];
    
    for (let i = 1; i < prices.length; i++) {
      ema.push((prices[i] - ema[i - 1]) * multiplier + ema[i - 1]);
    }
    
    return ema;
  }

  private calculateATR(candles: any[]): number {
    const period = this.config.atrPeriod;
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

    return tr.reduce((sum, val) => sum + val, 0) / period;
  }

  private detectCrossover(macd: {
    macd: number[];
    signal: number[];
    histogram: number[];
  }): 'buy' | 'sell' | null {
    const lastIndex = macd.macd.length - 1;
    const prevIndex = lastIndex - 1;

    const currentMACD = macd.macd[lastIndex];
    const currentSignal = macd.signal[lastIndex];
    const currentHist = macd.histogram[lastIndex];

    const prevMACD = macd.macd[prevIndex];
    const prevSignal = macd.signal[prevIndex];
    const prevHist = macd.histogram[prevIndex];

    // Check if histogram is significant enough
    if (Math.abs(currentHist) < this.config.minHistogram) {
      return null;
    }

    // Bullish crossover
    if (prevMACD <= prevSignal && currentMACD > currentSignal) {
      return 'buy';
    }

    // Bearish crossover
    if (prevMACD >= prevSignal && currentMACD < currentSignal) {
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