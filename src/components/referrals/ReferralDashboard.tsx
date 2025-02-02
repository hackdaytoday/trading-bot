import React, { useState, useEffect } from 'react';
import { 
  Users, Gift, Award, DollarSign, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Copy, Share2, 
  ChevronDown, Clock, Target, Shield, LineChart,
  Zap, Wallet, PieChart, BarChart2, Link2
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export const ReferralDashboard = () => {
  const [timeRange, setTimeRange] = useState('1M');
  const [referralData, setReferralData] = useState<any[]>([]);
  const [referralCode] = useState('REF' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Generate sample referral data
  useEffect(() => {
    const data = [];
    let referrals = 0;
    let earnings = 0;
    const days = 30;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      
      const newReferrals = Math.floor(Math.random() * 3);
      referrals += newReferrals;
      earnings += newReferrals * 25;
      
      data.push({
        date: date.toISOString(),
        referrals,
        earnings,
        activeUsers: Math.floor(referrals * 0.8),
        conversionRate: Math.round((referrals / (referrals + Math.random() * 10)) * 100)
      });
    }
    
    setReferralData(data);
  }, [timeRange]);

  const stats = {
    totalReferrals: 42,
    activeReferrals: 35,
    totalEarnings: 1050,
    pendingEarnings: 175,
    conversionRate: 83,
    avgEarningsPerRef: 25,
    tier: 'Gold',
    nextTierProgress: 85,
    tierBenefits: [
      'Increased commission rates',
      'Priority support access',
      'Custom referral links',
      'Monthly bonus rewards'
    ]
  };

  const recentReferrals = [
    { user: 'Alex M.', status: 'active', earnings: 25, date: '2h ago', trades: 12, volume: 25000 },
    { user: 'Sarah K.', status: 'pending', earnings: 0, date: '5h ago', trades: 0, volume: 0 },
    { user: 'John D.', status: 'active', earnings: 25, date: '1d ago', trades: 8, volume: 15000 },
    { user: 'Emma R.', status: 'active', earnings: 25, date: '2d ago', trades: 15, volume: 30000 }
  ];

  const performanceMetrics = {
    weeklyGrowth: 15.2,
    monthlyGrowth: 42.8,
    avgRetention: 78,
    lifetimeValue: 125,
    topCountries: [
      { name: 'United States', percentage: 35 },
      { name: 'United Kingdom', percentage: 25 },
      { name: 'Germany', percentage: 20 },
      { name: 'Canada', percentage: 15 }
    ]
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://platform.com/ref/${referralCode}`);
    toast.success('Referral link copied to clipboard!');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-accent-green">Referral Dashboard</h2>
          <p className="text-gray-400 mt-1">Track and manage your referral performance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {['1W', '1M', '3M', '6M', '1Y', 'ALL'].map((range) => (
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
      </div>

      {/* Tier Status & Referral Link */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tier Status */}
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent-gold" />
              <h3 className="text-lg font-semibold text-gray-100">Tier Status</h3>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full bg-accent-gold/10 text-accent-gold`}>
              {stats.tier} Tier
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span>Progress to next tier</span>
                <span>{stats.nextTierProgress}%</span>
              </div>
              <div className="w-full bg-dark rounded-full h-2">
                <div
                  className="bg-accent-gold rounded-full h-2 transition-all"
                  style={{ width: `${stats.nextTierProgress}%` }}
                />
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Current Tier Benefits</h4>
              <div className="grid grid-cols-2 gap-2">
                {stats.tierBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-accent-green" />
              <h3 className="text-lg font-semibold text-gray-100">Your Referral Link</h3>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 p-3 bg-dark rounded-lg border border-gray-800">
              <code className="text-gray-300">https://platform.com/ref/{referralCode}</code>
            </div>
            <button
              onClick={copyReferralLink}
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-accent-green text-dark hover:bg-accent-green/90 transition-all"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </button>
          </div>
          <div className="mt-4 p-3 bg-dark rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Zap className="w-4 h-4 text-accent-gold" />
              <span>Earn ${stats.avgEarningsPerRef} for each successful referral</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Total Referrals</span>
            <Users className="w-5 h-5 text-accent-green" />
          </div>
          <span className="text-2xl font-bold text-gray-100">{stats.totalReferrals}</span>
          <div className="mt-2 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-accent-green mr-1" />
            <span className="text-accent-green">+12% this month</span>
          </div>
        </div>

        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Active Referrals</span>
            <Target className="w-5 h-5 text-accent-gold" />
          </div>
          <span className="text-2xl font-bold text-gray-100">{stats.activeReferrals}</span>
          <div className="mt-2 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-accent-green mr-1" />
            <span className="text-accent-green">83% conversion rate</span>
          </div>
        </div>

        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Total Earnings</span>
            <DollarSign className="w-5 h-5 text-accent-green" />
          </div>
          <span className="text-2xl font-bold text-gray-100">${stats.totalEarnings}</span>
          <div className="mt-2 flex items-center text-sm">
            <Wallet className="w-4 h-4 text-accent-gold mr-1" />
            <span className="text-accent-gold">${stats.pendingEarnings} pending</span>
          </div>
        </div>

        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Avg. Earnings/Ref</span>
            <TrendingUp className="w-5 h-5 text-accent-green" />
          </div>
          <span className="text-2xl font-bold text-gray-100">${stats.avgEarningsPerRef}</span>
          <div className="mt-2 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-accent-green mr-1" />
            <span className="text-accent-green">+5% from last month</span>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Referral Growth */}
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-accent-green" />
              <h3 className="text-lg font-semibold text-gray-100">Referral Growth</h3>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={referralData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
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
                  dataKey="referrals" 
                  name="Total Referrals"
                  stroke="#4ade80" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="activeUsers" 
                  name="Active Users"
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={false}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-accent-green" />
              <h3 className="text-lg font-semibold text-gray-100">Earnings Growth</h3>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={referralData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  stroke="#6b7280"
                />
                <YAxis 
                  stroke="#6b7280"
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1d23',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#9ca3af' }}
                  formatter={(value: number) => [`$${value}`, 'Earnings']}
                />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#4ade80" 
                  strokeWidth={2}
                  dot={false}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Growth Metrics */}
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Performance Metrics</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-dark rounded-lg border border-gray-800">
              <span className="text-sm text-gray-400">Weekly Growth</span>
              <div className="flex items-center mt-1">
                <span className="text-xl font-semibold text-gray-100">{performanceMetrics.weeklyGrowth}%</span>
                <ArrowUpRight className="w-4 h-4 text-accent-green ml-2" />
              </div>
            </div>
            <div className="p-4 bg-dark rounded-lg border border-gray-800">
              <span className="text-sm text-gray-400">Monthly Growth</span>
              <div className="flex items-center mt-1">
                <span className="text-xl font-semibold text-gray-100">{performanceMetrics.monthlyGrowth}%</span>
                <ArrowUpRight className="w-4 h-4 text-accent-green ml-2" />
              </div>
            </div>
            <div className="p-4 bg-dark rounded-lg border border-gray-800">
              <span className="text-sm text-gray-400">Avg. Retention</span>
              <div className="flex items-center mt-1">
                <span className="text-xl font-semibold text-gray-100">{performanceMetrics.avgRetention}%</span>
                <Shield className="w-4 h-4 text-accent-gold ml-2" />
              </div>
            </div>
            <div className="p-4 bg-dark rounded-lg border border-gray-800">
              <span className="text-sm text-gray-400">Lifetime Value</span>
              <div className="flex items-center mt-1">
                <span className="text-xl font-semibold text-gray-100">${performanceMetrics.lifetimeValue}</span>
                <Wallet className="w-4 h-4 text-accent-green ml-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Geographic Distribution</h3>
          </div>
          <div className="space-y-4">
            {performanceMetrics.topCountries.map((country, index) => (
              <div key={index} className="p-4 bg-dark rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">{country.name}</span>
                  <span className="text-accent-green">{country.percentage}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-accent-green rounded-full h-2"
                    style={{ width: `${country.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Recent Referrals</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-800">
                <th className="pb-3 text-sm font-medium text-gray-400">User</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Trades</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Volume</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Earnings</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentReferrals.map((referral, index) => (
                <tr key={index} className="border-b border-gray-800/50 hover:bg-dark-hover">
                  <td className="py-3 text-sm text-gray-300">{referral.user}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      referral.status === 'active' 
                        ? 'bg-accent-green/10 text-accent-green' 
                        : 'bg-accent-gold/10 text-accent-gold'
                    }`}>
                      {referral.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-300">{referral.trades}</td>
                  <td className="py-3 text-sm text-gray-300">${referral.volume.toLocaleString()}</td>
                  <td className="py-3">
                    <div className="flex items-center text-accent-green">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{referral.earnings}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-gray-400">{referral.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};