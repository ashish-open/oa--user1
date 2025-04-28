
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getTransactions, getAlerts, getTickets } from '@/services/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import SimpleBarChart from '@/components/dashboard/SimpleBarChart';
import SimpleLineChart from '@/components/dashboard/SimpleLineChart';
import { Users, Banknote, AlertTriangle, BarChart } from 'lucide-react';
import { Alert, Ticket, Transaction } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard: React.FC = () => {
  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  // Fetch recent transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  // Fetch recent alerts
  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: getAlerts,
  });

  // Fetch recent tickets
  const { data: tickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: getTickets,
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Prepare chart data
  const transactionChartData = transactions 
    ? [
        { name: 'Deposits', value: transactions.filter(t => t.type === 'deposit').length },
        { name: 'Withdrawals', value: transactions.filter(t => t.type === 'withdrawal').length },
        { name: 'Transfers', value: transactions.filter(t => t.type === 'transfer').length },
      ]
    : [];

  const alertChartData = alerts
    ? [
        { name: 'Success', value: alerts.filter(a => a.type === 'success').length },
        { name: 'Info', value: alerts.filter(a => a.type === 'info').length },
        { name: 'Warning', value: alerts.filter(a => a.type === 'warning').length },
        { name: 'Error', value: alerts.filter(a => a.type === 'error').length },
      ]
    : [];

  const ticketsByPriorityData = tickets
    ? [
        { name: 'Low', value: tickets.filter(t => t.priority === 'low').length },
        { name: 'Medium', value: tickets.filter(t => t.priority === 'medium').length },
        { name: 'High', value: tickets.filter(t => t.priority === 'high').length },
        { name: 'Urgent', value: tickets.filter(t => t.priority === 'urgent').length },
      ]
    : [];
  
  // Helper to get transaction status style
  const getStatusStyle = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to get alert type style
  const getAlertTypeStyle = (type: Alert['type']) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to get ticket priority style
  const getTicketPriorityStyle = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatsCard
              title="Total Users"
              value={stats?.totalUsers.toLocaleString() || '0'}
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Total Transactions"
              value={stats?.totalTransactions.toLocaleString() || '0'}
              icon={<Banknote className="h-5 w-5" />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Total Volume"
              value={formatCurrency(stats?.totalAmount || 0)}
              icon={<Banknote className="h-5 w-5" />}
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              title="Active Alerts"
              value={stats?.activeAlerts.toLocaleString() || '0'}
              icon={<AlertTriangle className="h-5 w-5" />}
              trend={{ value: 3, isPositive: false }}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <SimpleBarChart
          title="Transaction Types"
          subtitle="Distribution of transaction types"
          data={transactionChartData}
          xAxisLabel="Type"
          yAxisLabel="Count"
          color="#8b5cf6"
        />
        <SimpleLineChart
          title="Support Tickets by Priority"
          subtitle="Distribution of tickets by priority level"
          data={ticketsByPriorityData}
          xAxisLabel="Priority"
          yAxisLabel="Count"
          color="#ef4444"
        />
      </div>

      {/* Recent Transactions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest transactions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">ID</th>
                      <th scope="col" className="px-6 py-3">Type</th>
                      <th scope="col" className="px-6 py-3">Amount</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions?.slice(0, 5).map((transaction) => (
                      <tr key={transaction.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{transaction.id}</td>
                        <td className="px-6 py-4 capitalize">{transaction.type}</td>
                        <td className="px-6 py-4">{formatCurrency(transaction.amount)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts and Tickets */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest system alerts</CardDescription>
          </CardHeader>
          <CardContent>
            {alertsLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {alerts?.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-start p-3 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getAlertTypeStyle(alert.type)}`}>
                          {alert.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Support Tickets</CardTitle>
            <CardDescription>Latest customer support requests</CardDescription>
          </CardHeader>
          <CardContent>
            {ticketsLoading ? (
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {tickets?.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="flex items-start p-3 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getTicketPriorityStyle(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          <span className="font-medium text-sm">{ticket.subject}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{ticket.requester.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
