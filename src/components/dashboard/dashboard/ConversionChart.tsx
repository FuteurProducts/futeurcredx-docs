import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendData } from '@/types/dashboard';

interface ConversionChartProps {
  data: TrendData[];
}

export function ConversionChart({ data }: ConversionChartProps) {
  const [view, setView] = useState<'volume' | 'rate'>('volume');

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold">Performance Trends</h3>
          <p className="text-sm text-muted-foreground">Track volume and conversion metrics over time</p>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as 'volume' | 'rate')}>
          <TabsList>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="rate">Rates</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {view === 'volume' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="applications" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Applications"
            />
            <Line 
              type="monotone" 
              dataKey="approved" 
              stroke="hsl(var(--success))" 
              strokeWidth={2}
              name="Approved"
            />
          </LineChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" unit="%" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="conversionRate" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Conversion Rate"
            />
            <Line 
              type="monotone" 
              dataKey="approvalRate" 
              stroke="hsl(var(--success))" 
              strokeWidth={2}
              name="Approval Rate"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}
