
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Transaction } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  DatabaseIcon
} from 'lucide-react';

const Transactions: React.FC = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Transaction['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Transaction['type'] | 'all'>('all');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<'all' | 'payin' | 'payout' | 'api'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'payin' | 'payout' | 'api'>('all');
  
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

  // Helper to get service category icon
  const getServiceIcon = (serviceCategory: Transaction['serviceCategory']) => {
    switch (serviceCategory) {
      case 'payin': return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'payout': return <ArrowUpRight className="h-4 w-4 text-purple-600" />;
      case 'api': return <DatabaseIcon className="h-4 w-4 text-green-600" />;
      default: return null;
    }
  };

  // Helper to get service category style
  const getServiceStyle = (serviceCategory: Transaction['serviceCategory']) => {
    switch (serviceCategory) {
      case 'payin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'payout': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'api': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  return (
    <DashboardLayout title="Transactions">
      <Card>
        <CardHeader>
          <CardTitle>Transactions by Service</CardTitle>
          <CardDescription>View and analyze transactions across different payment services</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="all" 
            className="w-full" 
            onValueChange={(value) => setActiveTab(value as 'all' | 'payin' | 'payout' | 'api')}
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all" className="flex items-center gap-2">
                All Services
                <Badge variant="outline" className="ml-1">{transactions?.length || 0}</Badge>
              </TabsTrigger>
              <TabsTrigger value="payin" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Gateway
                <Badge variant="outline" className="ml-1">{getTransactionCountByService('payin')}</Badge>
              </TabsTrigger>
              <TabsTrigger value="payout" className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Payouts
                <Badge variant="outline" className="ml-1">{getTransactionCountByService('payout')}</Badge>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <DatabaseIcon className="h-4 w-4" />
                API Services
                <Badge variant="outline" className="ml-1">{getTransactionCountByService('api')}</Badge>
              </TabsTrigger>
            </TabsList>
            
            {/* Service Stats */}
            {activeTab !== 'all' && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="bg-slate-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Volume</p>
                        <p className="text-2xl font-bold">{formatCurrency(getTotalVolumeByService(activeTab as 'payin' | 'payout' | 'api'))}</p>
                      </div>
                      {getServiceIcon(activeTab as Transaction['serviceCategory'])}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Transaction Count</p>
                        <p className="text-2xl font-bold">{getTransactionCountByService(activeTab as 'payin' | 'payout' | 'api')}</p>
                      </div>
                      {activeTab === 'payin' ? <CreditCard className="h-5 w-5 text-blue-600" /> : 
                       activeTab === 'payout' ? <ArrowUpRight className="h-5 w-5 text-purple-600" /> :
                       <DatabaseIcon className="h-5 w-5 text-green-600" />}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                        <p className="text-2xl font-bold">
                          {transactions 
                            ? Math.round((transactions.filter(t => 
                                t.serviceCategory === activeTab && 
                                t.status === 'completed'
                              ).length / Math.max(getTransactionCountByService(activeTab as 'payin' | 'payout' | 'api'), 1)) * 100) 
                            : 0}%
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters */}
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

export default Transactions;
