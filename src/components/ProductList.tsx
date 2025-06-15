
import { products } from '@/data/products';
import { ProductCard } from './ProductCard';

export const ProductList = () => {
  return (
    <section id="menu" className="container py-12">
      <h2 className="mb-8 text-center text-3xl font-bold">Our Menu</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
