import { Strategy, TradeSignal } from '../../types';
import { EventEmitter } from 'events';

interface KellyConfig {
  maxPositionSize: number;
  minWinRate: number;
  historyLength: number;
  riskFreeRate: number;
  confidenceLevel: number;
}

interface TradeHistory {
  timestamp: number;
  type: 'buy' | 'sell';
  profit: number;
  winRate: number;
}

export class AIKellyCriterionStrategy extends EventEmitter implements Strategy {
  public name = 'AI Kelly Criterion';
  public symbol = 'EURUSD';
  public interval = 10000; // 10 second interval
  public volume = 0.01;

  private config: KellyConfig = {
    maxPositionSize: 0.05, // 5% of account
    minWinRate: 0.45,
    historyLength: 100,
    riskFreeRate: 0.02, // 2% annual risk-free rate
    confidenceLevel: 0.95
  };

  private tradeHistory: TradeHistory[] = [];
  private currentWinRate: number = 0.5;
  private expectedReturn: number = 0;
  private volatility: number = 0;

  public async analyze(connection: any): Promise<TradeSignal | null> {
    try {
      // Get current price and market conditions
      const price = await connection.getSymbolPrice(this.symbol);
      if (!this.validatePrice(price)) {
        return null;
      }

      // Update market analysis
      await this.updateMarketAnalysis(connection);

      // Calculate Kelly position size
      const positionSize = this.calculateKellyPosition();
      if (positionSize <= 0) {
        return null;
      }

      // Generate trading signal
      return this.generateSignal(price, positionSize);

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

  private async updateMarketAnalysis(connection: any): Promise<void> {
    // Get historical candles
    const candles = await connection.getCandles(this.symbol, '5m', 100);
    
    // Calculate win rate from recent trades
    this.currentWinRate = this.calculateWinRate();
    
    // Calculate expected return and volatility
    const returns = this.calculateReturns(candles);
    this.expectedReturn = this.calculateExpectedReturn(returns);
    this.volatility = this.calculateVolatility(returns);
  }

  private calculateWinRate(): number {
    if (this.tradeHistory.length === 0) return 0.5;

    const wins = this.tradeHistory.filter(trade => trade.profit > 0).length;
    return wins / this.tradeHistory.length;
  }

  private calculateReturns(candles: any[]): number[] {
    const closes = candles.map(c => c.close);
    return closes.slice(1).map((price, i) => 
      (price - closes[i]) / closes[i]
    );
  }

  private calculateExpectedReturn(returns: number[]): number {
    if (returns.length === 0) return 0;
    return returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  }

  private calculateVolatility(returns: number[]): number {
    if (returns.length === 0) return 0;
    const mean = this.calculateExpectedReturn(returns);
    const squaredDiffs = returns.map(ret => Math.pow(ret - mean, 2));
    return Math.sqrt(
      squaredDiffs.reduce((sum, diff) => sum + diff, 0) / returns.length
    );
  }

  private calculateKellyPosition(): number {
    // Skip if win rate is too low
    if (this.currentWinRate < this.config.minWinRate) {
      return 0;
    }

    // Calculate Kelly Fraction
    const winProb = this.currentWinRate;
    const lossProb = 1 - winProb;
    const payoffRatio = Math.abs(this.expectedReturn / this.volatility);

    const kellyFraction = (winProb * payoffRatio - lossProb) / payoffRatio;

    // Apply confidence level adjustment
    const adjustedKelly = kellyFraction * this.config.confidenceLevel;

    // Limit position size
    return Math.min(
      Math.max(0, adjustedKelly),
      this.config.maxPositionSize
    );
  }

  private generateSignal(
    price: { bid: number; ask: number },
    positionSize: number
  ): TradeSignal | null {
    // Calculate dynamic stop loss and take profit
    const atr = this.volatility * price.ask;
    const stopLoss = atr * 2;
    const takeProfit = atr * 3;

    // Determine trade direction based on expected return
    const type = this.expectedReturn > 0 ? 'buy' : 'sell';

    // Calculate volume based on position size and account balance
    const volume = Math.round(positionSize * 100) / 100; // Round to 2 decimal places

    return {
      type,
      symbol: this.symbol,
      volume,
      stopLoss: type === 'buy'
        ? price.ask - stopLoss
        : price.bid + stopLoss,
      takeProfit: type === 'buy'
        ? price.ask + takeProfit
        : price.bid - takeProfit
    };
  }

  public onTradeResult(result: { 
    type: 'buy' | 'sell';
    profit: number;
    timestamp: number;
  }): void {
    // Update trade history
    this.tradeHistory.push({
      timestamp: result.timestamp,
      type: result.type,
      profit: result.profit,
      winRate: this.currentWinRate
    });

    // Keep history within limit
    if (this.tradeHistory.length > this.config.historyLength) {
      this.tradeHistory.shift();
    }

    // Update win rate
    this.currentWinRate = this.calculateWinRate();

    this.emit('trade_result', {
      profit: result.profit,
      winRate: this.currentWinRate,
      expectedReturn: this.expectedReturn,
      volatility: this.volatility
    });
  }

  public reset(): void {
    this.tradeHistory = [];
    this.currentWinRate = 0.5;
    this.expectedReturn = 0;
    this.volatility = 0;
  }
}