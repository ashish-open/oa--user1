
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRiskMetrics } from '@/hooks/useRiskMetrics';

interface ServiceUsageDistributionProps {
  className?: string;
}

const ServiceUsageDistribution: React.FC<ServiceUsageDistributionProps> = ({ className }) => {
  const { getServiceUsageData } = useRiskMetrics();
  const data = getServiceUsageData();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Service Usage Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceUsageDistribution;
