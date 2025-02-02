import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AIAnalysis from '../trading/AIAnalysis';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

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

      <AIAnalysis />
    </div>
  );
};

export default Dashboard;
