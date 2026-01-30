/**
 * Partner Portal Mock Data
 * Production-aligned mock data for enterprise demonstration
 */

import type {
  ApiCredential,
  UsageMetrics,
  EndpointUsage,
  UsageByPeriod,
  QuotaInfo,
  WebhookEndpoint,
  WebhookDelivery,
  IntegrationTest,
  CertificationChecklist,
  ComplianceStatus,
  AuditLogEntry,
  DataClassification,
  SlaMetrics,
  IncidentRecord,
  SupportTicket,
  ApiVersion,
  ApiEndpointDoc,
} from './types';

// ============ Credentials Mock Data ============
export const mockCredentials: ApiCredential[] = [
  {
    id: 'cred-001',
    name: 'Production API Integration',
    keyPrefix: 'lq_prod_****8f2a',
    environment: 'production',
    authMethod: 'api_key',
    scopes: ['scores:read', 'customers:read', 'offers:write', 'applications:read'],
    ipWhitelist: ['203.0.113.0/24', '198.51.100.0/24'],
    rateLimitPerMinute: 1000,
    status: 'active',
    createdAt: '2025-01-10T10:00:00Z',
    createdBy: 'admin@acmebank.com',
    lastUsedAt: '2025-01-22T16:45:00Z',
    expiresAt: '2026-01-10T10:00:00Z',
    rotationPolicy: {
      enabled: true,
      intervalDays: 90,
      lastRotatedAt: '2025-01-10T10:00:00Z',
      nextRotationAt: '2025-04-10T10:00:00Z',
      notifyDaysBefore: 14,
    },
  },
  {
    id: 'cred-002',
    name: 'Sandbox Testing Key',
    keyPrefix: 'lq_test_****3b91',
    environment: 'sandbox',
    authMethod: 'api_key',
    scopes: ['scores:read', 'scores:write', 'customers:read', 'customers:write', 'offers:read', 'offers:write'],
    ipWhitelist: [],
    rateLimitPerMinute: 100,
    status: 'active',
    createdAt: '2025-01-15T14:30:00Z',
    createdBy: 'dev@acmebank.com',
    lastUsedAt: '2025-01-22T18:00:00Z',
    expiresAt: null,
    rotationPolicy: {
      enabled: false,
      intervalDays: 0,
      lastRotatedAt: null,
      nextRotationAt: null,
      notifyDaysBefore: 0,
    },
  },
  {
    id: 'cred-003',
    name: 'OAuth2 Service Account',
    keyPrefix: 'oauth_****7c4d',
    environment: 'production',
    authMethod: 'oauth2',
    scopes: ['reports:read', 'reports:write', 'risk:read'],
    ipWhitelist: ['10.0.0.0/8'],
    rateLimitPerMinute: 500,
    status: 'active',
    createdAt: '2025-01-05T09:00:00Z',
    createdBy: 'system@acmebank.com',
    lastUsedAt: '2025-01-22T12:00:00Z',
    expiresAt: '2025-07-05T09:00:00Z',
    rotationPolicy: {
      enabled: true,
      intervalDays: 180,
      lastRotatedAt: '2025-01-05T09:00:00Z',
      nextRotationAt: '2025-07-05T09:00:00Z',
      notifyDaysBefore: 30,
    },
  },
  {
    id: 'cred-004',
    name: 'mTLS Certificate Auth',
    keyPrefix: 'mtls_****9e2f',
    environment: 'production',
    authMethod: 'mtls',
    scopes: ['*'],
    ipWhitelist: [],
    rateLimitPerMinute: 2000,
    status: 'active',
    createdAt: '2024-12-01T08:00:00Z',
    createdBy: 'security@acmebank.com',
    lastUsedAt: '2025-01-22T20:00:00Z',
    expiresAt: '2025-12-01T08:00:00Z',
    rotationPolicy: {
      enabled: true,
      intervalDays: 365,
      lastRotatedAt: '2024-12-01T08:00:00Z',
      nextRotationAt: '2025-12-01T08:00:00Z',
      notifyDaysBefore: 60,
    },
    mtlsCertificate: {
      id: 'cert-001',
      fingerprint: 'SHA256:7E:4A:2B:...',
      subject: 'CN=acmebank.com,O=ACME Bank,C=US',
      issuer: 'CN=DigiCert SHA2 Extended Validation Server CA',
      validFrom: '2024-12-01T00:00:00Z',
      validUntil: '2025-12-01T23:59:59Z',
      status: 'valid',
    },
  },
];

