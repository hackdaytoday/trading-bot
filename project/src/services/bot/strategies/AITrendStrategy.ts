import { Strategy, TradeSignal } from '../types';

export class AITrendStrategy implements Strategy {
  public name = 'AI Trend Master';
  public symbol = 'EURUSD';
  public interval = 15000; // 15 second interval
  public volume = 0.01;

  private lookbackPeriods = {
    ema: [8, 21, 55],
    rsi: 14,
    momentum: 10,
    volatility: 20
  };

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) return null;

      const candles = await connection.getCandles(this.symbol, '5m', 60);
      if (!this.validateCandles(candles)) return null;

      // Calculate technical indicators
      const closes = candles.map(c => c.close);
      const highs = candles.map(c => c.high);
      const lows = candles.map(c => c.low);

      const indicators = {
        ema: this.calculateMultipleEMA(closes),
        rsi: this.calculateRSI(closes),
        momentum: this.calculateMomentum(closes),
        volatility: this.calculateVolatility(highs, lows)
      };

      // AI-based signal generation
      return this.generateSignal(price, indicators);
    } catch (error) {
      console.error('AI Trend analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return price && typeof price.bid === 'number' && typeof price.ask === 'number';
  }

  private validateCandles(candles: any[]): boolean {
    return Array.isArray(candles) && candles.length >= Math.max(...this.lookbackPeriods.ema);
  }

  private calculateMultipleEMA(prices: number[]): { [key: number]: number[] } {
    const emaResults: { [key: number]: number[] } = {};
    this.lookbackPeriods.ema.forEach(period => {
      emaResults[period] = this.calculateEMA(prices, period);
    });
    return emaResults;
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
    
    const avgGain = gains.slice(-this.lookbackPeriods.rsi).reduce((a, b) => a + b) / this.lookbackPeriods.rsi;
    const avgLoss = losses.slice(-this.lookbackPeriods.rsi).reduce((a, b) => a + b) / this.lookbackPeriods.rsi;
    
    return 100 - (100 / (1 + avgGain / (avgLoss || 1)));
  }

  private calculateMomentum(prices: number[]): number {
    const period = this.lookbackPeriods.momentum;
    return (prices[prices.length - 1] - prices[prices.length - period]) / prices[prices.length - period] * 100;
  }

  private calculateVolatility(highs: number[], lows: number[]): number {
    const period = this.lookbackPeriods.volatility;
    const ranges = highs.slice(-period).map((high, i) => high - lows[i]);
    return ranges.reduce((a, b) => a + b) / period;
  }

  private generateSignal(
    price: { bid: number; ask: number },
    indicators: {
      ema: { [key: number]: number[] };
      rsi: number;
      momentum: number;
      volatility: number;
    }
  ): TradeSignal | null {
    const lastEMA8 = indicators.ema[8][indicators.ema[8].length - 1];
    const lastEMA21 = indicators.ema[21][indicators.ema[21].length - 1];
    const lastEMA55 = indicators.ema[55][indicators.ema[55].length - 1];

    // Buy conditions
    const buyConditions = 
      lastEMA8 > lastEMA21 && // Short-term trend up
      lastEMA21 > lastEMA55 && // Medium-term trend up
      indicators.rsi < 30 && // Oversold
      indicators.momentum > 0 && // Positive momentum
      indicators.volatility > 0.0001; // Sufficient volatility

    // Sell conditions
    const sellConditions = 
      lastEMA8 < lastEMA21 && // Short-term trend down
      lastEMA21 < lastEMA55 && // Medium-term trend down
      indicators.rsi > 70 && // Overbought
      indicators.momentum < 0 && // Negative momentum
      indicators.volatility > 0.0001; // Sufficient volatility

    if (buyConditions) {
      return {
        type: 'buy',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: price.ask - indicators.volatility * 2,
        takeProfit: price.ask + indicators.volatility * 3
      };
    }

    if (sellConditions) {
      return {
        type: 'sell',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: price.bid + indicators.volatility * 2,
        takeProfit: price.bid - indicators.volatility * 3
      };
    }

    return null;
  }
}