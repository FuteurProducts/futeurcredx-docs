import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, Filter, CheckCircle2, XCircle, AlertTriangle, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  ApplicationQueueFilters,
  FilterState,
  BulkActionsToolbar,
  ApplicationPipelineView,
  PipelineApplication,
  AIDecisioningPanel,
  PortfolioSegmentCard,
  PORTFOLIO_SEGMENTS,
  UnderwritingMetricsCard,
  DEFAULT_UNDERWRITING_METRICS,
  DAILY_STATS_METRICS,
} from '@/components/enterprise/underwriting';

import { DEMO_BUSINESSES } from '@/data/demoData';

// Pipeline applications derived from centralized business data
const MOCK_APPLICATIONS: PipelineApplication[] = [
  {
    id: '1',
    appId: 'APP-2025-001',
    companyName: DEMO_BUSINESSES[0].name,
    amount: DEMO_BUSINESSES[0].applicationAmount || 250000,
    productType: DEMO_BUSINESSES[0].productType || 'Business Line of Credit',
    customerSegment: DEMO_BUSINESSES[0].segment,
    riskTier: DEMO_BUSINESSES[0].riskTier,
    aiRecommendation: 'approve',
    confidence: 92,
    geography: 'Southwest',
    industry: DEMO_BUSINESSES[0].industry,
    yearsInBusiness: DEMO_BUSINESSES[0].yearsInBusiness,
    compositeScore: DEMO_BUSINESSES[0].lumiqScore * 10,
    submittedAt: '2h ago',
    tags: [],
  },
  {
    id: '2',
    appId: 'APP-2025-002',
    companyName: DEMO_BUSINESSES[4].name,
    amount: DEMO_BUSINESSES[4].applicationAmount || 75000,
    productType: DEMO_BUSINESSES[4].productType || 'Term Loan',
    customerSegment: DEMO_BUSINESSES[4].segment,
    riskTier: DEMO_BUSINESSES[4].riskTier,
    aiRecommendation: 'review',
    confidence: 67,
    geography: 'West',
    industry: DEMO_BUSINESSES[4].industry,
    yearsInBusiness: DEMO_BUSINESSES[4].yearsInBusiness,
    compositeScore: DEMO_BUSINESSES[4].lumiqScore * 10,
    submittedAt: '4h ago',
    tags: ['Seasonal revenue'],
  },
  {
    id: '3',
    appId: 'APP-2025-003',
    companyName: DEMO_BUSINESSES[1].name,
    amount: DEMO_BUSINESSES[1].applicationAmount || 500000,
    productType: DEMO_BUSINESSES[1].productType || 'Working Capital',
    customerSegment: DEMO_BUSINESSES[1].segment,
    riskTier: 'low',
    aiRecommendation: 'approve',
    confidence: 95,
    geography: 'South',
    industry: DEMO_BUSINESSES[1].industry,
    yearsInBusiness: DEMO_BUSINESSES[1].yearsInBusiness,
    compositeScore: DEMO_BUSINESSES[1].lumiqScore * 10 + 75,
    submittedAt: '1h ago',
    tags: [],
  },
  {
    id: '4',
    appId: 'APP-2025-004',
    companyName: DEMO_BUSINESSES[5].name,
    amount: 120000,
    productType: 'Business Line of Credit',
    customerSegment: DEMO_BUSINESSES[5].segment,
    riskTier: DEMO_BUSINESSES[5].riskTier,
    aiRecommendation: 'decline',
    confidence: 88,
    geography: 'Southeast',
    industry: DEMO_BUSINESSES[5].industry,
    yearsInBusiness: DEMO_BUSINESSES[5].yearsInBusiness,
    compositeScore: DEMO_BUSINESSES[5].lumiqScore * 10,
    submittedAt: '6h ago',
    tags: ['Score declining', 'High utilization'],
  },
  {
    id: '5',
    appId: 'APP-2025-005',
    companyName: DEMO_BUSINESSES[2].name,
    amount: DEMO_BUSINESSES[2].applicationAmount || 350000,
    productType: DEMO_BUSINESSES[2].productType || 'Equipment Financing',
    customerSegment: DEMO_BUSINESSES[2].segment,
    riskTier: DEMO_BUSINESSES[2].riskTier,
    aiRecommendation: 'approve',
    confidence: 89,
    geography: 'Southwest',
    industry: DEMO_BUSINESSES[2].industry,
    yearsInBusiness: DEMO_BUSINESSES[2].yearsInBusiness,
    compositeScore: DEMO_BUSINESSES[2].lumiqScore * 10 + 10,
    submittedAt: '3h ago',
    tags: [],
  },
];

