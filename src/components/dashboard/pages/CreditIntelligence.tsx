// Credit Intelligence — Portfolio-Centric View
// Primary demo screen: GlobalControls → KPI Row → Segment Grid → Charts → Drill-Down
// Bank-safe language throughout

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

import { BankDisclaimer } from '@/components/shared/BankDisclaimer';
import { DataLineageFooter } from '@/components/shared/DataLineageFooter';
import {
  PortfolioFilterBar,
  DEFAULT_PORTFOLIO_FILTERS,
  type PortfolioFilters,
} from '@/components/shared/PortfolioFilterBar';
import { BusinessDrillDown } from '@/components/enterprise/portfolio/BusinessDrillDown';
import { BusinessListTable } from '@/components/enterprise/portfolio/BusinessListTable';
import { PortfolioKPIRow } from '@/components/enterprise/portfolio/PortfolioKPIRow';
import { RiskDistributionChart } from '@/components/enterprise/portfolio/RiskDistributionChart';
import { RiskHeatmap } from '@/components/enterprise/portfolio/RiskHeatmap';
import { SegmentGrid } from '@/components/enterprise/portfolio/SegmentGrid';
import { SegmentScatterPlot } from '@/components/enterprise/portfolio/SegmentScatterPlot';
import { DEMO_BUSINESSES } from '@/data/fallback/demoData';
import {
  INDUSTRY_SEGMENTS,
  PORTFOLIO_KPIS,
  RISK_TIER_DISTRIBUTION,
} from '@/data/portfolioSegments';
import { useSegments } from '@/hooks/useSegments';

const DATA_SOURCES = [
  'D&B Commercial',
  'Experian BizID',
  'Banking Data Feed',
  'Secretary of State',
];

const CreditIntelligence: React.FC = () => {
  const [filters, setFilters] = useState<PortfolioFilters>(DEFAULT_PORTFOLIO_FILTERS);
  const [drillDownBusinessId, setDrillDownBusinessId] = useState<string | null>(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | undefined>(undefined);
  const { segments, sortBy, sortOrder, setSortBy } = useSegments();

  const handleSortChange = (field: string) => {
    const validFields = ['businessCount', 'totalExposure', 'qualRate', 'avgScore', 'highRiskPct'];
    if (validFields.includes(field)) {
      setSortBy(field as typeof sortBy);
    }
  };

  const handleSegmentSelect = (segmentId: string) => {
    setSelectedSegmentId(selectedSegmentId === segmentId ? undefined : segmentId);
  };

  const selectedSegmentName = useMemo(() => {
    if (!selectedSegmentId) return undefined;
    return INDUSTRY_SEGMENTS.find((s) => s.id === selectedSegmentId)?.name;
  }, [selectedSegmentId]);

  // Sample businesses for drill-down (from selected segment or all)
  const sampleBusinesses = useMemo(() => {
    if (!selectedSegmentId) return DEMO_BUSINESSES.slice(0, 5);
    const segment = INDUSTRY_SEGMENTS.find((s) => s.id === selectedSegmentId);
    if (!segment) return DEMO_BUSINESSES.slice(0, 5);
    const matched = DEMO_BUSINESSES.filter(
      (b) => b.industry.toLowerCase().includes(segment.name.split(' ')[0].toLowerCase())
    );
    return matched.length > 0 ? matched.slice(0, 5) : DEMO_BUSINESSES.slice(0, 5);
  }, [selectedSegmentId]);

  return (
    <div className="flex flex-col h-full">
      {/* Disclaimer */}
      <div className="px-4 lg:px-6 pt-4">
        <BankDisclaimer />
      </div>

      {/* Portfolio Filter Bar */}
      <div className="mt-3">
        <PortfolioFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          showStage={false}
          showTimeRange
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        {drillDownBusinessId ? (
          <BusinessDrillDown
            businessId={drillDownBusinessId}
            onClose={() => setDrillDownBusinessId(null)}
          />
        ) : (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-foreground">Credit Intelligence</h1>
              <p className="text-base text-muted-foreground mt-2">
                Portfolio-level credit analytics across 287,000 businesses
              </p>
            </motion.div>

            {/* KPI Row */}
            <PortfolioKPIRow kpis={PORTFOLIO_KPIS} />

            {/* Segment Grid */}
            <SegmentGrid
              segments={segments}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onSegmentSelect={handleSegmentSelect}
              selectedSegmentId={selectedSegmentId}
            />

            {/* Charts Row: Risk Distribution + Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <RiskDistributionChart tiers={RISK_TIER_DISTRIBUTION} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <RiskHeatmap segments={segments} />
              </motion.div>
            </div>

            {/* Scatter Plot */}
            <SegmentScatterPlot
              segments={segments}
              onSegmentClick={handleSegmentSelect}
            />

            {/* Sample Business Drill-Down Table */}
            <BusinessListTable
              businesses={sampleBusinesses}
              selectedSegmentName={selectedSegmentName}
              onBusinessClick={setDrillDownBusinessId}
            />
          </>
        )}

        {/* Data Lineage Footer */}
        <DataLineageFooter
          meta={{
            lastUpdated: '2026-01-28T10:00:00Z',
            dataSources: DATA_SOURCES,
          }}
        />
      </div>
    </div>
  );
};

export default CreditIntelligence;
