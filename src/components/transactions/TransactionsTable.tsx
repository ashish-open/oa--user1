
import React from 'react';
import { Transaction } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  getStatusStyle: (status: Transaction['status']) => string;
  getServiceStyle: (serviceCategory: Transaction['serviceCategory']) => string;
  getServiceIcon: (serviceCategory: Transaction['serviceCategory']) => React.ReactNode;
  formatCurrency: (amount: number) => string;
  serviceSpecificColumns?: Array<{
    header: string;
    key: string;
    formatter?: (value: any) => string;
  }>;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isLoading,
  getStatusStyle,
  getServiceStyle,
  getServiceIcon,
  formatCurrency,
  serviceSpecificColumns = []
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(10).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto rounded-md border">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Description</th>
            <th scope="col" className="px-6 py-3">Type</th>
            <th scope="col" className="px-6 py-3">Service</th>
            <th scope="col" className="px-6 py-3">Amount</th>
            {serviceSpecificColumns.map(col => (
              <th key={col.key} scope="col" className="px-6 py-3">{col.header}</th>
            ))}
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{transaction.id}</td>
                <td className="px-6 py-4">{transaction.description}</td>
                <td className="px-6 py-4 capitalize">{transaction.type}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getServiceStyle(transaction.serviceCategory)}`}>
                      {getServiceIcon(transaction.serviceCategory)}
                      {transaction.serviceCategory === 'payin' ? 'Payment Gateway' : 
                       transaction.serviceCategory === 'payout' ? 'Payout' : 'API'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">{formatCurrency(transaction.amount)}</td>
                
                {serviceSpecificColumns.map(col => (
                  <td key={col.key} className="px-6 py-4">
                    {transaction[col.key as keyof Transaction] !== undefined ? 
                      (col.formatter ? 
                        col.formatter(transaction[col.key as keyof Transaction]) : 
                        transaction[col.key as keyof Transaction]
                      ) : 'N/A'
                    }
                  </td>
                ))}
                
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
              <td colSpan={7 + serviceSpecificColumns.length} className="px-6 py-4 text-center">No transactions found matching your filters</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
