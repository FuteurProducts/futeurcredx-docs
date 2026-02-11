// Enterprise Products Data - Santander product portfolio (real products from research)

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
// PRODUCT CATALOG — 23 Real Santander Products
// ============================================

export const SANT_BANK_PRODUCTS: BankProduct[] = [
  // ── Deposits (5) ──────────────────────────────────────────────────────────
  {
    id: 'basic-business-checking',
    name: 'Basic Business Checking',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Startup', 'Micro'],
    terms: { rateRange: '0.01% APY', termRange: 'Demand', amountRange: '$50 min opening deposit', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Entry-level checking with no monthly maintenance fee, 100 free transactions per statement cycle, and unlimited digital transactions. Designed for startups and micro businesses in the Northeast.',
  },
  {
    id: 'business-checking',
    name: 'Business Checking',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business'],
    terms: { rateRange: '0.02% APY', termRange: 'Demand', amountRange: '$100 min opening deposit', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Mid-tier checking with 200 free monthly transactions, Business Online Banking, and mobile deposit. Waive $15 monthly fee with $5K minimum balance.',
  },
  {
    id: 'business-checking-plus',
    name: 'Business Checking Plus',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: '0.05% APY', termRange: 'Demand', amountRange: '$500 min opening deposit', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Premium checking with 500 free monthly transactions, digital check deposit, and dedicated relationship manager. Waive $25 monthly fee with $25K minimum balance.',
  },
  {
    id: 'business-money-market-savings',
    name: 'Business Money Market Savings',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '0.10%–3.50% APY', termRange: 'Demand', amountRange: '$2.5K min opening deposit', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Competitive interest-bearing savings with tiered APY rates, 6 free transactions per statement cycle, and online access. Waive fees with $10K minimum balance.',
  },
  {
    id: 'business-certificates-of-deposit',
    name: 'Business Certificates of Deposit',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Startup', 'Micro', 'Small Business'],
    terms: { rateRange: '0.50%–5.00% APY', termRange: '3mo–5yr', amountRange: '$1K minimum', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Fixed-rate CDs with terms from 3 months to 5 years. FDIC insured with guaranteed returns. Early withdrawal penalties apply.',
  },

  // ── Credit Products (9) ───────────────────────────────────────────────────
  {
    id: 'business-line-of-credit',
    name: 'Business Line of Credit',
    family: 'Lines of Credit',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: 'Prime + 1.75%–4.25%', termRange: 'Revolving', amountRange: '$10K–$500K', collateral: 'Blanket UCC', guarantor: 'Personal' },
    description: 'Revolving credit line with flexible draw schedules. Pay interest only on funds used. No origination fee for lines under $500K. Annual fee waived first year.',
  },
  {
    id: 'business-term-loan',
    name: 'Business Term Loan',
    family: 'Term Loans',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '6.75%–11.5%', termRange: '12–84 months', amountRange: '$10K–$1M', collateral: 'Blanket UCC', guarantor: 'Personal' },
    description: 'Fixed-rate term loans for equipment, expansion, or working capital. Predictable monthly payments with terms up to 7 years. Same-day pre-approval available.',
  },
  {
    id: 'sba-7a-loan',
    name: 'SBA 7(a) Loan',
    family: 'SBA Programs',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: 'Prime + 2.25%–2.75%', termRange: '10–25 years', amountRange: 'Up to $5M', collateral: 'Available Assets', guarantor: 'Personal (20%+)' },
    description: 'SBA-guaranteed financing with low down payments and long terms. Santander is an SBA Preferred Lender for faster approvals. Flexible use including real estate, equipment, and working capital.',
  },
  {
    id: 'sba-express-line-of-credit',
    name: 'SBA Express Line of Credit',
    family: 'SBA Programs',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Micro', 'Small Business'],
    terms: { rateRange: 'Prime + 4.25%–6.5%', termRange: '7 years (annual renewal)', amountRange: 'Up to $500K', collateral: 'Varies', guarantor: 'Personal' },
    description: 'Fast-track SBA approval with revolving credit up to $500K. 7-year term with annual renewals. Ideal for working capital and seasonal cash flow needs.',
  },
  {
    id: 'equipment-financing',
    name: 'Equipment Financing',
    family: 'Equipment Finance',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '5.75%–10%', termRange: 'Aligned to useful life', amountRange: '$25K+', collateral: 'Equipment', guarantor: 'Personal' },
    description: '100% financing available for businesses with 2+ years of operations. Equipment serves as collateral with terms aligned to asset useful life. Fast approval process.',
  },
  {
    id: 'commercial-real-estate-mortgage',
    name: 'Commercial Real Estate Mortgage',
    family: 'Commercial Real Estate',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Varies by structure', termRange: '5–25 years', amountRange: '$500K+', collateral: 'Real Estate', guarantor: 'Corporate/Personal' },
    description: 'Up to 80% LTV for owner-occupied commercial real estate. Fixed and adjustable rate options. Property types include office, retail, industrial, and mixed-use.',
  },
  {
    id: 'commercial-vehicle-financing',
    name: 'Commercial Vehicle Financing',
    family: 'Commercial Auto',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '5.5%–9.5%', termRange: '24–84 months', amountRange: '$15K+', collateral: 'Vehicle', guarantor: 'Personal/Corporate' },
    description: '50+ years of expertise in commercial vehicle financing. Trucks, vans, trailers, and specialty vehicles. Competitive rates with flexible terms aligned to vehicle life.',
  },
  {
    id: 'small-business-vehicle-financing',
    name: 'Small Business Vehicle Financing',
    family: 'Commercial Auto',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Startup', 'Micro', 'Small Business'],
    terms: { rateRange: '6.5%–12%', termRange: '24–72 months', amountRange: '$10K+', collateral: 'Vehicle', guarantor: 'Personal' },
    description: 'Powered by Santander Consumer USA for small fleets (under 10 vehicles). New and used vehicle financing. Online application with fast decision.',
  },
  {
    id: 'healthcare-equipment-financing',
    name: 'Healthcare Equipment Financing',
    family: 'Equipment Finance',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '5.25%–9.75%', termRange: 'Aligned to useful life', amountRange: '$50K+', collateral: 'Medical Equipment', guarantor: 'Personal' },
    description: 'Specialized financing for medical and dental equipment. Terms aligned to technology life cycle. Covers diagnostic equipment, imaging systems, dental chairs, and practice management systems.',
  },

  // ── Cards (2) ─────────────────────────────────────────────────────────────
  {
    id: 'business-debit-mastercard',
    name: 'Business Debit Mastercard',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Startup', 'Micro', 'Small Business'],
    terms: { rateRange: 'N/A', termRange: 'N/A', amountRange: 'Linked to checking', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Included with all business checking accounts. Contactless payment with EMV chip security. Fraud monitoring and zero liability protection. Multiple cards available for employees.',
  },
  {
    id: 'commercial-card-solutions',
    name: 'Commercial Card Solutions',
    family: 'Credit Cards',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Custom pricing', termRange: 'Monthly statement', amountRange: 'Subject to approval', collateral: 'Unsecured', guarantor: 'Corporate' },
    description: 'Corporate card programs with centralized billing, spend controls, and detailed reporting. Mastercard acceptance worldwide with fraud protection and travel insurance.',
  },

  // ── Treasury/Digital (5) ──────────────────────────────────────────────────
  {
    id: 'treasury-fusion',
    name: 'Treasury Fusion',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Custom pricing', termRange: 'Monthly', amountRange: 'Enterprise', collateral: 'N/A', guarantor: 'N/A' },
    description: 'ERP integration platform connecting to SAP, Oracle, QuickBooks, and major accounting systems. Real-time cash positioning, automated reconciliation, and payment workflows.',
  },
  {
    id: 'santander-cash-nexus',
    name: 'Santander Cash Nexus',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Corporate'],
    terms: { rateRange: 'Custom pricing', termRange: 'Ongoing', amountRange: 'Enterprise', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Global treasury management via Santander Corporate & Investment Banking. Multi-currency accounts, global cash pooling, FX hedging, and liquidity management for international operations.',
  },
  {
    id: 'business-online-banking',
    name: 'Business Online Banking',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Startup', 'Micro', 'Small Business', 'Mid-Market'],
    terms: { rateRange: 'Free', termRange: 'N/A', amountRange: 'N/A', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Comprehensive online and mobile banking with account management, bill pay, wire transfers, ACH, remote deposit capture, and user access controls. Multi-factor authentication included.',
  },
  {
    id: 'digital-checks',
    name: 'Digital Checks',
    family: 'Treasury',
    status: 'Pilot',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: 'Free', termRange: 'N/A', amountRange: 'N/A', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Launched in 2024. Create, send, and track digital checks via online banking. Recipients can deposit via mobile or print. Faster than mail with same legal standing as paper checks.',
  },
  {
    id: 'santander-merchant-services',
    name: 'Santander Merchant Services',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Micro', 'Small Business', 'Mid-Market'],
    terms: { rateRange: '2.5% + $0.15 (card present)', termRange: 'Monthly', amountRange: 'No limit', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Powered by Clover. POS terminals, online payment processing, and mobile payments. Next-day deposits, inventory management, and sales reporting. No long-term contract required.',
  },

  // ── International (2) ─────────────────────────────────────────────────────
  {
    id: 'international-trade-finance',
    name: 'International Trade Finance',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Custom pricing', termRange: 'Transaction-based', amountRange: 'Varies', collateral: 'Varies', guarantor: 'Corporate' },
    description: 'Letters of credit, supply chain finance, import/export financing, and trade guarantees. Leverage Santander\'s global network for international trade documentation and settlement.',
  },
  {
    id: 'foreign-exchange-services',
    name: 'Foreign Exchange (FX) Services',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Market-based pricing', termRange: 'Transaction-based', amountRange: 'Varies', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Competitive FX rates with spot, forward, and hedging products. 150+ currencies via Santander global network. Real-time execution with dedicated FX specialist support.',
  },
];

// ============================================
// KPIs PER VIEW — Santander Scale (180K businesses, $8B exposure)
// ============================================

export const SANT_SHELF_KPIS: ProductKPI[] = [
  {
    id: 'total-active',
    label: 'Total Active Products',
    value: 22,
    format: 'number',
    trend: 1,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Products currently available to 180K+ business clients in Northeast',
    dataSource: 'Product Management',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'pilot-products',
    label: 'Products in Pilot',
    value: 1,
    format: 'number',
    trend: 1,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Digital Checks launched 2024 in pilot rollout',
    dataSource: 'Product Management',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'avg-revenue',
    label: 'Avg Revenue/Product',
    value: 7800000,
    format: 'currency',
    trend: 5.4,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average monthly revenue per active product line across 180K business clients',
    dataSource: 'Finance',
    lastUpdated: '1 day ago',
  },
  {
    id: 'adoption-rate',
    label: 'Customer Adoption Rate',
    value: 36.2,
    format: 'percent',
    trend: 2.3,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Strong Northeast market presence with focused regional strategy',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '2 hours ago',
  },
];

export const SANT_PENETRATION_KPIS: ProductKPI[] = [
  {
    id: 'overall-penetration',
    label: 'Overall Penetration',
    value: 43.5,
    format: 'percent',
    trend: 2.9,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Eligible businesses holding at least one Santander product',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'cross-sell-gap',
    label: 'Cross-Sell Gap',
    value: 1.6,
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
    value: 2.4,
    format: 'number',
    trend: 0.3,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average products per active client across 180K business relationships',
    dataSource: 'CRM',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'wallet-share',
    label: 'Wallet Share',
    value: 39.8,
    format: 'percent',
    trend: 2.2,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Estimated share of customer financial wallet in Northeast footprint',
    dataSource: 'Market Intelligence',
    lastUpdated: '1 day ago',
  },
];

export const SANT_PREQUAL_KPIS: ProductKPI[] = [
  {
    id: 'total-prequal',
    label: 'Total Pre-Qualified',
    value: 117000,
    format: 'number',
    trend: 7.8,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: '117K businesses meeting pre-qualification criteria (65% of portfolio)',
    dataSource: 'LUMIQ AI Signal Engine',
    lastUpdated: '30 mins ago',
  },
  {
    id: 'pct-likely',
    label: '% Likely',
    value: 60.5,
    format: 'percent',
    trend: 3.4,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Pre-qualified businesses rated as likely to qualify based on LUMIQ scoring',
    dataSource: 'LUMIQ AI Signal Engine',
    lastUpdated: '30 mins ago',
  },
  {
    id: 'pipeline-value',
    label: 'Pipeline Value',
    value: 1280000000,
    format: 'currency',
    trend: 11.2,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Estimated total value of pre-qualified pipeline across all product lines',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'avg-readiness',
    label: 'Avg Readiness Score',
    value: 73.2,
    format: 'score',
    trend: 2.0,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average LUMIQ readiness score across 117K pre-qualified pipeline',
    dataSource: 'LUMIQ AI Signal Engine',
    lastUpdated: '30 mins ago',
  },
];

export const SANT_PERFORMANCE_KPIS: ProductKPI[] = [
  {
    id: 'wtd-approval',
    label: 'Weighted Approval Rate',
    value: 68.5,
    format: 'percent',
    trend: 1.6,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Volume-weighted approval rate across all Santander business products',
    dataSource: 'Underwriting',
    lastUpdated: '15 mins ago',
  },
  {
    id: 'avg-ttd',
    label: 'Avg Time-to-Decision',
    value: 2.8,
    format: 'number',
    trend: -0.4,
    trendDirection: 'down',
    isPositiveTrend: true,
    tooltip: 'Average business days from application to decision — SBA Preferred Lender advantage',
    dataSource: 'Underwriting',
    lastUpdated: '15 mins ago',
  },
  {
    id: 'total-funded-30d',
    label: 'Total Funded (30d)',
    value: 680000000,
    format: 'currency',
    trend: 8.6,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Total funded volume in last 30 days across 180K business clients',
    dataSource: 'Finance',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'portfolio-growth',
    label: 'Portfolio Growth',
    value: 4.2,
    format: 'percent',
    trend: 0.7,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Year-over-year outstanding balance growth',
    dataSource: 'Finance',
    lastUpdated: '1 day ago',
  },
];

// ============================================
// PENETRATION DATA — Santander Scale (180K businesses)
// ============================================

export const SANT_PENETRATION_BY_PRODUCT: PenetrationByProduct[] = [
  { product: 'Business Checking (All Tiers)', family: 'Deposits', customersHolding: 144000, eligibleCustomers: 170000, penetrationRate: 84.7, crossSellGap: 15.3, revenueOpportunity: 5200000 },
  { product: 'Business Debit Mastercard', family: 'Treasury', customersHolding: 144000, eligibleCustomers: 170000, penetrationRate: 84.7, crossSellGap: 15.3, revenueOpportunity: 2600000 },
  { product: 'Santander Merchant Services', family: 'Treasury', customersHolding: 72000, eligibleCustomers: 126000, penetrationRate: 57.1, crossSellGap: 42.9, revenueOpportunity: 54000000 },
  { product: 'Business Savings / Money Market', family: 'Deposits', customersHolding: 63000, eligibleCustomers: 170000, penetrationRate: 37.1, crossSellGap: 62.9, revenueOpportunity: 10700000 },
  { product: 'Business Line of Credit', family: 'Lines of Credit', customersHolding: 45000, eligibleCustomers: 108000, penetrationRate: 41.7, crossSellGap: 58.3, revenueOpportunity: 63000000 },
  { product: 'Equipment Financing (All)', family: 'Equipment Finance', customersHolding: 18000, eligibleCustomers: 63000, penetrationRate: 28.6, crossSellGap: 71.4, revenueOpportunity: 45000000 },
  { product: 'Business Term Loan', family: 'Term Loans', customersHolding: 14400, eligibleCustomers: 54000, penetrationRate: 26.7, crossSellGap: 73.3, revenueOpportunity: 39600000 },
  { product: 'SBA Programs (7a/Express)', family: 'SBA Programs', customersHolding: 7200, eligibleCustomers: 27000, penetrationRate: 26.7, crossSellGap: 73.3, revenueOpportunity: 19800000 },
];

export const SANT_SEGMENT_PENETRATION: SegmentPenetration[] = [
  { segment: 'Micro (<$1M)', productsPerCustomer: 1.9, walletShare: 31.2, totalCustomers: 81000 },
  { segment: 'Small ($1M–$10M)', productsPerCustomer: 2.6, walletShare: 43.4, totalCustomers: 63000 },
  { segment: 'Mid-Market ($10M+)', productsPerCustomer: 3.9, walletShare: 55.8, totalCustomers: 36000 },
];

export const SANT_PRODUCT_CROSS_SELL_FUNNEL: CrossSellFunnelStage[] = [
  { stage: 'Eligible for Additional Product', count: 126000, conversionFromPrevious: 100, avgTimeInStage: 0 },
  { stage: 'Targeted by Campaign', count: 73000, conversionFromPrevious: 58, avgTimeInStage: 6 },
  { stage: 'Engaged / Responded', count: 42000, conversionFromPrevious: 58, avgTimeInStage: 9 },
  { stage: 'Applied', count: 24400, conversionFromPrevious: 58, avgTimeInStage: 13 },
  { stage: 'Approved & Booked', count: 17000, conversionFromPrevious: 70, avgTimeInStage: 4 },
];

// ============================================
// PRE-QUALIFICATION DATA — Santander Scale
// ============================================

export const SANT_PREQUAL_READINESS: PreQualReadiness[] = [
  { product: 'Business Line of Credit', likely: 7500, borderline: 3400, unlikely: 1900, total: 12800 },
  { product: 'Commercial Card Solutions', likely: 12200, borderline: 4300, unlikely: 2300, total: 18800 },
  { product: 'Business Term Loan', likely: 5200, borderline: 2900, unlikely: 2100, total: 10200 },
  { product: 'SBA 7(a) Loan', likely: 3400, borderline: 2600, unlikely: 1700, total: 7700 },
  { product: 'Equipment Financing', likely: 4000, borderline: 2400, unlikely: 1500, total: 7900 },
  { product: 'Santander Merchant Services', likely: 8500, borderline: 3500, unlikely: 1800, total: 13800 },
];

export const SANT_PREQUAL_CANDIDATES: PreQualCandidate[] = [
  { businessName: 'Boston Medical Imaging', industry: 'Healthcare', annualRevenue: 6200000, readinessScore: 94, readiness: 'Likely', topProduct: 'Healthcare Equipment Financing', signals: ['Strong DSCR', 'PAYDEX 86', 'MA Market Leader'] },
  { businessName: 'Northeast Construction Supply', industry: 'Construction', annualRevenue: 9800000, readinessScore: 90, readiness: 'Likely', topProduct: 'Commercial Real Estate Mortgage', signals: ['Growing Revenue', 'FICO 785', 'Low Leverage'] },
  { businessName: 'Hartford Auto Fleet', industry: 'Automotive', annualRevenue: 5400000, readinessScore: 87, readiness: 'Likely', topProduct: 'Commercial Vehicle Financing', signals: ['Fleet Growth', 'PAYDEX 81', '50yr Industry Expertise'] },
  { businessName: 'New England Dental Partners', industry: 'Healthcare', annualRevenue: 3800000, readinessScore: 84, readiness: 'Likely', topProduct: 'SBA 7(a) Loan', signals: ['Stable Cash Flow', 'FICO 765', 'Practice Expansion'] },
  { businessName: 'Rhode Island Manufacturing Co.', industry: 'Manufacturing', annualRevenue: 11200000, readinessScore: 81, readiness: 'Likely', topProduct: 'Business Line of Credit', signals: ['Strong Revenue', 'PAYDEX 77', 'Treasury Fusion Ready'] },
  { businessName: 'Connecticut Food Distributors', industry: 'Distribution', annualRevenue: 2600000, readinessScore: 76, readiness: 'Borderline', topProduct: 'Equipment Financing', signals: ['DSCR 1.16', 'FICO 720', 'High Utilization'] },
  { businessName: 'Worcester Tech Services', industry: 'Technology', annualRevenue: 1400000, readinessScore: 72, readiness: 'Borderline', topProduct: 'Business Term Loan', signals: ['Seasonal Revenue', 'PAYDEX 71', 'Client 4yr'] },
  { businessName: 'New Hampshire Childcare Group', industry: 'Education', annualRevenue: 920000, readinessScore: 67, readiness: 'Borderline', topProduct: 'SBA Express Line of Credit', signals: ['Growing Revenue', 'FICO 700', 'Short Track Record'] },
  { businessName: 'Delaware Print Solutions', industry: 'Retail', annualRevenue: 580000, readinessScore: 59, readiness: 'Unlikely', topProduct: 'Business Debit Mastercard', signals: ['Declining Revenue', 'PAYDEX 56', 'High Leverage'] },
  { businessName: 'Pennsylvania Quick Oil', industry: 'Automotive', annualRevenue: 380000, readinessScore: 53, readiness: 'Unlikely', topProduct: 'Business Debit Mastercard', signals: ['Low DSCR', 'FICO 630', 'Payment Delays'] },
];

// ============================================
// PERFORMANCE DATA — Santander Scale
// ============================================

export const SANT_PRODUCT_PERFORMANCE: ProductPerformanceRow[] = [
  { product: 'Commercial Card Solutions', family: 'Credit Cards', approvalRate: 74.2, fundingRate: 96.4, avgDealSize: 75000, avgTimeToDecision: 1.1, totalFunded30d: 98000000, yoyGrowth: 12.8 },
  { product: 'Business Line of Credit', family: 'Lines of Credit', approvalRate: 66.8, fundingRate: 89.2, avgDealSize: 135000, avgTimeToDecision: 3.0, totalFunded30d: 125000000, yoyGrowth: 8.4 },
  { product: 'Business Term Loan', family: 'Term Loans', approvalRate: 64.2, fundingRate: 87.6, avgDealSize: 185000, avgTimeToDecision: 3.6, totalFunded30d: 96000000, yoyGrowth: 9.8 },
  { product: 'SBA 7(a) Loan', family: 'SBA Programs', approvalRate: 58.4, fundingRate: 79.8, avgDealSize: 420000, avgTimeToDecision: 13.2, totalFunded30d: 68000000, yoyGrowth: 16.4 },
  { product: 'Equipment Financing', family: 'Equipment Finance', approvalRate: 72.6, fundingRate: 92.8, avgDealSize: 165000, avgTimeToDecision: 2.5, totalFunded30d: 74000000, yoyGrowth: 11.2 },
  { product: 'Healthcare Equipment Financing', family: 'Equipment Finance', approvalRate: 76.8, fundingRate: 94.2, avgDealSize: 245000, avgTimeToDecision: 2.2, totalFunded30d: 52000000, yoyGrowth: 14.6 },
  { product: 'Commercial Vehicle Financing', family: 'Commercial Auto', approvalRate: 70.4, fundingRate: 91.6, avgDealSize: 85000, avgTimeToDecision: 1.8, totalFunded30d: 48000000, yoyGrowth: 10.2 },
  { product: 'Santander Merchant Services', family: 'Treasury', approvalRate: 90.2, fundingRate: 98.4, avgDealSize: 0, avgTimeToDecision: 0.2, totalFunded30d: 119000000, yoyGrowth: 22.8 },
];

export const SANT_PERFORMANCE_APP_FUNNEL: ApplicationFunnelMetrics[] = [
  { product: 'All Products', preQualified: 117000, applied: 65500, approved: 47000, funded: 38500, preQualToApplyRate: 56, applyToApproveRate: 72, avgTimeToDecision: 2.8 },
  { product: 'Credit Cards', preQualified: 48600, applied: 36500, approved: 28800, funded: 27400, preQualToApplyRate: 75, applyToApproveRate: 79, avgTimeToDecision: 1.1 },
  { product: 'Lines of Credit', preQualified: 29900, applied: 16400, approved: 10800, funded: 9400, preQualToApplyRate: 55, applyToApproveRate: 66, avgTimeToDecision: 3.0 },
  { product: 'Term Loans', preQualified: 20900, applied: 9400, approved: 5600, funded: 4900, preQualToApplyRate: 45, applyToApproveRate: 60, avgTimeToDecision: 3.6 },
  { product: 'SBA Programs', preQualified: 17600, applied: 6200, approved: 3400, funded: 2700, preQualToApplyRate: 35, applyToApproveRate: 55, avgTimeToDecision: 13.2 },
];

// ============================================
// ELIGIBILITY MATRIX — Real Santander Criteria
// ============================================

export const SANT_ELIGIBILITY_RULES: EligibilityRule[] = [
  // Deposits
  { product: 'Basic Business Checking', family: 'Deposits', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: 'No monthly fee; 100 free transactions; $50 min opening deposit; ideal for startups' },
  { product: 'Business Checking', family: 'Deposits', timeInBusiness: 'Established', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: '$15/mo fee waived at $5K min balance; 200 free transactions; online banking included' },
  { product: 'Business Checking Plus', family: 'Deposits', timeInBusiness: 'Established', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: '$25/mo fee waived at $25K min balance; 500 free transactions; dedicated relationship manager' },
  { product: 'Business Money Market Savings', family: 'Deposits', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: '0.10%–3.50% APY tiered; $2.5K min opening; waive fees at $10K min balance; 6 free transactions' },
  { product: 'Business Certificates of Deposit', family: 'Deposits', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: '3mo–5yr terms; 0.50%–5.00% APY; $1K minimum; FDIC insured; early withdrawal penalties' },

  // Credit Products
  { product: 'Business Line of Credit', family: 'Lines of Credit', timeInBusiness: '2+ years', annualRevenue: '$500K+', dscr: '1.15+', paydex: '65+', fico: '680+', maxLTV: 'N/A', collateral: 'Blanket UCC', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Utilization Rate'], policyNotes: '$10K–$500K; no origination fee under $500K; annual fee waived yr 1; revolving credit' },
  { product: 'Business Term Loan', family: 'Term Loans', timeInBusiness: '2+ years', annualRevenue: '$500K+', dscr: '1.20+', paydex: '65+', fico: '680+', maxLTV: 'N/A', collateral: 'Blanket UCC', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Revenue Trend'], policyNotes: '$10K–$1M; 12–84mo terms; fixed rates; same-day pre-approval available' },
  { product: 'SBA 7(a) Loan', family: 'SBA Programs', timeInBusiness: '2+ years', annualRevenue: '$250K+', dscr: '1.15+', paydex: '60+', fico: '680+', maxLTV: '85%', collateral: 'Available Assets', guarantor: 'Personal (20%+)', requiredSignals: ['Cash Flow Stability', 'DSCR', 'SBA Eligibility'], policyNotes: 'Up to $5M; 10–25yr terms; Santander is SBA Preferred Lender; low down payments' },
  { product: 'SBA Express Line of Credit', family: 'SBA Programs', timeInBusiness: '2+ years', annualRevenue: 'Varies', dscr: '1.10+', paydex: '60+', fico: '680+', maxLTV: 'N/A', collateral: 'Varies', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'SBA Eligibility'], policyNotes: 'Up to $500K; 7-year term with annual renewals; fast-track SBA approval' },
  { product: 'Equipment Financing', family: 'Equipment Finance', timeInBusiness: '2+ years', annualRevenue: '$500K+', dscr: '1.15+', paydex: '65+', fico: '670+', maxLTV: '100%', collateral: 'Equipment', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Equipment Valuation'], policyNotes: '100% financing available; terms aligned to useful life; fast approval' },
  { product: 'Commercial Real Estate Mortgage', family: 'Commercial Real Estate', timeInBusiness: '3+ years', annualRevenue: '$1M+', dscr: '1.25+', paydex: '72+', fico: '720+', maxLTV: '80%', collateral: 'Real Estate', guarantor: 'Corporate/Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'CRE Track Record', 'Property Valuation'], policyNotes: '$500K+; 5–25yr terms; fixed/adjustable rates; owner-occupied commercial property' },
  { product: 'Commercial Vehicle Financing', family: 'Commercial Auto', timeInBusiness: '2+ years', annualRevenue: '$500K+', dscr: '1.15+', paydex: '65+', fico: '680+', maxLTV: '90%', collateral: 'Vehicle', guarantor: 'Personal/Corporate', requiredSignals: ['Cash Flow Stability', 'Fleet Assessment'], policyNotes: '50+ years expertise; trucks/vans/trailers/specialty; 24–84mo terms; competitive rates' },
  { product: 'Small Business Vehicle Financing', family: 'Commercial Auto', timeInBusiness: '1+ year', annualRevenue: 'Varies', dscr: '1.10+', paydex: '60+', fico: '660+', maxLTV: '90%', collateral: 'Vehicle', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Personal Credit'], policyNotes: 'Powered by Santander Consumer; fleets <10 vehicles; 24–72mo; online application' },
  { product: 'Healthcare Equipment Financing', family: 'Equipment Finance', timeInBusiness: '2+ years', annualRevenue: '$750K+', dscr: '1.20+', paydex: '68+', fico: '680+', maxLTV: '100%', collateral: 'Medical Equipment', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Equipment Valuation', 'Healthcare License'], policyNotes: 'Specialized medical/dental equipment; terms aligned to tech life cycle; diagnostic/imaging/practice mgmt' },

  // Cards
  { product: 'Business Debit Mastercard', family: 'Treasury', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'Business Checking Account'], policyNotes: 'Included with all business checking; contactless payment; EMV chip; fraud monitoring; zero liability' },
  { product: 'Commercial Card Solutions', family: 'Credit Cards', timeInBusiness: '3+ years', annualRevenue: '$5M+', dscr: 'N/A', paydex: '75+', fico: '740+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Corporate', requiredSignals: ['Cash Flow Stability', 'Revenue Growth', 'Strong Financials'], policyNotes: 'Corporate card programs; centralized billing; spend controls; detailed reporting; Mastercard worldwide' },

  // Treasury/Digital
  { product: 'Treasury Fusion', family: 'Treasury', timeInBusiness: '3+ years', annualRevenue: '$5M+', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'ERP System', 'Enterprise Client'], policyNotes: 'ERP integration (SAP/Oracle/QuickBooks); real-time cash positioning; automated reconciliation; custom pricing' },
  { product: 'Santander Cash Nexus', family: 'Treasury', timeInBusiness: '5+ years', annualRevenue: '$50M+', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'Global Operations', 'Enterprise Client'], policyNotes: 'Global treasury via CIB; multi-currency; global cash pooling; FX hedging; liquidity management' },
  { product: 'Business Online Banking', family: 'Treasury', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'Business Checking Account'], policyNotes: 'Free with checking; online/mobile; bill pay; wire/ACH; remote deposit; user access controls; MFA' },
  { product: 'Digital Checks', family: 'Treasury', timeInBusiness: '1+ year', annualRevenue: 'Varies', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'Business Online Banking'], policyNotes: 'PILOT: Launched 2024; create/send/track digital checks; recipients deposit mobile or print; free' },
  { product: 'Santander Merchant Services', family: 'Treasury', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'Business Verification'], policyNotes: 'Powered by Clover; 2.5% + $0.15 card present; POS/online/mobile; next-day deposits; no long-term contract' },

  // International
  { product: 'International Trade Finance', family: 'Treasury', timeInBusiness: '5+ years', annualRevenue: '$10M+', dscr: '1.25+', paydex: '75+', fico: '720+', maxLTV: 'Varies', collateral: 'Varies', guarantor: 'Corporate', requiredSignals: ['Cash Flow Stability', 'Import/Export Activity', 'Trade Documentation'], policyNotes: 'Letters of credit; supply chain finance; import/export financing; trade guarantees; Santander global network' },
  { product: 'Foreign Exchange (FX) Services', family: 'Treasury', timeInBusiness: '3+ years', annualRevenue: '$5M+', dscr: 'N/A', paydex: '72+', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'Corporate', requiredSignals: ['Identity Verified', 'International Operations', 'Currency Exposure'], policyNotes: 'Competitive FX rates; 150+ currencies; spot/forward/hedging; real-time execution; dedicated FX specialist' },
];
