# LumiqAI Enterprise Dashboard: Frontend-Implied Backend Contract

This document captures all backend capabilities implied by the frontend UI, regardless of current implementation status.

---

## 1. Implied API Endpoints

### 1.1 Customer/SMB Entity Endpoints

| Endpoint | Purpose | Data Shape Implied | Frequency |
|----------|---------|-------------------|-----------|
| `GET /customers` | List SMB entities in portfolio | `{ data: SmbEntity[], pagination: { page, pageSize, total }, meta: { lastUpdated, dataSources } }` | On-load, on-filter |
| `GET /customers/:id` | Fetch single customer dossier | `{ data: CustomerDossier }` with nested scores, applications, owners | On-click |
| `POST /customers` | Create new SMB entity | `{ businessName, ein, naicsCode, annualRevenue, ... }` | On-action |
| `PUT /customers/:id` | Update customer details | Partial `SmbEntity` fields | On-save |
| `DELETE /customers/:id` | Remove customer (soft delete) | `{ id }` | On-action |
| `GET /customers/:id/notes` | Fetch customer notes | `{ data: Note[] }` | On-dossier-open |
| `POST /customers/:id/notes` | Add note to customer | `{ content, authorId }` | On-action |
| `GET /customers/search` | Search customers by query | `{ query, filters }` → `{ data: SmbEntity[] }` | Real-time (debounced) |

### 1.2 Credit Score Endpoints

| Endpoint | Purpose | Data Shape Implied | Frequency |
|----------|---------|-------------------|-----------|
| `GET /scores` | List recent score pulls | `{ data: CreditScore[], meta }` | On-load |
| `GET /scores/:id` | Fetch single score detail | `{ data: CreditScore }` with factors array | On-click |
| `POST /scores/pull` | Trigger bureau score pull | `{ smbEntityId, source, consentId? }` → `{ score, lineageId }` | On-action |
| `GET /scores/history/:smbEntityId` | Score history for entity | `{ data: ScoreHistoryRecord[] }` | On-dossier-open |
| `POST /scores/upload` | Bulk upload bureau data | Multipart file upload with CSV/JSON | Batch |
| `GET /scores/distribution` | Portfolio score distribution | `{ buckets: { range, count }[] }` | On-load |

### 1.3 Pre-qualification & Offers Endpoints

| Endpoint | Purpose | Data Shape Implied | Frequency |
|----------|---------|-------------------|-----------|
| `POST /offers/generate` | Generate prequal offer | `{ smbEntityId, productType, requestedAmount? }` → `PrequalOffer` | On-action |
| `GET /offers` | List offers for portfolio | `{ data: PrequalOffer[] }` | On-load |
| `GET /offers/:id` | Fetch offer details | `{ data: PrequalOffer }` with decision factors | On-click |
| `PUT /offers/:id/status` | Update offer status | `{ status: 'accepted' | 'declined' }` | On-action |
| `GET /offers/pipeline` | Offer funnel metrics | `{ stages: { name, count, conversionRate }[] }` | On-load |

### 1.4 Application Endpoints

| Endpoint | Purpose | Data Shape Implied | Frequency |
|----------|---------|-------------------|-----------|
| `GET /applications` | List applications | `{ data: Application[], pagination }` | On-load |
| `GET /applications/:id` | Fetch application detail | `{ data: Application }` with full applicationData | On-click |
| `POST /applications` | Submit new application | `SubmitApplicationRequest` | On-action |
| `PUT /applications/:id/status` | Update application status | `{ status, decidedBy?, decisionData? }` | On-action (approve/decline) |
| `GET /applications/queue` | Underwriting work queue | `{ data: Application[], filters }` | On-load |
| `POST /applications/:id/assign` | Assign to underwriter | `{ userId }` | On-action |

### 1.5 Risk & Analytics Endpoints

