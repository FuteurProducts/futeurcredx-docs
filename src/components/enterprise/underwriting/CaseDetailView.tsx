// Underwriting case detail view — header, tabs, and all tab content panels
// Extracted from UnderwritingAssistant.tsx

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  User,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuditEmit } from '@/hooks/useAuditEmit';
import { DISCLAIMER_TEXT } from '@/constants/bankTerminology';
import { DemoMetaBadge } from '@/components/shared/DemoMetaBadge';
import {
  RECOMMENDATION_LABELS,
  type CaseApplication,
  type RecommendationAction,
} from '@/data/underwritingDemoData';
import { CaseStatusStepper, SignalRow, PolicyCheckRow } from './CaseSubComponents';

type TabId = 'signals' | 'policy' | 'benchmarks' | 'decision';

interface CaseDetailViewProps {
  selectedCase: CaseApplication;
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({ selectedCase }) => {
  const [activeTab, setActiveTab] = useState<TabId>('signals');
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
          {([
            { id: 'signals' as const, label: 'Signals' },
            { id: 'policy' as const, label: `Policy Checks (${policyPassCount}/${policyTotal})` },
            { id: 'benchmarks' as const, label: 'Benchmarks' },
            { id: 'decision' as const, label: 'Decision Support' },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
  );
};
