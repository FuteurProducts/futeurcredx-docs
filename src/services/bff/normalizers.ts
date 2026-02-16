/**
 * API Response Normalizers
 * Transforms API response shapes into Dashboard BFF types.
 * Handles field name mismatches, enum mapping, and nested object flattening.
 */

import type {
  SmbEntity,
  CustomerDossier,
  BusinessOwner,
  CreditScore,
  ScoreFactor,
  ScoreSource,
  PrequalOffer,
  OfferStatus,
  Application,
  ApplicationStatus,
  RiskSummary,
  RiskDriver,
  RiskTrend,
  EWSAlert,
  RiskAggregate,
  Portfolio,
  AuditEvent,
  AuditAction,
} from './types';

// ============ Mapping Tables ============

const SCORE_SOURCE_MAP: Record<string, ScoreSource> = {
  experian: 'experian_biz',
  experian_biz: 'experian_biz',
  sbss: 'fico_sbss',
  fico_sbss: 'fico_sbss',
  equifax: 'equifax_biz',
  equifax_biz: 'equifax_biz',
  dun_bradstreet: 'dun_bradstreet',
  internal: 'internal',
};

const OFFER_STATUS_MAP: Record<string, OfferStatus> = {
  active: 'generated',
  generated: 'generated',
  presented: 'presented',
  expired: 'expired',
  applied: 'accepted',
  accepted: 'accepted',
  declined: 'declined',
};

const APP_STATUS_MAP: Record<string, ApplicationStatus> = {
  APPLIED: 'submitted',
  applied: 'submitted',
  PENDING: 'under_review',
  pending: 'under_review',
  APPROVED: 'approved',
  approved: 'approved',
  REJECTED: 'declined',
  rejected: 'declined',
  WITHDRAWN: 'withdrawn',
  withdrawn: 'withdrawn',
  FUNDED: 'funded',
  funded: 'funded',
  draft: 'draft',
  submitted: 'submitted',
  under_review: 'under_review',
  declined: 'declined',
};

const EWS_SEVERITY_MAP: Record<string, EWSAlert['severity']> = {
  CRITICAL: 'critical',
  critical: 'critical',
  HIGH: 'warning',
  high: 'warning',
  MEDIUM: 'info',
  medium: 'info',
  LOW: 'info',
  low: 'info',
  info: 'info',
  warning: 'warning',
};

const RISK_DISTRIBUTION_KEY_MAP: Record<string, string> = {
  minimal: 'low',
  low: 'low',
  medium: 'moderate',
  moderate: 'moderate',
  high: 'high',
  critical: 'elevated',
  elevated: 'elevated',
};

const RELATIONSHIP_STAGE_MAP: Record<string, SmbEntity['relationshipStage']> = {
  scored: 'new',
  offered: 'growing',
  applied: 'growing',
  approved: 'mature',
  // Pass-through for already-correct values
  prospect: 'prospect',
  new: 'new',
  growing: 'growing',
  mature: 'mature',
  at_risk: 'at_risk',
  'at-risk': 'at_risk',
};

// ============ Entity Normalizers ============

/**
 * Strip sandbox test prefixes from business names.
 * The seeded sandbox data has "[TEST] " prefixed to all business names;
 * the dashboard should display clean names.
 */
function cleanBusinessName(raw: string): string {
  return raw.replace(/^\[TEST\]\s*/i, '');
}

/**
 * Normalize an API customer response to SmbEntity
 */
