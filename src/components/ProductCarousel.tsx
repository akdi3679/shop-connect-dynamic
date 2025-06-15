
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Sandwich, Coffee, Salad, Cookie } from 'lucide-react';
import { products } from '@/data/products';
import { ProductCard } from './ProductCard';
import { Button } from './ui/button';

const categories = [
  { id: 'sandwich', name: 'Sandwich', icon: Sandwich },
  { id: 'drink', name: 'Drinks', icon: Coffee },
  { id: 'salad', name: 'Salads', icon: Salad },
  { id: 'potato', name: 'Potatoes', icon: Cookie }
];

export const ProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('sandwich');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const filteredProducts = products.filter(product => 
    (selectedCategory === 'sandwich' && (product.name.toLowerCase().includes('pizza') || product.name.toLowerCase().includes('burger'))) ||
    (selectedCategory === 'drink' && product.name.toLowerCase().includes('drink')) ||
    (selectedCategory === 'salad' && product.name.toLowerCase().includes('salad')) ||
    (selectedCategory === 'potato' && product.name.toLowerCase().includes('potato'))
  );

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products.slice(0, 4);

  useEffect(() => {
    if (!isAutoPlaying || isDragging) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % displayProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isDragging, displayProducts.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayProducts.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayProducts.length) % displayProducts.length);
    setIsAutoPlaying(false);
  };

  // Touch and mouse handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setIsAutoPlaying(false);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentIndex(0);
    setIsAutoPlaying(true);
  };

  return (
    <section className="flex-1 flex px-4 py-8 relative">
      {/* Category Filter - Right Side */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10">
        <div className="flex flex-col space-y-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant="ghost"
                size="icon"
                className={`w-12 h-12 rounded-2xl transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg scale-110 category-active glass-morphism border-white/20' 
                    : 'bg-white/10 hover:bg-white/20 glass-morphism border-white/10 hover:scale-105'
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                <IconComponent className={`h-6 w-6 ${
                  selectedCategory === category.id ? 'text-white' : 'text-white/70'
                }`} />
              </Button>
            );
          })}
        </div>
      </div>
      
      <div className="flex-1 relative flex items-center justify-center pr-20">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 z-10 bg-white/10 hover:bg-white/20 shadow-lg rounded-full w-12 h-12 glass-morphism border-white/20 transition-all duration-300 hover:scale-110"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </Button>

        <div 
          ref={carouselRef}
          className="w-full max-w-md mx-auto cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
        >
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)${isDragging ? ` translateX(${(currentX - startX) * 0.5}px)` : ''}` 
            }}
          >
            {displayProducts.map((product, index) => (
              <div key={product.id} className="w-full flex-shrink-0 px-4">
                <div className={`transition-all duration-500 animate-slide-up ${
                  index === currentIndex 
                    ? 'scale-100 opacity-100' 
                    : 'scale-95 opacity-70'
                }`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 z-10 bg-white/10 hover:bg-white/20 shadow-lg rounded-full w-12 h-12 glass-morphism border-white/20 transition-all duration-300 hover:scale-110"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5 text-white" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2">
        {displayProducts.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-indigo-400 to-purple-600 scale-125 shadow-lg' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};
