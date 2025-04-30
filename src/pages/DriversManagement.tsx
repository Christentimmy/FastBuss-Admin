import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Settings,
  Phone,
  Mail,
  Calendar,
  XCircle,
  Bus
} from 'lucide-react';
import { driverService, Driver, TripHistory } from '../services/driverService';
import DriverMenu from '../components/drivers/DriverMenu';
import LoadingOverlay from '../components/common/LoadingOverlay';
import AddDriverDialog from '../components/drivers/AddDriverDialog';
import AssignBusDialog from '../components/drivers/AssignBusDialog';
import TripHistoryDialog from '../components/drivers/TripHistoryDialog';

const DriversManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isAssignBusDialogOpen, setIsAssignBusDialogOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [driverCreationError, setDriverCreationError] = useState<string | null>(null);
  const [isTripHistoryDialogOpen, setIsTripHistoryDialogOpen] = useState(false);
  const [selectedDriverForHistory, setSelectedDriverForHistory] = useState<Driver | null>(null);
  const [tripHistory, setTripHistory] = useState<TripHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await driverService.getDrivers();
        setDrivers(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch drivers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleBanDriver = async (driverId: string) => {
    setActionLoading(driverId);
    setIsProcessing(true);
    try {
      await driverService.banDriver(driverId);
      // Update the driver's status in the local state
      setDrivers(prevDrivers => 
        prevDrivers.map(driver => 
          driver._id === driverId 
            ? { ...driver, status: 'banned' }
            : driver
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to ban driver');
    } finally {
      setActionLoading(null);
      setIsProcessing(false);
    }
  };

  const handleUnbanDriver = async (driverId: string) => {
    setActionLoading(driverId);
    setIsProcessing(true);
    try {
      await driverService.unbanDriver(driverId);
      // Update the driver's status in the local state
      setDrivers(prevDrivers => 
        prevDrivers.map(driver => 
          driver._id === driverId 
            ? { ...driver, status: 'active' }
            : driver
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unban driver');
    } finally {
      setActionLoading(null);
      setIsProcessing(false);
    }
  };

  const handleDeleteDriver = async (driverId: string) => {
    setActionLoading(driverId);
    setIsProcessing(true);
    try {
      await driverService.deleteDriver(driverId);
      // Remove the driver from the local state
      setDrivers(prevDrivers => prevDrivers.filter(driver => driver._id !== driverId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete driver');
    } finally {
      setActionLoading(null);
      setIsProcessing(false);
    }
  };

  const handleAssignBus = async (driverId: string) => {
    setSelectedDriverId(driverId);
    setIsAssignBusDialogOpen(true);
  };

  const handleBusAssignment = async (busId: string) => {
    if (!selectedDriverId) return;
    
    setActionLoading(selectedDriverId);
    setIsProcessing(true);
    try {
      await driverService.assignBus(selectedDriverId, busId);
      // Update the driver's bus assignment in the local state
      setDrivers(prevDrivers => 
        prevDrivers.map(driver => 
          driver._id === selectedDriverId 
            ? { ...driver, assignedBus: busId }
            : driver
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign bus');
    } finally {
      setActionLoading(null);
      setIsProcessing(false);
    }
  };

  const handleUnassignBus = async (driverId: string) => {
    setActionLoading(driverId);
    setIsProcessing(true);
    try {
      await driverService.unassignBus(driverId);
      // Update the driver's bus assignment in the local state
      setDrivers(prevDrivers => 
        prevDrivers.map(driver => 
          driver._id === driverId 
            ? { ...driver, assignedBus: null }
            : driver
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unassign bus');
    } finally {
      setActionLoading(null);
      setIsProcessing(false);
    }
  };

  const handleViewHistory = async (driverId: string) => {
    setIsLoadingHistory(true);
    try {
      const driver = drivers.find(d => d._id === driverId);
      if (!driver) {
        throw new Error('Driver not found');
      }
      
      const response = await driverService.getTripHistory(driverId);
      setTripHistory(response.data);
      setSelectedDriverForHistory(driver);
      setIsTripHistoryDialogOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trip history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleCreateDriver = async (data: { name: string; email: string; phone: string; password: string }) => {
    setIsCreating(true);
    setIsProcessing(true);
    setDriverCreationError(null); // Clear any previous errors
    try {
      await driverService.createDriver(data);
      // Refresh the drivers list
      const response = await driverService.getDrivers();
      setDrivers(response.data);
      setIsAddDialogOpen(false);
    } catch (err) {
      setDriverCreationError(err instanceof Error ? err.message : 'Failed to create driver');
    } finally {
      setIsCreating(false);
      setIsProcessing(false);
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error && !isAddDialogOpen) {
    return (
      <div className="text-center py-12">
        <XCircle size={48} className="mx-auto text-error-500 mb-4" />
        <h3 className="text-lg font-medium text-white">Error Loading Drivers</h3>
        <p className="text-gray-400 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <LoadingOverlay isLoading={isProcessing || isLoadingHistory} />
      <AddDriverDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setDriverCreationError(null); // Clear error when closing dialog
        }}
        onSubmit={handleCreateDriver}
        isLoading={isCreating}
        error={driverCreationError}
      />
      <AssignBusDialog
        isOpen={isAssignBusDialogOpen}
        onClose={() => {
          setIsAssignBusDialogOpen(false);
          setSelectedDriverId(null);
        }}
        onAssign={handleBusAssignment}
        driverId={selectedDriverId || ''}
      />
      <TripHistoryDialog
        isOpen={isTripHistoryDialogOpen}
        onClose={() => {
          setIsTripHistoryDialogOpen(false);
          setSelectedDriverForHistory(null);
          setTripHistory([]);
        }}
        tripHistory={tripHistory}
        driverName={selectedDriverForHistory?.name || ''}
      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Driver Management</h1>
          <p className="text-gray-400 mt-1">Manage and monitor your driver fleet</p>
        </div>
        
        <button 
          className="btn-primary"
          onClick={() => setIsAddDialogOpen(true)}
        >
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { label: 'Total Drivers', value: drivers.length, color: 'primary' },
          { label: 'Active Drivers', value: drivers.filter(d => d.status === 'active').length, color: 'success' },
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
              key={driver._id}
              className="data-card hover:shadow-neon-strong transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img 
                      src={driver.profilePicture || driverService.generateRandomAvatar(driver.name)} 
                      alt={driver.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = driverService.generateRandomAvatar(driver.name);
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{driver.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(driver.status)}-900/30 text-${getStatusColor(driver.status)}-400`}>
                          {getStatusText(driver.status)}
                        </span>
                      </div>
                    </div>
                    <DriverMenu
                      driverId={driver._id}
                      status={driver.status}
                      hasAssignedBus={!!driver.assignedBus}
                      onBan={handleBanDriver}
                      onUnban={handleUnbanDriver}
                      onDelete={handleDeleteDriver}
                      onAssignBus={handleAssignBus}
                      onUnassignBus={handleUnassignBus}
                      onViewHistory={handleViewHistory}
                      isLoading={actionLoading === driver._id}
                    />
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
                      <span className="text-sm">Joined: {new Date(driver.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-800/50">
                    <div className="flex items-center justify-between">
                      {!driver.assignedBus && (
                        <button 
                          className="px-3 py-1.5 rounded-lg bg-primary-900/30 text-primary-400 hover:bg-primary-900/50 transition-colors flex items-center gap-2"
                          onClick={() => handleAssignBus(driver._id)}
                        >
                          <Bus size={16} />
                          <span>Assign Bus</span>
                        </button>
                      )}
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