export function normalizeCustomer(apiCustomer: Record<string, unknown>): SmbEntity {
  const address = (apiCustomer.address || {}) as Record<string, unknown>;

  return {
    id: String(apiCustomer.id || ''),
    tenantId: String(apiCustomer.tenantId || ''),
    legalName: cleanBusinessName(String(apiCustomer.legalName || apiCustomer.businessName || '')),
    dba: apiCustomer.dba != null ? String(apiCustomer.dba) : undefined,
    ein: apiCustomer.ein != null ? String(apiCustomer.ein) : undefined,
    naicsCode: apiCustomer.naicsCode != null ? String(apiCustomer.naicsCode) : undefined,
    industry: apiCustomer.industry != null ? String(apiCustomer.industry) : undefined,
    yearsInBusiness: apiCustomer.yearsInBusiness != null ? Number(apiCustomer.yearsInBusiness) : undefined,
    annualRevenue: apiCustomer.annualRevenue != null ? Number(apiCustomer.annualRevenue) : undefined,
    employeeCount: apiCustomer.employeeCount != null ? Number(apiCustomer.employeeCount) : undefined,
    // Flatten nested address or use top-level fields
    state: String(apiCustomer.state || address.state || ''),
    city: String(apiCustomer.city || address.city || ''),
    zipCode: String(apiCustomer.zipCode || address.zip || address.zipCode || ''),
    riskTier: normalizeRiskTier(apiCustomer.riskTier),
    relationshipStage: RELATIONSHIP_STAGE_MAP[String(apiCustomer.relationshipStage || '')] || undefined,
    segment: normalizeSegment(apiCustomer.segment),
    createdAt: String(apiCustomer.createdAt || new Date().toISOString()),
    updatedAt: String(apiCustomer.updatedAt || new Date().toISOString()),
  };
}

/**
 * Normalize a full customer dossier with nested entities
 */
export function normalizeCustomerDossier(apiDossier: Record<string, unknown>): CustomerDossier {
  const base = normalizeCustomer(apiDossier);

  const creditScores = Array.isArray(apiDossier.creditScores)
    ? apiDossier.creditScores.map((s: unknown) => normalizeScore(s as Record<string, unknown>))
    : undefined;

  const applications = Array.isArray(apiDossier.applications)
    ? apiDossier.applications.map((a: unknown) => normalizeApplication(a as Record<string, unknown>))
    : undefined;

  const offers = Array.isArray(apiDossier.offers)
    ? apiDossier.offers.map((o: unknown) => normalizeOffer(o as Record<string, unknown>))
    : undefined;

  const owners = Array.isArray(apiDossier.owners)
    ? apiDossier.owners.map((o: unknown) => normalizeOwner(o as Record<string, unknown>))
    : Array.isArray((apiDossier.owner as unknown[]))
      ? [(apiDossier.owner as Record<string, unknown>[])].flat().map(normalizeOwner)
      : apiDossier.owner
        ? [normalizeOwner(apiDossier.owner as Record<string, unknown>)]
        : undefined;

  return {
    ...base,
    creditScores,
    applications,
    offers,
    owners,
  };
}

/**
 * Normalize a business owner
 */
function normalizeOwner(apiOwner: Record<string, unknown>): BusinessOwner {
  return {
    id: String(apiOwner.id || ''),
    firstName: String(apiOwner.firstName || apiOwner.first_name || ''),
    lastName: String(apiOwner.lastName || apiOwner.last_name || ''),
    email: apiOwner.email != null ? String(apiOwner.email) : undefined,
    phone: apiOwner.phone != null ? String(apiOwner.phone) : undefined,
    ownershipPercentage: apiOwner.ownershipPercentage != null
      ? Number(apiOwner.ownershipPercentage)
      : apiOwner.ownership_percentage != null
        ? Number(apiOwner.ownership_percentage)
        : undefined,
    isGuarantor: apiOwner.isGuarantor != null
      ? Boolean(apiOwner.isGuarantor)
      : apiOwner.is_guarantor != null
        ? Boolean(apiOwner.is_guarantor)
        : undefined,
  };
}

/**
 * Normalize an API credit score response to CreditScore
 */
