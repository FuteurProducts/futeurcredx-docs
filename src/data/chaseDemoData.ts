/**
 * CHASE DEMO DATA — INSTITUTIONAL GRADE
 *
 * Single source of truth for all Chase bank demo data.
 * All values derived from chase.json (6M businesses, $650B exposure).
 */

// ── Types ────────────────────────────────────────────────────────

export type SegmentStatus = 'top_performer' | 'performing' | 'below_benchmark' | 'at_risk';
export type SegmentTrend = 'up' | 'down' | 'stable';
export type CampaignHealth = 'on_track' | 'below_target' | 'paused' | 'completed';
export type EWSSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ConcentrationStatus = 'safe' | 'warning' | 'breach';
export type ComplianceStatus = 'ok' | 'review' | 'flag';
export type SLAStatus = 'ok' | 'warning' | 'breach';
export type RiskTier = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export interface Segment {
  id: string;
  name: string;
  icon: string;
  businessCount: number;
  exposure: number;
  avgScore: number;
  preQualRate: number;
  riskDistribution: Record<string, number>;
  conversionRate: number;
  status: SegmentStatus;
  trend: SegmentTrend;
  productEligibility: Record<string, number>;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  health: CampaignHealth;
  targetSegment: string;
  targetCriteria: string;
  product: string;
  startDate: string;
  endDate: string;
  owner: string;
  funnel: {
    pushed: number;
    viewed: number;
    applied: number;
    approved: number;
  };
  viewRate: number;
  applyRate: number;
  approvalRate: number;
  approvedVolume: number;
  warning?: string;
}

export interface EWSCluster {
  id: string;
  type: string;
  severity: EWSSeverity;
  title: string;
  businessCount: number;
  exposure: number;
  heaviestSegments: { segment: string; count: number }[];
  actions: string[];
}

export interface ConcentrationEntry {
  name: string;
  percent: number;
  exposure: number;
  status: ConcentrationStatus;
}

export interface UnderwritingQueueItem {
  id: string;
  business: string;
  product: string;
  amount: number;
  score: number;
  risk: RiskTier;
  timeInQueue: number;
  slaStatus: SLAStatus;
}

export interface ComplianceVariance {
  segment: string;
  applications: number;
  approved: number;
  rate: number;
  variance: number;
  status: ComplianceStatus;
}

export interface SavedSegment {
  id: string;
  name: string;
  businessCount: number;
  exposure: number;
  createdAt: string;
}

export interface SampleBusiness {
  id: string;
  name: string;
  revenue: number;
  score: number;
  risk: RiskTier;
  status: string;
  segment: string;
  state: string;
}

// ── Bank switching ──────────────────────────────────────────────

import { ACTIVE_BANK_ID } from './bankConfig';

// ── Imports from Chase loaders ──────────────────────────────────

import { CHASE_PORTFOLIO, CHASE_SEGMENTS, CHASE_RISK_TIERS } from './chasePortfolioLoader';
import { CHASE_CAMPAIGNS, CHASE_CAMPAIGN_SUMMARY, CHASE_CONVERSION_BY_SEGMENT } from './chaseCampaignLoader';
import { CHASE_RISK_KPIS, CHASE_CONCENTRATION, CHASE_EWS_CLUSTERS, CHASE_COMPLIANCE } from './chaseRiskLoader';
import { CHASE_UNDERWRITING } from './chaseUnderwritingLoader';
import { CHASE_FILTER_OPTIONS, CHASE_SAVED_SEGMENTS, CHASE_SAMPLE_BUSINESSES } from './chaseFilterLoader';

// ── Imports from Wells Fargo loaders ────────────────────────────

import {
  WF_PORTFOLIO, WF_RISK_TIERS,
  WF_SEGMENTS_TYPED, WF_CAMPAIGNS_TYPED, WF_EWS_CLUSTERS_TYPED,
  WF_SAVED_SEGMENTS_TYPED, WF_SAMPLE_BUSINESSES_TYPED,
  WF_CAMPAIGN_SUMMARY, WF_CONVERSION_BY_SEGMENT,
  WF_RISK_KPIS, WF_CONCENTRATION, WF_COMPLIANCE,
  WF_UNDERWRITING, WF_FILTER_OPTIONS,
} from './wellsfargoDemoData';

// ── Imports from Santander loaders ──────────────────────────────

import {
  SANT_PORTFOLIO_TYPED, SANT_RISK_TIERS_TYPED,
  SANT_SEGMENTS_TYPED, SANT_CAMPAIGNS_TYPED, SANT_EWS_CLUSTERS_TYPED,
  SANT_SAVED_SEGMENTS_TYPED, SANT_SAMPLE_BUSINESSES_TYPED,
  SANT_CAMPAIGN_SUMMARY_TYPED, SANT_CONVERSION_BY_SEGMENT_TYPED,
  SANT_RISK_KPIS_TYPED, SANT_CONCENTRATION_TYPED, SANT_COMPLIANCE_TYPED,
  SANT_UNDERWRITING_TYPED, SANT_FILTER_OPTIONS_TYPED,
} from './santanderDemoData';

// ── Imports from Citi loaders ───────────────────────────────────

