import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import KycOperationsTab from '@/components/users/KycOperationsTab';

const mockUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'kycAgent' as const,
    createdAt: '2024-04-01T10:00:00Z',
    kycStatus: 'pending' as const,
    kycDetails: {
      documents: [
        { type: 'id' as const, status: 'pending' as const, uploadedAt: '2024-04-01T10:00:00Z' },
      ],
      pgPartner: 'Stripe' as const,
      midStatus: 'pending' as const,
    },
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'kycAgent' as const,
    createdAt: '2024-03-15T09:30:00Z',
    kycStatus: 'verified' as const,
    kycDetails: {
      documents: [
        { type: 'id' as const, status: 'approved' as const, uploadedAt: '2024-03-15T09:30:00Z' },
        { type: 'address' as const, status: 'approved' as const, uploadedAt: '2024-03-15T09:35:00Z' },
      ],
      pgPartner: 'PayPal' as const,
      midStatus: 'active' as const,
      verifiedAt: '2024-03-16T12:00:00Z',
      verifiedBy: 'kycAdmin',
      verificationMethod: 'manual' as const,
    },
  },
  {
    id: '3',
    firstName: 'Alice',
    lastName: 'Brown',
    email: 'alice.brown@example.com',
    role: 'kycAgent' as const,
    createdAt: '2024-02-20T14:20:00Z',
    kycStatus: 'rejected' as const,
    kycDetails: {
      documents: [
        { type: 'id' as const, status: 'rejected' as const, uploadedAt: '2024-02-20T14:20:00Z' },
      ],
      pgPartner: 'Adyen' as const,
      midStatus: 'rejected' as const,
      rejectionReason: 'Document mismatch',
    },
  },
];

const KycApplications: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  return (
    <DashboardLayout title="KYC Applications">
      <div className="mb-8">
        <KycOperationsTab 
          users={mockUsers} 
          isLoading={false} 
          onSelectUser={setSelectedUser} 
          selectedUser={selectedUser}
        />
      </div>
    </DashboardLayout>
  );
};

export default KycApplications; 