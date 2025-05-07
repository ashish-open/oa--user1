
import { toast } from 'sonner';
import { Ticket } from '@/types';

// Freshdesk API types
export interface FreshdeskTicket {
  id: number;
  subject: string;
  description: string;
  description_text: string;
  status: number;
  priority: number;
  source: number;
  requester_id: number;
  responder_id: number;
  group_id: number;
  created_at: string;
  updated_at: string;
  due_by: string;
  fr_due_by: string;
  tags: string[];
  custom_fields?: {
    [key: string]: any;
  };
  email: string;
  name: string;
}

export interface FreshdeskRequester {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface FreshdeskGroup {
  id: number;
  name: string;
  description: string;
}

export interface FreshdeskAgent {
  id: number;
  name: string;
  email: string;
  occasional: boolean;
}

// Configuration
let apiKey = '';
let domain = '';

// Setup function to initialize API credentials
export const setupFreshdeskAPI = (freshdeskDomain: string, freshdeskApiKey: string) => {
  domain = freshdeskDomain;
  apiKey = freshdeskApiKey;
};

// Helper function to encode API key in base64 for Basic Auth
const getAuthHeader = () => {
  return `Basic ${btoa(`${apiKey}:X`)}`;
};

// Helper to convert Freshdesk status and priority codes to our app format
const mapStatus = (status: number): Ticket['status'] => {
  // Freshdesk status: 2 = Open, 3 = Pending, 4 = Resolved, 5 = Closed
  switch (status) {
    case 2: return 'open';
    case 3: return 'pending';
    case 4: return 'resolved';
    case 5: return 'closed';
    default: return 'open';
  }
};

const mapPriority = (priority: number): Ticket['priority'] => {
  // Freshdesk priority: 1 = Low, 2 = Medium, 3 = High, 4 = Urgent
  switch (priority) {
    case 1: return 'low';
    case 2: return 'medium';
    case 3: return 'high';
    case 4: return 'urgent';
    default: return 'medium';
  }
};

// Function to convert Freshdesk ticket to our app's Ticket format
export const convertToAppTicket = (
  freshdeskTicket: FreshdeskTicket,
  requester?: FreshdeskRequester,
  groupName?: string
): Ticket => {
  return {
    id: freshdeskTicket.id,
    subject: freshdeskTicket.subject,
    description: freshdeskTicket.description_text,
    status: mapStatus(freshdeskTicket.status),
    priority: mapPriority(freshdeskTicket.priority),
    createdAt: freshdeskTicket.created_at,
    updatedAt: freshdeskTicket.updated_at,
    userId: requester ? requester.id.toString() : '',
    requester: {
      name: requester ? requester.name : freshdeskTicket.name || 'Unknown',
      email: requester ? requester.email : freshdeskTicket.email || 'unknown@example.com',
    },
    tags: freshdeskTicket.tags || [],
    group: groupName || '',
    // Add any additional fields needed by our application
    freshdeskData: {
      responderId: freshdeskTicket.responder_id,
      groupId: freshdeskTicket.group_id,
      source: freshdeskTicket.source,
      dueBy: freshdeskTicket.due_by,
      customFields: freshdeskTicket.custom_fields,
    }
  };
};

// Main API functions

// Get all tickets
export const fetchTickets = async (filters: { status?: string; priority?: string; group?: number; tags?: string[] } = {}): Promise<Ticket[]> => {
  if (!apiKey || !domain) {
    toast.error('Freshdesk API is not configured');
    return [];
  }
  
  try {
    // Build query parameters for filtering
    const queryParams = new URLSearchParams();
    
    if (filters.status) {
      // Convert status string back to Freshdesk numeric status
      const statusMap: Record<string, number> = {
        'open': 2,
        'pending': 3,
        'resolved': 4,
        'closed': 5,
        'all': 0  // Special case for "all" - we'll handle this by not adding it to query
      };
      
      if (filters.status !== 'all' && statusMap[filters.status]) {
        queryParams.append('status', statusMap[filters.status].toString());
      }
    }
    
    if (filters.priority && filters.priority !== 'all') {
      const priorityMap: Record<string, number> = {
        'low': 1,
        'medium': 2,
        'high': 3,
        'urgent': 4
      };
      
      if (priorityMap[filters.priority]) {
        queryParams.append('priority', priorityMap[filters.priority].toString());
      }
    }
    
    if (filters.group && filters.group > 0) {
      queryParams.append('group_id', filters.group.toString());
    }
    
    // For tags, Freshdesk uses a different approach with comma-separated values
    if (filters.tags && filters.tags.length > 0 && filters.tags[0] !== 'all') {
      // The 'tag' parameter expects comma-separated values in Freshdesk API
      queryParams.append('tag', filters.tags.join(','));
    }
    
    const url = `https://${domain}.freshdesk.com/api/v2/tickets?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} - ${errorData.message || response.statusText}`);
    }
    
