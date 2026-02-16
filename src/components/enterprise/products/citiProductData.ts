// Enterprise Products Data - Citibank product portfolio (real products from citi_qualitative.json)

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
// PRODUCT CATALOG — 21 Real Citibank Products
// ============================================

export const CITI_BANK_PRODUCTS: BankProduct[] = [
  // -- Deposits (5) ----------------------------------------------------------
  {
    id: 'citibusiness-streamlined-checking',
    name: 'CitiBusiness® Streamlined Checking',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Startup', 'Micro', 'Small Business'],
    terms: { rateRange: '0.01% APY', termRange: 'Demand', amountRange: '$25 min opening deposit', collateral: 'N/A', guarantor: 'N/A' },
    description: '$15/mo fee waived at $5K average collected balance. 250 transactions/mo included, $10K cash deposit limit, 60,000+ fee-free ATMs (Citi + MoneyPass), 600+ branches.',
  },
  {
    id: 'citibusiness-flexible-checking',
    name: 'CitiBusiness® Flexible Checking',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '0.02% APY', termRange: 'Demand', amountRange: 'Variable', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Pay-per-use pricing model scalable for growing businesses with fluctuating transaction volumes. Full business banking services with treasury integration.',
  },
  {
    id: 'citibusiness-interest-checking',
    name: 'CitiBusiness® Interest Checking',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '0.02%–0.15% APY', termRange: 'Demand', amountRange: 'Tiered', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Interest-earning checking with tiered rates for businesses maintaining significant balances. Includes online/mobile banking and business services.',
  },
  {
    id: 'citibusiness-analyzed-checking',
    name: 'CitiBusiness® Analyzed Checking',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Earnings credit allowance', termRange: 'Demand', amountRange: 'High-volume', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Analyzed account structure with earnings credit to offset fees. Advanced cash management tools and CitiDirect BE® platform access for high-volume businesses.',
  },
  {
    id: 'citibusiness-money-market',
    name: 'CitiBusiness® Money Market Account',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '0.25%–2.75% APY', termRange: 'Demand', amountRange: '$2,500 min opening', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Tiered APY money market account with better rates on higher balances. Healthcare and legal professionals qualify for enhanced APY.',
  },

  // -- Credit Cards (3) ------------------------------------------------------
  {
    id: 'aadvantage-platinum-select',
    name: 'CitiBusiness® / AAdvantage® Platinum Select® World Elite Mastercard®',
    family: 'Credit Cards',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: 'Variable APR', termRange: 'Revolving', amountRange: 'Subject to approval', collateral: 'Unsecured', guarantor: 'Personal' },
    description: '2X miles on American Airlines purchases, car rentals, and gas. $99 annual fee waived first year. Companion Certificate after $30K+ spend. First checked bag free (cardholder + 4 companions).',
  },
  {
    id: 'costco-anywhere-visa-business',
    name: 'Costco Anywhere Visa® Business Card by Citi',
    family: 'Credit Cards',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Micro', 'Small Business'],
    terms: { rateRange: 'Variable APR', termRange: 'Revolving', amountRange: 'Subject to approval', collateral: 'Unsecured', guarantor: 'Personal' },
    description: '4% cash back on gas/EV charging (first $7K/yr), 3% on restaurants and travel, 2% on Costco purchases. No annual fee (requires Costco membership). No foreign transaction fees.',
  },
  {
    id: 'aadvantage-world-elite',
    name: 'CitiBusiness® / AAdvantage® World Elite Mastercard®',
    family: 'Credit Cards',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Variable APR', termRange: 'Revolving', amountRange: '$10K–$500K+', collateral: 'Unsecured', guarantor: 'Personal' },
    description: 'Premium business card with enhanced American Airlines rewards, priority boarding, 25% savings on in-flight purchases, and comprehensive travel protections (reinstated 2025).',
  },

  // -- Lines of Credit (2) ---------------------------------------------------
  {
    id: 'small-business-line-credit',
    name: 'Citi® Small Business Line of Credit',
    family: 'Lines of Credit',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: 'Prime + 1.5%–4.0%', termRange: 'Revolving', amountRange: '$10K–$1M', collateral: 'Unsecured/Secured', guarantor: 'Personal' },
    description: 'Revolving credit up to $1M for working capital and seasonal needs. Digital credit application available. Average 15-day approval, 30-day funding.',
  },
  {
    id: 'commercial-revolving-credit',
    name: 'Citi® Commercial Revolving Credit',
    family: 'Lines of Credit',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Prime + 0.5%–2.5%', termRange: '2-year revolving', amountRange: '$1M–$10M+', collateral: 'A/R + Inventory', guarantor: 'Corporate' },
    description: 'Large revolving credit lines over $1M with 2-year terms, dedicated relationship management, and full treasury integration via CitiDirect BE®.',
  },

  // -- Term Loans (2) --------------------------------------------------------
  {
    id: 'small-business-term-loan',
    name: 'Citi® Small Business Term Loan',
    family: 'Term Loans',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '6.99%–12.99%', termRange: '12–120 months', amountRange: '$25K–$1M', collateral: 'Blanket UCC', guarantor: 'Personal' },
    description: 'Fixed-term financing for working capital, equipment, and expansion. Digital credit application with average 15-day approval. Healthcare/legal professionals receive fee reductions.',
  },
  {
    id: 'commercial-term-loan',
    name: 'Citi® Commercial Term Loan',
    family: 'Term Loans',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: '5.5%–9.5%', termRange: '12–240 months', amountRange: '$1M–$10M+', collateral: 'Varies', guarantor: 'Corporate/Personal' },
    description: 'Large-scale term financing for expansion, acquisitions, and capital investments. Relationship-based pricing and dedicated commercial banking team.',
  },

  // -- SBA Programs (2) ------------------------------------------------------
  {
    id: 'sba-7a-loan',
    name: 'Citi SBA 7(a) Loan',
    family: 'SBA Programs',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: 'Varies by amount/term', termRange: '10–25 years', amountRange: 'Up to $5M', collateral: 'Available Assets', guarantor: 'Personal (20%+)' },
    description: 'SBA-guaranteed financing for property, equipment, working capital, and acquisition. Citi is SBA Preferred Lender for faster approvals with low down payments.',
  },
  {
    id: 'sba-504-loan',
    name: 'Citi SBA 504 Loan',
    family: 'SBA Programs',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: 'Long-term fixed rate', termRange: '10–25 years', amountRange: 'Up to $5.5M', collateral: 'Real Estate/Equipment', guarantor: 'Personal (20%+)' },
    description: 'Long-term fixed-rate financing: 50% conventional loan, 40% SBA-backed, 10% down payment for commercial real estate and equipment. Job creation required.',
  },

  // -- Commercial Real Estate (2) --------------------------------------------
  {
    id: 'commercial-mortgage',
    name: 'Citi® Commercial Mortgage',
    family: 'Commercial Real Estate',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Fixed/floating available', termRange: 'Construction to permanent', amountRange: '$1M+', collateral: 'Real Estate', guarantor: 'Corporate/Personal' },
    description: 'Fully integrated CRE financing including retail, industrial, office, hospitality, and data centers. Citi led $8.6B+ CRE transactions in APAC YTD 2025. Commercial mortgage installment loans available.',
  },
  {
    id: 'construction-financing',
    name: 'Citi® Construction Financing',
    family: 'Commercial Real Estate',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Varies by structure', termRange: 'Construction phase', amountRange: '$1M+', collateral: 'Real Estate + Personal Guarantee', guarantor: 'Corporate/Personal' },
    description: 'Construction and renovation financing for business facilities. Structured deals with government agency partnerships available via Citi Community Capital for affordable housing.',
  },

  // -- Treasury / Digital (3) ------------------------------------------------
  {
    id: 'citidirect-be',
    name: 'CitiDirect BE® (Banking Evolution)',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Custom pricing', termRange: 'Ongoing', amountRange: 'Enterprise', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Market-leading digital commercial banking platform with AI-powered workflows, treasury management, cash concentration (24/7 global pooling visibility), and virtual assistant tools. 57% client adoption.',
  },
  {
    id: 'treasury-trade-solutions',
    name: 'Citi® Treasury and Trade Solutions (TTS)',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Custom pricing', termRange: 'Ongoing', amountRange: 'Enterprise', collateral: 'N/A', guarantor: 'N/A' },
    description: 'World\'s Best Corporate Payments Bank 2025 (Euromoney). Processes $3T+ daily across 160 countries. Includes cash management, receivables finance, trade finance, FX (500+ currency pairs), and Citi Token Services.',
  },
  {
    id: 'commercial-cards',
    name: 'Citi® Commercial Cards',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'N/A', termRange: 'Monthly', amountRange: 'Varies', collateral: 'N/A', guarantor: 'Corporate' },
    description: 'Corporate card programs with employee spending controls, expense management integration, and analytics. Included in digital credit application platform for streamlined setup.',
  },

  // -- International (2) -----------------------------------------------------
  {
    id: 'trade-finance-loc',
    name: 'Citi® Trade Finance & Letters of Credit',
    family: 'Lines of Credit',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Varies', termRange: 'Transaction-based', amountRange: 'Varies', collateral: 'Shipment/Invoice', guarantor: 'Corporate' },
    description: 'Import/export letters of credit, standby LCs, documentary collections (fully digitized), and electronic trade loan facilities. Available in 120+ countries via Trade Advisor on CitiDirect. Sustainable trade loans launched 2022.',
  },
  {
    id: 'cross-border-payments',
    name: 'Citi® Cross-Border Payments',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'FX spread + wire fee', termRange: 'Per transaction', amountRange: 'Any', collateral: 'N/A', guarantor: 'N/A' },
    description: 'International wire transfers in 130 currencies across ~80 countries via CitiFX platform. 24/5 coverage with real-time FX pricing (400+ pairs). Free for Citigold/Private Bank. Citi InstantFX for multi-currency pricing lock.',
  },
];

// ============================================
// KPIs PER VIEW — Citibank Scale (450K businesses, $98.4B exposure)
// ============================================

export const CITI_SHELF_KPIS: ProductKPI[] = [
  {
    id: 'total-active',
    label: 'Total Active Products',
    value: 21,
    format: 'number',
    trend: 3,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Products currently available to 450K+ commercial clients across 10 states + DC',
    dataSource: 'Product Management',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'pilot-products',
    label: 'Products in Pilot',
    value: 0,
    format: 'number',
    trend: 0,
    trendDirection: 'stable',
    isPositiveTrend: true,
    tooltip: 'No products in pilot stage — all 21 products are live and active',
    dataSource: 'Product Management',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'avg-revenue',
    label: 'Avg Revenue/Product',
    value: 182000000,
    format: 'currency',
    trend: 8.4,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average monthly revenue per active product line across 450K commercial clients',
    dataSource: 'Finance',
    lastUpdated: '1 day ago',
  },
  {
    id: 'adoption-rate',
    label: 'Customer Adoption Rate',
    value: 42.1,
    format: 'percent',
    trend: 3.6,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'High adoption driven by global network (160 countries) and TTS platform leadership',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '2 hours ago',
  },
];

export const CITI_PENETRATION_KPIS: ProductKPI[] = [
  {
    id: 'overall-penetration',
    label: 'Overall Penetration',
    value: 48.2,
    format: 'percent',
    trend: 4.1,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Eligible businesses holding at least one Citi product — strongest in international trade segments',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'cross-sell-gap',
    label: 'Cross-Sell Gap',
    value: 1.3,
    format: 'number',
    trend: -0.3,
    trendDirection: 'down',
    isPositiveTrend: true,
    tooltip: 'Avg additional products per customer vs optimal (gap narrowing)',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'products-per-customer',
    label: 'Products/Customer',
    value: 2.8,
    format: 'number',
    trend: 0.4,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average products per active client — higher than competitors due to TTS cross-sell',
    dataSource: 'CRM',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'wallet-share',
    label: 'Wallet Share',
    value: 44.6,
    format: 'percent',
    trend: 2.8,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Estimated share of customer financial wallet — highest in NYC and SF Bay Area',
    dataSource: 'Market Intelligence',
    lastUpdated: '1 day ago',
  },
];

