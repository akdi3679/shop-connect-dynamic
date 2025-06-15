
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Hand } from 'lucide-react';
import { SignaturePad } from '@/components/SignaturePad';

interface CartProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const CurrencyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" className="inline-block">
    <text x="40" y="95" fontSize="80" fontFamily="Amiri, serif" direction="rtl">&#x062F;</text>
    <text x="15" y="58" fontSize="50" fontFamily="Amiri, serif" transform="rotate(90 15,58)">ا</text>
    <text x="15" y="65" fontSize="50" fontFamily="Amiri, serif" transform="rotate(90 15,65)">ا</text>
  </svg>
);

export const Cart = ({ isOpen, onOpenChange }: CartProps) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [showSignature, setShowSignature] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col bg-white/90 backdrop-blur-lg border-l border-white/30 shadow-2xl w-full sm:max-w-sm">
        {cartItems.length > 0 && (
          <Button
            variant="ghost"
            onClick={clearCart}
            className="absolute top-5 right-14 text-sm font-medium text-black hover:text-red-600 hover:bg-red-50 px-2 py-1 h-auto rounded-md"
          >
            Clear
          </Button>
        )}
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold text-black">Your Cart</SheetTitle>
        </SheetHeader>
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover shadow-sm" />
                    <div className="flex-grow">
                      <p className="font-semibold text-black">{item.name}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <CurrencyIcon />
                        <span>{item.price.toFixed(2)}</span>
                      </div>
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
                      className="rounded-full hover:bg-red-50 text-black hover:text-red-600 h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto pt-4 border-t border-white/20">
              <div className="w-full space-y-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                  <div className="flex justify-between items-center font-bold text-xl text-black">
                    <span>Total</span>
                    <div className="flex items-center gap-1">
                      <CurrencyIcon />
                      <span>{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <span>Shipping cost:</span>
                      <CurrencyIcon />
                      <span>7.00</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Hand className="h-3 w-3" />
                      <span className="font-script italic">Premium Quality</span>
                    </div>
                  </div>
                  
                  {/* Signature Section */}
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowSignature(!showSignature)}
                        className="text-xs h-6 px-2 text-gray-600 hover:text-black"
                      >
                        Sign
                      </Button>
                      {signature && (
                        <div className="w-16 h-8 border border-gray-200 rounded bg-white">
                          <img src={signature} alt="Signature" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                    
                    {showSignature && (
                      <div className="mt-2">
                        <SignaturePad 
                          onSignatureChange={setSignature}
                          onClose={() => setShowSignature(false)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <Button className="w-full rounded-xl bg-black hover:bg-gray-800 text-white font-semibold py-3">
                  Proceed to Checkout
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center bg-white/80 backdrop-blur-sm rounded-xl p-8 m-4 border border-white/30">
            <p className="text-lg font-semibold text-black">Your cart is empty</p>
            <p className="text-gray-600 mt-2">Add some delicious items to get started!</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
