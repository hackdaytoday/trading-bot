import { Strategy, TradeSignal } from '../types';

export class AISwingStrategy implements Strategy {
  public name = 'AI Swing Master';
  public symbol = 'EURUSD';
  public interval = 60000; // 1 minute interval
  public volume = 0.01;

  private config = {
    adxPeriod: 14,
    adxThreshold: 25,
    macdFast: 12,
    macdSlow: 26,
    macdSignal: 9,
    swingPeriod: 20
  };

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) return null;

      const candles = await connection.getCandles(this.symbol, '1h', 50);
      if (!this.validateCandles(candles)) return null;

      const highs = candles.map(c => c.high);
      const lows = candles.map(c => c.low);
      const closes = candles.map(c => c.close);

      const indicators = {
        adx: this.calculateADX(highs, lows, closes),
        macd: this.calculateMACD(closes),
        swingPoints: this.findSwingPoints(highs, lows)
      };

      return this.generateSignal(price, indicators);
    } catch (error) {
      console.error('AI Swing analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return price && typeof price.bid === 'number' && typeof price.ask === 'number';
  }

  private validateCandles(candles: any[]): boolean {
    return Array.isArray(candles) && candles.length >= 50;
  }

  private calculateADX(highs: number[], lows: number[], closes: number[]): number {
    const period = this.config.adxPeriod;
    const tr = highs.map((high, i) => {
      if (i === 0) return high - lows[i];
      const yesterdayClose = closes[i - 1];
      return Math.max(
        high - lows[i],
        Math.abs(high - yesterdayClose),
        Math.abs(lows[i] - yesterdayClose)
      );
    });

    const plusDM = highs.map((high, i) => {
      if (i === 0) return 0;
      const highDiff = high - highs[i - 1];
      const lowDiff = lows[i - 1] - lows[i];
      return highDiff > lowDiff && highDiff > 0 ? highDiff : 0;
    });

    const minusDM = lows.map((low, i) => {
      if (i === 0) return 0;
      const highDiff = highs[i - 1] - highs[i];
      const lowDiff = low - lows[i - 1];
      return lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0;
    });

    const smoothedTR = this.calculateSmoothed(tr, period);
    const smoothedPlusDM = this.calculateSmoothed(plusDM, period);
    const smoothedMinusDM = this.calculateSmoothed(minusDM, period);

    const plusDI = smoothedPlusDM.map((dm, i) => (dm / smoothedTR[i]) * 100);
    const minusDI = smoothedMinusDM.map((dm, i) => (dm / smoothedTR[i]) * 100);

    const dx = plusDI.map((plus, i) => 
      Math.abs((plus - minusDI[i]) / (plus + minusDI[i])) * 100
    );

    return this.calculateEMA(dx, period)[dx.length - 1];
  }

  private calculateSmoothed(data: number[], period: number): number[] {
    const smoothed = [data[0]];
    for (let i = 1; i < data.length; i++) {
      smoothed.push((smoothed[i - 1] * (period - 1) + data[i]) / period);
    }
    return smoothed;
  }

  private calculateMACD(prices: number[]): {
    macd: number;
    signal: number;
    histogram: number;
  } {
    const fastEMA = this.calculateEMA(prices, this.config.macdFast);
    const slowEMA = this.calculateEMA(prices, this.config.macdSlow);
    
    const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
    const signalLine = this.calculateEMA(macdLine, this.config.macdSignal);
    
    return {
      macd: macdLine[macdLine.length - 1],
      signal: signalLine[signalLine.length - 1],
      histogram: macdLine[macdLine.length - 1] - signalLine[signalLine.length - 1]
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

  private findSwingPoints(highs: number[], lows: number[]): {
    highPoints: number[];
    lowPoints: number[];
  } {
    const period = this.config.swingPeriod;
    const highPoints = [];
    const lowPoints = [];

    for (let i = period; i < highs.length - period; i++) {
      const leftHighs = highs.slice(i - period, i);
      const rightHighs = highs.slice(i + 1, i + period + 1);
      const leftLows = lows.slice(i - period, i);
      const rightLows = lows.slice(i + 1, i + period + 1);

      if (highs[i] > Math.max(...leftHighs, ...rightHighs)) {
        highPoints.push(highs[i]);
      }

      if (lows[i] < Math.min(...leftLows, ...rightLows)) {
        lowPoints.push(lows[i]);
      }
    }

    return { highPoints, lowPoints };
  }

  private generateSignal(
    price: { bid: number; ask: number },
    indicators: {
      adx: number;
      macd: { macd: number; signal: number; histogram: number };
      swingPoints: { highPoints: number[]; lowPoints: number[] };
    }
  ): TradeSignal | null {
    const lastHigh = indicators.swingPoints.highPoints[indicators.swingPoints.highPoints.length - 1];
    const lastLow = indicators.swingPoints.lowPoints[indicators.swingPoints.lowPoints.length - 1];
    const currentPrice = (price.ask + price.bid) / 2;

    // Buy conditions
    const buyConditions = 
      indicators.adx > this.config.adxThreshold && // Strong trend
      indicators.macd.histogram > 0 && // Positive momentum
      currentPrice > lastLow && // Price above swing low
      indicators.macd.macd > indicators.macd.signal; // MACD crossover

    // Sell conditions
    const sellConditions = 
      indicators.adx > this.config.adxThreshold && // Strong trend
      indicators.macd.histogram < 0 && // Negative momentum
      currentPrice < lastHigh && // Price below swing high
      indicators.macd.macd < indicators.macd.signal; // MACD crossover

    if (buyConditions) {
      const stopLoss = Math.min(...indicators.swingPoints.lowPoints.slice(-3));
      const takeProfit = currentPrice + (currentPrice - stopLoss) * 1.5;

      return {
        type: 'buy',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss,
        takeProfit
      };
    }

    if (sellConditions) {
      const stopLoss = Math.max(...indicators.swingPoints.highPoints.slice(-3));
      const takeProfit = currentPrice - (stopLoss - currentPrice) * 1.5;

      return {
        type: 'sell',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss,
        takeProfit
      };
    }

    return null;
  }
}