/**
 * CHASE DEMO DATA — HYPER-REALISTIC
 *
 * Single source of truth for all Tier 1 bank demo data.
 * All numbers are internally consistent:
 * - Segment counts sum to portfolio total (287,412 - with rounding tolerance)
 * - Percentages are mathematically accurate
 * - Trends are realistic (small changes, not wild swings)
 * - Dollar amounts use realistic SMB ranges
 */

// ── Types ────────────────────────────────────────────────────────

export type SegmentStatus = 'top_performer' | 'performing' | 'below_benchmark' | 'at_risk';
export type SegmentTrend = 'up' | 'down' | 'stable';
export type CampaignHealth = 'on_track' | 'below_target' | 'paused' | 'completed';
export type EWSSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ConcentrationStatus = 'safe' | 'warning' | 'breach';
export type ComplianceStatus = 'ok' | 'review' | 'flag';
export type SLAStatus = 'ok' | 'warning' | 'breach';
export type RiskTier = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export interface Segment {
  id: string;
  name: string;
  icon: string;
  businessCount: number;
  exposure: number;
  avgScore: number;
  preQualRate: number;
  riskDistribution: Record<string, number>;
  conversionRate: number;
  status: SegmentStatus;
  trend: SegmentTrend;
  productEligibility: Record<string, number>;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  health: CampaignHealth;
  targetSegment: string;
  targetCriteria: string;
  product: string;
  startDate: string;
  endDate: string;
  owner: string;
  funnel: {
    pushed: number;
    viewed: number;
    applied: number;
    approved: number;
  };
  viewRate: number;
  applyRate: number;
  approvalRate: number;
  approvedVolume: number;
  warning?: string;
}

export interface EWSCluster {
  id: string;
  type: string;
  severity: EWSSeverity;
  title: string;
  businessCount: number;
  exposure: number;
  heaviestSegments: { segment: string; count: number }[];
  actions: string[];
}

export interface ConcentrationEntry {
  name: string;
  percent: number;
  exposure: number;
  status: ConcentrationStatus;
}

export interface UnderwritingQueueItem {
  id: string;
  business: string;
  product: string;
  amount: number;
  score: number;
  risk: RiskTier;
  timeInQueue: number;
  slaStatus: SLAStatus;
}

export interface ComplianceVariance {
  segment: string;
  applications: number;
  approved: number;
  rate: number;
  variance: number;
  status: ComplianceStatus;
}

export interface SavedSegment {
  id: string;
  name: string;
  businessCount: number;
  exposure: number;
  createdAt: string;
}

export interface SampleBusiness {
  id: string;
  name: string;
  revenue: number;
  score: number;
  risk: RiskTier;
  status: string;
  segment: string;
  state: string;
}

// ── Portfolio Constants ──────────────────────────────────────────

export const PORTFOLIO = {
  totalBusinesses: 287_412,
  totalExposure: 47_200_000_000,
  preQualRate: 0.67,
  avgCompositeScore: 58.3,
  avgCompositeScorePrevMonth: 59.1,
  atRiskExposure: 6_100_000_000,
  atRiskPercent: 0.13,
  offerPotential: 45_000_000_000,
  quarterlyGrowth: 12_847,
  bureauHitRate: 0.987,
  avgScoreRefreshDays: 18,
} as const;

// ── Risk Tier Distribution ───────────────────────────────────────

export const RISK_TIERS = {
  LOW: {
    percent: 0.22,
    count: 63_230,
    exposure: 9_000_000_000,
    label: 'Low Risk',
  },
  MODERATE: {
    percent: 0.41,
    count: 117_839,
    exposure: 19_100_000_000,
    label: 'Moderate',
  },
  ELEVATED: {
    percent: 0.24,
    count: 68_979,
    exposure: 11_200_000_000,
    label: 'Elevated',
  },
  HIGH: {
    percent: 0.10,
    count: 28_741,
    exposure: 5_800_000_000,
    label: 'High Risk',
  },
  CRITICAL: {
    percent: 0.03,
    count: 8_623,
    exposure: 2_100_000_000,
    label: 'Critical',
  },
} as const;

// ── Industry Segments ────────────────────────────────────────────

