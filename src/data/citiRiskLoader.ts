/**
 * Citi Risk Data Loader
 * Maps Citi JSON risk metrics to shapes used by citiDemoData.ts
 */

import citiData from './citi.json';

// Type assertion for JSON import
const data = citiData as unknown as {
  portfolio_summary: {
    at_risk_exposure: number;
    at_risk_percent: number;
  };
  risk_metrics: {
    portfolio_at_risk: {
      value: number;
      percent: number;
    };
    industry_concentration: {
      value: number;
      label: string;
    };
    geographic_concentration: {
      value: number;
      label: string;
    };
    ews_alerts: number;
    thirty_day_deterioration: number;
    watch_list: number;
  };
  concentration: {
    industry: {
      limit: number;
      values: Array<{
        name: string;
        percent: number;
        exposure: number;
        status: string;
      }>;
    };
    geography: {
      limit: number;
      values: Array<{
        name: string;
        percent: number;
        exposure: number;
        status: string;
      }>;
    };
  };
  ews_clusters: Array<{
    id: string;
    type: string;
    severity: string;
    title: string;
    business_count: number;
    exposure: number;
    heaviest_segments: Array<{ segment: string; count: number }>;
    actions: string[];
    trend?: string;
  }>;
  compliance: {
    approval_variance: Array<{
      segment: string;
      applications: number;
      approved: number;
      rate: number;
      variance: number;
      status: string;
    }>;
    portfolio_approval_rate: number;
    adverse_actions_sent: number;
    fair_lending_status: string;
    international_compliance_reviews?: number;
  };
};

/**
 * EXPORT 1: CITI_RISK_KPIS
 * Risk KPI metrics for Citi portfolio
 */
export const CITI_RISK_KPIS = {
  portfolioAtRisk: {
    value: data.risk_metrics.portfolio_at_risk.value,
    percent: data.risk_metrics.portfolio_at_risk.percent,
  },
  industryConcentration: {
    value: data.risk_metrics.industry_concentration.value,
    label: data.risk_metrics.industry_concentration.label,
  },
  geographicConcentration: {
    value: data.risk_metrics.geographic_concentration.value,
    label: data.risk_metrics.geographic_concentration.label,
  },
  ewsAlerts: data.risk_metrics.ews_alerts,
  thirtyDayDeterioration: data.risk_metrics.thirty_day_deterioration,
  watchList: data.risk_metrics.watch_list,
};

/**
 * EXPORT 2: CITI_CONCENTRATION
 * Industry and geographic concentration limits and current values
 */
export const CITI_CONCENTRATION = {
  industry: {
    limit: data.concentration.industry.limit,
    values: data.concentration.industry.values.map((item) => ({
      name: item.name,
      percent: item.percent,
      exposure: item.exposure,
      status: (item.status === 'safe' ? 'safe' : item.status) as 'safe' | 'warning' | 'breach',
    })),
  },
  geography: {
    limit: data.concentration.geography.limit,
    values: data.concentration.geography.values.map((item) => ({
      name: item.name,
      percent: item.percent,
      exposure: item.exposure,
      status: (item.status === 'safe' ? 'safe' : item.status === 'warning' ? 'warning' : 'breach') as
        | 'safe'
        | 'warning'
        | 'breach',
    })),
  },
};

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
 * EXPORT 3: CITI_EWS_CLUSTERS
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

export const CITI_EWS_CLUSTERS: EWSCluster[] = data.ews_clusters.map((cluster) => ({
  id: cluster.id,
  type: cluster.type,
  severity: mapSeverity(cluster.severity),
  title: cluster.title,
  businessCount: cluster.business_count,
  exposure: cluster.exposure,
  heaviestSegments: cluster.heaviest_segments.map((item) => ({
    segment: item.segment,
    count: item.count,
  })),
  actions: cluster.actions,
}));

/**
 * EXPORT 4: CITI_COMPLIANCE
 * Compliance and fair lending metrics for Citi portfolio
 */
export const CITI_COMPLIANCE = {
  approvalVariance: data.compliance.approval_variance.map((item) => ({
    segment: item.segment,
    applications: item.applications,
    approved: item.approved,
    rate: item.rate,
    variance: item.variance,
    status: (item.status === 'ok' ? 'ok' : item.status === 'review' ? 'review' : 'flag') as
      | 'ok'
      | 'review'
      | 'flag',
  })),
  portfolioApprovalRate: data.compliance.portfolio_approval_rate,
  adverseActionsSent: data.compliance.adverse_actions_sent,
  fairLendingStatus: data.compliance.fair_lending_status,
};
