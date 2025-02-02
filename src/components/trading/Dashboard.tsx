import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Bot, Play, Pause, Settings, Brain, 
  Shield, Activity, TrendingUp, AlertTriangle, Wallet, DollarSign,
  BarChart2, Clock, ChevronRight, LineChart, Target, PieChart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { botService } from '../../services/bot';
import { metaApiService } from '../../services/metaapi';
import { Strategy } from '../../services/bot/types';
import { StrategySelector } from './StrategySelector';
import { RiskWarningModal } from './RiskWarningModal';
import { PriceDisplay } from './PriceDisplay';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import useTradeMetrics from '../../hooks/useTradeMetrics';
import MetricCard from './MetricCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { AlertTriangle as AlertTriangleIcon, TrendingUp as TrendingUpIcon, DollarSign as DollarSignIcon, PieChart as PieChartIcon, Shield as ShieldIcon } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showRiskWarning, setShowRiskWarning] = useState(false);
  const [showStrategySelector, setShowStrategySelector] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState<Strategy | null>(null);
  const [botStatus, setBotStatus] = useState({ isRunning: false });
  const [positions, setPositions] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('1D');

  const { metrics, loading, error, retry } = useTradeMetrics({
    updateInterval: 5000,
    maxRetries: 3,
    cacheExpiration: 60000,
  });

  // Generate sample performance data
  useEffect(() => {
    if (!metrics?.balance.value) return;
    
    const data = [];
    let equity = metrics.balance.value;
    const points = 24;
    
    for (let i = 0; i < points; i++) {
      const date = new Date();
      date.setHours(date.getHours() - (points - i));
      
      equity += (Math.random() - 0.5) * 100;
      
      data.push({
        time: date.toISOString(),
        equity: Math.round(equity * 100) / 100
      });
    }
    
    setPerformanceData(data);
  }, [metrics?.balance.value]);

  // Add real-time updates
  useEffect(() => {
    let updateInterval: NodeJS.Timer;

    const startUpdates = async () => {
      if (user?.metaTrader.connected) {
        try {
          // Initial update
          await updatePositions();

          // Set up periodic updates
          updateInterval = setInterval(async () => {
            await updatePositions();
          }, 5000);
        } catch (error) {
          console.error('Failed to start updates:', error);
        }
      }
    };

    startUpdates();

    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [user?.metaTrader.connected]);

  const updatePositions = async () => {
    try {
      if (!user?.metaTrader.connected) return;
      const positions = await metaApiService.getPositions();
      setPositions(positions);
    } catch (error) {
      console.error('Failed to update positions:', error);
    }
  };

  const handleStartBot = async () => {
    if (!user?.metaTrader.connected) {
      toast.error('Please connect your MetaTrader account first');
      return;
    }

    if (!activeStrategy) {
      setShowStrategySelector(true);
      return;
    }

    setShowRiskWarning(true);
  };

  const handleAcceptRisk = async () => {
    setShowRiskWarning(false);
    setIsLoading(true);
    
    try {
      await botService.startBot(activeStrategy?.name);
      toast.success('Trading started successfully');
      const status = botService.getBotStatus();
      setBotStatus(status);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start trading';
      console.error('Failed to start trading:', message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopBot = async () => {
    setIsLoading(true);
    try {
      botService.stopBot();
      toast.success('Trading stopped successfully');
      const status = botService.getBotStatus();
      setBotStatus(status);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to stop trading';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={retry} />;
  }

  if (!metrics) {
    return <div className="text-gray-400">No data available</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <MetricCard
          title="Balance"
          value={metrics.balance?.value}
          change={metrics.balance?.change}
          history={metrics.balance?.history}
          icon={<DollarSignIcon className="w-5 h-5" />}
        />
        <MetricCard
          title="Equity"
          value={metrics.equity?.value}
          change={metrics.equity?.change}
          history={metrics.equity?.history}
          icon={<TrendingUpIcon className="w-5 h-5" />}
        />
        <MetricCard
          title="Free Margin"
          value={metrics.freeMargin?.value}
          change={metrics.freeMargin?.change}
          history={metrics.freeMargin?.history}
          icon={<PieChartIcon className="w-5 h-5" />}
        />
        <MetricCard
          title="Profit/Loss"
          value={metrics.profitLoss?.value}
          change={metrics.profitLoss?.change}
          history={metrics.profitLoss?.history}
          icon={metrics.profitLoss?.value >= 0 
            ? <ArrowUpRight className="w-5 h-5 text-accent-green" />
            : <ArrowDownRight className="w-5 h-5 text-accent-red" />
          }
        />
      </div>

      {/* Performance Chart */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800 card card-3d neon-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Performance</h3>
          </div>
          <div className="flex items-center gap-2">
            {['1H', '4H', '1D', '1W', '1M'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  timeRange === range
                    ? 'bg-accent-green text-dark font-medium'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
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
              <YAxis 
                stroke="#6b7280"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1d23',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#9ca3af' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Equity']}
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

      {/* Risk Management Panel */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800 card card-3d neon-border">
        <div className="flex items-center mb-4">
          <ShieldIcon className="w-5 h-5 text-accent-green mr-2" />
          <h2 className="text-xl font-semibold text-gray-100">Risk Management</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-gray-400">
            <span>Risk Level:</span>
            <span className={`font-medium ${
              metrics.riskSettings?.riskLevel === 'Low' ? 'text-accent-green' :
              metrics.riskSettings?.riskLevel === 'Moderate' ? 'text-accent-yellow' :
              'text-accent-red'
            }`}>
              {metrics.riskSettings?.riskLevel || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Stop Loss:</span>
            <span className="text-gray-100">{metrics.riskSettings?.stopLoss?.toFixed(2) || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Take Profit:</span>
            <span className="text-gray-100">{metrics.riskSettings?.takeProfit?.toFixed(2) || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Max Drawdown:</span>
            <span className="text-gray-100">{metrics.riskSettings?.maxDrawdown?.toFixed(2) || 'N/A'}%</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Max Position Size:</span>
            <span className="text-gray-100">{metrics.riskSettings?.maxPositionSize?.toFixed(2) || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Trading Statistics Panel */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800 card card-3d neon-border">
        <div className="flex items-center mb-4">
          <TrendingUpIcon className="w-5 h-5 text-accent-green mr-2" />
          <h2 className="text-xl font-semibold text-gray-100">Trading Statistics</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-gray-400">
            <span>Win Rate:</span>
            <span className="text-gray-100">{metrics.stats?.winRate?.toFixed(2) || 'N/A'}%</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Profit Factor:</span>
            <span className="text-gray-100">{metrics.stats?.profitFactor?.toFixed(2) || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Average Win:</span>
            <span className="text-accent-green">${metrics.stats?.averageWin?.toFixed(2) || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Average Loss:</span>
            <span className="text-accent-red">${Math.abs(metrics.stats?.averageLoss || 0).toFixed(2) || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Total Trades:</span>
            <span className="text-gray-100">{metrics.stats?.totalTrades || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Successful/Failed:</span>
            <span className="text-gray-100">{metrics.stats?.successfulTrades || 0}/{metrics.stats?.failedTrades || 0}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Consecutive Wins/Losses:</span>
            <span className="text-gray-100">{metrics.stats?.consecutiveWins || 0}/{metrics.stats?.consecutiveLosses || 0}</span>
          </div>
        </div>
      </div>

      {/* Bot Controls */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800 card card-3d neon-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-accent-green" />
            <div>
              <h2 className="text-lg font-semibold text-gray-100">Trading Bot</h2>
              <p className="text-sm text-gray-400">Automated trading system</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStrategySelector(true)}
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium border border-gray-800 hover:border-accent-green transition-all text-gray-300 hover:text-accent-green"
            >
              <Brain className="w-4 h-4 mr-2" />
              {activeStrategy?.name || 'Select Strategy'}
            </button>
            <button
              onClick={botStatus.isRunning ? handleStopBot : handleStartBot}
              disabled={isLoading || !user?.metaTrader.connected}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                botStatus.isRunning
                  ? 'bg-accent-red text-dark hover:bg-accent-red/90'
                  : 'bg-accent-green text-dark hover:bg-accent-green/90'
              } disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : botStatus.isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop Trading
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Trading
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bot Status Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Status & Strategy */}
          <div className="space-y-4">
            <div className="bg-dark-card p-6 rounded-lg border border-gray-800 card card-3d neon-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-accent-green" />
                  <span className="text-gray-300">Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    botStatus.isRunning ? 'bg-accent-green animate-pulse' : 'bg-gray-600'
                  }`} />
                  <span className={botStatus.isRunning ? 'text-accent-green' : 'text-gray-500'}>
                    {botStatus.isRunning ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-dark-card p-6 rounded-lg border border-gray-800 card card-3d neon-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-accent-gold" />
                  <span className="text-gray-300">Active Strategy</span>
                </div>
                <span className="text-accent-green">{activeStrategy?.name || 'None'}</span>
              </div>
            </div>

            <div className="bg-dark-card p-6 rounded-lg border border-gray-800 card card-3d neon-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldIcon className="w-5 h-5 text-accent-gold" />
                  <span className="text-gray-300">Risk Level</span>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-accent-gold/10 text-accent-gold">
                  Moderate
                </span>
              </div>
            </div>
          </div>

          {/* Trading Stats */}
          <div className="space-y-4">
            <div className="bg-dark-card p-6 rounded-lg border border-gray-800 card card-3d neon-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart2 className="w-5 h-5 text-accent-green" />
                  <span className="text-gray-300">Open Positions</span>
                </div>
                <span className="text-gray-100">{positions.length}</span>
              </div>
            </div>

            <div className="bg-dark-card p-6 rounded-lg border border-gray-800 card card-3d neon-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-accent-gold" />
                  <span className="text-gray-300">Win Rate</span>
                </div>
                <span className="text-accent-green">68%</span>
              </div>
            </div>

            <div className="bg-dark-card p-6 rounded-lg border border-gray-800 card card-3d neon-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PieChartIcon className="w-5 h-5 text-accent-gold" />
                  <span className="text-gray-300">Profit Factor</span>
                </div>
                <span className="text-accent-green">2.1</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="space-y-4">
            <div className="bg-dark-card p-6 rounded-lg border border-gray-800 card card-3d neon-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">Last Update</span>
                </div>
                <span className="text-gray-400">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="bg-dark-card p-6 rounded-lg border border-gray-800 card card-3d neon-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">Settings</span>
                </div>
                <button className="text-accent-green hover:text-accent-green/80 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-dark-card p-6 rounded-lg border border-gray-800 card card-3d neon-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangleIcon className="w-5 h-5 text-accent-gold" />
                  <span className="text-gray-300">Alerts</span>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-accent-gold/10 text-accent-gold">
                  2 Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Display */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800 card card-3d neon-border">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUpIcon className="w-5 h-5 text-accent-green" />
          <h3 className="text-lg font-semibold text-gray-100">Current Price</h3>
        </div>
        <PriceDisplay symbol={activeStrategy?.symbol || 'EURUSD'} showDetails={true} />
      </div>

      {/* Modals */}
      <StrategySelector
        isOpen={showStrategySelector}
        onClose={() => setShowStrategySelector(false)}
        onSelect={(strategy) => {
          setActiveStrategy(strategy);
          setShowStrategySelector(false);
        }}
        strategies={botService.getStrategies()}
        activeStrategy={activeStrategy}
      />

      <RiskWarningModal
        isOpen={showRiskWarning}
        onAccept={handleAcceptRisk}
        onDecline={() => setShowRiskWarning(false)}
        strategy={activeStrategy?.name || ''}
      />
    </div>
  );
};

export default Dashboard;