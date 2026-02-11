// Enterprise Products Data - Wells Fargo product portfolio (real products from wf_qualitative.json)

import type {
  BankProduct,
  ProductKPI,
  PenetrationByProduct,
  SegmentPenetration,
  PreQualReadiness,
  PreQualCandidate,
  ProductPerformanceRow,
  EligibilityRule,
} from './types';
import type { CrossSellFunnelStage, ApplicationFunnelMetrics } from '../analytics/types';

// ============================================
// PRODUCT CATALOG — 17 Real Wells Fargo Products
// ============================================

export const WF_BANK_PRODUCTS: BankProduct[] = [
  // -- Deposits (4) ----------------------------------------------------------
  {
    id: 'initiate-business-checking',
    name: 'Initiate Business Checking',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Startup', 'Micro'],
    terms: { rateRange: '0.01% APY', termRange: 'Demand', amountRange: '$25 min opening deposit', collateral: 'N/A', guarantor: 'N/A' },
    description: '$10/mo fee (increasing to $15 March 2026) waived at $500 daily or $1K avg ledger balance. 100 free transactions/cycle, Mobile Deposit, Zelle, Business Bill Pay, and $400 bonus with qualifying deposits.',
  },
  {
    id: 'navigate-business-checking',
    name: 'Navigate Business Checking',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '0.02% APY', termRange: 'Demand', amountRange: '$25 min opening deposit', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Mid-tier checking for growing businesses with enhanced transaction limits, Business Online and Mobile banking, Business Bill Pay, and Mobile Deposit.',
  },
  {
    id: 'optimize-business-checking',
    name: 'Optimize Business Checking',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: '0.05% APY', termRange: 'Demand', amountRange: '$25 min opening deposit', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Premium checking with Wells Fargo Vantage platform access, advanced treasury management, ACH fraud filters, desktop deposit, zero balance account services, and cash forecasting tools.',
  },
  {
    id: 'business-market-rate-savings',
    name: 'Business Market Rate Savings',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Startup', 'Micro', 'Small Business'],
    terms: { rateRange: '0.25%–2.50% APY', termRange: 'Demand', amountRange: 'No minimum', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Tiered APY savings with fee waiver at $300 daily balance or $25+ automatic transfers from WF business checking. FDIC insured with online and mobile access.',
  },

  // -- Credit Cards (3) ------------------------------------------------------
  {
    id: 'signify-business-cash',
    name: 'Wells Fargo Signify Business Cash\u2120 Card',
    family: 'Credit Cards',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Micro', 'Small Business', 'Mid-Market'],
    terms: { rateRange: 'Variable (Prime + margin)', termRange: 'Revolving', amountRange: 'Subject to approval', collateral: 'Unsecured', guarantor: 'Personal' },
    description: 'Unlimited 2% cash back on all purchases with no rotating categories or caps. $500 bonus after $5K spend in 3 months. No annual fee, no foreign transaction fee, SavingsEdge discounts.',
  },
  {
    id: 'business-platinum-card',
    name: 'Wells Fargo Business Platinum Credit Card',
    family: 'Credit Cards',
    status: 'Sunset',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Micro', 'Small Business'],
    terms: { rateRange: '0% intro 9mo, then Prime + 7.99%–17.99%', termRange: 'Revolving', amountRange: 'Subject to approval', collateral: 'Unsecured', guarantor: 'Personal' },
    description: '1.5% cash rewards per dollar. $300 bonus with $3K spend in 3 months. 0% intro APR for 9 months. Up to 99 free employee cards. Not currently accepting new applications.',
  },
  {
    id: 'business-elite-card',
    name: 'Wells Fargo Business Elite Signature Card',
    family: 'Credit Cards',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Variable APR', termRange: 'Revolving', amountRange: 'Subject to approval', collateral: 'Unsecured', guarantor: 'Personal' },
    description: '$125 annual fee (waived first year). 1.5% cash back or 1 point/dollar. $500 bonus with $15K spend in 3 months. $100/yr travel reimbursement, up to 200 employee cards, trip delay/cancellation coverage.',
  },

  // -- Lines of Credit (3) ---------------------------------------------------
  {
    id: 'businessline-credit',
    name: 'BusinessLine of Credit',
    family: 'Lines of Credit',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: 'Prime + 0.50%', termRange: 'Revolving', amountRange: '$5K–$1M', collateral: 'Unsecured/Secured', guarantor: 'Personal' },
    description: 'Revolving credit with no annual fee year 1 ($95 for $10K–$25K, $175 for $25K+ after). Unsecured and secured options, no prepayment penalty. Banker-assisted digital application available.',
  },
  {
    id: 'small-business-advantage-loc',
    name: 'Small Business Advantage Line of Credit',
    family: 'Lines of Credit',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Startup', 'Micro'],
    terms: { rateRange: 'Higher starting APR', termRange: '5-year revolving', amountRange: '$5K–$100K', collateral: 'Unsecured', guarantor: 'Personal' },
    description: 'Designed for newer businesses with less than 2 years in operation. Five-year unsecured revolving line with no annual fee and flexible repayment.',
  },
  {
    id: 'prime-line-credit',
    name: 'Prime Line of Credit',
    family: 'Lines of Credit',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Prime + 0.50%', termRange: 'Revolving', amountRange: '$100K–$1M', collateral: 'Varies', guarantor: 'Corporate' },
    description: 'Larger credit lines for established businesses with competitive relationship-based pricing and treasury management integration.',
  },

  // -- Term Loans (1) --------------------------------------------------------
  {
    id: 'fastflex-small-business-loan',
    name: 'FastFlex Small Business Loan',
    family: 'Term Loans',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business'],
    terms: { rateRange: '13.99%–22.99%', termRange: '1 year', amountRange: '$10K–$35K', collateral: 'Unsecured', guarantor: 'Personal' },
    description: 'Fast-decision online loan funded next business day. Weekly automatic payments, no origination fee, no prepayment penalty. Must be existing WF small business customer with 1+ year in business.',
  },

  // -- SBA Programs (2) ------------------------------------------------------
  {
    id: 'sba-7a-loan',
    name: 'SBA 7(a) Loan',
    family: 'SBA Programs',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: 'Varies by amount/term', termRange: '10–25 years', amountRange: 'Up to $5M', collateral: 'Available Assets', guarantor: 'Personal (20%+)' },
    description: 'SBA-guaranteed financing with low down payments. WF is SBA Preferred Lender. FY2024: 2,224 approvals, $567M funded, #5 nationally. Flexible use: property, equipment, working capital, acquisition.',
  },
  {
    id: 'sba-504-loan',
    name: 'SBA 504 Loan',
    family: 'SBA Programs',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: 'Long-term fixed rate', termRange: '10–25 years', amountRange: 'Up to $10M (WF portion)', collateral: 'Real Estate/Equipment', guarantor: 'Personal (20%+)' },
    description: 'Long-term fixed-rate financing for construction, real estate, and equipment. Typically 10% down payment. WF is SBA Preferred Lender with up to $5M CDC portion.',
  },

  // -- Equipment Finance (1) -------------------------------------------------
  {
    id: 'equipment-financing',
    name: 'Wells Fargo Equipment Finance',
    family: 'Equipment Finance',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market', 'Corporate'],
    terms: { rateRange: 'Fixed/floating available', termRange: 'Aligned to asset life', amountRange: 'All sizes', collateral: 'Equipment', guarantor: 'Varies' },
    description: 'Leading bank-affiliated equipment leasing and finance in the U.S. with 335,000+ customers and $11B+ managed assets. Covers 10+ industry verticals including agricultural, medical, construction, and commercial vehicles.',
  },

  // -- Commercial Real Estate (1) --------------------------------------------
  {
    id: 'commercial-real-estate',
    name: 'Commercial Real Estate Financing',
    family: 'Commercial Real Estate',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Varies by structure', termRange: 'Construction to permanent', amountRange: '$1M+', collateral: 'Real Estate', guarantor: 'Corporate/Personal' },
    description: '#2 CRE lender in the U.S. Fully integrated banking, financing, and capital markets. Balance sheet lending, multifamily (Fannie/Freddie/FHA), CMBS, loan syndications, and GSE lending.',
  },

  // -- Treasury (2) ----------------------------------------------------------
  {
    id: 'merchant-services',
    name: 'Wells Fargo Merchant Services',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Micro', 'Small Business', 'Mid-Market'],
    terms: { rateRange: '2.2%–3.99% + $0.15–$0.20', termRange: 'Monthly', amountRange: 'No limit', collateral: 'N/A', guarantor: 'N/A' },
    description: 'POS, online, and phone payment processing. $9.99–$24.95/mo. Next business day funding, 24/7 support, fraud monitoring, analytics, and dispute management. Compatible with thousands of ISVs and gateways.',
  },
  {
    id: 'treasury-management',
    name: 'Treasury Management Services',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Custom pricing', termRange: 'Ongoing', amountRange: 'Enterprise', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Wells Fargo Vantage platform for cash flow, liquidity, payables/receivables, ACH, wire transfers, multibank/multicurrency reporting, zero balance accounts, and cash forecasting.',
  },
];

