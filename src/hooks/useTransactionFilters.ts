
import { useState } from 'react';
import { Transaction } from '@/types';

export function useTransactionFilters(transactions: Transaction[] | undefined) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Transaction['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Transaction['type'] | 'all'>('all');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<'all' | 'payin' | 'payout' | 'api'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'payin' | 'payout' | 'api'>('all');

  // Filter transactions
  const filteredTransactions = transactions
    ? transactions.filter((transaction) => {
        const matchesSearch = 
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
        const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
        const matchesServiceCategory = serviceCategoryFilter === 'all' || transaction.serviceCategory === serviceCategoryFilter;
        const matchesTab = activeTab === 'all' || transaction.serviceCategory === activeTab;
        
        return matchesSearch && matchesStatus && matchesType && matchesServiceCategory && matchesTab;
      })
    : [];

  // Get transaction count by service category
  const getTransactionCountByService = (serviceCategory: 'payin' | 'payout' | 'api') => {
    return transactions ? transactions.filter(t => t.serviceCategory === serviceCategory).length : 0;
  };

  // Get total volume by service category
  const getTotalVolumeByService = (serviceCategory: 'payin' | 'payout' | 'api') => {
    return transactions 
      ? transactions
          .filter(t => t.serviceCategory === serviceCategory)
          .reduce((sum, t) => sum + t.amount, 0)
      : 0;
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter, 
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    serviceCategoryFilter,
    setServiceCategoryFilter,
    activeTab,
    setActiveTab,
    filteredTransactions,
    getTransactionCountByService,
    getTotalVolumeByService
  };
}
