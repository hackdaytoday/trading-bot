export interface StrategyParameter {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  default: number;
  description: string;
}

export interface MarketCondition {
  trend: 'bullish' | 'bearish' | 'sideways';
  volatility: number;
  volume: number;
  timeframe: string;
}

export interface BacktestResult {
  profitLoss: number;
  winRate: number;
  tradesCount: number;
  sharpeRatio: number;
  maxDrawdown: number;
  equityCurve: number[];
  trades: {
    timestamp: Date;
    type: 'buy' | 'sell';
    price: number;
    size: number;
    profitLoss: number;
  }[];
}

export interface OptimizationResult {
  parameters: Record<string, number>;
  performance: {
    profitLoss: number;
    winRate: number;
    sharpeRatio: number;
  };
}

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'testing';
  author: string;
  lastModified: Date;
  parameters: StrategyParameter[];
  marketConditions: {
    optimal: MarketCondition;
  };
  performanceMetrics?: {
    overall: {
      winRate: number;
      sharpeRatio: number;
      maxDrawdown: number;
    };
    byCondition?: Record<string, {
      winRate: number;
      sharpeRatio: number;
      maxDrawdown: number;
    }>;
  };
}

export interface StrategyTestConfig {
  strategyId: string;
  parameters: Record<string, number>;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  useOptimization: boolean;
}
