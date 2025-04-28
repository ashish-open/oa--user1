
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, BarChart, Flag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useServiceIcons } from '@/hooks/useServiceIcons';

const HighRiskUsersTable: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getServiceIcon } = useServiceIcons();
  
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // Filter only high risk users (score > 50) and take top 5
  const highRiskUsers = users
    ? users
        .filter(user => user.riskScore && user.riskScore > 50)
        .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
        .slice(0, 5)
    : [];

  // Handle CTA for flagging an account
  const handleFlagAccount = (userId: string) => {
    toast({
      title: "Account Flagged",
      description: `User ${userId} has been flagged for review.`,
      variant: "default",
    });
  };

  // Handle CTA for viewing risk profile
  const handleViewRiskProfile = (userId: string) => {
    navigate(`/users/${userId}`);
  };
  
  // Handle CTA for viewing transactions
  const handleViewTransactions = (userId: string) => {
    navigate(`/transactions?userId=${userId}`);
  };
  
  // Handle CTA for running risk assessment
  const handleRunRiskAssessment = (userId: string) => {
    toast({
      title: "Risk Assessment Initiated",
      description: `Re-evaluating risk for user ${userId}. This may take a moment.`,
      variant: "default",
    });
    
    // Simulate assessment completion after a short delay
    setTimeout(() => {
      toast({
        title: "Risk Assessment Complete",
        description: `Updated risk profile is now available for user ${userId}.`,
        variant: "success",
      });
    }, 2000);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>High Risk Users</CardTitle>
          <CardDescription>Users requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-6">Loading high risk users...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (highRiskUsers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>High Risk Users</CardTitle>
          <CardDescription>Users requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-6">No high risk users found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          High Risk Users
        </CardTitle>
        <CardDescription>Top users requiring immediate attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase bg-gray-50 text-gray-500">
              <tr>
                <th scope="col" className="px-4 py-3">User</th>
                <th scope="col" className="px-4 py-3">Risk Score</th>
                <th scope="col" className="px-4 py-3">Services</th>
                <th scope="col" className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {highRiskUsers.map(user => (
                <tr key={user.id} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    {user.firstName} {user.lastName}
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="destructive" className="text-white">
                      {user.riskScore} / 100
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {user.serviceUsage?.payin && getServiceIcon('payin')}
                      {user.serviceUsage?.payout && getServiceIcon('payout')}
                      {user.serviceUsage?.api && getServiceIcon('api')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewRiskProfile(user.id)}>
                        <BarChart className="h-3.5 w-3.5 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleFlagAccount(user.id)}>
                        <Flag className="h-3.5 w-3.5 mr-1" />
                        Flag
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {highRiskUsers.length > 0 && (
            <div className="mt-4 text-center">
              <Button variant="secondary" onClick={() => navigate('/users?risk=high')}>
                View All High Risk Users
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HighRiskUsersTable;
