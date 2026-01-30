import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List, Filter } from 'lucide-react';
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

// Mock pipeline applications
const MOCK_APPLICATIONS: PipelineApplication[] = [
  {
    id: '1',
    appId: 'APP-2024-001',
    companyName: 'Stellar Dynamics LLC',
    amount: 250000,
    productType: 'Business Line of Credit',
    customerSegment: 'small',
    riskTier: 'low',
    aiRecommendation: 'approve',
    confidence: 92,
    geography: 'Southwest',
    industry: 'Technology Services',
    yearsInBusiness: 7,
    compositeScore: 728,
    submittedAt: '2h ago',
    tags: [],
  },
  {
    id: '2',
    appId: 'APP-2024-002',
    companyName: 'GreenTech Innovations',
    amount: 150000,
    productType: 'Equipment Financing',
    customerSegment: 'micro',
    riskTier: 'medium',
    aiRecommendation: 'review',
    confidence: 67,
    geography: 'Pacific Northwest',
    industry: 'Environmental Services',
    yearsInBusiness: 2,
    compositeScore: 645,
    submittedAt: '4h ago',
    tags: ['High utilization'],
  },
  {
    id: '3',
    appId: 'APP-2024-003',
    companyName: 'Metro Logistics Corp',
    amount: 500000,
    productType: 'Working Capital',
    customerSegment: 'mid-market',
    riskTier: 'low',
    aiRecommendation: 'approve',
    confidence: 95,
    geography: 'Midwest',
    industry: 'Transportation',
    yearsInBusiness: 15,
    compositeScore: 785,
    submittedAt: '1h ago',
    tags: [],
  },
  {
    id: '4',
    appId: 'APP-2024-004',
    companyName: 'QuickServe Restaurants',
    amount: 75000,
    productType: 'Term Loan',
    customerSegment: 'micro',
    riskTier: 'high',
    aiRecommendation: 'decline',
    confidence: 88,
    geography: 'Mountain Region',
    industry: 'Food Services',
    yearsInBusiness: 5,
    compositeScore: 520,
    submittedAt: '6h ago',
    tags: ['Delinquency history'],
  },
  {
    id: '5',
    appId: 'APP-2024-005',
    companyName: 'Apex Construction',
    amount: 350000,
    productType: 'Equipment Financing',
    customerSegment: 'small',
    riskTier: 'low',
    aiRecommendation: 'approve',
    confidence: 89,
    geography: 'Southwest',
    industry: 'Construction',
    yearsInBusiness: 10,
    compositeScore: 695,
    submittedAt: '3h ago',
    tags: ['Seasonal revenue'],
  },
];

const UnderwritingAssistant: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedApp, setSelectedApp] = useState<PipelineApplication | null>(null);
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

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === MOCK_APPLICATIONS.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(MOCK_APPLICATIONS.map(a => a.id));
    }
  };

  const filteredApplications = MOCK_APPLICATIONS.filter(app => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Underwriting Assistant</h1>
          <p className="text-slate-500 text-sm">AI-powered bulk loan decisioning for enterprise portfolios</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700">AI Engine Active</span>
          </div>
        </div>
      </div>

      {/* Portfolio Segments */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Portfolio Segments</h2>
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
              totalApplications={MOCK_APPLICATIONS.length}
              filteredCount={filteredApplications.length}
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
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          <BulkActionsToolbar
            selectedCount={selectedIds.length}
            totalCount={filteredApplications.length}
            onSelectAll={handleSelectAll}
            onDeselectAll={() => setSelectedIds([])}
            onBulkApprove={() => console.log('Bulk approve')}
            onBulkDecline={() => console.log('Bulk decline')}
            onBulkReview={() => console.log('Bulk review')}
            onExport={() => console.log('Export')}
            onRefresh={() => console.log('Refresh')}
            onAssignReviewer={() => console.log('Assign')}
          />

          <ApplicationPipelineView
            applications={filteredApplications}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onViewDetails={setSelectedApp}
            viewMode={viewMode}
          />
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
          onApprove={() => setSelectedApp(null)}
          onDecline={() => setSelectedApp(null)}
          onRequestInfo={() => console.log('Request info')}
        />
      )}
    </div>
  );
};

export default UnderwritingAssistant;
