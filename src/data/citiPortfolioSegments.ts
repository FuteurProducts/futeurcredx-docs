/**
 * citiPortfolioSegments.ts
 *
 * Citibank-specific portfolio analytics data for LumiqAI Dashboard
 * Based on citi.json + citi_segments.json: 450K clients, $98.4B exposure
 *
 * Key differentiators:
 * - Global bank with concentrated US footprint (13 states, 648 branches)
 * - Focus on larger SMBs ($5M-$25M revenue) with international needs
 * - Strong in NYC (35% of clients), SF Bay Area, Miami (Latin America gateway)
 * - Trade finance and cross-border payments expertise
 * - Treasury & Trade Solutions (TTS) platform
 *
 * FICO to LUMIQ conversion: Math.round((fico - 300) / 550 * 100)
 */

import type {
  IndustrySegment,
  PortfolioKPI,
  CampaignData,
  ConcentrationMetric,
  EWSAlertCluster,
  GeographicDistribution,
  RiskTierDistribution,
} from './portfolioSegments';

// ============================================================================
// INDUSTRY SEGMENTS
// Total: 450,000 businesses | $98.4B exposure
// 8 segments from citi_segments.json with Citi's global banking scale
// ============================================================================

export const CITI_INDUSTRY_SEGMENTS: IndustrySegment[] = [
  {
    id: 'seg_tech',
    name: 'Technology',
    icon: 'Laptop',
    businessCount: 68000,
    totalExposure: 17100000000, // $17.1B
    qualRate: 78.0,
    avgScore: 71, // FICO 712 → 74.9, conservative to 71
    highRiskPct: 8.0,
    trend: { direction: 'up', value: 14.0 },
    topProducts: [
      { name: 'CitiBusiness Line of Credit', eligible: 53040 },
      { name: 'Commercial Term Loan', eligible: 48960 },
      { name: 'Trade Finance & Working Capital', eligible: 25840 },
      { name: 'SBA 7(a) Loan', eligible: 23800 },
    ],
    region: {
      Northeast: 23800, // NYC (35%)
      Southeast: 6120,
      Midwest: 4760,
      Southwest: 4420,
      West: 28900, // SF Bay Area (40%)
    },
    riskDistribution: {
      LOW: 28560,
      MODERATE: 23800,
      ELEVATED: 10200,
      HIGH: 4080,
      CRITICAL: 1360,
    },
    avgRevenue: 12500000,
    avgYearsInBusiness: 7.2,
  },
  {
    id: 'seg_prof_services',
    name: 'Professional Services',
    icon: 'Briefcase',
    businessCount: 72000,
    totalExposure: 17600000000, // $17.6B
    qualRate: 82.0,
    avgScore: 73, // FICO 728 → 77.8, conservative to 73
    highRiskPct: 6.0,
    trend: { direction: 'up', value: 9.0 },
    topProducts: [
      { name: 'CitiBusiness Line of Credit', eligible: 59040 },
      { name: 'Commercial Term Loan', eligible: 50400 },
      { name: 'SBA 7(a) Loan', eligible: 21600 },
      { name: 'Trade Finance & Working Capital', eligible: 15840 },
    ],
    region: {
      Northeast: 36000, // NYC (50%)
      Southeast: 7200,
      Midwest: 10800, // Chicago (15%)
      Southwest: 7200,
      West: 10800,
    },
    riskDistribution: {
      LOW: 32400,
      MODERATE: 25920,
      ELEVATED: 9360,
      HIGH: 3600,
      CRITICAL: 720,
    },
    avgRevenue: 9800000,
    avgYearsInBusiness: 10.8,
  },
  {
    id: 'seg_healthcare',
    name: 'Healthcare & Life Sciences',
    icon: 'Heart',
    businessCount: 63000,
    totalExposure: 16700000000, // $16.7B
    qualRate: 71.0,
    avgScore: 70, // FICO 695 → 71.8, conservative to 70
    highRiskPct: 9.0,
    trend: { direction: 'up', value: 11.0 },
    topProducts: [
      { name: 'CitiBusiness Line of Credit', eligible: 44730 },
      { name: 'Commercial Term Loan', eligible: 37800 },
      { name: 'SBA 7(a) Loan', eligible: 18900 },
      { name: 'Equipment Financing', eligible: 17640 },
    ],
    region: {
      Northeast: 17640, // NYC (28%)
      Southeast: 11340, // Miami (18%)
      Midwest: 5670,
      Southwest: 8190,
      West: 20160, // SF Bay Area (32%)
    },
    riskDistribution: {
      LOW: 22050,
      MODERATE: 24570,
      ELEVATED: 10710,
      HIGH: 4410,
      CRITICAL: 1260,
    },
    avgRevenue: 8900000,
    avgYearsInBusiness: 9.4,
  },
  {
    id: 'seg_retail',
    name: 'Retail & E-Commerce',
    icon: 'ShoppingBag',
    businessCount: 81000,
    totalExposure: 14000000000, // $14.0B
    qualRate: 64.0,
    avgScore: 68, // FICO 682 → 69.5, conservative to 68
    highRiskPct: 14.0,
    trend: { direction: 'stable', value: 8.0 },
    topProducts: [
      { name: 'CitiBusiness Line of Credit', eligible: 51840 },
      { name: 'Commercial Term Loan', eligible: 40500 },
      { name: 'Trade Finance & Working Capital', eligible: 36450 },
      { name: 'SBA 7(a) Loan', eligible: 16200 },
    ],
    region: {
      Northeast: 20250, // NYC (25%)
      Southeast: 14580, // Miami (18%)
      Midwest: 9720,
      Southwest: 11340,
      West: 25110, // LA (22%) + SF (12%)
    },
    riskDistribution: {
      LOW: 22680,
      MODERATE: 30780,
      ELEVATED: 16200,
      HIGH: 8100,
      CRITICAL: 3240,
    },
    avgRevenue: 7200000,
    avgYearsInBusiness: 8.1,
  },
  {
    id: 'seg_manufacturing',
    name: 'Manufacturing & Distribution',
    icon: 'Factory',
    businessCount: 54000,
    totalExposure: 17300000000, // $17.3B
    qualRate: 68.0,
    avgScore: 69, // FICO 688 → 70.5, conservative to 69
    highRiskPct: 10.0,
    trend: { direction: 'stable', value: 6.0 },
    topProducts: [
      { name: 'Trade Finance & Working Capital', eligible: 30240 },
      { name: 'CitiBusiness Line of Credit', eligible: 36720 },
      { name: 'Commercial Term Loan', eligible: 32400 },
      { name: 'Equipment Financing', eligible: 21600 },
    ],
    region: {
      Northeast: 10800, // NYC (20%)
      Southeast: 6480,
      Midwest: 13500, // Chicago (25%)
      Southwest: 7020,
      West: 16200, // LA/Long Beach port (30%)
    },
    riskDistribution: {
      LOW: 17280,
      MODERATE: 21600,
      ELEVATED: 9720,
      HIGH: 4320,
      CRITICAL: 1080,
    },
    avgRevenue: 11200000,
    avgYearsInBusiness: 12.3,
  },
  {
    id: 'seg_real_estate',
    name: 'Real Estate & Property Services',
    icon: 'Building2',
    businessCount: 45000,
    totalExposure: 17100000000, // $17.1B
    qualRate: 65.0,
    avgScore: 70, // FICO 702 → 73.1, conservative to 70
    highRiskPct: 9.0,
    trend: { direction: 'up', value: 5.0 },
    topProducts: [
      { name: 'Commercial Term Loan', eligible: 29250 },
      { name: 'CitiBusiness Line of Credit', eligible: 27000 },
      { name: 'Commercial Real Estate Loan', eligible: 22500 },
      { name: 'SBA 7(a) Loan', eligible: 13500 },
    ],
    region: {
      Northeast: 18000, // NYC (40%)
      Southeast: 9000, // Miami (20%)
      Midwest: 4050,
      Southwest: 4500,
      West: 9450, // SF (15%) + LA (12%)
    },
    riskDistribution: {
      LOW: 17100,
      MODERATE: 16650,
      ELEVATED: 7200,
      HIGH: 3150,
      CRITICAL: 900,
    },
    avgRevenue: 9500000,
    avgYearsInBusiness: 11.7,
  },
  {
    id: 'seg_food_service',
    name: 'Food Service & Hospitality',
    icon: 'UtensilsCrossed',
    businessCount: 36000,
    totalExposure: 5200000000, // $5.2B
    qualRate: 48.0,
    avgScore: 67, // FICO 668 → 66.9, conservative to 67
    highRiskPct: 21.0,
    trend: { direction: 'stable', value: 4.0 },
    topProducts: [
      { name: 'CitiBusiness Line of Credit', eligible: 17280 },
      { name: 'Commercial Term Loan', eligible: 14400 },
      { name: 'SBA 7(a) Loan', eligible: 8640 },
      { name: 'Equipment Financing', eligible: 7920 },
    ],
    region: {
      Northeast: 9360, // NYC (26%)
      Southeast: 10080, // Miami (28%)
      Midwest: 5040, // Chicago (14%)
      Southwest: 5040,
      West: 6480, // SF (18%)
    },
    riskDistribution: {
      LOW: 6480,
      MODERATE: 12600,
      ELEVATED: 9360,
      HIGH: 5040,
      CRITICAL: 2520,
    },
    avgRevenue: 5800000,
    avgYearsInBusiness: 6.9,
  },
  {
    id: 'seg_other',
    name: 'Other Industries',
    icon: 'MoreHorizontal',
    businessCount: 31000,
    totalExposure: 5400000000, // $5.4B
    qualRate: 56.0,
    avgScore: 68, // FICO 675 → 68.2, conservative to 68
    highRiskPct: 16.0,
    trend: { direction: 'stable', value: 3.0 },
    topProducts: [
      { name: 'CitiBusiness Line of Credit', eligible: 17360 },
      { name: 'Commercial Term Loan', eligible: 15500 },
      { name: 'SBA 7(a) Loan', eligible: 7750 },
      { name: 'Equipment Financing', eligible: 6820 },
    ],
    region: {
      Northeast: 9300, // NYC (30%)
      Southeast: 5580,
      Midwest: 6200, // Chicago (20%)
      Southwest: 4030,
      West: 5890, // LA (18%)
    },
    riskDistribution: {
      LOW: 7440,
      MODERATE: 11780,
      ELEVATED: 6820,
      HIGH: 3720,
      CRITICAL: 1240,
    },
    avgRevenue: 6800000,
    avgYearsInBusiness: 8.5,
  },
];

