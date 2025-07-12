
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserSearchTab from '@/components/users/UserSearchTab';
import RiskOperationsTab from '@/components/users/RiskOperationsTab';
import KycOperationsTab from '@/components/users/KycOperationsTab';
import SalesOperationsTab from '@/components/users/SalesOperationsTab';
import { User } from '@/types';
import { useNavigate, useLocation } from 'react-router-dom';

const UsersManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>(
    location.state?.activeTab || 'search'
  );

  // Fetch users data
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/users`, { state: { activeTab: value } });
  };

  return (
    <DashboardLayout title="Centralized User Hub">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Centralized User Management</h1>
        <p className="text-muted-foreground">
          Search, analyze, and manage users across risk and KYC operations.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-6">
          <TabsTrigger value="search">User Search</TabsTrigger>
          <TabsTrigger value="risk">Risk Operations</TabsTrigger>
          <TabsTrigger value="kyc">KYC Operations</TabsTrigger>
          <TabsTrigger value="sales">Sales Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>User Search</CardTitle>
              <CardDescription>Find and manage users across all services</CardDescription>
            </CardHeader>
            <CardContent>
              <UserSearchTab 
                users={users || []} 
                isLoading={isLoading} 
                onSelectUser={(user) => setSelectedUser(user)}
                selectedUser={selectedUser}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>Risk Operations</CardTitle>
              <CardDescription>Manage user risk profiles and assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <RiskOperationsTab 
                users={users || []} 
                isLoading={isLoading} 
                onSelectUser={(user) => setSelectedUser(user)}
                selectedUser={selectedUser}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <CardTitle>KYC Operations</CardTitle>
              <CardDescription>Manage user verification and compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <KycOperationsTab 
                users={users || []} 
                isLoading={isLoading} 
                onSelectUser={(user) => setSelectedUser(user)}
                selectedUser={selectedUser}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Operations</CardTitle>
              <CardDescription>Maximize revenue with customer insights and sales analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesOperationsTab 
                users={users || []} 
                isLoading={isLoading} 
                onSelectUser={(user) => setSelectedUser(user)}
                selectedUser={selectedUser}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default UsersManagement;