// ============================================
// KPIs PER VIEW — Wells Fargo Scale (3.3M businesses)
// ============================================

export const WF_SHELF_KPIS: ProductKPI[] = [
  {
    id: 'total-active',
    label: 'Total Active Products',
    value: 16,
    format: 'number',
    trend: 1,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Products currently available to 3.3M+ business clients',
    dataSource: 'Product Management',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'sunset-products',
    label: 'Products Sunset',
    value: 1,
    format: 'number',
    trend: 0,
    trendDirection: 'stable',
    isPositiveTrend: false,
    tooltip: 'Business Platinum Credit Card not accepting new applications',
    dataSource: 'Product Management',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'avg-revenue',
    label: 'Avg Revenue/Product',
    value: 128000000,
    format: 'currency',
    trend: 5.2,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average monthly revenue per active product line across 3.3M business clients',
    dataSource: 'Finance',
    lastUpdated: '1 day ago',
  },
  {
    id: 'adoption-rate',
    label: 'Customer Adoption Rate',
    value: 34.8,
    format: 'percent',
    trend: 1.9,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Consumer, Small and Business Banking generates ~45% of WF total revenue',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '2 hours ago',
  },
];

export const WF_PENETRATION_KPIS: ProductKPI[] = [
  {
    id: 'overall-penetration',
    label: 'Overall Penetration',
    value: 41.2,
    format: 'percent',
    trend: 2.8,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Eligible businesses holding at least one Wells Fargo product',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'cross-sell-gap',
    label: 'Cross-Sell Gap',
    value: 1.7,
    format: 'number',
    trend: -0.1,
    trendDirection: 'down',
    isPositiveTrend: true,
    tooltip: 'Avg additional products per customer vs optimal (gap narrowing)',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'products-per-customer',
    label: 'Products/Customer',
    value: 2.3,
    format: 'number',
    trend: 0.2,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average products per active client across 3.3M business relationships',
    dataSource: 'CRM',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'wallet-share',
    label: 'Wallet Share',
    value: 38.4,
    format: 'percent',
    trend: 1.6,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Estimated share of customer financial wallet across 36-state footprint',
    dataSource: 'Market Intelligence',
    lastUpdated: '1 day ago',
  },
];