// Validation: 68000 + 72000 + 63000 + 81000 + 54000 + 45000 + 36000 + 31000 = 450,000 ✓

// ============================================================================
// PORTFOLIO KPIS
// ============================================================================

export const CITI_PORTFOLIO_KPIS: PortfolioKPI[] = [
  {
    id: 'total-portfolio',
    label: 'Total Portfolio',
    value: 450000,
    format: 'number',
    trend: { direction: 'up', value: 2.5, label: '+2.5% vs last quarter' },
    status: 'positive',
    tooltip: 'Total number of businesses in portfolio',
    dataSource: 'Portfolio Management System',
  },
  {
    id: 'total-exposure',
    label: 'Total Exposure',
    value: 98400000000, // $98.4B
    format: 'currency',
    trend: { direction: 'up', value: 4.2, label: '+4.2% vs last quarter' },
    status: 'positive',
    tooltip: 'Total outstanding credit exposure across all products',
    dataSource: 'Credit Ledger',
  },
  {
    id: 'qualification-rate',
    label: 'Qualification Rate',
    value: 62.0, // Higher than Chase/WF due to larger SMB focus
    format: 'percent',
    trend: { direction: 'up', value: 1.4, label: '+1.4pp vs last quarter' },
    status: 'positive',
    tooltip: 'Percentage of businesses qualifying for at least one product',
    dataSource: 'Underwriting Engine',
  },
  {
    id: 'avg-credit-score',
    label: 'Avg Credit Score',
    value: 69.5, // FICO 695 → 71.8, conservative to 69.5
    format: 'score',
    trend: { direction: 'up', value: 0.4, label: '+0.4pts vs last quarter' },
    status: 'neutral',
    tooltip: 'Portfolio-weighted average credit score (0-100 scale)',
    dataSource: 'Risk Analytics',
  },
  {
    id: 'at-risk-businesses',
    label: 'At-Risk Businesses',
    value: 54000, // 12.0% (HIGH + CRITICAL tiers)
    format: 'number',
    trend: { direction: 'down', value: -2.8, label: '-2.8% vs last quarter' },
    status: 'warning',
    tooltip: 'Businesses with HIGH or CRITICAL risk tier (12.0% of portfolio)',
    dataSource: 'Early Warning System',
  },
  {
    id: 'offer-pipeline',
    label: 'Offer Pipeline',
    value: 84000000000, // $84.0B (from citi.json)
    format: 'currency',
    trend: { direction: 'up', value: 9.2, label: '+9.2% vs last quarter' },
    status: 'positive',
    tooltip: 'Total value of pre-qualified offers pending business action',
    dataSource: 'Offer Management',
  },
];

