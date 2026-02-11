// Chart utilities - Professional styling for fintech dashboards
// Consistent design tokens matching Stripe, Plaid, Mercury standards

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// ============================================
// DESIGN TOKENS FOR CHARTS
// ============================================

export const chartColors = {
  // Primary colors (use HSL variables)
  primary: 'hsl(var(--primary))',
  primaryLight: 'hsl(var(--primary) / 0.1)',

  // Status colors
  success: 'hsl(var(--success))',
  successLight: 'hsl(var(--success) / 0.1)',
  warning: 'hsl(var(--warning))',
  warningLight: 'hsl(var(--warning) / 0.1)',
  destructive: 'hsl(var(--destructive))',
  destructiveLight: 'hsl(var(--destructive) / 0.1)',
  info: 'hsl(var(--info))',
  infoLight: 'hsl(var(--info) / 0.1)',

  // Neutral
  muted: 'hsl(var(--muted-foreground))',
  mutedLight: 'hsl(var(--muted))',
  border: 'hsl(var(--border))',

  // Chart palette (for multi-series)
  chart1: 'hsl(var(--chart-1))',
  chart2: 'hsl(var(--chart-2))',
  chart3: 'hsl(var(--chart-3))',
  chart4: 'hsl(var(--chart-4))',
  chart5: 'hsl(var(--chart-5))',
};

// Grid styling
export const gridConfig = {
  strokeDasharray: '3 3',
  stroke: 'hsl(var(--border))',
  opacity: 0.5,
};

// Axis styling
export const axisConfig = {
  tickLine: false,
  axisLine: false,
  tick: {
    fontSize: 12,
    fontWeight: 500,
    fill: 'hsl(var(--muted-foreground))',
  },
};

// Animation config
export const animationConfig = {
  isAnimationActive: true,
  animationDuration: 1200,
  animationEasing: 'ease-out' as const,
};

// ============================================
// GRADIENT DEFINITIONS
// ============================================

interface GradientDefProps {
  id: string;
  color: string;
  startOpacity?: number;
  endOpacity?: number;
}

export const ChartGradient: React.FC<GradientDefProps> = ({
  id,
  color,
  startOpacity = 0.3,
  endOpacity = 0,
}) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor={color} stopOpacity={startOpacity} />
    <stop offset="95%" stopColor={color} stopOpacity={endOpacity} />
  </linearGradient>
);

// Pre-defined gradients for common use cases
export const ChartGradientDefs: React.FC = () => (
  <defs>
    <ChartGradient id="gradientPrimary" color="hsl(221, 83%, 53%)" startOpacity={0.25} />
    <ChartGradient id="gradientSuccess" color="hsl(160, 84%, 39%)" startOpacity={0.25} />
    <ChartGradient id="gradientWarning" color="hsl(38, 92%, 50%)" startOpacity={0.25} />
    <ChartGradient id="gradientDestructive" color="hsl(0, 84%, 60%)" startOpacity={0.25} />
    <ChartGradient id="gradientInfo" color="hsl(217, 91%, 60%)" startOpacity={0.25} />
    <ChartGradient id="gradientMuted" color="hsl(215, 16%, 47%)" startOpacity={0.15} />
  </defs>
);

// ============================================
// CUSTOM TOOLTIP
// ============================================

interface TooltipPayloadEntry {
  name?: string;
  dataKey?: string;
  value: number;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
  valueFormatter?: (value: number) => string;
  labelFormatter?: (label: string) => string;
  className?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  valueFormatter = (v) => v.toLocaleString(),
  labelFormatter = (l) => l,
  className,
}) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className={cn(
        'bg-popover border border-border rounded-xl p-4 shadow-lg',
        'backdrop-blur-sm',
        className
      )}
    >
      {label && (
        <div className="text-xs text-muted-foreground mb-2 font-medium">
          {labelFormatter(label)}
        </div>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name || entry.dataKey}
              </span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {valueFormatter(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Currency tooltip formatter
export const CurrencyTooltip: React.FC<ChartTooltipProps> = (props) => (
  <ChartTooltip
    {...props}
    valueFormatter={(v) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: v >= 1000000 ? 'compact' : 'standard',
        maximumFractionDigits: v >= 1000000 ? 1 : 0,
      }).format(v)
    }
  />
);

// Percentage tooltip formatter
export const PercentageTooltip: React.FC<ChartTooltipProps> = (props) => (
  <ChartTooltip
    {...props}
    valueFormatter={(v) => `${v.toFixed(1)}%`}
  />
);

// ============================================
// TIME PERIOD SELECTOR
// ============================================

export type TimePeriod = '7D' | '1M' | '3M' | '6M' | '1Y' | 'YTD' | 'ALL';

interface TimePeriodSelectorProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
  periods?: TimePeriod[];
  size?: 'sm' | 'md';
  className?: string;
}

