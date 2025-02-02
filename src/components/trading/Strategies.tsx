import React, { useState, useEffect } from 'react';
import { Plus, Play, Pause, Settings, Trash2, TrendingUp, Brain, Timer, Bot, Shield, Activity, ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { botService } from '../../services/bot';
import { metaApiService } from '../../services/metaapi';
import { StrategySettingsModal } from './StrategySettingsModal';
import { StrategyInfoModal } from './StrategyInfoModal';
import { Strategy } from '../../services/bot/types';
import { useAuth } from '../../contexts/AuthContext';
import { RiskWarningModal } from './RiskWarningModal';
import { StrategyPerformanceChart } from './StrategyPerformanceChart';

interface StrategyDisplay extends Strategy {
  id: number;
  description: string;
  type: 'AI' | 'Traditional' | 'Gambling';
  status: 'active' | 'paused';
  performance: string;
  lastUpdated: string;
  risk: 'low' | 'medium' | 'high';
  winRate: number;
  profitFactor: number;
  trades: number;
}

export const Strategies = () => {
  const { user } = useAuth();
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyDisplay | null>(null);
  const [showRiskWarning, setShowRiskWarning] = useState(false);
  const [showStrategyInfo, setShowStrategyInfo] = useState(false);
  const [strategies, setStrategies] = useState<StrategyDisplay[]>([]);
  const [botStatus, setBotStatus] = useState({ isRunning: false, activeStrategy: null });
  const [showPerformance, setShowPerformance] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Initialize strategies with metadata
    const availableStrategies = botService.getStrategies();
    const enhancedStrategies: StrategyDisplay[] = availableStrategies.map((strategy, index) => {
      // Determine strategy type and risk level
      let type: 'AI' | 'Traditional' | 'Gambling' = 'Traditional';
      let risk: 'low' | 'medium' | 'high' = 'medium';
      let description = '';

      if (strategy.name.includes('AI') || strategy.name.includes('Neural')) {
        type = 'AI';
        description = 'Advanced AI-powered trading strategy';
      } else if (strategy.name.includes('Martingale') || strategy.name.includes('Gambling')) {
        type = 'Gambling';
        risk = 'high';
        description = 'High-risk gambling strategy with progressive sizing';
      } else {
        description = 'Traditional technical analysis strategy';
      }

      // Generate realistic performance metrics
      const winRate = 45 + Math.random() * 30;
      const profitFactor = 1 + Math.random();
      const trades = 50 + Math.floor(Math.random() * 200);
      const performance = ((Math.random() * 40) - 10).toFixed(1);

      return {
        ...strategy,
        id: index + 1,
        description,
        type,
        status: 'paused',
        performance: `${performance}%`,
        lastUpdated: '5m ago',
        risk,
        winRate,
        profitFactor,
        trades
      };
    });

    setStrategies(enhancedStrategies);
  }, []);

  useEffect(() => {
    // Get bot status periodically
    const interval = setInterval(() => {
      const status = botService.getBotStatus();
      setBotStatus(status);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleStartStrategy = async (strategy: StrategyDisplay) => {
    if (!user?.metaTrader.connected) {
      toast.error('Please connect your MetaTrader account first');
      return;
    }

    if (strategy.type === 'Gambling') {
      setSelectedStrategy(strategy);
      setShowStrategyInfo(true);
      return;
    }

    setSelectedStrategy(strategy);
    setShowRiskWarning(true);
  };

  const handleAcceptRisk = async () => {
    if (!selectedStrategy) return;
    
    setShowRiskWarning(false);
    setShowStrategyInfo(false);
    try {
      await botService.startBot(metaApiService.getConnection(), selectedStrategy.name);
      setStrategies(prev => 
        prev.map(s => ({
          ...s,
          status: s.id === selectedStrategy.id ? 'active' : 'paused'
        }))
      );
      toast.success(`${selectedStrategy.name} started successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start strategy');
    }
  };

  const handleStopStrategy = async (strategy: StrategyDisplay) => {
    try {
      botService.stopBot();
      setStrategies(prev => 
        prev.map(s => ({
          ...s,
          status: s.id === strategy.id ? 'paused' : s.status
        }))
      );
      toast.success(`${strategy.name} stopped`);
    } catch (error) {
      toast.error('Failed to stop strategy');
    }
  };

  const handleSettings = (strategy: StrategyDisplay) => {
    setSelectedStrategy(strategy);
    setShowSettings(true);
  };

  const handleDelete = (strategyId: number) => {
    setStrategies(prev => prev.filter(s => s.id !== strategyId));
    toast.success('Strategy deleted');
  };

  const handleSettingsSave = (strategyId: number, settings: any) => {
    setStrategies(prev => 
      prev.map(s => s.id === strategyId ? { ...s, ...settings } : s)
    );
    setShowSettings(false);
    setSelectedStrategy(null);
    toast.success('Strategy settings updated');
  };

  const StrategyCard = ({ strategy }: { strategy: StrategyDisplay }) => (
    <div className="bg-dark-card p-6 rounded-lg card card-3d neon-border">
      {/* Strategy Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {strategy.type === 'AI' ? (
            <Brain className="w-5 h-5 text-accent-gold" />
          ) : strategy.type === 'Gambling' ? (
            <Shield className="w-5 h-5 text-accent-red" />
          ) : (
            <TrendingUp className="w-5 h-5 text-accent-green" />
          )}
          <div>
            <h3 className="font-semibold text-gray-100">{strategy.name}</h3>
            <p className="text-sm text-gray-400">{strategy.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-medium ${
            parseFloat(strategy.performance) >= 0 ? 'text-accent-green' : 'text-accent-red'
          }`}>
            {strategy.performance}
          </span>
        </div>
      </div>

      {/* Strategy Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-dark rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Win Rate</span>
            <Activity className="w-4 h-4 text-accent-green" />
          </div>
          <span className="text-lg font-medium text-accent-green">
            {strategy.winRate.toFixed(1)}%
          </span>
        </div>
        <div className="p-3 bg-dark rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Profit Factor</span>
            <TrendingUp className="w-4 h-4 text-accent-gold" />
          </div>
          <span className="text-lg font-medium text-accent-gold">
            {strategy.profitFactor.toFixed(2)}
          </span>
        </div>
        <div className="p-3 bg-dark rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Risk Level</span>
            <Shield className="w-4 h-4 text-accent-red" />
          </div>
          <span className={`text-lg font-medium capitalize ${
            strategy.risk === 'low' ? 'text-accent-green' :
            strategy.risk === 'medium' ? 'text-accent-gold' :
            'text-accent-red'
          }`}>
            {strategy.risk}
          </span>
        </div>
      </div>

      {/* Strategy Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Symbol</span>
          <span className="text-gray-200">{strategy.symbol}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Interval</span>
          <span className="text-gray-200">{strategy.interval / 1000}s</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Total Trades</span>
          <span className="text-gray-200">{strategy.trades}</span>
        </div>
      </div>

      {/* Strategy Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            strategy.status === 'active' 
              ? 'bg-accent-green/10 text-accent-green' 
              : 'bg-gray-700/50 text-gray-400'
          }`}>
            {strategy.status}
          </span>
          <span className="text-xs text-gray-500">Updated {strategy.lastUpdated}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => showPerformance === strategy.id ? setShowPerformance(null) : setShowPerformance(strategy.id)}
            className="p-2 rounded-lg text-gray-400 hover:text-accent-gold hover:bg-accent-gold/10 transition-colors"
            title="View Performance"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${
              showPerformance === strategy.id ? 'rotate-180' : ''
            }`} />
          </button>
          <button 
            onClick={() => strategy.status === 'active' ? handleStopStrategy(strategy) : handleStartStrategy(strategy)}
            className="p-2 rounded-lg text-gray-400 hover:text-accent-green hover:bg-accent-green/10 transition-colors"
            title={strategy.status === 'active' ? 'Stop Strategy' : 'Start Strategy'}
          >
            {strategy.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => handleSettings(strategy)}
            className="p-2 rounded-lg text-gray-400 hover:text-accent-gold hover:bg-accent-gold/10 transition-colors"
            title="Strategy Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleDelete(strategy.id)}
            className="p-2 rounded-lg text-gray-400 hover:text-accent-red hover:bg-accent-red/10 transition-colors"
            title="Delete Strategy"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Performance Chart */}
      {showPerformance === strategy.id && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <StrategyPerformanceChart strategy={strategy} />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-accent-green">Trading Strategies</h2>
          <p className="text-gray-400 mt-1">Manage and monitor your automated trading strategies</p>
        </div>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-dark bg-accent-green rounded-lg hover:bg-accent-green/90 transition-all">
          <Plus className="w-4 h-4 mr-2" />
          New Strategy
        </button>
      </div>

      {/* Strategy Grid */}
      <div className="grid gap-6">
        {strategies.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}
      </div>

      {/* Modals */}
      {selectedStrategy && showSettings && (
        <StrategySettingsModal
          isOpen={showSettings}
          onClose={() => {
            setShowSettings(false);
            setSelectedStrategy(null);
          }}
          onSave={handleSettingsSave}
          strategy={selectedStrategy}
        />
      )}

      {selectedStrategy && showStrategyInfo && (
        <StrategyInfoModal
          isOpen={showStrategyInfo}
          onClose={() => {
            setShowStrategyInfo(false);
            setSelectedStrategy(null);
          }}
          onConfirm={() => {
            setShowStrategyInfo(false);
            setShowRiskWarning(true);
          }}
          strategy={selectedStrategy}
        />
      )}

      <RiskWarningModal
        isOpen={showRiskWarning}
        onAccept={handleAcceptRisk}
        onDecline={() => {
          setShowRiskWarning(false);
          setSelectedStrategy(null);
        }}
        strategy={selectedStrategy?.name || ''}
      />
    </div>
  );
};