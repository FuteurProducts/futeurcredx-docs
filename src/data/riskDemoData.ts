/**
 * riskDemoData.ts
 *
 * Demo/mock data for the Risk Intelligence tab.
 * Extracted from the Risk page component to keep the orchestrator lean.
 * All data models a realistic bank risk monitoring scenario.
 */

import type {
  PortfolioFilter,
  RiskLens,
  RiskKPI,
  DeteriorationDriver,
  HeatmapConfig,
  ConcentrationCategory,
  EWSIndicator,
  EWSQueueItem,
  ModelInfo,
  FeatureDrift,
  OutcomeMonitoring,
  DataSource,
  MissingField,
  AccessEvent,
  PermissionChange,
  StressScenario,
  MigrationMatrix,
  StressImpact,
} from '@/components/enterprise/risk';

// ============================================
// INITIAL STATE
// ============================================

export const INITIAL_PORTFOLIO_FILTER: PortfolioFilter = {
  product: [],
  segment: [],
  region: [],
  relationshipStage: [],
  riskTier: [],
};

export const INITIAL_RISK_LENSES: RiskLens[] = [
  { id: 'credit', label: 'Credit Risk', active: true },
  { id: 'cashflow', label: 'Cash Flow', active: true },
  { id: 'bureau', label: 'Bureau Signals', active: false },
  { id: 'fraud', label: 'Fraud', active: false },
  { id: 'model_drift', label: 'Model Drift', active: false },
];

// ============================================
// EXECUTIVE SUMMARY
// ============================================

export const RISK_KPIS: RiskKPI[] = [
  {
    id: 'portfolio_risk_score',
    label: 'Portfolio Risk Indicator',
    value: 724,
    change: -12,
    changeLabel: 'from 736 last month',
    trend: 'down',
    trendIsGood: false,
    sparklineData: [{ value: 752 }, { value: 748 }, { value: 742 }, { value: 738 }, { value: 736 }, { value: 724 }],
  },
  {
    id: 'expected_loss',
    label: 'Expected Loss',
    value: '1.2%',
    change: 0.1,
    changeLabel: '+10 bps',
    trend: 'up',
    trendIsGood: false,
    sparklineData: [{ value: 1.0 }, { value: 1.0 }, { value: 1.1 }, { value: 1.1 }, { value: 1.1 }, { value: 1.2 }],
  },
  {
    id: 'unexpected_loss',
    label: 'Unexpected Loss',
    value: '0.8%',
    change: 0,
    changeLabel: 'No change',
    trend: 'stable',
    trendIsGood: true,
  },
  {
    id: 'var_confidence',
    label: 'VaR Confidence',
    value: '99%',
    change: 0,
    changeLabel: 'Meets target',
    trend: 'stable',
    trendIsGood: true,
  },
  {
    id: 'concentration_risk',
    label: 'Concentration Risk',
    value: 'Low',
    change: 0,
    changeLabel: 'Within limits',
    trend: 'stable',
    trendIsGood: true,
  },
  {
    id: 'stress_test',
    label: 'Stress Test',
    value: 'Pass',
    change: 0,
    changeLabel: 'All scenarios',
    trend: 'stable',
    trendIsGood: true,
  },
];

export const DETERIORATION_DRIVERS: DeteriorationDriver[] = [
  { driver: 'Payment Behavior', impact: 34, affectedAccounts: 847, trend: 'up' },
  { driver: 'Credit Utilization', impact: 28, affectedAccounts: 1234, trend: 'up' },
  { driver: 'Bureau Risk Indicator Drops', impact: 22, affectedAccounts: 567, trend: 'stable' },
  { driver: 'Cash Flow Stress', impact: 16, affectedAccounts: 423, trend: 'down' },
];

export const RISK_TREND_DATA = {
  deteriorations: [{ date: 'W1', value: 45 }, { date: 'W2', value: 52 }, { date: 'W3', value: 48 }, { date: 'W4', value: 61 }],
  delinquencies: [{ date: 'W1', value: 2.1 }, { date: 'W2', value: 2.3 }, { date: 'W3', value: 2.2 }, { date: 'W4', value: 2.4 }],
  cashflowStress: [{ date: 'W1', value: 8 }, { date: 'W2', value: 9 }, { date: 'W3', value: 8 }, { date: 'W4', value: 7 }],
  bureauDrops: [{ date: 'W1', value: 156 }, { date: 'W2', value: 178 }, { date: 'W3', value: 142 }, { date: 'W4', value: 189 }],
};

