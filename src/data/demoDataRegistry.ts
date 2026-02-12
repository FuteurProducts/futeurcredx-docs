/**
 * Demo Data Registry
 *
 * Centralized registry mapping BFF service domains to demo data sources.
 * All data is bank-switched at import time via ACTIVE_BANK_ID.
 *
 * Usage with useBffQuery:
 *   const { data } = useBffQuery({
 *     queryFn: (pid) => campaignsService.list(pid),
 *     demoData: demoRegistry.campaigns.list,
 *   });
 */

// ─── Campaign domain ────────────────────────────────────────────────────────
import {
  CAMPAIGNS,
  CAMPAIGN_SUMMARY,
  CONVERSION_BY_SEGMENT,
} from './chaseDemoData';

// ─── Risk domain ────────────────────────────────────────────────────────────
import {
  PORTFOLIO,
  RISK_KPIS,
  RISK_TIERS,
  CONCENTRATION,
  EWS_CLUSTERS,
  COMPLIANCE,
  UNDERWRITING,
  SEGMENTS,
  SAVED_SEGMENTS,
  SAMPLE_BUSINESSES,
  FILTER_OPTIONS,
} from './chaseDemoData';

// ─── Customer domain ────────────────────────────────────────────────────────
import { CUSTOMER_DEMO_DATA } from './customerDemoData';
import { DEMO_BUSINESSES } from './fallback/demoData';
import type { DemoBusinessEntity } from './fallback/demoData';

// ─── Overview / Dashboard domain ────────────────────────────────────────────
import { PILOT_METRICS, PILOT_CONFIG } from './fallback/demoData';

// ─── Analytics domain ───────────────────────────────────────────────────────
import {
  mockPortfolioKPIs,
  mockScoreDistribution,
  mockScoreMigration,
  mockRiskDrivers,
  mockProductPenetration,
  mockCrossSellFunnel,
  mockApplicationFunnel,
  mockFeatureImportance,
  mockSignalDrift,
} from '@/components/enterprise/analytics';

// ─── Products domain ───────────────────────────────────────────────────────
import { mockBankProducts } from '@/components/enterprise/products';

// ─── Reports domain ────────────────────────────────────────────────────────
import {
  mockReportTemplates,
  mockGeneratedReports,
  mockMetricTree,
} from '@/components/enterprise/reports';

// ─── Portfolio segments ─────────────────────────────────────────────────────
import {
  PORTFOLIO_KPIS,
  INDUSTRY_SEGMENTS,
  CAMPAIGNS as PORTFOLIO_CAMPAIGNS,
  PRODUCT_ELIGIBILITY,
  GEOGRAPHIC_DISTRIBUTION,
  RISK_TIER_DISTRIBUTION,
  SCORE_MIGRATION,
  CONCENTRATION_RISKS,
  EWS_ALERTS,
} from './portfolioSegments';

// ─── Risk Intelligence ──────────────────────────────────────────────────────
import {
  INITIAL_PORTFOLIO_FILTER,
  INITIAL_RISK_LENSES,
} from './riskDemoData';

// ─── Demo Data Store (mutable session data) ─────────────────────────────────
import { demoDataStore } from './demoDataStore';

// ─── Mock notifications (self-contained) ────────────────────────────────────

const DEMO_NOTIFICATIONS = [
  {
    id: 'notif-001',
    type: 'alert' as const,
    priority: 'high' as const,
    title: 'EWS Alert: Revenue Decline Cluster',
    message: '12 businesses in the Healthcare segment showing 15%+ revenue decline over 90 days.',
    isRead: false,
    createdAt: '2026-02-11T14:30:00Z',
    actionUrl: '/risk',
  },
  {
    id: 'notif-002',
    type: 'system' as const,
    priority: 'medium' as const,
    title: 'Model v3.2 Deployed',
    message: 'Credit risk model v3.2 is now active. AUC improved from 0.847 to 0.862.',
    isRead: false,
    createdAt: '2026-02-11T10:15:00Z',
  },
  {
    id: 'notif-003',
    type: 'workflow' as const,
    priority: 'high' as const,
    title: 'Underwriting Queue: 3 SLA Breaches',
    message: '3 applications have exceeded the 48-hour SLA threshold. Immediate review required.',
    isRead: false,
    createdAt: '2026-02-10T16:45:00Z',
    actionUrl: '/underwriting',
  },
  {
    id: 'notif-004',
    type: 'report' as const,
    priority: 'low' as const,
    title: 'Monthly Portfolio Report Ready',
    message: 'January 2026 portfolio performance report has been generated and is ready for download.',
    isRead: true,
    createdAt: '2026-02-01T09:00:00Z',
    actionUrl: '/reports',
  },
  {
    id: 'notif-005',
    type: 'alert' as const,
    priority: 'medium' as const,
    title: 'Concentration Limit Warning',
    message: 'Construction & Real Estate sector concentration at 18.2% — approaching 20% limit.',
    isRead: true,
    createdAt: '2026-01-30T11:20:00Z',
    actionUrl: '/risk',
  },
];