export const WF_PREQUAL_KPIS: ProductKPI[] = [
  {
    id: 'total-prequal',
    label: 'Total Pre-Qualified',
    value: 2145000,
    format: 'number',
    trend: 7.2,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: '2.145M businesses meeting pre-qualification criteria (65% of portfolio)',
    dataSource: 'LUMIQ AI Signal Engine',
    lastUpdated: '30 mins ago',
  },
  {
    id: 'pct-likely',
    label: '% Likely',
    value: 58.4,
    format: 'percent',
    trend: 3.1,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Pre-qualified businesses rated as likely to qualify based on LUMIQ scoring',
    dataSource: 'LUMIQ AI Signal Engine',
    lastUpdated: '30 mins ago',
  },
  {
    id: 'pipeline-value',
    label: 'Pipeline Value',
    value: 18800000000,
    format: 'currency',
    trend: 10.8,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Estimated total value of pre-qualified pipeline across all product lines',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'avg-readiness',
    label: 'Avg Readiness Score',
    value: 71.6,
    format: 'score',
    trend: 1.8,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average LUMIQ readiness score across 2.145M pre-qualified pipeline',
    dataSource: 'LUMIQ AI Signal Engine',
    lastUpdated: '30 mins ago',
  },
];

export const WF_PERFORMANCE_KPIS: ProductKPI[] = [
  {
    id: 'wtd-approval',
    label: 'Weighted Approval Rate',
    value: 62.0,
    format: 'percent',
    trend: 1.4,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Volume-weighted approval rate across all Wells Fargo business products',
    dataSource: 'Underwriting',
    lastUpdated: '15 mins ago',
  },
  {
    id: 'avg-ttd',
    label: 'Avg Time-to-Decision',
    value: 3.1,
    format: 'number',
    trend: -0.4,
    trendDirection: 'down',
    isPositiveTrend: true,
    tooltip: 'Average business days from application to decision -- SBA Preferred Lender advantage',
    dataSource: 'Underwriting',
    lastUpdated: '15 mins ago',
  },
  {
    id: 'total-funded-30d',
    label: 'Total Funded (30d)',
    value: 12400000000,
    format: 'currency',
    trend: 7.8,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Total funded volume in last 30 days across 3.3M business clients',
    dataSource: 'Finance',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'portfolio-growth',
    label: 'Portfolio Growth',
    value: 3.8,
    format: 'percent',
    trend: 0.6,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Year-over-year outstanding balance growth',
    dataSource: 'Finance',
    lastUpdated: '1 day ago',
  },
];

