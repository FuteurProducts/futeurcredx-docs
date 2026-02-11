/**
 * Citi Filter Loader
 * Maps Citi JSON filter options and sample businesses to shapes used by citiDemoData.ts
 */

import citiData from './citi.json';

// Type the imported JSON data
interface CitiJsonData {
  filter_options: {
    industries: string[];
    states: string[];
    risk_tiers: string[];
    products: string[];
    score_range: {
      min: number;
      max: number;
    };
    revenue_range: {
      min: number;
      max: number;
    };
  };
  sample_businesses: Array<{
    id: string;
    name: string;
    revenue: number;
    score: number;
    risk: string;
    status: string;
    segment: string;
    state: string;
    city: string;
  }>;
  saved_segments: Array<{
    id: string;
    name: string;
    business_count: number;
    exposure: number;
    created_at: string;
  }>;
}

const typedCitiData = citiData as unknown as CitiJsonData;

/**
 * Risk tier type
 */
type RiskTier = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

/**
 * Derive risk tier from string (already in proper format)
 */
function deriveRiskTier(risk: string): RiskTier {
  if (risk === 'LOW') return 'LOW';
  if (risk === 'MODERATE') return 'MODERATE';
  if (risk === 'ELEVATED') return 'ELEVATED';
  if (risk === 'HIGH') return 'HIGH';
  return 'CRITICAL';
}

/**
 * EXPORT 1: Filter options for Citi
 * Maps citi.json filter_options to the shape used by citiDemoData.ts
 */
export const CITI_FILTER_OPTIONS = {
  industries: typedCitiData.filter_options.industries,
  states: typedCitiData.filter_options.states,
  riskTiers: typedCitiData.filter_options.risk_tiers as RiskTier[],
  products: typedCitiData.filter_options.products,
  scoreRange: typedCitiData.filter_options.score_range,
  revenueRange: typedCitiData.filter_options.revenue_range,
};

/**
 * EXPORT 2: Saved segments for Citi
 * Maps saved_segments from citi.json
 */
export const CITI_SAVED_SEGMENTS = typedCitiData.saved_segments.map((segment) => ({
  id: segment.id,
  name: segment.name,
  businessCount: segment.business_count,
  exposure: segment.exposure,
  createdAt: segment.created_at,
}));

/**
 * EXPORT 3: Sample businesses for Citi
 * Maps all 50 sample_businesses from citi.json
 */
export const CITI_SAMPLE_BUSINESSES = typedCitiData.sample_businesses.map((biz) => {
  const score = Math.round(biz.score);
  return {
    id: biz.id,
    name: biz.name,
    revenue: biz.revenue,
    score,
    risk: deriveRiskTier(biz.risk),
    status: biz.status,
    segment: biz.segment,
    state: biz.state,
  };
});
