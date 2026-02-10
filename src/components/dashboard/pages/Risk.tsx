/**
 * Risk & Concentration Page
 * Bank-grade risk monitoring: KPI row, concentration panels,
 * EWS alert clusters, and compliance/fair-lending table.
 *
 * Data: src/data/chaseDemoData.ts (single source of truth)
 * Formatters: src/lib/formatters.ts (never define local)
 */

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Eye,
  Flag,
  ListPlus,
  MapPin,
  Shield,
  ShieldAlert,
  Store,
  TrendingDown,
  Users,
  ArrowUpDown,
  FileWarning,
  Settings,
  Building2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  getThresholdStatus,
  getThresholdBgClass,
  getSeverityBadgeClass,
  getSeverityDotClass,
} from '@/lib/formatters';
import {
  PORTFOLIO,
  RISK_KPIS,
  CONCENTRATION,
  EWS_CLUSTERS,
  COMPLIANCE,
} from '@/data/chaseDemoData';
import type { EWSCluster, ComplianceStatus } from '@/data/chaseDemoData';
import { KPICard } from '@/components/enterprise/shared/KPICard';
import { RiskDashboardSkeleton } from '@/components/ui/skeletons';
import { useToast } from '@/hooks/use-toast';

// ── Types ────────────────────────────────────────────────────────

type SortField = 'exposure' | 'severity' | 'businessCount';

interface ConcentrationItem {
  readonly name: string;
  readonly percent: number;
  readonly exposure: number;
  readonly status: string;
}

// ── Constants ────────────────────────────────────────────────────

const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'exposure', label: 'Exposure' },
  { value: 'severity', label: 'Severity' },
  { value: 'businessCount', label: 'Business Count' },
];

const COMPLIANCE_STATUS_ICON: Record<ComplianceStatus, React.ReactNode> = {
  ok: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  review: <Eye className="h-4 w-4 text-amber-500" />,
  flag: <Flag className="h-4 w-4 text-red-500" />,
};

const staggerChild = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' },
  }),
};

// ── Helpers ──────────────────────────────────────────────────────

function getConcentrationBarStatus(percent: number, limit: number): 'ok' | 'warning' | 'danger' {
  const ratio = percent / limit;
  if (ratio >= 1) return 'danger';
  if (ratio >= 0.8) return 'warning';
  return 'ok';
}

function sortClusters(clusters: EWSCluster[], field: SortField): EWSCluster[] {
  return [...clusters].sort((a, b) => {
    if (field === 'exposure') return b.exposure - a.exposure;
    if (field === 'severity') return (SEVERITY_ORDER[a.severity] ?? 99) - (SEVERITY_ORDER[b.severity] ?? 99);
    return b.businessCount - a.businessCount;
  });
}

// ── Sub-Components ───────────────────────────────────────────────

