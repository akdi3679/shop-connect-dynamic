
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductCarousel } from '@/components/ProductCarousel';

const Index = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col">
        <Hero />
        <ProductCarousel />
      </main>
    </div>
  );
};

export default Index;
