
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  storeName?: string;
  phoneNumber: string;
  location: string;
  role: 'admin' | 'supplier';
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (userData: Omit<User, 'id' | 'role'> & { password: string }) => Promise<boolean>;
  guestLogin: (storeName: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Check for site owner admin
    if (username === 'admin' && password === 'admin') {
      const adminUser: User = {
        id: 'admin-1',
        username: 'admin',
        email: 'admin@gourmetgo.com',
        firstName: 'Site',
        lastName: 'Administrator',
        phoneNumber: '',
        location: '',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }

    // Check for registered suppliers
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const supplier = suppliers.find((s: any) => s.username === username && s.password === password);
    
    if (supplier) {
      const supplierUser: User = {
        id: supplier.id,
        username: supplier.username,
        email: supplier.email,
        firstName: supplier.firstName,
        lastName: supplier.lastName,
        storeName: supplier.storeName,
        phoneNumber: supplier.phoneNumber,
        location: supplier.location,
        role: 'supplier'
      };
      setUser(supplierUser);
      localStorage.setItem('user', JSON.stringify(supplierUser));
      return true;
    }

    return false;
  };

  const signup = async (userData: Omit<User, 'id' | 'role'> & { password: string }): Promise<boolean> => {
    try {
      const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
      
      // Check if username already exists
      if (suppliers.some((s: any) => s.username === userData.username)) {
        return false;
      }

      const newSupplier = {
        ...userData,
        id: `supplier-${Date.now()}`,
        role: 'supplier'
      };

      suppliers.push(newSupplier);
      localStorage.setItem('suppliers', JSON.stringify(suppliers));

      // Auto login after signup
      const user: User = {
        id: newSupplier.id,
        username: newSupplier.username,
        email: newSupplier.email,
        firstName: newSupplier.firstName,
        lastName: newSupplier.lastName,
        storeName: newSupplier.storeName,
        phoneNumber: newSupplier.phoneNumber,
        location: newSupplier.location,
        role: 'supplier'
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const guestLogin = (storeName: string) => {
    const guestUser: User = {
      id: `guest-${Date.now()}`,
      username: 'guest',
      email: '',
      firstName: 'Guest',
      lastName: 'User',
      storeName,
      phoneNumber: '',
      location: '',
      role: 'supplier',
      isGuest: true
    };
    setUser(guestUser);
    localStorage.setItem('user', JSON.stringify(guestUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    guestLogin,
    logout,
    isAuthenticated: user !== null
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
