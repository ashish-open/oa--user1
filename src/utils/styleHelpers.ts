
import { Transaction } from '@/types';

/**
 * Get CSS class for transaction status
 */
export const getStatusStyle = (status: Transaction['status']) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'failed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get CSS class for service category
 */
export const getServiceStyle = (serviceCategory: Transaction['serviceCategory']) => {
  switch (serviceCategory) {
    case 'payin': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'payout': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'api': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