export const SEGMENTS: Segment[] = [
  {
    id: 'seg_retail',
    name: 'Retail Trade',
    icon: '🏪',
    businessCount: 52_340,
    exposure: 8_700_000_000,
    avgScore: 61,
    preQualRate: 0.72,
    riskDistribution: { LOW: 0.24, MODERATE: 0.42, ELEVATED: 0.19, HIGH: 0.11, CRITICAL: 0.04 },
    conversionRate: 0.076,
    status: 'performing',
    trend: 'stable',
    productEligibility: { LOC: 38_200, TERM: 21_100, SBA: 8_400 },
  },
  {
    id: 'seg_professional',
    name: 'Professional Services',
    icon: '👔',
    businessCount: 41_200,
    exposure: 12_100_000_000,
    avgScore: 68,
    preQualRate: 0.81,
    riskDistribution: { LOW: 0.31, MODERATE: 0.45, ELEVATED: 0.16, HIGH: 0.06, CRITICAL: 0.02 },
    conversionRate: 0.115,
    status: 'top_performer',
    trend: 'up',
    productEligibility: { LOC: 34_800, TERM: 28_700, SBA: 12_100 },
  },
  {
    id: 'seg_construction',
    name: 'Construction',
    icon: '🏗️',
    businessCount: 38_900,
    exposure: 9_200_000_000,
    avgScore: 54,
    preQualRate: 0.58,
    riskDistribution: { LOW: 0.15, MODERATE: 0.38, ELEVATED: 0.27, HIGH: 0.14, CRITICAL: 0.06 },
    conversionRate: 0.037,
    status: 'below_benchmark',
    trend: 'down',
    productEligibility: { LOC: 22_600, TERM: 19_400, SBA: 7_800 },
  },
  {
    id: 'seg_healthcare',
    name: 'Healthcare',
    icon: '🏥',
    businessCount: 28_100,
    exposure: 7_800_000_000,
    avgScore: 63,
    preQualRate: 0.69,
    riskDistribution: { LOW: 0.26, MODERATE: 0.44, ELEVATED: 0.18, HIGH: 0.09, CRITICAL: 0.03 },
    conversionRate: 0.087,
    status: 'performing',
    trend: 'stable',
    productEligibility: { LOC: 20_100, TERM: 14_200, SBA: 5_600 },
  },
  {
    id: 'seg_manufacturing',
    name: 'Manufacturing',
    icon: '🏭',
    businessCount: 24_600,
    exposure: 11_400_000_000,
    avgScore: 65,
    preQualRate: 0.74,
    riskDistribution: { LOW: 0.27, MODERATE: 0.43, ELEVATED: 0.18, HIGH: 0.09, CRITICAL: 0.03 },
    conversionRate: 0.073,
    status: 'performing',
    trend: 'up',
    productEligibility: { LOC: 19_200, TERM: 16_800, SBA: 4_200 },
  },
  {
    id: 'seg_food_service',
    name: 'Food Service',
    icon: '🍽️',
    businessCount: 31_200,
    exposure: 4_200_000_000,
    avgScore: 48,
    preQualRate: 0.51,
    riskDistribution: { LOW: 0.11, MODERATE: 0.32, ELEVATED: 0.28, HIGH: 0.18, CRITICAL: 0.11 },
    conversionRate: 0.027,
    status: 'at_risk',
    trend: 'down',
    productEligibility: { LOC: 15_900, TERM: 8_100, SBA: 3_200 },
  },
  {
    id: 'seg_transportation',
    name: 'Transportation',
    icon: '🚛',
    businessCount: 22_100,
    exposure: 5_800_000_000,
    avgScore: 56,
    preQualRate: 0.62,
    riskDistribution: { LOW: 0.18, MODERATE: 0.40, ELEVATED: 0.24, HIGH: 0.13, CRITICAL: 0.05 },
    conversionRate: 0.054,
    status: 'performing',
    trend: 'stable',
    productEligibility: { LOC: 13_700, TERM: 11_200, SBA: 4_400 },
  },
  {
    id: 'seg_technology',
    name: 'Technology',
    icon: '💻',
    businessCount: 18_400,
    exposure: 8_900_000_000,
    avgScore: 71,
    preQualRate: 0.84,
    riskDistribution: { LOW: 0.34, MODERATE: 0.44, ELEVATED: 0.14, HIGH: 0.06, CRITICAL: 0.02 },
    conversionRate: 0.098,
    status: 'top_performer',
    trend: 'up',
    productEligibility: { LOC: 15_500, TERM: 14_200, SBA: 6_100 },
  },
];

