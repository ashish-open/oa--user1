
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTickets } from '@/services/api';
import { fetchGroups, fetchAgents, updateTicketStatus, addTicketNote } from '@/services/freshdeskService';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Ticket } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tag, Filter, Users, List, Clock, User, Settings, Search, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Freshdesk configuration dialog
const FreshdeskConfigDialog = ({ 
  onSave 
}: { 
  onSave: (domain: string, apiKey: string) => void 
}) => {
  const [domain, setDomain] = useState('');
  const [apiKey, setApiKey] = useState('');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Configure Freshdesk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Freshdesk Configuration</DialogTitle>
          <DialogDescription>
            Enter your Freshdesk domain and API key to connect to your account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="domain" className="text-right">
              Domain
            </Label>
            <Input
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="yourcompany"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onSave(domain, apiKey)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Ticket Detail Dialog Component
const TicketDetailDialog = ({ ticket, onUpdate }: { ticket: Ticket, onUpdate: () => void }) => {
  const [note, setNote] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  const handleStatusChange = async (newStatus: Ticket['status']) => {
    const success = await updateTicketStatus(ticket.id, newStatus);
    if (success) {
      onUpdate();
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) {
      toast.error('Note cannot be empty');
      return;
    }
    
    const success = await addTicketNote(ticket.id, note, isPrivate);
    if (success) {
      setNote('');
      onUpdate();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{ticket.subject}</DialogTitle>
          <DialogDescription>
            Ticket #{ticket.id} - Created on {new Date(ticket.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Status and Priority Badges */}
          <div className="flex items-center gap-2">
            <Badge className={`
              ${ticket.status === 'open' ? 'bg-blue-100 text-blue-800' : ''}
              ${ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${ticket.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
              ${ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' : ''}
            `}>
              {ticket.status}
            </Badge>
            
            <Badge className={`
              ${ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' : ''}
              ${ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' : ''}
              ${ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${ticket.priority === 'low' ? 'bg-green-100 text-green-800' : ''}
            `}>
              {ticket.priority}
            </Badge>
            
            {ticket.group && (
              <Badge variant="outline" className="ml-auto">
                <Users className="mr-1 h-3 w-3" /> {ticket.group}
              </Badge>
            )}
          </div>
          
          {/* Requester Information */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>From: {ticket.requester.name} ({ticket.requester.email})</span>
          </div>
          
          {/* Description */}
          <div>
            <h4 className="text-sm font-medium mb-1">Description</h4>
            <div className="rounded-md border p-4 whitespace-pre-wrap text-sm">
              {ticket.description}
            </div>
          </div>
          
          {/* Tags */}
          {ticket.tags && ticket.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {ticket.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    <Tag className="mr-1 h-3 w-3" /> {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Update Status Actions */}
          <div>
            <h4 className="text-sm font-medium mb-2">Update Status</h4>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={ticket.status === 'open' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('open')}
              >
                Open
              </Button>
              <Button 
                size="sm" 
                variant={ticket.status === 'pending' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('pending')}
              >
                Pending
              </Button>
              <Button 
                size="sm" 
                variant={ticket.status === 'resolved' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('resolved')}
              >
                Resolved
              </Button>
              <Button 
                size="sm" 
                variant={ticket.status === 'closed' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('closed')}
              >
                Closed
              </Button>
            </div>
          </div>
          
          {/* Add Note Section */}
          <div>
            <h4 className="text-sm font-medium mb-2">Add Note</h4>
            <Textarea 
              placeholder="Type your note here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex items-center mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="private-note"
                  checked={isPrivate}
                  onCheckedChange={(checked) => setIsPrivate(!!checked)}
                />
                <Label htmlFor="private-note">Private note (visible only to agents)</Label>
              </div>
              <Button className="ml-auto" size="sm" onClick={handleAddNote}>
                Add Note
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Tickets: React.FC = () => {
  // API configuration state
  const [isConfigured, setIsConfigured] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Ticket['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Ticket['priority'] | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<string | 'all'>('all');
  const [groupFilter, setGroupFilter] = useState<number | string>('all');
  const [groupBy, setGroupBy] = useState<'none' | 'status' | 'priority' | 'group' | 'tags'>('none');
  
  // Groups and Agents data
  const { data: groups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['freshdesk-groups'],
    queryFn: fetchGroups,
    enabled: isConfigured,
  });
  
  const { data: agents, isLoading: isLoadingAgents } = useQuery({
    queryKey: ['freshdesk-agents'],
    queryFn: fetchAgents,
    enabled: isConfigured,
  });
  
  // Build filter object for API
  const apiFilters = {
    status: statusFilter,
    priority: priorityFilter,
    group: typeof groupFilter === 'number' ? groupFilter : undefined,
    tags: tagFilter !== 'all' ? [tagFilter] : undefined
  };
  
  // Fetch tickets
  const { 
    data: tickets, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['tickets', apiFilters],
    queryFn: () => getTickets(apiFilters),
    enabled: isConfigured,
  });
  
  // Handle Freshdesk configuration
  const handleSaveFreshdeskConfig = (domain: string, apiKey: string) => {
    if (!domain || !apiKey) {
      toast.error('Both domain and API key are required');
      return;
    }
    
    // In a real app, we would save these securely
    // For now we'll store them in localStorage for demo purposes
    localStorage.setItem('freshdeskDomain', domain);
    localStorage.setItem('freshdeskApiKey', apiKey);
    
    // Update the Freshdesk service with the new credentials
    import('@/services/freshdeskService').then(module => {
      module.setupFreshdeskAPI(domain, apiKey);
      setIsConfigured(true);
      toast.success('Freshdesk API configured successfully');
      refetch();
    });
  };
  
  // Load saved configuration on component mount
  useEffect(() => {
    const savedDomain = localStorage.getItem('freshdeskDomain');
    const savedApiKey = localStorage.getItem('freshdeskApiKey');
    
    if (savedDomain && savedApiKey) {
      import('@/services/freshdeskService').then(module => {
        module.setupFreshdeskAPI(savedDomain, savedApiKey);
        setIsConfigured(true);
      });
    }
  }, []);
  
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
  const allTags = tickets 
    ? [...new Set(tickets.flatMap(ticket => ticket.tags || []))] 
    : [];
  
  // Filter tickets
  const filteredTickets = tickets
    ? tickets.filter((ticket) => {
        const matchesSearch = 
          ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.requester.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
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
      {!isConfigured && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Freshdesk API Not Configured</AlertTitle>
          <AlertDescription>
            Please configure your Freshdesk API credentials to connect to your Freshdesk account.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <FreshdeskConfigDialog onSave={handleSaveFreshdeskConfig} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>View and filter customer support tickets from Freshdesk</CardDescription>
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
                      <Search className="h-4 w-4 text-gray-400" />
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
                {groups && groups.length > 0 && (
                  <div>
                    <Label htmlFor="group-filter">Group</Label>
                    <Select
                      value={groupFilter.toString()}
                      onValueChange={(value) => setGroupFilter(value === 'all' ? 'all' : parseInt(value))}
                    >
                      <SelectTrigger id="group-filter" className="mt-1">
                        <SelectValue placeholder="Filter by group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Groups</SelectItem>
                        {groups.map((group) => (
                          <SelectItem key={group.id.toString()} value={group.id.toString()}>
                            {group.name}
                          </SelectItem>
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
          {!isConfigured ? (
            <div className="text-center p-8">
              <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Configure Freshdesk Integration
              </h3>
              <p className="text-gray-500 mb-4 max-w-md mx-auto">
                Connect your Freshdesk account to view and manage your support tickets.
                Click the "Configure Freshdesk" button above to get started.
              </p>
              <FreshdeskConfigDialog onSave={handleSaveFreshdeskConfig} />
            </div>
          ) : isLoading ? (
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
                            
                            <div className="mt-3 flex justify-between items-center">
                              {/* Display ticket tags if available */}
                              <div className="flex flex-wrap gap-1">
                                {ticket.tags && ticket.tags.length > 0 && ticket.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs flex items-center gap-1">
                                    <Tag className="h-3 w-3" />
                                    {tag}
                                  </Badge>
                                ))}
                                
                                {/* Display ticket group if available */}
                                {ticket.group && (
                                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {ticket.group}
                                  </Badge>
                                )}
                              </div>
                              
                              <TicketDetailDialog ticket={ticket} onUpdate={refetch} />
                            </div>
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
