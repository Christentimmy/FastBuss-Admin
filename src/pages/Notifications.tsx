import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  BellOff, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock, 
  Filter, 
  Search,
  ChevronDown,
  ChevronUp,
  Settings,
  Trash2
} from 'lucide-react';
import { notifications } from '../data/mockData';

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Filter notifications based on search and active filter
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || notification.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, typeof notifications>);

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
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-sm text-gray-400 mt-1">Stay updated with system alerts and messages</p>
        </div>
        <div className="flex gap-3">
          <button 
            className={`btn-secondary flex items-center gap-2 ${
              isMuted ? 'bg-gray-800/50' : ''
            }`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <BellOff size={16} /> : <Bell size={16} />}
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search notifications..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'alert', 'info', 'success'].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-primary-900 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
        {/* Notifications List */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2">
          {Object.entries(groupedNotifications).map(([date, notifications]) => (
            <div key={date} className="glass-card p-4">
              <h2 className="text-lg font-semibold text-white mb-4">{date}</h2>
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      notification.read ? 'bg-gray-800/30' : 'bg-gray-800/50'
                    }`}
                    onClick={() => setExpandedNotification(
                      expandedNotification === notification.id ? null : notification.id
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-md ${
                        notification.type === 'alert' ? 'bg-warning-900/60' :
                        notification.type === 'success' ? 'bg-success-900/60' :
                        'bg-info-900/60'
                      }`}>
                        {notification.type === 'alert' ? <AlertCircle size={20} className="text-warning-400" /> :
                         notification.type === 'success' ? <CheckCircle2 size={20} className="text-success-400" /> :
                         <Info size={20} className="text-info-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-medium">{notification.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </span>
                            {expandedNotification === notification.id ? (
                              <ChevronUp className="text-gray-400" size={20} />
                            ) : (
                              <ChevronDown className="text-gray-400" size={20} />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                      </div>
                    </div>
                    
                    {expandedNotification === notification.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock size={16} />
                            <span>Created: {new Date(notification.timestamp).toLocaleString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="btn-secondary text-xs">Mark as Read</button>
                            <button className="btn-secondary text-xs">Archive</button>
                            <button className="btn-secondary text-xs text-red-400">
                              <Trash2 size={14} />
                            </button>
                          </div>
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
          {/* Notification Stats */}
          <div className="glass-card p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Notification Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Notifications</span>
                <span className="text-white font-medium">{notifications.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Unread</span>
                <span className="text-primary-400 font-medium">
                  {notifications.filter(n => !n.read).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Alerts</span>
                <span className="text-warning-400 font-medium">
                  {notifications.filter(n => n.type === 'alert').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Success</span>
                <span className="text-success-400 font-medium">
                  {notifications.filter(n => n.type === 'success').length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full btn-secondary text-sm">Mark All as Read</button>
              <button className="w-full btn-secondary text-sm">Clear All Notifications</button>
              <button className="w-full btn-secondary text-sm">View Archived</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Notifications; 