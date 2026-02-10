// Underwriting Demo Data — Types and case data
// Extracted from UnderwritingAssistant.tsx for separation of concerns

import type {
  CaseStatus,
  SignalStatus,
  SignalDirection,
} from '@/constants/bankTerminology';

// ============================================
// TYPES
// ============================================

export type PolicyCheckResult = 'pass' | 'review' | 'fail';

export interface PolicyCheck {
  id: string;
  name: string;
  result: PolicyCheckResult;
  value: string;
  threshold: string;
  source: string;
}

export interface SignalSummary {
  name: string;
  status: SignalStatus;
  direction: SignalDirection;
  detail: string;
}

export interface ComparativeBenchmark {
  label: string;
  applicantValue: string;
  portfolioPeerAvg: string;
  industryPeerAvg: string;
}

export type RecommendationAction = 'recommend_approval' | 'request_info' | 'flag_committee' | 'recommend_decline';

export interface CaseApplication {
  id: string;
  caseId: string;
  companyName: string;
  amount: number;
  productType: string;
  caseStatus: CaseStatus;
  assignedAnalyst: string;
  daysInQueue: number;
  slaTarget: number;
  pdBand: string;
  industry: string;
  naicsCode: string;
  established: string;
  yearsInBusiness: number;
  ownerName: string;
  ownership: number;
  address: string;
  tags?: string[];
  signals: SignalSummary[];
  policyChecks: PolicyCheck[];
  benchmarks: ComparativeBenchmark[];
  riskLevel: 'low' | 'moderate' | 'elevated';
  supportingFactors: string[];
  areasOfAttention: string[];
  suggestedNextSteps: string[];
}

// ============================================
// DEMO CASES
// ============================================

export const CASES: CaseApplication[] = [
  {
    id: '1',
    caseId: 'CASE-2026-001',
    companyName: 'Stellar Dynamics LLC',
    amount: 250000,
    productType: 'Business Line of Credit',
    caseStatus: 'in_review',
    assignedAnalyst: 'J. Morrison',
    daysInQueue: 2,
    slaTarget: 5,
    pdBand: 'PD 1.2-2.0% (Investment Grade Equivalent)',
    industry: 'Technology Services',
    naicsCode: '541511',
    established: '2017',
    yearsInBusiness: 7,
    ownerName: 'James Morrison',
    ownership: 85,
    address: '1420 Innovation Way, Austin, TX 78701',
    signals: [
      { name: 'Payment Behavior', status: 'strong', direction: 'improving', detail: '98.2% on-time across 12 trade lines' },
      { name: 'Revenue Trajectory', status: 'stable', direction: 'improving', detail: '+8.3% QoQ from deposit activity' },
      { name: 'Debt Service Coverage', status: 'strong', direction: 'stable', detail: 'DSCR 1.8x vs 1.25x policy minimum' },
      { name: 'Cash Flow Consistency', status: 'strong', direction: 'improving', detail: 'CV 0.12, 18-month runway' },
      { name: 'Owner Credit Profile', status: 'weak', direction: 'worsening', detail: 'Guarantor FICO declined 15pts in 90d' },
    ],
    policyChecks: [
      { id: 'p1', name: 'Minimum Time in Business', result: 'pass', value: '7 years', threshold: '\u2265 2 years', source: 'Secretary of State' },
      { id: 'p2', name: 'Revenue Floor', result: 'pass', value: '$3.4M annual', threshold: '\u2265 $250K', source: 'Banking Data Feed' },
      { id: 'p3', name: 'Owner FICO Floor', result: 'review', value: '742 (declining)', threshold: '\u2265 680', source: 'Experian Soft Pull' },
      { id: 'p4', name: 'Industry Exclusion', result: 'pass', value: 'Technology Services', threshold: 'Not on exclusion list', source: 'Policy Engine' },
      { id: 'p5', name: 'Collateral Coverage', result: 'pass', value: 'LTV 62%', threshold: '\u2264 80% LTV', source: 'UCC + Appraisal' },
      { id: 'p6', name: 'UCC Filing Status', result: 'pass', value: '1 active (current)', threshold: 'No derogatory', source: 'UCC Search' },
      { id: 'p7', name: 'OFAC/BSA Screening', result: 'pass', value: 'Clear', threshold: 'No matches', source: 'Compliance Engine' },
      { id: 'p8', name: 'Debt-to-Income Ratio', result: 'pass', value: '28%', threshold: '\u2264 43%', source: 'Financial Analysis' },
    ],
    benchmarks: [
      { label: 'Default Rate (12mo)', applicantValue: '0.0%', portfolioPeerAvg: '1.8%', industryPeerAvg: '2.1%' },
      { label: 'Avg Facility Utilization', applicantValue: '62%', portfolioPeerAvg: '58%', industryPeerAvg: '65%' },
      { label: 'Payment Timeliness', applicantValue: '98.2%', portfolioPeerAvg: '94.5%', industryPeerAvg: '92.8%' },
      { label: 'Revenue Growth (QoQ)', applicantValue: '+8.3%', portfolioPeerAvg: '+4.2%', industryPeerAvg: '+5.1%' },
    ],
    riskLevel: 'low',
    supportingFactors: [
      'Strong payment history exceeding portfolio median',
      'DSCR well above policy minimum with stable trajectory',
      'Consistent cash flow with low coefficient of variation',
      '7 years operating history in stable industry vertical',
    ],
    areasOfAttention: [
      'Owner/guarantor FICO has declined 15 points in 90 days \u2014 monitor for further deterioration',
      'Revenue concentration in single client vertical (technology)',
    ],
    suggestedNextSteps: [
      'Request updated personal financial statement from guarantor',
      'Verify revenue diversification across client base',
      'Proceed to credit committee with standard documentation package',
    ],
  },
  {
    id: '2',
    caseId: 'CASE-2026-002',
    companyName: 'GreenTech Innovations',
    amount: 150000,
    productType: 'Equipment Financing',
    caseStatus: 'pending_review',
    assignedAnalyst: 'Unassigned',
    daysInQueue: 4,
    slaTarget: 5,
    pdBand: 'PD 3.5-5.0% (Non-Investment Grade)',
    industry: 'Environmental Services',
    naicsCode: '541620',
    established: '2022',
    yearsInBusiness: 2,
    ownerName: 'Sarah Chen',
    ownership: 100,
    address: '890 Eco Boulevard, Portland, OR 97201',
    tags: ['SLA at risk', 'Unassigned'],
    signals: [
      { name: 'Payment Behavior', status: 'stable', direction: 'stable', detail: '85.2% on-time, limited history' },
      { name: 'Revenue Trajectory', status: 'stable', direction: 'improving', detail: 'Growing but limited track record' },
      { name: 'Debt Service Coverage', status: 'weak', direction: 'stable', detail: 'DSCR 1.1x \u2014 at policy minimum' },
      { name: 'Cash Flow Consistency', status: 'weak', direction: 'stable', detail: 'CV 0.35, 3.5-month runway' },
      { name: 'Owner Credit Profile', status: 'stable', direction: 'stable', detail: 'Guarantor FICO 680, stable' },
    ],
    policyChecks: [
      { id: 'p1', name: 'Minimum Time in Business', result: 'pass', value: '2 years', threshold: '\u2265 2 years', source: 'Secretary of State' },
      { id: 'p2', name: 'Revenue Floor', result: 'pass', value: '$820K annual', threshold: '\u2265 $250K', source: 'Banking Data Feed' },
      { id: 'p3', name: 'Owner FICO Floor', result: 'pass', value: '680', threshold: '\u2265 680', source: 'Experian Soft Pull' },
      { id: 'p4', name: 'Industry Exclusion', result: 'pass', value: 'Environmental', threshold: 'Not excluded', source: 'Policy Engine' },
      { id: 'p5', name: 'Collateral Coverage', result: 'review', value: 'Equipment as collateral', threshold: '\u2264 80% LTV', source: 'Pending appraisal' },
      { id: 'p6', name: 'UCC Filing Status', result: 'pass', value: 'None', threshold: 'No derogatory', source: 'UCC Search' },
      { id: 'p7', name: 'OFAC/BSA Screening', result: 'pass', value: 'Clear', threshold: 'No matches', source: 'Compliance Engine' },
      { id: 'p8', name: 'Debt-to-Income Ratio', result: 'fail', value: '48%', threshold: '\u2264 43%', source: 'Financial Analysis' },
    ],
    benchmarks: [
      { label: 'Default Rate (12mo)', applicantValue: 'N/A (new)', portfolioPeerAvg: '3.2%', industryPeerAvg: '4.1%' },
      { label: 'Avg Facility Utilization', applicantValue: 'N/A', portfolioPeerAvg: '52%', industryPeerAvg: '58%' },
      { label: 'Payment Timeliness', applicantValue: '85.2%', portfolioPeerAvg: '91.0%', industryPeerAvg: '89.5%' },
      { label: 'Revenue Growth (QoQ)', applicantValue: '+15.2%', portfolioPeerAvg: '+6.8%', industryPeerAvg: '+7.5%' },
    ],
    riskLevel: 'elevated',
    supportingFactors: [
      'Strong revenue growth trajectory (+15.2% QoQ)',
      'Clean compliance screening',
      'Owner fully committed (100% ownership)',
    ],
    areasOfAttention: [
      'DTI ratio exceeds policy maximum (48% vs 43% threshold)',
      'Limited operating history \u2014 only 2 years',
      'Cash flow runway below comfortable threshold (3.5 months)',
      'DSCR at policy minimum with no cushion',
    ],
    suggestedNextSteps: [
      'Request DTI exception approval from senior credit officer',
      'Obtain equipment appraisal for collateral valuation',
      'Consider reduced facility size to improve coverage ratios',
    ],
  },
  {
    id: '3',
    caseId: 'CASE-2026-003',
    companyName: 'Metro Logistics Corp',
    amount: 500000,
    productType: 'Working Capital',
    caseStatus: 'conditional',
    assignedAnalyst: 'R. Patel',
    daysInQueue: 8,
    slaTarget: 10,
    pdBand: 'PD 0.5-1.2% (Prime)',
    industry: 'Transportation & Warehousing',
    naicsCode: '484110',
    established: '2009',
    yearsInBusiness: 15,
    ownerName: 'Michael Rodriguez',
    ownership: 75,
    address: '2500 Commerce Drive, Chicago, IL 60601',
    tags: ['Conditional'],
    signals: [
      { name: 'Payment Behavior', status: 'strong', direction: 'stable', detail: '99.8% on-time across 45 trade lines' },
      { name: 'Revenue Trajectory', status: 'strong', direction: 'improving', detail: '+12% YoY consistent growth' },
      { name: 'Debt Service Coverage', status: 'strong', direction: 'stable', detail: 'DSCR 2.4x \u2014 well above minimum' },
      { name: 'Cash Flow Consistency', status: 'strong', direction: 'stable', detail: 'CV 0.08, 12.5-month runway' },
      { name: 'Owner Credit Profile', status: 'strong', direction: 'stable', detail: 'Guarantor FICO 790, stable 12mo' },
    ],
    policyChecks: [
      { id: 'p1', name: 'Minimum Time in Business', result: 'pass', value: '15 years', threshold: '\u2265 2 years', source: 'Secretary of State' },
      { id: 'p2', name: 'Revenue Floor', result: 'pass', value: '$8.2M annual', threshold: '\u2265 $250K', source: 'Banking Data Feed' },
      { id: 'p3', name: 'Owner FICO Floor', result: 'pass', value: '790', threshold: '\u2265 680', source: 'Experian Soft Pull' },
      { id: 'p4', name: 'Industry Exclusion', result: 'pass', value: 'Transportation', threshold: 'Not excluded', source: 'Policy Engine' },
      { id: 'p5', name: 'Collateral Coverage', result: 'pass', value: 'Fleet $1.2M, LTV 45%', threshold: '\u2264 80% LTV', source: 'Equipment Appraisal' },
      { id: 'p6', name: 'UCC Filing Status', result: 'pass', value: '2 active (current)', threshold: 'No derogatory', source: 'UCC Search' },
      { id: 'p7', name: 'OFAC/BSA Screening', result: 'pass', value: 'Clear', threshold: 'No matches', source: 'Compliance Engine' },
      { id: 'p8', name: 'Debt-to-Income Ratio', result: 'pass', value: '22%', threshold: '\u2264 43%', source: 'Financial Analysis' },
    ],
    benchmarks: [
      { label: 'Default Rate (12mo)', applicantValue: '0.0%', portfolioPeerAvg: '1.5%', industryPeerAvg: '2.3%' },
      { label: 'Avg Facility Utilization', applicantValue: '45%', portfolioPeerAvg: '55%', industryPeerAvg: '61%' },
      { label: 'Payment Timeliness', applicantValue: '99.8%', portfolioPeerAvg: '95.2%', industryPeerAvg: '93.1%' },
      { label: 'Revenue Growth (QoQ)', applicantValue: '+3.0%', portfolioPeerAvg: '+2.8%', industryPeerAvg: '+1.9%' },
    ],
    riskLevel: 'low',
    supportingFactors: [
      'Exceptional payment history \u2014 top decile of portfolio',
      'DSCR 2.4x provides significant debt service cushion',
      'Strong fleet collateral with conservative LTV',
      '15-year operating history with consistent profitability',
      'Owner FICO 790 \u2014 excellent personal credit standing',
    ],
    areasOfAttention: [
      'Conditional on updated fleet appraisal (pending)',
      'Fuel cost exposure in current macro environment',
    ],
    suggestedNextSteps: [
      'Obtain updated fleet appraisal to clear conditional status',
      'Present to credit committee for final approval',
    ],
  },
  {
    id: '4',
    caseId: 'CASE-2026-004',
    companyName: 'QuickServe Restaurants',
    amount: 75000,
    productType: 'Business Term Loan',
    caseStatus: 'declined',
    assignedAnalyst: 'K. Williams',
    daysInQueue: 6,
    slaTarget: 5,
    pdBand: 'PD 8.0-12.0% (Substandard)',
    industry: 'Food Services',
    naicsCode: '722511',
    established: '2019',
    yearsInBusiness: 5,
    ownerName: 'David Thompson',
    ownership: 60,
    address: '456 Main Street, Denver, CO 80202',
    tags: ['Multiple policy failures'],
    signals: [
      { name: 'Payment Behavior', status: 'weak', direction: 'worsening', detail: '72.5% on-time, 90-day delinquency noted' },
      { name: 'Revenue Trajectory', status: 'weak', direction: 'worsening', detail: '-12% QoQ decline in deposit activity' },
      { name: 'Debt Service Coverage', status: 'weak', direction: 'worsening', detail: 'DSCR 0.85x \u2014 below breakeven' },
      { name: 'Cash Flow Consistency', status: 'weak', direction: 'worsening', detail: 'CV 0.52, 1.2-month runway' },
      { name: 'Owner Credit Profile', status: 'weak', direction: 'worsening', detail: 'Guarantor FICO 580, lien detected' },
    ],
    policyChecks: [
      { id: 'p1', name: 'Minimum Time in Business', result: 'pass', value: '5 years', threshold: '\u2265 2 years', source: 'Secretary of State' },
      { id: 'p2', name: 'Revenue Floor', result: 'pass', value: '$480K annual', threshold: '\u2265 $250K', source: 'Banking Data Feed' },
      { id: 'p3', name: 'Owner FICO Floor', result: 'fail', value: '580', threshold: '\u2265 680', source: 'Experian Soft Pull' },
      { id: 'p4', name: 'Industry Exclusion', result: 'pass', value: 'Food Services', threshold: 'Not excluded', source: 'Policy Engine' },
      { id: 'p5', name: 'Collateral Coverage', result: 'fail', value: 'No collateral offered', threshold: '\u2264 80% LTV', source: 'N/A' },
      { id: 'p6', name: 'UCC Filing Status', result: 'review', value: 'Tax lien detected', threshold: 'No derogatory', source: 'UCC Search' },
      { id: 'p7', name: 'OFAC/BSA Screening', result: 'pass', value: 'Clear', threshold: 'No matches', source: 'Compliance Engine' },
      { id: 'p8', name: 'Debt-to-Income Ratio', result: 'fail', value: '62%', threshold: '\u2264 43%', source: 'Financial Analysis' },
    ],
    benchmarks: [
      { label: 'Default Rate (12mo)', applicantValue: 'N/A (est. >8%)', portfolioPeerAvg: '2.8%', industryPeerAvg: '4.5%' },
      { label: 'Avg Facility Utilization', applicantValue: 'N/A', portfolioPeerAvg: '48%', industryPeerAvg: '55%' },
      { label: 'Payment Timeliness', applicantValue: '72.5%', portfolioPeerAvg: '90.2%', industryPeerAvg: '87.5%' },
      { label: 'Revenue Growth (QoQ)', applicantValue: '-12.0%', portfolioPeerAvg: '+3.5%', industryPeerAvg: '+2.1%' },
    ],
    riskLevel: 'elevated',
    supportingFactors: [
      '5 years operating history in known industry',
      'Clean OFAC/BSA screening',
    ],
    areasOfAttention: [
      'Owner FICO 580 \u2014 below policy minimum of 680',
      'DSCR below breakeven at 0.85x',
      'Active tax lien on record',
      'DTI ratio 62% \u2014 significantly exceeds 43% maximum',
      'Cash flow runway critically low at 1.2 months',
      '90-day payment delinquency in trade data',
    ],
    suggestedNextSteps: [
      'Decline recommendation documented \u2014 multiple policy threshold failures',
      'Provide applicant with adverse action notice per Reg B requirements',
      'Suggest alternative: smaller facility with personal collateral pledge',
    ],
  },
  {
    id: '5',
    caseId: 'CASE-2026-005',
    companyName: 'Apex Construction Group',
    amount: 350000,
    productType: 'Equipment Financing',
    caseStatus: 'in_review',
    assignedAnalyst: 'J. Morrison',
    daysInQueue: 1,
    slaTarget: 5,
    pdBand: 'PD 2.0-3.5% (Near-Investment Grade)',
    industry: 'Construction',
    naicsCode: '236220',
    established: '2014',
    yearsInBusiness: 10,
    ownerName: 'Robert Williams',
    ownership: 90,
    address: '780 Industrial Parkway, Phoenix, AZ 85004',
    tags: ['Seasonal revenue'],
    signals: [
      { name: 'Payment Behavior', status: 'strong', direction: 'stable', detail: '96.2% on-time across 32 trade lines' },
      { name: 'Revenue Trajectory', status: 'stable', direction: 'stable', detail: 'Seasonal pattern \u2014 consistent with prior years' },
      { name: 'Debt Service Coverage', status: 'stable', direction: 'stable', detail: 'DSCR 1.45x \u2014 adequate with seasonal adjustment' },
      { name: 'Cash Flow Consistency', status: 'stable', direction: 'stable', detail: 'CV 0.28, 5.8-month runway' },
      { name: 'Owner Credit Profile', status: 'strong', direction: 'stable', detail: 'Guarantor FICO 720, stable 12mo' },
    ],
    policyChecks: [
      { id: 'p1', name: 'Minimum Time in Business', result: 'pass', value: '10 years', threshold: '\u2265 2 years', source: 'Secretary of State' },
      { id: 'p2', name: 'Revenue Floor', result: 'pass', value: '$5.1M annual', threshold: '\u2265 $250K', source: 'Banking Data Feed' },
      { id: 'p3', name: 'Owner FICO Floor', result: 'pass', value: '720', threshold: '\u2265 680', source: 'Experian Soft Pull' },
      { id: 'p4', name: 'Industry Exclusion', result: 'pass', value: 'Construction', threshold: 'Not excluded', source: 'Policy Engine' },
      { id: 'p5', name: 'Collateral Coverage', result: 'pass', value: 'Equipment collateral', threshold: '\u2264 80% LTV', source: 'Equipment Appraisal' },
      { id: 'p6', name: 'UCC Filing Status', result: 'pass', value: '1 active (current)', threshold: 'No derogatory', source: 'UCC Search' },
      { id: 'p7', name: 'OFAC/BSA Screening', result: 'pass', value: 'Clear', threshold: 'No matches', source: 'Compliance Engine' },
      { id: 'p8', name: 'Debt-to-Income Ratio', result: 'pass', value: '31%', threshold: '\u2264 43%', source: 'Financial Analysis' },
    ],
    benchmarks: [
      { label: 'Default Rate (12mo)', applicantValue: '0.0%', portfolioPeerAvg: '2.1%', industryPeerAvg: '3.2%' },
      { label: 'Avg Facility Utilization', applicantValue: '55%', portfolioPeerAvg: '58%', industryPeerAvg: '62%' },
      { label: 'Payment Timeliness', applicantValue: '96.2%', portfolioPeerAvg: '93.8%', industryPeerAvg: '91.5%' },
      { label: 'Revenue Growth (QoQ)', applicantValue: '-2.0% (seasonal)', portfolioPeerAvg: '+1.5%', industryPeerAvg: '+0.8%' },
    ],
    riskLevel: 'moderate',
    supportingFactors: [
      'Strong payment history \u2014 above portfolio median',
      '10-year operating history with predictable seasonal patterns',
      'All policy checks passed',
      'Equipment collateral provides adequate coverage',
    ],
    areasOfAttention: [
      'Seasonal revenue pattern requires adjusted cash flow analysis',
      'Construction industry cyclicality in current macro environment',
    ],
    suggestedNextSteps: [
      'Complete seasonal cash flow adjustment analysis',
      'Verify equipment specifications match financing request',
      'Present to credit committee with standard package',
    ],
  },
];

// ============================================
// QUEUE STATISTICS
// ============================================

export const QUEUE_STATS = [
  { label: 'Pending Review', value: 23, color: 'text-slate-600' },
  { label: 'In Review', value: 15, color: 'text-blue-600' },
  { label: 'Conditional', value: 8, color: 'text-amber-600' },
  { label: 'Approved (MTD)', value: 47, color: 'text-emerald-600' },
  { label: 'Declined (MTD)', value: 12, color: 'text-red-600' },
  { label: 'Avg Days to Decision', value: '3.8', color: 'text-muted-foreground' },
];

// ============================================
// RECOMMENDATION ACTION LABELS
// ============================================

export const RECOMMENDATION_LABELS: Record<RecommendationAction, string> = {
  recommend_approval: 'Recommended for Approval',
  request_info: 'Additional Information Requested',
  flag_committee: 'Flagged for Committee Review',
  recommend_decline: 'Decline Recommended',
};