/** Concentration progress bar row */
function ConcentrationBar({
  entry,
  limit,
  index,
}: {
  entry: ConcentrationItem;
  limit: number;
  index: number;
}) {
  const fillPercent = Math.min((entry.percent / limit) * 100, 100);
  const barStatus = getConcentrationBarStatus(entry.percent, limit);

  return (
    <motion.div
      custom={index}
      variants={staggerChild}
      initial="hidden"
      animate="visible"
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{entry.name}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatCurrency(entry.exposure)}
          </span>
          <span className="font-semibold text-foreground tabular-nums w-12 text-right">
            {formatPercent(entry.percent, 1)}
          </span>
        </div>
      </div>
      <div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${fillPercent}%` }}
          transition={{ duration: 0.7, delay: index * 0.08, ease: 'easeOut' }}
          className={cn('absolute inset-y-0 left-0 rounded-full', getThresholdBgClass(barStatus))}
        />
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{fillPercent.toFixed(0)}% of limit</span>
      </div>
    </motion.div>
  );
}

/** Concentration panel (industry or geography) */
function ConcentrationPanel({
  title,
  icon,
  limit,
  entries,
  onEditThresholds,
}: {
  title: string;
  icon: React.ReactNode;
  limit: number;
  entries: ReadonlyArray<ConcentrationItem>;
  onEditThresholds: () => void;
}) {
  const allWithinLimits = entries.every(e => e.percent < limit);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          {icon}
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            Limit {formatPercent(limit, 0)}
          </span>
          <button
            onClick={onEditThresholds}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Edit thresholds"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bars */}
      <div className="px-5 py-4 space-y-4">
        {entries.map((entry, i) => (
          <ConcentrationBar key={entry.name} entry={entry} limit={limit} index={i} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-muted/30 border-t border-border">
        {allWithinLimits ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            All within limits
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
            <AlertTriangle className="h-3.5 w-3.5" />
            Limit breach detected
          </div>
        )}
      </div>
    </div>
  );
}

/** Single EWS cluster card */
function EWSClusterCard({
  cluster,
  isExpanded,
  onToggle,
  onAction,
}: {
  cluster: EWSCluster;
  isExpanded: boolean;
  onToggle: () => void;
  onAction: (cluster: EWSCluster, action: string) => void;
}) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Clickable header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Severity dot */}
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full flex-shrink-0 animate-pulse',
              getSeverityDotClass(cluster.severity),
            )}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-semibold text-foreground truncate">
                {cluster.title}
              </h4>
              <span
                className={cn(
                  'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                  getSeverityBadgeClass(cluster.severity),
                )}
              >
                {cluster.severity}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatNumber(cluster.businessCount)} businesses
              <span className="mx-1.5 text-border">|</span>
              {formatCurrency(cluster.exposure)} exposure
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {/* Expandable detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-3 border-t border-border pt-3">
              {/* Heaviest segments */}
              {cluster.heaviestSegments.length > 0 && (
                <div>
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    Heaviest Segments
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {cluster.heaviestSegments.map((seg) => (
                      <span
                        key={seg.segment}
                        className="inline-flex items-center gap-1 rounded-md bg-muted/60 border border-border px-2 py-1 text-xs text-foreground"
                      >
                        {seg.segment}
                        <span className="text-muted-foreground font-medium">({formatNumber(seg.count)})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {cluster.actions.map((action) => (
                  <button
                    key={action}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction(cluster, action);
                    }}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                      'border border-border bg-background hover:bg-muted text-foreground',
                    )}
                  >
                    {action === 'View Segment' && <Eye className="h-3 w-3" />}
                    {(action === 'Add All to Watch List' || action === 'Immediate Review') && <ListPlus className="h-3 w-3" />}
                    {(action === 'Assign to Team' || action === 'Assign to Senior' || action === 'Assign') && <Users className="h-3 w-3" />}
                    {action === 'Legal Review Queue' && <FileWarning className="h-3 w-3" />}
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Compliance / Fair Lending table */
function ComplianceTable({
  onRowClick,
}: {
  onRowClick: (segment: string) => void;
}) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
        <Shield className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Compliance / Fair Lending</h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-5 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Segment</th>
              <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Applications</th>
              <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Approved</th>
              <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Rate</th>
              <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Variance</th>
              <th className="text-center px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {COMPLIANCE.approvalVariance.map((row) => (
              <tr
                key={row.segment}
                onClick={() => onRowClick(row.segment)}
                className={cn(
                  'border-b border-border last:border-b-0 cursor-pointer transition-colors hover:bg-muted/30',
                  row.status === 'flag' && 'bg-red-50/50 dark:bg-red-950/10',
                  row.status === 'review' && 'bg-amber-50/50 dark:bg-amber-950/10',
                )}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    {COMPLIANCE_STATUS_ICON[row.status]}
                    <span className="font-medium text-foreground">{row.segment}</span>
                  </div>
                </td>
                <td className="text-right px-4 py-3 tabular-nums text-foreground">
                  {formatNumber(row.applications)}
                </td>
                <td className="text-right px-4 py-3 tabular-nums text-foreground">
                  {formatNumber(row.approved)}
                </td>
                <td className="text-right px-4 py-3 tabular-nums text-foreground">
                  {formatPercent(row.rate, 0)}
                </td>
                <td className="text-right px-4 py-3 tabular-nums">
                  <span
                    className={cn(
                      'font-semibold',
                      row.variance > 0 && 'text-emerald-600',
                      row.variance < -0.04 && 'text-red-600',
                      row.variance >= -0.04 && row.variance <= 0 && 'text-amber-600',
                    )}
                  >
                    {row.variance > 0 ? '+' : ''}{formatPercent(row.variance, 0)}
                  </span>
                </td>
                <td className="text-center px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                      row.status === 'ok' && 'bg-emerald-100 text-emerald-700 border-emerald-200',
                      row.status === 'review' && 'bg-amber-100 text-amber-700 border-amber-200',
                      row.status === 'flag' && 'bg-red-100 text-red-700 border-red-200',
                    )}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-muted/30 border-t border-border flex flex-wrap items-center gap-4 text-xs">
        <span className="text-muted-foreground">
          Portfolio approval rate:{' '}
          <span className="font-semibold text-foreground">
            {formatPercent(COMPLIANCE.portfolioApprovalRate, 0)}
          </span>
        </span>
        <span className="text-border">|</span>
        <span className="text-muted-foreground">
          Adverse actions sent:{' '}
          <span className="font-semibold text-foreground">
            {formatNumber(COMPLIANCE.adverseActionsSent)}
          </span>
        </span>
        <span className="text-border">|</span>
        <span className="text-muted-foreground">
          Fair lending status:{' '}
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 uppercase">
            <CheckCircle2 className="h-3 w-3" />
            {COMPLIANCE.fairLendingStatus}
          </span>
        </span>
      </div>
    </div>
  );
}

// ── Main Page Component ──────────────────────────────────────────

const Risk: React.FC = () => {
  const { toast } = useToast();
  const [isLoading] = useState(false);
  const [ewsSortField, setEwsSortField] = useState<SortField>('exposure');
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(new Set());

  // Sort EWS clusters
  const sortedClusters = useMemo(
    () => sortClusters([...EWS_CLUSTERS], ewsSortField),
    [ewsSortField],
  );

  // Toggle cluster expansion
  const toggleCluster = useCallback((id: string) => {
    setExpandedClusters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // EWS action handler
  const handleClusterAction = useCallback(
    (cluster: EWSCluster, action: string) => {
      if (action === 'View Segment') {
        toast({
          title: 'Opening segment view',
          description: `Opening segment view for ${cluster.title}`,
        });
      } else if (action === 'Add All to Watch List') {
        toast({
          title: 'Watch List updated',
          description: `${formatNumber(cluster.businessCount)} businesses added to Watch List`,
        });
      } else if (action.startsWith('Assign')) {
        toast({
          title: 'Cluster assigned',
          description: `Alert cluster assigned to team`,
        });
      } else if (action === 'Immediate Review') {
        toast({
          title: 'Review initiated',
          description: `${formatNumber(cluster.businessCount)} businesses queued for immediate review`,
        });
      } else if (action === 'Legal Review Queue') {
        toast({
          title: 'Legal review',
          description: `${formatNumber(cluster.businessCount)} cases sent to legal review queue`,
        });
      } else {
        toast({ title: action, description: `Action "${action}" triggered for ${cluster.title}` });
      }
    },
    [toast],
  );

  // KPI click handler
  const handleKpiClick = useCallback(
    (label: string, detail: string) => {
      toast({ title: label, description: detail });
    },
    [toast],
  );

  // Edit thresholds handler
  const handleEditThresholds = useCallback(() => {
    toast({
      title: 'Threshold editor',
      description: 'Threshold editor -- coming in next release',
    });
  }, [toast]);

  // Compliance row click
  const handleComplianceRowClick = useCallback(
    (segment: string) => {
      toast({
        title: 'Segment detail',
        description: `Viewing approval variance details for ${segment}`,
      });
    },
    [toast],
  );

  // Loading state
  if (isLoading) {
    return <RiskDashboardSkeleton />;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Risk & Concentration</h1>
        <p className="text-base text-muted-foreground mt-2">
          Portfolio risk monitoring, concentration limits, and early warning system
        </p>
      </motion.div>

      {/* ── KPI Row (6 cards) ───────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          label="Portfolio at Risk"
          value={RISK_KPIS.portfolioAtRisk.value}
          formatValue={(v) => formatCurrency(v)}
          subValue={formatPercent(RISK_KPIS.portfolioAtRisk.percent, 0)}
          status={getThresholdStatus(RISK_KPIS.portfolioAtRisk.percent, 0.15, 0.20)}
          icon={<ShieldAlert className="h-4 w-4" />}
          tooltip={`${formatCurrency(RISK_KPIS.portfolioAtRisk.value)} of ${formatCurrency(PORTFOLIO.totalExposure)} total exposure is at risk`}
          onClick={() =>
            handleKpiClick(
              'Portfolio at Risk',
              `${formatCurrency(RISK_KPIS.portfolioAtRisk.value)} (${formatPercent(RISK_KPIS.portfolioAtRisk.percent, 0)}) of total portfolio exposure`,
            )
          }
        />

        <KPICard
          label="Industry Concentration"
          value={Math.round(RISK_KPIS.industryConcentration.value * 100)}
          formatValue={(v) => `${v}%`}
          subValue={RISK_KPIS.industryConcentration.label}
          status={getThresholdStatus(RISK_KPIS.industryConcentration.value, 0.20, 0.25)}
          icon={<Store className="h-4 w-4" />}
          tooltip={`Highest industry concentration: ${RISK_KPIS.industryConcentration.label} at ${formatPercent(RISK_KPIS.industryConcentration.value, 1)}`}
          onClick={() =>
            handleKpiClick(
              'Industry Concentration',
              `${RISK_KPIS.industryConcentration.label} at ${formatPercent(RISK_KPIS.industryConcentration.value, 1)} (limit: 25%)`,
            )
          }
        />

        <KPICard
          label="Geographic Concentration"
          value={Math.round(RISK_KPIS.geographicConcentration.value * 100)}
          formatValue={(v) => `${v}%`}
          subValue={RISK_KPIS.geographicConcentration.label}
          status={getThresholdStatus(RISK_KPIS.geographicConcentration.value, 0.25, 0.30)}
          icon={<MapPin className="h-4 w-4" />}
          tooltip={`Highest geographic concentration: ${RISK_KPIS.geographicConcentration.label} at ${formatPercent(RISK_KPIS.geographicConcentration.value, 1)}`}
          onClick={() =>
            handleKpiClick(
              'Geographic Concentration',
              `${RISK_KPIS.geographicConcentration.label} at ${formatPercent(RISK_KPIS.geographicConcentration.value, 1)} (limit: 30%)`,
            )
          }
        />

        <KPICard
          label="EWS Alerts Active"
          value={RISK_KPIS.ewsAlerts}
          formatValue={(v) => formatNumber(v)}
          status="warning"
          icon={<AlertTriangle className="h-4 w-4" />}
          tooltip={`${formatNumber(RISK_KPIS.ewsAlerts)} active early warning signals across portfolio`}
          onClick={() =>
            handleKpiClick(
              'EWS Alerts Active',
              `${formatNumber(RISK_KPIS.ewsAlerts)} active early warning signals requiring review`,
            )
          }
        />

        <KPICard
          label="30-Day Deterioration"
          value={RISK_KPIS.thirtyDayDeterioration}
          formatValue={(v) => formatNumber(v)}
          subValue="businesses"
          status="warning"
          trend={{ direction: 'up', value: '+3.2% MoM', isPositive: false }}
          icon={<TrendingDown className="h-4 w-4" />}
          tooltip="Businesses with score deterioration in the last 30 days"
          onClick={() =>
            handleKpiClick(
              '30-Day Deterioration',
              `${formatNumber(RISK_KPIS.thirtyDayDeterioration)} businesses showed score deterioration over the past 30 days`,
            )
          }
        />

        <KPICard
          label="Watch List"
          value={RISK_KPIS.watchList}
          formatValue={(v) => formatNumber(v)}
          icon={<Eye className="h-4 w-4" />}
          tooltip="Total businesses currently on the active watch list"
          onClick={() =>
            handleKpiClick(
              'Watch List',
              `${formatNumber(RISK_KPIS.watchList)} businesses on the active monitoring watch list`,
            )
          }
        />
      </div>

      {/* ── Concentration Risk (side-by-side) ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <ConcentrationPanel
            title="Industry Concentration"
            icon={<Building2 className="h-5 w-5 text-muted-foreground" />}
            limit={CONCENTRATION.industry.limit}
            entries={CONCENTRATION.industry.values}
            onEditThresholds={handleEditThresholds}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <ConcentrationPanel
            title="Geographic Concentration"
            icon={<MapPin className="h-5 w-5 text-muted-foreground" />}
            limit={CONCENTRATION.geography.limit}
            entries={CONCENTRATION.geography.values}
            onEditThresholds={handleEditThresholds}
          />
        </motion.div>
      </div>

      {/* ── EWS Alert Clusters ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
      >
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Early Warning System — Alert Clusters
              </h3>
              <span className="inline-flex items-center rounded-md bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold">
                {EWS_CLUSTERS.reduce((sum, c) => sum + c.businessCount, 0).toLocaleString()} total
              </span>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={ewsSortField}
                onChange={(e) => setEwsSortField(e.target.value as SortField)}
                className="text-xs border border-border rounded-md bg-background px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cluster cards */}
          <div className="p-4 space-y-3">
            {sortedClusters.map((cluster) => (
              <EWSClusterCard
                key={cluster.id}
                cluster={cluster}
                isExpanded={expandedClusters.has(cluster.id)}
                onToggle={() => toggleCluster(cluster.id)}
                onAction={handleClusterAction}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Compliance / Fair Lending ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
      >
        <ComplianceTable onRowClick={handleComplianceRowClick} />
      </motion.div>
    </div>
  );
};

export default Risk;
