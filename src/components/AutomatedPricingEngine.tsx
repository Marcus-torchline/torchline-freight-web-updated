import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Settings, Save, RefreshCw } from 'lucide-react';
import { AdvancedDatabaseAPI } from '../services/advancedDatabaseApi';
import { useAuth } from '../context/AuthContext';

interface PricingRule {
  id: string;
  name: string;
  serviceType: string;
  basePrice: number;
  weightMultiplier: number;
  distanceMultiplier: number;
  urgencyMultiplier: number;
  volumeDiscountThreshold: number;
  volumeDiscountRate: number;
  fuelSurcharge: number;
  seasonalAdjustment: number;
  active: boolean;
  lastUpdated: string;
}

interface PriceCalculation {
  basePrice: number;
  weightCharge: number;
  distanceCharge: number;
  urgencyCharge: number;
  fuelSurcharge: number;
  seasonalAdjustment: number;
  volumeDiscount: number;
  subtotal: number;
  taxes: number;
  totalPrice: number;
  breakdown: string[];
}

interface QuoteRequest {
  serviceType: string;
  weight: number;
  distance: number;
  urgency: 'standard' | 'express' | 'urgent';
  volume: number;
  origin: string;
  destination: string;
  specialRequirements: string[];
}

const AutomatedPricingEngine: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'calculator' | 'rules' | 'analytics'>('calculator');
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest>({
    serviceType: 'ground',
    weight: 0,
    distance: 0,
    urgency: 'standard',
    volume: 0,
    origin: '',
    destination: '',
    specialRequirements: []
  });
  const [calculation, setCalculation] = useState<PriceCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRule, setSelectedRule] = useState<PricingRule | null>(null);
  const [showRuleModal, setShowRuleModal] = useState(false);

  useEffect(() => {
    loadPricingRules();
  }, []);

  useEffect(() => {
    if (quoteRequest.serviceType && quoteRequest.weight > 0 && quoteRequest.distance > 0) {
      calculatePrice();
    }
  }, [quoteRequest]);

  const loadPricingRules = async () => {
    try {
      // Mock pricing rules - in production, these would be stored in database
      const mockRules: PricingRule[] = [
        {
          id: '1',
          name: 'Ground Transportation Standard',
          serviceType: 'ground',
          basePrice: 300,
          weightMultiplier: 0.5,
          distanceMultiplier: 1.2,
          urgencyMultiplier: 1.0,
          volumeDiscountThreshold: 10000,
          volumeDiscountRate: 0.1,
          fuelSurcharge: 0.15,
          seasonalAdjustment: 1.0,
          active: true,
          lastUpdated: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Air Freight Express',
          serviceType: 'air',
          basePrice: 500,
          weightMultiplier: 2.0,
          distanceMultiplier: 0.8,
          urgencyMultiplier: 1.5,
          volumeDiscountThreshold: 5000,
          volumeDiscountRate: 0.15,
          fuelSurcharge: 0.25,
          seasonalAdjustment: 1.1,
          active: true,
          lastUpdated: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Ocean Freight Standard',
          serviceType: 'ocean',
          basePrice: 1500,
          weightMultiplier: 0.3,
          distanceMultiplier: 0.5,
          urgencyMultiplier: 1.0,
          volumeDiscountThreshold: 20000,
          volumeDiscountRate: 0.2,
          fuelSurcharge: 0.1,
          seasonalAdjustment: 0.95,
          active: true,
          lastUpdated: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Specialized Cargo',
          serviceType: 'specialized',
          basePrice: 1000,
          weightMultiplier: 1.5,
          distanceMultiplier: 1.0,
          urgencyMultiplier: 2.0,
          volumeDiscountThreshold: 15000,
          volumeDiscountRate: 0.05,
          fuelSurcharge: 0.2,
          seasonalAdjustment: 1.05,
          active: true,
          lastUpdated: new Date().toISOString()
        }
      ];
      
      setPricingRules(mockRules);
    } catch (error) {
      console.error('Error loading pricing rules:', error);
    }
  };

  const calculatePrice = () => {
    const rule = pricingRules.find(r => r.serviceType === quoteRequest.serviceType && r.active);
    if (!rule) return;

    const urgencyMultipliers = {
      standard: 1.0,
      express: 1.3,
      urgent: 1.6
    };

    const basePrice = rule.basePrice;
    const weightCharge = quoteRequest.weight * rule.weightMultiplier;
    const distanceCharge = quoteRequest.distance * rule.distanceMultiplier;
    const urgencyCharge = basePrice * (urgencyMultipliers[quoteRequest.urgency] - 1);
    
    const subtotalBeforeAdjustments = basePrice + weightCharge + distanceCharge + urgencyCharge;
    const fuelSurcharge = subtotalBeforeAdjustments * rule.fuelSurcharge;
    const seasonalAdjustment = subtotalBeforeAdjustments * (rule.seasonalAdjustment - 1);
    
    let volumeDiscount = 0;
    if (quoteRequest.volume >= rule.volumeDiscountThreshold) {
      volumeDiscount = subtotalBeforeAdjustments * rule.volumeDiscountRate;
    }
    
    const subtotal = subtotalBeforeAdjustments + fuelSurcharge + seasonalAdjustment - volumeDiscount;
    const taxes = subtotal * 0.08; // 8% tax rate
    const totalPrice = subtotal + taxes;

    const breakdown = [
      `Base Price (${rule.name}): $${basePrice.toFixed(2)}`,
      `Weight Charge (${quoteRequest.weight} lbs × $${rule.weightMultiplier}): $${weightCharge.toFixed(2)}`,
      `Distance Charge (${quoteRequest.distance} miles × $${rule.distanceMultiplier}): $${distanceCharge.toFixed(2)}`,
      `Urgency Charge (${quoteRequest.urgency}): $${urgencyCharge.toFixed(2)}`,
      `Fuel Surcharge (${(rule.fuelSurcharge * 100).toFixed(1)}%): $${fuelSurcharge.toFixed(2)}`,
      `Seasonal Adjustment: $${seasonalAdjustment.toFixed(2)}`,
      volumeDiscount > 0 ? `Volume Discount (${(rule.volumeDiscountRate * 100).toFixed(1)}%): -$${volumeDiscount.toFixed(2)}` : null,
      `Taxes (8%): $${taxes.toFixed(2)}`
    ].filter(Boolean) as string[];

    setCalculation({
      basePrice,
      weightCharge,
      distanceCharge,
      urgencyCharge,
      fuelSurcharge,
      seasonalAdjustment,
      volumeDiscount,
      subtotal,
      taxes,
      totalPrice,
      breakdown
    });
  };

  const saveQuote = async () => {
    if (!calculation) return;
    
    setLoading(true);
    try {
      const dbApi = new AdvancedDatabaseAPI(user?.email || 'admin@torchlinegroup.com');
      
      const quoteData = {
        ...quoteRequest,
        calculation,
        generatedBy: user?.email || 'system',
        generatedAt: new Date().toISOString(),
        status: 'draft'
      };
      
      await dbApi.createData('automated_quotes', quoteData, ['quote', 'automated', quoteRequest.serviceType]);
      alert('Quote saved successfully!');
    } catch (error) {
      console.error('Error saving quote:', error);
      alert('Error saving quote');
    } finally {
      setLoading(false);
    }
  };

  const updatePricingRule = async (rule: PricingRule) => {
    try {
      const dbApi = new AdvancedDatabaseAPI(user?.email || 'admin@torchlinegroup.com');
      await dbApi.updateData(rule.id, { ...rule, lastUpdated: new Date().toISOString() }, ['pricing', 'rule']);
      
      setPricingRules(prev => prev.map(r => r.id === rule.id ? rule : r));
      setShowRuleModal(false);
      alert('Pricing rule updated successfully!');
    } catch (error) {
      console.error('Error updating pricing rule:', error);
      alert('Error updating pricing rule');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Automated Pricing Engine</h2>
        <div className="flex items-center space-x-2">
          <Calculator className="text-orange-400" size={24} />
          <span className="text-gray-400">Dynamic Pricing System</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800 rounded-lg">
        <div className="flex">
          {['calculator', 'rules', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-4 font-semibold transition-colors capitalize ${
                activeTab === tab
                  ? 'text-orange-400 border-b-2 border-orange-400 bg-slate-750'
                  : 'text-gray-400 hover:text-white hover:bg-slate-750'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quote Input */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-6">Quote Calculator</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Service Type</label>
                <select
                  value={quoteRequest.serviceType}
                  onChange={(e) => setQuoteRequest({ ...quoteRequest, serviceType: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                >
                  <option value="ground">Ground Transportation</option>
                  <option value="air">Air Freight</option>
                  <option value="ocean">Ocean Freight</option>
                  <option value="specialized">Specialized Cargo</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Weight (lbs)</label>
                  <input
                    type="number"
                    value={quoteRequest.weight || ''}
                    onChange={(e) => setQuoteRequest({ ...quoteRequest, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Distance (miles)</label>
                  <input
                    type="number"
                    value={quoteRequest.distance || ''}
                    onChange={(e) => setQuoteRequest({ ...quoteRequest, distance: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Urgency</label>
                  <select
                    value={quoteRequest.urgency}
                    onChange={(e) => setQuoteRequest({ ...quoteRequest, urgency: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                  >
                    <option value="standard">Standard</option>
                    <option value="express">Express (+30%)</option>
                    <option value="urgent">Urgent (+60%)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Volume (cubic ft)</label>
                  <input
                    type="number"
                    value={quoteRequest.volume || ''}
                    onChange={(e) => setQuoteRequest({ ...quoteRequest, volume: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Origin</label>
                  <input
                    type="text"
                    value={quoteRequest.origin}
                    onChange={(e) => setQuoteRequest({ ...quoteRequest, origin: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                    placeholder="City, State"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Destination</label>
                  <input
                    type="text"
                    value={quoteRequest.destination}
                    onChange={(e) => setQuoteRequest({ ...quoteRequest, destination: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                    placeholder="City, State"
                  />
                </div>
              </div>

              <button
                onClick={calculatePrice}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Calculator size={20} />
                <span>Calculate Price</span>
              </button>
            </div>
          </div>

          {/* Price Calculation */}
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-6">Price Breakdown</h3>
            
            {calculation ? (
              <div className="space-y-4">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-center mb-4">
                    <p className="text-gray-400 text-sm">Total Price</p>
                    <p className="text-4xl font-bold text-green-400">${calculation.totalPrice.toFixed(2)}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {calculation.breakdown.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.split(':')[0]}:</span>
                        <span className="text-white">{item.split(':')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={saveQuote}
                    disabled={loading}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Save size={20} />
                    <span>Save Quote</span>
                  </button>
                  
                  <button
                    onClick={calculatePrice}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <RefreshCw size={20} />
                    <span>Recalculate</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calculator size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-400">Enter shipment details to calculate pricing</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Pricing Rules Management</h3>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200">
              Add New Rule
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Rule Name</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Service Type</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Base Price</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Weight Multiplier</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Last Updated</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pricingRules.map((rule) => (
                  <tr key={rule.id} className="border-b border-slate-700 hover:bg-slate-750">
                    <td className="py-3 px-4 text-white font-semibold">{rule.name}</td>
                    <td className="py-3 px-4 text-white capitalize">{rule.serviceType}</td>
                    <td className="py-3 px-4 text-green-400">${rule.basePrice}</td>
                    <td className="py-3 px-4 text-white">${rule.weightMultiplier}/lb</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        rule.active ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-red-500 bg-opacity-20 text-red-400'
                      }`}>
                        {rule.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(rule.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setSelectedRule(rule);
                          setShowRuleModal(true);
                        }}
                        className="text-orange-400 hover:text-orange-300 transition-colors mr-3"
                      >
                        Edit
                      </button>
                      <button className="text-red-400 hover:text-red-300 transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Avg Quote Value</h3>
              <DollarSign className="text-green-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-white">$2,847</p>
            <p className="text-green-400 text-sm mt-1">+12% from last month</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Quote Accuracy</h3>
              <TrendingUp className="text-blue-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-white">94.2%</p>
            <p className="text-blue-400 text-sm mt-1">Within 5% of final price</p>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Processing Time</h3>
              <Settings className="text-purple-400" size={24} />
            </div>
            <p className="text-3xl font-bold text-white">0.3s</p>
            <p className="text-purple-400 text-sm mt-1">Average calculation time</p>
          </div>
        </div>
      )}

      {/* Rule Edit Modal */}
      {showRuleModal && selectedRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Edit Pricing Rule</h3>
              <button
                onClick={() => setShowRuleModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rule Name</label>
                <input
                  type="text"
                  value={selectedRule.name}
                  onChange={(e) => setSelectedRule({ ...selectedRule, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Base Price</label>
                <input
                  type="number"
                  value={selectedRule.basePrice}
                  onChange={(e) => setSelectedRule({ ...selectedRule, basePrice: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Weight Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedRule.weightMultiplier}
                  onChange={(e) => setSelectedRule({ ...selectedRule, weightMultiplier: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Distance Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedRule.distanceMultiplier}
                  onChange={(e) => setSelectedRule({ ...selectedRule, distanceMultiplier: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fuel Surcharge (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={selectedRule.fuelSurcharge * 100}
                  onChange={(e) => setSelectedRule({ ...selectedRule, fuelSurcharge: parseFloat(e.target.value) / 100 })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Volume Discount Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={selectedRule.volumeDiscountRate * 100}
                  onChange={(e) => setSelectedRule({ ...selectedRule, volumeDiscountRate: parseFloat(e.target.value) / 100 })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white"
                />
              </div>
            </div>
            
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => updatePricingRule(selectedRule)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowRuleModal(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomatedPricingEngine;