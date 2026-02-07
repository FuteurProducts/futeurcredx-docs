// Bank-safe terminology constants and helpers
// Centralised source of truth for all customer-facing language

export const BANK_TERMS: Record<string, string> = {
  // Entity naming
  customer: 'Business',
  customers: 'Businesses',
  client: 'Relationship',
  user: 'Business',
  account: 'Relationship',

  // Risk language
  score: 'Risk Indicator',
  scores: 'Risk Indicators',
  alert: 'Early Warning Signal',
  alerts: 'Early Warning Signals',
  warning: 'Signal',
  risk_score: 'Risk Indicator',
  credit_score: 'Credit Signal',

  // Action language
  approve: 'Recommend for Approval',
  decline: 'Flag for Review',
  reject: 'Flag for Committee Review',
  auto_approve: 'Pre-Qualification Eligible',
  decision: 'Recommendation',

  // Feature language
  ai_recommendation: 'Decision Support Signal',
  prediction: 'Indicator',
  confidence: 'Signal Strength',
  model: 'Analytical Framework',
};

export const SIGNAL_STATUSES = {
  strong: { label: 'Strong', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  stable: { label: 'Stable', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
  weak: { label: 'Weak', color: 'text-red-700', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
} as const;

export const SIGNAL_DIRECTIONS = {
  improving: { label: 'Improving', icon: 'TrendingUp', color: 'text-emerald-600' },
  stable: { label: 'Stable', icon: 'Minus', color: 'text-amber-600' },
  worsening: { label: 'Worsening', icon: 'TrendingDown', color: 'text-red-600' },
} as const;

export const PRODUCT_READINESS = {
  likely: { label: 'Likely', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  borderline: { label: 'Borderline', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  unlikely: { label: 'Unlikely', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
} as const;

export const CASE_STATUSES = {
  pending_review: { label: 'Pending Review', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200', step: 0 },
  in_review: { label: 'In Review', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', step: 1 },
  conditional: { label: 'Conditional Approval', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', step: 2 },
  approved: { label: 'Approved', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', step: 3 },
  declined: { label: 'Declined', color: 'text-red-700', bg: 'bg-red-50 border-red-200', step: 4 },
} as const;

export type SignalStatus = keyof typeof SIGNAL_STATUSES;
export type SignalDirection = keyof typeof SIGNAL_DIRECTIONS;
export type ProductReadiness = keyof typeof PRODUCT_READINESS;
export type CaseStatus = keyof typeof CASE_STATUSES;

export const DISCLAIMER_TEXT =
  'LumiqAI provides decision-support signals only. It does not replace bureau scores, credit committee judgment, or issue lending decisions.';

export const DISCLAIMER_SHORT =
  'Decision-support signals only — does not replace credit committee judgment.';

export function bankTerm(key: string): string {
  return BANK_TERMS[key.toLowerCase()] ?? key;
}
