
import { toast } from 'sonner';

interface Location {
  latitude: number;
  longitude: number;
}

interface Supplier {
  id: number;
  name: string;
  location: string;
  coordinates?: Location;
}

// Mock supplier locations (in a real app, these would come from your database)
const supplierLocations: Array<Supplier & { coordinates: Location }> = [
  {
    id: 1,
    name: "Mario's Pizzeria",
    location: 'Downtown District',
    coordinates: { latitude: 40.7128, longitude: -74.0060 }
  },
  {
    id: 2,
    name: "Sushi Master",
    location: 'City Center',
    coordinates: { latitude: 40.7589, longitude: -73.9851 }
  },
  {
    id: 3,
    name: "Burger House",
    location: 'Mall Area',
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

// Send notification to nearby suppliers
async function notifyNearbySuppliers(userLocation: Location) {
  const nearbySuppliers = supplierLocations.filter(supplier => {
    const distance = calculateDistance(
      userLocation.latitude, 
      userLocation.longitude,
      supplier.coordinates.latitude,
      supplier.coordinates.longitude
    );
    return distance <= 5; // Within 5km radius
  });

  nearbySuppliers.forEach(async (supplier) => {
    // In a real app, you would send this notification via your backend
    console.log(`Notifying ${supplier.name}: New customer nearby at ${supplier.location}`);
    
    // Mock API call to notify supplier
    try {
      // This would be your actual API endpoint
      const response = await fetch('/api/notify-supplier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId: supplier.id,
          message: `New customer is browsing GourmetGo near your location (${supplier.location}). Great opportunity to showcase your products!`,
          customerLocation: userLocation,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        console.log(`Successfully notified ${supplier.name}`);
      }
    } catch (error) {
      console.error(`Failed to notify ${supplier.name}:`, error);
    }
  });

  if (nearbySuppliers.length > 0) {
    toast.success(`Notified ${nearbySuppliers.length} nearby supplier(s) about your visit!`);
  }
}

// Get user's location and notify suppliers
export const initializeLocationService = () => {
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by this browser.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation: Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      console.log('User location detected:', userLocation);
      notifyNearbySuppliers(userLocation);
    },
    (error) => {
      console.error('Error getting location:', error);
      // Fallback: use mock location for demo purposes
      const mockLocation: Location = {
        latitude: 40.7128, // New York coordinates
        longitude: -74.0060
      };
      notifyNearbySuppliers(mockLocation);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 600000 // 10 minutes
    }
  );
};

// Export for use in components
export { notifyNearbySuppliers, calculateDistance };
