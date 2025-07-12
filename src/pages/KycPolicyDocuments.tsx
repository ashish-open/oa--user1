import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

const KycPolicyDocuments: React.FC = () => (
  <DashboardLayout title="KYC Policy & Documents">
    <div className="mb-8">
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          KYC policy documents and resources coming soon.
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default KycPolicyDocuments; 