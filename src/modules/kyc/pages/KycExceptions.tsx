import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const mockExceptions = [
  { user: 'John Doe', type: 'Document Mismatch', date: '2024-07-01', status: 'Open', notes: 'ID and address do not match' },
  { user: 'Jane Smith', type: 'Delayed Verification', date: '2024-06-28', status: 'Resolved', notes: 'Manual review completed' },
  { user: 'Emily Davis', type: 'Unusual Activity', date: '2024-06-25', status: 'Open', notes: 'Multiple failed attempts' },
];

const statusMeta = {
  Open: { color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="h-4 w-4 text-yellow-600" /> },
  Resolved: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4 text-green-600" /> },
};

const getStatusBadge = (status) => (
  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusMeta[status]?.color || 'bg-gray-100 text-gray-800'}`}>
    {statusMeta[status]?.icon}
    {status}
  </span>
);

const KycExceptions: React.FC = () => {
  const total = mockExceptions.length;
  const open = mockExceptions.filter(e => e.status === 'Open').length;
  const resolved = mockExceptions.filter(e => e.status === 'Resolved').length;

  return (
    <DashboardLayout title="KYC Exceptions">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-yellow-600" />Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" />Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" />Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
      </div>
      {/* Exceptions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Exception Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="p-3 text-left font-semibold">User</th>
                  <th className="p-3 text-left font-semibold">Exception Type</th>
                  <th className="p-3 text-left font-semibold">Date</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                  <th className="p-3 text-left font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {mockExceptions.map((ex, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-accent/40 transition-colors">
                    <td className="p-3 font-medium">{ex.user}</td>
                    <td className="p-3">{ex.type}</td>
                    <td className="p-3">{ex.date}</td>
                    <td className="p-3">{getStatusBadge(ex.status)}</td>
                    <td className="p-3">{ex.notes}</td>
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

export default KycExceptions; 