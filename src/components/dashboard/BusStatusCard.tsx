import React from 'react';
import { motion } from 'framer-motion';
import { Bus as BusIcon, MapPin, Users } from 'lucide-react';
import { Bus } from '../../services/busService';

interface BusStatusCardProps {
  bus: Bus;
  onClick: (bus: Bus) => void;
}

const BusStatusCard: React.FC<BusStatusCardProps> = ({ bus, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success-500';
      case 'maintenance':
        return 'bg-warning-500';
      case 'blocked':
        return 'bg-error-500';
      case 'inactive':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
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
      className="data-card cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onClick={() => onClick(bus)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-primary-900/60 rounded-md">
            <BusIcon size={18} className="text-primary-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-white">{bus.name}</h3>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-1.5 ${getStatusColor(bus.status)}`}></span>
              <span className="text-xs text-gray-400">{getStatusText(bus.status)}</span>
            </div>
          </div>
        </div>
        
        {bus.status === 'active' && (
          <div className="bg-success-900/30 text-success-400 text-xs font-medium px-2 py-1 rounded">
            On Route
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {bus.status === 'active' && (
          <>
            {bus.currentLocation?.latitude && bus.currentLocation?.longitude && (
              <div className="flex items-center text-sm">
                <MapPin size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-300">
                  {bus.currentLocation.latitude.toFixed(2)}, {bus.currentLocation.longitude.toFixed(2)}
                </span>
              </div>
            )}
            
            <div className="flex items-center text-sm">
              <Users size={16} className="text-gray-400 mr-2" />
              <span className="text-gray-300">
                Capacity: {bus.capacity} passengers
              </span>
            </div>
          </>
        )}
        
        {bus.status === 'maintenance' && (
          <div className="text-sm text-gray-400">
            <p>Under maintenance</p>
            <p className="mt-1">Last updated: {new Date(bus.updatedAt).toLocaleDateString()}</p>
          </div>
        )}
        
        {bus.status === 'inactive' && (
          <div className="text-sm text-gray-400">
            <p>Currently not in service</p>
            <p className="mt-1">Last active: {new Date(bus.updatedAt).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BusStatusCard;