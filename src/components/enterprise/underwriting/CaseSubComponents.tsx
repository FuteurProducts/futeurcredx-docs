// Underwriting case sub-components: CaseStatusStepper, SignalRow, PolicyCheckRow
// Extracted from UnderwritingAssistant.tsx for reuse

import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CASE_STATUSES,
  SIGNAL_STATUSES,
  SIGNAL_DIRECTIONS,
  type CaseStatus,
} from '@/constants/bankTerminology';
import type { SignalSummary, PolicyCheck } from '@/data/underwritingDemoData';

export const CaseStatusStepper: React.FC<{ status: CaseStatus }> = ({ status }) => {
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
          <div className="h-0.5 w-6 bg-destructive/30" />
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-destructive/5 border-destructive/20 text-destructive">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
            Declined
          </div>
        </>
      )}
    </div>
  );
};

export const SignalRow: React.FC<{ signal: SignalSummary }> = ({ signal }) => {
  const sCfg = SIGNAL_STATUSES[signal.status];
  const dCfg = SIGNAL_DIRECTIONS[signal.direction];
  const DirIcon = signal.direction === 'improving' ? TrendingUp : signal.direction === 'worsening' ? TrendingDown : Minus;

  return (
    <div className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg border', sCfg.bg)}>
      <div className="flex-1 min-w-0">
        <span className={cn('text-sm font-medium', sCfg.color)}>{signal.name}</span>
        <p className="text-xs text-foreground truncate">{signal.detail}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', sCfg.bg, sCfg.color)}>
          {SIGNAL_STATUSES[signal.status].label}
        </span>
        <DirIcon className={cn('h-4 w-4', dCfg.color)} />
      </div>
    </div>
  );
};

export const PolicyCheckRow: React.FC<{ check: PolicyCheck; isExpanded: boolean; onToggle: () => void }> = ({
  check,
  isExpanded,
  onToggle,
}) => {
  const resultCfg = {
    pass: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Pass' },
    review: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/5', label: 'Review' },
    fail: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/5', label: 'Fail' },
  }[check.result];
  const Icon = resultCfg.icon;

  return (
    <div>
      <button onClick={onToggle} className="w-full grid grid-cols-12 gap-3 items-center px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left">
        <div className="col-span-4 flex items-center gap-2">
          {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          <span className="text-sm text-foreground">{check.name}</span>
        </div>
        <div className="col-span-2">
          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium', resultCfg.bg, resultCfg.color)}>
            <Icon className="h-4 w-4" />
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
