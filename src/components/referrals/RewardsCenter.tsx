import React, { useState } from 'react';
import { 
  Award, Gift, DollarSign, ArrowRight, Clock,
  CheckCircle2, Lock, AlertTriangle, Wallet
} from 'lucide-react';
import toast from 'react-hot-toast';

export const RewardsCenter = () => {
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  const rewards = [
    {
      id: 'cash25',
      title: '$25 Cash Reward',
      description: 'Redeem your earnings as cash',
      points: 1000,
      available: true,
      type: 'cash'
    },
    {
      id: 'trading50',
      title: '$50 Trading Credit',
      description: 'Get extra trading credit',
      points: 2000,
      available: true,
      type: 'credit'
    },
    {
      id: 'premium',
      title: '1 Month Premium',
      description: 'Access premium features',
      points: 5000,
      available: false,
      type: 'subscription'
    }
  ];

  const achievements = [
    {
      title: 'First Referral',
      description: 'Get your first referral',
      points: 500,
      progress: 1,
      target: 1,
      completed: true
    },
    {
      title: 'Active Referrer',
      description: 'Have 5 active referrals',
      points: 1000,
      progress: 3,
      target: 5,
      completed: false
    },
    {
      title: 'Volume Master',
      description: 'Referrals reach $100k volume',
      points: 2000,
      progress: 65000,
      target: 100000,
      completed: false
    }
  ];

  const stats = {
    availablePoints: 1500,
    totalEarned: 2500,
    redeemed: 1000,
    nextReward: 500
  };

  const handleRedeem = (rewardId: string) => {
    setSelectedReward(rewardId);
    // Simulate reward redemption
    setTimeout(() => {
      toast.success('Reward redeemed successfully!');
      setSelectedReward(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-accent-green">Rewards Center</h2>
        <p className="text-gray-400 mt-1">Redeem your points for exclusive rewards</p>
      </div>

      {/* Points Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Available Points</span>
            <Award className="w-5 h-5 text-accent-green" />
          </div>
          <span className="text-2xl font-bold text-gray-100">{stats.availablePoints}</span>
        </div>

        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Total Earned</span>
            <DollarSign className="w-5 h-5 text-accent-gold" />
          </div>
          <span className="text-2xl font-bold text-gray-100">{stats.totalEarned}</span>
        </div>

        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Points Redeemed</span>
            <Gift className="w-5 h-5 text-accent-green" />
          </div>
          <span className="text-2xl font-bold text-gray-100">{stats.redeemed}</span>
        </div>

        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Next Reward</span>
            <Clock className="w-5 h-5 text-accent-gold" />
          </div>
          <span className="text-2xl font-bold text-gray-100">{stats.nextReward}</span>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
        <div className="flex items-center gap-2 mb-6">
          <Gift className="w-5 h-5 text-accent-green" />
          <h3 className="text-lg font-semibold text-gray-100">Available Rewards</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {rewards.map((reward) => (
            <div key={reward.id} className="p-6 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-200">{reward.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{reward.description}</p>
                </div>
                {reward.type === 'cash' ? (
                  <DollarSign className="w-5 h-5 text-accent-green" />
                ) : reward.type === 'credit' ? (
                  <Wallet className="w-5 h-5 text-accent-gold" />
                ) : (
                  <Award className="w-5 h-5 text-accent-green" />
                )}
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-accent-gold">
                  <Award className="w-4 h-4 mr-1" />
                  <span>{reward.points} points</span>
                </div>
                <button
                  onClick={() => handleRedeem(reward.id)}
                  disabled={!reward.available || selectedReward === reward.id}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    reward.available
                      ? 'bg-accent-green text-dark hover:bg-accent-green/90'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedReward === reward.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin mr-2" />
                      Redeeming...
                    </>
                  ) : reward.available ? (
                    'Redeem'
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-1" />
                      Locked
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-accent-green" />
          <h3 className="text-lg font-semibold text-gray-100">Achievements</h3>
        </div>
        <div className="grid gap-6">
          {achievements.map((achievement, index) => (
            <div key={index} className="p-4 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  achievement.completed ? 'bg-accent-green/10' : 'bg-gray-800'
                }`}>
                  <CheckCircle2 className={`w-6 h-6 ${
                    achievement.completed ? 'text-accent-green' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-200">{achievement.title}</h4>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-accent-gold flex items-center justify-end">
                        <Award className="w-4 h-4 mr-1" />
                        <span>{achievement.points}</span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {achievement.progress}/{achievement.target}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`rounded-full h-2 transition-all ${
                        achievement.completed ? 'bg-accent-green' : 'bg-accent-gold'
                      }`}
                      style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};