export function normalizeScore(apiScore: Record<string, unknown>): CreditScore {
  const source = SCORE_SOURCE_MAP[String(apiScore.source || '')] || (String(apiScore.source || 'internal') as ScoreSource);

  // Normalize factors: API may send string[] or ScoreFactor[]
  let factors: ScoreFactor[] | undefined;
  if (Array.isArray(apiScore.factors)) {
    factors = apiScore.factors.map((f: unknown) => {
      if (typeof f === 'string') {
        return { code: '', description: f, impact: 'neutral' as const };
      }
      const factorObj = f as Record<string, unknown>;
      return {
        code: String(factorObj.code || ''),
        description: String(factorObj.description || ''),
        impact: (['positive', 'negative', 'neutral'].includes(String(factorObj.impact || ''))
          ? String(factorObj.impact) as ScoreFactor['impact']
          : 'neutral'),
        weight: factorObj.weight != null ? Number(factorObj.weight) : undefined,
      };
    });
  }

  return {
    id: String(apiScore.id || ''),
    smbEntityId: String(apiScore.smbEntityId || apiScore.smb_entity_id || ''),
    source,
    scoreType: String(apiScore.scoreType || apiScore.score_type || 'commercial'),
    score: apiScore.score != null ? Number(apiScore.score) : undefined,
    scoreRangeMin: apiScore.scoreRangeMin != null ? Number(apiScore.scoreRangeMin) : undefined,
    scoreRangeMax: apiScore.scoreRangeMax != null ? Number(apiScore.scoreRangeMax) : undefined,
    riskClass: (() => {
      const raw = apiScore.riskClass != null ? String(apiScore.riskClass) : apiScore.risk_class != null ? String(apiScore.risk_class) : undefined;
      const scoreVal = apiScore.score != null ? Number(apiScore.score) : undefined;
      // If the backend returned a riskClass but the score contradicts it
      // (e.g. score 93 labelled "critical"), recompute from score.
      if (raw && scoreVal != null) {
        const computed = computeRiskClassFromScore(scoreVal);
        if (raw === 'critical' && computed !== 'critical') return computed;
      }
      // If no riskClass from API but we have a score, compute it
      if (!raw && scoreVal != null) return computeRiskClassFromScore(scoreVal);
      return raw;
    })(),
    factors,
    pulledAt: apiScore.pulledAt != null ? String(apiScore.pulledAt) : apiScore.pulled_at != null ? String(apiScore.pulled_at) : undefined,
    expiresAt: apiScore.expiresAt != null ? String(apiScore.expiresAt) : apiScore.expires_at != null ? String(apiScore.expires_at) : undefined,
    createdAt: String(apiScore.createdAt || apiScore.created_at || new Date().toISOString()),
  };
}

/**
 * Normalize an API offer response to PrequalOffer
 */
export function normalizeOffer(apiOffer: Record<string, unknown>): PrequalOffer {
  const rawStatus = String(apiOffer.status || 'generated');
  const status: OfferStatus = OFFER_STATUS_MAP[rawStatus] || (rawStatus as OfferStatus);

  return {
    id: String(apiOffer.id || ''),
    smbEntityId: String(apiOffer.smbEntityId || apiOffer.smb_entity_id || ''),
    portfolioId: String(apiOffer.portfolioId || apiOffer.portfolio_id || ''),
    productType: String(apiOffer.productType || apiOffer.product_type || ''),
    minAmount: apiOffer.minAmount != null ? Number(apiOffer.minAmount) : apiOffer.min_amount != null ? Number(apiOffer.min_amount) : undefined,
    maxAmount: apiOffer.maxAmount != null ? Number(apiOffer.maxAmount) : apiOffer.max_amount != null ? Number(apiOffer.max_amount) : undefined,
    estimatedRate: apiOffer.estimatedRate != null ? Number(apiOffer.estimatedRate) : apiOffer.estimated_rate != null ? Number(apiOffer.estimated_rate) : undefined,
    estimatedTermMonths: apiOffer.estimatedTermMonths != null ? Number(apiOffer.estimatedTermMonths) : apiOffer.estimated_term_months != null ? Number(apiOffer.estimated_term_months) : undefined,
    expiresAt: apiOffer.expiresAt != null ? String(apiOffer.expiresAt) : apiOffer.expires_at != null ? String(apiOffer.expires_at) : undefined,
    status,
    decisionFactors: (apiOffer.decisionFactors || apiOffer.decision_factors || undefined) as Record<string, unknown> | undefined,
    createdAt: String(apiOffer.createdAt || apiOffer.created_at || new Date().toISOString()),
  };
}

