import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MetricSectionProps {
  title: string;
  description?: string;
  icon: LucideIcon;
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
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
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
  const colorClasses = {
    blue: 'border-blue-100/50 bg-blue-50/30',
    green: 'border-green-100/50 bg-green-50/30',
    purple: 'border-purple-100/50 bg-purple-50/30',
    orange: 'border-orange-100/50 bg-orange-50/30',
    red: 'border-red-100/50 bg-red-50/30',
  };

  const iconColorClasses = {
    blue: 'bg-blue-100/80 text-blue-600',
    green: 'bg-green-100/80 text-green-600',
    purple: 'bg-purple-100/80 text-purple-600',
    orange: 'bg-orange-100/80 text-orange-600',
    red: 'bg-red-100/80 text-red-600',
  };

  return (
    <Card className={`p-4 ${colorClasses[colorScheme]} border backdrop-blur-sm`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {Icon && (
            <div className={`p-1.5 rounded-md ${iconColorClasses[colorScheme]}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
