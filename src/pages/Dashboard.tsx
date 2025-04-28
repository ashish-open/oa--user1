
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, BarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/formatters';
import { useRiskMetrics } from '@/hooks/useRiskMetrics';
import ServiceMetricsCards from '@/components/dashboard/ServiceMetricsCards';
import HighRiskUsersTable from '@/components/dashboard/HighRiskUsersTable';
import RiskDistributionChart from '@/components/dashboard/RiskDistributionChart';
import ServiceUsageDistribution from '@/components/dashboard/ServiceUsageDistribution';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { getHighRiskUserCount } = useRiskMetrics();
  
  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  return (
    <DashboardLayout title="Risk Dashboard">
      {/* Main Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {statsLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatsCard
              title="Total Users"
              value={stats?.totalUsers.toLocaleString() || '0'}
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 12, isPositive: true }}
              onClick={() => navigate('/users')}
            />
            <StatsCard
              title="Total Volume"
              value={formatCurrency(stats?.totalAmount || 0)}
              icon={<BarChart className="h-5 w-5" />}
              trend={{ value: 5, isPositive: true }}
              onClick={() => navigate('/transactions')}
            />
            <StatsCard
              title="Active Alerts"
              value={stats?.activeAlerts.toLocaleString() || '0'}
              icon={<AlertTriangle className="h-5 w-5" />}
              trend={{ value: 3, isPositive: false }}
              onClick={() => navigate('/alerts')}
            />
            <StatsCard
              title="High Risk Users"
              value={getHighRiskUserCount()}
              icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
              trend={{ value: 8, isPositive: false }}
              onClick={() => navigate('/users?risk=high')}
            />
          </>
        )}
      </div>
      
      {/* Service-specific Metrics */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Service Metrics</h2>
        <ServiceMetricsCards />
      </div>

      {/* Risk Distribution and Service Usage Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RiskDistributionChart />
        <ServiceUsageDistribution />
      </div>

      {/* High Risk Users Table */}
      <div className="mb-6">
        <HighRiskUsersTable />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
