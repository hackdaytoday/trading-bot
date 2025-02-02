import { Strategy, TradeSignal } from '../types';

export class XAUUSDStrategy implements Strategy {
  public name = 'XAU/USD AI Strategy';
  public symbol = 'XAUUSD';
  public interval = 5000; // 5 second interval
  public volume = 0.01;

  // Strategy parameters
  private stopLossPips = 100; // $1.00 for gold
  private takeProfitPips = 200; // $2.00 for gold
  private pipSize = 0.01; // Gold pip size is $0.01
  private minSpread = 0.50; // 50 cents minimum spread
  private maxSpread = 1.00; // $1.00 maximum spread
  private retryAttempts = 3;
  private retryDelay = 1000;
  private lookbackPeriods = {
    ema: [5, 13, 21],
    rsi: 14,
    atr: 14,
    macd: {
      fast: 12,
      slow: 26,
      signal: 9
    }
  };

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

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return (
      price &&
      typeof price.bid === 'number' &&
      typeof price.ask === 'number' &&
      price.bid > 0 &&
      price.ask > 0 &&
      price.ask > price.bid &&
      (price.ask - price.bid) >= this.minSpread &&
      (price.ask - price.bid) <= this.maxSpread
    );
  }

  private async getCandles(connection: any): Promise<any[]> {
    try {
      const candles = await connection.getCandles(this.symbol, '1m', Math.max(
        ...this.lookbackPeriods.ema,
        this.lookbackPeriods.rsi,
        this.lookbackPeriods.atr,
        this.lookbackPeriods.macd.slow + this.lookbackPeriods.macd.signal
      ));

      if (!Array.isArray(candles) || candles.length === 0) {
        throw new Error('Invalid candle data');
      }

      return candles;
    } catch (error) {
      console.error('Failed to fetch candles:', error);
      throw error;
    }
  }

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      // Get current price
      const price = await this.getPrice(connection);
      if (!price) {
        console.warn('Could not get current price');
        return null;
      }

      // Get historical candles
      const candles = await this.getCandles(connection);
      const closes = candles.map(c => c.close);
      const highs = candles.map(c => c.high);
      const lows = candles.map(c => c.low);

      // Calculate indicators
      const ema = this.calculateMultipleEMA(closes);
      const rsi = this.calculateRSI(closes);
      const atr = this.calculateATR(highs, lows, closes);
      const macd = this.calculateMACD(closes);

      // Generate trading signal
      return this.generateSignal(price, {
        ema,
        rsi,
        atr,
        macd
      });

    } catch (error) {
      console.error('Analysis error:', error);
      return null;
    }
  }

  private calculateMultipleEMA(prices: number[]): { [key: number]: number[] } {
    const emaResults: { [key: number]: number[] } = {};
    
    this.lookbackPeriods.ema.forEach(period => {
      const multiplier = 2 / (period + 1);
      const ema = [prices[0]];

      for (let i = 1; i < prices.length; i++) {
        ema.push((prices[i] - ema[i - 1]) * multiplier + ema[i - 1]);
      }

      emaResults[period] = ema;
    });

    return emaResults;
  }

  private calculateRSI(prices: number[]): number[] {
    const period = this.lookbackPeriods.rsi;
    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? -change : 0);

    const avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
    const avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;

    const rsi = [100 - (100 / (1 + avgGain / (avgLoss || 1)))];

    for (let i = period; i < changes.length; i++) {
      const gain = gains[i];
      const loss = losses[i];
      const lastAvgGain = avgGain * (period - 1) + gain;
      const lastAvgLoss = avgLoss * (period - 1) + loss;
      rsi.push(100 - (100 / (1 + lastAvgGain / (lastAvgLoss || 1))));
    }

    return rsi;
  }

  private calculateATR(highs: number[], lows: number[], closes: number[]): number[] {
    const period = this.lookbackPeriods.atr;
    const tr = highs.map((high, i) => {
      if (i === 0) return high - lows[i];
      const yesterdayClose = closes[i - 1];
      return Math.max(
        high - lows[i],
        Math.abs(high - yesterdayClose),
        Math.abs(lows[i] - yesterdayClose)
      );
    });

    const atr = [tr[0]];
    for (let i = 1; i < tr.length; i++) {
      atr.push(((period - 1) * atr[i - 1] + tr[i]) / period);
    }

    return atr;
  }

  private calculateMACD(prices: number[]): {
    macd: number[];
    signal: number[];
    histogram: number[];
  } {
    const { fast, slow, signal } = this.lookbackPeriods.macd;
    
    const fastEMA = this.calculateEMA(prices, fast);
    const slowEMA = this.calculateEMA(prices, slow);
    
    const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
    const signalLine = this.calculateEMA(macdLine, signal);
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

  private generateSignal(
    price: { bid: number; ask: number },
    indicators: {
      ema: { [key: number]: number[] };
      rsi: number[];
      atr: number[];
      macd: {
        macd: number[];
        signal: number[];
        histogram: number[];
      };
    }
  ): TradeSignal | null {
    try {
      const lastEMA5 = indicators.ema[5][indicators.ema[5].length - 1];
      const lastEMA13 = indicators.ema[13][indicators.ema[13].length - 1];
      const lastEMA21 = indicators.ema[21][indicators.ema[21].length - 1];
      const lastRSI = indicators.rsi[indicators.rsi.length - 1];
      const lastATR = indicators.atr[indicators.atr.length - 1];
      const lastMACD = indicators.macd.macd[indicators.macd.macd.length - 1];
      const lastSignal = indicators.macd.signal[indicators.macd.signal.length - 1];
      const lastHistogram = indicators.macd.histogram[indicators.macd.histogram.length - 1];

      // Buy conditions
      const buyConditions = 
        lastEMA5 > lastEMA13 && // Fast EMA above medium EMA
        lastEMA13 > lastEMA21 && // Medium EMA above slow EMA
        lastRSI < 30 && // Oversold condition
        lastMACD > lastSignal && // MACD crossover
        lastHistogram > 0 && // Positive MACD histogram
        lastATR > this.minSpread * 2; // Sufficient volatility

      // Sell conditions
      const sellConditions = 
        lastEMA5 < lastEMA13 && // Fast EMA below medium EMA
        lastEMA13 < lastEMA21 && // Medium EMA below slow EMA
        lastRSI > 70 && // Overbought condition
        lastMACD < lastSignal && // MACD crossover
        lastHistogram < 0 && // Negative MACD histogram
        lastATR > this.minSpread * 2; // Sufficient volatility

      if (buyConditions) {
        return {
          type: 'buy',
          symbol: this.symbol,
          volume: this.volume,
          stopLoss: this.calculateStopLoss('buy', price.ask, lastATR),
          takeProfit: this.calculateTakeProfit('buy', price.ask, lastATR)
        };
      }

      if (sellConditions) {
        return {
          type: 'sell',
          symbol: this.symbol,
          volume: this.volume,
          stopLoss: this.calculateStopLoss('sell', price.bid, lastATR),
          takeProfit: this.calculateTakeProfit('sell', price.bid, lastATR)
        };
      }

      return null;
    } catch (error) {
      console.error('Signal generation error:', error);
      return null;
    }
  }

  private calculateStopLoss(type: 'buy' | 'sell', price: number, atr: number): number {
    const stopDistance = Math.max(this.stopLossPips * this.pipSize, atr * 1.5);
    return type === 'buy'
      ? Math.round((price - stopDistance) * 100) / 100
      : Math.round((price + stopDistance) * 100) / 100;
  }

  private calculateTakeProfit(type: 'buy' | 'sell', price: number, atr: number): number {
    const profitDistance = Math.max(this.takeProfitPips * this.pipSize, atr * 3);
    return type === 'buy'
      ? Math.round((price + profitDistance) * 100) / 100
      : Math.round((price - profitDistance) * 100) / 100;
  }
}