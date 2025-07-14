
import React, { useState } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, CheckCircle, XCircle, Clock, User as UserIcon, FileText, BarChart2, Layers, Ticket, Briefcase } from 'lucide-react';

interface UserDetailModalProps {
  onClose: () => void;
  activeTab?: 'overview' | 'risk' | 'kyc' | 'service' | 'tickets';
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ onClose, activeTab = 'overview' }) => {
  const [currentTab, setCurrentTab] = useState<'overview' | 'risk' | 'kyc' | 'service' | 'tickets'>(activeTab);

  // Helper for status badges
  const getStatusBadge = () => {
    if (user.kycStatus === 'verified') {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
    } else if (user.kycStatus === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    } else if (user.kycStatus === 'rejected') {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
    }
    return null;
  };

  // Helper for platform badge
  const getPlatformBadge = () => {
    if (!user.platform) return null;
    let color = 'bg-gray-100 text-gray-800 border-gray-200';
    let icon = null;
    switch (user.platform) {
      case 'OPEN':
        color = 'bg-blue-100 text-blue-800 border-blue-200';
        icon = <Briefcase className="h-3.5 w-3.5 mr-1" />;
        break;
      case 'Zwitch':
        color = 'bg-purple-100 text-purple-800 border-purple-200';
        icon = <Layers className="h-3.5 w-3.5 mr-1" />;
        break;
      case 'Open Capital':
        color = 'bg-green-100 text-green-800 border-green-200';
        icon = <BarChart2 className="h-3.5 w-3.5 mr-1" />;
        break;
      case 'Open Accountant':
        color = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        icon = <UserIcon className="h-3.5 w-3.5 mr-1" />;
        break;
      case 'Axis Neo':
        color = 'bg-red-100 text-red-800 border-red-200';
        icon = <Shield className="h-3.5 w-3.5 mr-1" />;
        break;
      case 'MBDB':
        color = 'bg-pink-100 text-pink-800 border-pink-200';
        icon = <Ticket className="h-3.5 w-3.5 mr-1" />;
        break;
      case 'Bankonnect':
        color = 'bg-cyan-100 text-cyan-800 border-cyan-200';
        icon = <Layers className="h-3.5 w-3.5 mr-1" />;
        break;
      case 'Yes Open':
        color = 'bg-indigo-100 text-indigo-800 border-indigo-200';
        icon = <CheckCircle className="h-3.5 w-3.5 mr-1" />;
        break;
      default:
        color = 'bg-gray-100 text-gray-800 border-gray-200';
        icon = <Briefcase className="h-3.5 w-3.5 mr-1" />;
    }
    return (
      <Badge className={`inline-flex items-center ${color}`}>{icon}{user.platform}</Badge>
    );
  };

  // MOCK DATA (replace user prop for demo purposes)
  const mockUser: User = {
    id: 'USER001',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'viewer',
    createdAt: '2021-01-01T00:00:00Z',
    tier: 'Tier 1',
    businessType: 'Ecommerce',
    industry: 'Retail',
    riskScore: 35,
    chargebacks: 1,
    complaints: 0,
    kycStatus: 'verified',
    phone: '+1-202-555-0123',
    transactionVelocity: 'medium',
    lastLoginIp: '192.168.1.10',
    deviceChanges: 2,
    locationChanges: 1,
    unusualActivity: false,
    platform: 'OPEN',
    riskFactors: {
      accountAge: 2,
      transactionPattern: 3,
      chargebacksScore: 1,
      complaintsScore: 0,
      kycScore: 1,
      industryScore: 2,
    },
    riskHistory: [
      { date: '2023-01-01', score: 30 },
      { date: '2023-06-01', score: 32 },
      { date: '2024-01-01', score: 35 },
    ],
    serviceUsage: {
      payin: true,
      payout: true,
      api: true,
    },
    serviceRiskScores: {
      payin: 2,
      payout: 3,
      api: 1,
    },
    serviceStats: {
      payinVolume: 50000,
      payoutVolume: 30000,
      apiCallCount: 1200,
      avgTransactionSize: 250,
    },
    kycDetails: {
      verifiedAt: '2021-01-10T12:00:00Z',
      verifiedBy: 'kyc.agent@example.com',
      verificationMethod: 'automated',
      documents: [
        { type: 'id', status: 'approved', uploadedAt: '2021-01-05T10:00:00Z' },
        { type: 'address', status: 'approved', uploadedAt: '2021-01-05T10:00:00Z' },
        { type: 'business', status: 'approved', uploadedAt: '2021-01-06T11:00:00Z' },
      ],
      pgPartner: 'Stripe',
      midStatus: 'active',
    },
    platforms: [
      {
        name: 'OPEN',
        features: ['Payment Link', 'Invoice', 'GST', 'Connected Banking', 'VA']
      },
      {
        name: 'Zwitch',
        features: ['Payout API', 'Collection', 'Verifications API']
      }
    ],
  };

  const user = mockUser; // Use mock data for all tabs

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl overflow-y-auto max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div className="flex items-center gap-3">
            <UserIcon className="h-8 w-8 text-gray-500" />
            <div>
              <h2 className="text-xl font-bold">
                {user.firstName} {user.lastName}
                <span className="text-sm font-normal text-muted-foreground ml-2">{user.email}</span>
                <span className="ml-2 align-middle">{getStatusBadge()}</span>
                <span className="ml-2 align-middle">{getPlatformBadge()}</span>
              </h2>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant="outline">ID: {user.id}</Badge>
                <Badge variant="outline">Role: {user.role}</Badge>
                {user.businessType && <Badge variant="outline">{user.businessType}</Badge>}
                <Badge variant="outline">Created: {new Date(user.createdAt).toLocaleDateString()}</Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Tabs Skeleton */}
        <Tabs value={currentTab} onValueChange={(val) => setCurrentTab(val as typeof currentTab)}>
          <TabsList className="mb-4 flex flex-wrap gap-2">
            <TabsTrigger value="overview" className="flex items-center gap-1"><BarChart2 className="h-4 w-4" />Overview</TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-1"><AlertTriangle className="h-4 w-4" />Risk Profile</TabsTrigger>
            <TabsTrigger value="kyc" className="flex items-center gap-1"><FileText className="h-4 w-4" />KYC Information</TabsTrigger>
            <TabsTrigger value="service" className="flex items-center gap-1"><Layers className="h-4 w-4" />Service Usage</TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-1"><Ticket className="h-4 w-4" />Support Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Personal Info */}
              <div className="p-4 border rounded-md flex-1">
                <div className="font-semibold mb-2">Personal Info</div>
                <div className="text-xs text-muted-foreground">ID</div>
                <div className="mb-1">{user.id}</div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="mb-1">{user.email}</div>
                <div className="text-xs text-muted-foreground">Phone</div>
                <div className="mb-1">{user.phone || 'N/A'}</div>
                <div className="text-xs text-muted-foreground">Created</div>
                <div>{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
              {/* Risk Score & KYC Status */}
              <div className="flex flex-col items-center justify-center p-4 border rounded-md flex-1">
                <div className="text-xs text-muted-foreground mb-1">Risk Score</div>
                <div className="text-3xl font-bold mb-2">{user.riskScore ?? 'N/A'}</div>
                <div className="text-xs text-muted-foreground mb-1">KYC Status</div>
                <div>{getStatusBadge()}</div>
                <div className="text-xs text-muted-foreground mt-4">Account Age</div>
                <div className="text-lg font-semibold mb-2">
                  {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
                <div className="text-xs text-muted-foreground mb-1">Recent Activity</div>
                <div className="text-sm">Last login IP: {user.lastLoginIp}</div>
              </div>
              {/* Open Tickets & Service Usage */}
              <div className="flex flex-col justify-between p-4 border rounded-md flex-1">
                <div>
                  <div className="font-semibold mb-2">Open Tickets</div>
                  <div className="text-sm">2 open tickets</div>
                </div>
                <div className="mt-4">
                  <div className="font-semibold mb-2">Service Usage</div>
                  <div className="text-xs">Payin: {user.serviceUsage?.payin ? 'Yes' : 'No'}, Payout: {user.serviceUsage?.payout ? 'Yes' : 'No'}, API: {user.serviceUsage?.api ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="risk">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Risk Indicators */}
              <div className="p-4 border rounded-md flex-1">
                <div className="font-semibold mb-2">Risk Indicators</div>
                <div className="flex justify-between text-xs mb-1"><span>Chargebacks</span><span>{user.chargebacks ?? 0}</span></div>
                <div className="flex justify-between text-xs mb-1"><span>Complaints</span><span>{user.complaints ?? 0}</span></div>
                <div className="flex justify-between text-xs mb-1"><span>Transaction Velocity</span><span>{user.transactionVelocity ?? 'Normal'}</span></div>
                <div className="flex justify-between text-xs mb-1"><span>Unusual Activity</span><span>{user.unusualActivity ? 'Yes' : 'None'}</span></div>
              </div>
              {/* Risk Factors */}
              <div className="p-4 border rounded-md flex-1">
                <div className="font-semibold mb-2">Risk Factors</div>
                <div className="flex justify-between text-xs mb-1"><span>Industry Risk</span><span>{user.riskFactors?.industryScore ?? 0}/10</span></div>
                <div className="flex justify-between text-xs mb-1"><span>Chargebacks Risk</span><span>{user.riskFactors?.chargebacksScore ?? 0}/10</span></div>
                <div className="flex justify-between text-xs mb-1"><span>Complaints Risk</span><span>{user.riskFactors?.complaintsScore ?? 0}/10</span></div>
                <div className="flex justify-between text-xs mb-1"><span>KYC Risk</span><span>{user.riskFactors?.kycScore ?? 0}/10</span></div>
                <div className="flex justify-between text-xs mb-1"><span>Account Age Risk</span><span>{user.riskFactors?.accountAge ?? 0}/10</span></div>
                <div className="flex justify-between text-xs mb-1"><span>Transaction Pattern Risk</span><span>{user.riskFactors?.transactionPattern ?? 0}/10</span></div>
              </div>
            </div>
            <div className="mt-6 p-4 border rounded-md">
              <div className="font-semibold mb-2">Risk History</div>
              <ul className="text-xs">
                {user.riskHistory?.map((entry, idx) => (
                  <li key={idx}>{entry.date}: Score {entry.score}</li>
                ))}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="kyc">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Business Info */}
              <div className="p-4 border rounded-md flex-1">
                <div className="font-semibold mb-2">Business Info</div>
                <div className="text-xs text-muted-foreground">Type</div>
                <div className="mb-1">{user.businessType || 'N/A'}</div>
                <div className="text-xs text-muted-foreground">Industry</div>
                <div className="mb-1">{user.industry || 'N/A'}</div>
                <div className="text-xs text-muted-foreground">Tier</div>
                <div className="mb-1">{user.tier || 'N/A'}</div>
                <div className="text-xs text-muted-foreground">KYC Status</div>
                <div>{getStatusBadge()}</div>
              </div>
              {/* KYC Details */}
              <div className="p-4 border rounded-md flex-1">
                <div className="font-semibold mb-2">KYC Details</div>
                <div className="text-xs mt-2">Verified At: {user.kycDetails?.verifiedAt ? new Date(user.kycDetails.verifiedAt).toLocaleString() : 'N/A'}</div>
                <div className="text-xs">Verified By: {user.kycDetails?.verifiedBy || 'N/A'}</div>
                <div className="text-xs">Verification Method: {user.kycDetails?.verificationMethod || 'N/A'}</div>
                <div className="text-xs">PG Partner: {user.kycDetails?.pgPartner || 'N/A'}</div>
                <div className="text-xs">MID Status: {user.kycDetails?.midStatus || 'N/A'}</div>
                {user.kycDetails?.rejectionReason && (
                  <div className="text-xs text-red-600">Rejection Reason: {user.kycDetails.rejectionReason}</div>
                )}
                <div className="font-semibold mt-4 mb-2">KYC Documents</div>
                <ul className="text-xs">
                  {user.kycDetails?.documents?.map((doc, idx) => (
                    <li key={idx}>{doc.type.toUpperCase()}: {doc.status} (Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()})</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="service">
            <div className="grid gap-6 md:grid-cols-2">
              {user.platforms?.map((platform, idx) => (
                <div key={platform.name} className="p-4 border rounded-md">
                  <div className="font-semibold mb-2">{platform.name}</div>
                  <ul className="list-disc ml-5 text-xs">
                    {platform.features.map((feature, fidx) => (
                      <li key={fidx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 border rounded-md">
              <div className="font-semibold mb-2">Service Stats</div>
              <div className="text-xs">Payin Volume: ₹{user.serviceStats?.payinVolume?.toLocaleString() ?? 0}</div>
              <div className="text-xs">Payout Volume: ₹{user.serviceStats?.payoutVolume?.toLocaleString() ?? 0}</div>
              <div className="text-xs">API Call Count: {user.serviceStats?.apiCallCount ?? 0}</div>
              <div className="text-xs">Avg Transaction Size: ₹{user.serviceStats?.avgTransactionSize ?? 0}</div>
            </div>
          </TabsContent>
          <TabsContent value="tickets">
            <div className="p-4 border rounded-md">
              <div className="font-semibold mb-2">Support Tickets</div>
              <ul className="text-xs">
                <li>Ticket #1234: Payment issue - <span className="text-yellow-600">Open</span> (High Priority)</li>
                <li>Ticket #1235: KYC delay - <span className="text-green-600">Resolved</span> (Medium Priority)</li>
                <li>Ticket #1236: API error - <span className="text-red-600">Closed</span> (Urgent Priority)</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
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
