import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const strategies = [
  {
    name: 'Trend Following',
    description: 'Follow market trends using moving averages and momentum indicators.',
    features: [
      'Multiple timeframe analysis',
      'Dynamic stop-loss adjustment',
      'Trend strength indicators',
      'Position sizing optimization',
    ],
  },
  {
    name: 'Mean Reversion',
    description: 'Capitalize on price deviations from historical averages.',
    features: [
      'Statistical analysis',
      'Volatility-based entry/exit',
      'Risk-adjusted position sizing',
      'Multiple asset correlation',
    ],
  },
  {
    name: 'Breakout Trading',
    description: 'Identify and trade price breakouts from key levels.',
    features: [
      'Support/resistance detection',
      'Volume confirmation',
      'False breakout filtering',
      'Time-based exit rules',
    ],
  },
];

const Strategies: React.FC = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Trading Strategies
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Choose from our selection of proven trading strategies or customize them to your needs.
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {strategies.map((strategy) => (
            <div key={strategy.name} className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{strategy.name}</h3>
                <p className="mt-4 text-gray-500">{strategy.description}</p>
                <ul className="mt-6 space-y-4">
                  {strategy.features.map((feature) => (
                    <li key={feature} className="flex">
                      <FaCheckCircle className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-blue-700"
              >
                Select Strategy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Strategies;
