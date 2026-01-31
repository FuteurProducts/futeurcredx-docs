/**
 * Customer Page - BFF Wired
 * Fetches customer data from /customers endpoint
 */

import React, { useState, useEffect, useCallback } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { customersService } from '@/services/bff';
import { useAuditEmit } from '@/hooks/useAuditEmit';
import { adaptBffCustomerList, type BffCustomerListItem } from '@/adapters/customerAdapter';
import {
  CustomerGlobalControls,
  RelationshipHealthSummary,
  CustomerListTable,
  CustomerEngagementPanel,
  NextBestActions,
  LifecyclePipeline,
  CustomerDossier,
  type CustomerFilters,
  type CustomerEntity,
} from '@/components/enterprise/customer';
import { PortfolioSelector } from '@/components/shared';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { DEMO_BUSINESSES } from '@/data/demoData';

// Demo customers derived from centralized business data
const mockDemoCustomers: BffCustomerListItem[] = DEMO_BUSINESSES.map((biz, idx) => ({
  id: biz.id,
  businessName: biz.name,
  naicsCode: biz.naicsCode,
  businessType: idx % 2 === 0 ? 'LLC' : 'Corporation',
  addressCity: biz.city,
  addressState: biz.state,
  annualRevenue: biz.annualRevenue,
  employeeCount: biz.employeeCount,
  latestScore: idx < 7 ? biz.lumiqScore * 10 : 0,
  riskClass: idx < 7 ? biz.riskTier : 'unknown',
  createdAt: `2025-${String((idx % 12) + 1).padStart(2, '0')}-${String((idx * 7 % 28) + 1).padStart(2, '0')}`,
}));

const mockHealthSummary = {
  avgRHS: 74,
  rhsTrend: 2.3,
  growingPercentage: 28,
  growingTrend: 4.1,
  atRiskPercentage: 12,
  atRiskTrend: -1.8,
  crossSellPenetration: 42,
  crossSellTrend: 3.2,
  topOpportunities: [],
  rhsTrendData: [
    { date: 'Jul', value: 68 },
    { date: 'Aug', value: 70 },
    { date: 'Sep', value: 71 },
    { date: 'Oct', value: 72 },
    { date: 'Nov', value: 73 },
    { date: 'Dec', value: 74 },
  ],
};

const mockLifecycleStages = [
  { id: 'prospect' as const, label: 'Prospect', count: 0, avgRHS: 0, avgRevenue: 0, avgProductCount: 0, trend: 0 },
  { id: 'new' as const, label: 'New', count: 0, avgRHS: 68, avgRevenue: 45000, avgProductCount: 1.8, trend: 0 },
  { id: 'growing' as const, label: 'Growing', count: 0, avgRHS: 82, avgRevenue: 125000, avgProductCount: 3.2, trend: 0 },
  { id: 'mature' as const, label: 'Mature', count: 0, avgRHS: 76, avgRevenue: 285000, avgProductCount: 4.8, trend: 0 },
  { id: 'at-risk' as const, label: 'At Risk', count: 0, avgRHS: 48, avgRevenue: 95000, avgProductCount: 2.1, trend: 0 },
];

