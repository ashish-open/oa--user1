import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  Play, 
  Pause, 
  Mail, 
  Phone, 
  MessageSquare,
  Users,
  Target,
  TrendingUp,
  Calendar,
  Edit,
  Copy,
  Trash2
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SalesCampaigns: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Mock campaigns data
  const campaigns = [
    {
      id: 'CAMP001',
      name: 'Q1 Enterprise Outreach',
      type: 'Email',
      status: 'Active',
      targetSegment: 'Enterprise',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      totalContacts: 450,
      sent: 425,
      opened: 289,
      clicked: 87,
      converted: 23,
      revenue: 345000,
      cost: 15000,
      roi: 2200
    },
    {
      id: 'CAMP002',
      name: 'Product Demo Follow-up',
      type: 'Phone',
      status: 'Active',
      targetSegment: 'Qualified Leads',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      totalContacts: 125,
      sent: 98,
      opened: 0, // N/A for phone
      clicked: 0, // N/A for phone
      converted: 18,
      revenue: 245000,
      cost: 8500,
      roi: 2782
    },
    {
      id: 'CAMP003',
      name: 'Holiday Promotion',
      type: 'SMS',
      status: 'Completed',
      targetSegment: 'Existing Customers',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      totalContacts: 890,
      sent: 890,
      opened: 0, // N/A for SMS
      clicked: 234,
      converted: 67,
      revenue: 125000,
      cost: 5500,
      roi: 2173
    },
    {
      id: 'CAMP004',
      name: 'Upsell Campaign',
      type: 'Email',
      status: 'Paused',
      targetSegment: 'High Value',
      startDate: '2024-01-10',
      endDate: '2024-02-28',
      totalContacts: 235,
      sent: 189,
      opened: 142,
      clicked: 45,
      converted: 12,
      revenue: 89000,
      cost: 4200,
      roi: 2019
    },
    {
      id: 'CAMP005',
      name: 'Win-Back Series',
      type: 'Multi-channel',
      status: 'Draft',
      targetSegment: 'Churned Customers',
      startDate: '2024-02-01',
      endDate: '2024-04-30',
      totalContacts: 320,
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      cost: 0,
      roi: 0
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Email': return <Mail className="h-4 w-4" />;
      case 'Phone': return <Phone className="h-4 w-4" />;
      case 'SMS': return <MessageSquare className="h-4 w-4" />;
      case 'Multi-channel': return <Target className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = searchTerm === '' || 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.targetSegment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate summary metrics
  const totalRevenue = filteredCampaigns.reduce((sum, campaign) => sum + campaign.revenue, 0);
  const totalCost = filteredCampaigns.reduce((sum, campaign) => sum + campaign.cost, 0);
  const totalConverted = filteredCampaigns.reduce((sum, campaign) => sum + campaign.converted, 0);
  const avgROI = filteredCampaigns.length > 0 
    ? filteredCampaigns.reduce((sum, campaign) => sum + campaign.roi, 0) / filteredCampaigns.length 
    : 0;

  return (
    <DashboardLayout title="Sales Campaigns">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                From all campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campaign ROI</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(avgROI)}%</div>
              <p className="text-xs text-muted-foreground">
                Average return on investment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalConverted}</div>
              <p className="text-xs text-muted-foreground">
                Total conversions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaigns.filter(c => c.status === 'Active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently running
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Campaign Management</CardTitle>
                <CardDescription>Manage and monitor your sales campaigns</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                New Campaign
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Paused">Paused</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type-filter">Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type-filter">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="Multi-channel">Multi-channel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    Templates
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns Table */}
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Target Segment</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => {
                    const conversionRate = campaign.sent > 0 ? Math.round((campaign.converted / campaign.sent) * 100) : 0;
                    const openRate = campaign.sent > 0 && campaign.opened > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0;
                    
                    return (
                      <TableRow key={campaign.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{campaign.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {campaign.startDate} - {campaign.endDate}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(campaign.type)}
                            <span>{campaign.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(campaign.status)} border`}>
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{campaign.targetSegment}</span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">{campaign.converted}</span> / {campaign.totalContacts} converted
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {conversionRate}% conversion {openRate > 0 && `• ${openRate}% open`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{formatCurrency(campaign.revenue)}</div>
                            <div className="text-xs text-muted-foreground">
                              Cost: {formatCurrency(campaign.cost)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">
                            {campaign.roi > 0 ? `${campaign.roi}%` : 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {campaign.status === 'Active' ? (
                              <Button variant="outline" size="sm">
                                <Pause className="h-3 w-3" />
                              </Button>
                            ) : campaign.status === 'Paused' || campaign.status === 'Draft' ? (
                              <Button variant="outline" size="sm">
                                <Play className="h-3 w-3" />
                              </Button>
                            ) : null}
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Performance Insights */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Campaigns</CardTitle>
              <CardDescription>Highest ROI campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns
                  .filter(c => c.roi > 0)
                  .sort((a, b) => b.roi - a.roi)
                  .slice(0, 3)
                  .map((campaign, index) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full text-xs font-medium">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {campaign.converted} conversions • {formatCurrency(campaign.revenue)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">{campaign.roi}%</div>
                        <div className="text-xs text-muted-foreground">ROI</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Types Performance</CardTitle>
              <CardDescription>Performance by channel type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Email', 'Phone', 'SMS', 'Multi-channel'].map((type) => {
                  const typeCampaigns = campaigns.filter(c => c.type === type && c.revenue > 0);
                  const avgRevenue = typeCampaigns.length > 0 
                    ? typeCampaigns.reduce((sum, c) => sum + c.revenue, 0) / typeCampaigns.length 
                    : 0;
                  const avgROI = typeCampaigns.length > 0 
                    ? typeCampaigns.reduce((sum, c) => sum + c.roi, 0) / typeCampaigns.length 
                    : 0;
                  
                  return (
                    <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(type)}
                        <div>
                          <div className="font-medium">{type}</div>
                          <div className="text-sm text-muted-foreground">
                            {typeCampaigns.length} campaigns
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(avgRevenue)}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(avgROI)}% avg ROI
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesCampaigns;