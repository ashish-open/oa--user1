import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

const KycExceptions: React.FC = () => (
  <DashboardLayout title="KYC Exceptions & Issues">
    <div className="mb-8">
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          KYC exceptions and issue tracking coming soon.
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default KycExceptions; 