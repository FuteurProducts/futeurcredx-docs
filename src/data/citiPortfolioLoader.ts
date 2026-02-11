/**
 * CITI PORTFOLIO LOADER
 * Maps citi.json data to PORTFOLIO, SEGMENTS, and RISK_TIERS shapes
 * Used by citiDemoData.ts
 */

import citiData from './citi.json';

interface CitiJSON {
  portfolio_summary: {
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
  };
  segments: Array<{
    id: string;
    name: string;
    icon: string;
    business_count: number;
    exposure: number;
    avg_score: number;
    pre_qual_rate: number;
    risk_distribution: Record<string, number>;
    conversion_rate: number;
    status: 'top_performer' | 'performing' | 'below_benchmark' | 'at_risk';
    trend: 'up' | 'down' | 'stable';
    product_eligibility: Record<string, number>;
  }>;
  risk_tiers: Record<
    string,
    {
      percent: number;
      count: number;
      exposure: number;
      avg_score: number;
      label: string;
    }
  >;
}

const citi = citiData as unknown as CitiJSON;

interface Portfolio {
  totalBusinesses: number;
  totalExposure: number;
  preQualRate: number;
  avgCompositeScore: number;
  avgCompositeScorePrevMonth: number;
  atRiskExposure: number;
  atRiskPercent: number;
  offerPotential: number;
  quarterlyGrowth: number;
  bureauHitRate: number;
  avgScoreRefreshDays: number;
}

interface Segment {
  id: string;
  name: string;
  icon: string;
  businessCount: number;
  exposure: number;
  avgScore: number;
  preQualRate: number;
  riskDistribution: Record<string, number>;
  conversionRate: number;
  status: 'top_performer' | 'performing' | 'below_benchmark' | 'at_risk';
  trend: 'up' | 'down' | 'stable';
  productEligibility: Record<string, number>;
}

interface RiskTier {
  percent: number;
  count: number;
  exposure: number;
  label: string;
}

type RiskTiers = Record<'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL', RiskTier>;

// EXPORT 1: Portfolio
export const CITI_PORTFOLIO: Portfolio = {
  totalBusinesses: citi.portfolio_summary.total_businesses,
  totalExposure: citi.portfolio_summary.total_exposure,
  preQualRate: citi.portfolio_summary.pre_qual_rate,
  avgCompositeScore: citi.portfolio_summary.avg_composite_score,
  avgCompositeScorePrevMonth: citi.portfolio_summary.avg_composite_score_prev_month,
  atRiskExposure: citi.portfolio_summary.at_risk_exposure,
  atRiskPercent: citi.portfolio_summary.at_risk_percent,
  offerPotential: citi.portfolio_summary.offer_potential,
  quarterlyGrowth: citi.portfolio_summary.quarterly_growth,
  bureauHitRate: citi.portfolio_summary.bureau_hit_rate,
  avgScoreRefreshDays: citi.portfolio_summary.avg_score_refresh_days,
};

// EXPORT 2: Segments
export const CITI_SEGMENTS: Segment[] = citi.segments.map((segment) => ({
  id: segment.id,
  name: segment.name,
  icon: segment.icon,
  businessCount: segment.business_count,
  exposure: segment.exposure,
  avgScore: segment.avg_score,
  preQualRate: segment.pre_qual_rate,
  riskDistribution: segment.risk_distribution,
  conversionRate: segment.conversion_rate,
  status: segment.status,
  trend: segment.trend,
  productEligibility: segment.product_eligibility,
}));

// EXPORT 3: Risk Tiers
export const CITI_RISK_TIERS: RiskTiers = {
  LOW: {
    percent: citi.risk_tiers.LOW.percent,
    count: citi.risk_tiers.LOW.count,
    exposure: citi.risk_tiers.LOW.exposure,
    label: citi.risk_tiers.LOW.label,
  },
  MODERATE: {
    percent: citi.risk_tiers.MODERATE.percent,
    count: citi.risk_tiers.MODERATE.count,
    exposure: citi.risk_tiers.MODERATE.exposure,
    label: citi.risk_tiers.MODERATE.label,
  },
  ELEVATED: {
    percent: citi.risk_tiers.ELEVATED.percent,
    count: citi.risk_tiers.ELEVATED.count,
    exposure: citi.risk_tiers.ELEVATED.exposure,
    label: citi.risk_tiers.ELEVATED.label,
  },
  HIGH: {
    percent: citi.risk_tiers.HIGH.percent,
    count: citi.risk_tiers.HIGH.count,
    exposure: citi.risk_tiers.HIGH.exposure,
    label: citi.risk_tiers.HIGH.label,
  },
  CRITICAL: {
    percent: citi.risk_tiers.CRITICAL.percent,
    count: citi.risk_tiers.CRITICAL.count,
    exposure: citi.risk_tiers.CRITICAL.exposure,
    label: citi.risk_tiers.CRITICAL.label,
  },
};
