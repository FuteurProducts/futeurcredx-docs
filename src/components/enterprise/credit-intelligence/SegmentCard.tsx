/**
 * Segment Card — individual card within the Segment Grid
 * Shows icon, name, counts, pre-qual bar, score, risk %, status badge, action buttons
 */

import { motion } from 'framer-motion';
import { Eye, Megaphone } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  getStatusBadgeClass,
} from '@/lib/formatters';
import type { Segment, SegmentStatus } from '@/data/chaseDemoData';

interface SegmentCardProps {
  segment: Segment;
  onView: (segmentId: string) => void;
  index: number;
}

const SEGMENT_ICONS: Record<string, string> = {
  seg_retail: '\uD83C\uDFEA',
  seg_professional: '\uD83D\uDC54',
  seg_construction: '\uD83C\uDFD7\uFE0F',
  seg_healthcare: '\uD83C\uDFE5',
  seg_manufacturing: '\uD83C\uDFED',
  seg_food_service: '\uD83C\uDF7D\uFE0F',
  seg_transportation: '\uD83D\uDE9B',
  seg_technology: '\uD83D\uDCBB',
};

function getStatusLabel(status: SegmentStatus): string {
  const labels: Record<SegmentStatus, string> = {
    top_performer: 'Top Performer',
    performing: 'Performing',
    below_benchmark: 'Below Benchmark',
    at_risk: 'At Risk',
  };
  return labels[status];
}

function getPreQualColor(rate: number): string {
  if (rate >= 0.7) return 'bg-emerald-500';
  if (rate >= 0.5) return 'bg-amber-500';
  return 'bg-red-500';
}

function getPreQualTrackColor(rate: number): string {
  if (rate >= 0.7) return 'bg-emerald-100';
  if (rate >= 0.5) return 'bg-amber-100';
  return 'bg-red-100';
}

function computeHighRiskPercent(
  riskDist: Record<string, number>,
): number {
  const high = riskDist['HIGH'] ?? 0;
  const critical = riskDist['CRITICAL'] ?? 0;
  return (high + critical) * 100;
}

export function SegmentCard({ segment, onView, index }: SegmentCardProps) {
  const highRiskPct = computeHighRiskPercent(segment.riskDistribution);
  const icon = SEGMENT_ICONS[segment.id] ?? segment.icon;

  const handleCampaign = () => {
    toast.success(
      `Campaign initiated for ${segment.name}`,
      { description: `${formatNumber(segment.businessCount)} businesses targeted` },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      role="button"
      tabIndex={0}
      onClick={() => onView(segment.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onView(segment.id);
        }
      }}
      className={cn(
        'bg-card rounded-2xl border border-border/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5',
        'hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200',
        'flex flex-col justify-between min-h-[200px] cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
      )}
    >
      {/* Header: Icon + Name + Status Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl" role="img" aria-label={segment.name}>
            {icon}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-foreground leading-tight">
              {segment.name}
            </h3>
            <span className="text-xs text-muted-foreground">
              {formatNumber(segment.businessCount)} businesses
            </span>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border',
            getStatusBadgeClass(segment.status),
          )}
        >
          {getStatusLabel(segment.status)}
        </span>
      </div>

      {/* Exposure */}
      <div className="text-xs text-muted-foreground mb-2">
        Exposure:{' '}
        <span className="font-semibold text-foreground">
          {formatCurrency(segment.exposure)}
        </span>
      </div>

      {/* Pre-Qual Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Pre-Qual</span>
          <span className="text-xs font-semibold text-foreground">
            {formatPercent(segment.preQualRate, 0)}
          </span>
        </div>
        <div className={cn('h-2 rounded-full overflow-hidden', getPreQualTrackColor(segment.preQualRate))}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${segment.preQualRate * 100}%` }}
            transition={{ duration: 0.2, ease: 'easeOut', delay: index * 0.04 }}
            className={cn('h-full rounded-full', getPreQualColor(segment.preQualRate))}
          />
        </div>
      </div>

      {/* Score + Risk % Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-muted-foreground">
          Score:{' '}
          <span className="font-semibold text-foreground">{segment.avgScore}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          High+Critical:{' '}
          <span className={cn(
            'font-semibold',
            highRiskPct >= 20 ? 'text-rose-600' : highRiskPct >= 10 ? 'text-amber-600' : 'text-foreground',
          )}>
            {highRiskPct.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onView(segment.id)}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg',
            'bg-primary/10 text-primary text-xs font-medium',
            'hover:bg-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200',
          )}
        >
          <Eye className="h-4 w-4" />
          View
        </button>
        <button
          onClick={handleCampaign}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg',
            'bg-muted text-muted-foreground text-xs font-medium',
            'hover:bg-muted/80 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200',
          )}
        >
          <Megaphone className="h-4 w-4" />
          Campaign
        </button>
      </div>
    </motion.div>
  );
}
