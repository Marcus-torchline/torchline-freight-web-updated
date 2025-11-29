import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardWidgets from '../components/DashboardWidgets';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import AdvancedSearch from '../components/AdvancedSearch';
import ReportingSystem from '../components/ReportingSystem';
import RealTimeTracking from '../components/RealTimeTracking';
import CRMDashboard from '../components/CRMDashboard';
import AutomatedPricingEngine from '../components/AutomatedPricingEngine';
import { BarChart3, Search, FileText, Settings, MapPin, Users, Calculator, Zap } from 'lucide-react';

type SuperDashboardTab = 'overview' | 'analytics' | 'search' | 'reports' | 'tracking' | 'crm' | 'pricing' | 'settings';

const SuperDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SuperDashboardTab>('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <BarChart3 size={20} />, description: 'Dashboard overview and key metrics' },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={20} />, description: 'Advanced analytics and insights' },
    { id: 'tracking', name: 'Tracking', icon: <MapPin size={20} />, description: 'Real-time shipment tracking' },
    { id: 'crm', name: 'CRM', icon: <Users size={20} />, description: 'Customer relationship management' },
    { id: 'pricing', name: 'Pricing', icon: <Calculator size={20} />, description: 'Automated pricing engine' },
    { id: 'search', name: 'Search', icon: <Search size={20} />, description: 'Advanced search and filtering' },
    { id: 'reports', name: 'Reports', icon: <FileText size={20} />, description: 'Generate and schedule reports' },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} />, description: 'System configuration and preferences' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardWidgets />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'tracking':
        return <RealTimeTracking />;
      case 'crm':
        return <CRMDashboard />;
      case 'pricing':
        return <AutomatedPricingEngine />;
      case 'search':
        return <AdvancedSearch />;
      case 'reports':
        return <ReportingSystem />;
      case 'settings':
        return <SuperSettingsPanel />;
      default:
        return <DashboardWidgets />;
    }
  };

  return (
    <main className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Super Dashboard</h1>
              <p className="text-gray-400">Advanced freight management platform</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-400">Welcome back, {user?.name}</p>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Current Role</p>
                <p className="text-white font-semibold capitalize">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-slate-800 rounded-lg mb-6 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SuperDashboardTab)}
                className={`group relative p-4 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-750'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`transition-transform group-hover:scale-110 ${
                    activeTab === tab.id ? 'text-white' : 'text-gray-400'
                  }`}>
                    {tab.icon}
                  </div>
                  <span className="text-sm font-semibold">{tab.name}</span>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  {tab.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content with Animation */}
        <div className="min-h-96 transition-all duration-300 ease-in-out">
          <div className="animate-fadeIn">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </main>
  );
};

// Enhanced Settings Panel Component
const SuperSettingsPanel: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    // User Preferences
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    theme: 'dark',
    language: 'en',
    timezone: 'UTC-7',
    
    // System Settings
    autoSaveInterval: 30,
    defaultCurrency: 'USD',
    measurementUnit: 'imperial',
    dateFormat: 'MM/DD/YYYY',
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordExpiry: 90,
    
    // Business Settings
    defaultMargin: 15,
    autoApprovalLimit: 5000,
    requireApprovalAbove: 10000,
    
    // Integration Settings
    apiAccess: true,
    webhookNotifications: false,
    thirdPartyIntegrations: true
  });

  const [activeSettingsTab, setActiveSettingsTab] = useState<'user' | 'system' | 'security' | 'business' | 'integrations'>('user');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    // In production, this would save to the database
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-6">System Settings</h2>
        
        {/* Settings Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-slate-700 rounded-lg p-1">
          {[
            { id: 'user', name: 'User Preferences' },
            { id: 'system', name: 'System' },
            { id: 'security', name: 'Security' },
            { id: 'business', name: 'Business' },
            { id: 'integrations', name: 'Integrations' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSettingsTab(tab.id as any)}
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                activeSettingsTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="space-y-6">
          {activeSettingsTab === 'user' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
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
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                    { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser notifications' },
                    { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly analytics reports' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings[item.key as keyof typeof settings] as boolean}
                          onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                          className="w-5 h-5 text-orange-500 bg-slate-600 border-slate-500 rounded focus:ring-orange-500"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Display Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">System Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Auto-save Interval (seconds)</label>
                    <input
                      type="number"
                      value={settings.autoSaveInterval}
                      onChange={(e) => handleSettingChange('autoSaveInterval', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Default Currency</label>
                    <select
                      value={settings.defaultCurrency}
                      onChange={(e) => handleSettingChange('defaultCurrency', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                        className="w-5 h-5 text-orange-500 bg-slate-600 border-slate-500 rounded focus:ring-orange-500"
                      />
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Password Expiry (days)</label>
                      <input
                        type="number"
                        value={settings.passwordExpiry}
                        onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'business' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Business Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Default Margin (%)</label>
                    <input
                      type="number"
                      value={settings.defaultMargin}
                      onChange={(e) => handleSettingChange('defaultMargin', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Auto-approval Limit ($)</label>
                    <input
                      type="number"
                      value={settings.autoApprovalLimit}
                      onChange={(e) => handleSettingChange('autoApprovalLimit', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSettingsTab === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">API & Integrations</h3>
                <div className="space-y-4">
                  {[
                    { key: 'apiAccess', label: 'API Access', description: 'Enable API access for third-party integrations' },
                    { key: 'webhookNotifications', label: 'Webhook Notifications', description: 'Send notifications via webhooks' },
                    { key: 'thirdPartyIntegrations', label: 'Third-party Integrations', description: 'Allow connections to external services' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings[item.key as keyof typeof settings] as boolean}
                          onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                          className="w-5 h-5 text-orange-500 bg-slate-600 border-slate-500 rounded focus:ring-orange-500"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <div className="flex justify-end space-x-4">
            <button className="bg-slate-600 hover:bg-slate-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Reset to Defaults
            </button>
            <button
              onClick={saveSettings}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperDashboard;