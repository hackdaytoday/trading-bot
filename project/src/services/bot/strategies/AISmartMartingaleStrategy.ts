import { Strategy, TradeSignal } from '../types';

export class AISmartMartingaleStrategy implements Strategy {
  public name = 'AI Smart Martingale';
  public symbol = 'EURUSD';
  public interval = 8000; // 8 second interval
  public volume = 0.01;

  private baseVolume = 0.01;
  private currentVolume = 0.01;
  private maxVolume = 0.5;
  private consecutiveLosses = 0;
  private maxConsecutiveLosses = 5;

  private config = {
    baseMultiplier: 1.8,
    riskAdjustmentFactor: 0.8,
    minProfit: 15, // pips
    maxSpread: 0.0003,
    volatilityThreshold: 0.0004,
    momentumThreshold: 0.2,
    rsiOverbought: 70,
    rsiOversold: 30,
    trendStrengthThreshold: 25
  };

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) return null;

      const candles = await connection.getCandles(this.symbol, '1m', 30);
      if (!this.validateCandles(candles)) return null;

      // Calculate market conditions
      const indicators = {
        volatility: this.calculateVolatility(candles),
        momentum: this.calculateMomentum(candles),
        rsi: this.calculateRSI(candles),
        trendStrength: this.calculateTrendStrength(candles)
      };

      // Check if market conditions are suitable
      if (!this.isMarketSuitable(indicators, price.ask - price.bid)) {
        this.resetStrategy();
        return null;
      }

      // Generate AI-optimized trading signal
      return this.generateSignal(price, indicators);

    } catch (error) {
      console.error('Smart Martingale analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return (
      price &&
      typeof price.bid === 'number' &&
      typeof price.ask === 'number' &&
      price.ask - price.bid <= this.config.maxSpread
    );
  }

  private validateCandles(candles: any[]): boolean {
    return Array.isArray(candles) && candles.length >= 30;
  }

  private calculateVolatility(candles: any[]): number {
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    const ranges = highs.map((h, i) => h - lows[i]);
    return ranges.reduce((sum, range) => sum + range, 0) / ranges.length;
  }

  private calculateMomentum(candles: any[]): number {
    const closes = candles.map(c => c.close);
    const period = 14;
    const momentum = (closes[closes.length - 1] - closes[closes.length - period]) / 
                    closes[closes.length - period] * 100;
    return momentum;
  }

  private calculateRSI(candles: any[]): number {
    const closes = candles.map(c => c.close);
    const period = 14;
    const changes = closes.slice(1).map((price, i) => price - closes[i]);
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? -change : 0);
    
    const avgGain = gains.slice(-period).reduce((a, b) => a + b) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b) / period;
    
    return 100 - (100 / (1 + avgGain / (avgLoss || 1)));
  }

  private calculateTrendStrength(candles: any[]): number {
    const closes = candles.map(c => c.close);
    const sma20 = this.calculateSMA(closes, 20);
    const sma50 = this.calculateSMA(closes, 50);
    
    return Math.abs((sma20 - sma50) / sma50 * 100);
  }

  private calculateSMA(data: number[], period: number): number {
    return data.slice(-period).reduce((sum, val) => sum + val, 0) / period;
  }

  private isMarketSuitable(
    indicators: {
      volatility: number;
      momentum: number;
      rsi: number;
      trendStrength: number;
    },
    spread: number
  ): boolean {
    return (
      indicators.volatility <= this.config.volatilityThreshold &&
      spread <= this.config.maxSpread &&
      this.consecutiveLosses < this.maxConsecutiveLosses &&
      indicators.trendStrength >= this.config.trendStrengthThreshold
    );
  }

  private calculateRiskAdjustedVolume(): number {
    const riskMultiplier = this.consecutiveLosses === 0 
      ? 1 
      : Math.pow(this.config.baseMultiplier, this.consecutiveLosses) * this.config.riskAdjustmentFactor;

    return Math.min(
      this.baseVolume * riskMultiplier,
      this.maxVolume
    );
  }

  private resetStrategy(): void {
    this.currentVolume = this.baseVolume;
    this.consecutiveLosses = 0;
  }

  private generateSignal(
    price: { bid: number; ask: number },
    indicators: {
      volatility: number;
      momentum: number;
      rsi: number;
      trendStrength: number;
    }
  ): TradeSignal | null {
    // Calculate AI-adjusted volume
    this.currentVolume = this.calculateRiskAdjustedVolume();

    // Calculate dynamic take profit and stop loss based on market conditions
    const pipSize = 0.0001;
    const volatilityFactor = indicators.volatility / pipSize;
    const takeProfitPips = Math.max(
      this.config.minProfit,
      Math.round(volatilityFactor * (1 + this.consecutiveLosses * 0.2))
    );
    const stopLossPips = Math.round(takeProfitPips * 1.5);

    // Generate signal based on market conditions
    if (
      indicators.momentum > this.config.momentumThreshold &&
      indicators.rsi < this.config.rsiOversold
    ) {
      return {
        type: 'buy',
        symbol: this.symbol,
        volume: this.currentVolume,
        stopLoss: price.ask - stopLossPips * pipSize,
        takeProfit: price.ask + takeProfitPips * pipSize
      };
    }

    if (
      indicators.momentum < -this.config.momentumThreshold &&
      indicators.rsi > this.config.rsiOverbought
    ) {
      return {
        type: 'sell',
        symbol: this.symbol,
        volume: this.currentVolume,
        stopLoss: price.bid + stopLossPips * pipSize,
        takeProfit: price.bid - takeProfitPips * pipSize
      };
    }

    return null;
  }
}