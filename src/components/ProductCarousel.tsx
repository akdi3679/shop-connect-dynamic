import { useState, useEffect, useRef } from 'react';
import { Sandwich, Salad } from 'lucide-react';
import { products } from '@/data/products';
import { ProductCardEnhanced } from './ProductCardEnhanced';
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
  const [isSliding, setIsSliding] = useState(false);
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
    setIsSliding(true);
    setCurrentIndex((prev) => (prev + 1) % filteredProducts.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsSliding(false), 500);
  };

  const prevSlide = () => {
    setIsSliding(true);
    setCurrentIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsSliding(false), 500);
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

  // Get background gradient based on category
  const getCategoryBackground = (categoryId: string) => {
    switch (categoryId) {
      case 'sandwich': return 'from-amber-500/20 to-orange-500/20';
      case 'salad': return 'from-green-500/20 to-emerald-500/20';
      case 'potato': return 'from-yellow-500/20 to-amber-500/20';
      case 'drink': return 'from-blue-500/20 to-cyan-500/20';
      default: return 'from-gray-500/20 to-gray-600/20';
    }
  };

  return (
    <section className="flex-1 flex flex-col px-4 py-2 relative">
      {/* Smaller indicator with black text and no background */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
        <div className="text-black">
          <span className="text-lg font-bold">
            {currentIndex + 1}/{filteredProducts.length}
          </span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4 flex justify-center">
        <div className="flex space-x-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <Button
                key={category.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`rounded-full w-12 h-12 p-0 transition-all duration-300 ${
                  isSelected 
                    ? 'bg-black text-white shadow-lg scale-110 hover:bg-black hover:text-white' 
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
      
      <div className="flex-1 relative flex items-start justify-center pt-8">
        <div 
          ref={carouselRef}
          className="w-full max-w-md mx-auto cursor-grab active:cursor-grabbing relative z-10"
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
        >
          <div 
            className={`flex transition-all duration-500 ease-out ${isSliding ? 'blur-sm' : ''}`}
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)${isDragging ? ` translateX(${(currentX - startX) * 0.5}px)` : ''}` 
            }}
          >
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="w-full flex-shrink-0 px-4 relative">
                {/* Animated background closer to product edges */}
                {index === currentIndex && (
                  <div 
                    className={`absolute inset-2 bg-gradient-radial ${getCategoryBackground(selectedCategory)} rounded-3xl transition-all duration-1000 ease-out opacity-0 animate-[fadeIn_0.8s_ease-out_0.5s_forwards] blur-lg z-0`}
                  />
                )}
                
                {/* Speed lines effect during sliding */}
                {isSliding && index === currentIndex && (
                  <div className="absolute inset-2 pointer-events-none overflow-hidden rounded-3xl z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[slideSpeedLines_0.5s_ease-out] transform translate-x-[-100%]" />
                    <div className="absolute top-1/4 left-0 right-0 h-px bg-white/20 animate-[slideSpeedLines_0.5s_ease-out_0.1s] transform translate-x-[-100%]" />
                    <div className="absolute top-3/4 left-0 right-0 h-px bg-white/20 animate-[slideSpeedLines_0.5s_ease-out_0.2s] transform translate-x-[-100%]" />
                  </div>
                )}

                <div className={`transition-all duration-500 relative z-20 ${
                  index === currentIndex 
                    ? 'scale-100 opacity-100 animate-[productAppear_0.6s_ease-out_0.2s_both]' 
                    : index === currentIndex - 1 || (currentIndex === 0 && index === filteredProducts.length - 1)
                    ? 'scale-90 opacity-40 translate-x-4 blur-[1px]'
                    : index === currentIndex + 1 || (currentIndex === filteredProducts.length - 1 && index === 0)
                    ? 'scale-90 opacity-40 -translate-x-4 blur-[1px]'
                    : 'scale-85 opacity-20'
                }`}>
                  <ProductCardEnhanced product={product} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-4">
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
      <div className="w-32 mx-auto mt-4 h-1 bg-black/20 rounded-full overflow-hidden mb-4">
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
