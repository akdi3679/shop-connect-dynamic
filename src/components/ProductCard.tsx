
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart, Product } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { soundManager } from '@/utils/sounds';
import { Plus, ShoppingCart, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onNameClick?: () => void;
  showDescription?: boolean;
}

const CurrencyIcon = ({ className = "w-20 h-20", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg width="2em" height="2em" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: '-0.5em' }} className={className}>
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

// Generate calories based on product type and price
const getProductCalories = (name: string, price: number): number => {
  const baseCalories = Math.round(price * 25); // Base calculation
  
  if (name.toLowerCase().includes('sandwich')) return baseCalories + Math.round(Math.random() * 100) + 250;
  if (name.toLowerCase().includes('salad')) return Math.round(baseCalories * 0.6) + 150;
  if (name.toLowerCase().includes('potato')) return baseCalories + Math.round(Math.random() * 150) + 200;
  if (name.toLowerCase().includes('drink') || name.toLowerCase().includes('juice')) return Math.round(baseCalories * 0.4) + 50;
  
  return baseCalories + Math.round(Math.random() * 100) + 180;
};

export const ProductCard = ({ product, onNameClick, showDescription }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = () => {
    setIsAnimating(true);
    addToCart(product);
    soundManager.play('addToCart');
    
    toast.success(
      <div className="flex items-center space-x-3 bg-white backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-lg w-full">
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-black">{product.name}</p>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <ShoppingCart className="h-3 w-3" />
            Added to cart!
          </p>
        </div>
      </div>,
      {
        style: {
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: '0',
        },
        className: 'bg-transparent border-none shadow-none p-0',
      }
    );

    setTimeout(() => setIsAnimating(false), 600);
  };

  // Generate gradient based on product type
  const getProductGradient = (name: string) => {
    if (name.toLowerCase().includes('sandwich')) return 'from-amber-100 to-orange-200';
    if (name.toLowerCase().includes('salad')) return 'from-green-100 to-emerald-200';
    if (name.toLowerCase().includes('potato')) return 'from-yellow-100 to-amber-200';
    if (name.toLowerCase().includes('drink') || name.toLowerCase().includes('juice')) return 'from-blue-100 to-cyan-200';
    return 'from-gray-100 to-gray-200';
  };

  const calories = getProductCalories(product.name, product.price);

  return (
    <Card className={`group flex flex-col overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${getProductGradient(product.name)} backdrop-blur-sm border border-black/10 hover:border-black/20 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.3)] relative h-full`}>
      <div className="relative aspect-video overflow-hidden rounded-t-3xl flex-1">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Price badge - positioned higher above the name */}
        <div className="absolute bottom-20 right-4 bg-black/80 backdrop-blur-sm text-white rounded-full px-3 py-1 border border-white/20 flex items-center gap-1">
          <CurrencyIcon className="w-8 h-8" color="#ffffff" />
          <span className="text-sm font-bold">{product.price.toFixed(2)}</span>
        </div>

        {/* Product name with gradient black to transparent without blur */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
          <div className="relative">
            <h3 
              className={`text-lg font-bold text-white cursor-pointer transition-transform duration-300 ${
                showDescription ? 'transform -translate-y-2' : ''
              }`}
              onClick={onNameClick}
            >
              {product.name}
            </h3>
            
            {/* Description that appears below the name */}
            <div className={`transition-all duration-300 overflow-hidden ${
              showDescription ? 'max-h-32 opacity-100 mt-2' : 'max-h-0 opacity-0'
            }`}>
              <p className="text-sm text-white/90 leading-relaxed mb-2">
                {product.description || "Delicious and fresh, made with the finest ingredients for your enjoyment."}
              </p>
              
              {/* Calories info */}
              <div className="flex items-center space-x-1 bg-orange-500/20 backdrop-blur-sm rounded-full px-2 py-1 inline-flex">
                <Flame className="h-3 w-3 text-orange-400" />
                <span className="text-xs font-medium text-white">
                  {calories} cal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Add to cart button - floating on image */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button 
            className={`rounded-full bg-white/90 hover:bg-white text-black font-semibold p-3 transition-all duration-300 backdrop-blur-sm border border-black/20 hover:border-black/40 ${
              isAnimating ? 'scale-95 animate-pulse' : 'hover:scale-105'
            }`}
            onClick={handleAddToCart}
            disabled={isAnimating}
            size="icon"
          >
            <Plus className={`h-4 w-4 transition-transform duration-300 ${isAnimating ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>
    </Card>
  );
};
