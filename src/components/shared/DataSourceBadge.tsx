/**
 * DataSourceBadge -- pill badge indicating whether the dashboard is
 * showing sandbox (demo/simulated) data or live (production) data.
 *
 * Usage:
 *   <DataSourceBadge />              // defaults to "sandbox"
 *   <DataSourceBadge mode="live" />
 *
 * Backward-compatible: the legacy `source` prop ('live' | 'fallback' | 'demo')
 * is still accepted and mapped internally to the new `mode` value.
 */

import React, { useState } from 'react';

export type DataSourceMode = 'sandbox' | 'live';

interface DataSourceBadgeProps {
  /** Primary prop -- selects the badge variant. Defaults to 'sandbox'. */
  mode?: DataSourceMode;
  /**
   * @deprecated Use `mode` instead.
   * Legacy prop kept for backward compatibility with existing callsites.
   * 'live' maps to mode="live"; everything else maps to mode="sandbox".
   */
  source?: 'live' | 'fallback' | 'demo';
  className?: string;
}

const TOOLTIP_TEXT: Record<DataSourceMode, string> = {
  sandbox: 'Sandbox: Viewing simulated portfolio data',
  live: 'Live: Connected to production data',
};

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({
  mode,
  source,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Resolve effective mode: explicit `mode` wins, then map legacy `source`.
  const resolved: DataSourceMode =
    mode ?? (source === 'live' ? 'live' : 'sandbox');

  const isLive = resolved === 'live';

  return (
    <span
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium select-none ${
        isLive
          ? 'bg-emerald-50 text-emerald-600'
          : 'bg-primary/10 text-primary'
      } ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Dot indicator */}
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isLive ? 'bg-emerald-500 animate-pulse' : 'bg-primary'
        }`}
      />
      {isLive ? 'Live' : 'Sandbox'}

      {/* Tooltip */}
      {showTooltip && (
        <span
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 whitespace-nowrap rounded-lg bg-[#1A1D1F] px-3 py-1.5 text-xs font-medium text-white shadow-lg pointer-events-none"
        >
          {TOOLTIP_TEXT[resolved]}
          {/* Tooltip arrow */}
          <span className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rotate-45 bg-[#1A1D1F]" />
        </span>
      )}
    </span>
  );
};