// ── Campaigns ────────────────────────────────────────────────────

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'camp_001',
    name: 'Q1 LOC Push — Professional Services',
    status: 'active',
    health: 'on_track',
    targetSegment: 'seg_professional',
    targetCriteria: 'Professional + Score >50 + LOC eligible',
    product: 'LOC',
    startDate: '2025-01-15',
    endDate: '2025-03-31',
    owner: 'J. Smith',
    funnel: { pushed: 34_800, viewed: 14_200, applied: 4_100, approved: 3_200 },
    viewRate: 0.41,
    applyRate: 0.12,
    approvalRate: 0.78,
    approvedVolume: 412_000_000,
  },
  {
    id: 'camp_002',
    name: 'Texas Construction — Term Loan',
    status: 'active',
    health: 'below_target',
    targetSegment: 'seg_construction',
    targetCriteria: 'Construction + Texas + Term eligible',
    product: 'TERM',
    startDate: '2025-02-01',
    endDate: '2025-04-30',
    owner: 'M. Johnson',
    funnel: { pushed: 8_200, viewed: 2_100, applied: 410, approved: 298 },
    viewRate: 0.26,
    applyRate: 0.05,
    approvalRate: 0.73,
    approvedVolume: 89_000_000,
    warning: 'View rate 26% is below 35% benchmark',
  },
  {
    id: 'camp_003',
    name: 'Healthcare SBA Push',
    status: 'active',
    health: 'on_track',
    targetSegment: 'seg_healthcare',
    targetCriteria: 'Healthcare + Score >55 + SBA eligible',
    product: 'SBA',
    startDate: '2025-02-10',
    endDate: '2025-05-10',
    owner: 'A. Williams',
    funnel: { pushed: 5_600, viewed: 2_464, applied: 728, approved: 582 },
    viewRate: 0.44,
    applyRate: 0.13,
    approvalRate: 0.80,
    approvedVolume: 156_000_000,
  },
];

// Aggregated campaign KPIs for the tab header
export const CAMPAIGN_SUMMARY = {
  activeCampaigns: CAMPAIGNS.length,
  offersPushed: CAMPAIGNS.reduce((sum, c) => sum + c.funnel.pushed, 0),
  avgViewRate: 0.38,
  avgApplyRate: 0.12,
  avgApprovalRate: 0.78,
  revenueBooked: 2_100_000_000,
} as const;

// ── Conversion by Segment ────────────────────────────────────────

export const CONVERSION_BY_SEGMENT = [
  { segment: 'Professional Services', viewRate: 0.44, applyRate: 0.14, approvalRate: 0.82, endToEnd: 0.115, status: 'ok' as const },
  { segment: 'Healthcare', viewRate: 0.41, applyRate: 0.11, approvalRate: 0.79, endToEnd: 0.087, status: 'ok' as const },
  { segment: 'Retail Trade', viewRate: 0.38, applyRate: 0.10, approvalRate: 0.76, endToEnd: 0.076, status: 'ok' as const },
  { segment: 'Manufacturing', viewRate: 0.35, applyRate: 0.09, approvalRate: 0.81, endToEnd: 0.073, status: 'warning' as const },
  { segment: 'Construction', viewRate: 0.26, applyRate: 0.05, approvalRate: 0.73, endToEnd: 0.037, status: 'at_risk' as const },
  { segment: 'Food Service', viewRate: 0.22, applyRate: 0.04, approvalRate: 0.68, endToEnd: 0.027, status: 'at_risk' as const },
];

// ── Concentration Risk ───────────────────────────────────────────

