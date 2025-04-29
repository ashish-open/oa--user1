
import React from 'react';
import { DateRange } from 'react-day-picker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/utils/formatters';

interface KycPerformanceMetricsProps {
  dateRange?: DateRange;
}

export function KycPerformanceMetrics({ dateRange }: KycPerformanceMetricsProps) {
  // Sample data - in a real app, this would come from an API call
  const performanceData = [
    {
      date: '2025-04-01',
      verificationCount: 45,
      avgVerificationTime: 12,
      rejectionRate: 8,
    },
    {
      date: '2025-04-02',
      verificationCount: 52,
      avgVerificationTime: 10,
      rejectionRate: 7,
    },
    {
      date: '2025-04-03',
      verificationCount: 48,
      avgVerificationTime: 11,
      rejectionRate: 9,
    },
    {
      date: '2025-04-04',
      verificationCount: 62,
      avgVerificationTime: 9,
      rejectionRate: 6,
    },
    {
      date: '2025-04-05',
      verificationCount: 40,
      avgVerificationTime: 13,
      rejectionRate: 10,
    },
    {
      date: '2025-04-06',
      verificationCount: 35,
      avgVerificationTime: 14,
      rejectionRate: 12,
    },
    {
      date: '2025-04-07',
      verificationCount: 58,
      avgVerificationTime: 8,
      rejectionRate: 7,
    },
  ];

  // Summary metrics
  const averageVerificationCount = Math.round(
    performanceData.reduce((sum, item) => sum + item.verificationCount, 0) / performanceData.length
  );
  const averageVerificationTime = Math.round(
    performanceData.reduce((sum, item) => sum + item.avgVerificationTime, 0) / performanceData.length
  );
  const averageRejectionRate = Math.round(
    performanceData.reduce((sum, item) => sum + item.rejectionRate, 0) / performanceData.length
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Avg. Verifications Per Day</div>
            <div className="text-2xl font-bold">{averageVerificationCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Avg. Verification Time</div>
            <div className="text-2xl font-bold">{averageVerificationTime} minutes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Avg. Rejection Rate</div>
            <div className="text-2xl font-bold">{averageRejectionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => formatDate(date)}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(date) => formatDate(date)}
              formatter={(value, name) => {
                if (name === 'avgVerificationTime') return [`${value} min`, 'Avg. Time'];
                if (name === 'rejectionRate') return [`${value}%`, 'Rejection Rate'];
                return [value, name === 'verificationCount' ? 'Verifications' : name];
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="verificationCount" 
              name="Verifications" 
              stroke="#3B82F6" 
              strokeWidth={2} 
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="avgVerificationTime" 
              name="Avg. Verification Time" 
              stroke="#10B981" 
              strokeWidth={2} 
            />
            <Line 
              type="monotone" 
              dataKey="rejectionRate" 
              name="Rejection Rate" 
              stroke="#EF4444" 
              strokeWidth={2} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
