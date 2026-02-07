// Credit Intelligence — Signal-Based View
// NO composite scores, NO numeric subscores, NO AI recommendations
// Bank-safe language throughout

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Building2,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Clock,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEMO_BUSINESSES } from '@/data/fallback/demoData';
import {
  getBusinessSignalProfile,
  type CreditSignal,
  type BureauIndicator,
  type ProductReadinessItem,
  type TrajectoryEvent,
} from '@/data/creditSignalsData';
import {
  SIGNAL_STATUSES,
  SIGNAL_DIRECTIONS,
  PRODUCT_READINESS,
  type SignalStatus,
  type SignalDirection,
} from '@/constants/bankTerminology';
import { BankDisclaimer } from '@/components/shared/BankDisclaimer';
import { DemoMetaBadge } from '@/components/shared/DemoMetaBadge';
import { PortfolioFilterBar, DEFAULT_PORTFOLIO_FILTERS, type PortfolioFilters } from '@/components/shared/PortfolioFilterBar';
import { DataLineageFooter } from '@/components/shared/DataLineageFooter';

// ---------- Helpers ----------

const DirectionIcon: React.FC<{ direction: SignalDirection; className?: string }> = ({ direction, className }) => {
  const cfg = SIGNAL_DIRECTIONS[direction];
  if (direction === 'improving') return <TrendingUp className={cn('h-4 w-4', cfg.color, className)} />;
  if (direction === 'worsening') return <TrendingDown className={cn('h-4 w-4', cfg.color, className)} />;
  return <Minus className={cn('h-4 w-4', cfg.color, className)} />;
};

const StatusBadge: React.FC<{ status: SignalStatus }> = ({ status }) => {
  const cfg = SIGNAL_STATUSES[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', cfg.bg)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      <span className={cfg.color}>{cfg.label}</span>
    </span>
  );
};

const DATA_SOURCES = ['D&B Commercial', 'Experian BizID', 'Banking Data Feed', 'Secretary of State'];

// ---------- Sub-components ----------

const SignalCard: React.FC<{ signal: CreditSignal }> = ({ signal }) => {
  const statusCfg = SIGNAL_STATUSES[signal.status];

  return (
    <div className={cn('rounded-xl border p-4 transition-all hover:shadow-sm', statusCfg.bg)}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-semibold', statusCfg.color)}>{signal.name}</span>
          <span className="text-[10px] text-muted-foreground bg-background/60 px-1.5 py-0.5 rounded">
            {signal.category}
          </span>
        </div>
        <DemoMetaBadge lastUpdated={signal.lastUpdated} dataSources={[signal.source]} />
      </div>
      <div className="flex items-center gap-3 mb-2">
        <StatusBadge status={signal.status} />
        <div className="flex items-center gap-1">
          <DirectionIcon direction={signal.direction} />
          <span className={cn('text-xs font-medium', SIGNAL_DIRECTIONS[signal.direction].color)}>
            {SIGNAL_DIRECTIONS[signal.direction].label}
          </span>
        </div>
      </div>
      <p className="text-xs text-foreground/80 leading-relaxed">{signal.detail}</p>
      <div className="mt-2 text-[10px] text-muted-foreground">Source: {signal.source}</div>
    </div>
  );
};

const BureauCard: React.FC<{ indicator: BureauIndicator }> = ({ indicator }) => (
  <div className="rounded-xl border border-border bg-card p-4">
    <div className="flex items-start justify-between mb-1">
      <span className="text-sm font-semibold text-foreground">{indicator.name}</span>
      <ExternalLink className="h-3 w-3 text-muted-foreground" />
    </div>
    <div className="text-xs text-muted-foreground mb-2">{indicator.provider}</div>
    <div className="text-lg font-bold text-foreground mb-1">{indicator.value}</div>
    <p className="text-xs text-muted-foreground leading-relaxed">{indicator.interpretation}</p>
    <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
      <Clock className="h-2.5 w-2.5" />
      <span>As of {new Date(indicator.asOfDate).toLocaleDateString()}</span>
    </div>
  </div>
);

const ReadinessBadge: React.FC<{ readiness: ProductReadinessItem['readiness'] }> = ({ readiness }) => {
  const cfg = PRODUCT_READINESS[readiness];
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border', cfg.bg)}>
      <span className={cfg.color}>{cfg.label}</span>
    </span>
  );
};

const TrajectoryRow: React.FC<{ event: TrajectoryEvent }> = ({ event }) => {
  const dotColor = event.sentiment === 'positive'
    ? 'bg-emerald-500'
    : event.sentiment === 'negative'
      ? 'bg-red-500'
      : 'bg-amber-500';

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
      <div className="flex flex-col items-center mt-1">
        <div className={cn('w-2.5 h-2.5 rounded-full', dotColor)} />
        <div className="w-px flex-1 bg-border" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm text-foreground">{event.description}</p>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {new Date(event.date).toLocaleDateString()}
          </span>
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5">{event.source}</div>
      </div>
    </div>
  );
};

// ---------- Main Component ----------

