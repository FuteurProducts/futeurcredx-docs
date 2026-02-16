/**
 * wellsfargoPortfolioSegments.ts
 *
 * Wells Fargo-specific portfolio analytics data for LumiqAI Dashboard
 * Based on wellsfargo.json: 3.3M customers, $670B exposure
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
// Total: 3,300,000 businesses | $670B exposure
// 8 segments from wellsfargo.json with realistic WF scale
// ============================================================================

export const WF_INDUSTRY_SEGMENTS: IndustrySegment[] = [
  {
    id: 'seg_tech',
    name: 'Technology',
    icon: 'Laptop',
    businessCount: 346500,
    totalExposure: 70350000000, // $70.35B
    qualRate: 44.8,
    avgScore: 76, // FICO 715 → (715-300)/550*100 = 75.45
    highRiskPct: 4.2,
    trend: { direction: 'up', value: 12.4 },
    topProducts: [
      { name: 'BusinessLine Line of Credit', eligible: 155925 },
      { name: 'Prime Line of Credit', eligible: 121275 },
      { name: 'SBA 7(a) Loan', eligible: 69300 },
      { name: 'Equipment Financing', eligible: 48510 },
    ],
    region: {
      Northeast: 34650,
      Southeast: 52000,
      Midwest: 52000,
      Southwest: 69300,
      West: 138550, // CA, WA heavy
    },
    riskDistribution: {
      LOW: 173250,
      MODERATE: 121275,
      ELEVATED: 41580,
      HIGH: 6930,
      CRITICAL: 3465,
    },
    avgRevenue: 4800000,
    avgYearsInBusiness: 6.8,
  },
  {
    id: 'seg_prof_services',
    name: 'Professional Services',
    icon: 'Briefcase',
    businessCount: 389400,
    totalExposure: 79060200000, // $79.06B
    qualRate: 42.3,
    avgScore: 74, // FICO 708 → 74.18
    highRiskPct: 5.1,
    trend: { direction: 'up', value: 7.9 },
    topProducts: [
      { name: 'BusinessLine Line of Credit', eligible: 164682 },
      { name: 'Prime Line of Credit', eligible: 128102 },
      { name: 'SBA 7(a) Loan', eligible: 81648 },
      { name: 'Equipment Financing', eligible: 54432 },
    ],
    region: {
      Northeast: 116820, // NY heavy
      Southeast: 77880,
      Midwest: 62292,
      Southwest: 62292,
      West: 70116, // CA
    },
    riskDistribution: {
      LOW: 171138,
      MODERATE: 140346,
      ELEVATED: 62292,
      HIGH: 11682,
      CRITICAL: 3894,
    },
    avgRevenue: 2400000,
    avgYearsInBusiness: 10.5,
  },
  {
    id: 'seg_manufacturing',
    name: 'Manufacturing',
    icon: 'Factory',
    businessCount: 468600,
    totalExposure: 95139600000, // $95.14B
    qualRate: 38.7,
    avgScore: 71, // FICO 692 → 71.27
    highRiskPct: 6.9,
    trend: { direction: 'stable', value: 5.2 },
    topProducts: [
      { name: 'Equipment Financing', eligible: 181374 },
      { name: 'Prime Line of Credit', eligible: 150252 },
      { name: 'SBA 7(a) Loan', eligible: 98406 },
      { name: 'Commercial Real Estate Loan', eligible: 65604 },
    ],
    region: {
      Northeast: 46860, // PA
      Southeast: 70290,
      Midwest: 234300, // OH, MI, IN, WI heavy
      Southwest: 70290,
      West: 46860,
    },
    riskDistribution: {
      LOW: 168696,
      MODERATE: 159462,
      ELEVATED: 93720,
      HIGH: 32802,
      CRITICAL: 14058,
    },
    avgRevenue: 7200000,
    avgYearsInBusiness: 13.2,
  },
  {
    id: 'seg_retail',
    name: 'Retail Trade',
    icon: 'ShoppingBag',
    businessCount: 405900,
    totalExposure: 82389870000, // $82.39B
    qualRate: 34.6,
    avgScore: 72, // FICO 695 → 71.82
    highRiskPct: 8.8,
    trend: { direction: 'up', value: 4.8 },
    topProducts: [
      { name: 'BusinessLine Line of Credit', eligible: 140436 },
      { name: 'Small Business Advantage LOC', eligible: 114066 },
      { name: 'Equipment Financing', eligible: 81180 },
      { name: 'Working Capital Loan', eligible: 56826 },
    ],
    region: {
      Northeast: 81180, // NY
      Southeast: 97416,
      Midwest: 73062,
      Southwest: 81180, // TX
      West: 73062, // CA
    },
    riskDistribution: {
      LOW: 146124,
      MODERATE: 138006,
      ELEVATED: 85239,
      HIGH: 28413,
      CRITICAL: 8118,
    },
    avgRevenue: 3100000,
    avgYearsInBusiness: 8.7,
  },
  {
    id: 'seg_healthcare',
    name: 'Healthcare',
    icon: 'Heart',
    businessCount: 363000,
    totalExposure: 73699890000, // $73.70B
    qualRate: 46.2,
    avgScore: 75, // FICO 710 → 74.55
    highRiskPct: 4.8,
    trend: { direction: 'up', value: 8.6 },
    topProducts: [
      { name: 'SBA 7(a) Loan', eligible: 167706 },
      { name: 'Equipment Financing', eligible: 145200 },
      { name: 'Prime Line of Credit', eligible: 116688 },
      { name: 'BusinessLine Line of Credit', eligible: 90750 },
    ],
    region: {
      Northeast: 54450, // PA
      Southeast: 94710, // FL, TX
      Midwest: 54450,
      Southwest: 72600,
      West: 86790, // CA
    },
    riskDistribution: {
      LOW: 190575,
      MODERATE: 134505,
      ELEVATED: 32670,
      HIGH: 3630,
      CRITICAL: 1815,
    },
    avgRevenue: 3800000,
    avgYearsInBusiness: 11.8,
  },
  {
    id: 'seg_construction',
    name: 'Construction',
    icon: 'HardHat',
    businessCount: 511500,
    totalExposure: 103850450000, // $103.85B — WF's strongest segment
    qualRate: 31.2,
    avgScore: 70, // FICO 685 → 70.00
    highRiskPct: 12.8,
    trend: { direction: 'up', value: 6.3 },
    topProducts: [
      { name: 'Equipment Financing', eligible: 184140 },
      { name: 'Commercial Real Estate Loan', eligible: 153450 },
      { name: 'BusinessLine Line of Credit', eligible: 138075 },
      { name: 'SBA 504 Loan', eligible: 102300 },
    ],
    region: {
      Northeast: 51150,
      Southeast: 153450, // TX, FL, NC, GA heavy
      Midwest: 61380,
      Southwest: 153450, // TX
      West: 92070, // CA
    },
    riskDistribution: {
      LOW: 163920,
      MODERATE: 173805,
      ELEVATED: 107415,
      HIGH: 51150,
      CRITICAL: 15345,
    },
    avgRevenue: 5600000,
    avgYearsInBusiness: 9.1,
  },
  {
    id: 'seg_food_service',
    name: 'Food Service & Agriculture',
    icon: 'UtensilsCrossed',
    businessCount: 336600,
    totalExposure: 68340098000, // $68.34B — WF's #1 ag lender
    qualRate: 36.8,
    avgScore: 70, // FICO 688 → 70.55
    highRiskPct: 9.2,
    trend: { direction: 'up', value: 5.7 },
    topProducts: [
      { name: 'SBA 7(a) Loan', eligible: 123804 },
      { name: 'Equipment Financing', eligible: 110880 },
      { name: 'BusinessLine Line of Credit', eligible: 94248 },
      { name: 'Commercial Real Estate Loan', eligible: 67320 },
    ],
    region: {
      Northeast: 33660,
      Southeast: 50490,
      Midwest: 151140, // IA, NE, MN heavy
      Southwest: 67320, // TX
      West: 33990, // CA
    },
    riskDistribution: {
      LOW: 131208,
      MODERATE: 123804,
      ELEVATED: 57456,
      HIGH: 20196,
      CRITICAL: 3366,
    },
    avgRevenue: 4200000,
    avgYearsInBusiness: 16.4,
  },
  {
    id: 'seg_transportation',
    name: 'Transportation & Logistics',
    icon: 'Truck',
    businessCount: 478500,
    totalExposure: 97169850000, // $97.17B
    qualRate: 33.5,
    avgScore: 71, // FICO 690 → 70.91
    highRiskPct: 10.4,
    trend: { direction: 'up', value: 7.1 },
    topProducts: [
      { name: 'Commercial Auto Financing', eligible: 181920 },
      { name: 'Equipment Financing', eligible: 157545 },
      { name: 'Working Capital Loan', eligible: 133170 },
      { name: 'BusinessLine Line of Credit', eligible: 105405 },
    ],
    region: {
      Northeast: 47850,
      Southeast: 119625, // FL, GA
      Midwest: 91260, // IL
      Southwest: 143550, // TX heavy
      West: 76215, // CA
    },
    riskDistribution: {
      LOW: 167475,
      MODERATE: 162540,
      ELEVATED: 91260,
      HIGH: 43065,
      CRITICAL: 14355,
    },
    avgRevenue: 5100000,
    avgYearsInBusiness: 10.2,
  },
];

// Validation: 346500 + 389400 + 468600 + 405900 + 363000 + 511500 + 336600 + 478500 = 3,300,000 ✓

// ============================================================================
// PORTFOLIO KPIS
// ============================================================================

export const WF_PORTFOLIO_KPIS: PortfolioKPI[] = [
  {
    id: 'total-portfolio',
    label: 'Total Portfolio',
    value: 3300000,
    format: 'number',
    trend: { direction: 'up', value: 3.0, label: '+3.0% vs last quarter' },
    status: 'positive',
    tooltip: 'Total number of businesses in portfolio',
    dataSource: 'Portfolio Management System',
  },
  {
    id: 'total-exposure',
    label: 'Total Exposure',
    value: 670000000000, // $670B
    format: 'currency',
    trend: { direction: 'up', value: 3.8, label: '+3.8% vs last quarter' },
    status: 'positive',
    tooltip: 'Total outstanding credit exposure across all products',
    dataSource: 'Credit Ledger',
  },
  {
    id: 'qualification-rate',
    label: 'Qualification Rate',
    value: 38.6, // Weighted avg across segments
    format: 'percent',
    trend: { direction: 'up', value: 0.8, label: '+0.8pp vs last quarter' },
    status: 'positive',
    tooltip: 'Percentage of businesses qualifying for at least one product',
    dataSource: 'Underwriting Engine',
  },
  {
    id: 'avg-credit-score',
    label: 'Avg Credit Score',
    value: 72.4, // Weighted avg: ~698 FICO → 72.4 LUMIQ
    format: 'score',
    trend: { direction: 'stable', value: 0.2, label: '+0.2pts vs last quarter' },
    status: 'neutral',
    tooltip: 'Portfolio-weighted average credit score (0-100 scale)',
    dataSource: 'Risk Analytics',
  },
  {
    id: 'at-risk-businesses',
    label: 'At-Risk Businesses',
    value: 429000, // 13% from wellsfargo.json
    format: 'number',
    trend: { direction: 'down', value: -3.8, label: '-3.8% vs last quarter' },
    status: 'warning',
    tooltip: 'Businesses with HIGH or CRITICAL risk tier (13.0% of portfolio)',
    dataSource: 'Early Warning System',
  },
  {
    id: 'offer-pipeline',
    label: 'Offer Pipeline',
    value: 43550000000, // $43.55B (~6.5% of exposure)
    format: 'currency',
    trend: { direction: 'up', value: 6.2, label: '+6.2% vs last quarter' },
    status: 'positive',
    tooltip: 'Total value of pre-qualified offers pending business action',
    dataSource: 'Offer Management',
  },
];

// ============================================================================
// GEOGRAPHIC DISTRIBUTION
// Total: 3,300,000 businesses | $670B exposure
// WF footprint: heavy California, Texas, West/Southeast
// ============================================================================

export const WF_GEOGRAPHIC_DISTRIBUTION: GeographicDistribution[] = [
  {
    region: 'Northeast',
    states: ['CT', 'MA', 'ME', 'NH', 'NJ', 'NY', 'PA', 'RI', 'VT'],
    businessCount: 528000, // 16.0%
    exposure: 107200000000, // $107.2B
    avgScore: 74.2,
    qualRate: 40.1,
  },
  {
    region: 'Southeast',
    states: ['AL', 'AR', 'DC', 'DE', 'FL', 'GA', 'KY', 'LA', 'MD', 'MS', 'NC', 'SC', 'TN', 'VA', 'WV'],
    businessCount: 759000, // 23.0%
    exposure: 154100000000, // $154.1B
    avgScore: 71.8,
    qualRate: 37.4,
  },
  {
    region: 'Midwest',
    states: ['IA', 'IL', 'IN', 'KS', 'MI', 'MN', 'MO', 'ND', 'NE', 'OH', 'SD', 'WI'],
    businessCount: 759000, // 23.0% — strong manufacturing + ag
    exposure: 140780000000, // $140.78B
    avgScore: 72.6,
    qualRate: 38.9,
  },
  {
    region: 'Southwest',
    states: ['AZ', 'NM', 'OK', 'TX'],
    businessCount: 726000, // 22.0% — TX heavy
    exposure: 147400000000, // $147.4B
    avgScore: 70.9,
    qualRate: 36.2,
  },
  {
    region: 'West',
    states: ['AK', 'CA', 'CO', 'HI', 'ID', 'MT', 'NV', 'OR', 'UT', 'WA', 'WY'],
    businessCount: 528000, // 16.0% — CA dominant
    exposure: 120520000000, // $120.52B
    avgScore: 73.8,
    qualRate: 41.2,
  },
];

// Validation: 528000 + 759000 + 759000 + 726000 + 528000 = 3,300,000 ✓

// ============================================================================
// RISK TIER DISTRIBUTION
// Total: 3,300,000 businesses
// From wellsfargo.json credit_quality distribution
// ============================================================================

export const WF_RISK_TIER_DISTRIBUTION: RiskTierDistribution[] = [
  {
    tier: 'LOW',
    count: 1155000, // 35.0% (excellent 750+)
    percentage: 35.0,
    exposure: 234500000000, // $234.5B
    avgScore: 83, // FICO 785 → 88.18, conservative to 83
    color: 'bg-green-500',
  },
  {
    tier: 'MODERATE',
    count: 825000, // 25.0% (good 700-749)
    percentage: 25.0,
    exposure: 167500000000, // $167.5B
    avgScore: 77, // FICO 725 → 77.27
    color: 'bg-blue-500',
  },
  {
    tier: 'ELEVATED',
    count: 660000, // 20.0% (fair 650-699)
    percentage: 20.0,
    exposure: 134000000000, // $134B
    avgScore: 68, // FICO 675 → 68.18
    color: 'bg-yellow-500',
  },
  {
    tier: 'HIGH',
    count: 429000, // 13.0% (poor 600-649)
    percentage: 13.0,
    exposure: 87100000000, // $87.1B
    avgScore: 59, // FICO 625 → 59.09
    color: 'bg-orange-500',
  },
  {
    tier: 'CRITICAL',
    count: 231000, // 7.0% (very poor <600)
    percentage: 7.0,
    exposure: 46900000000, // $46.9B
    avgScore: 48, // FICO 565 → 48.18
    color: 'bg-red-500',
  },
];

// Validation: 1155000 + 825000 + 660000 + 429000 + 231000 = 3,300,000 ✓

// ============================================================================
// CONCENTRATION METRICS
// ============================================================================

export const WF_CONCENTRATION_METRICS: ConcentrationMetric[] = [
  {
    dimension: 'Industry',
    segments: [
      { name: 'Construction', percentage: 15.5, exposure: 103850450000 },
      { name: 'Manufacturing', percentage: 14.2, exposure: 95139600000 },
      { name: 'Transportation & Logistics', percentage: 14.5, exposure: 97169850000 },
      { name: 'Professional Services', percentage: 11.8, exposure: 79060200000 },
      { name: 'Healthcare', percentage: 11.0, exposure: 73699890000 },
      { name: 'Other Industries', percentage: 33.0, exposure: 220079910000 },
    ],
    threshold: 15.0,
    status: 'approaching', // Construction at 15.5%
  },
  {
    dimension: 'Geographic',
    segments: [
      { name: 'Southeast', percentage: 23.0, exposure: 154100000000 },
      { name: 'Midwest', percentage: 23.0, exposure: 140780000000 },
      { name: 'Southwest', percentage: 22.0, exposure: 147400000000 },
      { name: 'West', percentage: 16.0, exposure: 120520000000 },
      { name: 'Northeast', percentage: 16.0, exposure: 107200000000 },
    ],
    threshold: 30.0,
    status: 'within',
  },
  {
    dimension: 'Revenue Band',
    segments: [
      { name: '$0-$1M', percentage: 22.1, exposure: 148070000000 },
      { name: '$1M-$2.5M', percentage: 26.3, exposure: 176210000000 },
      { name: '$2.5M-$5M', percentage: 21.8, exposure: 146060000000 },
      { name: '$5M-$10M', percentage: 18.4, exposure: 123280000000 },
      { name: '$10M+', percentage: 11.4, exposure: 76380000000 },
    ],
    threshold: 25.0,
    status: 'approaching', // $1M-$2.5M at 26.3%
  },
];

// ============================================================================
// EARLY WARNING SYSTEM ALERT CLUSTERS
// ============================================================================

export const WF_EWS_ALERT_CLUSTERS: EWSAlertCluster[] = [
  {
    type: 'Score Drop >15pts',
    severity: 'critical',
    businessCount: 9900, // 0.3% of portfolio
    totalExposure: 2680000000, // $2.68B
    topIndustries: [
      { name: 'Retail Trade', count: 2030 },
      { name: 'Food Service & Agriculture', count: 1684 },
      { name: 'Construction', count: 1534 },
      { name: 'Transportation & Logistics', count: 1437 },
      { name: 'Other', count: 3215 },
    ],
    trend: 'stable',
  },
  {
    type: 'Delinquency Reported',
    severity: 'critical',
    businessCount: 3729, // 30+ days delinquent (1.13% from wellsfargo.json)
    totalExposure: 7572700000, // $7.57B
    topIndustries: [
      { name: 'Construction', count: 1023 },
      { name: 'Food Service & Agriculture', count: 746 },
      { name: 'Retail Trade', count: 649 },
      { name: 'Transportation & Logistics', count: 478 },
      { name: 'Other', count: 833 },
    ],
    trend: 'decreasing',
  },
  {
    type: 'Lien Filed',
    severity: 'warning',
    businessCount: 1650, // 0.05%
    totalExposure: 1005000000, // $1.01B
    topIndustries: [
      { name: 'Construction', count: 511 },
      { name: 'Manufacturing', count: 281 },
      { name: 'Transportation & Logistics', count: 239 },
      { name: 'Retail Trade', count: 203 },
      { name: 'Other', count: 416 },
    ],
    trend: 'stable',
  },
  {
    type: 'Bankruptcy Watch',
    severity: 'critical',
    businessCount: 825, // 0.025%
    totalExposure: 536250000, // $536M
    topIndustries: [
      { name: 'Retail Trade', count: 203 },
      { name: 'Food Service & Agriculture', count: 168 },
      { name: 'Construction', count: 128 },
      { name: 'Transportation & Logistics', count: 119 },
      { name: 'Other', count: 207 },
    ],
    trend: 'increasing',
  },
];

// ============================================================================
// ACTIVE CAMPAIGNS
// From wellsfargo.json campaigns array
// ============================================================================

export const WF_ACTIVE_CAMPAIGNS: CampaignData[] = [
  {
    id: 'camp_wf_businessline_q1',
    name: 'BusinessLine LOC Spring 2026',
    segment: 'Technology, Professional Services, Healthcare',
    product: 'BusinessLine Line of Credit',
    status: 'active',
    startDate: '2026-01-15',
    endDate: '2026-03-31',
    funnel: {
      pushed: 285000,
      viewed: 267400,
      applied: 18920,
      approved: 13844,
    },
    approvedVolume: 588370000, // $588.37M
  },
  {
    id: 'camp_wf_sba_7a_rural',
    name: 'SBA 7(a) Rural Growth Initiative',
    segment: 'Food Service & Agriculture, Manufacturing, Construction',
    product: 'SBA 7(a) Loan',
    status: 'active',
    startDate: '2025-10-01',
    endDate: '2026-09-30',
    funnel: {
      pushed: 125000,
      viewed: 118750,
      applied: 4275,
      approved: 3249,
    },
    approvedVolume: 1250865000, // $1.25B
  },
  {
    id: 'camp_wf_equipment_q4',
    name: 'Commercial Equipment Finance Q4',
    segment: 'Manufacturing, Transportation & Logistics, Construction, Healthcare',
    product: 'Equipment Financing',
    status: 'active',
    startDate: '2025-11-01',
    endDate: '2026-02-28',
    funnel: {
      pushed: 142000,
      viewed: 135900,
      applied: 5436,
      approved: 4076,
    },
    approvedVolume: 2139900000, // $2.14B
  },
];

// ============================================================================
// COMPLETED CAMPAIGNS
// ============================================================================

export const WF_COMPLETED_CAMPAIGNS: CampaignData[] = [
  {
    id: 'camp_wf_c01',
    name: 'Q4 2025 Retail LOC Push',
    segment: 'Retail Trade',
    product: 'Small Business Advantage LOC',
    status: 'completed',
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    funnel: {
      pushed: 95000,
      viewed: 85500,
      applied: 5985,
      approved: 4189,
    },
    approvedVolume: 293250000,
  },
  {
    id: 'camp_wf_c02',
    name: 'Agricultural Equipment Fall 2025',
    segment: 'Food Service & Agriculture',
    product: 'Equipment Financing',
    status: 'completed',
    startDate: '2025-09-01',
    endDate: '2025-11-30',
    funnel: {
      pushed: 68000,
      viewed: 61200,
      applied: 3672,
      approved: 2570,
    },
    approvedVolume: 512500000,
  },
  {
    id: 'camp_wf_c03',
    name: 'Construction SBA Summer',
    segment: 'Construction',
    product: 'SBA 504 Loan',
    status: 'completed',
    startDate: '2025-07-15',
    endDate: '2025-09-30',
    funnel: {
      pushed: 51000,
      viewed: 45900,
      applied: 2295,
      approved: 1606,
    },
    approvedVolume: 724700000,
  },
  {
    id: 'camp_wf_c04',
    name: 'Healthcare Term Loan Q2',
    segment: 'Healthcare',
    product: 'SBA 7(a) Loan',
    status: 'completed',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    funnel: {
      pushed: 78000,
      viewed: 70200,
      applied: 4212,
      approved: 3159,
    },
    approvedVolume: 886200000,
  },
  {
    id: 'camp_wf_c05',
    name: 'Tech Services LOC Spring',
    segment: 'Technology',
    product: 'Prime Line of Credit',
    status: 'completed',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    funnel: {
      pushed: 69000,
      viewed: 62100,
      applied: 4347,
      approved: 3217,
    },
    approvedVolume: 804250000,
  },
  {
    id: 'camp_wf_c06',
    name: 'Transportation Fleet Finance',
    segment: 'Transportation & Logistics',
    product: 'Commercial Auto Financing',
    status: 'completed',
    startDate: '2025-05-15',
    endDate: '2025-07-31',
    funnel: {
      pushed: 95000,
      viewed: 85500,
      applied: 5985,
      approved: 4488,
    },
    approvedVolume: 1347000000,
  },
];

// ============================================================================
// PRODUCT ELIGIBILITY
// ============================================================================

export const WF_PRODUCT_ELIGIBILITY: Record<string, { eligible: number; conversionRate: number }> = {
  'BusinessLine Line of Credit': {
    eligible: 1089000, // 33% of portfolio
    conversionRate: 7.08,
  },
  'Prime Line of Credit': {
    eligible: 726000, // 22% of portfolio
    conversionRate: 8.4,
  },
  'Small Business Advantage LOC': {
    eligible: 495000, // 15% of portfolio
    conversionRate: 6.2,
  },
  'SBA 7(a) Loan': {
    eligible: 825000, // 25% of portfolio
    conversionRate: 9.8,
  },
  'SBA 504 Loan': {
    eligible: 396000, // 12% of portfolio
    conversionRate: 11.2,
  },
  'Equipment Financing': {
    eligible: 990000, // 30% of portfolio
    conversionRate: 10.5,
  },
  'Commercial Real Estate Loan': {
    eligible: 363000, // 11% of portfolio
    conversionRate: 14.6,
  },
  'Commercial Auto Financing': {
    eligible: 478500, // 14.5% (transportation segment)
    conversionRate: 13.8,
  },
  'Working Capital Loan': {
    eligible: 660000, // 20% of portfolio
    conversionRate: 8.9,
  },
};