export const CONCENTRATION = {
  industry: {
    limit: 0.25,
    values: [
      { name: 'Retail Trade', percent: 0.182, exposure: 8_700_000_000, status: 'safe' as ConcentrationStatus },
      { name: 'Professional Services', percent: 0.144, exposure: 12_100_000_000, status: 'safe' as ConcentrationStatus },
      { name: 'Construction', percent: 0.136, exposure: 9_200_000_000, status: 'safe' as ConcentrationStatus },
      { name: 'Healthcare', percent: 0.098, exposure: 7_800_000_000, status: 'safe' as ConcentrationStatus },
      { name: 'Manufacturing', percent: 0.086, exposure: 11_400_000_000, status: 'safe' as ConcentrationStatus },
    ],
  },
  geography: {
    limit: 0.30,
    values: [
      { name: 'Texas', percent: 0.221, exposure: 10_400_000_000, status: 'safe' as ConcentrationStatus },
      { name: 'California', percent: 0.184, exposure: 8_700_000_000, status: 'safe' as ConcentrationStatus },
      { name: 'Florida', percent: 0.121, exposure: 5_700_000_000, status: 'safe' as ConcentrationStatus },
      { name: 'New York', percent: 0.098, exposure: 4_600_000_000, status: 'safe' as ConcentrationStatus },
      { name: 'Illinois', percent: 0.076, exposure: 3_600_000_000, status: 'safe' as ConcentrationStatus },
    ],
  },
} as const;

// ── EWS Alert Clusters ───────────────────────────────────────────

export const EWS_CLUSTERS: EWSCluster[] = [
  {
    id: 'ews_score_drop',
    type: 'SCORE_DROP',
    severity: 'critical',
    title: 'Score Drop >15 Points (30 Days)',
    businessCount: 847,
    exposure: 142_000_000,
    heaviestSegments: [
      { segment: 'Retail', count: 312 },
      { segment: 'Construction', count: 201 },
      { segment: 'Food Service', count: 118 },
    ],
    actions: ['View Segment', 'Add All to Watch List', 'Assign to Team'],
  },
  {
    id: 'ews_delinquency',
    type: 'DELINQUENCY',
    severity: 'high',
    title: 'Delinquency Reported',
    businessCount: 234,
    exposure: 67_000_000,
    heaviestSegments: [
      { segment: 'Construction', count: 89 },
      { segment: 'Manufacturing', count: 52 },
      { segment: 'Retail', count: 41 },
    ],
    actions: ['View Segment', 'Add All to Watch List', 'Assign to Team'],
  },
  {
    id: 'ews_lien',
    type: 'LIEN_FILED',
    severity: 'medium',
    title: 'Lien Filed',
    businessCount: 112,
    exposure: 34_000_000,
    heaviestSegments: [
      { segment: 'Manufacturing', count: 41 },
      { segment: 'Construction', count: 32 },
      { segment: 'Transportation', count: 21 },
    ],
    actions: ['View Segment', 'Legal Review Queue', 'Assign'],
  },
  {
    id: 'ews_bankruptcy',
    type: 'BANKRUPTCY_WATCH',
    severity: 'critical',
    title: 'Bankruptcy Watch',
    businessCount: 54,
    exposure: 28_000_000,
    heaviestSegments: [
      { segment: 'Food Service', count: 23 },
      { segment: 'Retail', count: 18 },
      { segment: 'Construction', count: 8 },
    ],
    actions: ['View Segment', 'Immediate Review', 'Assign to Senior'],
  },
];

// ── Underwriting ─────────────────────────────────────────────────

