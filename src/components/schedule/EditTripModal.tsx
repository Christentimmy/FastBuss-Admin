import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, User, AlertCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { BASE_URL } from '../../services/config';
import { authService } from '../../services/authService';

interface EditTripModalProps {
  tripId: string;
  initialDepartureTime: string;
  initialArrivalTime: string;
  initialDriverId: string;
  onClose: () => void;
  onUpdate: () => void;
}

interface Driver {
  _id: string;
  name: string;
  email: string;
}

const EditTripModal = ({ 
  tripId, 
  initialDepartureTime, 
  initialArrivalTime, 
  initialDriverId,
  onClose,
  onUpdate 
}: EditTripModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [formData, setFormData] = useState({
    departureTime: new Date(initialDepartureTime),
    arrivalTime: new Date(initialArrivalTime),
    driverId: initialDriverId
  });

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = await authService.getToken();
        const response = await fetch(`${BASE_URL}/sub-company/staff/available-drivers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch drivers');
        const data = await response.json();
        setDrivers(data.data);
      } catch (err) {
        console.error('Error fetching drivers:', err);
        setError('Failed to load available drivers');
      }
    };

    fetchDrivers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      const token = await authService.getToken();
      const response = await fetch(`${BASE_URL}/sub-company/update-trip`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId,
          departureTime: formData.departureTime.toISOString(),
          arrivalTime: formData.arrivalTime.toISOString(),
          driverId: formData.driverId
        }),
      });

      if (!response.ok) throw new Error('Failed to update trip');
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Error updating trip:', err);
      setError(err instanceof Error ? err.message : 'Failed to update trip');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTrip = async () => {
    if (!window.confirm('Are you sure you want to cancel this trip?')) return;

    try {
      setIsLoading(true);
      setError(null);

      const token = await authService.getToken();
      const response = await fetch(`${BASE_URL}/sub-company/cancel-trip/${tripId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to cancel trip');
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Error canceling trip:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel trip');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Edit Trip</h2>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Departure Time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Departure Time
            </label>
            <DatePicker
              selected={formData.departureTime}
              onChange={(date: Date) => setFormData({ ...formData, departureTime: date })}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              timeIntervals={15}
            />
          </div>

          {/* Arrival Time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Arrival Time
            </label>
            <DatePicker
              selected={formData.arrivalTime}
              onChange={(date: Date) => setFormData({ ...formData, arrivalTime: date })}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              timeIntervals={15}
            />
          </div>

          {/* Driver Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">
              Driver
            </label>
            <select
              value={formData.driverId}
              onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a driver</option>
              {drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.name} ({driver.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              onClick={handleCancelTrip}
              className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              disabled={isLoading}
            >
              Cancel Trip
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditTripModal; 