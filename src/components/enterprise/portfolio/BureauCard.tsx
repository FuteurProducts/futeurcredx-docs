import React from 'react';
import { Clock, ExternalLink } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { BureauIndicator } from '@/data/creditSignalsData';

export interface BureauCardProps {
  indicator: BureauIndicator;
  className?: string;
}

export const BureauCard: React.FC<BureauCardProps> = ({ indicator, className }) => (
  <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
    <div className="flex items-start justify-between mb-1">
      <span className="text-sm font-semibold text-foreground">{indicator.name}</span>
      <ExternalLink className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="text-xs text-muted-foreground mb-2">{indicator.provider}</div>
    <div className="text-lg font-bold text-foreground mb-1">{indicator.value}</div>
    <p className="text-xs text-muted-foreground leading-relaxed">{indicator.interpretation}</p>
    <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
      <Clock className="h-2.5 w-2.5" />
      <span>As of {new Date(indicator.asOfDate).toLocaleDateString()}</span>
    </div>
  </div>
);

export default BureauCard;
