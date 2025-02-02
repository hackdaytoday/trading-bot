import { Strategy, TradeSignal } from '../types';

export class AIMeanReversionStrategy implements Strategy {
  public name = 'AI Mean Reversion';
  public symbol = 'EURUSD';
  public interval = 15000; // 15 second interval
  public volume = 0.01;

  private config = {
    bollinger: {
      period: 20,
      stdDev: 2
    },
    rsi: {
      period: 14,
      overbought: 70,
      oversold: 30
    },
    atr: {
      period: 14,
      multiplier: 1.5
    },
    minVolume: 100
  };

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) return null;

      const candles = await connection.getCandles(this.symbol, '5m', 50);
      if (!this.validateCandles(candles)) return null;

      const closes = candles.map(c => c.close);
      const highs = candles.map(c => c.high);
      const lows = candles.map(c => c.low);
      const volumes = candles.map(c => c.volume);

      const indicators = {
        bollinger: this.calculateBollinger(closes),
        rsi: this.calculateRSI(closes),
        atr: this.calculateATR(highs, lows, closes),
        volume: this.calculateVolumeMA(volumes)
      };

      return this.generateSignal(price, indicators);
    } catch (error) {
      console.error('AI Mean Reversion analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return price && typeof price.bid === 'number' && typeof price.ask === 'number';
  }

  private validateCandles(candles: any[]): boolean {
    return Array.isArray(candles) && candles.length >= Math.max(
      this.config.bollinger.period,
      this.config.rsi.period,
      this.config.atr.period
    );
  }

  private calculateBollinger(prices: number[]): {
    upper: number;
    middle: number;
    lower: number;
  } {
    const period = this.config.bollinger.period;
    const stdDev = this.config.bollinger.stdDev;
    
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

  private calculateRSI(prices: number[]): number {
    const period = this.config.rsi.period;
    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? -change : 0);
    
    const avgGain = gains.slice(-period).reduce((a, b) => a + b) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b) / period;
    
    return 100 - (100 / (1 + avgGain / (avgLoss || 1)));
  }

  private calculateATR(highs: number[], lows: number[], closes: number[]): number {
    const period = this.config.atr.period;
    const tr = highs.map((high, i) => {
      if (i === 0) return high - lows[i];
      const yesterdayClose = closes[i - 1];
      return Math.max(
        high - lows[i],
        Math.abs(high - yesterdayClose),
        Math.abs(lows[i] - yesterdayClose)
      );
    });

    return tr.slice(-period).reduce((a, b) => a + b) / period;
  }

  private calculateVolumeMA(volumes: number[]): number {
    const period = this.config.bollinger.period;
    return volumes.slice(-period).reduce((a, b) => a + b) / period;
  }

  private generateSignal(
    price: { bid: number; ask: number },
    indicators: {
      bollinger: { upper: number; middle: number; lower: number };
      rsi: number;
      atr: number;
      volume: number;
    }
  ): TradeSignal | null {
    const currentPrice = (price.ask + price.bid) / 2;

    // Buy conditions - Price below lower band and oversold
    const buyConditions = 
      currentPrice < indicators.bollinger.lower && // Price below lower band
      indicators.rsi < this.config.rsi.oversold && // Oversold condition
      indicators.volume > this.config.minVolume; // Sufficient volume

    // Sell conditions - Price above upper band and overbought
    const sellConditions = 
      currentPrice > indicators.bollinger.upper && // Price above upper band
      indicators.rsi > this.config.rsi.overbought && // Overbought condition
      indicators.volume > this.config.minVolume; // Sufficient volume

    const atrMultiplier = this.config.atr.multiplier;

    if (buyConditions) {
      return {
        type: 'buy',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: price.ask - indicators.atr * atrMultiplier,
        takeProfit: indicators.bollinger.middle
      };
    }

    if (sellConditions) {
      return {
        type: 'sell',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: price.bid + indicators.atr * atrMultiplier,
        takeProfit: indicators.bollinger.middle
      };
    }

    return null;
  }
}