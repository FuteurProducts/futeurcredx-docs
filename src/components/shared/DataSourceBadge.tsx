/**
 * DataSourceBadge -- pill badge indicating the dashboard's operating mode.
 *
 * Usage:
 *   <DataSourceBadge />                  // auto-detects from EnvironmentContext
 *   <DataSourceBadge mode="demo" />      // explicit override
 *   <DataSourceBadge mode="live" />
 *
 * Backward-compatible: the legacy `source` prop ('live' | 'fallback' | 'demo')
 * is still accepted and mapped internally to the new `mode` value.
 */

import React, { useState } from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';

export type DataSourceMode = 'demo' | 'sandbox' | 'live';

interface DataSourceBadgeProps {
  /** Primary prop -- selects the badge variant. Auto-detected if omitted. */
  mode?: DataSourceMode;
  /**
   * @deprecated Use `mode` instead.
   * Legacy prop kept for backward compatibility with existing callsites.
   * 'live' maps to mode="live"; everything else maps to mode="sandbox".
   */
  source?: 'live' | 'fallback' | 'demo';
  className?: string;
}

const BADGE_CONFIG: Record<DataSourceMode, { label: string; tooltip: string; dotClass: string; bgClass: string }> = {
  demo: {
    label: 'Demo',
    tooltip: 'Demo: Viewing sample bank data — no live API calls',
    dotClass: 'bg-blue-500',
    bgClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  sandbox: {
    label: 'Sandbox',
    tooltip: 'Sandbox: Connected to test API — calls are not billed',
    dotClass: 'bg-amber-500',
    bgClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  live: {
    label: 'Live',
    tooltip: 'Live: Connected to production — real data, billed usage',
    dotClass: 'bg-emerald-500 animate-pulse',
    bgClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
};

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({
  mode,
  source,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { currentEnvironment } = useEnvironment();

  // Resolve effective mode: explicit prop > legacy source > auto-detect from context
  let resolved: DataSourceMode;
  if (mode) {
    resolved = mode;
  } else if (source) {
    resolved = source === 'live' ? 'live' : 'sandbox';
  } else {
    // Auto-detect from environment context
    switch (currentEnvironment) {
      case 'demo': resolved = 'demo'; break;
      case 'sandbox': resolved = 'sandbox'; break;
      case 'production': resolved = 'live'; break;
      default: resolved = 'sandbox';
    }
  }

  const config = BADGE_CONFIG[resolved];

  return (
    <span
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium select-none ${config.bgClass} ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Dot indicator */}
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {config.label}

      {/* Tooltip */}
      {showTooltip && (
        <span
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 whitespace-nowrap rounded-lg bg-[var(--shade-03)] px-3 py-1.5 text-xs font-medium text-white shadow-lg pointer-events-none"
        >
          {config.tooltip}
          {/* Tooltip arrow */}
          <span className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rotate-45 bg-[var(--shade-03)]" />
        </span>
      )}
    </span>
  );
};
