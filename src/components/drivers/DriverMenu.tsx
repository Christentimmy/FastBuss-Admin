import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, 
  Ban, 
  CheckCircle, 
  Trash2, 
  Bus, 
  History
} from 'lucide-react';

interface DriverMenuProps {
  driverId: string;
  status: string;
  hasAssignedBus: boolean;
  onBan: (driverId: string) => void;
  onUnban: (driverId: string) => void;
  onDelete: (driverId: string) => void;
  onAssignBus: (driverId: string) => void;
  onUnassignBus: (driverId: string) => void;
  onViewHistory: (driverId: string) => void;
  isLoading?: boolean;
}

const DriverMenu: React.FC<DriverMenuProps> = ({
  driverId,
  status,
  hasAssignedBus,
  onBan,
  onUnban,
  onDelete,
  onAssignBus,
  onUnassignBus,
  onViewHistory,
  isLoading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="p-1 hover:bg-gray-800/50 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MoreVertical size={20} className="text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-800 shadow-lg border border-gray-700 z-50"
            style={{ top: '100%' }}
          >
            <div className="py-1">
              {status === 'banned' ? (
                <button
                  className="w-full px-4 py-2 text-left text-sm text-green-400 hover:bg-gray-700/50 flex items-center gap-2"
                  onClick={() => handleAction(() => onUnban(driverId))}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-400"></div>
                  ) : (
                    <CheckCircle size={16} />
                  )}
                  <span>Unban Driver</span>
                </button>
              ) : (
                <button
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700/50 flex items-center gap-2"
                  onClick={() => handleAction(() => onBan(driverId))}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-400"></div>
                  ) : (
                    <Ban size={16} />
                  )}
                  <span>Ban Driver</span>
                </button>
              )}

              {hasAssignedBus ? (
                <button
                  className="w-full px-4 py-2 text-left text-sm text-yellow-400 hover:bg-gray-700/50 flex items-center gap-2"
                  onClick={() => handleAction(() => onUnassignBus(driverId))}
                >
                  <Bus size={16} />
                  <span>Unassign Bus</span>
                </button>
              ) : (
                <button
                  className="w-full px-4 py-2 text-left text-sm text-primary-400 hover:bg-gray-700/50 flex items-center gap-2"
                  onClick={() => handleAction(() => onAssignBus(driverId))}
                >
                  <Bus size={16} />
                  <span>Assign Bus</span>
                </button>
              )}

              <button
                className="w-full px-4 py-2 text-left text-sm text-blue-400 hover:bg-gray-700/50 flex items-center gap-2"
                onClick={() => handleAction(() => onViewHistory(driverId))}
              >
                <History size={16} />
                <span>Trip History</span>
              </button>

              <button
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700/50 flex items-center gap-2"
                onClick={() => handleAction(() => onDelete(driverId))}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-400"></div>
                ) : (
                  <Trash2 size={16} />
                )}
                <span>Delete Driver</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DriverMenu; 