import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ICargoListing } from '../types';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Box, MapPin, CreditCard, AlertCircle } from 'lucide-react';

export const BookingFlowPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState<ICargoListing | null>(null);
  const [loadingListing, setLoadingListing] = useState(true);
  const [step, setStep] = useState(1);

  const [cargoType, setCargoType] = useState('Garments & Handloom Goods');
  const [description, setDescription] = useState('Packed in corrugated export cartons');
  const [weightKg, setWeightKg] = useState<number>(2000);
  const [volumeCbm, setVolumeCbm] = useState<number>(6);
  const [numberOfPackages, setNumberOfPackages] = useState<number>(80);
  const [dimensions, setDimensions] = useState('120x80x100 cm per pallet');

  const [pickupAddress, setPickupAddress] = useState('Plot 45, Guindy Industrial Estate, Chennai 600032');
  const [pickupDate, setPickupDate] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('Handle with care. Protect from moisture.');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/cargo/${listingId}`);
        if (res.data.success) {
          setListing(res.data.cargoListing);
          // Set default pickup date to 1 day before departure
          const dep = new Date(res.data.cargoListing.departureDate);
          dep.setDate(dep.getDate() - 1);
          setPickupDate(dep.toISOString().split('T')[0]);
        }
      } catch (err) {
        console.error('Error fetching listing for booking', err);
      } finally {
        setLoadingListing(false);
      }
    };

    if (listingId) fetchListing();
  }, [listingId]);

  if (loadingListing) {
    return <div className="text-center py-20 text-slate-400 font-semibold">Loading booking details...</div>;
  }

  if (!listing) {
    return <div className="text-center py-20 text-slate-500 font-semibold">Listing not found.</div>;
  }

  // Calculate Pricing
  const baseFreight = Math.round(
    Math.max(weightKg * listing.pricePerKg, volumeCbm * listing.pricePerCbm)
  );
  const platformFee = Math.round(baseFreight * 0.05);
  const taxes = Math.round((baseFreight + platformFee) * 0.18);
  const totalAmount = baseFreight + platformFee + taxes;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (weightKg <= 0 || volumeCbm <= 0) {
        setError('Weight and volume must be greater than zero.');
        return;
      }
      if (weightKg > listing.availableWeight) {
        setError(`Requested weight (${weightKg} KG) exceeds available capacity (${listing.availableWeight} KG).`);
        return;
      }
      if (volumeCbm > listing.availableVolume) {
        setError(`Requested volume (${volumeCbm} CBM) exceeds available capacity (${listing.availableVolume} CBM).`);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!pickupAddress || !pickupDate) {
        setError('Please complete all pickup address and date details.');
        return;
      }
      setStep(3);
    }
  };

  const handleCreateBookingAndPay = async () => {
    setSubmitting(true);
    setError('');

    try {
      // 1. Create Booking (triggers atomic capacity check & reservation)
      const res = await api.post('/bookings', {
        cargoListingId: listing._id,
        cargoDetails: {
          cargoType,
          description,
          weightKg: Number(weightKg),
          volumeCbm: Number(volumeCbm),
          numberOfPackages: Number(numberOfPackages),
          dimensions,
        },
        pickupDetails: {
          pickupAddress,
          pickupDate,
          specialInstructions,
        },
      });

      if (res.data.success) {
        const newBooking = res.data.booking;

        // 2. Perform payment verification
        const payRes = await api.post('/payments/verify', {
          bookingId: newBooking._id,
          paymentMethod: 'Simulated Card Payment',
        });

        if (payRes.data.success) {
          navigate('/booking/confirmation', {
            state: {
              booking: payRes.data.booking,
              payment: payRes.data.payment,
            },
          });
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed. Capacity may have changed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Step Indicator Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h1 className="text-xl font-extrabold text-slate-900">
          Book Space: {listing.origin} → {listing.destination}
        </h1>

        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold pt-2 border-t border-slate-100">
          <div className={`py-2 rounded-lg ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            1. Cargo Details
          </div>
          <div className={`py-2 rounded-lg ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            2. Pickup Info
          </div>
          <div className={`py-2 rounded-lg ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            3. Summary
          </div>
          <div className={`py-2 rounded-lg ${step >= 4 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            4. Payment
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Cargo Details */}
      {step === 1 && (
        <form onSubmit={handleNextStep} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
            <Box className="h-5 w-5 text-blue-600" />
            <span>Step 1: Consignment Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Cargo Goods Type *</label>
              <input
                type="text"
                required
                value={cargoType}
                onChange={(e) => setCargoType(e.target.value)}
                placeholder="e.g. Garments / Textiles"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Package Count *</label>
              <input
                type="number"
                required
                min={1}
                value={numberOfPackages}
                onChange={(e) => setNumberOfPackages(Number(e.target.value))}
                placeholder="80"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Cargo Description *</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Cotton shirts in export grade corrugated boxes"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Requested Weight (KG) * <span className="text-slate-400 font-normal">Max {listing.availableWeight} KG</span>
              </label>
              <input
                type="number"
                required
                min={1}
                max={listing.availableWeight}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Requested Volume (CBM) * <span className="text-slate-400 font-normal">Max {listing.availableVolume} CBM</span>
              </label>
              <input
                type="number"
                required
                min={1}
                max={listing.availableVolume}
                value={volumeCbm}
                onChange={(e) => setVolumeCbm(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Dimensions / Packaging Spec</label>
            <input
              type="text"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="120x80x100 cm"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl transition flex items-center space-x-2 shadow-sm"
            >
              <span>Next: Pickup Info</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Pickup Details */}
      {step === 2 && (
        <form onSubmit={handleNextStep} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Step 2: Pickup & Logistics Information</span>
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Pickup Address *</label>
            <textarea
              required
              rows={3}
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="Enter warehouse / factory address for cargo collection"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Preferred Pickup Date *</label>
            <input
              type="date"
              required
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Special Handling Instructions</label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Fragile, Temperature control, Moisture sensitive"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-900"
            />
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 transition"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl transition flex items-center space-x-2 shadow-sm"
            >
              <span>Next: Price Summary</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 3 & 4: Price Summary & Payment */}
      {step >= 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span>Step 3 & 4: Booking Summary & Payment</span>
          </h2>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Route</span>
              <span className="font-bold text-slate-900">{listing.origin} → {listing.destination}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Reserved Space</span>
              <span className="font-bold text-slate-900">{weightKg} KG / {volumeCbm} CBM</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Logistics Provider</span>
              <span className="font-bold text-slate-900">{listing.providerName}</span>
            </div>
          </div>

          {/* Transparent Price Summary Breakdown */}
          <div className="space-y-2 text-sm border-t border-b border-slate-200 py-4">
            <div className="flex justify-between text-slate-600">
              <span>Base Freight</span>
              <span className="font-bold text-slate-900">₹{baseFreight.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Sutrivazhi Platform Fee (5%)</span>
              <span className="font-bold text-slate-900">₹{platformFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxes & GST (18%)</span>
              <span className="font-bold text-slate-900">₹{taxes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-blue-700 pt-2 border-t border-slate-200">
              <span>Total Payable Amount</span>
              <span className="text-xl">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-800 space-y-1">
            <span className="font-bold block">Simulated Payment Prototype</span>
            <p>
              Clicking "Proceed to Payment" will validate container capacity on backend, process simulated payment, and issue booking confirmation.
            </p>
          </div>

          <div className="pt-2 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 transition"
            >
              Back
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleCreateBookingAndPay}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl transition shadow-md flex items-center space-x-2"
            >
              <span>{submitting ? 'Processing Payment...' : 'Proceed to Payment & Confirm'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
