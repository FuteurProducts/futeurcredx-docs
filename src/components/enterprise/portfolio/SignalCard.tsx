import React from 'react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

import { DemoMetaBadge } from '@/components/shared/DemoMetaBadge';
import { SIGNAL_DIRECTIONS, SIGNAL_STATUSES } from '@/constants/bankTerminology';
import { cn } from '@/lib/utils';

import type { SignalDirection, SignalStatus } from '@/constants/bankTerminology';
import type { CreditSignal } from '@/data/creditSignalsData';

export interface DirectionIconProps {
  direction: SignalDirection;
  className?: string;
}

export const DirectionIcon: React.FC<DirectionIconProps> = ({ direction, className }) => {
  const cfg = SIGNAL_DIRECTIONS[direction];
  if (direction === 'improving')
    return <TrendingUp className={cn('h-4 w-4', cfg.color, className)} />;
  if (direction === 'worsening')
    return <TrendingDown className={cn('h-4 w-4', cfg.color, className)} />;
  return <Minus className={cn('h-4 w-4', cfg.color, className)} />;
};

export interface StatusBadgeProps {
  status: SignalStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const cfg = SIGNAL_STATUSES[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        cfg.bg
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      <span className={cfg.color}>{cfg.label}</span>
    </span>
  );
};

export interface SignalCardProps {
  signal: CreditSignal;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  const statusCfg = SIGNAL_STATUSES[signal.status];
  return (
    <div className={cn('rounded-xl border p-4 transition-all hover:shadow-sm', statusCfg.bg)}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-semibold', statusCfg.color)}>{signal.name}</span>
          <span className="text-[10px] text-muted-foreground bg-background/60 px-1.5 py-0.5 rounded">
            {signal.category}
          </span>
        </div>
        <DemoMetaBadge lastUpdated={signal.lastUpdated} dataSources={[signal.source]} />
      </div>
      <div className="flex items-center gap-3 mb-2">
        <StatusBadge status={signal.status} />
        <div className="flex items-center gap-1">
          <DirectionIcon direction={signal.direction} />
          <span className={cn('text-xs font-medium', SIGNAL_DIRECTIONS[signal.direction].color)}>
            {SIGNAL_DIRECTIONS[signal.direction].label}
          </span>
        </div>
      </div>
      <p className="text-xs text-foreground leading-relaxed">{signal.detail}</p>
      <div className="mt-2 text-[10px] text-muted-foreground">Source: {signal.source}</div>
    </div>
  );
};

export default SignalCard;
