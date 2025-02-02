export interface BotConfig {
  riskPerTrade: number;
  atrPeriod: number;
  atrMultiplierSL: number;
  atrMultiplierTP: number;
  tradingStartHour: number;
  tradingEndHour: number;
  trailingStopPips: number;
  trailingActivationPips: number;
  macdFastPeriod: number;
  macdSlowPeriod: number;
  macdSignalPeriod: number;
  maxPositions: number;
  maxDrawdownPercent: number;
  notifications: {
    trades: boolean;
    signals: boolean;
    news: boolean;
  };
  autoClose: boolean;
}

export interface MarketAnalysis {
  direction: "buy" | "sell" | null;
  stopLoss: number;
  takeProfit: number;
  confidence?: number;
}

export interface Strategy {
  name: string;
  symbol: string;
  interval: number;
  volume: number;
  analyze: (connection: any) => Promise<TradeSignal | null>;
  checkExitConditions?: (connection: any, position: Position) => Promise<boolean>;
}

export interface TradeSignal {
  type: 'buy' | 'sell';
  symbol: string;
  volume: number;
  stopLoss: number;
  takeProfit: number;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  openPrice: number;
  currentPrice: number;
  profit: number;
  openTime: Date;
}

export interface BotStatus {
  isRunning: boolean;
  activeStrategy: string | null;
  openPositions: number;
  lastUpdate: Date;
  errorCount?: number;
  lastError?: string;
  performance?: {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    netProfit: number;
  };
}