// ============================================
// HEATMAP
// ============================================

export const RISK_HEATMAPS: HeatmapConfig[] = [
  {
    id: 'segment_product',
    title: 'Risk by Segment × Product',
    description: 'Exposure and delinquency rates',
    rows: ['Micro', 'Small', 'Mid-Market'],
    columns: ['LOC', 'Working Capital', 'Credit Card', 'SBA'],
    data: [
      { row: 'Micro', column: 'LOC', value: 4.2, count: 1247, exposure: 12400000, change: 0.3 },
      { row: 'Micro', column: 'Working Capital', value: 3.8, count: 892, exposure: 8900000, change: -0.2 },
      { row: 'Micro', column: 'Credit Card', value: 5.1, count: 2341, exposure: 4500000, change: 0.8 },
      { row: 'Micro', column: 'SBA', value: 2.1, count: 456, exposure: 15600000, change: 0.1 },
      { row: 'Small', column: 'LOC', value: 2.8, count: 1876, exposure: 34500000, change: -0.1 },
      { row: 'Small', column: 'Working Capital', value: 2.4, count: 1234, exposure: 28900000, change: 0.2 },
      { row: 'Small', column: 'Credit Card', value: 3.2, count: 3421, exposure: 8700000, change: 0.4 },
      { row: 'Small', column: 'SBA', value: 1.6, count: 789, exposure: 42300000, change: -0.3 },
      { row: 'Mid-Market', column: 'LOC', value: 1.2, count: 432, exposure: 67800000, change: 0 },
      { row: 'Mid-Market', column: 'Working Capital', value: 0.9, count: 287, exposure: 54200000, change: -0.1 },
      { row: 'Mid-Market', column: 'Credit Card', value: 1.8, count: 567, exposure: 12300000, change: 0.2 },
      { row: 'Mid-Market', column: 'SBA', value: 0.7, count: 198, exposure: 89400000, change: 0 },
    ],
  },
];

// ============================================
// CONCENTRATION
// ============================================

export const CONCENTRATION_CATEGORIES: ConcentrationCategory[] = [
  {
    id: 'industry',
    title: 'Industry Concentration',
    icon: 'industry',
    totalExposure: 147200000,
    totalLimit: 200000000,
    items: [
      { id: '1', name: 'Retail Trade', exposure: 45600000, exposureLimit: 50000000, utilizationPct: 91.2, accountCount: 1234, riskScore: 72, trend: 2.3, breachStatus: 'warning', trendToBreachDays: 45 },
      { id: '2', name: 'Construction', exposure: 38900000, exposureLimit: 45000000, utilizationPct: 86.4, accountCount: 876, riskScore: 68, trend: 1.8, breachStatus: 'ok' },
      { id: '3', name: 'Healthcare', exposure: 32400000, exposureLimit: 55000000, utilizationPct: 58.9, accountCount: 654, riskScore: 82, trend: -0.5, breachStatus: 'ok' },
    ],
  },
  {
    id: 'geography',
    title: 'Geographic Concentration',
    icon: 'geography',
    totalExposure: 147200000,
    totalLimit: 180000000,
    items: [
      { id: '1', name: 'California', exposure: 52300000, exposureLimit: 60000000, utilizationPct: 87.2, accountCount: 2341, riskScore: 74, trend: 1.2, breachStatus: 'warning' },
      { id: '2', name: 'Texas', exposure: 41200000, exposureLimit: 50000000, utilizationPct: 82.4, accountCount: 1876, riskScore: 71, trend: 0.8, breachStatus: 'ok' },
    ],
  },
];

// ============================================
// EWS (Early Warning System)
// ============================================

