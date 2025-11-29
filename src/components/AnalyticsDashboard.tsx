import React, { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Users, Package } from "lucide-react";
import { AdvancedDatabaseAPI } from "../services/advancedDatabaseApi";
import { useAuth } from "../context/AuthContext";
import { AnalyticsData } from "../types/AdvancedFeatures";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const dbApi = new AdvancedDatabaseAPI(user?.email || "admin@torchlinegroup.com");
    const data = await dbApi.getAnalytics();
    setAnalytics(data);
    setLoading(false);
  };

  const COLORS = ["#f97316", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  if (loading) {
    return <div className="text-white text-center py-8">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="text-white text-center py-8">No analytics data available</div>;
  }

  const quoteStatusData = [
    { name: "Approved", value: analytics.approvedQuotes },
    { name: "Rejected", value: analytics.rejectedQuotes },
    { name: "Pending", value: analytics.pendingQuotes }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Conversion Rate</h3>
            <TrendingUp className="text-green-400" size={24} />
          </div>
          <p className="text-3xl font-bold text-white">{analytics.conversionRate.toFixed(1)}%</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Total Quotes</h3>
            <Package className="text-blue-400" size={24} />
          </div>
          <p className="text-3xl font-bold text-white">{analytics.totalQuotes}</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Avg Quote Value</h3>
            <DollarSign className="text-orange-400" size={24} />
          </div>
          <p className="text-3xl font-bold text-white">${analytics.averageQuoteValue.toFixed(0)}</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Active Customers</h3>
            <Users className="text-purple-400" size={24} />
          </div>
          <p className="text-3xl font-bold text-white">{analytics.customerMetrics.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Quote Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={quoteStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {quoteStatusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Revenue Forecast</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenueForecasting}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
              <Legend />
              <Line type="monotone" dataKey="projected" stroke="#f97316" strokeWidth={2} />
              <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">Top Services Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.topServices}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="serviceName" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
            <Legend />
            <Bar dataKey="quoteCount" fill="#f97316" />
            <Bar dataKey="approvalRate" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4">Top Customers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Customer</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Total Quotes</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Approved</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Revenue</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {analytics.customerMetrics.slice(0, 5).map((customer, index) => (
                <tr key={index} className="border-b border-slate-700 hover:bg-slate-750">
                  <td className="py-3 px-4 text-white">{customer.customerName}</td>
                  <td className="py-3 px-4 text-white">{customer.totalQuotes}</td>
                  <td className="py-3 px-4 text-green-400">{customer.approvedQuotes}</td>
                  <td className="py-3 px-4 text-white">${customer.totalRevenue.toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-400">{new Date(customer.lastActivity).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;