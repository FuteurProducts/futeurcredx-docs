/**
 * Credit Intelligence — Portfolio-Centric View (REWRITE)
 *
 * Thin orchestrator: KPI Row -> Segment Grid -> Score Distribution -> Drill-Down
 * All sub-components live in @/components/enterprise/credit-intelligence/
 * Data sourced from @/data/chaseDemoData — no local hardcoded numbers
 */

import { useState } from 'react';
import { motion } from 'framer-motion';

import { BankDisclaimer } from '@/components/shared/BankDisclaimer';
import { DataLineageFooter } from '@/components/shared/DataLineageFooter';
import {
  CreditKPIRow,
  ScoreDistribution,
  SegmentDrillDown,
  SegmentGrid,
} from '@/components/enterprise/credit-intelligence';
import { PORTFOLIO } from '@/data/chaseDemoData';
import { formatNumber } from '@/lib/formatters';

const DATA_SOURCES = [
  'D&B Commercial',
  'Experian BizID',
  'Banking Data Feed',
  'Secretary of State',
];

const CreditIntelligence: React.FC = () => {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(
    null,
  );

  const handleSegmentSelect = (segmentId: string) => {
    setSelectedSegmentId(segmentId);
  };

  const handleBack = () => {
    setSelectedSegmentId(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Disclaimer */}
      <div className="px-4 lg:px-6 pt-4">
        <BankDisclaimer />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-8">
        {selectedSegmentId ? (
          /* Segment Drill-Down View */
          <SegmentDrillDown
            segmentId={selectedSegmentId}
            onBack={handleBack}
          />
        ) : (
          <>
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Credit Intelligence
              </h1>
              <p className="text-base text-muted-foreground mt-2">
                Portfolio-level credit analytics across{' '}
                {formatNumber(PORTFOLIO.totalBusinesses)} businesses
              </p>
            </motion.div>

            {/* KPI Row — 6 cards */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <CreditKPIRow />
            </motion.div>

            {/* Segment Grid — 8 cards with sort/search/toggle/export */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <SegmentGrid onSegmentSelect={handleSegmentSelect} />
            </motion.div>

            {/* Score Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <ScoreDistribution />
            </motion.div>
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
