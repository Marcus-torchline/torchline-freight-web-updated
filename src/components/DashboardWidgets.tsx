import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, DollarSign, Users, Clock, CheckCircle } from 'lucide-react';
import { AdvancedDatabaseAPI } from '../services/advancedDatabaseApi';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardData {
  totalRevenue: number;
  monthlyGrowth: number;
  activeShipments: number;
  completedShipments: number;
  pendingQuotes: number;
  customerSatisfaction: number;
  recentActivity: any[];
  performanceData: any[];
}

const DashboardWidgets: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      // Simulate dashboard data - in real app, this would come from your analytics API
      const mockData: DashboardData = {
        totalRevenue: 125000 + Math.floor(Math.random() * 50000),
        monthlyGrowth: 12.5 + Math.floor(Math.random() * 10),
        activeShipments: 45 + Math.floor(Math.random() * 20),
        completedShipments: 234 + Math.floor(Math.random() * 50),
        pendingQuotes: 18 + Math.floor(Math.random() * 10),
        customerSatisfaction: 94.2 + Math.floor(Math.random() * 5),
        recentActivity: [
          { id: 1, type: 'quote', message: 'New quote request from ABC Corp', time: '2 minutes ago' },
          { id: 2, type: 'shipment', message: 'Shipment TFG123456 delivered successfully', time: '15 minutes ago' },
          { id: 3, type: 'customer', message: 'New customer registration: XYZ Logistics', time: '1 hour ago' },
          { id: 4, type: 'quote', message: 'Quote approved for DEF Industries', time: '2 hours ago' },
          { id: 5, type: 'shipment', message: 'Shipment TFG789012 in transit', time: '3 hours ago' }
        ],
        performanceData: [
          { name: 'Week 1', revenue: 28000, quotes: 12, shipments: 8 },
          { name: 'Week 2', revenue: 32000, quotes: 15, shipments: 11 },
          { name: 'Week 3', revenue: 29000, quotes: 13, shipments: 9 },
          { name: 'Week 4', revenue: 36000, quotes: 18, shipments: 14 }
        ]
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quote':
        return <Package className="text-blue-400" size={16} />;
      case 'shipment':
        return <TrendingUp className="text-green-400" size={16} />;
      case 'customer':
        return <Users className="text-purple-400" size={16} />;
      default:
        return <Clock className="text-gray-400" size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-slate-800 p-6 rounded-lg animate-pulse">
            <div className="h-4 bg-slate-700 rounded mb-4"></div>
            <div className="h-8 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="text-white text-center py-8">Unable to load dashboard data</div>;
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
            <DollarSign size={24} className="opacity-80" />
          </div>
          <p className="text-3xl font-bold">${dashboardData.totalRevenue.toLocaleString()}</p>
          <p className="text-sm opacity-80 mt-1">+{dashboardData.monthlyGrowth}% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Active Shipments</h3>
            <Package size={24} className="opacity-80" />
          </div>
          <p className="text-3xl font-bold">{dashboardData.activeShipments}</p>
          <p className="text-sm opacity-80 mt-1">{dashboardData.completedShipments} completed this month</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Pending Quotes</h3>
            <Clock size={24} className="opacity-80" />
          </div>
          <p className="text-3xl font-bold">{dashboardData.pendingQuotes}</p>
          <p className="text-sm opacity-80 mt-1">Awaiting approval</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Customer Satisfaction</h3>
            <CheckCircle size={24} className="opacity-80" />
          </div>
          <p className="text-3xl font-bold">{dashboardData.customerSatisfaction}%</p>
          <p className="text-sm opacity-80 mt-1">Based on recent feedback</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Performance Trends</h3>
          <TrendingUp className="text-orange-400" size={24} />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dashboardData.performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569',
                borderRadius: '8px'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#f97316" 
              fill="#f97316" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-slate-700 rounded-lg">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.message}</p>
                  <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 text-left">
              Create New Quote
            </button>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors text-left">
              Track Shipment
            </button>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors text-left">
              Generate Report
            </button>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors text-left">
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;