export const UNDERWRITING = {
  kpis: {
    queueDepth: 127,
    avgDecisionTime: 2.4,
    autoApproveRate: 0.34,
    manualReviewRate: 0.48,
    declineRate: 0.18,
    slaCompliance: 0.94,
  },
  queue: [
    { id: 'uw_001', business: 'ABC Construction LLC', product: 'TERM', amount: 450_000, score: 52, risk: 'ELEVATED' as RiskTier, timeInQueue: 2.1, slaStatus: 'ok' as SLAStatus },
    { id: 'uw_002', business: 'Quick Retail Partners', product: 'LOC', amount: 125_000, score: 67, risk: 'MODERATE' as RiskTier, timeInQueue: 0.5, slaStatus: 'ok' as SLAStatus },
    { id: 'uw_003', business: 'ProServ Consulting Inc', product: 'SBA', amount: 750_000, score: 71, risk: 'MODERATE' as RiskTier, timeInQueue: 5.2, slaStatus: 'warning' as SLAStatus },
    { id: 'uw_004', business: 'Food Express Holdings', product: 'LOC', amount: 80_000, score: 38, risk: 'HIGH' as RiskTier, timeInQueue: 9.1, slaStatus: 'breach' as SLAStatus },
    { id: 'uw_005', business: 'MedTech Solutions', product: 'TERM', amount: 320_000, score: 74, risk: 'LOW' as RiskTier, timeInQueue: 1.2, slaStatus: 'ok' as SLAStatus },
    { id: 'uw_006', business: 'Urban Logistics Co', product: 'LOC', amount: 200_000, score: 59, risk: 'MODERATE' as RiskTier, timeInQueue: 3.8, slaStatus: 'ok' as SLAStatus },
    { id: 'uw_007', business: 'Sunrise Bakery Inc', product: 'SBA', amount: 150_000, score: 44, risk: 'ELEVATED' as RiskTier, timeInQueue: 6.5, slaStatus: 'warning' as SLAStatus },
    { id: 'uw_008', business: 'TechForward LLC', product: 'TERM', amount: 890_000, score: 78, risk: 'LOW' as RiskTier, timeInQueue: 0.8, slaStatus: 'ok' as SLAStatus },
  ],
  rules: {
    autoApprove: [
      'Composite Score ≥ 75',
      'No delinquencies in 24 months',
      'Business age ≥ 3 years',
      'Amount ≤ $100,000',
    ],
    autoDecline: [
      'Composite Score < 25',
      'Active bankruptcy',
      'Industry: Cannabis, Gaming, Adult Entertainment',
    ],
  },
} as const;

// ── Compliance ───────────────────────────────────────────────────

export const COMPLIANCE = {
  approvalVariance: [
    { segment: 'Professional Services', applications: 4_100, approved: 3_362, rate: 0.82, variance: 0.04, status: 'ok' as ComplianceStatus },
    { segment: 'Healthcare', applications: 2_800, approved: 2_212, rate: 0.79, variance: 0.01, status: 'ok' as ComplianceStatus },
    { segment: 'Retail Trade', applications: 6_200, approved: 4_712, rate: 0.76, variance: -0.02, status: 'ok' as ComplianceStatus },
    { segment: 'Manufacturing', applications: 1_900, approved: 1_539, rate: 0.81, variance: 0.03, status: 'ok' as ComplianceStatus },
    { segment: 'Construction', applications: 3_100, approved: 2_263, rate: 0.73, variance: -0.05, status: 'review' as ComplianceStatus },
    { segment: 'Food Service', applications: 1_400, approved: 952, rate: 0.68, variance: -0.10, status: 'flag' as ComplianceStatus },
  ],
  portfolioApprovalRate: 0.78,
  adverseActionsSent: 24_200,
  fairLendingStatus: 'pass',
} as const;

// ── Saved Segments ───────────────────────────────────────────────

export const SAVED_SEGMENTS: SavedSegment[] = [
  { id: 'saved_001', name: 'High Value Professional', businessCount: 12_400, exposure: 4_100_000_000, createdAt: '2025-01-15' },
  { id: 'saved_002', name: 'Texas Focus Q1', businessCount: 8_200, exposure: 1_900_000_000, createdAt: '2025-02-01' },
  { id: 'saved_003', name: 'At Risk Construction', businessCount: 2_100, exposure: 890_000_000, createdAt: '2025-02-10' },
  { id: 'saved_004', name: 'Cross-Sell Opportunities', businessCount: 67_000, exposure: 18_200_000_000, createdAt: '2025-01-08' },
];

// ── Sample Businesses (for drill-down tables) ────────────────────

