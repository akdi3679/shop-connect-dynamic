
import { products } from '@/data/products';
import { ProductCardEnhanced } from '@/components/ProductCardEnhanced';

export const ProductCarousel = () => {
  return (
    <section className="flex-1 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-black mb-4">
            Our Gourmet Selection
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Crafted with passion, served with love. Each dish tells a story of culinary excellence.
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-0">
            {products.map((product) => (
              <div key={product.id} className="h-fit">
                <ProductCardEnhanced product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
