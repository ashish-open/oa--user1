import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from '@/components/dashboard/StatsCard';
import { Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/kyc/DateRangePicker';
import { KycStatusDistribution } from '@/components/kyc/KycStatusDistribution';
import { PgPartnerDistribution } from '@/components/kyc/PgPartnerDistribution';
import { KycPerformanceMetrics } from '@/components/kyc/KycPerformanceMetrics';
import { OnboardingMetrics } from '@/components/kyc/OnboardingMetrics';

type PeriodType = 'daily' | 'monthly';

const KycOverview: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [activeTab, setActiveTab] = useState<PeriodType>('daily');

  return (
    <DashboardLayout title="KYC Overview">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">KYC Onboarding Analytics</h1>
        <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
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
      <div className="mb-8">
        <Card className="overflow-visible">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Onboarding Metrics</span>
              <div className="w-[300px]">
                <button
                  className={`px-4 py-2 ${activeTab === 'daily' ? 'font-bold' : ''}`}
                  onClick={() => setActiveTab('daily')}
                >
                  Daily
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === 'monthly' ? 'font-bold' : ''}`}
                  onClick={() => setActiveTab('monthly')}
                >
                  Monthly
                </button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OnboardingMetrics period={activeTab} dateRange={dateRange} />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="overflow-visible">
          <CardHeader>
            <CardTitle>KYC Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <KycStatusDistribution dateRange={dateRange} />
          </CardContent>
        </Card>
        <Card className="overflow-visible">
          <CardHeader>
            <CardTitle>PG Partner Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PgPartnerDistribution dateRange={dateRange} />
          </CardContent>
        </Card>
      </div>
      <div className="mb-8">
        <Card className="overflow-visible">
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

export default KycOverview; 