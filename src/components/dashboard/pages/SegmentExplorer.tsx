// Segment Explorer — Build custom portfolio segments, save them, and drill into sample businesses
// Chase execs use this to slice their portfolio by industry, geography, risk, product, score, and revenue

import { useCallback, useMemo, useRef, useState } from 'react';

import { motion } from 'framer-motion';
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Bookmark,
  Download,
  Eye,
  Filter,
  Megaphone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  FILTER_OPTIONS,
  PORTFOLIO,
  SAMPLE_BUSINESSES,
  SAVED_SEGMENTS,
  SEGMENTS,
} from '@/data/chaseDemoData';
import type { RiskTier, SampleBusiness, SavedSegment } from '@/data/chaseDemoData';
import { useToast } from '@/hooks/use-toast';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  getRiskBadgeClass,
} from '@/lib/formatters';
import { cn } from '@/lib/utils';

// ── Types ────────────────────────────────────────────────────────

type SortColumn = 'name' | 'revenue' | 'score' | 'risk' | 'status' | 'state';
type SortDirection = 'asc' | 'desc';

interface MatchingResult {
  businesses: number;
  exposure: number;
  preQualRate: number;
}

// ── Risk order for sorting ───────────────────────────────────────

const RISK_ORDER: Record<RiskTier, number> = {
  LOW: 0,
  MODERATE: 1,
  ELEVATED: 2,
  HIGH: 3,
  CRITICAL: 4,
};

// ── Revenue formatting for slider labels ─────────────────────────

function formatRevenueLabel(value: number): string {
  if (value >= 10_000_000) return '$10M+';
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  return `$${(value / 1_000).toFixed(0)}K`;
}

// ── Filter Toggle Chip ───────────────────────────────────────────

interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-[1.02]',
      selected
        ? 'bg-primary text-primary-foreground border-primary'
        : 'bg-muted text-muted-foreground border-border/60',
    )}
  >
    {label}
  </button>
);

// ── Dual Range Slider ────────────────────────────────────────────

interface DualRangeProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatLabel: (v: number) => string;
  step?: number;
}

