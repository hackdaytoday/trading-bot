import React, { useState } from 'react';
import { 
  Gift, Copy, Share2, Mail, MessageCircle, 
  Facebook, Twitter, Linkedin, Link2, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const InviteFriends = () => {
  const [referralCode] = useState('REF' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [emailInput, setEmailInput] = useState('');

  const referralLink = `https://platform.com/ref/${referralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const shareViaEmail = () => {
    if (!emailInput.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Simulate email sending
    toast.success('Invitation sent successfully!');
    setEmailInput('');
  };

  const socialPlatforms = [
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
    { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
    { name: 'Message', icon: MessageCircle, color: 'bg-green-600' }
  ];

  const rewards = [
    {
      title: 'First Referral',
      description: 'Get $25 when your first referral makes a deposit',
      progress: 0,
      target: 1,
      achieved: false
    },
    {
      title: '5 Active Referrals',
      description: 'Earn $150 bonus with 5 active referrals',
      progress: 3,
      target: 5,
      achieved: false
    },
    {
      title: 'Gold Tier',
      description: 'Reach Gold tier with 10 active referrals',
      progress: 3,
      target: 10,
      achieved: false
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-accent-green">Invite Friends</h2>
        <p className="text-gray-400 mt-1">Share your referral link and earn rewards</p>
      </div>

      {/* Referral Link Section */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
        <div className="flex items-center gap-2 mb-6">
          <Link2 className="w-5 h-5 text-accent-green" />
          <h3 className="text-lg font-semibold text-gray-100">Your Referral Link</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 p-3 bg-dark rounded-lg border border-gray-800">
            <code className="text-gray-300">{referralLink}</code>
          </div>
          <button
            onClick={copyReferralLink}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-accent-green text-dark hover:bg-accent-green/90 transition-all"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </button>
        </div>
      </div>

      {/* Email Invite */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="w-5 h-5 text-accent-green" />
          <h3 className="text-lg font-semibold text-gray-100">Invite via Email</h3>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter friend's email"
            className="flex-1 p-3 bg-dark border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-green"
          />
          <button
            onClick={shareViaEmail}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-accent-green text-dark hover:bg-accent-green/90 transition-all whitespace-nowrap"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Send Invite
          </button>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
        <div className="flex items-center gap-2 mb-6">
          <Share2 className="w-5 h-5 text-accent-green" />
          <h3 className="text-lg font-semibold text-gray-100">Share on Social Media</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {socialPlatforms.map((platform) => (
            <button
              key={platform.name}
              className="flex items-center justify-center gap-2 p-4 rounded-lg border border-gray-800 hover:bg-dark-hover transition-colors"
            >
              <platform.icon className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-300">{platform.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rewards Progress */}
      <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
        <div className="flex items-center gap-2 mb-6">
          <Gift className="w-5 h-5 text-accent-green" />
          <h3 className="text-lg font-semibold text-gray-100">Referral Rewards</h3>
        </div>
        <div className="grid gap-6">
          {rewards.map((reward, index) => (
            <div key={index} className="p-4 bg-dark rounded-lg border border-gray-800">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  reward.achieved ? 'bg-accent-green/10' : 'bg-gray-800'
                }`}>
                  <CheckCircle2 className={`w-6 h-6 ${
                    reward.achieved ? 'text-accent-green' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-200">{reward.title}</h4>
                    <span className="text-sm text-gray-400">
                      {reward.progress}/{reward.target}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{reward.description}</p>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-accent-green rounded-full h-2 transition-all"
                      style={{ width: `${(reward.progress / reward.target) * 100}%` }}
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