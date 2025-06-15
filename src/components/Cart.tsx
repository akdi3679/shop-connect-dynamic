
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Trash2, Hand } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const Cart = ({ isOpen, onOpenChange }: CartProps) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col bg-white/20 backdrop-blur-[20px] border-l border-white/30 shadow-2xl w-full sm:max-w-xs overflow-hidden">
        <SheetHeader className="pb-4 flex flex-row items-center justify-between relative">
          {cartItems.length > 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearCart}
              className="absolute left-0 rounded-full hover:bg-white/20 text-black hover:text-black h-8 w-8 backdrop-blur-sm"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <SheetTitle className="text-xl font-bold text-black flex-1 text-center">Your Cart</SheetTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)}
            className="absolute right-0 rounded-full hover:bg-white/20 text-black hover:text-black h-8 w-8 backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 rounded-xl p-3 bg-white/10 backdrop-blur-sm border border-white/20">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover shadow-sm" />
                    <div className="flex-grow">
                      <p className="font-semibold text-black">{item.name}</p>
                      <p className="text-sm text-gray-800">د {item.price.toFixed(2)}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="h-8 w-16 rounded-lg bg-white/50 backdrop-blur-sm border-white/40 text-black"
                        />
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFromCart(item.id)}
                      className="rounded-full hover:bg-red-50/80 text-black hover:text-red-600 h-8 w-8 backdrop-blur-sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto pt-4 border-t border-white/30">
              <div className="w-full space-y-4">
                <div className="bg-white/30 backdrop-blur-lg rounded-xl p-4 border border-white/40 shadow-lg">
                  <div className="flex justify-between font-bold text-xl text-black">
                    <span>Total</span>
                    <span>د {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-700">Shipping: د 7.00</p>
                    <Hand className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                <Button className="w-full rounded-xl bg-black/80 backdrop-blur-sm hover:bg-black/90 text-white font-semibold py-3 border border-white/20">
                  Proceed to Checkout
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center rounded-xl p-8 m-4 bg-white/10 backdrop-blur-sm border border-white/20">
            <p className="text-lg font-semibold text-black">Your cart is empty</p>
            <p className="text-gray-700 mt-2">Add some delicious items to get started!</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