const UnderwritingAssistant: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedApp, setSelectedApp] = useState<PipelineApplication | null>(null);
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [applicationStatuses, setApplicationStatuses] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    productType: [],
    geography: [],
    customerSegment: [],
    relationshipStage: [],
    riskTier: [],
    amountRange: [0, 10000000],
    searchQuery: '',
  });

  // --- Action Handlers ---
  const handleApprove = (appId: string) => {
    setApplicationStatuses(prev => ({ ...prev, [appId]: 'approved' }));
    toast.success('Application approved successfully');
  };

  const handleDecline = (appId: string) => {
    setApplicationStatuses(prev => ({ ...prev, [appId]: 'declined' }));
    toast.error('Application declined');
  };

  const handleRequestReview = (appId: string) => {
    setApplicationStatuses(prev => ({ ...prev, [appId]: 'under_review' }));
    toast.success('Sent for manual review');
  };

  const handleBulkApprove = () => {
    const count = selectedIds.length;
    const newStatuses: Record<string, string> = {};
    selectedIds.forEach(id => { newStatuses[id] = 'approved'; });
    setApplicationStatuses(prev => ({ ...prev, ...newStatuses }));
    toast.success(`${count} application${count !== 1 ? 's' : ''} approved`);
    setSelectedIds([]);
  };

  const handleBulkDecline = () => {
    const count = selectedIds.length;
    const newStatuses: Record<string, string> = {};
    selectedIds.forEach(id => { newStatuses[id] = 'declined'; });
    setApplicationStatuses(prev => ({ ...prev, ...newStatuses }));
    toast.error(`${count} application${count !== 1 ? 's' : ''} declined`);
    setSelectedIds([]);
  };

  const handleBulkReview = () => {
    const count = selectedIds.length;
    const newStatuses: Record<string, string> = {};
    selectedIds.forEach(id => { newStatuses[id] = 'under_review'; });
    setApplicationStatuses(prev => ({ ...prev, ...newStatuses }));
    toast.success(`${count} application${count !== 1 ? 's' : ''} sent for manual review`);
    setSelectedIds([]);
  };

  const handleUndoAction = (appId: string) => {
    setApplicationStatuses(prev => {
      const next = { ...prev };
      delete next[appId];
      return next;
    });
    toast.success('Action undone');
  };

  // --- Counts for stats ---
  const statusCounts = useMemo(() => {
    const counts = { approved: 0, declined: 0, under_review: 0 };
    Object.values(applicationStatuses).forEach(status => {
      if (status === 'approved') counts.approved++;
      else if (status === 'declined') counts.declined++;
      else if (status === 'under_review') counts.under_review++;
    });
    return counts;
  }, [applicationStatuses]);

  const handleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === pendingApplications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingApplications.map(a => a.id));
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filters.searchQuery && !app.companyName.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.productType.length && !filters.productType.includes(app.productType)) {
      return false;
    }
    if (filters.geography.length && !filters.geography.includes(app.geography)) {
      return false;
    }
    if (filters.customerSegment.length && !filters.customerSegment.includes(app.customerSegment)) {
      return false;
    }
    if (filters.riskTier.length && !filters.riskTier.includes(app.riskTier)) {
      return false;
    }
    return true;
  });

  // Split into pending vs. actioned
  const pendingApplications = filteredApplications.filter(
    app => !applicationStatuses[app.id] || applicationStatuses[app.id] === 'under_review'
  );
  const actionedApplications = filteredApplications.filter(
    app => applicationStatuses[app.id] === 'approved' || applicationStatuses[app.id] === 'declined'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display">Underwriting Assistant</h1>
          <p className="text-body text-muted-foreground mt-1">AI-powered bulk loan decisioning for enterprise portfolios</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-foreground">AI Engine Active</span>
          </div>
        </div>
      </div>

      {/* Portfolio Segments */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Portfolio Segments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PORTFOLIO_SEGMENTS.map(segment => (
            <PortfolioSegmentCard key={segment.id} segment={segment} />
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UnderwritingMetricsCard metrics={DEFAULT_UNDERWRITING_METRICS} title="AI Performance" />
        <UnderwritingMetricsCard metrics={DAILY_STATS_METRICS} title="Today's Activity" />
      </div>

      {/* Main Content - Responsive flex layout */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Filters Sidebar - Hidden on mobile, collapsible on desktop */}
        {showFilters && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="w-full lg:w-[280px] shrink-0"
          >
            <ApplicationQueueFilters
              filters={filters}
              onFiltersChange={setFilters}
              totalApplications={applications.length}
              filteredCount={pendingApplications.length}
            />
          </motion.div>
        )}

        {/* Pipeline - Takes remaining space, auto-adjusts with sidebar */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-border text-muted-foreground hover:bg-accent'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-muted' : 'hover:bg-accent'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-muted' : 'hover:bg-accent'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          <BulkActionsToolbar
            selectedCount={selectedIds.length}
            totalCount={pendingApplications.length}
            onSelectAll={handleSelectAll}
            onDeselectAll={() => setSelectedIds([])}
            onBulkApprove={handleBulkApprove}
            onBulkDecline={handleBulkDecline}
            onBulkReview={handleBulkReview}
            approvedCount={statusCounts.approved}
            declinedCount={statusCounts.declined}
            reviewCount={statusCounts.under_review}
            onExport={() => {
              const csv = filteredApplications.map(a => `${a.appId},${a.companyName},${a.amount},${a.productType},${a.aiRecommendation},${applicationStatuses[a.id] || 'pending'}`).join('\n');
              const blob = new Blob([`App ID,Company,Amount,Product,AI Recommendation,Status\n${csv}`], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement('a');
              anchor.href = url;
              anchor.download = 'underwriting-pipeline.csv';
              anchor.click();
              URL.revokeObjectURL(url);
              toast.success('Pipeline data downloaded as CSV');
            }}
            onRefresh={() => {
              setApplications(MOCK_APPLICATIONS);
              setApplicationStatuses({});
              setSelectedIds([]);
              toast.success('Application pipeline reloaded');
            }}
            onAssignReviewer={() => {
              toast.success(`${selectedIds.length} application${selectedIds.length !== 1 ? 's' : ''} assigned to senior underwriter`);
            }}
          />

          <ApplicationPipelineView
            applications={pendingApplications}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onViewDetails={setSelectedApp}
            viewMode={viewMode}
            applicationStatuses={applicationStatuses}
          />

          {/* Recently Actioned Section */}
          <AnimatePresence>
            {actionedApplications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Recently Actioned ({actionedApplications.length})
                  </h3>
                  <button
                    onClick={() => {
                      setApplicationStatuses({});
                      toast.success('All actions cleared');
                    }}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Clear all
                  </button>
                </div>
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="divide-y divide-border">
                    {actionedApplications.map((app) => {
                      const status = applicationStatuses[app.id];
                      return (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 0.7, x: 0 }}
                          className="flex items-center justify-between px-4 py-3 hover:opacity-100 transition-opacity"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              status === 'approved' ? 'bg-success/10' : 'bg-destructive/10'
                            }`}>
                              {status === 'approved' ? (
                                <CheckCircle2 className="w-4 h-4 text-success" />
                              ) : (
                                <XCircle className="w-4 h-4 text-destructive" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{app.companyName}</p>
                              <p className="text-xs text-muted-foreground">{app.appId} -- {app.productType}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              status === 'approved'
                                ? 'bg-success/15 text-success'
                                : 'bg-destructive/15 text-destructive'
                            }`}>
                              {status === 'approved' ? 'Approved' : 'Declined'}
                            </span>
                            <button
                              onClick={() => handleUndoAction(app.id)}
                              className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                            >
                              Undo
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedApp && (
        <AIDecisioningPanel
          companyName={selectedApp.companyName}
          appId={selectedApp.appId}
          amount={selectedApp.amount}
          productType={selectedApp.productType}
          compositeScore={selectedApp.compositeScore}
          grade={selectedApp.compositeScore >= 750 ? 'A' : selectedApp.compositeScore >= 700 ? 'B+' : selectedApp.compositeScore >= 650 ? 'B' : 'C'}
          aiRecommendation={selectedApp.aiRecommendation}
          confidence={selectedApp.confidence}
          signals={[
            { name: 'Tradelines', score: 82, weight: 25, status: 'pass', details: '23 active vendors' },
            { name: 'Payments', score: 91, weight: 30, status: 'pass', details: '98.5% on-time' },
            { name: 'Banking Health', score: 85, weight: 25, status: 'pass', details: 'Stable deposits' },
            { name: 'Identity', score: 98, weight: 20, status: 'pass', details: 'KYB verified' },
          ]}
          positiveFactors={['Strong payment history', '7+ years in business', 'Verified identity']}
          riskFactors={selectedApp.riskTier === 'high' ? ['Recent delinquency', 'Low cash reserves'] : []}
          summary="AI analysis indicates strong creditworthiness based on consistent payment patterns and verified business identity."
          onApprove={() => {
            handleApprove(selectedApp.id);
            setSelectedApp(null);
          }}
          onDecline={() => {
            handleDecline(selectedApp.id);
            setSelectedApp(null);
          }}
          onRequestInfo={() => {
            handleRequestReview(selectedApp.id);
          }}
        />
      )}
    </div>
  );
};

export default UnderwritingAssistant;
