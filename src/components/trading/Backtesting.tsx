import React, { useState, useEffect } from 'react';
import { Play, Settings, Download, BarChart2, Calendar, Filter, LineChart, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { botService } from '../../services/bot';
import { Strategy } from '../../services/bot/types';

export const Backtesting = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [results, setResults] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load available strategies
    const availableStrategies = botService.getStrategies();
    setStrategies(availableStrategies);
    if (availableStrategies.length > 0) {
      setSelectedStrategy(availableStrategies[0]);
    }
  }, []);

  const calculateResults = (trades: any[]) => {
    // Calculate total trades
    const totalTrades = trades.length;

    // Calculate winning trades and win rate
    const winningTrades = trades.filter(trade => trade.profit > 0);
    const winRate = (winningTrades.length / totalTrades) * 100;

    // Calculate profit factor
    const grossProfit = trades.reduce((sum, trade) => trade.profit > 0 ? sum + trade.profit : sum, 0);
    const grossLoss = Math.abs(trades.reduce((sum, trade) => trade.profit < 0 ? sum + trade.profit : sum, 0));
    const profitFactor = grossLoss === 0 ? grossProfit : grossProfit / grossLoss;

    // Calculate net profit
    const netProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);

    // Calculate max drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let runningProfit = 0;

    trades.forEach(trade => {
      runningProfit += trade.profit;
      if (runningProfit > peak) {
        peak = runningProfit;
      }
      const drawdown = ((peak - runningProfit) / peak) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });

    // Calculate Sharpe Ratio (simplified)
    const returns = trades.map(trade => trade.profit);
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length
    );
    const sharpeRatio = stdDev === 0 ? 0 : (avgReturn / stdDev);

    return {
      totalTrades,
      winRate: winRate.toFixed(1),
      profitFactor: profitFactor.toFixed(2),
      sharpeRatio: sharpeRatio.toFixed(2),
      maxDrawdown: maxDrawdown.toFixed(1),
      netProfit: netProfit.toFixed(2)
    };
  };

  const generateTradesForStrategy = (strategy: Strategy) => {
    const trades = [];
    let date = new Date(2024, 0, 1);
    let lastPrice = 100;
    let equity = 10000;
    
    // Generate trades based on strategy type
    const tradeCount = Math.floor(Math.random() * 30) + 30; // 30-60 trades
    
    for (let i = 0; i < tradeCount; i++) {
      const type = Math.random() > 0.5 ? 'buy' : 'sell';
      let profitProbability = 0.5; // Default probability
      let maxProfit = 100; // Default max profit
      
      // Adjust probabilities and profit ranges based on strategy
      if (strategy.name.includes('AI')) {
        profitProbability = 0.65; // AI strategies have higher win rate
        maxProfit = 150;
      } else if (strategy.name.includes('Martingale')) {
        profitProbability = 0.45; // Martingale strategies have lower win rate but higher profits
        maxProfit = 300;
      }
      
      const entryPrice = lastPrice + (Math.random() * 2 - 1);
      const exitPrice = entryPrice + (type === 'buy' ? 1 : -1) * (Math.random() * 2);
      const profit = Math.random() < profitProbability 
        ? Math.random() * maxProfit 
        : -Math.random() * (maxProfit / 2);
      
      equity += profit;
      
      trades.push({
        id: i,
        type,
        date: new Date(date).toISOString(),
        entryPrice,
        exitPrice,
        profit,
        equity
      });
      
      lastPrice = exitPrice;
      date.setHours(date.getHours() + 4);
    }
    
    return trades;
  };

  const handleRunBacktest = () => {
    if (!selectedStrategy) return;
    
    setIsLoading(true);
    
    // Generate trades for selected strategy
    const trades = generateTradesForStrategy(selectedStrategy);
    const calculatedResults = calculateResults(trades);
    
    // Generate equity curve
    const equityCurve = trades.map(trade => ({
      date: trade.date,
      equity: trade.equity
    }));

    // Combine all results
    const simulatedResults = {
      ...calculatedResults,
      equityCurve,
      trades
    };
    
    // Simulate API delay
    setTimeout(() => {
      setResults(simulatedResults);
      setIsLoading(false);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-accent-green neon-text">Backtesting</h2>
          <p className="text-gray-400 mt-1">Test and optimize your trading strategies</p>
        </div>
        <button
          onClick={handleRunBacktest}
          disabled={isLoading || !selectedStrategy}
          className="flex items-center px-4 py-2 text-sm font-medium text-dark bg-accent-green rounded-lg hover:bg-accent-green/90 transition-all shadow-[0_0_10px_rgba(74,222,128,0.2)] hover:shadow-[0_0_15px_rgba(74,222,128,0.3)] disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-dark border-t-transparent mr-2" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run Backtest
            </>
          )}
        </button>
      </div>

      {/* Configuration Panel */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card card-3d neon-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Test Configuration</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Strategy</label>
              <select
                value={selectedStrategy?.name || ''}
                onChange={(e) => setSelectedStrategy(strategies.find(s => s.name === e.target.value) || null)}
                className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-accent-green"
              >
                {strategies.map(strategy => (
                  <option key={strategy.name} value={strategy.name}>{strategy.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Time Period</label>
              <div className="flex gap-2">
                {['1W', '1M', '3M', '6M', '1Y', 'ALL'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      selectedPeriod === period
                        ? 'bg-accent-green text-dark font-medium'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Initial Capital</label>
                <input
                  type="number"
                  defaultValue="10000"
                  className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-accent-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Risk per Trade</label>
                <input
                  type="number"
                  defaultValue="1"
                  className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-accent-green"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {results && (
          <div className="card card-3d neon-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-accent-green" />
                <h3 className="text-lg font-semibold text-gray-100">Results Summary</h3>
              </div>
              <button className="flex items-center text-xs text-accent-gold hover:text-accent-gold/80">
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-dark rounded-lg border border-gray-800">
                <span className="text-sm text-gray-400">Total Trades</span>
                <p className="text-xl font-semibold text-gray-100 mt-1">{results.totalTrades}</p>
              </div>
              <div className="p-4 bg-dark rounded-lg border border-gray-800">
                <span className="text-sm text-gray-400">Win Rate</span>
                <p className="text-xl font-semibold text-accent-green mt-1">{results.winRate}%</p>
              </div>
              <div className="p-4 bg-dark rounded-lg border border-gray-800">
                <span className="text-sm text-gray-400">Profit Factor</span>
                <p className="text-xl font-semibold text-accent-gold mt-1">{results.profitFactor}</p>
              </div>
              <div className="p-4 bg-dark rounded-lg border border-gray-800">
                <span className="text-sm text-gray-400">Sharpe Ratio</span>
                <p className="text-xl font-semibold text-accent-gold mt-1">{results.sharpeRatio}</p>
              </div>
              <div className="p-4 bg-dark rounded-lg border border-gray-800">
                <span className="text-sm text-gray-400">Max Drawdown</span>
                <p className="text-xl font-semibold text-accent-red mt-1">{results.maxDrawdown}%</p>
              </div>
              <div className="p-4 bg-dark rounded-lg border border-gray-800">
                <span className="text-sm text-gray-400">Net Profit</span>
                <p className="text-xl font-semibold text-accent-green mt-1">${results.netProfit}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Chart */}
      {results && (
        <div className="card card-3d neon-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-accent-green" />
              <h3 className="text-lg font-semibold text-gray-100">Equity Curve</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-200 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="h-96 bg-dark rounded-lg border border-gray-800 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={results.equityCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => formatDate(value)}
                  stroke="#6b7280"
                />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1d23',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#9ca3af' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Equity']}
                  labelFormatter={(label) => formatDate(label as string)}
                />
                <Line 
                  type="monotone" 
                  dataKey="equity" 
                  stroke="#4ade80" 
                  strokeWidth={2}
                  dot={false}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Trade Results Table */}
      {results && (
        <div className="card card-3d neon-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent-green" />
              <h3 className="text-lg font-semibold text-gray-100">Trade Results</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-800">
                  <th className="pb-3 text-sm font-medium text-gray-400">Date</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Type</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Entry Price</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Exit Price</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {results.trades.map((trade: any) => (
                  <tr key={trade.id} className="border-b border-gray-800/50 hover:bg-dark-hover">
                    <td className="py-3 text-sm text-gray-300">{formatDate(trade.date)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        trade.type === 'buy' 
                          ? 'bg-accent-green/10 text-accent-green' 
                          : 'bg-accent-red/10 text-accent-red'
                      }`}>
                        {trade.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-300">${trade.entryPrice.toFixed(2)}</td>
                    <td className="py-3 text-sm text-gray-300">${trade.exitPrice.toFixed(2)}</td>
                    <td className="py-3">
                      <div className={`flex items-center ${
                        trade.profit >= 0 ? 'text-accent-green' : 'text-accent-red'
                      }`}>
                        {trade.profit >= 0 ? (
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-sm font-medium">
                          ${Math.abs(trade.profit).toFixed(2)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};