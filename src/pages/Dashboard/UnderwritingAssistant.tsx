import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, Filter, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
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
import { usePortfolio } from '@/contexts/PortfolioContext';
import { applicationsService, customersService } from '@/services/bff';
import { adaptApplicationsToPipeline } from '@/adapters/applicationAdapter';
import { withFallback } from '@/utils/withFallback';

import { DEMO_BUSINESSES, getEnrichedBusiness } from '@/data/demoData';
import { demoDataStore } from '@/data/demoDataStore';

// Derive fallback applications from enriched demo data
function buildFallbackApplications(): PipelineApplication[] {
  const apps = demoDataStore.getApplications();
  const regionMap: Record<string, string> = { TX: 'Southwest', CA: 'West', AZ: 'West', FL: 'Southeast', IL: 'Midwest', MI: 'Midwest', WA: 'West' };

  return apps.map(app => {
    const biz = DEMO_BUSINESSES.find(b => b.id === app.businessId);
    return {
      id: app.id,
      appId: app.appId,
      companyName: app.businessName,
      amount: app.amount,
      productType: app.productType,
      customerSegment: biz?.segment || 'small',
      riskTier: app.riskTier,
      aiRecommendation: app.aiRecommendation || 'review',
      confidence: app.confidence || 75,
      geography: biz?.state ? (regionMap[biz.state] || 'National') : 'National',
      industry: biz?.industry || 'General',
      yearsInBusiness: biz?.yearsInBusiness || 5,
      compositeScore: app.compositeScore,
      submittedAt: formatRelativeTime(app.submittedAt),
      tags: app.riskTier === 'high' ? ['Score declining', 'High utilization'] :
            app.riskTier === 'medium' ? ['Seasonal revenue'] : [],
    };
  });
}

function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

