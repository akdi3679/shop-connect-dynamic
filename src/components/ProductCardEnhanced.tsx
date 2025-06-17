
import { useState } from 'react';
import { useCart, Product } from '@/contexts/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ProductCardEnhancedProps {
  product: Product;
}

const CurrencyIcon = ({ className = "w-6 h-6", color = "inherit" }: { className?: string; color?: string }) => (
  <svg width="1em" height="1em" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: '-0.2em' }} className={className}>
    <text
      x="70" y="80" fontSize="80" fontFamily="Amiri, serif" direction="rtl"
      fill={color} stroke={color} strokeWidth="2" paintOrder="stroke"
    >&#x062F;</text>
    <text
      x="45" y="42" fontSize="50" fontFamily="Amiri, serif" transform="rotate(90 45,42)"
      fill={color} stroke={color} strokeWidth="2" paintOrder="stroke"
    >ا</text>
    <text
      x="45" y="50" fontSize="50" fontFamily="Amiri, serif" transform="rotate(90 45,50)"
      fill={color} stroke={color} strokeWidth="2" paintOrder="stroke"
    >ا</text>
  </svg>
);

export const ProductCardEnhanced = ({ product }: ProductCardEnhancedProps) => {
  const { addToCart } = useCart();
  const [showDescription, setShowDescription] = useState(false);

  const handleNameClick = () => {
    setShowDescription(!showDescription);
  };

  return (
    <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6 relative">
        <div className="space-y-2">
          <button
            onClick={handleNameClick}
            className="text-left w-full transition-all duration-300 hover:text-gray-600"
          >
            <h3 className={`font-bold text-lg transition-all duration-500 ${showDescription ? 'transform -translate-y-2' : ''}`}>
              {product.name}
            </h3>
          </button>
          
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showDescription ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <p className="text-gray-600 text-sm leading-relaxed transform transition-transform duration-500">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-xl font-bold text-black">
              <CurrencyIcon className="w-6 h-6" color="#000000" />
              <span>{product.price.toFixed(2)}</span>
            </div>
            <Button 
              onClick={() => addToCart(product)}
              size="sm"
              className="rounded-full bg-black hover:bg-gray-800 text-white p-2 h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
