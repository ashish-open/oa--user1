
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
  name: string;
  value: number;
}

interface SimpleBarChartProps {
  data: DataPoint[];
  title: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  title,
  subtitle,
  xAxisLabel,
  yAxisLabel,
  color = "#8b5cf6"
}) => {
  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              label={{ 
                value: xAxisLabel, 
                position: 'insideBottom',
                offset: -10
              }} 
            />
            <YAxis 
              label={{ 
                value: yAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }} 
            />
            <Tooltip 
              formatter={(value) => [`${value}`, xAxisLabel || 'Value']}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SimpleBarChart;
