
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const Users: React.FC = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // Filter users
  const filteredUsers = users
    ? users.filter((user) => {
        const matchesSearch = 
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        
        return matchesSearch && matchesRole;
      })
    : [];

  return (
    <DashboardLayout title="Users">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and filter user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div>
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
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

          {/* Users Table */}
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
                    <th scope="col" className="px-6 py-3">ID</th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Email</th>
                    <th scope="col" className="px-6 py-3">Role</th>
                    <th scope="col" className="px-6 py-3">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
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
                        <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">No users found matching your filters</td>
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
