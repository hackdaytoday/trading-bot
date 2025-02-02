import { Strategy, TradeSignal } from '../types';

export class AIMomentumStrategy implements Strategy {
  public name = 'AI Momentum Hunter';
  public symbol = 'EURUSD';
  public interval = 10000; // 10 second interval
  public volume = 0.01;

  private config = {
    macdFast: 12,
    macdSlow: 26,
    macdSignal: 9,
    rsiPeriod: 14,
    volumeMA: 20,
    momentumPeriod: 10,
    minVolume: 100
  };

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) return null;

      const candles = await connection.getCandles(this.symbol, '1m', 30);
      if (!this.validateCandles(candles)) return null;

      const closes = candles.map(c => c.close);
      const volumes = candles.map(c => c.volume);

      const indicators = {
        macd: this.calculateMACD(closes),
        rsi: this.calculateRSI(closes),
        volumeStrength: this.calculateVolumeStrength(volumes),
        momentum: this.calculateMomentum(closes)
      };

      return this.generateSignal(price, indicators);
    } catch (error) {
      console.error('AI Momentum analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return price && typeof price.bid === 'number' && typeof price.ask === 'number';
  }

  private validateCandles(candles: any[]): boolean {
    return Array.isArray(candles) && candles.length >= this.config.macdSlow;
  }

  private calculateMACD(prices: number[]): {
    macd: number[];
    signal: number[];
    histogram: number[];
  } {
    const fastEMA = this.calculateEMA(prices, this.config.macdFast);
    const slowEMA = this.calculateEMA(prices, this.config.macdSlow);
    
    const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
    const signalLine = this.calculateEMA(macdLine, this.config.macdSignal);
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

  private calculateRSI(prices: number[]): number {
    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? -change : 0);
    
    const avgGain = gains.slice(-this.config.rsiPeriod).reduce((a, b) => a + b) / this.config.rsiPeriod;
    const avgLoss = losses.slice(-this.config.rsiPeriod).reduce((a, b) => a + b) / this.config.rsiPeriod;
    
    return 100 - (100 / (1 + avgGain / (avgLoss || 1)));
  }

  private calculateVolumeStrength(volumes: number[]): number {
    const recentVolume = volumes.slice(-this.config.volumeMA);
    const avgVolume = recentVolume.reduce((a, b) => a + b) / this.config.volumeMA;
    const currentVolume = volumes[volumes.length - 1];
    return currentVolume / avgVolume;
  }

  private calculateMomentum(prices: number[]): number {
    const period = this.config.momentumPeriod;
    return (prices[prices.length - 1] - prices[prices.length - period]) / prices[prices.length - period] * 100;
  }

  private generateSignal(
    price: { bid: number; ask: number },
    indicators: {
      macd: { macd: number[]; signal: number[]; histogram: number[] };
      rsi: number;
      volumeStrength: number;
      momentum: number;
    }
  ): TradeSignal | null {
    const lastMACD = indicators.macd.macd[indicators.macd.macd.length - 1];
    const lastSignal = indicators.macd.signal[indicators.macd.signal.length - 1];
    const lastHistogram = indicators.macd.histogram[indicators.macd.histogram.length - 1];

    // Buy conditions
    const buyConditions = 
      lastMACD > lastSignal && // MACD crossover
      lastHistogram > 0 && // Positive momentum
      indicators.rsi < 40 && // Not overbought
      indicators.volumeStrength > 1.2 && // Strong volume
      indicators.momentum > 0; // Positive momentum

    // Sell conditions
    const sellConditions = 
      lastMACD < lastSignal && // MACD crossover
      lastHistogram < 0 && // Negative momentum
      indicators.rsi > 60 && // Not oversold
      indicators.volumeStrength > 1.2 && // Strong volume
      indicators.momentum < 0; // Negative momentum

    const stopLossMultiplier = 2;
    const takeProfitMultiplier = 3;
    const atr = Math.abs(lastHistogram) * 2; // Use MACD histogram for volatility

    if (buyConditions) {
      return {
        type: 'buy',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: price.ask - atr * stopLossMultiplier,
        takeProfit: price.ask + atr * takeProfitMultiplier
      };
    }

    if (sellConditions) {
      return {
        type: 'sell',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: price.bid + atr * stopLossMultiplier,
        takeProfit: price.bid - atr * takeProfitMultiplier
      };
    }

    return null;
  }
}