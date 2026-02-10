import type { IndustrySegment } from '@/data/portfolioSegments';

export interface AggregatedGroup {
  name: string;
  businessCount: number;
  totalExposure: number;
  avgScore: number;
  qualRate: number;
  highRiskPct: number;
  segmentCount: number;
}

export interface SegmentFilters {
  minBusinessCount?: number;
  maxBusinessCount?: number;
  minScore?: number;
  maxScore?: number;
  minQualRate?: number;
  maxQualRate?: number;
  regions?: string[];
  riskTiers?: string[];
}

export interface PortfolioTotals {
  totalBusinesses: number;
  totalExposure: number;
  weightedAvgScore: number;
  overallQualRate: number;
  overallHighRiskPct: number;
}

/**
 * Group segments by a dimension and compute per-group metrics
 */
export function aggregateByDimension(
  segments: IndustrySegment[],
  dimension: 'region' | 'riskTier' | 'product'
): AggregatedGroup[] {
  const groups = new Map<string, IndustrySegment[]>();

  for (const segment of segments) {
    let keys: string[] = [];

    if (dimension === 'region') {
      keys = Object.keys(segment.region);
    } else if (dimension === 'riskTier') {
      keys = Object.keys(segment.riskDistribution);
    } else if (dimension === 'product') {
      keys = segment.topProducts.map((p) => p.name);
    }

    for (const key of keys) {
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(segment);
    }
  }

  return Array.from(groups.entries()).map(([name, groupSegments]) =>
    computeGroupMetrics(name, groupSegments)
  );
}

/**
 * Compute metrics for a group of segments
 */
function computeGroupMetrics(
  name: string,
  segments: IndustrySegment[]
): AggregatedGroup {
  const totalBusinesses = segments.reduce(
    (sum, s) => sum + s.businessCount,
    0
  );
  const totalExposure = segments.reduce((sum, s) => sum + s.totalExposure, 0);

  const weightedScore = segments.reduce(
    (sum, s) => sum + s.avgScore * s.businessCount,
    0
  );
  const avgScore = totalBusinesses > 0 ? weightedScore / totalBusinesses : 0;

  const weightedQualRate = segments.reduce(
    (sum, s) => sum + s.qualRate * s.businessCount,
    0
  );
  const qualRate = totalBusinesses > 0 ? weightedQualRate / totalBusinesses : 0;

  const weightedHighRiskPct = segments.reduce(
    (sum, s) => sum + s.highRiskPct * s.businessCount,
    0
  );
  const highRiskPct =
    totalBusinesses > 0 ? weightedHighRiskPct / totalBusinesses : 0;

  return {
    name,
    businessCount: totalBusinesses,
    totalExposure,
    avgScore,
    qualRate,
    highRiskPct,
    segmentCount: segments.length,
  };
}

/**
 * Sort segments by a metric
 */
export function sortSegments(
  segments: IndustrySegment[],
  sortBy: 'businessCount' | 'totalExposure' | 'qualRate' | 'avgScore' | 'highRiskPct',
  order: 'asc' | 'desc'
): IndustrySegment[] {
  const sorted = [...segments].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    return order === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return sorted;
}

/**
 * Filter segments by criteria
 */
export function filterSegments(
  segments: IndustrySegment[],
  filters: SegmentFilters
): IndustrySegment[] {
  return segments.filter((segment) => {
    if (
      filters.minBusinessCount !== undefined &&
      segment.businessCount < filters.minBusinessCount
    ) {
      return false;
    }
    if (
      filters.maxBusinessCount !== undefined &&
      segment.businessCount > filters.maxBusinessCount
    ) {
      return false;
    }
    if (filters.minScore !== undefined && segment.avgScore < filters.minScore) {
      return false;
    }
    if (filters.maxScore !== undefined && segment.avgScore > filters.maxScore) {
      return false;
    }
    if (
      filters.minQualRate !== undefined &&
      segment.qualRate < filters.minQualRate
    ) {
      return false;
    }
    if (
      filters.maxQualRate !== undefined &&
      segment.qualRate > filters.maxQualRate
    ) {
      return false;
    }
    if (
      filters.regions &&
      filters.regions.length > 0 &&
      !filters.regions.some((region) => segment.region[region] !== undefined)
    ) {
      return false;
    }
    if (
      filters.riskTiers &&
      filters.riskTiers.length > 0 &&
      !filters.riskTiers.some(
        (tier) => segment.riskDistribution[tier] !== undefined
      )
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Compute portfolio-level totals from segments
 */
export function computePortfolioTotals(
  segments: IndustrySegment[]
): PortfolioTotals {
  const totalBusinesses = segments.reduce(
    (sum, s) => sum + s.businessCount,
    0
  );
  const totalExposure = segments.reduce((sum, s) => sum + s.totalExposure, 0);

  const weightedScore = segments.reduce(
    (sum, s) => sum + s.avgScore * s.businessCount,
    0
  );
  const weightedAvgScore =
    totalBusinesses > 0 ? weightedScore / totalBusinesses : 0;

  const weightedQualRate = segments.reduce(
    (sum, s) => sum + s.qualRate * s.businessCount,
    0
  );
  const overallQualRate =
    totalBusinesses > 0 ? weightedQualRate / totalBusinesses : 0;

  const weightedHighRiskPct = segments.reduce(
    (sum, s) => sum + s.highRiskPct * s.businessCount,
    0
  );
  const overallHighRiskPct =
    totalBusinesses > 0 ? weightedHighRiskPct / totalBusinesses : 0;

  return {
    totalBusinesses,
    totalExposure,
    weightedAvgScore,
    overallQualRate,
    overallHighRiskPct,
  };
}

/**
 * Create memoized version of any aggregation function
 */
export function memoizeAggregation<T extends (...args: unknown[]) => unknown>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
}
