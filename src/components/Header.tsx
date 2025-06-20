
import { useState, useEffect } from 'react';
import { ShoppingCart, UtensilsCrossed, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Cart } from './Cart';
import { MapPanel } from './MapPanel';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

// Map icon SVG component
const MapIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="3 6 9 1 15 6 21 1 21 18 15 23 9 18 3 23"></polygon>
    <line x1="9" y1="1" x2="9" y2="18"></line>
    <line x1="15" y1="6" x2="15" y2="23"></line>
  </svg>
);

export const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    // Show notification about nearest restaurants when site opens
    const hasShownNotification = sessionStorage.getItem('restaurantNotificationShown');
    
    if (!hasShownNotification) {
      setTimeout(() => {
        toast(
          <div className="flex items-center space-x-3 bg-white backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-lg w-full">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <MapIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-black">Restaurants Near You!</p>
              <p className="text-sm text-gray-600">Find the closest GourmetGo location</p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setIsMapOpen(true);
                toast.dismiss();
              }}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-3 py-1 text-xs"
            >
              View Map
            </Button>
          </div>,
          {
            duration: 8000,
            style: {
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              padding: '0',
            },
            className: 'bg-transparent border-none shadow-none p-0',
          }
        );
        sessionStorage.setItem('restaurantNotificationShown', 'true');
      }, 2000);
    }
  }, []);

  const openDashboard = () => {
    window.open('/dashboard', '_blank');
  };

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
              onClick={() => setIsMapOpen(true)}
              title="Find Restaurants"
            >
              <MapIcon />
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
      <Cart isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
      <MapPanel isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
    </>
  );
};
