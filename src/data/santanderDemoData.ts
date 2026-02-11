/**
 * SANTANDER DEMO DATA — INSTITUTIONAL GRADE
 *
 * Single source of truth for all Santander bank demo data.
 * All values derived from santander.json (180K businesses, $8B exposure).
 */

// ── Re-export types from chaseDemoData.ts ───────────────────────────

export type {
  SegmentStatus,
  SegmentTrend,
  CampaignHealth,
  EWSSeverity,
  ConcentrationStatus,
  ComplianceStatus,
  SLAStatus,
  RiskTier,
  Segment,
  Campaign,
  EWSCluster,
  ConcentrationEntry,
  UnderwritingQueueItem,
  ComplianceVariance,
  SavedSegment,
  SampleBusiness,
} from './chaseDemoData';

// ── Imports from Santander loaders ─────────────────────────────────

import { SANT_PILOT_METRICS, SANT_DEMO_BUSINESSES } from './santanderDataLoader';
import { SANT_PORTFOLIO, SANT_SEGMENTS, SANT_RISK_TIERS } from './santanderPortfolioLoader';
import { SANT_CAMPAIGNS, SANT_CAMPAIGN_SUMMARY, SANT_CONVERSION_BY_SEGMENT } from './santanderCampaignLoader';
import { SANT_RISK_KPIS, SANT_CONCENTRATION, SANT_EWS_CLUSTERS, SANT_COMPLIANCE } from './santanderRiskLoader';
import { SANT_UNDERWRITING } from './santanderUnderwritingLoader';
import { SANT_FILTER_OPTIONS, SANT_SAVED_SEGMENTS, SANT_SAMPLE_BUSINESSES } from './santanderFilterLoader';

import type { Segment, Campaign, EWSCluster, SavedSegment, SampleBusiness } from './chaseDemoData';

// ── Typed exports ───────────────────────────────────────────────────

export const SANT_PILOT_METRICS_TYPED = SANT_PILOT_METRICS;
export const SANT_DEMO_BUSINESSES_TYPED = SANT_DEMO_BUSINESSES;
export const SANT_PORTFOLIO_TYPED = SANT_PORTFOLIO;
export const SANT_SEGMENTS_TYPED: Segment[] = SANT_SEGMENTS;
export const SANT_RISK_TIERS_TYPED = SANT_RISK_TIERS;
export const SANT_CAMPAIGNS_TYPED: Campaign[] = SANT_CAMPAIGNS;
export const SANT_CAMPAIGN_SUMMARY_TYPED = SANT_CAMPAIGN_SUMMARY;
export const SANT_CONVERSION_BY_SEGMENT_TYPED = SANT_CONVERSION_BY_SEGMENT;
export const SANT_RISK_KPIS_TYPED = SANT_RISK_KPIS;
export const SANT_CONCENTRATION_TYPED = SANT_CONCENTRATION;
export const SANT_EWS_CLUSTERS_TYPED: EWSCluster[] = SANT_EWS_CLUSTERS;
export const SANT_COMPLIANCE_TYPED = SANT_COMPLIANCE;
export const SANT_UNDERWRITING_TYPED = SANT_UNDERWRITING;
export const SANT_FILTER_OPTIONS_TYPED = SANT_FILTER_OPTIONS;
export const SANT_SAVED_SEGMENTS_TYPED: SavedSegment[] = SANT_SAVED_SEGMENTS;
export const SANT_SAMPLE_BUSINESSES_TYPED: SampleBusiness[] = SANT_SAMPLE_BUSINESSES;

// ── Re-export all for consumption by chaseDemoData.ts ──────────────

export {
  SANT_PILOT_METRICS,
  SANT_DEMO_BUSINESSES,
  SANT_PORTFOLIO,
  SANT_SEGMENTS,
  SANT_RISK_TIERS,
  SANT_CAMPAIGNS,
  SANT_CAMPAIGN_SUMMARY,
  SANT_CONVERSION_BY_SEGMENT,
  SANT_RISK_KPIS,
  SANT_CONCENTRATION,
  SANT_EWS_CLUSTERS,
  SANT_COMPLIANCE,
  SANT_UNDERWRITING,
  SANT_FILTER_OPTIONS,
  SANT_SAVED_SEGMENTS,
  SANT_SAMPLE_BUSINESSES,
};
