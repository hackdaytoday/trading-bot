import React from 'react';
import { X, AlertTriangle, Brain, Target, Shield, TrendingUp, BarChart2, DollarSign } from 'lucide-react';

interface StrategyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  strategy: any;
}

interface StrategyInfo {
  name: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  features: string[];
  warnings: string[];
  recommendations: string[];
  requirements: string[];
}

const strategyInfo: { [key: string]: StrategyInfo } = {
  'Enhanced Martingale': {
    name: 'Enhanced Martingale Strategy',
    description: 'An advanced implementation of the Martingale system with AI-powered risk management and volatility adjustments.',
    riskLevel: 'Extreme',
    features: [
      'Dynamic position sizing based on previous trades',
      'Volatility-adjusted recovery multiplier',
      'Automated drawdown protection',
      'AI-enhanced entry/exit points',
      'Emergency stop-loss mechanisms'
    ],
    warnings: [
      'Extremely high risk of account depletion',
      'Requires substantial capital buffer',
      'Can lead to exponential losses',
      'Not suitable for small accounts',
      'High psychological stress'
    ],
    recommendations: [
      'Use only 5-10% of total capital',
      'Start with minimum position sizes',
      'Monitor drawdown closely',
      'Have clear exit strategy'
    ],
    requirements: [
      'Minimum account size: $10,000',
      'Understanding of exponential risk',
      'Strong risk management skills',
      'Emotional discipline'
    ]
  },
  'AI Kelly Criterion': {
    name: 'AI Kelly Criterion Strategy',
    description: 'A sophisticated implementation of the Kelly Criterion formula enhanced with artificial intelligence for optimal position sizing.',
    riskLevel: 'High',
    features: [
      'Dynamic position sizing using Kelly formula',
      'AI-powered win probability calculation',
      'Real-time market condition analysis',
      'Adaptive risk management',
      'Performance-based adjustments'
    ],
    warnings: [
      'High sensitivity to probability estimates',
      'Can suggest large position sizes',
      'Requires accurate win rate calculation',
      'Performance varies with market conditions'
    ],
    recommendations: [
      'Use fractional Kelly (0.5 or less)',
      'Maintain detailed trade records',
      'Regular strategy validation',
      'Monitor probability estimates'
    ],
    requirements: [
      'Minimum account size: $5,000',
      'Statistical analysis understanding',
      'Consistent trading history',
      'Risk management experience'
    ]
  },
  'Hybrid Grid Gambling': {
    name: 'Hybrid Grid Gambling Strategy',
    description: 'Combines grid trading with progressive position sizing, creating a hybrid approach for volatile markets.',
    riskLevel: 'High',
    features: [
      'Multi-level grid system',
      'Progressive position sizing',
      'Dynamic grid spacing',
      'Automated rebalancing',
      'Volatility-based adjustments'
    ],
    warnings: [
      'Complex position management',
      'High margin requirements',
      'Risk of multiple losing positions',
      'Market direction sensitivity'
    ],
    recommendations: [
      'Start with wider grid spacing',
      'Use conservative position sizing',
      'Monitor total exposure',
      'Regular grid rebalancing'
    ],
    requirements: [
      'Minimum account size: $7,500',
      'Understanding of grid trading',
      'Good market analysis skills',
      'Active monitoring capability'
    ]
  }
};

export const StrategyInfoModal: React.FC<StrategyInfoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  strategy
}) => {
  if (!isOpen) return null;

  const info = strategyInfo[strategy.name];
  if (!info) return null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-accent-green';
      case 'Medium': return 'text-accent-gold';
      case 'High': return 'text-orange-500';
      case 'Extreme': return 'text-accent-red';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl card card-3d neon-border rounded-lg bg-dark-card m-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-accent-green" />
              <div>
                <h2 className="text-2xl font-bold text-gray-100">{info.name}</h2>
                <p className="text-sm text-gray-400">Strategy Information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {/* Risk Level Warning */}
          <div className="flex items-center gap-3 p-4 bg-accent-red/10 border border-accent-red/20 rounded-lg mb-6">
            <AlertTriangle className="w-5 h-5 text-accent-red" />
            <div>
              <p className="text-accent-red font-medium">Risk Level: {info.riskLevel}</p>
              <p className="text-sm text-gray-400">This is a high-risk gambling strategy. Use with extreme caution.</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-accent-green" />
              Strategy Overview
            </h3>
            <p className="text-gray-300">{info.description}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                <Brain className="w-5 h-5 text-accent-green" />
                Key Features
              </h3>
              <div className="space-y-2">
                {info.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent-gold" />
                Requirements
              </h3>
              <div className="space-y-2">
                {info.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                    {req}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Warnings */}
          <div className="mt-6 p-4 bg-dark rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-accent-red" />
              Risk Warnings
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {info.warnings.map((warning, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">{warning}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6 p-4 bg-dark rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-accent-green" />
              Recommendations
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {info.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-accent-green/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                  </div>
                  <span className="text-sm text-gray-300">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-accent-red">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span className="text-sm">High-risk strategy - trade responsibly</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex items-center px-4 py-2 text-sm font-medium text-dark bg-accent-green rounded-lg hover:bg-accent-green/90 transition-all shadow-[0_0_10px_rgba(74,222,128,0.2)] hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]"
              >
                <Shield className="w-4 h-4 mr-2" />
                I Understand, Start Strategy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};