| Endpoint | Purpose | Data Shape Implied | Frequency |
|----------|---------|-------------------|-----------|
| `GET /risk/summary` | Executive risk summary | `RiskSummary` with KPIs, drivers, trends | On-load |
| `GET /risk/heatmap` | Risk heatmap data | `{ data: HeatmapConfig[] }` | On-load |
| `GET /risk/concentration` | Concentration analysis | `{ categories: ConcentrationCategory[] }` | On-load |
| `GET /risk/ews` | Early Warning System queue | `{ data: EWSQueueItem[] }` | On-load, polling |
| `POST /risk/ews/:id/acknowledge` | Acknowledge EWS alert | `{ acknowledgedBy }` | On-action |
| `GET /risk/aggregates` | Aggregated risk metrics | `{ data: RiskAggregate[] }` by dimension | On-load |
| `GET /risk/stress-scenarios` | Stress test scenarios | `{ data: StressScenario[] }` | On-load |
| `POST /risk/stress-scenarios/run` | Run stress test | `{ scenarioId, parameters }` | On-action |

### 1.6 Reports Endpoints

| Endpoint | Purpose | Data Shape Implied | Frequency |
|----------|---------|-------------------|-----------|
| `GET /reports` | List generated reports | `{ data: ReportJob[] }` | On-load |
| `POST /reports/generate` | Request report generation | `CreateReportRequest` → `{ jobId }` | On-action |
| `GET /reports/:id` | Report job status | `{ data: ReportJob }` with status | Polling |
| `GET /reports/:id/download` | Download report artifact | Binary file (PDF/XLSX) | On-action |
| `GET /reports/templates` | Available report templates | `{ data: ReportTemplate[] }` | On-load |
| `POST /reports/schedule` | Schedule recurring report | `{ reportType, schedule, recipients }` | On-action |

### 1.7 API Key Management Endpoints

| Endpoint | Purpose | Data Shape Implied | Frequency |
|----------|---------|-------------------|-----------|
| `GET /api-keys` | List API keys | `{ data: ApiKey[] }` | On-load |
| `POST /api-keys` | Create new API key | `CreateApiKeyRequest` → `{ key (once), keyPrefix }` | On-action |
| `DELETE /api-keys/:id` | Revoke API key | `{ id }` | On-action |
| `POST /api-keys/:id/rotate` | Rotate API key | `{ id }` → `{ newKey }` | On-action |
| `GET /api-keys/:id/usage` | Key usage analytics | `ApiKeyUsage` | On-load |
| `GET /api-keys/stats` | Aggregate usage stats | `{ totalCalls, byEnvironment }` | On-load, polling |

### 1.8 Audit & Compliance Endpoints

| Endpoint | Purpose | Data Shape Implied | Frequency |
|----------|---------|-------------------|-----------|
| `GET /audit-events` | Fetch audit log | `{ data: AuditEvent[], pagination }` | On-load |
| `POST /audit-events` | Emit client-side audit event | `CreateAuditEventRequest` | On-action |
| `GET /audit-events/export` | Export audit log | Binary file (CSV) | On-action |
| `GET /audit-events/stream` | Real-time audit stream | SSE/WebSocket | Real-time |

### 1.9 User & Access Management Endpoints

| Endpoint | Purpose | Data Shape Implied | Frequency |
|----------|---------|-------------------|-----------|
| `GET /users` | List platform users | `{ data: PlatformUser[] }` | On-load |
| `POST /users` | Invite new user | `{ email, roleId }` | On-action |
| `PUT /users/:id` | Update user | Partial user fields | On-action |
| `DELETE /users/:id` | Remove user | `{ id }` | On-action |
| `GET /roles` | List roles | `{ data: Role[] }` | On-load |
| `PUT /roles/:id/permissions` | Update role permissions | `{ permissions: string[] }` | On-action |

### 1.10 Webhook Management Endpoints

| Endpoint | Purpose | Data Shape Implied | Frequency |
|----------|---------|-------------------|-----------|
| `GET /webhooks` | List webhook subscriptions | `{ data: WebhookConfig[] }` | On-load |
| `POST /webhooks` | Create webhook | `{ url, events, secret? }` | On-action |
| `PUT /webhooks/:id` | Update webhook | Partial webhook fields | On-action |
| `DELETE /webhooks/:id` | Delete webhook | `{ id }` | On-action |
| `POST /webhooks/:id/test` | Send test webhook | `{ eventType }` | On-action |
| `GET /webhooks/:id/deliveries` | Delivery history | `{ data: WebhookDelivery[] }` | On-load |

