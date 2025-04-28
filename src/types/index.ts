
// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'deposit' | 'withdrawal' | 'transfer';
  description: string;
  createdAt: string;
  recipient?: string;
  sender?: string;
}

// Alert types
export interface Alert {
  id: string;
  userId: string;
  type: 'warning' | 'error' | 'info' | 'success';
  message: string;
  status: 'read' | 'unread';
  createdAt: string;
}

// Support ticket types
export interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  userId: string;
  requester: {
    name: string;
    email: string;
  };
}

// Dashboard stats
export interface DashboardStats {
  totalUsers: number;
  totalTransactions: number;
  totalAmount: number;
  activeAlerts: number;
  openTickets: number;
}
