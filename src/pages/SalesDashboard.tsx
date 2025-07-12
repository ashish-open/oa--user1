import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Phone,
  Mail,
  Star
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SalesDashboard: React.FC = () => {
  // Mock sales data - in real app this would come from API
  const salesMetrics = {
    totalRevenue: 2450000,
    monthlyGrowth: 12.5,
    newCustomers: 127,
    conversionRate: 23.8,
    averageDealSize: 8750,
    pipelineValue: 1250000,
    closedDeals: 45,
    activeCampaigns: 8
  };

  const topPerformers = [
    { name: "Sarah Johnson", deals: 12, revenue: 145000, growth: 18.2 },
    { name: "Mike Chen", deals: 10, revenue: 128000, growth: 15.7 },
    { name: "Emily Davis", deals: 8, revenue: 95000, growth: 22.1 },
    { name: "James Wilson", deals: 7, revenue: 82000, growth: -2.3 },
  ];

  const recentOpportunities = [
    { 
      company: "Tech Solutions Inc", 
      contact: "John Smith", 
      value: 45000, 
      stage: "Negotiation", 
      probability: 85,
      nextAction: "Contract Review",
      dueDate: "2024-01-15"
    },
    { 
      company: "Global Retail Corp", 
      contact: "Lisa Brown", 
      value: 32000, 
      stage: "Proposal", 
      probability: 60,
      nextAction: "Follow-up Call",
      dueDate: "2024-01-12"
    },
    { 
      company: "Manufacturing Plus", 
      contact: "Robert Lee", 
      value: 67000, 
      stage: "Demo", 
      probability: 40,
      nextAction: "Product Demo",
      dueDate: "2024-01-10"
    },
    { 
      company: "StartUp Ventures", 
      contact: "Alex Turner", 
      value: 23000, 
      stage: "Qualified", 
      probability: 25,
      nextAction: "Needs Analysis",
      dueDate: "2024-01-08"
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Negotiation': return 'bg-green-100 text-green-800 border-green-200';
      case 'Proposal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Demo': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Qualified': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <DashboardLayout title="Sales Dashboard">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(salesMetrics.totalRevenue)}</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                +{salesMetrics.monthlyGrowth}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesMetrics.newCustomers}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesMetrics.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Lead to customer
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(salesMetrics.averageDealSize)}</div>
              <p className="text-xs text-muted-foreground">
                Average transaction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{formatCurrency(salesMetrics.pipelineValue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Closed Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{salesMetrics.closedDeals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{salesMetrics.activeCampaigns}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
              <Button size="sm" variant="outline">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Sales team performance this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={performer.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <span className="text-sm font-medium">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{performer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {performer.deals} deals • {formatCurrency(performer.revenue)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {performer.growth >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${performer.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {performer.growth >= 0 ? '+' : ''}{performer.growth}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Opportunities</CardTitle>
              <CardDescription>Latest sales opportunities in pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOpportunities.map((opportunity) => (
                  <div key={opportunity.company} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">{opportunity.company}</div>
                        <div className="text-sm text-muted-foreground">{opportunity.contact}</div>
                      </div>
                      <Badge className={`${getStageColor(opportunity.stage)} border`}>
                        {opportunity.stage}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{formatCurrency(opportunity.value)}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{opportunity.probability}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{opportunity.dueDate}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Next: {opportunity.nextAction}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesDashboard;