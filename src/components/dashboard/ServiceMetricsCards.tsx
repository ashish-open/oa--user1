
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

  return (
    <div className={`grid gap-4 grid-cols-1 md:grid-cols-3 ${className}`}>
      {/* Payment Gateway (Payin) Metrics */}
      <StatsCard
        title="Payment Gateway"
        value={formatCurrency(metrics.payin?.totalVolume || 0)}
        description={`${safeFormatNumber(metrics.payin?.userCount)} users | ${safeFormatNumber(metrics.payin?.highRiskCount)} high risk`}
        icon={<CreditCard className="h-5 w-5 text-blue-500" />}
        trend={(metrics.payin?.highRiskCount && metrics.payin?.userCount) ? { 
          value: Math.round((metrics.payin.highRiskCount / metrics.payin.userCount) * 100) || 0, 
          isPositive: false 
        } : undefined}
        onClick={() => navigate('/transactions?service=payin')}
      />

      {/* Payout Metrics */}
      <StatsCard
        title="Payout Service"
        value={formatCurrency(metrics.payout?.totalVolume || 0)}
        description={`${safeFormatNumber(metrics.payout?.userCount)} users | ${safeFormatNumber(metrics.payout?.highRiskCount)} high risk`}
        icon={<ArrowUpRight className="h-5 w-5 text-purple-500" />}
        trend={(metrics.payout?.highRiskCount && metrics.payout?.userCount) ? { 
          value: Math.round((metrics.payout.highRiskCount / metrics.payout.userCount) * 100) || 0, 
          isPositive: false 
        } : undefined}
        onClick={() => navigate('/transactions?service=payout')}
      />

      {/* API Service Metrics */}
      <StatsCard
        title="API Services"
        value={safeFormatNumber(metrics.api?.totalApiCalls || 0)}
        description={`${safeFormatNumber(metrics.api?.userCount)} users | ${safeFormatNumber(metrics.api?.highRiskCount)} high risk`}
        icon={<DatabaseIcon className="h-5 w-5 text-green-500" />}
        trend={(metrics.api?.highRiskCount && metrics.api?.userCount) ? { 
          value: Math.round((metrics.api.highRiskCount / metrics.api.userCount) * 100) || 0, 
          isPositive: false 
        } : undefined}
        onClick={() => navigate('/transactions?service=api')}
      />
    </div>
  );
};

export default ServiceMetricsCards;
