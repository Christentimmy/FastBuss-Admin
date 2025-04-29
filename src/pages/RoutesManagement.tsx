import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Route as RouteIcon, MapPin, Clock, Users, Plus, Search, Filter } from 'lucide-react';
import { routes } from '../data/mockData';

const RoutesManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Calculate route statistics
  const totalRoutes = routes.length;
  const activeRoutes = routes.filter(route => route.status === 'active').length;
  const totalStops = routes.reduce((sum, route) => sum + route.stops, 0);
  const avgPassengers = Math.round(
    routes.reduce((sum, route) => sum + route.avgPassengers, 0) / routes.length
  );

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.startPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.endPoint.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || route.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Routes Management</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Add New Route
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-900/60 rounded-md">
              <RouteIcon size={20} className="text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Routes</p>
              <p className="text-xl font-semibold text-white">{totalRoutes}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-900/60 rounded-md">
              <RouteIcon size={20} className="text-success-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Routes</p>
              <p className="text-xl font-semibold text-white">{activeRoutes}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-900/60 rounded-md">
              <MapPin size={20} className="text-secondary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Stops</p>
              <p className="text-xl font-semibold text-white">{totalStops}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-900/60 rounded-md">
              <Users size={20} className="text-accent-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg. Passengers</p>
              <p className="text-xl font-semibold text-white">{avgPassengers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-900/50 border border-gray-800 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="modified">Modified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Routes List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Route Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Start Point</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">End Point</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Distance</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Duration</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Stops</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((route) => (
                <tr key={route.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                  <td className="px-4 py-3 text-white">{route.name}</td>
                  <td className="px-4 py-3 text-gray-400">{route.startPoint}</td>
                  <td className="px-4 py-3 text-gray-400">{route.endPoint}</td>
                  <td className="px-4 py-3 text-gray-400">{route.distance} km</td>
                  <td className="px-4 py-3 text-gray-400">{route.duration} min</td>
                  <td className="px-4 py-3 text-gray-400">{route.stops}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      route.status === 'active' ? 'bg-success-900/60 text-success-400' :
                      route.status === 'inactive' ? 'bg-gray-900/60 text-gray-400' :
                      'bg-warning-900/60 text-warning-400'
                    }`}>
                      {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-800 rounded-md">
                        <RouteIcon size={16} className="text-primary-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-800 rounded-md">
                        <Clock size={16} className="text-secondary-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-800 rounded-md">
                        <MapPin size={16} className="text-accent-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default RoutesManagement; 