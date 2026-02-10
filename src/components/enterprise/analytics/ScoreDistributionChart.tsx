// Score Distribution Histogram - Portfolio score breakdown
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Info, Download } from 'lucide-react';
import type { ScoreBucket } from './types';
import { TimePeriodSelector, ChartContainer, type TimePeriod } from '@/components/ui/chart-utils';

interface ScoreDistributionChartProps {
  data: ScoreBucket[];
  title?: string;
  isLoading?: boolean;
}

// Use design system colors via HSL variables
const bucketColors: Record<string, string> = {
  '0-50': 'hsl(var(--destructive))',
  '51-65': 'hsl(var(--warning))',
  '66-75': 'hsl(var(--warning))',
  '76-85': 'hsl(var(--success))',
  '86-100': 'hsl(var(--info))',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ScoreBucket;
    return (
      <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg shadow-black/5">
        <div className="font-semibold text-foreground mb-2">Risk Indicator Range: {data.range}</div>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Count:</span>
            <span className="font-semibold text-foreground">{data.count.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">% of Portfolio:</span>
            <span className="font-semibold text-foreground">{data.percent.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Exposure:</span>
            <span className="font-semibold text-foreground">${(data.exposure / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({
  data,
  title = 'Risk Indicator Distribution',
  isLoading = false,
}) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('1M');
  const totalCount = data.reduce((sum, b) => sum + b.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <div className="relative group">
            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Distribution of risk indicators across portfolio
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {totalCount.toLocaleString()} businesses
          </span>
          <TimePeriodSelector
            value={timePeriod}
            onChange={setTimePeriod}
            periods={['7D', '1M', '3M']}
          />
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Download className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <ChartContainer isLoading={isLoading} height={256}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
                vertical={false}
              />
              <XAxis
                dataKey="range"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Bar
                dataKey="percent"
                radius={[6, 6, 0, 0]}
                maxBarSize={80}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {data.map((entry) => (
                  <Cell key={entry.range} fill={bucketColors[entry.range] || 'hsl(var(--muted-foreground))'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-border">
        {data.map((bucket) => (
          <div key={bucket.range} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: bucketColors[bucket.range] }}
            />
            <span className="text-xs text-muted-foreground">{bucket.range}</span>
            <span className="text-xs font-semibold text-foreground">{bucket.percent}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ScoreDistributionChart;
