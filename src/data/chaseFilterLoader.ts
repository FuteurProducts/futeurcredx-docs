/**
 * Chase Filter Loader
 * Maps Chase JSON filter options and sample businesses to shapes used by chaseDemoData.ts
 */

import chaseData from './chase.json';

// Type the imported JSON data
interface ChaseJsonData {
  filter_options: {
    industries: string[];
    regions: string[];
    states: string[];
    business_sizes: string[];
    products: string[];
    score_ranges: Array<{
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
    credit_score: number;
    annual_revenue: number;
    years_in_business: number;
    employees: number;
    current_exposure: number;
    products_held: string[];
    eligible_products: string[];
  }>;
}

const typedChaseData = chaseData as unknown as ChaseJsonData;

/**
 * Risk tier type
 */
type RiskTier = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

/**
 * Derive risk tier from credit score
 * score>=80 → LOW, >=70 → MODERATE, >=60 → ELEVATED, >=50 → HIGH, else → CRITICAL
 */
function deriveRiskTier(score: number): RiskTier {
  if (score >= 80) return 'LOW';
  if (score >= 70) return 'MODERATE';
  if (score >= 60) return 'ELEVATED';
  if (score >= 50) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Derive status from credit score
 * >=80 → Approved, >=70 → Offer Sent, >=60 → Qualified, >=50 → Under Review, else → Not Eligible
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
    'Technology Services': 'seg_technology',
    'Healthcare Services': 'seg_healthcare',
    'Professional Services': 'seg_professional',
    'Construction & Trades': 'seg_construction',
    'Food Service & Restaurants': 'seg_food_service',
    'Retail Trade': 'seg_retail',
    'Manufacturing': 'seg_manufacturing',
    'Transportation & Logistics': 'seg_transportation',
  };
  return industryMap[industry] || 'seg_other';
}

/**
 * EXPORT 1: Filter options for Chase
 * Maps chase.json filter_options to the shape used by chaseDemoData.ts
 */
export const CHASE_FILTER_OPTIONS = {
  industries: typedChaseData.filter_options.industries,
  states: typedChaseData.filter_options.states,
  riskTiers: ['LOW', 'MODERATE', 'ELEVATED', 'HIGH', 'CRITICAL'] as RiskTier[],
  products: typedChaseData.filter_options.products,
  scoreRange: { min: 0, max: 100 },
  revenueRange: { min: 100_000, max: 50_000_000 }, // Increased max for Chase scale
};

/**
 * EXPORT 2: Saved segments for Chase
 * Scaled to Chase's 6M business portfolio
 */
export const CHASE_SAVED_SEGMENTS = [
  {
    id: 'seg_high_value_professional',
    name: 'High Value Professional',
    businessCount: 540_000,
    exposure: 58_300_000_000,
    createdAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'seg_texas_focus_q1',
    name: 'Texas Focus Q1',
    businessCount: 360_000,
    exposure: 39_000_000_000,
    createdAt: '2026-02-01T08:15:00Z',
  },
  {
    id: 'seg_at_risk_construction',
    name: 'At Risk Construction',
    businessCount: 93_600,
    exposure: 10_100_000_000,
    createdAt: '2026-02-10T14:45:00Z',
  },
  {
    id: 'seg_cross_sell_opportunities',
    name: 'Cross-Sell Opportunities',
    businessCount: 2_010_000,
    exposure: 217_800_000_000,
    createdAt: '2026-01-08T16:00:00Z',
  },
];

/**
 * EXPORT 3: Sample businesses for Chase
 * Maps all 50 sample_businesses from chase.json
 */
export const CHASE_SAMPLE_BUSINESSES = typedChaseData.sample_businesses.map((biz) => {
  const score = Math.round(biz.credit_score);
  return {
    id: biz.id,
    name: biz.name,
    revenue: biz.annual_revenue,
    score,
    risk: deriveRiskTier(score),
    status: deriveStatus(score),
    segment: mapIndustryToSegment(biz.industry),
    state: biz.state,
  };
});
