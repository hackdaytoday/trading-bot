import { Strategy, TradeSignal } from '../types';

export class ScalpingStrategy implements Strategy {
  public name = 'Advanced Scalping Strategy';
  public symbol = 'EURUSD';
  public interval = 100; // Check every 100ms for ultra-fast scalping
  public volume = 0.01;

  // Strategy parameters
  private stopLossPips = 3;
  private takeProfitPips = 5;
  private pipSize = 0.0001;
  private minSpread = 0.00010; // 1 pip minimum spread
  private maxSpread = 0.00030; // 3 pips maximum spread
  private lookbackPeriods = {
    vwap: 20,
    ema: [5, 13, 21],
    rsi: 7,
    atr: 14
  };
  private thresholds = {
    rsiOverbought: 70,
    rsiOversold: 30,
    volumeThreshold: 100000,
    minVolatility: 0.00010,
    maxVolatility: 0.00100
  };

  public async analyze(connection: any): Promise<TradeSignal | null> {
    if (!connection) {
      console.error('No connection provided to Scalping Strategy');
      return null;
    }

    try {
      // Get current price and spread
      const currentPrice = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(currentPrice)) {
        return null;
      }

      // Check spread conditions
      const spread = currentPrice.ask - currentPrice.bid;
      if (!this.isSpreadValid(spread)) {
        return null;
      }

      // Get recent candles with volume
      const candles = await connection.getCandles(this.symbol, '1m', Math.max(...this.lookbackPeriods.ema));
      if (!this.validateCandles(candles)) {
        return null;
      }

      // Calculate technical indicators
      const closes = candles.map(c => parseFloat(c.close));
      const volumes = candles.map(c => parseFloat(c.volume));
      const highs = candles.map(c => parseFloat(c.high));
      const lows = candles.map(c => parseFloat(c.low));

      const indicators = {
        ema: this.calculateMultipleEMA(closes),
        rsi: this.calculateRSI(closes),
        vwap: this.calculateVWAP(closes, volumes),
        atr: this.calculateATR(highs, lows, closes),
        momentum: this.calculateMomentum(closes)
      };

      // Generate trading signal
      return this.generateSignal(currentPrice, indicators);

    } catch (error) {
      console.error('Scalping strategy analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    if (!price || typeof price !== 'object') {
      console.error('Invalid price object');
      return false;
    }

    if (typeof price.bid !== 'number' || typeof price.ask !== 'number') {
      console.error('Price bid/ask must be numbers');
      return false;
    }

    if (price.bid <= 0 || price.ask <= 0) {
      console.error('Price values must be positive');
      return false;
    }

    if (price.ask <= price.bid) {
      console.error('Ask price must be greater than bid price');
      return false;
    }

    return true;
  }

  private isSpreadValid(spread: number): boolean {
    return spread >= this.minSpread && spread <= this.maxSpread;
  }

  private validateCandles(candles: any): boolean {
    if (!Array.isArray(candles) || candles.length < Math.max(...this.lookbackPeriods.ema)) {
      console.error('Insufficient candle data');
      return false;
    }

    const validCandle = (c: any) => (
      c && typeof c === 'object' &&
      typeof parseFloat(c.close) === 'number' &&
      typeof parseFloat(c.volume) === 'number' &&
      typeof parseFloat(c.high) === 'number' &&
      typeof parseFloat(c.low) === 'number' &&
      !isNaN(parseFloat(c.close)) &&
      !isNaN(parseFloat(c.volume)) &&
      !isNaN(parseFloat(c.high)) &&
      !isNaN(parseFloat(c.low))
    );

    return candles.every(validCandle);
  }

  private calculateEMA(prices: number[], period: number): number[] {
    const multiplier = 2 / (period + 1);
    const ema = [prices[0]];

    for (let i = 1; i < prices.length; i++) {
      ema.push((prices[i] - ema[i - 1]) * multiplier + ema[i - 1]);
    }

    return ema;
  }

