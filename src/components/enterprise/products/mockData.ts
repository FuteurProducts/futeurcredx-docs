// Enterprise Products Data - Bank-switched product portfolio
// Chase data defined inline; WF/Santander/Citi data imported from dedicated files

import { ACTIVE_BANK_ID } from '@/data/bankConfig';

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

import {
  WF_BANK_PRODUCTS,
  WF_SHELF_KPIS,
  WF_PENETRATION_KPIS,
  WF_PREQUAL_KPIS,
  WF_PERFORMANCE_KPIS,
  WF_PENETRATION_BY_PRODUCT,
  WF_SEGMENT_PENETRATION,
  WF_PRODUCT_CROSS_SELL_FUNNEL,
  WF_PREQUAL_READINESS,
  WF_PREQUAL_CANDIDATES,
  WF_PRODUCT_PERFORMANCE,
  WF_PERFORMANCE_APP_FUNNEL,
  WF_ELIGIBILITY_RULES,
} from './wellsfargoProductData';

import {
  SANT_BANK_PRODUCTS,
  SANT_SHELF_KPIS,
  SANT_PENETRATION_KPIS,
  SANT_PREQUAL_KPIS,
  SANT_PERFORMANCE_KPIS,
  SANT_PENETRATION_BY_PRODUCT,
  SANT_SEGMENT_PENETRATION,
  SANT_PRODUCT_CROSS_SELL_FUNNEL,
  SANT_PREQUAL_READINESS,
  SANT_PREQUAL_CANDIDATES,
  SANT_PRODUCT_PERFORMANCE,
  SANT_PERFORMANCE_APP_FUNNEL,
  SANT_ELIGIBILITY_RULES,
} from './santanderProductData';

import {
  CITI_BANK_PRODUCTS,
  CITI_SHELF_KPIS,
  CITI_PENETRATION_KPIS,
  CITI_PREQUAL_KPIS,
  CITI_PERFORMANCE_KPIS,
  CITI_PENETRATION_BY_PRODUCT,
  CITI_SEGMENT_PENETRATION,
  CITI_PRODUCT_CROSS_SELL_FUNNEL,
  CITI_PREQUAL_READINESS,
  CITI_PREQUAL_CANDIDATES,
  CITI_PRODUCT_PERFORMANCE,
  CITI_PERFORMANCE_APP_FUNNEL,
  CITI_ELIGIBILITY_RULES,
} from './citiProductData';

// ============================================
// PRODUCT CATALOG — 18 Real Chase Products
// ============================================

const _chaseBankProducts: BankProduct[] = [
  // ── Deposits (5) ──────────────────────────────────────────────────────────
  {
    id: 'business-complete-checking',
    name: 'Chase Business Complete Banking℠',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Startup', 'Micro', 'Small Business'],
    terms: { rateRange: '0.01% APY', termRange: 'Demand', amountRange: 'No minimum', collateral: 'N/A', guarantor: 'N/A' },
    description: 'No minimum opening deposit with unlimited electronic transactions, $20K fee-free cash deposits/month, Zelle, and Tap to Pay on iPhone via Chase QuickAccept℠.',
  },
  {
    id: 'performance-business-checking',
    name: 'Chase Performance Business Checking℠',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '0.02% APY', termRange: 'Demand', amountRange: '$35K avg balance to waive fee', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Unlimited electronic transactions with 250 fee-free teller transactions/month and advanced digital banking tools for growing businesses.',
  },
  {
    id: 'platinum-business-checking',
    name: 'Chase Platinum Business Checking℠',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: '0.05% APY', termRange: 'Demand', amountRange: '$100K combined balance to waive fee', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Premium checking with 500 fee-free teller transactions, $25K fee-free cash deposits, priority service, and dedicated relationship management.',
  },
  {
    id: 'business-total-savings',
    name: 'Chase Business Total Savings℠',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Micro', 'Small Business'],
    terms: { rateRange: '0.01%–0.20% APY', termRange: 'Demand', amountRange: '$1K to waive $10/mo fee', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Interest-earning savings with Autosave automatic transfers and relationship rates when linked to qualifying checking.',
  },
  {
    id: 'business-premier-savings',
    name: 'Chase Business Premier Savings℠',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '0.02%–4.00% APY', termRange: 'Demand', amountRange: '$25K to waive $20/mo fee', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Enhanced interest rates with higher deposit limits and relationship rates for businesses with qualifying checking accounts.',
  },

  // ── Credit Cards (4) ──────────────────────────────────────────────────────
  {
    id: 'ink-business-unlimited',
    name: 'Ink Business Unlimited® Credit Card',
    family: 'Credit Cards',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Micro', 'Small Business'],
    terms: { rateRange: '18.49%–24.49%', termRange: 'Revolving', amountRange: '$5K–$50K', collateral: 'Unsecured', guarantor: 'Personal' },
    description: 'Unlimited 1.5% cash back on every purchase, $750 bonus after $6K spend in 3 months, 0% intro APR for 12 months, and cell phone protection up to $600.',
  },
  {
    id: 'ink-business-cash',
    name: 'Ink Business Cash® Credit Card',
    family: 'Credit Cards',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Micro', 'Small Business'],
    terms: { rateRange: '18.49%–24.49%', termRange: 'Revolving', amountRange: '$5K–$50K', collateral: 'Unsecured', guarantor: 'Personal' },
    description: '5% cash back on first $25K in office supplies, internet, cable, phone, and gas. 2% on restaurants. 0% intro APR for 12 months. No annual fee.',
  },
  {
    id: 'ink-business-preferred',
    name: 'Ink Business Preferred® Credit Card',
    family: 'Credit Cards',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: '21.24%–26.24%', termRange: 'Revolving', amountRange: '$10K–$500K', collateral: 'Unsecured', guarantor: 'Personal' },
    description: '3X points on first $150K in travel, shipping, internet, phone, and advertising. 90K bonus points after $8K spend. Points worth 25% more via Ultimate Rewards®.',
  },
  {
    id: 'ink-business-premier',
    name: 'Ink Business Premier℠ Credit Card',
    family: 'Credit Cards',
    status: 'Pilot',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Pay in full', termRange: 'Charge card', amountRange: '$10K–$100K', collateral: 'Unsecured', guarantor: 'Personal' },
    description: '2.5% cash back on every purchase of $5K+, 2% on all other business purchases. $1K bonus after $10K spend. Flexible spending limit with required full monthly payment.',
  },

  // ── Lines of Credit (2) ───────────────────────────────────────────────────
  {
    id: 'business-line-of-credit',
    name: 'Chase Business Line of Credit',
    family: 'Lines of Credit',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: 'Prime + 1.75%–4.5%', termRange: 'Revolving', amountRange: '$10K–$500K', collateral: 'Blanket UCC', guarantor: 'Personal' },
    description: 'Revolving credit up to $500K. Draw funds as needed, pay interest only on usage. No origination fee under $500K. Annual fee waived after year 1 with 40%+ utilization.',
  },
  {
    id: 'commercial-line-of-credit',
    name: 'Chase Commercial Line of Credit',
    family: 'Lines of Credit',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Prime + 0.5%–2.5%', termRange: '2-year revolving', amountRange: '$500K–$5M', collateral: 'A/R + Inventory', guarantor: 'Corporate' },
    description: 'Large credit lines over $500K with 2-year revolving terms, dedicated relationship manager, and treasury management integration.',
  },

  // ── SBA Programs (3) ──────────────────────────────────────────────────────
  {
    id: 'sba-7a',
    name: 'SBA 7(a) Loan',
    family: 'SBA Programs',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: 'Prime + 2.25%–2.75%', termRange: '10–25 years', amountRange: '$50K–$5M', collateral: 'Available Assets', guarantor: 'Personal (20%+)' },
    description: 'SBA-guaranteed financing up to $5M for equipment, inventory, working capital, and expansion. Chase is SBA Preferred Lender for faster approvals.',
  },
  {
    id: 'sba-504',
    name: 'SBA 504 Loan',
    family: 'SBA Programs',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: 'Below Market Fixed', termRange: '10–25 years', amountRange: '$100K–$5.5M', collateral: 'Real Estate/Equipment', guarantor: 'Personal (20%+)' },
    description: 'Long-term fixed-rate financing: 50% conventional loan, 40% SBA-backed, 10% down payment. Lower down payment than conventional for commercial real estate and equipment.',
  },
  {
    id: 'sba-express',
    name: 'SBA Express Line of Credit',
    family: 'SBA Programs',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Micro', 'Small Business'],
    terms: { rateRange: 'Prime + 4.5%–6.5%', termRange: '7 years (annual renewal)', amountRange: '$25K–$500K', collateral: 'Varies', guarantor: 'Personal' },
    description: 'Faster SBA approval process with revolving credit up to $500K. 7-year term with annual renewals for working capital needs.',
  },

  // ── Term Loans (1) ────────────────────────────────────────────────────────
  {
    id: 'term-loan',
    name: 'Chase Business Term Loan',
    family: 'Term Loans',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '6.5%–11%', termRange: '12–120 months', amountRange: '$25K–$500K', collateral: 'Blanket UCC', guarantor: 'Personal' },
    description: 'Fixed loan amounts up to $500K with predictable monthly payments. Use for equipment, expansion, or working capital.',
  },

  // ── Equipment Finance (1) ─────────────────────────────────────────────────
  {
    id: 'equipment-financing',
    name: 'Chase Equipment Financing',
    family: 'Equipment Finance',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '5.5%–9.5%', termRange: 'Aligned to useful life', amountRange: '$25K–$1M', collateral: 'Equipment', guarantor: 'Personal' },
    description: 'Equipment serves as collateral with terms aligned to useful life. 100% financing available for qualified borrowers with fast approval.',
  },

  // ── Treasury / Merchant Services (2) ──────────────────────────────────────
  {
    id: 'chase-quickaccept',
    name: 'Chase QuickAccept℠',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Micro', 'Small Business'],
    terms: { rateRange: '2.6% + $0.10 (card present)', termRange: 'Monthly', amountRange: 'No limit', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Flat-rate payment processing with Tap to Pay on iPhone, same-day deposits with Chase checking, no monthly fees or long-term contracts.',
  },
  {
    id: 'chase-payment-solutions',
    name: 'Chase Payment Solutions℠',
    family: 'Treasury',
    status: 'Pilot',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '2.6% + $0.10 / 2.9% + $0.25 (e-comm)', termRange: 'Monthly', amountRange: 'No limit', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Full merchant services suite: in-store, online, and mobile payment acceptance with advanced analytics, PCI compliance, and HIPAA-compliant InstaMed for healthcare.',
  },
];

// ============================================
// KPIs PER VIEW — Chase Scale (6M businesses)
// ============================================

const _chaseShelfKPIs: ProductKPI[] = [
  {
    id: 'total-active',
    label: 'Total Active Products',
    value: 16,
    format: 'number',
    trend: 2,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Products currently available to 6M+ business clients',
    dataSource: 'Product Management',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'pilot-products',
    label: 'Products in Pilot',
    value: 2,
    format: 'number',
    trend: 1,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Ink Business Premier℠ and Chase Payment Solutions℠ in expanded rollout',
    dataSource: 'Product Management',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'avg-revenue',
    label: 'Avg Revenue/Product',
    value: 156000000,
    format: 'currency',
    trend: 6.8,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average monthly revenue per active product line across 6M business clients',
    dataSource: 'Finance',
    lastUpdated: '1 day ago',
  },
  {
    id: 'adoption-rate',
    label: 'Customer Adoption Rate',
    value: 38.5,
    format: 'percent',
    trend: 2.4,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: '70% of 4.4M clients consider Chase their primary bank',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '2 hours ago',
  },
];

const _chasePenetrationKPIs: ProductKPI[] = [
  {
    id: 'overall-penetration',
    label: 'Overall Penetration',
    value: 45.8,
    format: 'percent',
    trend: 3.2,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Eligible businesses holding at least one Chase product',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'cross-sell-gap',
    label: 'Cross-Sell Gap',
    value: 1.4,
    format: 'number',
    trend: -0.2,
    trendDirection: 'down',
    isPositiveTrend: true,
    tooltip: 'Avg additional products per customer vs optimal (gap narrowing)',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'products-per-customer',
    label: 'Products/Customer',
    value: 2.6,
    format: 'number',
    trend: 0.3,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average products per active client across 4.4M primary relationships',
    dataSource: 'CRM',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'wallet-share',
    label: 'Wallet Share',
    value: 42.3,
    format: 'percent',
    trend: 2.1,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Estimated share of customer financial wallet — market leader at 42.3%',
    dataSource: 'Market Intelligence',
    lastUpdated: '1 day ago',
  },
];

const _chasePreQualKPIs: ProductKPI[] = [
  {
    id: 'total-prequal',
    label: 'Total Pre-Qualified',
    value: 4020000,
    format: 'number',
    trend: 8.5,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: '4.02M businesses meeting pre-qualification criteria (67% of portfolio)',
    dataSource: 'LumiqAI Signal Engine',
    lastUpdated: '30 mins ago',
  },
  {
    id: 'pct-likely',
    label: '% Likely',
    value: 62.5,
    format: 'percent',
    trend: 3.8,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Pre-qualified businesses rated as likely to qualify based on LumiqAI scoring',
    dataSource: 'LumiqAI Signal Engine',
    lastUpdated: '30 mins ago',
  },
  {
    id: 'pipeline-value',
    label: 'Pipeline Value',
    value: 29500000000,
    format: 'currency',
    trend: 12.4,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Estimated total value of pre-qualified pipeline across all product lines',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'avg-readiness',
    label: 'Avg Readiness Score',
    value: 74.8,
    format: 'score',
    trend: 2.1,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average LumiqAI readiness score across 4.02M pre-qualified pipeline',
    dataSource: 'LumiqAI Signal Engine',
    lastUpdated: '30 mins ago',
  },
];

