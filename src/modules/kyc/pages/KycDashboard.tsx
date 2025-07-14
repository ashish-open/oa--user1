
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
import KycOperationsTab from '@/components/users/KycOperationsTab';

// Define the period type to match what OnboardingMetrics expects
type PeriodType = 'daily' | 'monthly';

// Mock users for KYC Applications tab (replace with real data fetching as needed)
const mockUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'kycAgent' as const,
    createdAt: '2024-04-01T10:00:00Z',
    kycStatus: 'pending' as const,
    kycDetails: {
      documents: [
        { type: 'id' as const, status: 'pending' as const, uploadedAt: '2024-04-01T10:00:00Z' },
      ],
      pgPartner: 'Stripe' as const,
      midStatus: 'pending' as const,
    },
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'kycAgent' as const,
    createdAt: '2024-03-15T09:30:00Z',
    kycStatus: 'verified' as const,
    kycDetails: {
      documents: [
        { type: 'id' as const, status: 'approved' as const, uploadedAt: '2024-03-15T09:30:00Z' },
        { type: 'address' as const, status: 'approved' as const, uploadedAt: '2024-03-15T09:35:00Z' },
      ],
      pgPartner: 'PayPal' as const,
      midStatus: 'active' as const,
      verifiedAt: '2024-03-16T12:00:00Z',
      verifiedBy: 'kycAdmin',
      verificationMethod: 'manual' as const,
    },
  },
  {
    id: '3',
    firstName: 'Alice',
    lastName: 'Brown',
    email: 'alice.brown@example.com',
    role: 'kycAgent' as const,
    createdAt: '2024-02-20T14:20:00Z',
    kycStatus: 'rejected' as const,
    kycDetails: {
      documents: [
        { type: 'id' as const, status: 'rejected' as const, uploadedAt: '2024-02-20T14:20:00Z' },
      ],
      pgPartner: 'Adyen' as const,
      midStatus: 'rejected' as const,
      rejectionReason: 'Document mismatch',
    },
  },
];

const KycDashboard: React.FC = () => {
  // Date range state for filtering
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  // Tab state for switching between daily/monthly views (for Overview)
  const [activeTab, setActiveTab] = useState<PeriodType>('daily');

  // Submenu tab state
  const [activeSubMenu, setActiveSubMenu] = useState<string>('overview');

  // KYC Applications tab state (for modal, etc.)
  const [selectedUser, setSelectedUser] = useState<any>(null);

  return (
    <DashboardLayout title="KYC Dashboard">
      {/* Submenu Tabs */}
      <Tabs value={activeSubMenu} onValueChange={setActiveSubMenu} className="w-full mb-8">
        <TabsList className="grid grid-cols-6 w-full max-w-4xl mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">KYC Applications</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="performance">Team Performance</TabsTrigger>
          <TabsTrigger value="policy">Policy & Documents</TabsTrigger>
          <TabsTrigger value="exceptions">Exceptions/Issues</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Date Range Selector */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">KYC Onboarding Analytics</h1>
            <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
          </div>

          {/* Main Stats Cards */}
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

          {/* Onboarding Metrics */}
          <div className="mb-8">
            <Card className="overflow-visible">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Onboarding Metrics</span>
                  <Tabs value={activeTab} onValueChange={(value: PeriodType) => setActiveTab(value)} className="w-[300px]">
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

          {/* KYC Performance Metrics */}
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
        </TabsContent>

        {/* KYC Applications Tab */}
        <TabsContent value="applications">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">KYC Applications</h2>
            <KycOperationsTab 
              users={mockUsers} 
              isLoading={false} 
              onSelectUser={setSelectedUser} 
              selectedUser={selectedUser}
            />
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">KYC Audit Logs</h2>
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Audit log functionality coming soon.
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Performance Tab */}
        <TabsContent value="performance">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">KYC Team Performance</h2>
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Team performance metrics coming soon.
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Policy & Documents Tab */}
        <TabsContent value="policy">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">KYC Policy & Documents</h2>
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                KYC policy documents and resources coming soon.
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Exceptions/Issues Tab */}
        <TabsContent value="exceptions">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">KYC Exceptions & Issues</h2>
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                KYC exceptions and issue tracking coming soon.
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default KycDashboard;
