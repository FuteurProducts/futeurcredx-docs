// Chart Tooltip Component - Core 2 Design System
// Standardized tooltip styling for Lumiq AI Dashboard charts

import React from 'react';
import { cn } from '@/lib/utils';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: number) => string;
  labelFormatter?: (label: string) => string;
  className?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  formatter = (v) => v.toLocaleString(),
  labelFormatter = (l) => l,
  className,
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        // Core 2 chart-tooltip styling: p-2 bg-b-dark1 rounded-lg text-t-light
        "p-3 bg-shade-02 dark:bg-shade-03 rounded-xl border border-shade-04",
        "shadow-dropdown backdrop-blur-sm",
        "text-shade-10",
        className
      )}
    >
      {label && (
        <p className="text-caption text-shade-07 mb-1">
          {labelFormatter(label)}
        </p>
      )}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-body-2 font-semibold">
            {formatter(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

// Currency formatter tooltip
export const CurrencyTooltip: React.FC<Omit<ChartTooltipProps, 'formatter'>> = (props) => (
  <ChartTooltip
    {...props}
    formatter={(value) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }
  />
);

// Percentage formatter tooltip
export const PercentageTooltip: React.FC<Omit<ChartTooltipProps, 'formatter'>> = (props) => (
  <ChartTooltip
    {...props}
    formatter={(value) => `${value.toFixed(1)}%`}
  />
);

// Standard chart colors using Core 2 design tokens
export const chartColors = {
  primary: 'hsl(var(--primary))',
  success: 'var(--primary-02)',   // #00a656 - green
  error: 'var(--primary-03)',     // #ff381c - red
  purple: 'var(--primary-04)',    // #7f5fff - purple
  warning: 'var(--primary-05)',   // #ff9d34 - orange
  blue: 'var(--primary-01)',      // #2a85ff - blue
  // Chart-specific colors from Core 2
  chartGreen: 'var(--chart-green)',   // #00b512
  chartPurple: 'var(--chart-purple)', // primary-04
  chartYellow: 'var(--chart-yellow)', // primary-05
  chartMin: 'var(--chart-min)',       // shade-08 (light) / shade-04 (dark)
};

export default ChartTooltip;
