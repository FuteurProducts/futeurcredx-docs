/**
 * Centralized Demo Data for LUMIQ AI Control Tower
 *
 * All numbers model a realistic 90-day bank pilot with a mid-size US bank.
 * Reference: Plaid, MX, Finicity, Experian PowerCurve integration benchmarks.
 *
 * Pilot parameters:
 * - Partner: Regional bank with ~50K SMB checking accounts
 * - Scope: Business credit scoring + pre-qualification for credit cards & LOC
 * - Duration: 90 days (started Oct 1, current = late January)
 * - Data sources: Experian BizID + Intelliscore, D&B PAYDEX, owner FICO (soft pull)
 */

// ─── Pilot Configuration ─────────────────────────────────────────────────────

export const PILOT_CONFIG = {
  bankName: 'Partner Bank',
  bankId: 'BANK-001',
  pilotStartDate: '2025-10-01',
  pilotEndDate: '2026-01-31',
  pilotDurationDays: 122,
  environment: 'sandbox' as const,
};

// ─── Portfolio KPIs ──────────────────────────────────────────────────────────
// Numbers must be internally consistent across all dashboard pages.

export const PILOT_METRICS = {
  // Business coverage
  totalBusinesses: 47500,
  scoredBusinesses: 38200,
  scoreCoverage: 80.4,   // scoredBusinesses / totalBusinesses * 100

  // Pre-qualification funnel
  preQualifiedBusinesses: 12400,
  preQualRate: 32.5,     // preQualifiedBusinesses / scoredBusinesses * 100
  applicationsStarted: 3100,
  applicationConversion: 25.0,  // from pre-qual
  approved: 2340,
  approvalRate: 75.5,    // approved / applicationsStarted * 100
  funded: 2106,
  fundingRate: 90.0,     // funded / approved * 100
  ineligible: 9300,      // businesses not meeting minimum criteria

  // Score distribution
  avgLumiqScore: 72,
  medianLumiqScore: 74,

  // API performance (90 days)
  totalApiCalls: 3247000,
  dailyAvgCalls: 35293,
  successRate: 99.94,
  avgLatencyMs: 145,
  p99LatencyMs: 380,
  errorCount: 1948,

  // Financial impact
  avgPreQualLimit: 125000,
  projectedOriginations: 292500000,  // preQualifiedBusinesses * avgPreQualLimit * some factor
  avgRevenuePerBusiness: 4250,
  projectedAnnualRevenue: 9945000,   // approved * avgRevenuePerBusiness

  // Risk metrics
  delinquencyRate: 1.8,
  defaultRate: 0.4,
  portfolioUtilization: 62.5,

  // Growth metrics
  momGrowth: 12.5,
  qoqGrowth: 38.2,
  avgTimeToApproval: 2.3,  // days
};

// ─── Core Business Entities ──────────────────────────────────────────────────
// These 10 businesses appear consistently across all dashboard pages.

export interface DemoBusinessEntity {
  id: string;
  name: string;
  legalName: string;
  industry: string;
  naicsCode: string;
  city: string;
  state: string;
  annualRevenue: number;
  employeeCount: number;
  yearsInBusiness: number;
  lumiqScore: number;
  ownerFico: number;
  riskTier: 'low' | 'medium' | 'high';
  scoreTrend: 'up' | 'down' | 'stable';
  trendValue: number;
  segment: 'micro' | 'small' | 'mid-market';
  hasActiveApplication: boolean;
  productType?: string;
  applicationAmount?: number;
}

