
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  reduction?: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  reduction?: number;
}

interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: number, category: Partial<Category>) => void;
  deleteCategory: (id: number) => void;
  applyReduction: (type: 'product' | 'category', id: number, reduction: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'Gourmet Burger',
    description: 'Delicious beef burger with premium toppings',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop',
    category: 'Burgers'
  },
  {
    id: 2,
    name: 'Caesar Salad',
    description: 'Fresh caesar salad with crispy croutons',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
    category: 'Salads'
  },
  {
    id: 3,
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh basil and mozzarella',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop',
    category: 'Pizza'
  },
  {
    id: 4,
    name: 'Grilled Sandwich',
    description: 'Perfectly grilled sandwich with melted cheese',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&h=300&fit=crop',
    category: 'Sandwiches'
  }
];

const defaultCategories: Category[] = [
  { id: 1, name: 'Burgers', icon: '🍔' },
  { id: 2, name: 'Salads', icon: '🥗' },
  { id: 3, name: 'Pizza', icon: '🍕' },
  { id: 4, name: 'Sandwiches', icon: '🥪' },
  { id: 5, name: 'Drinks', icon: '🥤' }
];

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('products');
    return stored ? JSON.parse(stored) : defaultProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorage.getItem('categories');
    return stored ? JSON.parse(stored) : defaultCategories;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Date.now()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    ));
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: Date.now()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: number, updatedCategory: Partial<Category>) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updatedCategory } : category
    ));
  };

  const deleteCategory = (id: number) => {
    setCategories(prev => prev.filter(category => category.id !== id));
    // Also remove products from deleted category
    setProducts(prev => prev.filter(product => {
      const categoryName = categories.find(c => c.id === id)?.name;
      return product.category !== categoryName;
    }));
  };

  const applyReduction = (type: 'product' | 'category', id: number, reduction: number) => {
    if (type === 'product') {
      updateProduct(id, { reduction });
    } else {
      updateCategory(id, { reduction });
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      applyReduction
    }}>
      {children}
    </ProductContext.Provider>
  );
};
