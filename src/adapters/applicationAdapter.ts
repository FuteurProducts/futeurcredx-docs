/**
 * Application Adapter
 * Transforms BFF Application responses to PipelineApplication UI props
 */

import type { Application } from '@/services/bff/types';
import type { PipelineApplication } from '@/components/enterprise/underwriting';
import { getBusinessApplications, DEMO_BUSINESSES } from '@/data/demoData';
import { deterministicValue } from '@/utils/deterministicHash';

// Cache enriched applications to avoid O(n²) in batch transforms
let _cachedApps: ReturnType<typeof getBusinessApplications> | null = null;
function getCachedEnrichedApps() {
  if (!_cachedApps) _cachedApps = getBusinessApplications();
  return _cachedApps;
}

/**
 * Transform a BFF Application into a PipelineApplication for the underwriting UI.
 * Enriches with business name from applicationData or entity lookup.
 */
export function adaptApplicationToPipeline(
  app: Application,
  businessNameMap?: Record<string, string>
): PipelineApplication {
  const appData = (app.applicationData || {}) as Record<string, unknown>;
  const businessName = businessNameMap?.[app.smbEntityId]
    || (appData.businessName as string)
    || `Business ${app.smbEntityId.slice(-4)}`;
  const productType = (appData.productType as string) || 'Term Loan';

  // Derive AI recommendation from decision data or score
  const decisionData = (app.decisionData || {}) as Record<string, unknown>;
  const riskScore = (decisionData.riskScore as number) || 700;
  const aiRecommendation: 'approve' | 'review' | 'decline' =
    riskScore >= 750 ? 'approve' : riskScore >= 600 ? 'review' : 'decline';
  const enrichedApp = getCachedEnrichedApps().find(a => a.businessId === app.smbEntityId);
  const confidence = enrichedApp?.confidence ?? (
    riskScore >= 750 ? deterministicValue(app.id + '_conf', 90, 97) :
    riskScore >= 600 ? deterministicValue(app.id + '_conf', 60, 74) :
    deterministicValue(app.id + '_conf', 80, 89)
  );

  return {
    id: app.id,
    appId: `APP-${app.id.slice(0, 8).toUpperCase()}`,
    companyName: businessName,
    amount: Number(app.requestedAmount) || 0,
    productType,
    customerSegment: 'small',
    riskTier: riskScore >= 720 ? 'low' : riskScore >= 650 ? 'medium' : 'high',
    aiRecommendation,
    confidence,
    geography: (() => {
      const biz = DEMO_BUSINESSES.find(b => b.id === app.smbEntityId);
      if (!biz?.state) return 'National';
      const regionMap: Record<string, string> = { TX: 'Southwest', CA: 'West', AZ: 'West', FL: 'Southeast', IL: 'Midwest', MI: 'Midwest', WA: 'West' };
      return regionMap[biz.state] || 'National';
    })(),
    industry: DEMO_BUSINESSES.find(b => b.id === app.smbEntityId)?.industry || 'General',
    yearsInBusiness: DEMO_BUSINESSES.find(b => b.id === app.smbEntityId)?.yearsInBusiness || 5,
    compositeScore: riskScore,
    submittedAt: app.submittedAt
      ? formatTimeAgo(new Date(app.submittedAt))
      : 'N/A',
    tags: [],
  };
}

/**
 * Batch transform applications
 */
export function adaptApplicationsToPipeline(
  apps: Application[],
  businessNameMap?: Record<string, string>
): PipelineApplication[] {
  return apps.map(app => adaptApplicationToPipeline(app, businessNameMap));
}

function formatTimeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