export const DEMO_BUSINESSES: DemoBusinessEntity[] = [
  {
    id: 'biz-001',
    name: 'Stellar Dynamics LLC',
    legalName: 'Stellar Dynamics LLC',
    industry: 'Technology Services',
    naicsCode: '541511',
    city: 'Austin',
    state: 'TX',
    annualRevenue: 3400000,
    employeeCount: 42,
    yearsInBusiness: 7,
    lumiqScore: 78,
    ownerFico: 742,
    riskTier: 'low',
    scoreTrend: 'up',
    trendValue: 3,
    segment: 'small',
    hasActiveApplication: true,
    productType: 'Business Line of Credit',
    applicationAmount: 250000,
  },
  {
    id: 'biz-002',
    name: 'Metro Logistics Corp',
    legalName: 'Metro Logistics Corporation',
    industry: 'Transportation',
    naicsCode: '484110',
    city: 'Dallas',
    state: 'TX',
    annualRevenue: 5200000,
    employeeCount: 82,
    yearsInBusiness: 15,
    lumiqScore: 71,
    ownerFico: 698,
    riskTier: 'medium',
    scoreTrend: 'stable',
    trendValue: 0,
    segment: 'small',
    hasActiveApplication: true,
    productType: 'Working Capital',
    applicationAmount: 500000,
  },
  {
    id: 'biz-003',
    name: 'Apex Construction Group',
    legalName: 'Apex Construction Group Inc.',
    industry: 'Construction',
    naicsCode: '236220',
    city: 'Phoenix',
    state: 'AZ',
    annualRevenue: 8100000,
    employeeCount: 120,
    yearsInBusiness: 12,
    lumiqScore: 82,
    ownerFico: 758,
    riskTier: 'low',
    scoreTrend: 'up',
    trendValue: 4,
    segment: 'mid-market',
    hasActiveApplication: true,
    productType: 'Equipment Financing',
    applicationAmount: 350000,
  },
  {
    id: 'biz-004',
    name: 'Sunrise Healthcare Partners',
    legalName: 'Sunrise Healthcare Partners LLC',
    industry: 'Healthcare',
    naicsCode: '621111',
    city: 'Houston',
    state: 'TX',
    annualRevenue: 12500000,
    employeeCount: 210,
    yearsInBusiness: 9,
    lumiqScore: 85,
    ownerFico: 771,
    riskTier: 'low',
    scoreTrend: 'up',
    trendValue: 2,
    segment: 'mid-market',
    hasActiveApplication: false,
  },
  {
    id: 'biz-005',
    name: 'GreenLeaf Organics',
    legalName: 'GreenLeaf Organics LLC',
    industry: 'Agriculture & Food',
    naicsCode: '111000',
    city: 'Fresno',
    state: 'CA',
    annualRevenue: 1800000,
    employeeCount: 35,
    yearsInBusiness: 4,
    lumiqScore: 65,
    ownerFico: 672,
    riskTier: 'medium',
    scoreTrend: 'down',
    trendValue: 3,
    segment: 'micro',
    hasActiveApplication: true,
    productType: 'Term Loan',
    applicationAmount: 75000,
  },
  {
    id: 'biz-006',
    name: 'Coastal Hospitality Group',
    legalName: 'Coastal Hospitality Group Inc.',
    industry: 'Hospitality',
    naicsCode: '721110',
    city: 'Miami',
    state: 'FL',
    annualRevenue: 4200000,
    employeeCount: 92,
    yearsInBusiness: 6,
    lumiqScore: 58,
    ownerFico: 648,
    riskTier: 'high',
    scoreTrend: 'down',
    trendValue: 8,
    segment: 'small',
    hasActiveApplication: false,
  },
  {
    id: 'biz-007',
    name: 'Precision Manufacturing Co',
    legalName: 'Precision Manufacturing Company',
    industry: 'Manufacturing',
    naicsCode: '332710',
    city: 'Detroit',
    state: 'MI',
    annualRevenue: 9800000,
    employeeCount: 175,
    yearsInBusiness: 22,
    lumiqScore: 76,
    ownerFico: 735,
    riskTier: 'low',
    scoreTrend: 'stable',
    trendValue: 1,
    segment: 'mid-market',
    hasActiveApplication: false,
  },
  {
    id: 'biz-008',
    name: 'TechVenture Solutions',
    legalName: 'TechVenture Solutions Inc.',
    industry: 'Technology',
    naicsCode: '541512',
    city: 'San Francisco',
    state: 'CA',
    annualRevenue: 2200000,
    employeeCount: 28,
    yearsInBusiness: 3,
    lumiqScore: 85,
    ownerFico: 782,
    riskTier: 'low',
    scoreTrend: 'up',
    trendValue: 5,
    segment: 'small',
    hasActiveApplication: true,
    productType: 'Business Credit Card',
    applicationAmount: 50000,
  },
  {
    id: 'biz-009',
    name: 'Urban Retail Partners',
    legalName: 'Urban Retail Partners LP',
    industry: 'Retail',
    naicsCode: '445110',
    city: 'Chicago',
    state: 'IL',
    annualRevenue: 950000,
    employeeCount: 18,
    yearsInBusiness: 2,
    lumiqScore: 62,
    ownerFico: 665,
    riskTier: 'high',
    scoreTrend: 'down',
    trendValue: 4,
    segment: 'micro',
    hasActiveApplication: false,
  },
  {
    id: 'biz-010',
    name: 'Pacific Marine Services',
    legalName: 'Pacific Marine Services LLC',
    industry: 'Marine Services',
    naicsCode: '483211',
    city: 'Seattle',
    state: 'WA',
    annualRevenue: 6700000,
    employeeCount: 65,
    yearsInBusiness: 11,
    lumiqScore: 73,
    ownerFico: 718,
    riskTier: 'medium',
    scoreTrend: 'up',
    trendValue: 2,
    segment: 'small',
    hasActiveApplication: false,
  },
];

// ─── API Performance Trend Data ──────────────────────────────────────────────

export const API_TREND_DATA = [
  { month: 'Oct', calls: 680000, latency: 152, successRate: 99.91 },
  { month: 'Nov', calls: 790000, latency: 148, successRate: 99.93 },
  { month: 'Dec', calls: 850000, latency: 143, successRate: 99.95 },
  { month: 'Jan', calls: 927000, latency: 138, successRate: 99.96 },
];

// ─── Conversion Trend Data ───────────────────────────────────────────────────

export const CONVERSION_TREND_DATA = [
  { month: 'Oct', applications: 520, approved: 385, conversionRate: 17.1, approvalRate: 74.0 },
  { month: 'Nov', applications: 680, approved: 512, conversionRate: 19.5, approvalRate: 75.3 },
  { month: 'Dec', applications: 870, approved: 668, conversionRate: 22.8, approvalRate: 76.8 },
  { month: 'Jan', applications: 1030, approved: 775, conversionRate: 25.0, approvalRate: 75.2 },
];

// ─── System Services (for health dashboard) ─────────────────────────────────

export const SYSTEM_SERVICES = [
  { name: 'Core API', status: 'operational' as const, latency: 45, uptime: 99.99, lastCheck: '1m ago' },
  { name: 'Score Engine', status: 'operational' as const, latency: 142, uptime: 99.97, lastCheck: '1m ago' },
  { name: 'Bureau Gateway', status: 'operational' as const, latency: 234, uptime: 99.95, lastCheck: '1m ago' },
  { name: 'Webhook Delivery', status: 'operational' as const, latency: 89, uptime: 99.92, lastCheck: '1m ago' },
  { name: 'Authentication', status: 'operational' as const, latency: 28, uptime: 99.99, lastCheck: '1m ago' },
];

// ─── Recent Activity Feed ────────────────────────────────────────────────────

