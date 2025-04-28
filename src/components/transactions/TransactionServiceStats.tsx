
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, CreditCard, DatabaseIcon, ArrowUpRight } from 'lucide-react';
import { Transaction } from '@/types';

interface TransactionServiceStatsProps {
  activeTab: 'payin' | 'payout' | 'api';
  transactions: Transaction[] | undefined;
  getTransactionCountByService: (serviceCategory: 'payin' | 'payout' | 'api') => number;
  getTotalVolumeByService: (serviceCategory: 'payin' | 'payout' | 'api') => number;
  formatCurrency: (amount: number) => string;
}

const TransactionServiceStats: React.FC<TransactionServiceStatsProps> = ({
  activeTab,
  transactions,
  getTransactionCountByService,
  getTotalVolumeByService,
  formatCurrency
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card className="bg-slate-50">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold">{formatCurrency(getTotalVolumeByService(activeTab))}</p>
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
              <p className="text-sm text-muted-foreground">Transaction Count</p>
              <p className="text-2xl font-bold">{getTransactionCountByService(activeTab)}</p>
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
                    ).length / Math.max(getTransactionCountByService(activeTab), 1)) * 100) 
                  : 0}%
              </p>
            </div>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionServiceStats;