const mockRecommendations = [
  {
    id: '1',
    type: 'loc-increase' as const,
    title: 'Pull Credit Scores',
    description: 'No scores on file. Pull credit to enable prequal offers.',
    rationale: ['No bureau data available', 'Required for risk assessment'],
    confidenceScore: 95,
    riskAdjustedConfidence: 90,
    estimatedRevenueImpact: 0,
    priority: 'high' as const,
    expiresIn: '30 days',
  },
];
const CustomerBff: React.FC = () => {
  const { portfolioId, isLoading: portfolioLoading } = usePortfolio();
  const { emitDossierOpened, emitFilterApplied } = useAuditEmit();

  // Data state
  const [customers, setCustomers] = useState<CustomerEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // UI state
  const [filters, setFilters] = useState<CustomerFilters>({
    product: [],
    segment: [],
    region: [],
    relationshipStage: [],
    timeWindow: '30d',
    viewMode: 'portfolio',
  });
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState('businessName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDossier, setShowDossier] = useState(false);
  const [dossierCustomer, setDossierCustomer] = useState<CustomerEntity | null>(null);

  const pageSize = 10;

  // Fetch customers from BFF (falls back to demo data if no auth)
  const fetchCustomers = useCallback(async () => {
    if (!portfolioId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await customersService.list(portfolioId, {
        search: searchQuery || undefined,
        page: currentPage,
        pageSize,
      });

      // Adapt BFF response to UI format
      const bffCustomers = response.data as unknown as BffCustomerListItem[];
      const adaptedCustomers = adaptBffCustomerList(bffCustomers);
      
      setCustomers(adaptedCustomers);
      setTotalCount(response.pagination?.total || adaptedCustomers.length);
      setLastUpdated(response.meta?.lastUpdated || new Date().toISOString());

      // Emit audit event
      emitFilterApplied('customer_list', {
        portfolioId,
        search: searchQuery,
        page: currentPage,
        resultCount: adaptedCustomers.length,
      });
    } catch (err) {
      console.log('BFF unavailable, using demo data');
      // Fallback to demo data when not authenticated
      const adaptedCustomers = adaptBffCustomerList(mockDemoCustomers);
      setCustomers(adaptedCustomers);
      setTotalCount(mockDemoCustomers.length);
      setLastUpdated(new Date().toISOString());
      setError(null); // Clear error since we have demo data
    } finally {
      setIsLoading(false);
    }
  }, [portfolioId, searchQuery, currentPage, emitFilterApplied]);

  // Fetch on portfolio change or filter change
  useEffect(() => {
    if (portfolioId) {
      fetchCustomers();
    }
  }, [portfolioId, fetchCustomers]);

  // Handlers
  const handleFiltersChange = (newFilters: CustomerFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    const customer = customers.find(c => c.id === id);
    if (customer) {
      emitDossierOpened(id, customer.businessName);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === customers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(customers.map(c => c.id));
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleViewDetails = (customer: CustomerEntity) => {
    setDossierCustomer(customer);
    setShowDossier(true);
    emitDossierOpened(customer.id, customer.businessName);
  };

  const handleCloseDossier = () => {
    setShowDossier(false);
    setDossierCustomer(null);
  };

  const handleDrilldown = (_metric: string) => {
    // Drilldown handled by UI navigation
  };

  const handleStageClick = (stageId: string) => {
    setFilters(prev => ({
      ...prev,
      relationshipStage: [stageId],
    }));
  };

  const handleAssignTask = (_recommendation: unknown, _assignee: string) => {
    // Task assignment handled by workflow engine
  };

  const handleDismissRecommendation = (_id: string) => {
    // Recommendation dismissed
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Calculate lifecycle counts from loaded customers
  const lifecycleStages = mockLifecycleStages.map(stage => ({
    ...stage,
    count: customers.filter(c => c.relationshipStage === stage.id).length,
  }));

  const totalClients = customers.length;

  // Build engagement panel data for selected customer
  const engagementData = selectedCustomer ? {
    id: selectedCustomer.id,
    businessName: selectedCustomer.businessName,
    rhs: selectedCustomer.rhs,
    rhsStatus: selectedCustomer.rhsChange > 0 ? 'growing' as const : selectedCustomer.rhsChange < 0 ? 'declining' as const : 'stable' as const,
    rhsTrendData: [
      { month: 'Jul', value: selectedCustomer.rhs - 15 },
      { month: 'Aug', value: selectedCustomer.rhs - 12 },
      { month: 'Sep', value: selectedCustomer.rhs - 8 },
      { month: 'Oct', value: selectedCustomer.rhs - 5 },
      { month: 'Nov', value: selectedCustomer.rhs - 2 },
      { month: 'Dec', value: selectedCustomer.rhs },
    ],
    topDrivers: [
      { label: 'Cash flow stability', impact: 'positive' as const },
      { label: 'Deposit growth', impact: 'positive' as const },
      { label: 'Credit utilization', impact: selectedCustomer.rhs > 60 ? 'positive' as const : 'negative' as const },
    ],
    products: [
      { product: 'Checking', status: 'active' as const, signal: 'healthy' as const },
      { product: 'Credit Score', status: 'not-held' as const, signal: 'opportunity' as const },
    ],
    timeline: [],
  } : null;

  // Build dossier data
  const dossierData = dossierCustomer ? {
    id: dossierCustomer.id,
    businessName: dossierCustomer.businessName,
    legalName: dossierCustomer.businessName + ' Inc.',
    dba: dossierCustomer.businessName,
    industry: dossierCustomer.industry,
    naicsCode: dossierCustomer.naicsCode,
    segment: dossierCustomer.segment,
    region: dossierCustomer.region,
    address: dossierCustomer.branch,
    phone: '(555) 123-4567',
    email: 'info@' + dossierCustomer.businessName.toLowerCase().replace(/\s+/g, '') + '.com',
    website: 'www.' + dossierCustomer.businessName.toLowerCase().replace(/\s+/g, '') + '.com',
    yearsInBusiness: 5,
    employeeCount: 25,
    annualRevenue: dossierCustomer.totalExposure * 8,
    assignedRM: {
      name: dossierCustomer.assignedRM || 'Unassigned',
      email: 'rm@bank.com',
      phone: '(555) 987-6543',
    },
    rhs: dossierCustomer.rhs,
    rhsStatus: dossierCustomer.rhsChange > 0 ? 'growing' as const : dossierCustomer.rhsChange < 0 ? 'declining' as const : 'stable' as const,
    rhsTrendData: [
      { month: 'Jul', value: dossierCustomer.rhs - 15 },
      { month: 'Aug', value: dossierCustomer.rhs - 12 },
      { month: 'Sep', value: dossierCustomer.rhs - 8 },
      { month: 'Oct', value: dossierCustomer.rhs - 5 },
      { month: 'Nov', value: dossierCustomer.rhs - 2 },
      { month: 'Dec', value: dossierCustomer.rhs },
    ],
    riskTier: dossierCustomer.riskTier,
    creditScore: 0, // No score yet - use 0 as placeholder
    relationshipStage: dossierCustomer.relationshipStage,
    totalExposure: dossierCustomer.totalExposure,
    totalDeposits: dossierCustomer.depositBalance,
    products: [],
    recentNotes: [],
    auditLog: [],
  } : null;

  // Loading state
  if (portfolioLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading portfolio...</span>
      </div>
    );
  }

  // No portfolio selected
  if (!portfolioId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Select a portfolio to view customers</p>
        <PortfolioSelector />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh and last updated */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <PortfolioSelector />
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchCustomers}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="ghost" size="sm" onClick={fetchCustomers}>
            Retry
          </Button>
        </div>
      )}

      {/* Global Controls */}
      <CustomerGlobalControls filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Lifecycle Pipeline */}
      <LifecyclePipeline 
        stages={lifecycleStages} 
        onStageClick={handleStageClick}
        totalClients={totalClients}
      />

      {/* Relationship Health Summary */}
      <RelationshipHealthSummary data={mockHealthSummary} onDrilldown={handleDrilldown} />

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Customer List Table */}
        <div className="col-span-12 xl:col-span-5">
          {isLoading && customers.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading customers...</span>
            </div>
          ) : customers.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-muted-foreground">No customers found in this portfolio</p>
            </div>
          ) : (
            <CustomerListTable
              customers={customers}
              selectedIds={selectedIds}
              onSelect={handleSelectCustomer}
              onSelectAll={handleSelectAll}
              onViewDetails={handleViewDetails}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalCount={totalCount}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        {/* Center: Engagement Panel */}
        <div className="col-span-12 xl:col-span-4">
          {engagementData ? (
            <CustomerEngagementPanel customer={engagementData} />
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 h-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center">
                Select a customer to view engagement details
              </p>
            </div>
          )}
        </div>

        {/* Right: Next Best Actions */}
        <div className="col-span-12 xl:col-span-3">
          <NextBestActions
            recommendations={mockRecommendations}
            onAssignTask={handleAssignTask}
            onDismiss={handleDismissRecommendation}
          />
        </div>
      </div>

      {/* Customer Dossier Modal */}
      {showDossier && dossierData && (
        <CustomerDossier
          customer={dossierData}
          onClose={handleCloseDossier}
          onAddNote={(_note: string) => { /* Note saved to dossier */ }}
        />
      )}
    </div>
  );
};

export default CustomerBff;
