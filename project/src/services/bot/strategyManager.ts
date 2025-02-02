import { Strategy } from './types';
import { XAUUSDStrategy } from './strategies/XAUUSDStrategy';
import { AITrendStrategy } from './strategies/AITrendStrategy';
import { AIMomentumStrategy } from './strategies/AIMomentumStrategy';
import { AIBreakoutStrategy } from './strategies/AIBreakoutStrategy';
import { AIScalpingStrategy } from './strategies/AIScalpingStrategy';
import { AISwingStrategy } from './strategies/AISwingStrategy';
import { AIGridStrategy } from './strategies/AIGridStrategy';
import { AIMeanReversionStrategy } from './strategies/AIMeanReversionStrategy';

// Import traditional strategies
import { MovingAverageCrossoverStrategy } from './strategies/traditional/MovingAverageCrossoverStrategy';
import { BollingerBreakoutStrategy } from './strategies/traditional/BollingerBreakoutStrategy';
import { RSIReversalStrategy } from './strategies/traditional/RSIReversalStrategy';
import { MACDTrendStrategy } from './strategies/traditional/MACDTrendStrategy';

// Import gambling strategies
import { EnhancedMartingaleStrategy } from './strategies/gambling/EnhancedMartingaleStrategy';
import { AIKellyCriterionStrategy } from './strategies/gambling/AIKellyCriterionStrategy';
import { HybridGridGamblingStrategy } from './strategies/gambling/HybridGridGamblingStrategy';

export class StrategyManager {
  private strategies: Map<string, Strategy>;
  private activeStrategy: Strategy | null = null;

  constructor() {
    this.strategies = new Map();
    this.initializeStrategies();
  }

  private initializeStrategies(): void {
    // AI Strategies
    this.addStrategy(new AITrendStrategy());
    this.addStrategy(new AIMomentumStrategy());
    this.addStrategy(new AIBreakoutStrategy());
    this.addStrategy(new AIScalpingStrategy());
    this.addStrategy(new AISwingStrategy());
    this.addStrategy(new AIGridStrategy());
    this.addStrategy(new AIMeanReversionStrategy());

    // Traditional Strategies
    this.addStrategy(new MovingAverageCrossoverStrategy());
    this.addStrategy(new BollingerBreakoutStrategy());
    this.addStrategy(new RSIReversalStrategy());
    this.addStrategy(new MACDTrendStrategy());

    // Gambling Strategies
    this.addStrategy(new EnhancedMartingaleStrategy());
    this.addStrategy(new AIKellyCriterionStrategy());
    this.addStrategy(new HybridGridGamblingStrategy());

    // Commodity Strategies
    this.addStrategy(new XAUUSDStrategy());

    console.log('Initialized strategies:', Array.from(this.strategies.keys()));
  }

  public addStrategy(strategy: Strategy): void {
    if (!strategy.name) {
      console.error('Strategy must have a name');
      return;
    }
    this.strategies.set(strategy.name, strategy);
  }

  public getStrategy(name: string): Strategy | undefined {
    return this.strategies.get(name);
  }

  public getAllStrategies(): Strategy[] {
    return Array.from(this.strategies.values());
  }

  public getStrategiesByType(): {
    ai: Strategy[];
    traditional: Strategy[];
    gambling: Strategy[];
    commodity: Strategy[];
  } {
    const strategies = {
      ai: [] as Strategy[],
      traditional: [] as Strategy[],
      gambling: [] as Strategy[],
      commodity: [] as Strategy[]
    };

    this.strategies.forEach(strategy => {
      if (strategy.name.includes('AI')) {
        strategies.ai.push(strategy);
      } else if (strategy.name.includes('Martingale') || strategy.name.includes('Kelly') || strategy.name.includes('Gambling')) {
        strategies.gambling.push(strategy);
      } else if (strategy.name.includes('XAU') || strategy.name.includes('Gold')) {
        strategies.commodity.push(strategy);
      } else {
        strategies.traditional.push(strategy);
      }
    });

    return strategies;
  }

  public setActiveStrategy(name: string): void {
    const strategy = this.strategies.get(name);
    if (!strategy) {
      throw new Error(`Strategy "${name}" not found`);
    }
    this.activeStrategy = strategy;
    console.log('Active strategy set to:', name);
  }

  public getActiveStrategy(): Strategy | null {
    return this.activeStrategy;
  }

  public async analyze(connection: any): Promise<any> {
    if (!this.activeStrategy) {
      throw new Error('No active strategy selected');
    }
    return this.activeStrategy.analyze(connection);
  }

  public updateStrategySettings(name: string, settings: Partial<Strategy>): void {
    const strategy = this.strategies.get(name);
    if (!strategy) {
      throw new Error(`Strategy "${name}" not found`);
    }
    Object.assign(strategy, settings);
  }
}