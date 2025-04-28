
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';

// Import extracted components
import TransactionsTable from '@/components/transactions/TransactionsTable';
import TransactionsFilter from '@/components/transactions/TransactionsFilter';
import TransactionServiceStats from '@/components/transactions/TransactionServiceStats';
import TransactionTabs from '@/components/transactions/TransactionTabs';

// Import hooks and utilities
import { formatCurrency } from '@/utils/formatters';
import { getStatusStyle, getServiceStyle } from '@/utils/styleHelpers';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';
import { useServiceIcons } from '@/hooks/useServiceIcons';

const Transactions: React.FC = () => {
  // Fetch transactions
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  // Get filter state and utils
  const {
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
  } = useTransactionFilters(transactions);

  // Get service icons
  const { getServiceIcon } = useServiceIcons();

  return (
    <DashboardLayout title="Transactions">
      <Card>
        <CardHeader>
          <CardTitle>Transactions by Service</CardTitle>
          <CardDescription>View and analyze transactions across different payment services</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            className="w-full"
            onValueChange={(value) => setActiveTab(value as 'all' | 'payin' | 'payout' | 'api')}
          >
            <TransactionTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              totalTransactions={transactions?.length || 0}
              getTransactionCountByService={getTransactionCountByService}
            />
            
            {/* Service Stats */}
            {activeTab !== 'all' && (
              <TransactionServiceStats 
                activeTab={activeTab as 'payin' | 'payout' | 'api'}
                transactions={transactions}
                getTransactionCountByService={getTransactionCountByService}
                getTotalVolumeByService={getTotalVolumeByService}
                formatCurrency={formatCurrency}
              />
            )}

            {/* Filters */}
            <TransactionsFilter 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              serviceCategoryFilter={serviceCategoryFilter}
              setServiceCategoryFilter={setServiceCategoryFilter}
            />

            <TabsContent value="all" className="mt-0">
              {/* All Services View */}
              <TransactionsTable 
                transactions={filteredTransactions} 
                isLoading={isLoading} 
                getStatusStyle={getStatusStyle} 
                getServiceStyle={getServiceStyle}
                getServiceIcon={getServiceIcon}
                formatCurrency={formatCurrency}
              />
            </TabsContent>
            
            <TabsContent value="payin" className="mt-0">
              {/* Payment Gateway View */}
              <TransactionsTable 
                transactions={filteredTransactions} 
                isLoading={isLoading} 
                getStatusStyle={getStatusStyle} 
                getServiceStyle={getServiceStyle}
                getServiceIcon={getServiceIcon}
                formatCurrency={formatCurrency}
                serviceSpecificColumns={[
                  { header: "Processor", key: "processorName" },
                  { header: "Fee", key: "processingFee", formatter: (val) => val ? formatCurrency(val as number) : 'N/A' }
                ]}
              />
            </TabsContent>
            
            <TabsContent value="payout" className="mt-0">
              {/* Payout View */}
              <TransactionsTable 
                transactions={filteredTransactions} 
                isLoading={isLoading} 
                getStatusStyle={getStatusStyle} 
                getServiceStyle={getServiceStyle}
                getServiceIcon={getServiceIcon}
                formatCurrency={formatCurrency}
                serviceSpecificColumns={[
                  { header: "Recipient", key: "recipient" },
                  { header: "Method", key: "methodUsed" }
                ]}
              />
            </TabsContent>
            
            <TabsContent value="api" className="mt-0">
              {/* API Services View */}
              <TransactionsTable 
                transactions={filteredTransactions} 
                isLoading={isLoading} 
                getStatusStyle={getStatusStyle} 
                getServiceStyle={getServiceStyle}
                getServiceIcon={getServiceIcon}
                formatCurrency={formatCurrency}
                serviceSpecificColumns={[
                  { header: "Endpoint", key: "apiEndpoint" },
                  { header: "Response Time", key: "responseTime", formatter: (val) => val ? `${val}ms` : 'N/A' }
                ]}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Transactions;