const DEMO_NOTIFICATION_SUMMARY = {
  total: DEMO_NOTIFICATIONS.length,
  unread: DEMO_NOTIFICATIONS.filter(n => !n.isRead).length,
  byPriority: {
    high: DEMO_NOTIFICATIONS.filter(n => n.priority === 'high').length,
    medium: DEMO_NOTIFICATIONS.filter(n => n.priority === 'medium').length,
    low: DEMO_NOTIFICATIONS.filter(n => n.priority === 'low').length,
  },
};

// ─── Mock settings (self-contained) ─────────────────────────────────────────

const DEMO_PLATFORM_USERS = [
  {
    id: 'user-001',
    email: 'admin@lumiq.ai',
    firstName: 'Sarah',
    lastName: 'Mitchell',
    role: 'admin' as const,
    status: 'active' as const,
    lastLogin: '2026-02-11T14:00:00Z',
    createdAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 'user-002',
    email: 'risk.analyst@lumiq.ai',
    firstName: 'James',
    lastName: 'Chen',
    role: 'risk' as const,
    status: 'active' as const,
    lastLogin: '2026-02-10T09:30:00Z',
    createdAt: '2025-07-15T00:00:00Z',
  },
  {
    id: 'user-003',
    email: 'developer@lumiq.ai',
    firstName: 'Priya',
    lastName: 'Sharma',
    role: 'developer' as const,
    status: 'active' as const,
    lastLogin: '2026-02-09T16:20:00Z',
    createdAt: '2025-08-01T00:00:00Z',
  },
  {
    id: 'user-004',
    email: 'rm.lead@lumiq.ai',
    firstName: 'Marcus',
    lastName: 'Williams',
    role: 'rm' as const,
    status: 'active' as const,
    lastLogin: '2026-02-08T11:45:00Z',
    createdAt: '2025-09-10T00:00:00Z',
  },
  {
    id: 'user-005',
    email: 'readonly@lumiq.ai',
    firstName: 'Elena',
    lastName: 'Rodriguez',
    role: 'readonly' as const,
    status: 'invited' as const,
    lastLogin: null,
    createdAt: '2026-01-20T00:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const demoRegistry = {
  /** Dashboard overview / index page */
  overview: {
    pilotMetrics: PILOT_METRICS,
    pilotConfig: PILOT_CONFIG,
  },

  /** Campaign management */
  campaigns: {
    list: CAMPAIGNS,
    summary: CAMPAIGN_SUMMARY,
    conversionBySegment: CONVERSION_BY_SEGMENT,
  },

  /** Product catalog & eligibility */
  products: {
    list: mockBankProducts,
  },

  /** Underwriting queue & decisioning */
  underwriting: {
    queue: UNDERWRITING,
  },

  /** Portfolio analytics */
  analytics: {
    portfolioKPIs: mockPortfolioKPIs,
    scoreDistribution: mockScoreDistribution,
    scoreMigration: mockScoreMigration,
    riskDrivers: mockRiskDrivers,
    productPenetration: mockProductPenetration,
    crossSellFunnel: mockCrossSellFunnel,
    applicationFunnel: mockApplicationFunnel,
    featureImportance: mockFeatureImportance,
    signalDrift: mockSignalDrift,
  },

  /** Risk intelligence */
  risk: {
    portfolio: PORTFOLIO,
    kpis: RISK_KPIS,
    tiers: RISK_TIERS,
    concentration: CONCENTRATION,
    ewsClusters: EWS_CLUSTERS,
    compliance: COMPLIANCE,
    segments: SEGMENTS,
    savedSegments: SAVED_SEGMENTS,
    sampleBusinesses: SAMPLE_BUSINESSES,
    filterOptions: FILTER_OPTIONS,
    initialFilter: INITIAL_PORTFOLIO_FILTER,
    initialLenses: INITIAL_RISK_LENSES,
  },

  /** Customer engagement */
  customers: {
    list: CUSTOMER_DEMO_DATA,
    businesses: DEMO_BUSINESSES,
  },

  /** Notifications */
  notifications: {
    list: DEMO_NOTIFICATIONS,
    summary: DEMO_NOTIFICATION_SUMMARY,
  },

  /** Reports */
  reports: {
    templates: mockReportTemplates,
    generated: mockGeneratedReports,
    metricTree: mockMetricTree,
  },

  /** Portfolio segments (analytics drill-down) */
  portfolioSegments: {
    kpis: PORTFOLIO_KPIS,
    industrySegments: INDUSTRY_SEGMENTS,
    campaigns: PORTFOLIO_CAMPAIGNS,
    productEligibility: PRODUCT_ELIGIBILITY,
    geographicDistribution: GEOGRAPHIC_DISTRIBUTION,
    riskTierDistribution: RISK_TIER_DISTRIBUTION,
    scoreMigration: SCORE_MIGRATION,
    concentrationRisks: CONCENTRATION_RISKS,
    ewsAlerts: EWS_ALERTS,
  },

  /** Platform settings */
  settings: {
    users: DEMO_PLATFORM_USERS,
  },

  /** Mutable session store (approve/decline/score pull) */
  store: demoDataStore,
} as const;

// ─── Convenience type exports ───────────────────────────────────────────────

export type { DemoBusinessEntity };
export type DemoRegistry = typeof demoRegistry;