### 1.11 Configuration Endpoints

| Endpoint | Purpose | Data Shape Implied | Frequency |
|----------|---------|-------------------|-----------|
| `GET /settings/sso` | SSO configuration | `{ provider, config }` | On-load |
| `PUT /settings/sso` | Update SSO config | SSO provider configuration | On-action |
| `GET /settings/oauth-clients` | OAuth clients | `{ data: OAuthClient[] }` | On-load |
| `POST /settings/oauth-clients` | Create OAuth client | `{ name, redirectUris, grants }` | On-action |
| `GET /settings/ip-allowlist` | IP whitelist | `{ data: IpAllowlistEntry[] }` | On-load |
| `POST /settings/ip-allowlist` | Add IP to whitelist | `{ cidr, description }` | On-action |
| `GET /settings/retention` | Data retention policies | `{ policies: RetentionPolicy[] }` | On-load |
| `PUT /settings/retention` | Update retention policy | Retention configuration | On-action |
| `GET /settings/pii-masking` | PII masking rules | `{ rules: MaskingRule[] }` | On-load |
| `GET /settings/alerts` | Alert thresholds | `{ data: AlertThreshold[] }` | On-load |
| `PUT /settings/alerts` | Update alert thresholds | `AlertThreshold[]` | On-action |

### 1.12 Portfolio & Tenant Endpoints

| Endpoint | Purpose | Data Shape Implied | Frequency |
|----------|---------|-------------------|-----------|
| `GET /portfolios` | List accessible portfolios | `{ data: Portfolio[] }` | On-load (app init) |
| `GET /portfolios/:id` | Portfolio details | `{ data: Portfolio }` | On-select |
| `GET /portfolios/:id/stats` | Portfolio KPIs | `{ kpis: PortfolioKPI[] }` | On-load |
| `GET /tenants/current` | Current tenant info | `{ name, id, ssoEnabled, config }` | On-load (app init) |

### 1.13 Data Source & Integration Endpoints

| Endpoint | Purpose | Data Shape Implied | Frequency |
|----------|---------|-------------------|-----------|
| `GET /data-sources` | List connected sources | `{ data: DataSource[] }` | On-load |
| `POST /data-sources/:id/sync` | Trigger data sync | `{ id }` | On-action |
| `POST /data-sources/:id/reauth` | Re-authenticate source | `{ id }` → OAuth flow | On-action |
| `GET /data-sources/:id/status` | Source health status | `{ status, lastSync, errorCount }` | Polling |
| `GET /integrations` | List integrations | `{ data: Integration[] }` | On-load |
| `PUT /integrations/:id` | Toggle integration | `{ enabled: boolean }` | On-action |

### 1.14 Model Governance Endpoints

| Endpoint | Purpose | Data Shape Implied | Frequency |
|----------|---------|-------------------|-----------|
| `GET /models` | List model versions | `{ data: ModelInfo[] }` | On-load |
| `GET /models/:id/drift` | Feature drift analysis | `{ data: FeatureDrift[] }` | On-load |
| `GET /models/:id/outcomes` | Outcome monitoring | `{ data: OutcomeMonitoring }` | On-load |
| `POST /models/:id/validate` | Validate model | `{ id }` → `{ validationResult }` | On-action |

### 1.15 Health & Status Endpoints

| Endpoint | Purpose | Data Shape Implied | Frequency |
|----------|---------|-------------------|-----------|
| `GET /health` | System health check | `{ status, db, uptime, latency }` | Polling |
| `GET /status/bureaus` | Bureau connectivity | `{ bureaus: { name, status, latency }[] }` | Polling |

---

## 2. Implied Data Models

### 2.1 Core Entities

