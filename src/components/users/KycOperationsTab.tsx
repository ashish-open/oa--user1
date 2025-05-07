
import React, { useState } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle, Filter, FileText, Calendar } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import UserDetailModal from './UserDetailModal';

interface KycOperationsTabProps {
  users: User[];
  isLoading: boolean;
  onSelectUser: (user: User) => void;
  selectedUser: User | null;
}

const KycOperationsTab: React.FC<KycOperationsTabProps> = ({ 
  users, 
  isLoading, 
  onSelectUser, 
  selectedUser 
}) => {
  const [kycFilter, setKycFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('pending');

  const getKycStatusIcon = (status?: string) => {
    switch(status) {
      case 'verified': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredUsers = users
    .filter(user => {
      if (kycFilter === 'all') return true;
      return user.kycStatus === kycFilter;
    })
    .sort((a, b) => {
      // Prioritize pending, then rejected, then verified
      const statusPriority: Record<string, number> = {
        'pending': 3,
        'rejected': 2,
        'verified': 1,
        'undefined': 0
      };
      
      return (statusPriority[b.kycStatus || 'undefined'] || 0) - (statusPriority[a.kycStatus || 'undefined'] || 0);
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">KYC Verification Management</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter: {kycFilter === 'all' ? 'All Status' : `${kycFilter.charAt(0).toUpperCase() + kycFilter.slice(1)}`}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setKycFilter('all')}>
              All Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setKycFilter('pending')}>
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setKycFilter('verified')}>
              Verified
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setKycFilter('rejected')}>
              Rejected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold">
                {users.filter(user => user.kycStatus === 'pending').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">
                {users.filter(user => user.kycStatus === 'verified').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold">
                {users.filter(user => user.kycStatus === 'rejected').length}
              </span>
            </div>
          </CardContent>
        </Card>
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
                <TableHead>User</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>PG Partner</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const kycStatus = user.kycStatus || 'pending';
                  const statusIcon = getKycStatusIcon(kycStatus);
                  const documents = user.kycDetails?.documents || [];
                  const latestDocUpload = documents.length > 0 
                    ? new Date(documents.sort((a, b) => 
                        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
                      )[0].uploadedAt).toLocaleDateString()
                    : 'N/A';
                  
                  return (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {statusIcon}
                          <Badge variant={
                            kycStatus === 'verified' ? 'outline' : 
                            kycStatus === 'pending' ? 'default' : 
                            'destructive'
                          }>
                            {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <span>{documents.length || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-600" />
                          <span>{latestDocUpload}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.kycDetails?.pgPartner || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectUser(user)}
                        >
                          View KYC Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found matching your KYC criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => onSelectUser(null)} activeTab="kyc" />}
    </div>
  );
};

export default KycOperationsTab;
