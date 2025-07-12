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
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  DollarSign,
  Star,
  User,
  Building
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SalesOpportunities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Mock opportunities data
  const opportunities = [
    {
      id: 'OPP001',
      company: 'Tech Solutions Inc',
      contact: 'John Smith',
      email: 'john@techsolutions.com',
      phone: '+1 (555) 123-4567',
      value: 45000,
      stage: 'Negotiation',
      probability: 85,
      priority: 'High',
      nextAction: 'Contract Review',
      dueDate: '2024-01-15',
      source: 'Website',
      industry: 'Technology',
      expectedCloseDate: '2024-01-20'
    },
    {
      id: 'OPP002',
      company: 'Global Retail Corp',
      contact: 'Lisa Brown',
      email: 'lisa@globalretail.com',
      phone: '+1 (555) 234-5678',
      value: 32000,
      stage: 'Proposal',
      probability: 60,
      priority: 'Medium',
      nextAction: 'Follow-up Call',
      dueDate: '2024-01-12',
      source: 'Referral',
      industry: 'Retail',
      expectedCloseDate: '2024-01-25'
    },
    {
      id: 'OPP003',
      company: 'Manufacturing Plus',
      contact: 'Robert Lee',
      email: 'robert@manufacturing.com',
      phone: '+1 (555) 345-6789',
      value: 67000,
      stage: 'Demo',
      probability: 40,
      priority: 'High',
      nextAction: 'Product Demo',
      dueDate: '2024-01-10',
      source: 'Cold Call',
      industry: 'Manufacturing',
      expectedCloseDate: '2024-02-01'
    },
    {
      id: 'OPP004',
      company: 'StartUp Ventures',
      contact: 'Alex Turner',
      email: 'alex@startupventures.com',
      phone: '+1 (555) 456-7890',
      value: 23000,
      stage: 'Qualified',
      probability: 25,
      priority: 'Low',
      nextAction: 'Needs Analysis',
      dueDate: '2024-01-08',
      source: 'Event',
      industry: 'Technology',
      expectedCloseDate: '2024-02-10'
    },
    {
      id: 'OPP005',
      company: 'Healthcare Systems',
      contact: 'Dr. Sarah Wilson',
      email: 'sarah@healthcaresys.com',
      phone: '+1 (555) 567-8901',
      value: 89000,
      stage: 'Discovery',
      probability: 30,
      priority: 'High',
      nextAction: 'Requirements Gathering',
      dueDate: '2024-01-14',
      source: 'Website',
      industry: 'Healthcare',
      expectedCloseDate: '2024-02-15'
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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Negotiation': return 'bg-green-100 text-green-800 border-green-200';
      case 'Proposal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Demo': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Discovery': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Qualified': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesSearch = searchTerm === '' || 
      opportunity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.industry.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = stageFilter === 'all' || opportunity.stage === stageFilter;
    const matchesPriority = priorityFilter === 'all' || opportunity.priority === priorityFilter;
    
    return matchesSearch && matchesStage && matchesPriority;
  });

  // Calculate summary metrics
  const totalValue = filteredOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  const weightedValue = filteredOpportunities.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0);
  const avgProbability = filteredOpportunities.length > 0 
    ? filteredOpportunities.reduce((sum, opp) => sum + opp.probability, 0) / filteredOpportunities.length 
    : 0;

  return (
    <DashboardLayout title="Sales Opportunities">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                {filteredOpportunities.length} opportunities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weighted Value</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(weightedValue)}</div>
              <p className="text-xs text-muted-foreground">
                Based on probability
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Probability</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(avgProbability)}%</div>
              <p className="text-xs text-muted-foreground">
                Success likelihood
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actions</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                New Opportunity
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter and search opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    placeholder="Search by company, contact, or industry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage-filter">Stage</Label>
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger id="stage-filter">
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Discovery">Discovery</SelectItem>
                    <SelectItem value="Demo">Demo</SelectItem>
                    <SelectItem value="Proposal">Proposal</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority-filter">Priority</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger id="priority-filter">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-1" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opportunities Table */}
        <Card>
          <CardHeader>
            <CardTitle>Opportunities</CardTitle>
            <CardDescription>Manage your sales pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company & Contact</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Next Action</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOpportunities.map((opportunity) => (
                    <TableRow key={opportunity.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{opportunity.company}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{opportunity.contact}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {opportunity.industry} • {opportunity.source}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatCurrency(opportunity.value)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStageColor(opportunity.stage)} border`}>
                          {opportunity.stage}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getPriorityColor(opportunity.priority)} border`}>
                          {opportunity.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{opportunity.probability}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{opportunity.nextAction}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{opportunity.dueDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesOpportunities;