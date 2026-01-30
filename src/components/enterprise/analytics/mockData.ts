// Enterprise Analytics Mock Data - Bank-grade portfolio intelligence

import type {
  PortfolioKPI,
  ScoreBucket,
  ScoreMigrationMatrix,
  RiskTierMovement,
  RiskDriver,
  ProductPenetration,
  CrossSellFunnelStage,
  ApplicationFunnelMetrics,
  ApprovalRateBySegment,
  FeatureImportance,
  SignalDrift,
} from './types';

export const mockPortfolioKPIs: PortfolioKPI[] = [
  {
    id: 'avg-score',
    label: 'Avg LumiqAI Score',
    value: 72.4,
    format: 'score',
    trend: 3.2,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Exposure-weighted average score across portfolio',
    dataSource: 'LumiqAI Score Engine',
    lastUpdated: '2 mins ago',
  },
  {
    id: 'score-momentum',
    label: 'Score Momentum (90d)',
    value: 2.8,
    format: 'percent',
    trend: 0.5,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average score change over last 90 days',
    dataSource: 'LumiqAI Score Engine',
    lastUpdated: '2 mins ago',
  },
  {
    id: 'improving-clients',
    label: '% Improving Clients',
    value: 38.2,
    format: 'percent',
    trend: 4.1,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Clients with score improvement ≥5 pts in 90d',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '5 mins ago',
  },
  {
    id: 'deteriorating-clients',
    label: '% Deteriorating Clients',
    value: 12.5,
    format: 'percent',
    trend: -1.8,
    trendDirection: 'down',
    isPositiveTrend: true,
    tooltip: 'Clients with score decline ≥5 pts in 90d',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '5 mins ago',
  },
  {
    id: 'volatility-index',
    label: 'Portfolio Volatility',
    value: 8.3,
    format: 'number',
    trend: -0.4,
    trendDirection: 'down',
    isPositiveTrend: true,
    tooltip: 'Standard deviation of score changes',
    dataSource: 'Risk Analytics',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'risk-index',
    label: 'Exp-Weighted Risk Index',
    value: 24.7,
    format: 'score',
    trend: -2.1,
    trendDirection: 'down',
    isPositiveTrend: true,
    tooltip: 'Exposure-weighted aggregate risk metric',
    dataSource: 'Risk Engine',
    lastUpdated: '15 mins ago',
  },
];

export const mockScoreDistribution: ScoreBucket[] = [
  { range: '0–50', min: 0, max: 50, count: 1250, percent: 5.0, exposure: 45000000 },
  { range: '51–65', min: 51, max: 65, count: 3750, percent: 15.0, exposure: 187500000 },
  { range: '66–75', min: 66, max: 75, count: 7500, percent: 30.0, exposure: 562500000 },
  { range: '76–85', min: 76, max: 85, count: 8750, percent: 35.0, exposure: 787500000 },
  { range: '86–100', min: 86, max: 100, count: 3750, percent: 15.0, exposure: 412500000 },
];

export const mockScoreMigration: ScoreMigrationMatrix = {
  period: '90 days',
  bands: ['0–50', '51–65', '66–75', '76–85', '86–100'],
  cells: [
    { fromBand: '0–50', toBand: '0–50', count: 875, percent: 70, direction: 'stable' },
    { fromBand: '0–50', toBand: '51–65', count: 312, percent: 25, direction: 'upgrade' },
    { fromBand: '0–50', toBand: '66–75', count: 63, percent: 5, direction: 'upgrade' },
    { fromBand: '51–65', toBand: '0–50', count: 188, percent: 5, direction: 'downgrade' },
    { fromBand: '51–65', toBand: '51–65', count: 2625, percent: 70, direction: 'stable' },
    { fromBand: '51–65', toBand: '66–75', count: 750, percent: 20, direction: 'upgrade' },
    { fromBand: '51–65', toBand: '76–85', count: 187, percent: 5, direction: 'upgrade' },
    { fromBand: '66–75', toBand: '51–65', count: 375, percent: 5, direction: 'downgrade' },
    { fromBand: '66–75', toBand: '66–75', count: 5250, percent: 70, direction: 'stable' },
    { fromBand: '66–75', toBand: '76–85', count: 1500, percent: 20, direction: 'upgrade' },
    { fromBand: '66–75', toBand: '86–100', count: 375, percent: 5, direction: 'upgrade' },
    { fromBand: '76–85', toBand: '66–75', count: 437, percent: 5, direction: 'downgrade' },
    { fromBand: '76–85', toBand: '76–85', count: 6125, percent: 70, direction: 'stable' },
    { fromBand: '76–85', toBand: '86–100', count: 2188, percent: 25, direction: 'upgrade' },
    { fromBand: '86–100', toBand: '76–85', count: 375, percent: 10, direction: 'downgrade' },
    { fromBand: '86–100', toBand: '86–100', count: 3375, percent: 90, direction: 'stable' },
  ],
  summary: {
    upgradedPercent: 18.2,
    downgradedPercent: 6.1,
    stablePercent: 75.7,
  },
};

export const mockRiskTierMovements: RiskTierMovement[] = [
  { tier: 'low', previousCount: 15000, currentCount: 15750, netChange: 750, percentChange: 5.0 },
  { tier: 'medium', previousCount: 7500, currentCount: 7125, netChange: -375, percentChange: -5.0 },
  { tier: 'high', previousCount: 2500, currentCount: 2125, netChange: -375, percentChange: -15.0 },
];

export const mockRiskDrivers: RiskDriver[] = [
  {
    id: 'rd-1',
    name: 'Cash Flow Volatility',
    impact: 28,
    trend: 'decreasing',
    affectedClients: 4250,
    severity: 'high',
    description: 'Increased month-over-month variance in operating cash flows',
  },
  {
    id: 'rd-2',
    name: 'Bureau Score Changes',
    impact: 22,
    trend: 'stable',
    affectedClients: 3100,
    severity: 'medium',
    description: 'Commercial bureau score movements from D&B, Experian, Equifax',
  },
  {
    id: 'rd-3',
    name: 'Utilization Spikes',
    impact: 18,
    trend: 'increasing',
    affectedClients: 2850,
    severity: 'high',
    description: 'Credit line utilization exceeding 80% threshold',
  },
  {
    id: 'rd-4',
    name: 'Revenue Contraction',
    impact: 16,
    trend: 'stable',
    affectedClients: 2200,
    severity: 'medium',
    description: 'YoY revenue decline exceeding 15%',
  },
  {
    id: 'rd-5',
    name: 'Payment Delays',
    impact: 12,
    trend: 'decreasing',
    affectedClients: 1650,
    severity: 'medium',
    description: 'Days payable outstanding increasing beyond industry norms',
  },
];

export const mockProductPenetration: ProductPenetration[] = [
  { product: 'Line of Credit', held: 28, eligible: 42, opportunity: 14, conversionRate: 33.3 },
  { product: 'Business Cards', held: 61, eligible: 75, opportunity: 14, conversionRate: 18.7 },
  { product: 'SBA Loans', held: 8, eligible: 18, opportunity: 10, conversionRate: 55.6 },
  { product: 'Commercial RE', held: 3, eligible: 7, opportunity: 4, conversionRate: 57.1 },
  { product: 'Equipment Finance', held: 12, eligible: 22, opportunity: 10, conversionRate: 45.5 },
  { product: 'Merchant Services', held: 45, eligible: 68, opportunity: 23, conversionRate: 33.8 },
];

export const mockCrossSellFunnel: CrossSellFunnelStage[] = [
  { stage: 'Eligible', count: 8500, conversionFromPrevious: 100, avgTimeInStage: 0 },
  { stage: 'Contacted', count: 5100, conversionFromPrevious: 60, avgTimeInStage: 3 },
  { stage: 'Pre-qualified', count: 3570, conversionFromPrevious: 70, avgTimeInStage: 5 },
  { stage: 'Applied', count: 2142, conversionFromPrevious: 60, avgTimeInStage: 7 },
  { stage: 'Approved', count: 1607, conversionFromPrevious: 75, avgTimeInStage: 2 },
];

