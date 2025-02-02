import { Strategy, TradeSignal } from '../../types';
import { EventEmitter } from 'events';

interface GridLevel {
  price: number;
  volume: number;
  type: 'buy' | 'sell';
  active: boolean;
}

interface GridConfig {
  levels: number;
  baseVolume: number;
  volumeMultiplier: number;
  maxVolume: number;
  gridSpacing: number;
  maxExposure: number;
  rebalanceThreshold: number;
}

export class HybridGridGamblingStrategy extends EventEmitter implements Strategy {
  public name = 'Hybrid Grid Gambling';
  public symbol = 'EURUSD';
  public interval = 5000; // 5 second interval
  public volume = 0.01;

  private config: GridConfig = {
    levels: 10,
    baseVolume: 0.01,
    volumeMultiplier: 1.5,
    maxVolume: 1.0,
    gridSpacing: 0.0020, // 20 pips
    maxExposure: 5.0, // Maximum total volume
    rebalanceThreshold: 0.5 // 50% of levels filled
  };

  private gridLevels: GridLevel[] = [];
  private basePrice: number = 0;
  private totalExposure: number = 0;
  private activePositions: number = 0;

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      // Get current price
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) {
        return null;
      }

      // Initialize or update grid
      if (this.gridLevels.length === 0 || this.shouldRebalanceGrid(price)) {
        await this.initializeGrid(price, connection);
      }

      // Check exposure limits
      if (this.totalExposure >= this.config.maxExposure) {
        this.emit('max_exposure_reached', {
          exposure: this.totalExposure,
          limit: this.config.maxExposure
        });
        return null;
      }

      // Generate trading signal based on grid levels
      return this.generateSignal(price);

    } catch (error) {
      this.emit('error', {
        strategy: this.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    }
  }

  private validatePrice(price: any): price is { bid: number; ask: number } {
    return (
      price &&
      typeof price.bid === 'number' &&
      typeof price.ask === 'number' &&
      price.bid > 0 &&
      price.ask > 0
    );
  }

  private async initializeGrid(
    price: { bid: number; ask: number },
    connection: any
  ): void {
    this.basePrice = (price.bid + price.ask) / 2;
    this.gridLevels = [];

    // Get market volatility for dynamic grid spacing
    const volatility = await this.calculateVolatility(connection);
    const dynamicSpacing = Math.max(
      this.config.gridSpacing,
      volatility * 2
    );

    // Create buy levels below current price
    for (let i = 1; i <= this.config.levels; i++) {
      const levelPrice = this.basePrice - (dynamicSpacing * i);
      const volume = Math.min(
        this.config.baseVolume * Math.pow(this.config.volumeMultiplier, i - 1),
        this.config.maxVolume
      );

      this.gridLevels.push({
        price: levelPrice,
        volume,
        type: 'buy',
        active: false
      });
    }

    // Create sell levels above current price
    for (let i = 1; i <= this.config.levels; i++) {
      const levelPrice = this.basePrice + (dynamicSpacing * i);
      const volume = Math.min(
        this.config.baseVolume * Math.pow(this.config.volumeMultiplier, i - 1),
        this.config.maxVolume
      );

      this.gridLevels.push({
        price: levelPrice,
        volume,
        type: 'sell',
        active: false
      });
    }

    this.emit('grid_initialized', {
      basePrice: this.basePrice,
      levels: this.gridLevels.length,
      spacing: dynamicSpacing
    });
  }

  private async calculateVolatility(connection: any): Promise<number> {
    try {
      const candles = await connection.getCandles(this.symbol, '5m', 20);
      const highs = candles.map(c => c.high);
      const lows = candles.map(c => c.low);
      const ranges = highs.map((h, i) => h - lows[i]);
      return ranges.reduce((sum, range) => sum + range, 0) / ranges.length;
    } catch (error) {
      console.warn('Volatility calculation warning:', error);
      return this.config.gridSpacing;
    }
  }

  private shouldRebalanceGrid(price: { bid: number; ask: number }): boolean {
    const currentPrice = (price.bid + price.ask) / 2;
    
    // Check if price has moved significantly from base price
    if (Math.abs(currentPrice - this.basePrice) > this.config.gridSpacing * 2) {
      return true;
    }

    // Check if too many levels are active
    const activeCount = this.gridLevels.filter(level => level.active).length;
    if (activeCount / this.gridLevels.length >= this.config.rebalanceThreshold) {
      return true;
    }

    return false;
  }

  private generateSignal(price: { bid: number; ask: number }): TradeSignal | null {
    const currentPrice = (price.bid + price.ask) / 2;

    // Find the closest inactive grid level
    let closestLevel: GridLevel | null = null;
    let minDistance = Infinity;

    for (const level of this.gridLevels) {
      if (level.active) continue;

      const distance = Math.abs(currentPrice - level.price);
      if (distance < minDistance) {
        minDistance = distance;
        closestLevel = level;
      }
    }

    if (!closestLevel || minDistance > this.config.gridSpacing / 2) {
      return null;
    }

    // Calculate dynamic stop loss and take profit
    const stopLossDistance = this.config.gridSpacing * 1.5;
    const takeProfitDistance = this.config.gridSpacing * 2;

    return {
      type: closestLevel.type,
      symbol: this.symbol,
      volume: closestLevel.volume,
      stopLoss: closestLevel.type === 'buy'
        ? price.ask - stopLossDistance
        : price.bid + stopLossDistance,
      takeProfit: closestLevel.type === 'buy'
        ? price.ask + takeProfitDistance
        : price.bid - takeProfitDistance
    };
  }

  public onTradeResult(result: {
    type: 'buy' | 'sell';
    volume: number;
    profit: number;
    price: number;
  }): void {
    // Update grid level status
    const level = this.gridLevels.find(l => 
      l.type === result.type &&
      Math.abs(l.price - result.price) < this.config.gridSpacing / 2
    );

    if (level) {
      level.active = true;
      this.activePositions++;
      this.totalExposure += result.volume;
    }

    this.emit('trade_result', {
      profit: result.profit,
      activePositions: this.activePositions,
      totalExposure: this.totalExposure
    });
  }

  public onPositionClosed(price: number): void {
    // Find and deactivate the corresponding grid level
    const level = this.gridLevels.find(l =>
      Math.abs(l.price - price) < this.config.gridSpacing / 2
    );

    if (level) {
      level.active = false;
      this.activePositions--;
      this.totalExposure -= level.volume;
    }
  }

  public reset(): void {
    this.gridLevels = [];
    this.basePrice = 0;
    this.totalExposure = 0;
    this.activePositions = 0;
  }
}