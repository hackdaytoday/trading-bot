import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StrategyPerformanceChartProps {
  strategy: any;
}

export const StrategyPerformanceChart = ({ strategy }: StrategyPerformanceChartProps) => {
  // Generate sample performance data based on strategy type and characteristics
  const generatePerformanceData = () => {
    const data = [];
    let equity = 10000; // Starting equity
    const days = 30; // Last 30 days
    
    // Different patterns based on strategy type and name
    switch (strategy.type) {
      case 'AI':
        // AI strategies show consistent growth with controlled drawdowns
        if (strategy.name.includes('Quantum')) {
          // Quantum strategies show higher returns with minimal drawdowns
          for (let i = 0; i < days; i++) {
            const trend = Math.sin(i / 4) * 0.8; // Strong upward trend
            const noise = (Math.random() - 0.3) * 0.4; // Reduced volatility
            const dailyReturn = (trend + noise + 0.3) * 1.5; // Positive bias
            equity = equity * (1 + dailyReturn / 100);
            data.push(createDataPoint(i, equity));
          }
        } else if (strategy.name.includes('Neural')) {
          // Neural Network strategies show steady growth
          for (let i = 0; i < days; i++) {
            const trend = Math.sin(i / 6) * 0.6;
            const noise = (Math.random() - 0.4) * 0.3;
            const dailyReturn = (trend + noise + 0.2);
            equity = equity * (1 + dailyReturn / 100);
            data.push(createDataPoint(i, equity));
          }
        } else {
          // Other AI strategies
          for (let i = 0; i < days; i++) {
            const trend = Math.sin(i / 5) * 0.5;
            const noise = (Math.random() - 0.5) * 0.4;
            const dailyReturn = (trend + noise + 0.1);
            equity = equity * (1 + dailyReturn / 100);
            data.push(createDataPoint(i, equity));
          }
        }
        break;

      case 'Traditional':
        if (strategy.name.includes('MACD')) {
          // MACD strategies show cyclical patterns
          for (let i = 0; i < days; i++) {
            const trend = Math.sin(i / 8) * 0.4;
            const noise = (Math.random() - 0.5) * 0.3;
            const dailyReturn = (trend + noise + 0.05);
            equity = equity * (1 + dailyReturn / 100);
            data.push(createDataPoint(i, equity));
          }
        } else if (strategy.name.includes('RSI')) {
          // RSI strategies show reversal patterns
          for (let i = 0; i < days; i++) {
            const trend = Math.sin(i / 10) * 0.3;
            const noise = (Math.random() - 0.5) * 0.2;
            const dailyReturn = (trend + noise + 0.08);
            equity = equity * (1 + dailyReturn / 100);
            data.push(createDataPoint(i, equity));
          }
        } else {
          // Other traditional strategies
          for (let i = 0; i < days; i++) {
            const trend = Math.sin(i / 7) * 0.3;
            const noise = (Math.random() - 0.5) * 0.25;
            const dailyReturn = (trend + noise + 0.06);
            equity = equity * (1 + dailyReturn / 100);
            data.push(createDataPoint(i, equity));
          }
        }
        break;

      case 'Gambling':
        if (strategy.name.includes('Martingale')) {
          // Martingale shows exponential gains followed by sharp drawdowns
          for (let i = 0; i < days; i++) {
            if (i % 7 === 0) { // Every 7 days
              const bigMove = (Math.random() - 0.3) * 8; // Large moves
              equity = equity * (1 + bigMove / 100);
            } else {
              const noise = (Math.random() - 0.4) * 2;
              equity = equity * (1 + noise / 100);
            }
            data.push(createDataPoint(i, equity));
          }
        } else if (strategy.name.includes('Grid')) {
          // Grid strategies show stepped patterns
          for (let i = 0; i < days; i++) {
            if (i % 4 === 0) { // Every 4 days
              const gridMove = (Math.random() - 0.3) * 4;
              equity = equity * (1 + gridMove / 100);
            } else {
              const noise = (Math.random() - 0.5) * 1;
              equity = equity * (1 + noise / 100);
            }
            data.push(createDataPoint(i, equity));
          }
        } else {
          // Other gambling strategies
          for (let i = 0; i < days; i++) {
            const volatility = (Math.random() - 0.4) * 3;
            equity = equity * (1 + volatility / 100);
            data.push(createDataPoint(i, equity));
          }
        }
        break;

      default:
        // Default pattern with moderate returns
        for (let i = 0; i < days; i++) {
          const dailyReturn = (Math.random() * 2 - 0.5);
          equity = equity * (1 + dailyReturn / 100);
          data.push(createDataPoint(i, equity));
        }
    }
    
    return data;
  };

  const createDataPoint = (day: number, equity: number) => ({
    date: new Date(Date.now() - (30 - day) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    equity: Math.round(equity * 100) / 100
  });

  const data = generatePerformanceData();
  const startEquity = data[0].equity;
  const endEquity = data[data.length - 1].equity;
  const totalReturn = ((endEquity - startEquity) / startEquity * 100).toFixed(2);
  const isPositive = endEquity >= startEquity;

  // Calculate min and max values for Y axis padding
  const values = data.map(d => d.equity);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-100">Performance History</h3>
        <div className={`text-sm font-medium ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
          Total Return: {isPositive ? '+' : ''}{totalReturn}%
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" />
            <XAxis 
              dataKey="date"
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              domain={[min - padding, max + padding]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1d23',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#9ca3af' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Equity']}
            />
            <Line 
              type="monotone"
              dataKey="equity"
              stroke={
                strategy.type === 'AI' ? '#4ade80' : 
                strategy.type === 'Traditional' ? '#f59e0b' :
                '#ef4444'
              }
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="p-3 bg-dark rounded-lg border border-gray-800">
          <span className="text-xs text-gray-400">Starting Balance</span>
          <p className="text-lg font-medium text-gray-200">${startEquity.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-dark rounded-lg border border-gray-800">
          <span className="text-xs text-gray-400">Current Balance</span>
          <p className={`text-lg font-medium ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
            ${endEquity.toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-dark rounded-lg border border-gray-800">
          <span className="text-xs text-gray-400">Profit/Loss</span>
          <p className={`text-lg font-medium ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
            {isPositive ? '+' : '-'}${Math.abs(endEquity - startEquity).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};