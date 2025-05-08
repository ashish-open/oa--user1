
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, UserCheck, BarChart, CheckCircle, Eye } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      navigate('/users'); // Changed to redirect to Centralized User Hub
    } catch (error) {
      console.error('Login error:', error);
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  // Demo account logins
  const demoAccounts = [
    { role: 'superAdmin', email: 'demo@example.com', password: 'password', icon: <ShieldCheck className="h-5 w-5" />, color: 'bg-red-100 text-red-800' },
    { role: 'admin', email: 'admin@example.com', password: 'password', icon: <UserCheck className="h-5 w-5" />, color: 'bg-blue-100 text-blue-800' },
    { role: 'riskAnalyst', email: 'risk@example.com', password: 'password', icon: <BarChart className="h-5 w-5" />, color: 'bg-yellow-100 text-yellow-800' },
    { role: 'kycAgent', email: 'kyc@example.com', password: 'password', icon: <CheckCircle className="h-5 w-5" />, color: 'bg-green-100 text-green-800' },
    { role: 'viewer', email: 'viewer@example.com', password: 'password', icon: <Eye className="h-5 w-5" />, color: 'bg-purple-100 text-purple-800' }
  ];

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Alert Ticket Vision</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <div className="w-full">
              <p className="text-sm text-center text-gray-500 mb-2">Demo Accounts</p>
              <Tabs defaultValue="superAdmin" className="w-full">
                <TabsList className="grid grid-cols-5 w-full">
                  {demoAccounts.map(account => (
                    <TabsTrigger key={account.role} value={account.role}>
                      {account.icon}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {demoAccounts.map(account => (
                  <TabsContent key={account.role} value={account.role}>
                    <div className={`p-3 rounded-md ${account.color} mb-2`}>
                      <div className="flex items-center gap-2 mb-1">
                        {account.icon}
                        <p className="font-medium capitalize">{account.role}</p>
                      </div>
                      <p className="text-xs">{account.email}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleDemoLogin(account.email, account.password)}
                    >
                      Use this account
                    </Button>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
