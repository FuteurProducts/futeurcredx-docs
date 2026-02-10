// Underwriting Assistant — Case Management Workspace
// NO composite scores, NO auto-approve, NO AI confidence %
// Bank-safe language: recommendations, not decisions

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { BankDisclaimer } from '@/components/shared/BankDisclaimer';
import { DataLineageFooter } from '@/components/shared/DataLineageFooter';
import { CaseQueueSidebar } from '@/components/enterprise/underwriting/CaseQueueSidebar';
import { CaseDetailView } from '@/components/enterprise/underwriting/CaseDetailView';
import { CASES, QUEUE_STATS, type CaseApplication } from '@/data/underwritingDemoData';

const UnderwritingAssistant: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<CaseApplication>(CASES[0]);

  const handleSelectCase = (c: CaseApplication) => {
    setSelectedCase(c);
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
            Showing {CASES.length} of 89 applications
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
          <CaseQueueSidebar
            cases={CASES}
            selectedCaseId={selectedCase.id}
            onSelectCase={handleSelectCase}
          />
          <CaseDetailView selectedCase={selectedCase} />
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
