import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Package, DollarSign } from 'lucide-react';
import { AdvancedDatabaseAPI } from '../services/advancedDatabaseApi';
import { useAuth } from '../context/AuthContext';

interface SearchFilters {
  query: string;
  dateRange: {
    start: string;
    end: string;
  };
  status: string;
  service: string;
  location: string;
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface SearchResult {
  id: string;
  type: 'quote' | 'shipment' | 'customer';
  title: string;
  description: string;
  status: string;
  date: string;
  metadata: any;
}

const AdvancedSearch: React.FC = () => {
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    dateRange: {
      start: '',
      end: ''
    },
    status: '',
    service: '',
    location: '',
    priceRange: {
      min: 0,
      max: 100000
    },
    sortBy: 'date',
    sortOrder: 'desc'
  });

  useEffect(() => {
    if (filters.query.length > 2) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [filters]);

  const performSearch = async () => {
    if (!user) return;
    
    setLoading(true);
    const dbApi = new AdvancedDatabaseAPI(user.email);
    
    try {
      // Search across multiple collections
      const collections = ['quote_requests', 'shipments', 'customers'];
      const allResults: SearchResult[] = [];
      
      for (const collection of collections) {
        const response = await dbApi.readData(collection, undefined, 50, 0);
        
        if (response.success && response.data) {
          const filteredResults = response.data
            .filter((item: any) => {
              const data = item.data;
              const searchText = JSON.stringify(data).toLowerCase();
              const queryMatch = searchText.includes(filters.query.toLowerCase());
              
              // Apply filters
              let statusMatch = true;
              let serviceMatch = true;
              let dateMatch = true;
              let locationMatch = true;
              
              if (filters.status && data.status) {
                statusMatch = data.status === filters.status;
              }
              
              if (filters.service && data.service) {
                serviceMatch = data.service === filters.service;
              }
              
              if (filters.dateRange.start && data.submittedAt) {
                const itemDate = new Date(data.submittedAt);
                const startDate = new Date(filters.dateRange.start);
                dateMatch = itemDate >= startDate;
              }
              
              if (filters.dateRange.end && data.submittedAt) {
                const itemDate = new Date(data.submittedAt);
                const endDate = new Date(filters.dateRange.end);
                dateMatch = dateMatch && itemDate <= endDate;
              }
              
              if (filters.location) {
                const locationText = `${data.pickupLocation || ''} ${data.deliveryLocation || ''} ${data.origin || ''} ${data.destination || ''}`.toLowerCase();
                locationMatch = locationText.includes(filters.location.toLowerCase());
              }
              
              return queryMatch && statusMatch && serviceMatch && dateMatch && locationMatch;
            })
            .map((item: any) => {
              const data = item.data;
              let type: 'quote' | 'shipment' | 'customer' = 'quote';
              let title = '';
              let description = '';
              
              if (collection === 'quote_requests') {
                type = 'quote';
                title = `Quote Request - ${data.service || 'Unknown Service'}`;
                description = `${data.name} from ${data.company || 'Unknown Company'}`;
              } else if (collection === 'shipments') {
                type = 'shipment';
                title = `Shipment ${data.trackingNumber || 'Unknown'}`;
                description = `${data.origin || 'Unknown'} → ${data.destination || 'Unknown'}`;
              } else if (collection === 'customers') {
                type = 'customer';
                title = data.name || 'Unknown Customer';
                description = data.company || 'No company';
              }
              
              return {
                id: item.id,
                type,
                title,
                description,
                status: data.status || 'unknown',
                date: data.submittedAt || data.createdAt || new Date().toISOString(),
                metadata: data
              };
            });
          
          allResults.push(...filteredResults);
        }
      }
      
      // Sort results
      allResults.sort((a, b) => {
        const aValue = filters.sortBy === 'date' ? new Date(a.date).getTime() : a.title;
        const bValue = filters.sortBy === 'date' ? new Date(b.date).getTime() : b.title;
        
        if (filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      
      setResults(allResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      dateRange: { start: '', end: '' },
      status: '',
      service: '',
      location: '',
      priceRange: { min: 0, max: 100000 },
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'quote':
        return <DollarSign className="text-orange-400" size={20} />;
      case 'shipment':
        return <Package className="text-blue-400" size={20} />;
      case 'customer':
        return <MapPin className="text-green-400" size={20} />;
      default:
        return <Search className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'delivered':
      case 'active':
        return 'text-green-400';
      case 'pending':
      case 'in-transit':
        return 'text-yellow-400';
      case 'rejected':
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Advanced Search</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <Filter size={20} />
          <span>Filters</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          placeholder="Search quotes, shipments, customers..."
          className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
        />
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-slate-700 p-6 rounded-lg mb-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Search Filters</h3>
            <button
              onClick={clearFilters}
              className="text-orange-400 hover:text-orange-300 transition-colors text-sm"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:border-orange-400 text-white"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Service</label>
              <select
                value={filters.service}
                onChange={(e) => setFilters({ ...filters, service: e.target.value })}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:border-orange-400 text-white"
              >
                <option value="">All Services</option>
                <option value="ocean">Ocean Freight</option>
                <option value="air">Air Freight</option>
                <option value="ground">Ground Transportation</option>
                <option value="warehouse">Warehousing</option>
                <option value="customs">Customs Clearance</option>
                <option value="specialized">Specialized Cargo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                placeholder="City, State, Country"
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:border-orange-400 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, start: e.target.value } })}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:border-orange-400 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, end: e.target.value } })}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:border-orange-400 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters({ ...filters, sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
                }}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg focus:outline-none focus:border-orange-400 text-white"
              >
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div>
        {loading && (
          <div className="text-center py-8">
            <div className="text-white">Searching...</div>
          </div>
        )}

        {!loading && filters.query.length > 2 && results.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400">No results found for "{filters.query}"</div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-400 mb-4">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </div>
            
            {results.map((result) => (
              <div key={result.id} className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer">
                <div className="flex items-start space-x-3">
                  {getResultIcon(result.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{result.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                          {result.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(result.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{result.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="capitalize">{result.type}</span>
                      {result.metadata.service && (
                        <span>Service: {result.metadata.service}</span>
                      )}
                      {result.metadata.trackingNumber && (
                        <span>Tracking: {result.metadata.trackingNumber}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;