import React, { useState } from 'react';
import { User } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Phone, 
  Mail, 
  Calendar,
  Star,
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
import UserDetailModal from './UserDetailModal';

interface SalesOperationsTabProps {
  users: User[];
  isLoading: boolean;
  onSelectUser: (user: User) => void;
  selectedUser: User | null;
}

// Enhanced user data with sales metrics (in real app, this would come from API)
const generateSalesMetrics = (user: User) => {
  const baseId = parseInt(user.id.replace(/\D/g, '')) || 1;
  const seed = baseId * 123;
  
  return {
    ...user,
    customerLifetimeValue: Math.floor((seed % 50000) + 5000),
    monthlyRevenue: Math.floor((seed % 5000) + 500),
    totalTransactions: Math.floor((seed % 200) + 10),
    avgTransactionValue: Math.floor((seed % 1000) + 100),
    leadScore: Math.floor((seed % 100) + 1),
    conversionProbability: Math.floor((seed % 80) + 20),
    accountBalance: Math.floor((seed % 100000) + 1000),
    lastPurchase: new Date(Date.now() - (seed % 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    preferredProducts: ['Premium Account', 'Investment Services', 'Insurance'][seed % 3],
    customerSegment: ['High Value', 'Growth Potential', 'Standard', 'VIP'][seed % 4],
    salesStage: ['Prospect', 'Qualified Lead', 'Opportunity', 'Customer', 'Upsell Target'][seed % 5],
    lastContact: new Date(Date.now() - (seed % 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextFollowUp: new Date(Date.now() + (seed % 14) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    revenueGrowth: ((seed % 50) - 25), // -25% to +25%
  };
};

const SalesOperationsTab: React.FC<SalesOperationsTabProps> = ({ 
  users, 
  isLoading, 
  onSelectUser, 
  selectedUser 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('clv');

  const enhancedUsers = users.map(generateSalesMetrics);

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'VIP': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'High Value': return 'bg-red-100 text-red-800 border-red-200';
      case 'Growth Potential': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Standard': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Customer': return 'bg-green-100 text-green-800 border-green-200';
      case 'Opportunity': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Qualified Lead': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Prospect': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Upsell Target': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredUsers = enhancedUsers
    .filter((user) => {
      const searchValue = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        user.firstName.toLowerCase().includes(searchValue) ||
        user.lastName.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.preferredProducts.toLowerCase().includes(searchValue);
      
      const matchesSegment = segmentFilter === 'all' || user.customerSegment === segmentFilter;
      const matchesStage = stageFilter === 'all' || user.salesStage === stageFilter;
      
      return matchesSearch && matchesSegment && matchesStage;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'clv': return b.customerLifetimeValue - a.customerLifetimeValue;
        case 'revenue': return b.monthlyRevenue - a.monthlyRevenue;
        case 'score': return b.leadScore - a.leadScore;
        case 'probability': return b.conversionProbability - a.conversionProbability;
        default: return 0;
      }
    });

  // Calculate summary metrics
  const totalCLV = filteredUsers.reduce((sum, user) => sum + user.customerLifetimeValue, 0);
  const totalMonthlyRevenue = filteredUsers.reduce((sum, user) => sum + user.monthlyRevenue, 0);
  const avgLeadScore = filteredUsers.length > 0 
    ? filteredUsers.reduce((sum, user) => sum + user.leadScore, 0) / filteredUsers.length 
    : 0;
  const highValueCustomers = filteredUsers.filter(user => user.customerSegment === 'VIP' || user.customerSegment === 'High Value').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total CLV</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCLV)}</div>
            <p className="text-xs text-muted-foreground">
              Customer Lifetime Value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMonthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Current month revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgLeadScore)}/100</div>
            <p className="text-xs text-muted-foreground">
              Average lead quality
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Value</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highValueCustomers}</div>
            <p className="text-xs text-muted-foreground">
              VIP & High Value customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="search-customers">Search Customers</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="search-customers"
              placeholder="Search by name, email, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="segment-filter">Customer Segment</Label>
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger id="segment-filter">
              <SelectValue placeholder="Filter by segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
              <SelectItem value="High Value">High Value</SelectItem>
              <SelectItem value="Growth Potential">Growth Potential</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stage-filter">Sales Stage</Label>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger id="stage-filter">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="Prospect">Prospect</SelectItem>
              <SelectItem value="Qualified Lead">Qualified Lead</SelectItem>
              <SelectItem value="Opportunity">Opportunity</SelectItem>
              <SelectItem value="Customer">Customer</SelectItem>
              <SelectItem value="Upsell Target">Upsell Target</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort-by">Sort By</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sort-by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clv">Customer Lifetime Value</SelectItem>
              <SelectItem value="revenue">Monthly Revenue</SelectItem>
              <SelectItem value="score">Lead Score</SelectItem>
              <SelectItem value="probability">Conversion Probability</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Customer Table */}
      {isLoading ? (
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Sales Stage</TableHead>
                <TableHead>CLV</TableHead>
                <TableHead>Monthly Revenue</TableHead>
                <TableHead>Lead Score</TableHead>
                <TableHead>Conversion %</TableHead>
                <TableHead>Growth</TableHead>
                <TableHead>Next Follow-up</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getSegmentColor(user.customerSegment)} border`}>
                        {user.customerSegment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStageColor(user.salesStage)} border`}>
                        {user.salesStage}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(user.customerLifetimeValue)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(user.monthlyRevenue)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{user.leadScore}/100</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{user.conversionProbability}%</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {user.revenueGrowth >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                        <span className={user.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {user.revenueGrowth >= 0 ? '+' : ''}{user.revenueGrowth}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.nextFollowUp}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onSelectUser(user)}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No customers found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => onSelectUser(null)} />}
    </div>
  );
};

export default SalesOperationsTab;