const _chasePerformanceKPIs: ProductKPI[] = [
  {
    id: 'wtd-approval',
    label: 'Weighted Approval Rate',
    value: 78.2,
    format: 'percent',
    trend: 1.8,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Volume-weighted approval rate across all Chase business products',
    dataSource: 'Underwriting',
    lastUpdated: '15 mins ago',
  },
  {
    id: 'avg-ttd',
    label: 'Avg Time-to-Decision',
    value: 2.3,
    format: 'number',
    trend: -0.5,
    trendDirection: 'down',
    isPositiveTrend: true,
    tooltip: 'Average business days from application to decision — SBA Preferred Lender advantage',
    dataSource: 'Underwriting',
    lastUpdated: '15 mins ago',
  },
  {
    id: 'total-funded-30d',
    label: 'Total Funded (30d)',
    value: 18200000000,
    format: 'currency',
    trend: 9.4,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Total funded volume in last 30 days across 6M business clients',
    dataSource: 'Finance',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'portfolio-growth',
    label: 'Portfolio Growth',
    value: 4.5,
    format: 'percent',
    trend: 0.8,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Year-over-year outstanding balance growth',
    dataSource: 'Finance',
    lastUpdated: '1 day ago',
  },
];

// ============================================
// PENETRATION DATA — Chase Scale
// ============================================

const _chasePenetrationByProduct: PenetrationByProduct[] = [
  { product: 'Chase Business Complete Banking℠', family: 'Deposits', customersHolding: 4400000, eligibleCustomers: 5200000, penetrationRate: 84.6, crossSellGap: 15.4, revenueOpportunity: 144000000 },
  { product: 'Ink Business Credit Cards', family: 'Credit Cards', customersHolding: 3120000, eligibleCustomers: 4800000, penetrationRate: 65.0, crossSellGap: 35.0, revenueOpportunity: 840000000 },
  { product: 'Chase QuickAccept℠ / Payment Solutions℠', family: 'Treasury', customersHolding: 2640000, eligibleCustomers: 4200000, penetrationRate: 62.9, crossSellGap: 37.1, revenueOpportunity: 1560000000 },
  { product: 'Chase Business Savings', family: 'Deposits', customersHolding: 2280000, eligibleCustomers: 5200000, penetrationRate: 43.8, crossSellGap: 56.2, revenueOpportunity: 292000000 },
  { product: 'Chase Business Line of Credit', family: 'Lines of Credit', customersHolding: 1560000, eligibleCustomers: 3600000, penetrationRate: 43.3, crossSellGap: 56.7, revenueOpportunity: 2040000000 },
  { product: 'Chase Equipment Financing', family: 'Equipment Finance', customersHolding: 720000, eligibleCustomers: 2100000, penetrationRate: 34.3, crossSellGap: 65.7, revenueOpportunity: 1380000000 },
  { product: 'Chase Business Term Loan', family: 'Term Loans', customersHolding: 540000, eligibleCustomers: 1680000, penetrationRate: 32.1, crossSellGap: 67.9, revenueOpportunity: 1140000000 },
  { product: 'SBA Programs (7a/504/Express)', family: 'SBA Programs', customersHolding: 228000, eligibleCustomers: 900000, penetrationRate: 25.3, crossSellGap: 74.7, revenueOpportunity: 672000000 },
];

const _chaseSegmentPenetration: SegmentPenetration[] = [
  { segment: 'Micro (<$1M)', productsPerCustomer: 2.0, walletShare: 32.5, totalCustomers: 2520000 },
  { segment: 'Small ($1M–$10M)', productsPerCustomer: 2.8, walletShare: 45.8, totalCustomers: 2280000 },
  { segment: 'Mid-Market ($10M+)', productsPerCustomer: 4.2, walletShare: 58.3, totalCustomers: 1200000 },
];

const _chaseProductCrossSellFunnel: CrossSellFunnelStage[] = [
  { stage: 'Eligible for Additional Product', count: 4080000, conversionFromPrevious: 100, avgTimeInStage: 0 },
  { stage: 'Targeted by Campaign', count: 2448000, conversionFromPrevious: 60, avgTimeInStage: 5 },
  { stage: 'Engaged / Responded', count: 1469000, conversionFromPrevious: 60, avgTimeInStage: 8 },
  { stage: 'Applied', count: 881000, conversionFromPrevious: 60, avgTimeInStage: 12 },
  { stage: 'Approved & Booked', count: 661000, conversionFromPrevious: 75, avgTimeInStage: 3 },
];

