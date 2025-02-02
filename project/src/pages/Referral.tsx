import React from 'react';
import ReferralDashboard from '../components/referral/ReferralDashboard';

const Referral: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Referral Program</h2>
          <p className="mt-1 text-sm text-gray-500">
            Invite your friends and earn rewards when they join our trading platform
          </p>
        </div>
        
        <ReferralDashboard />
      </div>
    </div>
  );
};

export default Referral;