// ============================================================================
// GEOGRAPHIC DISTRIBUTION
// Total: 450,000 businesses | $98.4B exposure
// Citi footprint: NYC-dominant (35%), SF, Miami, Chicago, LA
// ============================================================================

export const CITI_GEOGRAPHIC_DISTRIBUTION: GeographicDistribution[] = [
  {
    region: 'Northeast',
    states: ['NY', 'CT', 'NJ', 'PA', 'MA', 'DC'],
    businessCount: 198000, // 44.0%
    exposure: 43300000000, // $43.3B
    avgScore: 71.8,
    qualRate: 68.0,
  },
  {
    region: 'West',
    states: ['CA', 'WA', 'OR', 'NV'],
    businessCount: 108000, // 24.0%
    exposure: 28100000000, // $28.1B
    avgScore: 72.4,
    qualRate: 66.0,
  },
  {
    region: 'Southeast',
    states: ['FL', 'GA', 'NC', 'VA'],
    businessCount: 81000, // 18.0%
    exposure: 16400000000, // $16.4B
    avgScore: 69.2,
    qualRate: 61.0,
  },
  {
    region: 'Midwest',
    states: ['IL', 'OH', 'MI', 'IN', 'WI', 'MN'],
    businessCount: 45000, // 10.0%
    exposure: 8900000000, // $8.9B
    avgScore: 70.1,
    qualRate: 58.0,
  },
  {
    region: 'Southwest',
    states: ['TX', 'AZ', 'NM', 'OK'],
    businessCount: 18000, // 4.0%
    exposure: 1700000000, // $1.7B
    avgScore: 68.8,
    qualRate: 55.0,
  },
];

