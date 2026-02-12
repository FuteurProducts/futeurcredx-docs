import React, { useState } from 'react';

import { useEnvironment } from '@/contexts/EnvironmentContext';
import {
  CustomerGlobalControls,
  RelationshipHealthSummary,
  CustomerListTable,
  CustomerEngagementPanel,
  NextBestActions,
  PeerBenchmarking,
  LifecyclePipeline,
  CustomerDossier,
  type CustomerFilters,
  type CustomerEntity,
} from '@/components/enterprise/customer';
import { SandboxEmptyState } from '@/components/shared/SandboxEmptyState';
import {
  MOCK_CUSTOMERS,
  MOCK_HEALTH_SUMMARY,
  MOCK_LIFECYCLE_STAGES,
  MOCK_RECOMMENDATIONS,
} from '@/data/customerPageDemoData';

const Customer: React.FC = () => {
  const { isDemoMode } = useEnvironment();

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
  const [sortField, setSortField] = useState('rhs');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDossier, setShowDossier] = useState(false);
  const [dossierCustomer, setDossierCustomer] = useState<CustomerEntity | null>(null);

  const selectedCustomer = MOCK_CUSTOMERS.find(c => c.id === selectedCustomerId);

  const handleFiltersChange = (newFilters: CustomerFilters) => {
    setFilters(newFilters);
  };

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === MOCK_CUSTOMERS.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(MOCK_CUSTOMERS.map(c => c.id));
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
  };

  const handleCloseDossier = () => {
    setShowDossier(false);
    setDossierCustomer(null);
  };

  const handleDrilldown = (_metric: string) => {
    // Placeholder for future drilldown navigation
  };

  const handleStageClick = (stageId: string) => {
    setFilters(prev => ({
      ...prev,
      relationshipStage: [stageId],
    }));
  };

  const handleAssignTask = (_recommendation: unknown, _assignee: string) => {
    // Placeholder for future task assignment
  };

  const handleDismissRecommendation = (_id: string) => {
    // Placeholder for future recommendation dismissal
  };

  const handleViewPeerList = () => {
    // Placeholder for future peer list view
  };

  const handleAddNote = (_note: string) => {
    // Placeholder for future note addition
  };

  // Filter customers based on current filters
  const filteredCustomers = MOCK_CUSTOMERS.filter((c) => {
    if (filters.segment.length > 0 && !filters.segment.includes(c.segment)) return false;
    if (filters.relationshipStage.length > 0 && !filters.relationshipStage.includes(c.relationshipStage)) return false;
    if (filters.region.length > 0 && !filters.region.some(r => c.region.toLowerCase().includes(r.toLowerCase()))) return false;
    if (searchQuery && !c.businessName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

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
      { product: 'Savings', status: 'active' as const, signal: 'growing' as const },
      { product: 'LOC', status: 'approved' as const, signal: 'underutilized' as const, utilization: 28 },
      { product: 'Credit Card', status: 'active' as const, signal: 'high-spend' as const },
      { product: 'Merchant Services', status: 'not-held' as const, signal: 'opportunity' as const },
      { product: 'SBA Loan', status: 'not-held' as const, signal: 'opportunity' as const },
    ],
    timeline: [
      { id: '1', type: 'login' as const, title: 'Online Banking Login', description: 'Web login from NYC', timestamp: '2024-01-15T10:30:00Z', impact: 'neutral' as const },
      { id: '2', type: 'payment' as const, title: 'Payment Received', description: 'Invoice #4521 paid', timestamp: '2024-01-14T14:22:00Z', impact: 'positive' as const },
      { id: '3', type: 'credit-change' as const, title: 'Credit Score Update', description: 'Score increased +12 pts', timestamp: '2024-01-12T09:00:00Z', impact: 'positive' as const },
      { id: '4', type: 'touchpoint' as const, title: 'RM Call', description: 'Quarterly review discussion', timestamp: '2024-01-10T15:00:00Z', impact: 'positive' as const },
    ],
  } : null;

  // Build peer benchmarking data
  const peerData = selectedCustomer ? {
    currentBusiness: {
      id: selectedCustomer.id,
      name: selectedCustomer.businessName,
      industry: selectedCustomer.industry,
      naicsCode: selectedCustomer.naicsCode,
      revenueBand: '$1M - $5M',
      region: selectedCustomer.region,
    },
    peerGroup: {
      count: 847,
      industryMatch: 312,
      revenueBandMatch: 489,
      regionMatch: 156,
    },
    metrics: [
      { category: 'rhs', yourValue: selectedCustomer.rhs, peerAvg: 68, peerMedian: 72, percentile: 78 },
      { category: 'depositBalance', yourValue: selectedCustomer.depositBalance, peerAvg: 380000, peerMedian: 285000, percentile: 65 },
      { category: 'productCount', yourValue: selectedCustomer.productCount, peerAvg: 3.2, peerMedian: 3, percentile: 82 },
      { category: 'creditScore', yourValue: 720, peerAvg: 685, peerMedian: 695, percentile: 71 },
    ],
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
    address: '123 Business Ave, ' + dossierCustomer.branch,
    phone: '(555) 123-4567',
    email: 'info@' + dossierCustomer.businessName.toLowerCase().replace(/\s+/g, '') + '.com',
    website: 'www.' + dossierCustomer.businessName.toLowerCase().replace(/\s+/g, '') + '.com',
    yearsInBusiness: 12,
    employeeCount: 45,
    annualRevenue: dossierCustomer.totalExposure * 8,
    assignedRM: {
      name: dossierCustomer.assignedRM || 'Unassigned',
      email: (dossierCustomer.assignedRM || 'rm').toLowerCase().replace(/\s+/g, '.') + '@partnerbank.com',
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
    creditScore: 720,
    relationshipStage: dossierCustomer.relationshipStage,
    totalExposure: dossierCustomer.totalExposure,
    totalDeposits: dossierCustomer.depositBalance,
    products: [
      { name: 'Checking', status: 'active' as const, balance: 125000 },
      { name: 'Savings', status: 'active' as const, balance: 85000 },
      { name: 'LOC', status: 'approved' as const, balance: 75000, utilization: 28 },
      { name: 'Credit Card', status: 'active' as const, balance: 12000, utilization: 45 },
    ],
    recentNotes: [
      { id: '1', author: 'Sarah Chen', content: 'Discussed Q1 expansion plans. Interested in equipment financing.', timestamp: '2024-01-15T10:30:00Z' },
      { id: '2', author: 'Michael Ross', content: 'Credit review completed. Recommended for LOC increase.', timestamp: '2024-01-10T14:00:00Z' },
    ],
    auditLog: [
      { id: '1', action: 'Profile viewed', user: 'Sarah Chen', timestamp: '2024-01-15T10:30:00Z' },
      { id: '2', action: 'Credit report pulled', user: 'System', timestamp: '2024-01-12T09:00:00Z' },
      { id: '3', action: 'RM assigned', user: 'Admin', timestamp: '2024-01-05T11:00:00Z' },
    ],
  } : null;

  const totalClients = MOCK_LIFECYCLE_STAGES.reduce((sum, stage) => sum + stage.count, 0);

  // Non-demo mode: no BFF integration yet, show empty state
  if (!isDemoMode) {
    return (
      <div className="p-6">
        <SandboxEmptyState
          title="No Customer Data"
          description="Customer intelligence will populate once your API integration is active and customer data flows in."
          showApiConsoleLink
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Controls - Always Visible */}
      <CustomerGlobalControls filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Lifecycle Pipeline */}
      <LifecyclePipeline
        stages={MOCK_LIFECYCLE_STAGES}
        onStageClick={handleStageClick}
        totalClients={totalClients}
      />

      {/* Relationship Health Summary */}
      <RelationshipHealthSummary data={MOCK_HEALTH_SUMMARY} onDrilldown={handleDrilldown} />

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Customer List Table */}
        <div className="col-span-12 xl:col-span-5">
          <CustomerListTable
            customers={filteredCustomers}
            selectedIds={selectedIds}
            onSelect={handleSelectCustomer}
            onSelectAll={handleSelectAll}
            onViewDetails={handleViewDetails}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={filteredCustomers.length}
            currentPage={currentPage}
            pageSize={10}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Center: Engagement & Value Panel */}
        <div className="col-span-12 xl:col-span-4">
          {engagementData ? (
            <CustomerEngagementPanel customer={engagementData} />
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center text-muted-foreground">
                <div className="text-4xl mb-3">&#x1F448;</div>
                <p className="font-medium">Select a business</p>
                <p className="text-sm">View engagement details and product footprint</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Next Best Actions */}
        <div className="col-span-12 xl:col-span-3">
          {selectedCustomer ? (
            <NextBestActions
              recommendations={MOCK_RECOMMENDATIONS}
              onAssignTask={handleAssignTask}
              onDismiss={handleDismissRecommendation}
            />
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center text-muted-foreground">
                <div className="text-4xl mb-3">&#x1F3AF;</div>
                <p className="font-medium">AI Recommendations</p>
                <p className="text-sm">Select a business to see actions</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Peer Benchmarking - Shows when customer selected */}
      {peerData && (
        <PeerBenchmarking
          currentBusiness={peerData.currentBusiness}
          peerGroup={peerData.peerGroup}
          metrics={peerData.metrics}
          onViewPeerList={handleViewPeerList}
        />
      )}

      {/* Customer Dossier Modal */}
      {showDossier && dossierData && (
        <CustomerDossier
          customer={dossierData}
          onClose={handleCloseDossier}
          onAddNote={handleAddNote}
        />
      )}
    </div>
  );
};

export default Customer;
