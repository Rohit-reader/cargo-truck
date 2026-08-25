import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Ship,
  Search,
  PackageCheck,
  Truck,
  MessageSquare,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  Users,
  LogOut,
  UserCheck,
  Boxes,
  FileSpreadsheet,
  Activity,
  ChevronRight,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  const traderNavItems = [
    { label: 'Dashboard', path: '/trader/dashboard', icon: LayoutDashboard },
    { label: 'Find Cargo', path: '/search', icon: Search },
    { label: 'My Bookings', path: '/trader/bookings', icon: PackageCheck },
    { label: 'Messages', path: '/trader/messages', icon: MessageSquare },
    { label: 'Payments', path: '/trader/payments', icon: CreditCard },
  ];

  const providerNavItems = [
    { label: 'Dashboard', path: '/provider/dashboard', icon: LayoutDashboard },
    { label: 'My Cargo Space', path: '/provider/cargo-space', icon: Boxes },
    { label: 'Bookings', path: '/provider/bookings', icon: PackageCheck },
    { label: 'Messages', path: '/provider/messages', icon: MessageSquare },
    { label: 'Verification', path: '/provider/verification', icon: ShieldCheck },
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Provider Applications', path: '/admin/applications', icon: UserCheck },
    { label: 'Cargo Space', path: '/admin/cargo-space', icon: Boxes },
    { label: 'Analytics', path: '/admin/analytics', icon: Activity },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileSpreadsheet },
  ];

  let navItems = traderNavItems;
  if (user.role === 'PROVIDER') navItems = providerNavItems;
  if (user.role === 'ADMIN') navItems = adminNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group" onClick={onClose}>
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-sm group-hover:bg-blue-700 transition">
              <Ship className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Sutrivazhi
              </span>
              <span className="block text-[9px] uppercase font-bold text-blue-600 -mt-1 tracking-wider">
                Logistics Portal
              </span>
            </div>
          </Link>

          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Role Badge */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Logged in as</span>
          <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
            {user.role}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  active
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4 w-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {active && <ChevronRight className="h-3.5 w-3.5 text-blue-600" />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout at Bottom */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 mr-2">
              <span className="block text-xs font-bold text-slate-900 truncate">{user.fullName}</span>
              <span className="block text-[11px] text-slate-400 truncate">{user.email}</span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
