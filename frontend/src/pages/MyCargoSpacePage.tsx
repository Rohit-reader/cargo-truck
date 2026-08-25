import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ICargoListing, TransportMode, ContainerType } from '../types';
import { Badge } from '../components/Badge';
import { CapacityProgressBar } from '../components/CapacityProgressBar';
import { Plus, Boxes, X, AlertCircle } from 'lucide-react';

export const MyCargoSpacePage: React.FC = () => {
  const [listings, setListings] = useState<ICargoListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    transportMode: 'Sea' as TransportMode,
    containerType: '20 FT' as ContainerType,
    containerNumber: '',
    origin: '',
    destination: '',
    departureDate: '',
    estimatedArrival: '',
    pickupLocation: '',
    totalWeightCapacity: 18000,
    availableWeight: 18000,
    totalVolumeCapacity: 38,
    availableVolume: 38,
    pricePerKg: 45,
    pricePerCbm: 1200,
    acceptedCargoType: 'General Goods, Textiles, Machinery Parts',
  });

  const fetchMyListings = async () => {
    try {
      const res = await api.get('/cargo');
      if (res.data.success) {
        setListings(res.data.cargoListings);
      }
    } catch (err) {
      console.error('Error loading cargo space', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes('Capacity') || name.includes('Weight') || name.includes('Volume') || name.includes('price') || name.includes('Price')
        ? Number(value)
        : value,
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/cargo', formData);
      if (res.data.success) {
        setShowModal(false);
        fetchMyListings();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to publish cargo capacity.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Boxes className="h-6 w-6 text-blue-600" />
            <span>My Published Cargo Space</span>
          </h1>
          <p className="text-slate-500 text-sm">
            Manage available container capacity across your logistics routes
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-sm transition flex items-center space-x-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>Publish Available Space</span>
        </button>
      </div>

      {/* Cargo Space Table / List */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 font-semibold">Loading cargo listings...</div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <Boxes className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Cargo Space Listed</h3>
          <p className="text-slate-500 text-sm">Publish your first partially filled container to start receiving bookings.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl"
          >
            Publish Cargo Space
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    {listing.origin} → {listing.destination}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    {listing.transportMode} • {listing.containerType} ({listing.containerNumber})
                  </span>
                </div>
                <Badge status={listing.status} />
              </div>

              <div className="space-y-3">
                <CapacityProgressBar
                  label="Weight"
                  total={listing.totalWeightCapacity}
                  available={listing.availableWeight}
                  unit="KG"
                />
                <CapacityProgressBar
                  label="Volume"
                  total={listing.totalVolumeCapacity}
                  available={listing.availableVolume}
                  unit="CBM"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-600">
                <span>Freight Rate: <strong className="text-blue-700 font-extrabold text-sm">₹{listing.pricePerKg} / KG</strong></span>
                <span>Departs: <strong className="text-slate-800">{new Date(listing.departureDate).toLocaleDateString('en-GB')}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating New Cargo Space */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-900">Publish Available Cargo Capacity</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Transport Mode *</label>
                  <select
                    name="transportMode"
                    value={formData.transportMode}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    <option value="Sea">Sea Freight</option>
                    <option value="Road">Road Haulage</option>
                    <option value="Rail">Rail Transport</option>
                    <option value="Air">Air Cargo</option>
                    <option value="Multimodal">Multimodal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Container Type *</label>
                  <select
                    name="containerType"
                    value={formData.containerType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    <option value="20 FT">20 FT Container</option>
                    <option value="40 FT">40 FT Container</option>
                    <option value="40 FT High Cube">40 FT High Cube</option>
                    <option value="Other">Other Truck / Trailer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Container Number *</label>
                  <input
                    type="text"
                    name="containerNumber"
                    required
                    value={formData.containerNumber}
                    onChange={handleChange}
                    placeholder="MSCU-902144-8"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Origin *</label>
                  <input
                    type="text"
                    name="origin"
                    required
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="Chennai"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Destination *</label>
                  <input
                    type="text"
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Dubai"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Departure Date *</label>
                  <input
                    type="date"
                    name="departureDate"
                    required
                    value={formData.departureDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Estimated Arrival *</label>
                  <input
                    type="date"
                    name="estimatedArrival"
                    required
                    value={formData.estimatedArrival}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Pickup Location / Freight Station *</label>
                <input
                  type="text"
                  name="pickupLocation"
                  required
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  placeholder="Chennai Port CFS Gate 4"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Available Weight (KG) *</label>
                  <input
                    type="number"
                    name="availableWeight"
                    required
                    min={1}
                    value={formData.availableWeight}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Available Volume (CBM) *</label>
                  <input
                    type="number"
                    name="availableVolume"
                    required
                    min={1}
                    value={formData.availableVolume}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Freight Rate per KG (₹) *</label>
                  <input
                    type="number"
                    name="pricePerKg"
                    required
                    min={1}
                    value={formData.pricePerKg}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-bold text-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Freight Rate per CBM (₹) *</label>
                  <input
                    type="number"
                    name="pricePerCbm"
                    required
                    min={1}
                    value={formData.pricePerCbm}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-bold text-blue-700"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-sm rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-sm"
                >
                  {submitting ? 'Publishing...' : 'Publish Container Space'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
