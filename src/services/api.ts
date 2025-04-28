
import { User, Transaction, Alert, Ticket, DashboardStats } from '@/types';

// Base URL for API calls - would be replaced with your actual API URL
const BASE_URL = '/api';

// Helper function for making API requests
async function fetchData<T>(endpoint: string, options = {}): Promise<T> {
  // In a real app, include auth token here
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

// For demonstration purposes, these functions return mock data
// In a real app, these would make actual API calls

export const getUsers = async (): Promise<User[]> => {
  // Simulate API call with mock data
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      createdAt: '2023-01-15T09:30:00Z',
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'admin',
      createdAt: '2023-02-20T14:15:00Z',
    },
    {
      id: '3',
      email: 'mike.jones@example.com',
      firstName: 'Mike',
      lastName: 'Jones',
      role: 'user',
      createdAt: '2023-03-05T11:45:00Z',
    },
  ];
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockUsers;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  // Simulate API call with mock data
  const mockTransactions: Transaction[] = [
    {
      id: 'tx1',
      userId: '1',
      amount: 1250.00,
      currency: 'USD',
      status: 'completed',
      type: 'deposit',
      description: 'Monthly salary',
      createdAt: '2023-04-01T10:00:00Z',
    },
    {
      id: 'tx2',
      userId: '1',
      amount: 80.50,
      currency: 'USD',
      status: 'completed',
      type: 'withdrawal',
      description: 'Grocery shopping',
      createdAt: '2023-04-02T15:30:00Z',
    },
    {
      id: 'tx3',
      userId: '2',
      amount: 500.00,
      currency: 'USD',
      status: 'pending',
      type: 'transfer',
      description: 'Transfer to savings',
      createdAt: '2023-04-03T09:45:00Z',
      recipient: 'Savings Account',
      sender: 'Checking Account',
    },
    {
      id: 'tx4',
      userId: '3',
      amount: 120.75,
      currency: 'USD',
      status: 'completed',
      type: 'withdrawal',
      description: 'Online purchase',
      createdAt: '2023-04-04T11:20:00Z',
    },
    {
      id: 'tx5',
      userId: '2',
      amount: 2000.00,
      currency: 'USD',
      status: 'failed',
      type: 'transfer',
      description: 'International wire transfer',
      createdAt: '2023-04-05T16:15:00Z',
      recipient: 'External Account',
      sender: 'Main Account',
    },
  ];
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return mockTransactions;
};

export const getAlerts = async (): Promise<Alert[]> => {
  // Simulate API call with mock data
  const mockAlerts: Alert[] = [
    {
      id: 'a1',
      userId: '1',
      type: 'warning',
      message: 'Unusual login attempt detected from new location',
      status: 'unread',
      createdAt: '2023-04-05T08:30:00Z',
    },
    {
      id: 'a2',
      userId: '2',
      type: 'error',
      message: 'Payment method expired',
      status: 'read',
      createdAt: '2023-04-04T09:15:00Z',
    },
    {
      id: 'a3',
      userId: '1',
      type: 'info',
      message: 'New statement available',
      status: 'unread',
      createdAt: '2023-04-03T10:45:00Z',
    },
    {
      id: 'a4',
      userId: '3',
      type: 'success',
      message: 'Transfer completed successfully',
      status: 'read',
      createdAt: '2023-04-02T14:20:00Z',
    },
    {
      id: 'a5',
      userId: '2',
      type: 'warning',
      message: 'Account balance low',
      status: 'unread',
      createdAt: '2023-04-01T16:10:00Z',
    },
  ];
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return mockAlerts;
};

export const getTickets = async (): Promise<Ticket[]> => {
  // Simulate API call with mock data
  const mockTickets: Ticket[] = [
    {
      id: 101,
      subject: 'Cannot access account',
      description: 'I am unable to log into my account since yesterday.',
      status: 'open',
      priority: 'high',
      createdAt: '2023-04-10T09:30:00Z',
      updatedAt: '2023-04-10T09:30:00Z',
      userId: '1',
      requester: {
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
    },
    {
      id: 102,
      subject: 'Missing transaction',
      description: 'A deposit I made yesterday is not showing in my account.',
      status: 'pending',
      priority: 'medium',
      createdAt: '2023-04-09T14:15:00Z',
      updatedAt: '2023-04-10T10:20:00Z',
      userId: '2',
      requester: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
      },
    },
    {
      id: 103,
      subject: 'How to update personal info',
      description: 'I need to change my address. How can I do this?',
      status: 'resolved',
      priority: 'low',
      createdAt: '2023-04-08T11:45:00Z',
      updatedAt: '2023-04-10T15:30:00Z',
      userId: '3',
      requester: {
        name: 'Mike Jones',
        email: 'mike.jones@example.com',
      },
    },
    {
      id: 104,
      subject: 'Card declined',
      description: 'My card was declined at a restaurant even though I have funds.',
      status: 'open',
      priority: 'urgent',
      createdAt: '2023-04-10T08:50:00Z',
      updatedAt: '2023-04-10T09:05:00Z',
      userId: '1',
      requester: {
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
    },
    {
      id: 105,
      subject: 'Account statement request',
      description: 'I need a statement for the last three months for tax purposes.',
      status: 'closed',
      priority: 'low',
      createdAt: '2023-04-05T16:20:00Z',
      updatedAt: '2023-04-07T09:45:00Z',
      userId: '2',
      requester: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
      },
    },
  ];
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return mockTickets;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  // Simulate API call with mock data
  const mockStats: DashboardStats = {
    totalUsers: 1245,
    totalTransactions: 5789,
    totalAmount: 892450.75,
    activeAlerts: 37,
    openTickets: 24,
  };
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  return mockStats;
};
