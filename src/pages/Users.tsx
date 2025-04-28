import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Search, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { User } from '@/types';

const Users: React.FC = () => {
  // Enhanced filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [accountAgeFilter, setAccountAgeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // Enhanced filter users with multiple fields
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
        
        // Calculate account age to filter by it
        const accountAge = Math.floor(
          (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        const matchesAccountAge = 
          accountAgeFilter === 'all' ? true :
          accountAgeFilter === 'new' ? accountAge <= 30 :
          accountAgeFilter === 'recent' ? accountAge > 30 && accountAge <= 90 :
          accountAgeFilter === 'established' ? accountAge > 90 : true;
          
        // Calculate risk level for filtering
        const riskLevel = accountAge < 30 ? 'high' : accountAge < 90 ? 'medium' : 'low';
        const matchesRiskLevel = riskFilter === 'all' || riskFilter === riskLevel;
        
        return matchesSearch && matchesRole && matchesAccountAge && matchesRiskLevel;
      })
    : [];

  // Show detailed user view
  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
  };

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
            {/* Enhanced Search Filters */}
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
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => {
                          const accountAge = Math.floor(
                            (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                          );
                          
                          // Mock risk level based on account age
                          const riskLevel = accountAge < 30 ? 'high' : accountAge < 90 ? 'medium' : 'low';
                          const riskIcon = riskLevel === 'high' ? 
                            <AlertTriangle className="h-4 w-4 text-red-600" /> : 
                            riskLevel === 'medium' ? 
                              <Clock className="h-4 w-4 text-yellow-600" /> : 
                              <Shield className="h-4 w-4 text-green-600" />;
                          
                          const riskColor = {
                            high: 'bg-red-100 text-red-800 border-red-200',
                            medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                            low: 'bg-green-100 text-green-800 border-green-200'
                          }[riskLevel];

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
                                    {riskLevel}
                                  </span>
                                </div>
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
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Flag Account</DropdownMenuItem>
                                    <DropdownMenuItem>View Transactions</DropdownMenuItem>
                                    <DropdownMenuItem>Risk Assessment</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
                      
                      // Mock risk level based on account age
                      const riskLevel = accountAge < 30 ? 'high' : accountAge < 90 ? 'medium' : 'low';
                      const riskIcon = riskLevel === 'high' ? 
                        <AlertTriangle className="h-5 w-5 text-red-600" /> : 
                        riskLevel === 'medium' ? 
                          <Clock className="h-5 w-5 text-yellow-600" /> : 
                          <Shield className="h-5 w-5 text-green-600" />;
                      
                      const riskColor = {
                        high: 'bg-red-100 text-red-800 border-red-200',
                        medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                        low: 'bg-green-100 text-green-800 border-green-200'
                      }[riskLevel];

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
                                <span className="text-sm text-muted-foreground">Risk Level:</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${riskColor} border`}>
                                  {riskLevel}
                                </span>
                              </div>
                              <Button 
                                className="w-full mt-2" 
                                variant="outline" 
                                size="sm"
                                onClick={() => viewUserDetails(user)}
                              >
                                View User Details
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
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-center bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="h-10 w-10 text-red-500 mb-2" />
                    <p className="text-lg font-medium">High Risk User View</p>
                    <p className="text-sm text-muted-foreground">
                      This will display users with high risk factors when connected to a database.
                    </p>
                  </div>
                </div>
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

      {/* This would normally be a detailed user profile modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedUser(null)}>
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">User Profile: {selectedUser.firstName} {selectedUser.lastName}</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-medium">{selectedUser.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Created</p>
                <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <div className="border p-4 rounded-md">
                <h3 className="font-medium mb-2">Risk Assessment</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  This section will show detailed risk factors when connected to the database.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <p className="font-medium">--</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <p className="font-medium">--</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Flagged</p>
                    <p className="font-medium">No</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Suspicious Activities</p>
                    <p className="font-medium">--</p>
                  </div>
                </div>
              </div>
              
              <div className="border p-4 rounded-md">
                <h3 className="font-medium mb-2">Transaction Summary</h3>
                <p className="text-sm text-muted-foreground">
                  Transaction data will be displayed here when connected to the database.
                </p>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline">Export User Data</Button>
                <Button>View Full Profile</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Users;
