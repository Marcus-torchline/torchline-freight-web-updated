import React, { useState, useEffect } from 'react';
import { MapPin, Truck, Package, Clock, CheckCircle, AlertTriangle, Navigation, RefreshCw } from 'lucide-react';
import { AdvancedDatabaseAPI } from '../services/advancedDatabaseApi';
import { useAuth } from '../context/AuthContext';

interface TrackingData {
  id: string;
  shipmentId: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed' | 'exception';
  currentLocation: {
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  destination: {
    city: string;
    state: string;
    address: string;
  };
  origin: {
    city: string;
    state: string;
    address: string;
  };
  estimatedDelivery: string;
  actualDelivery?: string;
  carrier: {
    name: string;
    contact: string;
    vehicleId: string;
  };
  progress: number;
  trackingHistory: TrackingEvent[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  shipmentDetails: {
    weight: number;
    dimensions: string;
    value: number;
    description: string;
  };
  lastUpdated: string;
}

interface TrackingEvent {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  description: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const RealTimeTracking: React.FC = () => {
  const { user } = useAuth();
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadTrackingData();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadTrackingData();
        setLastRefresh(new Date());
      }, 30000); // Refresh every 30 seconds
      
      setRefreshInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
    
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [autoRefresh]);

  const loadTrackingData = async () => {
    try {
      setLoading(true);
      
      // Mock tracking data - in production, this would come from your tracking system
      const mockTrackingData: TrackingData[] = [
        {
          id: '1',
          shipmentId: 'TFG-2024-001',
          status: 'in_transit',
          currentLocation: {
            city: 'Denver',
            state: 'CO',
            coordinates: { lat: 39.7392, lng: -104.9903 }
          },
          destination: {
            city: 'Los Angeles',
            state: 'CA',
            address: '123 Main St, Los Angeles, CA 90210'
          },
          origin: {
            city: 'Chicago',
            state: 'IL',
            address: '456 Oak Ave, Chicago, IL 60601'
          },
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          carrier: {
            name: 'Swift Transport',
            contact: '+1-555-0123',
            vehicleId: 'ST-7892'
          },
          progress: 65,
          customerInfo: {
            name: 'Acme Corporation',
            email: 'shipping@acme.com',
            phone: '+1-555-0199'
          },
          shipmentDetails: {
            weight: 2500,
            dimensions: '48x40x36 inches',
            value: 15000,
            description: 'Industrial Equipment'
          },
          trackingHistory: [
            {
              id: '1',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              location: 'Denver, CO',
              status: 'In Transit',
              description: 'Package is on the way to the next facility',
              coordinates: { lat: 39.7392, lng: -104.9903 }
            },
            {
              id: '2',
              timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
              location: 'Kansas City, MO',
              status: 'Departed Facility',
              description: 'Departed from Kansas City distribution center',
              coordinates: { lat: 39.0997, lng: -94.5786 }
            },
            {
              id: '3',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              location: 'Chicago, IL',
              status: 'Picked Up',
              description: 'Package picked up from origin',
              coordinates: { lat: 41.8781, lng: -87.6298 }
            }
          ],
          lastUpdated: new Date().toISOString()
        },
        {
          id: '2',
          shipmentId: 'TFG-2024-002',
          status: 'delivered',
          currentLocation: {
            city: 'Miami',
            state: 'FL',
            coordinates: { lat: 25.7617, lng: -80.1918 }
          },
          destination: {
            city: 'Miami',
            state: 'FL',
            address: '789 Beach Blvd, Miami, FL 33139'
          },
          origin: {
            city: 'Atlanta',
            state: 'GA',
            address: '321 Peachtree St, Atlanta, GA 30309'
          },
          estimatedDelivery: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          actualDelivery: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          carrier: {
            name: 'Express Logistics',
            contact: '+1-555-0456',
            vehicleId: 'EL-3456'
          },
          progress: 100,
          customerInfo: {
            name: 'Global Tech Solutions',
            email: 'logistics@globaltech.com',
            phone: '+1-555-0789'
          },
          shipmentDetails: {
            weight: 850,
            dimensions: '24x18x12 inches',
            value: 8500,
            description: 'Computer Hardware'
          },
          trackingHistory: [
            {
              id: '1',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              location: 'Miami, FL',
              status: 'Delivered',
              description: 'Package delivered successfully',
              coordinates: { lat: 25.7617, lng: -80.1918 }
            },
            {
              id: '2',
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              location: 'Miami, FL',
              status: 'Out for Delivery',
              description: 'Package is out for delivery',
              coordinates: { lat: 25.7617, lng: -80.1918 }
            },
            {
              id: '3',
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              location: 'Atlanta, GA',
              status: 'Picked Up',
              description: 'Package picked up from origin',
              coordinates: { lat: 33.7490, lng: -84.3880 }
            }
          ],
          lastUpdated: new Date().toISOString()
        },
        {
          id: '3',
          shipmentId: 'TFG-2024-003',
          status: 'delayed',
          currentLocation: {
            city: 'Phoenix',
            state: 'AZ',
            coordinates: { lat: 33.4484, lng: -112.0740 }
          },
          destination: {
            city: 'Seattle',
            state: 'WA',
            address: '555 Pine St, Seattle, WA 98101'
          },
          origin: {
            city: 'Dallas',
            state: 'TX',
            address: '777 Commerce St, Dallas, TX 75201'
          },
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          carrier: {
            name: 'Reliable Freight',
            contact: '+1-555-0789',
            vehicleId: 'RF-9876'
          },
          progress: 45,
          customerInfo: {
            name: 'Northwest Manufacturing',
            email: 'shipping@nwmfg.com',
            phone: '+1-555-0321'
          },
          shipmentDetails: {
            weight: 5200,
            dimensions: '60x48x42 inches',
            value: 25000,
            description: 'Manufacturing Parts'
          },
          trackingHistory: [
            {
              id: '1',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              location: 'Phoenix, AZ',
              status: 'Delayed',
              description: 'Shipment delayed due to weather conditions',
              coordinates: { lat: 33.4484, lng: -112.0740 }
            },
            {
              id: '2',
              timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
              location: 'Albuquerque, NM',
              status: 'In Transit',
              description: 'Package departed from Albuquerque facility',
              coordinates: { lat: 35.0844, lng: -106.6504 }
            },
            {
              id: '3',
              timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
              location: 'Dallas, TX',
              status: 'Picked Up',
              description: 'Package picked up from origin',
              coordinates: { lat: 32.7767, lng: -96.7970 }
            }
          ],
          lastUpdated: new Date().toISOString()
        }
      ];
      
      setTrackingData(mockTrackingData);
    } catch (error) {
      console.error('Error loading tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-400" size={20} />;
      case 'picked_up':
        return <Package className="text-blue-400" size={20} />;
      case 'in_transit':
        return <Truck className="text-orange-400" size={20} />;
      case 'out_for_delivery':
        return <Navigation className="text-purple-400" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'delayed':
      case 'exception':
        return <AlertTriangle className="text-red-400" size={20} />;
      default:
        return <Package className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400';
      case 'picked_up':
        return 'bg-blue-500 bg-opacity-20 text-blue-400';
      case 'in_transit':
        return 'bg-orange-500 bg-opacity-20 text-orange-400';
      case 'out_for_delivery':
        return 'bg-purple-500 bg-opacity-20 text-purple-400';
      case 'delivered':
        return 'bg-green-500 bg-opacity-20 text-green-400';
      case 'delayed':
      case 'exception':
        return 'bg-red-500 bg-opacity-20 text-red-400';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredTrackingData = trackingData.filter(item => {
    const matchesSearch = item.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-800 p-6 rounded-lg animate-pulse">
          <div className="h-6 bg-slate-700 rounded mb-4 w-1/3"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Real-Time Tracking</h2>
          <p className="text-gray-400">Monitor shipments in real-time</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 text-gray-300">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
              />
              <span className="text-sm">Auto-refresh</span>
            </label>
          </div>
          <button
            onClick={() => {
              loadTrackingData();
              setLastRefresh(new Date());
            }}
            className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Last Refresh Info */}
      <div className="text-sm text-gray-400">
        Last updated: {lastRefresh.toLocaleTimeString()}
        {autoRefresh && <span className="ml-2">(Auto-refresh every 30s)</span>}
      </div>

      {/* Filters */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search Shipments</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by shipment ID or customer name..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="delayed">Delayed</option>
              <option value="exception">Exception</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tracking Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTrackingData.map((shipment) => (
          <div key={shipment.id} className="bg-slate-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(shipment.status)}
                <div>
                  <h3 className="text-lg font-semibold text-white">{shipment.shipmentId}</h3>
                  <p className="text-gray-400 text-sm">{shipment.customerInfo.name}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                {shipment.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{shipment.progress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    shipment.status === 'delivered' ? 'bg-green-500' :
                    shipment.status === 'delayed' || shipment.status === 'exception' ? 'bg-red-500' :
                    'bg-orange-500'
                  }`}
                  style={{ width: `${shipment.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Location Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="text-green-400" size={16} />
                <span className="text-gray-300 text-sm">Origin:</span>
                <span className="text-white text-sm">{shipment.origin.city}, {shipment.origin.state}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="text-orange-400" size={16} />
                <span className="text-gray-300 text-sm">Current:</span>
                <span className="text-white text-sm">{shipment.currentLocation.city}, {shipment.currentLocation.state}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="text-blue-400" size={16} />
                <span className="text-gray-300 text-sm">Destination:</span>
                <span className="text-white text-sm">{shipment.destination.city}, {shipment.destination.state}</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="border-t border-slate-700 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Estimated Delivery:</span>
                  <p className="text-white">{formatDateTime(shipment.estimatedDelivery)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Carrier:</span>
                  <p className="text-white">{shipment.carrier.name}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => setSelectedShipment(shipment)}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                View Details
              </button>
              <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                Contact Carrier
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Shipment Details - {selectedShipment.shipmentId}</h3>
                <button
                  onClick={() => setSelectedShipment(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipment Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Shipment Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Weight:</span>
                        <span className="text-white">{selectedShipment.shipmentDetails.weight} lbs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Dimensions:</span>
                        <span className="text-white">{selectedShipment.shipmentDetails.dimensions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Value:</span>
                        <span className="text-white">${selectedShipment.shipmentDetails.value.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Description:</span>
                        <span className="text-white">{selectedShipment.shipmentDetails.description}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{selectedShipment.customerInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{selectedShipment.customerInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white">{selectedShipment.customerInfo.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking History */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Tracking History</h4>
                  <div className="space-y-3">
                    {selectedShipment.trackingHistory.map((event) => (
                      <div key={event.id} className="bg-slate-700 p-3 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white font-medium">{event.status}</p>
                                <p className="text-gray-400 text-sm">{event.location}</p>
                                <p className="text-gray-300 text-sm">{event.description}</p>
                              </div>
                              <span className="text-gray-400 text-xs">
                                {formatDateTime(event.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Route Map Placeholder */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-3">Route Map</h4>
                <div className="bg-slate-700 rounded-lg p-8 text-center">
                  <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-400">Interactive route map would be displayed here</p>
                  <p className="text-gray-500 text-sm mt-2">Integration with mapping service required</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeTracking;