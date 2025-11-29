import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { AdvancedDatabaseAPI } from "../services/advancedDatabaseApi";
import { useAuth } from "../context/AuthContext";

interface QuoteApprovalWorkflowProps {
  quoteId: string;
  quoteData: any;
  onApprovalChange: () => void;
}

const QuoteApprovalWorkflow: React.FC<QuoteApprovalWorkflowProps> = ({ quoteId, quoteData, onApprovalChange }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [priceCalculation, setPriceCalculation] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    calculatePrice();
  }, [quoteData]);

  const calculatePrice = async () => {
    const dbApi = new AdvancedDatabaseAPI(user?.email || "admin@torchlinegroup.com");
    const calculation = await dbApi.calculatePrice(quoteData.service, quoteData.serviceDetails || {});
    setPriceCalculation(calculation);
  };

  const handleApprove = async () => {
    if (!priceCalculation) return;
    
    setLoading(true);
    const dbApi = new AdvancedDatabaseAPI(user?.email || "admin@torchlinegroup.com");
    const response = await dbApi.approveQuote(quoteId, user?.email || "admin@torchlinegroup.com", priceCalculation);
    
    if (response.success) {
      onApprovalChange();
    }
    setLoading(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    
    setLoading(true);
    const dbApi = new AdvancedDatabaseAPI(user?.email || "admin@torchlinegroup.com");
    const response = await dbApi.rejectQuote(quoteId, user?.email || "admin@torchlinegroup.com", rejectionReason);
    
    if (response.success) {
      setShowRejectModal(false);
      onApprovalChange();
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-700 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">Quote Approval Workflow</h3>
      
      {priceCalculation && (
        <div className="mb-6">
          <div className="bg-slate-600 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Base Price:</span>
              <span className="text-white font-semibold">${priceCalculation.basePrice.toFixed(2)}</span>
            </div>
            
            {priceCalculation.additionalFees.map((fee: any, index: number) => (
              <div key={index} className="flex items-center justify-between mb-2">
                <span className="text-gray-300">{fee.name}:</span>
                <span className="text-orange-400">+${fee.amount.toFixed(2)}</span>
              </div>
            ))}
            
            {priceCalculation.discounts.map((discount: any, index: number) => (
              <div key={index} className="flex items-center justify-between mb-2">
                <span className="text-gray-300">{discount.name}:</span>
                <span className="text-green-400">-${discount.amount.toFixed(2)}</span>
              </div>
            ))}
            
            <div className="border-t border-slate-500 mt-3 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">Total Price:</span>
                <span className="text-2xl font-bold text-white">${priceCalculation.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {quoteData.status === "pending" && (
        <div className="flex space-x-4">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <CheckCircle size={20} />
            <span>Approve Quote</span>
          </button>
          
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <XCircle size={20} />
            <span>Reject Quote</span>
          </button>
        </div>
      )}

      {quoteData.status === "approved" && (
        <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-lg flex items-center space-x-2">
          <CheckCircle size={20} />
          <span>Quote Approved</span>
        </div>
      )}

      {quoteData.status === "rejected" && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <XCircle size={20} />
            <span>Quote Rejected</span>
          </div>
          {quoteData.rejectionReason && (
            <p className="text-sm text-gray-300">Reason: {quoteData.rejectionReason}</p>
          )}
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Reject Quote</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-orange-400 text-white resize-none mb-4"
              rows={4}
            />
            <div className="flex space-x-4">
              <button
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
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

export default QuoteApprovalWorkflow;