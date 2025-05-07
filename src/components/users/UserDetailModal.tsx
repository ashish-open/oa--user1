
import React, { useState } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Shield, CheckCircle, XCircle, Clock, User as UserIcon, FileText } from 'lucide-react';
import ServiceUsageSection from '@/components/users/ServiceUsageSection';
import UserKycDashboard from '@/components/users/UserKycDashboard';

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
  activeTab?: 'risk' | 'kyc';
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose, activeTab = 'risk' }) => {
  const [currentTab, setCurrentTab] = useState<'risk' | 'kyc'>(activeTab);
  
  const getRiskLevel = (score?: number): 'low' | 'medium' | 'high' => {
    if (score === undefined) return 'medium';
    if (score < 30) return 'low';
    if (score < 60) return 'medium';
    return 'high';
  };

  const getStatusIcon = () => {
    const riskLevel = getRiskLevel(user.riskScore);
    
    if (currentTab === 'risk') {
      return riskLevel === 'high' 
        ? <AlertTriangle className="h-6 w-6 text-red-600" /> 
        : riskLevel === 'medium'
          ? <Clock className="h-6 w-6 text-yellow-600" />
          : <Shield className="h-6 w-6 text-green-600" />;
    } else {
      return user.kycStatus === 'verified'
        ? <CheckCircle className="h-6 w-6 text-green-600" />
        : user.kycStatus === 'pending'
          ? <Clock className="h-6 w-6 text-yellow-600" />
          : <XCircle className="h-6 w-6 text-red-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl overflow-y-auto max-h-[90vh]" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <h2 className="text-xl font-bold">
              {user.firstName} {user.lastName} 
              <span className="text-sm font-normal text-muted-foreground ml-2">
                {user.email}
              </span>
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="text-sm font-medium">{user.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Account Created</p>
            <p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Business Type</p>
            <p className="text-sm font-medium">{user.businessType || 'N/A'}</p>
          </div>
        </div>
        
        <Tabs value={currentTab} onValueChange={(val) => setCurrentTab(val as 'risk' | 'kyc')}>
          <TabsList className="mb-4">
            <TabsTrigger value="risk" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Risk Profile
            </TabsTrigger>
            <TabsTrigger value="kyc" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              KYC Information
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="risk">
            <ServiceUsageSection user={user} />
          </TabsContent>
          
          <TabsContent value="kyc">
            <UserKycDashboard user={user} />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="default">
            View Full History
          </Button>
          <Button variant="destructive">
            Flag User
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
