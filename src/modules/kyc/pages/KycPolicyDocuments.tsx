import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

const mockPolicies = [
  { name: 'KYC Policy', updated: '2024-06-01', link: '#' },
  { name: 'AML Guidelines', updated: '2024-05-15', link: '#' },
  { name: 'Customer Due Diligence', updated: '2024-04-20', link: '#' },
];

const KycPolicyDocuments: React.FC = () => (
  <DashboardLayout title="KYC Policy Documents">
    <div className="mb-8">
      <Card>
        <CardContent>
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border">Document</th>
                <th className="p-2 border">Last Updated</th>
                <th className="p-2 border">Download</th>
              </tr>
            </thead>
            <tbody>
              {mockPolicies.map((doc, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{doc.name}</td>
                  <td className="p-2 border">{doc.updated}</td>
                  <td className="p-2 border">
                    <a href={doc.link} className="text-blue-600 underline">Download</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default KycPolicyDocuments; 