// ============ Usage Analytics Mock Data ============
export const mockUsageMetrics: UsageMetrics = {
  totalRequests: 1847293,
  successfulRequests: 1832456,
  failedRequests: 14837,
  successRate: 99.2,
  avgLatencyMs: 145,
  p50LatencyMs: 98,
  p95LatencyMs: 287,
  p99LatencyMs: 512,
  rateLimitHits: 234,
};

export const mockEndpointUsage: EndpointUsage[] = [
  { endpoint: '/customers', method: 'GET', count: 524000, successRate: 99.8, avgLatencyMs: 82, errorCodes: [{ code: 404, count: 156 }, { code: 500, count: 23 }] },
  { endpoint: '/scores', method: 'GET', count: 418000, successRate: 99.5, avgLatencyMs: 135, errorCodes: [{ code: 404, count: 89 }, { code: 429, count: 1024 }] },
  { endpoint: '/scores/pull', method: 'POST', count: 289000, successRate: 98.9, avgLatencyMs: 280, errorCodes: [{ code: 400, count: 2345 }, { code: 503, count: 78 }] },
  { endpoint: '/offers', method: 'POST', count: 182000, successRate: 99.1, avgLatencyMs: 165, errorCodes: [{ code: 422, count: 1567 }] },
  { endpoint: '/applications', method: 'POST', count: 98000, successRate: 99.7, avgLatencyMs: 198, errorCodes: [{ code: 400, count: 234 }] },
  { endpoint: '/reports', method: 'GET', count: 160000, successRate: 99.9, avgLatencyMs: 95, errorCodes: [{ code: 404, count: 12 }] },
  { endpoint: '/risk/summary', method: 'GET', count: 87000, successRate: 99.8, avgLatencyMs: 156, errorCodes: [] },
  { endpoint: '/webhooks/test', method: 'POST', count: 23000, successRate: 100, avgLatencyMs: 45, errorCodes: [] },
];

export const mockUsageByPeriod: UsageByPeriod[] = [
  { period: 'Jan 16', requests: 185000, successRate: 99.3, avgLatency: 142 },
  { period: 'Jan 17', requests: 210000, successRate: 99.1, avgLatency: 148 },
  { period: 'Jan 18', requests: 192000, successRate: 99.4, avgLatency: 139 },
  { period: 'Jan 19', requests: 98000, successRate: 99.6, avgLatency: 128 },
  { period: 'Jan 20', requests: 92000, successRate: 99.5, avgLatency: 132 },
  { period: 'Jan 21', requests: 234000, successRate: 99.0, avgLatency: 156 },
  { period: 'Jan 22', requests: 268000, successRate: 99.2, avgLatency: 145 },
];

export const mockQuotaInfo: QuotaInfo[] = [
  {
    environment: 'production',
    requestsPerMinute: 1000,
    requestsPerDay: 100000,
    requestsPerMonth: 2000000,
    usedThisMinute: 45,
    usedToday: 42350,
    usedThisMonth: 1234567,
    resetTime: '2025-02-01T00:00:00Z',
  },
  {
    environment: 'sandbox',
    requestsPerMinute: 100,
    requestsPerDay: 10000,
    requestsPerMonth: 100000,
    usedThisMinute: 12,
    usedToday: 3450,
    usedThisMonth: 45678,
    resetTime: '2025-02-01T00:00:00Z',
  },
];

