import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Clock, Bus, User, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BASE_URL } from '../../services/config';
import { authService } from '../../services/authService';

// Fix for default marker icons
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface TripDetailsModalProps {
  tripId: string;
  onClose: () => void;
}

interface TripDetails {
  tripId: string;
  status: string;
  departureTime: string;
  arrivalTime: string;
  route: {
    name: string;
    origin: string;
    destination: string;
    distance: number;
    price: number;
  };
  bus: {
    name: string;
    plateNumber: string;
    type: string;
    capacity: number;
  };
  driver: {
    name: string;
    phone: string;
  };
}

interface Location {
  lat: number;
  lon: number;
  display_name: string;
}

const TripDetailsModal = ({ tripId, onClose }: TripDetailsModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [originLocation, setOriginLocation] = useState<Location | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);
  const [isLocationsValid, setIsLocationsValid] = useState(true);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const TOKEN = await authService.getToken();

        // Fetch trip details
        const response = await fetch(`${BASE_URL}/sub-company/staff/get-trip-details/${tripId}`, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch trip details');
        const data = await response.json();
        setTripDetails(data.data);

        console.log('Trip Details:', data.data);

        // Fetch locations
        const originUrl = `https://us1.locationiq.com/v1/search?key=${import.meta.env.VITE_LOCATIONIQ_API_KEY}&q=${encodeURIComponent(data.data.route.origin)}&format=json&limit=1`;
        const destinationUrl = `https://us1.locationiq.com/v1/search?key=${import.meta.env.VITE_LOCATIONIQ_API_KEY}&q=${encodeURIComponent(data.data.route.destination)}&format=json&limit=1`;

        console.log('Origin URL:', originUrl);
        console.log('Destination URL:', destinationUrl);

        const [originResponse, destinationResponse] = await Promise.all([
          fetch(originUrl),
          fetch(destinationUrl)
        ]);

        console.log('Origin Response Status:', originResponse.status);
        console.log('Destination Response Status:', destinationResponse.status);

        if (!originResponse.ok || !destinationResponse.ok) {
          const originError = await originResponse.text();
          const destinationError = await destinationResponse.text();
          console.error('Origin Error:', originError);
          console.error('Destination Error:', destinationError);
          throw new Error('Failed to fetch location data');
        }

        const [originData, destinationData] = await Promise.all([
          originResponse.json(),
          destinationResponse.json()
        ]);

        console.log('Origin Data:', originData);
        console.log('Destination Data:', destinationData);

        // Check if we got valid location data
        if (Array.isArray(originData) && Array.isArray(destinationData) && 
            originData.length > 0 && destinationData.length > 0) {
          const origin = originData[0];
          const destination = destinationData[0];
          
          if (origin.lat && origin.lon && destination.lat && destination.lon) {
            setOriginLocation({
              lat: parseFloat(origin.lat),
              lon: parseFloat(origin.lon),
              display_name: origin.display_name || data.data.route.origin
            });
            setDestinationLocation({
              lat: parseFloat(destination.lat),
              lon: parseFloat(destination.lon),
              display_name: destination.display_name || data.data.route.destination
            });
            setIsLocationsValid(true);
          } else {
            console.error('Invalid location data:', { origin, destination });
            setIsLocationsValid(false);
          }
        } else {
          console.error('No location data found:', { originData, destinationData });
          setIsLocationsValid(false);
        }
      } catch (err) {
        console.error('Error in fetchTripDetails:', err);
        setError(err instanceof Error ? err.message : 'Failed to load trip details');
        setIsLocationsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

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
        className="bg-gray-900 rounded-lg p-6 w-full max-w-6xl mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Trip Details</h2>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Section */}
          <div className="h-[500px] rounded-lg overflow-hidden relative">
            <MapContainer
              center={[0, 0]}
              zoom={2}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {isLocationsValid && originLocation && destinationLocation && (
                <>
                  <Marker position={[originLocation.lat, originLocation.lon]}>
                    <Popup>{originLocation.display_name}</Popup>
                  </Marker>
                  <Marker position={[destinationLocation.lat, destinationLocation.lon]}>
                    <Popup>{destinationLocation.display_name}</Popup>
                  </Marker>
                  <Polyline
                    positions={[
                      [originLocation.lat, originLocation.lon],
                      [destinationLocation.lat, destinationLocation.lon]
                    ]}
                    color="blue"
                  />
                </>
              )}
            </MapContainer>
            {!isLocationsValid && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center p-4 bg-gray-900 rounded-lg">
                  <AlertCircle className="w-12 h-12 text-warning-500 mx-auto mb-2" />
                  <p className="text-warning-500">Could not find valid locations</p>
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {tripDetails && (
              <>
                {/* Route Details */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Route Information</h3>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={16} />
                    <span>{tripDetails.route.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">{tripDetails.route.origin} → {tripDetails.route.destination}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">Distance: {tripDetails.route.distance}km</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">Price: Rp {tripDetails.route.price.toLocaleString()}</span>
                  </div>
                </div>

                {/* Schedule Details */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Schedule</h3>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock size={16} />
                    <span>{formatDate(tripDetails.departureTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">Departure: {formatTime(tripDetails.departureTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">Arrival: {formatTime(tripDetails.arrivalTime)}</span>
                  </div>
                </div>

                {/* Bus Details */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Bus Information</h3>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Bus size={16} />
                    <span>{tripDetails.bus.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">Plate Number: {tripDetails.bus.plateNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">Type: {tripDetails.bus.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">Capacity: {tripDetails.bus.capacity} seats</span>
                  </div>
                </div>

                {/* Driver Details */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Driver Information</h3>
                  <div className="flex items-center gap-2 text-gray-400">
                    <User size={16} />
                    <span>{tripDetails.driver.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">Phone: {tripDetails.driver.phone}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TripDetailsModal; 