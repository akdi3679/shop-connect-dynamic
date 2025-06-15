
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const Cart = ({ isOpen, onOpenChange }: CartProps) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col bg-white/90 backdrop-blur-md border-l border-white/20 shadow-2xl w-full sm:max-w-sm">
        <SheetHeader className="pb-4 flex flex-row items-center justify-between">
          <SheetTitle className="text-xl font-bold text-black">Your Cart</SheetTitle>
          {cartItems.length > 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearCart}
              className="rounded-full hover:bg-red-50 text-red-500 hover:text-red-600 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </SheetHeader>
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 rounded-xl p-3">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover shadow-sm" />
                    <div className="flex-grow">
                      <p className="font-semibold text-black">{item.name}</p>
                      <p className="text-sm text-gray-700">د {item.price.toFixed(2)}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="h-8 w-16 rounded-lg bg-white/80 border-white/30 text-black"
                        />
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFromCart(item.id)}
                      className="rounded-full hover:bg-red-50 text-red-500 hover:text-red-600 h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto pt-4 border-t border-white/20">
              <div className="w-full space-y-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                  <div className="flex justify-between font-bold text-xl text-black">
                    <span>Total</span>
                    <span>د {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-600">Shipping cost: د 7.00</p>
                    <div className="text-xs text-gray-500 font-script italic">✨ Premium Quality</div>
                  </div>
                </div>
                <Button className="w-full rounded-xl bg-black hover:bg-gray-800 text-white font-semibold py-3">
                  Proceed to Checkout
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center rounded-xl p-8 m-4">
            <p className="text-lg font-semibold text-black">Your cart is empty</p>
            <p className="text-gray-600 mt-2">Add some delicious items to get started!</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