const CreditIntelligence: React.FC = () => {
  const [filters, setFilters] = useState<PortfolioFilters>(DEFAULT_PORTFOLIO_FILTERS);
  const [selectedBusinessId, setSelectedBusinessId] = useState(DEMO_BUSINESSES[0].id);
  const [businessSearch, setBusinessSearch] = useState('');
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const selectedBusiness = DEMO_BUSINESSES.find((b) => b.id === selectedBusinessId) ?? DEMO_BUSINESSES[0];
  const profile = useMemo(
    () => getBusinessSignalProfile(selectedBusinessId, selectedBusiness.name),
    [selectedBusinessId, selectedBusiness.name],
  );

  const filteredBusinesses = useMemo(() => {
    let list = DEMO_BUSINESSES;
    if (businessSearch) {
      const q = businessSearch.toLowerCase();
      list = list.filter((b) => b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
    }
    return list;
  }, [businessSearch]);

  // Signal summary counts
  const signalSummary = useMemo(() => {
    const strong = profile.signals.filter((s) => s.status === 'strong').length;
    const stable = profile.signals.filter((s) => s.status === 'stable').length;
    const weak = profile.signals.filter((s) => s.status === 'weak').length;
    return { strong, stable, weak, total: profile.signals.length };
  }, [profile]);

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
        {/* Header + Business Selector */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Credit Intelligence</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Signal-based risk indicators for portfolio businesses
              </p>
            </div>

            {/* Business Selector */}
            <div className="relative">
              <button
                onClick={() => setIsBusinessDropdownOpen(!isBusinessDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2.5 bg-muted rounded-lg border border-border hover:bg-muted/80 transition-colors"
              >
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-foreground">{selectedBusiness.name}</div>
                  <div className="text-[10px] text-muted-foreground">{selectedBusiness.industry}</div>
                </div>
                <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', isBusinessDropdownOpen && 'rotate-180')} />
              </button>

              {isBusinessDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50"
                >
                  <div className="p-2 border-b border-border">
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-muted rounded-lg">
                      <Search className="h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        value={businessSearch}
                        onChange={(e) => setBusinessSearch(e.target.value)}
                        placeholder="Search by name or ID..."
                        className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-1.5">
                    {filteredBusinesses.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBusinessId(b.id);
                          setIsBusinessDropdownOpen(false);
                          setBusinessSearch('');
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                          b.id === selectedBusinessId ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground',
                        )}
                      >
                        <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-medium">{b.name}</div>
                          <div className="text-[10px] text-muted-foreground">{b.id} &middot; {b.industry}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Signal Summary Strip */}
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
            <span className="text-[10px] text-muted-foreground ml-auto">
              {signalSummary.total} signals evaluated
            </span>
          </div>
        </div>

        {/* Signal Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Risk Indicator Signals</h2>
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

        {/* External Bureau Indicators */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-semibold text-foreground">External Bureau Indicators</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              Bureau-Reported — Not LumiqAI Generated
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.bureauIndicators.map((ind) => (
              <BureauCard key={ind.id} indicator={ind} />
            ))}
          </div>
        </div>

        {/* Product Readiness Grid */}
        <div className="bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between p-5 pb-0">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Product Readiness Indicators</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Based on observed signal patterns — not a lending determination
              </p>
            </div>
            <DemoMetaBadge lastUpdated="2026-01-28T10:00:00Z" dataSources={DATA_SOURCES} />
          </div>
          <div className="p-5">
            <div className="space-y-1">
              {/* Header row */}
              <div className="grid grid-cols-12 gap-4 px-3 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                <div className="col-span-4">Product</div>
                <div className="col-span-2">Readiness</div>
                <div className="col-span-3">Key Qualifying Signal</div>
                <div className="col-span-3">Key Concern</div>
              </div>
              {profile.productReadiness.map((item) => (
                <div key={item.productId}>
                  <button
                    onClick={() =>
                      setExpandedProduct(expandedProduct === item.productId ? null : item.productId)
                    }
                    className="w-full grid grid-cols-12 gap-4 items-center px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="col-span-4 flex items-center gap-2">
                      {expandedProduct === item.productId ? (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-foreground">{item.productName}</div>
                        <div className="text-[10px] text-muted-foreground">{item.facilitySize}</div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <ReadinessBadge readiness={item.readiness} />
                    </div>
                    <div className="col-span-3 text-xs text-foreground/80 truncate">
                      {item.qualifyingSignal}
                    </div>
                    <div className="col-span-3 text-xs text-foreground/80 truncate">{item.concern}</div>
                  </button>
                  {expandedProduct === item.productId && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="ml-9 px-3 pb-3"
                    >
                      <div className="bg-muted/50 rounded-lg p-3 text-xs space-y-1.5">
                        <div>
                          <span className="text-muted-foreground">Facility: </span>
                          <span className="text-foreground">{item.facilitySize}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Qualifying Signal: </span>
                          <span className="text-foreground">{item.qualifyingSignal}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Concern: </span>
                          <span className="text-foreground">{item.concern}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-1">
                          <Info className="h-2.5 w-2.5" />
                          <span>This indicator is for informational purposes only and does not constitute a lending decision</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trajectory Timeline */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-foreground">Signal Trajectory (90 Days)</h2>
            <DemoMetaBadge lastUpdated="2026-01-28T10:00:00Z" dataSources={DATA_SOURCES} />
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Based on observed data patterns — not predictive
          </p>
          <div>
            {profile.trajectoryEvents.map((event) => (
              <TrajectoryRow key={event.id} event={event} />
            ))}
          </div>
        </div>

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