// ============================================
// PRE-QUALIFICATION DATA — Chase Scale
// ============================================

const _chasePreQualReadiness: PreQualReadiness[] = [
  { product: 'Chase Business Line of Credit', likely: 252000, borderline: 108000, unlikely: 57000, total: 417000 },
  { product: 'Ink Business Credit Cards', likely: 408000, borderline: 132000, unlikely: 66000, total: 606000 },
  { product: 'Chase Business Term Loan', likely: 168000, borderline: 96000, unlikely: 72000, total: 336000 },
  { product: 'SBA 7(a) Loan', likely: 108000, borderline: 84000, unlikely: 54000, total: 246000 },
  { product: 'Chase Equipment Financing', likely: 132000, borderline: 78000, unlikely: 51000, total: 261000 },
  { product: 'Chase QuickAccept℠', likely: 276000, borderline: 108000, unlikely: 55000, total: 439000 },
];

const _chasePreQualCandidates: PreQualCandidate[] = [
  { businessName: 'Metro Dental Associates', industry: 'Healthcare', annualRevenue: 4200000, readinessScore: 92, readiness: 'Likely', topProduct: 'SBA 504 Loan', signals: ['Strong DSCR', 'PAYDEX 82', 'Stable Cash Flow'] },
  { businessName: 'Pacific Coast Builders', industry: 'Construction', annualRevenue: 8700000, readinessScore: 88, readiness: 'Likely', topProduct: 'Chase Equipment Financing', signals: ['Growing Revenue', 'FICO 780', 'Low Utilization'] },
  { businessName: 'Green Valley Restaurants', industry: 'Restaurants', annualRevenue: 2100000, readinessScore: 85, readiness: 'Likely', topProduct: 'Chase Business Line of Credit', signals: ['Positive Cash Trend', 'PAYDEX 78', '5yr Track Record'] },
  { businessName: 'TechForward Solutions', industry: 'Technology', annualRevenue: 12500000, readinessScore: 82, readiness: 'Likely', topProduct: 'Chase Commercial Line of Credit', signals: ['Strong Revenue', 'Low Leverage', 'FICO 760'] },
  { businessName: 'Midwest Auto Group', industry: 'Automotive', annualRevenue: 6300000, readinessScore: 78, readiness: 'Likely', topProduct: 'Chase Business Term Loan', signals: ['Stable Industry', 'PAYDEX 75', 'Growth Trend'] },
  { businessName: 'Sunrise Childcare Centers', industry: 'Education', annualRevenue: 1800000, readinessScore: 74, readiness: 'Borderline', topProduct: 'SBA 7(a) Loan', signals: ['DSCR 1.15', 'FICO 710', 'High Utilization'] },
  { businessName: 'Coastal Plumbing Services', industry: 'Services', annualRevenue: 950000, readinessScore: 71, readiness: 'Borderline', topProduct: 'Chase Business Term Loan', signals: ['Seasonal Revenue', 'PAYDEX 68', 'Limited History'] },
  { businessName: 'Elite Fitness Studios', industry: 'Recreation', annualRevenue: 680000, readinessScore: 65, readiness: 'Borderline', topProduct: 'SBA Express Line of Credit', signals: ['Growing Revenue', 'FICO 690', 'Short Track Record'] },
  { businessName: 'Downtown Print & Ship', industry: 'Retail', annualRevenue: 420000, readinessScore: 58, readiness: 'Unlikely', topProduct: 'Ink Business Unlimited®', signals: ['Declining Revenue', 'PAYDEX 55', 'High Leverage'] },
  { businessName: 'Valley Quick Lube', industry: 'Automotive', annualRevenue: 310000, readinessScore: 52, readiness: 'Unlikely', topProduct: 'Ink Business Unlimited®', signals: ['Low DSCR', 'FICO 620', 'Payment Delays'] },
];

// ============================================
// PERFORMANCE DATA — Chase Scale
// ============================================

