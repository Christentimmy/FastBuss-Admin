import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  AlertCircle, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { maintenanceRecords, buses } from '../data/mockData';

const MaintenanceManagement = () => {
  const [activeView, setActiveView] = useState('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  
  // Filter maintenance records based on search
  const filteredRecords = maintenanceRecords.filter(record => 
    record.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group records by status
  const recordsByStatus = {
    'in-progress': filteredRecords.filter(r => r.status === 'in-progress'),
    'scheduled': filteredRecords.filter(r => r.status === 'scheduled'),
    'completed': filteredRecords.filter(r => r.status === 'completed')
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Maintenance Management</h1>
          <p className="text-sm text-gray-400 mt-1">Track and manage bus maintenance activities</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            New Maintenance
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by bus number or description..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'timeline'
                ? 'bg-primary-900 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveView('timeline')}
          >
            Timeline View
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'kanban'
                ? 'bg-primary-900 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveView('kanban')}
          >
            Kanban View
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
        {/* Status Columns */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2">
          {Object.entries(recordsByStatus).map(([status, records]) => (
            <div key={status} className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white capitalize">
                  {status.replace('-', ' ')}
                </h2>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-800/50 text-gray-300">
                  {records.length} tasks
                </span>
              </div>
              
              <div className="space-y-3">
                {records.map(record => (
                  <div
                    key={record.id}
                    className="bg-gray-800/50 rounded-lg p-4 cursor-pointer hover:bg-gray-800/70 transition-colors"
                    onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md ${
                          status === 'completed' ? 'bg-success-900/60' :
                          status === 'in-progress' ? 'bg-warning-900/60' :
                          'bg-info-900/60'
                        }`}>
                          <Wrench size={20} className={
                            status === 'completed' ? 'text-success-400' :
                            status === 'in-progress' ? 'text-warning-400' :
                            'text-info-400'
                          } />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{record.busNumber}</h3>
                          <p className="text-sm text-gray-400">{record.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Cost</p>
                          <p className="text-white font-medium">${record.cost}</p>
                        </div>
                        {expandedRecord === record.id ? (
                          <ChevronUp className="text-gray-400" size={20} />
                        ) : (
                          <ChevronDown className="text-gray-400" size={20} />
                        )}
                      </div>
                    </div>
                    
                    {expandedRecord === record.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-700"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-400">Maintenance Type</p>
                            <p className="text-white capitalize">{record.type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Scheduled Date</p>
                            <p className="text-white">{new Date(record.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Assigned Technician</p>
                            <p className="text-white">John Smith</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Priority</p>
                            <p className="text-white">High</p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button className="btn-secondary text-xs">Update Status</button>
                          <button className="btn-secondary text-xs">View Details</button>
                          <button className="btn-secondary text-xs">Assign Technician</button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Maintenance Alerts */}
          <div className="glass-card p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Upcoming Maintenance</h2>
            <div className="space-y-3">
              {buses
                .filter(bus => new Date(bus.nextMaintenance) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
                .map(bus => (
                  <div
                    key={bus.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-warning-900/20 border border-warning-500/20"
                  >
                    <AlertCircle size={18} className="text-warning-400 mt-1" />
                    <div>
                      <h3 className="text-white font-medium">{bus.number}</h3>
                      <p className="text-sm text-gray-400">
                        Due: {new Date(bus.nextMaintenance).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Maintenance Stats */}
          <div className="glass-card p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Maintenance Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Maintenance Tasks</span>
                <span className="text-white font-medium">{maintenanceRecords.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">In Progress</span>
                <span className="text-warning-400 font-medium">
                  {recordsByStatus['in-progress'].length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Scheduled</span>
                <span className="text-info-400 font-medium">
                  {recordsByStatus['scheduled'].length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Completed</span>
                <span className="text-success-400 font-medium">
                  {recordsByStatus['completed'].length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MaintenanceManagement; 