/**
 * Normalize an API application response to Application
 */
export function normalizeApplication(apiApp: Record<string, unknown>): Application {
  const rawStatus = String(apiApp.status || 'draft');
  const status: ApplicationStatus = APP_STATUS_MAP[rawStatus] || (rawStatus as ApplicationStatus);

  return {
    id: String(apiApp.id || ''),
    smbEntityId: String(apiApp.smbEntityId || apiApp.smb_entity_id || ''),
    portfolioId: String(apiApp.portfolioId || apiApp.portfolio_id || ''),
    offerId: apiApp.offerId != null ? String(apiApp.offerId) : apiApp.offer_id != null ? String(apiApp.offer_id) : undefined,
    status,
    requestedAmount: apiApp.requestedAmount != null ? Number(apiApp.requestedAmount) : apiApp.requested_amount != null ? Number(apiApp.requested_amount) : undefined,
    requestedTermMonths: apiApp.requestedTermMonths != null ? Number(apiApp.requestedTermMonths) : apiApp.requested_term_months != null ? Number(apiApp.requested_term_months) : undefined,
    applicationData: (apiApp.applicationData || apiApp.application_data || undefined) as Record<string, unknown> | undefined,
    decisionData: (apiApp.decisionData || apiApp.decision_data || undefined) as Record<string, unknown> | undefined,
    submittedAt: apiApp.submittedAt != null ? String(apiApp.submittedAt) : apiApp.submitted_at != null ? String(apiApp.submitted_at) : undefined,
    decidedAt: apiApp.decidedAt != null ? String(apiApp.decidedAt) : apiApp.decided_at != null ? String(apiApp.decided_at) : undefined,
    decidedBy: apiApp.decidedBy != null ? String(apiApp.decidedBy) : apiApp.decided_by != null ? String(apiApp.decided_by) : undefined,
    createdAt: String(apiApp.createdAt || apiApp.created_at || new Date().toISOString()),
    updatedAt: String(apiApp.updatedAt || apiApp.updated_at || new Date().toISOString()),
  };
}

/**
 * Normalize an API risk summary to RiskSummary
 */
export function normalizeRiskSummary(apiRisk: Record<string, unknown>): RiskSummary {
  const apiDist = (apiRisk.riskDistribution || apiRisk.risk_distribution || {}) as Record<string, number>;

  // Map API distribution keys to Dashboard keys
  const riskDistribution: RiskSummary['riskDistribution'] = {
    low: 0,
    moderate: 0,
    elevated: 0,
    high: 0,
    critical: 0,
  };

  for (const [key, value] of Object.entries(apiDist)) {
    const mappedKey = RISK_DISTRIBUTION_KEY_MAP[key] || key;
    if (mappedKey in riskDistribution) {
      riskDistribution[mappedKey as keyof typeof riskDistribution] += Number(value);
    }
  }

  const topRiskDrivers: RiskDriver[] = Array.isArray(apiRisk.topRiskDrivers || apiRisk.top_risk_drivers)
    ? (apiRisk.topRiskDrivers as Record<string, unknown>[] || apiRisk.top_risk_drivers as Record<string, unknown>[]).map((d: Record<string, unknown>) => ({
        factor: String(d.factor || d.name || ''),
        impact: Number(d.impact || 0),
        direction: (['increasing', 'decreasing', 'stable'].includes(String(d.direction || ''))
          ? String(d.direction) as RiskDriver['direction']
          : 'stable'),
      }))
    : [];

  const trends: RiskTrend[] = Array.isArray(apiRisk.trends)
    ? (apiRisk.trends as Record<string, unknown>[]).map((t: Record<string, unknown>) => ({
        date: String(t.date || ''),
        avgScore: Number(t.avgScore || t.avg_score || 0),
        exposure: Number(t.exposure || 0),
      }))
    : [];

  return {
    portfolioId: String(apiRisk.portfolioId || apiRisk.portfolio_id || ''),
    totalExposure: Number(apiRisk.totalExposure || apiRisk.total_exposure || 0),
    avgRiskScore: Number(apiRisk.avgRiskScore || apiRisk.avg_risk_score || 0),
    riskDistribution,
    topRiskDrivers,
    trends,
  };
}

