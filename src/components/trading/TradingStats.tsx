import React from 'react';

interface TradingStatsProps {
  stats: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    averageWin: number;
    averageLoss: number;
    profitFactor: number;
  };
}

const TradingStats: React.FC<TradingStatsProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Trading Statistics</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate">Total Trades</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalTrades}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate">Win Rate</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {(stats.winRate * 100).toFixed(1)}%
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate">Average Win</dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">
              ${stats.averageWin.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate">Average Loss</dt>
            <dd className="mt-1 text-3xl font-semibold text-red-600">
              ${Math.abs(stats.averageLoss).toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate">Winning Trades</dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.winningTrades}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate">Losing Trades</dt>
            <dd className="mt-1 text-3xl font-semibold text-red-600">{stats.losingTrades}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 truncate">Profit Factor</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.profitFactor.toFixed(2)}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingStats;
