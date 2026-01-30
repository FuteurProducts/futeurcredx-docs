import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
import type { AnalyticsFilters } from '@/components/enterprise/analytics/types';

// ============================================
// MAIN COMPONENT
// ============================================

const Analytics: React.FC = () => {
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
  };

  const handleKPIDrilldown = (kpiId: string) => {
    console.log('KPI drilldown:', kpiId);
    // Future: open drill-down modal
  };

  const handleViewClients = (driverId: string) => {
    console.log('View clients for driver:', driverId);
    // Future: navigate to filtered customer list
  };

  const handleViewOpportunity = (product: string) => {
    console.log('View opportunity:', product);
    // Future: show product opportunity details
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
          kpis={mockPortfolioKPIs}
          onDrilldown={handleKPIDrilldown}
        />
      </motion.div>

      {/* Score Distribution & Migration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <ScoreDistributionChart
            data={mockScoreDistribution}
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
          kpis={mockPortfolioKPIs.filter(k => 
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
          data={mockScoreDistribution}
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
          kpis={mockPortfolioKPIs.filter(k => 
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
            Data Sources: LumiqAI Score Engine, Portfolio Analytics, Risk Engine
          </span>
          <span>|</span>
          <span>Last Updated: 2 mins ago</span>
          <span>|</span>
          <span>Coverage: 98.2%</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
