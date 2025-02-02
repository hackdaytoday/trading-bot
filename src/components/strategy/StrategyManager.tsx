import React, { useState, useEffect } from 'react';
import { TradingStrategy } from '../../types/strategy';
import { strategyService } from '../../services/strategyService';
import StrategyTester from './StrategyTester';
import StrategyComparison from './StrategyComparison';
import AutoStrategy from './AutoStrategy';
import StrategySettings from './StrategySettings';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';

const StrategyManager: React.FC = () => {
  const [strategies, setStrategies] = useState<TradingStrategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'test' | 'compare' | 'auto'>('test');
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      const loadedStrategies = await strategyService.getStrategies();
      setStrategies(loadedStrategies);
      if (loadedStrategies.length > 0) {
        setSelectedStrategy(loadedStrategies[0]);
      }
    } catch (error) {
      console.error('Failed to load strategies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStrategySelect = (strategy: TradingStrategy) => {
    setSelectedStrategy(strategy);
    setActiveTab('test');
  };

  const handleSettingsSave = async (updatedStrategy: TradingStrategy) => {
    try {
      await strategyService.updateStrategyParameters(
        updatedStrategy.id,
        updatedStrategy.parameters.reduce((acc, param) => ({
          ...acc,
          [param.name]: param.value
        }), {})
      );

      // Update local state
      setStrategies(prev =>
        prev.map(s =>
          s.id === updatedStrategy.id ? updatedStrategy : s
        )
      );
      if (selectedStrategy?.id === updatedStrategy.id) {
        setSelectedStrategy(updatedStrategy);
      }

      setShowSettings(false);
    } catch (error) {
      console.error('Failed to update strategy:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Strategy List */}
        <div className="lg:w-1/4">
          <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Trading Strategies</h2>
            {isLoading ? (
              <div className="text-gray-400">Loading strategies...</div>
            ) : (
              <div className="space-y-2">
                {strategies.map((strategy) => (
                  <div
                    key={strategy.id}
                    className="border-b border-gray-800 last:border-0"
                  >
                    <div className="flex items-center justify-between p-3">
                      <button
                        onClick={() => {
                          if (expandedStrategy === strategy.id) {
                            setExpandedStrategy(null);
                          } else {
                            setExpandedStrategy(strategy.id);
                            setSelectedStrategy(strategy);
                          }
                        }}
                        className="flex-1 flex items-center hover:text-gray-100"
                      >
                        <Settings className="w-5 h-5 text-accent-green mr-2" />
                        <span className="text-gray-100">{strategy.name}</span>
                      </button>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedStrategy(strategy);
                            setShowSettings(true);
                          }}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => {
                            if (expandedStrategy === strategy.id) {
                              setExpandedStrategy(null);
                            } else {
                              setExpandedStrategy(strategy.id);
                              setSelectedStrategy(strategy);
                            }
                          }}
                          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          {expandedStrategy === strategy.id ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {expandedStrategy === strategy.id && (
                      <div className="p-3 text-sm">
                        <p className="text-gray-400 mb-2">{strategy.description}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className={`
                              ${strategy.status === 'active' ? 'text-accent-green' :
                                strategy.status === 'testing' ? 'text-accent-yellow' :
                                'text-gray-400'}
                            `}>
                              {strategy.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Last Modified:</span>
                            <span className="text-gray-100">
                              {new Date(strategy.lastModified).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Author:</span>
                            <span className="text-gray-100">{strategy.author}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleStrategySelect(strategy)}
                          className="mt-3 w-full px-4 py-2 bg-accent-green text-white rounded-md hover:bg-opacity-90"
                        >
                          Select Strategy
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('test')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'test'
                  ? 'bg-accent-green text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-100'
              }`}
            >
              Strategy Tester
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'compare'
                  ? 'bg-accent-green text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-100'
              }`}
            >
              Compare Strategies
            </button>
            <button
              onClick={() => setActiveTab('auto')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'auto'
                  ? 'bg-accent-green text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-100'
              }`}
            >
              Auto Selection
            </button>
          </div>

          {/* Tab Content */}
          {selectedStrategy && activeTab === 'test' && (
            <StrategyTester strategy={selectedStrategy} />
          )}
          {activeTab === 'compare' && (
            <StrategyComparison strategies={strategies} />
          )}
          {activeTab === 'auto' && (
            <AutoStrategy onStrategySelect={handleStrategySelect} />
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && selectedStrategy && (
        <StrategySettings
          strategy={selectedStrategy}
          onClose={() => setShowSettings(false)}
          onSave={handleSettingsSave}
        />
      )}
    </div>
  );
};

export default StrategyManager;
