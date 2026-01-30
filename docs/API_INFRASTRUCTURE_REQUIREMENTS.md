# LumiqAI Dashboard - API & Infrastructure Requirements

## Overview

This document outlines all API endpoints and infrastructure needed to make the dashboard fully live with real data. The system uses a **BFF (Backend-for-Frontend)** pattern with Supabase Edge Functions.

---

## 🟢 ALREADY IMPLEMENTED (Edge Functions Live)

These BFF endpoints are already deployed and functional:

### 1. Customers/SMB Entities (`/customers`)
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/customers` | List SMB entities with filters | ✅ Live |
| GET | `/customers/:id` | Get customer dossier with scores, offers, applications | ✅ Live |
| POST | `/customers` | Create new SMB entity | ✅ Live |
| PATCH | `/customers/:id` | Update SMB entity | ✅ Live |

### 2. Credit Scores (`/scores`)
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/scores` | List scores with filters | ✅ Live |
| GET | `/scores/:id` | Get single score with lineage | ✅ Live |
| POST | `/scores/pull` | Trigger bureau score pull (mock) | ✅ Live (Mock) |

### 3. Prequal Offers (`/offers`)
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/offers` | List offers | ✅ Live |
| POST | `/offers/generate` | Generate prequal offers | ✅ Live |
| PATCH | `/offers/:id` | Update offer status | ✅ Live |

### 4. Applications (`/applications`)
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/applications` | List applications | ✅ Live |
| POST | `/applications` | Create application (one-tap apply) | ✅ Live |
| PATCH | `/applications/:id` | Update status (underwriter) | ✅ Live |

### 5. Reports (`/reports`)
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/reports` | List report jobs | ✅ Live |
| GET | `/reports/:id` | Get report status/download | ✅ Live |
| POST | `/reports` | Create async report job | ✅ Live |

### 6. Risk Analytics (`/risk`)
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/risk/summary` | Executive risk summary | ✅ Live |
| GET | `/risk/ews` | Early warning queue | ✅ Live |
| GET | `/risk/aggregates` | Risk aggregates/heatmaps | ✅ Live |
| POST | `/risk/ews/:id/acknowledge` | Acknowledge EWS alert | ✅ Live |

### 7. API Keys (`/api-keys`)
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api-keys` | List API keys | ✅ Live |
| GET | `/api-keys/:id` | Get key details | ✅ Live |
| GET | `/api-keys/usage` | Aggregate usage stats | ✅ Live |
| POST | `/api-keys` | Create API key | ✅ Live |
| DELETE | `/api-keys/:id` | Revoke API key | ✅ Live |

### 8. Audit Events (`/audit-events`)
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/audit-events` | List audit events | ✅ Live |
| POST | `/audit-events` | Create audit event | ✅ Live |

