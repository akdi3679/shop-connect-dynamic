
import { useState } from 'react';
import { products } from '@/data/products';
import { ProductCardEnhanced } from '@/components/ProductCardEnhanced';

const categories = ['All', 'Sandwiches', 'Salads', 'Potatoes', 'Drinks'];

export const ProductCarousel = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => {
        const productName = product.name.toLowerCase();
        switch (selectedCategory) {
          case 'Sandwiches':
            return productName.includes('sandwich');
          case 'Salads':
            return productName.includes('salad');
          case 'Potatoes':
            return productName.includes('potato');
          case 'Drinks':
            return productName.includes('drink') || productName.includes('juice');
          default:
            return true;
        }
      });

  return (
    <section className="flex-1 py-8 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-white/30 shadow-lg">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCardEnhanced key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
