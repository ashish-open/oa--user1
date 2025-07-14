// Risk Profile
export interface RiskProfile {
  score: number;
  level: 'low' | 'medium' | 'high';
  factors: string[];
  flagged: boolean;
  lastReviewedAt?: string;
}

// Risk User
export interface RiskUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  riskProfile: RiskProfile;
  kycStatus: 'verified' | 'pending' | 'rejected';
} 