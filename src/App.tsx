
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import PrivateRoute from "@/components/auth/PrivateRoute";

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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/transactions" element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            } />
            <Route path="/users" element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            } />
            <Route path="/users-management" element={
              <PrivateRoute>
                <UsersManagement />
              </PrivateRoute>
            } />
            <Route path="/alerts" element={
              <PrivateRoute>
                <Alerts />
              </PrivateRoute>
            } />
            <Route path="/tickets" element={
              <PrivateRoute>
                <Tickets />
              </PrivateRoute>
            } />
            <Route path="/kyc-dashboard" element={
              <PrivateRoute>
                <KycDashboard />
              </PrivateRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
