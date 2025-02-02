import React, { useState, useEffect } from 'react';
import { 
  Brain, TrendingUp, BarChart2, AlertTriangle, Zap, RefreshCw,
  LineChart, Activity, ArrowUpRight, ArrowDownRight, Target,
  Clock, ChevronDown, Shield, DollarSign, Gauge, Bot,
  GitBranch, GitMerge, GitPullRequest, Hexagon, Box, Command
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { aiPrediction } from '../../services/aiPrediction';
import { PriceDisplay } from './PriceDisplay';
import toast from 'react-hot-toast';

export const AIAnalysis = () => {
  const [selectedMarket, setSelectedMarket] = useState('EURUSD');
  const [timeframe, setTimeframe] = useState('1H');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState('technical');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const markets = ['EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSD', 'XAUUSD'];
  const timeframes = ['5M', '15M', '1H', '4H', '1D'];

  useEffect(() => {
    updateAnalysis();
    // Start auto-updates
    const interval = setInterval(updateAnalysis, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [selectedMarket, timeframe]);

  const updateAnalysis = async () => {
    try {
      setIsLoading(true);
      const result = await aiPrediction.analyzePriceAction(selectedMarket);
      setAnalysis(result);
      
      // Generate sample chart data
      generateChartData();
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to update analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const generateChartData = () => {
    const data = [];
    let price = selectedMarket === 'XAUUSD' ? 1950.00 : 1.1000;
    const now = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000);
      price += (Math.random() - 0.5) * (selectedMarket === 'XAUUSD' ? 0.50 : 0.0010);
      
      data.push({
        time: time.toISOString(),
        price,
        ma20: price + Math.random() * (selectedMarket === 'XAUUSD' ? 0.25 : 0.0005),
        ma50: price - Math.random() * (selectedMarket === 'XAUUSD' ? 0.25 : 0.0005),
        volume: Math.random() * 1000,
        prediction: price * (1 + (Math.random() - 0.5) * 0.001)
      });
    }
    
    setChartData(data);
  };

  const formatPrice = (value: number) => {
    return selectedMarket === 'XAUUSD' ? value.toFixed(2) : value.toFixed(5);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-accent-green">AI Market Analysis</h2>
          <p className="text-gray-400 mt-1">Advanced market insights powered by artificial intelligence</p>
        </div>
        <button 
          onClick={updateAnalysis}
          disabled={isLoading}
          className="flex items-center px-4 py-2 text-sm font-medium text-dark bg-accent-green rounded-lg hover:bg-accent-green/90 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Update Analysis
        </button>
      </div>

      {/* Market Selection */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {markets.map((market) => (
            <button
              key={market}
              onClick={() => setSelectedMarket(market)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMarket === market
                  ? 'bg-accent-green text-dark'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {market}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-accent-gold text-dark'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-800">
        {[
          { id: 'technical', label: 'Technical Analysis', icon: LineChart },
          { id: 'ai', label: 'AI Predictions', icon: Brain },
          { id: 'neural', label: 'Neural Network', icon: GitBranch },
          { id: 'risk', label: 'Risk Analysis', icon: Shield }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              selectedTab === tab.id
                ? 'border-accent-green text-accent-green'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Technical Analysis Tab */}
        {selectedTab === 'technical' && (
          <div className="space-y-6">
            {/* Technical Chart */}
            <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-accent-green" />
                  <h3 className="text-lg font-semibold text-gray-100">Technical Analysis</h3>
                </div>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" />
                    <XAxis 
                      dataKey="time"
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      stroke="#6b7280"
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => formatPrice(value)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1d23',
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                      }}
                      labelStyle={{ color: '#9ca3af' }}
                      formatter={(value: number) => [formatPrice(value), 'Price']}
                      labelFormatter={(label) => new Date(label as string).toLocaleTimeString()}
                    />
                    <Line 
                      type="monotone"
                      dataKey="price"
                      stroke="#4ade80"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone"
                      dataKey="ma20"
                      stroke="#f59e0b"
                      strokeWidth={1}
                      dot={false}
                    />
                    <Line 
                      type="monotone"
                      dataKey="ma50"
                      stroke="#ef4444"
                      strokeWidth={1}
                      dot={false}
                    />
                    <Line 
                      type="monotone"
                      dataKey="prediction"
                      stroke="#9333ea"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Support/Resistance Levels */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <GitMerge className="w-5 h-5 text-accent-green" />
                  <h3 className="text-lg font-semibold text-gray-100">Key Levels</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-dark rounded-lg border border-gray-800">
                    <span className="text-sm text-gray-400">Support</span>
                    <div className="space-y-2 mt-2">
                      {analysis?.supportResistance.support.map((level: number, index: number) => (
                        <div key={index} className="text-sm font-medium text-accent-green">
                          ${formatPrice(level)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-dark rounded-lg border border-gray-800">
                    <span className="text-sm text-gray-400">Resistance</span>
                    <div className="space-y-2 mt-2">
                      {analysis?.supportResistance.resistance.map((level: number, index: number) => (
                        <div key={index} className="text-sm font-medium text-accent-red">
                          ${formatPrice(level)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Neural Network Insights */}
              <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <GitPullRequest className="w-5 h-5 text-accent-gold" />
                  <h3 className="text-lg font-semibold text-gray-100">AI Insights</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-dark rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Direction</span>
                      <span className={`text-sm font-medium ${
                        analysis?.direction === 'buy' ? 'text-accent-green' : 
                        analysis?.direction === 'sell' ? 'text-accent-red' : 
                        'text-gray-400'
                      }`}>
                        {analysis?.direction.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-dark rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Trend Strength</span>
                      <span className="text-sm font-medium text-accent-gold">
                        {(analysis?.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-dark rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Risk Level</span>
                      <span className={`text-sm font-medium ${
                        analysis?.riskAnalysis.riskScore < 30 ? 'text-accent-green' :
                        analysis?.riskAnalysis.riskScore < 70 ? 'text-accent-gold' :
                        'text-accent-red'
                      }`}>
                        {analysis?.riskAnalysis.riskScore.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Predictions Tab */}
        {selectedTab === 'ai' && (
          <div className="space-y-6">
            {/* AI Confidence Score */}
            <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-accent-green" />
                <h3 className="text-lg font-semibold text-gray-100">AI Prediction Analysis</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="p-4 bg-dark rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Trade Direction</span>
                      <span className={`text-sm font-medium ${
                        analysis?.direction === 'buy' ? 'text-accent-green' : 
                        analysis?.direction === 'sell' ? 'text-accent-red' : 
                        'text-gray-400'
                      }`}>
                        {analysis?.direction.toUpperCase()}
                      </span>
                    </div>
                    <div className="relative pt-2">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-dark">
                        <div
                          style={{ width: `${analysis?.confidence * 100}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-accent-green"
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Confidence: {(analysis?.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-dark rounded-lg border border-gray-800">
                    <span className="text-sm text-gray-400">Price Targets</span>
                    <div className="space-y-2 mt-2">
                      {analysis?.priceTargets && Object.entries(analysis.priceTargets).map(([term, target]: [string, any]) => (
                        <div key={term} className="flex items-center justify-between">
                          <span className="text-sm text-gray-300 capitalize">{term}</span>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-200">${formatPrice(target.price)}</div>
                            <div className="text-xs text-gray-500">{(target.confidence * 100).toFixed(1)}% confidence</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-dark rounded-lg border border-gray-800">
                    <span className="text-sm text-gray-400">Market Conditions</span>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {analysis?.marketConditions && Object.entries(analysis.marketConditions).map(([key, value]) => (
                        <div key={key} className="p-2 bg-dark-card rounded-lg border border-gray-800">
                          <span className="text-xs text-gray-400 capitalize">{key}</span>
                          <p className="text-sm font-medium text-gray-200 mt-1 capitalize">{value as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-dark rounded-lg border border-gray-800">
                    <span className="text-sm text-gray-400">AI Insights</span>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Trend Strength</span>
                        <span className="text-sm font-medium text-accent-gold">
                          {(analysis?.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Risk Level</span>
                        <span className={`text-sm font-medium ${
                          analysis?.riskAnalysis.riskScore < 30 ? 'text-accent-green' :
                          analysis?.riskAnalysis.riskScore < 70 ? 'text-accent-gold' :
                          'text-accent-red'
                        }`}>
                          {analysis?.riskAnalysis.riskScore.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Neural Network Tab */}
        {selectedTab === 'neural' && (
          <div className="space-y-6">
            <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
              <div className="flex items-center gap-2 mb-6">
                <GitBranch className="w-5 h-5 text-accent-green" />
                <h3 className="text-lg font-semibold text-gray-100">Neural Network Analysis</h3>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                {/* Pattern Recognition Network */}
                <div className="p-4 bg-dark rounded-lg border border-gray-800">
                  <div className="flex items-center gap-2 mb-3">
                    <GitMerge className="w-4 h-4 text-accent-gold" />
                    <h4 className="text-sm font-medium text-gray-200">Pattern Recognition</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Accuracy</span>
                      <span className="text-xs font-medium text-accent-green">94.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Patterns Found</span>
                      <span className="text-xs font-medium text-accent-gold">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Confidence</span>
                      <span className="text-xs font-medium text-accent-green">High</span>
                    </div>
                  </div>
                </div>

                {/* Prediction Network */}
                <div className="p-4 bg-dark rounded-lg border border-gray-800">
                  <div className="flex items-center gap-2 mb-3">
                    <GitPullRequest className="w-4 h-4 text-accent-green" />
                    <h4 className="text-sm font-medium text-gray-200">Price Prediction</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Short-term</span>
                      <span className="text-xs font-medium text-accent-green">92.1%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Medium-term</span>
                      <span className="text-xs font-medium text-accent-gold">87.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Long-term</span>
                      <span className="text-xs font-medium text-accent-red">78.5%</span>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment Network */}
                <div className="p-4 bg-dark rounded-lg border border-gray-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-accent-red" />
                    <h4 className="text-sm font-medium text-gray-200">Risk Assessment</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Market Risk</span>
                      <span className="text-xs font-medium text-accent-gold">Medium</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Volatility</span>
                      <span className="text-xs font-medium text-accent-red">High</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Exposure</span>
                      <span className="text-xs font-medium text-accent-green">Low</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Network Performance */}
              <div className="mt-6 p-4 bg-dark rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-accent-green" />
                  <h4 className="text-sm font-medium text-gray-200">Network Performance</h4>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-green">95.2%</div>
                    <div className="text-xs text-gray-400 mt-1">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-gold">0.89</div>
                    <div className="text-xs text-gray-400 mt-1">F1 Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-green">0.92</div>
                    <div className="text-xs text-gray-400 mt-1">Precision</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-gold">0.87</div>
                    <div className="text-xs text-gray-400 mt-1">Recall</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Risk Analysis Tab */}
        {selectedTab === 'risk' && (
          <div className="space-y-6">
            <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-accent-red" />
                <h3 className="text-lg font-semibold text-gray-100">Risk Analysis</h3>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Risk Metrics */}
                <div className="space-y-4">
                  <div className="p-4 bg-dark rounded-lg border border-gray-800">
                    <span className="text-sm text-gray-400">Risk Metrics</span>
                    <div className="space-y-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Value at Risk (VaR)</span>
                        <span className="text-sm font-medium text-accent-red">2.8%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Expected Shortfall</span>
                        <span className="text-sm font-medium text-accent-red">3.5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Beta</span>
                        <span className="text-sm font-medium text-accent-gold">1.2</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-dark rounded-lg border border-gray-800">
                    <span className="text-sm text-gray-400">Position Risk</span>
                    <div className="space-y-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Position Size</span>
                        <span className="text-sm font-medium text-accent-green">0.01</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Risk per Trade</span>
                        <span className="text-sm font-medium text-accent-gold">1.5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Max Drawdown</span>
                        <span className="text-sm font-medium text-accent-red">5.2%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Analysis */}
                <div className="space-y-4">
                  <div className="p-4 bg-dark rounded-lg border border-gray-800">
                    <span className="text-sm text-gray-400">Market Risk</span>
                    <div className="space-y-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Volatility</span>
                        <span className="text-sm font-medium text-accent-gold">Medium</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Liquidity</span>
                        <span className="text-sm font-medium text-accent-green">High</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Correlation</span>
                        <span className="text-sm font-medium text-accent-gold">0.65</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-dark rounded-lg border border-gray-800">
                    <span className="text-sm text-gray-400">Risk Recommendations</span>
                    <div className="space-y-2 mt-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Consider reducing position size due to increased volatility</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-accent-green shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Current risk exposure within acceptable limits</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-accent-gold shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Monitor correlation with major pairs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};