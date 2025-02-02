import React, { useState } from 'react';
import { StrategyParameter } from '../../types/strategy';
import { Slider } from '../common/Slider';

interface StrategyParametersProps {
  parameters: StrategyParameter[];
  onParameterChange: (name: string, value: number) => void;
  readOnly?: boolean;
}

const StrategyParameters: React.FC<StrategyParametersProps> = ({
  parameters,
  onParameterChange,
  readOnly = false
}) => {
  const [expandedParam, setExpandedParam] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {parameters.map((param) => (
        <div key={param.name} className="bg-dark-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-gray-100 font-medium">{param.name}</h3>
              <p className="text-gray-400 text-sm">{param.description}</p>
            </div>
            <button
              onClick={() => setExpandedParam(expandedParam === param.name ? null : param.name)}
              className="text-gray-400 hover:text-gray-100"
            >
              {expandedParam === param.name ? '−' : '+'}
            </button>
          </div>

          <div className={`space-y-4 ${expandedParam === param.name ? 'block' : 'hidden'}`}>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Current Value:</span>
              <span className="text-gray-100 font-medium">{param.value}</span>
            </div>

            {!readOnly && (
              <Slider
                min={param.min}
                max={param.max}
                step={param.step}
                value={param.value}
                onChange={(value) => onParameterChange(param.name, value)}
              />
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Min:</span>
                <span className="text-gray-100 ml-2">{param.min}</span>
              </div>
              <div>
                <span className="text-gray-400">Max:</span>
                <span className="text-gray-100 ml-2">{param.max}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StrategyParameters;
