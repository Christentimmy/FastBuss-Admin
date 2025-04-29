import React from 'react';
import { motion } from 'framer-motion';
import { X, Bus, MapPin, Users, Calendar, Clock, Wrench, AlertCircle } from 'lucide-react';
import { Bus as BusType } from '../../services/busService';

interface BusDetailsModalProps {
  bus: BusType;
  onClose: () => void;
  onStatusChange: (action: 'activate' | 'block' | 'maintenance' | 'backFromMaintenance' | 'delete') => void;
  isLoading: boolean;
}

const BusDetailsModal: React.FC<BusDetailsModalProps> = ({ bus, onClose, onStatusChange, isLoading }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success-500';
      case 'maintenance':
        return 'text-warning-500';
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
      case 'maintenance':
        return 'In Maintenance';
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-900/60 rounded-md">
              <Bus size={24} className="text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{bus.name}</h2>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <span className="text-gray-400 w-32">Plate Number:</span>
                <span className="text-white">{bus.plateNumber}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-400 w-32">Type:</span>
                <span className="text-white capitalize">{bus.type}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-400 w-32">Capacity:</span>
                <span className="text-white">{bus.capacity} passengers</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-400 w-32">Driver:</span>
                <span className="text-white">{bus.driver || 'Not assigned'}</span>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Location Information</h3>
            <div className="space-y-3">
              {bus.currentLocation?.latitude && bus.currentLocation?.longitude ? (
                <div className="flex items-center text-sm">
                  <MapPin size={16} className="text-gray-400 mr-2" />
                  <span className="text-white">
                    {bus.currentLocation.latitude.toFixed(2)}, {bus.currentLocation.longitude.toFixed(2)}
                  </span>
                </div>
              ) : (
                <div className="text-sm text-gray-400">No location data available</div>
              )}
              <div className="flex items-center text-sm">
                <Clock size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-400">
                  Last updated: {new Date(bus.currentLocation?.timestamp || bus.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Management */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Status Management</h3>
          <div className="flex flex-wrap gap-3">
            {bus.status === 'blocked' && (
              <button
                onClick={() => onStatusChange('activate')}
                className={`px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? <span>Loading...</span> : 'Unblock Bus'}
              </button>
            )}

            {(bus.status === 'active' || bus.status === 'inactive' || bus.status === 'maintenance') && (
              <button
                onClick={() => onStatusChange('block')}
                className={`px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? <span>Loading...</span> : 'Block Bus'}
              </button>
            )}

            {bus.status === 'active' && (
              <button
                onClick={() => onStatusChange('maintenance')}
                className={`px-4 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? <span>Loading...</span> : 'Send to Maintenance'}
              </button>
            )}

            {bus.status === 'maintenance' && (
              <button
                onClick={() => onStatusChange('backFromMaintenance')}
                className={`px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? <span>Loading...</span> : 'Return from Maintenance'}
              </button>
            )}

            <button
              onClick={() => onStatusChange('delete')}
              className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? <span>Loading...</span> : 'Delete Bus'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BusDetailsModal; 