/**
 * CHASE PORTFOLIO LOADER
 * Maps chase.json data to PORTFOLIO, SEGMENTS, and RISK_TIERS shapes
 * Used by chaseDemoData.ts
 */

import chaseData from './chase.json';

interface ChaseJSON {
  portfolio_summary: {
    total_businesses: number;
    total_exposure: number;
    pre_qualified_rate: number;
    avg_credit_score: number;
    at_risk_exposure: number;
    at_risk_rate: number;
    offer_potential: number;
    trend: {
      portfolio_growth_yoy: number;
    };
  };
  segments: Array<{
    id: string;
    name: string;
    business_count: number;
    total_exposure: number;
    avg_credit_score: number;
    pre_qualified_rate: number;
    risk_level: 'low' | 'medium' | 'high';
    trend: {
      direction: 'up' | 'down' | 'stable';
    };
  }>;
}

const chase = chaseData as unknown as ChaseJSON;

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

// Icon mapping for segments
const SEGMENT_ICONS: Record<string, string> = {
  professional_services: '👔',
  retail_trade: '🏪',
  food_service: '🍽️',
  healthcare: '🏥',
  construction: '🏗️',
  technology: '💻',
  manufacturing: '🏭',
  transportation: '🚛',
};

// Risk distribution based on risk_level
const RISK_DISTRIBUTIONS = {
  low: {
    LOW: 0.31,
    MODERATE: 0.45,
    ELEVATED: 0.16,
    HIGH: 0.06,
    CRITICAL: 0.02,
  },
  medium: {
    LOW: 0.18,
    MODERATE: 0.4,
    ELEVATED: 0.24,
    HIGH: 0.13,
    CRITICAL: 0.05,
  },
  high: {
    LOW: 0.11,
    MODERATE: 0.32,
    ELEVATED: 0.28,
    HIGH: 0.18,
    CRITICAL: 0.11,
  },
};

// Derive conversion rate from pre-qualified rate (higher preQual = higher conversion)
function deriveConversionRate(preQualRate: number): number {
  if (preQualRate >= 70) return 0.12;
  if (preQualRate >= 65) return 0.10;
  if (preQualRate >= 60) return 0.08;
  if (preQualRate >= 55) return 0.06;
  if (preQualRate >= 50) return 0.04;
  return 0.03;
}

// Derive status from avg credit score
function deriveStatus(avgScore: number): 'top_performer' | 'performing' | 'below_benchmark' | 'at_risk' {
  if (avgScore >= 75) return 'top_performer';
  if (avgScore >= 70) return 'performing';
  if (avgScore >= 65) return 'below_benchmark';
  return 'at_risk';
}

// EXPORT 1: Portfolio
export const CHASE_PORTFOLIO: Portfolio = {
  totalBusinesses: chase.portfolio_summary.total_businesses,
  totalExposure: chase.portfolio_summary.total_exposure,
  preQualRate: chase.portfolio_summary.pre_qualified_rate / 100,
  avgCompositeScore: chase.portfolio_summary.avg_credit_score,
  avgCompositeScorePrevMonth: chase.portfolio_summary.avg_credit_score - 0.3,
  atRiskExposure: chase.portfolio_summary.at_risk_exposure,
  atRiskPercent: chase.portfolio_summary.at_risk_rate / 100,
  offerPotential: chase.portfolio_summary.offer_potential,
  quarterlyGrowth: chase.portfolio_summary.total_businesses * (chase.portfolio_summary.trend.portfolio_growth_yoy / 100),
  bureauHitRate: 0.987,
  avgScoreRefreshDays: 18,
};

// EXPORT 2: Segments
export const CHASE_SEGMENTS: Segment[] = chase.segments.map((segment) => {
  const riskDist = RISK_DISTRIBUTIONS[segment.risk_level];
  const preQualRateDecimal = segment.pre_qualified_rate / 100;

  return {
    id: `seg_${segment.id}`,
    name: segment.name,
    icon: SEGMENT_ICONS[segment.id] || '📊',
    businessCount: segment.business_count,
    exposure: segment.total_exposure,
    avgScore: segment.avg_credit_score,
    preQualRate: preQualRateDecimal,
    riskDistribution: riskDist,
    conversionRate: deriveConversionRate(segment.pre_qualified_rate),
    status: deriveStatus(segment.avg_credit_score),
    trend: segment.trend.direction,
    productEligibility: {
      LOC: Math.round(segment.business_count * 0.5),
      TERM: Math.round(segment.business_count * 0.4),
      SBA: Math.round(segment.business_count * 0.15),
    },
  };
});

// EXPORT 3: Risk Tiers
const totalBusinesses = chase.portfolio_summary.total_businesses;
const totalExposure = chase.portfolio_summary.total_exposure;

export const CHASE_RISK_TIERS: RiskTiers = {
  LOW: {
    percent: 0.22,
    count: Math.round(totalBusinesses * 0.22),
    exposure: Math.round(totalExposure * 0.22),
    label: 'Low Risk',
  },
  MODERATE: {
    percent: 0.41,
    count: Math.round(totalBusinesses * 0.41),
    exposure: Math.round(totalExposure * 0.41),
    label: 'Moderate',
  },
  ELEVATED: {
    percent: 0.24,
    count: Math.round(totalBusinesses * 0.24),
    exposure: Math.round(totalExposure * 0.24),
    label: 'Elevated',
  },
  HIGH: {
    percent: 0.1,
    count: Math.round(totalBusinesses * 0.1),
    exposure: Math.round(totalExposure * 0.1),
    label: 'High Risk',
  },
  CRITICAL: {
    percent: 0.03,
    count: Math.round(totalBusinesses * 0.03),
    exposure: Math.round(totalExposure * 0.03),
    label: 'Critical',
  },
};
