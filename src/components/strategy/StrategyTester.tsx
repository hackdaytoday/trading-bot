import React, { useState } from 'react';
import { TradingStrategy, StrategyTestConfig, BacktestResult } from '../../types/strategy';
import { strategyService } from '../../services/strategyService';
import StrategyParameters from './StrategyParameters';
import { Line } from 'react-chartjs-2';

interface StrategyTesterProps {
  strategy: TradingStrategy;
}

const StrategyTester: React.FC<StrategyTesterProps> = ({ strategy }) => {
  const [testConfig, setTestConfig] = useState<StrategyTestConfig>({
    strategyId: strategy.id,
    parameters: strategy.parameters.reduce((acc, param) => ({
      ...acc,
      [param.name]: param.value
    }), {}),
    timeframe: '1h',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
    initialBalance: 10000,
    useOptimization: false
  });

  const [testResult, setTestResult] = useState<BacktestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleParameterChange = (name: string, value: number) => {
    setTestConfig(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [name]: value
      }
    }));
  };

  const handleTimeframeChange = (timeframe: string) => {
    setTestConfig(prev => ({ ...prev, timeframe }));
  };

  const handleDateChange = (type: 'start' | 'end', date: Date) => {
    setTestConfig(prev => ({ ...prev, [type === 'start' ? 'startDate' : 'endDate']: date }));
  };

  const handleTest = async () => {
    setIsLoading(true);
    try {
      const result = await strategyService.backtestStrategy(testConfig);
      setTestResult(result);
    } catch (error) {
      console.error('Backtest failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimize = async () => {
    setIsLoading(true);
    try {
      const currentConditions = await strategyService.analyzeMarketConditions();
      const optimization = await strategyService.optimizeStrategy(strategy.id, currentConditions);
      
      setTestConfig(prev => ({
        ...prev,
        parameters: optimization.parameters
      }));
      
      setTestResult(optimization.performance);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Strategy Tester</h2>
        
        <div className="space-y-6">
          {/* Parameters */}
          <div>
            <h3 className="text-lg font-medium text-gray-100 mb-3">Parameters</h3>
            <StrategyParameters
              parameters={strategy.parameters}
              onParameterChange={handleParameterChange}
            />
          </div>

          {/* Test Configuration */}
          <div>
            <h3 className="text-lg font-medium text-gray-100 mb-3">Test Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Timeframe</label>
                <select
                  value={testConfig.timeframe}
                  onChange={(e) => handleTimeframeChange(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                >
                  <option value="1m">1 minute</option>
                  <option value="5m">5 minutes</option>
                  <option value="15m">15 minutes</option>
                  <option value="1h">1 hour</option>
                  <option value="4h">4 hours</option>
                  <option value="1d">1 day</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Initial Balance</label>
                <input
                  type="number"
                  value={testConfig.initialBalance}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, initialBalance: Number(e.target.value) }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={testConfig.startDate.toISOString().split('T')[0]}
                  onChange={(e) => handleDateChange('start', new Date(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">End Date</label>
                <input
                  type="date"
                  value={testConfig.endDate.toISOString().split('T')[0]}
                  onChange={(e) => handleDateChange('end', new Date(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleTest}
              disabled={isLoading}
              className="px-4 py-2 bg-accent-green text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Running Test...' : 'Run Backtest'}
            </button>
            <button
              onClick={handleOptimize}
              disabled={isLoading}
              className="px-4 py-2 bg-accent-yellow text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Optimizing...' : 'Optimize Parameters'}
            </button>
          </div>
        </div>
      </div>

      {/* Test Results */}
      {testResult && (
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-medium text-gray-100 mb-4">Test Results</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Profit/Loss:</span>
                <span className={`font-medium ${testResult.profitLoss >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                  ${testResult.profitLoss.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Win Rate:</span>
                <span className="text-gray-100 font-medium">{testResult.winRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sharpe Ratio:</span>
                <span className="text-gray-100 font-medium">{testResult.sharpeRatio.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Drawdown:</span>
                <span className="text-accent-red font-medium">{testResult.maxDrawdown.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Trades:</span>
                <span className="text-gray-100 font-medium">{testResult.tradesCount}</span>
              </div>
            </div>
            <div className="h-40">
              {/* TODO: Add equity curve chart */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyTester;
