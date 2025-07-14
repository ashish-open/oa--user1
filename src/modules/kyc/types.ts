// KYC Document
export interface KycDocument {
  type: 'id' | 'address' | 'other';
  status: 'approved' | 'pending' | 'rejected';
  uploadedAt: string;
}

// KYC Details
export interface KycDetails {
  documents: KycDocument[];
  pgPartner: string;
  midStatus: 'active' | 'pending' | 'rejected';
  verifiedAt?: string;
  verifiedBy?: string;
  verificationMethod?: 'manual' | 'auto';
  rejectionReason?: string;
}

// KYC User
export interface KycUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  kycStatus: 'verified' | 'pending' | 'rejected';
  kycDetails: KycDetails;
} 