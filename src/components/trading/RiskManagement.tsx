import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

interface RiskSettings {
  maxRiskPerTrade: number;
  maxDailyLoss: number;
  maxDrawdown: number;
  maxOpenTrades: number;
  stopLossType: 'fixed' | 'atr' | 'support';
  takeProfitType: 'fixed' | 'rr' | 'resistance';
  stopLossValue: number;
  takeProfitValue: number;
  trailingStop: boolean;
  trailingStopDistance: number;
}

const RiskManagement: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<RiskSettings>({
    maxRiskPerTrade: 1,
    maxDailyLoss: 3,
    maxDrawdown: 10,
    maxOpenTrades: 3,
    stopLossType: 'fixed',
    takeProfitType: 'rr',
    stopLossValue: 20,
    takeProfitValue: 40,
    trailingStop: false,
    trailingStopDistance: 10,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) : value,
    }));
  };

  const calculatePositionSize = (accountBalance: number, riskPercentage: number, stopLossPips: number) => {
    const riskAmount = (accountBalance * riskPercentage) / 100;
    const pipValue = 0.0001; // Dla par FOREX głównych
    const lotSize = riskAmount / (stopLossPips * pipValue * 100000);
    return Math.round(lotSize * 100) / 100;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement saving risk settings to backend
    toast.success('Risk management settings saved successfully');
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Risk Management</h3>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Risk Per Trade (%)
              </label>
              <input
                type="number"
                name="maxRiskPerTrade"
                value={settings.maxRiskPerTrade}
                onChange={handleInputChange}
                min="0.1"
                max="5"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Daily Loss (%)
              </label>
              <input
                type="number"
                name="maxDailyLoss"
                value={settings.maxDailyLoss}
                onChange={handleInputChange}
                min="1"
                max="10"
                step="0.5"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Drawdown (%)
              </label>
              <input
                type="number"
                name="maxDrawdown"
                value={settings.maxDrawdown}
                onChange={handleInputChange}
                min="5"
                max="30"
                step="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Open Trades
              </label>
              <input
                type="number"
                name="maxOpenTrades"
                value={settings.maxOpenTrades}
                onChange={handleInputChange}
                min="1"
                max="10"
                step="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stop Loss Type
              </label>
              <select
                name="stopLossType"
                value={settings.stopLossType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="fixed">Fixed Pips</option>
                <option value="atr">ATR Based</option>
                <option value="support">Support/Resistance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Take Profit Type
              </label>
              <select
                name="takeProfitType"
                value={settings.takeProfitType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="fixed">Fixed Pips</option>
                <option value="rr">Risk/Reward Ratio</option>
                <option value="resistance">Support/Resistance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stop Loss Value (Pips)
              </label>
              <input
                type="number"
                name="stopLossValue"
                value={settings.stopLossValue}
                onChange={handleInputChange}
                min="10"
                max="100"
                step="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Take Profit Value
              </label>
              <input
                type="number"
                name="takeProfitValue"
                value={settings.takeProfitValue}
                onChange={handleInputChange}
                min="20"
                max="200"
                step="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="trailingStop"
              checked={settings.trailingStop}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Enable Trailing Stop
            </label>
          </div>

          {settings.trailingStop && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Trailing Stop Distance (Pips)
              </label>
              <input
                type="number"
                name="trailingStopDistance"
                value={settings.trailingStopDistance}
                onChange={handleInputChange}
                min="5"
                max="50"
                step="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          )}

          {user?.metaTrader.account && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900">Position Size Calculator</h4>
              <p className="mt-1 text-sm text-gray-500">
                Based on your current balance (${user.metaTrader.account.balance.toFixed(2)}) and risk settings:
              </p>
              <p className="mt-2 text-sm text-gray-900">
                Recommended position size:{' '}
                <span className="font-medium">
                  {calculatePositionSize(
                    user.metaTrader.account.balance,
                    settings.maxRiskPerTrade,
                    settings.stopLossValue
                  )}{' '}
                  lots
                </span>
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiskManagement;
