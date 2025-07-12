import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, TrendingUp } from 'lucide-react';

const SalesPipeline: React.FC = () => {
  // Mock pipeline data
  const pipelineStages = [
    { 
      name: 'Prospects', 
      count: 45, 
      value: 235000, 
      opportunities: [
        { company: 'Tech Corp A', value: 25000, contact: 'John Smith' },
        { company: 'Retail Inc B', value: 18000, contact: 'Jane Doe' },
        { company: 'Manufacturing C', value: 32000, contact: 'Bob Wilson' },
      ]
    },
    { 
      name: 'Qualified Leads', 
      count: 28, 
      value: 410000,
      opportunities: [
        { company: 'Healthcare Systems', value: 89000, contact: 'Dr. Sarah Wilson' },
        { company: 'StartUp Ventures', value: 23000, contact: 'Alex Turner' },
        { company: 'Education Plus', value: 45000, contact: 'Maria Garcia' },
      ]
    },
    { 
      name: 'Demo/Discovery', 
      count: 15, 
      value: 320000,
      opportunities: [
        { company: 'Manufacturing Plus', value: 67000, contact: 'Robert Lee' },
        { company: 'Financial Services', value: 125000, contact: 'David Chen' },
        { company: 'Logistics Pro', value: 78000, contact: 'Emma Davis' },
      ]
    },
    { 
      name: 'Proposal', 
      count: 12, 
      value: 285000,
      opportunities: [
        { company: 'Global Retail Corp', value: 32000, contact: 'Lisa Brown' },
        { company: 'Construction Ltd', value: 95000, contact: 'Mike Johnson' },
        { company: 'Media Group', value: 58000, contact: 'Sarah Lee' },
      ]
    },
    { 
      name: 'Negotiation', 
      count: 8, 
      value: 380000,
      opportunities: [
        { company: 'Tech Solutions Inc', value: 45000, contact: 'John Smith' },
        { company: 'Enterprise Corp', value: 155000, contact: 'Amanda Wilson' },
        { company: 'Innovation Labs', value: 98000, contact: 'Chris Taylor' },
      ]
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalPipelineValue = pipelineStages.reduce((sum, stage) => sum + stage.value, 0);
  const totalOpportunities = pipelineStages.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <DashboardLayout title="Sales Pipeline">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPipelineValue)}</div>
              <p className="text-xs text-muted-foreground">
                Across all stages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOpportunities}</div>
              <p className="text-xs text-muted-foreground">
                Active opportunities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPipelineValue / totalOpportunities)}</div>
              <p className="text-xs text-muted-foreground">
                Average opportunity value
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Stages */}
        <div className="grid gap-4 md:grid-cols-5">
          {pipelineStages.map((stage, index) => {
            const conversionRate = index === 0 ? 100 : Math.round((stage.count / pipelineStages[index - 1].count) * 100);
            
            return (
              <Card key={stage.name} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                    {index > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {conversionRate}%
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{stage.count}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(stage.value)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {stage.opportunities.slice(0, 3).map((opportunity) => (
                      <div key={opportunity.company} className="p-2 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium truncate">{opportunity.company}</div>
                        <div className="text-xs text-muted-foreground">{opportunity.contact}</div>
                        <div className="text-sm font-semibold mt-1">
                          {formatCurrency(opportunity.value)}
                        </div>
                      </div>
                    ))}
                    {stage.count > 3 && (
                      <div className="text-xs text-center text-muted-foreground">
                        +{stage.count - 3} more
                      </div>
                    )}
                  </div>
                </CardContent>
                
                {/* Pipeline flow arrow */}
                {index < pipelineStages.length - 1 && (
                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 hidden md:block">
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-300 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Pipeline Analytics */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Stage Performance</CardTitle>
              <CardDescription>Conversion rates between stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pipelineStages.slice(1).map((stage, index) => {
                  const prevStage = pipelineStages[index];
                  const conversionRate = Math.round((stage.count / prevStage.count) * 100);
                  
                  return (
                    <div key={stage.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{prevStage.name} → {stage.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {prevStage.count} → {stage.count} opportunities
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{conversionRate}%</div>
                        <div className="text-xs text-muted-foreground">conversion</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline Health</CardTitle>
              <CardDescription>Key pipeline metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Average Deal Size</div>
                      <div className="text-sm text-muted-foreground">Across all stages</div>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(totalPipelineValue / totalOpportunities)}
                    </div>
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Pipeline Velocity</div>
                      <div className="text-sm text-muted-foreground">Average time to close</div>
                    </div>
                    <div className="text-2xl font-bold">32 days</div>
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Win Rate</div>
                      <div className="text-sm text-muted-foreground">Overall success rate</div>
                    </div>
                    <div className="text-2xl font-bold">23.5%</div>
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Monthly Forecast</div>
                      <div className="text-sm text-muted-foreground">Expected revenue</div>
                    </div>
                    <div className="text-2xl font-bold">
                      {formatCurrency(Math.round(totalPipelineValue * 0.235))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesPipeline;