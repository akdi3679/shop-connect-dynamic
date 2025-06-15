import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sandwich, Salad } from 'lucide-react';
import { products } from '@/data/products';
import { ProductCard } from './ProductCard';
import { Button } from './ui/button';

// Custom Potato Icon since lucide doesn't have one
const PotatoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="12" rx="7" ry="5" transform="rotate(-15 12 12)"/>
    <circle cx="10" cy="10" r="0.5" fill="currentColor"/>
    <circle cx="14" cy="13" r="0.5" fill="currentColor"/>
    <circle cx="11" cy="14" r="0.5" fill="currentColor"/>
  </svg>
);

// Custom Drink Icon
const DrinkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12V6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v6"></path>
    <path d="M5 12l1.5 6h11l1.5-6"></path>
  </svg>
);

const categories = [
  { id: 'sandwich', name: 'Sandwich', icon: Sandwich },
  { id: 'salad', name: 'Salad', icon: Salad },
  { id: 'potato', name: 'Potato', icon: PotatoIcon },
  { id: 'drink', name: 'Drink', icon: DrinkIcon }
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
    product.name.toLowerCase().includes(selectedCategory) ||
    (selectedCategory === 'sandwich' && product.name.toLowerCase().includes('sandwich')) ||
    (selectedCategory === 'salad' && product.name.toLowerCase().includes('salad')) ||
    (selectedCategory === 'potato' && product.name.toLowerCase().includes('potato')) ||
    (selectedCategory === 'drink' && (product.name.toLowerCase().includes('drink') || product.name.toLowerCase().includes('juice') || product.name.toLowerCase().includes('soda')))
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
      <div className="mb-8 flex justify-center">
        <div className="flex space-x-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className={`rounded-full w-12 h-12 p-0 transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'bg-black text-white shadow-lg scale-110' 
                    : 'bg-white/80 backdrop-blur-sm text-black hover:bg-white hover:scale-105 hover:shadow-md border-black/20'
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                <IconComponent className="h-5 w-5" />
              </Button>
            );
          })}
        </div>
      </div>
      
      <div className="flex-1 relative flex items-center justify-center">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12 backdrop-blur-sm border-black/20 hover:border-black/40 transition-all duration-300 hover:scale-110"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5 text-black" />
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
          className="absolute right-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12 backdrop-blur-sm border-black/20 hover:border-black/40 transition-all duration-300 hover:scale-110"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5 text-black" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {filteredProducts.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-black scale-125 shadow-lg' 
                : 'bg-black/30 hover:bg-black/60'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-32 mx-auto mt-4 h-1 bg-black/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-black transition-all duration-4000 ease-linear"
          style={{ 
            width: isAutoPlaying && !isDragging ? '100%' : '0%',
            transitionDuration: isAutoPlaying && !isDragging ? '4000ms' : '300ms'
          }}
        ></div>
      </div>
    </section>
  );
};
