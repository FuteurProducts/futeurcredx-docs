/**
 * portfolioSegments.ts
 *
 * Portfolio analytics data for LumiqAI Dashboard
 * Defines industry segments, KPIs, geographic distribution, risk tiers,
 * concentration metrics, EWS alerts, campaigns, and product eligibility
 *
 * All metrics are aligned with chase.json: 6M total businesses and $650B exposure
 * Bank switching: Dynamically loads Chase or Wells Fargo data based on ACTIVE_BANK_ID
 */

import { ACTIVE_BANK_ID } from './bankConfig';

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
// INDUSTRY SEGMENTS — CHASE
// Total: 6,000,000 businesses | $650B exposure
// Aligned with chase.json — scale factor: ~20.9x from original dataset
// ============================================================================

const CHASE_INDUSTRY_SEGMENTS: IndustrySegment[] = [
  {
    id: 'retail',
    name: 'Retail & E-Commerce',
    icon: 'ShoppingBag',
    businessCount: 894520, // Aligned with chase.json scale (20.9x)
    totalExposure: 64425130000,
    qualRate: 36.4,
    avgScore: 72.8,
    highRiskPct: 8.2,
    trend: { direction: 'up', value: 2.3 },
    topProducts: [
      { name: 'Line of Credit', eligible: 325622 },
      { name: 'Term Loan', eligible: 269401 },
      { name: 'Equipment Financing', eligible: 178904 },
      { name: 'SBA 7(a)', eligible: 107008 },
    ],
    region: {
      Northeast: 193116,
      Southeast: 223630,
      Midwest: 178904,
      Southwest: 152152,
      West: 146718,
    },
    riskDistribution: {
      LOW: 383222,
      MODERATE: 263591,
      ELEVATED: 152067,
      HIGH: 71576,
      CRITICAL: 24078,
    },
    avgRevenue: 2400000,
    avgYearsInBusiness: 8.3,
  },
  {
    id: 'healthcare',
    name: 'Healthcare Services',
    icon: 'Heart',
    businessCount: 652080, // Aligned with chase.json scale (20.9x)
    totalExposure: 55218930000,
    qualRate: 42.1,
    avgScore: 78.4,
    highRiskPct: 5.3,
    trend: { direction: 'up', value: 4.7 },
    topProducts: [
      { name: 'Term Loan', eligible: 274375 },
      { name: 'Line of Credit', eligible: 228228 },
      { name: 'SBA 7(a)', eligible: 130416 },
      { name: 'Equipment Financing', eligible: 104333 },
    ],
    region: {
      Northeast: 156499,
      Southeast: 169541,
      Midwest: 143458,
      Southwest: 97821,
      West: 84761,
    },
    riskDistribution: {
      LOW: 312998,
      MODERATE: 208665,
      ELEVATED: 104333,
      HIGH: 19562,
      CRITICAL: 6521,
    },
    avgRevenue: 3100000,
    avgYearsInBusiness: 11.2,
  },
  {
    id: 'professional',
    name: 'Professional Services',
    icon: 'Briefcase',
    businessCount: 804650, // Aligned with chase.json scale (20.9x)
    totalExposure: 42944020000,
    qualRate: 38.9,
    avgScore: 74.2,
    highRiskPct: 6.8,
    trend: { direction: 'stable', value: 0.8 },
    topProducts: [
      { name: 'Line of Credit', eligible: 313082 },
      { name: 'Term Loan', eligible: 241395 },
      { name: 'SBA 7(a)', eligible: 144837 },
      { name: 'Equipment Financing', eligible: 96558 },
    ],
    region: {
      Northeast: 217256,
      Southeast: 177023,
      Midwest: 152884,
      Southwest: 128744,
      West: 128744,
    },
    riskDistribution: {
      LOW: 354045,
      MODERATE: 249444,
      ELEVATED: 136794,
      HIGH: 48279,
      CRITICAL: 16093,
    },
    avgRevenue: 1800000,
    avgYearsInBusiness: 9.7,
  },
  {
    id: 'construction',
    name: 'Construction & Trades',
    icon: 'HardHat',
    businessCount: 604010, // Aligned with chase.json scale (20.9x)
    totalExposure: 73631900000,
    qualRate: 31.5,
    avgScore: 68.9,
    highRiskPct: 11.4,
    trend: { direction: 'up', value: 1.9 },
    topProducts: [
      { name: 'Equipment Financing', eligible: 217444 },
      { name: 'Line of Credit', eligible: 190274 },
      { name: 'Term Loan', eligible: 157043 },
      { name: 'SBA 7(a)', eligible: 84561 },
    ],
    region: {
      Northeast: 120802,
      Southeast: 157043,
      Midwest: 132882,
      Southwest: 108722,
      West: 84561,
    },
    riskDistribution: {
      LOW: 217444,
      MODERATE: 181203,
      ELEVATED: 120802,
      HIGH: 60401,
      CRITICAL: 24160,
    },
    avgRevenue: 4200000,
    avgYearsInBusiness: 7.1,
  },
  {
    id: 'restaurants',
    name: 'Restaurants & Food',
    icon: 'UtensilsCrossed',
    businessCount: 744040, // Aligned with chase.json scale (20.9x)
    totalExposure: 33748450000,
    qualRate: 28.3,
    avgScore: 65.7,
    highRiskPct: 14.6,
    trend: { direction: 'down', value: -1.4 },
    topProducts: [
      { name: 'Line of Credit', eligible: 210421 },
      { name: 'Equipment Financing', eligible: 163689 },
      { name: 'Term Loan', eligible: 148808 },
      { name: 'SBA 7(a)', eligible: 89285 },
    ],
    region: {
      Northeast: 148808,
      Southeast: 193367,
      Midwest: 156250,
      Southwest: 141367,
      West: 104248,
    },
    riskDistribution: {
      LOW: 237086,
      MODERATE: 217862,
      ELEVATED: 163689,
      HIGH: 89285,
      CRITICAL: 36119,
    },
    avgRevenue: 1500000,
    avgYearsInBusiness: 5.8,
  },
  {
    id: 'technology',
    name: 'Technology Services',
    icon: 'Laptop',
    businessCount: 468160, // Aligned with chase.json scale (20.9x)
    totalExposure: 58291710000,
    qualRate: 44.6,
    avgScore: 81.3,
    highRiskPct: 4.1,
    trend: { direction: 'up', value: 5.2 },
    topProducts: [
      { name: 'Term Loan', eligible: 208665 },
      { name: 'Line of Credit', eligible: 187264 },
      { name: 'SBA 7(a)', eligible: 117040 },
      { name: 'Equipment Financing', eligible: 70224 },
    ],
    region: {
      Northeast: 140448,
      Southeast: 93632,
      Midwest: 70224,
      Southwest: 65542,
      West: 98314,
    },
    riskDistribution: {
      LOW: 234080,
      MODERATE: 154493,
      ELEVATED: 65542,
      HIGH: 9363,
      CRITICAL: 4682,
    },
    avgRevenue: 4500000,
    avgYearsInBusiness: 6.4,
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: 'Factory',
    businessCount: 390830, // Aligned with chase.json scale (20.9x)
    totalExposure: 98176960000,
    qualRate: 40.3,
    avgScore: 76.8,
    highRiskPct: 6.2,
    trend: { direction: 'stable', value: 0.3 },
    topProducts: [
      { name: 'Term Loan', eligible: 157502 },
      { name: 'Equipment Financing', eligible: 140699 },
      { name: 'Line of Credit', eligible: 125066 },
      { name: 'SBA 7(a)', eligible: 93800 },
    ],
    region: {
      Northeast: 97708,
      Southeast: 101616,
      Midwest: 132884,
      Southwest: 39083,
      West: 19542,
    },
    riskDistribution: {
      LOW: 175874,
      MODERATE: 125066,
      ELEVATED: 66441,
      HIGH: 19542,
      CRITICAL: 3908,
    },
    avgRevenue: 8900000,
    avgYearsInBusiness: 14.6,
  },
  {
    id: 'transportation',
    name: 'Transportation & Logistics',
    icon: 'Truck',
    businessCount: 319770, // Aligned with chase.json scale (20.9x)
    totalExposure: 49085040000,
    qualRate: 33.7,
    avgScore: 70.5,
    highRiskPct: 9.8,
    trend: { direction: 'up', value: 2.1 },
    topProducts: [
      { name: 'Equipment Financing', eligible: 115117 },
      { name: 'Line of Credit', eligible: 102326 },
      { name: 'Term Loan', eligible: 89535 },
      { name: 'SBA 7(a)', eligible: 44768 },
    ],
    region: {
      Northeast: 57559,
      Southeast: 79943,
      Midwest: 76752,
      Southwest: 67151,
      West: 38365,
    },
    riskDistribution: {
      LOW: 121513,
      MODERATE: 95931,
      ELEVATED: 63954,
      HIGH: 25582,
      CRITICAL: 12791,
    },
    avgRevenue: 5400000,
    avgYearsInBusiness: 9.3,
  },
  {
    id: 'realestate',
    name: 'Real Estate Services',
    icon: 'Building2',
    businessCount: 267520, // Aligned with chase.json scale (20.9x)
    totalExposure: 85920960000,
    qualRate: 37.8,
    avgScore: 73.6,
    highRiskPct: 7.5,
    trend: { direction: 'up', value: 3.4 },
    topProducts: [
      { name: 'Term Loan', eligible: 101114 },
      { name: 'Line of Credit', eligible: 85606 },
      { name: 'SBA 7(a)', eligible: 58854 },
      { name: 'Equipment Financing', eligible: 34778 },
    ],
    region: {
      Northeast: 69555,
      Southeast: 61530,
      Midwest: 45478,
      Southwest: 42803,
      West: 48154,
    },
    riskDistribution: {
      LOW: 117709,
      MODERATE: 82931,
      ELEVATED: 45478,
      HIGH: 16051,
      CRITICAL: 5350,
    },
    avgRevenue: 11200000,
    avgYearsInBusiness: 12.4,
  },
  {
    id: 'wholesale',
    name: 'Wholesale & Distribution',
    icon: 'Package',
    businessCount: 338580, // Aligned with chase.json scale (20.9x)
    totalExposure: 46018350000,
    qualRate: 35.2,
    avgScore: 71.9,
    highRiskPct: 8.9,
    trend: { direction: 'stable', value: -0.2 },
    topProducts: [
      { name: 'Line of Credit', eligible: 119172 },
      { name: 'Term Loan', eligible: 101574 },
      { name: 'Equipment Financing', eligible: 74488 },
      { name: 'SBA 7(a)', eligible: 47401 },
    ],
    region: {
      Northeast: 74488,
      Southeast: 84645,
      Midwest: 88032,
      Southwest: 50787,
      West: 40630,
    },
    riskDistribution: {
      LOW: 135432,
      MODERATE: 101574,
      ELEVATED: 60944,
      HIGH: 27086,
      CRITICAL: 13543,
    },
    avgRevenue: 4700000,
    avgYearsInBusiness: 10.8,
  },
  {
    id: 'auto',
    name: 'Auto Services',
    icon: 'Car',
    businessCount: 282150, // Aligned with chase.json scale (20.9x)
    totalExposure: 24545940000,
    qualRate: 30.4,
    avgScore: 67.3,
    highRiskPct: 12.1,
    trend: { direction: 'down', value: -0.9 },
    topProducts: [
      { name: 'Equipment Financing', eligible: 85774 },
      { name: 'Line of Credit', eligible: 76181 },
      { name: 'Term Loan', eligible: 64895 },
      { name: 'SBA 7(a)', eligible: 33858 },
    ],
    region: {
      Northeast: 59252,
      Southeast: 73356,
      Midwest: 67716,
      Southwest: 47969,
      West: 33858,
    },
    riskDistribution: {
      LOW: 104394,
      MODERATE: 84645,
      ELEVATED: 56430,
      HIGH: 25401,
      CRITICAL: 11286,
    },
    avgRevenue: 2900000,
    avgYearsInBusiness: 8.9,
  },
  {
    id: 'other',
    name: 'Other Services',
    icon: 'MoreHorizontal',
    businessCount: 231990, // Aligned with chase.json scale (20.9x)
    totalExposure: 18405270000,
    qualRate: 32.1,
    avgScore: 69.8,
    highRiskPct: 10.3,
    trend: { direction: 'stable', value: 0.1 },
    topProducts: [
      { name: 'Line of Credit', eligible: 74236 },
      { name: 'Term Loan', eligible: 62637 },
      { name: 'Equipment Financing', eligible: 48718 },
      { name: 'SBA 7(a)', eligible: 34798 },
    ],
    region: {
      Northeast: 51036,
      Southeast: 58000,
      Midwest: 48718,
      Southwest: 41757,
      West: 32479,
    },
    riskDistribution: {
      LOW: 88156,
      MODERATE: 69597,
      ELEVATED: 46398,
      HIGH: 20879,
      CRITICAL: 6960,
    },
    avgRevenue: 2100000,
    avgYearsInBusiness: 7.6,
  },
];

