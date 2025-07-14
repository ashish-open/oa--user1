import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

const mockExceptions = [
  { user: 'John Doe', type: 'Document Mismatch', date: '2024-07-01', status: 'Open', notes: 'ID and address do not match' },
  { user: 'Jane Smith', type: 'Delayed Verification', date: '2024-06-28', status: 'Resolved', notes: 'Manual review completed' },
  { user: 'Emily Davis', type: 'Unusual Activity', date: '2024-06-25', status: 'Open', notes: 'Multiple failed attempts' },
];

const KycExceptions: React.FC = () => (
  <DashboardLayout title="KYC Exceptions">
    <div className="mb-8">
      <Card>
        <CardContent>
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border">User</th>
                <th className="p-2 border">Exception Type</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Notes</th>
              </tr>
            </thead>
            <tbody>
              {mockExceptions.map((ex, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{ex.user}</td>
                  <td className="p-2 border">{ex.type}</td>
                  <td className="p-2 border">{ex.date}</td>
                  <td className="p-2 border">{ex.status}</td>
                  <td className="p-2 border">{ex.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default KycExceptions; 