import {
  CITI_PORTFOLIO, CITI_RISK_TIERS,
  CITI_SEGMENTS_TYPED, CITI_CAMPAIGNS_TYPED, CITI_EWS_CLUSTERS_TYPED,
  CITI_SAVED_SEGMENTS_TYPED, CITI_SAMPLE_BUSINESSES_TYPED,
  CITI_CAMPAIGN_SUMMARY, CITI_CONVERSION_BY_SEGMENT,
  CITI_RISK_KPIS, CITI_CONCENTRATION, CITI_COMPLIANCE,
  CITI_UNDERWRITING, CITI_FILTER_OPTIONS,
} from './citiDemoData';

// ── Bank-switched re-exports ────────────────────────────────────

export const PORTFOLIO = {
  chase: CHASE_PORTFOLIO,
  wellsfargo: WF_PORTFOLIO,
  santander: SANT_PORTFOLIO_TYPED,
  citi: CITI_PORTFOLIO,
}[ACTIVE_BANK_ID];

export const RISK_TIERS = {
  chase: CHASE_RISK_TIERS,
  wellsfargo: WF_RISK_TIERS,
  santander: SANT_RISK_TIERS_TYPED,
  citi: CITI_RISK_TIERS,
}[ACTIVE_BANK_ID];

export const SEGMENTS: Segment[] = ({
  chase: CHASE_SEGMENTS,
  wellsfargo: WF_SEGMENTS_TYPED,
  santander: SANT_SEGMENTS_TYPED,
  citi: CITI_SEGMENTS_TYPED,
} as Record<string, Segment[]>)[ACTIVE_BANK_ID];

export const CAMPAIGNS: Campaign[] = ({
  chase: CHASE_CAMPAIGNS,
  wellsfargo: WF_CAMPAIGNS_TYPED,
  santander: SANT_CAMPAIGNS_TYPED,
  citi: CITI_CAMPAIGNS_TYPED,
} as Record<string, Campaign[]>)[ACTIVE_BANK_ID];

export const CAMPAIGN_SUMMARY = {
  chase: CHASE_CAMPAIGN_SUMMARY,
  wellsfargo: WF_CAMPAIGN_SUMMARY,
  santander: SANT_CAMPAIGN_SUMMARY_TYPED,
  citi: CITI_CAMPAIGN_SUMMARY,
}[ACTIVE_BANK_ID];

export const CONVERSION_BY_SEGMENT = {
  chase: CHASE_CONVERSION_BY_SEGMENT,
  wellsfargo: WF_CONVERSION_BY_SEGMENT,
  santander: SANT_CONVERSION_BY_SEGMENT_TYPED,
  citi: CITI_CONVERSION_BY_SEGMENT,
}[ACTIVE_BANK_ID];

export const CONCENTRATION = {
  chase: CHASE_CONCENTRATION,
  wellsfargo: WF_CONCENTRATION,
  santander: SANT_CONCENTRATION_TYPED,
  citi: CITI_CONCENTRATION,
}[ACTIVE_BANK_ID];

export const EWS_CLUSTERS: EWSCluster[] = ({
  chase: CHASE_EWS_CLUSTERS,
  wellsfargo: WF_EWS_CLUSTERS_TYPED,
  santander: SANT_EWS_CLUSTERS_TYPED,
  citi: CITI_EWS_CLUSTERS_TYPED,
} as Record<string, EWSCluster[]>)[ACTIVE_BANK_ID];

export const UNDERWRITING = {
  chase: CHASE_UNDERWRITING,
  wellsfargo: WF_UNDERWRITING,
  santander: SANT_UNDERWRITING_TYPED,
  citi: CITI_UNDERWRITING,
}[ACTIVE_BANK_ID];

export const COMPLIANCE = {
  chase: CHASE_COMPLIANCE,
  wellsfargo: WF_COMPLIANCE,
  santander: SANT_COMPLIANCE_TYPED,
  citi: CITI_COMPLIANCE,
}[ACTIVE_BANK_ID];

export const SAVED_SEGMENTS: SavedSegment[] = ({
  chase: CHASE_SAVED_SEGMENTS,
  wellsfargo: WF_SAVED_SEGMENTS_TYPED,
  santander: SANT_SAVED_SEGMENTS_TYPED,
  citi: CITI_SAVED_SEGMENTS_TYPED,
} as Record<string, SavedSegment[]>)[ACTIVE_BANK_ID];

export const SAMPLE_BUSINESSES: SampleBusiness[] = ({
  chase: CHASE_SAMPLE_BUSINESSES,
  wellsfargo: WF_SAMPLE_BUSINESSES_TYPED,
  santander: SANT_SAMPLE_BUSINESSES_TYPED,
  citi: CITI_SAMPLE_BUSINESSES_TYPED,
} as Record<string, SampleBusiness[]>)[ACTIVE_BANK_ID];

export const RISK_KPIS = {
  chase: CHASE_RISK_KPIS,
  wellsfargo: WF_RISK_KPIS,
  santander: SANT_RISK_KPIS_TYPED,
  citi: CITI_RISK_KPIS,
}[ACTIVE_BANK_ID];

export const FILTER_OPTIONS = {
  chase: CHASE_FILTER_OPTIONS,
  wellsfargo: WF_FILTER_OPTIONS,
  santander: SANT_FILTER_OPTIONS_TYPED,
  citi: CITI_FILTER_OPTIONS,
}[ACTIVE_BANK_ID];
