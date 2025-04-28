
import { useQuery } from '@tanstack/react-query';
import { getUsers, getTransactions } from '@/services/api';
import { User, Transaction } from '@/types';

export function useRiskMetrics() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  // Calculate high risk user count
  const getHighRiskUserCount = () => {
    if (!users) return 0;
    return users.filter(user => user.riskScore && user.riskScore > 50).length;
  };

  // Calculate service-specific metrics
  const getServiceMetrics = () => {
    if (!users) return { payin: 0, payout: 0, api: 0 };
    
    const metrics = {
      payin: {
        userCount: users.filter(user => user.serviceUsage?.payin).length,
        highRiskCount: users.filter(user => user.serviceRiskScores?.payin && user.serviceRiskScores.payin > 50).length,
        totalVolume: users.reduce((sum, user) => sum + (user.serviceStats?.payinVolume || 0), 0),
      },
      payout: {
        userCount: users.filter(user => user.serviceUsage?.payout).length,
        highRiskCount: users.filter(user => user.serviceRiskScores?.payout && user.serviceRiskScores.payout > 50).length,
        totalVolume: users.reduce((sum, user) => sum + (user.serviceStats?.payoutVolume || 0), 0),
      },
      api: {
        userCount: users.filter(user => user.serviceUsage?.api).length,
        highRiskCount: users.filter(user => user.serviceRiskScores?.api && user.serviceRiskScores.api > 50).length,
        totalApiCalls: users.reduce((sum, user) => sum + (user.serviceStats?.apiCallCount || 0), 0),
      }
    };
    
    return metrics;
  };

  // Calculate risk distribution data for chart
  const getRiskDistributionData = () => {
    if (!users) return [];
    
    const riskBuckets = {
      'Low (0-25)': 0,
      'Medium (26-50)': 0,
      'High (51-75)': 0,
      'Critical (76-100)': 0
    };
    
    users.forEach(user => {
      if (!user.riskScore) return;
      
      if (user.riskScore <= 25) riskBuckets['Low (0-25)']++;
      else if (user.riskScore <= 50) riskBuckets['Medium (26-50)']++;
      else if (user.riskScore <= 75) riskBuckets['High (51-75)']++;
      else riskBuckets['Critical (76-100)']++;
    });
    
    return Object.entries(riskBuckets).map(([name, value]) => ({ name, value }));
  };

  // Calculate service usage distribution data
  const getServiceUsageData = () => {
    if (!users) return [];
    
    const services = {
      'Payment Gateway Only': 0,
      'Payout Only': 0,
      'API Only': 0,
      'Payment Gateway & Payout': 0,
      'Payment Gateway & API': 0,
      'Payout & API': 0,
      'All Services': 0,
      'No Services': 0
    };
    
    users.forEach(user => {
      const payin = user.serviceUsage?.payin || false;
      const payout = user.serviceUsage?.payout || false;
      const api = user.serviceUsage?.api || false;
      
      if (payin && payout && api) services['All Services']++;
      else if (payin && payout) services['Payment Gateway & Payout']++;
      else if (payin && api) services['Payment Gateway & API']++;
      else if (payout && api) services['Payout & API']++;
      else if (payin) services['Payment Gateway Only']++;
      else if (payout) services['Payout Only']++;
      else if (api) services['API Only']++;
      else services['No Services']++;
    });
    
    return Object.entries(services)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  };

  // Get transaction data by service category
  const getTransactionsByService = () => {
    if (!transactions) return { payin: [], payout: [], api: [] };
    
    return {
      payin: transactions.filter(t => t.serviceCategory === 'payin'),
      payout: transactions.filter(t => t.serviceCategory === 'payout'),
      api: transactions.filter(t => t.serviceCategory === 'api')
    };
  };

  return {
    getHighRiskUserCount,
    getServiceMetrics,
    getRiskDistributionData,
    getServiceUsageData,
    getTransactionsByService
  };
}
