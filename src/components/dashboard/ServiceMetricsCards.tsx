
import React from 'react';
import { CreditCard, ArrowUpRight, DatabaseIcon, AlertTriangle } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, safeFormatNumber } from '@/utils/formatters';
import { useRiskMetrics } from '@/hooks/useRiskMetrics';

interface ServiceMetricsCardsProps {
  className?: string;
}

const ServiceMetricsCards: React.FC<ServiceMetricsCardsProps> = ({ className }) => {
  const { getServiceMetrics } = useRiskMetrics();
  const navigate = useNavigate();
  const metrics = getServiceMetrics();

  // Guard against undefined or incomplete metrics data
  if (!metrics || typeof metrics === 'number') {
    return (
      <div className={`grid gap-4 grid-cols-1 md:grid-cols-3 ${className}`}>
        <StatsCard
          title="Loading..."
          value="--"
          icon={<CreditCard className="h-5 w-5 text-blue-500" />}
        />
        <StatsCard
          title="Loading..."
          value="--"
          icon={<ArrowUpRight className="h-5 w-5 text-purple-500" />}
        />
        <StatsCard
          title="Loading..."
          value="--"
          icon={<DatabaseIcon className="h-5 w-5 text-green-500" />}
        />
      </div>
    );
  }

  // Calculate risk percentages safely, ensuring we don't divide by zero
  const calculateRiskPercent = (highRiskCount?: number, userCount?: number) => {
    if (!highRiskCount || !userCount || userCount <= 0) return 0;
    return Math.round((highRiskCount / userCount) * 100);
  };

  // Get safely formatted counts
  const getPayinUserCount = () => safeFormatNumber(metrics.payin?.userCount);
  const getPayinHighRiskCount = () => safeFormatNumber(metrics.payin?.highRiskCount);
  const getPayoutUserCount = () => safeFormatNumber(metrics.payout?.userCount);
  const getPayoutHighRiskCount = () => safeFormatNumber(metrics.payout?.highRiskCount);
  const getApiUserCount = () => safeFormatNumber(metrics.api?.userCount);
  const getApiHighRiskCount = () => safeFormatNumber(metrics.api?.highRiskCount);

  return (
    <div className={`grid gap-4 grid-cols-1 md:grid-cols-3 ${className}`}>
      {/* Payment Gateway (Payin) Metrics */}
      <StatsCard
        title="Payment Gateway"
        value={formatCurrency(metrics.payin?.totalVolume || 0)}
        description={`${getPayinUserCount()} users | ${getPayinHighRiskCount()} high risk`}
        icon={<CreditCard className="h-5 w-5 text-blue-500" />}
        trend={{ 
          value: calculateRiskPercent(metrics.payin?.highRiskCount, metrics.payin?.userCount), 
          isPositive: false 
        }}
        onClick={() => navigate('/transactions?service=payin')}
      />

      {/* Payout Metrics */}
      <StatsCard
        title="Payout Service"
        value={formatCurrency(metrics.payout?.totalVolume || 0)}
        description={`${getPayoutUserCount()} users | ${getPayoutHighRiskCount()} high risk`}
        icon={<ArrowUpRight className="h-5 w-5 text-purple-500" />}
        trend={{ 
          value: calculateRiskPercent(metrics.payout?.highRiskCount, metrics.payout?.userCount), 
          isPositive: false 
        }}
        onClick={() => navigate('/transactions?service=payout')}
      />

      {/* API Service Metrics */}
      <StatsCard
        title="API Services"
        value={safeFormatNumber(metrics.api?.totalApiCalls || 0)}
        description={`${getApiUserCount()} users | ${getApiHighRiskCount()} high risk`}
        icon={<DatabaseIcon className="h-5 w-5 text-green-500" />}
        trend={{ 
          value: calculateRiskPercent(metrics.api?.highRiskCount, metrics.api?.userCount), 
          isPositive: false 
        }}
        onClick={() => navigate('/transactions?service=api')}
      />
    </div>
  );
};

export default ServiceMetricsCards;
