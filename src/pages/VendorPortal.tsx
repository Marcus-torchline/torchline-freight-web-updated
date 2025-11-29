import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { DatabaseAPI } from "../services/databaseApi";
import { TrendingUp, DollarSign, Package, Users } from "lucide-react";

interface VendorStats {
  totalDocuments: number;
  totalCollections: number;
}

const VendorPortal: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    if (!user) return;
    
    const dbApi = new DatabaseAPI(user.email);
    
    const ordersResponse = await dbApi.readData("vendor_orders", undefined, 10, 0);
    if (ordersResponse.success && ordersResponse.data) {
      setOrders(ordersResponse.data.filter((o: any) => o.data.vendorEmail === user.email));
    }

    const statsResponse = await dbApi.getStats();
    if (statsResponse.success && statsResponse.data) {
      setStats({
        totalDocuments: statsResponse.data.totalDocuments || 0,
        totalCollections: statsResponse.data.totalCollections || 0
      });
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your portal...</div>
      </div>
    );
  }

  return (
    <main className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Vendor Portal</h1>
          <p className="text-gray-400">Welcome back, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Total Orders</h3>
              <Package className="text-orange-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-white">{orders.length}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Active Orders</h3>
              <TrendingUp className="text-green-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-white">{orders.filter(o => o.data.status === "active").length}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Revenue</h3>
              <DollarSign className="text-blue-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-white">$0</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Customers</h3>
              <Users className="text-purple-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-400">No orders found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Order ID</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Customer</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Service</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-750">
                      <td className="py-3 px-4 text-white">{order.data.orderId}</td>
                      <td className="py-3 px-4 text-white">{order.data.customerName}</td>
                      <td className="py-3 px-4 text-gray-400">{order.data.service}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-full text-sm">
                          {order.data.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Database Statistics</h2>
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Total Documents</p>
                <p className="text-2xl font-bold text-white">{stats.totalDocuments}</p>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Total Collections</p>
                <p className="text-2xl font-bold text-white">{stats.totalCollections}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">No statistics available</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default VendorPortal;