export const CITI_PREQUAL_KPIS: ProductKPI[] = [
  {
    id: 'total-prequal',
    label: 'Total Pre-Qualified',
    value: 279000,
    format: 'number',
    trend: 9.2,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: '279K businesses meeting pre-qualification criteria (62% of portfolio)',
    dataSource: 'LumiqAI Signal Engine',
    lastUpdated: '30 mins ago',
  },
  {
    id: 'pct-likely',
    label: '% Likely',
    value: 64.8,
    format: 'percent',
    trend: 4.2,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Pre-qualified businesses rated as likely to qualify based on LumiqAI scoring',
    dataSource: 'LumiqAI Signal Engine',
    lastUpdated: '30 mins ago',
  },
  {
    id: 'pipeline-value',
    label: 'Pipeline Value',
    value: 52200000000,
    format: 'currency',
    trend: 14.8,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Estimated total value of pre-qualified pipeline across all product lines',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'avg-readiness',
    label: 'Avg Readiness Score',
    value: 76.4,
    format: 'score',
    trend: 2.6,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average LumiqAI readiness score across 279K pre-qualified pipeline',
    dataSource: 'LumiqAI Signal Engine',
    lastUpdated: '30 mins ago',
  },
];

export const CITI_PERFORMANCE_KPIS: ProductKPI[] = [
  {
    id: 'wtd-approval',
    label: 'Weighted Approval Rate',
    value: 79.6,
    format: 'percent',
    trend: 2.4,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Volume-weighted approval rate across all Citi commercial products',
    dataSource: 'Underwriting',
    lastUpdated: '15 mins ago',
  },
  {
    id: 'avg-ttd',
    label: 'Avg Time-to-Decision',
    value: 2.1,
    format: 'number',
    trend: -0.6,
    trendDirection: 'down',
    isPositiveTrend: true,
    tooltip: 'Average business days from application to decision — digital lending platform advantage (15-day target)',
    dataSource: 'Underwriting',
    lastUpdated: '15 mins ago',
  },
  {
    id: 'total-funded-30d',
    label: 'Total Funded (30d)',
    value: 24800000000,
    format: 'currency',
    trend: 11.2,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Total funded volume in last 30 days across 450K commercial clients',
    dataSource: 'Finance',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'portfolio-growth',
    label: 'Portfolio Growth',
    value: 5.2,
    format: 'percent',
    trend: 1.1,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Year-over-year outstanding balance growth — strongest YoY growth in 5 years',
    dataSource: 'Finance',
    lastUpdated: '1 day ago',
  },
];

// ============================================
// PENETRATION DATA — Citibank Scale
// ============================================

export const CITI_PENETRATION_BY_PRODUCT: PenetrationByProduct[] = [
  { product: 'CitiBusiness® Checking Accounts', family: 'Deposits', customersHolding: 364500, eligibleCustomers: 435000, penetrationRate: 83.8, crossSellGap: 16.2, revenueOpportunity: 106000000 },
  { product: 'Citi® Treasury and Trade Solutions (TTS)', family: 'Treasury', customersHolding: 171000, eligibleCustomers: 234000, penetrationRate: 73.1, crossSellGap: 26.9, revenueOpportunity: 1890000000 },
  { product: 'CitiBusiness® Credit Cards', family: 'Credit Cards', customersHolding: 225000, eligibleCustomers: 342000, penetrationRate: 65.8, crossSellGap: 34.2, revenueOpportunity: 585000000 },
  { product: 'CitiBusiness® Money Market Account', family: 'Deposits', customersHolding: 166500, eligibleCustomers: 435000, penetrationRate: 38.3, crossSellGap: 61.7, revenueOpportunity: 268500000 },
  { product: 'Citi® Commercial Lines of Credit', family: 'Lines of Credit', customersHolding: 112500, eligibleCustomers: 252000, penetrationRate: 44.6, crossSellGap: 55.4, revenueOpportunity: 1395000000 },
  { product: 'Citi® Cross-Border Payments', family: 'Treasury', customersHolding: 153000, eligibleCustomers: 207000, penetrationRate: 73.9, crossSellGap: 26.1, revenueOpportunity: 810000000 },
  { product: 'Citi® Commercial Term Loans', family: 'Term Loans', customersHolding: 45000, eligibleCustomers: 144000, penetrationRate: 31.3, crossSellGap: 68.7, revenueOpportunity: 990000000 },
  { product: 'Citi® Trade Finance & Letters of Credit', family: 'Lines of Credit', customersHolding: 58500, eligibleCustomers: 117000, penetrationRate: 50.0, crossSellGap: 50.0, revenueOpportunity: 585000000 },
  { product: 'Citi® Commercial Real Estate', family: 'Commercial Real Estate', customersHolding: 27000, eligibleCustomers: 90000, penetrationRate: 30.0, crossSellGap: 70.0, revenueOpportunity: 630000000 },
  { product: 'SBA Programs (7a/504)', family: 'SBA Programs', customersHolding: 18000, eligibleCustomers: 72000, penetrationRate: 25.0, crossSellGap: 75.0, revenueOpportunity: 540000000 },
];

export const CITI_SEGMENT_PENETRATION: SegmentPenetration[] = [
  { segment: 'Micro (<$1M)', productsPerCustomer: 2.1, walletShare: 34.2, totalCustomers: 189000 },
  { segment: 'Small ($1M–$10M)', productsPerCustomer: 3.0, walletShare: 48.6, totalCustomers: 162000 },
  { segment: 'Mid-Market ($10M+)', productsPerCustomer: 4.5, walletShare: 61.8, totalCustomers: 99000 },
];

export const CITI_PRODUCT_CROSS_SELL_FUNNEL: CrossSellFunnelStage[] = [
  { stage: 'Eligible for Additional Product', count: 270000, conversionFromPrevious: 100, avgTimeInStage: 0 },
  { stage: 'Targeted by Campaign', count: 172800, conversionFromPrevious: 64, avgTimeInStage: 4 },
  { stage: 'Engaged / Responded', count: 112320, conversionFromPrevious: 65, avgTimeInStage: 7 },
  { stage: 'Applied', count: 73008, conversionFromPrevious: 65, avgTimeInStage: 10 },
  { stage: 'Approved & Booked', count: 58406, conversionFromPrevious: 80, avgTimeInStage: 2 },
];

// ============================================
// PRE-QUALIFICATION DATA — Citibank Scale
// ============================================

export const CITI_PREQUAL_READINESS: PreQualReadiness[] = [
  { product: 'Citi® Small Business Line of Credit', likely: 31500, borderline: 13500, unlikely: 9000, total: 54000 },
  { product: 'CitiBusiness® Credit Cards', likely: 54000, borderline: 18000, unlikely: 9000, total: 81000 },
  { product: 'Citi® Small Business Term Loan', likely: 22500, borderline: 13500, unlikely: 9000, total: 45000 },
  { product: 'Citi SBA 7(a) Loan', likely: 14400, borderline: 10800, unlikely: 7200, total: 32400 },
  { product: 'Citi® Commercial Real Estate', likely: 10800, borderline: 9000, unlikely: 7200, total: 27000 },
  { product: 'Citi® Cross-Border Payments', likely: 36000, borderline: 13500, unlikely: 9000, total: 58500 },
];

export const CITI_PREQUAL_CANDIDATES: PreQualCandidate[] = [
  { businessName: 'Global Tech Imports LLC', industry: 'Technology', annualRevenue: 18500000, readinessScore: 94, readiness: 'Likely', topProduct: 'Citi® Trade Finance & Letters of Credit', signals: ['Strong DSCR', 'PAYDEX 85', 'Cross-Border Revenue 42%'] },
  { businessName: 'Manhattan Legal Partners', industry: 'Professional Services', annualRevenue: 22100000, readinessScore: 91, readiness: 'Likely', topProduct: 'CitiDirect BE® Platform', signals: ['Growing Revenue', 'FICO 795', 'Legal Professional Package Eligible'] },
  { businessName: 'Pacific Import Distribution', industry: 'Retail & E-Commerce', annualRevenue: 28400000, readinessScore: 88, readiness: 'Likely', topProduct: 'Citi® Cross-Border Payments', signals: ['International Trade 56%', 'PAYDEX 82', 'Strong Cash Flow'] },
  { businessName: 'BioMed Device Export Corp', industry: 'Healthcare & Life Sciences', annualRevenue: 21500000, readinessScore: 86, readiness: 'Likely', topProduct: 'Citi® Trade Finance & Letters of Credit', signals: ['Export Revenue 38%', 'FICO 785', 'Healthcare Professional Package'] },
  { businessName: 'NY Commercial Properties', industry: 'Real Estate & Property Services', annualRevenue: 31400000, readinessScore: 83, readiness: 'Likely', topProduct: 'Citi® Commercial Mortgage', signals: ['Strong CRE Track Record', 'Low Leverage', 'PAYDEX 80'] },
  { businessName: 'International Fashion Imports', industry: 'Retail & E-Commerce', annualRevenue: 8600000, readinessScore: 79, readiness: 'Likely', topProduct: 'Citi® Small Business Line of Credit', signals: ['Cross-Border Revenue', 'Growing Business', 'FICO 765'] },
  { businessName: 'SF Tech Consulting Group', industry: 'Professional Services', annualRevenue: 11200000, readinessScore: 76, readiness: 'Borderline', topProduct: 'CitiBusiness® / AAdvantage® Card', signals: ['DSCR 1.18', 'Travel Heavy', 'FICO 720'] },
  { businessName: 'Miami Import Export Hub', industry: 'Manufacturing & Distribution', annualRevenue: 16700000, readinessScore: 73, readiness: 'Borderline', topProduct: 'Citi® Trade Finance & Letters of Credit', signals: ['Latin America Gateway', 'Seasonal Revenue', 'PAYDEX 72'] },
  { businessName: 'Brooklyn Restaurant Group', industry: 'Food Service & Hospitality', annualRevenue: 7200000, readinessScore: 67, readiness: 'Borderline', topProduct: 'Citi® Small Business Term Loan', signals: ['Growing Revenue', 'FICO 710', 'High Utilization'] },
  { businessName: 'Downtown Retail Co', industry: 'Retail & E-Commerce', annualRevenue: 4800000, readinessScore: 58, readiness: 'Unlikely', topProduct: 'Costco Anywhere Visa® Business Card', signals: ['Declining Revenue', 'PAYDEX 58', 'High Leverage'] },
];

// ============================================
// PERFORMANCE DATA — Citibank Scale
// ============================================

export const CITI_PRODUCT_PERFORMANCE: ProductPerformanceRow[] = [
  { product: 'CitiBusiness® / AAdvantage® Cards', family: 'Credit Cards', approvalRate: 81.4, fundingRate: 97.2, avgDealSize: 35000, avgTimeToDecision: 0.2, totalFunded30d: 2480000000, yoyGrowth: 18.6 },
  { product: 'Costco Anywhere Visa® Business Card', family: 'Credit Cards', approvalRate: 85.2, fundingRate: 96.8, avgDealSize: 22000, avgTimeToDecision: 0.3, totalFunded30d: 1920000000, yoyGrowth: 22.4 },
  { product: 'Citi® Small Business Line of Credit', family: 'Lines of Credit', approvalRate: 72.8, fundingRate: 90.4, avgDealSize: 185000, avgTimeToDecision: 2.4, totalFunded30d: 4680000000, yoyGrowth: 9.8 },
  { product: 'Citi® Commercial Revolving Credit', family: 'Lines of Credit', approvalRate: 76.2, fundingRate: 93.6, avgDealSize: 2850000, avgTimeToDecision: 3.8, totalFunded30d: 2880000000, yoyGrowth: 6.4 },
  { product: 'Citi® Small Business Term Loan', family: 'Term Loans', approvalRate: 70.6, fundingRate: 88.4, avgDealSize: 225000, avgTimeToDecision: 3.2, totalFunded30d: 2520000000, yoyGrowth: 11.2 },
  { product: 'Citi® Commercial Term Loan', family: 'Term Loans', approvalRate: 74.8, fundingRate: 91.2, avgDealSize: 3850000, avgTimeToDecision: 4.2, totalFunded30d: 1860000000, yoyGrowth: 8.6 },
  { product: 'Citi SBA 7(a) Loan', family: 'SBA Programs', approvalRate: 64.2, fundingRate: 82.6, avgDealSize: 680000, avgTimeToDecision: 11.8, totalFunded30d: 1440000000, yoyGrowth: 21.4 },
  { product: 'Citi SBA 504 Loan', family: 'SBA Programs', approvalRate: 66.8, fundingRate: 84.2, avgDealSize: 1850000, avgTimeToDecision: 13.2, totalFunded30d: 960000000, yoyGrowth: 19.8 },
  { product: 'Citi® Commercial Real Estate', family: 'Commercial Real Estate', approvalRate: 68.4, fundingRate: 86.8, avgDealSize: 2950000, avgTimeToDecision: 18.5, totalFunded30d: 1680000000, yoyGrowth: 14.2 },
  { product: 'Citi® Trade Finance & Letters of Credit', family: 'Lines of Credit', approvalRate: 78.6, fundingRate: 94.2, avgDealSize: 485000, avgTimeToDecision: 2.8, totalFunded30d: 2280000000, yoyGrowth: 16.8 },
  { product: 'Citi® Cross-Border Payments', family: 'Treasury', approvalRate: 94.2, fundingRate: 99.2, avgDealSize: 0, avgTimeToDecision: 0.1, totalFunded30d: 6240000000, yoyGrowth: 28.4 },
];

