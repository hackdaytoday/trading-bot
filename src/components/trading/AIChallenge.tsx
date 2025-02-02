import React, { useState, useEffect } from 'react';
import { 
  Trophy, Target, Zap, AlertTriangle, Settings, Play, 
  Pause, RefreshCw, ChevronDown, BarChart2, Clock,
  Shield, Activity, TrendingUp, Bot, Building2, Check,
  LineChart, ArrowUpRight, ArrowDownRight, DollarSign
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

interface Phase {
  name: string;
  duration: number;
  profitTarget: number;
  maxDrawdown: number;
}

interface PropFirm {
  id: number;
  name: string;
  color: string;
  accountSizes: number[];
  features: string[];
  phases: Phase[];
}

const propFirms: PropFirm[] = [
  {
    id: 1,
    name: 'FTMO',
    color: '#00c853',
    accountSizes: [10000, 25000, 50000, 100000, 200000],
    features: [
      'Instant Payout',
      'Free Retry',
      'Scaling Plan',
      'No Time Limit',
      'Multiple Accounts'
    ],
    phases: [
      {
        name: 'Challenge',
        duration: 30,
        profitTarget: 10,
        maxDrawdown: 5
      },
      {
        name: 'Verification',
        duration: 60,
        profitTarget: 5,
        maxDrawdown: 5
      }
    ]
  },
  {
    id: 2,
    name: 'MyForexFunds',
    color: '#2196f3',
    accountSizes: [5000, 15000, 25000, 50000, 100000],
    features: [
      'Low Entry Fee',
      'High Profit Split',
      'No Minimum Days',
      'Weekend Holding',
      'EA Trading'
    ],
    phases: [
      {
        name: 'Evaluation',
        duration: 30,
        profitTarget: 8,
        maxDrawdown: 5
      }
    ]
  },
  {
    id: 3,
    name: 'TrueForex',
    color: '#f44336',
    accountSizes: [10000, 25000, 50000, 100000],
    features: [
      'One-Phase Program',
      'Fast Verification',
      'Daily Drawdown',
      'News Trading',
      'Raw Spreads'
    ],
    phases: [
      {
        name: 'Challenge',
        duration: 30,
        profitTarget: 10,
        maxDrawdown: 5
      }
    ]
  },
  {
    id: 4,
    name: 'PropFirm X',
    color: '#9c27b0',
    accountSizes: [5000, 10000, 25000, 50000, 100000],
    features: [
      'Flexible Rules',
      'High Leverage',
      'Crypto Trading',
      'Mobile App',
      '24/7 Support'
    ],
    phases: [
      {
        name: 'Challenge',
        duration: 45,
        profitTarget: 8,
        maxDrawdown: 6
      }
    ]
  },
  {
    id: 5,
    name: 'FundedNext',
    color: '#ff9800',
    accountSizes: [15000, 25000, 50000, 100000, 200000],
    features: [
      'Express Evaluation',
      'Profit Milestones',
      'Low Commission',
      'Swap-Free',
      'MetaTrader 5'
    ],
    phases: [
      {
        name: 'Express',
        duration: 30,
        profitTarget: 12,
        maxDrawdown: 8
      }
    ]
  }
];

export const AIChallenge = () => {
  const { user } = useAuth();
  const [selectedFirm, setSelectedFirm] = useState<PropFirm>(propFirms[0]);
  const [selectedSize, setSelectedSize] = useState<number>(propFirms[0].accountSizes[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsRunning(false);
            toast.success('Challenge phase completed!');
            return 100;
          }
          return newProgress;
        });

        // Update performance data
        setPerformanceData(prev => {
          const lastValue = prev[prev.length - 1]?.equity || 10000;
          const change = (Math.random() * 200) - 100;
          return [...prev, {
            time: new Date().toISOString(),
            equity: lastValue + change
          }];
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const handleStart = () => {
    if (!user?.metaTrader.connected) {
      toast.error('Please connect your MetaTrader account first');
      return;
    }
    setIsRunning(true);
    setProgress(0);
    setPerformanceData([{ time: new Date().toISOString(), equity: selectedSize }]);
    toast.success('AI Challenge started!');
  };

  const handleStop = () => {
    setIsRunning(false);
    toast.success('AI Challenge paused');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-accent-green neon-text">AI Challenge</h2>
          <p className="text-gray-400 mt-1">Automated prop firm challenge trading</p>
        </div>
        <button
          onClick={isRunning ? handleStop : handleStart}
          disabled={!user?.metaTrader.connected}
          className="flex items-center px-4 py-2 text-sm font-medium text-dark bg-accent-green rounded-lg hover:bg-accent-green/90 transition-all shadow-[0_0_10px_rgba(74,222,128,0.2)] hover:shadow-[0_0_15px_rgba(74,222,128,0.3)] disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Stop Challenge
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Challenge
            </>
          )}
        </button>
      </div>

      {/* Prop Firm Selection */}
      <div className="grid gap-6 md:grid-cols-5">
        {propFirms.map((firm) => (
          <button
            key={firm.id}
            onClick={() => {
              setSelectedFirm(firm);
              setSelectedSize(firm.accountSizes[0]);
            }}
            className={`card card-3d rounded-lg p-6 transition-all ${
              selectedFirm.id === firm.id
                ? 'neon-border border-2'
                : 'border border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-green/5 flex items-center justify-center">
                <Building2 className="w-5 h-5" style={{ color: firm.color }} />
              </div>
              {selectedFirm.id === firm.id && (
                <div className="w-6 h-6 rounded-full bg-accent-green/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-accent-green" />
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">{firm.name}</h3>
            <div className="flex items-center text-sm text-gray-400">
              <span>From </span>
              <span className="text-accent-green ml-1">
                {formatCurrency(firm.accountSizes[0])}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Challenge Configuration */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Size Selection */}
        <div className="card card-3d neon-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Account Size</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {selectedFirm.accountSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedSize === size
                    ? 'bg-accent-green/10 border-accent-green text-accent-green'
                    : 'bg-dark border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                {formatCurrency(size)}
              </button>
            ))}
          </div>
        </div>

        {/* Challenge Rules */}
        <div className="card card-3d neon-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Challenge Rules</h3>
          </div>
          <div className="space-y-4">
            {selectedFirm.phases.map((phase, index) => (
              <div
                key={index}
                className="p-4 bg-dark rounded-lg border border-gray-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">{phase.name}</span>
                  <span className="text-xs text-gray-500">{phase.duration} days</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-400">Profit Target</span>
                    <p className="text-accent-green">{phase.profitTarget}%</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Max Drawdown</span>
                    <p className="text-accent-red">{phase.maxDrawdown}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress and Performance */}
      {(isRunning || progress > 0) && (
        <>
          {/* Progress */}
          <div className="card card-3d neon-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent-green" />
                <h3 className="text-lg font-semibold text-gray-100">Challenge Progress</h3>
              </div>
              <span className="text-accent-green">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-green transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Performance Chart */}
          <div className="card card-3d neon-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-accent-green" />
                <h3 className="text-lg font-semibold text-gray-100">Performance</h3>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" />
                  <XAxis 
                    dataKey="time"
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    stroke="#6b7280"
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1d23',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                    }}
                    labelStyle={{ color: '#9ca3af' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Equity']}
                    labelFormatter={(label) => new Date(label as string).toLocaleTimeString()}
                  />
                  <Line 
                    type="monotone"
                    dataKey="equity"
                    stroke="#4ade80"
                    strokeWidth={2}
                    dot={false}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Features */}
      <div className="card card-3d neon-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-accent-green" />
          <h3 className="text-lg font-semibold text-gray-100">Features</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {selectedFirm.features.map((feature, index) => (
            <div
              key={index}
              className="p-4 bg-dark rounded-lg border border-gray-800 flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-accent-green" />
              <span className="text-sm text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};