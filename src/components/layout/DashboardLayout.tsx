import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { BarChart, AlertTriangle, Users, LayoutDashboard, ArrowLeftRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            <h2 className="text-xl font-bold">Risk Management Dashboard</h2>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild onClick={() => navigate('/')}>
                      <button className="w-full flex items-center">
                        <LayoutDashboard className="mr-2 h-5 w-5" />
                        <span>Dashboard</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild onClick={() => navigate('/transactions')}>
                      <button className="w-full flex items-center">
                        <ArrowLeftRight className="mr-2 h-5 w-5" />
                        <span>Transactions</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild onClick={() => navigate('/users')}>
                      <button className="w-full flex items-center">
                        <Users className="mr-2 h-5 w-5" />
                        <span>Users</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild onClick={() => navigate('/alerts')}>
                      <button className="w-full flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        <span>Alerts</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild onClick={() => navigate('/tickets')}>
                      <button className="w-full flex items-center">
                        <BarChart className="mr-2 h-5 w-5" />
                        <span>Support Tickets</span>
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
