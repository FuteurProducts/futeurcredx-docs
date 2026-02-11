/**
 * Wells Fargo Filter Loader
 * Maps WF JSON filter options and sample businesses to shapes used by wellsfargoDemoData.ts
 */

import wfData from './wellsfargo.json';

// Type the imported JSON data
interface WFJsonData {
  filter_options: {
    industries: string[];
    states: string[];
    products: string[];
    creditScoreRanges: Array<{
      label: string;
      min: number;
      max: number;
    }>;
    revenueRanges: Array<{
      label: string;
      min: number;
      max: number;
    }>;
  };
  sample_businesses: Array<{
    id: string;
    name: string;
    industry: string;
    state: string;
    creditScore: number;
    revenue: number;
    yearsInBusiness: number;
    employeeCount: number;
    totalExposure: number;
    currentProducts: string[];
  }>;
}

const typedWFData = wfData as unknown as WFJsonData;

/**
 * Risk tier type
 */
type RiskTier = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

// ─── FICO to LUMIQ conversion ────────────────────────────────────────────

function ficoToLumiq(fico: number): number {
  return Math.round((fico - 300) / 550 * 100);
}

/**
 * Derive risk tier from LUMIQ score
 * score>=80 -> LOW, >=70 -> MODERATE, >=60 -> ELEVATED, >=50 -> HIGH, else -> CRITICAL
 */
function deriveRiskTier(score: number): RiskTier {
  if (score >= 80) return 'LOW';
  if (score >= 70) return 'MODERATE';
  if (score >= 60) return 'ELEVATED';
  if (score >= 50) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Derive status from LUMIQ score
 * >=80 -> Approved, >=70 -> Offer Sent, >=60 -> Qualified, >=50 -> Under Review, else -> Not Eligible
 */
function deriveStatus(score: number): string {
  if (score >= 80) return 'Approved';
  if (score >= 70) return 'Offer Sent';
  if (score >= 60) return 'Qualified';
  if (score >= 50) return 'Under Review';
  return 'Not Eligible';
}

/**
 * Map industry to segment ID
 */
function mapIndustryToSegment(industry: string): string {
  const industryMap: Record<string, string> = {
    'Technology': 'seg_tech',
    'Professional Services': 'seg_prof_services',
    'Manufacturing': 'seg_manufacturing',
    'Retail Trade': 'seg_retail',
    'Healthcare': 'seg_healthcare',
    'Construction': 'seg_construction',
    'Food Service & Agriculture': 'seg_food_service',
    'Transportation & Logistics': 'seg_transportation',
  };
  return industryMap[industry] || 'seg_other';
}

/**
 * EXPORT 1: Filter options for Wells Fargo
 * Maps wellsfargo.json filter_options to the expected shape
 */
export const WF_FILTER_OPTIONS = {
  industries: typedWFData.filter_options.industries,
  states: typedWFData.filter_options.states,
  riskTiers: ['LOW', 'MODERATE', 'ELEVATED', 'HIGH', 'CRITICAL'] as RiskTier[],
  products: typedWFData.filter_options.products,
  scoreRange: { min: 0, max: 100 },
  revenueRange: { min: 100_000, max: 50_000_000 },
};

/**
 * EXPORT 2: Saved segments for Wells Fargo
 * Scaled to WF's 3.3M customer portfolio
 */
export const WF_SAVED_SEGMENTS = [
  {
    id: 'seg_high_value_tech',
    name: 'High Value Technology',
    businessCount: 297_000,
    exposure: 60_300_000_000,
    createdAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'seg_california_focus_q1',
    name: 'California Focus Q1',
    businessCount: 811_800,
    exposure: 164_857_400_000,
    createdAt: '2026-02-01T08:15:00Z',
  },
  {
    id: 'seg_at_risk_construction',
    name: 'At Risk Construction',
    businessCount: 76_725,
    exposure: 15_577_567_500,
    createdAt: '2026-02-10T14:45:00Z',
  },
  {
    id: 'seg_agricultural_lending',
    name: 'Agricultural Lending Pipeline',
    businessCount: 336_600,
    exposure: 68_340_098_000,
    createdAt: '2026-01-08T16:00:00Z',
  },
];

/**
 * EXPORT 3: Sample businesses for Wells Fargo
 * Maps all 50 sample_businesses from wellsfargo.json
 * FICO scores are converted to LUMIQ scores
 */
export const WF_SAMPLE_BUSINESSES = typedWFData.sample_businesses.map((biz) => {
  const score = ficoToLumiq(biz.creditScore);
  return {
    id: biz.id,
    name: biz.name,
    revenue: biz.revenue,
    score,
    risk: deriveRiskTier(score),
    status: deriveStatus(score),
    segment: mapIndustryToSegment(biz.industry),
    state: biz.state,
  };
});
