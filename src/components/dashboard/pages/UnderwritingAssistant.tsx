// Underwriting Assistant — Case Management Workspace
// NO composite scores, NO auto-approve, NO AI confidence %
// Bank-safe language: recommendations, not decisions

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  User,
  ChevronDown,
  ChevronRight,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Minus,
  TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuditEmit } from '@/hooks/useAuditEmit';
import {
  CASE_STATUSES,
  SIGNAL_STATUSES,
  SIGNAL_DIRECTIONS,
  DISCLAIMER_TEXT,
  type CaseStatus,
} from '@/constants/bankTerminology';
import { BankDisclaimer } from '@/components/shared/BankDisclaimer';
import { DemoMetaBadge } from '@/components/shared/DemoMetaBadge';
import { DataLineageFooter } from '@/components/shared/DataLineageFooter';
import {
  CASES,
  QUEUE_STATS,
  RECOMMENDATION_LABELS,
  type CaseApplication,
  type PolicyCheck,
  type SignalSummary,
  type RecommendationAction,
} from '@/data/underwritingDemoData';

// ============================================
// SUB-COMPONENTS
// ============================================

const CaseStatusStepper: React.FC<{ status: CaseStatus }> = ({ status }) => {
  const steps: CaseStatus[] = ['pending_review', 'in_review', 'conditional', 'approved'];
  const currentStep = CASE_STATUSES[status].step;
  const isDeclined = status === 'declined';

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, idx) => {
        const cfg = CASE_STATUSES[step];
        const isActive = !isDeclined && currentStep >= cfg.step;
        const isCurrent = !isDeclined && currentStep === cfg.step;
        return (
          <React.Fragment key={step}>
            {idx > 0 && (
              <div className={cn('h-0.5 w-6', isActive ? 'bg-primary' : 'bg-border')} />
            )}
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border',
                isCurrent ? cfg.bg : isActive ? 'bg-muted border-border text-muted-foreground' : 'bg-transparent border-border text-muted-foreground',
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', isCurrent ? 'bg-current' : isActive ? 'bg-muted-foreground' : 'bg-border')} />
              {cfg.label}
            </div>
          </React.Fragment>
        );
      })}
      {isDeclined && (
        <>
          <div className="h-0.5 w-6 bg-red-300" />
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-red-50 border-red-200 text-red-700">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Declined
          </div>
        </>
      )}
    </div>
  );
};

const SignalRow: React.FC<{ signal: SignalSummary }> = ({ signal }) => {
  const sCfg = SIGNAL_STATUSES[signal.status];
  const dCfg = SIGNAL_DIRECTIONS[signal.direction];
  const DirIcon = signal.direction === 'improving' ? TrendingUp : signal.direction === 'worsening' ? TrendingDown : Minus;

  return (
    <div className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg border', sCfg.bg)}>
      <div className="flex-1 min-w-0">
        <span className={cn('text-sm font-medium', sCfg.color)}>{signal.name}</span>
        <p className="text-xs text-foreground/70 truncate">{signal.detail}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', sCfg.bg, sCfg.color)}>
          {SIGNAL_STATUSES[signal.status].label}
        </span>
        <DirIcon className={cn('h-3.5 w-3.5', dCfg.color)} />
      </div>
    </div>
  );
};

