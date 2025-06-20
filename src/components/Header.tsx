
import { useState, useEffect } from 'react';
import { ShoppingCart, UtensilsCrossed, Settings, MapPin, X, Navigation, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Cart } from './Cart';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface Location {
  latitude: number;
  longitude: number;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  distance: number;
  estimatedTime: number;
  coordinates: Location;
}

// Mock restaurant data
const restaurants: Array<Restaurant & { coordinates: Location }> = [
  {
    id: '1',
    name: "Mario's Pizzeria",
    address: '123 Downtown St, City Center',
    distance: 1.2,
    estimatedTime: 15,
    coordinates: { latitude: 40.7128, longitude: -74.0060 }
  },
  {
    id: '2',
    name: "Sushi Master",
    address: '456 Main Ave, Business District',
    distance: 2.1,
    estimatedTime: 25,
    coordinates: { latitude: 40.7589, longitude: -73.9851 }
  },
  {
    id: '3',
    name: "Burger House",
    address: '789 Mall Road, Shopping Center',
    distance: 0.8,
    estimatedTime: 12,
    coordinates: { latitude: 40.7505, longitude: -73.9934 }
  }
];

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearestRestaurant, setNearestRestaurant] = useState<Restaurant | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { cartCount } = useCart();

  const openDashboard = () => {
    window.open('/dashboard', '_blank');
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setUserLocation(location);
        setLocationError(null);
        findNearestRestaurant(location);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Unable to get your location. Please enable location services.');
        // Use mock location for demo
        const mockLocation = { latitude: 40.7128, longitude: -74.0060 };
        setUserLocation(mockLocation);
        findNearestRestaurant(mockLocation);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  };

  const findNearestRestaurant = (location: Location) => {
    const restaurantsWithDistance = restaurants.map(restaurant => ({
      ...restaurant,
      distance: calculateDistance(
        location.latitude,
        location.longitude,
        restaurant.coordinates.latitude,
        restaurant.coordinates.longitude
      ),
      estimatedTime: Math.round(calculateDistance(
        location.latitude,
        location.longitude,
        restaurant.coordinates.latitude,
        restaurant.coordinates.longitude
      ) * 8 + 5) // Rough estimation: 8 minutes per km + 5 minutes base
    }));

    const nearest = restaurantsWithDistance.reduce((prev, current) => 
      prev.distance < current.distance ? prev : current
    );

    setNearestRestaurant(nearest);
  };

  const handleMapOpen = () => {
    setIsMapOpen(true);
    if (!userLocation) {
      getUserLocation();
    }
  };

  // Show notification about nearest restaurant when site opens
  useEffect(() => {
    const hasShownNotification = localStorage.getItem('gourmetgo-location-notification');
    
    if (!hasShownNotification) {
      setTimeout(() => {
        getUserLocation();
        toast.success(
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-semibold">Welcome to GourmetGo!</p>
              <p className="text-sm text-gray-600">We've found restaurants near you. Click the map icon to see more!</p>
            </div>
          </div>,
          {
            duration: 5000,
          }
        );
        localStorage.setItem('gourmetgo-location-notification', 'true');
      }, 2000);
    }
  }, []);

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <a href="/" className="flex items-center space-x-2">
            <UtensilsCrossed className="h-6 w-6" />
            <span className="font-bold">GourmetGo</span>
          </a>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleMapOpen}
              title="Find Restaurants"
            >
              <MapPin className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={openDashboard}
              title="Dashboard"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsCartOpen(true)} 
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Map Panel */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Restaurant Locator</h3>
                  <p className="text-sm text-gray-600">Find the nearest GourmetGo restaurant</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMapOpen(false)}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* User Location */}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Your Location</h4>
                </div>
                {locationError ? (
                  <div className="text-sm text-red-600">
                    <p>{locationError}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={getUserLocation}
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : userLocation ? (
                  <div className="text-sm text-blue-800">
                    <p>📍 Location detected successfully</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Lat: {userLocation.latitude.toFixed(4)}, Lng: {userLocation.longitude.toFixed(4)}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    <span>Getting your location...</span>
                  </div>
                )}
              </div>

              {/* Nearest Restaurant */}
              {nearestRestaurant && (
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <UtensilsCrossed className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-900">Nearest Restaurant</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-semibold text-green-900">{nearestRestaurant.name}</h5>
                      <p className="text-sm text-green-700">{nearestRestaurant.address}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-green-700">
                        <MapPin className="h-4 w-4" />
                        <span>{nearestRestaurant.distance.toFixed(1)} km away</span>
                      </div>
                      <div className="flex items-center space-x-1 text-green-700">
                        <Clock className="h-4 w-4" />
                        <span>~{nearestRestaurant.estimatedTime} min</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        toast.success(`Opening directions to ${nearestRestaurant.name}!`);
                        setIsMapOpen(false);
                      }}
                    >
                      Get Directions
                    </Button>
                  </div>
                </div>
              )}

              {/* All Restaurants */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-3">All Locations</h4>
                <div className="space-y-3">
                  {restaurants.map((restaurant) => (
                    <div key={restaurant.id} className="bg-white rounded-lg p-3 border">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{restaurant.name}</h5>
                          <p className="text-xs text-gray-600 mt-1">{restaurant.address}</p>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <p>{restaurant.distance.toFixed(1)} km</p>
                          <p>~{restaurant.estimatedTime} min</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Cart isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};