const UnderwritingAssistant: React.FC = () => {
  const { portfolioId } = usePortfolio();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedApp, setSelectedApp] = useState<PipelineApplication | null>(null);
  const [applications, setApplications] = useState(() => buildFallbackApplications());
  const [applicationStatuses, setApplicationStatuses] = useState<Record<string, string>>(
    () => demoDataStore.getApplicationStatusOverrides()
  );
  const [, setIsLoadingApps] = useState(false);

  // Fetch applications from BFF
  const fetchApplications = useCallback(async () => {
    if (!portfolioId) return;
    setIsLoadingApps(true);
    try {
      const { data: response, source } = await withFallback(
        async () => {
          const [appsRes, custsRes] = await Promise.all([
            applicationsService.list(portfolioId),
            customersService.list(portfolioId, { pageSize: 100 }),
          ]);
          // Build business name map
          const nameMap: Record<string, string> = {};
          const entities = custsRes.data as unknown as Array<{ id: string; legalName?: string; business_name?: string }>;
          entities.forEach(e => { nameMap[e.id] = e.legalName || e.business_name || ''; });
          return { apps: appsRes.data, nameMap };
        },
        { apps: [], nameMap: {} },
        'Applications Pipeline'
      );
      if (source === 'live' && response.apps.length > 0) {
        const adapted = adaptApplicationsToPipeline(response.apps as any, response.nameMap);
        setApplications(adapted);
      } else if (source === 'fallback') {
        setApplications(buildFallbackApplications());
      }
    } catch {
      setApplications(buildFallbackApplications());
    } finally {
      setIsLoadingApps(false);
    }
  }, [portfolioId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);
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

  // --- Action Handlers (persist to BFF when available) ---
  const handleApprove = async (appId: string) => {
    setApplicationStatuses(prev => ({ ...prev, [appId]: 'approved' }));
    demoDataStore.updateApplicationStatus(appId, 'approved');
    toast.success('Application approved successfully');
    if (portfolioId) {
      try {
        await applicationsService.updateStatus(portfolioId, appId, 'approved', { decision: 'approved', decidedAt: new Date().toISOString() });
      } catch { /* UI already updated optimistically, demo store persists */ }
    }
  };

  const handleDecline = async (appId: string) => {
    setApplicationStatuses(prev => ({ ...prev, [appId]: 'declined' }));
    demoDataStore.updateApplicationStatus(appId, 'declined');
    toast.error('Application declined');
    if (portfolioId) {
      try {
        await applicationsService.updateStatus(portfolioId, appId, 'declined', { decision: 'declined', decidedAt: new Date().toISOString() });
      } catch { /* UI already updated optimistically, demo store persists */ }
    }
  };

  const handleRequestReview = (appId: string) => {
    setApplicationStatuses(prev => ({ ...prev, [appId]: 'under_review' }));
    toast.success('Sent for manual review');
  };

  const handleBulkApprove = () => {
    const count = selectedIds.length;
    const newStatuses: Record<string, string> = {};
    selectedIds.forEach(id => {
      newStatuses[id] = 'approved';
      demoDataStore.updateApplicationStatus(id, 'approved');
    });
    setApplicationStatuses(prev => ({ ...prev, ...newStatuses }));
    toast.success(`${count} application${count !== 1 ? 's' : ''} approved`);
    setSelectedIds([]);
  };

  const handleBulkDecline = () => {
    const count = selectedIds.length;
    const newStatuses: Record<string, string> = {};
    selectedIds.forEach(id => {
      newStatuses[id] = 'declined';
      demoDataStore.updateApplicationStatus(id, 'declined');
    });
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
    demoDataStore.clearApplicationStatus(appId);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
          {PORTFOLIO_SEGMENTS.map(segment => (
            <PortfolioSegmentCard
              key={segment.id}
              segment={segment}
              onClick={() => {
                // Filter applications by segment and show toast
                setFilters(prev => ({
                  ...prev,
                  customerSegment: [segment.id],
                }));
                toast.success(`Filtered to ${segment.name} segment`);
              }}
            />
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
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('table')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('cards')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
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
              demoDataStore.clearAllApplicationStatuses();
              setApplications(buildFallbackApplications());
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setApplicationStatuses({});
                      demoDataStore.clearAllApplicationStatuses();
                      toast.success('All actions cleared');
                    }}
                    className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Clear all
                  </Button>
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
      {selectedApp && (() => {
        // Look up enriched business for per-app AI signals (via demo app's businessId for reliability)
        const demoApp = demoDataStore.getApplications().find(a => a.id === selectedApp.id);
        const enriched = demoApp ? getEnrichedBusiness(demoApp.businessId) : undefined;
        const aiSignals = enriched?.aiSignals;

        const signals = aiSignals ? [
          { name: 'Tradelines', score: aiSignals.tradelines.score, weight: 25, status: aiSignals.tradelines.status, details: `${aiSignals.tradelines.score >= 80 ? 'Strong' : aiSignals.tradelines.score >= 60 ? 'Adequate' : 'Limited'} trade references` },
          { name: 'Payments', score: aiSignals.payments.score, weight: 30, status: aiSignals.payments.status, details: `${aiSignals.payments.score >= 80 ? '98%+ on-time' : aiSignals.payments.score >= 60 ? 'Mostly on-time' : 'Payment delays noted'}` },
          { name: 'Banking Health', score: aiSignals.bankingHealth.score, weight: 25, status: aiSignals.bankingHealth.status, details: `${aiSignals.bankingHealth.score >= 70 ? 'Stable deposits' : aiSignals.bankingHealth.score >= 50 ? 'Moderate activity' : 'Low reserves'}` },
          { name: 'Identity', score: aiSignals.identity.score, weight: 20, status: aiSignals.identity.status, details: 'KYB verified' },
        ] : [
          { name: 'Tradelines', score: 82, weight: 25, status: 'pass' as const, details: '23 active vendors' },
          { name: 'Payments', score: 91, weight: 30, status: 'pass' as const, details: '98.5% on-time' },
          { name: 'Banking Health', score: 85, weight: 25, status: 'pass' as const, details: 'Stable deposits' },
          { name: 'Identity', score: 98, weight: 20, status: 'pass' as const, details: 'KYB verified' },
        ];

        return (
          <AIDecisioningPanel
            companyName={selectedApp.companyName}
            appId={selectedApp.appId}
            amount={selectedApp.amount}
            productType={selectedApp.productType}
            compositeScore={selectedApp.compositeScore}
            grade={selectedApp.compositeScore >= 750 ? 'A' : selectedApp.compositeScore >= 700 ? 'B+' : selectedApp.compositeScore >= 650 ? 'B' : 'C'}
            aiRecommendation={selectedApp.aiRecommendation}
            confidence={selectedApp.confidence}
            signals={signals}
            positiveFactors={aiSignals?.positiveFactors || ['Strong payment history', '7+ years in business', 'Verified identity']}
            riskFactors={aiSignals?.riskFactors || (selectedApp.riskTier === 'high' ? ['Recent delinquency', 'Low cash reserves'] : [])}
            summary={aiSignals?.summary || 'AI analysis indicates strong creditworthiness based on consistent payment patterns and verified business identity.'}
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
        );
      })()}
    </div>
  );
};

export default UnderwritingAssistant;
