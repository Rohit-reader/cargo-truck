import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ICargoListing, IProviderProfile } from '../types';
import { Badge } from '../components/Badge';
import { CapacityProgressBar } from '../components/CapacityProgressBar';
import { Ship, Calendar, MapPin, ShieldCheck, Star, ArrowRight, MessageSquare, Box } from 'lucide-react';

export const CargoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [listing, setListing] = useState<ICargoListing | null>(null);
  const [provider, setProvider] = useState<IProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/cargo/${id}`);
        if (res.data.success) {
          setListing(res.data.cargoListing);
          setProvider(res.data.provider);
        }
      } catch (err) {
        console.error('Error fetching cargo detail', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-slate-400 font-semibold">Loading container details...</div>;
  }

  if (!listing) {
    return <div className="text-center py-20 text-slate-500 font-semibold">Cargo listing not found.</div>;
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Route Header Banner */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <Ship className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center space-x-3 text-2xl font-extrabold text-slate-900">
                <span>{listing.origin}</span>
                <ArrowRight className="h-6 w-6 text-slate-400" />
                <span>{listing.destination}</span>
              </div>
              <span className="text-sm font-semibold text-slate-500">
                {listing.transportMode} • {listing.containerType} ({listing.containerNumber})
              </span>
            </div>
          </div>
          <Badge status={listing.status} />
        </div>

        {/* Key Info Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold pt-2">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 block">Departure Date</span>
            <span className="text-slate-900 font-bold text-sm">{formatDate(listing.departureDate)}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 block">Estimated Arrival</span>
            <span className="text-slate-900 font-bold text-sm">{formatDate(listing.estimatedArrival)}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 block">Freight Rate / KG</span>
            <span className="text-blue-700 font-extrabold text-sm">₹{listing.pricePerKg}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-400 block">Accepted Cargo</span>
            <span className="text-slate-900 font-bold text-xs truncate block" title={listing.acceptedCargoType}>
              {listing.acceptedCargoType}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Container Capacity & Route Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Capacity Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Box className="h-5 w-5 text-blue-600" />
              <span>Container Capacity Status</span>
            </h3>

            <div className="space-y-4">
              <CapacityProgressBar
                label="Weight Capacity"
                total={listing.totalWeightCapacity}
                available={listing.availableWeight}
                unit="KG"
              />
              <CapacityProgressBar
                label="Volume Capacity"
                total={listing.totalVolumeCapacity}
                available={listing.availableVolume}
                unit="CBM"
              />
            </div>
          </div>

          {/* Pickup & Route Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>Pickup & Transport Logistics</span>
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Pickup Location</span>
                <span className="font-bold text-slate-900 text-right">{listing.pickupLocation}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Container Designation</span>
                <span className="font-bold text-slate-900">{listing.containerNumber}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500 font-medium">Accepted Goods Type</span>
                <span className="font-bold text-slate-900">{listing.acceptedCargoType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Provider Card & Booking CTA */}
        <div className="space-y-6">
          {/* Provider Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-extrabold text-lg">
                {listing.providerName.charAt(0)}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">{listing.providerName}</h4>
                {listing.isVerifiedProvider && (
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                    Verified Provider
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block">Rating</span>
                <span className="font-bold text-amber-600 flex items-center justify-center space-x-1 mt-0.5">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>{listing.providerRating}</span>
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block">Data Quality</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{provider?.dataQualityScore || 90}%</span>
              </div>
            </div>
          </div>

          {/* Pricing Summary & Action */}
          <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-lg space-y-5">
            <div>
              <span className="text-xs text-blue-200 font-semibold block uppercase">Unit Rates</span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-3xl font-extrabold text-white">₹{listing.pricePerKg}</span>
                <span className="text-xs text-blue-200">/ KG</span>
              </div>
              <span className="text-xs text-blue-300 block mt-1">
                Volume Rate: ₹{listing.pricePerCbm} / CBM
              </span>
            </div>

            <div className="space-y-3">
              <Link
                to={`/booking/new/${listing._id}`}
                className="w-full py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm"
              >
                <span>Book Cargo Space</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
