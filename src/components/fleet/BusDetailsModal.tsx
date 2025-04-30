import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Bus, MapPin, Users, Calendar, Clock, Phone, Mail, User, Settings } from 'lucide-react';
import { Bus as BusType, busService, BusDetailsResponse } from '../../services/busService';
import ShimmerEffect from '../common/ShimmerEffect';

interface BusDetailsModalProps {
  bus: BusType;
  onClose: () => void;
  onStatusChange: (action: 'activate' | 'block' | 'delete') => void;
  isLoading: boolean;
}

const BusDetailsModal: React.FC<BusDetailsModalProps> = ({ bus, onClose, onStatusChange }) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [busDetails, setBusDetails] = useState<BusDetailsResponse['data'] | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        setIsLoadingDetails(true);
        setError(null);
        const response = await busService.fetchBusDetails(bus._id);
        setBusDetails(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bus details');
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchBusDetails();
  }, [bus._id]);

  const handleAction = async (action: 'activate' | 'block' | 'delete') => {
    setLoadingAction(action);
    try {
      await onStatusChange(action);
    } finally {
      setLoadingAction(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success-500';
      case 'blocked':
        return 'text-error-500';
      case 'inactive':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'In Service';
      case 'blocked':
        return 'Blocked';
      case 'inactive':
        return 'Not in Service';
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-dark-blue rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-900/60 rounded-md">
              <Bus size={24} className="text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{bus.busName}</h2>
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-1.5 ${getStatusColor(bus.status)}`}></span>
                <span className="text-sm text-gray-400">{getStatusText(bus.status)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
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

        {isLoadingDetails ? (
          <div className="space-y-8">
            {/* Basic Information Shimmer */}
            <div className="glass-card p-4 rounded-lg">
              <ShimmerEffect className="h-6 w-48 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <ShimmerEffect className="h-4 w-32" />
                    <ShimmerEffect className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </div>

            {/* Location Information Shimmer */}
            <div className="glass-card p-4 rounded-lg">
              <ShimmerEffect className="h-6 w-48 mb-4" />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <ShimmerEffect className="h-4 w-32" />
                    <ShimmerEffect className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </div>

            {/* Driver Information Shimmer */}
            <div className="glass-card p-4 rounded-lg">
              <ShimmerEffect className="h-6 w-48 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <ShimmerEffect className="h-4 w-32" />
                    <ShimmerEffect className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Users size={18} className="mr-2 text-primary-400" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm">
                  <span className="text-gray-400 w-32">Bus Number:</span>
                  <span className="text-white font-medium">{busDetails?.plateNumber}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-400 w-32">Type:</span>
                  <span className="text-white font-medium capitalize">{busDetails?.type}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-400 w-32">Capacity:</span>
                  <span className="text-white font-medium">{busDetails?.capacity} passengers</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-400 w-32">Status:</span>
                  <span className={`font-medium ${getStatusColor(busDetails?.status || '')}`}>
                    {getStatusText(busDetails?.status || '')}
                  </span>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <MapPin size={18} className="mr-2 text-primary-400" />
                Location Information
              </h3>
              <div className="space-y-3">
                {busDetails?.location?.latitude && busDetails?.location?.longitude ? (
                  <div className="flex items-center text-sm">
                    <span className="text-gray-400 w-32">Current Location:</span>
                    <span className="text-white font-medium">
                      {busDetails.location.address || `${busDetails.location.latitude}, ${busDetails.location.longitude}`}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">No location data available</div>
                )}
                <div className="flex items-center text-sm">
                  <span className="text-gray-400 w-32">Last Updated:</span>
                  <span className="text-white font-medium">
                    {busDetails?.location?.timestamp ? new Date(busDetails.location.timestamp).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Driver Information */}
            {busDetails?.driver && (
              <div className="glass-card p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <User size={18} className="mr-2 text-primary-400" />
                  Driver Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-400 w-32">Name:</span>
                    <span className="text-white font-medium">{busDetails.driver.name}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-400 w-32">Email:</span>
                    <span className="text-white font-medium">{busDetails.driver.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-400 w-32">Phone:</span>
                    <span className="text-white font-medium">{busDetails.driver.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-400 w-32">Status:</span>
                    <span className={`font-medium ${
                      busDetails.driver.status === 'active' ? 'text-success-500' : 'text-gray-500'
                    }`}>
                      {busDetails.driver.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Status Management */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Settings size={18} className="mr-2 text-primary-400" />
                Status Management
              </h3>
              <div className="flex flex-wrap gap-3">
                {bus.status === 'blocked' && (
                  <button
                    onClick={() => handleAction('activate')}
                    className={`px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors ${loadingAction === 'activate' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loadingAction === 'activate'}
                  >
                    {loadingAction === 'activate' ? 'Loading...' : 'Activate Bus'}
                  </button>
                )}

                {bus.status !== 'blocked' && (
                  <button
                    onClick={() => handleAction('block')}
                    className={`px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors ${loadingAction === 'block' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loadingAction === 'block'}
                  >
                    {loadingAction === 'block' ? 'Loading...' : 'Block Bus'}
                  </button>
                )}

                <button
                  onClick={() => handleAction('delete')}
                  className={`px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors ${loadingAction === 'delete' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loadingAction === 'delete'}
                >
                  {loadingAction === 'delete' ? 'Loading...' : 'Delete Bus'}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BusDetailsModal; 