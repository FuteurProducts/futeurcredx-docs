/**
 * Partner Portal Types
 * Bank-grade type definitions following FDX/Plaid standards
 */

// ============ Credential Types ============
export type EnvironmentType = 'sandbox' | 'production';
export type KeyStatus = 'active' | 'revoked' | 'expired' | 'pending';
export type AuthMethod = 'api_key' | 'oauth2' | 'mtls';

export interface ApiCredential {
  id: string;
  name: string;
  keyPrefix: string;
  fullKey?: string;
  environment: EnvironmentType;
  authMethod: AuthMethod;
  scopes: string[];
  ipWhitelist: string[];
  rateLimitPerMinute: number;
  status: KeyStatus;
  createdAt: string;
  createdBy: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  rotationPolicy: RotationPolicy;
  mtlsCertificate?: MtlsCertificate;
}

export interface RotationPolicy {
  enabled: boolean;
  intervalDays: number;
  lastRotatedAt: string | null;
  nextRotationAt: string | null;
  notifyDaysBefore: number;
}

export interface MtlsCertificate {
  id: string;
  fingerprint: string;
  subject: string;
  issuer: string;
  validFrom: string;
  validUntil: string;
  status: 'valid' | 'expiring_soon' | 'expired' | 'revoked';
}

export interface CreateCredentialRequest {
  name: string;
  environment: EnvironmentType;
  authMethod: AuthMethod;
  scopes: string[];
  ipWhitelist?: string[];
  rateLimitPerMinute?: number;
  expiresInDays?: number;
  rotationEnabled?: boolean;
  rotationIntervalDays?: number;
}

// ============ Usage Analytics Types ============
export interface UsageMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  successRate: number;
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  rateLimitHits: number;
}

export interface EndpointUsage {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  count: number;
  successRate: number;
  avgLatencyMs: number;
  errorCodes: { code: number; count: number }[];
}

export interface UsageByPeriod {
  period: string;
  requests: number;
  successRate: number;
  avgLatency: number;
}

export interface QuotaInfo {
  environment: EnvironmentType;
  requestsPerMinute: number;
  requestsPerDay: number;
  requestsPerMonth: number;
  usedThisMinute: number;
  usedToday: number;
  usedThisMonth: number;
  resetTime: string;
}

// ============ Webhook Types ============
export type WebhookEventType = 
  | 'score.created'
  | 'score.updated'
  | 'offer.generated'
  | 'offer.accepted'
  | 'offer.expired'
  | 'application.submitted'
  | 'application.approved'
  | 'application.declined'
  | 'customer.created'
  | 'customer.updated'
  | 'ews.alert'
  | 'report.completed';

export type WebhookStatus = 'active' | 'paused' | 'failed' | 'disabled';

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: WebhookEventType[];
  status: WebhookStatus;
  secret: string;
  secretMasked: string;
  retryPolicy: RetryPolicy;
  createdAt: string;
  lastDeliveryAt: string | null;
  successRate: number;
  failureCount: number;
  consecutiveFailures: number;
  ipFilter?: string[];
}

export interface RetryPolicy {
  maxRetries: number;
  backoffMultiplier: number;
  initialDelayMs: number;
  maxDelayMs: number;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  eventType: WebhookEventType;
  payload: Record<string, unknown>;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  attempts: number;
  responseCode: number | null;
  responseBody: string | null;
  latencyMs: number | null;
  createdAt: string;
  deliveredAt: string | null;
  nextRetryAt: string | null;
}

// ============ Testing/Sandbox Types ============
export type CertificationStatus = 'not_started' | 'in_progress' | 'passed' | 'failed';

export interface IntegrationTest {
  id: string;
  name: string;
  description: string;
  category: string;
  status: CertificationStatus;
  lastRunAt: string | null;
  errorMessage: string | null;
  duration: number | null;
}

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  steps: TestStep[];
  expectedOutcome: string;
}

export interface TestStep {
  order: number;
  action: string;
  endpoint: string;
  method: string;
  payload?: Record<string, unknown>;
  expectedStatus: number;
}

export interface CertificationChecklist {
  category: string;
  items: CertificationItem[];
  progress: number;
}

export interface CertificationItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  completed: boolean;
  evidence?: string;
}

// ============ Compliance Types ============
export type ComplianceFramework = 'SOC2' | 'GDPR' | 'CCPA' | 'PCI_DSS' | 'FFIEC' | 'OCC';

export interface ComplianceStatus {
  framework: ComplianceFramework;
  status: 'compliant' | 'partially_compliant' | 'non_compliant' | 'pending_review';
  lastAuditDate: string | null;
  nextAuditDate: string | null;
  certificateUrl?: string;
  findings: ComplianceFinding[];
}

export interface ComplianceFinding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  remediation: string;
  status: 'open' | 'in_progress' | 'resolved';
  dueDate: string | null;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  actorType: 'user' | 'api_key' | 'system';
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, unknown>;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface DataClassification {
  category: string;
  fields: DataField[];
  retentionDays: number;
  encryptionRequired: boolean;
  piiLevel: 'none' | 'low' | 'medium' | 'high';
}

export interface DataField {
  name: string;
  type: string;
  pii: boolean;
  encrypted: boolean;
  maskingRule?: string;
}

// ============ SLA Types ============
export interface SlaMetrics {
  uptimePercentage: number;
  targetUptime: number;
  mttr: number; // Mean time to recovery in minutes
  mtbf: number; // Mean time between failures in hours
  currentStatus: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
}

export interface IncidentRecord {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  affectedServices: string[];
  startedAt: string;
  resolvedAt: string | null;
  duration: number | null;
  rootCause?: string;
  postmortemUrl?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_on_customer' | 'resolved' | 'closed';
  category: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  assignee: string | null;
  responseTimeMinutes: number | null;
  resolutionTimeMinutes: number | null;
}

// ============ API Documentation Types ============
export interface ApiEndpointDoc {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  category: string;
  requiredScopes: string[];
  rateLimit: number;
  deprecated: boolean;
  deprecationDate?: string;
  requestSchema?: Record<string, unknown>;
  responseSchema?: Record<string, unknown>;
  examples: ApiExample[];
}

export interface ApiExample {
  title: string;
  description: string;
  request: {
    headers: Record<string, string>;
    body?: Record<string, unknown>;
  };
  response: {
    status: number;
    body: Record<string, unknown>;
  };
}

export interface ApiVersion {
  version: string;
  releaseDate: string;
  status: 'current' | 'supported' | 'deprecated' | 'sunset';
  sunsetDate?: string;
  changelog: ChangelogEntry[];
}

export interface ChangelogEntry {
  date: string;
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  description: string;
  breaking: boolean;
}