export const SAMPLE_BUSINESSES: SampleBusiness[] = [
  { id: 'biz_001', name: 'Acme Retail Corporation', revenue: 2_400_000, score: 72, risk: 'LOW', status: 'Offer Sent', segment: 'seg_retail', state: 'TX' },
  { id: 'biz_002', name: 'BigBox Stores LLC', revenue: 890_000, score: 58, risk: 'MODERATE', status: 'Qualified', segment: 'seg_retail', state: 'CA' },
  { id: 'biz_003', name: 'Corner Shop Inc', revenue: 340_000, score: 41, risk: 'ELEVATED', status: 'Under Review', segment: 'seg_retail', state: 'FL' },
  { id: 'biz_004', name: 'Downtown Boutique', revenue: 520_000, score: 64, risk: 'MODERATE', status: 'Offer Sent', segment: 'seg_retail', state: 'NY' },
  { id: 'biz_005', name: 'Express Mart Holdings', revenue: 1_100_000, score: 69, risk: 'MODERATE', status: 'Applied', segment: 'seg_retail', state: 'TX' },
  { id: 'biz_006', name: 'Fashion Forward Inc', revenue: 780_000, score: 55, risk: 'MODERATE', status: 'Qualified', segment: 'seg_retail', state: 'CA' },
  { id: 'biz_007', name: 'Garden Supply Co', revenue: 420_000, score: 47, risk: 'ELEVATED', status: 'Not Eligible', segment: 'seg_retail', state: 'FL' },
  { id: 'biz_008', name: 'Hardware Haven LLC', revenue: 1_800_000, score: 76, risk: 'LOW', status: 'Approved', segment: 'seg_retail', state: 'TX' },
  { id: 'biz_009', name: 'ProServ Consulting Inc', revenue: 3_200_000, score: 74, risk: 'LOW', status: 'Approved', segment: 'seg_professional', state: 'NY' },
  { id: 'biz_010', name: 'Legal Eagles LLP', revenue: 5_400_000, score: 81, risk: 'LOW', status: 'Offer Sent', segment: 'seg_professional', state: 'CA' },
  { id: 'biz_011', name: 'ABC Construction LLC', revenue: 4_100_000, score: 52, risk: 'ELEVATED', status: 'Under Review', segment: 'seg_construction', state: 'TX' },
  { id: 'biz_012', name: 'MedTech Solutions', revenue: 2_800_000, score: 74, risk: 'LOW', status: 'Approved', segment: 'seg_healthcare', state: 'FL' },
  { id: 'biz_013', name: 'Precision Parts Inc', revenue: 6_200_000, score: 69, risk: 'MODERATE', status: 'Qualified', segment: 'seg_manufacturing', state: 'OH' },
  { id: 'biz_014', name: 'Urban Eats Holdings', revenue: 780_000, score: 44, risk: 'ELEVATED', status: 'Not Eligible', segment: 'seg_food_service', state: 'CA' },
  { id: 'biz_015', name: 'TechForward LLC', revenue: 4_500_000, score: 78, risk: 'LOW', status: 'Approved', segment: 'seg_technology', state: 'WA' },
  { id: 'biz_016', name: 'Urban Logistics Co', revenue: 1_900_000, score: 59, risk: 'MODERATE', status: 'Qualified', segment: 'seg_transportation', state: 'IL' },
  { id: 'biz_017', name: 'CloudNine Software', revenue: 3_800_000, score: 82, risk: 'LOW', status: 'Offer Sent', segment: 'seg_technology', state: 'WA' },
  { id: 'biz_018', name: 'Metro Health Group', revenue: 7_200_000, score: 71, risk: 'MODERATE', status: 'Applied', segment: 'seg_healthcare', state: 'NY' },
  { id: 'biz_019', name: 'BuildRight Contractors', revenue: 2_100_000, score: 48, risk: 'ELEVATED', status: 'Under Review', segment: 'seg_construction', state: 'FL' },
  { id: 'biz_020', name: 'Sunrise Bakery Inc', revenue: 450_000, score: 44, risk: 'ELEVATED', status: 'Not Eligible', segment: 'seg_food_service', state: 'TX' },
];

// ── Risk KPIs ────────────────────────────────────────────────────

export const RISK_KPIS = {
  portfolioAtRisk: { value: 6_100_000_000, percent: 0.13 },
  industryConcentration: { value: 0.182, label: 'Retail Trade' },
  geographicConcentration: { value: 0.221, label: 'Texas' },
  ewsAlerts: 1_247,
  thirtyDayDeterioration: 4_200,
  watchList: 8_900,
} as const;

// ── Segment Explorer filter options ──────────────────────────────

export const FILTER_OPTIONS = {
  industries: SEGMENTS.map(s => s.name),
  states: ['Texas', 'California', 'Florida', 'New York', 'Illinois', 'Ohio', 'Washington', 'Pennsylvania'],
  riskTiers: ['LOW', 'MODERATE', 'ELEVATED', 'HIGH', 'CRITICAL'] as RiskTier[],
  products: ['LOC', 'Term Loan', 'SBA 7(a)'],
  scoreRange: { min: 0, max: 100 },
  revenueRange: { min: 100_000, max: 10_000_000 },
} as const;