| Entity | Key Fields | Relationships |
|--------|------------|---------------|
| **Tenant** | id, name, slug, ssoProvider, sessionTimeout, config | Has many Portfolios, Users |
| **Portfolio** | id, tenantId, name, code, config | Belongs to Tenant; Has many SmbEntities, Applications |
| **SmbEntity** | id, tenantId, portfolioId, businessName, ein, naicsCode, annualRevenue, riskTier, relationshipStage, segment | Belongs to Portfolio; Has many CreditScores, Applications, Owners |
| **BusinessOwner** | id, smbEntityId, firstName, lastName, ownershipPercentage, isGuarantor | Belongs to SmbEntity |
| **CreditScore** | id, smbEntityId, source, scoreType, score, riskClass, factors, pulledAt, expiresAt | Belongs to SmbEntity |
| **PrequalOffer** | id, smbEntityId, portfolioId, productType, minAmount, maxAmount, status, expiresAt | Belongs to SmbEntity, Portfolio |
| **Application** | id, smbEntityId, portfolioId, offerId, status, requestedAmount, decidedBy, decidedAt | Belongs to SmbEntity, Portfolio; References PrequalOffer |
| **ReportJob** | id, portfolioId, reportType, status, parameters, artifactUrl, completedAt | Belongs to Portfolio |
| **ApiKey** | id, tenantId, name, keyHash, keyPrefix, environment, scopes, isActive, expiresAt | Belongs to Tenant |
| **AuditEvent** | id, tenantId, userId, action, resourceType, resourceId, details, ipAddress, createdAt | Belongs to Tenant |
| **EWSAlert** | id, smbEntityId, portfolioId, alertType, severity, message, acknowledgedAt, acknowledgedBy | Belongs to SmbEntity, Portfolio |

### 2.2 Configuration Entities

| Entity | Key Fields | Relationships |
|--------|------------|---------------|
| **PlatformUser** | id, tenantId, email, fullName, roleId, status, lastLogin, mfaEnabled | Belongs to Tenant, Role |
| **Role** | id, tenantId, name, permissions | Belongs to Tenant; Has many Users |
| **WebhookConfig** | id, tenantId, name, url, events, secretHash, isActive, failureCount | Belongs to Tenant |
| **WebhookDelivery** | id, webhookId, eventType, payload, status, responseCode, attemptCount | Belongs to WebhookConfig |
| **OAuthClient** | id, tenantId, clientId, clientSecretHash, redirectUris, grants | Belongs to Tenant |
| **IpAllowlistEntry** | id, tenantId, cidr, description, isActive | Belongs to Tenant |
| **SSOConfig** | id, tenantId, providerType, configJson, isActive | Belongs to Tenant |
| **AlertThreshold** | id, tenantId, metric, operator, thresholdValue, alertChannel | Belongs to Tenant |
| **DataSource** | id, tenantId, sourceType, name, status, lastSync, credentialRef | Belongs to Tenant |
| **ModelVersion** | id, name, version, status, validatedAt, validatedBy, performanceMetrics | Standalone |

### 2.3 Relationship Diagram (Implied)

```
Tenant
 ├── Portfolios[]
 │    ├── SmbEntities[]
 │    │    ├── BusinessOwners[]
 │    │    ├── CreditScores[]
 │    │    ├── PrequalOffers[]
 │    │    ├── Applications[]
 │    │    └── EWSAlerts[]
 │    └── ReportJobs[]
 ├── Users[]
 │    └── Role
 ├── ApiKeys[]
 ├── AuditEvents[]
 ├── WebhookConfigs[]
 │    └── WebhookDeliveries[]
 ├── OAuthClients[]
 ├── IpAllowlistEntries[]
 ├── SSOConfig
 ├── AlertThresholds[]
 └── DataSources[]
```

---

## 3. Implied State Transitions

### 3.1 Application Status Flow

```
draft → submitted → under_review → approved → funded
                                 → declined
                  → withdrawn
```

**Implied Actions:**
- `Submit` (draft → submitted)
- `Start Review` (submitted → under_review)
- `Approve` (under_review → approved)
- `Decline` (under_review → declined)
- `Withdraw` (any → withdrawn)
- `Fund` (approved → funded)