/**
 * Normalize an API EWS alert to EWSAlert
 */
export function normalizeEWSAlert(apiAlert: Record<string, unknown>): EWSAlert {
  const rawSeverity = String(apiAlert.severity || 'info');
  const severity = EWS_SEVERITY_MAP[rawSeverity] || 'info';

  return {
    id: String(apiAlert.id || ''),
    smbEntityId: String(apiAlert.smbEntityId || apiAlert.smb_entity_id || ''),
    alertType: String(apiAlert.alertType || apiAlert.alert_type || ''),
    severity,
    message: String(apiAlert.message || ''),
    triggeredAt: String(apiAlert.triggeredAt || apiAlert.triggered_at || new Date().toISOString()),
    acknowledgedAt: apiAlert.acknowledgedAt != null ? String(apiAlert.acknowledgedAt) : apiAlert.acknowledged_at != null ? String(apiAlert.acknowledged_at) : undefined,
    acknowledgedBy: apiAlert.acknowledgedBy != null ? String(apiAlert.acknowledgedBy) : apiAlert.acknowledged_by != null ? String(apiAlert.acknowledged_by) : undefined,
  };
}

/**
 * Normalize an API portfolio to Portfolio
 */
export function normalizePortfolio(apiPortfolio: Record<string, unknown>): Portfolio {
  return {
    id: String(apiPortfolio.id || ''),
    tenantId: String(apiPortfolio.tenantId || apiPortfolio.tenant_id || ''),
    name: String(apiPortfolio.name || ''),
    description: apiPortfolio.description != null ? String(apiPortfolio.description) : undefined,
    productTypes: Array.isArray(apiPortfolio.productTypes || apiPortfolio.product_types)
      ? (apiPortfolio.productTypes as string[] || apiPortfolio.product_types as string[])
      : undefined,
    createdAt: String(apiPortfolio.createdAt || apiPortfolio.created_at || new Date().toISOString()),
  };
}

/**
 * Normalize an API audit event to AuditEvent
 */
export function normalizeAuditEvent(apiEvent: Record<string, unknown>): AuditEvent {
  return {
    id: String(apiEvent.id || ''),
    tenantId: String(apiEvent.tenantId || apiEvent.tenant_id || ''),
    userId: apiEvent.userId != null ? String(apiEvent.userId) : apiEvent.user_id != null ? String(apiEvent.user_id) : undefined,
    action: String(apiEvent.action || 'READ') as AuditAction,
    resourceType: String(apiEvent.resourceType || apiEvent.resource_type || ''),
    resourceId: apiEvent.resourceId != null ? String(apiEvent.resourceId) : apiEvent.resource_id != null ? String(apiEvent.resource_id) : undefined,
    details: (apiEvent.details || undefined) as Record<string, unknown> | undefined,
    ipAddress: apiEvent.ipAddress != null ? String(apiEvent.ipAddress) : apiEvent.ip_address != null ? String(apiEvent.ip_address) : undefined,
    userAgent: apiEvent.userAgent != null ? String(apiEvent.userAgent) : apiEvent.user_agent != null ? String(apiEvent.user_agent) : undefined,
    sessionId: apiEvent.sessionId != null ? String(apiEvent.sessionId) : apiEvent.session_id != null ? String(apiEvent.session_id) : undefined,
    createdAt: String(apiEvent.createdAt || apiEvent.created_at || new Date().toISOString()),
  };
}

