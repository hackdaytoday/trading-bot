import React, { useState, useEffect } from 'react';
import { X, Save, Settings, Brain, Shield, AlertTriangle } from 'lucide-react';

interface StrategySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (strategyId: number, settings: any) => void;
  strategy: any;
}

const getInitialSettings = (strategy: any) => {
  if (!strategy) return {};

  switch (strategy.type) {
    case 'AI':
      return {
        riskLevel: 'medium',
        maxDrawdown: 10,
        timeframe: '5m',
        volume: 0.01,
        stopLoss: 20,
        takeProfit: 40,
        maxPositions: 3,
        useAIOptimization: true
      };
    case 'Traditional':
      return {
        timeframe: '15m',
        volume: 0.01,
        stopLoss: 30,
        takeProfit: 60,
        maxPositions: 1,
        indicators: {
          macdFast: 12,
          macdSlow: 26,
          macdSignal: 9,
          rsiPeriod: 14,
          rsiOverbought: 70,
          rsiOversold: 30
        }
      };
    case 'Gambling':
      return {
        baseVolume: 0.01,
        maxVolume: 1.0,
        recoveryMultiplier: 2.0,
        maxConsecutiveLosses: 6,
        maxDrawdownPercent: 20,
        volatilityAdjustment: true
      };
    default:
      return {};
  }
};

