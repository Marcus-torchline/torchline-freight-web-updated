import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, Truck, DollarSign, Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardData {
  totalShipments: number;
  activeShipments: number;
  completedShipments: number;
  totalRevenue: number;
  monthlyGrowth: number;
  customerCount: number;
  vendorCount: number;
  pendingQuotes: number;
  recentActivities: Activity[];
  performanceMetrics: PerformanceMetric[];
}

interface Activity {
  id: string;
  type: 'shipment' | 'quote' | 'customer' | 'vendor';
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

const DashboardWidgets: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data - in production, this would come from your database
      const mockData: DashboardData = {
        totalShipments: 1247,
        activeShipments: 89,
        completedShipments: 1158,
        totalRevenue: 2847392,
        monthlyGrowth: 12.5,
        customerCount: 342,
        vendorCount: 67,
        pendingQuotes: 23,
        recentActivities: [
          {
            id: '1',
            type: 'shipment',
            description: 'Shipment TFG-2024-001 delivered successfully',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            status: 'success'
          },
          {
            id: '2',
            type: 'quote',
            description: 'New quote request from Acme Corp',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            status: 'info'
          },
          {
            id: '3',
            type: 'shipment',
            description: 'Shipment TFG-2024-002 delayed due to weather',
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            status: 'warning'
          },
          {
            id: '4',
            type: 'customer',
            description: 'New customer registration: Global Logistics Inc',
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            status: 'success'
          },
          {
            id: '5',
            type: 'vendor',
            description: 'Vendor performance review completed',
            timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
            status: 'info'
          }
        ],
        performanceMetrics: [
          {
            name: 'On-Time Delivery',
            value: 94.2,
            target: 95.0,
            trend: 'up',
            percentage: 2.1
          },
          {
            name: 'Customer Satisfaction',
            value: 4.7,
            target: 4.5,
            trend: 'up',
            percentage: 4.4
          },
          {
            name: 'Cost Efficiency',
            value: 87.3,
            target: 85.0,
            trend: 'up',
            percentage: 2.7
          },
          {
            name: 'Quote Conversion',
            value: 68.9,
            target: 70.0,
            trend: 'down',
            percentage: -1.6
          }
        ]
      };
      
      setDashboardData(mockData);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getActivityIcon = (type: string, status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-400" size={16} />;
      case 'warning':
        return <AlertCircle className="text-yellow-400" size={16} />;
      case 'error':
        return <AlertCircle className="text-red-400" size={16} />;
      default:
        return <Clock className="text-blue-400" size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-slate-800 p-6 rounded-lg animate-pulse">
              <div className="h-4 bg-slate-700 rounded mb-4"></div>
              <div className="h-8 bg-slate-700 rounded mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-6">
        <div className="flex items-center space-x-2">
          <AlertCircle className="text-red-400" size={24} />
          <h3 className="text-red-400 font-semibold">Error Loading Dashboard</h3>
        </div>
        <p className="text-red-300 mt-2">{error}</p>
        <button
          onClick={loadDashboardData}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-orange-100">
          Here's what's happening with your freight operations today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Shipments</h3>
            <Package className="text-blue-400" size={24} />
          </div>
          <p className="text-3xl font-bold text-white">{dashboardData.totalShipments.toLocaleString()}</p>
          <p className="text-green-400 text-sm mt-1">+{dashboardData.monthlyGrowth}% this month</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Active Shipments</h3>
            <Truck className="text-orange-400" size={24} />
          </div>
          <p className="text-3xl font-bold text-white">{dashboardData.activeShipments}</p>
          <p className="text-blue-400 text-sm mt-1">Currently in transit</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Revenue</h3>
            <DollarSign className="text-green-400" size={24} />
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(dashboardData.totalRevenue)}</p>
          <p className="text-green-400 text-sm mt-1">Year to date</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Customers</h3>
            <Users className="text-purple-400" size={24} />
          </div>
          <p className="text-3xl font-bold text-white">{dashboardData.customerCount}</p>
          <p className="text-purple-400 text-sm mt-1">Active customers</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-6">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData.performanceMetrics.map((metric, index) => (
            <div key={index} className="bg-slate-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-300">{metric.name}</h4>
                <TrendingUp 
                  className={`${
                    metric.trend === 'up' ? 'text-green-400' : 
                    metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`} 
                  size={16} 
                />
              </div>
              <p className="text-2xl font-bold text-white">
                {metric.name.includes('Satisfaction') ? metric.value.toFixed(1) : `${metric.value}%`}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                  Target: {metric.name.includes('Satisfaction') ? metric.target.toFixed(1) : `${metric.target}%`}
                </span>
                <span className={`text-xs ${
                  metric.percentage > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.percentage > 0 ? '+' : ''}{metric.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-6">Recent Activities</h3>
        <div className="space-y-4">
          {dashboardData.recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-slate-700 rounded-lg">
              {getActivityIcon(activity.type, activity.status)}
              <div className="flex-1">
                <p className="text-white text-sm">{activity.description}</p>
                <p className="text-gray-400 text-xs mt-1">{formatTimeAgo(activity.timestamp)}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                activity.status === 'success' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                activity.status === 'warning' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                activity.status === 'error' ? 'bg-red-500 bg-opacity-20 text-red-400' :
                'bg-blue-500 bg-opacity-20 text-blue-400'
              }`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200">
            Create New Shipment
          </button>
          <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200">
            Generate Quote
          </button>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;