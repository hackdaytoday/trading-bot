import React, { useState } from 'react';
import { 
  Clock, Search, Filter, Download, ChevronDown,
  ArrowUpRight, ArrowDownRight, DollarSign, User
} from 'lucide-react';

export const ReferralHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const referrals = [
    {
      id: 1,
      user: 'Alex Mitchell',
      email: 'alex@example.com',
      status: 'active',
      joinDate: '2024-02-15',
      earnings: 25,
      trades: 12,
      volume: 25000
    },
    {
      id: 2,
      user: 'Sarah Kim',
      email: 'sarah@example.com',
      status: 'pending',
      joinDate: '2024-02-14',
      earnings: 0,
      trades: 0,
      volume: 0
    },
    // Add more referral data...
  ];

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = 
      referral.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedReferrals = [...filteredReferrals].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
    }
    return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-accent-green">Referral History</h2>
          <p className="text-gray-400 mt-1">Track all your referral activities</p>
        </div>
        <button
          className="flex items-center px-4 py-2 rounded-lg text-sm font-medium border border-gray-800 hover:bg-dark-hover text-gray-300 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search referrals..."
              className="w-full pl-10 pr-4 py-2 bg-dark border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-green"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-dark border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-accent-green"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 bg-dark border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-accent-green"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-800">
                <th className="pb-4 text-sm font-medium text-gray-400">User</th>
                <th className="pb-4 text-sm font-medium text-gray-400">Status</th>
                <th className="pb-4 text-sm font-medium text-gray-400">Join Date</th>
                <th className="pb-4 text-sm font-medium text-gray-400">Earnings</th>
                <th className="pb-4 text-sm font-medium text-gray-400">Trades</th>
                <th className="pb-4 text-sm font-medium text-gray-400">Volume</th>
              </tr>
            </thead>
            <tbody>
              {sortedReferrals.map((referral) => (
                <tr key={referral.id} className="border-b border-gray-800/50 hover:bg-dark-hover">
                  <td className="py-4">
                    <div>
                      <div className="text-gray-200">{referral.user}</div>
                      <div className="text-sm text-gray-500">{referral.email}</div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      referral.status === 'active' 
                        ? 'bg-accent-green/10 text-accent-green' 
                        : referral.status === 'pending'
                        ? 'bg-accent-gold/10 text-accent-gold'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {referral.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-300">
                    {new Date(referral.joinDate).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center text-accent-green">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>{referral.earnings}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-300">{referral.trades}</td>
                  <td className="py-4 text-gray-300">${referral.volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};