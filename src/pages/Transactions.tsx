
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Transaction } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const Transactions: React.FC = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Transaction['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Transaction['type'] | 'all'>('all');
  
  // Fetch transactions
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  // Helper to get transaction status style
  const getStatusStyle = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter transactions
  const filteredTransactions = transactions
    ? transactions.filter((transaction) => {
        const matchesSearch = 
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
        const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
      })
    : [];

  return (
    <DashboardLayout title="Transactions">
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>View and filter all platform transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div>
              <Input
                placeholder="Search by ID or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as Transaction['status'] | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as Transaction['type'] | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Transactions Table */}
          {isLoading ? (
            <div className="space-y-4">
              {Array(10).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-md border">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">ID</th>
                    <th scope="col" className="px-6 py-3">Description</th>
                    <th scope="col" className="px-6 py-3">Type</th>
                    <th scope="col" className="px-6 py-3">Amount</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{transaction.id}</td>
                        <td className="px-6 py-4">{transaction.description}</td>
                        <td className="px-6 py-4 capitalize">{transaction.type}</td>
                        <td className="px-6 py-4">{formatCurrency(transaction.amount)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">No transactions found matching your filters</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Transactions;