### 9. Health Check (`/health`)
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/health` | System health check | ✅ Live |

---

## 🟡 NEEDS IMPLEMENTATION (Currently Mocked in UI)

These features use mock data in the frontend and need new endpoints:

### Partner Portal - Credentials Management

| Method | Endpoint | Description | Priority |
|--------|----------|-------------|----------|
| GET | `/partner/credentials` | List all credentials (API keys, OAuth, mTLS) | High |
| POST | `/partner/credentials` | Create credential with rotation policy | High |
| DELETE | `/partner/credentials/:id` | Revoke credential | High |
| POST | `/partner/credentials/:id/rotate` | Rotate credential | High |
| GET | `/partner/credentials/:id/usage` | Per-credential usage stats | Medium |

### Partner Portal - Webhooks

| Method | Endpoint | Description | Priority |
|--------|----------|-------------|----------|
| GET | `/partner/webhooks` | List webhook endpoints | High |
| POST | `/partner/webhooks` | Create webhook endpoint | High |
| PATCH | `/partner/webhooks/:id` | Update webhook (pause/activate) | High |
| DELETE | `/partner/webhooks/:id` | Delete webhook endpoint | High |
| POST | `/partner/webhooks/:id/test` | Send test webhook | Medium |
| GET | `/partner/webhooks/:id/deliveries` | Webhook delivery history | Medium |

### Partner Portal - Usage Analytics

| Method | Endpoint | Description | Priority |
|--------|----------|-------------|----------|
| GET | `/partner/usage/summary` | Usage summary (calls, latency, success rate) | High |
| GET | `/partner/usage/endpoints` | Per-endpoint usage breakdown | High |
| GET | `/partner/usage/quotas` | Quota status and limits | Medium |
| GET | `/partner/usage/trends` | Usage trends over time | Medium |

### Partner Portal - Compliance & Testing

| Method | Endpoint | Description | Priority |
|--------|----------|-------------|----------|
| GET | `/partner/compliance` | Compliance status (SOC2, FFIEC) | Medium |
| GET | `/partner/tests` | Integration test results | Medium |
| POST | `/partner/tests/:id/run` | Run integration test | Low |
| GET | `/partner/certifications` | Certification checklists | Low |

### Partner Portal - SLA & Support

| Method | Endpoint | Description | Priority |
|--------|----------|-------------|----------|
| GET | `/partner/sla` | SLA metrics (uptime, latency) | Medium |
| GET | `/partner/incidents` | Incident history | Medium |
| GET | `/partner/tickets` | Support ticket list | Low |
| POST | `/partner/tickets` | Create support ticket | Low |

### Settings Panels

| Method | Endpoint | Description | Priority |
|--------|----------|-------------|----------|
| GET | `/settings/users` | List platform users | High |
| POST | `/settings/users` | Invite user | High |
| PATCH | `/settings/users/:id` | Update user role/permissions | High |
| DELETE | `/settings/users/:id` | Deactivate user | High |
| GET | `/settings/roles` | Get roles and permissions matrix | High |
| PATCH | `/settings/roles/:role` | Update role permissions | Medium |
| GET | `/settings/sso` | Get SSO configuration | Medium |
| PATCH | `/settings/sso` | Update SSO settings | Medium |
| GET | `/settings/oauth-clients` | List OAuth clients | Medium |
| POST | `/settings/oauth-clients` | Create OAuth client | Medium |
| GET | `/settings/ip-allowlist` | Get IP allowlist | Medium |
| POST | `/settings/ip-allowlist` | Add IP to allowlist | Medium |
| DELETE | `/settings/ip-allowlist/:id` | Remove IP | Medium |
| GET | `/settings/data-sources` | List connected data sources | High |
| POST | `/settings/data-sources/:id/sync` | Trigger sync | Medium |
| GET | `/settings/model-versions` | List model versions | Low |
| GET | `/settings/alert-thresholds` | Get alert thresholds | Medium |
| PATCH | `/settings/alert-thresholds` | Update thresholds | Medium |
| GET | `/settings/retention` | Get data retention policy | Low |
| PATCH | `/settings/retention` | Update retention policy | Low |
| GET | `/settings/pii-masking` | Get PII masking config | Low |
| PATCH | `/settings/pii-masking` | Update PII masking | Low |

### Analytics Dashboard

| Method | Endpoint | Description | Priority |
|--------|----------|-------------|----------|
| GET | `/analytics/portfolio-kpis` | Portfolio KPI tiles | High |
| GET | `/analytics/score-distribution` | Score distribution chart | High |
| GET | `/analytics/score-migration` | Score migration matrix | Medium |
| GET | `/analytics/application-funnel` | Application funnel metrics | High |
| GET | `/analytics/cross-sell` | Cross-sell funnel | Medium |
| GET | `/analytics/feature-importance` | Feature importance chart | Low |
| GET | `/analytics/signal-drift` | Signal drift monitoring | Low |

---

## 🔴 EXTERNAL INTEGRATIONS NEEDED

These require connections to real external services:

### Bureau Integrations (Replace Mock Score Pull)

| Service | Purpose | Required For |
|---------|---------|--------------|
| **Experian Business** | Business credit scores | `/scores/pull` |
| **Dun & Bradstreet** | D&B Paydex, DUNS lookup | `/scores/pull` |
| **Equifax Business** | Business credit data | `/scores/pull` |
| **FICO SBSS** | Small business scoring | `/scores/pull` |

### Data Aggregators

| Service | Purpose | Required For |
|---------|---------|--------------|
| **Plaid** | Bank account data | Customer onboarding, cash flow |
| **Finicity** | Financial data aggregation | Alternative to Plaid |
| **MX** | Open banking connections | Bank connections |

### Accounting Integrations

| Service | Purpose | Required For |
|---------|---------|--------------|
| **QuickBooks** | Financial statements | Customer dossier |
| **Xero** | Accounting data | Customer dossier |
| **Sage** | Enterprise accounting | Customer dossier |

---

## 📦 INFRASTRUCTURE REQUIREMENTS

### Database Tables (Already Exist)

```
✅ tenants, portfolios, profiles, user_roles, portfolio_access
✅ smb_entities, business_owners
✅ credit_scores, score_history
✅ prequal_offers, applications
✅ underwriting_rulesets, underwriting_rules
✅ report_jobs, ews_queue, risk_aggregates
✅ audit_events, data_lineage
✅ api_keys, api_usage_logs
✅ ai_insights, agent_actions
```

### Tables to Add

```sql
-- Partner Portal: Webhooks
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events TEXT[] NOT NULL,
  status TEXT DEFAULT 'active',
  retry_policy JSONB DEFAULT '{"maxRetries": 3, "backoffSeconds": 60}',
  ip_filter TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Partner Portal: Webhook Deliveries