// Validation: 198000 + 108000 + 81000 + 45000 + 18000 = 450,000 ✓

// ============================================================================
// RISK TIER DISTRIBUTION
// Total: 450,000 businesses
// From citi.json risk_tiers distribution
// ============================================================================

export const CITI_RISK_TIER_DISTRIBUTION: RiskTierDistribution[] = [
  {
    tier: 'LOW',
    count: 139500, // 31.0%
    percentage: 31.0,
    exposure: 31400000000, // $31.4B
    avgScore: 85, // FICO 790+ → 89.1, conservative to 85
    color: 'bg-green-500',
  },
  {
    tier: 'MODERATE',
    count: 171000, // 38.0%
    percentage: 38.0,
    exposure: 37800000000, // $37.8B
    avgScore: 73, // FICO 725 → 77.3
    color: 'bg-blue-500',
  },
  {
    tier: 'ELEVATED',
    count: 85500, // 19.0%
    percentage: 19.0,
    exposure: 19200000000, // $19.2B
    avgScore: 64, // FICO 665 → 66.4
    color: 'bg-yellow-500',
  },
  {
    tier: 'HIGH',
    count: 40500, // 9.0%
    percentage: 9.0,
    exposure: 7600000000, // $7.6B
    avgScore: 52, // FICO 615 → 57.3, conservative to 52
    color: 'bg-orange-500',
  },
  {
    tier: 'CRITICAL',
    count: 13500, // 3.0%
    percentage: 3.0,
    exposure: 2400000000, // $2.4B
    avgScore: 37, // FICO 555 → 46.4, conservative to 37
    color: 'bg-red-500',
  },
];

// Validation: 139500 + 171000 + 85500 + 40500 + 13500 = 450,000 ✓

// ============================================================================
// CONCENTRATION METRICS
// ============================================================================

export const CITI_CONCENTRATION_METRICS: ConcentrationMetric[] = [
  {
    dimension: 'Industry',
    segments: [
      { name: 'Retail & E-Commerce', percentage: 18.0, exposure: 14000000000 },
      { name: 'Professional Services', percentage: 16.0, exposure: 17600000000 },
      { name: 'Technology', percentage: 15.1, exposure: 17100000000 },
      { name: 'Healthcare & Life Sciences', percentage: 14.0, exposure: 16700000000 },
      { name: 'Manufacturing & Distribution', percentage: 12.0, exposure: 17300000000 },
      { name: 'Other Industries', percentage: 24.9, exposure: 15700000000 },
    ],
    threshold: 20.0,
    status: 'within',
  },
  {
    dimension: 'Geographic',
    segments: [
      { name: 'Northeast', percentage: 44.0, exposure: 43300000000 },
      { name: 'West', percentage: 24.0, exposure: 28100000000 },
      { name: 'Southeast', percentage: 18.0, exposure: 16400000000 },
      { name: 'Midwest', percentage: 10.0, exposure: 8900000000 },
      { name: 'Southwest', percentage: 4.0, exposure: 1700000000 },
    ],
    threshold: 35.0,
    status: 'exceeded', // Northeast at 44.0%
  },
  {
    dimension: 'Revenue Band',
    segments: [
      { name: '$0-$1M', percentage: 12.4, exposure: 12201600000 },
      { name: '$1M-$2.5M', percentage: 18.6, exposure: 18302400000 },
      { name: '$2.5M-$5M', percentage: 23.8, exposure: 23419200000 },
      { name: '$5M-$10M', percentage: 26.4, exposure: 25977600000 },
      { name: '$10M+', percentage: 18.8, exposure: 18498000000 },
    ],
    threshold: 25.0,
    status: 'approaching', // $5M-$10M at 26.4%
  },
];

