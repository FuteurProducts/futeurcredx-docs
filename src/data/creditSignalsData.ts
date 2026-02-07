// Signal-based credit intelligence demo data
// Replaces composite-score model with categorical signals

import type { SignalStatus, SignalDirection, ProductReadiness } from '@/constants/bankTerminology';

// ---------- Types ----------

export interface CreditSignal {
  id: string;
  name: string;
  category: string;
  status: SignalStatus;
  direction: SignalDirection;
  detail: string;
  source: string;
  lastUpdated: string;
}

export interface BureauIndicator {
  id: string;
  name: string;
  provider: string;
  value: string;
  interpretation: string;
  asOfDate: string;
}

export interface ProductReadinessItem {
  productId: string;
  productName: string;
  facilitySize: string;
  readiness: ProductReadiness;
  qualifyingSignal: string;
  concern: string;
}

export interface TrajectoryEvent {
  id: string;
  date: string;
  description: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  source: string;
}

export interface BusinessSignalProfile {
  businessId: string;
  businessName: string;
  industry: string;
  signals: CreditSignal[];
  bureauIndicators: BureauIndicator[];
  productReadiness: ProductReadinessItem[];
  trajectoryEvents: TrajectoryEvent[];
}

// ---------- Signal data keyed by business ----------

const SIGNAL_PROFILES: Record<string, BusinessSignalProfile> = {
  'biz-001': {
    businessId: 'biz-001',
    businessName: 'Stellar Dynamics LLC',
    industry: 'Technology Services (NAICS 541511)',
    signals: [
      { id: 's1', name: 'Payment Behavior', category: 'Trade Credit', status: 'strong', direction: 'improving', detail: '98.2% on-time across 12 active trade lines', source: 'D&B Trade Tape', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's2', name: 'Revenue Trajectory', category: 'Financial', status: 'stable', direction: 'improving', detail: '+8.3% QoQ from deposit activity analysis', source: 'Banking Data Feed', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's3', name: 'Debt Service Coverage', category: 'Financial', status: 'strong', direction: 'stable', detail: 'DSCR 1.8x vs 1.25x policy minimum', source: 'Financial Statements + Banking', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's4', name: 'Trade Credit Standing', category: 'Trade Credit', status: 'stable', direction: 'stable', detail: 'D&B PAYDEX 78, no derogatory filings', source: 'D&B Commercial', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's5', name: 'Cash Flow Consistency', category: 'Banking', status: 'strong', direction: 'improving', detail: 'CV 0.12, 18-month operational runway', source: 'Banking Data Feed', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's6', name: 'Collateral Position', category: 'Secured', status: 'stable', direction: 'stable', detail: 'LTV 62% on primary secured facility', source: 'UCC Filings + Appraisal', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's7', name: 'Owner Credit Profile', category: 'Personal Guarantor', status: 'weak', direction: 'worsening', detail: 'Personal guarantor FICO declined 15pts in 90 days', source: 'Soft Pull — Experian', lastUpdated: '2026-01-28T10:00:00Z' },
    ],
    bureauIndicators: [
      { id: 'b1', name: 'D&B PAYDEX', provider: 'Dun & Bradstreet', value: '78 / 100', interpretation: 'Above median for SIC 5411 (Computer Services)', asOfDate: '2026-01-15' },
      { id: 'b2', name: 'Experian Intelliscore Plus', provider: 'Experian', value: 'Low-Medium Risk Band', interpretation: 'Percentile 62 — moderate commercial credit risk', asOfDate: '2026-01-20' },
      { id: 'b3', name: 'FICO SBSS', provider: 'FICO / SBA', value: 'Pre-screen Eligible (>140)', interpretation: 'Meets SBA 7(a) pre-screen threshold', asOfDate: '2026-01-18' },
    ],
    productReadiness: [
      { productId: 'loc', productName: 'Business Line of Credit ($250K)', facilitySize: '$250,000', readiness: 'likely', qualifyingSignal: 'Strong cash flow, DSCR 1.8x', concern: 'Guarantor FICO trending down' },
      { productId: 'sba', productName: 'SBA 7(a) Loan', facilitySize: '$500,000', readiness: 'likely', qualifyingSignal: 'SBSS eligible, 7yr operating history', concern: 'None material' },
      { productId: 'cre', productName: 'Commercial Real Estate', facilitySize: '$1,200,000', readiness: 'borderline', qualifyingSignal: 'Adequate collateral position', concern: 'Revenue concentration in single vertical' },
      { productId: 'equipment', productName: 'Equipment Financing', facilitySize: '$150,000', readiness: 'likely', qualifyingSignal: 'Strong payment history, low leverage', concern: 'None material' },
      { productId: 'cards', productName: 'Business Credit Card', facilitySize: '$50,000', readiness: 'likely', qualifyingSignal: 'Consistent deposit activity', concern: 'None material' },
      { productId: 'auto', productName: 'Commercial Auto', facilitySize: '$75,000', readiness: 'unlikely', qualifyingSignal: 'N/A — no fleet operations identified', concern: 'No demonstrated business need' },
    ],
    trajectoryEvents: [
      { id: 't1', date: '2026-01-25', description: 'New trade line opened — supplier credit $45K (TechParts Wholesale)', sentiment: 'positive', source: 'D&B Trade Tape' },
      { id: 't2', date: '2026-01-18', description: 'Revenue seasonality detected — Q4 dip consistent with prior 2 years', sentiment: 'neutral', source: 'Banking Data Feed' },
      { id: 't3', date: '2026-01-10', description: 'Guarantor credit utilization increased to 72% (from 58%)', sentiment: 'negative', source: 'Experian Soft Pull' },
      { id: 't4', date: '2025-12-28', description: 'Deposit velocity increased 12% MoM — consistent with Q1 ramp', sentiment: 'positive', source: 'Banking Data Feed' },
      { id: 't5', date: '2025-12-15', description: 'UCC-1 filing renewed on existing secured facility — no change in terms', sentiment: 'neutral', source: 'Secretary of State Filing' },
      { id: 't6', date: '2025-12-01', description: '90-day average balance exceeded $300K threshold for first time', sentiment: 'positive', source: 'Banking Data Feed' },
      { id: 't7', date: '2025-11-20', description: 'D&B PAYDEX improved from 74 to 78', sentiment: 'positive', source: 'D&B Commercial' },
    ],
  },
  'biz-002': {
    businessId: 'biz-002',
    businessName: 'Metro Logistics Corp',
    industry: 'Transportation & Warehousing (NAICS 484110)',
    signals: [
      { id: 's1', name: 'Payment Behavior', category: 'Trade Credit', status: 'stable', direction: 'stable', detail: '91.5% on-time across 8 trade lines', source: 'D&B Trade Tape', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's2', name: 'Revenue Trajectory', category: 'Financial', status: 'stable', direction: 'stable', detail: 'Flat QoQ — seasonal normalization', source: 'Banking Data Feed', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's3', name: 'Debt Service Coverage', category: 'Financial', status: 'stable', direction: 'worsening', detail: 'DSCR 1.35x — approaching 1.25x minimum', source: 'Financial Statements', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's4', name: 'Trade Credit Standing', category: 'Trade Credit', status: 'stable', direction: 'stable', detail: 'D&B PAYDEX 71, one slow-pay notation', source: 'D&B Commercial', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's5', name: 'Cash Flow Consistency', category: 'Banking', status: 'stable', direction: 'stable', detail: 'CV 0.22, moderate seasonality', source: 'Banking Data Feed', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's6', name: 'Collateral Position', category: 'Secured', status: 'strong', direction: 'stable', detail: 'Fleet valued at $1.2M, LTV 45%', source: 'Equipment Appraisal', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's7', name: 'Owner Credit Profile', category: 'Personal Guarantor', status: 'stable', direction: 'stable', detail: 'Guarantor FICO 718, stable 6-month trend', source: 'Soft Pull — Experian', lastUpdated: '2026-01-28T10:00:00Z' },
    ],
    bureauIndicators: [
      { id: 'b1', name: 'D&B PAYDEX', provider: 'Dun & Bradstreet', value: '71 / 100', interpretation: 'Median range for SIC 4210 (Trucking)', asOfDate: '2026-01-15' },
      { id: 'b2', name: 'Experian Intelliscore Plus', provider: 'Experian', value: 'Medium Risk Band', interpretation: 'Percentile 48 — moderate commercial credit risk', asOfDate: '2026-01-20' },
      { id: 'b3', name: 'FICO SBSS', provider: 'FICO / SBA', value: 'Pre-screen Eligible (>140)', interpretation: 'Meets SBA 7(a) pre-screen threshold', asOfDate: '2026-01-18' },
    ],
    productReadiness: [
      { productId: 'loc', productName: 'Business Line of Credit ($150K)', facilitySize: '$150,000', readiness: 'likely', qualifyingSignal: 'Strong collateral, adequate cash flow', concern: 'DSCR trending toward minimum' },
      { productId: 'sba', productName: 'SBA 7(a) Loan', facilitySize: '$350,000', readiness: 'borderline', qualifyingSignal: 'SBSS eligible', concern: 'DSCR compression, seasonal cash flow' },
      { productId: 'equipment', productName: 'Equipment Financing', facilitySize: '$200,000', readiness: 'likely', qualifyingSignal: 'Existing fleet as collateral', concern: 'None material' },
      { productId: 'cards', productName: 'Business Credit Card', facilitySize: '$25,000', readiness: 'likely', qualifyingSignal: 'Consistent deposit activity', concern: 'None material' },
      { productId: 'auto', productName: 'Commercial Auto', facilitySize: '$120,000', readiness: 'likely', qualifyingSignal: 'Core business need, strong fleet history', concern: 'None material' },
      { productId: 'cre', productName: 'Commercial Real Estate', facilitySize: '$800,000', readiness: 'unlikely', qualifyingSignal: 'N/A', concern: 'Insufficient revenue scale for CRE' },
    ],
    trajectoryEvents: [
      { id: 't1', date: '2026-01-22', description: 'Fuel cost increase reflected in operating expenses — 8% MoM', sentiment: 'negative', source: 'Banking Data Feed' },
      { id: 't2', date: '2026-01-15', description: 'New contract awarded — regional distribution for retail chain', sentiment: 'positive', source: 'D&B Trade Tape' },
      { id: 't3', date: '2026-01-05', description: 'DSCR dropped from 1.52x to 1.35x over 90 days', sentiment: 'negative', source: 'Financial Analysis' },
      { id: 't4', date: '2025-12-20', description: 'Fleet maintenance costs normalized after Q3 spike', sentiment: 'positive', source: 'Banking Data Feed' },
      { id: 't5', date: '2025-12-10', description: 'One slow-pay notation added — vendor dispute (resolved)', sentiment: 'neutral', source: 'D&B Commercial' },
    ],
  },
};

