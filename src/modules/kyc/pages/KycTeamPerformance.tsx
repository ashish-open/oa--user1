import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

const mockTeam = [
  { name: 'John Doe', role: 'Lead', onboardings: 120, verifications: 110, success: '92%' },
  { name: 'Jane Smith', role: 'Agent', onboardings: 90, verifications: 85, success: '94%' },
  { name: 'Emily Davis', role: 'Agent', onboardings: 80, verifications: 70, success: '88%' },
];

const KycTeamPerformance: React.FC = () => (
  <DashboardLayout title="KYC Team">
    <div className="mb-8">
      <Card>
        <CardContent>
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Onboardings</th>
                <th className="p-2 border">Verifications</th>
                <th className="p-2 border">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {mockTeam.map((member, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{member.name}</td>
                  <td className="p-2 border">{member.role}</td>
                  <td className="p-2 border">{member.onboardings}</td>
                  <td className="p-2 border">{member.verifications}</td>
                  <td className="p-2 border">{member.success}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default KycTeamPerformance; 