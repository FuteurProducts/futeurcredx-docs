/**
 * BFF Shared Types
 * Domain types matching the edge function contracts
 */

// ============ SMB Entity / Customer Types ============
export interface SmbEntity {
  id: string;
  tenantId: string;
  legalName: string;
  dba?: string;
  ein?: string;
  naicsCode?: string;
  industry?: string;
  yearsInBusiness?: number;
  annualRevenue?: number;
  employeeCount?: number;
  state?: string;
  city?: string;
  zipCode?: string;
  riskTier?: 'low' | 'moderate' | 'elevated' | 'high' | 'critical';
  relationshipStage?: 'prospect' | 'new' | 'growing' | 'mature' | 'at_risk';
  segment?: 'micro' | 'small' | 'mid_market';
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDossier extends SmbEntity {
  creditScores?: CreditScore[];
  applications?: Application[];
  offers?: PrequalOffer[];
  owners?: BusinessOwner[];
}

export interface BusinessOwner {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  ownershipPercentage?: number;
  isGuarantor?: boolean;
}

// ============ Credit Score Types ============
export type ScoreSource = 'dun_bradstreet' | 'experian_biz' | 'equifax_biz' | 'internal' | 'fico_sbss';

export interface CreditScore {
  id: string;
  smbEntityId: string;
  source: ScoreSource;
  scoreType: string;
  score?: number;
  scoreRangeMin?: number;
  scoreRangeMax?: number;
  riskClass?: string;
  factors?: ScoreFactor[];
  pulledAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface ScoreFactor {
  code: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight?: number;
}

export interface ScorePullRequest {
  smbEntityId: string;
  source: ScoreSource;
  consentId?: string;
}

export interface ScorePullResponse {
  score: CreditScore;
  lineageId: string;
}

// ============ Prequal Offer Types ============
export type OfferStatus = 'generated' | 'presented' | 'accepted' | 'declined' | 'expired';

export interface PrequalOffer {
  id: string;
  smbEntityId: string;
  portfolioId: string;
  productType: string;
  minAmount?: number;
  maxAmount?: number;
  estimatedRate?: number;
  estimatedTermMonths?: number;
  expiresAt?: string;
  status: OfferStatus;
  decisionFactors?: Record<string, unknown>;
  createdAt: string;
}

export interface GenerateOfferRequest {
  smbEntityId: string;
  productType: string;
  requestedAmount?: number;
}

// ============ Application Types ============
export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'declined'
  | 'withdrawn'
  | 'funded';

export interface Application {
  id: string;
  smbEntityId: string;
  portfolioId: string;
  offerId?: string;
  status: ApplicationStatus;
  requestedAmount?: number;
  requestedTermMonths?: number;
  applicationData?: Record<string, unknown>;
  decisionData?: Record<string, unknown>;
  submittedAt?: string;
  decidedAt?: string;
  decidedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitApplicationRequest {
  smbEntityId: string;
  offerId?: string;
  requestedAmount?: number;
  requestedTermMonths?: number;
  applicationData?: Record<string, unknown>;
}

// ============ Report Types ============
export type ReportType = 
  | 'portfolio_summary'
  | 'risk_analysis'
  | 'compliance_audit'
  | 'performance_metrics'
  | 'custom';

export type ReportStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface ReportJob {
  id: string;
  portfolioId: string;
  reportType: ReportType;
  status: ReportStatus;
  parameters?: Record<string, unknown>;
  artifactUrl?: string;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface CreateReportRequest {
  reportType: ReportType;
  parameters?: Record<string, unknown>;
}

// ============ Risk Types ============
export interface RiskSummary {
  portfolioId: string;
  totalExposure: number;
  avgRiskScore: number;
  riskDistribution: {
    low: number;
    moderate: number;
    elevated: number;
    high: number;
    critical: number;
  };
  topRiskDrivers: RiskDriver[];
  trends: RiskTrend[];
}

export interface RiskDriver {
  factor: string;
  impact: number;
  direction: 'increasing' | 'decreasing' | 'stable';
}

export interface RiskTrend {
  date: string;
  avgScore: number;
  exposure: number;
}

export interface EWSAlert {
  id: string;
  smbEntityId: string;
  alertType: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  triggeredAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

export interface RiskAggregate {
  dimension: string;
  value: string;
  count: number;
  totalExposure: number;
  avgRiskScore: number;
}

// ============ Audit Types ============
export type AuditAction = 
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'SHARE'
  | 'APPROVE'
  | 'REJECT';

export interface AuditEvent {
  id: string;
  tenantId: string;
  userId?: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  createdAt: string;
}

export interface CreateAuditEventRequest {
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
}

// ============ API Key Types ============
export interface ApiKey {
  id: string;
  tenantId: string;
  name: string;
  keyPrefix: string;
  environment: 'development' | 'production';
  scopes?: string[];
  isActive: boolean;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface CreateApiKeyRequest {
  name: string;
  environment: 'development' | 'production';
  scopes?: string[];
  expiresInDays?: number;
}

export interface ApiKeyUsage {
  keyId: string;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  avgLatencyMs: number;
  topEndpoints: { endpoint: string; count: number }[];
}

// ============ Portfolio Types ============
export interface Portfolio {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  productTypes?: string[];
  createdAt: string;
}

export interface PortfolioAccess {
  portfolioId: string;
  userId: string;
  role: 'viewer' | 'analyst' | 'manager' | 'admin';
}

export interface PortfolioSummary {
  id: string;
  name: string;
  businessCount: number;
  totalExposure: number;
  avgScore: number;
  qualRate: number;
  riskDistribution: Record<string, number>;
  lastUpdated: string;
}

export interface CreatePortfolioRequest {
  name: string;
  description?: string;
  productTypes?: string[];
}

// ============ Campaign Types ============
export type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft';
export type CampaignHealth = 'on_track' | 'below_target' | 'paused' | 'completed';

export interface CampaignFunnel {
  pushed: number;
  viewed: number;
  applied: number;
  approved: number;
}

export interface Campaign {
  id: string;
  portfolioId?: string;
  name: string;
  status: CampaignStatus;
  health: CampaignHealth;
  targetSegment: string;
  targetCriteria?: string;
  product: string;
  startDate: string;
  endDate: string;
  owner: string;
  funnel: CampaignFunnel;
  viewRate: number;
  applyRate: number;
  approvalRate: number;
  approvedVolume: number;
  warning?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CampaignSummary {
  activeCampaigns: number;
  offersPushed: number;
  avgViewRate: number;
  avgApplyRate: number;
  avgApprovalRate: number;
  revenueBooked: number;
}

export interface ConversionBySegment {
  segment: string;
  viewRate: number;
  applyRate: number;
  approvalRate: number;
  endToEnd: number;
  status: 'ok' | 'warning' | 'at_risk';
}

export interface CreateCampaignRequest {
  name: string;
  targetSegment: string;
  targetCriteria?: string;
  product: string;
  startDate: string;
  endDate: string;
}

// ============ Product Types ============
export type ProductStatus = 'Active' | 'Pilot' | 'Sunset';
export type ProductFamily =
  | 'Credit Cards'
  | 'Lines of Credit'
  | 'Term Loans'
  | 'SBA Programs'
  | 'Equipment Finance'
  | 'Commercial Auto'
  | 'Commercial Real Estate'
  | 'Deposits'
  | 'Treasury';
export type EligibilityTier = 'Tier 1' | 'Tier 2' | 'Tier 3';

export interface ProductTerms {
  rateRange: string;
  termRange: string;
  amountRange: string;
  collateral: string;
  guarantor: string;
}

export interface BankProduct {
  id: string;
  portfolioId?: string;
  name: string;
  family: ProductFamily | string;
  status: ProductStatus | string;
  eligibilityTier: EligibilityTier | string;
  targetSegments: string[];
  terms: ProductTerms;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductPenetration {
  product: string;
  family: ProductFamily | string;
  customersHolding: number;
  eligibleCustomers: number;
  penetrationRate: number;
  crossSellGap: number;
  revenueOpportunity: number;
}

export interface SegmentPenetration {
  segment: string;
  productsPerCustomer: number;
  walletShare: number;
  totalCustomers: number;
}

export interface ProductPerformance {
  product: string;
  family: ProductFamily | string;
  activeAccounts: number;
  approvalRate: number;
  avgLoanAmount: number;
  portfolioBalance: number;
  delinquencyRate: number;
  chargeoffRate: number;
  yieldRate: number;
}

export interface EligibilityRule {
  id: string;
  productId?: string;
  ruleType: string;
  operator: string;
  value: string | number | string[];
  description: string;
  priority?: number;
}

export interface PreQualReadiness {
  product: string;
  likely: number;
  borderline: number;
  unlikely: number;
  total: number;
}

export interface PreQualCandidate {
  id: string;
  smbEntityId?: string;
  businessName: string;
  industry: string;
  annualRevenue: number;
  readinessScore: number;
  readiness: 'Likely' | 'Borderline' | 'Unlikely';
  topProduct: string;
  signals: string[];
}

// ============ Underwriting Types ============
export type SLAStatus = 'ok' | 'warning' | 'breach';
export type UnderwritingDecision = 'approve' | 'decline' | 'review' | 'conditional_approve';

export interface UnderwritingQueueItem {
  id: string;
  applicationId?: string;
  smbEntityId?: string;
  business: string;
  product: string;
  amount: number;
  score: number;
  risk: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  timeInQueue: number;
  slaStatus: SLAStatus;
  assignedTo?: string;
  recommendation?: UnderwritingDecision;
  submittedAt?: string;
}

export interface UnderwritingKPIs {
  queueDepth: number;
  avgDecisionTime: number;
  autoApproveRate: number;
  manualReviewRate: number;
  declineRate: number;
  slaCompliance: number;
}

export interface UnderwritingRules {
  autoApprove: string[];
  autoDecline: string[];
}

export interface MakeDecisionRequest {
  decision: UnderwritingDecision;
  decisionData?: Record<string, unknown>;
  notes?: string;
}

// ============ Analytics Types ============
export interface PortfolioKPI {
  id?: string;
  label: string;
  value: number | string;
  format?: 'number' | 'currency' | 'percent' | 'score';
  trend?: { direction: 'up' | 'down' | 'stable'; value: number; label?: string };
  status?: 'positive' | 'neutral' | 'warning' | 'critical';
  tooltip?: string;
  dataSource?: string;
}

export interface IndustrySegment {
  id: string;
  name: string;
  icon?: string;
  businessCount: number;
  totalExposure: number;
  qualRate: number;
  avgScore: number;
  highRiskPct: number;
  trend: { direction: 'up' | 'down' | 'stable'; value: number };
  topProducts?: { name: string; eligible: number }[];
  region?: Record<string, number>;
  riskDistribution?: Record<string, number>;
  avgRevenue?: number;
  avgYearsInBusiness?: number;
}

export interface ScoreBucket {
  range: string;
  min: number;
  max: number;
  count: number;
  percent: number;
  exposure: number;
}

export interface MigrationCell {
  fromBand: string;
  toBand: string;
  count: number;
  percent: number;
  direction: 'upgrade' | 'downgrade' | 'stable';
}

export interface ScoreMigrationMatrix {
  period: string;
  bands: string[];
  cells: MigrationCell[];
  summary: {
    upgradedPercent: number;
    downgradedPercent: number;
    stablePercent: number;
  };
}

export interface GeographicDistribution {
  region: string;
  states?: string[];
  businessCount: number;
  exposure: number;
  avgScore: number;
  qualRate: number;
}

export interface RiskTierDistribution {
  tier: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  count: number;
  percentage: number;
  exposure: number;
  avgScore: number;
  color?: string;
}

// ============ Notification Types ============
export type NotificationType =
  | 'ews_alert'
  | 'campaign_milestone'
  | 'application_status'
  | 'report_ready'
  | 'system_update'
  | 'compliance_flag';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  tenantId?: string;
  userId?: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  isArchived?: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationPreferences {
  userId: string;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  types: Partial<Record<NotificationType, boolean>>;
  digestFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

export interface NotificationSummary {
  unreadCount: number;
  byPriority: Partial<Record<NotificationPriority, number>>;
  byType: Partial<Record<NotificationType, number>>;
}

// ============ Settings Types ============
export type PlatformUserRole = 'admin' | 'developer' | 'risk' | 'rm' | 'readonly';
export type PlatformUserStatus = 'active' | 'pending' | 'inactive';

export interface PlatformUser {
  id: string;
  tenantId?: string;
  name: string;
  email: string;
  role: PlatformUserRole;
  status: PlatformUserStatus;
  lastLogin: string | null;
  mfaEnabled: boolean;
  portfolioAccess: string[];
  allowExports: boolean;
  allowApiKeyCreation: boolean;
  createdAt: string;
}

export interface PlatformPermission {
  id: string;
  label: string;
  description: string;
}

export interface RolePermissions {
  role: PlatformUserRole;
  label: string;
  permissions: Record<string, boolean>;
}

export interface DataSource {
  id: string;
  tenantId?: string;
  name: string;
  type: 'aggregator' | 'bureau' | 'accounting';
  status: 'connected' | 'error' | 'disconnected';
  lastSync: string | null;
  errorRate: number;
  icon?: string;
}

export interface ModelVersion {
  id: string;
  tenantId?: string;
  name: string;
  version: string;
  status: 'active' | 'deprecated' | 'testing';
  validatedOn: string;
  notes: string;
}

export interface AlertThreshold {
  id: string;
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}

export interface BillingInfo {
  tenantId?: string;
  plan: 'starter' | 'growth' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
  apiCallsUsed: number;
  apiCallsLimit: number;
  storageUsedGB: number;
  storageLimit: number;
  nextBillingDate: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: PlatformUserRole;
  portfolioAccess: string[];
  allowExports: boolean;
  allowApiKeyCreation: boolean;
}
