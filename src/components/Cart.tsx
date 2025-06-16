
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, X, CreditCard, Banknote, MapPin, User } from 'lucide-react';
import { SignaturePad } from '@/components/SignaturePad';

interface CartProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const CurrencyIcon = ({ className = "w-6 h-6", color = "inherit" }: { className?: string; color?: string }) => (
  <svg width="2.5em" height="2.5em" viewBox="0 0 100 100" style={{ verticalAlign: 'middle', display: 'inline-block' }} className={className}>
    <text x="70" y="80" fontSize="80" fontFamily="Amiri, serif" direction="rtl"
          fill={color} stroke={color} strokeWidth="1" paintOrder="stroke">&#x062F;</text>
    
    <text x="47" y="39" fontSize="50" fontFamily="Amiri, serif" transform="rotate(90 45,39)"
          fill={color} stroke={color} strokeWidth="1.5" paintOrder="stroke">ا</text>
    <text x="47" y="47" fontSize="50" fontFamily="Amiri, serif" transform="rotate(90 45,47)"
          fill={color} stroke={color} strokeWidth="1.5" paintOrder="stroke">ا</text>
  </svg>
);

const DefaultSignatureIcon = () => (
  <svg viewBox="0 0 1024 1024" className="w-16 h-16 opacity-30" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#9CA3AF">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path d="M827.733333 601.6C885.333333 529.066667 960 428.8 960 256c0-12.8-8.533333-21.333333-21.333333-21.333333s-21.333333 8.533333-21.333334 21.333333c0 142.933333-53.333333 228.266667-106.666666 296.533333-12.8-40.533333-21.333333-89.6-21.333334-147.2 0-10.666667-8.533333-21.333333-21.333333-21.333333-10.666667 0-21.333333 8.533333-21.333333 21.333333-2.133333 36.266667-12.8 76.8-21.333334 81.066667-8.533333 0-19.2-29.866667-21.333333-59.733333 0-10.666667-10.666667-19.2-21.333333-19.2s-21.333333 6.4-21.333334 19.2c-6.4 36.266667-23.466667 87.466667-42.666666 87.466666-8.533333 0-12.8-2.133333-14.933334-6.4-6.4-6.4-8.533333-21.333333-8.533333-34.133333 0-8.533333 2.133333-17.066667 2.133333-25.6 0-10.666667-8.533333-21.333333-19.2-21.333333s-21.333333 6.4-23.466666 17.066666c0 2.133333-2.133333 10.666667-2.133334 23.466667-4.266667 36.266667-17.066667 108.8-61.866666 108.8-14.933333 0-23.466667-4.266667-29.866667-14.933333-10.666667-17.066667-10.666667-44.8 0-70.4v-2.133334c2.133333-2.133333 2.133333-6.4 4.266667-8.533333 17.066667-34.133333 36.266667-53.333333 68.266666-53.333333 12.8 0 21.333333-8.533333 21.333334-21.333334s-8.533333-21.333333-21.333334-21.333333c-89.6 0-115.2 87.466667-140.8 170.666667-29.866667 102.4-57.6 170.666667-136.533333 170.666666-108.8 0-149.333333-140.8-149.333333-234.666666 0-183.466667 100.266667-298.666667 192-298.666667 61.866667 0 85.333333 49.066667 87.466666 51.2 4.266667 10.666667 17.066667 14.933333 27.733334 10.666667 10.666667-4.266667 14.933333-17.066667 10.666666-27.733334-2.133333-4.266667-36.266667-76.8-125.866666-76.8C183.466667 149.333333 64 277.333333 64 490.666667c0 219.733333 125.866667 277.333333 192 277.333333 108.8 0 145.066667-96 172.8-181.333333 14.933333 19.2 36.266667 32 61.866667 32 46.933333 0 74.666667-34.133333 89.6-76.8 10.666667 8.533333 23.466667 12.8 38.4 12.8 29.866667 0 51.2-25.6 64-51.2 8.533333 14.933333 23.466667 25.6 42.666666 25.6 12.8 0 23.466667-6.4 32-14.933334 6.4 29.866667 14.933333 57.6 21.333334 81.066667-29.866667 38.4-53.333333 70.4-53.333334 108.8 0 36.266667 27.733333 64 64 64 38.4 0 64-34.133333 64-64 0-27.733333-10.666667-57.6-23.466666-91.733333 0-4.266667-2.133333-6.4-2.133334-10.666667zM789.333333 725.333333c-14.933333 0-21.333333-10.666667-21.333333-21.333333 0-19.2 10.666667-38.4 27.733333-61.866667 8.533333 25.6 14.933333 44.8 14.933334 61.866667 0 6.4-6.4 21.333333-21.333334 21.333333z" fill="#9CA3AF"></path>
      <path d="M64 853.333333h896v42.666667H64z" fill="#9CA3AF"></path>
    </g>
  </svg>
);

