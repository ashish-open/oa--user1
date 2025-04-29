
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
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Avg. Verifications Per Day</div>
            <div className="text-2xl font-bold">{averageVerificationCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Avg. Verification Time</div>
            <div className="text-2xl font-bold">{averageVerificationTime} minutes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Avg. Rejection Rate</div>
            <div className="text-2xl font-bold">{averageRejectionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={performanceData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => formatDate(date)}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={true}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              yAxisId="left"
              orientation="left"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 'dataMax + 2']}
            />
            <Tooltip 
              labelFormatter={(date) => formatDate(date)}
              formatter={(value, name) => {
                if (name === 'avgVerificationTime') return [`${value} min`, 'Avg. Time'];
                if (name === 'rejectionRate') return [`${value}%`, 'Rejection Rate'];
                return [value, name === 'verificationCount' ? 'Verifications' : name];
              }}
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                padding: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="circle"
            />
            <Line 
              type="monotone" 
              dataKey="verificationCount" 
              name="Verifications" 
              stroke="#3B82F6" 
              strokeWidth={2} 
              activeDot={{ r: 8 }}
              yAxisId="left" 
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="avgVerificationTime" 
              name="Avg. Verification Time" 
              stroke="#10B981" 
              strokeWidth={2}
              yAxisId="right"
              dot={{ r: 4 }} 
            />
            <Line 
              type="monotone" 
              dataKey="rejectionRate" 
              name="Rejection Rate" 
              stroke="#EF4444" 
              strokeWidth={2}
              yAxisId="right"
              dot={{ r: 4 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
