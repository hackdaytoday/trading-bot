import React from 'react';
import { Bot, Brain, TrendingUp, Zap, X } from 'lucide-react';
import { Strategy } from '../../services/bot/types';

interface StrategySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (strategy: Strategy) => void;
  strategies: Strategy[];
  activeStrategy: Strategy | null;
}

export const StrategySelector = ({
  isOpen,
  onClose,
  onSelect,
  strategies,
  activeStrategy
}: StrategySelectorProps) => {
  if (!isOpen) return null;

  const getStrategyIcon = (name: string) => {
    if (name.toLowerCase().includes('ai')) return Brain;
    if (name.toLowerCase().includes('scalp')) return Zap;
    return TrendingUp;
  };

  const handleStrategySelect = (strategy: Strategy) => {
    onSelect(strategy);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-dark-card rounded-lg border border-gray-800">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-accent-green" />
                <h2 className="text-xl font-bold text-gray-100">Select Trading Strategy</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Strategy Grid */}
          <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
            <div className="grid gap-4 md:grid-cols-2">
              {strategies.map((strategy) => {
                const Icon = getStrategyIcon(strategy.name);
                const isActive = activeStrategy?.name === strategy.name;

                return (
                  <button
                    key={strategy.name}
                    onClick={() => handleStrategySelect(strategy)}
                    className={`p-4 text-left rounded-lg border transition-all ${
                      isActive
                        ? 'bg-accent-green/10 border-accent-green'
                        : 'bg-dark border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-accent-green/20 to-accent-green/5 flex items-center justify-center ${
                        isActive ? 'text-accent-green' : 'text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`font-medium ${
                          isActive ? 'text-accent-green' : 'text-gray-200'
                        }`}>
                          {strategy.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {strategy.symbol} • {(strategy.interval / 1000).toFixed(0)}s interval
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-2xs rounded-full bg-dark-hover text-gray-400">
                        Volume: {strategy.volume}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};