export const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  value,
  onChange,
  periods = ['7D', '1M', '3M', '1Y', 'ALL'],
  size = 'sm',
  className,
}) => {
  return (
    <div className={cn('flex gap-1', className)}>
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onChange(period)}
          className={cn(
            'rounded-lg font-medium transition-all duration-200',
            size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
            value === period
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

// ============================================
// CHART LOADING STATE
// ============================================

interface ChartSkeletonProps {
  height?: number | string;
  className?: string;
  variant?: 'line' | 'bar' | 'area' | 'pie';
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
  height = 240,
  className,
  variant = 'area',
}) => {
  return (
    <div
      className={cn('relative overflow-hidden rounded-xl bg-muted/50', className)}
      style={{ height }}
    >
      {/* Animated shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Skeleton bars/lines */}
      <div className="absolute inset-4 flex items-end justify-around gap-2">
        {variant === 'bar' &&
          Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-full bg-muted rounded-t animate-pulse"
              style={{
                height: `${30 + Math.random() * 50}%`,
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        {(variant === 'line' || variant === 'area') && (
          <svg
            className="w-full h-full opacity-30"
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 Q10,35 20,38 T40,30 T60,35 T80,25 T100,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground animate-pulse"
            />
            {variant === 'area' && (
              <path
                d="M0,40 Q10,35 20,38 T40,30 T60,35 T80,25 T100,30 V50 H0 Z"
                fill="currentColor"
                className="text-muted/50 animate-pulse"
              />
            )}
          </svg>
        )}
        {variant === 'pie' && (
          <div className="absolute inset-8 rounded-full bg-muted animate-pulse" />
        )}
      </div>
    </div>
  );
};

// ============================================
// CHART CONTAINER WITH LOADING STATE
// ============================================

interface ChartContainerProps {
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  height?: number | string;
  children: React.ReactNode;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  isLoading,
  isEmpty,
  emptyMessage = 'No data available',
  height = 240,
  children,
  className,
}) => {
  if (isLoading) {
    return <ChartSkeleton height={height} className={className} />;
  }

  if (isEmpty) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-xl bg-muted/30 text-muted-foreground',
          className
        )}
        style={{ height }}
      >
        <svg
          className="w-12 h-12 mb-3 opacity-40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span className="text-sm font-medium">{emptyMessage}</span>
      </div>
    );
  }

  return <>{children}</>;
};

// ============================================
// CHART LEGEND
// ============================================

interface LegendItem {
  label: string;
  color: string;
  value?: string | number;
  trend?: 'up' | 'down' | 'neutral';
}

interface ChartLegendProps {
  items: LegendItem[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  items,
  orientation = 'horizontal',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex gap-4',
        orientation === 'vertical' ? 'flex-col' : 'flex-wrap items-center justify-center',
        className
      )}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-muted-foreground">{item.label}</span>
          {item.value !== undefined && (
            <span className="text-xs font-semibold text-foreground">{item.value}</span>
          )}
          {item.trend && (
            <svg
              className={cn(
                'w-3 h-3',
                item.trend === 'up' && 'text-success',
                item.trend === 'down' && 'text-destructive rotate-180',
                item.trend === 'neutral' && 'text-muted-foreground'
              )}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7 14l5-5 5 5H7z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================
// STAT CHANGE INDICATOR
// ============================================

interface StatChangeProps {
  value: number;
  suffix?: string;
  className?: string;
}

export const StatChange: React.FC<StatChangeProps> = ({
  value,
  suffix = '%',
  className,
}) => {
  const isPositive = value >= 0;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-sm font-semibold',
        isPositive ? 'text-success' : 'text-destructive',
        className
      )}
    >
      <svg
        className={cn('w-3.5 h-3.5', !isPositive && 'rotate-180')}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 4l8 8h-6v8h-4v-8H4l8-8z" />
      </svg>
      {isPositive ? '+' : ''}
      {value}
      {suffix}
    </span>
  );
};

// ============================================
// CHART HEADER
// ============================================

interface ChartHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({
  title,
  subtitle,
  icon,
  badge,
  action,
  className,
}) => {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            {badge}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
};

// ============================================
// SPARKLINE COMPONENT
// ============================================

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number | string;
  showArea?: boolean;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = 'hsl(var(--primary))',
  height = 32,
  width = '100%',
  showArea = true,
  className,
}) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(' L')}`;
  const areaPath = `${linePath} L100,100 L0,100 Z`;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {showArea && (
        <path
          d={areaPath}
          fill={color}
          fillOpacity={0.1}
        />
      )}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

// ============================================
// HOOK: USE CHART TIME PERIOD
// ============================================

export function useChartTimePeriod(initialPeriod: TimePeriod = '1M') {
  const [period, setPeriod] = useState<TimePeriod>(initialPeriod);

  const getDaysFromPeriod = (p: TimePeriod): number => {
    switch (p) {
      case '7D': return 7;
      case '1M': return 30;
      case '3M': return 90;
      case '6M': return 180;
      case '1Y': return 365;
      case 'YTD': {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
      }
      case 'ALL': return -1; // Represents all data
      default: return 30;
    }
  };

  return {
    period,
    setPeriod,
    days: getDaysFromPeriod(period),
  };
}

// Add shimmer animation to tailwind (add to index.css if not present)
// @keyframes shimmer { to { transform: translateX(100%); } }
