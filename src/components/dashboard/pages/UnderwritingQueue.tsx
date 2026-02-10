// Underwriting Queue — Chase Demo
// Queue-based table with SLA indicators, bulk actions, auto-approve rules

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Download,
  Filter,
  FileText,
  Users,
  Zap,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuditEmit } from '@/hooks/useAuditEmit';
import { KPICard } from '@/components/enterprise/shared/KPICard';
import { formatCurrency, formatNumber, formatPercent, getRiskBadgeClass, getSLAIndicator } from '@/lib/formatters';
import { UNDERWRITING, COMPLIANCE, type UnderwritingQueueItem } from '@/data/chaseDemoData';
import { DataLineageFooter } from '@/components/shared/DataLineageFooter';

type SortField = 'business' | 'product' | 'amount' | 'score' | 'risk' | 'timeInQueue' | 'slaStatus';
type SortDir = 'asc' | 'desc';

const RISK_ORDER: Record<string, number> = { LOW: 0, MODERATE: 1, ELEVATED: 2, HIGH: 3, CRITICAL: 4 };
const SLA_ORDER: Record<string, number> = { ok: 0, warning: 1, breach: 2 };

const UnderwritingQueue: React.FC = () => {
  const { toast } = useToast();
  const { emitBulkActionExecuted } = useAuditEmit();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('timeInQueue');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterProduct, setFilterProduct] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [detailItem, setDetailItem] = useState<UnderwritingQueueItem | null>(null);
  const [showRules, setShowRules] = useState(true);

  // ── Sorting ───────────────────────────────────────────────────
  const sortedQueue = useMemo(() => {
    let items = [...UNDERWRITING.queue];

    // Apply filters
    if (filterProduct !== 'all') {
      items = items.filter(i => i.product === filterProduct);
    }
    if (filterRisk !== 'all') {
      items = items.filter(i => i.risk === filterRisk);
    }

    items.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'business': cmp = a.business.localeCompare(b.business); break;
        case 'product': cmp = a.product.localeCompare(b.product); break;
        case 'amount': cmp = a.amount - b.amount; break;
        case 'score': cmp = a.score - b.score; break;
        case 'risk': cmp = (RISK_ORDER[a.risk] ?? 0) - (RISK_ORDER[b.risk] ?? 0); break;
        case 'timeInQueue': cmp = a.timeInQueue - b.timeInQueue; break;
        case 'slaStatus': cmp = (SLA_ORDER[a.slaStatus] ?? 0) - (SLA_ORDER[b.slaStatus] ?? 0); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return items;
  }, [sortField, sortDir, filterProduct, filterRisk]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === sortedQueue.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedQueue.map(i => i.id)));
    }
  };

  const handleBulkAction = (action: string) => {
    const count = selectedIds.size;
    if (count === 0) return;
    emitBulkActionExecuted(action, Array.from(selectedIds));
    toast({ title: `${action} — ${count} application${count > 1 ? 's' : ''}`, description: 'Action logged to audit trail' });
    setSelectedIds(new Set());
  };

  // ── KPIs ──────────────────────────────────────────────────────
  const kpis = UNDERWRITING.kpis;

  const SortHeader: React.FC<{ field: SortField; label: string; className?: string }> = ({ field, label, className }) => (
    <th
      className={cn('px-5 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-all duration-200 select-none', className)}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {sortField === field ? (
          sortDir === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-30" />
        )}
      </div>
    </th>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Underwriting Queue</h1>
            <p className="text-sm text-muted-foreground">Decision queue management and compliance</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRules(r => !r)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted transition-all duration-200"
            >
              <Shield className="h-4 w-4" />
              {showRules ? 'Hide' : 'Show'} Rules
            </button>
            <button
              onClick={() => toast({ title: 'Queue exported', description: `${sortedQueue.length} applications exported to CSV` })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard
            label="Queue Depth"
            value={kpis.queueDepth}
            formatValue={v => formatNumber(v)}
            subValue="pending"
            status={kpis.queueDepth < 150 ? 'ok' : kpis.queueDepth < 250 ? 'warning' : 'danger'}
            tooltip="Applications awaiting decision"
            icon={<FileText className="h-4 w-4" />}
          />
          <KPICard
            label="Avg Decision Time"
            value={Math.round(kpis.avgDecisionTime * 10)}
            formatValue={v => `${(v / 10).toFixed(1)}h`}
            status={kpis.avgDecisionTime < 4 ? 'ok' : kpis.avgDecisionTime < 8 ? 'warning' : 'danger'}
            tooltip="Average time from submission to decision"
            icon={<Clock className="h-4 w-4" />}
          />
          <KPICard
            label="Auto-Approve Rate"
            value={Math.round(kpis.autoApproveRate * 1000)}
            formatValue={v => `${(v / 10).toFixed(1)}%`}
            trend={{ direction: 'up', value: '+2.1% vs last month', isPositive: true }}
            tooltip="Percentage auto-approved by rules engine"
            icon={<Zap className="h-4 w-4" />}
          />
          <KPICard
            label="Manual Review"
            value={Math.round(kpis.manualReviewRate * 100)}
            formatValue={v => `${v}%`}
            tooltip="Percentage requiring analyst review"
            icon={<Users className="h-4 w-4" />}
          />
          <KPICard
            label="Decline Rate"
            value={Math.round(kpis.declineRate * 100)}
            formatValue={v => `${v}%`}
            status={kpis.declineRate < 0.25 ? 'ok' : kpis.declineRate < 0.35 ? 'warning' : 'danger'}
            tooltip="Applications declined in current period"
            icon={<XCircle className="h-4 w-4" />}
          />
          <KPICard
            label="SLA Compliance"
            value={Math.round(kpis.slaCompliance * 1000)}
            formatValue={v => `${(v / 10).toFixed(1)}%`}
            status={kpis.slaCompliance > 0.9 ? 'ok' : kpis.slaCompliance > 0.8 ? 'warning' : 'danger'}
            trend={{ direction: 'down', value: '-1.2% vs target', isPositive: false }}
            tooltip="Decisions made within SLA window"
            icon={<Shield className="h-4 w-4" />}
          />
        </div>

        {/* Rules Panel (collapsible) */}
        {showRules && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
            <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">Underwriting Rules (Active)</h3>
                </div>
                <button
                  onClick={() => toast({ title: 'Rule Editor', description: 'Rule management — coming in next release' })}
                  className="text-xs text-primary hover:underline transition-all duration-200"
                >
                  Edit Rules
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Auto-Approve */}
                <div className="rounded-xl border border-border/60 p-4">
                  <h4 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> AUTO-APPROVE when ALL met:
                  </h4>
                  <ul className="space-y-1.5">
                    {UNDERWRITING.rules.autoApprove && UNDERWRITING.rules.autoApprove.length > 0 ? (
                      UNDERWRITING.rules.autoApprove.map((rule, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          {rule}
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-muted-foreground">No rules configured</li>
                    )}
                  </ul>
                </div>

                {/* Auto-Decline */}
                <div className="rounded-xl border border-border/60 p-4">
                  <h4 className="text-xs font-semibold text-rose-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> AUTO-DECLINE when ANY met:
                  </h4>
                  <ul className="space-y-1.5">
                    {UNDERWRITING.rules.autoDecline && UNDERWRITING.rules.autoDecline.length > 0 ? (
                      UNDERWRITING.rules.autoDecline.map((rule, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-foreground">
                          <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                          {rule}
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-muted-foreground">No rules configured</li>
                    )}
                  </ul>
                </div>

                {/* Manual Review */}
                <div className="rounded-xl border border-border/60 p-4">
                  <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" /> MANUAL REVIEW:
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Everything that doesn&apos;t match auto-approve or auto-decline criteria is routed to the manual review queue for analyst decision.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters + Bulk Actions Bar */}
        <div className="bg-card rounded-2xl border border-border/60 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              {/* Selection */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.size === sortedQueue.length && sortedQueue.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-xs text-muted-foreground">
                  {selectedIds.size > 0 ? (
                    <><span className="font-semibold text-foreground">{selectedIds.size}</span> selected</>
                  ) : (
                    'Select all'
                  )}
                </span>
                {selectedIds.size > 0 && (
                  <button onClick={() => setSelectedIds(new Set())} className="text-xs text-primary hover:underline transition-all duration-200">Clear</button>
                )}
              </div>

              <div className="w-px h-5 bg-border" />

              {/* Filters */}
              <div className="flex items-center gap-1.5">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filterProduct}
                  onChange={e => setFilterProduct(e.target.value)}
                  className="text-xs bg-transparent border border-border rounded px-2 py-1 text-foreground"
                >
                  <option value="all">All Products</option>
                  <option value="LOC">LOC</option>
                  <option value="TERM">Term Loan</option>
                  <option value="SBA">SBA</option>
                </select>
                <select
                  value={filterRisk}
                  onChange={e => setFilterRisk(e.target.value)}
                  className="text-xs bg-transparent border border-border rounded px-2 py-1 text-foreground"
                >
                  <option value="all">All Risk</option>
                  <option value="LOW">Low</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="ELEVATED">Elevated</option>
                  <option value="HIGH">High</option>
                </select>
                {(filterProduct !== 'all' || filterRisk !== 'all') && (
                  <button
                    onClick={() => { setFilterProduct('all'); setFilterRisk('all'); }}
                    className="text-xs text-primary hover:underline flex items-center gap-0.5 transition-all duration-200"
                  >
                    <X className="h-4 w-4" /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* Bulk Action Buttons */}
            {selectedIds.size > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                <button
                  onClick={() => handleBulkAction('Approved')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </button>
                <button
                  onClick={() => handleBulkAction('Declined')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-all duration-200"
                >
                  <XCircle className="h-4 w-4" /> Decline
                </button>
                <button
                  onClick={() => handleBulkAction('Sent for review')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-all duration-200"
                >
                  <AlertTriangle className="h-4 w-4" /> Request Info
                </button>
                <button
                  onClick={() => handleBulkAction('Escalated')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-all duration-200"
                >
                  <Users className="h-4 w-4" /> Escalate
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Queue Table */}
        <div className="bg-card rounded-2xl border border-border/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border/30">
                <tr className="h-14">
                  <th className="w-10 px-5 py-4" />
                  <SortHeader field="business" label="Business" />
                  <SortHeader field="product" label="Product" />
                  <SortHeader field="amount" label="Amount" />
                  <SortHeader field="score" label="Score" />
                  <SortHeader field="risk" label="Risk" />
                  <SortHeader field="timeInQueue" label="Time in Queue" />
                  <SortHeader field="slaStatus" label="SLA" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {sortedQueue.map((item, index) => {
                  const sla = getSLAIndicator(item.slaStatus);
                  const isSelected = selectedIds.has(item.id);

                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className={cn(
                        'hover:bg-muted/30 cursor-pointer transition-colors duration-150',
                        isSelected && 'bg-primary/5',
                        item.slaStatus === 'breach' && 'bg-rose-50/50 dark:bg-rose-950/20',
                      )}
                      onClick={() => setDetailItem(item)}
                    >
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(item.id)}
                          className="w-4 h-4 rounded border-border"
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-sm text-foreground">{item.business}</div>
                        <div className="text-xs text-muted-foreground font-mono">{item.id.toUpperCase()}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-muted text-foreground">
                          {item.product}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-foreground">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          'text-sm font-semibold',
                          item.score >= 70 ? 'text-emerald-600' : item.score >= 50 ? 'text-foreground' : 'text-rose-600',
                        )}>
                          {item.score}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn('px-2 py-0.5 rounded text-xs font-semibold border', getRiskBadgeClass(item.risk))}>
                          {item.risk}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground tabular-nums">
                        {item.timeInQueue.toFixed(1)}h
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn('text-xs font-semibold', sla.colorClass)}>
                          {sla.label}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
            Showing {sortedQueue.length} of {UNDERWRITING.queue.length} applications
          </div>
        </div>

        {/* Detail Slide-Over */}
        {detailItem && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border/60 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{detailItem.business}</h3>
                <div className="text-xs text-muted-foreground">
                  {detailItem.product} &middot; {formatCurrency(detailItem.amount)} &middot; Score: {detailItem.score}
                </div>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="p-1 hover:bg-muted rounded transition-all duration-200"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk Tier</div>
                <div className={cn('text-sm font-semibold mt-1', getRiskBadgeClass(detailItem.risk).split(' ')[1])}>
                  {detailItem.risk}
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time in Queue</div>
                <div className="text-sm font-semibold text-foreground mt-1">{detailItem.timeInQueue.toFixed(1)} hours</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SLA Status</div>
                <div className={cn('text-sm font-semibold mt-1', getSLAIndicator(detailItem.slaStatus).colorClass)}>
                  {getSLAIndicator(detailItem.slaStatus).label}
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Composite Score</div>
                <div className="text-sm font-semibold text-foreground mt-1">{detailItem.score}/100</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { toast({ title: 'Application approved', description: detailItem.business }); setDetailItem(null); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200"
              >
                <CheckCircle2 className="h-4 w-4" /> Approve
              </button>
              <button
                onClick={() => { toast({ title: 'Application declined', description: detailItem.business }); setDetailItem(null); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-all duration-200"
              >
                <XCircle className="h-4 w-4" /> Decline
              </button>
              <button
                onClick={() => { toast({ title: 'Sent for additional review', description: detailItem.business }); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-all duration-200"
              >
                <FileText className="h-4 w-4" /> Request Info
              </button>
              <button
                onClick={() => { toast({ title: 'Escalated to committee', description: detailItem.business }); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-all duration-200"
              >
                <AlertTriangle className="h-4 w-4" /> Escalate
              </button>
            </div>
          </motion.div>
        )}

        {/* Compliance Section */}
        <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Approval Variance by Segment (Fair Lending)</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-muted-foreground">Portfolio Rate: {formatPercent(COMPLIANCE.portfolioApprovalRate)}</span>
              <span className="text-muted-foreground">Adverse Actions: {formatNumber(COMPLIANCE.adverseActionsSent)}</span>
              <span className={cn(
                'px-2 py-0.5 rounded-full font-semibold',
                COMPLIANCE.fairLendingStatus === 'pass' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700',
              )}>
                Fair Lending: {COMPLIANCE.fairLendingStatus.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border/30">
                <tr className="h-14">
                  <th className="px-5 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Segment</th>
                  <th className="px-5 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Applications</th>
                  <th className="px-5 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Approved</th>
                  <th className="px-5 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rate</th>
                  <th className="px-5 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Variance</th>
                  <th className="px-5 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {COMPLIANCE.approvalVariance && COMPLIANCE.approvalVariance.length > 0 ? (
                  COMPLIANCE.approvalVariance.map(row => (
                    <tr key={row.segment} className={cn(
                      'hover:bg-muted/30 transition-colors duration-150',
                      row.status === 'flag' && 'bg-rose-50/50 dark:bg-rose-950/20',
                      row.status === 'review' && 'bg-amber-50/50 dark:bg-amber-950/20',
                    )}>
                      <td className="px-5 py-4 text-sm text-foreground">{row.segment}</td>
                      <td className="px-5 py-4 text-sm text-right text-foreground tabular-nums">{formatNumber(row.applications)}</td>
                      <td className="px-5 py-4 text-sm text-right text-foreground tabular-nums">{formatNumber(row.approved)}</td>
                      <td className="px-5 py-4 text-sm text-right text-foreground tabular-nums">{formatPercent(row.rate)}</td>
                      <td className={cn(
                        'px-5 py-4 text-sm text-right font-medium tabular-nums',
                        row.variance > 0 ? 'text-emerald-600' : row.variance < -0.05 ? 'text-rose-600' : 'text-foreground',
                      )}>
                        {row.variance > 0 ? '+' : ''}{formatPercent(row.variance)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {row.status === 'ok' && <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />}
                        {row.status === 'review' && <AlertTriangle className="h-4 w-4 text-amber-500 mx-auto" />}
                        {row.status === 'flag' && <XCircle className="h-4 w-4 text-rose-500 mx-auto" />}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <p className="text-sm text-muted-foreground">No compliance data available</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs text-muted-foreground italic">
            Reg B / ECOA compliance monitoring. Variance exceeding ±5% triggers review; ±10% triggers investigation.
          </div>
        </div>

        {/* Data Lineage Footer */}
        <DataLineageFooter
          meta={{
            lastUpdated: '2026-01-28T10:00:00Z',
            dataSources: ['Decision Engine', 'Credit Bureau Feed', 'Compliance Monitor', 'SLA Tracker'],
          }}
        />
      </div>
    </div>
  );
};

export default UnderwritingQueue;
