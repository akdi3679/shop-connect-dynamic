
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Navigation, Clock } from 'lucide-react';
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
  estimatedTime: number; // in minutes
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
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestRestaurant, setNearestRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to NYC location
          setUserLocation([40.7128, -74.0060]);
          setNearestRestaurant(restaurants[0]);
        }
      );
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] bg-white/95 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Navigation className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Find Our Restaurants</h2>
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

        <CardContent className="p-0 h-full">
          <div className="flex h-full">
            {/* Map */}
            <div className="flex-1 relative">
              {userLocation && (
                <MapContainer
                  center={userLocation}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-bl-3xl"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* User location */}
                  <Marker position={userLocation}>
                    <Popup>Your Location</Popup>
                  </Marker>
                  <Circle
                    center={userLocation}
                    radius={500}
                    fillColor="blue"
                    fillOpacity={0.1}
                    color="blue"
                    weight={2}
                  />
                  
                  {/* Restaurant locations */}
                  {restaurants.map(restaurant => (
                    <Marker key={restaurant.id} position={[restaurant.lat, restaurant.lng]}>
                      <Popup>
                        <div className="text-center">
                          <h3 className="font-semibold">{restaurant.name}</h3>
                          <p className="text-sm text-gray-600">{restaurant.address}</p>
                          <p className="text-sm text-blue-600 font-medium">
                            ~{restaurant.estimatedTime} min delivery
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>

            {/* Nearest restaurant info */}
            <div className="w-80 p-6 bg-gradient-to-br from-gray-50 to-white border-l border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearest Restaurant</h3>
              
              {nearestRestaurant && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-2">{nearestRestaurant.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{nearestRestaurant.address}</p>
                    
                    <div className="flex items-center gap-2 text-green-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Estimated delivery: {nearestRestaurant.estimatedTime} minutes
                      </span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl">
                    Order from this location
                  </Button>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">All Locations</h4>
                <div className="space-y-2">
                  {restaurants.map(restaurant => (
                    <div key={restaurant.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{restaurant.name}</span>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{restaurant.estimatedTime}min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
