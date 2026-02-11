/**
 * Santander Risk Data Loader
 * Maps Santander JSON risk metrics to shapes used by santanderDemoData.ts
 */

import santanderData from './santander.json';

// Type assertion for JSON import
const data = santanderData as unknown as {
  portfolio_summary: {
    at_risk_exposure: number;
    at_risk_count: number;
    total_businesses: number;
  };
  risk_metrics: {
    concentration_metrics: {
      industry_concentration: {
        highest: string;
        percentage: number;
        threshold: number;
        status: string;
      };
      geographic_concentration: {
        highest: string;
        percentage: number;
        threshold: number;
        status: string;
      };
      revenue_band_concentration: {
        highest: string;
        percentage: number;
        threshold: number;
        status: string;
      };
    };
    early_warning_signals: {
      declining_scores_30d: number;
      payment_delays_increasing: number;
      utilization_spike: number;
      bankruptcy_filings: number;
    };
  };
};

/**
 * EXPORT 1: SANT_RISK_KPIS
 * Risk KPI metrics for Santander portfolio
 */
export const SANT_RISK_KPIS = {
  portfolioAtRisk: {
    value: data.portfolio_summary.at_risk_exposure,
    percent: data.portfolio_summary.at_risk_count / data.portfolio_summary.total_businesses,
  },
  industryConcentration: {
    value: data.risk_metrics.concentration_metrics.industry_concentration.percentage / 100,
    label: data.risk_metrics.concentration_metrics.industry_concentration.highest,
  },
  geographicConcentration: {
    value: data.risk_metrics.concentration_metrics.geographic_concentration.percentage / 100,
    label: data.risk_metrics.concentration_metrics.geographic_concentration.region,
  },
  ewsAlerts:
    data.risk_metrics.early_warning_signals.declining_scores_30d +
    data.risk_metrics.early_warning_signals.payment_delays_increasing +
    data.risk_metrics.early_warning_signals.utilization_spike +
    data.risk_metrics.early_warning_signals.bankruptcy_filings,
  thirtyDayDeterioration: data.risk_metrics.early_warning_signals.declining_scores_30d,
  watchList: Math.round(data.portfolio_summary.at_risk_count * 0.05),
};

/**
 * EXPORT 2: SANT_CONCENTRATION
 * Industry and geographic concentration limits and current values
 */
export const SANT_CONCENTRATION = {
  industry: {
    limit: data.risk_metrics.concentration_metrics.industry_concentration.threshold / 100,
    values: [
      {
        name: 'Real Estate Services',
        percent: data.risk_metrics.concentration_metrics.industry_concentration.percentage / 100,
        exposure: Math.round(8000000000 * 0.214),
        status: data.risk_metrics.concentration_metrics.industry_concentration.status === 'within' ? ('safe' as const) : ('warning' as const),
      },
      {
        name: 'Professional Services',
        percent: 0.162,
        exposure: Math.round(8000000000 * 0.162),
        status: 'safe' as const,
      },
      {
        name: 'Healthcare Services',
        percent: 0.143,
        exposure: Math.round(8000000000 * 0.143),
        status: 'safe' as const,
      },
      {
        name: 'Restaurants & Food',
        percent: 0.134,
        exposure: Math.round(8000000000 * 0.134),
        status: 'safe' as const,
      },
      {
        name: 'Retail & E-Commerce',
        percent: 0.12,
        exposure: Math.round(8000000000 * 0.12),
        status: 'safe' as const,
      },
    ],
  },
  geography: {
    limit: data.risk_metrics.concentration_metrics.geographic_concentration.threshold / 100,
    values: [
      {
        name: 'Northeast',
        percent: data.risk_metrics.concentration_metrics.geographic_concentration.percentage / 100,
        exposure: Math.round(8000000000 * 0.635),
        status: data.risk_metrics.concentration_metrics.geographic_concentration.status === 'within' ? ('safe' as const) : ('warning' as const),
      },
      {
        name: 'Mid-Atlantic',
        percent: 0.18,
        exposure: Math.round(8000000000 * 0.18),
        status: 'safe' as const,
      },
      {
        name: 'Southeast',
        percent: 0.09,
        exposure: Math.round(8000000000 * 0.09),
        status: 'safe' as const,
      },
      {
        name: 'Southwest',
        percent: 0.06,
        exposure: Math.round(8000000000 * 0.06),
        status: 'safe' as const,
      },
      {
        name: 'Other',
        percent: 0.035,
        exposure: Math.round(8000000000 * 0.035),
        status: 'safe' as const,
      },
    ],
  },
};

/**
 * Helper function to derive EWS type code
 */
function deriveTypeCode(id: string): string {
  const typeMap: Record<string, string> = {
    ews_declining_scores: 'SCORE_DECLINE',
    ews_payment_delays: 'PAYMENT_STRESS',
    ews_utilization_spike: 'UTILIZATION_SPIKE',
    ews_bankruptcy: 'BANKRUPTCY_RISK',
  };
  return typeMap[id] || 'UNKNOWN';
}

/**
 * EXPORT 3: SANT_EWS_CLUSTERS
 * Early Warning System cluster alerts
 */
interface EWSCluster {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  businessCount: number;
  exposure: number;
  heaviestSegments: Array<{ segment: string; count: number }>;
  actions: string[];
}

