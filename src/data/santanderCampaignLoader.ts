/**
 * Santander Campaign Data Loader
 * Maps santander.json campaign data to Campaign interface used by santanderDemoData.ts
 */

import santanderData from './santander.json';

interface SantanderCampaign {
  id: string;
  name: string;
  product: string;
  product_details: {
    type: string;
    min_amount: number;
    max_amount: number;
    term_months: string;
    rate_range: string;
    features: string[];
  };
  target_segment: string;
  target_count: number;
  eligible_count: number;
  conversion_rate: number;
  expected_volume: number;
  channel: string;
  start_date: string;
  end_date: string;
  status: string;
  messaging: string;
  geographic_focus: string[];
  min_lumiq_score: number;
  min_revenue: number;
  min_time_in_business: number;
  special_programs?: string[];
  industry_focus?: string[];
}

interface SantanderData {
  campaigns: SantanderCampaign[];
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
const typedSantanderData = santanderData as unknown as SantanderData;

/**
 * Map product name to shortened abbreviation
 */
function mapProductName(productName: string): string {
  const productMap: Record<string, string> = {
    'Business Term Loan': 'TERM',
    'SBA Express Loan': 'SBA_EXPRESS',
    'Commercial Real Estate Mortgage': 'CRE',
  };
  return productMap[productName] || productName;
}

/**
 * Map segment name to seg_id format
 */
function mapSegmentToId(segment: string): string {
  const segmentMap: Record<string, string> = {
    'pre-qualified': 'seg_pre-qualified',
    'growth-opportunity': 'seg_growth-opportunity',
    'needs-monitoring': 'seg_needs-monitoring',
    'at-risk': 'seg_at-risk',
  };
  return segmentMap[segment] || `seg_${segment.toLowerCase().replace(/\s+/g, '_')}`;
}

/**
 * Derive campaign owner from channel
 */
function deriveOwner(channel: string, campaign: SantanderCampaign): string {
  if (campaign.special_programs?.includes('Hispanic Business Initiative')) {
    return 'David Morales';
  }
  if (channel.includes('digital')) return 'Sarah Chen';
  if (channel.includes('community')) return 'David Morales';
  if (channel.includes('relationship')) return 'Jennifer Park';
  return 'Michael Thompson';
}

/**
 * Derive campaign health from conversion rate
 */
function deriveHealth(conversionRate: number, status: string): Campaign['health'] {
  if (status === 'paused') return 'paused';
  if (status === 'completed') return 'completed';
  return conversionRate >= 14 ? 'on_track' : 'below_target';
}

/**
 * Build campaign funnel from target_count and conversion_rate
 */
function buildFunnel(campaign: SantanderCampaign) {
  const pushed = campaign.eligible_count;
  const viewed = Math.round(pushed * 0.68); // 68% view rate
  const applied = Math.round(pushed * (campaign.conversion_rate / 100));
  const approved = Math.round(applied * 0.75); // 75% approval rate

  return { pushed, viewed, applied, approved };
}

/**
 * EXPORT 1: SANT_CAMPAIGNS
 * Array of campaigns mapped from santander.json
 */
export const SANT_CAMPAIGNS: Campaign[] = typedSantanderData.campaigns.map((campaign) => {
  const funnel = buildFunnel(campaign);
  const viewRate = funnel.viewed / funnel.pushed;
  const applyRate = funnel.applied / funnel.pushed;
  const approvalRate = funnel.applied > 0 ? funnel.approved / funnel.applied : 0;

  const product = mapProductName(campaign.product);
  const targetSegment = mapSegmentToId(campaign.target_segment);
  const health = deriveHealth(campaign.conversion_rate, campaign.status);

  const warning = viewRate < 0.35
    ? `Low view rate (${(viewRate * 100).toFixed(1)}%) - consider segment refinement`
    : undefined;

  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    health,
    targetSegment,
    targetCriteria: `Score >${campaign.min_lumiq_score} + Revenue >${(campaign.min_revenue / 1000).toFixed(0)}K + ${campaign.min_time_in_business}mo tenure`,
    product,
    startDate: campaign.start_date,
    endDate: campaign.end_date,
    owner: deriveOwner(campaign.channel, campaign),
    funnel,
    viewRate,
    applyRate,
    approvalRate,
    approvedVolume: campaign.expected_volume,
    warning,
  };
});

/**
 * EXPORT 2: SANT_CAMPAIGN_SUMMARY
 * Aggregated metrics from all campaigns
 */