    const freshdeskTickets: FreshdeskTicket[] = await response.json();
    
    // Fetch groups to map group IDs to names
    const groups = await fetchGroups();
    const groupMap = groups.reduce<Record<number, string>>((acc, group) => {
      acc[group.id] = group.name;
      return acc;
    }, {});
    
    // Convert Freshdesk tickets to our app's format
    return Promise.all(freshdeskTickets.map(async (ticket) => {
      // For each ticket, we could fetch the requester details if needed
      // For now, we'll use the basic information included in the ticket
      return convertToAppTicket(
        ticket, 
        undefined,  // We could fetch requester details here if needed
        groupMap[ticket.group_id]
      );
    }));
    
  } catch (error) {
    console.error('Error fetching tickets:', error);
    toast.error('Failed to fetch tickets');
    return [];
  }
};

// Get available groups
export const fetchGroups = async (): Promise<FreshdeskGroup[]> => {
  if (!apiKey || !domain) {
    toast.error('Freshdesk API is not configured');
    return [];
  }
  
  try {
    const url = `https://${domain}.freshdesk.com/api/v2/groups`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching groups:', error);
    toast.error('Failed to fetch groups');
    return [];
  }
};

// Get available agents
export const fetchAgents = async (): Promise<FreshdeskAgent[]> => {
  if (!apiKey || !domain) {
    toast.error('Freshdesk API is not configured');
    return [];
  }
  
  try {
    const url = `https://${domain}.freshdesk.com/api/v2/agents`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching agents:', error);
    toast.error('Failed to fetch agents');
    return [];
  }
};

// Get ticket by ID
export const fetchTicketById = async (ticketId: number): Promise<Ticket | null> => {
  if (!apiKey || !domain) {
    toast.error('Freshdesk API is not configured');
    return null;
  }
  
  try {
    const url = `https://${domain}.freshdesk.com/api/v2/tickets/${ticketId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const freshdeskTicket: FreshdeskTicket = await response.json();
    
    // Fetch group details to get the group name
    const groups = await fetchGroups();
    const group = groups.find(g => g.id === freshdeskTicket.group_id);
    
    return convertToAppTicket(freshdeskTicket, undefined, group?.name);
  } catch (error) {
    console.error(`Error fetching ticket ${ticketId}:`, error);
    toast.error('Failed to fetch ticket details');
    return null;
  }
};

// Create or update API methods could be added here as needed
// For example:

export const updateTicketStatus = async (ticketId: number, status: Ticket['status']): Promise<boolean> => {
  if (!apiKey || !domain) {
    toast.error('Freshdesk API is not configured');
    return false;
  }
  
  // Convert our status back to Freshdesk numeric format
  const statusMap: Record<string, number> = {
    'open': 2,
    'pending': 3,
    'resolved': 4,
    'closed': 5
  };
  
  try {
    const url = `https://${domain}.freshdesk.com/api/v2/tickets/${ticketId}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: statusMap[status]
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    toast.success(`Ticket status updated to ${status}`);
    return true;
  } catch (error) {
    console.error(`Error updating ticket ${ticketId}:`, error);
    toast.error('Failed to update ticket status');
    return false;
  }
};

export const addTicketNote = async (ticketId: number, note: string, isPrivate: boolean = true): Promise<boolean> => {
  if (!apiKey || !domain) {
    toast.error('Freshdesk API is not configured');
    return false;
  }
  
  try {
    const url = `https://${domain}.freshdesk.com/api/v2/tickets/${ticketId}/notes`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        body: note,
        private: isPrivate
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    toast.success('Note added to ticket');
    return true;
  } catch (error) {
    console.error(`Error adding note to ticket ${ticketId}:`, error);
    toast.error('Failed to add note to ticket');
    return false;
  }
};
