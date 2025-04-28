
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAlerts } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Alert } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const Alerts: React.FC = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<Alert['type'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Alert['status'] | 'all'>('all');
  
  // Fetch alerts
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: getAlerts,
  });
  
  // Helper to get alert type style
  const getAlertTypeStyle = (type: Alert['type']) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter alerts
  const filteredAlerts = alerts
    ? alerts.filter((alert) => {
        const matchesSearch = alert.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || alert.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
        
        return matchesSearch && matchesType && matchesStatus;
      })
    : [];

  return (
    <DashboardLayout title="Alerts">
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>View and filter all system alerts</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div>
              <Input
                placeholder="Search by message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as Alert['type'] | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as Alert['status'] | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Alerts List */}
          {isLoading ? (
            <div className="space-y-4">
              {Array(10).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start p-4 rounded-lg border hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getAlertTypeStyle(alert.type)}`}>
                          {alert.type}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs rounded-full px-2 py-1 ${
                            alert.status === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {alert.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(alert.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-800">{alert.message}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        User ID: {alert.userId}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 border rounded-md">
                  No alerts found matching your filters
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Alerts;
