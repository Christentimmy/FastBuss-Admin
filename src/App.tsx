import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './components/auth/SplashScreen';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FleetManagement from './pages/FleetManagement';
import DriversManagement from './pages/DriversManagement';
import RoutesManagement from './pages/RoutesManagement';
import ScheduleManagement from './pages/ScheduleManagement';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import CompaniesManagement from './pages/CompaniesManagement';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AppInitializer from './components/auth/AppInitializer';
import { authService } from './services/authService';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = authService.getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Layout component for authenticated routes
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-dark-blue to-dark">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const App = () => {
  return (
    <Router>
      <AppInitializer />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />

          {/* Authenticated routes */}
          <Route path="/dashboard" element={
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          } />
          <Route path="/fleet" element={
            <AuthenticatedLayout>
              <FleetManagement />
            </AuthenticatedLayout>
          } />
          <Route path="/drivers" element={
            <AuthenticatedLayout>
              <DriversManagement />
            </AuthenticatedLayout>
          } />
          <Route path="/routes" element={
            <AuthenticatedLayout>
              <RoutesManagement />
            </AuthenticatedLayout>
          } />
          <Route path="/schedule" element={
            <AuthenticatedLayout>
              <ScheduleManagement />
            </AuthenticatedLayout>
          } />
          <Route path="/analytics" element={
            <AuthenticatedLayout>
              <Analytics />
            </AuthenticatedLayout>
          } />
          <Route path="/settings" element={
            <AuthenticatedLayout>
              <Settings />
            </AuthenticatedLayout>
          } />
          <Route path="/notifications" element={
            <AuthenticatedLayout>
              <Notifications />
            </AuthenticatedLayout>
          } />
          <Route path="/companies" element={
            <AuthenticatedLayout>
              <CompaniesManagement />
            </AuthenticatedLayout>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

export default App;