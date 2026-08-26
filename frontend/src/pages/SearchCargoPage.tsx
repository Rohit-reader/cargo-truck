import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { runIntelligentMatch, MatchResultItem } from '../services/matchingService';
import { CargoCard } from '../components/CargoCard';
import { ExplainableRecommendationBadge } from '../components/ExplainableRecommendationBadge';
import { Search, Filter, Sparkles, MapPin, Calendar, Scale, Layers } from 'lucide-react';

export const SearchCargoPage: React.FC = () => {
  const [useIntelligentMatcher, setUseIntelligentMatcher] = useState(true);

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [transportMode, setTransportMode] = useState('All');
  const [departureDate, setDepartureDate] = useState('');
  const [minWeight, setMinWeight] = useState('1000');
  const [minVolume, setMinVolume] = useState('4');
  const [sortBy, setSortBy] = useState('match');

  const [listings, setListings] = useState<any[]>([]);
  const [matchedResults, setMatchedResults] = useState<MatchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      if (useIntelligentMatcher) {
        const res = await runIntelligentMatch({
          origin,
          destination,
          transportMode,
          departureDate,
          reqWeight: Number(minWeight) || 1000,
          reqVolume: Number(minVolume) || 4,
        });

        if (res.success) {
          setMatchedResults(res.matchResults);
        }
      } else {
        const params = new URLSearchParams();
        if (origin) params.append('origin', origin);
        if (destination) params.append('destination', destination);
        if (transportMode !== 'All') params.append('transportMode', transportMode);
        if (departureDate) params.append('departureDate', departureDate);
        if (minWeight) params.append('minWeight', minWeight);
        if (minVolume) params.append('minVolume', minVolume);
        if (sortBy) params.append('sortBy', sortBy);

        const res = await api.get(`/cargo?${params.toString()}`);
        if (res.data.success) {
          setListings(res.data.cargoListings);
        }
      }
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [useIntelligentMatcher]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Search className="h-7 w-7 text-blue-600" />
            <span>Discover Unused Container Space</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Book partial CBM or KG capacity from verified logistics providers
          </p>
        </div>

        {/* AI Intelligent Matcher Mode Toggle */}
        <div className="bg-slate-200/70 p-1.5 rounded-2xl flex items-center space-x-1 self-start md:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => setUseIntelligentMatcher(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              useIntelligentMatcher
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Intelligent Matcher</span>
          </button>
          <button
            type="button"
            onClick={() => setUseIntelligentMatcher(false)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              !useIntelligentMatcher
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Standard Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1 flex items-center space-x-1">
              <MapPin className="h-3.5 w-3.5 text-blue-600" />
              <span>Origin</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Chennai"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1 flex items-center space-x-1">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <span>Destination</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Dubai"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Transport Mode</label>
            <select
              value={transportMode}
              onChange={(e) => setTransportMode(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            >
              <option value="All">All Modes</option>
              <option value="Sea">Sea Container</option>
              <option value="Road">Road Truck</option>
              <option value="Rail">Rail Freight</option>
              <option value="Air">Air Cargo</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1 flex items-center space-x-1">
              <Scale className="h-3.5 w-3.5 text-amber-600" />
              <span>Required Weight (KG)</span>
            </label>
            <input
              type="number"
              value={minWeight}
              onChange={(e) => setMinWeight(e.target.value)}
              placeholder="1000"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1 flex items-center space-x-1">
              <Layers className="h-3.5 w-3.5 text-purple-600" />
              <span>Required Volume (CBM)</span>
            </label>
            <input
              type="number"
              value={minVolume}
              onChange={(e) => setMinVolume(e.target.value)}
              placeholder="4"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-xs transition flex items-center justify-center space-x-2 text-sm"
            >
              <Search className="h-4 w-4" />
              <span>{loading ? 'Matching...' : 'Find Space'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
          <span>
            {useIntelligentMatcher
              ? `AI Ranked Results (${matchedResults.length} Matched Containers)`
              : `Available Capacity (${listings.length} Listings)`}
          </span>

          {!useIntelligentMatcher && (
            <div className="flex items-center space-x-2">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  handleSearch();
                }}
                className="bg-white border border-slate-200 rounded-lg text-slate-800 text-xs py-1 px-2 font-semibold"
              >
                <option value="departure">Earliest Departure</option>
                <option value="price">Lowest Freight Rate</option>
                <option value="rating">Highest Provider Rating</option>
                <option value="availableSpace">Most Available Space</option>
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400 font-semibold">
            {useIntelligentMatcher ? 'Evaluating container capacity & generating AI recommendations...' : 'Searching cargo space...'}
          </div>
        ) : useIntelligentMatcher ? (
          matchedResults.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 max-w-md mx-auto">
              No matching container space found. Try lowering your required weight/volume or changing route filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedResults.map((result) => (
                <div key={result.listing._id} className="space-y-3 flex flex-col justify-between">
                  <ExplainableRecommendationBadge
                    matchScore={result.matchScore}
                    recommendationBadge={result.recommendationBadge}
                    explanations={result.explanations}
                  />
                  <CargoCard listing={result.listing} />
                </div>
              ))}
            </div>
          )
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 max-w-md mx-auto">
            No cargo listings match your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <CargoCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