  private calculateMultipleEMA(prices: number[]): { [key: number]: number[] } {
    const emaResults: { [key: number]: number[] } = {};
    this.lookbackPeriods.ema.forEach(period => {
      emaResults[period] = this.calculateEMA(prices, period);
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

  private calculateVWAP(prices: number[], volumes: number[]): number[] {
    const period = this.lookbackPeriods.vwap;
    const vwap = [];
    
    for (let i = period - 1; i < prices.length; i++) {
      const periodPrices = prices.slice(i - period + 1, i + 1);
      const periodVolumes = volumes.slice(i - period + 1, i + 1);
      
      const sumPV = periodPrices.reduce((sum, price, idx) => sum + price * periodVolumes[idx], 0);
      const sumV = periodVolumes.reduce((sum, volume) => sum + volume, 0);
      
      vwap.push(sumPV / (sumV || 1));
    }

    return vwap;
  }

  private calculateATR(highs: number[], lows: number[], closes: number[]): number {
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

    const atr = tr.slice(0, period).reduce((a, b) => a + b) / period;
    return atr;
  }

  private calculateMomentum(prices: number[]): number {
    const current = prices[prices.length - 1];
    const previous = prices[prices.length - 2];
    return (current - previous) / previous;
  }

  private generateSignal(
    currentPrice: { bid: number; ask: number },
    indicators: {
      ema: { [key: number]: number[] };
      rsi: number[];
      vwap: number[];
      atr: number;
      momentum: number;
    }
  ): TradeSignal | null {
    try {
      const lastEMA5 = indicators.ema[5][indicators.ema[5].length - 1];
      const lastEMA13 = indicators.ema[13][indicators.ema[13].length - 1];
      const lastEMA21 = indicators.ema[21][indicators.ema[21].length - 1];
      const lastRSI = indicators.rsi[indicators.rsi.length - 1];
      const lastVWAP = indicators.vwap[indicators.vwap.length - 1];

      // Buy conditions
      const buyConditions = 
        lastEMA5 > lastEMA13 && // Fast EMA above medium EMA
        lastEMA13 > lastEMA21 && // Medium EMA above slow EMA
        lastRSI < this.thresholds.rsiOversold && // Oversold condition
        currentPrice.ask < lastVWAP && // Price below VWAP
        indicators.momentum > 0 && // Positive momentum
        indicators.atr >= this.thresholds.minVolatility && // Sufficient volatility
        indicators.atr <= this.thresholds.maxVolatility; // Not too volatile

      // Sell conditions
      const sellConditions = 
        lastEMA5 < lastEMA13 && // Fast EMA below medium EMA
        lastEMA13 < lastEMA21 && // Medium EMA below slow EMA
        lastRSI > this.thresholds.rsiOverbought && // Overbought condition
        currentPrice.bid > lastVWAP && // Price above VWAP
        indicators.momentum < 0 && // Negative momentum
        indicators.atr >= this.thresholds.minVolatility && // Sufficient volatility
        indicators.atr <= this.thresholds.maxVolatility; // Not too volatile

      if (buyConditions) {
        return {
          type: 'buy',
          symbol: this.symbol,
          volume: this.volume,
          stopLoss: this.calculateStopLoss('buy', currentPrice.ask),
          takeProfit: this.calculateTakeProfit('buy', currentPrice.ask)
        };
      }

      if (sellConditions) {
        return {
          type: 'sell',
          symbol: this.symbol,
          volume: this.volume,
          stopLoss: this.calculateStopLoss('sell', currentPrice.bid),
          takeProfit: this.calculateTakeProfit('sell', currentPrice.bid)
        };
      }

      return null;
    } catch (error) {
      console.error('Signal generation error:', error);
      return null;
    }
  }

  private calculateStopLoss(type: 'buy' | 'sell', price: number): number {
    const pipsToPrice = this.stopLossPips * this.pipSize;
    return type === 'buy'
      ? Math.round((price - pipsToPrice) * 100000) / 100000
      : Math.round((price + pipsToPrice) * 100000) / 100000;
  }

  private calculateTakeProfit(type: 'buy' | 'sell', price: number): number {
    const pipsToPrice = this.takeProfitPips * this.pipSize;
    return type === 'buy'
      ? Math.round((price + pipsToPrice) * 100000) / 100000
      : Math.round((price - pipsToPrice) * 100000) / 100000;
  }
}