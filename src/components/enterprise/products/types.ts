// Enterprise Products Types - Bank product portfolio intelligence

export type ProductViewMode = 'shelf' | 'penetration' | 'prequalification' | 'performance' | 'eligibility';

export type ProductStatus = 'Active' | 'Pilot' | 'Sunset';

export type ProductFamily =
  | 'Credit Cards'
  | 'Lines of Credit'
  | 'Term Loans'
  | 'SBA Programs'
  | 'Equipment Finance'
  | 'Commercial Auto'
  | 'Commercial Real Estate'
  | 'Deposits'
  | 'Treasury';

export type EligibilityTier = 'Tier 1' | 'Tier 2' | 'Tier 3';

export type SegmentType = 'micro' | 'small' | 'midmarket' | 'all';

export type TimeWindow = '7d' | '30d' | '90d' | '12m';

export interface ProductsFilters {
  viewMode: ProductViewMode;
  productFamily: ProductFamily | 'All';
  segment: SegmentType;
  status: ProductStatus | 'All';
  timeWindow: TimeWindow;
}

// Product Shelf
export interface BankProduct {
  id: string;
  name: string;
  family: ProductFamily;
  status: ProductStatus;
  eligibilityTier: EligibilityTier;
  targetSegments: string[];
  terms: {
    rateRange: string;
    termRange: string;
    amountRange: string;
    collateral: string;
    guarantor: string;
  };
  description: string;
}

// KPI Tiles (reusing PortfolioKPI from analytics)
export interface ProductKPI {
  id: string;
  label: string;
  value: number;
  format: 'number' | 'percent' | 'currency' | 'score';
  trend: number;
  trendDirection: 'up' | 'down' | 'stable';
  isPositiveTrend: boolean;
  tooltip: string;
  dataSource: string;
  lastUpdated: string;
}

// Penetration View
export interface PenetrationByProduct {
  product: string;
  family: ProductFamily;
  customersHolding: number;
  eligibleCustomers: number;
  penetrationRate: number;
  crossSellGap: number;
  revenueOpportunity: number;
}

export interface SegmentPenetration {
  segment: string;
  productsPerCustomer: number;
  walletShare: number;
  totalCustomers: number;
}

// Pre-Qualification View
export interface PreQualReadiness {
  product: string;
  likely: number;
  borderline: number;
  unlikely: number;
  total: number;
}

export interface PreQualCandidate {
  businessName: string;
  industry: string;
  annualRevenue: number;
  readinessScore: number;
  readiness: 'Likely' | 'Borderline' | 'Unlikely';
  topProduct: string;
  signals: string[];
}

// Performance View
export interface ProductPerformanceRow {
  product: string;
  family: ProductFamily;
  approvalRate: number;
  fundingRate: number;
  avgDealSize: number;
  avgTimeToDecision: number;
  totalFunded30d: number;
  yoyGrowth: number;
}

// Eligibility Matrix
export interface EligibilityRule {
  product: string;
  family: ProductFamily;
  timeInBusiness: string;
  annualRevenue: string;
  dscr: string;
  paydex: string;
  fico: string;
  maxLTV: string;
  collateral: string;
  guarantor: string;
  requiredSignals: string[];
  policyNotes: string;
}
