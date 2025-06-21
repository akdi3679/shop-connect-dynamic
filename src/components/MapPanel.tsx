
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Navigation, Clock, MapPin, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Restaurant {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  estimatedTime: number;
}

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "GourmetGo Downtown",
    lat: 40.7128,
    lng: -74.0060,
    address: "123 Broadway, New York, NY",
    estimatedTime: 15
  },
  {
    id: 2,
    name: "GourmetGo Midtown",
    lat: 40.7589,
    lng: -73.9851,
    address: "456 5th Avenue, New York, NY",
    estimatedTime: 22
  },
  {
    id: 3,
    name: "GourmetGo Brooklyn",
    lat: 40.6782,
    lng: -73.9442,
    address: "789 Atlantic Ave, Brooklyn, NY",
    estimatedTime: 35
  }
];

export const MapPanel: React.FC<MapPanelProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestRestaurant, setNearestRestaurant] = useState<Restaurant | null>(null);
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    console.log('MapPanel opened, getting location...');
    
    // Reset states when opening
    setIsLocationReady(false);
    setLocationError(null);

    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location obtained:', position.coords);
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setUserLocation([userLat, userLng]);
          
          // Find nearest restaurant
          let nearest = restaurants[0];
          let minDistance = calculateDistance(userLat, userLng, nearest.lat, nearest.lng);
          
          restaurants.forEach(restaurant => {
            const distance = calculateDistance(userLat, userLng, restaurant.lat, restaurant.lng);
            if (distance < minDistance) {
              minDistance = distance;
              nearest = restaurant;
            }
          });
          
          setNearestRestaurant(nearest);
          setIsLocationReady(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError(error.message);
          // Fallback to NYC location
          setUserLocation([40.7128, -74.0060]);
          setNearestRestaurant(restaurants[0]);
          setIsLocationReady(true);
        },
        options
      );
    } else {
      console.log('Geolocation not supported, using fallback');
      setUserLocation([40.7128, -74.0060]);
      setNearestRestaurant(restaurants[0]);
      setIsLocationReady(true);
    }
  }, [isOpen]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[85vh] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-[2.5rem] overflow-hidden animate-scale-in">
        {/* iOS-style header */}
        <div className="flex items-center justify-between p-6 pb-4 bg-white/5 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Find Restaurants</h1>
              <p className="text-sm text-white/70 font-medium">Discover nearby GourmetGo locations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme toggle button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white transition-all duration-200"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Map Container */}
          <div className="flex-1 relative overflow-hidden rounded-bl-[2.5rem]">
            {isLocationReady && userLocation ? (
              <div key={`map-${userLocation[0]}-${userLocation[1]}-${Date.now()}`} className="h-full w-full">
                <MapContainer
                  center={userLocation}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-bl-[2.5rem]"
                  attributionControl={false}
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  <Marker position={userLocation}>
                    <Popup>
                      <div className="text-center font-medium">
                        <p className="text-blue-600">📍 Your Location</p>
                      </div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={userLocation}
                    radius={500}
                    fillColor="blue"
                    fillOpacity={0.1}
                    color="blue"
                    weight={2}
                  />
                  
                  {restaurants.map(restaurant => (
                    <Marker key={restaurant.id} position={[restaurant.lat, restaurant.lng]}>
                      <Popup>
                        <div className="text-center p-2">
                          <h3 className="font-bold text-gray-900 mb-1">{restaurant.name}</h3>
                          <p className="text-xs text-gray-600 mb-2">{restaurant.address}</p>
                          <div className="flex items-center justify-center gap-1 text-green-600">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs font-semibold">~{restaurant.estimatedTime} min</span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-bl-[2.5rem]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 mx-auto">
                    <Navigation className="h-8 w-8 text-gray-400 animate-pulse" />
                  </div>
                  <p className="text-gray-600 font-medium">
                    {locationError ? `Location error: ${locationError}` : 'Loading your location...'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Current theme: {theme}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-white/5 backdrop-blur-sm border-l border-white/10 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Theme info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <h3 className="text-md font-semibold text-white mb-2">Theme Status</h3>
                <p className="text-white/70 text-sm">Current: {theme}</p>
                <Button
                  onClick={toggleTheme}
                  className="mt-2 w-full bg-white/20 hover:bg-white/30 text-white border-0"
                  variant="outline"
                >
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                </Button>
              </div>

              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Nearest Location
                </h2>
                
                {nearestRestaurant && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
                    <h3 className="font-bold text-white text-lg mb-2">{nearestRestaurant.name}</h3>
                    <p className="text-white/70 text-sm mb-3 leading-relaxed">{nearestRestaurant.address}</p>
                    
                    <div className="flex items-center gap-2 text-green-400 mb-4">
                      <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold">
                        {nearestRestaurant.estimatedTime} min delivery
                      </span>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl py-3 shadow-lg transition-all duration-200 hover:shadow-xl">
                      Order Now
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-white/70" />
                  All Locations
                </h3>
                <div className="space-y-2">
                  {restaurants.map(restaurant => (
                    <div key={restaurant.id} 
                         className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all duration-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium text-sm">{restaurant.name}</p>
                          <p className="text-white/60 text-xs">{restaurant.address.split(',')[0]}</p>
                        </div>
                        <div className="flex items-center gap-1 text-white/70">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{restaurant.estimatedTime}m</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
