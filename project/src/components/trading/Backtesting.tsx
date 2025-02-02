import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FaPlay, FaStop, FaDownload } from 'react-icons/fa';

interface BacktestSettings {
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  initialBalance: number;
  strategy: string;
}

interface BacktestResult {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  netProfit: number;
  maxDrawdown: number;
  sharpeRatio: number;
  equityCurve: Array<{ date: string; equity: number }>;
}

const Backtesting: React.FC = () => {
  const [settings, setSettings] = useState<BacktestSettings>({
    symbol: 'EURUSD',
    timeframe: 'H1',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    initialBalance: 10000,
    strategy: 'MA_Crossover',
  });

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BacktestResult | null>(null);

  const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD'];
  const timeframes = ['M5', 'M15', 'M30', 'H1', 'H4', 'D1'];
  const strategies = [
    { id: 'MA_Crossover', name: 'Moving Average Crossover' },
    { id: 'RSI_Strategy', name: 'RSI Strategy' },
    { id: 'MACD_Strategy', name: 'MACD Strategy' },
    { id: 'BB_Strategy', name: 'Bollinger Bands Strategy' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: name === 'initialBalance' ? parseFloat(value) : value,
    }));
  };

  const handleStartBacktest = async () => {
    setIsRunning(true);
    setProgress(0);

    try {
      // Symulacja backtestingu
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Mock wyników
      setResults({
        totalTrades: 156,
        winningTrades: 94,
        losingTrades: 62,
        winRate: 60.26,
        profitFactor: 1.85,
        netProfit: 2345.67,
        maxDrawdown: 12.34,
        sharpeRatio: 1.67,
        equityCurve: Array.from({ length: 12 }, (_, i) => ({
          date: `2024-${(i + 1).toString().padStart(2, '0')}-01`,
          equity: 10000 + Math.random() * 3000,
        })),
      });

      toast.success('Backtest completed successfully');
    } catch (error) {
      toast.error('Error running backtest');
    } finally {
      setIsRunning(false);
      setProgress(100);
    }
  };

  const handleExportResults = () => {
    if (!results) return;

    const resultsJson = JSON.stringify(results, null, 2);
    const blob = new Blob([resultsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backtest_results_${settings.symbol}_${settings.timeframe}_${settings.strategy}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Backtest Settings</h3>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Symbol</label>
              <select
                name="symbol"
                value={settings.symbol}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {symbols.map((symbol) => (
                  <option key={symbol} value={symbol}>
                    {symbol}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Timeframe</label>
              <select
                name="timeframe"
                value={settings.timeframe}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {timeframes.map((tf) => (
                  <option key={tf} value={tf}>
                    {tf}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Strategy</label>
              <select
                name="strategy"
                value={settings.strategy}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {strategies.map((strategy) => (
                  <option key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={settings.startDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                value={settings.endDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Initial Balance</label>
              <input
                type="number"
                name="initialBalance"
                value={settings.initialBalance}
                onChange={handleInputChange}
                min="1000"
                step="1000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={handleStartBacktest}
              disabled={isRunning}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <FaStop className="mr-2" /> Stop
                </>
              ) : (
                <>
                  <FaPlay className="mr-2" /> Start Backtest
                </>
              )}
            </button>
          </div>

          {isRunning && (
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {progress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div
                    style={{ width: `${progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {results && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Backtest Results</h3>
              <button
                onClick={handleExportResults}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaDownload className="mr-2" /> Export Results
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="bg-gray-50 px-4 py-5 rounded-lg">
                <dt className="text-sm font-medium text-gray-500">Total Trades</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">
                  {results.totalTrades}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 rounded-lg">
                <dt className="text-sm font-medium text-gray-500">Win Rate</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">
                  {results.winRate.toFixed(2)}%
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 rounded-lg">
                <dt className="text-sm font-medium text-gray-500">Net Profit</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">
                  ${results.netProfit.toFixed(2)}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 rounded-lg">
                <dt className="text-sm font-medium text-gray-500">Max Drawdown</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">
                  {results.maxDrawdown.toFixed(2)}%
                </dd>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900">Equity Curve</h4>
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.equityCurve}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="equity"
                      stroke="#2563eb"
                      name="Account Equity"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Winning Trades</dt>
                <dd className="mt-1 text-sm text-gray-900">{results.winningTrades}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Losing Trades</dt>
                <dd className="mt-1 text-sm text-gray-900">{results.losingTrades}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Profit Factor</dt>
                <dd className="mt-1 text-sm text-gray-900">{results.profitFactor.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Sharpe Ratio</dt>
                <dd className="mt-1 text-sm text-gray-900">{results.sharpeRatio.toFixed(2)}</dd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Backtesting;
