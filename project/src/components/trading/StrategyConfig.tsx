import React, { useState } from 'react';

interface StrategyConfigProps {
  onSave: (config: StrategySettings) => void;
  initialConfig?: StrategySettings;
}

interface StrategySettings {
  riskPerTrade: number;
  maxOpenTrades: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  timeframe: string;
  tradingPairs: string[];
  tradingHours: {
    start: string;
    end: string;
  };
}

const defaultConfig: StrategySettings = {
  riskPerTrade: 1,
  maxOpenTrades: 3,
  stopLossPercent: 2,
  takeProfitPercent: 3,
  timeframe: 'H1',
  tradingPairs: ['EURUSD', 'GBPUSD', 'USDJPY'],
  tradingHours: {
    start: '09:00',
    end: '17:00',
  },
};

const StrategyConfig: React.FC<StrategyConfigProps> = ({ onSave, initialConfig = defaultConfig }) => {
  const [config, setConfig] = useState<StrategySettings>(initialConfig);
  const [newPair, setNewPair] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
  };

  const handleAddPair = () => {
    if (newPair && !config.tradingPairs.includes(newPair)) {
      setConfig({
        ...config,
        tradingPairs: [...config.tradingPairs, newPair.toUpperCase()],
      });
      setNewPair('');
    }
  };

  const handleRemovePair = (pair: string) => {
    setConfig({
      ...config,
      tradingPairs: config.tradingPairs.filter((p) => p !== pair),
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Strategy Configuration</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Risk Per Trade (%)</label>
            <input
              type="number"
              value={config.riskPerTrade}
              onChange={(e) => setConfig({ ...config, riskPerTrade: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              step="0.1"
              min="0.1"
              max="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Open Trades</label>
            <input
              type="number"
              value={config.maxOpenTrades}
              onChange={(e) => setConfig({ ...config, maxOpenTrades: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              min="1"
              max="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stop Loss (%)</label>
            <input
              type="number"
              value={config.stopLossPercent}
              onChange={(e) => setConfig({ ...config, stopLossPercent: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              step="0.1"
              min="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Take Profit (%)</label>
            <input
              type="number"
              value={config.takeProfitPercent}
              onChange={(e) => setConfig({ ...config, takeProfitPercent: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              step="0.1"
              min="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Timeframe</label>
            <select
              value={config.timeframe}
              onChange={(e) => setConfig({ ...config, timeframe: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="M1">1 Minute</option>
              <option value="M5">5 Minutes</option>
              <option value="M15">15 Minutes</option>
              <option value="M30">30 Minutes</option>
              <option value="H1">1 Hour</option>
              <option value="H4">4 Hours</option>
              <option value="D1">1 Day</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Trading Hours</label>
          <div className="mt-1 grid grid-cols-2 gap-4">
            <input
              type="time"
              value={config.tradingHours.start}
              onChange={(e) =>
                setConfig({
                  ...config,
                  tradingHours: { ...config.tradingHours, start: e.target.value },
                })
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <input
              type="time"
              value={config.tradingHours.end}
              onChange={(e) =>
                setConfig({
                  ...config,
                  tradingHours: { ...config.tradingHours, end: e.target.value },
                })
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Trading Pairs</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              value={newPair}
              onChange={(e) => setNewPair(e.target.value.toUpperCase())}
              placeholder="Enter trading pair (e.g., EURUSD)"
              className="flex-1 rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={handleAddPair}
              className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {config.tradingPairs.map((pair) => (
              <span
                key={pair}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800"
              >
                {pair}
                <button
                  type="button"
                  onClick={() => handleRemovePair(pair)}
                  className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:bg-blue-500 focus:text-white focus:outline-none"
                >
                  <span className="sr-only">Remove {pair}</span>
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default StrategyConfig;
