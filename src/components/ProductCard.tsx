
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
          <p className="font-semibold text-white">Added to cart! 🛒</p>
        </div>
      </div>
    );

    setTimeout(() => setIsAnimating(false), 600);
  };

  // Dynamic background color based on product type
  const getBgColor = () => {
    if (product.name.toLowerCase().includes('pizza')) return 'from-orange-500/20 to-red-500/20';
    if (product.name.toLowerCase().includes('burger')) return 'from-yellow-500/20 to-orange-500/20';
    if (product.name.toLowerCase().includes('sushi')) return 'from-green-500/20 to-blue-500/20';
    if (product.name.toLowerCase().includes('salad')) return 'from-green-400/20 to-lime-500/20';
    if (product.name.toLowerCase().includes('ramen')) return 'from-amber-500/20 to-orange-600/20';
    return 'from-purple-500/20 to-pink-500/20';
  };

  return (
    <Card className={`group flex flex-col overflow-hidden transition-all duration-500 hover:scale-105 card-shadow glass-morphism border-white/20 rounded-3xl bg-gradient-to-br ${getBgColor()}`}>
      <div className="relative aspect-video overflow-hidden rounded-t-3xl">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Price badge */}
        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full px-4 py-2 backdrop-blur-sm">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
        </div>
      </div>

      <CardContent className="flex-grow p-6">
        <div className="space-y-4">
          <p className="text-white/80 leading-relaxed text-sm">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-sm text-white/60">Free delivery</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-400 font-semibold">✓ Available</p>
              <p className="text-xs text-white/50">Ready in 15-20 min</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 p-6">
        <Button 
          className={`w-full rounded-2xl glass-morphism border-white/20 backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white font-semibold py-3 transition-all duration-300 ${
            isAnimating ? 'scale-95 animate-pulse' : 'hover:scale-105'
          }`}
          onClick={handleAddToCart}
          disabled={isAnimating}
        >
          <Plus className={`h-4 w-4 mr-2 transition-transform duration-300 ${isAnimating ? 'rotate-180' : ''}`} />
          {isAnimating ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};
