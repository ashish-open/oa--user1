
import React, { useState } from 'react';
import { User } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search, Check, AlertTriangle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserDetailModal from './UserDetailModal';

interface UserSearchTabProps {
  users: User[];
  isLoading: boolean;
  onSelectUser: (user: User) => void;
  selectedUser: User | null;
}

const RISK_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 60
};

const UserSearchTab: React.FC<UserSearchTabProps> = ({ users, isLoading, onSelectUser, selectedUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [kycStatusFilter, setKycStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

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
      case 'low': return <Check className="h-4 w-4 text-green-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredUsers = users
    .filter((user) => {
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
      const matchesKycStatus = kycStatusFilter === 'all' || user.kycStatus === kycStatusFilter;
      
      const riskLevel = getRiskLevel(user.riskScore);
      const matchesRiskLevel = riskFilter === 'all' || riskFilter === riskLevel;
      
      return matchesSearch && matchesRole && matchesKycStatus && matchesRiskLevel;
    });

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="space-y-2">
          <Label htmlFor="search-term">Search Users</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="search-term"
              placeholder="Search by name, email, or ID..."
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

      <div className="grid gap-4 md:grid-cols-3 mb-6">
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
      </div>

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
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const riskLevel = getRiskLevel(user.riskScore);
                  const riskColor = getRiskColor(riskLevel);
                  const riskIcon = getRiskIcon(riskLevel);
                  
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onSelectUser(user)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found matching your search criteria.
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

export default UserSearchTab;
