/**
 * SANTANDER PORTFOLIO LOADER
 * Maps santander.json data to PORTFOLIO, SEGMENTS, and RISK_TIERS shapes
 * Used by santanderDemoData.ts
 */

import santanderData from './santander.json';

interface SantanderJSON {
  portfolio_summary: {
    total_businesses: number;
    total_exposure: number;
    qualification_rate: number;
    avg_lumiq_score: number;
    at_risk_count: number;
    at_risk_exposure: number;
    pre_qualified_count: number;
    pre_qualified_exposure: number;
    growth_qoq: number;
    npl_ratio: number;
  };
  segments: Array<{
    id: string;
    name: string;
    count: number;
    percentage: number;
    exposure: number;
    avg_score: number;
    color: string;
    description: string;
    action_items: string[];
  }>;
  risk_metrics: {
    risk_tier_distribution: Array<{
      tier: string;
      count: number;
      percentage: number;
      exposure: number;
      avg_score: number;
      color: string;
    }>;
  };
}

const santander = santanderData as unknown as SantanderJSON;

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

// ─── FICO to LUMIQ conversion ──────────────────────────────────────────────

function ficoToLumiq(fico: number): number {
  return Math.round((fico - 300) / 550 * 100);
}

// ─── Icon mapping for Santander segments ───────────────────────────────────

const SEGMENT_ICONS: Record<string, string> = {
  'pre-qualified': '✅',
  'growth-opportunity': '📈',
  'needs-monitoring': '👁️',
  'at-risk': '⚠️',
};

// ─── Risk distribution based on segment ────────────────────────────────────

const RISK_DISTRIBUTIONS: Record<string, Record<string, number>> = {
  'pre-qualified': {
    LOW: 0.52,
    MODERATE: 0.35,
    ELEVATED: 0.10,
    HIGH: 0.03,
    CRITICAL: 0.0,
  },
  'growth-opportunity': {
    LOW: 0.25,
    MODERATE: 0.48,
    ELEVATED: 0.20,
    HIGH: 0.06,
    CRITICAL: 0.01,
  },
  'needs-monitoring': {
    LOW: 0.12,
    MODERATE: 0.38,
    ELEVATED: 0.32,
    HIGH: 0.15,
    CRITICAL: 0.03,
  },
  'at-risk': {
    LOW: 0.05,
    MODERATE: 0.22,
    ELEVATED: 0.35,
    HIGH: 0.28,
    CRITICAL: 0.10,
  },
};

// ─── Derive conversion rate from avg score ────────────────────────────────

function deriveConversionRate(avgScore: number): number {
  const lumiqScore = ficoToLumiq(avgScore);
  if (lumiqScore >= 75) return 0.12;
  if (lumiqScore >= 70) return 0.10;
  if (lumiqScore >= 65) return 0.08;
  if (lumiqScore >= 60) return 0.06;
  if (lumiqScore >= 55) return 0.04;
  return 0.03;
}

// ─── Derive status from avg score ──────────────────────────────────────────

function deriveStatus(avgScore: number): 'top_performer' | 'performing' | 'below_benchmark' | 'at_risk' {
  const lumiqScore = ficoToLumiq(avgScore);
  if (lumiqScore >= 75) return 'top_performer';
  if (lumiqScore >= 70) return 'performing';
  if (lumiqScore >= 65) return 'below_benchmark';
  return 'at_risk';
}

// ─── Derive trend (stable for all Santander segments) ──────────────────────

function deriveTrend(): 'up' | 'down' | 'stable' {
  return 'stable';
}

// ─── EXPORT 1: Portfolio ────────────────────────────────────────────────────

export const SANT_PORTFOLIO: Portfolio = {
  totalBusinesses: santander.portfolio_summary.total_businesses,
  totalExposure: santander.portfolio_summary.total_exposure,
  preQualRate: santander.portfolio_summary.qualification_rate / 100,
  avgCompositeScore: ficoToLumiq(santander.portfolio_summary.avg_lumiq_score),
  avgCompositeScorePrevMonth: ficoToLumiq(santander.portfolio_summary.avg_lumiq_score) - 0.3,
  atRiskExposure: santander.portfolio_summary.at_risk_exposure,
  atRiskPercent: santander.portfolio_summary.at_risk_count / santander.portfolio_summary.total_businesses,
  offerPotential: santander.portfolio_summary.pre_qualified_exposure,
  quarterlyGrowth: Math.round(santander.portfolio_summary.total_businesses * (santander.portfolio_summary.growth_qoq / 100)),
  bureauHitRate: 0.978,
  avgScoreRefreshDays: 21,
};

// ─── EXPORT 2: Segments ─────────────────────────────────────────────────────

export const SANT_SEGMENTS: Segment[] = santander.segments.map((segment) => {
  const riskDist = RISK_DISTRIBUTIONS[segment.id] || RISK_DISTRIBUTIONS['needs-monitoring'];
  const avgLumiqScore = ficoToLumiq(segment.avg_score);

  return {
    id: `seg_${segment.id}`,
    name: segment.name,
    icon: SEGMENT_ICONS[segment.id] || '📊',
    businessCount: segment.count,
    exposure: segment.exposure,
    avgScore: avgLumiqScore,
    preQualRate: segment.percentage / 100,
    riskDistribution: riskDist,
    conversionRate: deriveConversionRate(segment.avg_score),
    status: deriveStatus(segment.avg_score),
    trend: deriveTrend(),
    productEligibility: {
      LOC: Math.round(segment.count * 0.5),
      TERM: Math.round(segment.count * 0.4),
      SBA: Math.round(segment.count * 0.15),
    },
  };
});

// ─── EXPORT 3: Risk Tiers ───────────────────────────────────────────────────

export const SANT_RISK_TIERS: RiskTiers = {
  LOW: {
    percent: 0.41,
    count: Math.round(santander.portfolio_summary.total_businesses * 0.41),
    exposure: Math.round(santander.portfolio_summary.total_exposure * 0.41),
    label: 'Low Risk',
  },
  MODERATE: {
    percent: 0.279,
    count: Math.round(santander.portfolio_summary.total_businesses * 0.279),
    exposure: Math.round(santander.portfolio_summary.total_exposure * 0.279),
    label: 'Moderate',
  },
  ELEVATED: {
    percent: 0.182,
    count: Math.round(santander.portfolio_summary.total_businesses * 0.182),
    exposure: Math.round(santander.portfolio_summary.total_exposure * 0.182),
    label: 'Elevated',
  },
  HIGH: {
    percent: 0.10,
    count: Math.round(santander.portfolio_summary.total_businesses * 0.10),
    exposure: Math.round(santander.portfolio_summary.total_exposure * 0.10),
    label: 'High Risk',
  },
  CRITICAL: {
    percent: 0.029,
    count: Math.round(santander.portfolio_summary.total_businesses * 0.029),
    exposure: Math.round(santander.portfolio_summary.total_exposure * 0.029),
    label: 'Critical',
  },
};
