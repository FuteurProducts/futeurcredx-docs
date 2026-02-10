// Underwriting case queue sidebar
// Displays the list of cases with status badges, analyst info, and tags

import { FileText, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CASE_STATUSES } from '@/constants/bankTerminology';
import type { CaseApplication } from '@/data/underwritingDemoData';

interface CaseQueueSidebarProps {
  cases: CaseApplication[];
  selectedCaseId: string;
  onSelectCase: (c: CaseApplication) => void;
}

export const CaseQueueSidebar: React.FC<CaseQueueSidebarProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
}) => (
  <div className="w-full lg:w-[320px] lg:shrink-0 bg-card rounded-xl border border-border mb-6 lg:mb-0">
    <div className="p-4 border-b border-border">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">Case Queue</h2>
      </div>
      <p className="text-[10px] text-muted-foreground mt-0.5">{cases.length} cases loaded</p>
    </div>
    <div className="p-2 space-y-1.5">
      {cases.map((c) => {
        const isSelected = selectedCaseId === c.id;
        const statusCfg = CASE_STATUSES[c.caseStatus];
        return (
          <button
            key={c.id}
            onClick={() => onSelectCase(c)}
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
);
