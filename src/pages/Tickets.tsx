
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTickets } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Ticket } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const Tickets: React.FC = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Ticket['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Ticket['priority'] | 'all'>('all');
  
  // Fetch tickets
  const { data: tickets, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: getTickets,
  });
  
  // Helper to get ticket priority style
  const getTicketPriorityStyle = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to get ticket status style
  const getTicketStatusStyle = (status: Ticket['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter tickets
  const filteredTickets = tickets
    ? tickets.filter((ticket) => {
        const matchesSearch = 
          ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.requester.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
        
        return matchesSearch && matchesStatus && matchesPriority;
      })
    : [];

  return (
    <DashboardLayout title="Support Tickets">
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>View and filter customer support tickets from Freshdesk</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div>
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as Ticket['status'] | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={priorityFilter}
                onValueChange={(value) => setPriorityFilter(value as Ticket['priority'] | 'all')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tickets List */}
          {isLoading ? (
            <div className="space-y-4">
              {Array(10).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-start p-4 rounded-lg border hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{ticket.subject}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getTicketPriorityStyle(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getTicketStatusStyle(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
                      <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                        <div>
                          From: {ticket.requester.name} ({ticket.requester.email})
                        </div>
                        <div className="flex items-center space-x-4">
                          <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                          <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 border rounded-md">
                  No tickets found matching your filters
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Tickets;
