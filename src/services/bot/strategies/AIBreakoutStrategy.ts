import { Strategy, TradeSignal } from '../types';

export class AIBreakoutStrategy implements Strategy {
  public name = 'AI Breakout Detector';
  public symbol = 'EURUSD';
  public interval = 5000; // 5 second interval
  public volume = 0.01;

  private config = {
    bollingerPeriod: 20,
    bollingerStdDev: 2,
    volumeThreshold: 1.5,
    momentumPeriod: 14,
    minConsolidationBars: 10
  };

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) return null;

      const candles = await connection.getCandles(this.symbol, '1m', 30);
      if (!this.validateCandles(candles)) return null;

      const closes = candles.map(c => c.close);
      const highs = candles.map(c => c.high);
      const lows = candles.map(c => c.low);
      const volumes = candles.map(c => c.volume);

      const indicators = {
        bollinger: this.calculateBollinger(closes),
        consolidation: this.detectConsolidation(highs, lows),
        volumeSpike: this.detectVolumeSpike(volumes),
        momentum: this.calculateMomentum(closes)
      };

      return this.generateSignal(price, indicators);
    } catch (error) {
      console.error('AI Breakout analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return price && typeof price.bid === 'number' && typeof price.ask === 'number';
  }

  private validateCandles(candles: any[]): boolean {
    return Array.isArray(candles) && candles.length >= this.config.bollingerPeriod;
  }

  private calculateBollinger(prices: number[]): {
    middle: number;
    upper: number;
    lower: number;
  } {
    const period = this.config.bollingerPeriod;
    const stdDev = this.config.bollingerStdDev;
    
    const sma = prices.slice(-period).reduce((a, b) => a + b) / period;
    
    const squaredDiffs = prices.slice(-period).map(price => Math.pow(price - sma, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b) / period;
    const standardDeviation = Math.sqrt(variance);
    
    return {
      middle: sma,
      upper: sma + standardDeviation * stdDev,
      lower: sma - standardDeviation * stdDev
    };
  }

  private detectConsolidation(highs: number[], lows: number[]): {
    isConsolidating: boolean;
    range: number;
  } {
    const period = this.config.minConsolidationBars;
    const recentHighs = highs.slice(-period);
    const recentLows = lows.slice(-period);
    
    const highestHigh = Math.max(...recentHighs);
    const lowestLow = Math.min(...recentLows);
    const range = highestHigh - lowestLow;
    
    // Consider market consolidating if range is less than 0.1% of price
    const isConsolidating = range / lowestLow < 0.001;
    
    return { isConsolidating, range };
  }

  private detectVolumeSpike(volumes: number[]): boolean {
    const period = this.config.bollingerPeriod;
    const recentVolumes = volumes.slice(-period);
    const avgVolume = recentVolumes.reduce((a, b) => a + b) / period;
    const currentVolume = volumes[volumes.length - 1];
    
    return currentVolume > avgVolume * this.config.volumeThreshold;
  }

  private calculateMomentum(prices: number[]): number {
    const period = this.config.momentumPeriod;
    return (prices[prices.length - 1] - prices[prices.length - period]) / prices[prices.length - period] * 100;
  }

  private generateSignal(
    price: { bid: number; ask: number },
    indicators: {
      bollinger: { middle: number; upper: number; lower: number };
      consolidation: { isConsolidating: boolean; range: number };
      volumeSpike: boolean;
      momentum: number;
    }
  ): TradeSignal | null {
    const currentPrice = (price.ask + price.bid) / 2;

    // Buy conditions - Breakout above upper Bollinger Band
    const buyConditions = 
      indicators.consolidation.isConsolidating && // Market was consolidating
      currentPrice > indicators.bollinger.upper && // Price breaks above upper band
      indicators.volumeSpike && // Confirmed by volume spike
      indicators.momentum > 0; // Positive momentum

    // Sell conditions - Breakout below lower Bollinger Band
    const sellConditions = 
      indicators.consolidation.isConsolidating && // Market was consolidating
      currentPrice < indicators.bollinger.lower && // Price breaks below lower band
      indicators.volumeSpike && // Confirmed by volume spike
      indicators.momentum < 0; // Negative momentum

    const stopLossMultiplier = 1.5;
    const takeProfitMultiplier = 2.5;

    if (buyConditions) {
      return {
        type: 'buy',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: price.ask - indicators.consolidation.range * stopLossMultiplier,
        takeProfit: price.ask + indicators.consolidation.range * takeProfitMultiplier
      };
    }

    if (sellConditions) {
      return {
        type: 'sell',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: price.bid + indicators.consolidation.range * stopLossMultiplier,
        takeProfit: price.bid - indicators.consolidation.range * takeProfitMultiplier
      };
    }

    return null;
  }
}