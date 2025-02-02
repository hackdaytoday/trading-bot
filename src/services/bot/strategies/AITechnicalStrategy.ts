import { Strategy, TradeSignal } from '../types';
import { EventEmitter } from 'events';

export class AITechnicalStrategy extends EventEmitter implements Strategy {
  public name = 'AI Technical Analysis';
  public symbol = 'EURUSD';
  public interval = 5000; // 5 second interval
  public volume = 0.01;

  private lastRSI: number | null = null;
  private lastMACD: any = null;
  private lastBollinger: any = null;

  constructor() {
    super();
    this.setMaxListeners(20);
  }

  public getRSI(): number | null {
    return this.lastRSI;
  }

  public getMACD(): any {
    return this.lastMACD;
  }

  public getBollinger(): any {
    return this.lastBollinger;
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return price && typeof price.bid === 'number' && typeof price.ask === 'number';
  }

  private validateCandles(candles: any[]): boolean {
    return Array.isArray(candles) && candles.length >= 20;
  }

  private calculateRSI(prices: number[]): number {
    const period = 14;
    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? -change : 0);
    
    const avgGain = gains.slice(-period).reduce((a, b) => a + b) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b) / period;
    
    return 100 - (100 / (1 + avgGain / (avgLoss || 1)));
  }

  private calculateMACD(prices: number[]): any {
    const fastPeriod = 12;
    const slowPeriod = 26;
    const signalPeriod = 9;

    const fastEMA = this.calculateEMA(prices, fastPeriod);
    const slowEMA = this.calculateEMA(prices, slowPeriod);
    const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
    const signalLine = this.calculateEMA(macdLine, signalPeriod);
    
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

  private calculateBollinger(prices: number[]): any {
    const period = 20;
    const stdDev = 2;
    
    const sma = prices.slice(-period).reduce((a, b) => a + b) / period;
    const variance = prices.slice(-period)
      .map(price => Math.pow(price - sma, 2))
      .reduce((a, b) => a + b) / period;
    const standardDeviation = Math.sqrt(variance);
    
    return {
      upper: sma + standardDeviation * stdDev,
      middle: sma,
      lower: sma - standardDeviation * stdDev
    };
  }

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      if (!connection) {
        throw new Error('No connection available');
      }

      // For development, use mock data
      if (process.env.NODE_ENV === 'development') {
        return this.generateMockSignal();
      }

      // Get price using the correct API method
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) {
        throw new Error('Invalid price data');
      }

      const candles = await connection.getCandles(this.symbol, '5m', 50);
      if (!this.validateCandles(candles)) {
        throw new Error('Invalid candle data');
      }

      // Calculate technical indicators
      const closes = candles.map(c => c.close);
      this.lastRSI = this.calculateRSI(closes);
      this.lastMACD = this.calculateMACD(closes);
      this.lastBollinger = this.calculateBollinger(closes);

      // Generate signal based on indicators
      return this.generateSignal(price);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Technical analysis error';
      this.emit('error', { message });
      console.error('Technical analysis error:', message);
      return null;
    }
  }

  private generateSignal(price: { bid: number; ask: number }): TradeSignal | null {
    if (!this.lastRSI || !this.lastMACD || !this.lastBollinger) {
      return null;
    }

    // Buy conditions
    const buyConditions = 
      this.lastRSI < 30 && // Oversold
      this.lastMACD.histogram > 0 && // Positive momentum
      price.ask < this.lastBollinger.lower; // Price below lower band

    // Sell conditions
    const sellConditions = 
      this.lastRSI > 70 && // Overbought
      this.lastMACD.histogram < 0 && // Negative momentum
      price.bid > this.lastBollinger.upper; // Price above upper band

    if (buyConditions) {
      return {
        type: 'buy',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: price.ask - (this.lastBollinger.upper - this.lastBollinger.lower),
        takeProfit: price.ask + (this.lastBollinger.upper - this.lastBollinger.lower) * 1.5
      };
    }

    if (sellConditions) {
      return {
        type: 'sell',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: price.bid + (this.lastBollinger.upper - this.lastBollinger.lower),
        takeProfit: price.bid - (this.lastBollinger.upper - this.lastBollinger.lower) * 1.5
      };
    }

    return null;
  }

  private generateMockSignal(): TradeSignal | null {
    const mockPrice = { bid: 1.1000, ask: 1.1001 };
    this.lastRSI = 25;
    this.lastMACD = { macd: 0.0002, signal: 0.0001, histogram: 0.0001 };
    this.lastBollinger = {
      upper: 1.1020,
      middle: 1.1000,
      lower: 1.0980
    };
    return this.generateSignal(mockPrice);
  }
}