// ============================================================================
// EARLY WARNING SYSTEM ALERT CLUSTERS
// ============================================================================

export const CITI_EWS_ALERT_CLUSTERS: EWSAlertCluster[] = [
  {
    type: 'Score Drop >15pts',
    severity: 'critical',
    businessCount: 1247, // 0.28% of portfolio
    totalExposure: 218000000, // $218M
    topIndustries: [
      { name: 'Retail & E-Commerce', count: 389 },
      { name: 'Food Service & Hospitality', count: 312 },
      { name: 'Manufacturing & Distribution', count: 221 },
      { name: 'Other Industries', count: 186 },
      { name: 'Technology', count: 139 },
    ],
    trend: 'increasing',
  },
  {
    type: 'Delinquency Reported',
    severity: 'critical',
    businessCount: 387, // 0.086% (lower than industry due to larger SMB focus)
    totalExposure: 124000000, // $124M
    topIndustries: [
      { name: 'Food Service & Hospitality', count: 118 },
      { name: 'Retail & E-Commerce', count: 97 },
      { name: 'Manufacturing & Distribution', count: 78 },
      { name: 'Other Industries', count: 54 },
      { name: 'Healthcare & Life Sciences', count: 40 },
    ],
    trend: 'stable',
  },
  {
    type: 'Lien Filed',
    severity: 'warning',
    businessCount: 189, // 0.042%
    totalExposure: 67000000, // $67M
    topIndustries: [
      { name: 'Manufacturing & Distribution', count: 62 },
      { name: 'Real Estate & Property Services', count: 48 },
      { name: 'Other Industries', count: 35 },
      { name: 'Retail & E-Commerce', count: 28 },
      { name: 'Technology', count: 16 },
    ],
    trend: 'decreasing',
  },
  {
    type: 'Bankruptcy Watch',
    severity: 'critical',
    businessCount: 94, // 0.021%
    totalExposure: 52000000, // $52M
    topIndustries: [
      { name: 'Food Service & Hospitality', count: 31 },
      { name: 'Retail & E-Commerce', count: 24 },
      { name: 'Other Industries', count: 18 },
      { name: 'Manufacturing & Distribution', count: 12 },
      { name: 'Real Estate & Property Services', count: 9 },
    ],
    trend: 'stable',
  },
  {
    type: 'International Trade Risk',
    severity: 'warning',
    businessCount: 930, // Citi-specific: cross-border exposure
    totalExposure: 412000000, // $412M
    topIndustries: [
      { name: 'Manufacturing & Distribution', count: 312 },
      { name: 'Retail & E-Commerce', count: 287 },
      { name: 'Technology', count: 186 },
      { name: 'Other Industries', count: 89 },
      { name: 'Healthcare & Life Sciences', count: 56 },
    ],
    trend: 'increasing',
  },
];

// ============================================================================
// ACTIVE CAMPAIGNS
// From citi.json campaigns array
// ============================================================================

export const CITI_ACTIVE_CAMPAIGNS: CampaignData[] = [
  {
    id: 'camp_citi_tech_wc_q1',
    name: 'Q1 2026 Tech Working Capital — CitiBusiness Line of Credit',
    segment: 'Technology',
    product: 'CitiBusiness Line of Credit',
    status: 'active',
    startDate: '2026-01-15',
    endDate: '2026-03-31',
    funnel: {
      pushed: 25840,
      viewed: 12920,
      applied: 3360,
      approved: 2856,
    },
    approvedVolume: 892000000, // $892M
  },
  {
    id: 'camp_citi_prof_services_q1',
    name: 'Professional Services Growth — Commercial Term Loan',
    segment: 'Professional Services',
    product: 'Commercial Term Loan',
    status: 'active',
    startDate: '2026-02-01',
    endDate: '2026-04-30',
    funnel: {
      pushed: 21600,
      viewed: 10800,
      applied: 2592,
      approved: 2177,
    },
    approvedVolume: 678000000, // $678M
  },
  {
    id: 'camp_citi_trade_finance_q1',
    name: 'Import/Export Trade Finance Expansion',
    segment: 'Retail & E-Commerce, Manufacturing & Distribution',
    product: 'Trade Finance & Working Capital',
    status: 'active',
    startDate: '2026-01-20',
    endDate: '2026-05-15',
    funnel: {
      pushed: 32400,
      viewed: 14580,
      applied: 3240,
      approved: 2592,
    },
    approvedVolume: 524000000, // $524M
  },
];

