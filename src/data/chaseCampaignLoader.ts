/**
 * Chase Campaign Data Loader
 * Maps chase.json campaign data to Campaign interface used by chaseDemoData.ts
 */

import chaseData from './chase.json';

interface ChaseCampaign {
  id: string;
  product_name: string;
  target_segment: string;
  eligible_businesses: number;
  potential_revenue: number;
  conversion_estimate: number;
  status: string;
  start_date: string;
  end_date: string;
  owner: string;
  funnel: {
    pushed: number;
    viewed: number;
    applied: number;
    approved: number;
  };
  description: string;
}

interface ChaseData {
  campaigns: ChaseCampaign[];
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  health: 'on_track' | 'below_target' | 'paused' | 'completed';
  targetSegment: string;
  targetCriteria: string;
  product: string;
  startDate: string;
  endDate: string;
  owner: string;
  funnel: { pushed: number; viewed: number; applied: number; approved: number };
  viewRate: number;
  applyRate: number;
  approvalRate: number;
  approvedVolume: number;
  warning?: string;
}

interface CampaignSummary {
  activeCampaigns: number;
  offersPushed: number;
  avgViewRate: number;
  avgApplyRate: number;
  avgApprovalRate: number;
  revenueBooked: number;
}

interface ConversionBySegment {
  segment: string;
  viewRate: number;
  applyRate: number;
  approvalRate: number;
  endToEnd: number;
  status: 'ok' | 'warning' | 'at_risk';
}

// Type assertion for imported JSON
const typedChaseData = chaseData as unknown as ChaseData;

/**
 * Map product name to shortened abbreviation
 */
function mapProductName(productName: string): string {
  const productMap: Record<string, string> = {
    'Business Line of Credit': 'LOC',
    'Business Term Loan': 'TERM',
    'Equipment Financing': 'EQUIPMENT'
  };
  return productMap[productName] || productName;
}

/**
 * Map segment name to seg_id format
 */
function mapSegmentToId(segment: string): string {
  const segmentMap: Record<string, string> = {
    'Healthcare Services': 'seg_healthcare',
    'Technology Services': 'seg_tech',
    'Retail Trade': 'seg_retail',
    'Professional Services': 'seg_professional',
    'Manufacturing': 'seg_manufacturing',
    'Construction': 'seg_construction',
    'Food Service': 'seg_food_service'
  };
  return segmentMap[segment] || `seg_${segment.toLowerCase().replace(/\s+/g, '_')}`;
}

/**
 * Derive campaign health from view rate
 */
function deriveHealth(viewRate: number, status: string): Campaign['health'] {
  if (status === 'paused') return 'paused';
  if (status === 'completed') return 'completed';
  return viewRate > 0.5 ? 'on_track' : 'below_target';
}

/**
 * EXPORT 1: CHASE_CAMPAIGNS
 * Array of campaigns mapped from chase.json
 */
export const CHASE_CAMPAIGNS: Campaign[] = typedChaseData.campaigns.map((campaign) => {
  const viewRate = campaign.funnel.viewed / campaign.funnel.pushed;
  const applyRate = campaign.funnel.applied / campaign.funnel.pushed;
  const approvalRate = campaign.funnel.applied > 0
    ? campaign.funnel.approved / campaign.funnel.applied
    : 0;

  const product = mapProductName(campaign.product_name);
  const targetSegment = mapSegmentToId(campaign.target_segment);
  const health = deriveHealth(viewRate, campaign.status);

  const warning = viewRate < 0.35
    ? `Low view rate (${(viewRate * 100).toFixed(1)}%) - consider segment refinement`
    : undefined;

  return {
    id: campaign.id,
    name: `Q1 ${campaign.product_name} — ${campaign.target_segment}`,
    status: campaign.status,
    health,
    targetSegment,
    targetCriteria: `${campaign.target_segment} + Score >50 + ${product} eligible`,
    product,
    startDate: campaign.start_date,
    endDate: campaign.end_date,
    owner: campaign.owner,
    funnel: campaign.funnel,
    viewRate,
    applyRate,
    approvalRate,
    approvedVolume: campaign.potential_revenue,
    warning
  };
});

/**
 * EXPORT 2: CHASE_CAMPAIGN_SUMMARY
 * Aggregated metrics from all campaigns
 */
export const CHASE_CAMPAIGN_SUMMARY: CampaignSummary = (() => {
  const totalPushed = CHASE_CAMPAIGNS.reduce((sum, c) => sum + c.funnel.pushed, 0);
  const totalViewed = CHASE_CAMPAIGNS.reduce((sum, c) => sum + c.funnel.viewed, 0);
  const totalApplied = CHASE_CAMPAIGNS.reduce((sum, c) => sum + c.funnel.applied, 0);
  const totalApproved = CHASE_CAMPAIGNS.reduce((sum, c) => sum + c.funnel.approved, 0);
  const totalRevenue = CHASE_CAMPAIGNS.reduce((sum, c) => sum + c.approvedVolume, 0);

  return {
    activeCampaigns: CHASE_CAMPAIGNS.length,
    offersPushed: totalPushed,
    avgViewRate: totalPushed > 0 ? totalViewed / totalPushed : 0,
    avgApplyRate: totalPushed > 0 ? totalApplied / totalPushed : 0,
    avgApprovalRate: totalApplied > 0 ? totalApproved / totalApplied : 0,
    revenueBooked: totalRevenue
  };
})();

/**
 * EXPORT 3: CHASE_CONVERSION_BY_SEGMENT
 * Conversion rates by segment (6 segments with realistic scaling)
 */
export const CHASE_CONVERSION_BY_SEGMENT: ConversionBySegment[] = [
  {
    segment: 'Professional Services',
    viewRate: 0.72,
    applyRate: 0.18,
    approvalRate: 0.58,
    endToEnd: 0.72 * 0.18 * 0.58, // 0.0751
    status: 'ok'
  },
  {
    segment: 'Healthcare',
    viewRate: 0.70,
    applyRate: 0.15,
    approvalRate: 0.50,
    endToEnd: 0.70 * 0.15 * 0.50, // 0.0525
    status: 'ok'
  },
  {
    segment: 'Retail Trade',
    viewRate: 0.66,
    applyRate: 0.15,
    approvalRate: 0.49,
    endToEnd: 0.66 * 0.15 * 0.49, // 0.0485
    status: 'ok'
  },
  {
    segment: 'Manufacturing',
    viewRate: 0.62,
    applyRate: 0.13,
    approvalRate: 0.47,
    endToEnd: 0.62 * 0.13 * 0.47, // 0.0379
    status: 'warning'
  },
  {
    segment: 'Construction',
    viewRate: 0.58,
    applyRate: 0.11,
    approvalRate: 0.46,
    endToEnd: 0.58 * 0.11 * 0.46, // 0.0293
    status: 'at_risk'
  },
  {
    segment: 'Food Service',
    viewRate: 0.55,
    applyRate: 0.10,
    approvalRate: 0.45,
    endToEnd: 0.55 * 0.10 * 0.45, // 0.0248
    status: 'at_risk'
  }
];