// ============ Webhooks Mock Data ============
export const mockWebhookEndpoints: WebhookEndpoint[] = [
  {
    id: 'wh-001',
    url: 'https://api.acmebank.com/webhooks/lumiq',
    events: ['score.created', 'score.updated', 'offer.generated', 'application.approved', 'application.declined'],
    status: 'active',
    secret: 'whsec_abc123...',
    secretMasked: 'whsec_****3def',
    retryPolicy: { maxRetries: 5, backoffMultiplier: 2, initialDelayMs: 1000, maxDelayMs: 60000 },
    createdAt: '2025-01-01T00:00:00Z',
    lastDeliveryAt: '2025-01-22T20:30:00Z',
    successRate: 99.8,
    failureCount: 12,
    consecutiveFailures: 0,
    ipFilter: ['203.0.113.0/24'],
  },
  {
    id: 'wh-002',
    url: 'https://notifications.acmebank.com/events',
    events: ['ews.alert', 'report.completed'],
    status: 'active',
    secret: 'whsec_def456...',
    secretMasked: 'whsec_****6ghi',
    retryPolicy: { maxRetries: 3, backoffMultiplier: 1.5, initialDelayMs: 500, maxDelayMs: 30000 },
    createdAt: '2025-01-10T12:00:00Z',
    lastDeliveryAt: '2025-01-22T18:00:00Z',
    successRate: 100,
    failureCount: 0,
    consecutiveFailures: 0,
  },
  {
    id: 'wh-003',
    url: 'https://staging.acmebank.com/webhooks/test',
    events: ['score.created', 'customer.created'],
    status: 'paused',
    secret: 'whsec_ghi789...',
    secretMasked: 'whsec_****9jkl',
    retryPolicy: { maxRetries: 5, backoffMultiplier: 2, initialDelayMs: 1000, maxDelayMs: 60000 },
    createdAt: '2025-01-15T08:00:00Z',
    lastDeliveryAt: '2025-01-20T14:00:00Z',
    successRate: 95.2,
    failureCount: 48,
    consecutiveFailures: 3,
  },
];

export const mockWebhookDeliveries: WebhookDelivery[] = [
  {
    id: 'del-001',
    webhookId: 'wh-001',
    eventType: 'score.created',
    payload: { smbEntityId: 'ent-123', score: 720, source: 'experian_biz' },
    status: 'delivered',
    attempts: 1,
    responseCode: 200,
    responseBody: '{"received": true}',
    latencyMs: 145,
    createdAt: '2025-01-22T20:30:00Z',
    deliveredAt: '2025-01-22T20:30:00Z',
    nextRetryAt: null,
  },
  {
    id: 'del-002',
    webhookId: 'wh-001',
    eventType: 'application.approved',
    payload: { applicationId: 'app-456', amount: 50000, term: 24 },
    status: 'delivered',
    attempts: 1,
    responseCode: 200,
    responseBody: '{"processed": true}',
    latencyMs: 89,
    createdAt: '2025-01-22T19:45:00Z',
    deliveredAt: '2025-01-22T19:45:00Z',
    nextRetryAt: null,
  },
  {
    id: 'del-003',
    webhookId: 'wh-003',
    eventType: 'customer.created',
    payload: { customerId: 'cust-789', legalName: 'Acme Corp' },
    status: 'failed',
    attempts: 5,
    responseCode: 503,
    responseBody: 'Service Unavailable',
    latencyMs: null,
    createdAt: '2025-01-20T14:00:00Z',
    deliveredAt: null,
    nextRetryAt: null,
  },
];

// ============ Testing Mock Data ============
export const mockIntegrationTests: IntegrationTest[] = [
  { id: 'test-001', name: 'Authentication Flow', description: 'Verify API key authentication works correctly', category: 'Authentication', status: 'passed', lastRunAt: '2025-01-22T10:00:00Z', errorMessage: null, duration: 1250 },
  { id: 'test-002', name: 'Score Pull Happy Path', description: 'Request a soft credit pull and receive score', category: 'Core API', status: 'passed', lastRunAt: '2025-01-22T10:00:00Z', errorMessage: null, duration: 3420 },
  { id: 'test-003', name: 'Offer Generation', description: 'Generate prequal offer from score data', category: 'Core API', status: 'passed', lastRunAt: '2025-01-22T10:00:00Z', errorMessage: null, duration: 2180 },
  { id: 'test-004', name: 'Webhook Delivery', description: 'Verify webhook events are delivered correctly', category: 'Webhooks', status: 'passed', lastRunAt: '2025-01-22T10:00:00Z', errorMessage: null, duration: 890 },
  { id: 'test-005', name: 'Rate Limit Handling', description: 'Verify 429 responses and retry-after headers', category: 'Error Handling', status: 'passed', lastRunAt: '2025-01-22T10:00:00Z', errorMessage: null, duration: 5670 },
  { id: 'test-006', name: 'PII Data Masking', description: 'Ensure sensitive data is properly masked', category: 'Security', status: 'passed', lastRunAt: '2025-01-22T10:00:00Z', errorMessage: null, duration: 1890 },
  { id: 'test-007', name: 'Idempotency Keys', description: 'Verify duplicate requests are handled correctly', category: 'Core API', status: 'in_progress', lastRunAt: null, errorMessage: null, duration: null },
  { id: 'test-008', name: 'Pagination Handling', description: 'Test cursor-based pagination on list endpoints', category: 'Core API', status: 'not_started', lastRunAt: null, errorMessage: null, duration: null },
];

