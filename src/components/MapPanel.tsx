
import { useState, useEffect } from 'react';
import { X, MapPin, Clock, Navigation } from 'lucide-react';
import { Button } from './ui/button';

interface MapPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Restaurant {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  estimatedTime: string;
  distance: string;
}

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "GourmetGo Downtown",
    address: "123 Main Street, Downtown",
    lat: 40.7128,
    lng: -74.0060,
    estimatedTime: "15-20 mins",
    distance: "1.2 km"
  },
  {
    id: 2,
    name: "GourmetGo Mall",
    address: "456 Shopping Center, Mall Area",
    lat: 40.7505,
    lng: -73.9934,
    estimatedTime: "25-30 mins",
    distance: "2.8 km"
  },
  {
    id: 3,
    name: "GourmetGo City Center",
    address: "789 Central Plaza, City Center",
    lat: 40.7589,
    lng: -73.9851,
    estimatedTime: "10-15 mins",
    distance: "0.8 km"
  }
];

export const MapPanel = ({ isOpen, onClose }: MapPanelProps) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestRestaurant, setNearestRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          
          // Find nearest restaurant (simplified calculation)
          const nearest = restaurants.reduce((prev, current) => {
            const prevDistance = Math.abs(prev.lat - location.lat) + Math.abs(prev.lng - location.lng);
            const currentDistance = Math.abs(current.lat - location.lat) + Math.abs(current.lng - location.lng);
            return currentDistance < prevDistance ? current : prev;
          });
          setNearestRestaurant(nearest);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use default location (New York)
          setUserLocation({ lat: 40.7128, lng: -74.0060 });
          setNearestRestaurant(restaurants[0]);
        }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Find Us</h2>
              <p className="text-sm text-gray-600">Locate the nearest GourmetGo restaurant</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Map Container */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200/50">
            <div className="flex items-center justify-center h-64 bg-white/50 rounded-xl border-2 border-dashed border-blue-300">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Interactive Map</p>
                <p className="text-sm text-gray-500">Your location and nearby restaurants</p>
              </div>
            </div>
          </div>

          {/* Location Info */}
          {nearestRestaurant && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200/50">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Navigation className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{nearestRestaurant.name}</h3>
                  <p className="text-gray-600 mb-3">{nearestRestaurant.address}</p>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {nearestRestaurant.estimatedTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {nearestRestaurant.distance} away
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Locations */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">All Locations</h4>
            <div className="grid gap-3">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl border border-gray-200/50 hover:bg-white/80 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{restaurant.name}</p>
                    <p className="text-sm text-gray-600">{restaurant.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{restaurant.estimatedTime}</p>
                    <p className="text-xs text-gray-500">{restaurant.distance}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