export const RECENT_ACTIVITIES = [
  { id: '1', type: 'connection' as const, title: 'New business scored', description: 'Experian Intelliscore pull completed', businessName: 'TechVenture Solutions', timestamp: '2m ago' },
  { id: '2', type: 'refresh' as const, title: 'Batch refresh complete', description: '1,247 scores refreshed from Experian', timestamp: '8m ago' },
  { id: '3', type: 'alert' as const, title: 'Risk alert triggered', description: 'Score dropped below threshold (58 → 52)', businessName: 'Coastal Hospitality Group', timestamp: '15m ago' },
  { id: '4', type: 'success' as const, title: 'Pre-qual match', description: 'Business Credit Card offer generated', businessName: 'Stellar Dynamics LLC', timestamp: '22m ago' },
  { id: '5', type: 'success' as const, title: 'Application approved', description: 'LOC $250K approved via auto-decision', businessName: 'Apex Construction Group', timestamp: '35m ago' },
];

// ─── Webhook Events ──────────────────────────────────────────────────────────

export const WEBHOOK_EVENTS = [
  { id: '1', eventType: 'score.updated', status: 'delivered' as const, endpoint: 'https://api.partner-bank.com/webhooks/lumiq', timestamp: '2m ago', responseTime: 89 },
  { id: '2', eventType: 'prequal.matched', status: 'delivered' as const, endpoint: 'https://api.partner-bank.com/webhooks/lumiq', timestamp: '8m ago', responseTime: 124 },
  { id: '3', eventType: 'application.approved', status: 'delivered' as const, endpoint: 'https://api.partner-bank.com/webhooks/lumiq', timestamp: '15m ago', responseTime: 95 },
  { id: '4', eventType: 'risk.alert', status: 'delivered' as const, endpoint: 'https://api.partner-bank.com/webhooks/lumiq', timestamp: '22m ago', responseTime: 108 },
];

export const WEBHOOK_STATS = {
  totalSent: 48720,
  deliveryRate: 99.7,
  avgResponseTime: 104,
  failedCount: 146,
};

// ─── Helper ──────────────────────────────────────────────────────────────────

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

// ─── Enriched Business Types ────────────────────────────────────────────────

export interface DemoBusinessOwner {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  ownershipPct: number;
  ficoScore: number;
}

export interface DemoCreditScore {
  source: 'experian_biz' | 'dun_bradstreet' | 'equifax_biz';
  score: number;
  riskClass: 'low' | 'moderate' | 'high' | 'very_high';
  factors: string[];
  pulledAt: string;
}

export interface DemoApplication {
  id: string;
  appId: string;
  businessId: string;
  businessName: string;
  status: 'submitted' | 'under_review' | 'approved' | 'declined' | 'funded';
  productType: string;
  amount: number;
  submittedAt: string;
  aiRecommendation: 'approve' | 'review' | 'decline' | null;
  confidence: number | null;
  compositeScore: number;
  riskTier: 'low' | 'medium' | 'high';
}

export interface DemoPrequalOffer {
  productType: string;
  amountMin: number;
  amountMax: number;
  rateRange: string;
  status: 'active' | 'expired' | 'accepted';
}

export interface DemoProduct {
  name: string;
  type: string;
  status: 'active' | 'pending' | 'closed';
  balance?: number;
  limit?: number;
  openedDate?: string;
}

export interface DemoAISignals {
  tradelines: { score: number; status: 'pass' | 'warning' | 'fail' };
  payments: { score: number; status: 'pass' | 'warning' | 'fail' };
  bankingHealth: { score: number; status: 'pass' | 'warning' | 'fail' };
  identity: { score: number; status: 'pass' | 'warning' | 'fail' };
  positiveFactors: string[];
  riskFactors: string[];
  summary: string;
}

export interface DemoActivityEvent {
  date: string;
  type: 'score_pull' | 'application' | 'approval' | 'prequal' | 'payment' | 'alert';
  description: string;
}

export interface EnrichedBusiness {
  id: string;
  rhs: number;
  rhsChange: number;
  rhsTrendData: number[];
  phone: string;
  email: string;
  website: string;
  owners: DemoBusinessOwner[];
  creditScores: DemoCreditScore[];
  applications: DemoApplication[];
  prequalOffers: DemoPrequalOffer[];
  products: DemoProduct[];
  aiSignals: DemoAISignals;
  activityHistory: DemoActivityEvent[];
  depositBalance: number;
  totalExposure: number;
  relationshipStage: 'prospect' | 'onboarding' | 'active' | 'expansion';
  assignedRM: string;
}

// ─── Enriched Business Data ─────────────────────────────────────────────────

