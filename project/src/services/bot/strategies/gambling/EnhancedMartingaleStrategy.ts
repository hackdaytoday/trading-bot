import { Strategy, TradeSignal } from '../../types';
import { EventEmitter } from 'events';

interface MartingaleConfig {
  baseVolume: number;
  maxVolume: number;
  recoveryMultiplier: number;
  maxConsecutiveLosses: number;
  maxDrawdownPercent: number;
  volatilityAdjustment: boolean;
}

export class EnhancedMartingaleStrategy extends EventEmitter implements Strategy {
  public name = 'Enhanced Martingale';
  public symbol = 'EURUSD';
  public interval = 5000; // 5 second interval
  public volume = 0.01;

  private config: MartingaleConfig = {
    baseVolume: 0.01,
    maxVolume: 1.0,
    recoveryMultiplier: 2.0,
    maxConsecutiveLosses: 6,
    maxDrawdownPercent: 20,
    volatilityAdjustment: true
  };

  private currentVolume: number;
  private consecutiveLosses: number = 0;
  private initialBalance: number | null = null;
  private totalLoss: number = 0;

  constructor() {
    super();
    this.currentVolume = this.config.baseVolume;
  }

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      // Initialize balance tracking
      if (this.initialBalance === null) {
        const accountInfo = await connection.getAccountInformation();
        this.initialBalance = accountInfo.balance;
      }

      // Check drawdown limit
      if (this.isDrawdownExceeded(connection)) {
        this.emit('emergency_stop', {
          reason: 'Maximum drawdown exceeded',
          drawdown: this.calculateDrawdown(connection)
        });
        return null;
      }

      // Check consecutive losses limit
      if (this.consecutiveLosses >= this.config.maxConsecutiveLosses) {
        this.emit('emergency_stop', {
          reason: 'Maximum consecutive losses reached',
          losses: this.consecutiveLosses
        });
        return null;
      }

      // Get current market conditions
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) {
        return null;
      }

      // Get market volatility
      const volatility = await this.calculateVolatility(connection);
      
      // Adjust volume based on volatility if enabled
      if (this.config.volatilityAdjustment) {
        this.adjustVolumeForVolatility(volatility);
      }

      // Generate trading signal
      return this.generateSignal(price, volatility);

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

  private async calculateVolatility(connection: any): Promise<number> {
    try {
      const candles = await connection.getCandles(this.symbol, '1m', 20);
      const highs = candles.map(c => c.high);
      const lows = candles.map(c => c.low);
      const ranges = highs.map((h, i) => h - lows[i]);
      return ranges.reduce((sum, range) => sum + range, 0) / ranges.length;
    } catch (error) {
      console.warn('Volatility calculation warning:', error);
      return 0;
    }
  }

  private adjustVolumeForVolatility(volatility: number): void {
    const volatilityFactor = Math.max(0.5, Math.min(1.5, 1 / volatility));
    this.currentVolume = Math.min(
      this.config.maxVolume,
      this.currentVolume * volatilityFactor
    );
  }

  private async isDrawdownExceeded(connection: any): Promise<boolean> {
    if (!this.initialBalance) return false;

    const drawdown = await this.calculateDrawdown(connection);
    return drawdown > this.config.maxDrawdownPercent;
  }

  private async calculateDrawdown(connection: any): Promise<number> {
    if (!this.initialBalance) return 0;

    const accountInfo = await connection.getAccountInformation();
    const currentBalance = accountInfo.balance;
    return ((this.initialBalance - currentBalance) / this.initialBalance) * 100;
  }

  private generateSignal(
    price: { bid: number; ask: number },
    volatility: number
  ): TradeSignal | null {
    // Calculate dynamic stop loss and take profit based on volatility
    const stopLossPips = Math.max(20, Math.round(volatility * 10000));
    const takeProfitPips = Math.round(stopLossPips * 1.5);

    // Alternate between buy and sell signals
    const type = Math.random() > 0.5 ? 'buy' : 'sell';

    return {
      type,
      symbol: this.symbol,
      volume: this.currentVolume,
      stopLoss: type === 'buy' 
        ? price.ask - (stopLossPips * 0.0001)
        : price.bid + (stopLossPips * 0.0001),
      takeProfit: type === 'buy'
        ? price.ask + (takeProfitPips * 0.0001)
        : price.bid - (takeProfitPips * 0.0001)
    };
  }

  public onTradeResult(result: { profit: number }): void {
    if (result.profit > 0) {
      // Reset on win
      this.consecutiveLosses = 0;
      this.currentVolume = this.config.baseVolume;
      this.totalLoss = 0;
    } else {
      // Increase volume on loss
      this.consecutiveLosses++;
      this.totalLoss += Math.abs(result.profit);
      this.currentVolume = Math.min(
        this.currentVolume * this.config.recoveryMultiplier,
        this.config.maxVolume
      );
    }

    this.emit('trade_result', {
      profit: result.profit,
      consecutiveLosses: this.consecutiveLosses,
      currentVolume: this.currentVolume,
      totalLoss: this.totalLoss
    });
  }

  public reset(): void {
    this.consecutiveLosses = 0;
    this.currentVolume = this.config.baseVolume;
    this.totalLoss = 0;
    this.initialBalance = null;
  }
}