
import React, { useState } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ShieldAlert, Clock, Shield, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import UserDetailModal from './UserDetailModal';

interface RiskOperationsTabProps {
  users: User[];
  isLoading: boolean;
  onSelectUser: (user: User) => void;
  selectedUser: User | null;
}

const RISK_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 60
};

const RiskOperationsTab: React.FC<RiskOperationsTabProps> = ({ 
  users, 
  isLoading, 
  onSelectUser, 
  selectedUser 
}) => {
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('high');

  const getRiskLevel = (score?: number): 'low' | 'medium' | 'high' => {
    if (score === undefined) return 'medium';
    if (score < RISK_THRESHOLDS.LOW) return 'low';
    if (score < RISK_THRESHOLDS.MEDIUM) return 'medium';
    return 'high';
  };

  const getRiskIcon = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'medium': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'low': return <Shield className="h-5 w-5 text-green-600" />;
      default: return <ShieldAlert className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredUsers = users
    .filter(user => {
      if (riskFilter === 'all') return true;
      return getRiskLevel(user.riskScore) === riskFilter;
    })
    .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Risk Monitoring</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter: {riskFilter === 'all' ? 'All Risks' : `${riskFilter.charAt(0).toUpperCase() + riskFilter.slice(1)} Risk`}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setRiskFilter('all')}>
              All Risks
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRiskFilter('high')}>
              High Risk
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRiskFilter('medium')}>
              Medium Risk
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRiskFilter('low')}>
              Low Risk
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Risk Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold">
                {users.filter(user => getRiskLevel(user.riskScore) === 'high').length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chargebacks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold">
                {users.reduce((sum, user) => sum + (user.chargebacks || 0), 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Flagged Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold">
                {users.filter(user => user.unusualActivity).length}
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
                <TableHead>Risk Score</TableHead>
                <TableHead>Chargebacks</TableHead>
                <TableHead>Complaints</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const riskLevel = getRiskLevel(user.riskScore);
                  const riskIcon = getRiskIcon(riskLevel);

                  return (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {riskIcon}
                          <Badge variant={
                            riskLevel === 'high' ? 'destructive' : 
                            riskLevel === 'medium' ? 'default' : 
                            'outline'
                          }>
                            {user.riskScore || 'N/A'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.chargebacks && user.chargebacks > 0 ? 'destructive' : 'outline'}>
                          {user.chargebacks || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.complaints && user.complaints > 0 ? 'destructive' : 'outline'}>
                          {user.complaints || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.unusualActivity ? 'destructive' : 'outline'}>
                          {user.unusualActivity ? 'Unusual' : 'Normal'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectUser(user)}
                        >
                          View Risk Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found matching your risk criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => onSelectUser(null)} activeTab="risk" />}
    </div>
  );
};

export default RiskOperationsTab;
