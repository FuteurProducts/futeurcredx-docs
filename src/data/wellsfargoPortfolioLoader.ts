/**
 * WELLS FARGO PORTFOLIO LOADER
 * Maps wellsfargo.json data to PORTFOLIO, SEGMENTS, and RISK_TIERS shapes
 * Used by wellsfargoDemoData.ts
 */

import wfData from './wellsfargo.json';

interface WFSegment {
  id: string;
  name: string;
  customerCount: number;
  percentage: number;
  totalExposure: number;
  avgExposure: number;
  avgScore: number;
  defaultRate: number;
  growthRate: number;
  topStates: string[];
}

interface WFJSON {
  portfolio_summary: {
    totalCustomers: number;
    totalExposure: number;
    avgCreditScore: number;
    portfolioGrowthYoY: number;
    keyMetrics: {
      pre_qualified_rate: number;
      at_risk_rate: number;
    };
  };
  risk_metrics: {
    credit_quality: {
      at_risk_count: number;
      at_risk_exposure_billions: number;
    };
  };
  segments: WFSegment[];
}

const wf = wfData as unknown as WFJSON;

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

// ─── FICO to LUMIQ conversion ────────────────────────────────────────────

function ficoToLumiq(fico: number): number {
  return Math.round((fico - 300) / 550 * 100);
}

// Icon mapping for WF segments
const SEGMENT_ICONS: Record<string, string> = {
  seg_tech: '\u{1F4BB}',          // Technology
  seg_prof_services: '\u{2696}',  // Professional Services
  seg_manufacturing: '\u{1F3ED}', // Manufacturing
  seg_retail: '\u{1F6CD}',        // Retail Trade
  seg_healthcare: '\u{1F3E5}',    // Healthcare
  seg_construction: '\u{1F528}',  // Construction
  seg_food_service: '\u{1F33E}',  // Food Service & Agriculture
  seg_transportation: '\u{1F69B}', // Transportation & Logistics
};

// Risk distribution derived from default rate
function deriveRiskDistribution(defaultRate: number): Record<string, number> {
  if (defaultRate <= 0.18) {
    return { LOW: 0.31, MODERATE: 0.45, ELEVATED: 0.16, HIGH: 0.06, CRITICAL: 0.02 };
  }
  if (defaultRate <= 0.30) {
    return { LOW: 0.18, MODERATE: 0.40, ELEVATED: 0.24, HIGH: 0.13, CRITICAL: 0.05 };
  }
  return { LOW: 0.11, MODERATE: 0.32, ELEVATED: 0.28, HIGH: 0.18, CRITICAL: 0.11 };
}

// Derive conversion rate from growth rate (higher growth = higher conversion)
function deriveConversionRate(growthRate: number): number {
  if (growthRate >= 10) return 0.12;
  if (growthRate >= 8) return 0.10;
  if (growthRate >= 7) return 0.08;
  if (growthRate >= 6) return 0.06;
  if (growthRate >= 5) return 0.04;
  return 0.03;
}

// Derive status from LUMIQ score
function deriveStatus(lumiqScore: number): 'top_performer' | 'performing' | 'below_benchmark' | 'at_risk' {
  if (lumiqScore >= 75) return 'top_performer';
  if (lumiqScore >= 70) return 'performing';
  if (lumiqScore >= 65) return 'below_benchmark';
  return 'at_risk';
}

// Derive trend from growth rate
function deriveTrend(growthRate: number): 'up' | 'down' | 'stable' {
  if (growthRate >= 7) return 'up';
  if (growthRate <= 3) return 'down';
  return 'stable';
}

// Derive pre-qual rate from default rate (lower default = higher pre-qual)
function derivePreQualRate(defaultRate: number): number {
  if (defaultRate <= 0.18) return 0.72;
  if (defaultRate <= 0.25) return 0.68;
  if (defaultRate <= 0.30) return 0.65;
  if (defaultRate <= 0.35) return 0.60;
  return 0.55;
}

// EXPORT 1: Portfolio
const atRiskExposure = wf.risk_metrics.credit_quality.at_risk_exposure_billions * 1_000_000_000;

export const WF_PORTFOLIO: Portfolio = {
  totalBusinesses: wf.portfolio_summary.totalCustomers,
  totalExposure: wf.portfolio_summary.totalExposure,
  preQualRate: wf.portfolio_summary.keyMetrics.pre_qualified_rate / 100,
  avgCompositeScore: ficoToLumiq(wf.portfolio_summary.avgCreditScore),
  avgCompositeScorePrevMonth: ficoToLumiq(wf.portfolio_summary.avgCreditScore) - 0.3,
  atRiskExposure,
  atRiskPercent: wf.portfolio_summary.keyMetrics.at_risk_rate / 100,
  offerPotential: Math.round(wf.portfolio_summary.totalCustomers * 0.45),
  quarterlyGrowth: wf.portfolio_summary.totalCustomers * (wf.portfolio_summary.portfolioGrowthYoY / 100),
  bureauHitRate: 0.985,
  avgScoreRefreshDays: 20,
};

// EXPORT 2: Segments
export const WF_SEGMENTS: Segment[] = wf.segments.map((segment: WFSegment) => {
  const lumiqScore = ficoToLumiq(segment.avgScore);
  const riskDist = deriveRiskDistribution(segment.defaultRate);
  const preQualRateDecimal = derivePreQualRate(segment.defaultRate);

  return {
    id: `seg_${segment.id.replace('seg_', '')}`,
    name: segment.name,
    icon: SEGMENT_ICONS[segment.id] || '\u{1F4CA}',
    businessCount: segment.customerCount,
    exposure: segment.totalExposure,
    avgScore: lumiqScore,
    preQualRate: preQualRateDecimal,
    riskDistribution: riskDist,
    conversionRate: deriveConversionRate(segment.growthRate),
    status: deriveStatus(lumiqScore),
    trend: deriveTrend(segment.growthRate),
    productEligibility: {
      LOC: Math.round(segment.customerCount * 0.5),
      SBA: Math.round(segment.customerCount * 0.15),
      EQF: Math.round(segment.customerCount * 0.4),
    },
  };
});

// EXPORT 3: Risk Tiers
const totalBusinesses = wf.portfolio_summary.totalCustomers;
const totalExposure = wf.portfolio_summary.totalExposure;

export const WF_RISK_TIERS: RiskTiers = {
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
