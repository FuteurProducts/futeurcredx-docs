/**
 * Santander Underwriting Queue Loader
 * Maps santander.json underwriting_queue data to the shape used by santanderDemoData.ts
 */

import santanderData from './santander.json';

// Minimal interface for the santander.json fields we access
interface SantanderUnderwritingItem {
  id: string;
  business_name: string;
  product_requested: string;
  amount_requested: number;
  lumiq_score: number;
  submitted_date: string;
  days_in_queue: number;
  recommendation: string;
}

interface SantanderData {
  underwriting_queue: SantanderUnderwritingItem[];
}

// Type assertion for JSON import
const data = santanderData as unknown as SantanderData;

/**
 * FICO to LUMIQ conversion
 */
function ficoToLumiq(fico: number): number {
  return Math.round((fico - 300) / 550 * 100);
}

/**
 * Map product names from Santander JSON to internal product codes
 */
function mapProductCode(productRequested: string): string {
  const mapping: Record<string, string> = {
    'Equipment Financing': 'EQUIPMENT',
    'Business Line of Credit': 'LOC',
    'Business Term Loan': 'TERM',
    'SBA Express Loan': 'SBA_EXPRESS',
    'Commercial Real Estate Mortgage': 'CRE',
  };
  return mapping[productRequested] || 'TERM';
}

/**
 * Derive risk level from LUMIQ score (0-100)
 */
function deriveRiskLevel(score: number): 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL' {
  if (score >= 75) return 'LOW';
  if (score >= 65) return 'MODERATE';
  if (score >= 55) return 'ELEVATED';
  if (score >= 40) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Derive SLA status from days in queue
 */
function deriveSlaStatus(days: number): 'ok' | 'warning' | 'breach' {
  if (days < 1) return 'ok';
  if (days < 2) return 'warning';
  return 'breach';
}

/**
 * Calculate KPIs from underwriting queue
 */
function calculateKpis(queue: SantanderUnderwritingItem[]) {
  const total = queue.length;

  const approveCount = queue.filter(item => {
    const rec = item.recommendation.toLowerCase();
    return rec.includes('approve') && !rec.includes('conditional');
  }).length;

  const reviewCount = queue.filter(
    item => {
      const rec = item.recommendation.toLowerCase();
      return rec.includes('review') || rec.includes('conditional');
    }
  ).length;

  const totalDays = queue.reduce((sum, item) => sum + item.days_in_queue, 0);
  const avgDays = total > 0 ? totalDays / total : 0;

  const slaCompliant = queue.filter(item => item.days_in_queue < 2).length;

  return {
    queueDepth: total,
    avgDecisionTime: avgDays,
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
  const lumiqScore = ficoToLumiq(item.lumiq_score);
  return {
    id: item.id,
    business: item.business_name,
    product: mapProductCode(item.product_requested),
    amount: item.amount_requested,
    score: lumiqScore,
    risk: deriveRiskLevel(lumiqScore),
    timeInQueue: item.days_in_queue * 24, // Convert days to hours for consistency
    slaStatus: deriveSlaStatus(item.days_in_queue),
  };
});

/**
 * Static underwriting rules (Santander-specific)
 */
const rules = {
  autoApprove: [
    'Composite Score ≥ 75',
    'No delinquencies in 24 months',
    'Business age ≥ 2 years',
    'Amount ≤ $75,000',
  ],
  autoDecline: [
    'Composite Score < 25',
    'Active bankruptcy',
    'Industry: Cannabis, Gaming',
  ],
};

/**
 * Exported Santander underwriting data
 */
export const SANT_UNDERWRITING = {
  kpis: calculateKpis(data.underwriting_queue),
  queue,
  rules,
};
