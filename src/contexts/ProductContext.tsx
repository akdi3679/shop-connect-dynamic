
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { products as homePageProducts } from '@/data/products';

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

export interface Message {
  id: number;
  customerName: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  customerId: number;
}

export interface AnalyticsData {
  period: 'hour' | 'day' | 'month' | 'year';
  sales: number;
  orders: number;
  revenue: number;
  timestamp: Date;
}

interface ProductContextType {
  products: Product[];
  categories: Category[];
  messages: Message[];
  analytics: AnalyticsData[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: number, category: Partial<Category>) => void;
  deleteCategory: (id: number) => void;
  applyReduction: (type: 'product' | 'category', id: number, reduction: number) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
  markMessageAsRead: (id: number) => void;
  getAnalytics: (period: 'hour' | 'day' | 'month' | 'year') => AnalyticsData[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

const categoriesFromProducts = [
  { id: 1, name: 'Sandwiches', icon: '🥪' },
  { id: 2, name: 'Salads', icon: '🥗' },
  { id: 3, name: 'Potatoes', icon: '🥔' },
  { id: 4, name: 'Drinks', icon: '🥤' }
];

const generateMockAnalytics = (): AnalyticsData[] => {
  const analytics: AnalyticsData[] = [];
  const now = new Date();
  
  // Generate hourly data for last 24 hours
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    analytics.push({
      period: 'hour',
      sales: Math.floor(Math.random() * 50) + 10,
      orders: Math.floor(Math.random() * 20) + 5,
      revenue: Math.floor(Math.random() * 1000) + 200,
      timestamp
    });
  }
  
  // Generate daily data for last 30 days
  for (let i = 29; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    analytics.push({
      period: 'day',
      sales: Math.floor(Math.random() * 500) + 100,
      orders: Math.floor(Math.random() * 200) + 50,
      revenue: Math.floor(Math.random() * 10000) + 2000,
      timestamp
    });
  }
  
  // Generate monthly data for last 12 months
  for (let i = 11; i >= 0; i--) {
    const timestamp = new Date(now.getFullYear(), now.getMonth() - i, 1);
    analytics.push({
      period: 'month',
      sales: Math.floor(Math.random() * 5000) + 1000,
      orders: Math.floor(Math.random() * 2000) + 500,
      revenue: Math.floor(Math.random() * 100000) + 20000,
      timestamp
    });
  }
  
  // Generate yearly data for last 5 years
  for (let i = 4; i >= 0; i--) {
    const timestamp = new Date(now.getFullYear() - i, 0, 1);
    analytics.push({
      period: 'year',
      sales: Math.floor(Math.random() * 50000) + 10000,
      orders: Math.floor(Math.random() * 20000) + 5000,
      revenue: Math.floor(Math.random() * 1000000) + 200000,
      timestamp
    });
  }
  
  return analytics;
};

const generateMockMessages = (): Message[] => {
  return [
    {
      id: 1,
      customerName: 'John Doe',
      customerId: 1,
      message: 'Hello, I have a question about my order #1234',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      isRead: false
    },
    {
      id: 2,
      customerName: 'Sarah Smith',
      customerId: 2,
      message: 'When will my delivery arrive?',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: false
    },
    {
      id: 3,
      customerName: 'Mike Johnson',
      customerId: 3,
      message: 'Great food! Thank you for the excellent service.',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isRead: true
    }
  ];
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('products');
    if (stored) {
      return JSON.parse(stored);
    }
    // Convert home page products to our format
    return homePageProducts.map(p => ({
      ...p,
      category: p.name.toLowerCase().includes('sandwich') ? 'Sandwiches' :
                p.name.toLowerCase().includes('salad') ? 'Salads' :
                p.name.toLowerCase().includes('potato') ? 'Potatoes' :
                p.name.toLowerCase().includes('drink') || p.name.toLowerCase().includes('juice') ? 'Drinks' : 'Other'
    }));
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const stored = localStorage.getItem('categories');
    return stored ? JSON.parse(stored) : categoriesFromProducts;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = localStorage.getItem('messages');
    return stored ? JSON.parse(stored) : generateMockMessages();
  });

  const [analytics] = useState<AnalyticsData[]>(() => {
    return generateMockAnalytics();
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

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

  const addMessage = (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now(),
      timestamp: new Date(),
      isRead: false
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const markMessageAsRead = (id: number) => {
    setMessages(prev => prev.map(message => 
      message.id === id ? { ...message, isRead: true } : message
    ));
  };

  const getAnalytics = (period: 'hour' | 'day' | 'month' | 'year') => {
    return analytics.filter(data => data.period === period);
  };

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      messages,
      analytics,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      applyReduction,
      addMessage,
      markMessageAsRead,
      getAnalytics
    }}>
      {children}
    </ProductContext.Provider>
  );
};
