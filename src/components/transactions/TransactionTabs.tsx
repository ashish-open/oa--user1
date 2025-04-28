
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ArrowUpRight, DatabaseIcon } from 'lucide-react';

interface TransactionTabsProps {
  activeTab: 'all' | 'payin' | 'payout' | 'api';
  setActiveTab: (value: 'all' | 'payin' | 'payout' | 'api') => void;
  totalTransactions: number;
  getTransactionCountByService: (serviceCategory: 'payin' | 'payout' | 'api') => number;
}

const TransactionTabs: React.FC<TransactionTabsProps> = ({
  activeTab,
  setActiveTab,
  totalTransactions,
  getTransactionCountByService
}) => {
  return (
    <TabsList className="grid grid-cols-4 mb-6">
      <TabsTrigger 
        value="all" 
        className="flex items-center gap-2"
        onClick={() => setActiveTab('all')}
      >
        All Services
        <Badge variant="outline" className="ml-1">{totalTransactions}</Badge>
      </TabsTrigger>
      <TabsTrigger 
        value="payin" 
        className="flex items-center gap-2"
        onClick={() => setActiveTab('payin')}
      >
        <CreditCard className="h-4 w-4" />
        Payment Gateway
        <Badge variant="outline" className="ml-1">{getTransactionCountByService('payin')}</Badge>
      </TabsTrigger>
      <TabsTrigger 
        value="payout" 
        className="flex items-center gap-2"
        onClick={() => setActiveTab('payout')}
      >
        <ArrowUpRight className="h-4 w-4" />
        Payouts
        <Badge variant="outline" className="ml-1">{getTransactionCountByService('payout')}</Badge>
      </TabsTrigger>
      <TabsTrigger 
        value="api" 
        className="flex items-center gap-2"
        onClick={() => setActiveTab('api')}
      >
        <DatabaseIcon className="h-4 w-4" />
        API Services
        <Badge variant="outline" className="ml-1">{getTransactionCountByService('api')}</Badge>
      </TabsTrigger>
    </TabsList>
  );
};

export default TransactionTabs;
