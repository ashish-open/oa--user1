import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Search, Shield, UserCheck, AlertCircle, Activity, Zap, Globe, MapPin, Monitor } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Progress } from "@/components/ui/progress";
import { User } from '@/types';
import ServiceUsageSection from '@/components/users/ServiceUsageSection';
import UserKycDashboard from '@/components/users/UserKycDashboard';

const RISK_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 60
};

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [accountAgeFilter, setAccountAgeFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [kycStatusFilter, setKycStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRiskFactors, setShowRiskFactors] = useState(false);
  const [activeUserTab, setActiveUserTab] = useState<'risk' | 'kyc'>('risk');
  
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const getRiskLevel = (score?: number): 'low' | 'medium' | 'high' => {
    if (score === undefined) return 'medium';
    if (score < RISK_THRESHOLDS.LOW) return 'low';
    if (score < RISK_THRESHOLDS.MEDIUM) return 'medium';
    return 'high';
  };

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'low': return <Shield className="h-4 w-4 text-green-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredUsers = users
    ? users.filter((user) => {
        const searchValue = searchTerm.toLowerCase();
        
        const matchesSearch = searchField === 'all' 
          ? user.firstName.toLowerCase().includes(searchValue) ||
            user.lastName.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue) ||
            user.id.toLowerCase().includes(searchValue)
          : searchField === 'name'
          ? `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchValue)
          : searchField === 'email'
          ? user.email.toLowerCase().includes(searchValue)
          : searchField === 'id'
          ? user.id.toLowerCase().includes(searchValue)
          : true;
        
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        
        const accountAge = Math.floor(
          (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        const matchesAccountAge = 
          accountAgeFilter === 'all' ? true :
          accountAgeFilter === 'new' ? accountAge <= 30 :
          accountAgeFilter === 'recent' ? accountAge > 30 && accountAge <= 90 :
          accountAgeFilter === 'established' ? accountAge > 90 : true;
          
        const riskLevel = getRiskLevel(user.riskScore);
        const matchesRiskLevel = riskFilter === 'all' || riskFilter === riskLevel;
        
        const matchesIndustry = industryFilter === 'all' || user.industry === industryFilter;
        
        const matchesTier = tierFilter === 'all' || user.tier === tierFilter;
        
        const matchesKycStatus = kycStatusFilter === 'all' || user.kycStatus === kycStatusFilter;
        
        return matchesSearch && matchesRole && matchesAccountAge && matchesRiskLevel && 
               matchesIndustry && matchesTier && matchesKycStatus;
      })
    : [];

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
  };

  const availableIndustries = users 
    ? [...new Set(users.filter(user => user.industry).map(user => user.industry))] 
    : [];

  const availableTiers = users 
    ? [...new Set(users.filter(user => user.tier).map(user => user.tier))] 
    : [];

  return (
    <DashboardLayout title="User Risk Investigation">
      <Tabs defaultValue="all-users" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all-users">All Users</TabsTrigger>
            <TabsTrigger value="high-risk">High Risk</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              Cards
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>User Risk Management</CardTitle>
            <CardDescription>Search and analyze user accounts for risk factors</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="search-term">Search Users</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="search-term"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search-field">Search Field</Label>
                  <Select
                    value={searchField}
                    onValueChange={(value) => setSearchField(value)}
                  >
                    <SelectTrigger id="search-field">
                      <SelectValue placeholder="Search by field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fields</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="id">User ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="role-filter">Role</Label>
                  <Select
                    value={roleFilter}
                    onValueChange={(value) => setRoleFilter(value)}
                  >
                    <SelectTrigger id="role-filter">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="risk-filter">Risk Level</Label>
                  <Select
                    value={riskFilter}
                    onValueChange={(value) => setRiskFilter(value)}
                  >
                    <SelectTrigger id="risk-filter">
                      <SelectValue placeholder="Filter by risk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="account-age-filter">Account Age</Label>
                  <Select
                    value={accountAgeFilter}
                    onValueChange={(value) => setAccountAgeFilter(value)}
                  >
                    <SelectTrigger id="account-age-filter">
                      <SelectValue placeholder="Filter by account age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      <SelectItem value="new">New (≤30 days)</SelectItem>
                      <SelectItem value="recent">Recent (31-90 days)</SelectItem>
                      <SelectItem value="established">Established ({`>90 days`})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="industry-filter">Industry</Label>
                  <Select
                    value={industryFilter}
                    onValueChange={(value) => setIndustryFilter(value)}
                  >
                    <SelectTrigger id="industry-filter">
                      <SelectValue placeholder="Filter by industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {availableIndustries.map(industry => (
                        <SelectItem key={industry} value={industry as string}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tier-filter">User Tier</Label>
                  <Select
                    value={tierFilter}
                    onValueChange={(value) => setTierFilter(value)}
                  >
                    <SelectTrigger id="tier-filter">
                      <SelectValue placeholder="Filter by tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      {availableTiers.map(tier => (
                        <SelectItem key={tier} value={tier as string}>{tier}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="kyc-filter">KYC Status</Label>
                  <Select
                    value={kycStatusFilter}
                    onValueChange={(value) => setKycStatusFilter(value)}
                  >
                    <SelectTrigger id="kyc-filter">
                      <SelectValue placeholder="Filter by KYC status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <TabsContent value="all-users">
              {isLoading ? (
                <div className="space-y-4">
                  {Array(10).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : viewMode === 'table' ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Account Age</TableHead>
                        <TableHead>Risk Score</TableHead>
                        <TableHead>KYC Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => {
                          const accountAge = Math.floor(
                            (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                          );
                          
                          const riskLevel = getRiskLevel(user.riskScore);
                          const riskIcon = getRiskIcon(riskLevel);
                          const riskColor = getRiskColor(riskLevel);
                          
                          const kycStatusColor = user.kycStatus === 'verified' 
                            ? 'bg-green-100 text-green-800' 
                            : user.kycStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800';

                          return (
                            <TableRow key={user.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{user.id}</TableCell>
                              <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {user.role}
                                </span>
                              </TableCell>
                              <TableCell>{accountAge} days</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {riskIcon}
                                  <span className={`px-2 py-1 rounded-full text-xs ${riskColor} border`}>
                                    {user.riskScore || 'N/A'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {user.kycStatus ? (
                                  <span className={`px-2 py-1 rounded-full text-xs ${kycStatusColor}`}>
                                    {user.kycStatus}
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-500">N/A</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      Actions
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => viewUserDetails(user)}>
                                      View Risk Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Flag Account</DropdownMenuItem>
                                    <DropdownMenuItem>View Transactions</DropdownMenuItem>
                                    <DropdownMenuItem>Run Risk Assessment</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No users found matching your search criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  
                  <div className="py-4 border-t">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const accountAge = Math.floor(
                        (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                      );
                      
                      const riskLevel = getRiskLevel(user.riskScore);
                      const riskIcon = riskLevel === 'high' ? 
                        <AlertTriangle className="h-5 w-5 text-red-600" /> : 
                        riskLevel === 'medium' ? 
                          <Clock className="h-5 w-5 text-yellow-600" /> : 
                          <Shield className="h-5 w-5 text-green-600" />;
                      
                      const riskColor = getRiskColor(riskLevel);

                      return (
                        <Card key={user.id} className="overflow-hidden">
                          <CardHeader className={`pb-2 ${riskLevel === 'high' ? 'bg-red-50' : riskLevel === 'medium' ? 'bg-yellow-50' : 'bg-green-50'}`}>
                            <div className="flex justify-between">
                              <div>
                                <CardTitle className="text-lg">{`${user.firstName} ${user.lastName}`}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                              </div>
                              <div>
                                {riskIcon}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">User ID:</span>
                                <span className="text-sm font-medium">{user.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Role:</span>
                                <span className="text-sm font-medium">{user.role}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Account Age:</span>
                                <span className="text-sm font-medium">{accountAge} days</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Risk Score:</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${riskColor} border`}>
                                  {user.riskScore || 'N/A'}
                                </span>
                              </div>
                              {user.kycStatus && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">KYC Status:</span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    user.kycStatus === 'verified' ? 'bg-green-100 text-green-800' : 
                                    user.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {user.kycStatus}
                                  </span>
                                </div>
                              )}
                              <Button 
                                className="w-full mt-2" 
                                variant="outline" 
                                size="sm"
                                onClick={() => viewUserDetails(user)}
                              >
                                View Risk Profile
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No users found matching your search criteria.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="high-risk">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredUsers
                  .filter(user => getRiskLevel(user.riskScore) === 'high')
                  .map(user => {
                    const accountAge = Math.floor(
                      (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    
                    return (
                      <Card key={user.id} className="overflow-hidden border-red-200">
                        <CardHeader className="pb-2 bg-red-50">
                          <div className="flex justify-between">
                            <div>
                              <CardTitle className="text-lg">{`${user.firstName} ${user.lastName}`}</CardTitle>
                              <CardDescription>{user.email}</CardDescription>
                            </div>
                            <div>
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Risk Score:</span>
                              <span className="text-sm font-bold text-red-600">{user.riskScore}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Account Age:</span>
                              <span className="text-sm font-medium">{accountAge} days</span>
                            </div>
                            {user.chargebacks && user.chargebacks > 0 && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Chargebacks:</span>
                                <span className="text-sm font-medium text-red-600">{user.chargebacks}</span>
                              </div>
                            )}
                            {user.complaints && user.complaints > 0 && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Complaints:</span>
                                <span className="text-sm font-medium text-red-600">{user.complaints}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">KYC Status:</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                user.kycStatus === 'verified' ? 'bg-green-100 text-green-800' : 
                                user.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {user.kycStatus || 'Unknown'}
                              </span>
                            </div>
                            <Button 
                              className="w-full mt-2 bg-red-600 hover:bg-red-700" 
                              size="sm"
                              onClick={() => viewUserDetails(user)}
                            >
                              View Risk Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                {filteredUsers.filter(user => getRiskLevel(user.riskScore) === 'high').length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No high-risk users found matching your search criteria.
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="flagged">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-center bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                  <div className="flex flex-col items-center">
                    <Shield className="h-10 w-10 text-orange-500 mb-2" />
                    <p className="text-lg font-medium">Flagged Users View</p>
                    <p className="text-sm text-muted-foreground">
                      This will display users that have been flagged by risk team when connected to a database.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedUser(null)}>
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">User Profile: {selectedUser.firstName} {selectedUser.lastName}</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
            
            <Tabs value={activeUserTab} onValueChange={(val) => setActiveUserTab(val as 'risk' | 'kyc')}>
              <TabsList className="mb-4">
                <TabsTrigger value="risk">Risk Profile</TabsTrigger>
                <TabsTrigger value="kyc">KYC Dashboard</TabsTrigger>
              </TabsList>
              
              <TabsContent value="risk">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-sm">Personal Info</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">ID</span>
                          <span className="text-xs font-medium">{selectedUser.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Email</span>
                          <span className="text-xs font-medium">{selectedUser.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Phone</span>
                          <span className="text-xs font-medium">{selectedUser.phone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Created</span>
                          <span className="text-xs font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-sm">Business Info</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Business Type</span>
                          <span className="text-xs font-medium">{selectedUser.businessType || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Industry</span>
                          <span className="text-xs font-medium">{selectedUser.industry || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Tier</span>
                          <span className="text-xs font-medium">{selectedUser.tier || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">KYC Status</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            selectedUser.kycStatus === 'verified' ? 'bg-green-100 text-green-800' : 
                            selectedUser.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {selectedUser.kycStatus || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-sm">Risk Indicators</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Chargebacks</span>
                          <Badge variant={selectedUser.chargebacks && selectedUser.chargebacks > 0 ? "destructive" : "secondary"}>{selectedUser.chargebacks || 0}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Complaints</span>
                          <Badge variant={selectedUser.complaints && selectedUser.complaints > 0 ? "destructive" : "secondary"}>{selectedUser.complaints || 0}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Transaction Velocity</span>
                          <Badge variant={
                            selectedUser.transactionVelocity === 'high' ? "destructive" : 
                            selectedUser.transactionVelocity === 'medium' ? "outline" : "secondary"
                          }>
                            {selectedUser.transactionVelocity || 'Normal'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Unusual Activity</span>
                          <Badge variant={selectedUser.unusualActivity ? "destructive" : "secondary"}>
                            {selectedUser.unusualActivity ? 'Detected' : 'None'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <ServiceUsageSection user={selectedUser} />
                
                <div className="mb-6">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowRiskFactors(!showRiskFactors)}
                    className="mb-4"
                  >
                    {showRiskFactors ? 'Hide' : 'Show'} Risk Factor Breakdown
                  </Button>
                  
                  {showRiskFactors && selectedUser.riskFactors && (
                    <div className="space-y-3 border rounded-md p-4">
                      <h3 className="text-sm font-medium mb-2">Risk Factor Contributions</h3>
                      
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-xs">Account Age</span>
                            <span className="text-xs font-medium">{selectedUser.riskFactors.accountAge || 0}/25</span>
                          </div>
                          <Progress value={selectedUser.riskFactors.accountAge} max={25} className="h-1.5" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-xs">Transaction Pattern</span>
                            <span className="text-xs font-medium">{selectedUser.riskFactors.transactionPattern || 0}/25</span>
                          </div>
                          <Progress value={selectedUser.riskFactors.transactionPattern} max={25} className="h-1.5" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-xs">Chargebacks</span>
                            <span className="text-xs font-medium">{selectedUser.riskFactors.chargebacksScore || 0}/20</span>
                          </div>
                          <Progress value={selectedUser.riskFactors.chargebacksScore} max={20} className="h-1.5" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-xs">Complaints</span>
                            <span className="text-xs font-medium">{selectedUser.riskFactors.complaintsScore || 0}/10</span>
                          </div>
                          <Progress value={selectedUser.riskFactors.complaintsScore} max={10} className="h-1.5" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-xs">KYC Status</span>
                            <span className="text-xs font-medium">{selectedUser.riskFactors.kycScore || 0}/10</span>
                          </div>
                          <Progress value={selectedUser.riskFactors.kycScore} max={10} className="h-1.5" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-xs">Industry Risk</span>
                            <span className="text-xs font-medium">{selectedUser.riskFactors.industryScore || 0}/10</span>
                          </div>
                          <Progress value={selectedUser.riskFactors.industryScore} max={10} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Security & Access Patterns</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm">Location Activity</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-muted-foreground">Last Login IP</span>
                            <span className="text-xs font-medium">{selectedUser.lastLoginIp || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-muted-foreground">Location Changes</span>
                            <div className="flex items-center">
                              <Globe className="h-3 w-3 mr-1 text-blue-600" />
                              <span className="text-xs font-medium">{selectedUser.locationChanges || 0}</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-muted-foreground">Device Changes</span>
                            <div className="flex items-center">
                              <Monitor className="h-3 w-3 mr-1 text-purple-600" />
                              <span className="text-xs font-medium">{selectedUser.deviceChanges || 0}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm">Activity Timeline</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <div className="flex items-center justify-center h-20">
                          <p className="text-xs text-muted-foreground">
                            Activity timeline will show transaction history when connected to database.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="kyc">
                <UserKycDashboard user={selectedUser} />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Cancel
              </Button>
              <Button variant="default">
                View Full History
              </Button>
              <Button variant="destructive">
                Flag User
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Users;
