import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

const KycTeamPerformance: React.FC = () => (
  <DashboardLayout title="KYC Team Performance">
    <div className="mb-8">
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Team performance metrics coming soon.
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default KycTeamPerformance; 