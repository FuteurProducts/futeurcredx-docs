import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface KPICardProps {
  label: string;
  value: number;
  /** Formats the animated number for display. Receives the current animated integer. */
  formatValue: (v: number) => string;
  trend?: {
    direction: 'up' | 'down' | 'flat';
    value: string;
    /** Whether the direction is positive (green) or negative (red). Up isn't always good. */
    isPositive: boolean;
  };
  onClick?: () => void;
  tooltip?: string;
  status?: 'ok' | 'warning' | 'danger';
  icon?: ReactNode;
  /** Sub-text shown below the value (e.g. "13%") */
  subValue?: string;
  /** Animation duration in ms */
  animationDuration?: number;
}

const STATUS_RING: Record<string, string> = {
  ok: 'ring-emerald-400/30',
  warning: 'ring-amber-400/30',
  danger: 'ring-red-400/30',
};

const STATUS_ACCENT: Record<string, string> = {
  ok: 'border-l-emerald-500',
  warning: 'border-l-amber-500',
  danger: 'border-l-red-500',
};

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  formatValue,
  trend,
  onClick,
  tooltip,
  status,
  icon,
  subValue,
  animationDuration = 800,
}) => {
  const animatedValue = useAnimatedNumber(value, animationDuration);

  const card = (
    <div
      onClick={onClick}
      className={cn(
        'bg-card rounded-xl border border-border p-4 transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
        status && STATUS_ACCENT[status],
        status && 'border-l-2',
        status && `ring-1 ${STATUS_RING[status]}`,
      )}
    >
      <div className="flex items-start justify-between mb-1">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        {icon && (
          <span className="text-muted-foreground">{icon}</span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-foreground tabular-nums">
          {formatValue(animatedValue)}
        </span>
        {subValue && (
          <span className="text-sm text-muted-foreground">{subValue}</span>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-1 mt-1.5">
          {trend.direction === 'up' && (
            <TrendingUp className={cn('h-3 w-3', trend.isPositive ? 'text-emerald-500' : 'text-red-500')} />
          )}
          {trend.direction === 'down' && (
            <TrendingDown className={cn('h-3 w-3', trend.isPositive ? 'text-emerald-500' : 'text-red-500')} />
          )}
          {trend.direction === 'flat' && (
            <Minus className="h-3 w-3 text-muted-foreground" />
          )}
          <span className={cn(
            'text-[11px]',
            trend.direction === 'flat' ? 'text-muted-foreground' : (trend.isPositive ? 'text-emerald-600' : 'text-red-600'),
          )}>
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );

  if (tooltip) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>{card}</TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return card;
};
