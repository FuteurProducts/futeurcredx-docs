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
          <div className="p-2 bg-black/5 rounded-lg">
            <Icon className="w-5 h-5 text-black" />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-black">{title}</h2>
          {description && <p className="text-sm text-slate-600">{description}</p>}
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
  icon: Icon
}: CompactMetricCardProps) {
  // All color schemes now use black/gray
  const colorClasses = 'border-slate-200 bg-slate-50';
  const iconColorClasses = 'bg-black/5 text-black';

  return (
    <Card className={`p-4 ${colorClasses} border backdrop-blur-sm`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          {Icon && (
            <div className={`p-1.5 rounded-md ${iconColorClasses}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold text-black">{value}</p>
          {trend && (
            <span className={`text-xs font-medium ${trend.isPositive ? 'text-slate-700' : 'text-slate-500'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

