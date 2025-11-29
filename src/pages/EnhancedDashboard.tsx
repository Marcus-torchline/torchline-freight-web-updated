import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardWidgets from '../components/DashboardWidgets';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import AdvancedSearch from '../components/AdvancedSearch';
import ReportingSystem from '../components/ReportingSystem';
import { BarChart3, Search, FileText, Settings } from 'lucide-react';

type DashboardTab = 'overview' | 'analytics' | 'search' | 'reports' | 'settings';

const EnhancedDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <BarChart3 size={20} /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'search', name: 'Search', icon: <Search size={20} /> },
    { id: 'reports', name: 'Reports', icon: <FileText size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardWidgets />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'search':
        return <AdvancedSearch />;
      case 'reports':
        return <ReportingSystem />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <DashboardWidgets />;
    }
  };

  return (
    <main className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Enhanced Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.name}</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-800 rounded-lg mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DashboardTab)}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-orange-400 border-b-2 border-orange-400 bg-slate-750'
                    : 'text-gray-400 hover:text-white hover:bg-slate-750'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {renderTabContent()}
        </div>
      </div>
    </main>
  );
};

// Settings Panel Component
const SettingsPanel: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    theme: 'dark',
    language: 'en',
    timezone: 'UTC-7'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={user?.name || ''}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
            <input
              type="text"
              value={user?.company || ''}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <input
              type="text"
              value={user?.role || ''}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-6">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-gray-400 text-sm">Receive updates via email</p>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="w-5 h-5 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
              />
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Push Notifications</p>
              <p className="text-gray-400 text-sm">Receive browser notifications</p>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                className="w-5 h-5 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
              />
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Weekly Reports</p>
              <p className="text-gray-400 text-sm">Receive weekly analytics reports</p>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.weeklyReports}
                onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                className="w-5 h-5 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-6">Display Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
            >
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC-7">Mountain Time (UTC-7)</option>
              <option value="UTC-6">Central Time (UTC-6)</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default EnhancedDashboard;