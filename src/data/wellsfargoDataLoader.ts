/**
 * Wells Fargo Data Loader
 *
 * Maps the Wells Fargo demo-data JSON (3.3M customers, $670B exposure) into the
 * existing PILOT_METRICS and DemoBusinessEntity[] shapes so the dashboard
 * displays real WF-scale numbers without touching any downstream code.
 */

import wfData from './wellsfargo.json';
import type { DemoBusinessEntity } from './fallback/demoData';

// ─── Type for the WF JSON structure ──────────────────────────────────────

interface WFBusiness {
  id: string;
  name: string;
  industry: string;
  state: string;
  city: string;
  creditScore: number;
  revenue: number;
  yearsInBusiness: number;
  employeeCount: number;
  totalExposure: number;
  currentProducts: string[];
}

interface WFPortfolioSummary {
  totalCustomers: number;
  totalExposure: number;
  avgExposurePerCustomer: number;
  avgCreditScore: number;
  nplRate: number;
  portfolioGrowthYoY: number;
  keyMetrics: {
    pre_qualified_rate: number;
    at_risk_rate: number;
  };
}

interface WFJSON {
  portfolio_summary: WFPortfolioSummary;
  sample_businesses: WFBusiness[];
}

const wf = wfData as unknown as WFJSON;
const ps = wf.portfolio_summary;

// ─── FICO to LUMIQ conversion ────────────────────────────────────────────

function ficoToLumiq(fico: number): number {
  return Math.round((fico - 300) / 550 * 100);
}

// ─── Derived values ─────────────────────────────────────────────────────────

const scoredBusinesses = Math.round(ps.totalCustomers * 0.804);
const preQualifiedBusinesses = Math.round(ps.totalCustomers * ps.keyMetrics.pre_qualified_rate / 100);
const applicationsStarted = Math.round(preQualifiedBusinesses * 0.0985);
const approved = Math.round(applicationsStarted * 0.755);
const funded = Math.round(approved * 0.90);
const ineligible = Math.round(ps.totalCustomers * 0.198);

// Scale API metrics proportionally from pilot (47,500 → 3,300,000)
const scaleFactor = ps.totalCustomers / 47500;
const totalApiCalls = Math.round(3_247_000 * scaleFactor);
const dailyAvgCalls = Math.round(totalApiCalls / 92);
const errorCount = Math.round(1948 * scaleFactor);

const projectedAnnualRevenue = Math.round(approved * 4250);

// ─── PILOT_METRICS (WF-scale) ────────────────────────────────────────────

export const WF_PILOT_METRICS = {
  // Business coverage
  totalBusinesses: ps.totalCustomers,
  scoredBusinesses,
  scoreCoverage: 80.4,

  // Pre-qualification funnel
  preQualifiedBusinesses,
  preQualRate: ps.keyMetrics.pre_qualified_rate,
  applicationsStarted,
  applicationConversion: 25.0,
  approved,
  approvalRate: 75.5,
  funded,
  fundingRate: 90.0,
  ineligible,

  // Score distribution
  avgLumiqScore: ficoToLumiq(ps.avgCreditScore),
  medianLumiqScore: 70,

  // API performance
  totalApiCalls,
  dailyAvgCalls,
  successRate: 99.94,
  avgLatencyMs: 145,
  p99LatencyMs: 380,
  errorCount,

  // Financial impact
  avgPreQualLimit: ps.avgExposurePerCustomer,
  projectedOriginations: preQualifiedBusinesses * ps.avgExposurePerCustomer * 0.25,
  avgRevenuePerBusiness: 4250,
  projectedAnnualRevenue,

  // Risk metrics
  delinquencyRate: ps.nplRate,
  defaultRate: 0.27,
  portfolioUtilization: 68.4,

  // Growth metrics
  momGrowth: ps.portfolioGrowthYoY,
  qoqGrowth: 10.2,
  avgTimeToApproval: 2.5,
};

// ─── DEMO_BUSINESSES (first 10 WF sample businesses) ─────────────────────

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

export const WF_DEMO_BUSINESSES: DemoBusinessEntity[] = wf.sample_businesses
  .slice(0, 10)
  .map((biz: WFBusiness) => {
    const lumiqScore = ficoToLumiq(biz.creditScore);
    const riskTier = deriveRiskTier(lumiqScore);
    return {
      id: biz.id.replace('_', '-'),
      name: biz.name,
      legalName: biz.name,
      industry: biz.industry,
      naicsCode: '000000',
      city: biz.city,
      state: biz.state,
      annualRevenue: biz.revenue,
      employeeCount: biz.employeeCount,
      yearsInBusiness: biz.yearsInBusiness,
      lumiqScore,
      ownerFico: Math.round(640 + lumiqScore * 1.5),
      riskTier,
      scoreTrend: deriveScoreTrend(lumiqScore),
      trendValue: deriveTrendValue(lumiqScore),
      segment: deriveSegment(biz.revenue),
      hasActiveApplication: biz.totalExposure > 0,
      productType: biz.currentProducts[0],
      applicationAmount: biz.totalExposure,
    };
  });
