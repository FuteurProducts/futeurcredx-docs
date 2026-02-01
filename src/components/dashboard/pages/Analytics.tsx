import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { scoresService } from '@/services/bff';
import { getDashboardKPIs } from '@/services/dashboardMetrics';
import { withFallback } from '@/utils/withFallback';
import {
  AnalyticsGlobalControls,
  PortfolioKPITiles,
  ScoreDistributionChart,
  ScoreMigrationMatrix,
  RiskDriversPanel,
  ProductPenetrationTable,
  CrossSellFunnel,
  ApplicationFunnelChart,
  FeatureImportanceChart,
  SignalDriftMonitor,
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
import type { AnalyticsFilters, PortfolioKPI, ScoreBucket } from '@/components/enterprise/analytics/types';

// ============================================
// MAIN COMPONENT
// ============================================

const Analytics: React.FC = () => {
  const { toast } = useToast();
  const { portfolioId } = usePortfolio();

  // Live data state — initialised from mocks, replaced when BFF responds
  const [portfolioKPIs, setPortfolioKPIs] = useState<PortfolioKPI[]>(mockPortfolioKPIs);
  const [scoreDistribution, setScoreDistribution] = useState<ScoreBucket[]>(mockScoreDistribution);

  /**
   * Fetch live KPIs and score distribution from BFF, falling back to mock data.
   */
  const fetchAnalyticsData = useCallback(async () => {
    if (!portfolioId) return;

    // --- Portfolio KPIs ---
    const kpiResult = await getDashboardKPIs(portfolioId);
    if (kpiResult.source === 'live') {
      const live = kpiResult.data;
      // Merge live values into the mock template so labels/tooltips/format are preserved
      setPortfolioKPIs(prev =>
        prev.map(kpi => {
          switch (kpi.id) {
            case 'avg-score':
              return { ...kpi, value: live.avgLumiqScore, lastUpdated: 'just now', dataSource: 'LUMIQ AI Score Engine' };
            case 'deteriorating-clients':
              return { ...kpi, value: live.delinquencyRate, lastUpdated: 'just now', dataSource: 'Risk Analytics Engine' };
            case 'improving-clients':
              return {
                ...kpi,
                value: live.scoreCoverage > 0 ? Math.round(live.preQualRate * 10) / 10 : kpi.value,
                lastUpdated: 'just now',
                dataSource: 'Risk Analytics Engine',
              };
            case 'score-momentum':
              return {
                ...kpi,
                value: live.momGrowth,
                lastUpdated: 'just now',
                dataSource: 'Risk Analytics Engine',
              };
            default:
              return kpi;
          }
        }),
      );
    }

    // --- Score Distribution ---
    const distResult = await withFallback(
      () => scoresService.getDistribution(portfolioId!, 'internal').then(r => r.data),
      { ranges: [] as { min: number; max: number; count: number }[] },
      'Score Distribution',
    );

    if (distResult.source === 'live' && distResult.data.ranges.length > 0) {
      const totalCount = distResult.data.ranges.reduce((sum, r) => sum + r.count, 0);
      const liveBuckets: ScoreBucket[] = distResult.data.ranges.map(r => ({
        range: `${r.min}\u2013${r.max}`,
        min: r.min,
        max: r.max,
        count: r.count,
        percent: totalCount > 0 ? Math.round((r.count / totalCount) * 1000) / 10 : 0,
        // Estimate exposure proportionally (use mock total as baseline)
        exposure: totalCount > 0
          ? Math.round((r.count / totalCount) * 2_000_000_000)
          : 0,
      }));
      setScoreDistribution(liveBuckets);
    }
  }, [portfolioId]);

  // Re-fetch whenever the selected portfolio changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // State - aligned with AnalyticsFilters type
  const [filters, setFilters] = useState<AnalyticsFilters>({
    product: 'All',
    segment: 'all',
    geography: 'national',
    relationshipStage: 'all',
    timeWindow: '90d',
    analysisMode: 'performance',
  });

  // Handlers
  const handleFiltersChange = (newFilters: AnalyticsFilters) => {
    setFilters(newFilters);
    if (newFilters.analysisMode !== filters.analysisMode) {
      toast({ title: "View changed", description: `Switched to ${newFilters.analysisMode} analysis mode.` });
    }
  };

  const handleKPIDrilldown = (kpiId: string) => {
    const kpi = portfolioKPIs.find(k => k.id === kpiId);
    toast({ title: "KPI detail", description: `${kpi?.label || kpiId}: ${kpi?.value}${kpi?.format === 'percent' ? '%' : ''} — Source: ${kpi?.dataSource || 'Portfolio Analytics'}` });
  };

  const handleViewClients = (driverId: string) => {
    const driver = mockRiskDrivers.find(d => d.id === driverId);
    toast({ title: "Client list", description: `${driver?.affectedClients.toLocaleString() || '—'} clients affected by ${driver?.name || driverId}. Navigate to Customers tab for full list.` });
  };

  const handleViewOpportunity = (product: string) => {
    const prod = mockProductPenetration.find(p => p.product === product);
    toast({ title: "Opportunity detail", description: `${product}: ${prod?.opportunity}% gap between held (${prod?.held}%) and eligible (${prod?.eligible}%).` });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // ============================================
  // RENDER MODES
  // ============================================

  const renderPerformanceMode = () => (
    <motion.div
      key="performance"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* KPI Tiles */}
      <motion.div variants={itemVariants}>
        <PortfolioKPITiles
          kpis={portfolioKPIs}
          onDrilldown={handleKPIDrilldown}
        />
      </motion.div>

      {/* Score Distribution & Migration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <ScoreDistributionChart
            data={scoreDistribution}
            title="Portfolio Score Distribution"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ScoreMigrationMatrix data={mockScoreMigration} />
        </motion.div>
      </div>
    </motion.div>
  );

  const renderRiskMode = () => (
    <motion.div
      key="risk"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* KPI Tiles - Risk focused */}
      <motion.div variants={itemVariants}>
        <PortfolioKPITiles
          kpis={portfolioKPIs.filter(k =>
            ['deteriorating-clients', 'volatility-index', 'risk-index'].includes(k.id)
          )}
          onDrilldown={handleKPIDrilldown}
        />
      </motion.div>

      {/* Risk Drivers & Score Migration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <RiskDriversPanel
            drivers={mockRiskDrivers}
            onViewClients={handleViewClients}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ScoreMigrationMatrix data={mockScoreMigration} />
        </motion.div>
      </div>

      {/* Score Distribution */}
      <motion.div variants={itemVariants}>
        <ScoreDistributionChart
          data={scoreDistribution}
          title="Risk Score Distribution"
        />
      </motion.div>
    </motion.div>
  );

  const renderGrowthMode = () => (
    <motion.div
      key="growth"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Product Penetration & Cross-Sell Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <ProductPenetrationTable
            data={mockProductPenetration}
            onViewOpportunity={handleViewOpportunity}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <CrossSellFunnel stages={mockCrossSellFunnel} />
        </motion.div>
      </div>

      {/* KPI Subset for Growth */}
      <motion.div variants={itemVariants}>
        <PortfolioKPITiles
          kpis={portfolioKPIs.filter(k =>
            ['improving-clients', 'score-momentum'].includes(k.id)
          )}
          onDrilldown={handleKPIDrilldown}
        />
      </motion.div>
    </motion.div>
  );

  const renderConversionMode = () => (
    <motion.div
      key="conversion"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Application Funnel */}
      <motion.div variants={itemVariants}>
        <ApplicationFunnelChart data={mockApplicationFunnel} />
      </motion.div>

      {/* Cross-Sell Funnel */}
      <motion.div variants={itemVariants}>
        <CrossSellFunnel stages={mockCrossSellFunnel} />
      </motion.div>
    </motion.div>
  );

  const renderSignalsMode = () => (
    <motion.div
      key="signals"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Feature Importance & Signal Drift */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <FeatureImportanceChart features={mockFeatureImportance} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SignalDriftMonitor signals={mockSignalDrift} />
        </motion.div>
      </div>

      {/* Risk Drivers for Signal Context */}
      <motion.div variants={itemVariants}>
        <RiskDriversPanel
          drivers={mockRiskDrivers.slice(0, 3)}
          onViewClients={handleViewClients}
        />
      </motion.div>
    </motion.div>
  );

  const renderActiveMode = () => {
    switch (filters.analysisMode) {
      case 'performance':
        return renderPerformanceMode();
      case 'risk':
        return renderRiskMode();
      case 'growth':
        return renderGrowthMode();
      case 'conversion':
        return renderConversionMode();
      case 'signals':
        return renderSignalsMode();
      default:
        return renderPerformanceMode();
    }
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-muted/50 p-6 space-y-6">
      {/* Global Controls */}
      <AnalyticsGlobalControls
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Mode Content */}
      {renderActiveMode()}

      {/* Data Lineage Footer */}
      <div className="mt-8 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Data Sources: LUMIQ AI Score Engine, Portfolio Analytics, Risk Engine
          </span>
          <span>|</span>
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
          <span>|</span>
          <span>Coverage: 98.2%</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