const PolicyCheckRow: React.FC<{ check: PolicyCheck; isExpanded: boolean; onToggle: () => void }> = ({
  check,
  isExpanded,
  onToggle,
}) => {
  const resultCfg = {
    pass: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Pass' },
    review: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Review' },
    fail: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Fail' },
  }[check.result];
  const Icon = resultCfg.icon;

  return (
    <div>
      <button onClick={onToggle} className="w-full grid grid-cols-12 gap-3 items-center px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left">
        <div className="col-span-4 flex items-center gap-2">
          {isExpanded ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          <span className="text-sm text-foreground">{check.name}</span>
        </div>
        <div className="col-span-2">
          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium', resultCfg.bg, resultCfg.color)}>
            <Icon className="h-3 w-3" />
            {resultCfg.label}
          </span>
        </div>
        <div className="col-span-2 text-xs text-foreground">{check.value}</div>
        <div className="col-span-2 text-xs text-muted-foreground">{check.threshold}</div>
        <div className="col-span-2 text-xs text-muted-foreground">{check.source}</div>
      </button>
      {isExpanded && (
        <div className="ml-7 mr-3 mb-2 px-3 py-2 bg-muted/50 rounded-lg text-xs text-muted-foreground">
          <span className="font-medium">Value:</span> {check.value} | <span className="font-medium">Threshold:</span> {check.threshold} | <span className="font-medium">Source:</span> {check.source}
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const UnderwritingAssistant: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<CaseApplication>(CASES[0]);
  const [activeTab, setActiveTab] = useState<'signals' | 'policy' | 'benchmarks' | 'decision'>('signals');
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);
  const [rationale, setRationale] = useState('');
  const { toast } = useToast();
  const { emitBulkActionExecuted } = useAuditEmit();

  const policyPassCount = useMemo(
    () => selectedCase.policyChecks.filter((c) => c.result === 'pass').length,
    [selectedCase],
  );
  const policyTotal = selectedCase.policyChecks.length;

  const handleAction = (action: RecommendationAction) => {
    if (!rationale.trim()) return;
    toast({ title: RECOMMENDATION_LABELS[action], description: `${selectedCase.companyName} — ${selectedCase.caseId}` });
    emitBulkActionExecuted(action, [selectedCase.caseId]);
    setRationale('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Disclaimer */}
      <div className="px-4 lg:px-6 pt-4">
        <BankDisclaimer />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Underwriting Assistant</h1>
            <p className="text-sm text-muted-foreground">Case management and decision support workspace</p>
          </div>
          <div className="text-xs text-muted-foreground">
            Showing 5 of 89 applications
          </div>
        </div>

        {/* Queue Stats */}
        <div className="grid grid-cols-6 gap-3 lg:grid-cols-3 md:grid-cols-2">
          {QUEUE_STATS.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-4 border border-border text-center">
              <div className={cn('text-xl font-bold', stat.color)}>{stat.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* Case Queue — Left */}
          <div className="w-full lg:w-[320px] lg:shrink-0 bg-card rounded-xl border border-border mb-6 lg:mb-0">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Case Queue</h2>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{CASES.length} cases loaded</p>
            </div>
            <div className="p-2 space-y-1.5">
              {CASES.map((c) => {
                const isSelected = selectedCase.id === c.id;
                const statusCfg = CASE_STATUSES[c.caseStatus];
                return (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCase(c); setActiveTab('signals'); }}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-all',
                      isSelected ? 'bg-primary/5 border-2 border-primary' : 'hover:bg-muted border border-transparent',
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground font-mono">{c.caseId}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full border font-medium', statusCfg.bg, statusCfg.color)}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">{c.companyName}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{c.productType}</span>
                      <span className="text-xs text-muted-foreground">${(c.amount / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <User className="h-2.5 w-2.5" />
                        {c.assignedAnalyst}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" />
                        {c.daysInQueue}d
                      </div>
                    </div>
                    {c.tags && c.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {c.tags.map((tag) => (
                          <span key={tag} className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Case Detail — Right */}
          <div className="flex-1 space-y-4">
            {/* Case Header */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-semibold text-foreground">{selectedCase.companyName}</h3>
                    <span className="text-xs text-muted-foreground font-mono">{selectedCase.caseId}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedCase.productType} &middot; ${selectedCase.amount.toLocaleString()} &middot; {selectedCase.industry}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedCase.pdBand}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {selectedCase.assignedAnalyst}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedCase.daysInQueue}d / {selectedCase.slaTarget}d SLA
                  </div>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="mb-4">
                <CaseStatusStepper status={selectedCase.caseStatus} />
              </div>

              {/* Tabs */}
              <div className="flex gap-0.5 p-0.5 bg-muted rounded-lg w-fit">
                {[
                  { id: 'signals', label: 'Signals' },
                  { id: 'policy', label: `Policy Checks (${policyPassCount}/${policyTotal})` },
                  { id: 'benchmarks', label: 'Benchmarks' },
                  { id: 'decision', label: 'Decision Support' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                      activeTab === tab.id
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Signals Tab */}
            {activeTab === 'signals' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">Risk Indicator Signals</h3>
                    <DemoMetaBadge lastUpdated="2026-01-28T10:00:00Z" dataSources={['D&B', 'Experian', 'Banking Feed']} />
                  </div>
                  <div className="space-y-2">
                    {selectedCase.signals.map((signal) => (
                      <SignalRow key={signal.name} signal={signal} />
                    ))}
                  </div>
                </div>

                {/* Business Profile Summary */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Applicant Profile</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {[
                      { label: 'Industry', value: `${selectedCase.industry} (${selectedCase.naicsCode})` },
                      { label: 'Established', value: `${selectedCase.established} (${selectedCase.yearsInBusiness} years)` },
                      { label: 'Owner', value: `${selectedCase.ownerName} (${selectedCase.ownership}%)` },
                      { label: 'Location', value: selectedCase.address },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between py-1.5 border-b border-border">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className="text-xs font-medium text-foreground text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Policy Checks Tab */}
            {activeTab === 'policy' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-card rounded-xl border border-border">
                  <div className="flex items-center justify-between p-5 pb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-foreground">Policy & Eligibility Checks</h3>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className="text-emerald-600">{selectedCase.policyChecks.filter((c) => c.result === 'pass').length} Pass</span>
                      <span className="text-amber-600">{selectedCase.policyChecks.filter((c) => c.result === 'review').length} Review</span>
                      <span className="text-red-600">{selectedCase.policyChecks.filter((c) => c.result === 'fail').length} Fail</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-3 px-8 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wide border-b border-border">
                    <div className="col-span-4">Check</div>
                    <div className="col-span-2">Result</div>
                    <div className="col-span-2">Value</div>
                    <div className="col-span-2">Threshold</div>
                    <div className="col-span-2">Source</div>
                  </div>
                  <div className="p-3">
                    {selectedCase.policyChecks.map((check) => (
                      <PolicyCheckRow
                        key={check.id}
                        check={check}
                        isExpanded={expandedCheck === check.id}
                        onToggle={() => setExpandedCheck(expandedCheck === check.id ? null : check.id)}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Benchmarks Tab */}
            {activeTab === 'benchmarks' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">Comparative Benchmarks</h3>
                    <DemoMetaBadge lastUpdated="2026-01-28T10:00:00Z" dataSources={['Portfolio Analytics', 'Industry Benchmarks']} />
                  </div>
                  <div className="grid grid-cols-4 gap-4 px-3 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wide border-b border-border">
                    <div>Metric</div>
                    <div>This Applicant</div>
                    <div>Portfolio Peers</div>
                    <div>Industry Peers</div>
                  </div>
                  <div className="divide-y divide-border">
                    {selectedCase.benchmarks.map((bm) => (
                      <div key={bm.label} className="grid grid-cols-4 gap-4 px-3 py-3 items-center">
                        <div className="text-sm text-foreground">{bm.label}</div>
                        <div className="text-sm font-semibold text-foreground">{bm.applicantValue}</div>
                        <div className="text-sm text-muted-foreground">{bm.portfolioPeerAvg}</div>
                        <div className="text-sm text-muted-foreground">{bm.industryPeerAvg}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-[10px] text-muted-foreground">
                    Peer comparisons based on same segment, product type, and SIC code within portfolio and industry databases.
                  </div>
                </div>
              </motion.div>
            )}

            {/* Decision Support Tab */}
            {activeTab === 'decision' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Decision Support Summary</h3>

                  <div className="mb-4">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border',
                        selectedCase.riskLevel === 'low'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : selectedCase.riskLevel === 'moderate'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-red-50 border-red-200 text-red-700',
                      )}
                    >
                      {selectedCase.riskLevel === 'low' ? 'Low' : selectedCase.riskLevel === 'moderate' ? 'Moderate' : 'Elevated'} Risk Indicators
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-emerald-700 mb-2">Key Supporting Factors</h4>
                    <ul className="space-y-1.5">
                      {selectedCase.supportingFactors.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-amber-700 mb-2">Areas Requiring Attention</h4>
                    <ul className="space-y-1.5">
                      {selectedCase.areasOfAttention.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-blue-700 mb-2">Suggested Next Steps</h4>
                    <ol className="space-y-1.5 list-decimal list-inside">
                      {selectedCase.suggestedNextSteps.map((s, i) => (
                        <li key={i} className="text-xs text-foreground">{s}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border">
                    <p className="text-[10px] text-muted-foreground italic">
                      {DISCLAIMER_TEXT} This summary is for informational purposes only and does not constitute a lending decision.
                    </p>
                  </div>
                </div>

                {/* Analyst Action Panel */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Analyst Recommendation</h3>
                  <textarea
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    placeholder="Enter rationale for recommendation (required)..."
                    className="w-full h-24 px-3 py-2 text-sm bg-muted rounded-lg border border-border resize-none focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder-muted-foreground"
                  />
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <button
                      onClick={() => handleAction('recommend_approval')}
                      disabled={!rationale.trim()}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Recommend for Approval
                    </button>
                    <button
                      onClick={() => handleAction('request_info')}
                      disabled={!rationale.trim()}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Request Additional Info
                    </button>
                    <button
                      onClick={() => handleAction('flag_committee')}
                      disabled={!rationale.trim()}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Flag for Committee Review
                    </button>
                    <button
                      onClick={() => handleAction('recommend_decline')}
                      disabled={!rationale.trim()}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Recommend Decline
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    All actions are logged to the audit trail. Rationale is required for every recommendation.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Data Lineage Footer */}
        <DataLineageFooter
          meta={{
            lastUpdated: '2026-01-28T10:00:00Z',
            dataSources: ['D&B Commercial', 'Experian BizID', 'Banking Data Feed', 'UCC Filing Search', 'Compliance Engine'],
          }}
        />
      </div>
    </div>
  );
};

export default UnderwritingAssistant;
