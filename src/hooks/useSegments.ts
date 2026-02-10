import { useCallback, useMemo, useState } from 'react';

import { INDUSTRY_SEGMENTS } from '@/data/portfolioSegments';
import {
  computePortfolioTotals,
  filterSegments,
  sortSegments,
  type SegmentFilters,
} from '@/lib/segmentAggregator';

import type { IndustrySegment } from '@/data/portfolioSegments';
import type { PortfolioTotals } from '@/lib/segmentAggregator';

export type SegmentSortField =
  | 'businessCount'
  | 'totalExposure'
  | 'qualRate'
  | 'avgScore'
  | 'highRiskPct';
export type SortOrder = 'asc' | 'desc';

export interface UseSegmentsReturn {
  segments: IndustrySegment[];
  totals: PortfolioTotals;
  sortBy: SegmentSortField;
  sortOrder: SortOrder;
  filters: SegmentFilters;
  setSortBy: (field: SegmentSortField) => void;
  setSortOrder: (order: SortOrder) => void;
  setFilters: (filters: SegmentFilters) => void;
  resetFilters: () => void;
}

const DEFAULT_SORT_FIELD: SegmentSortField = 'businessCount';
const DEFAULT_SORT_ORDER: SortOrder = 'desc';
const DEFAULT_FILTERS: SegmentFilters = {};

export function useSegments(): UseSegmentsReturn {
  const [sortBy, setSortBy] = useState<SegmentSortField>(DEFAULT_SORT_FIELD);
  const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_SORT_ORDER);
  const [filters, setFilters] = useState<SegmentFilters>(DEFAULT_FILTERS);

  const filteredSegments = useMemo(
    () => filterSegments(INDUSTRY_SEGMENTS, filters),
    [filters]
  );

  const segments = useMemo(
    () => sortSegments(filteredSegments, sortBy, sortOrder),
    [filteredSegments, sortBy, sortOrder]
  );

  const totals = useMemo(
    () => computePortfolioTotals(filteredSegments),
    [filteredSegments]
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    segments,
    totals,
    sortBy,
    sortOrder,
    filters,
    setSortBy,
    setSortOrder,
    setFilters,
    resetFilters,
  };
}
