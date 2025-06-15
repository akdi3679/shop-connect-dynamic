
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductList } from '@/components/ProductList';

const Index = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <ProductList />
      </main>
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} GourmetGo. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
