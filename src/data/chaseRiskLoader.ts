/**
 * Chase Risk Data Loader
 * Maps Chase JSON risk metrics to shapes used by chaseDemoData.ts
 */

import chaseData from './chase.json';

// Type assertion for JSON import
const data = chaseData as unknown as {
  portfolio_summary: {
    at_risk_exposure: number;
    at_risk_count: number;
    at_risk_rate: number;
  };
  risk_metrics: {
    concentration: {
      industry: Array<{
        name: string;
        business_count: number;
        exposure: number;
        percentage: number;
        limit: number;
        status: string;
      }>;
      geographic: Array<{
        region: string;
        business_count: number;
        exposure: number;
        percentage: number;
        limit: number;
        status: string;
      }>;
    };
    ews_clusters: Array<{
      id: string;
      type: string;
      severity: string;
      business_count: number;
      total_exposure: number;
      avg_exposure: number;
      top_industries?: Array<{ name: string; count: number }>;
      top_regions?: Array<{ name: string; count: number }>;
      recommended_action: string;
    }>;
  };
};

/**
 * EXPORT 1: CHASE_RISK_KPIS
 * Risk KPI metrics for Chase portfolio
 */
export const CHASE_RISK_KPIS = {
  portfolioAtRisk: {
    value: data.portfolio_summary.at_risk_exposure, // 84500000000
    percent: data.portfolio_summary.at_risk_rate / 100, // 0.13
  },
  industryConcentration: {
    value: data.risk_metrics.concentration.industry[0].percentage / 100, // 0.179
    label: data.risk_metrics.concentration.industry[0].name, // "Professional Services"
  },
  geographicConcentration: {
    value: data.risk_metrics.concentration.geographic[0].percentage / 100, // 0.30
    label: data.risk_metrics.concentration.geographic[0].region, // "West"
  },
  ewsAlerts: data.risk_metrics.ews_clusters.reduce(
    (sum, cluster) => sum + cluster.business_count,
    0
  ), // 1420 + 892 + 2840 + 3780 = 8932
  thirtyDayDeterioration: Math.round(data.portfolio_summary.at_risk_count * 0.02), // ~15600 (2% of 780000)
  watchList: Math.round(data.portfolio_summary.at_risk_count * 0.05), // ~39000 (5% of 780000)
};

/**
 * EXPORT 2: CHASE_CONCENTRATION
 * Industry and geographic concentration limits and current values
 */
export const CHASE_CONCENTRATION = {
  industry: {
    limit: data.risk_metrics.concentration.industry[0].limit / 100, // 0.20
    values: [
      ...data.risk_metrics.concentration.industry.map((item) => ({
        name: item.name,
        percent: item.percentage / 100,
        exposure: item.exposure,
        status: (item.status === 'within' ? 'safe' : item.status) as 'safe' | 'warning' | 'breach',
      })),
      // Add Manufacturing as 5th entry
      {
        name: 'Manufacturing',
        percent: 0.08,
        exposure: 52000000000,
        status: 'safe' as const,
      },
    ],
  },
  geography: {
    limit: data.risk_metrics.concentration.geographic[0].limit / 100, // 0.35
    values: [
      ...data.risk_metrics.concentration.geographic.map((item) => ({
        name: item.region,
        percent: item.percentage / 100,
        exposure: item.exposure,
        status: (item.status === 'within' ? 'safe' : item.status) as 'safe' | 'warning' | 'breach',
      })),
      // Add Midwest
      {
        name: 'Midwest',
        percent: 0.14,
        exposure: 91000000000,
        status: 'safe' as const,
      },
      // Add Southwest
      {
        name: 'Southwest',
        percent: 0.10,
        exposure: 65000000000,
        status: 'safe' as const,
      },
    ],
  },
};

/**
 * Helper function to derive EWS type code from ID
 */
function deriveTypeCode(id: string): string {
  const typeMap: Record<string, string> = {
    ews_revenue_decline: 'REVENUE_DECLINE',
    ews_payment_stress: 'PAYMENT_STRESS',
    ews_industry_headwind: 'INDUSTRY_HEADWIND',
    ews_geographic_risk: 'GEOGRAPHIC_RISK',
  };
  return typeMap[id] || 'UNKNOWN';
}

/**
 * Helper function to map severity
 */
function mapSeverity(severity: string): 'critical' | 'high' | 'medium' | 'low' {
  if (severity === 'critical') return 'critical';
  if (severity === 'warning') return 'medium';
  if (severity === 'medium') return 'medium';
  if (severity === 'high') return 'high';
  return 'low';
}

/**
 * EXPORT 3: CHASE_EWS_CLUSTERS
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

export const CHASE_EWS_CLUSTERS: EWSCluster[] = data.risk_metrics.ews_clusters.map((cluster) => ({
  id: cluster.id,
  type: deriveTypeCode(cluster.id),
  severity: mapSeverity(cluster.severity),
  title: cluster.type,
  businessCount: cluster.business_count,
  exposure: cluster.total_exposure,
  heaviestSegments: (cluster.top_industries || cluster.top_regions || []).map((item) => ({
    segment: item.name,
    count: item.count,
  })),
  actions: ['View Segment', 'Add All to Watch List', 'Assign to Team'],
}));

/**
 * EXPORT 4: CHASE_COMPLIANCE
 * Compliance and fair lending metrics scaled to Chase portfolio
 */
export const CHASE_COMPLIANCE = {
  approvalVariance: [
    {
      segment: 'Professional Services',
      applications: 215000,
      approved: 176300,
      rate: 0.82,
      variance: 0.1,
      status: 'ok' as const,
    },
    {
      segment: 'Technology Services',
      applications: 180000,
      approved: 144000,
      rate: 0.8,
      variance: 0.08,
      status: 'ok' as const,
    },
    {
      segment: 'Healthcare Services',
      applications: 195000,
      approved: 146250,
      rate: 0.75,
      variance: 0.03,
      status: 'ok' as const,
    },
    {
      segment: 'Manufacturing',
      applications: 125000,
      approved: 91250,
      rate: 0.73,
      variance: 0.01,
      status: 'ok' as const,
    },
    {
      segment: 'Retail Trade',
      applications: 230000,
      approved: 158100,
      rate: 0.687,
      variance: -0.033,
      status: 'review' as const,
    },
    {
      segment: 'Food Service',
      applications: 210000,
      approved: 136500,
      rate: 0.65,
      variance: -0.07,
      status: 'flag' as const,
    },
  ],
  portfolioApprovalRate: 0.72,
  adverseActionsSent: 960000, // 6M businesses * 0.16 application rate
  fairLendingStatus: 'pass',
};