// ============================================================================
// COMPLETED CAMPAIGNS
// ============================================================================

export const CITI_COMPLETED_CAMPAIGNS: CampaignData[] = [
  {
    id: 'camp_citi_c01',
    name: 'Q4 2025 Healthcare Equipment Finance',
    segment: 'Healthcare & Life Sciences',
    product: 'Equipment Financing',
    status: 'completed',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    funnel: {
      pushed: 17640,
      viewed: 8820,
      applied: 1764,
      approved: 1411,
    },
    approvedVolume: 342500000,
  },
  {
    id: 'camp_citi_c02',
    name: 'Real Estate Fall 2025 CRE Loan',
    segment: 'Real Estate & Property Services',
    product: 'Commercial Real Estate Application',
    status: 'completed',
    startDate: '2025-09-01',
    endDate: '2025-11-30',
    funnel: {
      pushed: 13500,
      viewed: 6750,
      applied: 1080,
      approved: 810,
    },
    approvedVolume: 648000000,
  },
  {
    id: 'camp_citi_c03',
    name: 'Manufacturing Trade Finance Summer',
    segment: 'Manufacturing & Distribution',
    product: 'Trade Finance & Working Capital',
    status: 'completed',
    startDate: '2025-07-15',
    endDate: '2025-09-30',
    funnel: {
      pushed: 30240,
      viewed: 13608,
      applied: 2721,
      approved: 2177,
    },
    approvedVolume: 487200000,
  },
  {
    id: 'camp_citi_c04',
    name: 'Technology Term Loan Q2',
    segment: 'Technology',
    product: 'Commercial Term Loan',
    status: 'completed',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    funnel: {
      pushed: 48960,
      viewed: 22032,
      applied: 4896,
      approved: 4116,
    },
    approvedVolume: 1028000000,
  },
  {
    id: 'camp_citi_c05',
    name: 'Retail E-Commerce Spring LOC',
    segment: 'Retail & E-Commerce',
    product: 'CitiBusiness Line of Credit',
    status: 'completed',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    funnel: {
      pushed: 51840,
      viewed: 23328,
      applied: 5184,
      approved: 4147,
    },
    approvedVolume: 624200000,
  },
  {
    id: 'camp_citi_c06',
    name: 'Professional Services LOC Winter',
    segment: 'Professional Services',
    product: 'CitiBusiness Line of Credit',
    status: 'completed',
    startDate: '2025-05-15',
    endDate: '2025-07-31',
    funnel: {
      pushed: 59040,
      viewed: 29520,
      applied: 5904,
      approved: 4959,
    },
    approvedVolume: 743800000,
  },
];

// ============================================================================
// PRODUCT ELIGIBILITY
// ============================================================================

export const CITI_PRODUCT_ELIGIBILITY: Record<string, { eligible: number; conversionRate: number }> = {
  'CitiBusiness Line of Credit': {
    eligible: 317270, // 70.5% of portfolio (from citi.json)
    conversionRate: 15.2,
  },
  'Commercial Term Loan': {
    eligible: 281360, // 62.5%
    conversionRate: 13.8,
  },
  'SBA 7(a) Loan': {
    eligible: 132210, // 29.4%
    conversionRate: 19.4,
  },
  'Trade Finance & Working Capital': {
    eligible: 132030, // 29.3% — Citi's differentiator
    conversionRate: 11.7,
  },
  'Commercial Real Estate Loan': {
    eligible: 67500, // 15.0%
    conversionRate: 22.8,
  },
  'Equipment Financing': {
    eligible: 189000, // 42.0%
    conversionRate: 17.1,
  },
  'CitiBusiness Credit Card': {
    eligible: 389310, // 86.5%
    conversionRate: 9.4,
  },
};