// ============================================
// PENETRATION DATA — Wells Fargo Scale (3.3M businesses)
// ============================================

export const WF_PENETRATION_BY_PRODUCT: PenetrationByProduct[] = [
  { product: 'Initiate / Navigate / Optimize Business Checking', family: 'Deposits', customersHolding: 2508000, eligibleCustomers: 3000000, penetrationRate: 83.6, crossSellGap: 16.4, revenueOpportunity: 98000000 },
  { product: 'Wells Fargo Signify Business Cash\u2120 Card', family: 'Credit Cards', customersHolding: 1485000, eligibleCustomers: 2640000, penetrationRate: 56.3, crossSellGap: 43.7, revenueOpportunity: 578000000 },
  { product: 'Wells Fargo Merchant Services', family: 'Treasury', customersHolding: 1320000, eligibleCustomers: 2310000, penetrationRate: 57.1, crossSellGap: 42.9, revenueOpportunity: 990000000 },
  { product: 'Business Market Rate Savings', family: 'Deposits', customersHolding: 1155000, eligibleCustomers: 3000000, penetrationRate: 38.5, crossSellGap: 61.5, revenueOpportunity: 185000000 },
  { product: 'BusinessLine of Credit', family: 'Lines of Credit', customersHolding: 825000, eligibleCustomers: 1980000, penetrationRate: 41.7, crossSellGap: 58.3, revenueOpportunity: 1155000000 },
  { product: 'Wells Fargo Equipment Finance', family: 'Equipment Finance', customersHolding: 335000, eligibleCustomers: 1155000, penetrationRate: 29.0, crossSellGap: 71.0, revenueOpportunity: 820000000 },
  { product: 'FastFlex Small Business Loan', family: 'Term Loans', customersHolding: 264000, eligibleCustomers: 990000, penetrationRate: 26.7, crossSellGap: 73.3, revenueOpportunity: 726000000 },
  { product: 'SBA Programs (7a/504)', family: 'SBA Programs', customersHolding: 132000, eligibleCustomers: 528000, penetrationRate: 25.0, crossSellGap: 75.0, revenueOpportunity: 396000000 },
];

