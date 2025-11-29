import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { DatabaseAPI } from "../services/databaseApi";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

const CustomerPortal: React.FC = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<any[]>([]);

  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = async () => {
    if (!user) return;
    
    const dbApi = new DatabaseAPI(user.email);
    
    const shipmentsResponse = await dbApi.readData("shipments", undefined, 10, 0);
    if (shipmentsResponse.success && shipmentsResponse.data) {
      setShipments(shipmentsResponse.data.filter((s: any) => s.data.customerEmail === user.email));
    }

    const quotesResponse = await dbApi.readData("quotes", undefined, 10, 0);
    if (quotesResponse.success && quotesResponse.data) {
      setQuotes(quotesResponse.data.filter((q: any) => q.data.email === user.email));
    }

    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="text-green-400" size={20} />;
      case "in-transit":
        return <Clock className="text-yellow-400" size={20} />;
      case "pending":
        return <Package className="text-blue-400" size={20} />;
      default:
        return <XCircle className="text-red-400" size={20} />;
    }
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
          <h1 className="text-4xl font-bold text-white mb-2">Customer Portal</h1>
          <p className="text-gray-400">Welcome back, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-2">Active Shipments</h3>
            <p className="text-3xl font-bold text-white">{shipments.filter(s => s.data.status !== "delivered").length}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-2">Pending Quotes</h3>
            <p className="text-3xl font-bold text-white">{quotes.filter(q => q.data.status === "pending").length}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-2">Total Deliveries</h3>
            <p className="text-3xl font-bold text-white">{shipments.filter(s => s.data.status === "delivered").length}</p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Shipments</h2>
          {shipments.length === 0 ? (
            <p className="text-gray-400">No shipments found</p>
          ) : (
            <div className="space-y-4">
              {shipments.map((shipment) => (
                <div key={shipment.id} className="bg-slate-700 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(shipment.data.status)}
                    <div>
                      <p className="text-white font-semibold">Tracking: {shipment.data.trackingNumber}</p>
                      <p className="text-gray-400 text-sm">{shipment.data.origin} → {shipment.data.destination}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white capitalize">{shipment.data.status}</p>
                    <p className="text-gray-400 text-sm">{new Date(shipment.data.estimatedDelivery).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Your Quotes</h2>
          {quotes.length === 0 ? (
            <p className="text-gray-400">No quotes found</p>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div key={quote.id} className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-semibold">{quote.data.service}</p>
                      <p className="text-gray-400 text-sm">{quote.data.company}</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-full text-sm">
                      {quote.data.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{quote.data.message}</p>
                  <p className="text-gray-500 text-xs mt-2">Submitted: {new Date(quote.data.submittedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CustomerPortal;