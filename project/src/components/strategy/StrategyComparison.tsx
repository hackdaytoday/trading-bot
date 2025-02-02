import React, { useState, useEffect } from 'react';
import { TradingStrategy, BacktestResult } from '../../types/strategy';
import { strategyService } from '../../services/strategyService';
import { Line } from 'react-chartjs-2';

interface StrategyComparisonProps {
  strategies: TradingStrategy[];
}

interface ComparisonResult {
  strategy: TradingStrategy;
  result: BacktestResult;
}

const StrategyComparison: React.FC<StrategyComparisonProps> = ({ strategies }) => {
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'profitLoss' | 'winRate' | 'sharpeRatio'>('profitLoss');
  const [timeframe, setTimeframe] = useState('1d');

  useEffect(() => {
    compareStrategies();
  }, [timeframe]);

  const compareStrategies = async () => {
    setIsLoading(true);
    try {
      const testResults = await Promise.all(
        strategies.map(async (strategy) => {
          const result = await strategyService.backtestStrategy({
            strategyId: strategy.id,
            parameters: strategy.parameters.reduce((acc, param) => ({
              ...acc,
              [param.name]: param.value
            }), {}),
            timeframe,
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            endDate: new Date(),
            initialBalance: 10000,
            useOptimization: false
          });

          return { strategy, result };
        })
      );

      setResults(testResults);
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMetricValue = (result: BacktestResult) => {
    switch (selectedMetric) {
      case 'profitLoss':
        return result.profitLoss;
      case 'winRate':
        return result.winRate;
      case 'sharpeRatio':
        return result.sharpeRatio;
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'profitLoss':
        return 'Profit/Loss ($)';
      case 'winRate':
        return 'Win Rate (%)';
      case 'sharpeRatio':
        return 'Sharpe Ratio';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-100">Strategy Comparison</h2>
          <div className="flex gap-4">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
            >
              <option value="profitLoss">Profit/Loss</option>
              <option value="winRate">Win Rate</option>
              <option value="sharpeRatio">Sharpe Ratio</option>
            </select>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
            >
              <option value="1m">1 minute</option>
              <option value="5m">5 minutes</option>
              <option value="15m">15 minutes</option>
              <option value="1h">1 hour</option>
              <option value="4h">4 hours</option>
              <option value="1d">1 day</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-gray-400">Loading comparison...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Performance Chart */}
            <div className="h-64">
              {results.length > 0 && (
                <Line
                  data={{
                    labels: strategies.map(s => s.name),
                    datasets: [{
                      label: getMetricLabel(),
                      data: results.map(r => getMetricValue(r.result)),
                      borderColor: '#10B981',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      tension: 0.4,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top' as const,
                        labels: {
                          color: '#9CA3AF'
                        }
                      }
                    },
                    scales: {
                      y: {
                        grid: {
                          color: '#374151'
                        },
                        ticks: {
                          color: '#9CA3AF'
                        }
                      },
                      x: {
                        grid: {
                          color: '#374151'
                        },
                        ticks: {
                          color: '#9CA3AF'
                        }
                      }
                    }
                  }}
                />
              )}
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 text-gray-400">Strategy</th>
                    <th className="text-right py-3 text-gray-400">Profit/Loss</th>
                    <th className="text-right py-3 text-gray-400">Win Rate</th>
                    <th className="text-right py-3 text-gray-400">Sharpe Ratio</th>
                    <th className="text-right py-3 text-gray-400">Max Drawdown</th>
                    <th className="text-right py-3 text-gray-400">Trades</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(({ strategy, result }) => (
                    <tr key={strategy.id} className="border-b border-gray-800">
                      <td className="py-3 text-gray-100">{strategy.name}</td>
                      <td className={`text-right py-3 ${result.profitLoss >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                        ${result.profitLoss.toFixed(2)}
                      </td>
                      <td className="text-right py-3 text-gray-100">{result.winRate.toFixed(2)}%</td>
                      <td className="text-right py-3 text-gray-100">{result.sharpeRatio.toFixed(2)}</td>
                      <td className="text-right py-3 text-accent-red">{result.maxDrawdown.toFixed(2)}%</td>
                      <td className="text-right py-3 text-gray-100">{result.tradesCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyComparison;