export const WF_SEGMENT_PENETRATION: SegmentPenetration[] = [
  { segment: 'Micro (<$1M)', productsPerCustomer: 1.8, walletShare: 29.4, totalCustomers: 1485000 },
  { segment: 'Small ($1M–$10M)', productsPerCustomer: 2.5, walletShare: 41.2, totalCustomers: 1155000 },
  { segment: 'Mid-Market ($10M+)', productsPerCustomer: 3.8, walletShare: 54.6, totalCustomers: 660000 },
];

export const WF_PRODUCT_CROSS_SELL_FUNNEL: CrossSellFunnelStage[] = [
  { stage: 'Eligible for Additional Product', count: 2310000, conversionFromPrevious: 100, avgTimeInStage: 0 },
  { stage: 'Targeted by Campaign', count: 1340000, conversionFromPrevious: 58, avgTimeInStage: 6 },
  { stage: 'Engaged / Responded', count: 778000, conversionFromPrevious: 58, avgTimeInStage: 9 },
  { stage: 'Applied', count: 451000, conversionFromPrevious: 58, avgTimeInStage: 14 },
  { stage: 'Approved & Booked', count: 316000, conversionFromPrevious: 70, avgTimeInStage: 4 },
];

// ============================================
// PRE-QUALIFICATION DATA — Wells Fargo Scale
// ============================================

export const WF_PREQUAL_READINESS: PreQualReadiness[] = [
  { product: 'BusinessLine of Credit', likely: 138000, borderline: 62000, unlikely: 34000, total: 234000 },
  { product: 'Wells Fargo Signify Business Cash\u2120 Card', likely: 224000, borderline: 78000, unlikely: 42000, total: 344000 },
  { product: 'FastFlex Small Business Loan', likely: 96000, borderline: 54000, unlikely: 38000, total: 188000 },
  { product: 'SBA 7(a) Loan', likely: 62000, borderline: 48000, unlikely: 32000, total: 142000 },
  { product: 'Wells Fargo Equipment Finance', likely: 74000, borderline: 44000, unlikely: 28000, total: 146000 },
  { product: 'Wells Fargo Merchant Services', likely: 156000, borderline: 64000, unlikely: 32000, total: 252000 },
];

