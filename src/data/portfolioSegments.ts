/**
 * portfolioSegments.ts
 *
 * Portfolio analytics data for Lumiq AI Dashboard
 * Defines industry segments, KPIs, geographic distribution, risk tiers,
 * concentration metrics, EWS alerts, campaigns, and product eligibility
 *
 * All metrics are consistent with 287,000 total businesses and $21.2B exposure
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface IndustrySegment {
  id: string;
  name: string;
  icon: string; // lucide-react icon name
  businessCount: number;
  totalExposure: number; // in dollars
  qualRate: number; // percentage 0-100
  avgScore: number; // 0-100
  highRiskPct: number; // percentage of high/critical risk
  trend: { direction: 'up' | 'down' | 'stable'; value: number };
  topProducts: { name: string; eligible: number }[];
  region: Record<string, number>; // region name → count
  riskDistribution: Record<string, number>; // LOW/MODERATE/ELEVATED/HIGH/CRITICAL → count
  avgRevenue: number;
  avgYearsInBusiness: number;
}

export interface PortfolioKPI {
  id: string;
  label: string;
  value: number | string;
  format: 'number' | 'currency' | 'percent' | 'score';
  trend?: { direction: 'up' | 'down' | 'stable'; value: number; label: string };
  status?: 'positive' | 'neutral' | 'warning' | 'critical';
  tooltip?: string;
  dataSource?: string;
}

export interface CampaignData {
  id: string;
  name: string;
  segment: string;
  product: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  startDate: string;
  endDate: string;
  funnel: { pushed: number; viewed: number; applied: number; approved: number };
  approvedVolume: number;
}

export interface ConcentrationMetric {
  dimension: string;
  segments: { name: string; percentage: number; exposure: number }[];
  threshold: number;
  status: 'within' | 'approaching' | 'exceeded';
}

export interface EWSAlertCluster {
  type: string;
  severity: 'info' | 'warning' | 'critical';
  businessCount: number;
  totalExposure: number;
  topIndustries: { name: string; count: number }[];
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface GeographicDistribution {
  region: string;
  states: string[];
  businessCount: number;
  exposure: number;
  avgScore: number;
  qualRate: number;
}

export interface RiskTierDistribution {
  tier: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  count: number;
  percentage: number;
  exposure: number;
  avgScore: number;
  color: string; // tailwind color class
}

// ============================================================================
// INDUSTRY SEGMENTS
// Total: 287,000 businesses | $21.2B exposure
// ============================================================================

export const INDUSTRY_SEGMENTS: IndustrySegment[] = [
  {
    id: 'retail',
    name: 'Retail & E-Commerce',
    icon: 'ShoppingBag',
    businessCount: 42800,
    totalExposure: 2100000000,
    qualRate: 36.4,
    avgScore: 72.8,
    highRiskPct: 8.2,
    trend: { direction: 'up', value: 2.3 },
    topProducts: [
      { name: 'Line of Credit', eligible: 15580 },
      { name: 'Term Loan', eligible: 12890 },
      { name: 'Equipment Financing', eligible: 8560 },
      { name: 'SBA 7(a)', eligible: 5120 },
    ],
    region: {
      Northeast: 9240,
      Southeast: 10700,
      Midwest: 8560,
      Southwest: 7280,
      West: 7020,
    },
    riskDistribution: {
      LOW: 18336,
      MODERATE: 12612,
      ELEVATED: 7276,
      HIGH: 3424,
      CRITICAL: 1152,
    },
    avgRevenue: 2400000,
    avgYearsInBusiness: 8.3,
  },
  {
    id: 'healthcare',
    name: 'Healthcare Services',
    icon: 'Heart',
    businessCount: 31200,
    totalExposure: 1800000000,
    qualRate: 42.1,
    avgScore: 78.4,
    highRiskPct: 5.3,
    trend: { direction: 'up', value: 4.7 },
    topProducts: [
      { name: 'Term Loan', eligible: 13128 },
      { name: 'Line of Credit', eligible: 10920 },
      { name: 'SBA 7(a)', eligible: 6240 },
      { name: 'Equipment Financing', eligible: 4992 },
    ],
    region: {
      Northeast: 7488,
      Southeast: 8112,
      Midwest: 6864,
      Southwest: 4680,
      West: 4056,
    },
    riskDistribution: {
      LOW: 14976,
      MODERATE: 9984,
      ELEVATED: 4992,
      HIGH: 936,
      CRITICAL: 312,
    },
    avgRevenue: 3100000,
    avgYearsInBusiness: 11.2,
  },
  {
    id: 'professional',
    name: 'Professional Services',
    icon: 'Briefcase',
    businessCount: 38500,
    totalExposure: 1400000000,
    qualRate: 38.9,
    avgScore: 74.2,
    highRiskPct: 6.8,
    trend: { direction: 'stable', value: 0.8 },
    topProducts: [
      { name: 'Line of Credit', eligible: 14980 },
      { name: 'Term Loan', eligible: 11550 },
      { name: 'SBA 7(a)', eligible: 6930 },
      { name: 'Equipment Financing', eligible: 4620 },
    ],
    region: {
      Northeast: 10395,
      Southeast: 8470,
      Midwest: 7315,
      Southwest: 6160,
      West: 6160,
    },
    riskDistribution: {
      LOW: 16940,
      MODERATE: 11935,
      ELEVATED: 6545,
      HIGH: 2310,
      CRITICAL: 770,
    },
    avgRevenue: 1800000,
    avgYearsInBusiness: 9.7,
  },
  {
    id: 'construction',
    name: 'Construction & Trades',
    icon: 'HardHat',
    businessCount: 28900,
    totalExposure: 2400000000,
    qualRate: 31.5,
    avgScore: 68.9,
    highRiskPct: 11.4,
    trend: { direction: 'up', value: 1.9 },
    topProducts: [
      { name: 'Equipment Financing', eligible: 10404 },
      { name: 'Line of Credit', eligible: 9104 },
      { name: 'Term Loan', eligible: 7514 },
      { name: 'SBA 7(a)', eligible: 4046 },
    ],
    region: {
      Northeast: 5780,
      Southeast: 7514,
      Midwest: 6358,
      Southwest: 5202,
      West: 4046,
    },
    riskDistribution: {
      LOW: 10404,
      MODERATE: 8670,
      ELEVATED: 5780,
      HIGH: 2890,
      CRITICAL: 1156,
    },
    avgRevenue: 4200000,
    avgYearsInBusiness: 7.1,
  },
  {
    id: 'restaurants',
    name: 'Restaurants & Food',
    icon: 'UtensilsCrossed',
    businessCount: 35600,
    totalExposure: 1100000000,
    qualRate: 28.3,
    avgScore: 65.7,
    highRiskPct: 14.6,
    trend: { direction: 'down', value: -1.4 },
    topProducts: [
      { name: 'Line of Credit', eligible: 10068 },
      { name: 'Equipment Financing', eligible: 7832 },
      { name: 'Term Loan', eligible: 7120 },
      { name: 'SBA 7(a)', eligible: 4272 },
    ],
    region: {
      Northeast: 7120,
      Southeast: 9252,
      Midwest: 7476,
      Southwest: 6764,
      West: 4988,
    },
    riskDistribution: {
      LOW: 11344,
      MODERATE: 10424,
      ELEVATED: 7832,
      HIGH: 4272,
      CRITICAL: 1728,
    },
    avgRevenue: 1500000,
    avgYearsInBusiness: 5.8,
  },
  {
    id: 'technology',
    name: 'Technology Services',
    icon: 'Laptop',
    businessCount: 22400,
    totalExposure: 1900000000,
    qualRate: 44.6,
    avgScore: 81.3,
    highRiskPct: 4.1,
    trend: { direction: 'up', value: 5.2 },
    topProducts: [
      { name: 'Term Loan', eligible: 9984 },
      { name: 'Line of Credit', eligible: 8960 },
      { name: 'SBA 7(a)', eligible: 5600 },
      { name: 'Equipment Financing', eligible: 3360 },
    ],
    region: {
      Northeast: 6720,
      Southeast: 4480,
      Midwest: 3360,
      Southwest: 3136,
      West: 4704,
    },
    riskDistribution: {
      LOW: 11200,
      MODERATE: 7392,
      ELEVATED: 3136,
      HIGH: 448,
      CRITICAL: 224,
    },
    avgRevenue: 4500000,
    avgYearsInBusiness: 6.4,
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: 'Factory',
    businessCount: 18700,
    totalExposure: 3200000000,
    qualRate: 40.3,
    avgScore: 76.8,
    highRiskPct: 6.2,
    trend: { direction: 'stable', value: 0.3 },
    topProducts: [
      { name: 'Term Loan', eligible: 7536 },
      { name: 'Equipment Financing', eligible: 6732 },
      { name: 'Line of Credit', eligible: 5984 },
      { name: 'SBA 7(a)', eligible: 4488 },
    ],
    region: {
      Northeast: 4675,
      Southeast: 4862,
      Midwest: 6358,
      Southwest: 1870,
      West: 935,
    },
    riskDistribution: {
      LOW: 8415,
      MODERATE: 5984,
      ELEVATED: 3179,
      HIGH: 935,
      CRITICAL: 187,
    },
    avgRevenue: 8900000,
    avgYearsInBusiness: 14.6,
  },
  {
    id: 'transportation',
    name: 'Transportation & Logistics',
    icon: 'Truck',
    businessCount: 15300,
    totalExposure: 1600000000,
    qualRate: 33.7,
    avgScore: 70.5,
    highRiskPct: 9.8,
    trend: { direction: 'up', value: 2.1 },
    topProducts: [
      { name: 'Equipment Financing', eligible: 5508 },
      { name: 'Line of Credit', eligible: 4896 },
      { name: 'Term Loan', eligible: 4284 },
      { name: 'SBA 7(a)', eligible: 2142 },
    ],
    region: {
      Northeast: 2754,
      Southeast: 3825,
      Midwest: 3672,
      Southwest: 3213,
      West: 1836,
    },
    riskDistribution: {
      LOW: 5814,
      MODERATE: 4590,
      ELEVATED: 3060,
      HIGH: 1224,
      CRITICAL: 612,
    },
    avgRevenue: 5400000,
    avgYearsInBusiness: 9.3,
  },
  {
    id: 'realestate',
    name: 'Real Estate Services',
    icon: 'Building2',
    businessCount: 12800,
    totalExposure: 2800000000,
    qualRate: 37.8,
    avgScore: 73.6,
    highRiskPct: 7.5,
    trend: { direction: 'up', value: 3.4 },
    topProducts: [
      { name: 'Term Loan', eligible: 4838 },
      { name: 'Line of Credit', eligible: 4096 },
      { name: 'SBA 7(a)', eligible: 2816 },
      { name: 'Equipment Financing', eligible: 1664 },
    ],
    region: {
      Northeast: 3328,
      Southeast: 2944,
      Midwest: 2176,
      Southwest: 2048,
      West: 2304,
    },
    riskDistribution: {
      LOW: 5632,
      MODERATE: 3968,
      ELEVATED: 2176,
      HIGH: 768,
      CRITICAL: 256,
    },
    avgRevenue: 11200000,
    avgYearsInBusiness: 12.4,
  },
  {
    id: 'wholesale',
    name: 'Wholesale & Distribution',
    icon: 'Package',
    businessCount: 16200,
    totalExposure: 1500000000,
    qualRate: 35.2,
    avgScore: 71.9,
    highRiskPct: 8.9,
    trend: { direction: 'stable', value: -0.2 },
    topProducts: [
      { name: 'Line of Credit', eligible: 5702 },
      { name: 'Term Loan', eligible: 4860 },
      { name: 'Equipment Financing', eligible: 3564 },
      { name: 'SBA 7(a)', eligible: 2268 },
    ],
    region: {
      Northeast: 3564,
      Southeast: 4050,
      Midwest: 4212,
      Southwest: 2430,
      West: 1944,
    },
    riskDistribution: {
      LOW: 6480,
      MODERATE: 4860,
      ELEVATED: 2916,
      HIGH: 1296,
      CRITICAL: 648,
    },
    avgRevenue: 4700000,
    avgYearsInBusiness: 10.8,
  },
  {
    id: 'auto',
    name: 'Auto Services',
    icon: 'Car',
    businessCount: 13500,
    totalExposure: 800000000,
    qualRate: 30.4,
    avgScore: 67.3,
    highRiskPct: 12.1,
    trend: { direction: 'down', value: -0.9 },
    topProducts: [
      { name: 'Equipment Financing', eligible: 4104 },
      { name: 'Line of Credit', eligible: 3645 },
      { name: 'Term Loan', eligible: 3105 },
      { name: 'SBA 7(a)', eligible: 1620 },
    ],
    region: {
      Northeast: 2835,
      Southeast: 3510,
      Midwest: 3240,
      Southwest: 2295,
      West: 1620,
    },
    riskDistribution: {
      LOW: 4995,
      MODERATE: 4050,
      ELEVATED: 2700,
      HIGH: 1215,
      CRITICAL: 540,
    },
    avgRevenue: 2900000,
    avgYearsInBusiness: 8.9,
  },
  {
    id: 'other',
    name: 'Other Services',
    icon: 'MoreHorizontal',
    businessCount: 11100,
    totalExposure: 600000000,
    qualRate: 32.1,
    avgScore: 69.8,
    highRiskPct: 10.3,
    trend: { direction: 'stable', value: 0.1 },
    topProducts: [
      { name: 'Line of Credit', eligible: 3552 },
      { name: 'Term Loan', eligible: 2997 },
      { name: 'Equipment Financing', eligible: 2331 },
      { name: 'SBA 7(a)', eligible: 1665 },
    ],
    region: {
      Northeast: 2442,
      Southeast: 2775,
      Midwest: 2331,
      Southwest: 1998,
      West: 1554,
    },
    riskDistribution: {
      LOW: 4218,
      MODERATE: 3330,
      ELEVATED: 2220,
      HIGH: 999,
      CRITICAL: 333,
    },
    avgRevenue: 2100000,
    avgYearsInBusiness: 7.6,
  },
];

// Validation: Sum should be 287,000
// 42800 + 31200 + 38500 + 28900 + 35600 + 22400 + 18700 + 15300 + 12800 + 16200 + 13500 + 11100 = 287,000 ✓

// ============================================================================
// PORTFOLIO KPIS
// ============================================================================

export const PORTFOLIO_KPIS: PortfolioKPI[] = [
  {
    id: 'total-portfolio',
    label: 'Total Portfolio',
    value: 287000,
    format: 'number',
    trend: { direction: 'up', value: 2.4, label: '+2.4% vs last quarter' },
    status: 'positive',
    tooltip: 'Total number of businesses in portfolio',
    dataSource: 'Portfolio Management System',
  },
  {
    id: 'total-exposure',
    label: 'Total Exposure',
    value: 21200000000,
    format: 'currency',
    trend: { direction: 'up', value: 3.8, label: '+3.8% vs last quarter' },
    status: 'positive',
    tooltip: 'Total outstanding credit exposure across all products',
    dataSource: 'Credit Ledger',
  },
  {
    id: 'qualification-rate',
    label: 'Qualification Rate',
    value: 34.2,
    format: 'percent',
    trend: { direction: 'up', value: 1.2, label: '+1.2pp vs last quarter' },
    status: 'positive',
    tooltip: 'Percentage of businesses qualifying for at least one product',
    dataSource: 'Underwriting Engine',
  },
  {
    id: 'avg-credit-score',
    label: 'Avg Credit Score',
    value: 71.4,
    format: 'score',
    trend: { direction: 'stable', value: 0.3, label: '+0.3pts vs last quarter' },
    status: 'neutral',
    tooltip: 'Portfolio-weighted average credit score (0-100 scale)',
    dataSource: 'Risk Analytics',
  },
  {
    id: 'at-risk-businesses',
    label: 'At-Risk Businesses',
    value: 18340,
    format: 'number',
    trend: { direction: 'down', value: -4.2, label: '-4.2% vs last quarter' },
    status: 'warning',
    tooltip: 'Businesses with HIGH or CRITICAL risk tier (6.4% of portfolio)',
    dataSource: 'Early Warning System',
  },
  {
    id: 'offer-pipeline',
    label: 'Offer Pipeline',
    value: 4800000000,
    format: 'currency',
    trend: { direction: 'up', value: 8.7, label: '+8.7% vs last quarter' },
    status: 'positive',
    tooltip: 'Total value of pre-qualified offers pending business action',
    dataSource: 'Offer Management',
  },
];

// ============================================================================
// GEOGRAPHIC DISTRIBUTION
// Total: 287,000 businesses | $21.2B exposure
// ============================================================================

export const GEOGRAPHIC_DISTRIBUTION: GeographicDistribution[] = [
  {
    region: 'Northeast',
    states: ['CT', 'MA', 'ME', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT'],
    businessCount: 67141,
    exposure: 5100000000,
    avgScore: 73.8,
    qualRate: 37.2,
  },
  {
    region: 'Southeast',
    states: ['AL', 'AR', 'DC', 'DE', 'FL', 'GA', 'KY', 'LA', 'MD', 'MS', 'NC', 'SC', 'TN', 'VA', 'WV'],
    businessCount: 72394,
    exposure: 4800000000,
    avgScore: 70.9,
    qualRate: 34.8,
  },
  {
    region: 'Midwest',
    states: ['IA', 'IL', 'IN', 'KS', 'MI', 'MN', 'MO', 'ND', 'NE', 'OH', 'SD', 'WI'],
    businessCount: 63742,
    exposure: 4200000000,
    avgScore: 72.1,
    qualRate: 35.6,
  },
  {
    region: 'Southwest',
    states: ['AZ', 'NM', 'OK', 'TX'],
    businessCount: 47076,
    exposure: 3600000000,
    avgScore: 69.4,
    qualRate: 32.9,
  },
  {
    region: 'West',
    states: ['AK', 'CA', 'CO', 'HI', 'ID', 'MT', 'NV', 'OR', 'UT', 'WA', 'WY'],
    businessCount: 36647,
    exposure: 3500000000,
    avgScore: 74.6,
    qualRate: 36.4,
  },
];

// Validation: 67141 + 72394 + 63742 + 47076 + 36647 = 287,000 ✓

// ============================================================================
// RISK TIER DISTRIBUTION
// Total: 287,000 businesses
// ============================================================================

export const RISK_TIER_DISTRIBUTION: RiskTierDistribution[] = [
  {
    tier: 'LOW',
    count: 114800,
    percentage: 40.0,
    exposure: 9200000000,
    avgScore: 84.2,
    color: 'bg-green-500',
  },
  {
    tier: 'MODERATE',
    count: 80360,
    percentage: 28.0,
    exposure: 6500000000,
    avgScore: 72.8,
    color: 'bg-blue-500',
  },
  {
    tier: 'ELEVATED',
    count: 51660,
    percentage: 18.0,
    exposure: 3800000000,
    avgScore: 64.3,
    color: 'bg-yellow-500',
  },
  {
    tier: 'HIGH',
    count: 28700,
    percentage: 10.0,
    exposure: 1400000000,
    avgScore: 52.7,
    color: 'bg-orange-500',
  },
  {
    tier: 'CRITICAL',
    count: 11480,
    percentage: 4.0,
    exposure: 300000000,
    avgScore: 38.4,
    color: 'bg-red-500',
  },
];

// Validation: 114800 + 80360 + 51660 + 28700 + 11480 = 287,000 ✓

// ============================================================================
// CONCENTRATION METRICS
// ============================================================================

export const CONCENTRATION_METRICS: ConcentrationMetric[] = [
  {
    dimension: 'Industry',
    segments: [
      { name: 'Retail & E-Commerce', percentage: 14.9, exposure: 2100000000 },
      { name: 'Healthcare Services', percentage: 10.9, exposure: 1800000000 },
      { name: 'Professional Services', percentage: 13.4, exposure: 1400000000 },
      { name: 'Construction & Trades', percentage: 10.1, exposure: 2400000000 },
      { name: 'Restaurants & Food', percentage: 12.4, exposure: 1100000000 },
      { name: 'Other Industries', percentage: 38.3, exposure: 12400000000 },
    ],
    threshold: 15.0,
    status: 'within',
  },
  {
    dimension: 'Geographic',
    segments: [
      { name: 'Northeast', percentage: 23.4, exposure: 5100000000 },
      { name: 'Southeast', percentage: 25.2, exposure: 4800000000 },
      { name: 'Midwest', percentage: 22.2, exposure: 4200000000 },
      { name: 'Southwest', percentage: 16.4, exposure: 3600000000 },
      { name: 'West', percentage: 12.8, exposure: 3500000000 },
    ],
    threshold: 30.0,
    status: 'within',
  },
  {
    dimension: 'Revenue Band',
    segments: [
      { name: '$0-$1M', percentage: 18.5, exposure: 1800000000 },
      { name: '$1M-$2.5M', percentage: 24.7, exposure: 4200000000 },
      { name: '$2.5M-$5M', percentage: 22.3, exposure: 5800000000 },
      { name: '$5M-$10M', percentage: 19.2, exposure: 6100000000 },
      { name: '$10M+', percentage: 15.3, exposure: 3300000000 },
    ],
    threshold: 25.0,
    status: 'approaching',
  },
];

// ============================================================================
// EARLY WARNING SYSTEM ALERT CLUSTERS
// ============================================================================

export const EWS_ALERT_CLUSTERS: EWSAlertCluster[] = [
  {
    type: 'Score Drop >15pts',
    severity: 'critical',
    businessCount: 847,
    totalExposure: 142000000,
    topIndustries: [
      { name: 'Restaurants & Food', count: 189 },
      { name: 'Retail & E-Commerce', count: 162 },
      { name: 'Auto Services', count: 118 },
      { name: 'Construction & Trades', count: 93 },
      { name: 'Other', count: 285 },
    ],
    trend: 'increasing',
  },
  {
    type: 'Delinquency Reported',
    severity: 'critical',
    businessCount: 234,
    totalExposure: 67000000,
    topIndustries: [
      { name: 'Construction & Trades', count: 58 },
      { name: 'Restaurants & Food', count: 51 },
      { name: 'Transportation & Logistics', count: 42 },
      { name: 'Auto Services', count: 35 },
      { name: 'Other', count: 48 },
    ],
    trend: 'stable',
  },
  {
    type: 'Lien Filed',
    severity: 'warning',
    businessCount: 112,
    totalExposure: 34000000,
    topIndustries: [
      { name: 'Construction & Trades', count: 34 },
      { name: 'Manufacturing', count: 18 },
      { name: 'Transportation & Logistics', count: 16 },
      { name: 'Restaurants & Food', count: 14 },
      { name: 'Other', count: 30 },
    ],
    trend: 'decreasing',
  },
  {
    type: 'Bankruptcy Watch',
    severity: 'critical',
    businessCount: 54,
    totalExposure: 28000000,
    topIndustries: [
      { name: 'Restaurants & Food', count: 15 },
      { name: 'Retail & E-Commerce', count: 12 },
      { name: 'Auto Services', count: 9 },
      { name: 'Construction & Trades', count: 7 },
      { name: 'Other', count: 11 },
    ],
    trend: 'increasing',
  },
];

// ============================================================================
// ACTIVE CAMPAIGNS
// ============================================================================

export const ACTIVE_CAMPAIGNS: CampaignData[] = [
  {
    id: 'camp-001',
    name: 'Q1 2026 Healthcare LOC Expansion',
    segment: 'Healthcare Services',
    product: 'Line of Credit',
    status: 'active',
    startDate: '2026-01-15',
    endDate: '2026-03-31',
    funnel: {
      pushed: 8240,
      viewed: 5768,
      applied: 1236,
      approved: 618,
    },
    approvedVolume: 87400000,
  },
  {
    id: 'camp-002',
    name: 'Tech Services Term Loan Boost',
    segment: 'Technology Services',
    product: 'Term Loan',
    status: 'active',
    startDate: '2026-01-20',
    endDate: '2026-04-15',
    funnel: {
      pushed: 6720,
      viewed: 4368,
      applied: 963,
      approved: 501,
    },
    approvedVolume: 124200000,
  },
  {
    id: 'camp-003',
    name: 'Retail Equipment Finance Push',
    segment: 'Retail & E-Commerce',
    product: 'Equipment Financing',
    status: 'active',
    startDate: '2026-02-01',
    endDate: '2026-04-30',
    funnel: {
      pushed: 9350,
      viewed: 6158,
      applied: 1402,
      approved: 687,
    },
    approvedVolume: 56700000,
  },
];

// ============================================================================
// COMPLETED CAMPAIGNS
// ============================================================================

export const COMPLETED_CAMPAIGNS: CampaignData[] = [
  {
    id: 'camp-c01',
    name: 'Q4 2025 Holiday Retail LOC',
    segment: 'Retail & E-Commerce',
    product: 'Line of Credit',
    status: 'completed',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    funnel: {
      pushed: 12400,
      viewed: 8680,
      applied: 2108,
      approved: 1138,
    },
    approvedVolume: 142800000,
  },
  {
    id: 'camp-c02',
    name: 'Construction SBA Fall 2025',
    segment: 'Construction & Trades',
    product: 'SBA 7(a)',
    status: 'completed',
    startDate: '2025-09-01',
    endDate: '2025-11-30',
    funnel: {
      pushed: 5780,
      viewed: 3468,
      applied: 694,
      approved: 347,
    },
    approvedVolume: 98600000,
  },
  {
    id: 'camp-c03',
    name: 'Professional Services Term Q3',
    segment: 'Professional Services',
    product: 'Term Loan',
    status: 'completed',
    startDate: '2025-07-15',
    endDate: '2025-09-30',
    funnel: {
      pushed: 9240,
      viewed: 6468,
      applied: 1386,
      approved: 747,
    },
    approvedVolume: 116200000,
  },
  {
    id: 'camp-c04',
    name: 'Manufacturing Equipment Summer',
    segment: 'Manufacturing',
    product: 'Equipment Financing',
    status: 'completed',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    funnel: {
      pushed: 7480,
      viewed: 5236,
      applied: 1048,
      approved: 524,
    },
    approvedVolume: 87300000,
  },
  {
    id: 'camp-c05',
    name: 'Restaurant Recovery LOC Spring',
    segment: 'Restaurants & Food',
    product: 'Line of Credit',
    status: 'completed',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    funnel: {
      pushed: 10680,
      viewed: 6408,
      applied: 1282,
      approved: 577,
    },
    approvedVolume: 62400000,
  },
  {
    id: 'camp-c06',
    name: 'Transportation Fleet Finance',
    segment: 'Transportation & Logistics',
    product: 'Equipment Financing',
    status: 'completed',
    startDate: '2025-05-15',
    endDate: '2025-07-31',
    funnel: {
      pushed: 6120,
      viewed: 4284,
      applied: 857,
      approved: 429,
    },
    approvedVolume: 71200000,
  },
  {
    id: 'camp-c07',
    name: 'Real Estate Term Loan Q2',
    segment: 'Real Estate Services',
    product: 'Term Loan',
    status: 'completed',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    funnel: {
      pushed: 5120,
      viewed: 3584,
      applied: 768,
      approved: 422,
    },
    approvedVolume: 134600000,
  },
  {
    id: 'camp-c08',
    name: 'Wholesale LOC Spring Push',
    segment: 'Wholesale & Distribution',
    product: 'Line of Credit',
    status: 'completed',
    startDate: '2025-03-15',
    endDate: '2025-05-31',
    funnel: {
      pushed: 6480,
      viewed: 4536,
      applied: 972,
      approved: 486,
    },
    approvedVolume: 76800000,
  },
  {
    id: 'camp-c09',
    name: 'Healthcare SBA Winter 2025',
    segment: 'Healthcare Services',
    product: 'SBA 7(a)',
    status: 'completed',
    startDate: '2025-01-15',
    endDate: '2025-03-31',
    funnel: {
      pushed: 4680,
      viewed: 3276,
      applied: 702,
      approved: 351,
    },
    approvedVolume: 94200000,
  },
  {
    id: 'camp-c10',
    name: 'Tech Services LOC Winter',
    segment: 'Technology Services',
    product: 'Line of Credit',
    status: 'completed',
    startDate: '2025-01-01',
    endDate: '2025-03-15',
    funnel: {
      pushed: 7168,
      viewed: 5018,
      applied: 1147,
      approved: 631,
    },
    approvedVolume: 103400000,
  },
  {
    id: 'camp-c11',
    name: 'Auto Services Equipment Q4',
    segment: 'Auto Services',
    product: 'Equipment Financing',
    status: 'completed',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    funnel: {
      pushed: 5400,
      viewed: 3564,
      applied: 713,
      approved: 321,
    },
    approvedVolume: 41200000,
  },
  {
    id: 'camp-c12',
    name: 'Construction LOC Summer 2025',
    segment: 'Construction & Trades',
    product: 'Line of Credit',
    status: 'completed',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    funnel: {
      pushed: 8670,
      viewed: 5635,
      applied: 1127,
      approved: 563,
    },
    approvedVolume: 78900000,
  },
];

// ============================================================================
// PRODUCT ELIGIBILITY
// ============================================================================

export const PRODUCT_ELIGIBILITY: Record<string, { eligible: number; conversionRate: number }> = {
  'Line of Credit': {
    eligible: 98154,
    conversionRate: 14.2,
  },
  'Term Loan': {
    eligible: 84809,
    conversionRate: 12.8,
  },
  'Equipment Financing': {
    eligible: 61939,
    conversionRate: 16.3,
  },
  'SBA 7(a)': {
    eligible: 43257,
    conversionRate: 18.9,
  },
  'Commercial Real Estate': {
    eligible: 22960,
    conversionRate: 22.4,
  },
  'Business Credit Card': {
    eligible: 126380,
    conversionRate: 8.7,
  },
  'Merchant Cash Advance': {
    eligible: 34440,
    conversionRate: 24.1,
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get industry segment by ID
 */
