import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { ICargoListing, TransportMode } from '../types';
import { CargoCard } from '../components/CargoCard';
import { Search, Filter, ArrowUpDown, SlidersHorizontal, RefreshCw, Layers } from 'lucide-react';

export const SearchCargoPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [origin, setOrigin] = useState(searchParams.get('origin') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [transportMode, setTransportMode] = useState(searchParams.get('transportMode') || 'All');
  const [departureDate, setDepartureDate] = useState(searchParams.get('departureDate') || '');
  const [minWeight, setMinWeight] = useState(searchParams.get('minWeight') || '');
  const [minVolume, setMinVolume] = useState(searchParams.get('minVolume') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'departure');

  const [cargoListings, setCargoListings] = useState<ICargoListing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCargo = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (origin) params.origin = origin;
      if (destination) params.destination = destination;
      if (transportMode && transportMode !== 'All') params.transportMode = transportMode;
      if (departureDate) params.departureDate = departureDate;
      if (minWeight) params.minWeight = minWeight;
      if (minVolume) params.minVolume = minVolume;
      if (sortBy) params.sortBy = sortBy;

      const res = await api.get('/cargo', { params });
      if (res.data.success) {
        setCargoListings(res.data.cargoListings);
      }
    } catch (err) {
      console.error('Failed to fetch cargo listings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCargo();
  }, [sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCargo();
  };

  const handleReset = () => {
    setOrigin('');
    setDestination('');
    setTransportMode('All');
    setDepartureDate('');
    setMinWeight('');
    setMinVolume('');
    setSortBy('departure');
    fetchCargo();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900">Find Available Cargo Space</h1>
        <p className="text-slate-500 text-sm">
          Discover partially filled container capacity from verified logistics providers across ocean, rail, and road.
        </p>
      </div>

      {/* Large Search Panel */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">From (Origin)</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Chennai"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">To (Destination)</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Dubai"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Transport Mode</label>
            <select
              value={transportMode}
              onChange={(e) => setTransportMode(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
            >
              <option value="All">All Modes</option>
              <option value="Sea">Sea Freight</option>
              <option value="Rail">Rail Transport</option>
              <option value="Road">Road Haulage</option>
              <option value="Air">Air Cargo</option>
              <option value="Multimodal">Multimodal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Weight Req. (KG)</label>
            <input
              type="number"
              value={minWeight}
              onChange={(e) => setMinWeight(e.target.value)}
              placeholder="e.g. 2000"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Volume Req. (CBM)</label>
            <input
              type="number"
              value={minVolume}
              onChange={(e) => setMinVolume(e.target.value)}
              placeholder="e.g. 6"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 text-sm"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-2 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-xl transition"
              title="Reset Search Filters"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Results Header & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <span className="text-sm font-bold text-slate-800">
          Showing <span className="text-blue-600 font-extrabold">{cargoListings.length}</span> Available Containers
        </span>

        <div className="flex items-center space-x-2">
          <ArrowUpDown className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-bold uppercase text-slate-500">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 bg-white"
          >
            <option value="departure">Earliest Departure</option>
            <option value="price">Lowest Freight Price</option>
            <option value="rating">Highest Rated Provider</option>
            <option value="availableSpace">Most Available Space</option>
          </select>
        </div>
      </div>

      {/* Cargo Cards Grid / Empty State */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 font-semibold text-sm">
          Searching for available cargo space...
        </div>
      ) : cargoListings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No cargo space found</h3>
          <p className="text-slate-500 text-sm">
            Try changing your origin, destination, departure date or cargo weight/volume requirements.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition"
          >
            Modify Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {cargoListings.map((listing) => (
            <CargoCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};