const DualRange: React.FC<DualRangeProps> = ({
  min,
  max,
  value,
  onChange,
  formatLabel,
  step = 1,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const lowPercent = ((value[0] - min) / (max - min)) * 100;
  const highPercent = ((value[1] - min) / (max - min)) * 100;

  const handleLowChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newLow = Number(e.target.value);
      if (newLow <= value[1]) {
        onChange([newLow, value[1]]);
      }
    },
    [value, onChange],
  );

  const handleHighChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHigh = Number(e.target.value);
      if (newHigh >= value[0]) {
        onChange([value[0], newHigh]);
      }
    },
    [value, onChange],
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatLabel(value[0])}</span>
        <span>{formatLabel(value[1])}</span>
      </div>
      <div className="relative h-5" ref={trackRef}>
        {/* Track background */}
        <div className="absolute top-1/2 -translate-y-1/2 h-2 w-full rounded-full bg-secondary" />
        {/* Active range highlight */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-primary"
          style={{ left: `${lowPercent}%`, width: `${highPercent - lowPercent}%` }}
        />
        {/* Low thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleLowChange}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary
            [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-sm
            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary
            [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:cursor-pointer"
        />
        {/* High thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={handleHighChange}
          className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary
            [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-sm
            [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary
            [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
};

// ── Compute matching businesses from filters ─────────────────────

function computeMatching(
  selectedIndustries: string[],
  selectedRisks: string[],
  selectedStates: string[],
  selectedProducts: string[],
  scoreRange: [number, number],
  revenueRange: [number, number],
): MatchingResult {
  // Start with matching segments based on industry filter
  let matchingSegments = SEGMENTS;
  if (selectedIndustries.length > 0) {
    matchingSegments = SEGMENTS.filter((s) => selectedIndustries.includes(s.name));
  }

  let totalBiz = matchingSegments.reduce((sum, s) => sum + s.businessCount, 0);
  let totalExp = matchingSegments.reduce((sum, s) => sum + s.exposure, 0);
  let avgPreQual =
    matchingSegments.reduce((sum, s) => sum + s.preQualRate * s.businessCount, 0) /
    (totalBiz || 1);

  // Apply risk filter multiplier
  if (selectedRisks.length > 0 && selectedRisks.length < 5) {
    const riskMultiplier = selectedRisks.length / 5;
    totalBiz = Math.round(totalBiz * riskMultiplier);
    totalExp = Math.round(totalExp * riskMultiplier);
  }

  // Apply geography multiplier
  if (selectedStates.length > 0) {
    const geoMultiplier = Math.min(1, selectedStates.length * 0.15);
    totalBiz = Math.round(totalBiz * geoMultiplier);
    totalExp = Math.round(totalExp * geoMultiplier);
  }

  // Apply product multiplier
  if (selectedProducts.length > 0 && selectedProducts.length < 3) {
    const prodMultiplier = 0.35 + selectedProducts.length * 0.25;
    totalBiz = Math.round(totalBiz * prodMultiplier);
    totalExp = Math.round(totalExp * prodMultiplier);
  }

  // Apply score range multiplier
  const scoreSpan = scoreRange[1] - scoreRange[0];
  if (scoreSpan < 100) {
    const scoreMult = scoreSpan / 100;
    totalBiz = Math.round(totalBiz * scoreMult);
    totalExp = Math.round(totalExp * scoreMult);
    // Skew preQual based on score center
    const scoreCenter = (scoreRange[0] + scoreRange[1]) / 2;
    avgPreQual = Math.min(0.95, Math.max(0.15, avgPreQual * (scoreCenter / 50)));
  }

  // Apply revenue range multiplier
  const revMin = FILTER_OPTIONS.revenueRange.min;
  const revMax = FILTER_OPTIONS.revenueRange.max;
  const revSpan = (revenueRange[1] - revenueRange[0]) / (revMax - revMin);
  if (revSpan < 1) {
    totalBiz = Math.round(totalBiz * revSpan);
    totalExp = Math.round(totalExp * revSpan);
  }

  return {
    businesses: Math.max(0, totalBiz),
    exposure: Math.max(0, totalExp),
    preQualRate: Math.min(0.99, Math.max(0, avgPreQual)),
  };
}

// ── Filter sample businesses ─────────────────────────────────────

function filterSampleBusinesses(
  businesses: SampleBusiness[],
  selectedIndustries: string[],
  selectedRisks: string[],
  selectedStates: string[],
  scoreRange: [number, number],
  revenueRange: [number, number],
): SampleBusiness[] {
  return businesses.filter((biz) => {
    // Industry filter: match against segment id
    if (selectedIndustries.length > 0) {
      const segment = SEGMENTS.find((s) => s.id === biz.segment);
      if (!segment || !selectedIndustries.includes(segment.name)) return false;
    }

    // Risk filter
    if (selectedRisks.length > 0 && !selectedRisks.includes(biz.risk)) return false;

    // State filter
    if (selectedStates.length > 0) {
      const stateAbbrevToFull: Record<string, string> = {
        TX: 'Texas',
        CA: 'California',
        FL: 'Florida',
        NY: 'New York',
        IL: 'Illinois',
        OH: 'Ohio',
        WA: 'Washington',
        PA: 'Pennsylvania',
      };
      const fullState = stateAbbrevToFull[biz.state];
      if (!fullState || !selectedStates.includes(fullState)) return false;
    }

    // Score range
    if (biz.score < scoreRange[0] || biz.score > scoreRange[1]) return false;

    // Revenue range
    if (biz.revenue < revenueRange[0] || biz.revenue > revenueRange[1]) return false;

    return true;
  });
}

// ── Sort businesses ──────────────────────────────────────────────

function sortBusinesses(
  businesses: SampleBusiness[],
  column: SortColumn,
  direction: SortDirection,
): SampleBusiness[] {
  const sorted = [...businesses].sort((a, b) => {
    let cmp = 0;
    switch (column) {
      case 'name':
        cmp = a.name.localeCompare(b.name);
        break;
      case 'revenue':
        cmp = a.revenue - b.revenue;
        break;
      case 'score':
        cmp = a.score - b.score;
        break;
      case 'risk':
        cmp = RISK_ORDER[a.risk] - RISK_ORDER[b.risk];
        break;
      case 'status':
        cmp = a.status.localeCompare(b.status);
        break;
      case 'state':
        cmp = a.state.localeCompare(b.state);
        break;
    }
    return direction === 'asc' ? cmp : -cmp;
  });
  return sorted;
}

// ── Main Component ───────────────────────────────────────────────

const SegmentExplorer: React.FC = () => {
  const { toast } = useToast();
  const businessTableRef = useRef<HTMLDivElement>(null);

  // Filter state
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
  const [revenueRange, setRevenueRange] = useState<[number, number]>([
    FILTER_OPTIONS.revenueRange.min,
    FILTER_OPTIONS.revenueRange.max,
  ]);

  // Saved segments (local state seeded from demo data)
  const [savedSegments, setSavedSegments] = useState<SavedSegment[]>([...SAVED_SEGMENTS]);

  // Save dialog state
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [segmentName, setSegmentName] = useState('');

  // Table sort state
  const [sortColumn, setSortColumn] = useState<SortColumn>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Refresh key for shuffling sample businesses
  const [refreshKey, setRefreshKey] = useState(0);

  // ── Computed matching ────────────────────────────────────────

  const hasActiveFilters =
    selectedIndustries.length > 0 ||
    selectedStates.length > 0 ||
    selectedRisks.length > 0 ||
    selectedProducts.length > 0 ||
    scoreRange[0] > 0 ||
    scoreRange[1] < 100 ||
    revenueRange[0] > FILTER_OPTIONS.revenueRange.min ||
    revenueRange[1] < FILTER_OPTIONS.revenueRange.max;

  const matching = useMemo(
    () =>
      hasActiveFilters
        ? computeMatching(
            selectedIndustries,
            selectedRisks,
            selectedStates,
            selectedProducts,
            scoreRange,
            revenueRange,
          )
        : {
            businesses: PORTFOLIO.totalBusinesses,
            exposure: PORTFOLIO.totalExposure,
            preQualRate: PORTFOLIO.preQualRate,
          },
    [
      selectedIndustries,
      selectedRisks,
      selectedStates,
      selectedProducts,
      scoreRange,
      revenueRange,
      hasActiveFilters,
    ],
  );

  const animatedBizCount = useAnimatedNumber(matching.businesses, 600);
  const animatedExposure = useAnimatedNumber(matching.exposure, 600);

  // ── Filtered + sorted sample businesses ──────────────────────

  const filteredBusinesses = useMemo(() => {
    const filtered = filterSampleBusinesses(
      SAMPLE_BUSINESSES,
      selectedIndustries,
      selectedRisks,
      selectedStates,
      scoreRange,
      revenueRange,
    );

    const sorted = sortBusinesses(filtered, sortColumn, sortDirection);

    // Shuffle on refresh (deterministic shuffle using refreshKey)
    if (refreshKey > 0) {
      const shuffled = [...sorted];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (i * (refreshKey + 7)) % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    return sorted;
  }, [
    selectedIndustries,
    selectedRisks,
    selectedStates,
    scoreRange,
    revenueRange,
    sortColumn,
    sortDirection,
    refreshKey,
  ]);

  // ── Toggle helpers ───────────────────────────────────────────

  const toggleFilter = useCallback(
    (
      value: string,
      selected: string[],
      setSelected: React.Dispatch<React.SetStateAction<string[]>>,
    ) => {
      setSelected(
        selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value],
      );
    },
    [],
  );

  // ── Sort handler ─────────────────────────────────────────────

  const handleSort = useCallback(
    (column: SortColumn) => {
      if (sortColumn === column) {
        setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortColumn(column);
        setSortDirection('desc');
      }
    },
    [sortColumn],
  );

  // ── Action handlers ──────────────────────────────────────────

  const handleViewSegment = useCallback(() => {
    businessTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleSaveSegment = useCallback(() => {
    if (!segmentName.trim()) return;

    const newSegment: SavedSegment = {
      id: `saved_${Date.now()}`,
      name: segmentName.trim(),
      businessCount: matching.businesses,
      exposure: matching.exposure,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setSavedSegments((prev) => [newSegment, ...prev]);
    setSegmentName('');
    setShowSaveDialog(false);

    toast({
      title: 'Segment saved',
      description: `"${newSegment.name}" with ${formatNumber(newSegment.businessCount)} businesses saved successfully.`,
    });
  }, [segmentName, matching, toast]);

  const handleStartCampaign = useCallback(() => {
    toast({
      title: 'Campaign Builder',
      description: 'Campaign builder -- coming soon.',
    });
  }, [toast]);

  const handleExportCSV = useCallback(() => {
    toast({
      title: 'Segment exported',
      description: `Segment exported (${formatNumber(matching.businesses)} records).`,
    });
  }, [toast, matching.businesses]);

  const handleLoadSegment = useCallback(
    (segment: SavedSegment) => {
      // Simulate loading segment filters -- in a real app, saved segments would store filter state
      setSelectedIndustries([]);
      setSelectedStates([]);
      setSelectedRisks([]);
      setSelectedProducts([]);
      setScoreRange([0, 100]);
      setRevenueRange([FILTER_OPTIONS.revenueRange.min, FILTER_OPTIONS.revenueRange.max]);

      toast({
        title: 'Segment loaded',
        description: `"${segment.name}" filters applied.`,
      });
    },
    [toast],
  );

  const handleDeleteSegment = useCallback(
    (segmentId: string) => {
      setSavedSegments((prev) => prev.filter((s) => s.id !== segmentId));
      toast({
        title: 'Segment deleted',
        description: 'Saved segment removed.',
      });
    },
    [toast],
  );

  const handleClearFilters = useCallback(() => {
    setSelectedIndustries([]);
    setSelectedStates([]);
    setSelectedRisks([]);
    setSelectedProducts([]);
    setScoreRange([0, 100]);
    setRevenueRange([FILTER_OPTIONS.revenueRange.min, FILTER_OPTIONS.revenueRange.max]);
  }, []);

  const handleRefreshSample = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // ── Build filter summary text ────────────────────────────────

  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (selectedIndustries.length > 0) {
      parts.push(`Industries: ${selectedIndustries.join(', ')}`);
    }
    if (selectedStates.length > 0) {
      parts.push(`States: ${selectedStates.join(', ')}`);
    }
    if (selectedRisks.length > 0) {
      parts.push(`Risk: ${selectedRisks.join(', ')}`);
    }
    if (selectedProducts.length > 0) {
      parts.push(`Products: ${selectedProducts.join(', ')}`);
    }
    if (scoreRange[0] > 0 || scoreRange[1] < 100) {
      parts.push(`Score: ${scoreRange[0]}-${scoreRange[1]}`);
    }
    if (
      revenueRange[0] > FILTER_OPTIONS.revenueRange.min ||
      revenueRange[1] < FILTER_OPTIONS.revenueRange.max
    ) {
      parts.push(
        `Revenue: ${formatRevenueLabel(revenueRange[0])} - ${formatRevenueLabel(revenueRange[1])}`,
      );
    }
    return parts.length > 0 ? parts.join(' | ') : 'No filters applied (full portfolio)';
  }, [selectedIndustries, selectedStates, selectedRisks, selectedProducts, scoreRange, revenueRange]);

  // ── Sort icon helper ─────────────────────────────────────────

  const SortIcon: React.FC<{ column: SortColumn }> = ({ column }) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? (
      <ArrowUpAZ className="inline h-4 w-4 ml-1" />
    ) : (
      <ArrowDownAZ className="inline h-4 w-4 ml-1" />
    );
  };

  // ── Render ───────────────────────────────────────────────────

  return (
    <div className="flex flex-col space-y-8 p-4 lg:p-6">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Segment Explorer</h1>
            <p className="text-sm text-muted-foreground">
              Build custom segments, analyze exposure, and launch targeted campaigns
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Section 1: Segment Builder ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="rounded-2xl border border-border/60 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Segment Builder
            </h2>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              <X className="h-4 w-4" />
              Clear all filters
            </button>
          )}
        </div>

        {/* Row 1: Multi-select filter chips */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Industry */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Industry
            </h4>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.industries.map((industry) => (
                <FilterChip
                  key={industry}
                  label={industry}
                  selected={selectedIndustries.includes(industry)}
                  onClick={() => toggleFilter(industry, selectedIndustries, setSelectedIndustries)}
                />
              ))}
            </div>
          </div>

          {/* Geography */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Geography
            </h4>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.states.map((state) => (
                <FilterChip
                  key={state}
                  label={state}
                  selected={selectedStates.includes(state)}
                  onClick={() => toggleFilter(state, selectedStates, setSelectedStates)}
                />
              ))}
            </div>
          </div>

          {/* Risk Tier */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Risk Tier
            </h4>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.riskTiers.map((risk) => (
                <FilterChip
                  key={risk}
                  label={risk}
                  selected={selectedRisks.includes(risk)}
                  onClick={() => toggleFilter(risk, selectedRisks, setSelectedRisks)}
                />
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Product
            </h4>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.products.map((product) => (
                <FilterChip
                  key={product}
                  label={product}
                  selected={selectedProducts.includes(product)}
                  onClick={() => toggleFilter(product, selectedProducts, setSelectedProducts)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Range sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Score Range
            </h4>
            <DualRange
              min={0}
              max={100}
              value={scoreRange}
              onChange={setScoreRange}
              formatLabel={(v) => String(v)}
              step={1}
            />
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Revenue Range
            </h4>
            <DualRange
              min={FILTER_OPTIONS.revenueRange.min}
              max={FILTER_OPTIONS.revenueRange.max}
              value={revenueRange}
              onChange={setRevenueRange}
              formatLabel={formatRevenueLabel}
              step={50_000}
            />
          </div>
        </div>

        {/* Matching count bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border/60">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Matching Businesses
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
                {formatNumber(animatedBizCount)}
              </span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{formatCurrency(animatedExposure)} exposure</span>
                <span>·</span>
                <span>{formatPercent(matching.preQualRate)} pre-qual rate</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleViewSegment}>
              <Eye className="h-4 w-4" />
              View Segment
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(true)}>
              <Bookmark className="h-4 w-4" />
              Save Segment
            </Button>
            <Button variant="outline" size="sm" onClick={handleStartCampaign}>
              <Megaphone className="h-4 w-4" />
              Start Campaign
            </Button>
            <Button variant="default" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ── Section 2: Saved Segments ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-2xl border border-border/60 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Saved Segments
            </h2>
            <span className="text-xs text-muted-foreground">({savedSegments.length})</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
          >
            <Plus className="h-4 w-4" />
            New Segment
          </Button>
        </div>

        {savedSegments.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No saved segments yet. Use the Segment Builder above to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Businesses
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Exposure
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Created
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {savedSegments.map((segment) => (
                  <tr
                    key={segment.id}
                    className="border-b border-border/50 last:border-0 group hover:bg-muted/50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 font-medium text-foreground">
                      {segment.name}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">
                      {formatNumber(segment.businessCount)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">
                      {formatCurrency(segment.exposure)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(segment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLoadSegment(segment)}
                          className="h-7 px-2.5 text-xs transition-all duration-200"
                        >
                          <Upload className="h-4 w-4" />
                          Load
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSegment(segment.id)}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ── Section 3: Sample Businesses Table ──────────────────── */}
      <motion.div
        ref={businessTableRef}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="rounded-2xl border border-border/60 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Sample Businesses
            </h2>
            <span className="text-xs text-muted-foreground">
              Showing {filteredBusinesses.length} of {SAMPLE_BUSINESSES.length} businesses
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefreshSample}>
            <RefreshCw className="h-4 w-4" />
            Refresh Sample
          </Button>
        </div>

        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No businesses match the current filters. Try broadening your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  {([
                    { key: 'name' as SortColumn, label: 'Business Name', align: 'left' },
                    { key: 'revenue' as SortColumn, label: 'Revenue', align: 'right' },
                    { key: 'score' as SortColumn, label: 'Score', align: 'right' },
                    { key: 'risk' as SortColumn, label: 'Risk', align: 'left' },
                    { key: 'status' as SortColumn, label: 'Status', align: 'left' },
                    { key: 'state' as SortColumn, label: 'State', align: 'left' },
                  ]).map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        'py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors duration-150 select-none',
                        col.align === 'right' ? 'text-right' : 'text-left',
                      )}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      <SortIcon column={col.key} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBusinesses.map((biz) => (
                  <tr
                    key={biz.id}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 font-medium text-foreground">
                      {biz.name}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">
                      {formatCurrency(biz.revenue)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      <span
                        className={cn(
                          'font-semibold',
                          biz.score >= 70
                            ? 'text-emerald-600'
                            : biz.score >= 50
                              ? 'text-amber-600'
                              : 'text-red-600',
                        )}
                      >
                        {biz.score}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold',
                          getRiskBadgeClass(biz.risk),
                        )}
                      >
                        {biz.risk}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{biz.status}</td>
                    <td className="py-3 px-4 text-muted-foreground">{biz.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ── Save Segment Dialog ──────────────────────────────────── */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Segment</DialogTitle>
            <DialogDescription>
              Save the current filter configuration as a named segment for quick access later.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label
                htmlFor="segment-name"
                className="text-sm font-medium text-foreground"
              >
                Segment Name
              </label>
              <Input
                id="segment-name"
                placeholder="e.g., High Value Professional Services"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveSegment();
                }}
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Filter Summary
              </span>
              <div className="text-xs text-muted-foreground bg-muted rounded-lg p-3">
                {filterSummary}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                {formatNumber(matching.businesses)} businesses
              </span>
              <span>{formatCurrency(matching.exposure)} exposure</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSaveDialog(false);
                setSegmentName('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSegment}
              disabled={!segmentName.trim()}
            >
              Save Segment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SegmentExplorer;