### 3.2 Offer Status Flow

```
generated → presented → accepted → (application created)
                      → declined
          → expired
```

**Implied Actions:**
- `Present` (generated → presented)
- `Accept` (presented → accepted)
- `Decline` (presented → declined)
- Auto-expire via background job

### 3.3 Report Job Status Flow

```
queued → processing → completed
                    → failed
```

**Implied Actions:**
- `Create` (→ queued)
- `Start Processing` (queued → processing) - background
- `Complete` (processing → completed) - background
- `Fail` (processing → failed) - background

### 3.4 EWS Alert Flow

```
triggered → acknowledged → resolved
                        → escalated
```

**Implied Actions:**
- `Acknowledge` (triggered → acknowledged)
- `Resolve` (acknowledged → resolved)
- `Escalate` (any → escalated)

### 3.5 API Key Lifecycle

```
active → rotated (new key active, old revoked)
       → revoked
       → expired
```

### 3.6 Webhook Delivery Flow

```
pending → success
        → failed → retrying → success
                            → failed (max retries)
```

### 3.7 User Invitation Flow

```
invited → pending_verification → active → suspended → removed
```

### 3.8 Relationship Stage Progression

```
prospect → new → growing → mature
                        → at-risk → (back to growing or churned)
```

---

## 4. Implied Performance Expectations

### 4.1 Real-Time Requirements (< 200ms response)

| Operation | Expected Latency | UI Indicator |
|-----------|-----------------|--------------|
| Page navigation | < 100ms | Skeleton loaders |
| Search typeahead | < 150ms (debounced 300ms) | Inline spinner |
| Filter application | < 200ms | Content fade |
| Customer selection | < 100ms | Instant highlight |
| Score pull trigger | < 500ms to acknowledge | Button loading state |

### 4.2 Near Real-Time (Polling/SSE)

| Data | Refresh Interval | UI Behavior |
|------|-----------------|-------------|
| API usage stats | 30 seconds | Silent background refresh |
| EWS queue | 60 seconds | Badge update |
| Webhook delivery status | 10 seconds during test | Progress indicator |
| Report job status | 5 seconds until complete | Polling with timeout |
| Session timeout check | 60 seconds | Warning modal at threshold |

### 4.3 Batch/Delayed Operations

| Operation | Expected Duration | UI Pattern |
|-----------|------------------|------------|
| Report generation | 5-60 seconds | Job status polling with progress |
| Bureau score pull | 2-10 seconds | Async with callback |
| Bulk CSV upload | 30-300 seconds | Background job with notification |
| Stress test execution | 10-120 seconds | Progress bar |
| Data source sync | 60-600 seconds | Background with status update |

### 4.4 Data Freshness Expectations

| Data Type | Expected Staleness | UI Display |
|-----------|-------------------|------------|
| Customer list | < 5 minutes | "Last updated" timestamp |
| Credit scores | Up to 24 hours | "Pulled at" date |
| Portfolio KPIs | < 1 hour | Freshness color indicator |
| Audit logs | Real-time | Streaming or 30s polling |
| Risk metrics | < 4 hours | "As of" date |
| Webhook deliveries | Real-time | Auto-refresh list |

### 4.5 Pagination Expectations

| List | Expected Page Size | Total Capacity |
|------|-------------------|----------------|
| Customer list | 10-50 | 100,000+ |
| Application queue | 25 | 10,000+ |
| Audit events | 50-100 | Unlimited |
| Score history | 20 | 1,000 per entity |
| Webhook deliveries | 25 | 10,000 per webhook |

### 4.6 Concurrent User Expectations

| Feature | Implied Concurrency |
|---------|---------------------|
| Dashboard access | 50+ simultaneous users per tenant |
| Score pulls | 10+ concurrent per tenant |
| Report generation | 5+ concurrent jobs per tenant |
| Real-time updates | 100+ open connections per tenant |

---

## 5. Implied Authorization Rules

### 5.1 Role-Based Access (Implied from UI)

