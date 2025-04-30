import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarClock, 
  Bus, 
  Users, 
  Clock, 
  Search, 
  Filter,
  ChevronDown,
  AlertCircle,
  Plus,
  Timer,
  Map,
  User,
  X
} from 'lucide-react';
import { 
  tripHistoryService, 
  TripHistory,
  Route,
  Driver,
  CreateScheduleRequest
} from '../services/tripHistoryService';
import { authService } from '../services/authService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";

const ScheduleManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeView, setActiveView] = useState<'timeline' | 'grid'>('grid');
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [schedules, setSchedules] = useState<TripHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // New schedule form states
  const [showNewScheduleForm, setShowNewScheduleForm] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [formData, setFormData] = useState<CreateScheduleRequest>({
    routeId: '',
    driverId: '',
    departureTime: '',
    arrivalTime: ''
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Fetch schedules on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = authService.getToken();
        if (!token) {
          setError('Authentication token not found. Please login again.');
          setLoading(false);
          return;
        }

        const [schedulesResponse, routesResponse, driversResponse] = await Promise.all([
          tripHistoryService.getTripHistory(token),
          tripHistoryService.getAllRoutes(token),
          tripHistoryService.getAvailableDrivers(token)
        ]);

        setSchedules(schedulesResponse.data);
        setRoutes(routesResponse.data);
        setDrivers(driversResponse.data);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch routes and drivers when form is opened
  useEffect(() => {
    const fetchFormData = async () => {
      if (!showNewScheduleForm) return;

      try {
        setIsFormLoading(true);
        const token = authService.getToken();
        if (!token) {
          setFormError('Authentication token not found. Please login again.');
          return;
        }

        const [routesResponse, driversResponse] = await Promise.all([
          tripHistoryService.getAllRoutes(token),
          tripHistoryService.getAvailableDrivers(token)
        ]);

        setRoutes(routesResponse.data);
        setDrivers(driversResponse.data);
        setFormError(null);
      } catch (err) {
        setFormError('Failed to load form data. Please try again.');
        console.error('Error loading form data:', err);
      } finally {
        setIsFormLoading(false);
      }
    };

    fetchFormData();
  }, [showNewScheduleForm]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCreateSchedule = async () => {
    try {
      setFormError(null);
      const token = authService.getToken();
      if (!token) {
        setFormError('Authentication token not found. Please login again.');
        return;
      }

      // Validate form data
      if (!formData.routeId || !formData.driverId || !formData.departureTime || !formData.arrivalTime) {
        setFormError('Please fill in all fields');
        return;
      }

      await tripHistoryService.createSchedule(token, formData);
      
      // Refresh schedules
      const response = await tripHistoryService.getTripHistory(token);
      setSchedules(response.data);
      
      // Reset form
      setFormData({
        routeId: '',
        driverId: '',
        departureTime: '',
        arrivalTime: ''
      });
      setShowNewScheduleForm(false);
    } catch (err) {
      setFormError('Failed to create schedule. Please try again.');
      console.error('Error creating schedule:', err);
    }
  };

  // Calculate schedule statistics
  const totalSchedules = schedules.length;
  const inProgressSchedules = schedules.filter(s => s.status === 'in-progress').length;
  const upcomingSchedules = schedules.filter(s => s.status === 'pending').length;
  const completedSchedules = schedules.filter(s => s.status === 'completed').length;

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = 
      schedule.busName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.routeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-primary-900/60 text-primary-400';
      case 'pending':
        return 'bg-success-900/60 text-success-400';
      case 'completed':
        return 'bg-gray-900/60 text-gray-400';
      case 'cancelled':
        return 'bg-warning-900/60 text-warning-400';
      default:
        return 'bg-gray-900/60 text-gray-400';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeDifference = (dateString: string) => {
    const scheduleTime = new Date(dateString);
    const diff = scheduleTime.getTime() - currentTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (diff < 0) return 'In Progress';
    if (hours > 0) return `In ${hours}h ${remainingMinutes}m`;
    return `In ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-warning-500 mx-auto mb-4" />
          <p className="text-warning-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Schedule Management</h1>
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'timeline'
                  ? 'bg-primary-900 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveView('timeline')}
            >
              Timeline View
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'grid'
                  ? 'bg-primary-900 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveView('grid')}
            >
              Grid View
            </button>
          </div>
        </div>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowNewScheduleForm(true)}
        >
          <Plus size={16} />
          New Schedule
        </button>
      </div>

      {/* New Schedule Form Modal */}
      <AnimatePresence>
        {showNewScheduleForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Create New Schedule</h2>
                <button
                  onClick={() => setShowNewScheduleForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-warning-900/50 text-warning-400 rounded-md text-sm">
                  {formError}
                </div>
              )}

              {isFormLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Route
                    </label>
                    <select
                      value={formData.routeId}
                      onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                    >
                      <option value="">Select a route</option>
                      {routes.map((route) => (
                        <option key={route._id} value={route._id}>
                          {route.routeName} ({route.origin} → {route.destination})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Driver
                    </label>
                    <select
                      value={formData.driverId}
                      onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                    >
                      <option value="">Select a driver</option>
                      {drivers.map((driver) => (
                        <option key={driver._id} value={driver._id}>
                          {driver.name} ({driver.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Departure Time
                    </label>
                    <DatePicker
                      selected={formData.departureTime ? new Date(formData.departureTime) : null}
                      onChange={(date: Date | null) => setFormData({ ...formData, departureTime: date?.toISOString() || '' })}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholderText="Select departure time"
                      timeIntervals={15}
                      showPopperArrow={false}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Arrival Time
                    </label>
                    <DatePicker
                      selected={formData.arrivalTime ? new Date(formData.arrivalTime) : null}
                      onChange={(date: Date | null) => setFormData({ ...formData, arrivalTime: date?.toISOString() || '' })}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholderText="Select arrival time"
                      timeIntervals={15}
                      showPopperArrow={false}
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowNewScheduleForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateSchedule}
                      className="btn-primary text-sm"
                    >
                      Create Schedule
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Timeline View */}
      <AnimatePresence mode="wait">
        {activeView === 'timeline' ? (
          <motion.div
            key="timeline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {filteredSchedules.map((schedule, index) => (
              <motion.div
                key={schedule._id}
                className="glass-card overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setSelectedSchedule(selectedSchedule === schedule._id ? null : schedule._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary-900/60 rounded-md">
                        <Bus size={20} className="text-primary-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{schedule.busName}</h3>
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
                          selectedSchedule === schedule._id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {selectedSchedule === schedule._id && (
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
                              <Timer size={16} />
                              <span>Schedule Time</span>
                            </div>
                            <p className="text-white">
                              {formatTime(schedule.departureTime)} - {formatTime(schedule.arrivalTime)}
                            </p>
                            <p className="text-sm text-primary-400">
                              {getTimeDifference(schedule.departureTime)}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400">
                              <User size={16} />
                              <span>Driver</span>
                            </div>
                            <p className="text-white">{schedule.driverName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-warning-400">
                          <AlertCircle size={16} />
                          <span className="text-sm">Route: {schedule.origin} → {schedule.destination}</span>
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
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredSchedules.map((schedule, index) => (
              <motion.div
                key={schedule._id}
                className="glass-card p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary-900/60 rounded-md">
                    <Bus size={20} className="text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{schedule.busName}</h3>
                    <p className="text-sm text-gray-400">{schedule.routeName}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Timer size={16} />
                    <span className="text-sm">{formatTime(schedule.departureTime)} - {formatTime(schedule.arrivalTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <User size={16} />
                    <span className="text-sm">{schedule.driverName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Map size={16} />
                    <span className="text-sm">{schedule.origin} → {schedule.destination}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                    {schedule.status.replace('-', ' ').charAt(0).toUpperCase() + schedule.status.slice(1)}
                  </span>
                  <div className="flex gap-2">
                    <button className="btn-secondary text-xs">View</button>
                    <button className="btn-primary text-xs">Edit</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ScheduleManagement; 