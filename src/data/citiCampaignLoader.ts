/**
 * Citi Campaign Data Loader
 * Maps citi.json campaign data to Campaign interface used by citiDemoData.ts
 */

import citiData from './citi.json';

interface CitiCampaign {
  id: string;
  name: string;
  status: string;
  health: string;
  target_segment: string;
  target_criteria: string;
  product: string;
  start_date: string;
  end_date: string;
  owner: string;
  funnel: {
    pushed: number;
    viewed: number;
    applied: number;
    approved: number;
  };
  view_rate: number;
  apply_rate: number;
  approval_rate: number;
  approved_volume: number;
  description: string;
}

interface CitiCampaignSummary {
  active_campaigns: number;
  offers_pushed: number;
  avg_view_rate: number;
  avg_apply_rate: number;
  avg_approval_rate: number;
  revenue_booked: number;
}

interface CitiData {
  campaigns: CitiCampaign[];
  campaign_summary: CitiCampaignSummary;
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
const typedCitiData = citiData as unknown as CitiData;

/**
 * Map campaign health from string to typed enum
 */
function mapHealth(health: string): Campaign['health'] {
  if (health === 'on_track') return 'on_track';
  if (health === 'below_target') return 'below_target';
  if (health === 'paused') return 'paused';
  if (health === 'completed') return 'completed';
  return 'on_track';
}

/**
 * EXPORT 1: CITI_CAMPAIGNS
 * Array of campaigns mapped from citi.json
 */
export const CITI_CAMPAIGNS: Campaign[] = typedCitiData.campaigns.map((campaign) => {
  const warning = campaign.view_rate < 0.35
    ? `Low view rate (${(campaign.view_rate * 100).toFixed(1)}%) - consider segment refinement`
    : undefined;

  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    health: mapHealth(campaign.health),
    targetSegment: campaign.target_segment,
    targetCriteria: campaign.target_criteria,
    product: campaign.product,
    startDate: campaign.start_date,
    endDate: campaign.end_date,
    owner: campaign.owner,
    funnel: campaign.funnel,
    viewRate: campaign.view_rate,
    applyRate: campaign.apply_rate,
    approvalRate: campaign.approval_rate,
    approvedVolume: campaign.approved_volume,
    warning,
  };
});

/**
 * EXPORT 2: CITI_CAMPAIGN_SUMMARY
 * Aggregated metrics from campaign summary
 */
export const CITI_CAMPAIGN_SUMMARY: CampaignSummary = {
  activeCampaigns: typedCitiData.campaign_summary.active_campaigns,
  offersPushed: typedCitiData.campaign_summary.offers_pushed,
  avgViewRate: typedCitiData.campaign_summary.avg_view_rate,
  avgApplyRate: typedCitiData.campaign_summary.avg_apply_rate,
  avgApprovalRate: typedCitiData.campaign_summary.avg_approval_rate,
  revenueBooked: typedCitiData.campaign_summary.revenue_booked,
};

/**
 * EXPORT 3: CITI_CONVERSION_BY_SEGMENT
 * Conversion rates by segment (8 segments scaled to Citi)
 */
export const CITI_CONVERSION_BY_SEGMENT: ConversionBySegment[] = [
  {
    segment: 'Professional Services',
    viewRate: 0.82,
    applyRate: 0.12,
    approvalRate: 0.84,
    endToEnd: 0.82 * 0.12 * 0.84,
    status: 'ok',
  },
  {
    segment: 'Technology',
    viewRate: 0.78,
    applyRate: 0.13,
    approvalRate: 0.85,
    endToEnd: 0.78 * 0.13 * 0.85,
    status: 'ok',
  },
  {
    segment: 'Healthcare & Life Sciences',
    viewRate: 0.71,
    applyRate: 0.092,
    approvalRate: 0.83,
    endToEnd: 0.71 * 0.092 * 0.83,
    status: 'ok',
  },
  {
    segment: 'Real Estate & Property Services',
    viewRate: 0.65,
    applyRate: 0.087,
    approvalRate: 0.82,
    endToEnd: 0.65 * 0.087 * 0.82,
    status: 'ok',
  },
  {
    segment: 'Retail & E-Commerce',
    viewRate: 0.64,
    applyRate: 0.081,
    approvalRate: 0.80,
    endToEnd: 0.64 * 0.081 * 0.80,
    status: 'warning',
  },
  {
    segment: 'Manufacturing & Distribution',
    viewRate: 0.68,
    applyRate: 0.078,
    approvalRate: 0.80,
    endToEnd: 0.68 * 0.078 * 0.80,
    status: 'warning',
  },
  {
    segment: 'Food Service & Hospitality',
    viewRate: 0.48,
    applyRate: 0.041,
    approvalRate: 0.70,
    endToEnd: 0.48 * 0.041 * 0.70,
    status: 'at_risk',
  },
  {
    segment: 'Other Industries',
    viewRate: 0.56,
    applyRate: 0.063,
    approvalRate: 0.78,
    endToEnd: 0.56 * 0.063 * 0.78,
    status: 'warning',
  },
];
