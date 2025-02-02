import { TradingStrategy, StrategyTestConfig, BacktestResult, OptimizationResult, MarketCondition } from '../types/strategy';

class StrategyService {
  private strategies: TradingStrategy[] = [];

  // Pobieranie wszystkich strategii
  async getStrategies(): Promise<TradingStrategy[]> {
    // TODO: Implement API call
    return this.strategies;
  }

  // Pobieranie pojedynczej strategii
  async getStrategy(id: string): Promise<TradingStrategy | null> {
    // TODO: Implement API call
    return this.strategies.find(s => s.id === id) || null;
  }

  // Aktualizacja parametrów strategii
  async updateStrategyParameters(id: string, parameters: Record<string, number>): Promise<TradingStrategy> {
    // TODO: Implement API call
    const strategy = await this.getStrategy(id);
    if (!strategy) throw new Error('Strategy not found');

    strategy.parameters = strategy.parameters.map(param => ({
      ...param,
      value: parameters[param.name] || param.value
    }));

    return strategy;
  }

  // Testowanie strategii na danych historycznych
  async backtestStrategy(config: StrategyTestConfig): Promise<BacktestResult> {
    // TODO: Implement API call
    return {
      profitLoss: 0,
      winRate: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      tradesCount: 0,
      period: {
        start: config.startDate,
        end: config.endDate
      }
    };
  }

  // Optymalizacja parametrów strategii
  async optimizeStrategy(
    strategyId: string, 
    marketCondition: MarketCondition
  ): Promise<OptimizationResult> {
    // TODO: Implement API call
    return {
      parameters: {},
      performance: {
        profitLoss: 0,
        winRate: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        tradesCount: 0,
        period: {
          start: new Date(),
          end: new Date()
        }
      },
      marketCondition,
      confidence: 0
    };
  }

  // Analiza warunków rynkowych
  async analyzeMarketConditions(): Promise<MarketCondition> {
    // TODO: Implement API call
    return {
      volatility: 0,
      trend: 'sideways',
      volume: 0,
      timeframe: '1h'
    };
  }

  // Automatyczny wybór najlepszej strategii
  async selectBestStrategy(condition: MarketCondition): Promise<TradingStrategy | null> {
    const strategies = await this.getStrategies();
    
    // Filtruj strategie, które są odpowiednie dla obecnych warunków rynkowych
    const suitableStrategies = strategies.filter(strategy => {
      const { optimal, acceptable } = strategy.marketConditions;
      
      // Sprawdź czy obecne warunki są optymalne
      if (this.isConditionMatching(condition, optimal)) {
        return true;
      }
      
      // Sprawdź czy obecne warunki są akceptowalne
      return acceptable.some(acceptableCondition => 
        this.isConditionMatching(condition, acceptableCondition)
      );
    });

    if (suitableStrategies.length === 0) {
      return null;
    }

    // Wybierz strategię z najlepszymi wynikami
    return suitableStrategies.reduce((best, current) => {
      if (!best) return current;
      if (!current.performanceMetrics || !best.performanceMetrics) return best;
      
      return current.performanceMetrics.overall.sharpeRatio > 
             best.performanceMetrics.overall.sharpeRatio ? current : best;
    }, null as TradingStrategy | null);
  }

  private isConditionMatching(current: MarketCondition, target: MarketCondition): boolean {
    const volatilityMatch = Math.abs(current.volatility - target.volatility) <= 0.2;
    const trendMatch = current.trend === target.trend;
    const volumeMatch = Math.abs(current.volume - target.volume) <= 0.2;
    const timeframeMatch = current.timeframe === target.timeframe;

    return volatilityMatch && trendMatch && volumeMatch && timeframeMatch;
  }
}

export const strategyService = new StrategyService();
