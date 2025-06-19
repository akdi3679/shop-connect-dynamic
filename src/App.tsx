
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoadingScreen } from '@/components/LoadingScreen';
import AuthWrapper from '@/components/AuthWrapper';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import { initializeLocationService } from '@/utils/locationService';
import { useEffect, useState } from 'react';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Initialize location service when app loads
  useEffect(() => {
    // Small delay to ensure the app is fully loaded
    const timer = setTimeout(() => {
      initializeLocationService();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <CartProvider>
            <ProductProvider>
              <Router>
                <div className="App">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route 
                      path="/dashboard" 
                      element={
                        <AuthWrapper>
                          <Dashboard />
                        </AuthWrapper>
                      } 
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </div>
              </Router>
            </ProductProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
