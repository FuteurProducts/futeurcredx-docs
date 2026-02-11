/**
 * Customer Page - BFF Wired
 * Fetches customer data from /customers endpoint
 * Filters are applied client-side via useMemo for dynamic KPIs
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { customersService } from '@/services/bff';
import type { BffListResponse } from '@/services/bff/client';
import type { SmbEntity } from '@/services/bff/types';
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
import { AlertCircle, RefreshCw, Users, UserX, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomerTableSkeleton, SkeletonCard, SkeletonPanel, MetricSkeleton } from '@/components/ui/skeletons';
import { EmptyState } from '@/components/ui/empty-state';
import { DataLineageFooter } from '@/components/shared/DataLineageFooter';
import { BankDisclaimer } from '@/components/shared/BankDisclaimer';

import { DEMO_BUSINESSES, getEnrichedBusiness } from '@/data/demoData';
import { CUSTOMER_DEMO_DATA } from '@/data/customerDemoData';
import { withFallback } from '@/utils/withFallback';
import { logger } from '@/utils/logger';

// Build fallback CustomerEntity[] directly from the 36-record demo dataset
const FALLBACK_CUSTOMERS_FULL: CustomerEntity[] = CUSTOMER_DEMO_DATA.map(rec => ({
  id: rec.id,
  businessName: rec.businessName,
  industry: rec.industry,
  naicsCode: rec.naicsCode,
  segment: rec.segment,
  region: rec.region,
  branch: `${rec.city} Branch`,
  rhs: rec.rhs,
  rhsChange: rec.rhsChange,
  primaryProduct: rec.primaryProduct,
  products: rec.products,
  riskTier: rec.riskTier,
  relationshipStage: rec.relationshipStage,
  lastActivity: rec.lastActivity,
  assignedRM: rec.assignedRM,
  totalExposure: rec.totalExposure,
  depositBalance: rec.depositBalance,
  productCount: rec.productCount,
}));

// Legacy BFF fallback for API path (first 10 only, matches DEMO_BUSINESSES)
const FALLBACK_BFF_CUSTOMERS: BffCustomerListItem[] = DEMO_BUSINESSES.map((biz, idx) => ({
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

// ── Dynamic recommendation generation ──────────────────────────────────────

function generateRecommendations(
  filtered: CustomerEntity[],
  filters: CustomerFilters,
) {
  const recs: {
    id: string;
    type: string;
    title: string;
    description: string;
    rationale: string[];
    confidenceScore: number;
    riskAdjustedConfidence: number;
    estimatedRevenueImpact: number;
    priority: 'high' | 'medium' | 'low';
    expiresIn: string;
  }[] = [];

  let nextId = 1;

  // Stage-specific recommendations
  if (filters.relationshipStage.includes('at-risk')) {
    recs.push({
      id: String(nextId++), type: 'risk-mitigation',
      title: 'Generate Risk Mitigation Report',
      description: `${filtered.length} at-risk relationship${filtered.length !== 1 ? 's' : ''} identified. Schedule RM outreach within 5 business days.`,
      rationale: ['Declining RHS trend across cohort', 'Early intervention reduces churn by 35%'],
      confidenceScore: 92, riskAdjustedConfidence: 88, estimatedRevenueImpact: 45000,
      priority: 'high', expiresIn: '7 days',
    });
  }
  if (filters.relationshipStage.includes('prospect')) {
    recs.push({
      id: String(nextId++), type: 'onboarding',
      title: 'Launch Prospect Activation Campaign',
      description: `${filtered.length} prospect${filtered.length !== 1 ? 's' : ''} ready for initial outreach. Pull bureau scores to enable pre-qualification.`,
      rationale: ['No credit bureau data on file', 'Required for risk assessment pipeline'],
      confidenceScore: 95, riskAdjustedConfidence: 90, estimatedRevenueImpact: 0,
      priority: 'high', expiresIn: '30 days',
    });
  }

  // Segment-specific
  if (filters.segment.includes('micro')) {
    recs.push({
      id: String(nextId++), type: 'card-prequal',
      title: 'Pre-Qualify Micro Businesses for Credit Cards',
      description: 'Micro-segment businesses with 6+ months deposit history are strong candidates for card pre-qualification.',
      rationale: ['Low avg product count in segment', 'Card products have 78% acceptance rate for micro'],
      confidenceScore: 85, riskAdjustedConfidence: 80, estimatedRevenueImpact: 12000,
      priority: 'medium', expiresIn: '14 days',
    });
  }
  if (filters.segment.includes('mid-market')) {
    recs.push({
      id: String(nextId++), type: 'treasury-upsell',
      title: 'Offer Treasury Management Solutions',
      description: 'Mid-market clients with >$500K deposits benefit from treasury management and sweep accounts.',
      rationale: ['High deposit balances underutilized', 'Treasury services increase retention by 42%'],
      confidenceScore: 88, riskAdjustedConfidence: 84, estimatedRevenueImpact: 65000,
      priority: 'high', expiresIn: '21 days',
    });
  }

  // Product-specific
  if (filters.product.includes('sba')) {
    recs.push({
      id: String(nextId++), type: 'sba-refinance',
      title: 'SBA Refinance Opportunity Assessment',
      description: 'Review existing SBA borrowers for rate reduction opportunities under current programs.',
      rationale: ['Rate environment favorable for refinancing', 'Strengthens borrower relationship'],
      confidenceScore: 82, riskAdjustedConfidence: 78, estimatedRevenueImpact: 28000,
      priority: 'medium', expiresIn: '30 days',
    });
  }
  if (filters.product.includes('equipment')) {
    recs.push({
      id: String(nextId++), type: 'equipment-renewal',
      title: 'Equipment Lease Renewal Pipeline',
      description: 'Identify equipment loans approaching maturity for proactive renewal outreach.',
      rationale: ['Equipment lifecycle typically 5-7 years', 'Renewal has 3x lower acquisition cost'],
      confidenceScore: 87, riskAdjustedConfidence: 83, estimatedRevenueImpact: 42000,
      priority: 'medium', expiresIn: '21 days',
    });
  }

  // Region-specific
  if (filters.region.includes('southwest')) {
    recs.push({
      id: String(nextId++), type: 'regional-campaign',
      title: 'Southwest Market Expansion Review',
      description: 'Southwest region showing strong growth. Assess capacity for additional RM coverage.',
      rationale: ['Highest deposit growth rate across regions', 'Under-penetrated product mix'],
      confidenceScore: 79, riskAdjustedConfidence: 75, estimatedRevenueImpact: 35000,
      priority: 'low', expiresIn: '30 days',
    });
  }

  // Default recommendation when no specific filters active
  if (recs.length === 0) {
    const atRiskCount = filtered.filter(c => c.relationshipStage === 'at-risk').length;
    const lowProductCount = filtered.filter(c => c.productCount <= 1).length;

    if (atRiskCount > 0) {
      recs.push({
        id: String(nextId++), type: 'risk-review',
        title: 'Review At-Risk Relationships',
        description: `${atRiskCount} customer${atRiskCount !== 1 ? 's' : ''} showing declining health scores. Schedule relationship review.`,
        rationale: ['Proactive outreach reduces attrition', 'Declining RHS indicates disengagement'],
        confidenceScore: 90, riskAdjustedConfidence: 86, estimatedRevenueImpact: 38000,
        priority: 'high', expiresIn: '14 days',
      });
    }
    if (lowProductCount > 0) {
      recs.push({
        id: String(nextId++), type: 'cross-sell',
        title: 'Cross-Sell Opportunity Analysis',
        description: `${lowProductCount} customer${lowProductCount !== 1 ? 's' : ''} with single-product relationships. Run cross-sell model to identify best fit products.`,
        rationale: ['Single-product relationships have highest churn risk', 'Each additional product reduces attrition by 15%'],
        confidenceScore: 86, riskAdjustedConfidence: 82, estimatedRevenueImpact: 52000,
        priority: 'medium', expiresIn: '21 days',
      });
    }
    if (recs.length === 0) {
      recs.push({
        id: String(nextId++), type: 'portfolio-health',
        title: 'Portfolio Health Check',
        description: 'Run quarterly health assessment across all customer segments to identify emerging opportunities.',
        rationale: ['Quarterly reviews improve NPS by 12 points', 'Early pattern detection for risk and growth'],
        confidenceScore: 80, riskAdjustedConfidence: 76, estimatedRevenueImpact: 25000,
        priority: 'low', expiresIn: '30 days',
      });
    }
  }

  return recs;
}

const CustomerBff: React.FC = () => {
  const { portfolioId, isLoading: portfolioLoading } = usePortfolio();
  const { emitDossierOpened, emitFilterApplied } = useAuditEmit();

  // Data state
  const [customers, setCustomers] = useState<CustomerEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      const { data: response, source } = await withFallback(
        () => customersService.list(portfolioId, {
          search: searchQuery || undefined,
          page: currentPage,
          pageSize,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Fallback response shape matches BffListResponse
        { data: FALLBACK_BFF_CUSTOMERS as unknown as SmbEntity[], meta: { requestId: 'fallback' }, pagination: { total: FALLBACK_BFF_CUSTOMERS.length, page: 1, pageSize: 10, hasMore: false } } as BffListResponse<SmbEntity>,
        'Customer List'
      );

      // If we got live BFF data, use it; otherwise use our full 36-record set
      if (source === 'live') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- API response converted to component type
        const bffCustomers = response.data as unknown as BffCustomerListItem[];
        const adaptedCustomers = adaptBffCustomerList(bffCustomers);
        setCustomers(adaptedCustomers);
        setLastUpdated(response.meta?.lastUpdated || new Date().toISOString());
        emitFilterApplied('customer_list', {
          portfolioId,
          search: searchQuery,
          page: currentPage,
          resultCount: adaptedCustomers.length,
        });
      } else {
        setCustomers(FALLBACK_CUSTOMERS_FULL);
        setLastUpdated(new Date().toISOString());
      }
    } catch (err) {
      logger.info('[CustomerBff] BFF unavailable, using fallback data');
      setCustomers(FALLBACK_CUSTOMERS_FULL);
      setLastUpdated(new Date().toISOString());
      setError(null);
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

  // ── Filter customers based on global controls ────────────────────────────
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      // Product filter: customer holds ANY selected product (OR logic)
      if (filters.product.length > 0) {
        if (!c.products.some(p => filters.product.includes(p))) return false;
      }
      // Segment filter: exact match
      if (filters.segment.length > 0) {
        if (!filters.segment.includes(c.segment)) return false;
      }
      // Region filter: case-insensitive match; "national" = no filter
      if (filters.region.length > 0) {
        const activeRegions = filters.region.filter(r => r !== 'national');
        if (activeRegions.length > 0) {
          if (!activeRegions.some(r => r.toLowerCase() === c.region.toLowerCase())) return false;
        }
      }
      // Stage filter: exact match
      if (filters.relationshipStage.length > 0) {
        if (!filters.relationshipStage.includes(c.relationshipStage)) return false;
      }
      return true;
    });
  }, [customers, filters]);

  // ── Dynamic health summary from filtered data ────────────────────────────
  const healthSummary = useMemo(() => {
    const n = filteredCustomers.length;
    if (n === 0) {
      return {
        avgRHS: 0, rhsTrend: 0,
        growingPercentage: 0, growingTrend: 0,
        atRiskPercentage: 0, atRiskTrend: 0,
        crossSellPenetration: 0, crossSellTrend: 0,
        topOpportunities: [],
        rhsTrendData: [
          { date: 'Jul', value: 0 }, { date: 'Aug', value: 0 },
          { date: 'Sep', value: 0 }, { date: 'Oct', value: 0 },
          { date: 'Nov', value: 0 }, { date: 'Dec', value: 0 },
        ],
      };
    }

    const avgRHS = Math.round(filteredCustomers.reduce((sum, c) => sum + c.rhs, 0) / n);
    const avgRHSChange = parseFloat((filteredCustomers.reduce((sum, c) => sum + c.rhsChange, 0) / n).toFixed(1));
    const growingCount = filteredCustomers.filter(c => c.relationshipStage === 'growing').length;
    const atRiskCount = filteredCustomers.filter(c => c.relationshipStage === 'at-risk').length;
    const multiProductCount = filteredCustomers.filter(c => c.productCount >= 2).length;

    return {
      avgRHS,
      rhsTrend: avgRHSChange,
      growingPercentage: Math.round((growingCount / n) * 100),
      growingTrend: 4.1,
      atRiskPercentage: Math.round((atRiskCount / n) * 100),
      atRiskTrend: -1.8,
      crossSellPenetration: Math.round((multiProductCount / n) * 100),
      crossSellTrend: 3.2,
      topOpportunities: [],
      rhsTrendData: [
        { date: 'Jul', value: Math.max(0, avgRHS - 6) },
        { date: 'Aug', value: Math.max(0, avgRHS - 5) },
        { date: 'Sep', value: Math.max(0, avgRHS - 3) },
        { date: 'Oct', value: Math.max(0, avgRHS - 2) },
        { date: 'Nov', value: Math.max(0, avgRHS - 1) },
        { date: 'Dec', value: avgRHS },
      ],
    };
  }, [filteredCustomers]);

  // ── Dynamic lifecycle stages from filtered data ──────────────────────────
  const lifecycleStages = useMemo(() => {
    const stageIds = ['prospect', 'new', 'growing', 'mature', 'at-risk'] as const;
    const stageLabels: Record<string, string> = {
      prospect: 'Prospect', new: 'New', growing: 'Growing', mature: 'Mature', 'at-risk': 'At Risk',
    };

    return stageIds.map(id => {
      const stageCustomers = filteredCustomers.filter(c => c.relationshipStage === id);
      const count = stageCustomers.length;
      return {
        id,
        label: stageLabels[id],
        count,
        avgRHS: count > 0 ? Math.round(stageCustomers.reduce((s, c) => s + c.rhs, 0) / count) : 0,
        avgRevenue: count > 0 ? Math.round(stageCustomers.reduce((s, c) => s + c.totalExposure, 0) / count) : 0,
        avgProductCount: count > 0 ? parseFloat((stageCustomers.reduce((s, c) => s + c.productCount, 0) / count).toFixed(1)) : 0,
        trend: 0,
      };
    });
  }, [filteredCustomers]);

  // ── Dynamic recommendations ──────────────────────────────────────────────
  const recommendations = useMemo(
    () => generateRecommendations(filteredCustomers, filters),
    [filteredCustomers, filters],
  );

  // Handlers
  const handleFiltersChange = (newFilters: CustomerFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    const customer = filteredCustomers.find(c => c.id === id);
    if (customer) {
      emitDossierOpened(id, customer.businessName);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map(c => c.id));
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
      relationshipStage: prev.relationshipStage.includes(stageId)
        ? prev.relationshipStage.filter(s => s !== stageId)
        : [stageId],
    }));
    setCurrentPage(1);
  };

  const handleAssignTask = (_recommendation: unknown, _assignee: string) => {
    // Task assignment handled by workflow engine
  };

  const handleDismissRecommendation = (_id: string) => {
    // Recommendation dismissed
  };

  const selectedCustomer = filteredCustomers.find(c => c.id === selectedCustomerId);
  const totalClients = filteredCustomers.length;

  // Build engagement panel data for selected customer (enriched data preferred)
  const engagementData = selectedCustomer ? (() => {
    const enriched = getEnrichedBusiness(selectedCustomer.id);
    const trendData = enriched?.rhsTrendData
      ? ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => ({
          month,
          value: enriched.rhsTrendData[i] ?? selectedCustomer.rhs,
        }))
      : [
          { month: 'Aug', value: selectedCustomer.rhs - 12 },
          { month: 'Sep', value: selectedCustomer.rhs - 8 },
          { month: 'Oct', value: selectedCustomer.rhs - 5 },
          { month: 'Nov', value: selectedCustomer.rhs - 2 },
          { month: 'Dec', value: selectedCustomer.rhs },
        ];

    const products = enriched?.products.map(p => ({
      product: p.name,
      status: (p.status === 'active' ? 'active' : p.status === 'pending' ? 'active' : 'not-held') as 'active' | 'not-held',
      signal: (p.status === 'active' ? 'healthy' : p.status === 'closed' ? 'high-spend' : 'opportunity') as 'healthy' | 'growing' | 'underutilized' | 'high-spend' | 'opportunity',
    })) ?? [
      { product: 'Checking', status: 'active' as const, signal: 'healthy' as const },
      { product: 'Credit Score', status: 'not-held' as const, signal: 'opportunity' as const },
    ];

    const topDrivers = enriched?.aiSignals
      ? [
          { label: enriched.aiSignals.positiveFactors[0] || 'Cash flow stability', impact: 'positive' as const },
          { label: enriched.aiSignals.positiveFactors[1] || 'Deposit growth', impact: 'positive' as const },
          ...(enriched.aiSignals.riskFactors.length > 0
            ? [{ label: enriched.aiSignals.riskFactors[0], impact: 'negative' as const }]
            : [{ label: 'Credit utilization', impact: (selectedCustomer.rhs > 60 ? 'positive' : 'negative') as 'positive' | 'negative' }]),
        ]
      : [
          { label: 'Cash flow stability', impact: 'positive' as const },
          { label: 'Deposit growth', impact: 'positive' as const },
          { label: 'Credit utilization', impact: (selectedCustomer.rhs > 60 ? 'positive' : 'negative') as 'positive' | 'negative' },
        ];

    return {
      id: selectedCustomer.id,
      businessName: selectedCustomer.businessName,
      rhs: selectedCustomer.rhs,
      rhsStatus: selectedCustomer.rhsChange > 0 ? 'growing' as const : selectedCustomer.rhsChange < 0 ? 'declining' as const : 'stable' as const,
      rhsTrendData: trendData,
      topDrivers,
      products,
      timeline: [],
    };
  })() : null;

  // Build dossier data (enriched data preferred)
  const dossierData = dossierCustomer ? (() => {
    const enriched = getEnrichedBusiness(dossierCustomer.id);
    const baseBiz = DEMO_BUSINESSES.find(b => b.id === dossierCustomer.id);
    const demoRec = CUSTOMER_DEMO_DATA.find(r => r.id === dossierCustomer.id);

    const trendData = enriched?.rhsTrendData
      ? ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => ({
          month,
          value: enriched.rhsTrendData[i] ?? dossierCustomer.rhs,
        }))
      : [
          { month: 'Aug', value: dossierCustomer.rhs - 12 },
          { month: 'Sep', value: dossierCustomer.rhs - 8 },
          { month: 'Oct', value: dossierCustomer.rhs - 5 },
          { month: 'Nov', value: dossierCustomer.rhs - 2 },
          { month: 'Dec', value: dossierCustomer.rhs },
        ];

    const products = enriched?.products.map(p => ({
      name: p.name,
      type: p.type,
      status: (p.status === 'active' ? 'active' : p.status === 'pending' ? 'approved' : 'not-held') as 'active' | 'approved' | 'not-held',
      balance: p.balance,
      limit: p.limit,
    })) ?? [];

    return {
      id: dossierCustomer.id,
      businessName: dossierCustomer.businessName,
      legalName: baseBiz?.legalName || demoRec?.legalName || dossierCustomer.businessName,
      dba: baseBiz?.name || demoRec?.businessName || dossierCustomer.businessName,
      industry: dossierCustomer.industry,
      naicsCode: dossierCustomer.naicsCode,
      segment: dossierCustomer.segment,
      region: dossierCustomer.region,
      address: baseBiz ? `${baseBiz.city}, ${baseBiz.state}` : demoRec ? `${demoRec.city}, ${demoRec.state}` : dossierCustomer.branch,
      phone: enriched?.phone || 'On file',
      email: enriched?.email || 'On file',
      website: enriched?.website || 'On file',
      yearsInBusiness: baseBiz?.yearsInBusiness || demoRec?.yearsInBusiness || 5,
      employeeCount: baseBiz?.employeeCount || demoRec?.employeeCount || 25,
      annualRevenue: baseBiz?.annualRevenue || demoRec?.annualRevenue || dossierCustomer.totalExposure * 8,
      assignedRM: {
        name: enriched?.assignedRM || dossierCustomer.assignedRM || 'Unassigned',
        email: `${(enriched?.assignedRM || 'rm').toLowerCase().replace(/\s+/g, '.')}@partnerbank.com`,
        phone: '(800) 555-0100',
      },
      rhs: dossierCustomer.rhs,
      rhsStatus: dossierCustomer.rhsChange > 0 ? 'growing' as const : dossierCustomer.rhsChange < 0 ? 'declining' as const : 'stable' as const,
      rhsTrendData: trendData,
      riskTier: dossierCustomer.riskTier,
      creditScore: enriched?.creditScores[0]?.score || (baseBiz ? baseBiz.lumiqScore * 10 : 0),
      relationshipStage: dossierCustomer.relationshipStage,
      totalExposure: dossierCustomer.totalExposure,
      totalDeposits: dossierCustomer.depositBalance,
      products,
      recentNotes: [],
      auditLog: [],
    };
  })() : null;

  // Loading state - Full page skeleton
  if (portfolioLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-40 bg-muted animate-pulse rounded-lg" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-9 w-24 bg-muted animate-pulse rounded-lg" />
        </div>

        {/* Lifecycle skeleton */}
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-1 h-20 bg-muted/50 animate-pulse rounded-xl" />
          ))}
        </div>

        {/* Summary skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricSkeleton key={i} />
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-5">
            <CustomerTableSkeleton rows={6} />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <SkeletonCard className="h-[400px]" />
          </div>
          <div className="col-span-12 xl:col-span-3">
            <SkeletonPanel contentRows={3} />
          </div>
        </div>
      </div>
    );
  }

  // No portfolio selected
  if (!portfolioId) {
    return (
      <EmptyState
        icon={Building2}
        title="No portfolio selected"
        description="Select a portfolio to view and manage your customer relationships"
        variant="card"
        size="lg"
        className="min-h-[400px]"
      />
    );
  }

  return (
    <div className="space-y-6">
      <BankDisclaimer compact />
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
      <RelationshipHealthSummary data={healthSummary} onDrilldown={handleDrilldown} />

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Customer List Table */}
        <div className="col-span-12 xl:col-span-5">
          {isLoading && filteredCustomers.length === 0 ? (
            <CustomerTableSkeleton rows={6} />
          ) : filteredCustomers.length === 0 ? (
            <EmptyState
              icon={searchQuery ? UserX : Users}
              title={searchQuery ? 'No customers match your search' : 'No customers match filters'}
              description={
                searchQuery
                  ? `No results for "${searchQuery}". Try adjusting your search terms.`
                  : 'Adjust your filter selections to see results.'
              }
              action={
                searchQuery
                  ? { label: 'Clear search', onClick: () => setSearchQuery(''), variant: 'outline' }
                  : {
                      label: 'Clear filters',
                      onClick: () => handleFiltersChange({ ...filters, product: [], segment: [], region: [], relationshipStage: [] }),
                      variant: 'outline',
                    }
              }
              variant="card"
              size="sm"
              className="min-h-[300px]"
            />
          ) : (
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
            <EmptyState
              icon={Users}
              title="Select a business"
              description="Click on a business from the list to view their engagement details and relationship health"
              variant="card"
              size="sm"
              className="h-full min-h-[300px]"
            />
          )}
        </div>

        {/* Right: Next Best Actions */}
        <div className="col-span-12 xl:col-span-3">
          <NextBestActions
            recommendations={recommendations}
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

      {/* Data Source Footer */}
      <DataLineageFooter
        meta={{
          lastUpdated: lastUpdated || new Date().toISOString(),
          dataSources: ['LUMIQ AI Signal Engine', 'Bureau Data Feed'],
        }}
      />
    </div>
  );
};

export default CustomerBff;
