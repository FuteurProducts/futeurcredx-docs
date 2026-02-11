/**
 * Wells Fargo Campaign Data Loader
 * Maps wellsfargo.json campaign data to Campaign interface used by wellsfargoDemoData.ts
 */

import wfData from './wellsfargo.json';

interface WFCampaignPerformance {
  targeted: number;
  reached: number;
  applied: number;
  approved: number;
  conversionRate: number;
  approvalRate: number;
  avgAmount: number;
  totalVolume: number;
}

interface WFCampaign {
  id: string;
  name: string;
  product: string;
  status: string;
  startDate: string;
  endDate: string;
  targetSegments: string[];
  performance: WFCampaignPerformance;
}

interface WFData {
  campaigns: WFCampaign[];
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
const typedWFData = wfData as unknown as WFData;

/**
 * Map product name to shortened abbreviation
 */
function mapProductName(productName: string): string {
  const productMap: Record<string, string> = {
    'BusinessLine Line of Credit': 'LOC',
    'SBA 7(a) Loan': 'SBA',
    'Equipment Financing': 'EQF',
    'Prime Line of Credit': 'LOC-P',
    'Commercial Real Estate Loan': 'CRE',
    'Commercial Auto Financing': 'AUTO',
    'Working Capital Loan': 'WCL',
  };
  return productMap[productName] || productName;
}

/**
 * Map segment name to seg_id format
 */
function mapSegmentToId(segment: string): string {
  const segmentMap: Record<string, string> = {
    'Technology': 'seg_tech',
    'Professional Services': 'seg_prof_services',
    'Manufacturing': 'seg_manufacturing',
    'Retail Trade': 'seg_retail',
    'Healthcare': 'seg_healthcare',
    'Construction': 'seg_construction',
    'Food Service & Agriculture': 'seg_food_service',
    'Transportation & Logistics': 'seg_transportation',
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

// Campaign owner assignments
const CAMPAIGN_OWNERS: Record<string, string> = {
  'camp_wf_businessline_q1': 'Lisa Chen',
  'camp_wf_sba_7a_rural': 'Robert Martinez',
  'camp_wf_equipment_q4': 'James Nakamura',
};

/**
 * EXPORT 1: WF_CAMPAIGNS
 * Array of campaigns mapped from wellsfargo.json
 */
export const WF_CAMPAIGNS: Campaign[] = typedWFData.campaigns.map((campaign) => {
  // Map performance.targeted → funnel.pushed, performance.reached → funnel.viewed
  const funnel = {
    pushed: campaign.performance.targeted,
    viewed: campaign.performance.reached,
    applied: campaign.performance.applied,
    approved: campaign.performance.approved,
  };

  const viewRate = funnel.viewed / funnel.pushed;
  const applyRate = funnel.applied / funnel.pushed;
  const approvalRate = funnel.applied > 0
    ? funnel.approved / funnel.applied
    : 0;

  const product = mapProductName(campaign.product);
  const targetSegment = mapSegmentToId(campaign.targetSegments[0]);
  const health = deriveHealth(viewRate, campaign.status);
  const owner = CAMPAIGN_OWNERS[campaign.id] || 'WF Campaign Team';

  const warning = viewRate < 0.35
    ? `Low view rate (${(viewRate * 100).toFixed(1)}%) - consider segment refinement`
    : undefined;

  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    health,
    targetSegment,
    targetCriteria: `${campaign.targetSegments.join(' + ')} + Score >50 + ${product} eligible`,
    product,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    owner,
    funnel,
    viewRate,
    applyRate,
    approvalRate,
    approvedVolume: campaign.performance.totalVolume,
    warning,
  };
});

/**
 * EXPORT 2: WF_CAMPAIGN_SUMMARY
 * Aggregated metrics from all campaigns
 */
export const WF_CAMPAIGN_SUMMARY: CampaignSummary = (() => {
  const totalPushed = WF_CAMPAIGNS.reduce((sum, c) => sum + c.funnel.pushed, 0);
  const totalViewed = WF_CAMPAIGNS.reduce((sum, c) => sum + c.funnel.viewed, 0);
  const totalApplied = WF_CAMPAIGNS.reduce((sum, c) => sum + c.funnel.applied, 0);
  const totalApproved = WF_CAMPAIGNS.reduce((sum, c) => sum + c.funnel.approved, 0);
  const totalRevenue = WF_CAMPAIGNS.reduce((sum, c) => sum + c.approvedVolume, 0);

  return {
    activeCampaigns: WF_CAMPAIGNS.length,
    offersPushed: totalPushed,
    avgViewRate: totalPushed > 0 ? totalViewed / totalPushed : 0,
    avgApplyRate: totalPushed > 0 ? totalApplied / totalPushed : 0,
    avgApprovalRate: totalApplied > 0 ? totalApproved / totalApplied : 0,
    revenueBooked: totalRevenue,
  };
})();

/**
 * EXPORT 3: WF_CONVERSION_BY_SEGMENT
 * Conversion rates by segment (8 WF segments with realistic scaling)
 */
export const WF_CONVERSION_BY_SEGMENT: ConversionBySegment[] = [
  {
    segment: 'Technology',
    viewRate: 0.70,
    applyRate: 0.16,
    approvalRate: 0.56,
    endToEnd: 0.70 * 0.16 * 0.56,
    status: 'ok',
  },
  {
    segment: 'Professional Services',
    viewRate: 0.68,
    applyRate: 0.15,
    approvalRate: 0.54,
    endToEnd: 0.68 * 0.15 * 0.54,
    status: 'ok',
  },
  {
    segment: 'Healthcare',
    viewRate: 0.67,
    applyRate: 0.14,
    approvalRate: 0.52,
    endToEnd: 0.67 * 0.14 * 0.52,
    status: 'ok',
  },
  {
    segment: 'Manufacturing',
    viewRate: 0.62,
    applyRate: 0.12,
    approvalRate: 0.48,
    endToEnd: 0.62 * 0.12 * 0.48,
    status: 'warning',
  },
  {
    segment: 'Retail Trade',
    viewRate: 0.60,
    applyRate: 0.11,
    approvalRate: 0.46,
    endToEnd: 0.60 * 0.11 * 0.46,
    status: 'warning',
  },
  {
    segment: 'Construction',
    viewRate: 0.56,
    applyRate: 0.10,
    approvalRate: 0.44,
    endToEnd: 0.56 * 0.10 * 0.44,
    status: 'at_risk',
  },
  {
    segment: 'Food Service & Agriculture',
    viewRate: 0.58,
    applyRate: 0.11,
    approvalRate: 0.47,
    endToEnd: 0.58 * 0.11 * 0.47,
    status: 'warning',
  },
  {
    segment: 'Transportation & Logistics',
    viewRate: 0.55,
    applyRate: 0.10,
    approvalRate: 0.45,
    endToEnd: 0.55 * 0.10 * 0.45,
    status: 'at_risk',
  },
];
