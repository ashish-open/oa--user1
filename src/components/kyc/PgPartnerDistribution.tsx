
import React from 'react';
import { DateRange } from 'react-day-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PgPartnerDistributionProps {
  dateRange?: DateRange;
}

export function PgPartnerDistribution({ dateRange }: PgPartnerDistributionProps) {
  // Sample data - in a real app, this would come from an API call
  const pgData = [
    {
      name: 'Stripe',
      pending: 32,
      completed: 124,
      rejected: 18,
    },
    {
      name: 'PayPal',
      pending: 25,
      completed: 98,
      rejected: 12,
    },
    {
      name: 'Adyen',
      pending: 18,
      completed: 76,
      rejected: 8,
    },
  ];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={pgData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pending" stackId="a" name="Pending" fill="#F59E0B" />
          <Bar dataKey="completed" stackId="a" name="Completed" fill="#10B981" />
          <Bar dataKey="rejected" stackId="a" name="Rejected" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        {pgData.map((pg) => (
          <div key={pg.name} className="flex flex-col">
            <span className="text-lg font-medium">{pg.name}</span>
            <span className="text-sm text-muted-foreground">
              Total: {pg.pending + pg.completed + pg.rejected} MID requests
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
