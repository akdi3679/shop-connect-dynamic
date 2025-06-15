
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className={`group flex flex-col overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${getProductGradient(product.name)} backdrop-blur-sm border border-black/10 hover:border-black/20 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.3)]`}>
      <div className="relative aspect-video overflow-hidden rounded-t-3xl">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Price badge */}
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white rounded-full px-4 py-2 border border-white/20">
          <span className="text-sm font-bold">${product.price.toFixed(2)}</span>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-black group-hover:text-black/80 transition-colors duration-300">
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-3xl font-bold text-black">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-sm text-black/60">Free delivery</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-600 font-semibold">✓ Available</p>
            <p className="text-xs text-black/50">Ready in 15-20 min</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          className={`w-full rounded-2xl bg-white/90 hover:bg-white text-black font-semibold py-3 transition-all duration-300 backdrop-blur-sm border border-black/20 hover:border-black/40 ${
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
