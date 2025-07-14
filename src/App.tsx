
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { PermissionsProvider } from "@/context/PermissionsContext";
import PrivateRoute from "@/components/auth/PrivateRoute";
import PermissionGate from "@/components/auth/PermissionGate";

// Import pages
import Login from "./pages/Login";
import Dashboard from "./modules/risk/pages/RiskDashboard";
import Transactions from "./pages/Transactions";
import UsersManagement from "./pages/UsersManagement";
import Alerts from "./pages/Alerts";
import Tickets from "./pages/Tickets";
import KycDashboard from "./modules/kyc/pages/KycDashboard";
import SalesDashboard from "./pages/SalesDashboard";
import SalesOpportunities from "./pages/SalesOpportunities";
import SalesPipeline from "./pages/SalesPipeline";
import CustomerAnalytics from "./pages/CustomerAnalytics";
import SalesCampaigns from "./pages/SalesCampaigns";
import NotFound from "./pages/NotFound";
import KycOverview from './modules/kyc/pages/KycOverview';
import KycApplications from './modules/kyc/pages/KycApplications';
import KycAuditLogs from './modules/kyc/pages/KycAuditLogs';
import KycTeamPerformance from './modules/kyc/pages/KycTeamPerformance';
import KycPolicyDocuments from './modules/kyc/pages/KycPolicyDocuments';
import KycExceptions from './modules/kyc/pages/KycExceptions';
import RiskInvestigation from "./modules/risk/pages/RiskInvestigation";
import SalesAnalytics from "./pages/SalesAnalytics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PermissionsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Root redirect to Users Hub */}
              <Route path="/" element={<Navigate to="/users" replace />} />
              
              {/* Protected routes */}
              <Route path="/risk-dashboard" element={
                <PrivateRoute>
                  <PermissionGate permission="viewRiskDashboard">
                    <Dashboard />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/transactions" element={
                <PrivateRoute>
                  <PermissionGate permission="viewTransactions">
                    <Transactions />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/users" element={
                <PrivateRoute>
                  <PermissionGate permission="viewUsers">
                    <UsersManagement />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/users-management" element={
                <PrivateRoute>
                  <PermissionGate permission="viewUsers">
                    <UsersManagement />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/risk-investigation" element={
                <PrivateRoute>
                  <PermissionGate permission="viewRiskInvestigation">
                    <RiskInvestigation />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/alerts" element={
                <PrivateRoute>
                  <PermissionGate permission="viewAlerts">
                    <Alerts />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/tickets" element={
                <PrivateRoute>
                  <PermissionGate permission="viewTickets">
                    <Tickets />
                  </PermissionGate>
                </PrivateRoute>
              } />
              
              {/* KYC Team routes */}
              <Route path="/kyc/overview" element={
                <PrivateRoute>
                  <PermissionGate permission="viewKycDashboard">
                    <KycOverview />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/kyc/applications" element={
                <PrivateRoute>
                  <PermissionGate permission="viewKycDashboard">
                    <KycApplications />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/kyc/audit-logs" element={
                <PrivateRoute>
                  <PermissionGate permission="viewKycDashboard">
                    <KycAuditLogs />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/kyc/team-performance" element={
                <PrivateRoute>
                  <PermissionGate permission="viewKycDashboard">
                    <KycTeamPerformance />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/kyc/policy-documents" element={
                <PrivateRoute>
                  <PermissionGate permission="viewKycDashboard">
                    <KycPolicyDocuments />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/kyc/exceptions" element={
                <PrivateRoute>
                  <PermissionGate permission="viewKycDashboard">
                    <KycExceptions />
                  </PermissionGate>
                </PrivateRoute>
              } />
              
              {/* Sales Team routes */}
              <Route path="/sales-dashboard" element={
                <PrivateRoute>
                  <PermissionGate permission="viewUsers">
                    <SalesDashboard />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/sales-opportunities" element={
                <PrivateRoute>
                  <PermissionGate permission="viewUsers">
                    <SalesOpportunities />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/sales-pipeline" element={
                <PrivateRoute>
                  <PermissionGate permission="viewUsers">
                    <SalesPipeline />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/customer-analytics" element={
                <PrivateRoute>
                  <PermissionGate permission="viewUsers">
                    <CustomerAnalytics />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/sales-campaigns" element={
                <PrivateRoute>
                  <PermissionGate permission="viewUsers">
                    <SalesCampaigns />
                  </PermissionGate>
                </PrivateRoute>
              } />
              <Route path="/sales-analytics" element={
                <PrivateRoute>
                  <PermissionGate permission="viewUsers">
                    <CustomerAnalytics />
                  </PermissionGate>
                </PrivateRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PermissionsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
