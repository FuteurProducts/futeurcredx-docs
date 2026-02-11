/**
 * Wells Fargo Risk Data Loader
 * Maps WF JSON risk metrics to shapes used by wellsfargoDemoData.ts
 */

import wfData from './wellsfargo.json';

// Type assertion for JSON import
interface WFAlert {
  type: string;
  severity: string;
  message: string;
  affected_count: number;
  exposure: number;
}

interface WFCreditQualityBand {
  count: number;
  percentage: number;
  avg_score: number;
  avg_exposure: number;
  total_exposure_billions: number;
}

const data = wfData as unknown as {
  portfolio_summary: {
    totalCustomers: number;
    totalExposure: number;
    keyMetrics: {
      at_risk_rate: number;
    };
  };
  segments: Array<{
    id: string;
    name: string;
    customerCount: number;
    totalExposure: number;
    percentage: number;
  }>;
  risk_metrics: {
    credit_quality: {
      excellent_750_plus: WFCreditQualityBand;
      good_700_749: WFCreditQualityBand;
      fair_650_699: WFCreditQualityBand;
      poor_600_649: WFCreditQualityBand;
      very_poor_below_600: WFCreditQualityBand;
      at_risk_count: number;
      at_risk_exposure_billions: number;
    };
    delinquency: {
      current: number;
      days_30_60: number;
      days_60_90: number;
      days_90_plus: number;
      total_30_plus: number;
    };
    charge_offs: {
      full_year_average: number;
      trend: string;
    };
    alerts: WFAlert[];
  };
};

/**
 * EXPORT 1: WF_RISK_KPIS
 * Risk KPI metrics for Wells Fargo portfolio
 */
const atRiskExposure = data.risk_metrics.credit_quality.at_risk_exposure_billions * 1_000_000_000;
const atRiskCount = data.risk_metrics.credit_quality.at_risk_count;

export const WF_RISK_KPIS = {
  portfolioAtRisk: {
    value: atRiskExposure, // $40.3B
    percent: data.portfolio_summary.keyMetrics.at_risk_rate / 100, // 0.13
  },
  industryConcentration: {
    value: data.segments[5].percentage / 100, // Construction at 15.5%
    label: data.segments[5].name, // "Construction"
  },
  geographicConcentration: {
    value: 0.246, // California at 24.6% (from alerts)
    label: 'California',
  },
  ewsAlerts: data.risk_metrics.alerts.reduce(
    (sum, alert) => sum + alert.affected_count,
    0
  ), // 511500 + 811800 + 8500 = 1,331,800
  thirtyDayDeterioration: Math.round(atRiskCount * 0.02), // ~8580 (2% of 429000)
  watchList: Math.round(atRiskCount * 0.05), // ~21450 (5% of 429000)
};

/**
 * EXPORT 2: WF_CONCENTRATION
 * Industry and geographic concentration limits and current values
 */
export const WF_CONCENTRATION = {
  industry: {
    limit: 0.20,
    values: [
      {
        name: 'Construction',
        percent: 0.155,
        exposure: data.segments[5].totalExposure,
        status: 'warning' as const,
      },
      {
        name: 'Transportation & Logistics',
        percent: 0.145,
        exposure: data.segments[7].totalExposure,
        status: 'safe' as const,
      },
      {
        name: 'Manufacturing',
        percent: 0.142,
        exposure: data.segments[2].totalExposure,
        status: 'safe' as const,
      },
      {
        name: 'Retail Trade',
        percent: 0.123,
        exposure: data.segments[3].totalExposure,
        status: 'safe' as const,
      },
      {
        name: 'Professional Services',
        percent: 0.118,
        exposure: data.segments[1].totalExposure,
        status: 'safe' as const,
      },
    ],
  },
  geography: {
    limit: 0.30,
    values: [
      {
        name: 'California',
        percent: 0.246,
        exposure: 164_857_400_000,
        status: 'safe' as const,
      },
      {
        name: 'Texas',
        percent: 0.18,
        exposure: 120_600_000_000,
        status: 'safe' as const,
      },
      {
        name: 'Florida',
        percent: 0.14,
        exposure: 93_800_000_000,
        status: 'safe' as const,
      },
      {
        name: 'Midwest',
        percent: 0.16,
        exposure: 107_200_000_000,
        status: 'safe' as const,
      },
      {
        name: 'Southeast',
        percent: 0.12,
        exposure: 80_400_000_000,
        status: 'safe' as const,
      },
    ],
  },
};

/**
 * Helper function to derive EWS type code from alert type
 */
function deriveTypeCode(alertType: string): string {
  const typeMap: Record<string, string> = {
    concentration: 'CONCENTRATION_RISK',
    geographic: 'GEOGRAPHIC_RISK',
    credit_quality: 'CREDIT_QUALITY',
  };
  return typeMap[alertType] || 'UNKNOWN';
}

/**
 * Helper function to map severity
 */
function mapSeverity(severity: string): 'critical' | 'high' | 'medium' | 'low' {
  if (severity === 'critical') return 'critical';
  if (severity === 'high') return 'high';
  if (severity === 'medium') return 'medium';
  return 'low';
}

/**
 * EXPORT 3: WF_EWS_CLUSTERS
 * Early Warning System cluster alerts derived from WF risk alerts
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

export const WF_EWS_CLUSTERS: EWSCluster[] = data.risk_metrics.alerts.map((alert, index) => ({
  id: `ews_wf_${alert.type}_${index}`,
  type: deriveTypeCode(alert.type),
  severity: mapSeverity(alert.severity),
  title: alert.message.split(' - ')[0],
  businessCount: alert.affected_count,
  exposure: alert.exposure,
  heaviestSegments: [
    { segment: alert.type === 'concentration' ? 'Construction' : alert.type === 'geographic' ? 'California' : 'Office CRE', count: Math.round(alert.affected_count * 0.4) },
    { segment: alert.type === 'concentration' ? 'Texas' : alert.type === 'geographic' ? 'Texas' : 'Healthcare', count: Math.round(alert.affected_count * 0.25) },
  ],
  actions: ['View Segment', 'Add All to Watch List', 'Assign to Team'],
}));

/**
 * EXPORT 4: WF_COMPLIANCE
 * Compliance and fair lending metrics scaled to WF portfolio
 */
export const WF_COMPLIANCE = {
  approvalVariance: [
    {
      segment: 'Technology',
      applications: 118000,
      approved: 96760,
      rate: 0.82,
      variance: 0.10,
      status: 'ok' as const,
    },
    {
      segment: 'Professional Services',
      applications: 132000,
      approved: 105600,
      rate: 0.80,
      variance: 0.08,
      status: 'ok' as const,
    },
    {
      segment: 'Healthcare',
      applications: 123000,
      approved: 92250,
      rate: 0.75,
      variance: 0.03,
      status: 'ok' as const,
    },
    {
      segment: 'Manufacturing',
      applications: 159000,
      approved: 116070,
      rate: 0.73,
      variance: 0.01,
      status: 'ok' as const,
    },
    {
      segment: 'Retail Trade',
      applications: 138000,
      approved: 94530,
      rate: 0.685,
      variance: -0.035,
      status: 'review' as const,
    },
    {
      segment: 'Construction',
      applications: 174000,
      approved: 113100,
      rate: 0.65,
      variance: -0.07,
      status: 'flag' as const,
    },
  ],
  portfolioApprovalRate: 0.72,
  adverseActionsSent: 528000, // 3.3M customers * 0.16 application rate
  fairLendingStatus: 'pass',
};
