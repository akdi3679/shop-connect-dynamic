
import { useProducts } from '@/contexts/ProductContext';
import { ProductCardEnhanced } from '@/components/ProductCardEnhanced';

export const ProductCarousel = () => {
  const { products } = useProducts();

  return (
    <section className="py-8 px-4 bg-gradient-to-b from-transparent to-white/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-black">
          Our Delicious Menu
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCardEnhanced key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
