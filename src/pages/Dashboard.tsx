import React from 'react';
import { motion } from 'framer-motion';
import { Bus, Users, Route as RouteIcon, Fuel, AlertCircle } from 'lucide-react';
import { 
  buses, 
  drivers,
  routes,
  analyticsData
} from '../data/mockData';

// Components
import StatCard from '../components/dashboard/StatCard';
import BusStatusCard from '../components/dashboard/BusStatusCard';
import ActiveBusMap from '../components/dashboard/ActiveBusMap';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import DriverList from '../components/dashboard/DriverList';

const Dashboard = () => {
  // Calculate statistics
  const activeBuses = buses.filter(bus => bus.status === 'active').length;
  const activeDrivers = drivers.filter(driver => driver.status === 'on-duty').length;
  const activeRoutes = routes.filter(route => route.status === 'active').length;
  
  // Calculate total passengers currently being served
  const totalCurrentPassengers = buses.reduce((sum, bus) => sum + bus.currentPassengers, 0);
  
  // Calculate average fuel level of active buses
  const activeBusesData = buses.filter(bus => bus.status === 'active');
  const avgFuelLevel = activeBusesData.length > 0 
    ? Math.round(activeBusesData.reduce((sum, bus) => sum + bus.fuelLevel, 0) / activeBusesData.length) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="text-sm text-gray-400">
          <span className="font-medium text-white">Today:</span> {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Active Buses"
          value={activeBuses}
          change={{ value: 5, isPositive: true }}
          icon={Bus}
          iconColor="text-primary-400"
          iconBgColor="bg-primary-900/60"
          metric={`of ${buses.length}`}
        />
        
        <StatCard
          title="Active Drivers"
          value={activeDrivers}
          change={{ value: 2, isPositive: true }}
          icon={Users}
          iconColor="text-secondary-400"
          iconBgColor="bg-secondary-900/60"
          metric={`of ${drivers.length}`}
        />
        
        <StatCard
          title="Active Routes"
          value={activeRoutes}
          change={{ value: 0, isPositive: true }}
          icon={RouteIcon}
          iconColor="text-accent-400"
          iconBgColor="bg-accent-900/60"
          metric={`of ${routes.length}`}
        />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ActiveBusMap buses={buses} />
        </div>
        
        <div>
          <AnalyticsChart data={analyticsData} />
        </div>
      </div>
      
      {/* Secondary Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            <StatCard
              title="Total Passengers"
              value={totalCurrentPassengers}
              change={{ value: 8, isPositive: true }}
              icon={Users}
              iconColor="text-success-400"
              iconBgColor="bg-success-900/60"
              metric="passengers"
            />
            
            <StatCard
              title="Average Fuel Level"
              value={avgFuelLevel}
              change={{ value: 3, isPositive: false }}
              icon={Fuel}
              iconColor="text-warning-400"
              iconBgColor="bg-warning-900/60"
              metric="%"
            />
          </div>
          
          <DriverList drivers={drivers} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {buses
                .filter(bus => bus.status === 'active')
                .slice(0, 2)
                .map(bus => (
                  <BusStatusCard key={bus.id} bus={bus} />
                ))
              }
            </div>
          </div>
        </div>
      </div>
      
      {/* Alert Section */}
      <motion.div 
        className="glass-card border-l-4 border-warning-500 p-4 flex items-start"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <div className="p-2 bg-warning-900/60 rounded-md mr-3">
          <AlertCircle size={18} className="text-warning-400" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-white">System Alert</h4>
          <p className="text-xs text-gray-400 mt-1">
            Bus FB-1003 is running low on fuel. Please schedule refueling.
          </p>
        </div>
        <button className="btn-secondary text-xs ml-auto whitespace-nowrap">
          Take Action
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;