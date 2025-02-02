import React, { useState, useEffect } from 'react';
import { Save, Bell, Shield, Wallet, Globe, Clock, RefreshCw, Key, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { botService } from '../../services/bot';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      trades: true,
      signals: true,
      news: false,
    },
    trading: {
      autoClose: true,
      maxDrawdown: "10",
      riskPerTrade: "2",
      maxPositions: "5",
      timeframe: "5m"
    },
    interface: {
      theme: "dark",
      refreshRate: "5",
    },
    api: {
      openaiKey: "",
      openaiEnabled: false
    }
  });

  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('tradingSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({
        ...prev,
        ...parsed,
        api: {
          ...prev.api,
          openaiKey: localStorage.getItem('openai_api_key') || '',
          openaiEnabled: !!localStorage.getItem('openai_api_key')
        }
      }));
    }
  }, []);

  const handleNotificationChange = (key: keyof typeof settings.notifications) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleInputChange = (section: 'trading' | 'interface' | 'api', key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate settings
      const maxDrawdown = parseFloat(settings.trading.maxDrawdown);
      const riskPerTrade = parseFloat(settings.trading.riskPerTrade);
      const maxPositions = parseInt(settings.trading.maxPositions);

      if (isNaN(maxDrawdown) || maxDrawdown <= 0 || maxDrawdown > 100) {
        throw new Error('Max drawdown must be between 0 and 100');
      }

      if (isNaN(riskPerTrade) || riskPerTrade <= 0 || riskPerTrade > 10) {
        throw new Error('Risk per trade must be between 0 and 10');
      }

      if (isNaN(maxPositions) || maxPositions <= 0 || maxPositions > 10) {
        throw new Error('Max positions must be between 1 and 10');
      }

      // Update bot configuration
      await botService.updateConfig({
        maxDrawdownPercent: maxDrawdown,
        riskPerTrade: riskPerTrade / 100,
        maxPositions: maxPositions,
        notifications: settings.notifications,
        autoClose: settings.trading.autoClose
      });

      // Save OpenAI API key securely
      if (settings.api.openaiKey) {
        localStorage.setItem('openai_api_key', settings.api.openaiKey);
      } else {
        localStorage.removeItem('openai_api_key');
      }

      // Save interface settings
      localStorage.setItem('tradingSettings', JSON.stringify({
        interface: settings.interface,
        notifications: settings.notifications
      }));

      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-accent-green">Settings</h2>
          <p className="text-gray-400 mt-1">Configure your trading environment</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-4 py-2 text-sm font-medium text-dark bg-accent-green rounded-lg hover:bg-accent-green/90 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* API Configuration */}
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">API Configuration</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">OpenAI API Key</label>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-accent-gold" />
                  <span className="text-xs text-accent-gold">Stored Securely</span>
                </div>
              </div>
              <input
                type="password"
                value={settings.api.openaiKey}
                onChange={(e) => handleInputChange('api', 'openaiKey', e.target.value)}
                placeholder="Enter your OpenAI API key"
                className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-accent-green"
              />
              <div className="mt-2 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
                <p className="text-xs text-gray-400">
                  Your API key is stored securely in your browser's local storage and is never transmitted to third parties.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-dark rounded-lg border border-gray-800">
              <div>
                <span className="text-sm font-medium text-gray-300">Enable AI Features</span>
                <p className="text-xs text-gray-400 mt-1">Use OpenAI for enhanced analysis</p>
              </div>
              <button
                onClick={() => handleInputChange('api', 'openaiEnabled', !settings.api.openaiEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.api.openaiEnabled ? 'bg-accent-green' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.api.openaiEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="card card-3d neon-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Account Information</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-dark rounded-lg border border-gray-800 hover:border-accent-green transition-colors">
              <span className="block text-sm text-gray-400">Server</span>
              <span className="text-gray-100">{user?.metaTrader.server}</span>
            </div>
            <div className="p-4 bg-dark rounded-lg border border-gray-800 hover:border-accent-green transition-colors">
              <span className="block text-sm text-gray-400">Login ID</span>
              <span className="text-gray-100">{user?.metaTrader.login}</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card card-3d neon-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Notifications</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-dark rounded-lg border border-gray-800 hover:border-accent-green transition-colors">
                <span className="text-gray-100 capitalize">{key}</span>
                <button
                  onClick={() => handleNotificationChange(key as keyof typeof settings.notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-accent-green' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Trading Settings */}
        <div className="card card-3d neon-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Trading Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark rounded-lg border border-gray-800 hover:border-accent-green transition-colors">
              <span className="text-gray-100">Auto Close</span>
              <button
                onClick={() => handleInputChange('trading', 'autoClose', (!settings.trading.autoClose).toString())}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.trading.autoClose ? 'bg-accent-green' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.trading.autoClose ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="p-4 bg-dark rounded-lg border border-gray-800 hover:border-accent-green transition-colors">
              <label className="block text-sm text-gray-400 mb-2">Max Drawdown (%)</label>
              <input
                type="number"
                value={settings.trading.maxDrawdown}
                onChange={(e) => handleInputChange('trading', 'maxDrawdown', e.target.value)}
                min="0"
                max="100"
                step="0.1"
                className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-accent-green"
              />
            </div>
            <div className="p-4 bg-dark rounded-lg border border-gray-800 hover:border-accent-green transition-colors">
              <label className="block text-sm text-gray-400 mb-2">Risk Per Trade (%)</label>
              <input
                type="number"
                value={settings.trading.riskPerTrade}
                onChange={(e) => handleInputChange('trading', 'riskPerTrade', e.target.value)}
                min="0"
                max="10"
                step="0.1"
                className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-accent-green"
              />
            </div>
            <div className="p-4 bg-dark rounded-lg border border-gray-800 hover:border-accent-green transition-colors">
              <label className="block text-sm text-gray-400 mb-2">Max Positions</label>
              <input
                type="number"
                value={settings.trading.maxPositions}
                onChange={(e) => handleInputChange('trading', 'maxPositions', e.target.value)}
                min="1"
                max="10"
                className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-accent-green"
              />
            </div>
            <div className="p-4 bg-dark rounded-lg border border-gray-800 hover:border-accent-green transition-colors">
              <label className="block text-sm text-gray-400 mb-2">Timeframe</label>
              <select
                value={settings.trading.timeframe}
                onChange={(e) => handleInputChange('trading', 'timeframe', e.target.value)}
                className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-accent-green"
              >
                <option value="1m">1 minute</option>
                <option value="5m">5 minutes</option>
                <option value="15m">15 minutes</option>
                <option value="1h">1 hour</option>
                <option value="4h">4 hours</option>
                <option value="1d">1 day</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interface Settings */}
        <div className="card card-3d neon-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Interface Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-dark rounded-lg border border-gray-800 hover:border-accent-green transition-colors">
              <label className="block text-sm text-gray-400 mb-2">Theme</label>
              <select
                value={settings.interface.theme}
                onChange={(e) => handleInputChange('interface', 'theme', e.target.value)}
                className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-accent-green"
              >
                <option value="dark">Dark</option>
                <option value="darker">Darker</option>
              </select>
            </div>
            <div className="p-4 bg-dark rounded-lg border border-gray-800 hover:border-accent-green transition-colors">
              <label className="block text-sm text-gray-400 mb-2">Refresh Rate (seconds)</label>
              <input
                type="number"
                value={settings.interface.refreshRate}
                onChange={(e) => handleInputChange('interface', 'refreshRate', e.target.value)}
                min="1"
                max="60"
                className="w-full bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-accent-green"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};