export const EWS_INDICATORS: EWSIndicator[] = [
  { id: '1', name: 'Cash Flow Deterioration', description: '3 months declining operating cash', threshold: '15% decline', enabled: true, precision: 0.82, recall: 0.76 },
  { id: '2', name: 'Payment Pattern Change', description: 'Late payments after on-time history', threshold: '2+ consecutive', enabled: true, precision: 0.89, recall: 0.71 },
  { id: '3', name: 'Utilization Spike', description: 'Rapid increase in credit usage', threshold: '30% increase / 30 days', enabled: true, precision: 0.78, recall: 0.84 },
  { id: '4', name: 'Bureau Risk Indicator Drop', description: 'Significant credit risk indicator decline', threshold: '25+ points', enabled: true, precision: 0.91, recall: 0.68 },
];

export const EWS_QUEUE_ITEMS: EWSQueueItem[] = [
  {
    id: '1',
    severity: 'critical',
    status: 'new',
    businessId: 'BIZ-2847',
    businessName: 'TechFlow Solutions',
    primaryDriver: 'Payment Pattern Change',
    driverType: 'payment',
    signals: ['3 late payments', 'Utilization 78%', 'Risk Indicator drop 32pts'],
    recommendedAction: 'Contact immediately, review credit line',
    exposure: 125000,
    riskScore: 42,
    riskChange: -28,
    slaTimer: '2h remaining',
    slaDue: new Date(Date.now() + 2 * 60 * 60 * 1000),
    slaBreached: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
    notes: [],
  },
  {
    id: '2',
    severity: 'high',
    status: 'assigned',
    businessId: 'BIZ-1923',
    businessName: 'Metro Logistics Corp',
    primaryDriver: 'Utilization Spike',
    driverType: 'utilization',
    signals: ['Utilization 78%', 'Revenue decline 12%'],
    recommendedAction: 'Schedule account review',
    exposure: 340000,
    riskScore: 56,
    riskChange: -18,
    slaTimer: '6h remaining',
    slaDue: new Date(Date.now() + 6 * 60 * 60 * 1000),
    slaBreached: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    notes: [],
  },
];

// ============================================
// MODEL GOVERNANCE
// ============================================

export const RISK_MODELS: ModelInfo[] = [
  { id: '1', name: 'SMB Risk Indicator v3.2', version: '3.2.1', deployedDate: '2025-09-15', lastValidationDate: '2025-12-01', nextValidationDue: '2026-03-01', status: 'ok', type: 'credit_score' },
  { id: '2', name: 'PD Model - Working Capital', version: '2.1.0', deployedDate: '2025-06-01', lastValidationDate: '2025-11-15', nextValidationDue: '2026-02-15', status: 'warning', type: 'pd' },
  { id: '3', name: 'EWS Detector v1.5', version: '1.5.3', deployedDate: '2025-10-01', lastValidationDate: '2025-12-15', nextValidationDue: '2026-03-15', status: 'ok', type: 'ews' },
];

export const FEATURE_DRIFTS: FeatureDrift[] = [
  { feature: 'payment_history_ratio', driftScore: 0.12, threshold: 0.15, status: 'ok', trend: 'stable' },
  { feature: 'utilization_rate', driftScore: 0.18, threshold: 0.15, status: 'warning', trend: 'increasing' },
  { feature: 'cash_flow_volatility', driftScore: 0.08, threshold: 0.15, status: 'ok', trend: 'stable' },
];

export const OUTCOME_MONITORING: OutcomeMonitoring[] = [
  { metric: 'Gini Coefficient', expected: 0.72, actual: 0.69, variance: -0.03, status: 'warning' },
  { metric: 'KS Statistic', expected: 0.45, actual: 0.43, variance: -0.02, status: 'ok' },
  { metric: 'Accuracy', expected: 0.85, actual: 0.84, variance: -0.01, status: 'ok' },
];

// ============================================
// DATA LINEAGE
// ============================================

export const RISK_DATA_SOURCES: DataSource[] = [
  { id: '1', name: 'Experian Business', type: 'bureau', coverage: 94, freshness: '< 24h', medianAge: '18h', recordCount: 2547283, status: 'connected', lastSync: '2 hours ago', errorRate: 0.02 },
  { id: '2', name: 'D&B PAYDEX', type: 'bureau', coverage: 91, freshness: '< 48h', medianAge: '36h', recordCount: 2387453, status: 'connected', lastSync: '5 hours ago', errorRate: 0.01 },
  { id: '3', name: 'Plaid Banking', type: 'bank', coverage: 68, freshness: 'Real-time', medianAge: '< 1h', recordCount: 1847293, status: 'connected', lastSync: 'Real-time', errorRate: 0.03 },
  { id: '4', name: 'QuickBooks', type: 'accounting', coverage: 42, freshness: '< 24h', medianAge: '12h', recordCount: 1142387, status: 'degraded', lastSync: '18 hours ago', errorRate: 0.08 },
];

