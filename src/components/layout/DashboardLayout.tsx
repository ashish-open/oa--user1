
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/context/PermissionsContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { BarChart, AlertTriangle, Users, LayoutDashboard, ArrowLeftRight, Search, Shield, Ticket, CheckCircle, UserSearch, User, DollarSign, TrendingUp, Target, Phone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import PermissionGate from '@/components/auth/PermissionGate';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [openSection, setOpenSection] = useState<string | undefined>('users');

  React.useEffect(() => {
    if (
      location.pathname.startsWith('/users') ||
      location.pathname.startsWith('/user') ||
      location.pathname.startsWith('/risk-investigation')
    ) setOpenSection('users');
    else if (location.pathname.startsWith('/kyc')) setOpenSection('kyc');
    else if (
      location.pathname.startsWith('/risk-dashboard') ||
      location.pathname.startsWith('/alerts') ||
      location.pathname.startsWith('/tickets')
    ) setOpenSection('risk');
    else if (location.pathname.startsWith('/transactions')) setOpenSection('transactions');
    else if (location.pathname.startsWith('/sales')) setOpenSection('sales');
    else setOpenSection('users');
  }, [location.pathname]);

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
        <Sidebar className="bg-[#fafbfc] border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-bold">OPENArc</h2>
            </div>
          </div>
          <SidebarContent>
            {/* Main Sidebar Accordion */}
            <Accordion type="single" className="w-full" value={openSection} onValueChange={setOpenSection}
            >
              {/* Users Section */}
              <AccordionItem value="users">
                <AccordionTrigger className="px-4 py-2 flex items-center gap-2 text-base font-semibold hover:bg-muted transition-colors justify-start text-left [&[data-state=open]>svg]:rotate-0">
                  <UserSearch className="h-5 w-5" />
                  Users
                </AccordionTrigger>
                <AccordionContent className="pl-8 pr-2 pb-2">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild onClick={() => navigate('/users')}>
                        <button className="w-full flex items-center gap-2 py-1.5 px-2 rounded hover:bg-accent transition-all duration-150 focus:bg-accent data-[active=true]:bg-accent data-[active=true]:border-l-4 data-[active=true]:border-primary justify-start text-left">
                          <UserSearch className="h-4 w-4" />
                          <span>Central Hub</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <PermissionGate permission="viewRiskInvestigation">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild onClick={() => navigate('/risk-investigation')}>
                          <button className="w-full flex items-center gap-2 py-1.5 px-2 rounded hover:bg-accent transition-all duration-150 focus:bg-accent data-[active=true]:bg-accent data-[active=true]:border-l-4 data-[active=true]:border-primary justify-start text-left">
                            <User className="h-4 w-4" />
                            <span>Investigation</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </PermissionGate>
                  </SidebarMenu>
                </AccordionContent>
              </AccordionItem>
              <div className="mb-3" />
              {/* KYC Section */}
              <AccordionItem value="kyc">
                <AccordionTrigger className="px-4 py-2 flex items-center gap-2 text-base font-semibold hover:bg-muted transition-colors justify-start text-left [&[data-state=open]>svg]:rotate-0">
                  <CheckCircle className="h-5 w-5" />
                  KYC
                </AccordionTrigger>
                <AccordionContent className="pl-8 pr-2 pb-2">
                  <div className="ml-2 mt-1 flex flex-col gap-1">
                    <SidebarMenuSubButton href="/kyc/overview" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors">
                      <BarChart className="h-4 w-4" />
                      <span>Overview</span>
                    </SidebarMenuSubButton>
                    <SidebarMenuSubButton href="/kyc/applications" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors">
                      <FileText className="h-4 w-4" />
                      <span>Applications</span>
                    </SidebarMenuSubButton>
                    <SidebarMenuSubButton href="/kyc/audit-logs" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors">
                      <Search className="h-4 w-4" />
                      <span>Audit Logs</span>
                    </SidebarMenuSubButton>
                    <SidebarMenuSubButton href="/kyc/team-performance" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors">
                      <Users className="h-4 w-4" />
                      <span>Team</span>
                    </SidebarMenuSubButton>
                    <SidebarMenuSubButton href="/kyc/policy-documents" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors">
                      <FileText className="h-4 w-4" />
                      <span>Policy</span>
                    </SidebarMenuSubButton>
                    <SidebarMenuSubButton href="/kyc/exceptions" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Exceptions</span>
                    </SidebarMenuSubButton>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <div className="mb-3" />
              {/* Risk Section */}
              <AccordionItem value="risk">
                <AccordionTrigger className="px-4 py-2 flex items-center gap-2 text-base font-semibold hover:bg-muted transition-colors justify-start text-left [&[data-state=open]>svg]:rotate-0">
                  <Shield className="h-5 w-5" />
                  Risk
                </AccordionTrigger>
                <AccordionContent className="pl-8 pr-2 pb-2">
                  <div className="ml-2 mt-1 flex flex-col gap-1">
                    <SidebarMenuSubButton href="/risk-dashboard" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuSubButton>
                    <SidebarMenuSubButton href="/alerts" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Alerts</span>
                    </SidebarMenuSubButton>
                    <SidebarMenuSubButton href="/tickets" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors">
                      <Ticket className="h-4 w-4" />
                      <span>Tickets</span>
                    </SidebarMenuSubButton>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <div className="mb-3" />
              {/* Transactions Section */}
              <AccordionItem value="transactions">
                <AccordionTrigger className="px-4 py-2 flex items-center gap-2 text-base font-semibold hover:bg-muted transition-colors justify-start text-left [&[data-state=open]>svg]:rotate-0">
                  <ArrowLeftRight className="h-5 w-5" />
                  Transactions
                </AccordionTrigger>
                <AccordionContent className="pl-8 pr-2 pb-2">
                  <div className="ml-2 mt-1 flex flex-col gap-1">
                    <SidebarMenuSubButton href="/transactions" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors">
                      <ArrowLeftRight className="h-4 w-4" />
                      <span>Transactions</span>
                    </SidebarMenuSubButton>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <div className="mb-3" />
              {/* Sales Section */}
              <AccordionItem value="sales">
                <AccordionTrigger className="px-4 py-2 flex items-center gap-2 text-base font-semibold hover:bg-muted transition-colors justify-start text-left [&[data-state=open]>svg]:rotate-0">
                  <DollarSign className="h-5 w-5" />
                  Sales
                </AccordionTrigger>
                <AccordionContent className="pl-8 pr-2 pb-2">
                  <div className="ml-2 mt-1 flex flex-col gap-1">
                    <SidebarMenuSubButton href="/sales-dashboard" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuSubButton>
                    <SidebarMenuSubButton href="/sales-opportunities" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors">
                      <Target className="h-4 w-4" />
                      <span>Opportunities</span>
                    </SidebarMenuSubButton>
                    <SidebarMenuSubButton href="/sales-pipeline" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors">
                      <TrendingUp className="h-4 w-4" />
                      <span>Pipeline</span>
                    </SidebarMenuSubButton>
                    <SidebarMenuSubButton href="/sales-analytics" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors">
                      <BarChart className="h-4 w-4" />
                      <span>Analytics</span>
                    </SidebarMenuSubButton>
                    <SidebarMenuSubButton href="/sales-campaigns" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent transition-colors">
                      <Phone className="h-4 w-4" />
                      <span>Campaigns</span>
                    </SidebarMenuSubButton>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="mt-6 mb-2" />
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
              {/* User Info at the bottom */}
              <div className="absolute bottom-0 left-0 w-full p-4 bg-[#f3f4f6] border-t border-gray-200 flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-xs font-semibold">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-muted-foreground">{user?.email}</div>
                </div>
                <Badge className="bg-red-100 text-red-800 border-red-200 font-bold px-2 py-1 rounded">{user?.role}</Badge>
              </div>
            </SidebarContent>
            
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