export const SANT_EWS_CLUSTERS: EWSCluster[] = [
  {
    id: 'ews_declining_scores',
    type: deriveTypeCode('ews_declining_scores'),
    severity: 'medium',
    title: 'Score Deterioration (30 days)',
    businessCount: data.risk_metrics.early_warning_signals.declining_scores_30d,
    exposure: Math.round(data.risk_metrics.early_warning_signals.declining_scores_30d * 44444), // avg $44K exposure
    heaviestSegments: [
      { segment: 'Restaurants & Food', count: Math.round(data.risk_metrics.early_warning_signals.declining_scores_30d * 0.35) },
      { segment: 'Retail & E-Commerce', count: Math.round(data.risk_metrics.early_warning_signals.declining_scores_30d * 0.28) },
      { segment: 'Construction & Trades', count: Math.round(data.risk_metrics.early_warning_signals.declining_scores_30d * 0.22) },
    ],
    actions: ['View Segment', 'Add All to Watch List', 'Assign to Team'],
  },
  {
    id: 'ews_payment_delays',
    type: deriveTypeCode('ews_payment_delays'),
    severity: 'high',
    title: 'Payment Delays Increasing',
    businessCount: data.risk_metrics.early_warning_signals.payment_delays_increasing,
    exposure: Math.round(data.risk_metrics.early_warning_signals.payment_delays_increasing * 47000),
    heaviestSegments: [
      { segment: 'Restaurants & Food', count: Math.round(data.risk_metrics.early_warning_signals.payment_delays_increasing * 0.40) },
      { segment: 'Retail & E-Commerce', count: Math.round(data.risk_metrics.early_warning_signals.payment_delays_increasing * 0.32) },
      { segment: 'Auto Services', count: Math.round(data.risk_metrics.early_warning_signals.payment_delays_increasing * 0.18) },
    ],
    actions: ['View Segment', 'Add All to Watch List', 'Assign to Team'],
  },
  {
    id: 'ews_utilization_spike',
    type: deriveTypeCode('ews_utilization_spike'),
    severity: 'medium',
    title: 'Credit Utilization Spike',
    businessCount: data.risk_metrics.early_warning_signals.utilization_spike,
    exposure: Math.round(data.risk_metrics.early_warning_signals.utilization_spike * 42000),
    heaviestSegments: [
      { segment: 'Construction & Trades', count: Math.round(data.risk_metrics.early_warning_signals.utilization_spike * 0.33) },
      { segment: 'Manufacturing', count: Math.round(data.risk_metrics.early_warning_signals.utilization_spike * 0.27) },
      { segment: 'Wholesale & Distribution', count: Math.round(data.risk_metrics.early_warning_signals.utilization_spike * 0.24) },
    ],
    actions: ['View Segment', 'Add All to Watch List', 'Assign to Team'],
  },
  {
    id: 'ews_bankruptcy',
    type: deriveTypeCode('ews_bankruptcy'),
    severity: 'critical',
    title: 'Bankruptcy Filings',
    businessCount: data.risk_metrics.early_warning_signals.bankruptcy_filings,
    exposure: Math.round(data.risk_metrics.early_warning_signals.bankruptcy_filings * 52000),
    heaviestSegments: [
      { segment: 'Restaurants & Food', count: Math.round(data.risk_metrics.early_warning_signals.bankruptcy_filings * 0.38) },
      { segment: 'Retail & E-Commerce', count: Math.round(data.risk_metrics.early_warning_signals.bankruptcy_filings * 0.30) },
      { segment: 'Other Services', count: Math.round(data.risk_metrics.early_warning_signals.bankruptcy_filings * 0.22) },
    ],
    actions: ['View Segment', 'Add All to Watch List', 'Assign to Team'],
  },
];

/**
 * EXPORT 4: SANT_COMPLIANCE
 * Compliance and fair lending metrics scaled to Santander portfolio
 */
export const SANT_COMPLIANCE = {
  approvalVariance: [
    {
      segment: 'Professional Services',
      applications: 6450,
      approved: 5289,
      rate: 0.82,
      variance: 0.1,
      status: 'ok' as const,
    },
    {
      segment: 'Healthcare Services',
      applications: 5688,
      approved: 4550,
      rate: 0.80,
      variance: 0.08,
      status: 'ok' as const,
    },
    {
      segment: 'Real Estate Services',
      applications: 3168,
      approved: 2376,
      rate: 0.75,
      variance: 0.03,
      status: 'ok' as const,
    },
    {
      segment: 'Technology Services',
      applications: 2138,
      approved: 1561,
      rate: 0.73,
      variance: 0.01,
      status: 'ok' as const,
    },
    {
      segment: 'Retail & E-Commerce',
      applications: 4752,
      approved: 3264,
      rate: 0.687,
      variance: -0.033,
      status: 'review' as const,
    },
    {
      segment: 'Restaurants & Food',
      applications: 5302,
      approved: 3446,
      rate: 0.65,
      variance: -0.07,
      status: 'flag' as const,
    },
  ],
  portfolioApprovalRate: 0.72,
  adverseActionsSent: Math.round(180000 * 0.16),
  fairLendingStatus: 'pass',
};
