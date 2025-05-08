
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
import Dashboard from "./pages/RiskDashboard";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";
import UsersManagement from "./pages/UsersManagement";
import Alerts from "./pages/Alerts";
import Tickets from "./pages/Tickets";
import KycDashboard from "./pages/KycDashboard";
import NotFound from "./pages/NotFound";

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
                    <Users />
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
              <Route path="/kyc-dashboard" element={
                <PrivateRoute>
                  <PermissionGate permission="viewKycDashboard">
                    <KycDashboard />
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
