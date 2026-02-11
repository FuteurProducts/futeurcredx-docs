/**
 * CITI DEMO DATA
 *
 * Re-exports all Citi data from Citi loaders with CITI_ prefix.
 * All values derived from citi.json (450K customers, $98.4B exposure).
 *
 * Types are imported from chaseDemoData.ts (bank-agnostic types).
 */

// ── Type imports from chaseDemoData (bank-agnostic) ──────────────────────

import type {
  Segment,
  Campaign,
  EWSCluster,
  SavedSegment,
  SampleBusiness,
} from './chaseDemoData';

// ── Imports needed for typed re-exports ─────────────────────────────────

import { CITI_SEGMENTS } from './citiPortfolioLoader';
import { CITI_CAMPAIGNS } from './citiCampaignLoader';
import { CITI_EWS_CLUSTERS } from './citiRiskLoader';
import { CITI_SAVED_SEGMENTS, CITI_SAMPLE_BUSINESSES } from './citiFilterLoader';

// ── Direct re-exports (CITI_ prefix) ──────────────────────────────────────

export { CITI_PILOT_METRICS, CITI_DEMO_BUSINESSES } from './citiDataLoader';
export { CITI_PORTFOLIO, CITI_RISK_TIERS } from './citiPortfolioLoader';
export { CITI_CAMPAIGN_SUMMARY, CITI_CONVERSION_BY_SEGMENT } from './citiCampaignLoader';
export { CITI_RISK_KPIS, CITI_CONCENTRATION, CITI_COMPLIANCE } from './citiRiskLoader';
export { CITI_UNDERWRITING } from './citiUnderwritingLoader';
export { CITI_FILTER_OPTIONS } from './citiFilterLoader';

// ── Typed re-exports with explicit type annotations ─────────────────────

export const CITI_SEGMENTS_TYPED: Segment[] = CITI_SEGMENTS;
export const CITI_CAMPAIGNS_TYPED: Campaign[] = CITI_CAMPAIGNS;
export const CITI_EWS_CLUSTERS_TYPED: EWSCluster[] = CITI_EWS_CLUSTERS;
export const CITI_SAVED_SEGMENTS_TYPED: SavedSegment[] = CITI_SAVED_SEGMENTS;
export const CITI_SAMPLE_BUSINESSES_TYPED: SampleBusiness[] = CITI_SAMPLE_BUSINESSES;