export const mockApplicationFunnel: ApplicationFunnelMetrics[] = [
  {
    product: 'Line of Credit',
    preQualified: 4200,
    applied: 2520,
    approved: 2016,
    funded: 1814,
    preQualToApplyRate: 60,
    applyToApproveRate: 80,
    avgTimeToDecision: 2.3,
  },
  {
    product: 'Business Cards',
    preQualified: 6800,
    applied: 5440,
    approved: 4896,
    funded: 4651,
    preQualToApplyRate: 80,
    applyToApproveRate: 90,
    avgTimeToDecision: 0.5,
  },
  {
    product: 'SBA Loans',
    preQualified: 1200,
    applied: 600,
    approved: 420,
    funded: 357,
    preQualToApplyRate: 50,
    applyToApproveRate: 70,
    avgTimeToDecision: 14.2,
  },
];

export const mockApprovalBySegment: ApprovalRateBySegment[] = [
  { segment: 'Micro (<$1M)', approvalRate: 68.5, volume: 8500, avgLimitApproved: 45000 },
  { segment: 'Small ($1M–$10M)', approvalRate: 75.2, volume: 12000, avgLimitApproved: 175000 },
  { segment: 'Mid-Market ($10M–$100M)', approvalRate: 82.1, volume: 4500, avgLimitApproved: 850000 },
];

export const mockFeatureImportance: FeatureImportance[] = [
  { feature: 'Cash Flow Stability', importance: 24, category: 'Financial Health', trend: 'stable' },
  { feature: 'Payment Behavior', importance: 19, category: 'Credit Behavior', trend: 'stable' },
  { feature: 'Bureau Score Changes', importance: 16, category: 'External Data', trend: 'increasing' },
  { feature: 'Revenue Growth', importance: 14, category: 'Financial Health', trend: 'stable' },
  { feature: 'Credit Utilization', importance: 12, category: 'Credit Behavior', trend: 'decreasing' },
  { feature: 'Industry Risk', importance: 8, category: 'Market Factors', trend: 'stable' },
  { feature: 'Time in Business', importance: 4, category: 'Business Profile', trend: 'stable' },
  { feature: 'Geographic Risk', importance: 3, category: 'Market Factors', trend: 'stable' },
];

export const mockSignalDrift: SignalDrift[] = [
  { signal: 'Cash Flow Ratio', meanShift: 0.02, varianceShift: 0.05, dataFreshness: '2 hours', missingnessRate: 0.3, status: 'healthy' },
  { signal: 'Payment Score', meanShift: 0.01, varianceShift: 0.02, dataFreshness: '1 hour', missingnessRate: 0.1, status: 'healthy' },
  { signal: 'Bureau Delta', meanShift: 0.08, varianceShift: 0.12, dataFreshness: '4 hours', missingnessRate: 1.2, status: 'warning' },
  { signal: 'Revenue Trend', meanShift: 0.03, varianceShift: 0.04, dataFreshness: '6 hours', missingnessRate: 0.5, status: 'healthy' },
  { signal: 'Utilization Rate', meanShift: 0.04, varianceShift: 0.06, dataFreshness: '1 hour', missingnessRate: 0.2, status: 'healthy' },
  { signal: 'Industry Index', meanShift: 0.15, varianceShift: 0.18, dataFreshness: '24 hours', missingnessRate: 2.5, status: 'critical' },
];

// Trend data for charts
export const mockScoreTrendData = [
  { month: 'Jul', avgScore: 69.2, improving: 32, deteriorating: 15 },
  { month: 'Aug', avgScore: 70.1, improving: 34, deteriorating: 14 },
  { month: 'Sep', avgScore: 70.8, improving: 35, deteriorating: 13 },
  { month: 'Oct', avgScore: 71.2, improving: 36, deteriorating: 13 },
  { month: 'Nov', avgScore: 71.8, improving: 37, deteriorating: 12 },
  { month: 'Dec', avgScore: 72.4, improving: 38, deteriorating: 12 },
];

export const mockRiskTrendData = [
  { month: 'Jul', low: 58, medium: 32, high: 10 },
  { month: 'Aug', low: 59, medium: 31, high: 10 },
  { month: 'Sep', low: 60, medium: 30, high: 10 },
  { month: 'Oct', low: 61, medium: 30, high: 9 },
  { month: 'Nov', low: 62, medium: 29, high: 9 },
  { month: 'Dec', low: 63, medium: 28, high: 9 },
];
