
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/context/PermissionsContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { BarChart, AlertTriangle, Users, LayoutDashboard, ArrowLeftRight, Search, Shield, Ticket, CheckCircle, UserSearch, User, DollarSign, TrendingUp, Target, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import PermissionGate from '@/components/auth/PermissionGate';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, implement search functionality
    console.log('Searching for:', searchQuery);
  };

  // Helper function to get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superAdmin': return 'bg-red-100 text-red-800 border-red-200';
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'riskAnalyst': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'kycAgent': return 'bg-green-100 text-green-800 border-green-200';
      case 'viewer': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-bold">Risk Management</h2>
            </div>
          </div>
          <SidebarContent>
            {/* User Management Section */}
            <PermissionGate permission="viewUsers">
              <SidebarGroup>
                <SidebarGroupLabel>User Management</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => navigate('/users')}>
                        <button className="w-full flex items-center">
                          <UserSearch className="mr-2 h-5 w-5" />
                          <span>Centralized User Hub</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <PermissionGate permission="viewRiskInvestigation">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild onClick={() => navigate('/risk-investigation')}>
                          <button className="w-full flex items-center">
                            <User className="mr-2 h-5 w-5" />
                            <span>Risk Investigation</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </PermissionGate>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </PermissionGate>

            {/* KYC Team Section */}
            <PermissionGate permission="viewKycDashboard">
              <SidebarGroup>
                <SidebarGroupLabel>KYC Team</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => navigate('/kyc-dashboard')}>
                        <button className="w-full flex items-center">
                          <CheckCircle className="mr-2 h-5 w-5" />
                          <span>KYC Dashboard</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </PermissionGate>

            {/* Risk Operations Section */}
            <PermissionGate permission={["viewRiskDashboard", "viewTransactions", "viewAlerts", "viewTickets"]}>
              <SidebarGroup>
                <SidebarGroupLabel>Risk Operations</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <PermissionGate permission="viewRiskDashboard">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild onClick={() => navigate('/risk-dashboard')}>
                          <button className="w-full flex items-center">
                            <LayoutDashboard className="mr-2 h-5 w-5" />
                            <span>Risk Dashboard</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </PermissionGate>
                    
                    <PermissionGate permission="viewTransactions">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild onClick={() => navigate('/transactions')}>
                          <button className="w-full flex items-center">
                            <ArrowLeftRight className="mr-2 h-5 w-5" />
                            <span>Transaction Analysis</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </PermissionGate>
                    
                    <PermissionGate permission="viewAlerts">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild onClick={() => navigate('/alerts')}>
                          <button className="w-full flex items-center">
                            <AlertTriangle className="mr-2 h-5 w-5" />
                            <span>Risk Alerts</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </PermissionGate>
                    
                    <PermissionGate permission="viewTickets">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild onClick={() => navigate('/tickets')}>
                          <button className="w-full flex items-center">
                            <Ticket className="mr-2 h-5 w-5" />
                            <span>Support Tickets</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </PermissionGate>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </PermissionGate>

            {/* Sales Team Section */}
            <PermissionGate permission="viewUsers">
              <SidebarGroup>
                <SidebarGroupLabel>Sales Team</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => navigate('/sales-dashboard')}>
                        <button className="w-full flex items-center">
                          <DollarSign className="mr-2 h-5 w-5" />
                          <span>Sales Dashboard</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => navigate('/sales-opportunities')}>
                        <button className="w-full flex items-center">
                          <Target className="mr-2 h-5 w-5" />
                          <span>Opportunities</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => navigate('/sales-pipeline')}>
                        <button className="w-full flex items-center">
                          <TrendingUp className="mr-2 h-5 w-5" />
                          <span>Sales Pipeline</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => navigate('/customer-analytics')}>
                        <button className="w-full flex items-center">
                          <BarChart className="mr-2 h-5 w-5" />
                          <span>Customer Analytics</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => navigate('/sales-campaigns')}>
                        <button className="w-full flex items-center">
                          <Phone className="mr-2 h-5 w-5" />
                          <span>Campaigns</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </PermissionGate>

            {/* Admin Tools Section - Only for admins and super admins */}
            <PermissionGate permission="viewReports">
              <SidebarGroup>
                <SidebarGroupLabel>Admin Tools</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <button className="w-full flex items-center">
                          <BarChart className="mr-2 h-5 w-5" />
                          <span>Reports</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    {/* System settings - Super admin only */}
                    <PermissionGate permission="manageSystem">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <button className="w-full flex items-center">
                            <Shield className="mr-2 h-5 w-5" />
                            <span>System Settings</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </PermissionGate>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </PermissionGate>
          </SidebarContent>
          
          <div className="mt-auto p-4">
            {user && (
              <div className="flex flex-col space-y-2">
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{user.firstName} {user.lastName}</span>
                    <Badge variant="outline" className={`${getRoleBadgeColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-gray-500">{user.email}</p>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-screen">
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold">{title}</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <PermissionGate permission={["manageUsers", "manageRiskScores", "manageKyc"]}>
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-transparent">Quick Actions</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[400px] gap-3 p-4">
                            <PermissionGate permission="viewReports">
                              <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">Export Reports</div>
                                <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Generate and download risk reports
                                </div>
                              </NavigationMenuLink>
                            </PermissionGate>
                            
                            <PermissionGate permission="manageAlerts">
                              <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">Configure Alerts</div>
                                <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Set up custom alert thresholds
                                </div>
                              </NavigationMenuLink>
                            </PermissionGate>
                            
                            <PermissionGate permission="manageUsers">
                              <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="text-sm font-medium leading-none">User Access</div>
                                <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Manage admin access permissions
                                </div>
                              </NavigationMenuLink>
                            </PermissionGate>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </PermissionGate>
                
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search..."
                    className="w-full bg-white shadow-none appearance-none pl-8 md:w-[200px] lg:w-[300px] rounded-md border border-input px-3 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
