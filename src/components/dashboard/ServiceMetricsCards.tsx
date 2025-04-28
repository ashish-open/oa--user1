
import React from 'react';
import { CreditCard, ArrowUpRight, DatabaseIcon, AlertTriangle } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatters';
import { useRiskMetrics } from '@/hooks/useRiskMetrics';

interface ServiceMetricsCardsProps {
  className?: string;
}

const ServiceMetricsCards: React.FC<ServiceMetricsCardsProps> = ({ className }) => {
  const { getServiceMetrics } = useRiskMetrics();
  const navigate = useNavigate();
  const metrics = getServiceMetrics();

  return (
    <div className={`grid gap-4 grid-cols-1 md:grid-cols-3 ${className}`}>
      {/* Payment Gateway (Payin) Metrics */}
      <StatsCard
        title="Payment Gateway"
        value={formatCurrency(metrics.payin.totalVolume)}
        description={`${metrics.payin.userCount} users | ${metrics.payin.highRiskCount} high risk`}
        icon={<CreditCard className="h-5 w-5 text-blue-500" />}
        trend={metrics.payin.highRiskCount > 0 ? { 
          value: Math.round((metrics.payin.highRiskCount / metrics.payin.userCount) * 100) || 0, 
          isPositive: false 
        } : undefined}
        onClick={() => navigate('/transactions?service=payin')}
      />

      {/* Payout Metrics */}
      <StatsCard
        title="Payout Service"
        value={formatCurrency(metrics.payout.totalVolume)}
        description={`${metrics.payout.userCount} users | ${metrics.payout.highRiskCount} high risk`}
        icon={<ArrowUpRight className="h-5 w-5 text-purple-500" />}
        trend={metrics.payout.highRiskCount > 0 ? { 
          value: Math.round((metrics.payout.highRiskCount / metrics.payout.userCount) * 100) || 0, 
          isPositive: false 
        } : undefined}
        onClick={() => navigate('/transactions?service=payout')}
      />

      {/* API Service Metrics */}
      <StatsCard
        title="API Services"
        value={metrics.api.totalApiCalls.toLocaleString()}
        description={`${metrics.api.userCount} users | ${metrics.api.highRiskCount} high risk`}
        icon={<DatabaseIcon className="h-5 w-5 text-green-500" />}
        trend={metrics.api.highRiskCount > 0 ? { 
          value: Math.round((metrics.api.highRiskCount / metrics.api.userCount) * 100) || 0, 
          isPositive: false 
        } : undefined}
        onClick={() => navigate('/transactions?service=api')}
      />
    </div>
  );
};

export default ServiceMetricsCards;
