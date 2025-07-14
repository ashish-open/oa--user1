import KycAuditLogs from './KycAuditLogs';
import KycTeamPerformance from './KycTeamPerformance';
import KycPolicyDocuments from './KycPolicyDocuments';
import KycExceptions from './KycExceptions';

export const kycRoutes = [
  { path: '/kyc/audit-logs', element: <KycAuditLogs /> },
  { path: '/kyc/team-performance', element: <KycTeamPerformance /> },
  { path: '/kyc/policy-documents', element: <KycPolicyDocuments /> },
  { path: '/kyc/exceptions', element: <KycExceptions /> },
]; 