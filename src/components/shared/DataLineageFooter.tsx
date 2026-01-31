/**
 * Data Lineage Footer Component
 * Displays data freshness and source information from BFF response metadata
 */

import { Clock, Database, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BffResponse } from '@/services/bff';

type BffResponseMeta = BffResponse<unknown>['meta'];

interface DataLineageFooterProps {
  meta: BffResponseMeta;
  className?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function DataLineageFooter({
  meta,
  className,
  onRefresh,
  isRefreshing,
}: DataLineageFooterProps) {
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getFreshnessColor = (timestamp?: string) => {
    if (!timestamp) return 'text-muted-foreground';
    const date = new Date(timestamp);
    const diffHours = (Date.now() - date.getTime()) / 3600000;

    if (diffHours < 1) return 'text-success';
    if (diffHours < 24) return 'text-yellow-600';
    return 'text-destructive';
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-2 mt-2',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Last Updated */}
        <div className="flex items-center gap-1.5">
          <Clock className={cn('h-3 w-3', getFreshnessColor(meta.lastUpdated))} />
          <span>Updated {formatTimestamp(meta.lastUpdated)}</span>
        </div>

        {/* Data Sources */}
        {meta.dataSources && meta.dataSources.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Database className="h-3 w-3" />
            <span>{meta.dataSources.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className={cn(
            'flex items-center gap-1 hover:text-foreground transition-colors',
            isRefreshing && 'opacity-50 cursor-not-allowed'
          )}
        >
          <RefreshCw className={cn('h-3 w-3', isRefreshing && 'animate-spin')} />
          <span>Refresh</span>
        </button>
      )}
    </div>
  );
}

export default DataLineageFooter;
