
import React from 'react';
import { DateRange } from 'react-day-picker';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface KycStatusDistributionProps {
  dateRange?: DateRange;
}

export function KycStatusDistribution({ dateRange }: KycStatusDistributionProps) {
  // Sample data - in a real app, this would come from an API call
  const kycData = [
    { name: 'Verified', value: 876, color: '#10B981' },
    { name: 'Pending', value: 245, color: '#F59E0B' },
    { name: 'Rejected', value: 163, color: '#EF4444' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <Pie
              data={kycData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {kycData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            <Tooltip 
              formatter={(value) => [`${value} users`, 'Count']}
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', padding: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {kycData.map((status) => (
          <Card key={status.name} className={`border-l-4`} style={{ borderLeftColor: status.color }}>
            <CardContent className="p-4">
              <div className="text-sm font-medium">{status.name}</div>
              <div className="text-2xl font-bold">{status.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
