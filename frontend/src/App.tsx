import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { TraderRegisterPage } from './pages/TraderRegisterPage';
import { ProviderRegisterPage } from './pages/ProviderRegisterPage';

import { SearchCargoPage } from './pages/SearchCargoPage';
import { CargoDetailPage } from './pages/CargoDetailPage';
import { BookingFlowPage } from './pages/BookingFlowPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';

import { TraderDashboardPage } from './pages/TraderDashboardPage';
import { ShipmentTrackingPage } from './pages/ShipmentTrackingPage';

import { ProviderDashboardPage } from './pages/ProviderDashboardPage';
import { MyCargoSpacePage } from './pages/MyCargoSpacePage';
import { ProviderBookingsPage } from './pages/ProviderBookingsPage';
import { ProviderVerificationPage } from './pages/ProviderVerificationPage';

import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProviderApplicationsPage } from './pages/ProviderApplicationsPage';
import { AdminManageCargoPage } from './pages/AdminManageCargoPage';
import { AdminAuditLogsPage } from './pages/AdminAuditLogsPage';

import { ChatPage } from './pages/ChatPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center py-20 text-slate-400 font-semibold">Authenticating session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Sidebar for Authenticated Users (No Top Navbar when logged in) */}
      {user ? (
        <Sidebar isOpen={true} onClose={() => {}} />
      ) : (
        <Navbar />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${user ? 'md:ml-64' : ''}`}>
        <main className="min-h-[calc(100vh-4rem)]">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchCargoPage />} />
            <Route path="/cargo/:id" element={<CargoDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register-trader" element={<TraderRegisterPage />} />
            <Route path="/register-provider" element={<ProviderRegisterPage />} />

            {/* Trader Protected Routes */}
            <Route
              path="/booking/new/:listingId"
              element={
                <ProtectedRoute roles={['TRADER']}>
                  <BookingFlowPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/confirmation"
              element={
                <ProtectedRoute roles={['TRADER']}>
                  <BookingConfirmationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trader/dashboard"
              element={
                <ProtectedRoute roles={['TRADER']}>
                  <TraderDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trader/bookings"
              element={
                <ProtectedRoute roles={['TRADER']}>
                  <TraderDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trader/tracking/:id"
              element={
                <ProtectedRoute roles={['TRADER']}>
                  <ShipmentTrackingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trader/messages"
              element={
                <ProtectedRoute roles={['TRADER', 'PROVIDER', 'ADMIN']}>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trader/payments"
              element={
                <ProtectedRoute roles={['TRADER']}>
                  <TraderDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Provider Protected Routes */}
            <Route
              path="/provider/dashboard"
              element={
                <ProtectedRoute roles={['PROVIDER']}>
                  <ProviderDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/cargo-space"
              element={
                <ProtectedRoute roles={['PROVIDER']}>
                  <MyCargoSpacePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/bookings"
              element={
                <ProtectedRoute roles={['PROVIDER']}>
                  <ProviderBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/messages"
              element={
                <ProtectedRoute roles={['PROVIDER']}>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/verification"
              element={
                <ProtectedRoute roles={['PROVIDER']}>
                  <ProviderVerificationPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <ProviderApplicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/cargo-space"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminManageCargoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminAuditLogsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4">
            Sutrivazhi © 2026 • Verified Digital Logistics Marketplace for Unused Container Capacity
          </div>
        </footer>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
