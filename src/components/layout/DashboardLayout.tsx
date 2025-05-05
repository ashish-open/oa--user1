import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { BarChart, AlertTriangle, Users, LayoutDashboard, ArrowLeftRight, Search, Shield, Ticket, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, implement search functionality
    console.log('Searching for:', searchQuery);
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
            {/* KYC Team Section (Moved to Top) */}
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

            {/* Risk Operations Section (Moved Below KYC Team) */}
            <SidebarGroup>
              <SidebarGroupLabel>Risk Operations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild onClick={() => navigate('/')}>
                      <button className="w-full flex items-center">
                        <LayoutDashboard className="mr-2 h-5 w-5" />
                        <span>Risk Dashboard</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild onClick={() => navigate('/users')}>
                      <button className="w-full flex items-center">
                        <Users className="mr-2 h-5 w-5" />
                        <span>User Investigation</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild onClick={() => navigate('/transactions')}>
                      <button className="w-full flex items-center">
                        <ArrowLeftRight className="mr-2 h-5 w-5" />
                        <span>Transaction Analysis</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild onClick={() => navigate('/alerts')}>
                      <button className="w-full flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        <span>Risk Alerts</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild onClick={() => navigate('/tickets')}>
                      <button className="w-full flex items-center">
                        <Ticket className="mr-2 h-5 w-5" />
                        <span>Support Tickets</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Admin Tools Section (Unchanged Position) */}
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
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4">
  {user && (
    <div className="flex flex-col space-y-2">
      <div className="text-sm text-gray-500">
        Signed in as <span className="font-semibold">{user.email}</span>
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
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="bg-transparent">Quick Actions</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[400px] gap-3 p-4">
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Export Reports</div>
                            <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Generate and download risk reports
                            </div>
                          </NavigationMenuLink>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Configure Alerts</div>
                            <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Set up custom alert thresholds
                            </div>
                          </NavigationMenuLink>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">User Access</div>
                            <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Manage admin access permissions
                            </div>
                          </NavigationMenuLink>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                
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