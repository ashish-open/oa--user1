// Service user (your customers)
export interface ServiceUser {
  id: string;
  name: string;
  email: string;
  kycStatus: 'verified' | 'pending' | 'rejected';
  // ...other fields as needed
}

// App user (admin, super admin, etc.)
export interface AppUser {
  id: string;
  email: string;
  role: 'superAdmin' | 'admin' | 'kycAgent' | 'riskAnalyst' | 'viewer';
  permissions: string[];
  // ...other fields as needed
} 