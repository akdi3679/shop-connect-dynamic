
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart, Product } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { soundManager } from '@/utils/sounds';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddToCart = () => {
    setIsAnimating(true);
    addToCart(product);
    soundManager.play('addToCart');
    
    toast.success(
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-semibold">{product.name}</p>
          <p className="text-sm text-gray-600">Added to cart! 🛒</p>
        </div>
      </div>
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
        
        {/* Price badge */}
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white rounded-full px-4 py-2 border border-white/20">
          <span className="text-sm font-bold">${product.price.toFixed(2)}</span>
        </div>

        {/* Product name with gradient glass effect */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent backdrop-blur-md text-white p-6 rounded-b-3xl border-t border-white/10">
          <h3 className="text-lg font-bold text-white drop-shadow-lg">{product.name}</h3>
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
