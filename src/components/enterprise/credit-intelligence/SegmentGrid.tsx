/**
 * Segment Grid — 8 segment cards with sort, search, view toggle, and export
 */

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpDown,
  Download,
  Grid3X3,
  List,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { SEGMENTS } from '@/data/chaseDemoData';
import type { Segment } from '@/data/chaseDemoData';
import { formatCurrency, formatNumber } from '@/lib/formatters';

import { SegmentCard } from './SegmentCard';

type SortMode = 'opportunity' | 'risk' | 'size' | 'conversion';
type ViewMode = 'grid' | 'list';

interface SegmentGridProps {
  onSegmentSelect: (segmentId: string) => void;
}

function sortSegments(segments: Segment[], mode: SortMode): Segment[] {
  const sorted = [...segments];
  switch (mode) {
    case 'opportunity':
      return sorted.sort((a, b) => b.preQualRate - a.preQualRate);
    case 'risk': {
      const riskScore = (s: Segment) =>
        (s.riskDistribution['HIGH'] ?? 0) + (s.riskDistribution['CRITICAL'] ?? 0);
      return sorted.sort((a, b) => riskScore(b) - riskScore(a));
    }
    case 'size':
      return sorted.sort((a, b) => b.exposure - a.exposure);
    case 'conversion':
      return sorted.sort((a, b) => b.conversionRate - a.conversionRate);
    default:
      return sorted;
  }
}

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'opportunity', label: 'Opportunity' },
  { value: 'risk', label: 'Risk' },
  { value: 'size', label: 'Size' },
  { value: 'conversion', label: 'Conversion' },
];

export function SegmentGrid({ onSegmentSelect }: SegmentGridProps) {
  const [sortMode, setSortMode] = useState<SortMode>('opportunity');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSorted = useMemo(() => {
    let result = SEGMENTS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }
    return sortSegments(result, sortMode);
  }, [sortMode, searchQuery]);

  const handleExport = useCallback(() => {
    toast.success('Segment data exported', {
      description: `${filteredAndSorted.length} segments exported to CSV`,
    });
  }, [filteredAndSorted.length]);

  return (
    <div className="space-y-4">
      {/* Header + Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Industry Segments</h2>
          <p className="text-sm text-muted-foreground">
            {filteredAndSorted.length} of {SEGMENTS.length} segments
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search segments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-card',
                'text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                'w-44',
              )}
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className={cn(
                'appearance-none bg-card border border-border rounded-lg',
                'px-3 py-1.5 pr-8 text-sm text-foreground cursor-pointer',
                'hover:bg-accent transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
              )}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* View Toggle */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 transition-colors',
                viewMode === 'grid'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-accent',
              )}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 transition-colors',
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-accent',
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Export */}
          <button
            onClick={handleExport}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border',
              'bg-card text-sm text-foreground',
              'hover:bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all duration-200',
            )}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Grid / List */}
      {viewMode === 'grid' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {filteredAndSorted.map((segment, i) => (
            <SegmentCard
              key={segment.id}
              segment={segment}
              onView={onSegmentSelect}
              index={i}
            />
          ))}
        </motion.div>
      ) : (
        <div className="space-y-2">
          {/* List Header */}
          <div className="grid grid-cols-12 gap-3 px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-3">Segment</div>
            <div className="col-span-2 text-right">Businesses</div>
            <div className="col-span-2 text-right">Exposure</div>
            <div className="col-span-1 text-right">Score</div>
            <div className="col-span-1 text-right">Pre-Qual</div>
            <div className="col-span-1 text-right">Risk</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>
          {filteredAndSorted.map((segment) => {
            const highRisk =
              ((segment.riskDistribution['HIGH'] ?? 0) +
                (segment.riskDistribution['CRITICAL'] ?? 0)) *
              100;
            return (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  'grid grid-cols-12 gap-3 px-5 py-4 items-center rounded-2xl',
                  'bg-card border border-border/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
                  'hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200',
                )}
              >
                <div className="col-span-3 flex items-center gap-2">
                  <span className="text-lg">{segment.icon}</span>
                  <span className="text-sm font-medium text-foreground">
                    {segment.name}
                  </span>
                </div>
                <div className="col-span-2 text-right text-sm text-foreground">
                  {formatNumber(segment.businessCount)}
                </div>
                <div className="col-span-2 text-right text-sm font-medium text-foreground">
                  {formatCurrency(segment.exposure)}
                </div>
                <div className="col-span-1 text-right text-sm text-foreground">
                  {segment.avgScore}
                </div>
                <div className="col-span-1 text-right text-sm text-foreground">
                  {(segment.preQualRate * 100).toFixed(0)}%
                </div>
                <div className={cn(
                  'col-span-1 text-right text-sm font-medium',
                  highRisk >= 20 ? 'text-rose-600' : highRisk >= 10 ? 'text-amber-600' : 'text-foreground',
                )}>
                  {highRisk.toFixed(0)}%
                </div>
                <div className="col-span-2 flex justify-center gap-2">
                  <button
                    onClick={() => onSegmentSelect(segment.id)}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    View
                  </button>
                  <button
                    onClick={() =>
                      toast.success(`Campaign initiated for ${segment.name}`)
                    }
                    className="text-xs text-muted-foreground hover:underline font-medium"
                  >
                    Campaign
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {filteredAndSorted.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No segments match &ldquo;{searchQuery}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
