/**
 * Santander Filter Loader
 * Maps Santander JSON filter options and sample businesses to shapes used by santanderDemoData.ts
 */

import santanderData from './santander.json';

// Type the imported JSON data
interface SantanderJsonData {
  filter_options: {
    states: Array<{
      code: string;
      name: string;
      count: number;
    }>;
    industries: Array<{
      id: string;
      name: string;
      count: number;
    }>;
    risk_tiers: Array<{
      id: string;
      name: string;
      count: number;
    }>;
    revenue_bands: Array<{
      id: string;
      name: string;
      count: number;
    }>;
    products: Array<{
      id: string;
      name: string;
    }>;
  };
  sample_businesses: Array<{
    id: string;
    name: string;
    industry: string;
    state: string;
    city: string;
    revenue: number;
    years_in_business: number;
    lumiq_score: number;
    risk_tier: string;
    current_exposure: number;
    products: string[];
    relationship_manager?: string;
    tags?: string[];
  }>;
}

const typedSantanderData = santanderData as unknown as SantanderJsonData;

/**
 * Risk tier type
 */
type RiskTier = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

/**
 * FICO to LUMIQ conversion
 */
function ficoToLumiq(fico: number): number {
  return Math.round((fico - 300) / 550 * 100);
}

/**
 * Derive risk tier from LUMIQ score
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
    'Restaurants & Food': 'seg_restaurants',
    'Retail & E-Commerce': 'seg_retail',
    'Manufacturing': 'seg_manufacturing',
    'Transportation & Logistics': 'seg_transportation',
    'Real Estate Services': 'seg_realestate',
    'Wholesale & Distribution': 'seg_wholesale',
    'Auto Services': 'seg_auto',
    'Other Services': 'seg_other',
  };
  return industryMap[industry] || 'seg_other';
}

/**
 * EXPORT 1: Filter options for Santander
 * Maps santander.json filter_options to the shape used by santanderDemoData.ts
 */
export const SANT_FILTER_OPTIONS = {
  industries: typedSantanderData.filter_options.industries.map(ind => ind.name),
  states: typedSantanderData.filter_options.states.map(st => st.code),
  riskTiers: ['LOW', 'MODERATE', 'ELEVATED', 'HIGH', 'CRITICAL'] as RiskTier[],
  products: typedSantanderData.filter_options.products.map(prod => prod.name),
  scoreRange: { min: 0, max: 100 },
  revenueRange: { min: 100_000, max: 15_000_000 }, // Santander smaller scale than Chase
};

/**
 * EXPORT 2: Saved segments for Santander
 * Scaled to Santander's 180K business portfolio
 */
export const SANT_SAVED_SEGMENTS = [
  {
    id: 'seg_northeast_professional',
    name: 'Northeast Professional Services',
    businessCount: 21600,
    exposure: 1800000000,
    createdAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'seg_hispanic_growth',
    name: 'Hispanic Business Growth',
    businessCount: 14400,
    exposure: 960000000,
    createdAt: '2026-02-01T08:15:00Z',
  },
  {
    id: 'seg_multifamily_real_estate',
    name: 'Multifamily Real Estate',
    businessCount: 7200,
    exposure: 1280000000,
    createdAt: '2026-02-10T14:45:00Z',
  },
  {
    id: 'seg_sba_eligible',
    name: 'SBA Express Eligible',
    businessCount: 18000,
    exposure: 640000000,
    createdAt: '2026-01-08T16:00:00Z',
  },
];

/**
 * EXPORT 3: Sample businesses for Santander
 * Maps all 50 sample_businesses from santander.json
 */
export const SANT_SAMPLE_BUSINESSES = typedSantanderData.sample_businesses.map((biz) => {
  const lumiqScore = ficoToLumiq(biz.lumiq_score);
  return {
    id: biz.id,
    name: biz.name,
    revenue: biz.revenue,
    score: lumiqScore,
    risk: deriveRiskTier(lumiqScore),
    status: deriveStatus(lumiqScore),
    segment: mapIndustryToSegment(biz.industry),
    state: biz.state,
  };
});
