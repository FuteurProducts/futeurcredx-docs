import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  FileText,
  Scale,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';
import { BankDisclaimer } from '@/components/shared/BankDisclaimer';

export interface ComparativeBenchmark {
  label: string;
  applicantValue: string;
  portfolioPeerAvg: string;
  industryPeerAvg: string;
}

export interface DecisionSupportData {
  riskLevel: 'low' | 'moderate' | 'elevated';
  supportingFactors: string[];
  areasOfAttention: string[];
  suggestedNextSteps: string[];
  benchmarks: ComparativeBenchmark[];
}

export type RecommendationAction =
  | 'recommend_approval'
  | 'request_info'
  | 'flag_committee'
  | 'recommend_decline';

interface DecisionWorkspaceProps {
  data: DecisionSupportData;
  onAction: (action: RecommendationAction, rationale: string) => void;
  className?: string;
}

const riskConfig = {
  low: {
    label: 'Low Risk Indicators',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  moderate: {
    label: 'Moderate Risk Indicators',
    badgeClass: 'bg-warning/10 text-warning border-warning/30',
  },
  elevated: {
    label: 'Elevated Risk Indicators',
    badgeClass: 'bg-destructive/10 text-destructive border-destructive/30',
  },
};

const actionButtons: {
  action: RecommendationAction;
  label: string;
  icon: React.ElementType;
  borderClass: string;
  textClass: string;
  hoverClass: string;
}[] = [
  {
    action: 'recommend_approval',
    label: 'Recommend for Approval',
    icon: CheckCircle,
    borderClass: 'border-emerald-500/40',
    textClass: 'text-emerald-400',
    hoverClass: 'hover:bg-emerald-500/10 hover:border-emerald-500/60',
  },
  {
    action: 'request_info',
    label: 'Request Additional Information',
    icon: MessageSquare,
    borderClass: 'border-info/40',
    textClass: 'text-info',
    hoverClass: 'hover:bg-info/10 hover:border-info/60',
  },
  {
    action: 'flag_committee',
    label: 'Flag for Committee Review',
    icon: AlertCircle,
    borderClass: 'border-warning/40',
    textClass: 'text-warning',
    hoverClass: 'hover:bg-warning/10 hover:border-warning/60',
  },
  {
    action: 'recommend_decline',
    label: 'Recommend Decline',
    icon: AlertCircle,
    borderClass: 'border-destructive/40',
    textClass: 'text-destructive',
    hoverClass: 'hover:bg-destructive/10 hover:border-destructive/60',
  },
];

export function DecisionWorkspace({ data, onAction, className }: DecisionWorkspaceProps) {
  const [rationale, setRationale] = useState('');

  const handleAction = (action: RecommendationAction) => {
    if (!rationale.trim()) return;
    onAction(action, rationale.trim());
    setRationale('');
  };

  const risk = riskConfig[data.riskLevel];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Section 1: Comparative Benchmarks */}
      <section className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Comparative Benchmarks</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground pb-2 pr-4">
                  Metric
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground pb-2 pr-4">
                  This Applicant
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground pb-2 pr-4">
                  Portfolio Peers
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground pb-2">
                  Industry Peers
                </th>
              </tr>
            </thead>
            <tbody>
              {data.benchmarks.map((benchmark, idx) => {
                const applicantNum = parseFloat(benchmark.applicantValue);
                const portfolioNum = parseFloat(benchmark.portfolioPeerAvg);
                const industryNum = parseFloat(benchmark.industryPeerAvg);

                const vsPeer =
                  !isNaN(applicantNum) && !isNaN(portfolioNum)
                    ? applicantNum >= portfolioNum
                      ? 'text-emerald-400'
                      : 'text-destructive'
                    : 'text-foreground';

                const vsIndustry =
                  !isNaN(applicantNum) && !isNaN(industryNum)
                    ? applicantNum >= industryNum
                      ? 'text-emerald-400'
                      : 'text-destructive'
                    : 'text-foreground';

                // Use the worse comparison for the applicant cell color
                const applicantColor =
                  vsPeer === 'text-destructive' || vsIndustry === 'text-destructive'
                    ? 'text-destructive'
                    : vsPeer === 'text-emerald-400' || vsIndustry === 'text-emerald-400'
                      ? 'text-emerald-400'
                      : 'text-foreground';

                return (
                  <tr
                    key={idx}
                    className={cn(
                      'border-b border-border/50 last:border-0',
                    )}
                  >
                    <td className="py-2 pr-4 text-sm text-foreground">{benchmark.label}</td>
                    <td className={cn('py-2 pr-4 text-sm font-medium', applicantColor)}>
                      {benchmark.applicantValue}
                    </td>
                    <td className="py-2 pr-4 text-sm text-muted-foreground">
                      {benchmark.portfolioPeerAvg}
                    </td>
                    <td className="py-2 text-sm text-muted-foreground">
                      {benchmark.industryPeerAvg}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Decision Support Summary */}
      <section className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Decision Support Summary</h3>
        </div>

        <div className="mb-4">
          <span
            className={cn(
              'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium',
              risk.badgeClass,
            )}
          >
            {risk.label}
          </span>
        </div>

        {data.supportingFactors.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Key Supporting Factors:
            </h4>
            <ul className="space-y-1">
              {data.supportingFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                  <TrendingUp className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.areasOfAttention.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Areas Requiring Attention:
            </h4>
            <ul className="space-y-1">
              {data.areasOfAttention.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.suggestedNextSteps.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Suggested Next Steps:
            </h4>
            <ol className="space-y-1">
              {data.suggestedNextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-xs font-medium text-muted-foreground mt-0.5 shrink-0 w-4 text-right">
                    {idx + 1}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        <p className="text-xs text-muted-foreground italic border-t border-border pt-3">
          This summary is for informational purposes only and does not constitute a lending decision.
        </p>

        <div className="mt-3">
          <BankDisclaimer />
        </div>
      </section>

      {/* Section 3: Analyst Action Panel */}
      <section className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Analyst Recommendation</h3>
        </div>

        <div className="mb-4">
          <textarea
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder="Enter rationale for recommendation..."
            rows={4}
            className={cn(
              'w-full rounded-lg border border-border bg-background px-3 py-2',
              'text-sm text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent',
              'resize-y',
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {actionButtons.map(({ action, label, icon: Icon, borderClass, textClass, hoverClass }) => (
            <button
              key={action}
              disabled={!rationale.trim()}
              onClick={() => handleAction(action)}
              className={cn(
                'flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5',
                'text-sm font-medium transition-colors',
                'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent',
                borderClass,
                textClass,
                hoverClass,
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DecisionWorkspace;