const _chaseProductPerformance: ProductPerformanceRow[] = [
  { product: 'Ink Business Preferred®', family: 'Credit Cards', approvalRate: 78.5, fundingRate: 96.2, avgDealSize: 42000, avgTimeToDecision: 0.3, totalFunded30d: 2680000000, yoyGrowth: 14.2 },
  { product: 'Ink Business Cash®', family: 'Credit Cards', approvalRate: 82.1, fundingRate: 95.8, avgDealSize: 18000, avgTimeToDecision: 0.3, totalFunded30d: 1780000000, yoyGrowth: 16.8 },
  { product: 'Chase Business Line of Credit', family: 'Lines of Credit', approvalRate: 70.2, fundingRate: 89.5, avgDealSize: 145000, avgTimeToDecision: 2.8, totalFunded30d: 3420000000, yoyGrowth: 8.2 },
  { product: 'Chase Commercial Line of Credit', family: 'Lines of Credit', approvalRate: 74.8, fundingRate: 92.3, avgDealSize: 1250000, avgTimeToDecision: 4.5, totalFunded30d: 2100000000, yoyGrowth: 5.6 },
  { product: 'Chase Business Term Loan', family: 'Term Loans', approvalRate: 68.4, fundingRate: 87.2, avgDealSize: 195000, avgTimeToDecision: 3.8, totalFunded30d: 1840000000, yoyGrowth: 9.4 },
  { product: 'SBA 7(a) Loan', family: 'SBA Programs', approvalRate: 61.5, fundingRate: 80.8, avgDealSize: 485000, avgTimeToDecision: 12.5, totalFunded30d: 1120000000, yoyGrowth: 18.6 },
  { product: 'Chase Equipment Financing', family: 'Equipment Finance', approvalRate: 76.2, fundingRate: 93.4, avgDealSize: 178000, avgTimeToDecision: 2.2, totalFunded30d: 1340000000, yoyGrowth: 12.8 },
  { product: 'Chase QuickAccept℠', family: 'Treasury', approvalRate: 92.5, fundingRate: 98.2, avgDealSize: 0, avgTimeToDecision: 0.1, totalFunded30d: 3920000000, yoyGrowth: 24.5 },
];

const _chasePerformanceApplicationFunnel: ApplicationFunnelMetrics[] = [
  { product: 'All Products', preQualified: 4020000, applied: 2412000, approved: 1809000, funded: 1508000, preQualToApplyRate: 60, applyToApproveRate: 75, avgTimeToDecision: 2.3 },
  { product: 'Credit Cards', preQualified: 1680000, applied: 1344000, approved: 1142000, funded: 1086000, preQualToApplyRate: 80, applyToApproveRate: 85, avgTimeToDecision: 0.3 },
  { product: 'Lines of Credit', preQualified: 1020000, applied: 612000, approved: 428000, funded: 378000, preQualToApplyRate: 60, applyToApproveRate: 70, avgTimeToDecision: 3.5 },
  { product: 'Term Loans', preQualified: 720000, applied: 360000, approved: 252000, funded: 216000, preQualToApplyRate: 50, applyToApproveRate: 70, avgTimeToDecision: 3.8 },
  { product: 'SBA Programs', preQualified: 600000, applied: 240000, approved: 144000, funded: 112000, preQualToApplyRate: 40, applyToApproveRate: 60, avgTimeToDecision: 12.5 },
];

// ============================================
// ELIGIBILITY MATRIX — Real Chase Criteria
// ============================================

