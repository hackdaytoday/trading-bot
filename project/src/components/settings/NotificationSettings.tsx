import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface NotificationSetting {
  type: string;
  enabled: boolean;
  channels: {
    email: boolean;
    browser: boolean;
    telegram: boolean;
  };
}

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      type: 'Trade Opened',
      enabled: true,
      channels: { email: true, browser: true, telegram: false },
    },
    {
      type: 'Trade Closed',
      enabled: true,
      channels: { email: true, browser: true, telegram: false },
    },
    {
      type: 'Stop Loss Hit',
      enabled: true,
      channels: { email: true, browser: true, telegram: true },
    },
    {
      type: 'Take Profit Hit',
      enabled: true,
      channels: { email: true, browser: true, telegram: true },
    },
    {
      type: 'Margin Call Warning',
      enabled: true,
      channels: { email: true, browser: true, telegram: true },
    },
    {
      type: 'Strategy Signal',
      enabled: true,
      channels: { email: false, browser: true, telegram: false },
    },
  ]);

  const [telegramSettings, setTelegramSettings] = useState({
    botToken: '',
    chatId: '',
  });

  const handleToggleSetting = (index: number) => {
    const newSettings = [...settings];
    newSettings[index].enabled = !newSettings[index].enabled;
    setSettings(newSettings);
  };

  const handleToggleChannel = (index: number, channel: keyof NotificationSetting['channels']) => {
    const newSettings = [...settings];
    newSettings[index].channels[channel] = !newSettings[index].channels[channel];
    setSettings(newSettings);
  };

  const handleSaveSettings = () => {
    // TODO: Implement saving settings to backend
    toast.success('Notification settings saved successfully');
  };

  const handleTelegramSave = () => {
    // TODO: Implement Telegram bot connection
    if (!telegramSettings.botToken || !telegramSettings.chatId) {
      toast.error('Please fill in both Telegram Bot Token and Chat ID');
      return;
    }
    toast.success('Telegram settings saved successfully');
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Notification Settings
        </h3>
        <div className="mt-6 space-y-6">
          {settings.map((setting, index) => (
            <div key={setting.type} className="border-b border-gray-200 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={setting.enabled}
                    onChange={() => handleToggleSetting(index)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700">
                    {setting.type}
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={setting.channels.email}
                      onChange={() => handleToggleChannel(index, 'email')}
                      disabled={!setting.enabled}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Email</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={setting.channels.browser}
                      onChange={() => handleToggleChannel(index, 'browser')}
                      disabled={!setting.enabled}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Browser</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={setting.channels.telegram}
                      onChange={() => handleToggleChannel(index, 'telegram')}
                      disabled={!setting.enabled}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Telegram</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Telegram Settings
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bot Token
              </label>
              <input
                type="text"
                value={telegramSettings.botToken}
                onChange={(e) =>
                  setTelegramSettings({ ...telegramSettings, botToken: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your Telegram bot token"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Chat ID
              </label>
              <input
                type="text"
                value={telegramSettings.chatId}
                onChange={(e) =>
                  setTelegramSettings({ ...telegramSettings, chatId: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your Telegram chat ID"
              />
            </div>
            <button
              onClick={handleTelegramSave}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Telegram Settings
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSaveSettings}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
