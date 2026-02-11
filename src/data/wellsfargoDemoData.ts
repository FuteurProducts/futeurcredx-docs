/**
 * WELLS FARGO DEMO DATA
 *
 * Re-exports all Wells Fargo data from WF loaders with WF_ prefix.
 * All values derived from wellsfargo.json (3.3M customers, $670B exposure).
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

import { WF_SEGMENTS } from './wellsfargoPortfolioLoader';
import { WF_CAMPAIGNS } from './wellsfargoCampaignLoader';
import { WF_EWS_CLUSTERS } from './wellsfargoRiskLoader';
import { WF_SAVED_SEGMENTS, WF_SAMPLE_BUSINESSES } from './wellsfargoFilterLoader';

// ── Direct re-exports (WF_ prefix) ──────────────────────────────────────

export { WF_PILOT_METRICS, WF_DEMO_BUSINESSES } from './wellsfargoDataLoader';
export { WF_PORTFOLIO, WF_RISK_TIERS } from './wellsfargoPortfolioLoader';
export { WF_CAMPAIGN_SUMMARY, WF_CONVERSION_BY_SEGMENT } from './wellsfargoCampaignLoader';
export { WF_RISK_KPIS, WF_CONCENTRATION, WF_COMPLIANCE } from './wellsfargoRiskLoader';
export { WF_UNDERWRITING } from './wellsfargoUnderwritingLoader';
export { WF_FILTER_OPTIONS } from './wellsfargoFilterLoader';

// ── Typed re-exports with explicit type annotations ─────────────────────

export const WF_SEGMENTS_TYPED: Segment[] = WF_SEGMENTS;
export const WF_CAMPAIGNS_TYPED: Campaign[] = WF_CAMPAIGNS;
export const WF_EWS_CLUSTERS_TYPED: EWSCluster[] = WF_EWS_CLUSTERS;
export const WF_SAVED_SEGMENTS_TYPED: SavedSegment[] = WF_SAVED_SEGMENTS;
export const WF_SAMPLE_BUSINESSES_TYPED: SampleBusiness[] = WF_SAMPLE_BUSINESSES;
