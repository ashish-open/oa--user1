
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
  // Simulate API call with enhanced mock data
  const mockUsers: User[] = [
    {
      id: 'USER001',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      createdAt: '2023-01-15T09:30:00Z',
      tier: 'Tier 1',
      businessType: 'Ecommerce',
      industry: 'Retail',
      riskScore: 35,
      chargebacks: 1,
      complaints: 0,
      kycStatus: 'verified',
      phone: '+1-202-555-0123',
      // New service usage data
      serviceUsage: {
        payin: true,
        payout: true,
        api: false
      },
      serviceRiskScores: {
        payin: 25,
        payout: 45,
        api: 0
      },
      serviceStats: {
        payinVolume: 28500,
        payoutVolume: 12300,
        apiCallCount: 0,
        avgTransactionSize: 1250
      }
    },
    {
      id: 'USER002',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'admin',
      createdAt: '2023-02-20T14:15:00Z',
      tier: 'Tier 2',
      businessType: 'SaaS',
      industry: 'Technology',
      riskScore: 15,
      chargebacks: 0,
      complaints: 1,
      kycStatus: 'verified',
      phone: '+1-202-555-0189',
      // New service usage data
      serviceUsage: {
        payin: true,
        payout: false,
        api: true
      },
      serviceRiskScores: {
        payin: 10,
        payout: 0,
        api: 20
      },
      serviceStats: {
        payinVolume: 54000,
        payoutVolume: 0,
        apiCallCount: 3450,
        avgTransactionSize: 750
      }
    },
    {
      id: 'USER003',
      email: 'mike.jones@example.com',
      firstName: 'Mike',
      lastName: 'Jones',
      role: 'user',
      createdAt: '2023-03-05T11:45:00Z',
      tier: 'Tier 1',
      businessType: 'Services',
      industry: 'Consulting',
      riskScore: 22,
      chargebacks: 0,
      complaints: 0,
      kycStatus: 'pending',
      phone: '+1-202-555-0145',
      // New service usage data
      serviceUsage: {
        payin: true,
        payout: true,
        api: true
      },
      serviceRiskScores: {
        payin: 20,
        payout: 15,
        api: 30
      },
      serviceStats: {
        payinVolume: 12000,
        payoutVolume: 8500,
        apiCallCount: 980,
        avgTransactionSize: 425
      }
    },
    {
      id: 'USER004',
      email: 'sarah.wilson@example.com',
      firstName: 'Sarah',
      lastName: 'Wilson',
      role: 'user',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      tier: 'Tier 1',
      businessType: 'Ecommerce',
      industry: 'Fashion',
      riskScore: 68,
      chargebacks: 3,
      complaints: 2,
      kycStatus: 'verified',
      phone: '+1-202-555-0198',
      // New service usage data
      serviceUsage: {
        payin: true,
        payout: false,
        api: false
      },
      serviceRiskScores: {
        payin: 75,
        payout: 0,
        api: 0
      },
      serviceStats: {
        payinVolume: 87500,
        payoutVolume: 0,
        apiCallCount: 0,
        avgTransactionSize: 650
      }
    },
    {
      id: 'USER005',
      email: 'robert.johnson@example.com',
      firstName: 'Robert',
      lastName: 'Johnson',
      role: 'user',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      tier: 'Tier 3',
      businessType: 'Services',
      industry: 'Financial',
      riskScore: 75,
      chargebacks: 2,
      complaints: 1,
      kycStatus: 'rejected',
      phone: '+1-202-555-0177',
      // New service usage data
      serviceUsage: {
        payin: true,
        payout: true,
        api: true
      },
      serviceRiskScores: {
        payin: 60,
        payout: 70,
        api: 90
      },
      serviceStats: {
        payinVolume: 125000,
        payoutVolume: 95000,
        apiCallCount: 12500,
        avgTransactionSize: 8500
      }
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
      id: 'TX001',
      userId: 'USER001',
      amount: 1250.00,
      currency: 'USD',
      status: 'completed',
      type: 'deposit',
      description: 'Monthly salary deposit',
      createdAt: '2023-04-01T10:00:00Z',
      serviceCategory: 'payin',
      processorName: 'Stripe',
      processingFee: 31.25
    },
    {
      id: 'TX002',
      userId: 'USER001',
      amount: 80.50,
      currency: 'USD',
      status: 'completed',
      type: 'withdrawal',
      description: 'Grocery shopping withdrawal',
      createdAt: '2023-04-02T15:30:00Z',
      serviceCategory: 'payout',
      recipient: 'Local Market',
      methodUsed: 'ACH Transfer'
    },
    {
      id: 'TX003',
      userId: 'USER002',
      amount: 500.00,
      currency: 'USD',
      status: 'pending',
      type: 'transfer',
      description: 'Transfer to savings account',
      createdAt: '2023-04-03T09:45:00Z',
      recipient: 'Savings Account',
      sender: 'Checking Account',
      serviceCategory: 'api',
      apiEndpoint: '/api/transfers',
      responseTime: 320
    },
    {
      id: 'TX004',
      userId: 'USER003',
      amount: 120.75,
      currency: 'USD',
      status: 'completed',
      type: 'withdrawal',
      description: 'Online purchase payment',
      createdAt: '2023-04-04T11:20:00Z',
      serviceCategory: 'payout',
      recipient: 'Amazon',
      methodUsed: 'Virtual Card'
    },
    {
      id: 'TX005',
      userId: 'USER002',
      amount: 2000.00,
      currency: 'USD',
      status: 'failed',
      type: 'transfer',
      description: 'International wire transfer',
      createdAt: '2023-04-05T16:15:00Z',
      recipient: 'External Account',
      sender: 'Main Account',
      serviceCategory: 'payout',
      methodUsed: 'SWIFT',
      failureReason: 'Insufficient verification'
    },
    {
      id: 'TX006',
      userId: 'USER004',
      amount: 5000.00,
      currency: 'USD',
      status: 'completed',
      type: 'deposit',
      description: 'Business funding deposit',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      serviceCategory: 'payin',
      processorName: 'PayPal',
      processingFee: 145.00
    },
    {
      id: 'TX007',
      userId: 'USER004',
      amount: 4500.00,
      currency: 'USD',
      status: 'completed',
      type: 'withdrawal',
      description: 'Bulk supplier payment',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      serviceCategory: 'payout',
      recipient: 'Wholesale Supplier Inc.',
      methodUsed: 'Bank Transfer'
    },
    {
      id: 'TX008',
      userId: 'USER005',
      amount: 10000.00,
      currency: 'USD',
      status: 'pending',
      type: 'transfer',
      description: 'Large value transfer',
      createdAt: new Date().toISOString(), // Today
      recipient: 'Investment Account',
      sender: 'Main Account',
      serviceCategory: 'api',
      apiEndpoint: '/api/investment-transfer',
      responseTime: 540
    },
    {
      id: 'TX009',
      userId: 'USER003',
      amount: 750.00,
      currency: 'USD',
      status: 'completed',
      type: 'deposit',
      description: 'Client payment received',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      serviceCategory: 'payin',
      processorName: 'Square',
      processingFee: 22.50
    },
    {
      id: 'TX010',
      userId: 'USER005',
      amount: 12500.00,
      currency: 'USD',
      status: 'completed',
      type: 'deposit',
      description: 'Major client payment',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      serviceCategory: 'api',
      apiEndpoint: '/api/batch-processing',
      responseTime: 890
    },
    {
      id: 'TX011',
      userId: 'USER002',
      amount: 1845.75,
      currency: 'USD',
      status: 'completed',
      type: 'deposit',
      description: 'Monthly subscription payments',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      serviceCategory: 'api',
      apiEndpoint: '/api/batch-subscriptions',
      responseTime: 675
    },
    {
      id: 'TX012',
      userId: 'USER001',
      amount: 325.50,
      currency: 'USD',
      status: 'failed',
      type: 'withdrawal',
      description: 'Vendor payment',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      serviceCategory: 'payout',
      recipient: 'Office Supplies Co.',
      methodUsed: 'ACH Transfer',
      failureReason: 'Invalid account information'
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
      id: 'ALERT001',
      userId: 'USER001',
      type: 'warning',
      message: 'Unusual login attempt detected from new location',
      status: 'unread',
      createdAt: '2023-04-05T08:30:00Z',
    },
    {
      id: 'ALERT002',
      userId: 'USER002',
      type: 'error',
      message: 'Payment method expired',
      status: 'read',
      createdAt: '2023-04-04T09:15:00Z',
    },
    {
      id: 'ALERT003',
      userId: 'USER001',
      type: 'info',
      message: 'New statement available',
      status: 'unread',
      createdAt: '2023-04-03T10:45:00Z',
    },
    {
      id: 'ALERT004',
      userId: 'USER003',
      type: 'success',
      message: 'Transfer completed successfully',
      status: 'read',
      createdAt: '2023-04-02T14:20:00Z',
    },
    {
      id: 'ALERT005',
      userId: 'USER002',
      type: 'warning',
      message: 'Account balance low',
      status: 'unread',
      createdAt: '2023-04-01T16:10:00Z',
    },
    {
      id: 'ALERT006',
      userId: 'USER004',
      type: 'error',
      message: 'Multiple failed login attempts',
      status: 'unread',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      id: 'ALERT007',
      userId: 'USER005',
      type: 'warning',
      message: 'Suspicious transaction pattern detected',
      status: 'unread',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
    {
      id: 'ALERT008',
      userId: 'USER005',
      type: 'error',
      message: 'Large value transaction requires review',
      status: 'unread',
      createdAt: new Date().toISOString(), // Today
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
      userId: 'USER001',
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
      userId: 'USER002',
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
      userId: 'USER003',
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
      userId: 'USER001',
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
      userId: 'USER002',
      requester: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
      },
    },
    {
      id: 106,
      subject: 'Dispute a charge',
      description: 'I want to dispute a transaction I don\'t recognize.',
      status: 'open',
      priority: 'high',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      userId: 'USER004',
      requester: {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
      },
    },
    {
      id: 107,
      subject: 'High value transfer issues',
      description: 'My large value transfer is stuck in pending status',
      status: 'open',
      priority: 'urgent',
      createdAt: new Date().toISOString(), // Today
      updatedAt: new Date().toISOString(),
      userId: 'USER005',
      requester: {
        name: 'Robert Johnson',
        email: 'robert.johnson@example.com',
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
