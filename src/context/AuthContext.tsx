
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session on load
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          // In a real app, validate the session with your API
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call to your backend
      // Simulating API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login for demo purposes
      if (email === 'demo@example.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          email: 'demo@example.com',
          firstName: 'Demo',
          lastName: 'User',
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
        toast.success('Successfully logged in');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