export const WF_PREQUAL_CANDIDATES: PreQualCandidate[] = [
  { businessName: 'Sierra Agricultural Supply', industry: 'Agriculture', annualRevenue: 5800000, readinessScore: 94, readiness: 'Likely', topProduct: 'Wells Fargo Equipment Finance', signals: ['Strong DSCR', 'PAYDEX 84', 'Stable Ag Revenue'] },
  { businessName: 'Bay Area Medical Group', industry: 'Healthcare', annualRevenue: 7200000, readinessScore: 91, readiness: 'Likely', topProduct: 'SBA 504 Loan', signals: ['Growing Revenue', 'FICO 790', 'Low Leverage'] },
  { businessName: 'Golden State Contractors', industry: 'Construction', annualRevenue: 11500000, readinessScore: 87, readiness: 'Likely', topProduct: 'Commercial Real Estate Financing', signals: ['Strong Cash Flow', 'PAYDEX 80', 'CRE Track Record'] },
  { businessName: 'Heartland Manufacturing Co.', industry: 'Manufacturing', annualRevenue: 4100000, readinessScore: 84, readiness: 'Likely', topProduct: 'BusinessLine of Credit', signals: ['Positive Cash Trend', 'FICO 760', '8yr Track Record'] },
  { businessName: 'Pacific Logistics Partners', industry: 'Transportation', annualRevenue: 9300000, readinessScore: 81, readiness: 'Likely', topProduct: 'Wells Fargo Equipment Finance', signals: ['Fleet Growth', 'PAYDEX 76', 'Strong Revenue'] },
  { businessName: 'Mountain View Dental Care', industry: 'Healthcare', annualRevenue: 2200000, readinessScore: 76, readiness: 'Borderline', topProduct: 'SBA 7(a) Loan', signals: ['DSCR 1.18', 'FICO 715', 'High Utilization'] },
  { businessName: 'Prairie Grain & Feed', industry: 'Agriculture', annualRevenue: 1400000, readinessScore: 72, readiness: 'Borderline', topProduct: 'FastFlex Small Business Loan', signals: ['Seasonal Revenue', 'PAYDEX 70', 'WF Customer 3yr'] },
  { businessName: 'Sunrise Cafe & Bakery', industry: 'Restaurants', annualRevenue: 780000, readinessScore: 66, readiness: 'Borderline', topProduct: 'Small Business Advantage LOC', signals: ['Growing Revenue', 'FICO 695', 'Short Track Record'] },
  { businessName: 'Desert Auto Repair', industry: 'Automotive', annualRevenue: 520000, readinessScore: 57, readiness: 'Unlikely', topProduct: 'Signify Business Cash\u2120 Card', signals: ['Declining Revenue', 'PAYDEX 54', 'High Leverage'] },
  { businessName: 'Valley Quick Print', industry: 'Retail', annualRevenue: 340000, readinessScore: 51, readiness: 'Unlikely', topProduct: 'Signify Business Cash\u2120 Card', signals: ['Low DSCR', 'FICO 625', 'Payment Delays'] },
];

// ============================================
// PERFORMANCE DATA — Wells Fargo Scale
// ============================================

export const WF_PRODUCT_PERFORMANCE: ProductPerformanceRow[] = [
  { product: 'Wells Fargo Signify Business Cash\u2120 Card', family: 'Credit Cards', approvalRate: 72.4, fundingRate: 95.8, avgDealSize: 28000, avgTimeToDecision: 0.4, totalFunded30d: 1680000000, yoyGrowth: 22.4 },
  { product: 'Wells Fargo Business Elite Signature Card', family: 'Credit Cards', approvalRate: 58.6, fundingRate: 94.2, avgDealSize: 85000, avgTimeToDecision: 1.2, totalFunded30d: 920000000, yoyGrowth: 6.8 },
  { product: 'BusinessLine of Credit', family: 'Lines of Credit', approvalRate: 64.8, fundingRate: 88.2, avgDealSize: 125000, avgTimeToDecision: 3.2, totalFunded30d: 2340000000, yoyGrowth: 7.4 },
  { product: 'Prime Line of Credit', family: 'Lines of Credit', approvalRate: 68.2, fundingRate: 91.4, avgDealSize: 420000, avgTimeToDecision: 5.1, totalFunded30d: 1560000000, yoyGrowth: 4.8 },
  { product: 'FastFlex Small Business Loan', family: 'Term Loans', approvalRate: 56.4, fundingRate: 92.8, avgDealSize: 22000, avgTimeToDecision: 0.5, totalFunded30d: 840000000, yoyGrowth: 11.2 },
  { product: 'SBA 7(a) Loan', family: 'SBA Programs', approvalRate: 52.8, fundingRate: 78.4, avgDealSize: 255000, avgTimeToDecision: 14.2, totalFunded30d: 780000000, yoyGrowth: 15.6 },
  { product: 'Wells Fargo Equipment Finance', family: 'Equipment Finance', approvalRate: 70.6, fundingRate: 92.8, avgDealSize: 195000, avgTimeToDecision: 2.8, totalFunded30d: 1120000000, yoyGrowth: 9.4 },
  { product: 'Wells Fargo Merchant Services', family: 'Treasury', approvalRate: 88.4, fundingRate: 97.6, avgDealSize: 0, avgTimeToDecision: 0.2, totalFunded30d: 3160000000, yoyGrowth: 18.2 },
];

