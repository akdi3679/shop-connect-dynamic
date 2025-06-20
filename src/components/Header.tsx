
import { useState } from 'react';
import { ShoppingCart, UtensilsCrossed, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Cart } from './Cart';
import { useCart } from '@/contexts/CartContext';

export const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();

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
    </>
  );
};
