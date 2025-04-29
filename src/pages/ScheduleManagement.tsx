import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarClock, 
  Bus, 
  Route, 
  Users, 
  Clock, 
  MapPin, 
  Search, 
  Filter, 
  ChevronRight,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { schedules, routes, buses, drivers } from '../data/mockData';

const ScheduleManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedSchedule, setExpandedSchedule] = useState<string | null>(null);

  // Calculate schedule statistics
  const totalSchedules = schedules.length;
  const inProgressSchedules = schedules.filter(s => s.status === 'in-progress').length;
  const upcomingSchedules = schedules.filter(s => s.status === 'scheduled').length;
  const completedSchedules = schedules.filter(s => s.status === 'completed').length;

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = 
      schedule.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.routeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-primary-900/60 text-primary-400';
      case 'scheduled':
        return 'bg-success-900/60 text-success-400';
      case 'completed':
        return 'bg-gray-900/60 text-gray-400';
      default:
        return 'bg-warning-900/60 text-warning-400';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

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
        <h1 className="text-2xl font-bold text-white">Schedule Management</h1>
        <div className="flex items-center gap-4">
          <button className="btn-primary flex items-center gap-2">
            <CalendarClock size={16} />
            New Schedule
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          className="glass-card p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-900/60 rounded-md">
              <CalendarClock size={20} className="text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Schedules</p>
              <p className="text-xl font-semibold text-white">{totalSchedules}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="glass-card p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-900/60 rounded-md">
              <Bus size={20} className="text-success-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">In Progress</p>
              <p className="text-xl font-semibold text-white">{inProgressSchedules}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="glass-card p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-900/60 rounded-md">
              <Clock size={20} className="text-secondary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Upcoming</p>
              <p className="text-xl font-semibold text-white">{upcomingSchedules}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="glass-card p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-900/60 rounded-md">
              <Users size={20} className="text-accent-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-xl font-semibold text-white">{completedSchedules}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div 
        className="glass-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search schedules..."
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
              <option value="in-progress">In Progress</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Schedules List */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        {filteredSchedules.map((schedule) => (
          <motion.div
            key={schedule.id}
            className="glass-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedSchedule(expandedSchedule === schedule.id ? null : schedule.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary-900/60 rounded-md">
                    <Bus size={20} className="text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{schedule.busNumber}</h3>
                    <p className="text-sm text-gray-400">{schedule.routeName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                    {schedule.status.replace('-', ' ').charAt(0).toUpperCase() + schedule.status.slice(1)}
                  </span>
                  <ChevronDown 
                    size={20} 
                    className={`text-gray-400 transition-transform duration-200 ${
                      expandedSchedule === schedule.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedSchedule === schedule.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-800"
                >
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock size={16} />
                          <span>Schedule Time</span>
                        </div>
                        <p className="text-white">
                          {formatTime(schedule.departureTime)} - {formatTime(schedule.arrivalTime)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users size={16} />
                          <span>Driver</span>
                        </div>
                        <p className="text-white">{schedule.driverName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-warning-400">
                      <AlertCircle size={16} />
                      <span className="text-sm">Estimated duration: {schedule.arrivalTime}</span>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button className="btn-secondary text-sm">View Details</button>
                      <button className="btn-primary text-sm">Edit Schedule</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ScheduleManagement; 