export const WF_PERFORMANCE_APP_FUNNEL: ApplicationFunnelMetrics[] = [
  { product: 'All Products', preQualified: 2145000, applied: 1201000, approved: 865000, funded: 709000, preQualToApplyRate: 56, applyToApproveRate: 72, avgTimeToDecision: 3.1 },
  { product: 'Credit Cards', preQualified: 892000, applied: 669000, approved: 528000, funded: 502000, preQualToApplyRate: 75, applyToApproveRate: 79, avgTimeToDecision: 0.5 },
  { product: 'Lines of Credit', preQualified: 548000, applied: 302000, approved: 199000, funded: 173000, preQualToApplyRate: 55, applyToApproveRate: 66, avgTimeToDecision: 3.8 },
  { product: 'Term Loans', preQualified: 382000, applied: 172000, approved: 103000, funded: 89000, preQualToApplyRate: 45, applyToApproveRate: 60, avgTimeToDecision: 0.5 },
  { product: 'SBA Programs', preQualified: 323000, applied: 113000, approved: 62000, funded: 48000, preQualToApplyRate: 35, applyToApproveRate: 55, avgTimeToDecision: 14.2 },
];

// ============================================
// ELIGIBILITY MATRIX — Real Wells Fargo Criteria
// ============================================

export const WF_ELIGIBILITY_RULES: EligibilityRule[] = [
  // Deposits
  { product: 'Initiate Business Checking', family: 'Deposits', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: '$10/mo fee waived at $500 daily or $1K avg ledger balance; 100 free transactions/cycle' },
  { product: 'Navigate Business Checking', family: 'Deposits', timeInBusiness: 'Established', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: 'Mid-tier pricing with enhanced transaction limits for growing businesses' },
  { product: 'Optimize Business Checking', family: 'Deposits', timeInBusiness: 'Established', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: 'Premium tier with Vantage platform access; treasury management integration; higher balance requirements' },
  { product: 'Business Market Rate Savings', family: 'Deposits', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: 'Fee waived at $300 daily balance or $25+ auto-transfer from WF checking; 0.25%–2.50% APY' },

  // Credit Cards
  { product: 'Wells Fargo Signify Business Cash\u2120 Card', family: 'Credit Cards', timeInBusiness: 'Varies', annualRevenue: 'Varies', dscr: 'N/A', paydex: '65+', fico: '670+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Payment Behavior'], policyNotes: 'No annual fee; unlimited 2% cash back; no foreign transaction fee; $500 bonus ($5K spend in 3 months)' },
  { product: 'Wells Fargo Business Platinum Credit Card', family: 'Credit Cards', timeInBusiness: 'Varies', annualRevenue: 'Varies', dscr: 'N/A', paydex: '62+', fico: '660+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Payment Behavior'], policyNotes: 'SUNSET: Not accepting new applications; 0% intro APR 9 months; 1.5% cash rewards' },
  { product: 'Wells Fargo Business Elite Signature Card', family: 'Credit Cards', timeInBusiness: '2+ years', annualRevenue: '$1M+', dscr: 'N/A', paydex: '75+', fico: '740+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Revenue Growth', 'Strong Cash Flow'], policyNotes: '$125 annual fee (waived yr 1); must have $1M+ annual sales; up to 200 employee cards' },

  // Lines of Credit
  { product: 'BusinessLine of Credit', family: 'Lines of Credit', timeInBusiness: '6+ months', annualRevenue: '$250K+', dscr: '1.15+', paydex: '65+', fico: '680+', maxLTV: 'N/A', collateral: 'Unsecured/Secured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Utilization Rate'], policyNotes: '$5K–$1M; no annual fee yr 1 ($95 for $10K–$25K, $175 for $25K+ after); banker-assisted digital app' },
  { product: 'Small Business Advantage Line of Credit', family: 'Lines of Credit', timeInBusiness: '<2 years', annualRevenue: 'Varies', dscr: '1.10+', paydex: '58+', fico: '650+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Personal Credit'], policyNotes: '$5K–$100K; 5-year revolving; no annual fee; designed for newer businesses under 2 years old' },
  { product: 'Prime Line of Credit', family: 'Lines of Credit', timeInBusiness: '3+ years', annualRevenue: '$2M+', dscr: '1.25+', paydex: '72+', fico: '720+', maxLTV: 'N/A', collateral: 'Varies', guarantor: 'Corporate', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Revenue Growth', 'Strong Financials'], policyNotes: '$100K–$1M; relationship-based pricing; treasury management integration available' },

  // Term Loans
  { product: 'FastFlex Small Business Loan', family: 'Term Loans', timeInBusiness: '1+ year', annualRevenue: 'Varies', dscr: '1.10+', paydex: '60+', fico: '660+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'WF Customer', 'Weekly Repayment Capacity'], policyNotes: '$10K–$35K; 1-year term; 13.99%–22.99% APR; must be existing WF customer; funded next business day' },

  // SBA Programs
  { product: 'SBA 7(a) Loan', family: 'SBA Programs', timeInBusiness: 'Start-ups eligible', annualRevenue: '$150K+', dscr: '1.15+', paydex: '60+', fico: '680+', maxLTV: '85%', collateral: 'Available Assets', guarantor: 'Personal (20%+)', requiredSignals: ['Cash Flow Stability', 'DSCR', 'SBA Eligibility'], policyNotes: 'Up to $5M; 10–25yr terms; WF is SBA Preferred Lender; FY2024: 2,224 approvals, $567M funded' },
  { product: 'SBA 504 Loan', family: 'SBA Programs', timeInBusiness: '2+ years', annualRevenue: '$500K+', dscr: '1.20+', paydex: '65+', fico: '680+', maxLTV: '90%', collateral: 'Real Estate/Equipment', guarantor: 'Personal (20%+)', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Job Creation Plan'], policyNotes: 'Up to $10M WF portion + $5M CDC; long-term fixed rate; typically 10% down; owner-occupied' },

  // Equipment Finance
  { product: 'Wells Fargo Equipment Finance', family: 'Equipment Finance', timeInBusiness: 'Varies', annualRevenue: '$500K+', dscr: '1.15+', paydex: '65+', fico: '670+', maxLTV: '100%', collateral: 'Equipment', guarantor: 'Varies', requiredSignals: ['Cash Flow Stability', 'Equipment Valuation', 'Industry Assessment'], policyNotes: 'Fixed/floating rates; 335K+ customers; $11B+ managed assets; 10+ industry verticals' },

  // Commercial Real Estate
  { product: 'Commercial Real Estate Financing', family: 'Commercial Real Estate', timeInBusiness: '3+ years', annualRevenue: '$5M+', dscr: '1.25+', paydex: '75+', fico: '720+', maxLTV: '80%', collateral: 'Real Estate', guarantor: 'Corporate/Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'CRE Track Record', 'Property Valuation'], policyNotes: '#2 CRE lender in U.S.; $1M+ loans; multifamily/office/retail/industrial/hospitality; Fannie/Freddie/FHA' },

  // Treasury
  { product: 'Wells Fargo Merchant Services', family: 'Treasury', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'Business Verification'], policyNotes: '2.2%–3.99% + $0.15–$0.20; $9.99–$24.95/mo; POS + online + phone; next business day funding' },
  { product: 'Treasury Management Services', family: 'Treasury', timeInBusiness: 'Established', annualRevenue: '$1M+', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'Business Verification', 'Relationship Assessment'], policyNotes: 'Wells Fargo Vantage platform; custom pricing; ACH/wire/multibank reporting; zero balance accounts' },
];
