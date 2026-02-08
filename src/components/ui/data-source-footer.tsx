/**
 * DataSourceFooter — Consistent "Last refreshed / Data source" attribution
 *
 * Drop this into every dashboard tab to satisfy bank audit requirement
 * for transparent data provenance.
 */

import React from 'react';
import { Clock, Database, RefreshCw } from 'lucide-react';

interface DataSourceFooterProps {
  /** Human-readable data source name, e.g. "BFF · /dashboard/analytics" */
  source: string;
  /** ISO timestamp of last data refresh (auto-formatted to relative time) */
  lastRefreshed?: string | Date | null;
  /** Optional callback when user clicks the refresh icon */
  onRefresh?: () => void;
  /** Extra className for the wrapper */
  className?: string;
}

function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return date.toLocaleDateString();
}

export const DataSourceFooter: React.FC<DataSourceFooterProps> = ({
  source,
  lastRefreshed,
  onRefresh,
  className = '',
}) => {
  const refreshDate = lastRefreshed
    ? lastRefreshed instanceof Date
      ? lastRefreshed
      : new Date(lastRefreshed)
    : null;

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground border-t border-border pt-3 mt-4 ${className}`}>
      <span className="inline-flex items-center gap-1">
        <Database className="h-3 w-3" />
        {source}
      </span>
      {refreshDate && (
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Last refreshed: {formatRelative(refreshDate)}
        </span>
      )}
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          aria-label="Refresh data"
        >
          <RefreshCw className="h-3 w-3" />
          Refresh
        </button>
      )}
    </div>
  );
};

export default DataSourceFooter;
