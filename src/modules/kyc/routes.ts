import React from 'react';
import KycOverview from './pages/KycOverview';
import KycApplications from './pages/KycApplications';
import KycAuditLogs from './pages/KycAuditLogs';
import KycTeamPerformance from './pages/KycTeamPerformance';
import KycPolicyDocuments from './pages/KycPolicyDocuments';
import KycExceptions from './pages/KycExceptions';
import KycDashboard from './pages/KycDashboard';

export const kycRoutes = [
  { path: '/kyc/overview', element: <KycOverview /> },
  { path: '/kyc/applications', element: <KycApplications /> },
  { path: '/kyc/audit-logs', element: <KycAuditLogs /> },
  { path: '/kyc/team-performance', element: <KycTeamPerformance /> },
  { path: '/kyc/policy-documents', element: <KycPolicyDocuments /> },
  { path: '/kyc/exceptions', element: <KycExceptions /> },
  { path: '/kyc/dashboard', element: <KycDashboard /> },
]; 