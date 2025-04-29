import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import FleetManagement from './pages/FleetManagement';
import DriversManagement from './pages/DriversManagement';
import RoutesManagement from './pages/RoutesManagement';
import ScheduleManagement from './pages/ScheduleManagement';
import MaintenanceManagement from './pages/MaintenanceManagement';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import CompaniesManagement from './pages/CompaniesManagement';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-dark-blue to-dark">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/fleet" element={<FleetManagement />} />
                <Route path="/drivers" element={<DriversManagement />} />
                <Route path="/routes" element={<RoutesManagement />} />
                <Route path="/schedule" element={<ScheduleManagement />} />
                <Route path="/maintenance" element={<MaintenanceManagement />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/companies" element={<CompaniesManagement />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;