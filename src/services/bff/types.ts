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
  environment: 'sandbox' | 'production';
  scopes?: string[];
  isActive: boolean;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface CreateApiKeyRequest {
  name: string;
  environment: 'sandbox' | 'production';
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
