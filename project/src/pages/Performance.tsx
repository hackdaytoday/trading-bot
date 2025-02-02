import React from 'react';
import TradingStats from '../components/trading/TradingStats';
import TradeHistory from '../components/trading/TradeHistory';

const Performance: React.FC = () => {
  // Mock data for demonstration
  const mockTrades = [
    {
      id: '1',
      symbol: 'EURUSD',
      type: 'buy' as const,
      openPrice: 1.12345,
      closePrice: 1.12456,
      profit: 111.00,
      openTime: '2025-02-01T10:00:00Z',
      closeTime: '2025-02-01T14:30:00Z',
    },
    {
      id: '2',
      symbol: 'GBPUSD',
      type: 'sell' as const,
      openPrice: 1.35678,
      closePrice: 1.35567,
      profit: -89.00,
      openTime: '2025-02-01T11:15:00Z',
      closeTime: '2025-02-01T15:45:00Z',
    },
  ];

  const mockStats = {
    totalTrades: 50,
    winningTrades: 30,
    losingTrades: 20,
    winRate: 0.6,
    averageWin: 150.25,
    averageLoss: -75.50,
    profitFactor: 2.1,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Trading Performance
        </h2>
        <p className="mt-4 text-lg text-gray-500">
          Track your trading performance and analyze your results.
        </p>
      </div>

      <div className="space-y-8">
        <TradingStats stats={mockStats} />
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Charts</h3>
          <div className="h-96 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Performance charts will be displayed here</p>
          </div>
        </div>

        <TradeHistory trades={mockTrades} />
      </div>
    </div>
  );
};

export default Performance;