export const mockCertificationChecklists: CertificationChecklist[] = [
  {
    category: 'Security Requirements',
    progress: 100,
    items: [
      { id: 'sec-001', name: 'TLS 1.2+ Enforcement', description: 'All connections must use TLS 1.2 or higher', required: true, completed: true },
      { id: 'sec-002', name: 'API Key Rotation', description: 'Implement 90-day key rotation policy', required: true, completed: true },
      { id: 'sec-003', name: 'IP Whitelisting', description: 'Production endpoints restricted to approved IPs', required: true, completed: true },
      { id: 'sec-004', name: 'Webhook Signature Verification', description: 'Verify HMAC signatures on all webhook deliveries', required: true, completed: true },
    ],
  },
  {
    category: 'Data Handling',
    progress: 75,
    items: [
      { id: 'data-001', name: 'PII Encryption at Rest', description: 'All PII must be encrypted using AES-256', required: true, completed: true },
      { id: 'data-002', name: 'PII Encryption in Transit', description: 'All PII transmitted via TLS', required: true, completed: true },
      { id: 'data-003', name: 'Data Retention Policy', description: 'Implement 7-year retention with auto-deletion', required: true, completed: true },
      { id: 'data-004', name: 'GDPR Right to Erasure', description: 'Support data deletion requests within 30 days', required: false, completed: false },
    ],
  },
  {
    category: 'Operational Readiness',
    progress: 83,
    items: [
      { id: 'ops-001', name: 'Error Handling', description: 'Graceful degradation and retry logic implemented', required: true, completed: true },
      { id: 'ops-002', name: 'Monitoring & Alerting', description: 'Real-time monitoring of API health', required: true, completed: true },
      { id: 'ops-003', name: 'Incident Response Plan', description: 'Documented escalation procedures', required: true, completed: true },
      { id: 'ops-004', name: 'Disaster Recovery', description: 'RTO < 4 hours, RPO < 1 hour', required: true, completed: true },
      { id: 'ops-005', name: 'Load Testing', description: 'Verified capacity for 10x expected load', required: true, completed: true },
      { id: 'ops-006', name: 'Audit Logging', description: 'All API calls logged with full context', required: true, completed: false },
    ],
  },
];

// ============ Compliance Mock Data ============
export const mockComplianceStatuses: ComplianceStatus[] = [
  {
    framework: 'SOC2',
    status: 'compliant',
    lastAuditDate: '2024-12-15',
    nextAuditDate: '2025-12-15',
    certificateUrl: 'https://trust.lumiq.ai/soc2-report',
    findings: [],
  },
  {
    framework: 'GDPR',
    status: 'compliant',
    lastAuditDate: '2024-11-01',
    nextAuditDate: '2025-11-01',
    findings: [],
  },
  {
    framework: 'CCPA',
    status: 'compliant',
    lastAuditDate: '2024-10-15',
    nextAuditDate: '2025-10-15',
    findings: [],
  },
  {
    framework: 'FFIEC',
    status: 'partially_compliant',
    lastAuditDate: '2024-09-01',
    nextAuditDate: '2025-03-01',
    findings: [
      {
        id: 'find-001',
        severity: 'medium',
        title: 'Access Review Frequency',
        description: 'User access reviews should be conducted quarterly instead of semi-annually',
        remediation: 'Update access review schedule to quarterly cadence',
        status: 'in_progress',
        dueDate: '2025-02-28',
      },
    ],
  },
];

