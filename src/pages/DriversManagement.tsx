import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Settings,
  Star,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical
} from 'lucide-react';
import { drivers } from '../data/mockData';

const DriversManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-duty':
        return 'success';
      case 'available':
        return 'primary';
      case 'off-duty':
        return 'error';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-duty':
        return 'On Duty';
      case 'available':
        return 'Available';
      case 'off-duty':
        return 'Off Duty';
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Driver Management</h1>
          <p className="text-gray-400 mt-1">Manage and monitor your driver fleet</p>
        </div>
        
        <button className="btn-primary">
          <Plus size={18} />
          <span>Add New Driver</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="on-duty">On Duty</option>
              <option value="available">Available</option>
              <option value="off-duty">Off Duty</option>
            </select>
            
            <button className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white transition-colors">
              <Filter size={20} />
            </button>
            
            <button className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Driver Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Drivers', value: drivers.length, color: 'primary' },
          { label: 'On Duty', value: drivers.filter(d => d.status === 'on-duty').length, color: 'success' },
          { label: 'Available', value: drivers.filter(d => d.status === 'available').length, color: 'warning' },
          { label: 'Off Duty', value: drivers.filter(d => d.status === 'off-duty').length, color: 'error' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="data-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className={`text-2xl font-semibold text-${stat.color}-400 mt-1`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-900/20`}>
                <Users size={24} className={`text-${stat.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDrivers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-400">No drivers found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredDrivers.map((driver, index) => (
            <motion.div
              key={driver.id}
              className="data-card hover:shadow-neon-strong transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img 
                      src={driver.avatar} 
                      alt={driver.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 bg-${getStatusColor(driver.status)}-500`}></span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{driver.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(driver.status)}-900/30 text-${getStatusColor(driver.status)}-400`}>
                          {getStatusText(driver.status)}
                        </span>
                        <div className="flex items-center text-warning-400">
                          <Star size={14} className="mr-1" />
                          <span className="text-sm">{driver.rating}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-800/50 rounded-lg transition-colors">
                      <MoreVertical size={20} className="text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-400">
                      <Phone size={14} className="mr-2" />
                      <span className="text-sm">{driver.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Mail size={14} className="mr-2" />
                      <span className="text-sm">{driver.email}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Calendar size={14} className="mr-2" />
                      <span className="text-sm">License expires: {new Date(driver.licenseExpiry).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-800/50">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-gray-400">Total Trips</p>
                          <p className="text-white font-medium">{driver.totalTrips}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Rating</p>
                          <p className="text-white font-medium">{driver.rating}/5.0</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {driver.status === 'available' ? (
                          <button className="p-2 rounded-lg bg-primary-900/30 text-primary-400 hover:bg-primary-900/50 transition-colors">
                            <CheckCircle2 size={18} />
                          </button>
                        ) : driver.status === 'on-duty' ? (
                          <button className="p-2 rounded-lg bg-warning-900/30 text-warning-400 hover:bg-warning-900/50 transition-colors">
                            <Clock size={18} />
                          </button>
                        ) : (
                          <button className="p-2 rounded-lg bg-error-900/30 text-error-400 hover:bg-error-900/50 transition-colors">
                            <XCircle size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default DriversManagement;