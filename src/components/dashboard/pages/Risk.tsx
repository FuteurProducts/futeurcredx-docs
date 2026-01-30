/**
 * Risk Page - Enterprise Components Wired
 * Bank-grade risk monitoring following SR 11-7 and FFIEC standards
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RiskGlobalControls,
  ExecutiveRiskSummary,
  RiskHeatmapMatrix,
  ConcentrationPanel,
  EWSWorkQueue,
  ModelGovernancePanel,
  DataLineagePanel,
  AuditControlsPanel,
  StressScenarioPanel,
  type PortfolioFilter,
  type RiskLens,
  type RiskKPI,
  type DeteriorationDriver,
  type HeatmapConfig,
  type ConcentrationCategory,
  type EWSIndicator,
  type EWSQueueItem,
  type ModelInfo,
  type FeatureDrift,
  type OutcomeMonitoring,
  type DataSource,
  type MissingField,
  type AccessEvent,
  type PermissionChange,
  type StressScenario,
  type MigrationMatrix,
  type StressImpact,
} from '@/components/enterprise/risk';

// ============================================
// MOCK DATA FOR ENTERPRISE RISK COMPONENTS
// ============================================

// Global Controls State
const initialPortfolioFilter: PortfolioFilter = {
  product: [],
  segment: [],
  region: [],
  relationshipStage: [],
  riskTier: [],
};

const initialRiskLenses: RiskLens[] = [
  { id: 'credit', label: 'Credit Risk', active: true },
  { id: 'cashflow', label: 'Cash Flow', active: true },
  { id: 'bureau', label: 'Bureau Signals', active: false },
  { id: 'fraud', label: 'Fraud', active: false },
  { id: 'model_drift', label: 'Model Drift', active: false },
];

// Executive Summary KPIs
const riskKPIs: RiskKPI[] = [
  {
    id: 'portfolio_risk_score',
    label: 'Portfolio Risk Score',
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

const deteriorationDrivers: DeteriorationDriver[] = [
  { driver: 'Payment Behavior', impact: 34, affectedAccounts: 847, trend: 'up' },
  { driver: 'Credit Utilization', impact: 28, affectedAccounts: 1234, trend: 'up' },
  { driver: 'Bureau Score Drops', impact: 22, affectedAccounts: 567, trend: 'stable' },
  { driver: 'Cash Flow Stress', impact: 16, affectedAccounts: 423, trend: 'down' },
];

const trendData = {
  deteriorations: [{ date: 'W1', value: 45 }, { date: 'W2', value: 52 }, { date: 'W3', value: 48 }, { date: 'W4', value: 61 }],
  delinquencies: [{ date: 'W1', value: 2.1 }, { date: 'W2', value: 2.3 }, { date: 'W3', value: 2.2 }, { date: 'W4', value: 2.4 }],
  cashflowStress: [{ date: 'W1', value: 8 }, { date: 'W2', value: 9 }, { date: 'W3', value: 8 }, { date: 'W4', value: 7 }],
  bureauDrops: [{ date: 'W1', value: 156 }, { date: 'W2', value: 178 }, { date: 'W3', value: 142 }, { date: 'W4', value: 189 }],
};

// Heatmap Data
const heatmaps: HeatmapConfig[] = [
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

// Concentration Data
const concentrationCategories: ConcentrationCategory[] = [
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

// EWS Data
const ewsIndicators: EWSIndicator[] = [
  { id: '1', name: 'Cash Flow Deterioration', description: '3 months declining operating cash', threshold: '15% decline', enabled: true, precision: 0.82, recall: 0.76 },
  { id: '2', name: 'Payment Pattern Change', description: 'Late payments after on-time history', threshold: '2+ consecutive', enabled: true, precision: 0.89, recall: 0.71 },
  { id: '3', name: 'Utilization Spike', description: 'Rapid increase in credit usage', threshold: '30% increase / 30 days', enabled: true, precision: 0.78, recall: 0.84 },
  { id: '4', name: 'Bureau Score Drop', description: 'Significant credit score decline', threshold: '25+ points', enabled: true, precision: 0.91, recall: 0.68 },
];

const ewsQueueItems: EWSQueueItem[] = [
  {
    id: '1',
    severity: 'critical',
    businessId: 'BIZ-2847',
    businessName: 'TechFlow Solutions',
    primaryDriver: 'Payment Pattern Change',
    driverType: 'payment',
    signals: ['3 late payments', 'Utilization 78%', 'Score drop 32pts'],
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

// Model Governance Data
const models: ModelInfo[] = [
  { id: '1', name: 'SMB Credit Score v3.2', version: '3.2.1', deployedDate: '2025-09-15', lastValidationDate: '2025-12-01', nextValidationDue: '2026-03-01', status: 'ok', type: 'credit_score' },
  { id: '2', name: 'PD Model - Working Capital', version: '2.1.0', deployedDate: '2025-06-01', lastValidationDate: '2025-11-15', nextValidationDue: '2026-02-15', status: 'warning', type: 'pd' },
  { id: '3', name: 'EWS Detector v1.5', version: '1.5.3', deployedDate: '2025-10-01', lastValidationDate: '2025-12-15', nextValidationDue: '2026-03-15', status: 'ok', type: 'ews' },
];

const featureDrifts: FeatureDrift[] = [
  { feature: 'payment_history_ratio', driftScore: 0.12, threshold: 0.15, status: 'ok', trend: 'stable' },
  { feature: 'utilization_rate', driftScore: 0.18, threshold: 0.15, status: 'warning', trend: 'increasing' },
  { feature: 'cash_flow_volatility', driftScore: 0.08, threshold: 0.15, status: 'ok', trend: 'stable' },
];

const outcomeMonitoring: OutcomeMonitoring[] = [
  { metric: 'Gini Coefficient', expected: 0.72, actual: 0.69, variance: -0.03, status: 'warning' },
  { metric: 'KS Statistic', expected: 0.45, actual: 0.43, variance: -0.02, status: 'ok' },
  { metric: 'Accuracy', expected: 0.85, actual: 0.84, variance: -0.01, status: 'ok' },
];

// Data Lineage Data
const dataSources: DataSource[] = [
  { id: '1', name: 'Experian Business', type: 'bureau', coverage: 94, freshness: '< 24h', medianAge: '18h', recordCount: 2547283, status: 'connected', lastSync: '2 hours ago', errorRate: 0.02 },
  { id: '2', name: 'D&B PAYDEX', type: 'bureau', coverage: 91, freshness: '< 48h', medianAge: '36h', recordCount: 2387453, status: 'connected', lastSync: '5 hours ago', errorRate: 0.01 },
  { id: '3', name: 'Plaid Banking', type: 'bank', coverage: 68, freshness: 'Real-time', medianAge: '< 1h', recordCount: 1847293, status: 'connected', lastSync: 'Real-time', errorRate: 0.03 },
  { id: '4', name: 'QuickBooks', type: 'accounting', coverage: 42, freshness: '< 24h', medianAge: '12h', recordCount: 1142387, status: 'degraded', lastSync: '18 hours ago', errorRate: 0.08 },
];

const missingFields: MissingField[] = [
  { field: 'annual_revenue', missingPct: 12, impactLevel: 'high', affectedModels: ['Credit Score', 'PD Model'] },
  { field: 'years_in_business', missingPct: 8, impactLevel: 'medium', affectedModels: ['Credit Score'] },
  { field: 'owner_credit_score', missingPct: 23, impactLevel: 'high', affectedModels: ['Credit Score', 'EWS'] },
];

// Audit Controls Data
const accessEvents: AccessEvent[] = [
  { id: '1', userId: 'u1', userName: 'John Smith', action: 'view', resource: 'TechFlow Solutions', resourceType: 'entity', timestamp: new Date(Date.now() - 15 * 60 * 1000), ipAddress: '192.168.1.45', sensitivityLevel: 'high' },
  { id: '2', userId: 'u2', userName: 'Sarah Chen', action: 'export', resource: 'Q4 Risk Report', resourceType: 'report', timestamp: new Date(Date.now() - 45 * 60 * 1000), ipAddress: '192.168.1.78', sensitivityLevel: 'high' },
  { id: '3', userId: 'u1', userName: 'John Smith', action: 'modify', resource: 'Alert Thresholds', resourceType: 'settings', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), ipAddress: '192.168.1.45', sensitivityLevel: 'medium' },
];

const permissionChanges: PermissionChange[] = [
  { id: '1', userId: 'u3', userName: 'Mike Johnson', changedBy: 'Admin Team', changeType: 'grant', permission: 'Export Reports', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: '2', userId: 'u4', userName: 'Lisa Wang', changedBy: 'Admin Team', changeType: 'revoke', permission: 'Modify Settings', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000) },
];

// Stress Scenario Data
const stressScenarios: StressScenario[] = [
  { id: 'mild_recession', name: 'Mild Recession', type: 'recession', severity: 'mild', assumptions: { rateChange: 1.0, revenueDecline: 10, unemploymentIncrease: 2 } },
  { id: 'moderate_recession', name: 'Moderate Recession', type: 'recession', severity: 'moderate', assumptions: { rateChange: 2.0, revenueDecline: 20, unemploymentIncrease: 4 } },
  { id: 'severe_recession', name: 'Severe Recession', type: 'recession', severity: 'severe', assumptions: { rateChange: 3.5, revenueDecline: 35, unemploymentIncrease: 8 } },
];

const migrationMatrix: MigrationMatrix[] = [
  { fromTier: 'Low', toTier: 'Low', currentPct: 92, stressedPct: 78, delta: -14 },
  { fromTier: 'Low', toTier: 'Medium', currentPct: 7, stressedPct: 18, delta: 11 },
  { fromTier: 'Low', toTier: 'High', currentPct: 1, stressedPct: 4, delta: 3 },
  { fromTier: 'Medium', toTier: 'Low', currentPct: 15, stressedPct: 8, delta: -7 },
  { fromTier: 'Medium', toTier: 'Medium', currentPct: 75, stressedPct: 62, delta: -13 },
  { fromTier: 'Medium', toTier: 'High', currentPct: 10, stressedPct: 30, delta: 20 },
];

const stressImpacts: StressImpact[] = [
  { metric: 'Expected Loss', baseline: 1.2, stressed: 3.8, change: 2.6, unit: '%' },
  { metric: 'Delinquency Rate', baseline: 2.4, stressed: 8.2, change: 5.8, unit: '%' },
  { metric: 'Average Score', baseline: 724, stressed: 678, change: -46, unit: 'pts' },
];

// ============================================
// MAIN RISK PAGE COMPONENT
// ============================================

const Risk: React.FC = () => {
  // State for global controls
  const [portfolioFilter, setPortfolioFilter] = useState<PortfolioFilter>(initialPortfolioFilter);
  const [timeWindow, setTimeWindow] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  const [riskLenses, setRiskLenses] = useState<RiskLens[]>(initialRiskLenses);
  const [selectedStressScenario, setSelectedStressScenario] = useState('moderate_recession');

  const handleRiskLensToggle = (lensId: string) => {
    setRiskLenses(prev => prev.map(lens => 
      lens.id === lensId ? { ...lens, active: !lens.active } : lens
    ));
  };

  const handleRefresh = () => {
    console.log('Refreshing risk data...');
  };

  const handleExport = () => {
    console.log('Exporting risk report...');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-semibold text-foreground">Risk Intelligence</h1>
        <p className="text-muted-foreground mt-1">
          Portfolio risk monitoring and early warning system
        </p>
      </motion.div>

      {/* Global Controls */}
      <RiskGlobalControls
        portfolioFilter={portfolioFilter}
        onPortfolioFilterChange={setPortfolioFilter}
        timeWindow={timeWindow}
        onTimeWindowChange={setTimeWindow}
        riskLenses={riskLenses}
        onRiskLensToggle={handleRiskLensToggle}
        onRefresh={handleRefresh}
        onExport={handleExport}
        lastRefreshed="2 min ago"
      />

      {/* Executive Risk Summary */}
      <ExecutiveRiskSummary
        kpis={riskKPIs}
        deteriorationDrivers={deteriorationDrivers}
        trendData={trendData}
        className="shadow-lg rounded-2xl"
      />

      {/* Row: Heatmap + Concentration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <RiskHeatmapMatrix
            heatmaps={heatmaps}
            onCellClick={(cell, heatmapId) => console.log('Cell clicked:', cell, heatmapId)}
            className="shadow-lg rounded-2xl h-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <ConcentrationPanel
            categories={concentrationCategories}
            onSetLimit={(catId, itemId, limit) => console.log('Set limit:', catId, itemId, limit)}
            onViewDetails={(catId, itemId) => console.log('View details:', catId, itemId)}
            className="shadow-lg rounded-2xl h-full"
          />
        </motion.div>
      </div>

      {/* EWS Work Queue - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <EWSWorkQueue
          indicators={ewsIndicators}
          queueItems={ewsQueueItems}
          onAssign={(itemId, assignee) => console.log('Assign:', itemId, assignee)}
          onAddNote={(itemId, note) => console.log('Note:', itemId, note)}
          onResolve={(itemId, resolution) => console.log('Resolve:', itemId, resolution)}
          onToggleIndicator={(indicatorId, enabled) => console.log('Toggle:', indicatorId, enabled)}
          onViewEntity={(businessId) => console.log('View entity:', businessId)}
          className="shadow-lg rounded-2xl"
        />
      </motion.div>

      {/* Row: Model Governance + Data Lineage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <ModelGovernancePanel
            models={models}
            featureDrifts={featureDrifts}
            outcomeMonitoring={outcomeMonitoring}
            overallStatus="warning"
            className="shadow-lg rounded-2xl h-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <DataLineagePanel
            sources={dataSources}
            missingFields={missingFields}
            overallCoverage={88}
            overallFreshness="< 24h"
            reconciliationStatus="ok"
            lastReconciliation="6 hours ago"
            className="shadow-lg rounded-2xl h-full"
          />
        </motion.div>
      </div>

      {/* Row: Stress Scenarios + Audit Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <StressScenarioPanel
            scenarios={stressScenarios}
            selectedScenarioId={selectedStressScenario}
            migrationMatrix={migrationMatrix}
            impacts={stressImpacts}
            portfolioSize={147200000}
            expectedLossBaseline={1764000}
            expectedLossStressed={5593600}
            onScenarioChange={setSelectedStressScenario}
            className="shadow-lg rounded-2xl h-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <AuditControlsPanel
            accessEvents={accessEvents}
            permissionChanges={permissionChanges}
            mfaEnforced={true}
            ssoEnabled={true}
            totalExports24h={12}
            sensitiveAccessCount={47}
            className="shadow-lg rounded-2xl h-full"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Risk;
