import React, { useState } from 'react';
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

// Mock data for the enterprise customer system
const mockCustomers: CustomerEntity[] = [
  {
    id: '1',
    businessName: 'Apex Construction LLC',
    industry: 'Construction',
    naicsCode: '236220',
    segment: 'small',
    region: 'Northeast',
    branch: 'NYC Downtown',
    rhs: 88,
    rhsChange: 12,
    primaryProduct: 'LOC',
    riskTier: 'low',
    relationshipStage: 'growing',
    lastActivity: '2024-01-15',
    assignedRM: 'Sarah Chen',
    totalExposure: 485000,
    depositBalance: 485000,
    productCount: 4,
  },
  {
    id: '2',
    businessName: 'Metro Logistics Inc',
    industry: 'Transportation',
    naicsCode: '484110',
    segment: 'mid-market',
    region: 'Midwest',
    branch: 'Chicago Central',
    rhs: 72,
    rhsChange: 0,
    primaryProduct: 'Equipment Loan',
    riskTier: 'medium',
    relationshipStage: 'mature',
    lastActivity: '2024-01-12',
    assignedRM: 'Michael Ross',
    totalExposure: 1250000,
    depositBalance: 1250000,
    productCount: 6,
  },
  {
    id: '3',
    businessName: 'Sunrise Medical Group',
    industry: 'Healthcare',
    naicsCode: '621111',
    segment: 'small',
    region: 'West',
    branch: 'LA Westside',
    rhs: 45,
    rhsChange: -8,
    primaryProduct: 'Credit Card',
    riskTier: 'high',
    relationshipStage: 'at-risk',
    lastActivity: '2024-01-08',
    assignedRM: 'Jennifer Liu',
    totalExposure: 125000,
    depositBalance: 125000,
    productCount: 2,
  },
  {
    id: '4',
    businessName: 'TechStart Solutions',
    industry: 'Technology',
    naicsCode: '541511',
    segment: 'micro',
    region: 'West',
    branch: 'SF Financial',
    rhs: 91,
    rhsChange: 15,
    primaryProduct: 'Checking',
    riskTier: 'low',
    relationshipStage: 'new',
    lastActivity: '2024-01-18',
    assignedRM: 'David Park',
    totalExposure: 78000,
    depositBalance: 78000,
    productCount: 3,
  },
  {
    id: '5',
    businessName: 'Green Valley Farms',
    industry: 'Agriculture',
    naicsCode: '111000',
    segment: 'small',
    region: 'Midwest',
    branch: 'Des Moines',
    rhs: 67,
    rhsChange: 2,
    primaryProduct: 'SBA Loan',
    riskTier: 'medium',
    relationshipStage: 'mature',
    lastActivity: '2024-01-10',
    assignedRM: 'Robert Miller',
    totalExposure: 340000,
    depositBalance: 340000,
    productCount: 5,
  },
  {
    id: '6',
    businessName: 'Coastal Hospitality Group',
    industry: 'Hospitality',
    naicsCode: '721110',
    segment: 'mid-market',
    region: 'Southeast',
    branch: 'Miami Beach',
    rhs: 79,
    rhsChange: 6,
    primaryProduct: 'CRE Loan',
    riskTier: 'low',
    relationshipStage: 'growing',
    lastActivity: '2024-01-16',
    assignedRM: 'Maria Santos',
    totalExposure: 2100000,
    depositBalance: 2100000,
    productCount: 7,
  },
  {
    id: '7',
    businessName: 'Urban Retail Partners',
    industry: 'Retail',
    naicsCode: '445110',
    segment: 'small',
    region: 'Northeast',
    branch: 'Boston Downtown',
    rhs: 54,
    rhsChange: -5,
    primaryProduct: 'Merchant Services',
    riskTier: 'high',
    relationshipStage: 'at-risk',
    lastActivity: '2024-01-05',
    assignedRM: 'Thomas Wright',
    totalExposure: 95000,
    depositBalance: 95000,
    productCount: 3,
  },
  {
    id: '8',
    businessName: 'Pacific Manufacturing Co',
    industry: 'Manufacturing',
    naicsCode: '332710',
    segment: 'mid-market',
    region: 'West',
    branch: 'Seattle Industrial',
    rhs: 83,
    rhsChange: 7,
    primaryProduct: 'Equipment Loan',
    riskTier: 'low',
    relationshipStage: 'mature',
    lastActivity: '2024-01-17',
    assignedRM: 'Lisa Chang',
    totalExposure: 1850000,
    depositBalance: 1850000,
    productCount: 8,
  },
];

