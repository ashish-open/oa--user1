
import React from 'react';
import { CreditCard, ArrowUpRight, DatabaseIcon } from 'lucide-react';
import { Transaction } from '@/types';

export function useServiceIcons() {
  // Helper to get service category icon
  const getServiceIcon = (serviceCategory: Transaction['serviceCategory']) => {
    switch (serviceCategory) {
      case 'payin': return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'payout': return <ArrowUpRight className="h-4 w-4 text-purple-600" />;
      case 'api': return <DatabaseIcon className="h-4 w-4 text-green-600" />;
      default: return null;
    }
  };

  return {
    getServiceIcon
  };
}