// Validation: Sum should be ~6,000,000 (aligned with chase.json)
// 894520 + 652080 + 804650 + 604010 + 744040 + 468160 + 390830 + 319770 + 267520 + 338580 + 282150 + 231990 = ~5,998,300 ✓

// ============================================================================
// PORTFOLIO KPIS — CHASE
// ============================================================================

const CHASE_PORTFOLIO_KPIS: PortfolioKPI[] = [
  {
    id: 'total-portfolio',
    label: 'Total Portfolio',
    value: 6000000, // Aligned with chase.json
    format: 'number',
    trend: { direction: 'up', value: 2.4, label: '+2.4% vs last quarter' },
    status: 'positive',
    tooltip: 'Total number of businesses in portfolio',
    dataSource: 'Portfolio Management System',
  },
  {
    id: 'total-exposure',
    label: 'Total Exposure',
    value: 650000000000, // Aligned with chase.json ($650B)
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
    value: 383306, // Scaled: 18340 * 20.9
    format: 'number',
    trend: { direction: 'down', value: -4.2, label: '-4.2% vs last quarter' },
    status: 'warning',
    tooltip: 'Businesses with HIGH or CRITICAL risk tier (6.4% of portfolio)',
    dataSource: 'Early Warning System',
  },
  {
    id: 'offer-pipeline',
    label: 'Offer Pipeline',
    value: 147232000000, // Scaled: 4.8B * 30.67 (exposure ratio)
    format: 'currency',
    trend: { direction: 'up', value: 8.7, label: '+8.7% vs last quarter' },
    status: 'positive',
    tooltip: 'Total value of pre-qualified offers pending business action',
    dataSource: 'Offer Management',
  },
];

