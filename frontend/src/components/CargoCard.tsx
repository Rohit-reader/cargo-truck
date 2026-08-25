import React from 'react';
import { Link } from 'react-router-dom';
import { ICargoListing } from '../types';
import { Badge } from './Badge';
import { CapacityProgressBar } from './CapacityProgressBar';
import { Ship, Truck, Train, Plane, Calendar, Star, ShieldCheck, ArrowRight } from 'lucide-react';

interface CargoCardProps {
  listing: ICargoListing;
}

export const CargoCard: React.FC<CargoCardProps> = ({ listing }) => {
  const getModeIcon = () => {
    switch (listing.transportMode) {
      case 'Sea':
        return <Ship className="h-5 w-5 text-blue-600" />;
      case 'Road':
        return <Truck className="h-5 w-5 text-amber-600" />;
      case 'Rail':
        return <Train className="h-5 w-5 text-emerald-600" />;
      case 'Air':
        return <Plane className="h-5 w-5 text-purple-600" />;
      default:
        return <Truck className="h-5 w-5 text-blue-600" />;
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition duration-200 space-y-4">
      {/* Route & Transport Mode Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">{getModeIcon()}</div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-slate-900">{listing.origin}</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <span className="text-lg font-bold text-slate-900">{listing.destination}</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {listing.transportMode} • {listing.containerType} ({listing.containerNumber})
            </span>
          </div>
        </div>
        <Badge status={listing.status} />
      </div>

      {/* Capacity & Departure Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Provider Info & Pricing */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-800">{listing.providerName}</span>
          {listing.isVerifiedProvider && (
            <span
              className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
              title="Verified Logistics Provider"
            >
              <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              Verified
            </span>
          )}
          <div className="flex items-center text-amber-500 font-bold text-xs ml-1">
            <Star className="h-3.5 w-3.5 fill-current mr-0.5" />
            {listing.providerRating}
          </div>
        </div>

        <div className="flex items-center space-x-4 text-slate-600 text-xs">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>Departure: <strong className="text-slate-800">{formatDate(listing.departureDate)}</strong></span>
          </div>
        </div>
      </div>

      {/* Pricing Footer & Action CTAs */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Freight Rate</span>
          <span className="text-xl font-extrabold text-blue-700">₹{listing.pricePerKg}</span>
          <span className="text-xs text-slate-500 font-medium"> / KG</span>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/cargo/${listing._id}`}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            View Details
          </Link>
          <Link
            to={`/booking/new/${listing._id}`}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
          >
            Book Space
          </Link>
        </div>
      </div>
    </div>
  );
};
