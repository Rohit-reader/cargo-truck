import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CargoCard } from '../components/CargoCard';
import { FillMyContainerModal } from '../components/FillMyContainerModal';
import { Boxes, Plus, X, Zap } from 'lucide-react';

export const MyCargoSpacePage: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [optimizingListing, setOptimizingListing] = useState<any | null>(null);

  // Form State for publishing new cargo space
  const [formData, setFormData] = useState({
    transportMode: 'Sea',
    containerType: '20 FT',
    containerNumber: '',
    origin: '',
    destination: '',
    departureDate: '',
    estimatedArrival: '',
    pickupLocation: '',
    totalWeightCapacity: 20000,
    availableWeight: 20000,
    totalVolumeCapacity: 38,
    availableVolume: 38,
    pricePerKg: 45,
    pricePerCbm: 1200,
    acceptedCargoType: 'General Cargo, Textiles, Engineering Goods',
  });

  const fetchListings = async () => {
    try {
      const res = await api.get('/providers/listings');
      if (res.data.success) {
        setListings(res.data.listings);
      }
    } catch (err) {
      console.error('Failed to load listings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/cargo', formData);
      if (res.data.success) {
        setShowCreateModal(false);
        fetchListings();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to publish cargo space.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Boxes className="h-6 w-6 text-blue-600" />
            <span>My Cargo Space Listings</span>
          </h1>
          <p className="text-slate-500 text-sm">
            Publish container capacity and run ⚡ Fill My Container optimization to maximize container revenue
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1.5 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Publish Cargo Space</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 font-semibold">Loading cargo listings...</div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <p className="text-slate-500 text-sm font-medium">You haven't published any container space yet.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
          >
            Publish Your First Cargo Space
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="space-y-3 flex flex-col justify-between">
              {/* Fill My Container Optimization CTA */}
              <button
                onClick={() => setOptimizingListing(listing)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-extrabold rounded-2xl text-xs transition flex items-center justify-center space-x-2 shadow-sm"
              >
                <Zap className="h-4 w-4 text-yellow-400 fill-current" />
                <span>⚡ Fill My Container Optimization</span>
              </button>

              <CargoCard listing={listing} />
            </div>
          ))}
        </div>
      )}

      {/* Fill My Container Optimization Modal */}
      {optimizingListing && (
        <FillMyContainerModal
          listing={optimizingListing}
          isOpen={!!optimizingListing}
          onClose={() => setOptimizingListing(null)}
        />
      )}

      {/* Publish Cargo Space Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-lg font-extrabold text-slate-900">Publish New Cargo Space</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transport Mode</label>
                  <select
                    value={formData.transportMode}
                    onChange={(e) => setFormData({ ...formData, transportMode: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="Sea">Sea</option>
                    <option value="Road">Road</option>
                    <option value="Rail">Rail</option>
                    <option value="Air">Air</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Container Number / Vehicle ID</label>
                  <input
                    type="text"
                    required
                    placeholder="MSCU-902144-8"
                    value={formData.containerNumber}
                    onChange={(e) => setFormData({ ...formData, containerNumber: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Origin City/Port</label>
                  <input
                    type="text"
                    required
                    placeholder="Chennai Port"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination City/Port</label>
                  <input
                    type="text"
                    required
                    placeholder="Dubai Jebel Ali"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Departure Date</label>
                  <input
                    type="date"
                    required
                    value={formData.departureDate}
                    onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Arrival Date</label>
                  <input
                    type="date"
                    required
                    value={formData.estimatedArrival}
                    onChange={(e) => setFormData({ ...formData, estimatedArrival: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Weight Capacity (KG)</label>
                  <input
                    type="number"
                    required
                    value={formData.totalWeightCapacity}
                    onChange={(e) => setFormData({ ...formData, totalWeightCapacity: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Volume Capacity (CBM)</label>
                  <input
                    type="number"
                    required
                    value={formData.totalVolumeCapacity}
                    onChange={(e) => setFormData({ ...formData, totalVolumeCapacity: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Freight Rate per KG (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerKg}
                    onChange={(e) => setFormData({ ...formData, pricePerKg: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Freight Rate per CBM (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerCbm}
                    onChange={(e) => setFormData({ ...formData, pricePerCbm: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pickup Facility Address</label>
                <input
                  type="text"
                  required
                  placeholder="Container Freight Station Gate 4, Chennai"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition mt-2"
              >
                Publish Space & Open for Bookings
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
