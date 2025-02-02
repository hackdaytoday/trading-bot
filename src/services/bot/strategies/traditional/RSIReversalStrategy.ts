import { Strategy, TradeSignal } from '../../types';
import { EventEmitter } from 'events';

export class RSIReversalStrategy extends EventEmitter implements Strategy {
  public name = 'RSI Reversal';
  public symbol = 'EURUSD';
  public interval = 10000; // 10 second interval
  public volume = 0.01;

  private config = {
    rsiPeriod: 14,
    oversold: 30,
    overbought: 70,
    confirmationPeriod: 3,
    atrPeriod: 14,
    stopLossMultiplier: 1.5,
    takeProfitMultiplier: 2.0
  };

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) return null;

      const candles = await connection.getCandles(this.symbol, '5m', this.config.rsiPeriod + 5);
      if (!this.validateCandles(candles)) return null;

      const closes = candles.map(c => c.close);
      const rsi = this.calculateRSI(closes);
      const atr = this.calculateATR(candles);

      // Check for reversal signals
      const signal = this.detectReversal(rsi);
      if (!signal) return null;

      return this.generateSignal(price, signal, atr);
    } catch (error) {
      console.error('RSI Reversal analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return price && typeof price.bid === 'number' && typeof price.ask === 'number';
  }

  private validateCandles(candles: any[]): boolean {
    return Array.isArray(candles) && candles.length >= this.config.rsiPeriod;
  }

  private calculateRSI(prices: number[]): number[] {
    const period = this.config.rsiPeriod;
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

  private detectReversal(rsi: number[]): 'buy' | 'sell' | null {
    const current = rsi[rsi.length - 1];
    const previous = rsi[rsi.length - 2];

    // Oversold to bullish reversal
    if (previous < this.config.oversold && current > this.config.oversold) {
      return 'buy';
    }

    // Overbought to bearish reversal
    if (previous > this.config.overbought && current < this.config.overbought) {
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