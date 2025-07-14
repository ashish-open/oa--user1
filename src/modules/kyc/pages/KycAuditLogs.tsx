import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, ListChecks } from 'lucide-react';

const mockLogs = [
  { date: '2024-07-01', user: 'John Doe', action: 'Approved KYC', status: 'Success' },
  { date: '2024-06-28', user: 'Jane Smith', action: 'Requested Document', status: 'Pending' },
  { date: '2024-06-25', user: 'Emily Davis', action: 'Rejected KYC', status: 'Failed' },
];

const statusMeta = {
  Success: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4 text-green-600" /> },
  Pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4 text-yellow-600" /> },
  Failed: { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4 text-red-600" /> },
};

const getStatusBadge = (status) => (
  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusMeta[status]?.color || 'bg-gray-100 text-gray-800'}`}>
    {statusMeta[status]?.icon}
    {status}
  </span>
);

const KycAuditLogs: React.FC = () => {
  const total = mockLogs.length;
  const success = mockLogs.filter(l => l.status === 'Success').length;
  const pending = mockLogs.filter(l => l.status === 'Pending').length;
  const failed = mockLogs.filter(l => l.status === 'Failed').length;

  return (
    <DashboardLayout title="KYC Audit Logs">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><ListChecks className="h-4 w-4 text-muted-foreground" />Total Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" />Success</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{success}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><Clock className="h-4 w-4 text-yellow-600" />Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><XCircle className="h-4 w-4 text-red-600" />Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Audit Log Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="p-3 text-left font-semibold">Date</th>
                  <th className="p-3 text-left font-semibold">User</th>
                  <th className="p-3 text-left font-semibold">Action</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockLogs.map((log, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-accent/40 transition-colors">
                    <td className="p-3">{log.date}</td>
                    <td className="p-3 font-medium">{log.user}</td>
                    <td className="p-3">{log.action}</td>
                    <td className="p-3">{getStatusBadge(log.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default KycAuditLogs; 