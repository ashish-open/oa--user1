import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

const KycAuditLogs: React.FC = () => (
  <DashboardLayout title="KYC Audit Logs">
    <div className="mb-8">
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Audit log functionality coming soon.
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default KycAuditLogs; 