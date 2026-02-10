import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortfolioKPI {
  id: string;
  label: string;
  value: number | string;
  format: 'number' | 'currency' | 'percent' | 'score';
  trend?: { direction: 'up' | 'down' | 'stable'; value: number; label: string };
  status?: 'positive' | 'neutral' | 'warning' | 'critical';
  tooltip?: string;
  dataSource?: string;
}

interface PortfolioKPIRowProps {
  kpis: PortfolioKPI[];
  className?: string;
}

const formatValue = (value: number | string, format: string): string => {
  if (typeof value === 'string') return value;

  switch (format) {
    case 'currency':
      if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
      if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
      return `$${value.toFixed(0)}`;
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'score':
      return value.toFixed(1);
    case 'number':
      return value.toLocaleString();
    default:
      return String(value);
  }
};

const getStatusColor = (status?: string): string => {
  switch (status) {
    case 'positive':
      return 'text-emerald-600';
    case 'warning':
      return 'text-amber-600';
    case 'critical':
      return 'text-red-600';
    case 'neutral':
    default:
      return 'text-muted-foreground';
  }
};

const getTrendIcon = (direction: string) => {
  switch (direction) {
    case 'up':
      return TrendingUp;
    case 'down':
      return TrendingDown;
    case 'stable':
    default:
      return Minus;
  }
};

export function PortfolioKPIRow({ kpis, className }: PortfolioKPIRowProps) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4', className)}>
      {kpis.map((kpi, index) => {
        const TrendIcon = kpi.trend ? getTrendIcon(kpi.trend.direction) : null;
        const statusColor = getStatusColor(kpi.status);

        return (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                {kpi.label}
              </span>
              {kpi.tooltip && (
                <Info className="h-3 w-3 text-muted-foreground/50" />
              )}
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-foreground">
                {formatValue(kpi.value, kpi.format)}
              </span>
              {kpi.status && (
                <div className={cn('h-2 w-2 rounded-full', statusColor.replace('text-', 'bg-'))} />
              )}
            </div>

            {kpi.trend && TrendIcon && (
              <div className={cn('flex items-center gap-1 text-xs', statusColor)}>
                <TrendIcon className="h-3 w-3" />
                <span>{kpi.trend.value.toFixed(1)}%</span>
                <span className="text-muted-foreground ml-1">{kpi.trend.label}</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
