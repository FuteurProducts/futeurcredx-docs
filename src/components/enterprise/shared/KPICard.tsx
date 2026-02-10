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
        'bg-card rounded-2xl border border-border/60 p-5 min-h-[140px] flex flex-col justify-between',
        'shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 active:translate-y-0',
        !onClick && 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]',
        status && STATUS_ACCENT[status],
        status && 'border-l-[3px]',
        status && `ring-1 ${STATUS_RING[status]}`,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <span className="text-muted-foreground/70">{icon}</span>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground tabular-nums tracking-tight">
            {formatValue(animatedValue)}
          </span>
          {subValue && (
            <span className="text-sm text-muted-foreground">{subValue}</span>
          )}
        </div>

        {trend && (
          <div className="flex items-center gap-1.5 mt-2">
            {trend.direction === 'up' && (
              <TrendingUp className={cn('h-3.5 w-3.5', trend.isPositive ? 'text-emerald-500' : 'text-red-500')} />
            )}
            {trend.direction === 'down' && (
              <TrendingDown className={cn('h-3.5 w-3.5', trend.isPositive ? 'text-emerald-500' : 'text-red-500')} />
            )}
            {trend.direction === 'flat' && (
              <Minus className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className={cn(
              'text-xs font-medium',
              trend.direction === 'flat' ? 'text-muted-foreground' : (trend.isPositive ? 'text-emerald-600' : 'text-red-600'),
            )}>
              {trend.value}
            </span>
          </div>
        )}
      </div>
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
