import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { DemoMetaBadge } from '@/components/shared/DemoMetaBadge';

export type PolicyCheckResult = 'pass' | 'review' | 'fail';

export interface PolicyCheck {
  id: string;
  name: string;
  result: PolicyCheckResult;
  value: string;
  threshold: string;
  source: string;
  detail?: string;
}

export interface PolicyChecksPanelProps {
  checks: PolicyCheck[];
  className?: string;
}

const resultConfig: Record<
  PolicyCheckResult,
  { icon: React.ElementType; label: string; className: string }
> = {
  pass: {
    icon: CheckCircle,
    label: 'Pass',
    className: 'text-green-600 bg-green-500/10 border-green-500/20',
  },
  review: {
    icon: AlertTriangle,
    label: 'Review',
    className: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
  },
  fail: {
    icon: XCircle,
    label: 'Fail',
    className: 'text-red-600 bg-red-500/10 border-red-500/20',
  },
};

export function PolicyChecksPanel({ checks, className }: PolicyChecksPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const passCount = checks.filter((c) => c.result === 'pass').length;
  const reviewCount = checks.filter((c) => c.result === 'review').length;
  const failCount = checks.filter((c) => c.result === 'fail').length;

  const toggleRow = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={cn('bg-card rounded-xl border border-border', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Policy & Eligibility Checks
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {passCount} of {checks.length} passed
              {reviewCount > 0 && `, ${reviewCount} review`}
              {failCount > 0 && `, ${failCount} failed`}
            </p>
          </div>
        </div>
        <DemoMetaBadge />
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[minmax(0,2fr)_100px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 px-5 py-4 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <span>Check Name</span>
        <span>Result</span>
        <span>Value</span>
        <span>Threshold</span>
        <span>Source</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {checks.map((check) => {
          const isExpanded = expandedId === check.id;
          const config = resultConfig[check.result];
          const ResultIcon = config.icon;

          return (
            <div key={check.id}>
              <button
                type="button"
                onClick={() => toggleRow(check.id)}
                className={cn(
                  'w-full grid grid-cols-[minmax(0,2fr)_100px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 px-5 py-4 text-left text-sm transition-colors',
                  'hover:bg-muted/50',
                  isExpanded && 'bg-muted/30'
                )}
              >
                {/* Check Name */}
                <span className="flex items-center gap-2 text-foreground font-medium">
                  {check.detail ? (
                    isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    )
                  ) : (
                    <span className="w-3.5 shrink-0" />
                  )}
                  <span className="truncate">{check.name}</span>
                </span>

                {/* Result Badge */}
                <span className="flex items-center">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
                      config.className
                    )}
                  >
                    <ResultIcon className="h-3.5 w-3.5" />
                    {config.label}
                  </span>
                </span>

                {/* Value */}
                <span className="text-foreground truncate flex items-center">
                  {check.value}
                </span>

                {/* Threshold */}
                <span className="text-muted-foreground truncate flex items-center">
                  {check.threshold}
                </span>

                {/* Source */}
                <span className="text-muted-foreground truncate flex items-center">
                  {check.source}
                </span>
              </button>

              {/* Expanded Detail */}
              {isExpanded && check.detail && (
                <div className="px-5 pb-3">
                  <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground ml-5">
                    {check.detail}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PolicyChecksPanel;
