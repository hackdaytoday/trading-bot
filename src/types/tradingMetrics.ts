export interface MetricHistory {
  timestamp?: number;
  value?: number;
}

export interface TradingMetric {
  value?: number;
  change?: number;
  history?: MetricHistory[];
}

export interface RiskSettings {
  riskLevel?: 'Low' | 'Moderate' | 'High';
  stopLoss?: number;
  takeProfit?: number;
  maxDrawdown?: number;
  maxPositionSize?: number;
}

export interface TradingStats {
  winRate?: number;
  profitFactor?: number;
  averageWin?: number;
  averageLoss?: number;
  totalTrades?: number;
  successfulTrades?: number;
  failedTrades?: number;
  consecutiveWins?: number;
  consecutiveLosses?: number;
}

export interface TradingMetrics {
  balance?: TradingMetric;
  equity?: TradingMetric;
  margin?: TradingMetric;
  freeMargin?: TradingMetric;
  profitLoss?: TradingMetric;
  riskSettings?: RiskSettings;
  stats?: TradingStats;
}

export interface UseMetricsOptions {
  updateInterval?: number;
  maxRetries?: number;
  cacheExpiration?: number;
}

export interface CachedData {
  data?: TradingMetrics;
  timestamp?: number;
  expiresAt?: number;
}
