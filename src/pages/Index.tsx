
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductCarousel } from '@/components/ProductCarousel';
import { LoadingScreen } from '@/components/LoadingScreen';
import { UnifiedMessaging } from '@/components/UnifiedMessaging';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
      
      {!isLoading && (
        <div className="h-screen flex flex-col overflow-hidden bg-black">
          <Header />
          <main className="flex-1 flex flex-col">
            <Hero />
            <ProductCarousel />
          </main>
          <UnifiedMessaging />
        </div>
      )}
    </>
  );
};

export default Index;
