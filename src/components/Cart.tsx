
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

const CurrencyIcon = ({ className = "w-6 h-6", color = "inherit" }: { className?: string; color?: string }) => (
  <svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" className={className} style={{ color }}>
    <text x="40" y="95" fontSize="80" fontFamily="Amiri, serif" direction="rtl" fill="currentColor">&#x062F;</text>
    <text x="15" y="58" fontSize="50" fontFamily="Amiri, serif" transform="rotate(90 15,58)" fill="currentColor">ا</text>
    <text x="15" y="65" fontSize="50" fontFamily="Amiri, serif" transform="rotate(90 15,65)" fill="currentColor">ا</text>
  </svg>
);

const DefaultSignatureIcon = () => (
  <svg viewBox="0 0 1024 1024" className="w-12 h-12" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path d="M827.733333 601.6C885.333333 529.066667 960 428.8 960 256c0-12.8-8.533333-21.333333-21.333333-21.333333s-21.333333 8.533333-21.333334 21.333333c0 142.933333-53.333333 228.266667-106.666666 296.533333-12.8-40.533333-21.333333-89.6-21.333334-147.2 0-10.666667-8.533333-21.333333-21.333333-21.333333-10.666667 0-21.333333 8.533333-21.333333 21.333333-2.133333 36.266667-12.8 76.8-21.333334 81.066667-8.533333 0-19.2-29.866667-21.333333-59.733333 0-10.666667-10.666667-19.2-21.333333-19.2s-21.333333 6.4-21.333334 19.2c-6.4 36.266667-23.466667 87.466667-42.666666 87.466666-8.533333 0-12.8-2.133333-14.933334-6.4-6.4-6.4-8.533333-21.333333-8.533333-34.133333 0-8.533333 2.133333-17.066667 2.133333-25.6 0-10.666667-8.533333-21.333333-19.2-21.333333s-21.333333 6.4-23.466666 17.066666c0 2.133333-2.133333 10.666667-2.133334 23.466667-4.266667 36.266667-17.066667 108.8-61.866666 108.8-14.933333 0-23.466667-4.266667-29.866667-14.933333-10.666667-17.066667-10.666667-44.8 0-70.4v-2.133334c2.133333-2.133333 2.133333-6.4 4.266667-8.533333 17.066667-34.133333 36.266667-53.333333 68.266666-53.333333 12.8 0 21.333333-8.533333 21.333334-21.333334s-8.533333-21.333333-21.333334-21.333333c-89.6 0-115.2 87.466667-140.8 170.666667-29.866667 102.4-57.6 170.666667-136.533333 170.666666-108.8 0-149.333333-140.8-149.333333-234.666666 0-183.466667 100.266667-298.666667 192-298.666667 61.866667 0 85.333333 49.066667 87.466666 51.2 4.266667 10.666667 17.066667 14.933333 27.733334 10.666667 10.666667-4.266667 14.933333-17.066667 10.666666-27.733334-2.133333-4.266667-36.266667-76.8-125.866666-76.8C183.466667 149.333333 64 277.333333 64 490.666667c0 219.733333 125.866667 277.333333 192 277.333333 108.8 0 145.066667-96 172.8-181.333333 14.933333 19.2 36.266667 32 61.866667 32 46.933333 0 74.666667-34.133333 89.6-76.8 10.666667 8.533333 23.466667 12.8 38.4 12.8 29.866667 0 51.2-25.6 64-51.2 8.533333 14.933333 23.466667 25.6 42.666666 25.6 12.8 0 23.466667-6.4 32-14.933334 6.4 29.866667 14.933333 57.6 21.333334 81.066667-29.866667 38.4-53.333333 70.4-53.333334 108.8 0 36.266667 27.733333 64 64 64 38.4 0 64-34.133333 64-64 0-27.733333-10.666667-57.6-23.466666-91.733333 0-4.266667-2.133333-6.4-2.133334-10.666667zM789.333333 725.333333c-14.933333 0-21.333333-10.666667-21.333333-21.333333 0-19.2 10.666667-38.4 27.733333-61.866667 8.533333 25.6 14.933333 44.8 14.933334 61.866667 0 6.4-6.4 21.333333-21.333334 21.333333z" fill="#1565C0"></path>
      <path d="M64 853.333333h896v42.666667H64z" fill="#90A4AE"></path>
    </g>
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
                        <CurrencyIcon className="w-6 h-6" color="#374151" />
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
                      <CurrencyIcon className="w-8 h-8" color="#000000" />
                      <span>{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <span>Shipping cost:</span>
                      <CurrencyIcon className="w-4 h-4" color="#6B7280" />
                      <span>7.00</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Hand className="h-3 w-3" />
                      <span className="font-script italic">Premium Quality</span>
                    </div>
                  </div>
                  
                  {/* Signature Section */}
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div className="flex flex-col items-center space-y-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowSignature(!showSignature)}
                        className="text-xs h-6 px-3 text-gray-600 hover:text-black"
                      >
                        Sign
                      </Button>
                      
                      {!showSignature && (
                        <div className="flex justify-center">
                          {signature ? (
                            <div className="w-24 h-12 border border-gray-200 rounded bg-white">
                              <img src={signature} alt="Signature" className="w-full h-full object-contain" />
                            </div>
                          ) : (
                            <DefaultSignatureIcon />
                          )}
                        </div>
                      )}
                      
                      {showSignature && (
                        <div className="w-full">
                          <SignaturePad 
                            onSignatureChange={setSignature}
                            onClose={() => setShowSignature(false)}
                          />
                        </div>
                      )}
                    </div>
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