// Provide a default profile for any business not explicitly defined
function defaultProfile(businessId: string, name: string): BusinessSignalProfile {
  return {
    businessId,
    businessName: name,
    industry: 'General Business Services',
    signals: [
      { id: 's1', name: 'Payment Behavior', category: 'Trade Credit', status: 'stable', direction: 'stable', detail: '93% on-time across active trade lines', source: 'D&B Trade Tape', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's2', name: 'Revenue Trajectory', category: 'Financial', status: 'stable', direction: 'stable', detail: 'Consistent with historical patterns', source: 'Banking Data Feed', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's3', name: 'Debt Service Coverage', category: 'Financial', status: 'stable', direction: 'stable', detail: 'DSCR 1.5x — within policy range', source: 'Financial Statements', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's4', name: 'Trade Credit Standing', category: 'Trade Credit', status: 'stable', direction: 'stable', detail: 'No derogatory filings', source: 'D&B Commercial', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's5', name: 'Cash Flow Consistency', category: 'Banking', status: 'stable', direction: 'stable', detail: 'Moderate variability within norms', source: 'Banking Data Feed', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's6', name: 'Collateral Position', category: 'Secured', status: 'stable', direction: 'stable', detail: 'Adequate for current facility levels', source: 'UCC Filings', lastUpdated: '2026-01-28T10:00:00Z' },
      { id: 's7', name: 'Owner Credit Profile', category: 'Personal Guarantor', status: 'stable', direction: 'stable', detail: 'Guarantor credit within acceptable range', source: 'Soft Pull — Experian', lastUpdated: '2026-01-28T10:00:00Z' },
    ],
    bureauIndicators: [
      { id: 'b1', name: 'D&B PAYDEX', provider: 'Dun & Bradstreet', value: '72 / 100', interpretation: 'Median range for industry', asOfDate: '2026-01-15' },
      { id: 'b2', name: 'Experian Intelliscore Plus', provider: 'Experian', value: 'Medium Risk Band', interpretation: 'Moderate commercial credit risk', asOfDate: '2026-01-20' },
      { id: 'b3', name: 'FICO SBSS', provider: 'FICO / SBA', value: 'Pre-screen Eligible (>140)', interpretation: 'Meets SBA pre-screen threshold', asOfDate: '2026-01-18' },
    ],
    productReadiness: [
      { productId: 'loc', productName: 'Business Line of Credit', facilitySize: '$100,000', readiness: 'likely', qualifyingSignal: 'Adequate cash flow signals', concern: 'None material' },
      { productId: 'sba', productName: 'SBA 7(a) Loan', facilitySize: '$250,000', readiness: 'borderline', qualifyingSignal: 'SBSS eligible', concern: 'Limited operating history data' },
      { productId: 'cards', productName: 'Business Credit Card', facilitySize: '$25,000', readiness: 'likely', qualifyingSignal: 'Consistent deposit activity', concern: 'None material' },
      { productId: 'equipment', productName: 'Equipment Financing', facilitySize: '$75,000', readiness: 'likely', qualifyingSignal: 'Stable payment patterns', concern: 'None material' },
      { productId: 'cre', productName: 'Commercial Real Estate', facilitySize: 'N/A', readiness: 'unlikely', qualifyingSignal: 'N/A', concern: 'Insufficient scale' },
      { productId: 'auto', productName: 'Commercial Auto', facilitySize: '$50,000', readiness: 'borderline', qualifyingSignal: 'Adequate credit profile', concern: 'No demonstrated fleet need' },
    ],
    trajectoryEvents: [
      { id: 't1', date: '2026-01-20', description: 'No significant changes in signal profile', sentiment: 'neutral', source: 'System' },
    ],
  };
}

export function getBusinessSignalProfile(businessId: string, businessName?: string): BusinessSignalProfile {
  return SIGNAL_PROFILES[businessId] ?? defaultProfile(businessId, businessName ?? businessId);
}

export function getAllProfiledBusinessIds(): string[] {
  return Object.keys(SIGNAL_PROFILES);
}