// ============================================================================
// GEOGRAPHIC DISTRIBUTION — CHASE
// Total: 6,000,000 businesses | $650B exposure
// Aligned with chase.json — scale factor: ~20.9x
// ============================================================================

const CHASE_GEOGRAPHIC_DISTRIBUTION: GeographicDistribution[] = [
  {
    region: 'Northeast',
    states: ['CT', 'MA', 'ME', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT'],
    businessCount: 1403247, // Scaled: 67141 * 20.9
    exposure: 156467190000,
    avgScore: 73.8,
    qualRate: 37.2,
  },
  {
    region: 'Southeast',
    states: ['AL', 'AR', 'DC', 'DE', 'FL', 'GA', 'KY', 'LA', 'MD', 'MS', 'NC', 'SC', 'TN', 'VA', 'WV'],
    businessCount: 1513034, // Scaled: 72394 * 20.9
    exposure: 147232000000,
    avgScore: 70.9,
    qualRate: 34.8,
  },
  {
    region: 'Midwest',
    states: ['IA', 'IL', 'IN', 'KS', 'MI', 'MN', 'MO', 'ND', 'NE', 'OH', 'SD', 'WI'],
    businessCount: 1332208, // Scaled: 63742 * 20.9
    exposure: 128858280000,
    avgScore: 72.1,
    qualRate: 35.6,
  },
  {
    region: 'Southwest',
    states: ['AZ', 'NM', 'OK', 'TX'],
    businessCount: 983888, // Scaled: 47076 * 20.9
    exposure: 110464800000,
    avgScore: 69.4,
    qualRate: 32.9,
  },
  {
    region: 'West',
    states: ['AK', 'CA', 'CO', 'HI', 'ID', 'MT', 'NV', 'OR', 'UT', 'WA', 'WY'],
    businessCount: 765922, // Scaled: 36647 * 20.9
    exposure: 107377730000,
    avgScore: 74.6,
    qualRate: 36.4,
  },
];

// Validation: 1403247 + 1513034 + 1332208 + 983888 + 765922 = 5,998,299 ✓ (~6M)

// ============================================================================
// RISK TIER DISTRIBUTION — CHASE
// Total: 6,000,000 businesses
// Aligned with chase.json — scale factor: ~20.9x
// ============================================================================

const CHASE_RISK_TIER_DISTRIBUTION: RiskTierDistribution[] = [
  {
    tier: 'LOW',
    count: 2399320, // Scaled: 114800 * 20.9
    percentage: 40.0,
    exposure: 282328880000,
    avgScore: 84.2,
    color: 'bg-green-500',
  },
  {
    tier: 'MODERATE',
    count: 1679524, // Scaled: 80360 * 20.9
    percentage: 28.0,
    exposure: 199475550000,
    avgScore: 72.8,
    color: 'bg-blue-500',
  },
  {
    tier: 'ELEVATED',
    count: 1079694, // Scaled: 51660 * 20.9
    percentage: 18.0,
    exposure: 116564680000,
    avgScore: 64.3,
    color: 'bg-yellow-500',
  },
  {
    tier: 'HIGH',
    count: 599830, // Scaled: 28700 * 20.9
    percentage: 10.0,
    exposure: 42944020000,
    avgScore: 52.7,
    color: 'bg-orange-500',
  },
  {
    tier: 'CRITICAL',
    count: 239932, // Scaled: 11480 * 20.9
    percentage: 4.0,
    exposure: 9203670000,
    avgScore: 38.4,
    color: 'bg-red-500',
  },
];

// Validation: 2399320 + 1679524 + 1079694 + 599830 + 239932 = 5,998,300 ✓ (~6M)

// ============================================================================
// CONCENTRATION METRICS — CHASE
// ============================================================================

const CHASE_CONCENTRATION_METRICS: ConcentrationMetric[] = [
  {
    dimension: 'Industry',
    segments: [
      { name: 'Retail & E-Commerce', percentage: 14.9, exposure: 64425130000 },
      { name: 'Healthcare Services', percentage: 10.9, exposure: 55218930000 },
      { name: 'Professional Services', percentage: 13.4, exposure: 42944020000 },
      { name: 'Construction & Trades', percentage: 10.1, exposure: 73631900000 },
      { name: 'Restaurants & Food', percentage: 12.4, exposure: 33748450000 },
      { name: 'Other Industries', percentage: 38.3, exposure: 380431570000 }, // Scaled: 12.4B * 30.67
    ],
    threshold: 15.0,
    status: 'within',
  },
  {
    dimension: 'Geographic',
    segments: [
      { name: 'Northeast', percentage: 23.4, exposure: 156467190000 },
      { name: 'Southeast', percentage: 25.2, exposure: 147232000000 },
      { name: 'Midwest', percentage: 22.2, exposure: 128858280000 },
      { name: 'Southwest', percentage: 16.4, exposure: 110464800000 },
      { name: 'West', percentage: 12.8, exposure: 107377730000 },
    ],
    threshold: 30.0,
    status: 'within',
  },
  {
    dimension: 'Revenue Band',
    segments: [
      { name: '$0-$1M', percentage: 18.5, exposure: 55218930000 },
      { name: '$1M-$2.5M', percentage: 24.7, exposure: 128858280000 },
      { name: '$2.5M-$5M', percentage: 22.3, exposure: 177965320000 },
      { name: '$5M-$10M', percentage: 19.2, exposure: 187170270000 },
      { name: '$10M+', percentage: 15.3, exposure: 101205210000 },
    ],
    threshold: 25.0,
    status: 'approaching',
  },
];

// ============================================================================
// EARLY WARNING SYSTEM ALERT CLUSTERS — CHASE
// ============================================================================

const CHASE_EWS_ALERT_CLUSTERS: EWSAlertCluster[] = [
  {
    type: 'Score Drop >15pts',
    severity: 'critical',
    businessCount: 17702, // Scaled: 847 * 20.9
    totalExposure: 4355180000, // Scaled: 142M * 30.67
    topIndustries: [
      { name: 'Restaurants & Food', count: 3950 },
      { name: 'Retail & E-Commerce', count: 3386 },
      { name: 'Auto Services', count: 2466 },
      { name: 'Construction & Trades', count: 1944 },
      { name: 'Other', count: 5957 },
    ],
    trend: 'increasing',
  },
  {
    type: 'Delinquency Reported',
    severity: 'critical',
    businessCount: 4891, // Scaled: 234 * 20.9
    totalExposure: 2054890000, // Scaled: 67M * 30.67
    topIndustries: [
      { name: 'Construction & Trades', count: 1212 },
      { name: 'Restaurants & Food', count: 1066 },
      { name: 'Transportation & Logistics', count: 878 },
      { name: 'Auto Services', count: 732 },
      { name: 'Other', count: 1003 },
    ],
    trend: 'stable',
  },
  {
    type: 'Lien Filed',
    severity: 'warning',
    businessCount: 2341, // Scaled: 112 * 20.9
    totalExposure: 1042780000, // Scaled: 34M * 30.67
    topIndustries: [
      { name: 'Construction & Trades', count: 711 },
      { name: 'Manufacturing', count: 376 },
      { name: 'Transportation & Logistics', count: 334 },
      { name: 'Restaurants & Food', count: 293 },
      { name: 'Other', count: 627 },
    ],
    trend: 'decreasing',
  },
  {
    type: 'Bankruptcy Watch',
    severity: 'critical',
    businessCount: 1129, // Scaled: 54 * 20.9
    totalExposure: 858760000, // Scaled: 28M * 30.67
    topIndustries: [
      { name: 'Restaurants & Food', count: 314 },
      { name: 'Retail & E-Commerce', count: 251 },
      { name: 'Auto Services', count: 188 },
      { name: 'Construction & Trades', count: 146 },
      { name: 'Other', count: 230 },
    ],
    trend: 'increasing',
  },
];

// ============================================================================
// ACTIVE CAMPAIGNS — CHASE
// ============================================================================

const CHASE_ACTIVE_CAMPAIGNS: CampaignData[] = [
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
// COMPLETED CAMPAIGNS — CHASE
// ============================================================================

const CHASE_COMPLETED_CAMPAIGNS: CampaignData[] = [
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
// PRODUCT ELIGIBILITY — CHASE
// ============================================================================

const CHASE_PRODUCT_ELIGIBILITY: Record<string, { eligible: number; conversionRate: number }> = {
  'Line of Credit': {
    eligible: 2051419, // Scaled: 98154 * 20.9
    conversionRate: 14.2,
  },
  'Term Loan': {
    eligible: 1772508, // Scaled: 84809 * 20.9
    conversionRate: 12.8,
  },
  'Equipment Financing': {
    eligible: 1294525, // Scaled: 61939 * 20.9
    conversionRate: 16.3,
  },
  'SBA 7(a)': {
    eligible: 904071, // Scaled: 43257 * 20.9
    conversionRate: 18.9,
  },
  'Commercial Real Estate': {
    eligible: 479864, // Scaled: 22960 * 20.9
    conversionRate: 22.4,
  },
  'Business Credit Card': {
    eligible: 2641342, // Scaled: 126380 * 20.9
    conversionRate: 8.7,
  },
  'Merchant Cash Advance': {
    eligible: 719796, // Scaled: 34440 * 20.9
    conversionRate: 24.1,
  },
};

// ============================================================================
// WELLS FARGO DATA IMPORTS
// ============================================================================

import {
  WF_INDUSTRY_SEGMENTS,
  WF_PORTFOLIO_KPIS,
  WF_GEOGRAPHIC_DISTRIBUTION,
  WF_RISK_TIER_DISTRIBUTION,
  WF_CONCENTRATION_METRICS,
  WF_EWS_ALERT_CLUSTERS,
  WF_ACTIVE_CAMPAIGNS,
  WF_COMPLETED_CAMPAIGNS,
  WF_PRODUCT_ELIGIBILITY,
} from './wellsfargoPortfolioSegments';

import {
  SANT_INDUSTRY_SEGMENTS,
  SANT_PORTFOLIO_KPIS,
  SANT_GEOGRAPHIC_DISTRIBUTION,
  SANT_RISK_TIER_DISTRIBUTION,
  SANT_CONCENTRATION_METRICS,
  SANT_EWS_ALERT_CLUSTERS,
  SANT_ACTIVE_CAMPAIGNS,
  SANT_COMPLETED_CAMPAIGNS,
  SANT_PRODUCT_ELIGIBILITY,
} from './santanderPortfolioSegments';

import {
  CITI_INDUSTRY_SEGMENTS,
  CITI_PORTFOLIO_KPIS,
  CITI_GEOGRAPHIC_DISTRIBUTION,
  CITI_RISK_TIER_DISTRIBUTION,
  CITI_CONCENTRATION_METRICS,
  CITI_EWS_ALERT_CLUSTERS,
  CITI_ACTIVE_CAMPAIGNS,
  CITI_COMPLETED_CAMPAIGNS,
  CITI_PRODUCT_ELIGIBILITY,
} from './citiPortfolioSegments';

// ============================================================================
// BANK-SWITCHED EXPORTS
// Dynamically export data for Chase, Wells Fargo, Santander, or Citi
// based on ACTIVE_BANK_ID from bankConfig
// ============================================================================

export const INDUSTRY_SEGMENTS = ({
  chase: CHASE_INDUSTRY_SEGMENTS,
  wellsfargo: WF_INDUSTRY_SEGMENTS,
  santander: SANT_INDUSTRY_SEGMENTS,
  citi: CITI_INDUSTRY_SEGMENTS,
} as Record<string, IndustrySegment[]>)[ACTIVE_BANK_ID] ?? CHASE_INDUSTRY_SEGMENTS;

export const PORTFOLIO_KPIS = ({
  chase: CHASE_PORTFOLIO_KPIS,
  wellsfargo: WF_PORTFOLIO_KPIS,
  santander: SANT_PORTFOLIO_KPIS,
  citi: CITI_PORTFOLIO_KPIS,
} as Record<string, PortfolioKPI[]>)[ACTIVE_BANK_ID] ?? CHASE_PORTFOLIO_KPIS;

export const GEOGRAPHIC_DISTRIBUTION = ({
  chase: CHASE_GEOGRAPHIC_DISTRIBUTION,
  wellsfargo: WF_GEOGRAPHIC_DISTRIBUTION,
  santander: SANT_GEOGRAPHIC_DISTRIBUTION,
  citi: CITI_GEOGRAPHIC_DISTRIBUTION,
} as Record<string, GeographicDistribution[]>)[ACTIVE_BANK_ID] ?? CHASE_GEOGRAPHIC_DISTRIBUTION;

export const RISK_TIER_DISTRIBUTION = ({
  chase: CHASE_RISK_TIER_DISTRIBUTION,
  wellsfargo: WF_RISK_TIER_DISTRIBUTION,
  santander: SANT_RISK_TIER_DISTRIBUTION,
  citi: CITI_RISK_TIER_DISTRIBUTION,
} as Record<string, RiskTierDistribution[]>)[ACTIVE_BANK_ID] ?? CHASE_RISK_TIER_DISTRIBUTION;

export const CONCENTRATION_METRICS = ({
  chase: CHASE_CONCENTRATION_METRICS,
  wellsfargo: WF_CONCENTRATION_METRICS,
  santander: SANT_CONCENTRATION_METRICS,
  citi: CITI_CONCENTRATION_METRICS,
} as Record<string, ConcentrationMetric[]>)[ACTIVE_BANK_ID] ?? CHASE_CONCENTRATION_METRICS;

export const EWS_ALERT_CLUSTERS = ({
  chase: CHASE_EWS_ALERT_CLUSTERS,
  wellsfargo: WF_EWS_ALERT_CLUSTERS,
  santander: SANT_EWS_ALERT_CLUSTERS,
  citi: CITI_EWS_ALERT_CLUSTERS,
} as Record<string, EWSAlertCluster[]>)[ACTIVE_BANK_ID] ?? CHASE_EWS_ALERT_CLUSTERS;

export const ACTIVE_CAMPAIGNS = ({
  chase: CHASE_ACTIVE_CAMPAIGNS,
  wellsfargo: WF_ACTIVE_CAMPAIGNS,
  santander: SANT_ACTIVE_CAMPAIGNS,
  citi: CITI_ACTIVE_CAMPAIGNS,
} as Record<string, CampaignData[]>)[ACTIVE_BANK_ID] ?? CHASE_ACTIVE_CAMPAIGNS;

export const COMPLETED_CAMPAIGNS = ({
  chase: CHASE_COMPLETED_CAMPAIGNS,
  wellsfargo: WF_COMPLETED_CAMPAIGNS,
  santander: SANT_COMPLETED_CAMPAIGNS,
  citi: CITI_COMPLETED_CAMPAIGNS,
} as Record<string, CampaignData[]>)[ACTIVE_BANK_ID] ?? CHASE_COMPLETED_CAMPAIGNS;

export const PRODUCT_ELIGIBILITY = ({
  chase: CHASE_PRODUCT_ELIGIBILITY,
  wellsfargo: WF_PRODUCT_ELIGIBILITY,
  santander: SANT_PRODUCT_ELIGIBILITY,
  citi: CITI_PRODUCT_ELIGIBILITY,
} as Record<string, Record<string, { eligible: number; conversionRate: number }>>)[ACTIVE_BANK_ID] ?? CHASE_PRODUCT_ELIGIBILITY;

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
