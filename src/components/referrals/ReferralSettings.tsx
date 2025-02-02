import React, { useState } from 'react';
import { 
  Settings, Save, Bell, Shield, Link2, Mail,
  AlertTriangle, CheckCircle2, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ReferralSettings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      newReferral: true,
      referralActive: true,
      rewardsEarned: true,
      promotions: false
    },
    privacy: {
      showProfile: true,
      showEarnings: false,
      showStatistics: true
    },
    payouts: {
      method: 'bank',
      threshold: '50',
      autoWithdraw: false
    },
    customization: {
      referralMessage: 'Join me on the best trading platform!',
      landingPage: 'default'
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Settings saved successfully');
    setIsSaving(false);
  };

  const handleNotificationChange = (key: keyof typeof settings.notifications) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handlePrivacyChange = (key: keyof typeof settings.privacy) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key]
      }
    }));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-accent-green">Referral Settings</h2>
          <p className="text-gray-400 mt-1">Customize your referral program preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-accent-green text-dark hover:bg-accent-green/90 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Notification Settings */}
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Notifications</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-dark rounded-lg border border-gray-800">
                <span className="text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <button
                  onClick={() => handleNotificationChange(key as keyof typeof settings.notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-accent-green' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Privacy</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(settings.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-dark rounded-lg border border-gray-800">
                <span className="text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <button
                  onClick={() => handlePrivacyChange(key as keyof typeof settings.privacy)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-accent-green' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Settings */}
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Payout Preferences</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Payout Method
              </label>
              <select
                value={settings.payouts.method}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  payouts: { ...prev.payouts, method: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-dark border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-accent-green"
              >
                <option value="bank">Bank Transfer</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Minimum Payout Threshold ($)
              </label>
              <input
                type="number"
                value={settings.payouts.threshold}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  payouts: { ...prev.payouts, threshold: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-dark border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-accent-green"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-dark rounded-lg border border-gray-800">
              <span className="text-gray-300">Automatic Withdrawals</span>
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  payouts: { ...prev.payouts, autoWithdraw: !prev.payouts.autoWithdraw }
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.payouts.autoWithdraw ? 'bg-accent-green' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.payouts.autoWithdraw ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Customization Settings */}
        <div className="bg-dark-card rounded-lg p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <Link2 className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-gray-100">Customization</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Default Referral Message
              </label>
              <textarea
                value={settings.customization.referralMessage}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  customization: { ...prev.customization, referralMessage: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-dark border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-accent-green resize-none h-24"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">
                Landing Page Template
              </label>
              <select
                value={settings.customization.landingPage}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  customization: { ...prev.customization, landingPage: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-dark border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-accent-green"
              >
                <option value="default">Default</option>
                <option value="professional">Professional</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};