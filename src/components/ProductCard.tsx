
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart, Product } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { soundManager } from '@/utils/sounds';
import { Heart, Star, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
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

  const handleLike = () => {
    setIsLiked(!isLiked);
    soundManager.play('notification');
  };

  return (
    <Card className="group flex flex-col overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white/80 backdrop-blur-sm border border-orange-100 hover:border-orange-200 rounded-3xl">
      <div className="relative aspect-video overflow-hidden rounded-t-3xl">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Like button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-4 right-4 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isLiked 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 transition-transform duration-300 ${isLiked ? 'fill-current scale-110' : ''}`} />
        </Button>

        {/* Rating */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
          <Star className="h-3 w-3 text-yellow-500 fill-current" />
          <span className="text-xs font-semibold">{(4.2 + Math.random() * 0.8).toFixed(1)}</span>
        </div>

        {/* Price badge */}
        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full px-3 py-1">
          <span className="text-sm font-bold">${product.price.toFixed(2)}</span>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
          {product.name}
        </CardTitle>
        <CardDescription className="text-gray-600 leading-relaxed">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">Free delivery</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-600 font-semibold">✓ Available</p>
            <p className="text-xs text-gray-500">Ready in 15-20 min</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          className={`w-full rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-semibold py-3 transition-all duration-300 ${
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