export const mockAuditLogs: AuditLogEntry[] = [
  { id: 'audit-001', timestamp: '2025-01-22T20:45:00Z', action: 'API_KEY_CREATED', actor: 'admin@acmebank.com', actorType: 'user', resource: 'api_key', resourceId: 'cred-005', ipAddress: '203.0.113.45', userAgent: 'Mozilla/5.0', details: { keyName: 'New Integration Key', environment: 'sandbox' }, riskLevel: 'low' },
  { id: 'audit-002', timestamp: '2025-01-22T20:30:00Z', action: 'SCORE_PULL_REQUESTED', actor: 'lq_prod_****8f2a', actorType: 'api_key', resource: 'credit_score', resourceId: 'score-789', ipAddress: '203.0.113.100', userAgent: 'LumiqSDK/2.0', details: { source: 'experian_biz', smbEntityId: 'ent-456' }, riskLevel: 'medium' },
  { id: 'audit-003', timestamp: '2025-01-22T19:15:00Z', action: 'PII_ACCESSED', actor: 'analyst@acmebank.com', actorType: 'user', resource: 'customer_dossier', resourceId: 'cust-123', ipAddress: '10.0.0.50', userAgent: 'Mozilla/5.0', details: { fieldsAccessed: ['ein', 'owner_ssn'] }, riskLevel: 'high' },
  { id: 'audit-004', timestamp: '2025-01-22T18:00:00Z', action: 'WEBHOOK_CONFIGURED', actor: 'dev@acmebank.com', actorType: 'user', resource: 'webhook', resourceId: 'wh-004', ipAddress: '10.0.0.25', userAgent: 'Mozilla/5.0', details: { url: 'https://new.endpoint.com/webhooks', events: ['score.created'] }, riskLevel: 'medium' },
  { id: 'audit-005', timestamp: '2025-01-22T16:30:00Z', action: 'REPORT_DOWNLOADED', actor: 'manager@acmebank.com', actorType: 'user', resource: 'report', resourceId: 'rpt-567', ipAddress: '10.0.0.75', userAgent: 'Mozilla/5.0', details: { reportType: 'portfolio_summary', format: 'pdf' }, riskLevel: 'medium' },
];

export const mockDataClassifications: DataClassification[] = [
  {
    category: 'Business Entity',
    fields: [
      { name: 'legal_name', type: 'string', pii: false, encrypted: false },
      { name: 'ein', type: 'string', pii: true, encrypted: true, maskingRule: 'XX-XXX{last4}' },
      { name: 'duns_number', type: 'string', pii: false, encrypted: false },
      { name: 'annual_revenue', type: 'number', pii: false, encrypted: false },
    ],
    retentionDays: 2555,
    encryptionRequired: true,
    piiLevel: 'medium',
  },
  {
    category: 'Business Owner',
    fields: [
      { name: 'full_name', type: 'string', pii: true, encrypted: true },
      { name: 'ssn', type: 'string', pii: true, encrypted: true, maskingRule: 'XXX-XX-{last4}' },
      { name: 'date_of_birth', type: 'date', pii: true, encrypted: true },
      { name: 'email', type: 'string', pii: true, encrypted: true, maskingRule: '{first2}***@{domain}' },
      { name: 'phone', type: 'string', pii: true, encrypted: true, maskingRule: '(XXX) XXX-{last4}' },
    ],
    retentionDays: 2555,
    encryptionRequired: true,
    piiLevel: 'high',
  },
  {
    category: 'Credit Score',
    fields: [
      { name: 'score', type: 'number', pii: false, encrypted: false },
      { name: 'source', type: 'string', pii: false, encrypted: false },
      { name: 'factors', type: 'json', pii: false, encrypted: false },
    ],
    retentionDays: 2555,
    encryptionRequired: false,
    piiLevel: 'low',
  },
];

// ============ SLA Mock Data ============
export const mockSlaMetrics: SlaMetrics = {
  uptimePercentage: 99.97,
  targetUptime: 99.9,
  mttr: 12,
  mtbf: 720,
  currentStatus: 'operational',
};