const mockHealthSummary = {
  avgRHS: 74,
  rhsTrend: 2.3,
  growingPercentage: 28,
  growingTrend: 4.1,
  atRiskPercentage: 12,
  atRiskTrend: -1.8,
  crossSellPenetration: 42,
  crossSellTrend: 3.2,
  topOpportunities: [
    { id: '1', businessName: 'Apex Construction LLC', opportunity: 'LOC Expansion', estimatedValue: 2400000 },
    { id: '2', businessName: 'Metro Logistics Inc', opportunity: 'Merchant Services', estimatedValue: 890000 },
    { id: '3', businessName: 'Pacific Manufacturing Co', opportunity: 'Equipment Refinancing', estimatedValue: 1100000 },
  ],
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
  { id: 'prospect' as const, label: 'Prospect', count: 342, avgRHS: 0, avgRevenue: 0, avgProductCount: 0, trend: 5.2 },
  { id: 'new' as const, label: 'New', count: 186, avgRHS: 68, avgRevenue: 45000, avgProductCount: 1.8, trend: 12.4 },
  { id: 'growing' as const, label: 'Growing', count: 524, avgRHS: 82, avgRevenue: 125000, avgProductCount: 3.2, trend: 8.1 },
  { id: 'mature' as const, label: 'Mature', count: 1247, avgRHS: 76, avgRevenue: 285000, avgProductCount: 4.8, trend: 2.3 },
  { id: 'at-risk' as const, label: 'At Risk', count: 89, avgRHS: 48, avgRevenue: 95000, avgProductCount: 2.1, trend: -15.2 },
];

const mockRecommendations = [
  {
    id: '1',
    type: 'loc-increase' as const,
    title: 'Increase Line of Credit by 60%',
    description: 'Based on strong cash flow and low utilization, recommend increasing LOC from $75K to $120K.',
    rationale: [
      'Cash flow stability improved 23% YoY',
      'Current LOC utilization at 28% (well below 50% threshold)',
      'Deposit balance grew 15% last quarter',
    ],
    confidenceScore: 92,
    riskAdjustedConfidence: 87,
    estimatedRevenueImpact: 45000,
    priority: 'high' as const,
    expiresIn: '5 days',
  },
  {
    id: '2',
    type: 'pre-qualify' as const,
    title: 'Pre-qualify for Equipment Loan',
    description: 'Customer profile matches equipment financing criteria for construction industry.',
    rationale: [
      'Industry sector showing strong growth',
      'Credit score in top quartile',
      'No existing equipment financing',
    ],
    confidenceScore: 85,
    riskAdjustedConfidence: 78,
    estimatedRevenueImpact: 28000,
    priority: 'medium' as const,
  },
  {
    id: '3',
    type: 'merchant-migration' as const,
    title: 'Propose Merchant Services Migration',
    description: 'Currently using third-party processor. Strong candidate for migration.',
    rationale: [
      'Monthly transaction volume of $125K',
      'Can reduce fees by 0.15%',
      'Already has checking relationship',
    ],
    confidenceScore: 79,
    riskAdjustedConfidence: 72,
    estimatedRevenueImpact: 18000,
    priority: 'medium' as const,
  },
];

const Customer: React.FC = () => {
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

  const selectedCustomer = mockCustomers.find(c => c.id === selectedCustomerId);

  const handleFiltersChange = (newFilters: CustomerFilters) => {
    setFilters(newFilters);
  };

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mockCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockCustomers.map(c => c.id));
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

  const handleAssignTask = (_recommendation: any, _assignee: string) => {
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
  const filteredCustomers = mockCustomers.filter((c) => {
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

  const totalClients = mockLifecycleStages.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <div className="space-y-6">
      {/* Global Controls - Always Visible */}
      <CustomerGlobalControls filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Lifecycle Pipeline */}
      <LifecyclePipeline 
        stages={mockLifecycleStages} 
        onStageClick={handleStageClick}
        totalClients={totalClients}
      />

      {/* Relationship Health Summary */}
      <RelationshipHealthSummary data={mockHealthSummary} onDrilldown={handleDrilldown} />

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
                <div className="text-4xl mb-3">👈</div>
                <p className="font-medium">Select a customer</p>
                <p className="text-sm">View engagement details and product footprint</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Next Best Actions */}
        <div className="col-span-12 xl:col-span-3">
          {selectedCustomer ? (
            <NextBestActions 
              recommendations={mockRecommendations}
              onAssignTask={handleAssignTask}
              onDismiss={handleDismissRecommendation}
            />
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center text-muted-foreground">
                <div className="text-4xl mb-3">🎯</div>
                <p className="font-medium">AI Recommendations</p>
                <p className="text-sm">Select a customer to see actions</p>
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
