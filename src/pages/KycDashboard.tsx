
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatsCard from '@/components/dashboard/StatsCard';
import { Users, CheckCircle, Clock, XCircle, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/kyc/DateRangePicker';
import { KycStatusDistribution } from '@/components/kyc/KycStatusDistribution';
import { PgPartnerDistribution } from '@/components/kyc/PgPartnerDistribution';
import { KycPerformanceMetrics } from '@/components/kyc/KycPerformanceMetrics';
import { OnboardingMetrics } from '@/components/kyc/OnboardingMetrics';

const KycDashboard: React.FC = () => {
  // Date range state for filtering
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  // Tab state for switching between daily/monthly views
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <DashboardLayout title="KYC Dashboard">
      {/* Date Range Selector */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">KYC Onboarding Analytics</h1>
        <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Total Onboardings"
          value="1,284"
          icon={<Users className="h-5 w-5 text-blue-500" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Verified Users"
          value="876"
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Pending Verification"
          value="245"
          icon={<Clock className="h-5 w-5 text-yellow-500" />}
          trend={{ value: 3, isPositive: false }}
        />
        <StatsCard
          title="Rejected Applications"
          value="163"
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Onboarding Metrics */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Onboarding Metrics</span>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[300px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OnboardingMetrics period={activeTab} dateRange={dateRange} />
          </CardContent>
        </Card>
      </div>

      {/* KYC Status & PG Partner Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>KYC Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <KycStatusDistribution dateRange={dateRange} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>PG Partner Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PgPartnerDistribution dateRange={dateRange} />
          </CardContent>
        </Card>
      </div>

      {/* KYC Performance Metrics */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>KYC Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <KycPerformanceMetrics dateRange={dateRange} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default KycDashboard;
