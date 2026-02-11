/**
 * Chase Data Loader
 *
 * Maps the Chase demo-data JSON (6M businesses, $650B exposure) into the
 * existing PILOT_METRICS and DemoBusinessEntity[] shapes so the dashboard
 * displays real Chase-scale numbers without touching any downstream code.
 */

import chaseData from './chase.json';
import type { DemoBusinessEntity } from './fallback/demoData';

// ─── Type for the Chase JSON structure ──────────────────────────────────────

interface ChaseBusiness {
  id: string;
  name: string;
  industry: string;
  state: string;
  credit_score: number;
  annual_revenue: number;
  years_in_business: number;
  employees: number;
  current_exposure: number;
  products_held: string[];
  eligible_products: string[];
}

interface ChasePortfolioSummary {
  total_businesses: number;
  avg_credit_score: number;
  pre_qualified_count: number;
  pre_qualified_rate: number;
  avg_exposure_per_business: number;
  trend: {
    portfolio_growth_yoy: number;
    npl_rate: number;
  };
}

interface ChaseJSON {
  portfolio_summary: ChasePortfolioSummary;
  sample_businesses: ChaseBusiness[];
}

const chase = chaseData as unknown as ChaseJSON;
const ps = chase.portfolio_summary;

// ─── Derived values ─────────────────────────────────────────────────────────

const scoredBusinesses = Math.round(ps.total_businesses * 0.804);
const applicationsStarted = Math.round(ps.pre_qualified_count * 0.0985);
const approved = Math.round(applicationsStarted * 0.755);
const funded = Math.round(approved * 0.90);
const ineligible = Math.round(ps.total_businesses * 0.198);

// Scale API metrics proportionally from pilot (47,500 → 6,000,000)
const scaleFactor = ps.total_businesses / 47500;
const totalApiCalls = Math.round(3_247_000 * scaleFactor);
const dailyAvgCalls = Math.round(totalApiCalls / 92);
const errorCount = Math.round(1948 * scaleFactor);

const projectedAnnualRevenue = Math.round(approved * 4250);

// ─── PILOT_METRICS (Chase-scale) ────────────────────────────────────────────

export const CHASE_PILOT_METRICS = {
  // Business coverage
  totalBusinesses: ps.total_businesses,
  scoredBusinesses,
  scoreCoverage: 80.4,

  // Pre-qualification funnel
  preQualifiedBusinesses: ps.pre_qualified_count,
  preQualRate: ps.pre_qualified_rate,
  applicationsStarted,
  applicationConversion: 25.0,
  approved,
  approvalRate: 75.5,
  funded,
  fundingRate: 90.0,
  ineligible,

  // Score distribution
  avgLumiqScore: ps.avg_credit_score,
  medianLumiqScore: 73,

  // API performance
  totalApiCalls,
  dailyAvgCalls,
  successRate: 99.94,
  avgLatencyMs: 145,
  p99LatencyMs: 380,
  errorCount,

  // Financial impact
  avgPreQualLimit: ps.avg_exposure_per_business,
  projectedOriginations: ps.pre_qualified_count * ps.avg_exposure_per_business * 0.25,
  avgRevenuePerBusiness: 4250,
  projectedAnnualRevenue,

  // Risk metrics
  delinquencyRate: ps.trend.npl_rate,
  defaultRate: 0.28,
  portfolioUtilization: 62.5,

  // Growth metrics
  momGrowth: ps.trend.portfolio_growth_yoy,
  qoqGrowth: 12.8,
  avgTimeToApproval: 2.3,
};

// ─── DEMO_BUSINESSES (first 10 Chase sample businesses) ─────────────────────

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

export const CHASE_DEMO_BUSINESSES: DemoBusinessEntity[] = chase.sample_businesses
  .slice(0, 10)
  .map((biz: ChaseBusiness) => {
    const riskTier = deriveRiskTier(biz.credit_score);
    return {
      id: biz.id.replace('_', '-'),
      name: biz.name,
      legalName: biz.name,
      industry: biz.industry,
      naicsCode: '000000',
      city: biz.state,
      state: biz.state,
      annualRevenue: biz.annual_revenue,
      employeeCount: biz.employees,
      yearsInBusiness: biz.years_in_business,
      lumiqScore: Math.round(biz.credit_score),
      ownerFico: Math.round(640 + biz.credit_score * 1.5),
      riskTier,
      scoreTrend: deriveScoreTrend(biz.credit_score),
      trendValue: deriveTrendValue(biz.credit_score),
      segment: deriveSegment(biz.annual_revenue),
      hasActiveApplication: biz.eligible_products.length > 0,
      productType: biz.products_held[0],
      applicationAmount: biz.current_exposure,
    };
  });
