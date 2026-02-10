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
  warning: 'ring-warning/30',
  danger: 'ring-destructive/30',
};

const STATUS_ACCENT: Record<string, string> = {
  ok: 'border-l-emerald-500',
  warning: 'border-l-warning',
  danger: 'border-l-destructive',
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
      {...(onClick && {
        role: 'button',
        tabIndex: 0,
        onClick,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        },
      })}
      className={cn(
        'bg-card rounded-2xl border border-border/60 p-5 h-[160px] flex flex-col',
        'shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 active:translate-y-0',
        onClick && 'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
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
          <span className="text-muted-foreground">{icon}</span>
        )}
      </div>

      <div className="mt-auto">
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
              <TrendingUp className={cn('h-4 w-4', trend.isPositive ? 'text-emerald-500' : 'text-destructive')} />
            )}
            {trend.direction === 'down' && (
              <TrendingDown className={cn('h-4 w-4', trend.isPositive ? 'text-emerald-500' : 'text-destructive')} />
            )}
            {trend.direction === 'flat' && (
              <Minus className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={cn(
              'text-xs font-medium',
              trend.direction === 'flat' ? 'text-muted-foreground' : (trend.isPositive ? 'text-emerald-600' : 'text-destructive'),
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
