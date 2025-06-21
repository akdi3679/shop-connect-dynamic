
import { useState, useEffect } from 'react';
import { ShoppingCart, UtensilsCrossed, Settings, Map } from 'lucide-react';
import { Button } from './ui/button';
import { Cart } from './Cart';
import { MapPanel } from './MapPanel';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const { cartCount } = useCart();

  // Show location notification when site loads
  useEffect(() => {
    const hasShownNotification = localStorage.getItem('locationNotificationShown');
    
    if (!hasShownNotification) {
      const timer = setTimeout(() => {
        toast.success(
          <div className="flex items-center space-x-3 bg-white backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-lg w-full">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Map className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-black">Find Our Nearest Restaurant!</p>
              <p className="text-sm text-gray-600">
                Click here to see directions and delivery times
              </p>
            </div>
          </div>,
          {
            style: {
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              padding: '0',
            },
            className: 'bg-transparent border-none shadow-none p-0 cursor-pointer',
            onClick: () => {
              setIsMapOpen(true);
            },
            duration: 8000,
          }
        );
        localStorage.setItem('locationNotificationShown', 'true');
      }, 3000);

      return () => clearTimeout(timer);
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
              title="Find Restaurant"
            >
              <Map className="h-5 w-5" />
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
