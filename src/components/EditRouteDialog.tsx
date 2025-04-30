import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Search, Loader2 } from 'lucide-react';
import { locationService, LocationSuggestion } from '../services/locationService';
import { routeService, Route, UpdateRouteData } from '../services/routeService';

interface EditRouteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRouteUpdated: () => void;
  route: Route;
}

interface RouteFormData {
  routeName: string;
  origin: {
    display_name: string;
    lat: number;
    lon: number;
  } | null;
  destination: {
    display_name: string;
    lat: number;
    lon: number;
  } | null;
  distance: number | null;
  price: string;
  status: 'active' | 'inactive' | 'modified';
}

export const EditRouteDialog: React.FC<EditRouteDialogProps> = ({ isOpen, onClose, onRouteUpdated, route }) => {
  const [formData, setFormData] = useState<RouteFormData>({
    routeName: route.routeName,
    origin: null,
    destination: null,
    distance: route.distance,
    price: route.price.toString(),
    status: route.status
  });

  const [originInput, setOriginInput] = useState(route.origin);
  const [destinationInput, setDestinationInput] = useState(route.destination);
  const [originSuggestions, setOriginSuggestions] = useState<LocationSuggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<LocationSuggestion[]>([]);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        routeName: route.routeName,
        origin: null,
        destination: null,
        distance: route.distance,
        price: route.price.toString(),
        status: route.status
      });
      setOriginInput(route.origin);
      setDestinationInput(route.destination);
    }
  }, [isOpen, route]);

  const handleSearchOrigin = async (query: string) => {
    setOriginInput(query);
    if (query.length < 3) {
      setOriginSuggestions([]);
      return;
    }
    try {
      const suggestions = await locationService.searchLocations(query);
      setOriginSuggestions(suggestions);
    } catch (error) {
      console.error('Error searching origin:', error);
    }
  };

  const handleSearchDestination = async (query: string) => {
    setDestinationInput(query);
    if (query.length < 3) {
      setDestinationSuggestions([]);
      return;
    }
    try {
      const suggestions = await locationService.searchLocations(query);
      setDestinationSuggestions(suggestions);
    } catch (error) {
      console.error('Error searching destination:', error);
    }
  };

  const calculateDistance = async () => {
    if (!formData.origin || !formData.destination) return;

    setIsCalculatingDistance(true);
    try {
      const distance = await locationService.calculateDistance(
        { lat: formData.origin.lat, lon: formData.origin.lon },
        { lat: formData.destination.lat, lon: formData.destination.lon }
      );
      setFormData(prev => ({ ...prev, distance }));
    } catch (error) {
      console.error('Error calculating distance:', error);
      setError('Failed to calculate distance. Please try again.');
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  useEffect(() => {
    if (formData.origin && formData.destination) {
      calculateDistance();
    }
  }, [formData.origin, formData.destination]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const updateData: UpdateRouteData = {
        routeName: formData.routeName !== route.routeName ? formData.routeName : undefined,
        origin: formData.origin ? formData.origin.display_name : undefined,
        destination: formData.destination ? formData.destination.display_name : undefined,
        distance: formData.distance !== route.distance ? formData.distance : undefined,
        price: parseFloat(formData.price) !== route.price ? parseFloat(formData.price) : undefined,
        status: formData.status !== route.status ? formData.status : undefined
      };

      await routeService.updateRoute(route._id, updateData);
      onRouteUpdated();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update route');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded-lg bg-gray-900 p-6">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold text-white">Edit Route</Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-md text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Route Name</label>
              <input
                type="text"
                value={formData.routeName}
                onChange={(e) => setFormData(prev => ({ ...prev, routeName: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-1">Origin</label>
              <div className="relative">
                <input
                  type="text"
                  value={originInput}
                  onChange={(e) => handleSearchOrigin(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {originSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                  {originSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          origin: {
                            display_name: suggestion.display_name,
                            lat: suggestion.lat,
                            lon: suggestion.lon
                          }
                        }));
                        setOriginInput(suggestion.display_name);
                        setOriginSuggestions([]);
                      }}
                      className="w-full px-3 py-2 text-left text-white hover:bg-gray-700"
                    >
                      {suggestion.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-1">Destination</label>
              <div className="relative">
                <input
                  type="text"
                  value={destinationInput}
                  onChange={(e) => handleSearchDestination(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {destinationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                  {destinationSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          destination: {
                            display_name: suggestion.display_name,
                            lat: suggestion.lat,
                            lon: suggestion.lon
                          }
                        }));
                        setDestinationInput(suggestion.display_name);
                        setDestinationSuggestions([]);
                      }}
                      className="w-full px-3 py-2 text-left text-white hover:bg-gray-700"
                    >
                      {suggestion.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Distance (km)</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.distance || ''}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                />
                {isCalculatingDistance && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary-500" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Price (€)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'modified' }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="modified">Modified</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </div>
                ) : (
                  'Update Route'
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 