
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Product } from '@/contexts/CartContext';

interface ProductCardEnhancedProps {
  product: Product;
}

const CurrencyIcon = ({ className = "w-4 h-4", color = "#000" }: { className?: string; color?: string }) => (
  <svg width="2.5em" height="2.5em" viewBox="0 0 100 100" style={{ verticalAlign: 'middle', display: 'inline-block' }} className={className}>
    <text x="70" y="80" fontSize="80" fontFamily="Amiri, serif" direction="rtl"
          fill={color} stroke={color} strokeWidth="1" paintOrder="stroke">&#x062F;</text>
    
    <text x="47" y="39" fontSize="50" fontFamily="Amiri, serif" transform="rotate(90 45,39)"
          fill={color} stroke={color} strokeWidth="1.5" paintOrder="stroke">ا</text>
    <text x="47" y="47" fontSize="50" fontFamily="Amiri, serif" transform="rotate(90 45,47)"
          fill={color} stroke={color} strokeWidth="1.5" paintOrder="stroke">ا</text>
  </svg>
);

export const ProductCardEnhanced = ({ product }: ProductCardEnhancedProps) => {
  const { addToCart } = useCart();
  const [showDescription, setShowDescription] = useState(false);

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105">
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      
      <div className="p-4 space-y-3">
        <div 
          className="cursor-pointer"
          onClick={toggleDescription}
        >
          <h3 className="font-bold text-lg text-black hover:text-orange-600 transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Animated description */}
          <div 
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              showDescription ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-gray-600 text-sm animate-slide-in-right">
              {product.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-lg font-bold text-black">
            <CurrencyIcon className="w-5 h-5" color="#000" />
            <span>{product.price.toFixed(2)}</span>
          </div>
          
          <Button 
            onClick={() => addToCart(product)}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
