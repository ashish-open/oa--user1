
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
  name: string;
  value: number;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  title: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
}

const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  title,
  subtitle,
  xAxisLabel,
  yAxisLabel,
  color = "#3b82f6"
}) => {
  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
              formatter={(value) => [`${value}`, yAxisLabel || 'Value']}
              labelFormatter={(label) => `${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SimpleLineChart;
