import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ship, Menu, Search, LogOut, User } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Sidebar toggle button (if logged in) or Brand Logo */}
          <div className="flex items-center space-x-3">
            {user && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition focus:outline-none"
                title="Toggle Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-xs group-hover:bg-blue-700 transition">
                <Ship className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Sutrivazhi
                </span>
                <span className="block text-[10px] uppercase font-semibold text-slate-400 -mt-1 tracking-wider">
                  Cargo Marketplace
                </span>
              </div>
            </Link>
          </div>

          {/* Public Top Nav Links (When logged out) */}
          {!user && (
            <nav className="hidden md:flex items-center space-x-2">
              <Link
                to="/search"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition flex items-center space-x-1.5 ${
                  isActive('/search') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Search className="h-4 w-4" />
                <span>Find Cargo Space</span>
              </Link>
              <Link
                to="/register-trader"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                  isActive('/register-trader') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Trader Registration
              </Link>
              <Link
                to="/register-provider"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                  isActive('/register-provider') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Provider Onboarding
              </Link>
            </nav>
          )}

          {/* User Section (Right) */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <span className="block text-sm font-bold text-slate-900">{user.fullName}</span>
                  <span className="block text-[10px] font-extrabold uppercase text-blue-600">{user.role}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register-trader"
                  className="px-4.5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