const PremiumQualityIcon = () => (
  <svg width="20" height="20" viewBox="2 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }} className="h-4 w-4">
    <path d="M8.97059 0.11779C9.4579 0.377681 9.64225 0.983393 9.38235 1.47069L6.42375 7.0179C6.46754 7.02162 6.51126 7.02592 6.55491 7.0308L11.2929 2.29297C11.6834 1.90245 12.3166 1.90245 12.7071 2.29297C13.0976 2.68348 13.0976 3.31662 12.7071 3.70713L8.65259 7.76152C8.71445 7.80024 8.77559 7.84038 8.83593 7.88194C9.56438 8.38359 10.1416 9.06578 10.5162 9.85418C10.7532 10.353 10.4124 10.9035 9.87637 11.0367C9.34038 11.1699 8.80456 10.8292 8.50275 10.3667C8.29171 10.0433 8.01827 9.7612 7.695 9.53858C7.09429 9.1249 6.36301 8.94518 5.63896 9.0333C4.91492 9.12141 4.2481 9.47127 3.76414 10.017C3.28018 10.5626 3.01251 11.2665 3.01156 11.9958C3.0106 12.7252 3.27643 13.4297 3.75896 13.9767C4.24149 14.5236 4.90739 14.8753 5.63121 14.9653C6.35502 15.0553 7.08676 14.8775 7.68856 14.4654C8.0124 14.2436 8.28658 13.9622 8.49847 13.6394C8.80149 13.1776 9.3382 12.8384 9.87384 12.9729C10.4095 13.1075 10.7489 13.6589 10.5106 14.1571C10.1339 14.9446 9.55491 15.6252 8.82515 16.125C7.81827 16.8145 6.59399 17.112 5.38297 16.9614C4.17195 16.8108 3.05781 16.2225 2.25049 15.3074C1.44461 14.3939 1 13.2177 1 11.9998L1 11.9932C1.00021 11.834 1.00801 11.6756 1.02322 11.5183C1.0714 10.9582 1.18967 10.265 1.33192 9.55372C1.52382 8.59422 1.77804 7.51464 2.02986 6.5074C2.28209 5.49852 2.53402 4.55385 2.72274 3.8619C2.81715 3.51572 2.89588 3.23229 2.9511 3.03511C2.97998 2.93195 3.00908 2.82885 3.03834 2.7258C3.19007 2.19478 3.74369 1.88684 4.27472 2.03856C4.80576 2.19028 5.11325 2.74374 4.96152 3.27476C4.93318 3.37457 4.905 3.47443 4.87703 3.57435C4.82286 3.76778 4.74535 4.04683 4.65226 4.38812C4.46598 5.07113 4.21791 6.0014 3.97014 6.99246C3.92924 7.15607 3.8884 7.32111 3.8479 7.48676C3.87401 7.47431 3.90024 7.46208 3.92657 7.45008L7.61765 0.529542C7.87755 0.0422476 8.53379 -0.115212 8.97059 0.11779Z" fill="#0F0F0F"/>
  </svg>
);

