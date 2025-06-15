
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductCarousel } from '@/components/ProductCarousel';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MessagingSystem } from '@/components/MessagingSystem';
import { GeminiBot } from '@/components/GeminiBot';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
      
      {!isLoading && (
        <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50">
          <Header />
          <main className="flex-1 flex flex-col">
            <Hero />
            <ProductCarousel />
          </main>
          <MessagingSystem />
          <GeminiBot />
        </div>
      )}
    </>
  );
};

export default Index;
