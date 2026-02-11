/**
 * Citi Data Loader
 *
 * Maps the Citi demo-data JSON (450K businesses, $98.4B exposure) into the
 * existing PILOT_METRICS and DemoBusinessEntity[] shapes so the dashboard
 * displays real Citi-scale numbers without touching any downstream code.
 */

import citiData from './citi.json';
import type { DemoBusinessEntity } from './fallback/demoData';

// ─── Type for the Citi JSON structure ──────────────────────────────────────

interface CitiBusiness {
  id: string;
  name: string;
  revenue: number;
  score: number;
  risk: string;
  status: string;
  segment: string;
  state: string;
  city: string;
}

interface CitiPortfolioSummary {
  total_businesses: number;
  total_exposure: number;
  pre_qual_rate: number;
  avg_composite_score: number;
  avg_composite_score_prev_month: number;
  at_risk_exposure: number;
  at_risk_percent: number;
  offer_potential: number;
  quarterly_growth: number;
  bureau_hit_rate: number;
  avg_score_refresh_days: number;
  overall_default_rate: number;
  avg_credit_limit: number;
  avg_utilization: number;
}

interface CitiJSON {
  portfolio_summary: CitiPortfolioSummary;
  sample_businesses: CitiBusiness[];
}

const citi = citiData as unknown as CitiJSON;
const ps = citi.portfolio_summary;

// ─── Derived values ─────────────────────────────────────────────────────────

const scoredBusinesses = Math.round(ps.total_businesses * 0.824);
const applicationsStarted = Math.round(ps.total_businesses * ps.pre_qual_rate * 0.095);
const approved = Math.round(applicationsStarted * 0.78);
const funded = Math.round(approved * 0.92);
const ineligible = Math.round(ps.total_businesses * 0.176);

// Scale API metrics proportionally from pilot (47,500 → 450,000)
const scaleFactor = ps.total_businesses / 47500;
const totalApiCalls = Math.round(3_247_000 * scaleFactor);
const dailyAvgCalls = Math.round(totalApiCalls / 92);
const errorCount = Math.round(1948 * scaleFactor);

const projectedAnnualRevenue = Math.round(approved * 4450);

// ─── PILOT_METRICS (Citi-scale) ────────────────────────────────────────────

export const CITI_PILOT_METRICS = {
  // Business coverage
  totalBusinesses: ps.total_businesses,
  scoredBusinesses,
  scoreCoverage: 82.4,

  // Pre-qualification funnel
  preQualifiedBusinesses: Math.round(ps.total_businesses * ps.pre_qual_rate),
  preQualRate: ps.pre_qual_rate,
  applicationsStarted,
  applicationConversion: 26.5,
  approved,
  approvalRate: 78.0,
  funded,
  fundingRate: 92.0,
  ineligible,

  // Score distribution
  avgLumiqScore: ps.avg_composite_score,
  medianLumiqScore: 71,

  // API performance
  totalApiCalls,
  dailyAvgCalls,
  successRate: 99.92,
  avgLatencyMs: 138,
  p99LatencyMs: 365,
  errorCount,

  // Financial impact
  avgPreQualLimit: ps.avg_credit_limit,
  projectedOriginations: Math.round(ps.total_businesses * ps.pre_qual_rate * ps.avg_credit_limit * 0.28),
  avgRevenuePerBusiness: 4450,
  projectedAnnualRevenue,

  // Risk metrics
  delinquencyRate: ps.overall_default_rate,
  defaultRate: ps.overall_default_rate,
  portfolioUtilization: ps.avg_utilization,

  // Growth metrics
  momGrowth: 0.092,
  qoqGrowth: 13.2,
  avgTimeToApproval: 2.1,
};

// ─── DEMO_BUSINESSES (first 10 Citi sample businesses) ─────────────────────

function deriveRiskTier(score: number): 'low' | 'medium' | 'high' {
  if (score >= 75) return 'low';
  if (score >= 65) return 'medium';
  return 'high';
}

function deriveScoreTrend(score: number): 'up' | 'down' | 'stable' {
  if (score >= 78) return 'up';
  if (score < 67) return 'down';
  return 'stable';
}

function deriveTrendValue(score: number): number {
  if (score >= 78) return Math.round((score - 75) * 0.8);
  if (score < 67) return Math.round((67 - score) * 0.6);
  return 1;
}

function deriveSegment(revenue: number): 'micro' | 'small' | 'mid-market' {
  if (revenue >= 5_000_000) return 'mid-market';
  if (revenue >= 2_000_000) return 'small';
  return 'micro';
}

function mapIndustryName(segment: string): string {
  const industryMap: Record<string, string> = {
    seg_tech: 'Technology',
    seg_professional: 'Professional Services',
    seg_healthcare: 'Healthcare & Life Sciences',
    seg_retail: 'Retail & E-Commerce',
    seg_manufacturing: 'Manufacturing & Distribution',
    seg_real_estate: 'Real Estate & Property Services',
    seg_food_service: 'Food Service & Hospitality',
    seg_other: 'Other Industries',
  };
  return industryMap[segment] || 'Other';
}

export const CITI_DEMO_BUSINESSES: DemoBusinessEntity[] = citi.sample_businesses
  .slice(0, 10)
  .map((biz: CitiBusiness) => {
    const riskTier = deriveRiskTier(biz.score);
    return {
      id: biz.id.replace('_', '-'),
      name: biz.name,
      legalName: biz.name,
      industry: mapIndustryName(biz.segment),
      naicsCode: '000000',
      city: biz.city,
      state: biz.state,
      annualRevenue: biz.revenue,
      employeeCount: Math.round(biz.revenue / 300000),
      yearsInBusiness: Math.round(5 + Math.random() * 10),
      lumiqScore: Math.round(biz.score),
      ownerFico: Math.round(640 + biz.score * 1.5),
      riskTier,
      scoreTrend: deriveScoreTrend(biz.score),
      trendValue: deriveTrendValue(biz.score),
      segment: deriveSegment(biz.revenue),
      hasActiveApplication: biz.status === 'Applied' || biz.status === 'Under Review',
      productType: biz.status === 'Approved' ? 'LOC' : 'TERM',
      applicationAmount: Math.round(biz.revenue * 0.3),
    };
  });
