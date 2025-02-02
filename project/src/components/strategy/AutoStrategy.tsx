import React, { useState, useEffect } from 'react';
import { TradingStrategy, MarketCondition } from '../../types/strategy';
import { strategyService } from '../../services/strategyService';
import { TrendingUp, TrendingDown, Minus, Activity, Clock } from 'lucide-react';

interface AutoStrategyProps {
  onStrategySelect: (strategy: TradingStrategy) => void;
}

const AutoStrategy: React.FC<AutoStrategyProps> = ({ onStrategySelect }) => {
  const [currentConditions, setCurrentConditions] = useState<MarketCondition | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(5 * 60 * 1000); // 5 minutes

  useEffect(() => {
    analyzeAndSelectStrategy();
    const interval = setInterval(analyzeAndSelectStrategy, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval]);

  const analyzeAndSelectStrategy = async () => {
    setIsLoading(true);
    try {
      const conditions = await strategyService.analyzeMarketConditions();
      setCurrentConditions(conditions);

      const bestStrategy = await strategyService.selectBestStrategy(conditions);
      setSelectedStrategy(bestStrategy);

      if (bestStrategy) {
        onStrategySelect(bestStrategy);
      }
    } catch (error) {
      console.error('Strategy selection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="w-5 h-5 text-accent-green" />;
      case 'bearish':
        return <TrendingDown className="w-5 h-5 text-accent-red" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-100">Auto Strategy Selection</h2>
          <select
            value={updateInterval}
            onChange={(e) => setUpdateInterval(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
          >
            <option value={60000}>Update every 1 minute</option>
            <option value={300000}>Update every 5 minutes</option>
            <option value={900000}>Update every 15 minutes</option>
            <option value={3600000}>Update every hour</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <span className="text-gray-400">Analyzing market conditions...</span>
          </div>
        ) : (
          <>
            {/* Market Conditions */}
            {currentConditions && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-100 mb-4">Current Market Conditions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Trend</span>
                      {getTrendIcon(currentConditions.trend)}
                    </div>
                    <span className="text-lg font-medium text-gray-100 capitalize">
                      {currentConditions.trend}
                    </span>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Volatility</span>
                      <Activity className="w-5 h-5 text-accent-yellow" />
                    </div>
                    <span className="text-lg font-medium text-gray-100">
                      {(currentConditions.volatility * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Volume</span>
                      <Activity className="w-5 h-5 text-accent-green" />
                    </div>
                    <span className="text-lg font-medium text-gray-100">
                      {currentConditions.volume.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Timeframe</span>
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-lg font-medium text-gray-100">
                      {currentConditions.timeframe}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Strategy */}
            {selectedStrategy ? (
              <div>
                <h3 className="text-lg font-medium text-gray-100 mb-4">Selected Strategy</h3>
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-gray-100 font-medium">{selectedStrategy.name}</h4>
                      <p className="text-gray-400 text-sm">{selectedStrategy.description}</p>
                    </div>
                    <span className="px-3 py-1 bg-accent-green bg-opacity-20 text-accent-green rounded-full text-sm">
                      Active
                    </span>
                  </div>

                  {selectedStrategy.performanceMetrics && (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm">Win Rate</span>
                        <p className="text-gray-100 font-medium">
                          {selectedStrategy.performanceMetrics.overall.winRate.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Sharpe Ratio</span>
                        <p className="text-gray-100 font-medium">
                          {selectedStrategy.performanceMetrics.overall.sharpeRatio.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Max Drawdown</span>
                        <p className="text-accent-red font-medium">
                          {selectedStrategy.performanceMetrics.overall.maxDrawdown.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No suitable strategy found for current market conditions</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AutoStrategy;
