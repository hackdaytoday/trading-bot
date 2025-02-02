import React, { useState, useEffect, useCallback } from 'react';
import { TradingStrategy, StrategyParameter } from '../../types/strategy';
import { X, Save, RotateCcw } from 'lucide-react';

interface StrategySettingsProps {
  strategy: TradingStrategy;
  onClose: () => void;
  onSave: (updatedStrategy: TradingStrategy) => void;
}

const StrategySettings: React.FC<StrategySettingsProps> = ({
  strategy,
  onClose,
  onSave,
}) => {
  // Initialize parameters with default values if they're undefined
  const initializeParameters = useCallback((params: StrategyParameter[]) => {
    return params.map(param => ({
      ...param,
      value: param.value ?? param.default ?? param.min ?? 0,
      min: param.min ?? 0,
      max: param.max ?? 100,
      step: param.step ?? 1,
      default: param.default ?? 0,
      description: param.description ?? ''
    }));
  }, []);

  const [parameters, setParameters] = useState<StrategyParameter[]>(() => 
    initializeParameters(strategy.parameters)
  );
  const [isDirty, setIsDirty] = useState(false);

  // Update parameters when strategy changes
  useEffect(() => {
    setParameters(initializeParameters(strategy.parameters));
    setIsDirty(false);
  }, [strategy, initializeParameters]);

  const handleParameterChange = (paramName: string, value: number) => {
    setParameters(prev =>
      prev.map(param =>
        param.name === paramName ? { ...param, value } : param
      )
    );
    setIsDirty(true);
  };

  const handleReset = () => {
    setParameters(initializeParameters(strategy.parameters));
    setIsDirty(false);
  };

  const handleSave = () => {
    const updatedStrategy = {
      ...strategy,
      parameters,
      lastModified: new Date(),
    };
    onSave(updatedStrategy);
    setIsDirty(false);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleBackdropClick = () => {
    if (!isDirty) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-dark-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-gray-100">Strategy Settings</h2>
          <div className="flex items-center space-x-4">
            {isDirty && (
              <>
                <button
                  onClick={handleReset}
                  className="flex items-center text-gray-400 hover:text-gray-100"
                >
                  <RotateCcw className="w-5 h-5 mr-1" />
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center text-accent-green hover:text-accent-green-dark"
                >
                  <Save className="w-5 h-5 mr-1" />
                  Save
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Strategy Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-100">{strategy.name}</h3>
            <p className="text-gray-400">{strategy.description}</p>
          </div>

          {/* Parameters */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-100">Parameters</h3>
            {parameters.map((param) => (
              <div key={param.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-gray-400">{param.name}</label>
                  <span className="text-gray-100">
                    {typeof param.value === 'number' ? param.value.toFixed(2) : '0.00'}
                  </span>
                </div>
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={param.value}
                  onChange={(e) => handleParameterChange(param.name, Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10B981 0%, #10B981 ${
                      ((param.value - param.min) / (param.max - param.min)) * 100
                    }%, #1F2937 ${
                      ((param.value - param.min) / (param.max - param.min)) * 100
                    }%, #1F2937 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{param.min}</span>
                  <span>{param.max}</span>
                </div>
                <p className="text-sm text-gray-400">{param.description}</p>
              </div>
            ))}
          </div>

          {/* Market Conditions */}
          {strategy.marketConditions?.optimal && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-100">Optimal Market Conditions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Trend</span>
                  <p className="text-gray-100 capitalize">{strategy.marketConditions.optimal.trend}</p>
                </div>
                <div>
                  <span className="text-gray-400">Volatility</span>
                  <p className="text-gray-100">
                    {(strategy.marketConditions.optimal.volatility * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Volume</span>
                  <p className="text-gray-100">{strategy.marketConditions.optimal.volume}</p>
                </div>
                <div>
                  <span className="text-gray-400">Timeframe</span>
                  <p className="text-gray-100">{strategy.marketConditions.optimal.timeframe}</p>
                </div>
              </div>
            </div>
          )}
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
            disabled={!isDirty}
            className={`px-4 py-2 rounded-md ${
              isDirty
                ? 'bg-accent-green text-white hover:bg-opacity-90'
                : 'bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategySettings;
