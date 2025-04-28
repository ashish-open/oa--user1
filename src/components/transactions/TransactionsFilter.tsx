
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction } from '@/types';
import { Clock, Filter, Search } from 'lucide-react';

interface TransactionsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: Transaction['status'] | 'all';
  setStatusFilter: (value: Transaction['status'] | 'all') => void;
  typeFilter: Transaction['type'] | 'all';
  setTypeFilter: (value: Transaction['type'] | 'all') => void;
  serviceCategoryFilter: 'all' | 'payin' | 'payout' | 'api';
  setServiceCategoryFilter: (value: 'all' | 'payin' | 'payout' | 'api') => void;
}

const TransactionsFilter: React.FC<TransactionsFilterProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  serviceCategoryFilter,
  setServiceCategoryFilter
}) => {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-4">
      <div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by ID or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8"
          />
        </div>
      </div>
      <div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as Transaction['status'] | 'all')}
        >
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </div>
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
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Select
          value={serviceCategoryFilter}
          onValueChange={(value) => setServiceCategoryFilter(value as 'all' | 'payin' | 'payout' | 'api')}
        >
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by service" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="payin">Payment Gateway</SelectItem>
            <SelectItem value="payout">Payouts</SelectItem>
            <SelectItem value="api">API Services</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TransactionsFilter;
