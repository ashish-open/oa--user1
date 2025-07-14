import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

const mockLogs = [
  { date: '2024-07-01', user: 'John Doe', action: 'Approved KYC', status: 'Success' },
  { date: '2024-06-28', user: 'Jane Smith', action: 'Requested Document', status: 'Pending' },
  { date: '2024-06-25', user: 'Emily Davis', action: 'Rejected KYC', status: 'Failed' },
];

const KycAuditLogs: React.FC = () => (
  <DashboardLayout title="KYC Audit Logs">
    <div className="mb-8">
      <Card>
        <CardContent>
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">User</th>
                <th className="p-2 border">Action</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockLogs.map((log, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{log.date}</td>
                  <td className="p-2 border">{log.user}</td>
                  <td className="p-2 border">{log.action}</td>
                  <td className="p-2 border">{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default KycAuditLogs; 