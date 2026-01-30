// Enterprise Analytics Types - Bank-grade portfolio intelligence

export type AnalysisMode = 'performance' | 'risk' | 'growth' | 'conversion' | 'signals';

export type TimeWindow = '7d' | '30d' | '90d' | '12m' | 'custom';

export type ProductType = 'LOC' | 'Cards' | 'SBA' | 'CRE' | 'Equipment' | 'Auto' | 'Merchant' | 'Deposits' | 'All';

export type SegmentType = 'micro' | 'small' | 'midmarket' | 'all';

export type RelationshipStage = 'prospect' | 'new' | 'growing' | 'mature' | 'at-risk' | 'all';

export interface AnalyticsFilters {
  product: ProductType;
  segment: SegmentType;
  geography: string;
  relationshipStage: RelationshipStage;
  timeWindow: TimeWindow;
  analysisMode: AnalysisMode;
}

// Portfolio Performance
export interface PortfolioKPI {
  id: string;
  label: string;
  value: number;
  format: 'number' | 'percent' | 'currency' | 'score';
  trend: number; // +/- percentage
  trendDirection: 'up' | 'down' | 'stable';
  isPositiveTrend: boolean;
  tooltip: string;
  dataSource: string;
  lastUpdated: string;
}

export interface ScoreBucket {
  range: string;
  min: number;
  max: number;
  count: number;
  percent: number;
  exposure: number;
}

export interface MigrationCell {
  fromBand: string;
  toBand: string;
  count: number;
  percent: number;
  direction: 'upgrade' | 'downgrade' | 'stable';
}

export interface ScoreMigrationMatrix {
  period: string;
  bands: string[];
  cells: MigrationCell[];
  summary: {
    upgradedPercent: number;
    downgradedPercent: number;
    stablePercent: number;
  };
}

// Risk Analytics
export interface RiskTierMovement {
  tier: 'low' | 'medium' | 'high';
  previousCount: number;
  currentCount: number;
  netChange: number;
  percentChange: number;
}

export interface RiskDriver {
  id: string;
  name: string;
  impact: number; // 0-100
  trend: 'increasing' | 'decreasing' | 'stable';
  affectedClients: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

// Growth & Wallet Share
export interface ProductPenetration {
  product: string;
  held: number;
  eligible: number;
  opportunity: number;
  conversionRate: number;
}

export interface CrossSellFunnelStage {
  stage: string;
  count: number;
  conversionFromPrevious: number;
  avgTimeInStage: number;
}

// Conversion & Underwriting
export interface ApplicationFunnelMetrics {
  product: string;
  preQualified: number;
  applied: number;
  approved: number;
  funded: number;
  preQualToApplyRate: number;
  applyToApproveRate: number;
  avgTimeToDecision: number;
}

export interface ApprovalRateBySegment {
  segment: string;
  approvalRate: number;
  volume: number;
  avgLimitApproved: number;
}

// Signal Effectiveness (Model Governance)
export interface FeatureImportance {
  feature: string;
  importance: number; // 0-100
  category: string;
  trend: 'stable' | 'increasing' | 'decreasing';
}

export interface SignalDrift {
  signal: string;
  meanShift: number;
  varianceShift: number;
  dataFreshness: string;
  missingnessRate: number;
  status: 'healthy' | 'warning' | 'critical';
}

// Data Lineage
export interface DataLineageInfo {
  chartId: string;
  source: string;
  freshness: string;
  transformations: string[];
  aggregationRules: string;
}
