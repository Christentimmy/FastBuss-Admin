import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, User, AlertCircle, Plus, Trash2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { tripHistoryService } from '../../services/tripHistoryService';
import { authService } from '../../services/authService';

interface EditTripModalProps {
  tripId: string;
  initialDepartureTime: string;
  initialArrivalTime: string;
  initialDriverId: string;
  onClose: () => void;
  onUpdate: () => void;
}

interface Stop {
  location: string;
  arrivalTime: string;
  departureTime: string;
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
  const [formData, setFormData] = useState({
    departureTime: new Date(initialDepartureTime),
    arrivalTime: new Date(initialArrivalTime),
    driverId: initialDriverId,
    stops: [] as Stop[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      // Validate stops
      if (formData.stops.length === 0) {
        setError('At least one stop is required');
        return;
      }

      const token = await authService.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await tripHistoryService.updateTrip(token, tripId, {
        departureTime: formData.departureTime.toISOString(),
        arrivalTime: formData.arrivalTime.toISOString(),
        driverId: formData.driverId,
        stops: formData.stops
      });

      onUpdate();
      onClose();
    } catch (err) {
      console.error('Error updating trip:', err);
      setError(err instanceof Error ? err.message : 'Failed to update trip');
    } finally {
      setIsLoading(false);
    }
  };

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [
        ...prev.stops,
        {
          location: '',
          arrivalTime: '',
          departureTime: ''
        }
      ]
    }));
  };

  const removeStop = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }));
  };

  const updateStop = (index: number, field: keyof Stop, value: string) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.map((stop, i) => 
        i === index ? { ...stop, [field]: value } : stop
      )
    }));
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
        className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl mx-4"
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

          {/* Stops */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-400">
                Stops
              </label>
              <button
                type="button"
                onClick={addStop}
                className="flex items-center gap-2 text-primary-400 hover:text-primary-300"
              >
                <Plus size={16} />
                <span>Add Stop</span>
              </button>
            </div>

            {formData.stops.map((stop, index) => (
              <div key={index} className="space-y-2 p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-400">Stop {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeStop(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Location"
                    value={stop.location}
                    onChange={(e) => updateStop(index, 'location', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <DatePicker
                      selected={stop.arrivalTime ? new Date(stop.arrivalTime) : null}
                      onChange={(date: Date) => updateStop(index, 'arrivalTime', date.toISOString())}
                      showTimeSelect
                      dateFormat="h:mm aa"
                      placeholderText="Arrival Time"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      timeIntervals={15}
                      required
                    />
                    <DatePicker
                      selected={stop.departureTime ? new Date(stop.departureTime) : null}
                      onChange={(date: Date) => updateStop(index, 'departureTime', date.toISOString())}
                      showTimeSelect
                      dateFormat="h:mm aa"
                      placeholderText="Departure Time"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      timeIntervals={15}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
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