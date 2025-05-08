
import React from 'react';
import { UserPermission } from '@/types';
import { usePermissions } from '@/context/PermissionsContext';

interface PermissionGateProps {
  children: React.ReactNode;
  permission: UserPermission | UserPermission[];
  fallback?: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({ 
  children, 
  permission, 
  fallback = null 
}) => {
  const { hasPermission } = usePermissions();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default PermissionGate;
