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
    lumiqScore: 88,
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
    riskTier: 'medium',
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
