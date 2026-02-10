/**
 * Centralized formatting utilities — SINGLE SOURCE OF TRUTH
 * Import from here. Never define local formatCurrency/formatNumber/etc.
 */

// ── Number Formatting ────────────────────────────────────────────

export const formatCurrency = (value: number): string => {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString('en-US')}`;
};

export const formatNumber = (value: number): string =>
  value.toLocaleString('en-US');

export const formatPercent = (value: number, decimals = 1): string =>
  `${(value * 100).toFixed(decimals)}%`;

// ── Risk Color Vocabulary ────────────────────────────────────────

export type RiskTier = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

const RISK_HEX: Record<string, string> = {
  LOW: '#28A745',
  MODERATE: '#2E86AB',
  ELEVATED: '#F5A623',
  HIGH: '#E67E22',
  CRITICAL: '#DC3545',
};

/** Returns hex color for chart/inline-style use */
export const getRiskColor = (risk: string): string =>
  RISK_HEX[risk] ?? '#6B7280';

const RISK_CLASSES: Record<string, string> = {
  LOW: 'text-emerald-600',
  MODERATE: 'text-blue-600',
  ELEVATED: 'text-amber-500',
  HIGH: 'text-orange-500',
  CRITICAL: 'text-red-600',
};

const RISK_BG_CLASSES: Record<string, string> = {
  LOW: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  MODERATE: 'bg-blue-100 text-blue-700 border-blue-200',
  ELEVATED: 'bg-amber-100 text-amber-700 border-amber-200',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
  CRITICAL: 'bg-red-100 text-red-700 border-red-200',
};

/** Returns Tailwind text color class */
export const getRiskColorClass = (risk: string): string =>
  RISK_CLASSES[risk] ?? 'text-gray-500';

/** Returns Tailwind bg + text + border classes for badges */
export const getRiskBadgeClass = (risk: string): string =>
  RISK_BG_CLASSES[risk] ?? 'bg-gray-100 text-gray-700 border-gray-200';

// ── Status Color Vocabulary ──────────────────────────────────────

const STATUS_HEX: Record<string, string> = {
  ok: '#28A745',
  safe: '#28A745',
  on_track: '#28A745',
  performing: '#28A745',
  top_performer: '#28A745',
  warning: '#F5A623',
  review: '#F5A623',
  below_target: '#F5A623',
  below_benchmark: '#F5A623',
  breach: '#DC3545',
  flag: '#DC3545',
  at_risk: '#DC3545',
  critical: '#DC3545',
};

/** Returns hex color for chart/inline-style use */
export const getStatusColor = (status: string): string =>
  STATUS_HEX[status] ?? '#6B7280';

const STATUS_CLASSES: Record<string, string> = {
  ok: 'text-emerald-600',
  safe: 'text-emerald-600',
  on_track: 'text-emerald-600',
  performing: 'text-emerald-600',
  top_performer: 'text-emerald-600',
  warning: 'text-amber-500',
  review: 'text-amber-500',
  below_target: 'text-amber-500',
  below_benchmark: 'text-amber-500',
  breach: 'text-red-600',
  flag: 'text-red-600',
  at_risk: 'text-red-600',
  critical: 'text-red-600',
};

const STATUS_BG_CLASSES: Record<string, string> = {
  ok: 'bg-emerald-100 text-emerald-700',
  safe: 'bg-emerald-100 text-emerald-700',
  on_track: 'bg-emerald-100 text-emerald-700',
  performing: 'bg-emerald-100 text-emerald-700',
  top_performer: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  review: 'bg-amber-100 text-amber-700',
  below_target: 'bg-amber-100 text-amber-700',
  below_benchmark: 'bg-amber-100 text-amber-700',
  breach: 'bg-red-100 text-red-700',
  flag: 'bg-red-100 text-red-700',
  at_risk: 'bg-red-100 text-red-700',
  critical: 'bg-red-100 text-red-700',
};

/** Returns Tailwind text color class */
export const getStatusColorClass = (status: string): string =>
  STATUS_CLASSES[status] ?? 'text-gray-500';

/** Returns Tailwind badge classes */
export const getStatusBadgeClass = (status: string): string =>
  STATUS_BG_CLASSES[status] ?? 'bg-gray-100 text-gray-700';

// ── Threshold helpers ────────────────────────────────────────────

export type ThresholdStatus = 'ok' | 'warning' | 'danger';

/** Returns threshold status based on value vs thresholds */
export const getThresholdStatus = (
  value: number,
  warningAt: number,
  dangerAt: number,
  /** true = higher is worse (e.g. concentration), false = lower is worse (e.g. SLA) */
  higherIsWorse = true,
): ThresholdStatus => {
  if (higherIsWorse) {
    if (value >= dangerAt) return 'danger';
    if (value >= warningAt) return 'warning';
    return 'ok';
  }
  if (value <= dangerAt) return 'danger';
  if (value <= warningAt) return 'warning';
  return 'ok';
};

export const getThresholdColorClass = (status: ThresholdStatus): string => {
  const map: Record<ThresholdStatus, string> = {
    ok: 'text-emerald-600',
    warning: 'text-amber-500',
    danger: 'text-red-600',
  };
  return map[status];
};

export const getThresholdBgClass = (status: ThresholdStatus): string => {
  const map: Record<ThresholdStatus, string> = {
    ok: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  };
  return map[status];
};

// ── SLA helpers ──────────────────────────────────────────────────

export const getSLAIndicator = (status: string): { label: string; colorClass: string } => {
  const map: Record<string, { label: string; colorClass: string }> = {
    ok: { label: 'On Track', colorClass: 'text-emerald-600' },
    warning: { label: 'At Risk', colorClass: 'text-amber-500' },
    breach: { label: 'Breached', colorClass: 'text-red-600' },
  };
  return map[status] ?? { label: status, colorClass: 'text-gray-500' };
};

// ── Severity helpers ─────────────────────────────────────────────

const SEVERITY_CLASSES: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 border-red-300',
  high: 'bg-orange-100 text-orange-700 border-orange-300',
  medium: 'bg-amber-100 text-amber-700 border-amber-300',
  low: 'bg-blue-100 text-blue-700 border-blue-300',
};

export const getSeverityBadgeClass = (severity: string): string =>
  SEVERITY_CLASSES[severity] ?? 'bg-gray-100 text-gray-700 border-gray-300';

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-amber-500',
  low: 'bg-blue-500',
};

export const getSeverityDotClass = (severity: string): string =>
  SEVERITY_DOT[severity] ?? 'bg-gray-400';
