
// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions?: UserPermission[];
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
  platform?: 'OPEN' | 'Zwitch' | 'Open Capital' | 'Open Accountant' | 'Axis Neo' | 'MBDB' | 'Bankonnect' | 'Yes Open' | string;
  platforms?: Array<{
    name: string;
    features: string[];
  }>;
  riskFactors?: {
    accountAge: number; // Risk contribution from account age
    transactionPattern: number; // Risk from transaction patterns
    chargebacksScore: number; // Risk from chargebacks
    complaintsScore: number; // Risk from complaints
    kycScore: number; // Risk from KYC status
    industryScore: number; // Risk from industry type
  };
  riskHistory?: Array<{ date: string; score: number }>;
  // Service usage fields
  serviceUsage?: {
    payin: boolean;
    payout: boolean;
    api: boolean;
  };
  // Service-specific risk scores
  serviceRiskScores?: {
    payin: number;
    payout: number;
    api: number;
  };
  // Service usage statistics
  serviceStats?: {
    payinVolume: number;
    payoutVolume: number;
    apiCallCount: number;
    avgTransactionSize: number;
  };
  // KYC-specific fields
  kycDetails?: {
    verifiedAt?: string;
    verifiedBy?: string;
    verificationMethod?: 'automated' | 'manual';
    rejectionReason?: string;
    documents?: Array<{
      type: 'id' | 'address' | 'business';
      status: 'approved' | 'rejected' | 'pending';
      uploadedAt: string;
    }>;
    pgPartner?: 'Stripe' | 'PayPal' | 'Adyen';
    midStatus?: 'pending' | 'active' | 'rejected';
  };
}

// User Role and Permission types
export type UserRole = 'superAdmin' | 'admin' | 'riskAnalyst' | 'kycAgent' | 'viewer';

export type UserPermission = 
  | 'viewUsers'
  | 'manageUsers' 
  | 'viewRiskDashboard' 
  | 'viewTransactions' 
  | 'manageTransactions'
  | 'viewRiskInvestigation' 
  | 'manageRiskScores' 
  | 'viewAlerts' 
  | 'manageAlerts'
  | 'viewTickets' 
  | 'manageTickets' 
  | 'viewKycDashboard' 
  | 'manageKyc'
  | 'viewReports'
  | 'manageSystem';

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
  // New service category field
  serviceCategory: 'payin' | 'payout' | 'api';
  // Additional service-specific fields
  processorName?: string;
  processingFee?: number;
  apiEndpoint?: string;
  methodUsed?: string;
  responseTime?: number;
  failureReason?: string;
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
  tags?: string[]; // Added tags field
  group?: string;  // Added group field
  // New Freshdesk-specific data
  freshdeskData?: {
    responderId?: number;
    groupId?: number;
    source?: number;
    dueBy?: string;
    customFields?: {
      [key: string]: any;
    };
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
  // New service-specific stats
  totalPayinVolume?: number;
  totalPayoutVolume?: number;
  totalApiCalls?: number;
}

// KYC stats
export interface KycStats {
  totalOnboardings: number;
  dailyOnboardings: number;
  monthlyOnboardings: number;
  verifiedUsers: number;
  pendingUsers: number;
  rejectedUsers: number;
  averageVerificationTime: number;
  pgPartnerDistribution: {
    [partner: string]: {
      pending: number;
      completed: number;
      rejected: number;
    };
  };
}
