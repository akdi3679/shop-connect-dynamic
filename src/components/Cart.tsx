
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const Cart = ({ isOpen, onOpenChange }: CartProps) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col bg-white/90 backdrop-blur-md border-l border-white/20 shadow-2xl w-full sm:max-w-md">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold text-black">Your Cart</SheetTitle>
        </SheetHeader>
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/30 shadow-sm">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover shadow-sm" />
                    <div className="flex-grow">
                      <p className="font-semibold text-black">{item.name}</p>
                      <p className="text-sm text-gray-700">{item.price.toFixed(2)} د</p>
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
                      className="rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto pt-4 border-t border-white/20">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-bold text-xl text-black bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                  <span>Total</span>
                  <span>{cartTotal.toFixed(2)} د</span>
                </div>
                <Button className="w-full rounded-xl bg-black hover:bg-gray-800 text-white font-semibold py-3">
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl border-gray-300 hover:bg-gray-50 text-black font-semibold py-3" 
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-sm rounded-xl p-8 m-4 border border-white/30">
            <p className="text-lg font-semibold text-black">Your cart is empty</p>
            <p className="text-gray-600 mt-2">Add some delicious items to get started!</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
