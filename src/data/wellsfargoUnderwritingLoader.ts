/**
 * Wells Fargo Underwriting Queue Loader
 * Maps wellsfargo.json underwriting_queue data to the shape used by wellsfargoDemoData.ts
 */

import wfData from './wellsfargo.json';

// Minimal interface for the wellsfargo.json fields we access
interface WFUnderwritingItem {
  id: string;
  businessName: string;
  product: string;
  requestedAmount: number;
  creditScore: number;
  submittedDate: string;
  status: string;
  priority: string;
}

interface WFData {
  underwriting_queue: WFUnderwritingItem[];
}

// Type assertion for JSON import
const data = wfData as unknown as WFData;

// ─── FICO to LUMIQ conversion ────────────────────────────────────────────

function ficoToLumiq(fico: number): number {
  return Math.round((fico - 300) / 550 * 100);
}

/**
 * Map product names from WF JSON to internal product codes
 */
function mapProductCode(productRequested: string): string {
  const mapping: Record<string, string> = {
    'BusinessLine Line of Credit': 'LOC',
    'SBA 7(a) Loan': 'SBA',
    'Equipment Financing': 'EQF',
    'Prime Line of Credit': 'LOC-P',
    'Commercial Equipment Finance': 'EQF',
    'Commercial Real Estate Loan': 'CRE',
    'Commercial Auto Financing': 'AUTO',
    'Working Capital Loan': 'WCL',
  };
  return mapping[productRequested] || 'LOC';
}

/**
 * Derive risk level from LUMIQ score
 */
function deriveRiskLevel(lumiqScore: number): 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL' {
  if (lumiqScore >= 75) return 'LOW';
  if (lumiqScore >= 65) return 'MODERATE';
  if (lumiqScore >= 55) return 'ELEVATED';
  if (lumiqScore >= 40) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Derive SLA status from submitted date (days since submission)
 */
function deriveSlaStatus(submittedDate: string): 'ok' | 'warning' | 'breach' {
  const submitted = new Date(submittedDate);
  const now = new Date('2026-02-11');
  const hoursInQueue = (now.getTime() - submitted.getTime()) / (1000 * 60 * 60);

  if (hoursInQueue < 48) return 'ok';
  if (hoursInQueue < 96) return 'warning';
  return 'breach';
}

/**
 * Derive time in queue (hours) from submitted date
 */
function deriveTimeInQueue(submittedDate: string): number {
  const submitted = new Date(submittedDate);
  const now = new Date('2026-02-11');
  return Math.round((now.getTime() - submitted.getTime()) / (1000 * 60 * 60));
}

/**
 * Derive recommendation from status and credit score
 */
function deriveRecommendation(status: string, lumiqScore: number): string {
  if (status === 'conditional_approval') return 'conditional_approve';
  if (lumiqScore >= 78) return 'approve';
  if (lumiqScore >= 65) return 'review';
  return 'decline';
}

/**
 * Calculate KPIs from underwriting queue
 */
function calculateKpis(queue: WFUnderwritingItem[]) {
  const total = queue.length;

  const lumiqScores = queue.map(item => ficoToLumiq(item.creditScore));
  const recommendations = queue.map((item, i) => deriveRecommendation(item.status, lumiqScores[i]));

  const approveCount = recommendations.filter(r => r === 'approve').length;
  const reviewCount = recommendations.filter(
    r => r === 'review' || r === 'conditional_approve'
  ).length;

  const totalHours = queue.reduce(
    (sum, item) => sum + deriveTimeInQueue(item.submittedDate),
    0
  );
  const avgHours = total > 0 ? totalHours / total : 0;

  const slaCompliant = queue.filter(
    item => deriveTimeInQueue(item.submittedDate) < 96
  ).length;

  return {
    queueDepth: total,
    avgDecisionTime: avgHours / 24, // Convert hours to days
    autoApproveRate: total > 0 ? approveCount / total : 0,
    manualReviewRate: total > 0 ? reviewCount / total : 0,
    declineRate: total > 0 ? (total - approveCount - reviewCount) / total : 0,
    slaCompliance: total > 0 ? slaCompliant / total : 0,
  };
}

/**
 * Transform underwriting queue data
 */
const queue = data.underwriting_queue.map(item => {
  const lumiqScore = ficoToLumiq(item.creditScore);
  return {
    id: item.id,
    business: item.businessName,
    product: mapProductCode(item.product),
    amount: item.requestedAmount,
    score: lumiqScore,
    risk: deriveRiskLevel(lumiqScore),
    timeInQueue: deriveTimeInQueue(item.submittedDate),
    slaStatus: deriveSlaStatus(item.submittedDate),
  };
});

/**
 * Static underwriting rules
 */
const rules = {
  autoApprove: [
    'Composite Score >= 75',
    'No delinquencies in 24 months',
    'Business age >= 3 years',
    'Amount <= $100,000',
  ],
  autoDecline: [
    'Composite Score < 25',
    'Active bankruptcy',
    'Industry: Cannabis, Gaming, Adult Entertainment',
  ],
};

/**
 * Exported WF underwriting data
 */
export const WF_UNDERWRITING = {
  kpis: calculateKpis(data.underwriting_queue),
  queue,
  rules,
};