| Role | Implied Capabilities |
|------|---------------------|
| `super_admin` | All operations, cross-tenant |
| `admin` | All operations within tenant |
| `developer` | API keys, testing, webhooks |
| `risk_analyst` | Risk views, EWS queue, read-only customer |
| `relationship_manager` | Full customer access, offers, applications |
| `readonly` | View-only access to all data |

### 5.2 Resource-Level Permissions

| Permission | Resources |
|------------|-----------|
| `customers:read` | View customer list and dossiers |
| `customers:write` | Create, update customers |
| `customers:delete` | Remove customers |
| `scores:read` | View score history |
| `scores:pull` | Trigger bureau pulls |
| `offers:read` | View offers |
| `offers:generate` | Create prequal offers |
| `applications:read` | View applications |
| `applications:approve` | Approve/decline applications |
| `reports:read` | View reports |
| `reports:generate` | Create reports |
| `reports:export` | Download report artifacts |
| `api_keys:manage` | Create, revoke, rotate API keys |
| `webhooks:manage` | CRUD webhook configurations |
| `users:manage` | Invite, remove users |
| `roles:manage` | Modify role permissions |
| `audit:read` | View audit logs |
| `settings:manage` | Modify platform settings |

---

## 6. Implied Error Handling

### 6.1 Error Codes (Implied from BffErrorBoundary)

| HTTP Status | Error Code | UI Behavior |
|-------------|------------|-------------|
| 401 | `UNAUTHORIZED` | Redirect to login |
| 403 | `FORBIDDEN` | Access denied message |
| 404 | `NOT_FOUND` | Resource not found display |
| 422 | `VALIDATION_ERROR` | Form validation errors, portfolio selection prompt |
| 429 | `RATE_LIMITED` | Retry after message |
| 500 | `SERVER_ERROR` | Generic error with retry |
| 503 | `SERVICE_UNAVAILABLE` | Maintenance mode |

### 6.2 Retry Behavior

| Error Type | Retry Strategy |
|------------|---------------|
| Network timeout | 3 retries with exponential backoff |
| 429 rate limit | Wait for Retry-After header |
| 503 unavailable | Poll every 30s |
| Authentication | Redirect to login (no retry) |

---

## Summary: Frontend Expectations of Backend

### Implemented and Wired

The frontend actively calls these BFF endpoints:
- `/customers` - List and detail fetching
- `/scores` - List and pull operations
- `/api-keys` - Full CRUD operations
- `/audit-events` - Emit and list
- `/health` - System health check
- `/portfolios` - Portfolio context loading

### Implied but Not Implemented

The UI implies these backend capabilities exist:

**High Priority (Required for Full Functionality):**
- `/offers` - Pre-qualification workflow
- `/applications` - Underwriting pipeline
- `/reports/generate` - Report job system
- `/risk/summary` and `/risk/ews` - Risk intelligence
- `/webhooks` - Partner webhook management
- `/users` and `/roles` - Access management

**Medium Priority (Settings & Configuration):**
- `/settings/sso` - SSO configuration
- `/settings/oauth-clients` - OAuth management
- `/settings/ip-allowlist` - IP whitelisting
- `/settings/alerts` - Alert thresholds
- `/settings/retention` - Data retention policies
- `/data-sources` - Integration management

**Lower Priority (Enhancement Features):**
- `/models` - Model governance
- `/risk/stress-scenarios` - Stress testing
- Real-time streaming (SSE/WebSocket)
- Bulk upload endpoints

### Data Contract Summary

The frontend expects:
1. **Standardized Response Envelope**: `{ success, data, error?, meta: { lastUpdated, dataSources } }`
2. **Mandatory Portfolio Scoping**: All data endpoints require `portfolioId` query parameter
3. **Tenant Isolation**: All data filtered by JWT-derived `tenant_id`
4. **Pagination**: Standard `{ page, pageSize }` → `{ data, pagination: { page, pageSize, total } }`
5. **Audit Trail**: All mutations logged to `audit_events`
6. **Data Lineage**: Source and freshness metadata on all responses
