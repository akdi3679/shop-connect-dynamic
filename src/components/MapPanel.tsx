
import { useState, useEffect } from 'react';
import { X, MapPin, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Restaurant {
  id: number;
  name: string;
  address: string;
  distance: number;
  estimatedTime: number;
  coordinates: { lat: number; lng: number };
}

interface MapPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: "GourmetGo Downtown",
    address: "123 Main Street, Downtown",
    distance: 0.8,
    estimatedTime: 12,
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: 2,
    name: "GourmetGo City Center",
    address: "456 Oak Avenue, City Center",
    distance: 1.2,
    estimatedTime: 18,
    coordinates: { lat: 40.7589, lng: -73.9851 }
  },
  {
    id: 3,
    name: "GourmetGo Mall",
    address: "789 Pine Road, Shopping Mall",
    distance: 2.1,
    estimatedTime: 25,
    coordinates: { lat: 40.7505, lng: -73.9934 }
  }
];

export const MapPanel = ({ isOpen, onClose }: MapPanelProps) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestRestaurants, setNearestRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(location);
            
            // Sort restaurants by distance (mock calculation)
            const sorted = [...mockRestaurants].sort((a, b) => a.distance - b.distance);
            setNearestRestaurants(sorted);
          },
          (error) => {
            console.error('Error getting location:', error);
            // Use mock location
            setUserLocation({ lat: 40.7128, lng: -74.0060 });
            setNearestRestaurants(mockRestaurants);
          }
        );
      } else {
        // Fallback to mock data
        setUserLocation({ lat: 40.7128, lng: -74.0060 });
        setNearestRestaurants(mockRestaurants);
      }
    }
  }, [isOpen]);

  const openInMaps = (restaurant: Restaurant) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.coordinates.lat},${restaurant.coordinates.lng}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden border border-white/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
              <MapPin className="h-5 w-5 text-black" />
            </div>
            <h2 className="text-xl font-bold text-black">Find Our Restaurants</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-black hover:text-gray-600 rounded-full h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {userLocation && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-black">Your Location</span>
              </div>
              <p className="text-sm text-gray-600">
                Latitude: {userLocation.lat.toFixed(4)}, Longitude: {userLocation.lng.toFixed(4)}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold text-black flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Nearest Restaurants
            </h3>
            {nearestRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/30 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-black">{restaurant.name}</h4>
                  <span className="text-sm font-medium text-green-600">
                    {restaurant.distance} km
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{restaurant.address}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>{restaurant.estimatedTime} min</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => openInMaps(restaurant)}
                    className="bg-black hover:bg-gray-800 text-white rounded-xl px-4 py-1 text-xs"
                  >
                    Get Directions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
