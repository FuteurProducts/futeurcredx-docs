/**
 * Dashboard Metrics Service
 * Queries risk_aggregates table to produce PILOT_METRICS-compatible shape.
 * Uses direct Supabase client (read-only aggregation, no edge function needed).
 */

import { supabase } from '@/integrations/supabase/client';
import { PILOT_METRICS, CONVERSION_TREND_DATA, API_TREND_DATA } from '@/data/demoData';
import { withFallback } from '@/utils/withFallback';

export interface DashboardKPIs {
  totalBusinesses: number;
  scoredBusinesses: number;
  scoreCoverage: number;
  preQualifiedBusinesses: number;
  preQualRate: number;
  applicationsStarted: number;
  applicationConversion: number;
  approved: number;
  approvalRate: number;
  funded: number;
  fundingRate: number;
  ineligible: number;
  avgLumiqScore: number;
  delinquencyRate: number;
  totalApiCalls: number;
  dailyAvgCalls: number;
  avgRevenuePerBusiness: number;
  projectedAnnualRevenue: number;
  momGrowth: number;
  avgTimeToApproval: number;
}

export interface TrendDataPoint {
  month: string;
  applications: number;
  approved: number;
  conversionRate: number;
  approvalRate: number;
}

export interface ApiTrendDataPoint {
  month: string;
  calls: number;
  latency: number;
  successRate: number;
}

/**
 * Fetch latest KPIs from risk_aggregates table
 */
async function fetchLiveKPIs(portfolioId: string): Promise<DashboardKPIs> {
  // Get the latest aggregate date
  const { data: latestRow, error: latestErr } = await supabase
    .from('risk_aggregates')
    .select('aggregate_date')
    .eq('portfolio_id', portfolioId)
    .order('aggregate_date', { ascending: false })
    .limit(1)
    .single();

  if (latestErr || !latestRow) throw new Error('No aggregates found');

  const latestDate = latestRow.aggregate_date;

  // Fetch all metric types for the latest date
  const { data, error } = await supabase
    .from('risk_aggregates')
    .select('metric_type, count, sum_value, avg_value')
    .eq('portfolio_id', portfolioId)
    .eq('aggregate_date', latestDate);

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('No data for latest date');

  // Build a lookup by metric_type
  const metrics: Record<string, { count?: number; sum_value?: number; avg_value?: number }> = {};
  for (const row of data) {
    metrics[row.metric_type] = {
      count: row.count ?? undefined,
      sum_value: row.sum_value ? Number(row.sum_value) : undefined,
      avg_value: row.avg_value ? Number(row.avg_value) : undefined,
    };
  }

  const totalBusinesses = metrics.total_businesses?.count ?? 0;
  const scoredBusinesses = metrics.scored_businesses?.count ?? 0;
  const prequalified = metrics.prequalified?.count ?? 0;
  const appsStarted = metrics.applications_started?.count ?? 0;
  const approved = metrics.approved?.count ?? 0;
  const funded = metrics.funded?.count ?? 0;
  const avgScore = metrics.avg_score?.avg_value ?? 0;
  const delinquencyRate = metrics.delinquency_rate?.avg_value ?? 0;
  const apiCalls = metrics.api_calls?.count ?? 0;

  return {
    totalBusinesses,
    scoredBusinesses,
    scoreCoverage: totalBusinesses > 0 ? (scoredBusinesses / totalBusinesses) * 100 : 0,
    preQualifiedBusinesses: prequalified,
    preQualRate: scoredBusinesses > 0 ? (prequalified / scoredBusinesses) * 100 : 0,
    applicationsStarted: appsStarted,
    applicationConversion: prequalified > 0 ? (appsStarted / prequalified) * 100 : 0,
    approved,
    approvalRate: appsStarted > 0 ? (approved / appsStarted) * 100 : 0,
    funded,
    fundingRate: approved > 0 ? (funded / approved) * 100 : 0,
    ineligible: totalBusinesses - scoredBusinesses,
    avgLumiqScore: avgScore,
    delinquencyRate,
    totalApiCalls: apiCalls * 122, // Scale daily to total
    dailyAvgCalls: apiCalls,
    avgRevenuePerBusiness: PILOT_METRICS.avgRevenuePerBusiness,
    projectedAnnualRevenue: approved * PILOT_METRICS.avgRevenuePerBusiness,
    momGrowth: PILOT_METRICS.momGrowth,
    avgTimeToApproval: PILOT_METRICS.avgTimeToApproval,
  };
}

/**
 * Fetch trend data from risk_aggregates for chart rendering
 */
async function fetchLiveTrendData(portfolioId: string): Promise<TrendDataPoint[]> {
  // Get monthly aggregates by sampling first of each month
  const months = ['2025-10-01', '2025-11-01', '2025-12-01', '2026-01-01'];
  const monthLabels = ['Oct', 'Nov', 'Dec', 'Jan'];
  const result: TrendDataPoint[] = [];

  for (let i = 0; i < months.length; i++) {
    const { data, error } = await supabase
      .from('risk_aggregates')
      .select('metric_type, count, avg_value')
      .eq('portfolio_id', portfolioId)
      .eq('aggregate_date', months[i])
      .in('metric_type', ['applications_started', 'approved', 'conversion_funnel']);

    if (error || !data) continue;

    const metricsMap: Record<string, number> = {};
    for (const row of data) {
      metricsMap[row.metric_type] = row.count ?? Number(row.avg_value) ?? 0;
    }

    result.push({
      month: monthLabels[i],
      applications: metricsMap.applications_started || 0,
      approved: metricsMap.approved || 0,
      conversionRate: metricsMap.conversion_funnel || 0,
      approvalRate: metricsMap.approved && metricsMap.applications_started
        ? (metricsMap.approved / metricsMap.applications_started) * 100
        : 0,
    });
  }

  return result;
}

/**
 * Public API: Get dashboard KPIs with fallback
 */
export async function getDashboardKPIs(portfolioId: string) {
  return withFallback(
    () => fetchLiveKPIs(portfolioId),
    PILOT_METRICS as unknown as DashboardKPIs,
    'Dashboard KPIs'
  );
}

/**
 * Public API: Get conversion trend data with fallback
 */
export async function getConversionTrend(portfolioId: string) {
  return withFallback(
    () => fetchLiveTrendData(portfolioId),
    CONVERSION_TREND_DATA as TrendDataPoint[],
    'Conversion Trend'
  );
}

/**
 * Public API: Get API trend data (static for now — would need api_usage_logs aggregation)
 */
export async function getApiTrendData(_portfolioId: string) {
  return withFallback(
    async () => API_TREND_DATA as ApiTrendDataPoint[],
    API_TREND_DATA as ApiTrendDataPoint[],
    'API Trend Data'
  );
}
