import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building2, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { DEMO_BUSINESSES } from '@/data/fallback/demoData';
import { getBusinessSignalProfile } from '@/data/creditSignalsData';
import { SIGNAL_STATUSES } from '@/constants/bankTerminology';
import { DemoMetaBadge } from '@/components/shared/DemoMetaBadge';
import { BureauCard } from './BureauCard';
import { ProductReadinessTable } from './ProductReadinessTable';
import { SignalCard } from './SignalCard';
import { TrajectoryTimeline } from './TrajectoryTimeline';

const DATA_SOURCES = [
  'D&B Commercial',
  'Experian BizID',
  'Banking Data Feed',
  'Secretary of State',
];

interface BusinessDrillDownProps {
  businessId: string;
  onClose: () => void;
}

export const BusinessDrillDown: React.FC<BusinessDrillDownProps> = ({
  businessId,
  onClose,
}) => {
  const selectedBusiness = DEMO_BUSINESSES.find((b) => b.id === businessId) ?? DEMO_BUSINESSES[0];

  const profile = useMemo(
    () => getBusinessSignalProfile(businessId, selectedBusiness.name),
    [businessId, selectedBusiness.name]
  );

  const signalSummary = useMemo(() => {
    const strong = profile.signals.filter((s) => s.status === 'strong').length;
    const stable = profile.signals.filter((s) => s.status === 'stable').length;
    const weak = profile.signals.filter((s) => s.status === 'weak').length;
    return { strong, stable, weak, total: profile.signals.length };
  }, [profile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Drill-down Header */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xl font-bold text-foreground">{selectedBusiness.name}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedBusiness.industry} &middot; {selectedBusiness.city},{' '}
                {selectedBusiness.state}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground bg-muted rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
            Back to Portfolio
          </button>
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground font-medium">Signal Summary:</span>
          <div className="flex items-center gap-1.5">
            <span className={cn('w-2 h-2 rounded-full', SIGNAL_STATUSES.strong.dot)} />
            <span className="text-xs text-foreground">{signalSummary.strong} Strong</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={cn('w-2 h-2 rounded-full', SIGNAL_STATUSES.stable.dot)} />
            <span className="text-xs text-foreground">{signalSummary.stable} Stable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={cn('w-2 h-2 rounded-full', SIGNAL_STATUSES.weak.dot)} />
            <span className="text-xs text-foreground">{signalSummary.weak} Weak</span>
          </div>
        </div>
      </div>

      {/* Signal Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Risk Indicator Signals</h3>
          <DemoMetaBadge
            lastUpdated="2026-01-28T10:00:00Z"
            dataSources={DATA_SOURCES}
            coverage={80.4}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.signals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </div>

      {/* Bureau Indicators */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-semibold text-foreground">External Bureau Indicators</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            Bureau-Reported
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profile.bureauIndicators.map((ind) => (
            <BureauCard key={ind.id} indicator={ind} />
          ))}
        </div>
      </div>

      {/* Product Readiness */}
      <ProductReadinessTable products={profile.productReadiness} />

      {/* Trajectory */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-foreground">Signal Trajectory (90 Days)</h3>
          <DemoMetaBadge lastUpdated="2026-01-28T10:00:00Z" dataSources={DATA_SOURCES} />
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Based on observed data patterns — not predictive
        </p>
        <TrajectoryTimeline events={profile.trajectoryEvents} />
      </div>
    </motion.div>
  );
};

export default BusinessDrillDown;
