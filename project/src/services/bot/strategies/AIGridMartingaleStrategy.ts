import { Strategy, TradeSignal } from '../types';

export class AIGridMartingaleStrategy implements Strategy {
  public name = 'AI Grid Martingale';
  public symbol = 'EURUSD';
  public interval = 10000; // 10 second interval
  public volume = 0.01;

  private config = {
    gridLevels: 5,
    gridSpacing: 0.0020, // 20 pips between levels
    volumeMultiplier: 2.0,
    maxVolume: 1.0,
    minVolatility: 0.0005,
    maxVolatility: 0.0050,
    minSpread: 0.0001,
    maxSpread: 0.0003
  };

  private gridState = {
    basePrice: 0,
    levels: new Map<number, {
      price: number;
      volume: number;
      type: 'buy' | 'sell';
    }>()
  };

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) return null;

      const candles = await connection.getCandles(this.symbol, '5m', 20);
      if (!this.validateCandles(candles)) return null;

      // Calculate market conditions
      const volatility = this.calculateVolatility(candles);
      const trend = this.analyzeTrend(candles);

      // Check if market conditions are suitable
      if (!this.isMarketSuitable(volatility, price.ask - price.bid)) {
        return null;
      }

      // Initialize or update grid levels
      this.updateGridLevels(price);

      // Generate trading signal based on grid positions
      return this.generateSignal(price, volatility, trend);

    } catch (error) {
      console.error('Grid Martingale analysis error:', error);
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return (
      price &&
      typeof price.bid === 'number' &&
      typeof price.ask === 'number' &&
      price.ask - price.bid >= this.config.minSpread &&
      price.ask - price.bid <= this.config.maxSpread
    );
  }

  private validateCandles(candles: any[]): boolean {
    return Array.isArray(candles) && candles.length >= 20;
  }

  private calculateVolatility(candles: any[]): number {
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    const ranges = highs.map((h, i) => h - lows[i]);
    return ranges.reduce((sum, range) => sum + range, 0) / ranges.length;
  }

  private analyzeTrend(candles: any[]): 'up' | 'down' | 'sideways' {
    const closes = candles.map(c => c.close);
    const sma5 = this.calculateSMA(closes, 5);
    const sma20 = this.calculateSMA(closes, 20);

    if (sma5 > sma20 * 1.001) return 'up';
    if (sma5 < sma20 * 0.999) return 'down';
    return 'sideways';
  }

  private calculateSMA(data: number[], period: number): number {
    return data.slice(-period).reduce((sum, val) => sum + val, 0) / period;
  }

  private isMarketSuitable(volatility: number, spread: number): boolean {
    return (
      volatility >= this.config.minVolatility &&
      volatility <= this.config.maxVolatility &&
      spread >= this.config.minSpread &&
      spread <= this.config.maxSpread
    );
  }

  private updateGridLevels(price: { bid: number; ask: number }): void {
    const currentPrice = (price.bid + price.ask) / 2;

    // Initialize grid if not set
    if (this.gridState.basePrice === 0) {
      this.gridState.basePrice = currentPrice;
      this.initializeGrid(currentPrice);
      return;
    }

    // Update grid if price moves significantly
    if (Math.abs(currentPrice - this.gridState.basePrice) > this.config.gridSpacing * 2) {
      this.gridState.basePrice = currentPrice;
      this.initializeGrid(currentPrice);
    }
  }

  private initializeGrid(basePrice: number): void {
    this.gridState.levels.clear();

    // Create buy levels below current price
    for (let i = 1; i <= this.config.gridLevels; i++) {
      const level = basePrice - (this.config.gridSpacing * i);
      const volume = Math.min(
        this.volume * Math.pow(this.config.volumeMultiplier, i - 1),
        this.config.maxVolume
      );

      this.gridState.levels.set(-i, {
        price: level,
        volume,
        type: 'buy'
      });
    }

    // Create sell levels above current price
    for (let i = 1; i <= this.config.gridLevels; i++) {
      const level = basePrice + (this.config.gridSpacing * i);
      const volume = Math.min(
        this.volume * Math.pow(this.config.volumeMultiplier, i - 1),
        this.config.maxVolume
      );

      this.gridState.levels.set(i, {
        price: level,
        volume,
        type: 'sell'
      });
    }
  }

  private generateSignal(
    price: { bid: number; ask: number },
    volatility: number,
    trend: 'up' | 'down' | 'sideways'
  ): TradeSignal | null {
    const currentPrice = (price.bid + price.ask) / 2;

    // Find the closest grid level
    let closestLevel: { 
      distance: number;
      level: number;
      details: { price: number; volume: number; type: 'buy' | 'sell' };
    } | null = null;

    for (const [level, details] of this.gridState.levels.entries()) {
      const distance = Math.abs(currentPrice - details.price);
      
      if (!closestLevel || distance < closestLevel.distance) {
        closestLevel = { distance, level, details };
      }
    }

    if (!closestLevel || closestLevel.distance > this.config.gridSpacing / 2) {
      return null;
    }

    // Generate signal based on the closest level
    const { details } = closestLevel;
    const takeProfitDistance = this.config.gridSpacing;
    const stopLossDistance = this.config.gridSpacing * 2;

    if (details.type === 'buy' && trend !== 'down') {
      return {
        type: 'buy',
        symbol: this.symbol,
        volume: details.volume,
        stopLoss: price.ask - stopLossDistance,
        takeProfit: price.ask + takeProfitDistance
      };
    }

    if (details.type === 'sell' && trend !== 'up') {
      return {
        type: 'sell',
        symbol: this.symbol,
        volume: details.volume,
        stopLoss: price.bid + stopLossDistance,
        takeProfit: price.bid - takeProfitDistance
      };
    }

    return null;
  }
}