import React, { useState, useEffect } from 'react';
import { fetchContainerOptimization, sendDirectOffer, OptimizationResultData } from '../services/matchingService';
import { Zap, X, Package, TrendingUp, DollarSign, Send, CheckCircle2 } from 'lucide-react';

interface FillMyContainerModalProps {
  listing: any;
  isOpen: boolean;
  onClose: () => void;
}

export const FillMyContainerModal: React.FC<FillMyContainerModalProps> = ({ listing, isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [optimization, setOptimization] = useState<OptimizationResultData | null>(null);
  const [offeringId, setOfferingId] = useState<string | null>(null);
  const [sentOfferIds, setSentOfferIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && listing) {
      setLoading(true);
      fetchContainerOptimization(listing._id)
        .then((data) => {
          if (data.success) {
            setOptimization(data.optimization);
          }
        })
        .catch((err) => console.error('Failed to run container optimization:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, listing]);

  if (!isOpen || !listing) return null;

  const handleSendOffer = async (requestId: string, reqWeight: number) => {
    setOfferingId(requestId);
    try {
      const offeredPrice = Math.round(reqWeight * listing.pricePerKg);
      const res = await sendDirectOffer(requestId, listing._id, offeredPrice);
      if (res.success) {
        setSentOfferIds((prev) => [...prev, requestId]);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send offer.');
    } finally {
      setOfferingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-yellow-400 text-slate-900 rounded-xl font-bold">
              <Zap className="h-5 w-5 fill-current" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">Fill My Container Optimization</h2>
              <p className="text-xs text-blue-200">
                Container {listing.containerNumber} ({listing.origin} → {listing.destination})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-blue-200 hover:text-white rounded-xl transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="text-center py-12 text-slate-400 font-semibold">
              Running 2D Knapsack Optimization Engine...
            </div>
          ) : !optimization || optimization.recommendedRequests.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl text-center space-y-2">
              <Package className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-800">No matching pending trader cargo requests found</p>
              <p className="text-slate-500 text-xs">
                No active trader inquiries currently match route {listing.origin} → {listing.destination} within remaining container capacity.
              </p>
            </div>
          ) : (
            <>
              {/* Impact Banner */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1">
                  <span className="text-xs font-bold text-emerald-800 uppercase flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span>Projected Container Fill</span>
                  </span>
                  <span className="block text-2xl font-black text-emerald-900">
                    {optimization.projectedWeightUtilization}%
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    Fills {optimization.initialAvailableWeight - optimization.remainingWeightAfter} KG unused capacity
                  </span>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-1">
                  <span className="text-xs font-bold text-blue-800 uppercase flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span>Projected Freight Revenue</span>
                  </span>
                  <span className="block text-2xl font-black text-blue-900">
                    ₹{optimization.projectedRevenue.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-blue-700 font-medium">From recommended trader combination</span>
                </div>
              </div>

              {/* Explanation text */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium leading-relaxed">
                💡 <strong>AI Recommendation:</strong> {optimization.explanationText}
              </div>

              {/* Recommended Trader Consignments List */}
              <div className="space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                  Optimal Trader Consignments ({optimization.recommendedRequests.length})
                </h3>

                <div className="space-y-2">
                  {optimization.recommendedRequests.map((req) => {
                    const isSent = sentOfferIds.includes(req._id);
                    const calcPrice = Math.round(req.weightKg * listing.pricePerKg);

                    return (
                      <div
                        key={req._id}
                        className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:border-blue-300 transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-slate-900 text-sm">{req.traderName}</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md">
                              {req.cargoType}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            <strong className="text-slate-800">{req.weightKg.toLocaleString()} KG</strong> ({req.volumeCbm} CBM) • Target: {new Date(req.targetDepartureDate).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="font-extrabold text-slate-900 text-sm">₹{calcPrice.toLocaleString()}</span>
                          {isSent ? (
                            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs flex items-center space-x-1">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              <span>Offer Sent</span>
                            </span>
                          ) : (
                            <button
                              disabled={offeringId === req._id}
                              onClick={() => handleSendOffer(req._id, req.weightKg)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1 shadow-2xs"
                            >
                              <Send className="h-3.5 w-3.5" />
                              <span>{offeringId === req._id ? 'Sending...' : 'Send Offer'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
