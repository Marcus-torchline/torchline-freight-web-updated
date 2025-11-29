import React, { useState, useEffect } from 'react';
import { MapPin, Truck, Clock, CheckCircle, AlertTriangle, Package } from 'lucide-react';
import { AdvancedDatabaseAPI } from '../services/advancedDatabaseApi';
import { useAuth } from '../context/AuthContext';

interface TrackingEvent {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  description: string;
  coordinates?: { lat: number; lng: number };
}

interface ShipmentDetails {
  trackingNumber: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  currentStatus: string;
  currentLocation: string;
  progress: number;
  events: TrackingEvent[];
  carrier: string;
  service: string;
}

const RealTimeTracking: React.FC = () => {
  const { user } = useAuth();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipmentDetails, setShipmentDetails] = useState<ShipmentDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [liveUpdates, setLiveUpdates] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (liveUpdates && shipmentDetails) {
      interval = setInterval(() => {
        refreshTrackingData();
      }, 30000); // Update every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [liveUpdates, shipmentDetails]);

  const trackShipment = async () => {
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const dbApi = new AdvancedDatabaseAPI(user?.email || 'guest@torchlinegroup.com');
      
      // Simulate real tracking data - in production, this would call actual carrier APIs
      const mockShipmentData: ShipmentDetails = {
        trackingNumber: trackingNumber.toUpperCase(),
        origin: 'Los Angeles, CA',
        destination: 'New York, NY',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        currentStatus: 'In Transit',
        currentLocation: 'Denver, CO',
        progress: 65,
        carrier: 'Torchline Express',
        service: 'Ground Transportation',
        events: [
          {
            id: '1',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Los Angeles, CA',
            status: 'Picked Up',
            description: 'Package picked up from shipper'
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Phoenix, AZ',
            status: 'In Transit',
            description: 'Package arrived at Phoenix sorting facility'
          },
          {
            id: '3',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Denver, CO',
            status: 'In Transit',
            description: 'Package in transit to next facility'
          },
          {
            id: '4',
            timestamp: new Date().toISOString(),
            location: 'Denver, CO',
            status: 'In Transit',
            description: 'Package at Denver distribution center'
          }
        ]
      };
      
      setShipmentDetails(mockShipmentData);
      
      // Store tracking data in database
      await dbApi.createData('tracking_searches', {
        trackingNumber: trackingNumber.toUpperCase(),
        searchedBy: user?.email || 'guest',
        searchedAt: new Date().toISOString(),
        found: true
      }, ['tracking', 'search']);
      
    } catch (err) {
      setError('Unable to track shipment. Please verify the tracking number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshTrackingData = async () => {
    if (!shipmentDetails) return;
    
    // Simulate live updates
    const updatedProgress = Math.min(shipmentDetails.progress + Math.random() * 5, 100);
    
    setShipmentDetails(prev => prev ? {
      ...prev,
      progress: updatedProgress,
      currentLocation: updatedProgress > 85 ? 'New York, NY' : prev.currentLocation
    } : null);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'picked up':
        return <Package className="text-blue-400" size={20} />;
      case 'in transit':
        return <Truck className="text-yellow-400" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'exception':
        return <AlertTriangle className="text-red-400" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Real-Time Shipment Tracking</h2>
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              checked={liveUpdates}
              onChange={(e) => setLiveUpdates(e.target.checked)}
              className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
            />
            <span className="text-sm">Live Updates</span>
          </label>
          {liveUpdates && shipmentDetails && (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Tracking Input */}
      <div className="mb-8">
        <div className="flex space-x-4">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
            placeholder="Enter tracking number (e.g., TFG123456789)"
            className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
            onKeyPress={(e) => e.key === 'Enter' && trackShipment()}
          />
          <button
            onClick={trackShipment}
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 bg-red-500 bg-opacity-10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Shipment Details */}
      {shipmentDetails && (
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-slate-700 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Tracking Number</h3>
                <p className="text-orange-400 font-mono text-xl">{shipmentDetails.trackingNumber}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Current Status</h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(shipmentDetails.currentStatus)}
                  <span className="text-white">{shipmentDetails.currentStatus}</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Estimated Delivery</h3>
                <p className="text-green-400">{formatDate(shipmentDetails.estimatedDelivery)}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-700 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Delivery Progress</h3>
              <span className="text-orange-400 font-semibold">{Math.round(shipmentDetails.progress)}%</span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-slate-600 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${shipmentDetails.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>{shipmentDetails.origin}</span>
                <span>{shipmentDetails.currentLocation}</span>
                <span>{shipmentDetails.destination}</span>
              </div>
            </div>
          </div>

          {/* Route Map Placeholder */}
          <div className="bg-slate-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Route Map</h3>
            <div className="bg-slate-600 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MapPin size={48} className="mx-auto mb-2" />
                <p>Interactive map would be displayed here</p>
                <p className="text-sm">Showing route from {shipmentDetails.origin} to {shipmentDetails.destination}</p>
              </div>
            </div>
          </div>

          {/* Tracking Events */}
          <div className="bg-slate-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Tracking History</h3>
            <div className="space-y-4">
              {shipmentDetails.events.map((event, index) => (
                <div key={event.id} className="flex items-start space-x-4 pb-4 border-b border-slate-600 last:border-b-0">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(event.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-semibold">{event.status}</h4>
                      <span className="text-gray-400 text-sm">{formatDate(event.timestamp)}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-1">{event.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <MapPin size={12} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipment Details */}
          <div className="bg-slate-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Shipment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Carrier</p>
                <p className="text-white">{shipmentDetails.carrier}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Service Type</p>
                <p className="text-white">{shipmentDetails.service}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Origin</p>
                <p className="text-white">{shipmentDetails.origin}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Destination</p>
                <p className="text-white">{shipmentDetails.destination}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Get Delivery Updates
            </button>
            <button className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Contact Carrier
            </button>
            <button className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Download POD
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeTracking;