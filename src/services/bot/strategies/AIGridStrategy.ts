import { Strategy, TradeSignal } from '../types';

export class AIGridStrategy implements Strategy {
  public name = 'AI Grid Master';
  public symbol = 'EURUSD';
  public interval = 30000; // 30 second interval
  public volume = 0.01;

  private config = {
    gridLevels: 10,
    gridSpacing: 0.0010, // 10 pips
    maxPositions: 5,
    volatilityPeriod: 20,
    minVolatility: 0.0005,
    maxVolatility: 0.0050
  };

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) return null;

      const positions = await connection.getPositions();
      if (positions.length >= this.config.maxPositions) return null;

      const candles = await connection.getCandles(this.symbol, '5m', 50);
      if (!this.validateCandles(candles)) return null;

      const indicators = {
        volatility: this.calculateVolatility(candles),
        gridLevels: this.calculateGridLevels(price),
        momentum: this.calculateMomentum(candles)
      };

      return this.generateSignal(price, indicators, positions);
    } catch (error) {
      console.error('AI Grid analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return price && typeof price.bid === 'number' && typeof price.ask === 'number';
  }

  private validateCandles(candles: any[]): boolean {
    return Array.isArray(candles) && candles.length >= this.config.volatilityPeriod;
  }

  private calculateVolatility(candles: any[]): number {
    const period = this.config.volatilityPeriod;
    const highs = candles.slice(-period).map(c => c.high);
    const lows = candles.slice(-period).map(c => c.low);
    const ranges = highs.map((high, i) => high - lows[i]);
    return ranges.reduce((sum, range) => sum + range, 0) / period;
  }

  private calculateGridLevels(price: { bid: number; ask: number }): {
    buyLevels: number[];
    sellLevels: number[];
  } {
    const currentPrice = (price.ask + price.bid) / 2;
    const spacing = this.config.gridSpacing;
    const levels = this.config.gridLevels;

    const buyLevels = Array.from({ length: levels }, (_, i) => 
      currentPrice - spacing * (i + 1)
    );

    const sellLevels = Array.from({ length: levels }, (_, i) => 
      currentPrice + spacing * (i + 1)
    );

    return { buyLevels, sellLevels };
  }

  private calculateMomentum(candles: any[]): number {
    const closes = candles.map(c => c.close);
    const current = closes[closes.length - 1];
    const previous = closes[closes.length - 10];
    return (current - previous) / previous * 100;
  }

  private generateSignal(
    price: { bid: number; ask: number },
    indicators: {
      volatility: number;
      gridLevels: { buyLevels: number[]; sellLevels: number[] };
      momentum: number;
    },
    positions: any[]
  ): TradeSignal | null {
    // Check if volatility is within acceptable range
    if (
      indicators.volatility < this.config.minVolatility ||
      indicators.volatility > this.config.maxVolatility
    ) {
      return null;
    }

    const currentPrice = (price.ask + price.bid) / 2;

    // Find nearest grid levels
    const nearestBuyLevel = indicators.gridLevels.buyLevels.find(level => 
      Math.abs(currentPrice - level) < this.config.gridSpacing / 2
    );

    const nearestSellLevel = indicators.gridLevels.sellLevels.find(level => 
      Math.abs(currentPrice - level) < this.config.gridSpacing / 2
    );

    // Check existing positions at these levels
    const existingBuyPositions = positions.filter(p => 
      p.type === 'buy' && Math.abs(p.openPrice - (nearestBuyLevel || 0)) < this.config.gridSpacing / 4
    );

    const existingSellPositions = positions.filter(p => 
      p.type === 'sell' && Math.abs(p.openPrice - (nearestSellLevel || 0)) < this.config.gridSpacing / 4
    );

    // Generate signals based on grid levels and momentum
    if (nearestBuyLevel && existingBuyPositions.length === 0 && indicators.momentum < 0) {
      return {
        type: 'buy',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: nearestBuyLevel - this.config.gridSpacing,
        takeProfit: nearestBuyLevel + this.config.gridSpacing
      };
    }

    if (nearestSellLevel && existingSellPositions.length === 0 && indicators.momentum > 0) {
      return {
        type: 'sell',
        symbol: this.symbol,
        volume: this.volume,
        stopLoss: nearestSellLevel + this.config.gridSpacing,
        takeProfit: nearestSellLevel - this.config.gridSpacing
      };
    }

    return null;
  }
}