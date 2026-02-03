import { Skeleton } from '@/components/dashboard/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * SkeletonCard - Card placeholder with icon, title, and content area
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

// Alias for backward compatibility
export { SkeletonCard as CardSkeleton };

/**
 * SkeletonTable - Table rows placeholder with configurable dimensions
 */
export function SkeletonTable({
  rows = 5,
  cols = 4,
  showHeader = true,
  className = ''
}: {
  rows?: number;
  cols?: number;
  showHeader?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl border border-border bg-card overflow-hidden', className)}>
      {showHeader && (
        <div className="border-b border-border p-4 flex gap-4 bg-muted/50">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      )}
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="border-b border-border last:border-0 p-4 flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, col) => (
            <Skeleton key={col} className={cn('h-4 flex-1', col === 0 && 'max-w-[200px]')} />
          ))}
        </div>
      ))}
    </div>
  );
}

// Alias for backward compatibility
export { SkeletonTable as TableSkeleton };

/**
 * SkeletonChart - Chart area placeholder with title and bar/area visualization
 */
export function SkeletonChart({
  className = '',
  variant = 'bar'
}: {
  className?: string;
  variant?: 'bar' | 'line' | 'area';
}) {
  // Generate deterministic heights based on index for consistency
  const barHeights = [45, 65, 50, 80, 60, 75, 55, 70];

  return (
    <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      {variant === 'bar' ? (
        <div className="flex items-end gap-2 h-[200px]">
          {barHeights.map((height, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-t"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      ) : (
        <div className="h-[200px] relative">
          <Skeleton className="absolute inset-0 rounded-lg" />
        </div>
      )}
    </div>
  );
}

// Alias for backward compatibility
export { SkeletonChart as ChartSkeleton };

/**
 * SkeletonText - Text line placeholders with configurable lines
 */
export function SkeletonText({
  lines = 3,
  className = ''
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

/**
 * MetricSkeleton - Single metric/KPI card placeholder
 */
export function MetricSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
      <Skeleton className="h-2 w-full mt-4 rounded" />
    </div>
  );
}

/**
 * SkeletonKPIRow - Row of KPI metric cards
 */
export function SkeletonKPIRow({
  count = 4,
  className = ''
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-4', className)} style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
      {Array.from({ length: count }).map((_, i) => (
        <MetricSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * SkeletonList - List items placeholder
 */
export function SkeletonList({
  items = 5,
  showAvatar = false,
  className = ''
}: {
  items?: number;
  showAvatar?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          {showAvatar && <Skeleton className="w-10 h-10 rounded-full shrink-0" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="w-16 h-6 rounded shrink-0" />
        </div>
      ))}
    </div>
  );
}

/**
 * SkeletonPanel - Full panel placeholder for dashboard sections
 */
export function SkeletonPanel({
  className = '',
  showHeader = true,
  contentRows = 4
}: {
  className?: string;
  showHeader?: boolean;
  contentRows?: number;
}) {
  return (
    <div className={cn('rounded-xl border border-border bg-card', className)}>
      {showHeader && (
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      )}
      <div className="p-6">
        <SkeletonList items={contentRows} showAvatar />
      </div>
    </div>
  );
}

/**
 * CustomerTableSkeleton - Specific skeleton for customer listing tables
 */
export function CustomerTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4 flex gap-4 bg-muted/30">
        <Skeleton className="w-4 h-4 rounded shrink-0" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-border last:border-0 p-4 flex gap-4 items-center">
          <Skeleton className="w-4 h-4 rounded shrink-0" />
          <div className="flex items-center gap-3 w-40">
            <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      ))}
    </div>
  );
}

/**
 * ApplicationTableSkeleton - Specific skeleton for applications/pipeline tables
 */
export function ApplicationTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4 flex gap-4 bg-muted/30">
        <Skeleton className="w-4 h-4 rounded shrink-0" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-border last:border-0 p-4 flex gap-4 items-center">
          <Skeleton className="w-4 h-4 rounded shrink-0" />
          <div className="w-32">
            <div className="flex items-center gap-2">
              <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          <div className="w-24">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-3 w-16 mt-1" />
          </div>
          <Skeleton className="h-6 w-20 rounded" />
          <Skeleton className="h-6 w-20 rounded" />
          <div className="w-24 flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      ))}
    </div>
  );
}

/**
 * RiskDashboardSkeleton - Full risk dashboard skeleton with KPIs and charts
 */
export function RiskDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Global Controls */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
        <div className="flex-1" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        <SkeletonChart className="h-[350px]" />
        <SkeletonPanel className="h-[350px]" contentRows={5} />
      </div>

      {/* Queue Section */}
      <SkeletonPanel className="h-[400px]" contentRows={6} />
    </div>
  );
}
