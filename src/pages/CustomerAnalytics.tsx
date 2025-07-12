import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CustomerAnalytics: React.FC = () => {
  // Mock customer analytics data
  const customerSegments = [
    {
      name: 'VIP Customers',
      count: 45,
      revenue: 425000,
      avgValue: 9444,
      growth: 18.5,
      retention: 95,
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      name: 'High Value',
      count: 127,
      revenue: 380000,
      avgValue: 2992,
      growth: 12.3,
      retention: 87,
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    {
      name: 'Growth Potential',
      count: 234,
      revenue: 195000,
      avgValue: 833,
      growth: 25.7,
      retention: 78,
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      name: 'Standard',
      count: 456,
      revenue: 125000,
      avgValue: 274,
      growth: -2.1,
      retention: 65,
      color: 'bg-gray-100 text-gray-800 border-gray-200'
    }
  ];

  const topCustomers = [
    {
      name: 'Enterprise Corp',
      segment: 'VIP',
      revenue: 155000,
      growth: 22.5,
      lastOrder: '2024-01-05',
      lifetime: 2.5,
      score: 98
    },
    {
      name: 'Tech Solutions Inc',
      segment: 'VIP',
      revenue: 145000,
      growth: 18.2,
      lastOrder: '2024-01-03',
      lifetime: 3.2,
      score: 95
    },
    {
      name: 'Global Manufacturing',
      segment: 'High Value',
      revenue: 125000,
      growth: 15.7,
      lastOrder: '2024-01-07',
      lifetime: 1.8,
      score: 92
    },
    {
      name: 'Innovation Labs',
      segment: 'High Value',
      revenue: 98000,
      growth: 28.1,
      lastOrder: '2024-01-06',
      lifetime: 1.2,
      score: 88
    },
    {
      name: 'Healthcare Systems',
      segment: 'Growth Potential',
      revenue: 89000,
      growth: 45.3,
      lastOrder: '2024-01-04',
      lifetime: 0.8,
      score: 85
    }
  ];

  const customerMetrics = {
    totalCustomers: 862,
    newCustomers: 45,
    churnRate: 3.2,
    avgLifetime: 18.5,
    totalRevenue: 1125000,
    avgOrderValue: 2750,
    retentionRate: 78.5,
    nps: 72
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'VIP': return '👑';
      case 'High Value': return '💎';
      case 'Growth Potential': return '🚀';
      default: return '👤';
    }
  };

  return (
    <DashboardLayout title="Customer Analytics">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerMetrics.totalCustomers.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                +{customerMetrics.newCustomers} this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(customerMetrics.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                Customer lifetime value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerMetrics.retentionRate}%</div>
              <div className="flex items-center gap-1 text-xs text-red-600">
                <ArrowDownRight className="h-3 w-3" />
                {customerMetrics.churnRate}% churn rate
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerMetrics.nps}</div>
              <p className="text-xs text-muted-foreground">
                Net Promoter Score
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Revenue and growth by customer segment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {customerSegments.map((segment) => (
                <Card key={segment.name} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${segment.color} border`}>
                      {segment.name}
                    </Badge>
                    <span className="text-2xl">{getSegmentIcon(segment.name)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Customers</span>
                      <span className="font-medium">{segment.count}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Revenue</span>
                      <span className="font-medium">{formatCurrency(segment.revenue)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Value</span>
                      <span className="font-medium">{formatCurrency(segment.avgValue)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Growth</span>
                      <div className="flex items-center gap-1">
                        {segment.growth >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-500" />
                        )}
                        <span className={`font-medium ${segment.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {segment.growth >= 0 ? '+' : ''}{segment.growth}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Retention</span>
                      <span className="font-medium">{segment.retention}%</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Highest value customers by revenue and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Growth</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Lifetime (Years)</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCustomers.map((customer, index) => (
                    <TableRow key={customer.name} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full text-xs font-medium">
                            #{index + 1}
                          </div>
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{getSegmentIcon(customer.segment)}</span>
                          <span className="text-sm">{customer.segment}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatCurrency(customer.revenue)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {customer.growth >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                          <span className={customer.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {customer.growth >= 0 ? '+' : ''}{customer.growth}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{customer.lastOrder}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{customer.lifetime} years</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: `${customer.score}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{customer.score}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Additional Metrics */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Lifecycle</CardTitle>
              <CardDescription>Average customer journey metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Average Lifetime</div>
                    <div className="text-sm text-muted-foreground">Time as customer</div>
                  </div>
                  <div className="text-2xl font-bold">{customerMetrics.avgLifetime} months</div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Average Order Value</div>
                    <div className="text-sm text-muted-foreground">Per transaction</div>
                  </div>
                  <div className="text-2xl font-bold">{formatCurrency(customerMetrics.avgOrderValue)}</div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Purchase Frequency</div>
                    <div className="text-sm text-muted-foreground">Orders per month</div>
                  </div>
                  <div className="text-2xl font-bold">2.3x</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Health</CardTitle>
              <CardDescription>Key health indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">At Risk Customers</div>
                    <div className="text-sm text-muted-foreground">May churn soon</div>
                  </div>
                  <div className="text-2xl font-bold text-red-600">23</div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Inactive Customers</div>
                    <div className="text-sm text-muted-foreground">No orders in 90 days</div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">67</div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">High Engagement</div>
                    <div className="text-sm text-muted-foreground">Active in last 30 days</div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">589</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerAnalytics;