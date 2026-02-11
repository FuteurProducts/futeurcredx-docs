/**
 * Citi Underwriting Queue Loader
 * Maps citi.json underwriting_queue data to the shape used by citiDemoData.ts
 */

import citiData from './citi.json';

// Minimal interface for the citi.json fields we access
interface CitiUnderwritingItem {
  id: string;
  business: string;
  product: string;
  amount: number;
  score: number;
  risk: string;
  time_in_queue: number;
  sla_status: string;
  segment: string;
  state: string;
  revenue: number;
}

interface CitiData {
  underwriting_queue: CitiUnderwritingItem[];
}

// Type assertion for JSON import
const data = citiData as unknown as CitiData;

/**
 * Derive risk level from string (already in proper format)
 */
function deriveRiskLevel(risk: string): 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL' {
  if (risk === 'LOW') return 'LOW';
  if (risk === 'MODERATE') return 'MODERATE';
  if (risk === 'ELEVATED') return 'ELEVATED';
  if (risk === 'HIGH') return 'HIGH';
  return 'CRITICAL';
}

/**
 * Derive SLA status from string (already in proper format)
 */
function deriveSlaStatus(status: string): 'ok' | 'warning' | 'breach' {
  if (status === 'ok') return 'ok';
  if (status === 'warning') return 'warning';
  return 'breach';
}

/**
 * Calculate KPIs from underwriting queue
 */
function calculateKpis(queue: CitiUnderwritingItem[]) {
  const total = queue.length;

  const approveCount = queue.filter((item) => item.risk === 'LOW').length;
  const reviewCount = queue.filter(
    (item) => item.risk === 'MODERATE' || item.risk === 'ELEVATED'
  ).length;

  const totalHours = queue.reduce((sum, item) => sum + item.time_in_queue, 0);
  const avgHours = total > 0 ? totalHours / total : 0;

  const slaCompliant = queue.filter((item) => item.sla_status === 'ok').length;

  return {
    queueDepth: total,
    avgDecisionTime: avgHours,
    autoApproveRate: total > 0 ? approveCount / total : 0,
    manualReviewRate: total > 0 ? reviewCount / total : 0,
    declineRate: total > 0 ? (total - approveCount - reviewCount) / total : 0,
    slaCompliance: total > 0 ? slaCompliant / total : 0,
  };
}

/**
 * Transform underwriting queue data
 */
const queue = data.underwriting_queue.map((item) => ({
  id: item.id,
  business: item.business,
  product: item.product,
  amount: item.amount,
  score: Math.round(item.score),
  risk: deriveRiskLevel(item.risk),
  timeInQueue: item.time_in_queue,
  slaStatus: deriveSlaStatus(item.sla_status),
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
 * Exported Citi underwriting data
 */
export const CITI_UNDERWRITING = {
  kpis: calculateKpis(data.underwriting_queue),
  queue,
  rules,
};
