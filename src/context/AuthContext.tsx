
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserPermission } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
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

  // Helper function to determine user role permissions
  const hasRole = (roleCheck: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(roleCheck)) {
      return roleCheck.includes(user.role);
    }
    
    return user.role === roleCheck;
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call to your backend
      // Simulating API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login for demo purposes with different roles
      let mockUser: User;

      if (email === 'demo@example.com' && password === 'password') {
        // Super admin user
        mockUser = {
          id: '1',
          email: 'demo@example.com',
          firstName: 'Super',
          lastName: 'Admin',
          role: 'superAdmin',
          permissions: [
            'viewUsers', 'manageUsers', 'viewRiskDashboard', 
            'viewTransactions', 'manageTransactions', 
            'viewRiskInvestigation', 'manageRiskScores', 
            'viewAlerts', 'manageAlerts', 
            'viewTickets', 'manageTickets', 
            'viewKycDashboard', 'manageKyc',
            'viewReports', 'manageSystem'
          ],
          createdAt: new Date().toISOString(),
        };
      } else if (email === 'admin@example.com' && password === 'password') {
        // Regular admin user
        mockUser = {
          id: '2',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          permissions: [
            'viewUsers', 'manageUsers', 'viewRiskDashboard', 
            'viewTransactions', 'viewRiskInvestigation',
            'viewAlerts', 'manageAlerts', 
            'viewTickets', 'viewKycDashboard',
            'viewReports'
          ],
          createdAt: new Date().toISOString(),
        };
      } else if (email === 'risk@example.com' && password === 'password') {
        // Risk analyst
        mockUser = {
          id: '3',
          email: 'risk@example.com',
          firstName: 'Risk',
          lastName: 'Analyst',
          role: 'riskAnalyst',
          permissions: [
            'viewUsers', 'viewRiskDashboard', 
            'viewTransactions', 'viewRiskInvestigation', 
            'manageRiskScores', 'viewAlerts', 
            'viewTickets', 'viewReports'
          ],
          createdAt: new Date().toISOString(),
        };
      } else if (email === 'kyc@example.com' && password === 'password') {
        // KYC agent
        mockUser = {
          id: '4',
          email: 'kyc@example.com',
          firstName: 'KYC',
          lastName: 'Agent',
          role: 'kycAgent',
          permissions: [
            'viewUsers', 'viewKycDashboard', 
            'manageKyc', 'viewReports'
          ],
          createdAt: new Date().toISOString(),
        };
      } else if (email === 'viewer@example.com' && password === 'password') {
        // Viewer (read-only role)
        mockUser = {
          id: '5',
          email: 'viewer@example.com',
          firstName: 'View',
          lastName: 'Only',
          role: 'viewer',
          permissions: [
            'viewUsers', 'viewRiskDashboard', 
            'viewTransactions', 'viewAlerts', 
            'viewTickets', 'viewKycDashboard',
            'viewReports'
          ],
          createdAt: new Date().toISOString(),
        };
      } else {
        throw new Error('Invalid credentials');
      }
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      toast.success(`Successfully logged in as ${mockUser.role}`);
      
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
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout, hasRole }}>
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