export const Cart = ({ isOpen, onOpenChange }: CartProps) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [showSignature, setShowSignature] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    address: '',
    paymentMethod: 'cash' as 'cash' | 'card'
  });

  const proceedToCheckout = () => {
    setIsCheckingOut(true);
  };

  const returnToCart = () => {
    setIsCheckingOut(false);
  };

  const handleCheckout = () => {
    // Process checkout logic here
    console.log('Processing checkout:', { customerData, signature, cartItems, total: cartTotal });
    // Reset cart after successful checkout
    clearCart();
    setIsCheckingOut(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col bg-white/90 backdrop-blur-lg border-l border-white/30 shadow-2xl w-full sm:max-w-sm">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold text-black flex items-center gap-2">
            {isCheckingOut && (
              <Button
                variant="ghost"
                size="icon"
                onClick={returnToCart}
                className="h-8 w-8 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {isCheckingOut ? 'Checkout' : 'Your Cart'}
          </SheetTitle>
        </SheetHeader>

        {!isCheckingOut ? (
          // Cart Content
          <>
            {cartItems.length > 0 && (
              <Button
                variant="ghost"
                onClick={clearCart}
                className="absolute top-5 right-14 text-sm font-medium text-black hover:text-red-600 hover:bg-red-50 px-2 py-1 h-auto rounded-md"
              >
                Clear
              </Button>
            )}
            
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
                            <CurrencyIcon className="w-4 h-4" color="#374151" />
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
                          <PremiumQualityIcon />
                          <span className="font-script italic">Premium Quality</span>
                        </div>
                      </div>
                      
                      {/* Signature Section */}
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <div className="flex flex-col items-end space-y-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setShowSignature(!showSignature)}
                            className="text-xs h-6 px-3 text-gray-600 hover:text-black"
                          >
                            Sign
                          </Button>
                          
                          {!showSignature && !signature && (
                            <div className="flex justify-center w-full">
                              <DefaultSignatureIcon />
                            </div>
                          )}

                          {!showSignature && signature && (
                            <div className="w-32 h-16 flex justify-center">
                              <img src={signature} alt="Signature" className="max-w-full max-h-full object-contain" />
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
                    <Button 
                      onClick={proceedToCheckout}
                      className="w-full rounded-xl bg-black hover:bg-gray-800 text-white font-semibold py-3"
                    >
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
          </>
        ) : (
          // Checkout Content
          <div className="flex-grow space-y-6 animate-slide-in-right">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </label>
                <Input
                  value={customerData.name}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="rounded-lg bg-white/80 border-white/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </label>
                <Input
                  value={customerData.address}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your delivery address"
                  className="rounded-lg bg-white/80 border-white/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={customerData.paymentMethod === 'cash' ? 'default' : 'outline'}
                    onClick={() => setCustomerData(prev => ({ ...prev, paymentMethod: 'cash' }))}
                    className="flex items-center gap-2 rounded-lg"
                  >
                    <Banknote className="h-4 w-4" />
                    Cash
                  </Button>
                  <Button
                    variant={customerData.paymentMethod === 'card' ? 'default' : 'outline'}
                    onClick={() => setCustomerData(prev => ({ ...prev, paymentMethod: 'card' }))}
                    className="flex items-center gap-2 rounded-lg"
                  >
                    <CreditCard className="h-4 w-4" />
                    Card
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <h3 className="font-semibold text-black mb-2">Order Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <div className="flex items-center gap-1">
                    <CurrencyIcon className="w-4 h-4" color="#000" />
                    <span>{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <div className="flex items-center gap-1">
                    <CurrencyIcon className="w-4 h-4" color="#000" />
                    <span>7.00</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <div className="flex items-center gap-1">
                    <CurrencyIcon className="w-6 h-6" color="#000" />
                    <span>{(cartTotal + 7).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCheckout}
              disabled={!customerData.name || !customerData.address}
              className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
            >
              Complete Order
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