const ENRICHED_BUSINESSES_MAP: Record<string, EnrichedBusiness> = {
  'biz-001': {
    id: 'biz-001',
    rhs: 82,
    rhsChange: 3,
    rhsTrendData: [75, 77, 78, 80, 82],
    phone: '(512) 555-0147',
    email: 'jchen@stellardynamics.com',
    website: 'www.stellardynamics.com',
    owners: [{
      firstName: 'James', lastName: 'Chen', title: 'CEO & Founder',
      email: 'jchen@stellardynamics.com', phone: '(512) 555-0147',
      ownershipPct: 85, ficoScore: 742,
    }],
    creditScores: [{
      source: 'experian_biz', score: 780, riskClass: 'low',
      factors: ['Strong payment history', 'Low credit utilization', 'Established trade lines', 'Diverse credit mix'],
      pulledAt: '2026-01-28T14:30:00Z',
    }],
    applications: [{
      id: 'app-001', appId: 'APP-2026-001', businessId: 'biz-001',
      businessName: 'Stellar Dynamics LLC',
      status: 'submitted', productType: 'Business Line of Credit', amount: 250000,
      submittedAt: '2026-01-25T10:15:00Z', aiRecommendation: 'approve', confidence: 91,
      compositeScore: 82, riskTier: 'low',
    }],
    prequalOffers: [
      { productType: 'Business Line of Credit', amountMin: 150000, amountMax: 300000, rateRange: '7.5% – 9.2%', status: 'accepted' },
      { productType: 'Business Credit Card', amountMin: 25000, amountMax: 75000, rateRange: '14.9% – 18.9%', status: 'active' },
    ],
    products: [
      { name: 'Business Checking', type: 'deposit', status: 'active', balance: 287400, openedDate: '2024-03-15' },
      { name: 'Business Savings', type: 'deposit', status: 'active', balance: 142000, openedDate: '2024-06-01' },
      { name: 'Line of Credit', type: 'credit', status: 'pending', limit: 250000, openedDate: '2026-01-25' },
    ],
    aiSignals: {
      tradelines: { score: 85, status: 'pass' },
      payments: { score: 88, status: 'pass' },
      bankingHealth: { score: 78, status: 'pass' },
      identity: { score: 92, status: 'pass' },
      positiveFactors: ['Consistent monthly revenue deposits', '7-year operating history', 'No NSF occurrences in 12 months', 'Growing payroll indicates expansion'],
      riskFactors: ['Sector concentration in government contracts', 'Single primary client >40% revenue'],
      summary: 'Strong tech services firm with consistent cash flow and growing headcount. Slight revenue concentration risk mitigated by contract stability.',
    },
    activityHistory: [
      { date: '2026-01-28', type: 'score_pull', description: 'Experian BizID score refreshed: 780' },
      { date: '2026-01-25', type: 'application', description: 'LOC application submitted for $250K' },
      { date: '2026-01-15', type: 'prequal', description: 'Pre-qualified for Business LOC up to $300K' },
      { date: '2025-12-20', type: 'payment', description: 'All trade payments current (30-day check)' },
      { date: '2025-11-01', type: 'score_pull', description: 'Initial scoring: Experian 775, FICO 742' },
    ],
    depositBalance: 429400,
    totalExposure: 250000,
    relationshipStage: 'active',
    assignedRM: 'Sarah Mitchell',
  },

  'biz-002': {
    id: 'biz-002',
    rhs: 68,
    rhsChange: 0,
    rhsTrendData: [70, 69, 68, 68, 68],
    phone: '(214) 555-0283',
    email: 'mrodriguez@metrologistics.com',
    website: 'www.metrologistics.com',
    owners: [{
      firstName: 'Maria', lastName: 'Rodriguez', title: 'President',
      email: 'mrodriguez@metrologistics.com', phone: '(214) 555-0283',
      ownershipPct: 60, ficoScore: 698,
    }],
    creditScores: [{
      source: 'dun_bradstreet', score: 710, riskClass: 'moderate',
      factors: ['Moderate payment speed', 'High industry risk sector', 'Adequate trade references', 'Growing debt-to-income'],
      pulledAt: '2026-01-27T09:00:00Z',
    }],
    applications: [{
      id: 'app-002', appId: 'APP-2026-002', businessId: 'biz-002',
      businessName: 'Metro Logistics Corp',
      status: 'under_review', productType: 'Working Capital', amount: 500000,
      submittedAt: '2026-01-20T14:30:00Z', aiRecommendation: 'review', confidence: 72,
      compositeScore: 68, riskTier: 'medium',
    }],
    prequalOffers: [
      { productType: 'Working Capital Loan', amountMin: 200000, amountMax: 500000, rateRange: '9.8% – 12.5%', status: 'accepted' },
    ],
    products: [
      { name: 'Business Checking', type: 'deposit', status: 'active', balance: 198500, openedDate: '2019-08-10' },
      { name: 'Fleet Card Program', type: 'credit', status: 'active', balance: 47200, limit: 75000, openedDate: '2022-01-15' },
    ],
    aiSignals: {
      tradelines: { score: 70, status: 'pass' },
      payments: { score: 65, status: 'warning' },
      bankingHealth: { score: 62, status: 'warning' },
      identity: { score: 88, status: 'pass' },
      positiveFactors: ['15-year operating history', 'Established fleet operations', 'Diversified customer base'],
      riskFactors: ['Fuel cost volatility exposure', 'Seasonal revenue fluctuations', 'Increasing average days payable', 'Owner FICO below 700 threshold'],
      summary: 'Established logistics operation with solid history but facing margin pressure from fuel costs. Payment patterns show slight slowdown requiring monitoring.',
    },
    activityHistory: [
      { date: '2026-01-27', type: 'score_pull', description: 'D&B PAYDEX refreshed: 710' },
      { date: '2026-01-20', type: 'application', description: 'Working Capital application submitted for $500K' },
      { date: '2026-01-10', type: 'prequal', description: 'Pre-qualified for Working Capital up to $500K' },
      { date: '2025-12-15', type: 'payment', description: 'Fleet card payment received — 5 days late' },
      { date: '2025-11-05', type: 'alert', description: 'D&B score dropped 15 points (725 → 710)' },
    ],
    depositBalance: 198500,
    totalExposure: 547200,
    relationshipStage: 'active',
    assignedRM: 'David Park',
  },

  'biz-003': {
    id: 'biz-003',
    rhs: 86,
    rhsChange: 4,
    rhsTrendData: [78, 80, 82, 84, 86],
    phone: '(602) 555-0391',
    email: 'rkim@apexconstruction.com',
    website: 'www.apexconstruction.com',
    owners: [{
      firstName: 'Robert', lastName: 'Kim', title: 'Managing Partner',
      email: 'rkim@apexconstruction.com', phone: '(602) 555-0391',
      ownershipPct: 70, ficoScore: 758,
    }],
    creditScores: [{
      source: 'experian_biz', score: 820, riskClass: 'low',
      factors: ['Excellent payment record', 'Strong financial statements', 'Mature business profile', 'Low debt ratio'],
      pulledAt: '2026-01-26T11:45:00Z',
    }],
    applications: [{
      id: 'app-003', appId: 'APP-2026-003', businessId: 'biz-003',
      businessName: 'Apex Construction Group',
      status: 'approved', productType: 'Equipment Financing', amount: 350000,
      submittedAt: '2026-01-10T09:00:00Z', aiRecommendation: 'approve', confidence: 94,
      compositeScore: 86, riskTier: 'low',
    }],
    prequalOffers: [
      { productType: 'Equipment Financing', amountMin: 200000, amountMax: 500000, rateRange: '6.5% – 8.0%', status: 'accepted' },
      { productType: 'Business Line of Credit', amountMin: 300000, amountMax: 750000, rateRange: '7.0% – 8.5%', status: 'active' },
    ],
    products: [
      { name: 'Business Checking', type: 'deposit', status: 'active', balance: 524000, openedDate: '2018-05-20' },
      { name: 'Equipment LOC', type: 'credit', status: 'active', balance: 180000, limit: 400000, openedDate: '2023-03-01' },
      { name: 'Business Credit Card', type: 'credit', status: 'active', balance: 12400, limit: 50000, openedDate: '2020-09-15' },
      { name: 'Business Savings', type: 'deposit', status: 'active', balance: 310000, openedDate: '2019-01-10' },
    ],
    aiSignals: {
      tradelines: { score: 90, status: 'pass' },
      payments: { score: 92, status: 'pass' },
      bankingHealth: { score: 85, status: 'pass' },
      identity: { score: 95, status: 'pass' },
      positiveFactors: ['12-year operating history', 'Consistent revenue growth', 'Strong bonding capacity', 'Multiple project pipeline'],
      riskFactors: ['Cyclical industry exposure', 'Large project concentration'],
      summary: 'Premier construction firm with strong financial position and growing backlog. Equipment financing well-supported by asset base and revenue history.',
    },
    activityHistory: [
      { date: '2026-01-26', type: 'score_pull', description: 'Experian BizID refreshed: 820' },
      { date: '2026-01-15', type: 'approval', description: 'Equipment Financing $350K approved — auto-decision' },
      { date: '2026-01-10', type: 'application', description: 'Equipment Financing application submitted for $350K' },
      { date: '2025-12-01', type: 'payment', description: 'All obligations current — perfect payment record' },
      { date: '2025-10-15', type: 'prequal', description: 'Pre-qualified for Equipment Financing up to $500K' },
    ],
    depositBalance: 834000,
    totalExposure: 542400,
    relationshipStage: 'expansion',
    assignedRM: 'Sarah Mitchell',
  },

  'biz-004': {
    id: 'biz-004',
    rhs: 88,
    rhsChange: 2,
    rhsTrendData: [82, 84, 85, 87, 88],
    phone: '(713) 555-0462',
    email: 'dpatel@sunrisehealthcare.com',
    website: 'www.sunrisehealthpartners.com',
    owners: [{
      firstName: 'Priya', lastName: 'Patel', title: 'Chief Medical Officer',
      email: 'dpatel@sunrisehealthcare.com', phone: '(713) 555-0462',
      ownershipPct: 55, ficoScore: 771,
    }],
    creditScores: [{
      source: 'equifax_biz', score: 850, riskClass: 'low',
      factors: ['Exceptional payment history', 'Low leverage ratio', 'Strong cash reserves', 'Industry stability'],
      pulledAt: '2026-01-29T08:15:00Z',
    }],
    applications: [],
    prequalOffers: [
      { productType: 'Treasury Management', amountMin: 0, amountMax: 0, rateRange: 'Custom', status: 'active' },
      { productType: 'Business Line of Credit', amountMin: 500000, amountMax: 2000000, rateRange: '5.9% – 7.5%', status: 'active' },
    ],
    products: [
      { name: 'Business Checking', type: 'deposit', status: 'active', balance: 1240000, openedDate: '2021-02-01' },
      { name: 'Treasury Management', type: 'service', status: 'active', openedDate: '2022-06-15' },
      { name: 'Business Credit Card', type: 'credit', status: 'active', balance: 8200, limit: 100000, openedDate: '2021-09-01' },
    ],
    aiSignals: {
      tradelines: { score: 93, status: 'pass' },
      payments: { score: 96, status: 'pass' },
      bankingHealth: { score: 91, status: 'pass' },
      identity: { score: 97, status: 'pass' },
      positiveFactors: ['Medicare/Medicaid reimbursement stability', 'Multi-location practice', 'Growing patient volume', 'Strong physician network'],
      riskFactors: ['Regulatory compliance overhead', 'Reimbursement rate changes'],
      summary: 'Excellent healthcare practice group with strong cash flow and minimal debt. Prime candidate for expansion financing when ready.',
    },
    activityHistory: [
      { date: '2026-01-29', type: 'score_pull', description: 'Equifax BizID refreshed: 850' },
      { date: '2026-01-15', type: 'prequal', description: 'Pre-qualified for LOC up to $2M' },
      { date: '2025-12-10', type: 'payment', description: 'All trade payments current — 0 days average payable' },
      { date: '2025-11-20', type: 'score_pull', description: 'Quarterly bureau refresh: Equifax 845' },
    ],
    depositBalance: 1240000,
    totalExposure: 8200,
    relationshipStage: 'expansion',
    assignedRM: 'Jennifer Adams',
  },

  'biz-005': {
    id: 'biz-005',
    rhs: 62,
    rhsChange: -3,
    rhsTrendData: [69, 67, 65, 63, 62],
    phone: '(559) 555-0518',
    email: 'smendez@greenleaforganics.com',
    website: 'www.greenleaforganics.com',
    owners: [{
      firstName: 'Sofia', lastName: 'Mendez', title: 'Founder & CEO',
      email: 'smendez@greenleaforganics.com', phone: '(559) 555-0518',
      ownershipPct: 100, ficoScore: 672,
    }],
    creditScores: [{
      source: 'experian_biz', score: 650, riskClass: 'moderate',
      factors: ['Limited credit history', 'High utilization on existing lines', 'Young business age', 'Seasonal revenue pattern'],
      pulledAt: '2026-01-27T16:00:00Z',
    }],
    applications: [{
      id: 'app-005', appId: 'APP-2026-005', businessId: 'biz-005',
      businessName: 'GreenLeaf Organics',
      status: 'submitted', productType: 'Term Loan', amount: 75000,
      submittedAt: '2026-01-22T11:30:00Z', aiRecommendation: 'review', confidence: 65,
      compositeScore: 62, riskTier: 'medium',
    }],
    prequalOffers: [
      { productType: 'Term Loan', amountMin: 25000, amountMax: 100000, rateRange: '11.5% – 14.9%', status: 'accepted' },
    ],
    products: [
      { name: 'Business Checking', type: 'deposit', status: 'active', balance: 34200, openedDate: '2023-04-01' },
    ],
    aiSignals: {
      tradelines: { score: 58, status: 'warning' },
      payments: { score: 62, status: 'warning' },
      bankingHealth: { score: 48, status: 'fail' },
      identity: { score: 82, status: 'pass' },
      positiveFactors: ['Growing organic food market', 'Direct-to-consumer channel', 'Increasing order frequency'],
      riskFactors: ['Only 4 years in business', 'Thin credit file (3 trade lines)', 'High seasonal revenue variance (40%)', 'Single bank relationship', 'Owner FICO in subprime range'],
      summary: 'Early-stage agricultural business with promising growth but limited credit history and significant seasonal cash flow swings. Manual review recommended.',
    },
    activityHistory: [
      { date: '2026-01-27', type: 'score_pull', description: 'Experian BizID refreshed: 650' },
      { date: '2026-01-22', type: 'application', description: 'Term Loan application submitted for $75K' },
      { date: '2026-01-05', type: 'prequal', description: 'Pre-qualified for Term Loan up to $100K' },
      { date: '2025-12-18', type: 'alert', description: 'Banking health score dropped below 50 threshold' },
      { date: '2025-11-10', type: 'score_pull', description: 'Initial scoring: Experian 660, FICO 672' },
    ],
    depositBalance: 34200,
    totalExposure: 75000,
    relationshipStage: 'onboarding',
    assignedRM: 'David Park',
  },

  'biz-006': {
    id: 'biz-006',
    rhs: 42,
    rhsChange: -8,
    rhsTrendData: [58, 54, 50, 46, 42],
    phone: '(305) 555-0627',
    email: 'dthompson@coastalhospitality.com',
    website: 'www.coastalhospitalitygroup.com',
    owners: [{
      firstName: 'David', lastName: 'Thompson', title: 'Managing Director',
      email: 'dthompson@coastalhospitality.com', phone: '(305) 555-0627',
      ownershipPct: 45, ficoScore: 648,
    }],
    creditScores: [{
      source: 'dun_bradstreet', score: 580, riskClass: 'high',
      factors: ['Declining payment trends', 'High leverage ratio', 'Industry downturn impact', 'Multiple slow-pay reports'],
      pulledAt: '2026-01-28T10:00:00Z',
    }],
    applications: [],
    prequalOffers: [],
    products: [
      { name: 'Business Checking', type: 'deposit', status: 'active', balance: 67800, openedDate: '2022-07-01' },
    ],
    aiSignals: {
      tradelines: { score: 52, status: 'warning' },
      payments: { score: 45, status: 'fail' },
      bankingHealth: { score: 38, status: 'fail' },
      identity: { score: 85, status: 'pass' },
      positiveFactors: ['Prime Miami Beach location', 'Strong brand recognition locally'],
      riskFactors: ['Seasonal revenue volatility (55% swing)', 'Declining payment patterns', 'Rising debt service ratio', 'Post-pandemic recovery slower than peers', 'Owner FICO below 650'],
      summary: 'Seasonal hospitality business facing margin pressure. Payment patterns have deteriorated over past 6 months. Not recommended for new credit at this time.',
    },
    activityHistory: [
      { date: '2026-01-28', type: 'score_pull', description: 'D&B PAYDEX refreshed: 580' },
      { date: '2026-01-20', type: 'alert', description: 'Risk alert: score dropped below 600 threshold' },
      { date: '2025-12-05', type: 'alert', description: 'Payment 15+ days late on vendor trade line' },
      { date: '2025-11-15', type: 'score_pull', description: 'D&B score declined: 610 → 580' },
    ],
    depositBalance: 67800,
    totalExposure: 0,
    relationshipStage: 'active',
    assignedRM: 'Jennifer Adams',
  },

  'biz-007': {
    id: 'biz-007',
    rhs: 79,
    rhsChange: 1,
    rhsTrendData: [76, 77, 78, 78, 79],
    phone: '(313) 555-0734',
    email: 'tmueller@precisionmfg.com',
    website: 'www.precisionmanufacturing.com',
    owners: [{
      firstName: 'Thomas', lastName: 'Mueller', title: 'CEO',
      email: 'tmueller@precisionmfg.com', phone: '(313) 555-0734',
      ownershipPct: 75, ficoScore: 735,
    }],
    creditScores: [{
      source: 'equifax_biz', score: 760, riskClass: 'low',
      factors: ['Long operating history', 'Consistent payment patterns', 'Diversified customer base', 'Strong asset base'],
      pulledAt: '2026-01-25T13:30:00Z',
    }],
    applications: [],
    prequalOffers: [
      { productType: 'Equipment Financing', amountMin: 500000, amountMax: 1500000, rateRange: '6.9% – 8.5%', status: 'active' },
      { productType: 'Working Capital LOC', amountMin: 250000, amountMax: 750000, rateRange: '7.5% – 9.0%', status: 'active' },
    ],
    products: [
      { name: 'Business Checking', type: 'deposit', status: 'active', balance: 412000, openedDate: '2010-03-15' },
      { name: 'Term Loan', type: 'credit', status: 'active', balance: 320000, limit: 500000, openedDate: '2023-09-01' },
      { name: 'Business Credit Card', type: 'credit', status: 'active', balance: 18900, limit: 75000, openedDate: '2015-06-20' },
    ],
    aiSignals: {
      tradelines: { score: 82, status: 'pass' },
      payments: { score: 84, status: 'pass' },
      bankingHealth: { score: 76, status: 'pass' },
      identity: { score: 90, status: 'pass' },
      positiveFactors: ['22-year operating history', 'Automotive OEM contracts', 'ISO 9001 certified', 'Stable workforce retention'],
      riskFactors: ['Automotive sector cyclicality', 'Capital-intensive operations'],
      summary: 'Well-established precision manufacturer with long-term OEM relationships. Stable financials with moderate growth trajectory. Good candidate for equipment expansion financing.',
    },
    activityHistory: [
      { date: '2026-01-25', type: 'score_pull', description: 'Equifax BizID refreshed: 760' },
      { date: '2026-01-10', type: 'prequal', description: 'Pre-qualified for Equipment Financing up to $1.5M' },
      { date: '2025-12-15', type: 'payment', description: 'Term loan payment received on time' },
      { date: '2025-11-01', type: 'score_pull', description: 'Quarterly refresh: Equifax 758' },
    ],
    depositBalance: 412000,
    totalExposure: 338900,
    relationshipStage: 'active',
    assignedRM: 'Sarah Mitchell',
  },

  'biz-008': {
    id: 'biz-008',
    rhs: 91,
    rhsChange: 5,
    rhsTrendData: [80, 83, 86, 89, 91],
    phone: '(415) 555-0842',
    email: 'skim@techventure.io',
    website: 'www.techventuresolutions.io',
    owners: [{
      firstName: 'Sarah', lastName: 'Kim', title: 'Co-founder & CEO',
      email: 'skim@techventure.io', phone: '(415) 555-0842',
      ownershipPct: 60, ficoScore: 782,
    }],
    creditScores: [{
      source: 'experian_biz', score: 850, riskClass: 'low',
      factors: ['Exceptional growth trajectory', 'Zero delinquencies', 'Strong venture backing', 'Low debt ratio'],
      pulledAt: '2026-01-29T15:00:00Z',
    }],
    applications: [{
      id: 'app-008', appId: 'APP-2026-008', businessId: 'biz-008',
      businessName: 'TechVenture Solutions',
      status: 'under_review', productType: 'Business Credit Card', amount: 50000,
      submittedAt: '2026-01-23T09:45:00Z', aiRecommendation: 'approve', confidence: 96,
      compositeScore: 91, riskTier: 'low',
    }],
    prequalOffers: [
      { productType: 'Business Credit Card', amountMin: 25000, amountMax: 100000, rateRange: '12.9% – 16.9%', status: 'accepted' },
      { productType: 'Business Line of Credit', amountMin: 100000, amountMax: 500000, rateRange: '7.0% – 8.5%', status: 'active' },
    ],
    products: [
      { name: 'Business Checking', type: 'deposit', status: 'active', balance: 385000, openedDate: '2024-01-15' },
      { name: 'Business Credit Card', type: 'credit', status: 'pending', limit: 50000, openedDate: '2026-01-23' },
    ],
    aiSignals: {
      tradelines: { score: 91, status: 'pass' },
      payments: { score: 94, status: 'pass' },
      bankingHealth: { score: 87, status: 'pass' },
      identity: { score: 99, status: 'pass' },
      positiveFactors: ['Exceptional growth trajectory (120% YoY)', 'Strong digital presence', 'Series A funded', 'Zero payment defaults'],
      riskFactors: ['Young business (3 years)', 'Startup burn rate'],
      summary: 'Exceptional growth trajectory with strong digital presence and venture backing. Despite young age, financial metrics outperform peers significantly.',
    },
    activityHistory: [
      { date: '2026-01-29', type: 'score_pull', description: 'Experian BizID refreshed: 850' },
      { date: '2026-01-23', type: 'application', description: 'Business Credit Card application for $50K' },
      { date: '2026-01-15', type: 'prequal', description: 'Pre-qualified for CC up to $100K and LOC up to $500K' },
      { date: '2025-12-20', type: 'score_pull', description: 'Bureau refresh: Experian 840, trending up' },
      { date: '2025-11-01', type: 'payment', description: 'All obligations current — perfect record' },
    ],
    depositBalance: 385000,
    totalExposure: 50000,
    relationshipStage: 'onboarding',
    assignedRM: 'David Park',
  },

  'biz-009': {
    id: 'biz-009',
    rhs: 48,
    rhsChange: -4,
    rhsTrendData: [56, 54, 52, 50, 48],
    phone: '(312) 555-0953',
    email: 'mjohnson@urbanretail.com',
    website: 'www.urbanretailpartners.com',
    owners: [{
      firstName: 'Marcus', lastName: 'Johnson', title: 'Owner',
      email: 'mjohnson@urbanretail.com', phone: '(312) 555-0953',
      ownershipPct: 100, ficoScore: 665,
    }],
    creditScores: [{
      source: 'dun_bradstreet', score: 620, riskClass: 'high',
      factors: ['Very limited credit history', 'High personal debt-to-income', 'New business risk', 'Single trade reference'],
      pulledAt: '2026-01-26T14:00:00Z',
    }],
    applications: [],
    prequalOffers: [],
    products: [
      { name: 'Business Checking', type: 'deposit', status: 'active', balance: 18700, openedDate: '2025-03-01' },
    ],
    aiSignals: {
      tradelines: { score: 42, status: 'fail' },
      payments: { score: 55, status: 'warning' },
      bankingHealth: { score: 40, status: 'fail' },
      identity: { score: 78, status: 'pass' },
      positiveFactors: ['Growing foot traffic in target neighborhood', 'E-commerce channel launched'],
      riskFactors: ['Only 2 years in business', 'Minimal credit history', 'Low cash reserves (<2 months)', 'High personal leverage', 'Retail sector headwinds'],
      summary: 'Early-stage retail business with limited financial history and low cash reserves. Not currently eligible for credit products. Recommend deposit relationship building.',
    },
    activityHistory: [
      { date: '2026-01-26', type: 'score_pull', description: 'D&B PAYDEX refreshed: 620' },
      { date: '2025-12-20', type: 'alert', description: 'Cash balance dropped below $20K threshold' },
      { date: '2025-11-15', type: 'score_pull', description: 'Initial scoring: D&B 635, FICO 665' },
    ],
    depositBalance: 18700,
    totalExposure: 0,
    relationshipStage: 'prospect',
    assignedRM: 'Jennifer Adams',
  },

  'biz-010': {
    id: 'biz-010',
    rhs: 74,
    rhsChange: 2,
    rhsTrendData: [68, 70, 71, 73, 74],
    phone: '(206) 555-1064',
    email: 'mwalsh@pacificmarine.com',
    website: 'www.pacificmarineservices.com',
    owners: [{
      firstName: 'Michael', lastName: 'Walsh', title: 'Captain & Owner',
      email: 'mwalsh@pacificmarine.com', phone: '(206) 555-1064',
      ownershipPct: 80, ficoScore: 718,
    }],
    creditScores: [{
      source: 'experian_biz', score: 730, riskClass: 'moderate',
      factors: ['Good payment history', 'Moderate utilization', 'Specialized industry', 'Stable revenue base'],
      pulledAt: '2026-01-28T11:30:00Z',
    }],
    applications: [],
    prequalOffers: [
      { productType: 'Equipment Financing', amountMin: 200000, amountMax: 800000, rateRange: '8.0% – 10.5%', status: 'active' },
    ],
    products: [
      { name: 'Business Checking', type: 'deposit', status: 'active', balance: 289000, openedDate: '2017-09-01' },
      { name: 'Line of Credit', type: 'credit', status: 'active', balance: 145000, limit: 300000, openedDate: '2022-04-15' },
    ],
    aiSignals: {
      tradelines: { score: 76, status: 'pass' },
      payments: { score: 79, status: 'pass' },
      bankingHealth: { score: 72, status: 'pass' },
      identity: { score: 88, status: 'pass' },
      positiveFactors: ['11-year operating history', 'Government contract revenue', 'Specialized niche market', 'Strong equipment asset base'],
      riskFactors: ['Weather-dependent operations', 'Regulatory compliance costs', 'Capital-intensive fleet maintenance'],
      summary: 'Stable marine services operation with government contract base. Good relationship candidate for equipment financing as fleet ages.',
    },
    activityHistory: [
      { date: '2026-01-28', type: 'score_pull', description: 'Experian BizID refreshed: 730' },
      { date: '2026-01-05', type: 'prequal', description: 'Pre-qualified for Equipment Financing up to $800K' },
      { date: '2025-12-20', type: 'payment', description: 'LOC payment received on time' },
      { date: '2025-11-10', type: 'score_pull', description: 'Quarterly refresh: Experian 725' },
    ],
    depositBalance: 289000,
    totalExposure: 145000,
    relationshipStage: 'active',
    assignedRM: 'Sarah Mitchell',
  },
};

// ─── Lookup Helpers ─────────────────────────────────────────────────────────

export function getEnrichedBusiness(id: string): EnrichedBusiness | undefined {
  return ENRICHED_BUSINESSES_MAP[id];
}

export function getBusinessApplications(): DemoApplication[] {
  return Object.values(ENRICHED_BUSINESSES_MAP)
    .flatMap(biz => biz.applications);
}

export function getBusinessByName(name: string): EnrichedBusiness | undefined {
  const biz = DEMO_BUSINESSES.find(b =>
    b.name.toLowerCase().includes(name.toLowerCase())
  );
  return biz ? ENRICHED_BUSINESSES_MAP[biz.id] : undefined;
}

export function getAllEnrichedBusinesses(): EnrichedBusiness[] {
  return Object.values(ENRICHED_BUSINESSES_MAP);
}
