import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, CheckCircle, TrendingUp } from 'lucide-react';

const mockTeam = [
  { name: 'John Doe', role: 'Lead', onboardings: 120, verifications: 110, success: '92%' },
  { name: 'Jane Smith', role: 'Agent', onboardings: 90, verifications: 85, success: '94%' },
  { name: 'Emily Davis', role: 'Agent', onboardings: 80, verifications: 70, success: '88%' },
];

const roleColors = {
  Lead: 'bg-blue-100 text-blue-800',
  Agent: 'bg-green-100 text-green-800',
};

const getSuccessBadge = (success) => {
  const value = parseInt(success);
  let color = 'bg-gray-100 text-gray-800';
  if (value >= 93) color = 'bg-green-100 text-green-800';
  else if (value >= 90) color = 'bg-yellow-100 text-yellow-800';
  else color = 'bg-red-100 text-red-800';
  return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}><CheckCircle className="h-4 w-4" />{success}</span>;
};

const KycTeamPerformance: React.FC = () => {
  const totalMembers = mockTeam.length;
  const totalOnboardings = mockTeam.reduce((sum, m) => sum + m.onboardings, 0);
  const totalVerifications = mockTeam.reduce((sum, m) => sum + m.verifications, 0);
  const avgSuccess = Math.round(mockTeam.reduce((sum, m) => sum + parseInt(m.success), 0) / totalMembers) + '%';

  return (
    <DashboardLayout title="KYC Team">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" />Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><UserCheck className="h-4 w-4 text-blue-600" />Onboardings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalOnboardings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><UserCheck className="h-4 w-4 text-green-600" />Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalVerifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2"><TrendingUp className="h-4 w-4 text-purple-600" />Avg. Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{avgSuccess}</div>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Team Performance Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="p-3 text-left font-semibold">Name</th>
                  <th className="p-3 text-left font-semibold">Role</th>
                  <th className="p-3 text-left font-semibold">Onboardings</th>
                  <th className="p-3 text-left font-semibold">Verifications</th>
                  <th className="p-3 text-left font-semibold">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {mockTeam.map((member, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-accent/40 transition-colors">
                    <td className="p-3 font-medium">{member.name}</td>
                    <td className="p-3"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleColors[member.role] || 'bg-gray-100 text-gray-800'}`}>{member.role}</span></td>
                    <td className="p-3">{member.onboardings}</td>
                    <td className="p-3">{member.verifications}</td>
                    <td className="p-3">{getSuccessBadge(member.success)}</td>
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

export default KycTeamPerformance; 