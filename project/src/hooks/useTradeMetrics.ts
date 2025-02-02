import { useState, useEffect, useCallback } from 'react';
import { TradingMetrics, UseMetricsOptions, CachedData } from '../types/tradingMetrics';
import { getAccountInfo } from '../services/metaapi';

const DEFAULT_OPTIONS: Required<UseMetricsOptions> = {
  updateInterval: 5000,
  maxRetries: 3,
  cacheExpiration: 60000, // 1 minute
};

const CACHE_KEY = 'trading_metrics_cache';

const DEFAULT_METRIC = {
  value: 0,
  change: 0,
  history: []
};

const DEFAULT_METRICS: TradingMetrics = {
  balance: DEFAULT_METRIC,
  equity: DEFAULT_METRIC,
  margin: DEFAULT_METRIC,
  freeMargin: DEFAULT_METRIC,
  profitLoss: DEFAULT_METRIC,
  riskSettings: {
    riskLevel: 'Moderate',
    stopLoss: 0,
    takeProfit: 0,
    maxDrawdown: 0,
    maxPositionSize: 0
  },
  stats: {
    winRate: 0,
    profitFactor: 0,
    averageWin: 0,
    averageLoss: 0,
    totalTrades: 0,
    successfulTrades: 0,
    failedTrades: 0,
    consecutiveWins: 0,
    consecutiveLosses: 0
  }
};

const useTradeMetrics = (options: UseMetricsOptions = {}) => {
  const [metrics, setMetrics] = useState<TradingMetrics>(DEFAULT_METRICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const opts = { ...DEFAULT_OPTIONS, ...options };

  const loadCachedData = useCallback((): CachedData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsedCache = JSON.parse(cached) as CachedData;
        if (Date.now() < parsedCache.expiresAt) {
          return parsedCache;
        }
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
    return null;
  }, []);

  const saveToCache = useCallback((data: TradingMetrics) => {
    try {
      const cacheData: CachedData = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + opts.cacheExpiration,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }, [opts.cacheExpiration]);

  const calculateStats = useCallback((data: any) => {
    try {
      const totalTrades = (data.successfulTrades || 0) + (data.failedTrades || 0);
      return {
        winRate: totalTrades > 0 ? ((data.successfulTrades || 0) / totalTrades) * 100 : 0,
        profitFactor: Math.abs(data.totalLoss || 1) > 0 ? (data.totalProfit || 0) / Math.abs(data.totalLoss || 1) : 0,
        averageWin: (data.successfulTrades || 0) > 0 ? (data.totalProfit || 0) / (data.successfulTrades || 1) : 0,
        averageLoss: (data.failedTrades || 0) > 0 ? (data.totalLoss || 0) / (data.failedTrades || 1) : 0,
        totalTrades: totalTrades,
        successfulTrades: data.successfulTrades || 0,
        failedTrades: data.failedTrades || 0,
        consecutiveWins: data.consecutiveWins || 0,
        consecutiveLosses: data.consecutiveLosses || 0
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return DEFAULT_METRICS.stats;
    }
  }, []);

  const fetchMetrics = useCallback(async () => {
    try {
      const cachedData = loadCachedData();
      if (cachedData) {
        setMetrics(cachedData.data);
        setLoading(false);
        return;
      }

      const accountData = await getAccountInfo();
      
      if (!accountData) {
        throw new Error('Failed to fetch account data');
      }

      const newMetrics: TradingMetrics = {
        balance: {
          value: accountData.balance || 0,
          change: accountData.previousBalance ? ((accountData.balance - accountData.previousBalance) / accountData.previousBalance) * 100 : 0,
          history: accountData.balanceHistory || []
        },
        equity: {
          value: accountData.equity || 0,
          change: accountData.previousEquity ? ((accountData.equity - accountData.previousEquity) / accountData.previousEquity) * 100 : 0,
          history: accountData.equityHistory || []
        },
        margin: {
          value: accountData.margin || 0,
          change: accountData.previousMargin ? ((accountData.margin - accountData.previousMargin) / accountData.previousMargin) * 100 : 0,
          history: accountData.marginHistory || []
        },
        freeMargin: {
          value: accountData.freeMargin || 0,
          change: accountData.previousFreeMargin ? ((accountData.freeMargin - accountData.previousFreeMargin) / accountData.previousFreeMargin) * 100 : 0,
          history: accountData.freeMarginHistory || []
        },
        profitLoss: {
          value: accountData.profit || 0,
          change: accountData.previousProfit ? ((accountData.profit - accountData.previousProfit) / Math.abs(accountData.previousProfit)) * 100 : 0,
          history: accountData.profitHistory || []
        },
        riskSettings: {
          riskLevel: accountData.riskLevel || 'Moderate',
          stopLoss: accountData.stopLoss || 0,
          takeProfit: accountData.takeProfit || 0,
          maxDrawdown: accountData.maxDrawdown || 0,
          maxPositionSize: accountData.maxPositionSize || 0
        },
        stats: calculateStats(accountData)
      };

      setMetrics(newMetrics);
      saveToCache(newMetrics);
      setLoading(false);
      setRetryCount(0);
      setError(null);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      if (retryCount < opts.maxRetries) {
        setRetryCount(prev => prev + 1);
      } else {
        setError(error as Error);
        setLoading(false);
      }
    }
  }, [loadCachedData, saveToCache, calculateStats, opts.maxRetries, retryCount]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryCount(0);
    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, opts.updateInterval);
    return () => clearInterval(interval);
  }, [fetchMetrics, opts.updateInterval]);

  return { metrics, loading, error, retry };
};

export default useTradeMetrics;