export const StrategySettingsModal: React.FC<StrategySettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  strategy
}) => {
  const [settings, setSettings] = useState(() => getInitialSettings(strategy));

  useEffect(() => {
    if (strategy) {
      setSettings(getInitialSettings(strategy));
    }
  }, [strategy]);

  if (!isOpen || !strategy) return null;

  const handleSave = () => {
    onSave(strategy.id, settings);
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderAISettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Risk Level
          </label>
          <select
            value={settings.riskLevel || 'medium'}
            onChange={(e) => handleInputChange('riskLevel', e.target.value)}
            className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Max Drawdown (%)
          </label>
          <input
            type="number"
            value={settings.maxDrawdown || 10}
            onChange={(e) => handleInputChange('maxDrawdown', Number(e.target.value))}
            className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Timeframe
          </label>
          <select
            value={settings.timeframe || '5m'}
            onChange={(e) => handleInputChange('timeframe', e.target.value)}
            className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
          >
            <option value="1m">1 minute</option>
            <option value="5m">5 minutes</option>
            <option value="15m">15 minutes</option>
            <option value="1h">1 hour</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Volume
          </label>
          <input
            type="number"
            step="0.01"
            value={settings.volume || 0.01}
            onChange={(e) => handleInputChange('volume', Number(e.target.value))}
            className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Stop Loss (pips)
          </label>
          <input
            type="number"
            value={settings.stopLoss || 20}
            onChange={(e) => handleInputChange('stopLoss', Number(e.target.value))}
            className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Take Profit (pips)
          </label>
          <input
            type="number"
            value={settings.takeProfit || 40}
            onChange={(e) => handleInputChange('takeProfit', Number(e.target.value))}
            className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-dark rounded-lg border border-gray-800">
        <div>
          <label className="text-sm font-medium text-gray-300">AI Optimization</label>
          <p className="text-xs text-gray-400">Enable AI-powered parameter optimization</p>
        </div>
        <button
          onClick={() => handleInputChange('useAIOptimization', !settings.useAIOptimization)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.useAIOptimization ? 'bg-accent-green' : 'bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.useAIOptimization ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  const renderTraditionalSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Timeframe
          </label>
          <select
            value={settings.timeframe || '15m'}
            onChange={(e) => handleInputChange('timeframe', e.target.value)}
            className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
          >
            <option value="1m">1 minute</option>
            <option value="5m">5 minutes</option>
            <option value="15m">15 minutes</option>
            <option value="1h">1 hour</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Volume
          </label>
          <input
            type="number"
            step="0.01"
            value={settings.volume || 0.01}
            onChange={(e) => handleInputChange('volume', Number(e.target.value))}
            className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Stop Loss (pips)
          </label>
          <input
            type="number"
            value={settings.stopLoss || 30}
            onChange={(e) => handleInputChange('stopLoss', Number(e.target.value))}
            className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Take Profit (pips)
          </label>
          <input
            type="number"
            value={settings.takeProfit || 60}
            onChange={(e) => handleInputChange('takeProfit', Number(e.target.value))}
            className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-100">Indicators</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              MACD Fast Period
            </label>
            <input
              type="number"
              value={settings.indicators?.macdFast || 12}
              onChange={(e) => handleInputChange('indicators', {
                ...settings.indicators,
                macdFast: Number(e.target.value)
              })}
              className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              MACD Slow Period
            </label>
            <input
              type="number"
              value={settings.indicators?.macdSlow || 26}
              onChange={(e) => handleInputChange('indicators', {
                ...settings.indicators,
                macdSlow: Number(e.target.value)
              })}
              className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              MACD Signal Period
            </label>
            <input
              type="number"
              value={settings.indicators?.macdSignal || 9}
              onChange={(e) => handleInputChange('indicators', {
                ...settings.indicators,
                macdSignal: Number(e.target.value)
              })}
              className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              RSI Period
            </label>
            <input
              type="number"
              value={settings.indicators?.rsiPeriod || 14}
              onChange={(e) => handleInputChange('indicators', {
                ...settings.indicators,
                rsiPeriod: Number(e.target.value)
              })}
              className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderGamblingSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Base Volume
          </label>
          <input
            type="number"
            step="0.01"
            value={settings.baseVolume || 0.01}
            onChange={(e) => handleInputChange('baseVolume', Number(e.target.value))}
            className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Max Volume
          </label>
          <input
            type="number"
            step="0.01"
            value={settings.maxVolume || 1.0}
            onChange={(e) => handleInputChange('maxVolume', Number(e.target.value))}
            className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Recovery Multiplier
          </label>
          <input
            type="number"
            step="0.1"
            value={settings.recoveryMultiplier || 2.0}
            onChange={(e) => handleInputChange('recoveryMultiplier', Number(e.target.value))}
            className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Max Consecutive Losses
          </label>
          <input
            type="number"
            value={settings.maxConsecutiveLosses || 6}
            onChange={(e) => handleInputChange('maxConsecutiveLosses', Number(e.target.value))}
            className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-dark rounded-lg border border-gray-800">
        <div>
          <label className="text-sm font-medium text-gray-300">Volatility Adjustment</label>
          <p className="text-xs text-gray-400">Adjust position size based on market volatility</p>
        </div>
        <button
          onClick={() => handleInputChange('volatilityAdjustment', !settings.volatilityAdjustment)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.volatilityAdjustment ? 'bg-accent-green' : 'bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.volatilityAdjustment ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-dark-card rounded-lg w-full max-w-2xl card card-3d neon-border m-4 shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(74,222,128,0.2)] transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            {strategy.type === 'AI' && <Brain className="w-5 h-5 text-accent-green" />}
            {strategy.type === 'Traditional' && <Settings className="w-5 h-5 text-accent-blue" />}
            {strategy.type === 'Gambling' && <AlertTriangle className="w-5 h-5 text-accent-yellow" />}
            <h2 className="text-xl font-semibold text-gray-100">{strategy.name} Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {strategy.type === 'AI' && renderAISettings()}
          {strategy.type === 'Traditional' && renderTraditionalSettings()}
          {strategy.type === 'Gambling' && renderGamblingSettings()}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-accent-green text-white rounded-md hover:bg-opacity-90 shadow-[0_0_10px_rgba(74,222,128,0.2)] hover:shadow-[0_0_15px_rgba(74,222,128,0.3)] transition-all duration-300 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategySettingsModal;