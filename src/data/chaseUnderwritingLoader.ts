/**
 * Chase Underwriting Queue Loader
 * Maps chase.json underwriting_queue data to the shape used by chaseDemoData.ts
 */

import chaseData from './chase.json';

// Minimal interface for the chase.json fields we access
interface ChaseUnderwritingItem {
  id: string;
  business_name: string;
  product_requested: string;
  amount_requested: number;
  credit_score: number;
  time_in_queue_hours: number;
  recommendation: string;
}

interface ChaseData {
  underwriting_queue: ChaseUnderwritingItem[];
}

// Type assertion for JSON import
const data = chaseData as unknown as ChaseData;

/**
 * Map product names from Chase JSON to internal product codes
 */
function mapProductCode(productRequested: string): string {
  const mapping: Record<string, string> = {
    'Equipment Financing': 'EQUIPMENT',
    'Business Line of Credit': 'LOC',
    'Business Term Loan': 'TERM',
    'SBA 7(a) Loan': 'SBA',
  };
  return mapping[productRequested] || 'TERM';
}

/**
 * Derive risk level from credit score
 */
function deriveRiskLevel(score: number): 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL' {
  if (score >= 75) return 'LOW';
  if (score >= 65) return 'MODERATE';
  if (score >= 55) return 'ELEVATED';
  if (score >= 40) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Derive SLA status from time in queue
 */
function deriveSlaStatus(hours: number): 'ok' | 'warning' | 'breach' {
  if (hours < 24) return 'ok';
  if (hours < 48) return 'warning';
  return 'breach';
}

/**
 * Calculate KPIs from underwriting queue
 */
function calculateKpis(queue: ChaseUnderwritingItem[]) {
  const total = queue.length;

  const approveCount = queue.filter(item => item.recommendation === 'approve').length;
  const reviewCount = queue.filter(
    item => item.recommendation === 'review' || item.recommendation === 'conditional_approve'
  ).length;

  const totalHours = queue.reduce((sum, item) => sum + item.time_in_queue_hours, 0);
  const avgHours = total > 0 ? totalHours / total : 0;

  const slaCompliant = queue.filter(item => item.time_in_queue_hours < 48).length;

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
const queue = data.underwriting_queue.map(item => ({
  id: item.id,
  business: item.business_name,
  product: mapProductCode(item.product_requested),
  amount: item.amount_requested,
  score: Math.round(item.credit_score),
  risk: deriveRiskLevel(item.credit_score),
  timeInQueue: item.time_in_queue_hours,
  slaStatus: deriveSlaStatus(item.time_in_queue_hours),
}));

/**
 * Static underwriting rules (unchanged from chaseDemoData.ts)
 */
const rules = {
  autoApprove: [
    'Composite Score ≥ 75',
    'No delinquencies in 24 months',
    'Business age ≥ 3 years',
    'Amount ≤ $100,000',
  ],
  autoDecline: [
    'Composite Score < 25',
    'Active bankruptcy',
    'Industry: Cannabis, Gaming, Adult Entertainment',
  ],
};

/**
 * Exported Chase underwriting data
 */
export const CHASE_UNDERWRITING = {
  kpis: calculateKpis(data.underwriting_queue),
  queue,
  rules,
};
