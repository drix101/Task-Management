import React, { useState, useEffect } from 'react';

interface NotificationSettingsProps {
  onSettingsChange: (settings: NotificationSettings) => void;
}

export interface NotificationSettings {
  enabled: boolean;
  notifyBefore: number; // minutes before due time
  checkInterval: number; // check frequency in minutes
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    notifyBefore: 0,
    checkInterval: 1
  });
  const [hasPermission, setHasPermission] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('taskNotificationSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      onSettingsChange(parsed);
    }

    // Check current permission status
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }
  }, []); // Remove onSettingsChange from dependencies to prevent infinite loop

  // Notify parent of settings changes
  useEffect(() => {
    onSettingsChange(settings);
  }, [settings, onSettingsChange]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasPermission(permission === 'granted');
      
      if (permission === 'granted') {
        const newSettings = { ...settings, enabled: true };
        updateSettings(newSettings);
      } else {
        // If permission denied, disable notifications
        const newSettings = { ...settings, enabled: false };
        updateSettings(newSettings);
      }
    }
  };

  const updateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('taskNotificationSettings', JSON.stringify(newSettings));
  };

  const handleToggleNotifications = async () => {
    if (!settings.enabled) {
      // User wants to enable notifications - request permission first
      if (!hasPermission) {
        await requestPermission();
      } else {
        // Already have permission, just enable
        const newSettings = { ...settings, enabled: true };
        updateSettings(newSettings);
      }
    } else {
      // User wants to disable notifications
      const newSettings = { ...settings, enabled: false };
      updateSettings(newSettings);
    }
  };

  const getPermissionStatus = () => {
    if (!('Notification' in window)) {
      return 'Not supported';
    }
    
    switch (Notification.permission) {
      case 'granted':
        return 'Granted';
      case 'denied':
        return 'Denied';
      default:
        return 'Not requested';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">🔔 Notifications</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none p-1"
          aria-label={showSettings ? "Hide settings" : "Show settings"}
        >
          <span className="text-lg">{showSettings ? '▼' : '▶'}</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex-1">
          <span className="text-gray-700 font-medium text-base">Enable Notifications</span>
          <p className="text-sm text-gray-500 mt-1">
            Permission: <span className={`font-medium ${hasPermission ? 'text-green-600' : 'text-orange-600'}`}>
              {getPermissionStatus()}
            </span>
          </p>
        </div>
        <button
          onClick={handleToggleNotifications}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0 ${
            settings.enabled ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          aria-label={settings.enabled ? "Disable notifications" : "Enable notifications"}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {showSettings && (
        <div className="space-y-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notify me:
            </label>
            <select
              value={settings.notifyBefore}
              onChange={(e) => updateSettings({ ...settings, notifyBefore: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-base"
              disabled={!settings.enabled}
            >
              <option value={0}>At due time</option>
              <option value={5}>5 minutes before</option>
              <option value={10}>10 minutes before</option>
              <option value={15}>15 minutes before</option>
              <option value={30}>30 minutes before</option>
              <option value={60}>1 hour before</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check for due tasks every:
            </label>
            <select
              value={settings.checkInterval}
              onChange={(e) => updateSettings({ ...settings, checkInterval: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-base"
              disabled={!settings.enabled}
            >
              <option value={1}>1 minute</option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
            </select>
          </div>

          {!hasPermission && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Browser notification permission is required. 
                Tap "Enable Notifications" to request permission.
              </p>
            </div>
          )}

          {settings.enabled && hasPermission && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-800">
                ✅ Notifications are active! You'll be notified when tasks are due.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;