CREATE TABLE webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES webhooks(id),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL,
  response_code INTEGER,
  response_body TEXT,
  attempts INTEGER DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings: OAuth Clients
CREATE TABLE oauth_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  client_id TEXT NOT NULL UNIQUE,
  client_secret_hash TEXT NOT NULL,
  redirect_uris TEXT[] NOT NULL,
  scopes TEXT[] NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings: IP Allowlist
CREATE TABLE ip_allowlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  ip_or_cidr TEXT NOT NULL,
  description TEXT,
  added_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings: SSO Configuration
CREATE TABLE sso_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES tenants(id),
  provider TEXT NOT NULL, -- 'saml' | 'oidc'
  idp_url TEXT NOT NULL,
  certificate TEXT,
  require_mfa BOOLEAN DEFAULT true,
  session_timeout_minutes INTEGER DEFAULT 480,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Settings: Alert Thresholds
CREATE TABLE alert_thresholds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  threshold_key TEXT NOT NULL,
  label TEXT NOT NULL,
  value NUMERIC NOT NULL,
  min_value NUMERIC,
  max_value NUMERIC,
  unit TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, threshold_key)
);

-- Compliance Tracking
CREATE TABLE compliance_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  framework TEXT NOT NULL, -- 'SOC2' | 'FFIEC' | 'GDPR'
  status TEXT NOT NULL,
  last_audit_date DATE,
  next_audit_date DATE,
  findings JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Storage Buckets Needed

| Bucket | Purpose |
|--------|---------|
| `reports` | Generated report PDFs/CSVs |
| `documents` | Customer uploaded documents |
| `bureau-responses` | Raw bureau response caching |

### Background Jobs (n8n or similar)

| Job | Schedule | Purpose |
|-----|----------|---------|
| `score-refresh` | Daily | Refresh stale scores |
| `ews-evaluation` | Hourly | Evaluate EWS triggers |
| `report-generator` | On-demand | Generate async reports |
| `webhook-retry` | Every 5min | Retry failed webhooks |
| `data-retention` | Daily | Apply retention policies |
| `aggregate-metrics` | Hourly | Update risk aggregates |

---

## 🚀 IMPLEMENTATION PRIORITY

### Phase 1: Core (Week 1-2)
1. Wire Partner Portal credentials to `/api-keys` (already exists)
2. Create webhook management endpoints
3. Wire Settings panels to existing user/role data

### Phase 2: Analytics (Week 2-3)
1. Create analytics aggregate endpoints
2. Wire usage analytics to `/api-keys/usage`
3. Add real-time usage tracking

### Phase 3: External (Week 3-4)
1. Integrate one bureau (Experian recommended)
2. Replace mock score pull with real API
3. Add data lineage for bureau data

### Phase 4: Compliance (Week 4+)
1. Add compliance tracking endpoints
2. Implement SLA monitoring
3. Add support ticket integration

---

## 📋 SDK/API Usage

Your SDK should wrap these BFF endpoints:

```typescript
// Example SDK structure
const lumiq = new LumiqSDK({ apiKey: 'lq_...' });

// Customers
await lumiq.customers.list({ portfolioId, search, riskClass });
await lumiq.customers.get(customerId);

// Scores
await lumiq.scores.pull({ smbEntityId, bureaus: ['experian'] });
await lumiq.scores.list({ portfolioId, smbEntityId });

// Offers
await lumiq.offers.generate({ smbEntityId, portfolioId });
await lumiq.offers.accept(offerId);

// Applications
await lumiq.applications.submit({ smbEntityId, offerId });
await lumiq.applications.updateStatus(appId, 'approved');

// Risk
await lumiq.risk.getSummary(portfolioId);
await lumiq.risk.getEWSQueue(portfolioId);

// Reports
await lumiq.reports.create({ reportType: 'portfolio_summary' });
await lumiq.reports.download(reportId);
```

---

## Authentication Requirements

All endpoints require:
- `Authorization: Bearer <jwt>` header
- `?portfolioId=<uuid>` query param (for data-scoped endpoints)

The JWT contains:
- `sub`: User ID
- `tenant_id`: Tenant ID (custom claim from profiles)
- `roles`: User roles array

---

*Document generated: 2026-01-22*