const _chaseEligibilityRules: EligibilityRule[] = [
  { product: 'Ink Business Unlimited®', family: 'Credit Cards', timeInBusiness: '1+ years', annualRevenue: 'Varies', dscr: 'N/A', paydex: '65+', fico: '670+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Payment Behavior'], policyNotes: 'No annual fee; 0% intro APR 12 months; auto-decisioned' },
  { product: 'Ink Business Cash®', family: 'Credit Cards', timeInBusiness: '1+ years', annualRevenue: 'Varies', dscr: 'N/A', paydex: '65+', fico: '670+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Payment Behavior'], policyNotes: 'No annual fee; 5% on office/internet/phone; 0% intro APR 12 months' },
  { product: 'Ink Business Preferred®', family: 'Credit Cards', timeInBusiness: '2+ years', annualRevenue: '$250K+', dscr: 'N/A', paydex: '72+', fico: '720+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Revenue Growth'], policyNotes: '$95 annual fee; 3X on $150K travel/shipping/internet/advertising' },
  { product: 'Ink Business Premier℠', family: 'Credit Cards', timeInBusiness: '2+ years', annualRevenue: '$500K+', dscr: 'N/A', paydex: '75+', fico: '740+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Revenue Growth', 'Strong Cash Flow'], policyNotes: '$195 annual fee; charge card model — balance must be paid in full monthly' },
  { product: 'Chase Business Line of Credit', family: 'Lines of Credit', timeInBusiness: '2+ years', annualRevenue: '$500K+', dscr: '1.15+', paydex: '65+', fico: '680+', maxLTV: 'N/A', collateral: 'Blanket UCC', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Utilization Rate'], policyNotes: 'Same majority ownership for 2+ yrs; annual fee waived yr 1 at 40%+ util' },
  { product: 'Chase Commercial Line of Credit', family: 'Lines of Credit', timeInBusiness: '3+ years', annualRevenue: '$2M+', dscr: '1.25+', paydex: '72+', fico: '720+', maxLTV: 'N/A', collateral: 'A/R + Inventory', guarantor: 'Corporate', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Revenue Growth', 'A/R Aging'], policyNotes: '2-year revolving term; 0.15% origination (max $3K); dedicated RM required' },
  { product: 'Chase Business Term Loan', family: 'Term Loans', timeInBusiness: '2+ years', annualRevenue: '$500K+', dscr: '1.20+', paydex: '65+', fico: '680+', maxLTV: 'N/A', collateral: 'Blanket UCC', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Revenue Trend'], policyNotes: 'Fixed and variable rates; terms up to 10 years; apply in-branch or via RM' },
  { product: 'SBA 7(a) Loan', family: 'SBA Programs', timeInBusiness: '2+ years', annualRevenue: '$250K+', dscr: '1.15+', paydex: '60+', fico: '680+', maxLTV: '85%', collateral: 'Available Assets', guarantor: 'Personal (20%+)', requiredSignals: ['Cash Flow Stability', 'DSCR', 'SBA Eligibility'], policyNotes: 'Chase is SBA Preferred Lender; up to $5M; 10–25 yr terms; no passive income' },
  { product: 'SBA 504 Loan', family: 'SBA Programs', timeInBusiness: '2+ years', annualRevenue: '$500K+', dscr: '1.20+', paydex: '65+', fico: '680+', maxLTV: '90%', collateral: 'Real Estate/Equipment', guarantor: 'Personal (20%+)', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Job Creation Plan'], policyNotes: '50/40/10 structure; owner-occupied 51%+; 1 job per $75K borrowed' },
  { product: 'SBA Express Line of Credit', family: 'SBA Programs', timeInBusiness: '2+ years', annualRevenue: 'Varies', dscr: '1.10+', paydex: '60+', fico: '680+', maxLTV: 'N/A', collateral: 'Varies', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'SBA Eligibility'], policyNotes: 'Faster SBA approval; up to $500K; 7-year term with annual renewals' },
  { product: 'Chase Equipment Financing', family: 'Equipment Finance', timeInBusiness: '2+ years', annualRevenue: '$500K+', dscr: '1.15+', paydex: '65+', fico: '670+', maxLTV: '100%', collateral: 'Equipment', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Equipment Valuation'], policyNotes: 'Equipment as collateral; terms aligned to useful life; 100% financing available' },
  { product: 'Chase Business Complete Banking℠', family: 'Deposits', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: 'No min opening deposit; $15/mo fee waived at $2K daily balance' },
  { product: 'Chase Performance Business Checking℠', family: 'Deposits', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: '$40/mo fee waived at $35K avg balance across linked business accounts' },
  { product: 'Chase Platinum Business Checking℠', family: 'Deposits', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: '$95/mo fee waived at $100K combined balance or $50K + Chase Private Client' },
  { product: 'Chase Business Total Savings℠', family: 'Deposits', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: '$10/mo fee waived at $1K balance; Autosave auto-transfer feature' },
  { product: 'Chase QuickAccept℠', family: 'Treasury', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'Business Verification'], policyNotes: '2.6% + $0.10 card present; same-day deposits with Chase checking; no monthly fees' },
  { product: 'Chase Payment Solutions℠', family: 'Treasury', timeInBusiness: '1+ years', annualRevenue: '$100K+', dscr: 'N/A', paydex: '55+', fico: '620+', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'Personal', requiredSignals: ['Identity Verified', 'Business Verification', 'Processing History'], policyNotes: 'Full merchant suite; PCI compliance required; HIPAA-compliant InstaMed for healthcare' },
];

// ============================================
// BANK-SWITCHED EXPORTS
// ============================================

export const mockBankProducts: BankProduct[] = ({ chase: _chaseBankProducts, wellsfargo: WF_BANK_PRODUCTS, santander: SANT_BANK_PRODUCTS, citi: CITI_BANK_PRODUCTS } as Record<string, BankProduct[]>)[ACTIVE_BANK_ID] ?? _chaseBankProducts;
export const mockShelfKPIs: ProductKPI[] = ({ chase: _chaseShelfKPIs, wellsfargo: WF_SHELF_KPIS, santander: SANT_SHELF_KPIS, citi: CITI_SHELF_KPIS } as Record<string, ProductKPI[]>)[ACTIVE_BANK_ID] ?? _chaseShelfKPIs;
export const mockPenetrationKPIs: ProductKPI[] = ({ chase: _chasePenetrationKPIs, wellsfargo: WF_PENETRATION_KPIS, santander: SANT_PENETRATION_KPIS, citi: CITI_PENETRATION_KPIS } as Record<string, ProductKPI[]>)[ACTIVE_BANK_ID] ?? _chasePenetrationKPIs;
export const mockPreQualKPIs: ProductKPI[] = ({ chase: _chasePreQualKPIs, wellsfargo: WF_PREQUAL_KPIS, santander: SANT_PREQUAL_KPIS, citi: CITI_PREQUAL_KPIS } as Record<string, ProductKPI[]>)[ACTIVE_BANK_ID] ?? _chasePreQualKPIs;
export const mockPerformanceKPIs: ProductKPI[] = ({ chase: _chasePerformanceKPIs, wellsfargo: WF_PERFORMANCE_KPIS, santander: SANT_PERFORMANCE_KPIS, citi: CITI_PERFORMANCE_KPIS } as Record<string, ProductKPI[]>)[ACTIVE_BANK_ID] ?? _chasePerformanceKPIs;
export const mockPenetrationByProduct: PenetrationByProduct[] = ({ chase: _chasePenetrationByProduct, wellsfargo: WF_PENETRATION_BY_PRODUCT, santander: SANT_PENETRATION_BY_PRODUCT, citi: CITI_PENETRATION_BY_PRODUCT } as Record<string, PenetrationByProduct[]>)[ACTIVE_BANK_ID] ?? _chasePenetrationByProduct;
export const mockSegmentPenetration: SegmentPenetration[] = ({ chase: _chaseSegmentPenetration, wellsfargo: WF_SEGMENT_PENETRATION, santander: SANT_SEGMENT_PENETRATION, citi: CITI_SEGMENT_PENETRATION } as Record<string, SegmentPenetration[]>)[ACTIVE_BANK_ID] ?? _chaseSegmentPenetration;
export const mockProductCrossSellFunnel: CrossSellFunnelStage[] = ({ chase: _chaseProductCrossSellFunnel, wellsfargo: WF_PRODUCT_CROSS_SELL_FUNNEL, santander: SANT_PRODUCT_CROSS_SELL_FUNNEL, citi: CITI_PRODUCT_CROSS_SELL_FUNNEL } as Record<string, CrossSellFunnelStage[]>)[ACTIVE_BANK_ID] ?? _chaseProductCrossSellFunnel;
export const mockPreQualReadiness: PreQualReadiness[] = ({ chase: _chasePreQualReadiness, wellsfargo: WF_PREQUAL_READINESS, santander: SANT_PREQUAL_READINESS, citi: CITI_PREQUAL_READINESS } as Record<string, PreQualReadiness[]>)[ACTIVE_BANK_ID] ?? _chasePreQualReadiness;
export const mockPreQualCandidates: PreQualCandidate[] = ({ chase: _chasePreQualCandidates, wellsfargo: WF_PREQUAL_CANDIDATES, santander: SANT_PREQUAL_CANDIDATES, citi: CITI_PREQUAL_CANDIDATES } as Record<string, PreQualCandidate[]>)[ACTIVE_BANK_ID] ?? _chasePreQualCandidates;
export const mockProductPerformance: ProductPerformanceRow[] = ({ chase: _chaseProductPerformance, wellsfargo: WF_PRODUCT_PERFORMANCE, santander: SANT_PRODUCT_PERFORMANCE, citi: CITI_PRODUCT_PERFORMANCE } as Record<string, ProductPerformanceRow[]>)[ACTIVE_BANK_ID] ?? _chaseProductPerformance;
export const mockPerformanceApplicationFunnel: ApplicationFunnelMetrics[] = ({ chase: _chasePerformanceApplicationFunnel, wellsfargo: WF_PERFORMANCE_APP_FUNNEL, santander: SANT_PERFORMANCE_APP_FUNNEL, citi: CITI_PERFORMANCE_APP_FUNNEL } as Record<string, ApplicationFunnelMetrics[]>)[ACTIVE_BANK_ID] ?? _chasePerformanceApplicationFunnel;
export const mockEligibilityRules: EligibilityRule[] = ({ chase: _chaseEligibilityRules, wellsfargo: WF_ELIGIBILITY_RULES, santander: SANT_ELIGIBILITY_RULES, citi: CITI_ELIGIBILITY_RULES } as Record<string, EligibilityRule[]>)[ACTIVE_BANK_ID] ?? _chaseEligibilityRules;
