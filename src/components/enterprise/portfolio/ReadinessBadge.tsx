import React from 'react';

import { PRODUCT_READINESS } from '@/constants/bankTerminology';
import { cn } from '@/lib/utils';

import type { ProductReadiness } from '@/constants/bankTerminology';

export interface ReadinessBadgeProps {
  readiness: ProductReadiness;
  className?: string;
}

export const ReadinessBadge: React.FC<ReadinessBadgeProps> = ({ readiness, className }) => {
  const cfg = PRODUCT_READINESS[readiness];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
        cfg.bg,
        className
      )}
    >
      <span className={cfg.color}>{cfg.label}</span>
    </span>
  );
};

export default ReadinessBadge;
