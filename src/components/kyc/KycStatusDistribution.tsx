
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
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={kycData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {kycData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
          <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-4">
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