export const mockIncidents: IncidentRecord[] = [
  {
    id: 'inc-001',
    title: 'Elevated Latency on Score Pull Endpoint',
    description: 'Users experiencing higher than normal latency on /scores/pull endpoint',
    severity: 'minor',
    status: 'resolved',
    affectedServices: ['Credit Score API'],
    startedAt: '2025-01-20T14:00:00Z',
    resolvedAt: '2025-01-20T14:45:00Z',
    duration: 45,
    rootCause: 'Database connection pool exhaustion during peak traffic',
    postmortemUrl: 'https://status.lumiq.ai/incidents/inc-001',
  },
  {
    id: 'inc-002',
    title: 'Webhook Delivery Delays',
    description: 'Webhook deliveries delayed by up to 5 minutes',
    severity: 'minor',
    status: 'resolved',
    affectedServices: ['Webhooks'],
    startedAt: '2025-01-15T09:00:00Z',
    resolvedAt: '2025-01-15T09:30:00Z',
    duration: 30,
    rootCause: 'Message queue backlog during scheduled maintenance window',
  },
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'tkt-001',
    subject: 'Rate limit increase request',
    description: 'Requesting increase from 1000 to 2000 RPM for production',
    priority: 'medium',
    status: 'in_progress',
    category: 'Account Management',
    createdAt: '2025-01-21T10:00:00Z',
    updatedAt: '2025-01-22T14:00:00Z',
    resolvedAt: null,
    assignee: 'Support Team',
    responseTimeMinutes: 45,
    resolutionTimeMinutes: null,
  },
  {
    id: 'tkt-002',
    subject: 'Question about webhook retry policy',
    description: 'Need clarification on exponential backoff configuration',
    priority: 'low',
    status: 'resolved',
    category: 'Technical Support',
    createdAt: '2025-01-19T16:00:00Z',
    updatedAt: '2025-01-20T09:00:00Z',
    resolvedAt: '2025-01-20T09:00:00Z',
    assignee: 'Technical Support',
    responseTimeMinutes: 30,
    resolutionTimeMinutes: 1020,
  },
];

// ============ API Documentation Mock Data ============
export const mockApiVersions: ApiVersion[] = [
  {
    version: 'v2.0',
    releaseDate: '2025-01-01',
    status: 'current',
    changelog: [
      { date: '2025-01-01', type: 'added', description: 'New /scores/bulk endpoint for batch processing', breaking: false },
      { date: '2025-01-01', type: 'added', description: 'mTLS authentication support', breaking: false },
      { date: '2025-01-01', type: 'changed', description: 'Improved rate limiting with per-endpoint quotas', breaking: false },
    ],
  },
  {
    version: 'v1.0',
    releaseDate: '2024-06-01',
    status: 'supported',
    sunsetDate: '2025-06-01',
    changelog: [
      { date: '2024-06-01', type: 'added', description: 'Initial API release', breaking: false },
    ],
  },
];

export const mockApiEndpoints: ApiEndpointDoc[] = [
  {
    path: '/customers',
    method: 'GET',
    description: 'List all SMB entities in a portfolio with pagination',
    category: 'Customers',
    requiredScopes: ['customers:read'],
    rateLimit: 100,
    deprecated: false,
    examples: [
      {
        title: 'List customers with pagination',
        description: 'Retrieve the first page of customers',
        request: {
          headers: { 'Authorization': 'Bearer lq_prod_...', 'X-Portfolio-Id': 'portfolio-123' },
        },
        response: {
          status: 200,
          body: { data: [], meta: { page: 1, pageSize: 20, total: 150 } },
        },
      },
    ],
  },
  {
    path: '/scores/pull',
    method: 'POST',
    description: 'Request a new credit score pull from a bureau',
    category: 'Credit Scores',
    requiredScopes: ['scores:write'],
    rateLimit: 10,
    deprecated: false,
    examples: [
      {
        title: 'Request Experian business score',
        description: 'Initiate a soft pull from Experian Business',
        request: {
          headers: { 'Authorization': 'Bearer lq_prod_...', 'X-Portfolio-Id': 'portfolio-123' },
          body: { smbEntityId: 'ent-456', source: 'experian_biz', consentId: 'consent-789' },
        },
        response: {
          status: 202,
          body: { requestId: 'req-001', status: 'pending', estimatedCompletionSeconds: 30 },
        },
      },
    ],
  },
];
