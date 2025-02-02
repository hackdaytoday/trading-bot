import React from 'react';
import { FaArrowUp, FaArrowDown, FaExclamationTriangle } from 'react-icons/fa';

interface MarketSignal {
  symbol: string;
  direction: 'buy' | 'sell' | 'neutral';
  strength: number;
  timeframe: string;
  indicators: {
    name: string;
    value: string;
    signal: 'buy' | 'sell' | 'neutral';
  }[];
  lastUpdate: string;
}

interface MarketAnalysisProps {
  signals: MarketSignal[];
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ signals }) => {
  const getSignalColor = (signal: 'buy' | 'sell' | 'neutral') => {
    switch (signal) {
      case 'buy':
        return 'text-green-600';
      case 'sell':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'bg-green-600';
    if (strength >= 60) return 'bg-green-500';
    if (strength >= 40) return 'bg-yellow-500';
    if (strength >= 20) return 'bg-red-500';
    return 'bg-red-600';
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Market Analysis</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Real-time market signals and indicator analysis
        </p>
      </div>
      <div className="border-t border-gray-200">
        {signals.map((signal) => (
          <div
            key={`${signal.symbol}-${signal.timeframe}`}
            className="px-4 py-5 sm:p-6 border-b border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{signal.symbol}</h4>
                <p className="text-sm text-gray-500">Timeframe: {signal.timeframe}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  {signal.direction === 'buy' && <FaArrowUp className="text-green-600" />}
                  {signal.direction === 'sell' && <FaArrowDown className="text-red-600" />}
                  {signal.direction === 'neutral' && (
                    <FaExclamationTriangle className="text-yellow-600" />
                  )}
                  <span
                    className={`font-medium ${getSignalColor(signal.direction)}`}
                  >
                    {signal.direction.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Updated: {new Date(signal.lastUpdate).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">
                      Signal Strength
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-gray-600">
                      {signal.strength}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${signal.strength}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getStrengthColor(
                      signal.strength
                    )}`}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Indicators</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {signal.indicators.map((indicator) => (
                  <div
                    key={indicator.name}
                    className="bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">
                        {indicator.name}
                      </span>
                      <span
                        className={`text-sm font-medium ${getSignalColor(
                          indicator.signal
                        )}`}
                      >
                        {indicator.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketAnalysis;
