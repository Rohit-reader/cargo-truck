import React from 'react';
import { Link } from 'react-router-dom';
import { Ship, Truck, Train, Plane, ShieldCheck, Search, ArrowRight, BarChart3, Clock, Lock, CheckCircle2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-900 to-slate-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-xl relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <span className="inline-flex items-center space-x-2 bg-blue-800/80 text-blue-200 px-4 py-1.5 rounded-full text-xs font-semibold border border-blue-700/50 backdrop-blur-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Sutrivazhi — Verified Digital Logistics Marketplace</span>
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Find Space. <span className="text-blue-400">Ship Smarter.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Book unused cargo capacity from verified logistics providers. Small consignments should not require booking an entire container.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              to="/search"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition duration-200 flex items-center justify-center space-x-2 text-base"
            >
              <Search className="h-5 w-5" />
              <span>Find Cargo Space</span>
            </Link>
            <Link
              to="/register-provider"
              className="px-8 py-4 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-700 transition duration-200 flex items-center justify-center space-x-2 text-base"
            >
              <span>Become a Logistics Provider</span>
              <ArrowRight className="h-5 w-5 text-slate-400" />
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-blue-800/60 max-w-4xl mx-auto">
            <div>
              <span className="block text-3xl font-extrabold text-white">100%</span>
              <span className="text-xs text-blue-200 font-medium">Verified Providers</span>
            </div>
            <div>
              <span className="block text-3xl font-extrabold text-blue-400">45%</span>
              <span className="text-xs text-blue-200 font-medium">Avg. Cost Reduction</span>
            </div>
            <div>
              <span className="block text-3xl font-extrabold text-white">5,000+</span>
              <span className="text-xs text-blue-200 font-medium">CBM Capacity Listed</span>
            </div>
            <div>
              <span className="block text-3xl font-extrabold text-emerald-400">Real-Time</span>
              <span className="text-xs text-blue-200 font-medium">Capacity Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900">How Sutrivazhi Works</h2>
          <p className="text-slate-600 mt-2 text-base">
            Connecting small exporters and importers with partially filled container capacity in 4 easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Search Available Space</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Enter your origin, destination, required weight (KG) or volume (CBM), and departure dates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Compare Containers</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              View transparent pricing per KG/CBM, container capacity utilization, departure timelines, and provider ratings.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Instant Reserve & Pay</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Reserve exact capacity with atomic overbooking protection and complete secure payment.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Chat & Track</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Communicate directly with your logistics provider in real-time and track your shipment timeline to delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Available Transport Modes */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900">Supported Transport Modes</h2>
            <p className="text-slate-600 mt-2 text-base">
              Multimodal logistics coverage across ocean freight, rail containers, road haulage, and air cargo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit">
                <Ship className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Sea Freight</h3>
              <p className="text-slate-600 text-sm">
                20 FT, 40 FT & High Cube LCL container sharing across major international sea routes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
                <Train className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Rail Transport</h3>
              <p className="text-slate-600 text-sm">
                Inland Container Depot (ICD) rail wagon space sharing for long-distance domestic cargo.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
                <Truck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Road Haulage</h3>
              <p className="text-slate-600 text-sm">
                Intercity container truck space matching for partial truckload (PTL) consignments.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit">
                <Plane className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Air Cargo</h3>
              <p className="text-slate-600 text-sm">
                Time-sensitive air freight capacity sharing for high-value priority shipments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-3xl font-extrabold">Ready to ship your cargo?</h2>
            <p className="text-blue-100 text-base">
              Search available cargo space on popular routes including Chennai → Dubai, Chennai → Singapore, Chennai → Colombo, and Chennai → Mumbai.
            </p>
          </div>
          <Link
            to="/search"
            className="px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 font-extrabold rounded-xl shadow-md transition text-base whitespace-nowrap"
          >
            Explore Available Cargo
          </Link>
        </div>
      </section>
    </div>
  );
};
