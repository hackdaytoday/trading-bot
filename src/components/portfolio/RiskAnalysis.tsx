import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Shield, TrendingUp, PieChart, BarChart2, Activity,
  ArrowUpRight, ArrowDownRight, Target, Clock, ChevronDown, Lock,
  AlertOctagon, Gauge, Wallet, DollarSign, LineChart
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnimatedContainer } from '../effects/AnimatedContainer';

export const RiskAnalysis = () => {
  const [timeRange, setTimeRange] = useState('1D');
  const [riskData, setRiskData] = useState<any[]>([]);

  // Generate sample risk data
  useEffect(() => {
    const data = [];
    let exposure = 35;
    const points = 24;
    
    for (let i = 0; i < points; i++) {
      const date = new Date();
      date.setHours(date.getHours() - (points - i));
      
      exposure += (Math.random() - 0.5) * 5; // Random exposure change
      exposure = Math.max(0, Math.min(100, exposure));
      
      data.push({
        time: date.toISOString(),
        exposure: Math.round(exposure * 100) / 100,
        var: Math.round((exposure * 0.08) * 100) / 100,
        stress: Math.round((exposure * 0.12) * 100) / 100
      });
    }
    
    setRiskData(data);
  }, [timeRange]);

  const riskMetrics = {
    currentExposure: 35.2,
    valueAtRisk: 2.8,
    marginUtilization: 42,
    openPositions: 8,
    riskRewardRatio: 2.1,
    stressTestLoss: 4.2,
    correlationScore: 0.65,
    betaToMarket: 1.2,
    leverageRatio: 3.1,
    marginCallBuffer: 68,
    concentrationRisk: 'Medium',
    liquidityScore: 85
  };

  const riskAlerts = [
    {
      type: 'warning',
      message: 'High correlation detected in EUR pairs',
      impact: 'medium',
      time: '5m ago'
    },
    {
      type: 'critical',
      message: 'Approaching maximum position limit',
      impact: 'high',
      time: '12m ago'
    },
    {
      type: 'info',
      message: 'Volatility increasing in major pairs',
      impact: 'low',
      time: '25m ago'
    }
  ];

  const exposureByMarket = [
    { market: 'EURUSD', exposure: 25, risk: 'medium' },
    { market: 'GBPUSD', exposure: 15, risk: 'low' },
    { market: 'USDJPY', exposure: 35, risk: 'high' },
    { market: 'XAUUSD', exposure: 25, risk: 'medium' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-accent-green">Risk Analysis</h2>
          <p className="text-gray-400 mt-1">Real-time risk monitoring and analysis</p>
        </div>
        <div className="flex items-center gap-2">
          {['1H', '4H', '1D', '1W', '1M'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
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

      {/* Risk Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <AnimatedContainer type="3d-float">
          <div className="flex flex-col items-center">
            <AlertTriangle className="w-8 h-8 text-accent-gold mb-2" />
            <h3 className="text-lg font-semibold text-gray-100">Value at Risk</h3>
            <p className="text-xl font-bold text-accent-gold">{riskMetrics.valueAtRisk}%</p>
          </div>
        </AnimatedContainer>

        <AnimatedContainer type="3d-float">
          <div className="flex flex-col items-center">
            <Gauge className="w-8 h-8 text-accent-green mb-2" />
            <h3 className="text-lg font-semibold text-gray-100">Margin Usage</h3>
            <p className="text-xl font-bold text-accent-green">{riskMetrics.marginUtilization}%</p>
          </div>
        </AnimatedContainer>

        <AnimatedContainer type="3d-float">
          <div className="flex flex-col items-center">
            <Target className="w-8 h-8 text-accent-gold mb-2" />
            <h3 className="text-lg font-semibold text-gray-100">Risk/Reward</h3>
            <p className="text-xl font-bold text-accent-gold">{riskMetrics.riskRewardRatio}</p>
          </div>
        </AnimatedContainer>

        <AnimatedContainer type="3d-float">
          <div className="flex flex-col items-center">
            <AlertOctagon className="w-8 h-8 text-accent-red mb-2" />
            <h3 className="text-lg font-semibold text-gray-100">Stress Test</h3>
            <p className="text-xl font-bold text-accent-red">-{riskMetrics.stressTestLoss}%</p>
          </div>
        </AnimatedContainer>
      </div>

      {/* Risk Exposure Chart */}
      <div className="card card-3d neon-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Risk Exposure Trends</h3>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={riskData}>
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
              />
              <Line 
                type="monotone" 
                dataKey="exposure" 
                name="Exposure"
                stroke="#4ade80" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="var" 
                name="VaR"
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="stress" 
                name="Stress"
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Details Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Market Exposure */}
        <div className="card card-3d neon-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Market Exposure</h3>
          </div>
          <div className="space-y-4">
            {exposureByMarket.map((market) => (
              <div key={market.market} className="p-4 bg-dark rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">{market.market}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    market.risk === 'low' ? 'bg-accent-green/10 text-accent-green' :
                    market.risk === 'medium' ? 'bg-accent-gold/10 text-accent-gold' :
                    'bg-accent-red/10 text-accent-red'
                  }`}>
                    {market.risk}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`rounded-full h-2 ${
                      market.risk === 'low' ? 'bg-accent-green' :
                      market.risk === 'medium' ? 'bg-accent-gold' :
                      'bg-accent-red'
                    }`}
                    style={{ width: `${market.exposure}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="card card-3d neon-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Risk Metrics</h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Beta to Market</span>
                <span className="text-sm font-medium text-accent-gold">{riskMetrics.betaToMarket}</span>
              </div>
            </div>
            <div className="p-3 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Leverage Ratio</span>
                <span className="text-sm font-medium text-accent-red">{riskMetrics.leverageRatio}x</span>
              </div>
            </div>
            <div className="p-3 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Margin Call Buffer</span>
                <span className="text-sm font-medium text-accent-green">{riskMetrics.marginCallBuffer}%</span>
              </div>
            </div>
            <div className="p-3 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Liquidity Score</span>
                <span className="text-sm font-medium text-accent-green">{riskMetrics.liquidityScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="card card-3d neon-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-accent-red" />
            <h3 className="text-lg font-semibold text-gray-100">Risk Alerts</h3>
          </div>
          <div className="space-y-4">
            {riskAlerts.map((alert, index) => (
              <div key={index} className="p-4 bg-dark rounded-lg border border-gray-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 shrink-0 ${
                    alert.type === 'critical' ? 'text-accent-red' :
                    alert.type === 'warning' ? 'text-accent-gold' :
                    'text-accent-green'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-200">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs ${
                        alert.impact === 'high' ? 'text-accent-red' :
                        alert.impact === 'medium' ? 'text-accent-gold' :
                        'text-accent-green'
                      }`}>
                        {alert.impact} impact
                      </span>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
