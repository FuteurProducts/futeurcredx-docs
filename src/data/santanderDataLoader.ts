/**
 * Santander Data Loader
 *
 * Maps the Santander demo-data JSON (180K businesses, $8B exposure) into the
 * existing PILOT_METRICS and DemoBusinessEntity[] shapes so the dashboard
 * displays real Santander-scale numbers without touching any downstream code.
 */

import santanderData from './santander.json';
import type { DemoBusinessEntity } from './fallback/demoData';

// ─── Type for the Santander JSON structure ─────────────────────────────────

interface SantanderBusiness {
  id: string;
  name: string;
  industry: string;
  state: string;
  city: string;
  lumiq_score: number;
  revenue: number;
  years_in_business: number;
  risk_tier: string;
  current_exposure: number;
  products: string[];
  relationship_manager?: string;
  tags?: string[];
}

interface SantanderPortfolioSummary {
  total_businesses: number;
  total_exposure: number;
  avg_lumiq_score: number;
  qualification_rate: number;
  pre_qualified_count: number;
  npl_ratio: number;
  growth_qoq: number;
}

interface SantanderJSON {
  portfolio_summary: SantanderPortfolioSummary;
  sample_businesses: SantanderBusiness[];
}

const santander = santanderData as unknown as SantanderJSON;
const ps = santander.portfolio_summary;

// ─── FICO to LUMIQ conversion ──────────────────────────────────────────────
// Santander uses FICO range (300-850), convert to LUMIQ 0-100

function ficoToLumiq(fico: number): number {
  return Math.round((fico - 300) / 550 * 100);
}

// ─── Derived values ────────────────────────────────────────────────────────

const avgLumiqScore = ficoToLumiq(ps.avg_lumiq_score);
const scoredBusinesses = Math.round(ps.total_businesses * 0.804);
const applicationsStarted = Math.round(ps.pre_qualified_count * 0.0985);
const approved = Math.round(applicationsStarted * 0.755);
const funded = Math.round(approved * 0.90);
const ineligible = Math.round(ps.total_businesses * 0.198);

// Scale API metrics proportionally from pilot (47,500 → 180,000)
const scaleFactor = ps.total_businesses / 47500;
const totalApiCalls = Math.round(3_247_000 * scaleFactor);
const dailyAvgCalls = Math.round(totalApiCalls / 92);
const errorCount = Math.round(1948 * scaleFactor);

const projectedAnnualRevenue = Math.round(approved * 4250);

// ─── PILOT_METRICS (Santander-scale) ───────────────────────────────────────

export const SANT_PILOT_METRICS = {
  // Business coverage
  totalBusinesses: ps.total_businesses,
  scoredBusinesses,
  scoreCoverage: 80.4,

  // Pre-qualification funnel
  preQualifiedBusinesses: ps.pre_qualified_count,
  preQualRate: ps.qualification_rate,
  applicationsStarted,
  applicationConversion: 25.0,
  approved,
  approvalRate: 75.5,
  funded,
  fundingRate: 90.0,
  ineligible,

  // Score distribution
  avgLumiqScore,
  medianLumiqScore: 61,

  // API performance
  totalApiCalls,
  dailyAvgCalls,
  successRate: 99.94,
  avgLatencyMs: 145,
  p99LatencyMs: 380,
  errorCount,

  // Financial impact
  avgPreQualLimit: ps.total_exposure / ps.pre_qualified_count,
  projectedOriginations: ps.pre_qualified_count * (ps.total_exposure / ps.pre_qualified_count) * 0.25,
  avgRevenuePerBusiness: 4250,
  projectedAnnualRevenue,

  // Risk metrics
  delinquencyRate: ps.npl_ratio,
  defaultRate: 0.28,
  portfolioUtilization: 62.5,

  // Growth metrics
  momGrowth: ps.growth_qoq,
  qoqGrowth: ps.growth_qoq,
  avgTimeToApproval: 2.3,
};

// ─── DEMO_BUSINESSES (first 10 Santander sample businesses) ────────────────

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

export const SANT_DEMO_BUSINESSES: DemoBusinessEntity[] = santander.sample_businesses
  .slice(0, 10)
  .map((biz: SantanderBusiness) => {
    const lumiqScore = ficoToLumiq(biz.lumiq_score);
    const riskTier = deriveRiskTier(lumiqScore);
    return {
      id: biz.id,
      name: biz.name,
      legalName: biz.name,
      industry: biz.industry,
      naicsCode: '000000',
      city: biz.city,
      state: biz.state,
      annualRevenue: biz.revenue,
      employeeCount: Math.round(biz.revenue / 120000), // Rough estimate
      yearsInBusiness: biz.years_in_business,
      lumiqScore,
      ownerFico: Math.round(640 + lumiqScore * 1.5),
      riskTier,
      scoreTrend: deriveScoreTrend(lumiqScore),
      trendValue: deriveTrendValue(lumiqScore),
      segment: deriveSegment(biz.revenue),
      hasActiveApplication: biz.products.length > 0,
      productType: biz.products[0],
      applicationAmount: biz.current_exposure,
    };
  });
