export interface TrendData {
  date?: string;
  month?: string;
  value?: number;
  label?: string;
  applications?: number;
  approved?: number;
  conversionRate?: number;
  approvalRate?: number;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number | boolean | undefined;
}

export interface MetricData {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
  icon?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  conversionRate: number;
  apiCalls: number;
  errorRate: number;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  category?: string;
}

export interface ConversionData extends TrendData {
  conversions?: number;
  visitors?: number;
}

export interface DashboardCounts {
  totalApiCalls?: number;
  activeKeys?: number;
  successRate?: number;
  avgResponseTime?: number;
  totalBusinesses?: number;
  businessesWithCredit?: number;
  applicationsStarted?: number;
  approved?: number;
  ineligible?: number;
}

export interface FunnelMetrics {
  stage?: string;
  count?: number;
  conversionRate?: number;
  dropOffRate?: number;
  applicationConversionRate?: number;
  approvalRate?: number;
  ineligibleRatio?: number;
  creditActivationRate?: number;
}

export interface ProductMetrics {
  productName?: string;
  usage?: number;
  revenue?: number;
  growth?: number;
  avgTimeToApproval?: number;
  avgCreditLimit?: number;
  applicationDropoffRate?: number;
  reApplicationRate?: number;
}

export interface RiskMetrics {
  category?: string;
  score?: number;
  trend?: 'up' | 'down' | 'stable';
  severity?: 'low' | 'medium' | 'high';
  delinquencyRate?: number;
  defaultRate?: number;
  portfolioUtilizationRate?: number;
}

export interface RevenueMetrics {
  period?: string;
  amount?: number;
  growth?: number;
  forecast?: number;
  arpb?: number;
  revenuePerApprovedAccount?: number;
  momGrowthRate?: number;
  qoqGrowthRate?: number;
}

export interface PredictiveMetrics {
  metric?: string;
  current?: number;
  predicted?: number;
  confidence?: number;
  trend?: TrendData[];
  projectedApprovalVolume6m?: number;
  projectedConversionLift?: number;
  marketingQualifiedOpportunities?: number;
}

