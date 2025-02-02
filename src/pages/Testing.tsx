import React, { useState } from 'react';
import Backtesting from '../components/trading/Backtesting';
import RiskManagement from '../components/trading/RiskManagement';

const Testing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('backtesting');

  const tabs = [
    { id: 'backtesting', name: 'Backtesting' },
    { id: 'risk', name: 'Risk Management' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Strategy Testing</h2>
          <p className="mt-1 text-sm text-gray-500">
            Test and optimize your trading strategies with historical data
          </p>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'backtesting' && <Backtesting />}
          {activeTab === 'risk' && <RiskManagement />}
        </div>
      </div>
    </div>
  );
};

export default Testing;