export const MISSING_FIELDS: MissingField[] = [
  { field: 'annual_revenue', missingPct: 12, impactLevel: 'high', affectedModels: ['Risk Indicator Model', 'PD Model'] },
  { field: 'years_in_business', missingPct: 8, impactLevel: 'medium', affectedModels: ['Risk Indicator Model'] },
  { field: 'owner_credit_score', missingPct: 23, impactLevel: 'high', affectedModels: ['Risk Indicator Model', 'EWS'] },
];

// ============================================
// AUDIT CONTROLS
// ============================================

export const ACCESS_EVENTS: AccessEvent[] = [
  { id: '1', userId: 'u1', userName: 'John Smith', action: 'view', resource: 'TechFlow Solutions', resourceType: 'entity', timestamp: new Date(Date.now() - 15 * 60 * 1000), ipAddress: '192.168.1.45', sensitivityLevel: 'high' },
  { id: '2', userId: 'u2', userName: 'Sarah Chen', action: 'export', resource: 'Q4 Risk Report', resourceType: 'report', timestamp: new Date(Date.now() - 45 * 60 * 1000), ipAddress: '192.168.1.78', sensitivityLevel: 'high' },
  { id: '3', userId: 'u1', userName: 'John Smith', action: 'modify', resource: 'Early Warning Signal Thresholds', resourceType: 'settings', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), ipAddress: '192.168.1.45', sensitivityLevel: 'medium' },
];

export const PERMISSION_CHANGES: PermissionChange[] = [
  { id: '1', userId: 'u3', userName: 'Mike Johnson', changedBy: 'Admin Team', changeType: 'grant', permission: 'Export Reports', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: '2', userId: 'u4', userName: 'Lisa Wang', changedBy: 'Admin Team', changeType: 'revoke', permission: 'Modify Settings', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000) },
];

// ============================================
// STRESS SCENARIOS
// ============================================

export const STRESS_SCENARIOS: StressScenario[] = [
  { id: 'mild_recession', name: 'Mild Recession', type: 'recession', severity: 'mild', assumptions: { rateChange: 1.0, revenueDecline: 10, unemploymentIncrease: 2 } },
  { id: 'moderate_recession', name: 'Moderate Recession', type: 'recession', severity: 'moderate', assumptions: { rateChange: 2.0, revenueDecline: 20, unemploymentIncrease: 4 } },
  { id: 'severe_recession', name: 'Severe Recession', type: 'recession', severity: 'severe', assumptions: { rateChange: 3.5, revenueDecline: 35, unemploymentIncrease: 8 } },
];

export const MIGRATION_MATRIX: MigrationMatrix[] = [
  { fromTier: 'Low', toTier: 'Low', currentPct: 92, stressedPct: 78, delta: -14 },
  { fromTier: 'Low', toTier: 'Medium', currentPct: 7, stressedPct: 18, delta: 11 },
  { fromTier: 'Low', toTier: 'High', currentPct: 1, stressedPct: 4, delta: 3 },
  { fromTier: 'Medium', toTier: 'Low', currentPct: 15, stressedPct: 8, delta: -7 },
  { fromTier: 'Medium', toTier: 'Medium', currentPct: 75, stressedPct: 62, delta: -13 },
  { fromTier: 'Medium', toTier: 'High', currentPct: 10, stressedPct: 30, delta: 20 },
];

export const STRESS_IMPACTS: StressImpact[] = [
  { metric: 'Expected Loss', baseline: 1.2, stressed: 3.8, change: 2.6, unit: '%' },
  { metric: 'Delinquency Rate', baseline: 2.4, stressed: 8.2, change: 5.8, unit: '%' },
  { metric: 'Average Risk Indicator', baseline: 724, stressed: 678, change: -46, unit: 'pts' },
];
