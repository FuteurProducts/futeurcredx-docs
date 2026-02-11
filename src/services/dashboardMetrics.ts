/**
 * Dashboard Metrics Service
 * Fetches KPIs and trend data via BFF API with demo data fallback.
 */

import bffClient, { BffResponse } from '@/services/bff/client';
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
 * Fetch latest KPIs from API
 */
async function fetchLiveKPIs(portfolioId: string): Promise<DashboardKPIs> {
  const response = await bffClient.get<BffResponse<DashboardKPIs>>('/analytics/kpis', {
    portfolioId,
  });
  return response.data;
}

/**
 * Fetch trend data from API
 */
async function fetchLiveTrendData(portfolioId: string): Promise<TrendDataPoint[]> {
  const response = await bffClient.get<BffResponse<TrendDataPoint[]>>('/analytics/trends', {
    portfolioId,
  });
  return response.data;
}

/**
 * Public API: Get dashboard KPIs with fallback
 */
export async function getDashboardKPIs(portfolioId: string) {
  return withFallback(
    () => fetchLiveKPIs(portfolioId),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Fallback data converted to expected type
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
