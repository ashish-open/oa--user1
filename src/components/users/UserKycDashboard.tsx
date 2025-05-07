
import React from 'react';
import { User, Ticket } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getUserKycTickets } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, FileText, Clock, User as UserIcon, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface UserKycDashboardProps {
  user: User;
}

const UserKycDashboard: React.FC<UserKycDashboardProps> = ({ user }) => {
  // Fetch user's KYC tickets
  const { data: kycTickets, isLoading } = useQuery({
    queryKey: ['userKycTickets', user.id],
    queryFn: () => getUserKycTickets(user.id),
  });

  const getKycStatusColor = (status?: string) => {
    switch(status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKycStatusIcon = (status?: string) => {
    switch(status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  // Calculate KYC completion percentage
  const calculateKycCompletion = () => {
    if (!user.kycDetails?.documents) return 0;
    
    const totalDocs = user.kycDetails.documents.length;
    const approvedDocs = user.kycDetails.documents.filter(doc => doc.status === 'approved').length;
    
    return Math.round((approvedDocs / totalDocs) * 100);
  };
  
  const kycCompletion = calculateKycCompletion();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">KYC Information</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* KYC Status Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">KYC Status</CardTitle>
            <CardDescription>Overall verification status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {getKycStatusIcon(user.kycStatus)}
                <span className={`px-2 py-1 rounded-full text-xs ${getKycStatusColor(user.kycStatus)}`}>
                  {user.kycStatus || 'Not Started'}
                </span>
              </div>
              {user.kycDetails?.verifiedAt && (
                <div className="text-xs text-gray-500 flex items-center">
                  <CalendarDays className="h-3.5 w-3.5 mr-1" />
                  Verified: {new Date(user.kycDetails.verifiedAt).toLocaleDateString()}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Verification Progress</span>
                  <span>{kycCompletion}%</span>
                </div>
                <Progress value={kycCompletion} className="h-2" />
              </div>
              
              {user.kycDetails?.documents && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Documents:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {user.kycDetails.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-600" />
                          <span className="text-sm">{doc.type}</span>
                        </div>
                        <Badge className={
                          doc.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 
                          doc.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : 
                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }>
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {user.kycDetails?.pgPartner && (
                <div className="flex justify-between items-center text-sm">
                  <span>Payment Gateway Partner:</span>
                  <span className="font-medium">{user.kycDetails.pgPartner}</span>
                </div>
              )}
              
              {user.kycDetails?.midStatus && (
                <div className="flex justify-between items-center text-sm">
                  <span>MID Status:</span>
                  <Badge className={
                    user.kycDetails.midStatus === 'active' ? 'bg-green-100 text-green-800' : 
                    user.kycDetails.midStatus === 'rejected' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {user.kycDetails.midStatus}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* KYC Support Tickets */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">KYC Tickets</CardTitle>
            <CardDescription>Related support tickets</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading tickets...</p>
              </div>
            ) : kycTickets && kycTickets.length > 0 ? (
              <div className="space-y-3">
                {kycTickets.map(ticket => (
                  <div key={ticket.id} className="p-3 border rounded-md hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{ticket.subject}</p>
                      <Badge variant="outline" className={
                        ticket.status === 'open' ? 'text-blue-600' : 
                        ticket.status === 'pending' ? 'text-yellow-600' : 
                        ticket.status === 'resolved' ? 'text-green-600' : 
                        'text-gray-600'
                      }>
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ticket.description}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 border border-dashed rounded-md">
                <UserIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">No KYC tickets found for this user</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserKycDashboard;
