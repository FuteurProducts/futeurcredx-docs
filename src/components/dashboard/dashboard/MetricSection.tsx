import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MetricSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  delay?: number;
  children: React.ReactNode;
}

export function MetricSection({ title, description, icon: Icon, delay = 0, children }: MetricSectionProps) {
  return (
    <div
      className="space-y-4 animate-fade-in"
      style={{ animationDelay: `${delay * 1000}ms` }}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2.5 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    </div>
  );
}

interface CompactMetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: LucideIcon;
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export function CompactMetricCard({
  label,
  value,
  trend,
  icon: Icon,
  colorScheme = 'blue'
}: CompactMetricCardProps) {
  // Vibrant color schemes with left border accent
  const colorConfig = {
    blue: {
      border: 'border-l-4 border-l-primary',
      bg: 'bg-gradient-to-r from-primary/5 to-transparent',
      icon: 'bg-primary text-white shadow-lg shadow-primary/30',
    },
    green: {
      border: 'border-l-4 border-l-success',
      bg: 'bg-gradient-to-r from-success/5 to-transparent',
      icon: 'bg-success text-white shadow-lg shadow-success/30',
    },
    purple: {
      border: 'border-l-4 border-l-accent',
      bg: 'bg-gradient-to-r from-accent/5 to-transparent',
      icon: 'bg-accent text-white shadow-lg shadow-accent/30',
    },
    orange: {
      border: 'border-l-4 border-l-warning',
      bg: 'bg-gradient-to-r from-warning/5 to-transparent',
      icon: 'bg-warning text-white shadow-lg shadow-warning/30',
    },
    red: {
      border: 'border-l-4 border-l-destructive',
      bg: 'bg-gradient-to-r from-destructive/5 to-transparent',
      icon: 'bg-destructive text-white shadow-lg shadow-destructive/30',
    },
  }[colorScheme];

  return (
    <Card className={`p-4 ${colorConfig.border} ${colorConfig.bg} backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
          {Icon && (
            <div className={`p-2 rounded-lg ${colorConfig.icon}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.isPositive ? 'text-success bg-success/10' : 'text-destructive bg-destructive/10'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

