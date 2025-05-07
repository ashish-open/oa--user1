
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTickets } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Ticket } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tag, Filter, Users, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const Tickets: React.FC = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Ticket['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Ticket['priority'] | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<string | 'all'>('all');
  const [groupFilter, setGroupFilter] = useState<string | 'all'>('all');
  const [groupBy, setGroupBy] = useState<'none' | 'status' | 'priority' | 'group' | 'tags'>('none');
  
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

  // Get all unique tags from tickets
  const allTags = tickets ? [...new Set(tickets.flatMap(ticket => ticket.tags || []))] : [];
  
  // Get all unique groups from tickets
  const allGroups = tickets ? [...new Set(tickets.map(ticket => ticket.group).filter(Boolean))] : [];

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
        
        // Tag filter
        const matchesTag = 
          tagFilter === 'all' || 
          (ticket.tags && ticket.tags.includes(tagFilter));
        
        // Group filter
        const matchesGroup = 
          groupFilter === 'all' || 
          ticket.group === groupFilter;
        
        return matchesSearch && matchesStatus && matchesPriority && matchesTag && matchesGroup;
      })
    : [];

  // Group tickets based on the selected grouping option
  const groupTickets = (tickets: Ticket[]) => {
    if (groupBy === 'none') return { 'All Tickets': tickets };
    
    const grouped: Record<string, Ticket[]> = {};
    
    tickets.forEach(ticket => {
      let key: string;
      
      switch (groupBy) {
        case 'status':
          key = ticket.status;
          break;
        case 'priority':
          key = ticket.priority;
          break;
        case 'group':
          key = ticket.group || 'No Group';
          break;
        case 'tags':
          if (!ticket.tags || ticket.tags.length === 0) {
            key = 'No Tags';
          } else {
            // Use the first tag as the group key
            key = ticket.tags[0];
          }
          break;
        default:
          key = 'All';
      }
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      
      grouped[key].push(ticket);
    });
    
    return grouped;
  };

  const groupedTickets = groupTickets(filteredTickets);

  return (
    <DashboardLayout title="Support Tickets">
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>View and filter customer support tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="filters">
            <TabsList className="mb-4">
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="groups">Group By</TabsTrigger>
            </TabsList>
            
            <TabsContent value="filters">
              {/* Filters */}
              <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative mt-1">
                    <Input
                      id="search"
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                      <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as Ticket['status'] | 'all')}
                  >
                    <SelectTrigger id="status-filter" className="mt-1">
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
                  <Label htmlFor="priority-filter">Priority</Label>
                  <Select
                    value={priorityFilter}
                    onValueChange={(value) => setPriorityFilter(value as Ticket['priority'] | 'all')}
                  >
                    <SelectTrigger id="priority-filter" className="mt-1">
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
                {allTags.length > 0 && (
                  <div>
                    <Label htmlFor="tag-filter">Tag</Label>
                    <Select
                      value={tagFilter}
                      onValueChange={(value) => setTagFilter(value)}
                    >
                      <SelectTrigger id="tag-filter" className="mt-1">
                        <SelectValue placeholder="Filter by tag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tags</SelectItem>
                        {allTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {allGroups.length > 0 && (
                  <div>
                    <Label htmlFor="group-filter">Group</Label>
                    <Select
                      value={groupFilter}
                      onValueChange={(value) => setGroupFilter(value)}
                    >
                      <SelectTrigger id="group-filter" className="mt-1">
                        <SelectValue placeholder="Filter by group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Groups</SelectItem>
                        {allGroups.map((group) => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                    setTagFilter('all');
                    setGroupFilter('all');
                  }}>
                    Reset Filters
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="groups">
              {/* Group By Options */}
              <div className="mb-6 grid gap-4 grid-cols-1">
                <div>
                  <Label className="text-base font-medium">Group tickets by:</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="group-none" 
                        checked={groupBy === 'none'} 
                        onCheckedChange={() => setGroupBy('none')} 
                      />
                      <Label htmlFor="group-none">No Grouping</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="group-status" 
                        checked={groupBy === 'status'} 
                        onCheckedChange={() => setGroupBy('status')} 
                      />
                      <Label htmlFor="group-status">By Status</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="group-priority" 
                        checked={groupBy === 'priority'} 
                        onCheckedChange={() => setGroupBy('priority')} 
                      />
                      <Label htmlFor="group-priority">By Priority</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="group-group" 
                        checked={groupBy === 'group'} 
                        onCheckedChange={() => setGroupBy('group')} 
                      />
                      <Label htmlFor="group-group">By Group</Label>
                    </div>
                    {allTags.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="group-tags" 
                          checked={groupBy === 'tags'} 
                          onCheckedChange={() => setGroupBy('tags')} 
                        />
                        <Label htmlFor="group-tags">By Tags</Label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Tickets List */}
          {isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedTickets).map(([group, groupTickets]) => (
                <div key={group} className="space-y-4">
                  {groupBy !== 'none' && (
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium">{group}</h3>
                      <Badge variant="outline" className="ml-2">{groupTickets.length}</Badge>
                    </div>
                  )}
                  
                  {groupTickets.length > 0 ? (
                    <div className="space-y-4">
                      {groupTickets.map((ticket) => (
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
                            
                            <div className="mt-2 flex justify-between items-center">
                              <div className="text-xs text-gray-500">
                                From: {ticket.requester.name} ({ticket.requester.email})
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            {/* Display ticket tags if available */}
                            {ticket.tags && ticket.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {ticket.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs flex items-center gap-1">
                                    <Tag className="h-3 w-3" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            {/* Display ticket group if available */}
                            {ticket.group && (
                              <div className="mt-1">
                                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {ticket.group}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md">
                      No tickets found in this group
                    </div>
                  )}
                </div>
              ))}
              
              {Object.keys(groupedTickets).length === 0 && (
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