export const SANT_CAMPAIGN_SUMMARY: CampaignSummary = (() => {
  const totalPushed = SANT_CAMPAIGNS.reduce((sum, c) => sum + c.funnel.pushed, 0);
  const totalViewed = SANT_CAMPAIGNS.reduce((sum, c) => sum + c.funnel.viewed, 0);
  const totalApplied = SANT_CAMPAIGNS.reduce((sum, c) => sum + c.funnel.applied, 0);
  const totalApproved = SANT_CAMPAIGNS.reduce((sum, c) => sum + c.funnel.approved, 0);
  const totalRevenue = SANT_CAMPAIGNS.reduce((sum, c) => sum + c.approvedVolume, 0);

  return {
    activeCampaigns: SANT_CAMPAIGNS.length,
    offersPushed: totalPushed,
    avgViewRate: totalPushed > 0 ? totalViewed / totalPushed : 0,
    avgApplyRate: totalPushed > 0 ? totalApplied / totalPushed : 0,
    avgApprovalRate: totalApplied > 0 ? totalApproved / totalApplied : 0,
    revenueBooked: totalRevenue,
  };
})();

/**
 * EXPORT 3: SANT_CONVERSION_BY_SEGMENT
 * Conversion rates by segment (12 industry segments for Santander)
 */
export const SANT_CONVERSION_BY_SEGMENT: ConversionBySegment[] = [
  {
    segment: 'Professional Services',
    viewRate: 0.71,
    applyRate: 0.17,
    approvalRate: 0.57,
    endToEnd: 0.71 * 0.17 * 0.57, // 0.0688
    status: 'ok',
  },
  {
    segment: 'Healthcare Services',
    viewRate: 0.69,
    applyRate: 0.16,
    approvalRate: 0.55,
    endToEnd: 0.69 * 0.16 * 0.55, // 0.0607
    status: 'ok',
  },
  {
    segment: 'Restaurants & Food',
    viewRate: 0.66,
    applyRate: 0.14,
    approvalRate: 0.52,
    endToEnd: 0.66 * 0.14 * 0.52, // 0.0480
    status: 'ok',
  },
  {
    segment: 'Retail & E-Commerce',
    viewRate: 0.64,
    applyRate: 0.13,
    approvalRate: 0.49,
    endToEnd: 0.64 * 0.13 * 0.49, // 0.0408
    status: 'warning',
  },
  {
    segment: 'Construction & Trades',
    viewRate: 0.61,
    applyRate: 0.12,
    approvalRate: 0.48,
    endToEnd: 0.61 * 0.12 * 0.48, // 0.0351
    status: 'warning',
  },
  {
    segment: 'Real Estate Services',
    viewRate: 0.73,
    applyRate: 0.19,
    approvalRate: 0.61,
    endToEnd: 0.73 * 0.19 * 0.61, // 0.0846
    status: 'ok',
  },
  {
    segment: 'Wholesale & Distribution',
    viewRate: 0.67,
    applyRate: 0.15,
    approvalRate: 0.53,
    endToEnd: 0.67 * 0.15 * 0.53, // 0.0532
    status: 'ok',
  },
  {
    segment: 'Technology Services',
    viewRate: 0.70,
    applyRate: 0.16,
    approvalRate: 0.56,
    endToEnd: 0.70 * 0.16 * 0.56, // 0.0627
    status: 'ok',
  },
  {
    segment: 'Manufacturing',
    viewRate: 0.63,
    applyRate: 0.13,
    approvalRate: 0.50,
    endToEnd: 0.63 * 0.13 * 0.50, // 0.0410
    status: 'warning',
  },
  {
    segment: 'Transportation & Logistics',
    viewRate: 0.59,
    applyRate: 0.11,
    approvalRate: 0.46,
    endToEnd: 0.59 * 0.11 * 0.46, // 0.0298
    status: 'at_risk',
  },
  {
    segment: 'Auto Services',
    viewRate: 0.60,
    applyRate: 0.12,
    approvalRate: 0.47,
    endToEnd: 0.60 * 0.12 * 0.47, // 0.0338
    status: 'warning',
  },
  {
    segment: 'Other Services',
    viewRate: 0.58,
    applyRate: 0.10,
    approvalRate: 0.45,
    endToEnd: 0.58 * 0.10 * 0.45, // 0.0261
    status: 'at_risk',
  },
];
