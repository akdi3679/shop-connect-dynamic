
import { useState } from 'react';
import { ShoppingCart, X, Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '@/contexts/CartContext';
import { SignaturePad } from './SignaturePad';
import { toast } from 'sonner';

export const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setShowSignature(true);
  };

  const handleSignatureComplete = (signatureData: string) => {
    console.log('Signature captured:', signatureData);
    toast.success('Order placed successfully!');
    clearCart();
    setShowSignature(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Cart Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-40 bg-black/80 backdrop-blur-sm text-white hover:bg-black/90 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
        size="icon"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Button>

      {/* Cart Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-96 bg-white/90 backdrop-blur-xl shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header with Close and Clear buttons on same level */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                <h2 className="text-xl font-semibold text-gray-800">Your Cart</h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
                    onClick={clearCart}
                    disabled={cartItems.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:bg-gray-100 rounded-full p-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <ShoppingCart className="h-16 w-16 mb-4 opacity-30" />
                    <p className="text-lg font-medium">Your cart is empty</p>
                    <p className="text-sm">Add some delicious items to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/50 rounded-2xl border border-gray-200/50 shadow-sm">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0 rounded-full border-gray-300"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium text-gray-800 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0 rounded-full border-gray-300"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:bg-red-50 rounded-full p-2"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-gray-200/50 p-6 bg-white/60 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  {/* Sign button positioned on the right */}
                  <div className="flex justify-end">
                    <Button
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl px-8 py-3 font-semibold shadow-lg transform transition-all duration-200 hover:scale-105"
                      onClick={handleCheckout}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Sign & Checkout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {showSignature && (
        <SignaturePad
          onComplete={handleSignatureComplete}
          onCancel={() => setShowSignature(false)}
        />
      )}
    </>
  );
};
