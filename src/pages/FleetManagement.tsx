import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, X, Settings, Bus as BusIcon } from 'lucide-react';
import { Bus } from '../services/busService';
import BusStatusCard from '../components/dashboard/BusStatusCard';
import AddBusForm from '../components/fleet/AddBusForm';
import BusDetailsModal from '../components/fleet/BusDetailsModal';
import { busService, CreateBusData } from '../services/busService';

const FleetManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setIsLoading(true);
        const response = await busService.fetchBuses();
        setBuses(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch buses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuses();
  }, []);

  const filteredBuses = buses.filter((bus: Bus) => {
    const matchesSearch = bus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bus.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bus.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddBus = async (busData: CreateBusData) => {
    try {
      setIsLoading(true);
      setError(null);
      await busService.createBus(busData);
      // Refresh the bus list after adding a new bus
      const response = await busService.fetchBuses();
      setBuses(response.data);
      setIsAddModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add bus');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusClick = (bus: Bus) => {
    setSelectedBus(bus);
  };

  const handleStatusChange = async (action: 'activate' | 'block' | 'maintenance' | 'backFromMaintenance' | 'delete') => {
    if (!selectedBus) return;

    try {
      setIsLoading(true);
      setError(null);

      let updatedBus: Bus;
      switch (action) {
        case 'activate':
          updatedBus = await busService.activateBus(selectedBus._id);
          break;
        case 'block':
          updatedBus = await busService.deactivateBus(selectedBus._id);
          break;
        case 'maintenance':
          updatedBus = await busService.busMaintenance(selectedBus._id);
          break;
        case 'backFromMaintenance':
          updatedBus = await busService.busBackFromMaintenance(selectedBus._id);
          break;
        case 'delete':
          await busService.deleteBus(selectedBus._id);
          // Remove the bus from the list
          setBuses(buses.filter(bus => bus._id !== selectedBus._id));
          setSelectedBus(null);
          return;
        default:
          throw new Error('Invalid action');
      }

      // Update the bus in the list
      setBuses(buses.map(bus => 
        bus._id === updatedBus._id ? updatedBus : bus
      ));
      
      setSelectedBus(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bus status');
    } finally {
      setIsLoading(false);
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
          <h1 className="text-2xl font-bold text-white">Fleet Management</h1>
          <p className="text-gray-400 mt-1">Manage and monitor your bus fleet</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? <span>Loading...</span> : <><Plus size={18} /><span>Add New Bus</span></>}
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
              placeholder="Search by bus number or route..."
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
              <option value="maintenance">In Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <button 
              className={`p-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? <span>Loading...</span> : <Filter size={20} />}
            </button>
            
            <button 
              className={`p-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? <span>Loading...</span> : <Settings size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Fleet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Buses', value: buses.length, color: 'primary' },
          { label: 'Active', value: buses.filter((b: Bus) => b.status === 'active').length, color: 'success' },
          { label: 'In Maintenance', value: buses.filter((b: Bus) => b.status === 'maintenance').length, color: 'warning' },
          { label: 'Inactive', value: buses.filter((b: Bus) => b.status === 'inactive').length, color: 'error' },
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
                <BusIcon size={24} className={`text-${stat.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bus Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBuses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BusIcon size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-400">No buses found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredBuses.map((bus: Bus, index: number) => (
            <motion.div
              key={bus._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <BusStatusCard bus={bus} onClick={handleBusClick} />
            </motion.div>
          ))
        )}
      </div>

      {/* Add Bus Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-dark-blue rounded-lg p-6 w-full max-w-md mx-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Add New Bus</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg">
                  {error}
                </div>
              )}
              <AddBusForm 
                onSubmit={handleAddBus} 
                onCancel={() => setIsAddModalOpen(false)}
                isLoading={isLoading}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bus Details Modal */}
      <AnimatePresence>
        {selectedBus && (
          <BusDetailsModal
            bus={selectedBus}
            onClose={() => setSelectedBus(null)}
            onStatusChange={handleStatusChange}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FleetManagement;