/**
 * Normalize a risk aggregate
 */
export function normalizeRiskAggregate(apiAgg: Record<string, unknown>): RiskAggregate {
  return {
    dimension: String(apiAgg.dimension || ''),
    value: String(apiAgg.value || ''),
    count: Number(apiAgg.count || 0),
    totalExposure: Number(apiAgg.totalExposure || apiAgg.total_exposure || 0),
    avgRiskScore: Number(apiAgg.avgRiskScore || apiAgg.avg_risk_score || 0),
  };
}

// ============ Reverse Mappings (Dashboard → API) ============

/**
 * Map a Dashboard ScoreSource to API source enum for requests
 */
export function mapScoreSourceToApi(source: ScoreSource): string {
  const reverseMap: Record<ScoreSource, string> = {
    experian_biz: 'experian_biz',
    fico_sbss: 'fico_sbss',
    equifax_biz: 'equifax_biz',
    dun_bradstreet: 'dun_bradstreet',
    internal: 'internal',
  };
  return reverseMap[source] || source;
}

/**
 * Map a Dashboard ApplicationStatus to API status for requests
 */
export function mapAppStatusToApi(status: ApplicationStatus): string {
  // Dashboard and API should use same enum values per contract
  return status;
}

/**
 * Compute hasMore from API pagination that may lack it
 */
export function computeHasMore(pagination: { page?: number; pageSize?: number; total?: number; hasMore?: boolean }): boolean {
  if (pagination.hasMore !== undefined) return pagination.hasMore;
  const page = pagination.page || 1;
  const pageSize = pagination.pageSize || 25;
  const total = pagination.total || 0;
  return (page * pageSize) < total;
}

// ============ Helpers ============

/**
 * Compute riskClass from a numeric score.
 *
 * The backend currently applies FICO-scale thresholds (300-850) to LUMIQ-scale
 * scores (0-100), causing every record to land in "critical".  This helper
 * detects the scale and applies the correct mapping so the frontend displays
 * accurate risk labels regardless of which scale the API returns.
 *
 * LUMIQ 0-100 thresholds:
 *   0-30  critical | 31-50 high | 51-70 medium | 71-85 low | 86-100 minimal
 *
 * FICO 300-850 thresholds:
 *   300-499 critical | 500-579 high | 580-669 medium | 670-739 low | 740-850 minimal
 */
export function computeRiskClassFromScore(score: number): string {
  if (score <= 100) {
    // LUMIQ scale (0-100)
    if (score <= 30) return 'critical';
    if (score <= 50) return 'high';
    if (score <= 70) return 'medium';
    if (score <= 85) return 'low';
    return 'minimal';
  }
  // FICO scale (300-850)
  if (score < 500) return 'critical';
  if (score < 580) return 'high';
  if (score < 670) return 'medium';
  if (score < 740) return 'low';
  return 'minimal';
}

function normalizeRiskTier(raw: unknown): SmbEntity['riskTier'] | undefined {
  if (raw == null) return undefined;
  const val = String(raw).toLowerCase();
  const map: Record<string, SmbEntity['riskTier']> = {
    low: 'low',
    medium: 'moderate',
    moderate: 'moderate',
    elevated: 'elevated',
    high: 'high',
    critical: 'critical',
  };
  return map[val] || undefined;
}

function normalizeSegment(raw: unknown): SmbEntity['segment'] | undefined {
  if (raw == null) return undefined;
  const val = String(raw).toLowerCase().replace('-', '_');
  const map: Record<string, SmbEntity['segment']> = {
    micro: 'micro',
    small: 'small',
    mid_market: 'mid_market',
    'mid-market': 'mid_market',
    midmarket: 'mid_market',
  };
  return map[val] || undefined;
}
