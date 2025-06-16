
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart, Product } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { soundManager } from '@/utils/sounds';
import { Plus, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const CurrencyIcon = ({ className = "w-5 h-5", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" className={className} style={{ color }}>
    <text x="40" y="95" fontSize="80" fontFamily="Amiri, serif" direction="rtl" fill="currentColor">&#x062F;</text>
    <text x="15" y="58" fontSize="50" fontFamily="Amiri, serif" transform="rotate(90 15,58)" fill="currentColor">ا</text>
    <text x="15" y="65" fontSize="50" fontFamily="Amiri, serif" transform="rotate(90 15,65)" fill="currentColor">ا</text>
  </svg>
);

export const ProductCard = ({ product }: ProductCardProps) => {
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
          <CurrencyIcon className="w-6 h-6" color="#ffffff" />
          <span className="text-sm font-bold">{product.price.toFixed(2)}</span>
        </div>

        {/* Product name with gradient black to transparent without blur */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
          <h3 className="text-lg font-bold text-white">{product.name}</h3>
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