export function getIndustrySegment(id: string): IndustrySegment | undefined {
  return INDUSTRY_SEGMENTS.find((segment) => segment.id === id);
}

/**
 * Get all segments sorted by business count (descending)
 */
export function getSegmentsBySize(): IndustrySegment[] {
  return [...INDUSTRY_SEGMENTS].sort((a, b) => b.businessCount - a.businessCount);
}

/**
 * Get all segments sorted by exposure (descending)
 */
export function getSegmentsByExposure(): IndustrySegment[] {
  return [...INDUSTRY_SEGMENTS].sort((a, b) => b.totalExposure - a.totalExposure);
}

/**
 * Get all segments sorted by risk (descending)
 */
export function getSegmentsByRisk(): IndustrySegment[] {
  return [...INDUSTRY_SEGMENTS].sort((a, b) => b.highRiskPct - a.highRiskPct);
}

/**
 * Calculate total portfolio metrics
 */
export function calculatePortfolioTotals() {
  const totalBusinesses = INDUSTRY_SEGMENTS.reduce((sum, seg) => sum + seg.businessCount, 0);
  const totalExposure = INDUSTRY_SEGMENTS.reduce((sum, seg) => sum + seg.totalExposure, 0);
  const avgScore =
    INDUSTRY_SEGMENTS.reduce((sum, seg) => sum + seg.avgScore * seg.businessCount, 0) / totalBusinesses;
  const avgQualRate =
    INDUSTRY_SEGMENTS.reduce((sum, seg) => sum + seg.qualRate * seg.businessCount, 0) / totalBusinesses;

  return {
    totalBusinesses,
    totalExposure,
    avgScore,
    avgQualRate,
  };
}
