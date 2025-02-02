import { Strategy, TradeSignal } from '../types';

export class GoldStrategy implements Strategy {
  public name = 'Gold Trading Strategy';
  public symbol = 'XAUUSD';
  public interval = 1000;
  public volume = 0.01;
  
  // Gold-specific settings
  private stopLossPips = 100; // Wider stop loss for gold
  private takeProfitPips = 200; // Wider take profit for gold
  private pipSize = 0.01; // Gold pip size is 0.01
  private lookbackPeriod = 20;
  private minSpread = 0.20; // 20 cents minimum spread
  private maxSpread = 0.80; // 80 cents maximum spread

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      // Get current price
      const currentPrice = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(currentPrice)) {
        return null;
      }

      // Get recent prices for analysis
      const candles = await connection.getCandles(this.symbol, '1m', this.lookbackPeriod);
      if (!this.validateCandles(candles)) {
        return null;
      }

      // Calculate technical indicators
      const { trend, strength } = this.analyzeTrend(candles);
      const momentum = this.calculateMomentum(candles);
      const volatility = this.calculateVolatility(candles);

      // Generate trading signal based on analysis
      return this.generateSignal(currentPrice, trend, strength, momentum, volatility);
    } catch (error) {
      console.error('Gold strategy analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return (
      price &&
      typeof price.bid === 'number' &&
      typeof price.ask === 'number' &&
      price.bid > 0 &&
      price.ask > 0 &&
      price.ask > price.bid
    );
  }

  private validateCandles(candles: any): boolean {
    return Array.isArray(candles) && candles.length >= this.lookbackPeriod;
  }

  private analyzeTrend(candles: any[]): { trend: 'up' | 'down' | 'sideways'; strength: number } {
    const closes = candles.map(c => c.close);
    const sma5 = this.calculateSMA(closes, 5);
    const sma20 = this.calculateSMA(closes, 20);
    
    const lastClose = closes[closes.length - 1];
    const lastSMA5 = sma5[sma5.length - 1];
    const lastSMA20 = sma20[sma20.length - 1];

    let trend: 'up' | 'down' | 'sideways' = 'sideways';
    let strength = 0;

    if (lastSMA5 > lastSMA20) {
      trend = 'up';
      strength = (lastSMA5 - lastSMA20) / lastSMA20;
    } else if (lastSMA5 < lastSMA20) {
      trend = 'down';
      strength = (lastSMA20 - lastSMA5) / lastSMA20;
    }

    return { trend, strength };
  }

  private calculateMomentum(candles: any[]): number {
    const closes = candles.map(c => c.close);
    const lookback = 10;
    const current = closes[closes.length - 1];
    const previous = closes[closes.length - lookback];
    return (current - previous) / previous;
  }

  private calculateVolatility(candles: any[]): number {
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    const ranges = highs.map((h, i) => h - lows[i]);
    return this.calculateSMA(ranges, 5)[0];
  }

  private calculateSMA(data: number[], period: number): number[] {
    const sma = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  }

  private generateSignal(
    currentPrice: { bid: number; ask: number },
    trend: 'up' | 'down' | 'sideways',
    strength: number,
    momentum: number,
    volatility: number
  ): TradeSignal | null {
    // Check if market conditions are suitable
    if (trend === 'sideways' || strength < 0.001 || volatility > 2.0) {
      return null;
    }

    // Generate buy signal
    if (trend === 'up' && momentum > 0 && strength > 0.001) {
      return {
        type: 'buy',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: this.calculateStopLoss('buy', currentPrice.ask),
        takeProfit: this.calculateTakeProfit('buy', currentPrice.ask)
      };
    }

    // Generate sell signal
    if (trend === 'down' && momentum < 0 && strength > 0.001) {
      return {
        type: 'sell',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: this.calculateStopLoss('sell', currentPrice.bid),
        takeProfit: this.calculateTakeProfit('sell', currentPrice.bid)
      };
    }

    return null;
  }

  private calculateStopLoss(type: 'buy' | 'sell', price: number): number {
    const pipsToPrice = this.stopLossPips * this.pipSize;
    return type === 'buy'
      ? Math.round((price - pipsToPrice) * 100) / 100
      : Math.round((price + pipsToPrice) * 100) / 100;
  }

  private calculateTakeProfit(type: 'buy' | 'sell', price: number): number {
    const pipsToPrice = this.takeProfitPips * this.pipSize;
    return type === 'buy'
      ? Math.round((price + pipsToPrice) * 100) / 100
      : Math.round((price - pipsToPrice) * 100) / 100;
  }
}