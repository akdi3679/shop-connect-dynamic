
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '@/data/products';
import { ProductCard } from './ProductCard';
import { Button } from './ui/button';

const categories = [
  { id: 'all', name: 'All Items', emoji: '🍽️' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'burger', name: 'Burgers', emoji: '🍔' },
  { id: 'sushi', name: 'Sushi', emoji: '🍣' },
  { id: 'salad', name: 'Salads', emoji: '🥗' },
  { id: 'ramen', name: 'Ramen', emoji: '🍜' },
  { id: 'dessert', name: 'Desserts', emoji: '🍰' }
];

export const ProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => 
        product.name.toLowerCase().includes(selectedCategory) ||
        (selectedCategory === 'pizza' && product.name.toLowerCase().includes('pizza')) ||
        (selectedCategory === 'burger' && product.name.toLowerCase().includes('burger')) ||
        (selectedCategory === 'sushi' && product.name.toLowerCase().includes('sushi')) ||
        (selectedCategory === 'salad' && product.name.toLowerCase().includes('salad')) ||
        (selectedCategory === 'ramen' && product.name.toLowerCase().includes('ramen')) ||
        (selectedCategory === 'dessert' && product.name.toLowerCase().includes('cake'))
      );

  useEffect(() => {
    if (!isAutoPlaying || isDragging) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isDragging, filteredProducts.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredProducts.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
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
    <section className="flex-1 flex flex-col px-4 py-8">
      {/* Category Filter */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
          Our Menu
        </h2>
        
        <div className="flex overflow-x-auto space-x-3 pb-4 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`flex-shrink-0 rounded-full px-6 py-3 transition-all duration-300 ${
                selectedCategory === category.id 
                  ? 'bg-gradient-to-r from-orange-400 to-orange-600 shadow-lg scale-105' 
                  : 'hover:scale-105 hover:shadow-md'
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              <span className="mr-2">{category.emoji}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 relative flex items-center justify-center">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12 backdrop-blur-sm border-orange-200 hover:border-orange-300 transition-all duration-300 hover:scale-110"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5 text-orange-600" />
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
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="w-full flex-shrink-0 px-4">
                <div className={`transition-all duration-500 ${
                  index === currentIndex 
                    ? 'scale-100 opacity-100' 
                    : 'scale-95 opacity-70'
                }`}>
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12 backdrop-blur-sm border-orange-200 hover:border-orange-300 transition-all duration-300 hover:scale-110"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5 text-orange-600" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {filteredProducts.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-orange-400 to-orange-600 scale-125 shadow-lg' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-32 mx-auto mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-4000 ease-linear"
          style={{ 
            width: isAutoPlaying && !isDragging ? '100%' : '0%',
            transitionDuration: isAutoPlaying && !isDragging ? '4000ms' : '300ms'
          }}
        ></div>
      </div>
    </section>
  );
};
