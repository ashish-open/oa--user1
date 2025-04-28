// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  tier?: string;
  businessType?: string;
  industry?: string;
  riskScore?: number;
  chargebacks?: number;
  complaints?: number;
  kycStatus?: 'verified' | 'pending' | 'rejected';
  phone?: string;
  transactionVelocity?: 'low' | 'medium' | 'high';
  lastLoginIp?: string;
  deviceChanges?: number;
  locationChanges?: number;
  unusualActivity?: boolean;
  riskFactors?: {
    accountAge: number; // Risk contribution from account age
    transactionPattern: number; // Risk from transaction patterns
    chargebacksScore: number; // Risk from chargebacks
    complaintsScore: number; // Risk from complaints
    kycScore: number; // Risk from KYC status
    industryScore: number; // Risk from industry type
  };
  riskHistory?: Array<{ date: string; score: number }>;
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
  highRiskUsers?: number;
  totalChargebacks?: number;
  totalComplaints?: number;
}
