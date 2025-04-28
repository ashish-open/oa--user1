
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const Users: React.FC = () => {
  // Enhanced filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchField, setSearchField] = useState<string>('all');
  
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
        
        return matchesSearch && matchesRole;
      })
    : [];

  return (
    <DashboardLayout title="User Risk Analysis">
      <Card>
        <CardHeader>
          <CardTitle>User Risk Management</CardTitle>
          <CardDescription>Monitor and analyze user accounts for potential risks</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Enhanced Filters */}
          <div className="mb-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Select
                  value={searchField}
                  onValueChange={(value) => setSearchField(value)}
                >
                  <SelectTrigger>
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
              <div className="md:col-span-2">
                <Input
                  placeholder={`Search ${searchField === 'all' ? 'across all fields' : `by ${searchField}`}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <Select
                value={roleFilter}
                onValueChange={(value) => setRoleFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users Table with Risk Indicators */}
          {isLoading ? (
            <div className="space-y-4">
              {Array(10).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-md border">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">User ID</th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Email</th>
                    <th scope="col" className="px-6 py-3">Role</th>
                    <th scope="col" className="px-6 py-3">Account Age</th>
                    <th scope="col" className="px-6 py-3">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const accountAge = Math.floor(
                        (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                      );
                      
                      // Mock risk level based on account age (you can implement your own logic)
                      const riskLevel = accountAge < 30 ? 'high' : accountAge < 90 ? 'medium' : 'low';
                      const riskColor = {
                        high: 'bg-red-100 text-red-800',
                        medium: 'bg-yellow-100 text-yellow-800',
                        low: 'bg-green-100 text-green-800'
                      }[riskLevel];

                      return (
                        <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{user.id}</td>
                          <td className="px-6 py-4">{`${user.firstName} ${user.lastName}`}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">{accountAge} days</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${riskColor}`}>
                              {riskLevel}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">No users found matching your filters</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Users;
