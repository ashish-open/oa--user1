
import React from 'react';
import { DateRange } from 'react-day-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface OnboardingMetricsProps {
  period: 'daily' | 'monthly';
  dateRange?: DateRange;
}

export function OnboardingMetrics({ period, dateRange }: OnboardingMetricsProps) {
  // Sample data - in a real app, this would come from an API call
  const dailyData = [
    { date: '2025-04-22', onboardings: 42 },
    { date: '2025-04-23', onboardings: 48 },
    { date: '2025-04-24', onboardings: 35 },
    { date: '2025-04-25', onboardings: 52 },
    { date: '2025-04-26', onboardings: 30 },
    { date: '2025-04-27', onboardings: 25 },
    { date: '2025-04-28', onboardings: 45 },
    { date: '2025-04-29', onboardings: 50 }
  ];

  const monthlyData = [
    { date: '2024-11', onboardings: 850, name: 'Nov' },
    { date: '2024-12', onboardings: 920, name: 'Dec' },
    { date: '2025-01', onboardings: 780, name: 'Jan' },
    { date: '2025-02', onboardings: 880, name: 'Feb' },
    { date: '2025-03', onboardings: 940, name: 'Mar' },
    { date: '2025-04', onboardings: 1284, name: 'Apr' }
  ];

  const data = period === 'daily' ? dailyData : monthlyData;

  const handleExport = () => {
    // In a real app, this would trigger a CSV/Excel export
    console.log(`Exporting ${period} onboarding data`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey={period === 'daily' ? 'date' : 'name'} 
              tickFormatter={period === 'daily' ? ((date) => formatDate(date)) : undefined}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={true}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              labelFormatter={(value) => period === 'daily' ? formatDate(value) : value}
              formatter={(value) => [`${value} users`, 'Onboardings']}
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                padding: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar 
              dataKey="onboardings" 
              name="New Onboardings" 
              fill="#4F46E5" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
