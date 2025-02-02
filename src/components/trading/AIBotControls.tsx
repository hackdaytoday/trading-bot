import React, { useState, useEffect } from 'react';
import { Play, Pause, Settings, AlertTriangle, Bot, Gauge, Brain } from 'lucide-react';
import { aiTradingBot } from '../../services/aiTradingBot';
import { useAuth } from '../../contexts/AuthContext';
import { RiskWarningModal } from './RiskWarningModal';
import toast from 'react-hot-toast';

export const AIBotControls = () => {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [showRiskWarning, setShowRiskWarning] = useState(false);
  const [lastTrade, setLastTrade] = useState<string>('No trades yet');
  const [mode, setMode] = useState<'automatic' | 'manual'>('automatic');
  const [stats, setStats] = useState({
    trades: 0,
    winRate: 0,
    profit: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const status = aiTradingBot.getStatus();
      setIsRunning(status.isRunning);
      if (status.lastTrade) {
        setLastTrade(new Date(status.lastTrade).toLocaleTimeString());
      }
      // Update stats
      setStats(status.stats || {
        trades: 0,
        winRate: 0,
        profit: 0
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartBot = () => {
    if (!user?.metaTrader.connected) {
      toast.error('Please connect your MetaTrader account first');
      return;
    }
    setShowRiskWarning(true);
  };

  const handleAcceptRisk = async () => {
    try {
      setShowRiskWarning(false);
      await aiTradingBot.start(mode);
      toast.success('AI Trading Bot started successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start bot');
    }
  };

  const handleStopBot = () => {
    try {
      aiTradingBot.stop();
      toast.success('AI Trading Bot stopped');
    } catch (error) {
      toast.error('Failed to stop bot');
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Mode Selection */}
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg bg-dark border border-gray-800 p-1">
            <button
              onClick={() => setMode('automatic')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'automatic'
                  ? 'bg-accent-green text-dark'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Brain className="w-4 h-4 mr-2" />
              Automatic
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'manual'
                  ? 'bg-accent-gold text-dark'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Gauge className="w-4 h-4 mr-2" />
              Manual
            </button>
          </div>

          {/* Control Buttons */}
          <button
            onClick={isRunning ? handleStopBot : handleStartBot}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isRunning
                ? 'bg-accent-red text-dark hover:bg-accent-red/90'
                : 'bg-accent-green text-dark hover:bg-accent-green/90'
            } shadow-[0_0_10px_rgba(74,222,128,0.2)] hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]`}
            disabled={!user?.metaTrader.connected}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stop Bot
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Bot
              </>
            )}
          </button>
        </div>

        {/* Stats and Status */}
        <div className="flex items-center gap-6">
          {!user?.metaTrader.connected ? (
            <div className="flex items-center text-accent-red gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Connect MetaTrader to start trading</span>
            </div>
          ) : isRunning && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                <span className="text-gray-400">Bot Active</span>
              </div>
              <div className="text-sm text-gray-400">
                Trades: <span className="text-gray-200">{stats.trades}</span>
              </div>
              <div className="text-sm text-gray-400">
                Win Rate: <span className="text-accent-green">{stats.winRate}%</span>
              </div>
              <div className="text-sm text-gray-400">
                Profit: <span className={stats.profit >= 0 ? 'text-accent-green' : 'text-accent-red'}>
                  ${stats.profit.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Last Trade: {lastTrade}
              </div>
            </>
          )}
        </div>
      </div>

      <RiskWarningModal
        isOpen={showRiskWarning}
        onAccept={handleAcceptRisk}
        onDecline={() => setShowRiskWarning(false)}
      />
    </>
  );
};