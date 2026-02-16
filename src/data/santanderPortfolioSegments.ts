/**
 * santanderPortfolioSegments.ts
 *
 * Santander-specific portfolio analytics data for LumiqAI Dashboard
 * Based on sant_segments.json: 68,500 businesses, $5.8B exposure
 *
 * Regional focus: Northeast-heavy (63.5%), Hispanic business community partnership
 * Product mix: Term Loan, SBA Express, CRE Mortgage focus
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
// Total: 68,500 businesses | $5.8B exposure
// 12 segments from sant_segments.json with Santander's SMB scale
// ============================================================================

export const SANT_INDUSTRY_SEGMENTS: IndustrySegment[] = [
  {
    id: 'seg_prof_services',
    name: 'Professional Services',
    icon: 'Briefcase',
    businessCount: 10800,
    totalExposure: 470000000, // $470M
    qualRate: 41.3,
    avgScore: 75.8,
    highRiskPct: 5.8,
    trend: { direction: 'up', value: 1.8 },
    topProducts: [
      { name: 'Term Loan', eligible: 4460 },
      { name: 'Line of Credit', eligible: 3240 },
      { name: 'SBA 7(a)', eligible: 2160 },
      { name: 'Equipment Financing', eligible: 1620 },
    ],
    region: {
      Northeast: 6858, // 63.5%
      Southeast: 1782, // 16.5%
      Midwest: 896, // 8.3%
      Southwest: 670, // 6.2%
      West: 594, // 5.5% (adjusted)
    },
    riskDistribution: {
      LOW: 4428, // 41.0%
      MODERATE: 3013, // 27.9%
      ELEVATED: 1966, // 18.2%
      HIGH: 1080, // 10.0%
      CRITICAL: 313, // 2.9%
    },
    avgRevenue: 2300000,
    avgYearsInBusiness: 10.2,
  },
  {
    id: 'seg_healthcare',
    name: 'Healthcare Services',
    icon: 'Heart',
    businessCount: 9500,
    totalExposure: 615000000, // $615M
    qualRate: 44.7,
    avgScore: 79.2,
    highRiskPct: 4.2,
    trend: { direction: 'up', value: 5.1 },
    topProducts: [
      { name: 'Term Loan', eligible: 4250 },
      { name: 'SBA 7(a)', eligible: 2850 },
      { name: 'Equipment Financing', eligible: 2375 },
      { name: 'Line of Credit', eligible: 1900 },
    ],
    region: {
      Northeast: 6033, // 63.5%
      Southeast: 1568, // 16.5%
      Midwest: 789, // 8.3%
      Southwest: 589, // 6.2%
      West: 521, // 5.5%
    },
    riskDistribution: {
      LOW: 3895, // 41.0%
      MODERATE: 2651, // 27.9%
      ELEVATED: 1729, // 18.2%
      HIGH: 950, // 10.0%
      CRITICAL: 275, // 2.9%
    },
    avgRevenue: 3400000,
    avgYearsInBusiness: 12.8,
  },
  {
    id: 'seg_restaurants',
    name: 'Restaurants & Food',
    icon: 'UtensilsCrossed',
    businessCount: 10200,
    totalExposure: 344000000, // $344M
    qualRate: 30.2,
    avgScore: 66.4,
    highRiskPct: 12.9,
    trend: { direction: 'down', value: -0.8 },
    topProducts: [
      { name: 'Line of Credit', eligible: 3080 },
      { name: 'Equipment Financing', eligible: 2550 },
      { name: 'Term Loan', eligible: 2040 },
      { name: 'SBA 7(a)', eligible: 1530 },
    ],
    region: {
      Northeast: 6477, // 63.5%
      Southeast: 1683, // 16.5%
      Midwest: 847, // 8.3%
      Southwest: 632, // 6.2%
      West: 561, // 5.5%
    },
    riskDistribution: {
      LOW: 4182, // 41.0%
      MODERATE: 2846, // 27.9%
      ELEVATED: 1856, // 18.2%
      HIGH: 1020, // 10.0%
      CRITICAL: 296, // 2.9%
    },
    avgRevenue: 1800000,
    avgYearsInBusiness: 6.4,
  },
  {
    id: 'seg_retail',
    name: 'Retail & E-Commerce',
    icon: 'ShoppingBag',
    businessCount: 8900,
    totalExposure: 506000000, // $506M
    qualRate: 37.8,
    avgScore: 73.6,
    highRiskPct: 7.1,
    trend: { direction: 'up', value: 2.6 },
    topProducts: [
      { name: 'Line of Credit', eligible: 3560 },
      { name: 'Term Loan', eligible: 2670 },
      { name: 'Equipment Financing', eligible: 1780 },
      { name: 'SBA 7(a)', eligible: 1335 },
    ],
    region: {
      Northeast: 5652, // 63.5%
      Southeast: 1469, // 16.5%
      Midwest: 739, // 8.3%
      Southwest: 552, // 6.2%
      West: 488, // 5.5%
    },
    riskDistribution: {
      LOW: 3649, // 41.0%
      MODERATE: 2483, // 27.9%
      ELEVATED: 1620, // 18.2%
      HIGH: 890, // 10.0%
      CRITICAL: 258, // 2.9%
    },
    avgRevenue: 3000000,
    avgYearsInBusiness: 8.9,
  },
  {
    id: 'seg_construction',
    name: 'Construction & Trades',
    icon: 'HardHat',
    businessCount: 7600,
    totalExposure: 741000000, // $741M
    qualRate: 33.1,
    avgScore: 69.7,
    highRiskPct: 10.2,
    trend: { direction: 'up', value: 2.3 },
    topProducts: [
      { name: 'Equipment Financing', eligible: 2514 },
      { name: 'Line of Credit', eligible: 2280 },
      { name: 'Term Loan', eligible: 1900 },
      { name: 'SBA 7(a)', eligible: 1520 },
    ],
    region: {
      Northeast: 4826, // 63.5%
      Southeast: 1254, // 16.5%
      Midwest: 631, // 8.3%
      Southwest: 471, // 6.2%
      West: 418, // 5.5%
    },
    riskDistribution: {
      LOW: 3116, // 41.0%
      MODERATE: 2120, // 27.9%
      ELEVATED: 1383, // 18.2%
      HIGH: 760, // 10.0%
      CRITICAL: 221, // 2.9%
    },
    avgRevenue: 5100000,
    avgYearsInBusiness: 9.7,
  },
  {
    id: 'seg_realestate',
    name: 'Real Estate Services',
    icon: 'Building2',
    businessCount: 4100,
    totalExposure: 1120000000, // $1.12B
    qualRate: 39.4,
    avgScore: 74.8,
    highRiskPct: 6.3,
    trend: { direction: 'up', value: 4.2 },
    topProducts: [
      { name: 'Commercial Real Estate Loan', eligible: 1640 },
      { name: 'Term Loan', eligible: 1230 },
      { name: 'Line of Credit', eligible: 1025 },
      { name: 'SBA 504', eligible: 615 },
    ],
    region: {
      Northeast: 2604, // 63.5%
      Southeast: 677, // 16.5%
      Midwest: 340, // 8.3%
      Southwest: 254, // 6.2%
      West: 225, // 5.5%
    },
    riskDistribution: {
      LOW: 1681, // 41.0%
      MODERATE: 1144, // 27.9%
      ELEVATED: 746, // 18.2%
      HIGH: 410, // 10.0%
      CRITICAL: 119, // 2.9%
    },
    avgRevenue: 14300000,
    avgYearsInBusiness: 13.2,
  },
  {
    id: 'seg_wholesale',
    name: 'Wholesale & Distribution',
    icon: 'Package',
    businessCount: 4500,
    totalExposure: 461000000, // $461M
    qualRate: 36.5,
    avgScore: 72.8,
    highRiskPct: 7.8,
    trend: { direction: 'stable', value: 0.4 },
    topProducts: [
      { name: 'Line of Credit', eligible: 1643 },
      { name: 'Term Loan', eligible: 1350 },
      { name: 'Equipment Financing', eligible: 1125 },
      { name: 'SBA 7(a)', eligible: 675 },
    ],
    region: {
      Northeast: 2858, // 63.5%
      Southeast: 743, // 16.5%
      Midwest: 374, // 8.3%
      Southwest: 279, // 6.2%
      West: 246, // 5.5%
    },
    riskDistribution: {
      LOW: 1845, // 41.0%
      MODERATE: 1256, // 27.9%
      ELEVATED: 819, // 18.2%
      HIGH: 450, // 10.0%
      CRITICAL: 130, // 2.9%
    },
    avgRevenue: 5400000,
    avgYearsInBusiness: 11.6,
  },
  {
    id: 'seg_tech',
    name: 'Technology Services',
    icon: 'Laptop',
    businessCount: 3300,
    totalExposure: 380000000, // $380M
    qualRate: 46.8,
    avgScore: 82.1,
    highRiskPct: 3.7,
    trend: { direction: 'up', value: 6.4 },
    topProducts: [
      { name: 'Term Loan', eligible: 1544 },
      { name: 'Line of Credit', eligible: 1320 },
      { name: 'SBA 7(a)', eligible: 990 },
      { name: 'Equipment Financing', eligible: 660 },
    ],
    region: {
      Northeast: 2096, // 63.5%
      Southeast: 545, // 16.5%
      Midwest: 274, // 8.3%
      Southwest: 205, // 6.2%
      West: 180, // 5.5%
    },
    riskDistribution: {
      LOW: 1353, // 41.0%
      MODERATE: 921, // 27.9%
      ELEVATED: 601, // 18.2%
      HIGH: 330, // 10.0%
      CRITICAL: 95, // 2.9%
    },
    avgRevenue: 6000000,
    avgYearsInBusiness: 7.3,
  },
  {
    id: 'seg_manufacturing',
    name: 'Manufacturing',
    icon: 'Factory',
    businessCount: 3000,
    totalExposure: 560000000, // $560M
    qualRate: 41.6,
    avgScore: 77.3,
    highRiskPct: 5.2,
    trend: { direction: 'stable', value: -0.1 },
    topProducts: [
      { name: 'Equipment Financing', eligible: 1248 },
      { name: 'Term Loan', eligible: 1200 },
      { name: 'Line of Credit', eligible: 900 },
      { name: 'SBA 7(a)', eligible: 600 },
    ],
    region: {
      Northeast: 1905, // 63.5%
      Southeast: 495, // 16.5%
      Midwest: 249, // 8.3%
      Southwest: 186, // 6.2%
      West: 165, // 5.5%
    },
    riskDistribution: {
      LOW: 1230, // 41.0%
      MODERATE: 837, // 27.9%
      ELEVATED: 546, // 18.2%
      HIGH: 300, // 10.0%
      CRITICAL: 87, // 2.9%
    },
    avgRevenue: 9800000,
    avgYearsInBusiness: 15.1,
  },
  {
    id: 'seg_transportation',
    name: 'Transportation & Logistics',
    icon: 'Truck',
    businessCount: 2700,
    totalExposure: 308000000, // $308M
    qualRate: 35.2,
    avgScore: 71.4,
    highRiskPct: 8.5,
    trend: { direction: 'up', value: 2.7 },
    topProducts: [
      { name: 'Equipment Financing', eligible: 950 },
      { name: 'Line of Credit', eligible: 810 },
      { name: 'Term Loan', eligible: 675 },
      { name: 'Commercial Auto Financing', eligible: 540 },
    ],
    region: {
      Northeast: 1715, // 63.5%
      Southeast: 446, // 16.5%
      Midwest: 224, // 8.3%
      Southwest: 167, // 6.2%
      West: 148, // 5.5%
    },
    riskDistribution: {
      LOW: 1107, // 41.0%
      MODERATE: 753, // 27.9%
      ELEVATED: 491, // 18.2%
      HIGH: 270, // 10.0%
      CRITICAL: 79, // 2.9%
    },
    avgRevenue: 6000000,
    avgYearsInBusiness: 10.8,
  },
  {
    id: 'seg_auto',
    name: 'Auto Services',
    icon: 'Car',
    businessCount: 2000,
    totalExposure: 163000000, // $163M
    qualRate: 31.9,
    avgScore: 68.2,
    highRiskPct: 11.3,
    trend: { direction: 'down', value: -1.2 },
    topProducts: [
      { name: 'Equipment Financing', eligible: 638 },
      { name: 'Line of Credit', eligible: 600 },
      { name: 'Term Loan', eligible: 500 },
      { name: 'SBA 7(a)', eligible: 300 },
    ],
    region: {
      Northeast: 1270, // 63.5%
      Southeast: 330, // 16.5%
      Midwest: 166, // 8.3%
      Southwest: 124, // 6.2%
      West: 110, // 5.5%
    },
    riskDistribution: {
      LOW: 820, // 41.0%
      MODERATE: 558, // 27.9%
      ELEVATED: 364, // 18.2%
      HIGH: 200, // 10.0%
      CRITICAL: 58, // 2.9%
    },
    avgRevenue: 4200000,
    avgYearsInBusiness: 9.2,
  },
  {
    id: 'seg_other',
    name: 'Other Services',
    icon: 'MoreHorizontal',
    businessCount: 1900,
    totalExposure: 132000000, // $132M
    qualRate: 33.8,
    avgScore: 70.6,
    highRiskPct: 9.4,
    trend: { direction: 'stable', value: 0.3 },
    topProducts: [
      { name: 'Line of Credit', eligible: 642 },
      { name: 'Term Loan', eligible: 570 },
      { name: 'Equipment Financing', eligible: 475 },
      { name: 'SBA 7(a)', eligible: 285 },
    ],
    region: {
      Northeast: 1207, // 63.5%
      Southeast: 314, // 16.5%
      Midwest: 158, // 8.3%
      Southwest: 118, // 6.2%
      West: 103, // 5.5%
    },
    riskDistribution: {
      LOW: 779, // 41.0%
      MODERATE: 530, // 27.9%
      ELEVATED: 346, // 18.2%
      HIGH: 190, // 10.0%
      CRITICAL: 55, // 2.9%
    },
    avgRevenue: 3600000,
    avgYearsInBusiness: 8.4,
  },
];

// Validation: 10800 + 9500 + 10200 + 8900 + 7600 + 4100 + 4500 + 3300 + 3000 + 2700 + 2000 + 1900 = 68,500 ✓

// ============================================================================
// PORTFOLIO KPIS
// ============================================================================

export const SANT_PORTFOLIO_KPIS: PortfolioKPI[] = [
  {
    id: 'total-portfolio',
    label: 'Total Portfolio',
    value: 68500,
    format: 'number',
    trend: { direction: 'up', value: 3.1, label: '+3.1% vs last quarter' },
    status: 'positive',
    tooltip: 'Total number of businesses in portfolio',
    dataSource: 'Portfolio Management System',
  },
  {
    id: 'total-exposure',
    label: 'Total Exposure',
    value: 5800000000, // $5.8B
    format: 'currency',
    trend: { direction: 'up', value: 4.2, label: '+4.2% vs last quarter' },
    status: 'positive',
    tooltip: 'Total outstanding credit exposure across all products',
    dataSource: 'Credit Ledger',
  },
  {
    id: 'qualification-rate',
    label: 'Qualification Rate',
    value: 35.8,
    format: 'percent',
    trend: { direction: 'up', value: 1.8, label: '+1.8pp vs last quarter' },
    status: 'positive',
    tooltip: 'Percentage of businesses qualifying for at least one product',
    dataSource: 'Underwriting Engine',
  },
  {
    id: 'avg-credit-score',
    label: 'Avg Credit Score',
    value: 72.1,
    format: 'score',
    trend: { direction: 'stable', value: 0.4, label: '+0.4pts vs last quarter' },
    status: 'neutral',
    tooltip: 'Portfolio-weighted average credit score (0-100 scale)',
    dataSource: 'Risk Analytics',
  },
  {
    id: 'at-risk-businesses',
    label: 'At-Risk Businesses',
    value: 8845, // 12.9% of portfolio (HIGH + CRITICAL)
    format: 'number',
    trend: { direction: 'down', value: -3.8, label: '-3.8% vs last quarter' },
    status: 'warning',
    tooltip: 'Businesses with HIGH or CRITICAL risk tier (12.9% of portfolio)',
    dataSource: 'Early Warning System',
  },
  {
    id: 'offer-pipeline',
    label: 'Offer Pipeline',
    value: 1240000000, // $1.24B
    format: 'currency',
    trend: { direction: 'up', value: 9.4, label: '+9.4% vs last quarter' },
    status: 'positive',
    tooltip: 'Total value of pre-qualified offers pending business action',
    dataSource: 'Offer Management',
  },
];

// ============================================================================
// GEOGRAPHIC DISTRIBUTION
// Total: 68,500 businesses | $5.8B exposure
// Santander footprint: Northeast-heavy (63.5%), growing Southeast presence
// ============================================================================

export const SANT_GEOGRAPHIC_DISTRIBUTION: GeographicDistribution[] = [
  {
    region: 'Northeast',
    states: ['CT', 'MA', 'ME', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT'],
    businessCount: 43519, // 63.5%
    exposure: 3710000000, // $3.71B
    avgScore: 73.2,
    qualRate: 37.8,
  },
  {
    region: 'Southeast',
    states: ['AL', 'AR', 'DC', 'DE', 'FL', 'GA', 'KY', 'LA', 'MD', 'MS', 'NC', 'SC', 'TN', 'VA', 'WV'],
    businessCount: 11338, // 16.5%
    exposure: 1040000000, // $1.04B
    avgScore: 71.4,
    qualRate: 34.6,
  },
  {
    region: 'Midwest',
    states: ['IA', 'IL', 'IN', 'KS', 'MI', 'MN', 'MO', 'ND', 'NE', 'OH', 'SD', 'WI'],
    businessCount: 5698, // 8.3%
    exposure: 348000000, // $348M
    avgScore: 70.8,
    qualRate: 33.2,
  },
  {
    region: 'Southwest',
    states: ['AZ', 'NM', 'OK', 'TX'],
    businessCount: 4247, // 6.2%
    exposure: 580000000, // $580M
    avgScore: 69.6,
    qualRate: 32.1,
  },
  {
    region: 'West',
    states: ['AK', 'CA', 'CO', 'HI', 'ID', 'MT', 'NV', 'OR', 'UT', 'WA', 'WY'],
    businessCount: 3698, // 5.4%
    exposure: 116000000, // $116M
    avgScore: 72.6,
    qualRate: 35.4,
  },
];

// Validation: 43519 + 11338 + 5698 + 4247 + 3698 = 68,500 ✓

// ============================================================================
// RISK TIER DISTRIBUTION
// Total: 68,500 businesses
// ============================================================================

export const SANT_RISK_TIER_DISTRIBUTION: RiskTierDistribution[] = [
  {
    tier: 'LOW',
    count: 28110, // 41.0%
    percentage: 41.0,
    exposure: 2490000000, // $2.49B
    avgScore: 84.8,
    color: 'bg-green-500',
  },
  {
    tier: 'MODERATE',
    count: 19110, // 27.9%
    percentage: 27.9,
    exposure: 1800000000, // $1.80B
    avgScore: 73.2,
    color: 'bg-blue-500',
  },
  {
    tier: 'ELEVATED',
    count: 12435, // 18.2%
    percentage: 18.2,
    exposure: 1040000000, // $1.04B
    avgScore: 64.7,
    color: 'bg-yellow-500',
  },
  {
    tier: 'HIGH',
    count: 6850, // 10.0%
    percentage: 10.0,
    exposure: 406000000, // $406M
    avgScore: 53.1,
    color: 'bg-orange-500',
  },
  {
    tier: 'CRITICAL',
    count: 1995, // 2.9%
    percentage: 2.9,
    exposure: 58000000, // $58M
    avgScore: 39.2,
    color: 'bg-red-500',
  },
];

// Validation: 28110 + 19110 + 12435 + 6850 + 1995 = 68,500 ✓

// ============================================================================
// CONCENTRATION METRICS
// ============================================================================

export const SANT_CONCENTRATION_METRICS: ConcentrationMetric[] = [
  {
    dimension: 'Industry',
    segments: [
      { name: 'Real Estate Services', percentage: 19.3, exposure: 1120000000 },
      { name: 'Construction & Trades', percentage: 12.8, exposure: 741000000 },
      { name: 'Healthcare Services', percentage: 10.6, exposure: 615000000 },
      { name: 'Manufacturing', percentage: 9.7, exposure: 560000000 },
      { name: 'Retail & E-Commerce', percentage: 8.7, exposure: 506000000 },
      { name: 'Other Industries', percentage: 38.9, exposure: 2258000000 },
    ],
    threshold: 15.0,
    status: 'approaching', // Real Estate at 19.3%
  },
  {
    dimension: 'Geographic',
    segments: [
      { name: 'Northeast', percentage: 63.5, exposure: 3710000000 },
      { name: 'Southeast', percentage: 16.5, exposure: 1040000000 },
      { name: 'Midwest', percentage: 8.3, exposure: 348000000 },
      { name: 'Southwest', percentage: 6.2, exposure: 580000000 },
      { name: 'West', percentage: 5.4, exposure: 116000000 },
    ],
    threshold: 30.0,
    status: 'exceeded', // Northeast at 63.5%
  },
  {
    dimension: 'Revenue Band',
    segments: [
      { name: '$0-$1M', percentage: 16.3, exposure: 945000000 },
      { name: '$1M-$2.5M', percentage: 24.8, exposure: 1438400000 },
      { name: '$2.5M-$5M', percentage: 26.1, exposure: 1513800000 },
      { name: '$5M-$10M', percentage: 19.4, exposure: 1125200000 },
      { name: '$10M+', percentage: 13.4, exposure: 777600000 },
    ],
    threshold: 25.0,
    status: 'approaching', // $2.5M-$5M at 26.1%
  },
];

// ============================================================================
// EARLY WARNING SYSTEM ALERT CLUSTERS
// ============================================================================

export const SANT_EWS_ALERT_CLUSTERS: EWSAlertCluster[] = [
  {
    type: 'Score Drop >15pts',
    severity: 'critical',
    businessCount: 206, // 0.3% of portfolio
    totalExposure: 17400000, // $17.4M
    topIndustries: [
      { name: 'Restaurants & Food', count: 51 },
      { name: 'Retail & E-Commerce', count: 45 },
      { name: 'Auto Services', count: 33 },
      { name: 'Construction & Trades', count: 27 },
      { name: 'Other', count: 50 },
    ],
    trend: 'stable',
  },
  {
    type: 'Delinquency Reported',
    severity: 'critical',
    businessCount: 774, // 1.13% (30+ days)
    totalExposure: 65540000, // $65.54M
    topIndustries: [
      { name: 'Construction & Trades', count: 152 },
      { name: 'Restaurants & Food', count: 134 },
      { name: 'Retail & E-Commerce', count: 123 },
      { name: 'Transportation & Logistics', count: 85 },
      { name: 'Other', count: 280 },
    ],
    trend: 'decreasing',
  },
  {
    type: 'Lien Filed',
    severity: 'warning',
    businessCount: 34, // 0.05%
    totalExposure: 2900000, // $2.9M
    topIndustries: [
      { name: 'Construction & Trades', count: 11 },
      { name: 'Manufacturing', count: 6 },
      { name: 'Transportation & Logistics', count: 5 },
      { name: 'Restaurants & Food', count: 4 },
      { name: 'Other', count: 8 },
    ],
    trend: 'stable',
  },
  {
    type: 'Bankruptcy Watch',
    severity: 'critical',
    businessCount: 17, // 0.025%
    totalExposure: 1450000, // $1.45M
    topIndustries: [
      { name: 'Restaurants & Food', count: 5 },
      { name: 'Retail & E-Commerce', count: 4 },
      { name: 'Auto Services', count: 3 },
      { name: 'Construction & Trades', count: 2 },
      { name: 'Other', count: 3 },
    ],
    trend: 'increasing',
  },
];

// ============================================================================
// ACTIVE CAMPAIGNS
// ============================================================================

export const SANT_ACTIVE_CAMPAIGNS: CampaignData[] = [
  {
    id: 'camp_sant_ne_growth',
    name: 'Northeast Small Business Growth Initiative',
    segment: 'Professional Services, Healthcare, Retail',
    product: 'Term Loan',
    status: 'active',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    funnel: {
      pushed: 28000,
      viewed: 19600,
      applied: 3976,
      approved: 3976, // 14.2% conversion
    },
    approvedVolume: 145000000, // $145M
  },
  {
    id: 'camp_sant_hispanic',
    name: 'Hispanic Business Community Partnership',
    segment: 'Restaurants & Food, Retail, Construction',
    product: 'SBA Express',
    status: 'active',
    startDate: '2025-10-01',
    endDate: '2026-09-30',
    funnel: {
      pushed: 8600,
      viewed: 6450,
      applied: 1591,
      approved: 1591, // 18.5% conversion
    },
    approvedVolume: 42000000, // $42M
  },
  {
    id: 'camp_sant_multifamily',
    name: 'Multifamily Real Estate Expansion',
    segment: 'Real Estate Services',
    product: 'Commercial Real Estate Mortgage',
    status: 'active',
    startDate: '2026-01-15',
    endDate: '2026-12-31',
    funnel: {
      pushed: 4500,
      viewed: 3600,
      applied: 1026,
      approved: 1026, // 22.8% conversion
    },
    approvedVolume: 380000000, // $380M
  },
];

// ============================================================================
// COMPLETED CAMPAIGNS
// ============================================================================

export const SANT_COMPLETED_CAMPAIGNS: CampaignData[] = [
  {
    id: 'camp_sant_c01',
    name: 'Q4 2025 Healthcare Equipment',
    segment: 'Healthcare Services',
    product: 'Equipment Financing',
    status: 'completed',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    funnel: {
      pushed: 4750,
      viewed: 3800,
      applied: 665,
      approved: 380,
    },
    approvedVolume: 28500000, // $28.5M
  },
  {
    id: 'camp_sant_c02',
    name: 'Fall 2025 Retail LOC Push',
    segment: 'Retail & E-Commerce',
    product: 'Line of Credit',
    status: 'completed',
    startDate: '2025-09-01',
    endDate: '2025-11-30',
    funnel: {
      pushed: 6230,
      viewed: 4361,
      applied: 872,
      approved: 436,
    },
    approvedVolume: 34800000, // $34.8M
  },
];

// ============================================================================
// PRODUCT ELIGIBILITY
// ============================================================================

export const SANT_PRODUCT_ELIGIBILITY: Record<string, { eligible: number; conversionRate: number }> = {
  'Term Loan': {
    eligible: 22614, // 33% of portfolio
    conversionRate: 12.4,
  },
  'Line of Credit': {
    eligible: 23760, // 34.7% of portfolio
    conversionRate: 10.8,
  },
  'SBA 7(a)': {
    eligible: 13015, // 19% of portfolio
    conversionRate: 16.2,
  },
  'Equipment Financing': {
    eligible: 16435, // 24% of portfolio
    conversionRate: 14.6,
  },
  'Commercial Real Estate Loan': {
    eligible: 4795, // 7% of portfolio
    conversionRate: 22.8,
  },
  'SBA 504': {
    eligible: 2055, // 3% of portfolio
    conversionRate: 19.4,
  },
  'SBA Express': {
    eligible: 10260, // 15% of portfolio
    conversionRate: 18.5,
  },
  'Commercial Auto Financing': {
    eligible: 2700, // 3.9% of portfolio
    conversionRate: 13.2,
  },
  'Working Capital Loan': {
    eligible: 12355, // 18% of portfolio
    conversionRate: 9.6,
  },
};
