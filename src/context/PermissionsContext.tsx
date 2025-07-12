
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { UserPermission } from '@/types';

interface PermissionsContextType {
  hasPermission: (permission: UserPermission | UserPermission[]) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const hasPermission = (permissionCheck: UserPermission | UserPermission[]): boolean => {
    if (!user || !user.permissions) return false;
    
    if (user.role === 'superAdmin') {
      return true; // Super admin has all permissions
    }
    
    if (Array.isArray(permissionCheck)) {
      return permissionCheck.some(permission => 
        user.permissions?.includes(permission)
      );
    }
    
    return user.permissions.includes(permissionCheck);
  };

  return (
    <PermissionsContext.Provider value={{ hasPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};
