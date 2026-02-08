// Enterprise Products Mock Data - Bank product portfolio

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
// PRODUCT CATALOG (~18 products)
// ============================================

export const mockBankProducts: BankProduct[] = [
  // Credit Cards (5)
  {
    id: 'cc-rewards',
    name: 'Business Rewards Visa',
    family: 'Credit Cards',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '16.99%–24.99%', termRange: 'Revolving', amountRange: '$5K–$100K', collateral: 'Unsecured', guarantor: 'Personal' },
    description: 'Premium rewards card with 2x points on business spend and travel benefits.',
  },
  {
    id: 'cc-platinum',
    name: 'Business Platinum Card',
    family: 'Credit Cards',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: '14.99%–22.99%', termRange: 'Revolving', amountRange: '$25K–$250K', collateral: 'Unsecured', guarantor: 'Personal' },
    description: 'Premium card for established businesses with high spend and dedicated account management.',
  },
  {
    id: 'cc-cashback',
    name: 'Business Cash Back Card',
    family: 'Credit Cards',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Micro', 'Small Business'],
    terms: { rateRange: '18.99%–26.99%', termRange: 'Revolving', amountRange: '$2K–$50K', collateral: 'Unsecured', guarantor: 'Personal' },
    description: '1.5% unlimited cash back on all purchases with no annual fee.',
  },
  {
    id: 'cc-secured',
    name: 'Secured Business Card',
    family: 'Credit Cards',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Startup', 'Micro'],
    terms: { rateRange: '21.99%–28.99%', termRange: 'Revolving', amountRange: '$500–$10K', collateral: 'Cash Deposit', guarantor: 'Personal' },
    description: 'Build business credit with a security deposit-backed card for new businesses.',
  },
  {
    id: 'cc-corporate',
    name: 'Corporate Rewards Card',
    family: 'Credit Cards',
    status: 'Pilot',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Corporate', 'Mid-Market'],
    terms: { rateRange: '12.99%–19.99%', termRange: 'Revolving', amountRange: '$50K–$500K', collateral: 'Unsecured', guarantor: 'Corporate' },
    description: 'Multi-card program with expense management tools and corporate liability.',
  },
  // Lines of Credit (2)
  {
    id: 'loc-business',
    name: 'Business Line of Credit',
    family: 'Lines of Credit',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: 'Prime + 1.5%–5%', termRange: '12–36 months', amountRange: '$10K–$500K', collateral: 'Blanket UCC', guarantor: 'Personal' },
    description: 'Flexible revolving credit for working capital, seasonal needs, and growth opportunities.',
  },
  {
    id: 'loc-working-capital',
    name: 'Working Capital LOC',
    family: 'Lines of Credit',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Prime + 0.5%–3%', termRange: '24–60 months', amountRange: '$250K–$5M', collateral: 'A/R + Inventory', guarantor: 'Corporate' },
    description: 'Asset-based revolving facility for established businesses with strong receivables.',
  },
  // Term Loans (2)
  {
    id: 'tl-small',
    name: 'Small Business Term Loan',
    family: 'Term Loans',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Micro', 'Small Business'],
    terms: { rateRange: '6.5%–12%', termRange: '12–60 months', amountRange: '$25K–$500K', collateral: 'Blanket UCC', guarantor: 'Personal' },
    description: 'Fixed-rate term financing for expansion, equipment, or debt consolidation.',
  },
  {
    id: 'tl-commercial',
    name: 'Commercial Term Loan',
    family: 'Term Loans',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: '5.5%–9%', termRange: '36–84 months', amountRange: '$500K–$10M', collateral: 'Specific Assets', guarantor: 'Corporate' },
    description: 'Structured term financing for significant capital investment and strategic acquisitions.',
  },
  // SBA Programs (2)
  {
    id: 'sba-7a',
    name: 'SBA 7(a) Loan',
    family: 'SBA Programs',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Micro', 'Small Business'],
    terms: { rateRange: 'Prime + 2.25%–2.75%', termRange: '10–25 years', amountRange: '$50K–$5M', collateral: 'Available Assets', guarantor: 'Personal (20%+)' },
    description: 'SBA-guaranteed financing for general business purposes with favorable terms.',
  },
  {
    id: 'sba-504',
    name: 'SBA 504 Loan',
    family: 'SBA Programs',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: 'Below Market Fixed', termRange: '10–20 years', amountRange: '$125K–$5.5M', collateral: 'Real Estate/Equipment', guarantor: 'Personal (20%+)' },
    description: 'Long-term fixed-rate financing for major fixed assets and real estate.',
  },
  // Equipment Finance (1)
  {
    id: 'ef-equipment',
    name: 'Equipment Financing',
    family: 'Equipment Finance',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '5.5%–10%', termRange: '24–84 months', amountRange: '$25K–$2M', collateral: 'Equipment', guarantor: 'Personal' },
    description: 'Financing for new and used equipment with the asset serving as collateral.',
  },
  // Commercial Auto (1)
  {
    id: 'ca-fleet',
    name: 'Fleet/Auto Program',
    family: 'Commercial Auto',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '4.99%–8.99%', termRange: '24–72 months', amountRange: '$15K–$500K', collateral: 'Vehicle Title', guarantor: 'Personal' },
    description: 'Commercial vehicle and fleet financing with competitive rates.',
  },
  // Commercial Real Estate (2)
  {
    id: 'cre-owner',
    name: 'Owner-Occupied CRE',
    family: 'Commercial Real Estate',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Small Business', 'Mid-Market'],
    terms: { rateRange: '5.25%–7.5%', termRange: '10–25 years', amountRange: '$250K–$15M', collateral: 'Real Estate (1st Lien)', guarantor: 'Personal' },
    description: 'Mortgage financing for owner-occupied commercial properties.',
  },
  {
    id: 'cre-investment',
    name: 'Investment CRE',
    family: 'Commercial Real Estate',
    status: 'Pilot',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: '5.75%–8.5%', termRange: '5–20 years', amountRange: '$500K–$25M', collateral: 'Real Estate (1st Lien)', guarantor: 'Corporate + Personal' },
    description: 'Financing for income-producing investment properties and portfolios.',
  },
  // Deposits (2)
  {
    id: 'dep-checking',
    name: 'Business Checking',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Micro', 'Small Business', 'Mid-Market'],
    terms: { rateRange: '0.01%–0.10% APY', termRange: 'Demand', amountRange: 'No minimum', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Full-featured business checking with online banking and mobile deposit.',
  },
  {
    id: 'dep-savings',
    name: 'Business Savings',
    family: 'Deposits',
    status: 'Active',
    eligibilityTier: 'Tier 3',
    targetSegments: ['Micro', 'Small Business', 'Mid-Market'],
    terms: { rateRange: '0.50%–4.25% APY', termRange: 'Demand', amountRange: '$0–$10M+', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Tiered interest savings account with competitive yields on higher balances.',
  },
  // Treasury (2)
  {
    id: 'ts-management',
    name: 'Treasury Management',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 1',
    targetSegments: ['Mid-Market', 'Corporate'],
    terms: { rateRange: 'Fee-based', termRange: 'Ongoing', amountRange: 'Custom', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Cash management, ACH, wire transfers, and liquidity optimization services.',
  },
  {
    id: 'ts-merchant',
    name: 'Merchant Services',
    family: 'Treasury',
    status: 'Active',
    eligibilityTier: 'Tier 2',
    targetSegments: ['Micro', 'Small Business', 'Mid-Market'],
    terms: { rateRange: '2.4%–3.5% + $0.10', termRange: 'Monthly', amountRange: 'No limit', collateral: 'N/A', guarantor: 'N/A' },
    description: 'Payment processing, POS systems, and e-commerce payment integration.',
  },
];

// ============================================
// KPIs PER VIEW
// ============================================

export const mockShelfKPIs: ProductKPI[] = [
  {
    id: 'total-active',
    label: 'Total Active Products',
    value: 16,
    format: 'number',
    trend: 2,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Products currently available to customers',
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
    tooltip: 'Products in limited availability pilot programs',
    dataSource: 'Product Management',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'avg-revenue',
    label: 'Avg Revenue/Product',
    value: 2400000,
    format: 'currency',
    trend: 8.3,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average monthly revenue per active product line',
    dataSource: 'Finance',
    lastUpdated: '1 day ago',
  },
  {
    id: 'adoption-rate',
    label: 'Customer Adoption Rate',
    value: 34.2,
    format: 'percent',
    trend: 3.1,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Percent of eligible customers holding 2+ products',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '2 hours ago',
  },
];

export const mockPenetrationKPIs: ProductKPI[] = [
  {
    id: 'overall-penetration',
    label: 'Overall Penetration',
    value: 42.6,
    format: 'percent',
    trend: 2.4,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Eligible customers holding at least one product',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'cross-sell-gap',
    label: 'Cross-Sell Gap',
    value: 1.8,
    format: 'number',
    trend: -0.3,
    trendDirection: 'down',
    isPositiveTrend: true,
    tooltip: 'Avg additional products per customer vs optimal',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'products-per-customer',
    label: 'Products/Customer',
    value: 2.4,
    format: 'number',
    trend: 0.2,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average number of products per active customer',
    dataSource: 'CRM',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'wallet-share',
    label: 'Wallet Share',
    value: 38.5,
    format: 'percent',
    trend: 1.7,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Estimated share of customer financial wallet',
    dataSource: 'Market Intelligence',
    lastUpdated: '1 day ago',
  },
];

export const mockPreQualKPIs: ProductKPI[] = [
  {
    id: 'total-prequal',
    label: 'Total Pre-Qualified',
    value: 3842,
    format: 'number',
    trend: 12.5,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Businesses meeting pre-qualification criteria',
    dataSource: 'LUMIQ AI Signal Engine',
    lastUpdated: '30 mins ago',
  },
  {
    id: 'pct-likely',
    label: '% Likely',
    value: 58.3,
    format: 'percent',
    trend: 4.2,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Pre-qualified businesses rated as likely to qualify',
    dataSource: 'LUMIQ AI Signal Engine',
    lastUpdated: '30 mins ago',
  },
  {
    id: 'pipeline-value',
    label: 'Pipeline Value',
    value: 47200000,
    format: 'currency',
    trend: 15.8,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Estimated total value of pre-qualified pipeline',
    dataSource: 'Portfolio Analytics',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'avg-readiness',
    label: 'Avg Readiness Score',
    value: 72.1,
    format: 'score',
    trend: 2.8,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Average readiness score across pipeline',
    dataSource: 'LUMIQ AI Signal Engine',
    lastUpdated: '30 mins ago',
  },
];

export const mockPerformanceKPIs: ProductKPI[] = [
  {
    id: 'wtd-approval',
    label: 'Weighted Approval Rate',
    value: 76.4,
    format: 'percent',
    trend: 2.1,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Volume-weighted approval rate across all products',
    dataSource: 'Underwriting',
    lastUpdated: '15 mins ago',
  },
  {
    id: 'avg-ttd',
    label: 'Avg Time-to-Decision',
    value: 3.2,
    format: 'number',
    trend: -0.8,
    trendDirection: 'down',
    isPositiveTrend: true,
    tooltip: 'Average business days from application to decision',
    dataSource: 'Underwriting',
    lastUpdated: '15 mins ago',
  },
  {
    id: 'total-funded-30d',
    label: 'Total Funded (30d)',
    value: 28500000,
    format: 'currency',
    trend: 11.2,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Total funded volume in last 30 days',
    dataSource: 'Finance',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'portfolio-growth',
    label: 'Portfolio Growth',
    value: 8.7,
    format: 'percent',
    trend: 1.3,
    trendDirection: 'up',
    isPositiveTrend: true,
    tooltip: 'Year-over-year outstanding balance growth',
    dataSource: 'Finance',
    lastUpdated: '1 day ago',
  },
];

// ============================================
// PENETRATION DATA
// ============================================

export const mockPenetrationByProduct: PenetrationByProduct[] = [
  { product: 'Business Checking', family: 'Deposits', customersHolding: 8420, eligibleCustomers: 9500, penetrationRate: 88.6, crossSellGap: 11.4, revenueOpportunity: 240000 },
  { product: 'Business Cards', family: 'Credit Cards', customersHolding: 5890, eligibleCustomers: 8200, penetrationRate: 71.8, crossSellGap: 28.2, revenueOpportunity: 1150000 },
  { product: 'Merchant Services', family: 'Treasury', customersHolding: 4250, eligibleCustomers: 7100, penetrationRate: 59.9, crossSellGap: 40.1, revenueOpportunity: 2850000 },
  { product: 'Business Savings', family: 'Deposits', customersHolding: 3800, eligibleCustomers: 9500, penetrationRate: 40.0, crossSellGap: 60.0, revenueOpportunity: 570000 },
  { product: 'Business LOC', family: 'Lines of Credit', customersHolding: 2650, eligibleCustomers: 6300, penetrationRate: 42.1, crossSellGap: 57.9, revenueOpportunity: 3650000 },
  { product: 'Equipment Financing', family: 'Equipment Finance', customersHolding: 1180, eligibleCustomers: 3400, penetrationRate: 34.7, crossSellGap: 65.3, revenueOpportunity: 2220000 },
  { product: 'Small Business Term Loan', family: 'Term Loans', customersHolding: 920, eligibleCustomers: 2800, penetrationRate: 32.9, crossSellGap: 67.1, revenueOpportunity: 1880000 },
  { product: 'SBA 7(a)', family: 'SBA Programs', customersHolding: 380, eligibleCustomers: 1500, penetrationRate: 25.3, crossSellGap: 74.7, revenueOpportunity: 1120000 },
  { product: 'Owner-Occupied CRE', family: 'Commercial Real Estate', customersHolding: 340, eligibleCustomers: 1200, penetrationRate: 28.3, crossSellGap: 71.7, revenueOpportunity: 860000 },
  { product: 'Treasury Management', family: 'Treasury', customersHolding: 280, eligibleCustomers: 950, penetrationRate: 29.5, crossSellGap: 70.5, revenueOpportunity: 670000 },
];

export const mockSegmentPenetration: SegmentPenetration[] = [
  { segment: 'Micro (<$1M)', productsPerCustomer: 1.8, walletShare: 28.5, totalCustomers: 4200 },
  { segment: 'Small ($1M–$10M)', productsPerCustomer: 2.6, walletShare: 42.3, totalCustomers: 3800 },
  { segment: 'Mid-Market ($10M+)', productsPerCustomer: 3.8, walletShare: 55.1, totalCustomers: 1500 },
];

export const mockProductCrossSellFunnel: CrossSellFunnelStage[] = [
  { stage: 'Eligible for Additional Product', count: 6800, conversionFromPrevious: 100, avgTimeInStage: 0 },
  { stage: 'Targeted by Campaign', count: 4080, conversionFromPrevious: 60, avgTimeInStage: 5 },
  { stage: 'Engaged / Responded', count: 2448, conversionFromPrevious: 60, avgTimeInStage: 8 },
  { stage: 'Applied', count: 1469, conversionFromPrevious: 60, avgTimeInStage: 12 },
  { stage: 'Approved & Booked', count: 1102, conversionFromPrevious: 75, avgTimeInStage: 3 },
];

// ============================================
// PRE-QUALIFICATION DATA
// ============================================

export const mockPreQualReadiness: PreQualReadiness[] = [
  { product: 'Business LOC', likely: 420, borderline: 180, unlikely: 95, total: 695 },
  { product: 'Business Cards', likely: 680, borderline: 220, unlikely: 110, total: 1010 },
  { product: 'Small Business Term Loan', likely: 280, borderline: 160, unlikely: 120, total: 560 },
  { product: 'SBA 7(a)', likely: 180, borderline: 140, unlikely: 90, total: 410 },
  { product: 'Equipment Financing', likely: 220, borderline: 130, unlikely: 85, total: 435 },
  { product: 'Merchant Services', likely: 460, borderline: 180, unlikely: 92, total: 732 },
];

export const mockPreQualCandidates: PreQualCandidate[] = [
  { businessName: 'Metro Dental Associates', industry: 'Healthcare', annualRevenue: 4200000, readinessScore: 92, readiness: 'Likely', topProduct: 'Owner-Occupied CRE', signals: ['Strong DSCR', 'PAYDEX 82', 'Stable Cash Flow'] },
  { businessName: 'Pacific Coast Builders', industry: 'Construction', annualRevenue: 8700000, readinessScore: 88, readiness: 'Likely', topProduct: 'Equipment Financing', signals: ['Growing Revenue', 'FICO 780', 'Low Utilization'] },
  { businessName: 'Green Valley Restaurants', industry: 'Restaurants', annualRevenue: 2100000, readinessScore: 85, readiness: 'Likely', topProduct: 'Business LOC', signals: ['Positive Cash Trend', 'PAYDEX 78', '5yr Track Record'] },
  { businessName: 'TechForward Solutions', industry: 'Technology', annualRevenue: 12500000, readinessScore: 82, readiness: 'Likely', topProduct: 'Working Capital LOC', signals: ['Strong Revenue', 'Low Leverage', 'FICO 760'] },
  { businessName: 'Midwest Auto Group', industry: 'Automotive', annualRevenue: 6300000, readinessScore: 78, readiness: 'Likely', topProduct: 'Fleet/Auto Program', signals: ['Stable Industry', 'PAYDEX 75', 'Growth Trend'] },
  { businessName: 'Sunrise Childcare Centers', industry: 'Education', annualRevenue: 1800000, readinessScore: 74, readiness: 'Borderline', topProduct: 'SBA 7(a)', signals: ['DSCR 1.15', 'FICO 710', 'High Utilization'] },
  { businessName: 'Coastal Plumbing Services', industry: 'Services', annualRevenue: 950000, readinessScore: 71, readiness: 'Borderline', topProduct: 'Small Business Term Loan', signals: ['Seasonal Revenue', 'PAYDEX 68', 'Limited History'] },
  { businessName: 'Elite Fitness Studios', industry: 'Recreation', annualRevenue: 680000, readinessScore: 65, readiness: 'Borderline', topProduct: 'Business LOC', signals: ['Growing Revenue', 'FICO 690', 'Short Track Record'] },
  { businessName: 'Downtown Print & Ship', industry: 'Retail', annualRevenue: 420000, readinessScore: 58, readiness: 'Unlikely', topProduct: 'Secured Business Card', signals: ['Declining Revenue', 'PAYDEX 55', 'High Leverage'] },
  { businessName: 'Valley Quick Lube', industry: 'Automotive', annualRevenue: 310000, readinessScore: 52, readiness: 'Unlikely', topProduct: 'Secured Business Card', signals: ['Low DSCR', 'FICO 620', 'Payment Delays'] },
];

// ============================================
// PERFORMANCE DATA
// ============================================

export const mockProductPerformance: ProductPerformanceRow[] = [
  { product: 'Business Rewards Visa', family: 'Credit Cards', approvalRate: 82.3, fundingRate: 95.2, avgDealSize: 28000, avgTimeToDecision: 0.5, totalFunded30d: 4200000, yoyGrowth: 12.4 },
  { product: 'Business Cash Back Card', family: 'Credit Cards', approvalRate: 78.1, fundingRate: 94.8, avgDealSize: 15000, avgTimeToDecision: 0.3, totalFunded30d: 2800000, yoyGrowth: 18.2 },
  { product: 'Business LOC', family: 'Lines of Credit', approvalRate: 68.5, fundingRate: 88.3, avgDealSize: 125000, avgTimeToDecision: 3.2, totalFunded30d: 5600000, yoyGrowth: 8.7 },
  { product: 'Working Capital LOC', family: 'Lines of Credit', approvalRate: 72.4, fundingRate: 91.0, avgDealSize: 750000, avgTimeToDecision: 5.1, totalFunded30d: 3200000, yoyGrowth: 6.3 },
  { product: 'Small Business Term Loan', family: 'Term Loans', approvalRate: 65.8, fundingRate: 85.6, avgDealSize: 185000, avgTimeToDecision: 4.5, totalFunded30d: 2900000, yoyGrowth: 10.1 },
  { product: 'Commercial Term Loan', family: 'Term Loans', approvalRate: 71.2, fundingRate: 89.4, avgDealSize: 1200000, avgTimeToDecision: 8.2, totalFunded30d: 2400000, yoyGrowth: 5.8 },
  { product: 'SBA 7(a)', family: 'SBA Programs', approvalRate: 58.9, fundingRate: 78.2, avgDealSize: 425000, avgTimeToDecision: 14.5, totalFunded30d: 1800000, yoyGrowth: 22.4 },
  { product: 'Equipment Financing', family: 'Equipment Finance', approvalRate: 74.6, fundingRate: 92.1, avgDealSize: 165000, avgTimeToDecision: 2.8, totalFunded30d: 2100000, yoyGrowth: 14.6 },
  { product: 'Owner-Occupied CRE', family: 'Commercial Real Estate', approvalRate: 62.3, fundingRate: 82.5, avgDealSize: 1850000, avgTimeToDecision: 18.5, totalFunded30d: 3500000, yoyGrowth: 4.2 },
];

export const mockPerformanceApplicationFunnel: ApplicationFunnelMetrics[] = [
  { product: 'All Products', preQualified: 12400, applied: 7440, approved: 5580, funded: 4650, preQualToApplyRate: 60, applyToApproveRate: 75, avgTimeToDecision: 3.2 },
  { product: 'Credit Cards', preQualified: 5200, applied: 4160, approved: 3536, funded: 3360, preQualToApplyRate: 80, applyToApproveRate: 85, avgTimeToDecision: 0.4 },
  { product: 'LOC', preQualified: 3100, applied: 1860, approved: 1302, funded: 1150, preQualToApplyRate: 60, applyToApproveRate: 70, avgTimeToDecision: 4.1 },
  { product: 'Term Loans', preQualified: 2200, applied: 1100, approved: 770, funded: 660, preQualToApplyRate: 50, applyToApproveRate: 70, avgTimeToDecision: 6.3 },
  { product: 'SBA', preQualified: 1900, applied: 760, approved: 456, funded: 356, preQualToApplyRate: 40, applyToApproveRate: 60, avgTimeToDecision: 14.5 },
];

// ============================================
// ELIGIBILITY MATRIX
// ============================================

export const mockEligibilityRules: EligibilityRule[] = [
  { product: 'Business Rewards Visa', family: 'Credit Cards', timeInBusiness: '2+ years', annualRevenue: '$250K+', dscr: 'N/A', paydex: '65+', fico: '680+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Payment Behavior'], policyNotes: 'Auto-decisioned up to $50K' },
  { product: 'Business Platinum Card', family: 'Credit Cards', timeInBusiness: '3+ years', annualRevenue: '$1M+', dscr: 'N/A', paydex: '70+', fico: '720+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Revenue Growth'], policyNotes: 'Relationship manager approval for >$100K' },
  { product: 'Business Cash Back Card', family: 'Credit Cards', timeInBusiness: '1+ years', annualRevenue: '$100K+', dscr: 'N/A', paydex: '60+', fico: '660+', maxLTV: 'N/A', collateral: 'Unsecured', guarantor: 'Personal', requiredSignals: ['Payment Behavior'], policyNotes: 'Auto-decisioned up to $25K' },
  { product: 'Secured Business Card', family: 'Credit Cards', timeInBusiness: '6+ months', annualRevenue: '$50K+', dscr: 'N/A', paydex: 'Any', fico: '580+', maxLTV: 'N/A', collateral: 'Cash Deposit (100%)', guarantor: 'Personal', requiredSignals: ['Identity Verified'], policyNotes: 'Limit equals deposit amount' },
  { product: 'Business LOC', family: 'Lines of Credit', timeInBusiness: '2+ years', annualRevenue: '$500K+', dscr: '1.15+', paydex: '65+', fico: '680+', maxLTV: 'N/A', collateral: 'Blanket UCC', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Utilization Rate'], policyNotes: 'Annual review required' },
  { product: 'Working Capital LOC', family: 'Lines of Credit', timeInBusiness: '5+ years', annualRevenue: '$5M+', dscr: '1.25+', paydex: '72+', fico: '720+', maxLTV: 'N/A', collateral: 'A/R + Inventory', guarantor: 'Corporate', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Revenue Growth', 'A/R Aging'], policyNotes: 'Borrowing base certificate required monthly' },
  { product: 'Small Business Term Loan', family: 'Term Loans', timeInBusiness: '2+ years', annualRevenue: '$500K+', dscr: '1.20+', paydex: '65+', fico: '680+', maxLTV: 'N/A', collateral: 'Blanket UCC', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Revenue Trend'], policyNotes: 'Requires business plan for amounts >$250K' },
  { product: 'Commercial Term Loan', family: 'Term Loans', timeInBusiness: '5+ years', annualRevenue: '$10M+', dscr: '1.30+', paydex: '75+', fico: '720+', maxLTV: 'N/A', collateral: 'Specific Assets', guarantor: 'Corporate', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Revenue Growth', 'Leverage Ratio'], policyNotes: 'Credit committee approval required' },
  { product: 'SBA 7(a)', family: 'SBA Programs', timeInBusiness: '2+ years', annualRevenue: '$250K+', dscr: '1.15+', paydex: '60+', fico: '680+', maxLTV: '85%', collateral: 'Available Assets', guarantor: 'Personal (20%+)', requiredSignals: ['Cash Flow Stability', 'DSCR', 'SBA Eligibility'], policyNotes: 'Must meet SBA size standards; no passive income' },
  { product: 'SBA 504', family: 'SBA Programs', timeInBusiness: '2+ years', annualRevenue: '$500K+', dscr: '1.20+', paydex: '65+', fico: '680+', maxLTV: '90%', collateral: 'Real Estate/Equipment', guarantor: 'Personal (20%+)', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Job Creation Plan'], policyNotes: 'Must create or retain 1 job per $75K borrowed' },
  { product: 'Equipment Financing', family: 'Equipment Finance', timeInBusiness: '2+ years', annualRevenue: '$500K+', dscr: '1.15+', paydex: '65+', fico: '670+', maxLTV: '100%', collateral: 'Equipment', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Equipment Valuation'], policyNotes: 'Equipment must have verifiable FMV' },
  { product: 'Fleet/Auto Program', family: 'Commercial Auto', timeInBusiness: '2+ years', annualRevenue: '$400K+', dscr: '1.10+', paydex: '60+', fico: '660+', maxLTV: '100%', collateral: 'Vehicle Title', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'Vehicle Valuation'], policyNotes: 'Max vehicle age: 3 years (new), 7 years (used)' },
  { product: 'Owner-Occupied CRE', family: 'Commercial Real Estate', timeInBusiness: '3+ years', annualRevenue: '$1M+', dscr: '1.25+', paydex: '70+', fico: '700+', maxLTV: '80%', collateral: 'Real Estate (1st Lien)', guarantor: 'Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'Appraisal', 'Environmental Review'], policyNotes: 'Phase I ESA required; flood insurance if applicable' },
  { product: 'Investment CRE', family: 'Commercial Real Estate', timeInBusiness: '5+ years', annualRevenue: '$2M+', dscr: '1.30+', paydex: '72+', fico: '720+', maxLTV: '75%', collateral: 'Real Estate (1st Lien)', guarantor: 'Corporate + Personal', requiredSignals: ['Cash Flow Stability', 'DSCR', 'NOI', 'Appraisal', 'Rent Roll'], policyNotes: 'Requires sponsor experience; max 10-year term' },
  { product: 'Business Checking', family: 'Deposits', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: 'CIP/KYB verification required' },
  { product: 'Business Savings', family: 'Deposits', timeInBusiness: 'Any', annualRevenue: 'Any', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Identity Verified', 'OFAC Clear'], policyNotes: 'Tiered rates start at $10K balance' },
  { product: 'Treasury Management', family: 'Treasury', timeInBusiness: '2+ years', annualRevenue: '$5M+', dscr: 'N/A', paydex: 'N/A', fico: 'N/A', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'N/A', requiredSignals: ['Operating Account Relationship'], policyNotes: 'Requires business checking relationship' },
  { product: 'Merchant Services', family: 'Treasury', timeInBusiness: '1+ years', annualRevenue: '$100K+', dscr: 'N/A', paydex: '55+', fico: '620+', maxLTV: 'N/A', collateral: 'N/A', guarantor: 'Personal', requiredSignals: ['Identity Verified', 'Business Verification'], policyNotes: 'PCI compliance required; high-risk MCC surcharge' },
];