export const CITI_PERFORMANCE_APP_FUNNEL: ApplicationFunnelMetrics[] = [
  { product: 'All Products', preQualified: 279000, applied: 167400, approved: 133920, funded: 114732, preQualToApplyRate: 60, applyToApproveRate: 80, avgTimeToDecision: 2.1 },
  { product: 'Credit Cards', preQualified: 117000, applied: 93600, approved: 80784, funded: 77548, preQualToApplyRate: 80, applyToApproveRate: 86, avgTimeToDecision: 0.3 },
  { product: 'Lines of Credit', preQualified: 72000, applied: 43200, approved: 31968, funded: 28771, preQualToApplyRate: 60, applyToApproveRate: 74, avgTimeToDecision: 2.9 },
  { product: 'Term Loans', preQualified: 54000, applied: 27000, approved: 19440, funded: 17010, preQualToApplyRate: 50, applyToApproveRate: 72, avgTimeToDecision: 3.6 },
  { product: 'SBA Programs', preQualified: 36000, applied: 14400, approved: 9360, funded: 7488, preQualToApplyRate: 40, applyToApproveRate: 65, avgTimeToDecision: 12.4 },
];

// ============================================
// ELIGIBILITY MATRIX — Real Citibank Criteria
// ============================================

export const CITI_ELIGIBILITY_RULES: EligibilityRule[] = [
  // Deposits
  { product: 'CitiBusiness® Streamlined Checking', family: 'Deposits', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: '$15/mo fee waived at $5K avg collected balance; 250 transactions/mo included' },
  { product: 'CitiBusiness® Flexible Checking', family: 'Deposits', timeInBusiness: 'Established', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: 'Pay-per-use pricing model; scalable for fluctuating transaction volumes' },
  { product: 'CitiBusiness® Interest Checking', family: 'Deposits', timeInBusiness: 'Established', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: 'Tiered interest rates for businesses maintaining significant balances' },
  { product: 'CitiBusiness® Analyzed Checking', family: 'Deposits', timeInBusiness: '2+ years', annualRevenue: '$5M+', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear', 'High-Volume Activity'], policyNotes: 'Earnings credit allowance to offset fees; CitiDirect BE® platform access' },
  { product: 'CitiBusiness® Money Market Account', family: 'Deposits', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: '$2,500 min opening; 0.25%–2.75% APY tiered; healthcare/legal enhanced rates' },

  // Credit Cards
  { product: 'CitiBusiness® / AAdvantage® Platinum Select®', family: 'Credit Cards', timeInBusiness: '1+ years', annualRevenue: 'Varies', dscr: 'N/A', paydex: '65+', fico: '670+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Payment Behavior'], policyNotes: '$99 annual fee waived year 1; 2X miles on AA/car rentals/gas; Companion Certificate at $30K+ spend' },
  { product: 'Costco Anywhere Visa® Business Card', family: 'Credit Cards', timeInBusiness: 'Any', annualRevenue: 'Varies', dscr: 'N/A', paydex: '60+', fico: '650+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Costco Membership'], policyNotes: 'No annual fee (requires Costco membership); 4% gas/EV, 3% restaurants/travel, 2% Costco' },
  { product: 'CitiBusiness® / AAdvantage® World Elite', family: 'Credit Cards', timeInBusiness: '2+ years', annualRevenue: '$1M+', dscr: 'N/A', paydex: '72+', fico: '720+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Revenue Growth', 'Strong Cash Flow'], policyNotes: 'Premium card with enhanced AA rewards, priority boarding, travel protections (reinstated 2025)' },

  // Lines of Credit
  { product: 'Citi® Small Business Line of Credit', family: 'Lines of Credit', timeInBusiness: '1+ years', annualRevenue: '$500K+', dscr: '1.15+', paydex: '65+', fico: '680+', maxLTV: 'N/A', collateral: 'Unsecured/Secured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Utilization Rate'], policyNotes: '$10K–$1M; digital credit app available; avg 15-day approval, 30-day funding' },
  { product: 'Citi® Commercial Revolving Credit', family: 'Lines of Credit', timeInBusiness: '3+ years', annualRevenue: '$3M+', dscr: '1.25+', paydex: '72+', fico: '720+', maxLTV: 'N/A', collateral: 'A/R + Inventory', guarantor: 'Corporate', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Revenue Growth', 'A/R Aging'], policyNotes: '$1M–$10M+; 2-year revolving term; dedicated RM; CitiDirect BE® integration' },

  // Term Loans
  { product: 'Citi® Small Business Term Loan', family: 'Term Loans', timeInBusiness: '1+ years', annualRevenue: '$500K+', dscr: '1.20+', paydex: '65+', fico: '680+', maxLTV: 'N/A', collateral: 'Blanket UCC', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Revenue Trend'], policyNotes: '$25K–$1M; 6.99%–12.99% APR; healthcare/legal fee reductions; digital credit app' },
  { product: 'Citi® Commercial Term Loan', family: 'Term Loans', timeInBusiness: '3+ years', annualRevenue: '$3M+', dscr: '1.25+', paydex: '72+', fico: '720+', maxLTV: 'N/A', collateral: 'Varies', guarantor: 'Corporate/Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Revenue Growth', 'Strong Financials'], policyNotes: '$1M–$10M+; 5.5%–9.5% APR; relationship pricing; dedicated commercial team' },

  // SBA Programs
  { product: 'Citi SBA 7(a) Loan', family: 'SBA Programs', timeInBusiness: 'Start-ups eligible', annualRevenue: '$250K+', dscr: '1.15+', paydex: '60+', fico: '680+', maxLTV: '90%', collateral: 'Available Assets', guarantor: 'Personal (20%+)', requiredSignals: ['Cash Flow Stability', 'DSCR', 'SBA Eligibility'], policyNotes: 'Up to $5M; 10–25yr terms; Citi is SBA Preferred Lender; low down payments' },
  { product: 'Citi SBA 504 Loan', family: 'SBA Programs', timeInBusiness: '2+ years', annualRevenue: '$500K+', dscr: '1.20+', paydex: '65+', fico: '680+', maxLTV: '90%', collateral: 'Real Estate/Equipment', guarantor: 'Personal (20%+)', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Job Creation Plan'], policyNotes: 'Up to $5.5M; 50/40/10 structure; long-term fixed rate; job creation required' },

  // Commercial Real Estate
  { product: 'Citi® Commercial Mortgage', family: 'Commercial Real Estate', timeInBusiness: '3+ years', annualRevenue: '$5M+', dscr: '1.25+', paydex: '75+', fico: '720+', maxLTV: '75%', collateral: 'Real Estate', guarantor: 'Corporate/Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'CRE Track Record', 'Property Valuation'], policyNotes: '$1M+ loans; retail/industrial/office/hospitality/data centers; Citi led $8.6B+ CRE in APAC YTD 2025' },
  { product: 'Citi® Construction Financing', family: 'Commercial Real Estate', timeInBusiness: '3+ years', annualRevenue: '$5M+', dscr: '1.30+', paydex: '75+', fico: '720+', maxLTV: '70%', collateral: 'Real Estate + Personal Guarantee', guarantor: 'Corporate/Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Construction Track Record', 'Property Plan'], policyNotes: '$1M+ loans; construction/renovation; Citi Community Capital for affordable housing' },

  // Treasury / Digital
  { product: 'CitiDirect BE® (Banking Evolution)', family: 'Treasury', timeInBusiness: '2+ years', annualRevenue: '$3M+', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'Commercial Relationship'], policyNotes: 'Custom pricing; AI-powered workflows; 24/7 global cash concentration; 57% client adoption' },
  { product: 'Citi® Treasury and Trade Solutions (TTS)', family: 'Treasury', timeInBusiness: '2+ years', annualRevenue: '$10M+', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'International Operations'], policyNotes: 'World\'s Best Corporate Payments Bank 2025; processes $3T+ daily; 160 countries, 500+ currency pairs' },
  { product: 'Citi® Commercial Cards', family: 'Treasury', timeInBusiness: '1+ years', annualRevenue: '$1M+', dscr: 'N/A', paydex: '65+', fico: '680+', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'Corporate', requiredSignals: ['Identity Verified', 'Business Verification'], policyNotes: 'Corporate card programs; employee spending controls; expense management integration' },

  // International
  { product: 'Citi® Trade Finance & Letters of Credit', family: 'Lines of Credit', timeInBusiness: '2+ years', annualRevenue: '$2M+', dscr: '1.20+', paydex: '70+', fico: '700+', maxLTV: 'N/A', collateral: 'Shipment/Invoice', guarantor: 'Corporate', requiredSignals: ['Cash Flow Stability', 'International Trade', 'Import/Export License'], policyNotes: 'Import/export LCs, standby LCs, documentary collections (fully digitized); 120+ countries; Trade Advisor on CitiDirect' },
  { product: 'Citi® Cross-Border Payments', family: 'Treasury', timeInBusiness: '1+ years', annualRevenue: '$1M+', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'International Operations'], policyNotes: '130 currencies, ~80 countries; 24/5 coverage; CitiFX platform (400+ pairs); Citi InstantFX multi-currency lock' },
];
