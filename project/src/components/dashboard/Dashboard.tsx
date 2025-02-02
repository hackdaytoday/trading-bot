import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AIAnalysis from '../trading/AIAnalysis';
import TradeHistory from '../trading/TradeHistory';
import TradingStats from '../trading/TradingStats';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

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

  if (!user?.metaTrader.account) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Loading account information...</p>
      </div>
    );
  }

  const { balance, equity, profit } = user.metaTrader.account;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Balance</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-700">${balance.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Equity</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-700">${equity.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Profit</h3>
          <p className={`mt-2 text-3xl font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${profit.toFixed(2)}
          </p>
        </div>
      </div>

      <TradingStats stats={mockStats} />
      <AIAnalysis />
      <TradeHistory trades={mockTrades} />
    </div>
  );
};

export default Dashboard;
