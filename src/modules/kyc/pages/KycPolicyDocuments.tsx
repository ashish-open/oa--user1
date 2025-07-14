import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

const mockPolicies = [
  { name: 'KYC Policy', updated: '2024-06-01', link: '#' },
  { name: 'AML Guidelines', updated: '2024-05-15', link: '#' },
  { name: 'Customer Due Diligence', updated: '2024-04-20', link: '#' },
];

const KycPolicyDocuments: React.FC = () => {
  const totalDocs = mockPolicies.length;
  return (
    <DashboardLayout title="KYC Policy Documents">
      {/* Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><Download className="h-4 w-4 text-blue-600" />Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalDocs}</div>
          </CardContent>
        </Card>
      </div>
      {/* Policy Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Policy Documents</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="p-3 text-left font-semibold">Document</th>
                  <th className="p-3 text-left font-semibold">Last Updated</th>
                  <th className="p-3 text-left font-semibold">Download</th>
                </tr>
              </thead>
              <tbody>
                {mockPolicies.map((doc, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-accent/40 transition-colors">
                    <td className="p-3 font-medium">{doc.name}</td>
                    <td className="p-3">{doc.updated}</td>
                    <td className="p-3">
                      <a href={doc.link} className="inline-flex items-center gap-1 px-2 py-1 rounded text-blue-600 hover:bg-blue-50 transition-colors" download>
                        <Download className="h-4 w-4" />
                        <span className="underline">Download</span>
                      </a>
                    </td>
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

export default KycPolicyDocuments; 