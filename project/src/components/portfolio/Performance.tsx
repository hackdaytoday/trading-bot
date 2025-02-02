import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, PieChart, 
  BarChart2, Activity, Shield, DollarSign, Wallet, LineChart,
  Clock, Target, ChevronDown
} from 'lucide-react';
import { AnimatedContainer } from '../effects/AnimatedContainer';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Performance = () => {
  const [timeRange, setTimeRange] = useState('1M');
  const [chartData, setChartData] = useState<any[]>([]);

  // Generate sample chart data
  useEffect(() => {
    const data = [];
    let equity = 10000;
    const days = 30;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      const change = (Math.random() * 2 - 1) * 200; // Random daily change
      equity += change;
      
      data.push({
        date: date.toISOString(),
        equity: Math.round(equity * 100) / 100
      });
    }
    
    setChartData(data);
  }, [timeRange]);

  const performanceStats = {
    totalReturn: 32.5,
    winRate: 68,
    profitFactor: 2.1,
    sharpeRatio: 1.8,
    maxDrawdown: 12.4,
    averageTrade: 42.3,
    totalTrades: 156,
    successfulTrades: 106,
    failedTrades: 50,
    averageWin: 58.2,
    averageLoss: 27.4,
    largestWin: 425.8,
    largestLoss: 215.3,
    profitability: 72.4,
    volatility: 15.2,
    sortinoRatio: 2.3,
    recoveryFactor: 3.1
  };

  const monthlyReturns = [
    { month: 'Jan', return: 5.2 },
    { month: 'Feb', return: -2.1 },
    { month: 'Mar', return: 8.4 },
    { month: 'Apr', return: 3.7 },
    { month: 'May', return: 4.2 },
    { month: 'Jun', return: -1.5 }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-accent-green">Performance Analytics</h2>
          <p className="text-gray-400 mt-1">Comprehensive trading performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          {['1W', '1M', '3M', '6M', '1Y', 'ALL'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                timeRange === range
                  ? 'bg-accent-green text-dark font-medium'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Equity Curve Chart */}
      <div className="card card-3d neon-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Equity Curve</h3>
          </div>
          <div className="text-sm text-gray-400">
            Starting Balance: $10,000
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                stroke="#6b7280"
              />
              <YAxis 
                stroke="#6b7280"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1d23',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#9ca3af' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Equity']}
                labelFormatter={(label) => new Date(label as string).toLocaleDateString()}
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

      {/* Key Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <AnimatedContainer type="3d-float">
          <div className="flex flex-col items-center">
            <Wallet className="w-8 h-8 text-accent-green mb-2" />
            <h3 className="text-lg font-semibold text-gray-100">Total Return</h3>
            <p className="text-xl font-bold text-accent-green">+{performanceStats.totalReturn}%</p>
          </div>
        </AnimatedContainer>

        <AnimatedContainer type="3d-float">
          <div className="flex flex-col items-center">
            <Activity className="w-8 h-8 text-accent-green mb-2" />
            <h3 className="text-lg font-semibold text-gray-100">Win Rate</h3>
            <p className="text-xl font-bold text-accent-green">{performanceStats.winRate}%</p>
          </div>
        </AnimatedContainer>

        <AnimatedContainer type="3d-float">
          <div className="flex flex-col items-center">
            <BarChart2 className="w-8 h-8 text-accent-green mb-2" />
            <h3 className="text-lg font-semibold text-gray-100">Profit Factor</h3>
            <p className="text-xl font-bold text-accent-green">{performanceStats.profitFactor}</p>
          </div>
        </AnimatedContainer>

        <AnimatedContainer type="3d-float">
          <div className="flex flex-col items-center">
            <Shield className="w-8 h-8 text-accent-red mb-2" />
            <h3 className="text-lg font-semibold text-gray-100">Max Drawdown</h3>
            <p className="text-xl font-bold text-accent-red">-{performanceStats.maxDrawdown}%</p>
          </div>
        </AnimatedContainer>
      </div>

      {/* Risk Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card card-3d neon-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Risk Metrics</h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Sharpe Ratio</span>
                <span className="text-sm font-medium text-accent-gold">{performanceStats.sharpeRatio}</span>
              </div>
            </div>
            <div className="p-3 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Sortino Ratio</span>
                <span className="text-sm font-medium text-accent-gold">{performanceStats.sortinoRatio}</span>
              </div>
            </div>
            <div className="p-3 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Recovery Factor</span>
                <span className="text-sm font-medium text-accent-green">{performanceStats.recoveryFactor}</span>
              </div>
            </div>
            <div className="p-3 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Volatility</span>
                <span className="text-sm font-medium text-accent-red">{performanceStats.volatility}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Statistics */}
        <div className="card card-3d neon-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Trading Statistics</h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Trades</span>
                <span className="text-sm font-medium text-gray-200">{performanceStats.totalTrades}</span>
              </div>
            </div>
            <div className="p-3 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Average Trade</span>
                <span className="text-sm font-medium text-accent-green">${performanceStats.averageTrade}</span>
              </div>
            </div>
            <div className="p-3 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Largest Win</span>
                <span className="text-sm font-medium text-accent-green">${performanceStats.largestWin}</span>
              </div>
            </div>
            <div className="p-3 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Largest Loss</span>
                <span className="text-sm font-medium text-accent-red">${performanceStats.largestLoss}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="card card-3d neon-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Monthly Performance</h3>
          </div>
          <div className="space-y-3">
            {monthlyReturns.map((month) => (
              <div key={month.month} className="p-3 bg-dark rounded-lg border border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{month.month}</span>
                  <div className="flex items-center">
                    {month.return >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-accent-green mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-accent-red mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      month.return >= 0 ? 'text-accent-green' : 'text-accent-red'
                    }`}>
                      {month.return}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
