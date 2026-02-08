# LUMIQ AI Dashboard — Database Seed Data

## Overview

This directory contains two PostgreSQL seed files that provide test data for the LUMIQ AI platform. Together they cover both the **API database** (managed by Prisma) and **dashboard-specific tables** used only by the frontend.

| File | Purpose | Tables | Businesses | DDL? |
|------|---------|--------|------------|------|
| `api-seed.sql` | Seeds the API's PostgreSQL database | 20 (Prisma-managed) | 55 | INSERT-only |
| `dashboard-seed.sql` | Standalone dashboard demo data | 27 (self-contained) | 41 | CREATE TABLE + INSERT |

---

## Quick Start

### Option A: Seed the API database (recommended for full-stack development)

```bash
# 1. Ensure the API database schema is up to date
cd /path/to/lumiq-ai-api
npx prisma migrate deploy

# 2. Load the seed data
psql -U <user> -d <database> -f /path/to/Lumiq-AI-Dashboard/database/api-seed.sql
```

### Option B: Seed a standalone dashboard database

```bash
# Creates tables and inserts data in one step
psql -U <user> -d <database> -f database/dashboard-seed.sql
```

### Re-running

Both files are idempotent:
- `api-seed.sql` starts with `TRUNCATE ... CASCADE` to clear existing data
- `dashboard-seed.sql` starts with `DROP TABLE IF EXISTS ... CASCADE`

---

## UUID Cross-Reference

The dashboard uses human-readable IDs (`biz-001`), while the API uses UUIDs. This mapping connects them:

| Dashboard ID | API UUID | Business Name |
|-------------|----------|---------------|
| `biz-001` | `40000000-0000-4000-a000-000000000001` | Stellar Dynamics LLC |
| `biz-002` | `40000000-0000-4000-a000-000000000002` | Metro Logistics Corp |
| `biz-003` | `40000000-0000-4000-a000-000000000003` | Apex Construction Group |
| `biz-004` | `40000000-0000-4000-a000-000000000004` | Sunrise Healthcare Partners |
| `biz-005` | `40000000-0000-4000-a000-000000000005` | GreenLeaf Organics |
| `biz-006` | `40000000-0000-4000-a000-000000000006` | Coastal Hospitality Group |
| `biz-007` | `40000000-0000-4000-a000-000000000007` | Precision Manufacturing Co |
| `biz-008` | `40000000-0000-4000-a000-000000000008` | TechVenture Solutions |
| `biz-009` | `40000000-0000-4000-a000-000000000009` | Urban Retail Partners |
| `biz-010` | `40000000-0000-4000-a000-000000000010` | Pacific Marine Services |
| `biz-011` – `biz-041` | `40000000-...-000000000011` – `...041` | (31 regional businesses) |
| *(new)* | `40000000-...-000000000042` – `...055` | (14 additional businesses) |

### UUID Scheme

Entity prefixes make UUIDs identifiable at a glance:

| Entity | UUID Prefix | Example |
|--------|------------|---------|
| Tenant | `10000000-` | `10000000-0000-4000-a000-000000000001` |
| Portfolio | `20000000-` | `20000000-0000-4000-a000-000000000001` |
| Users | `30000000-` | `30000000-0000-4000-a000-000000000001` |
| Businesses | `40000000-` | `40000000-0000-4000-a000-000000000001` |
| Cards | `50000000-` | `50000000-0000-4000-a000-000000000001` |
| Scores | `60000000-` | `60000000-0000-4000-a000-000000000001` |
| Recommendations | `70000000-` | `70000000-0000-4000-a000-000000000001` |
| Applications | `80000000-` | `80000000-0000-4000-a000-000000000001` |

---

## Table Coverage

### API Seed (`api-seed.sql`) — Prisma Schema Tables

| Table | Rows | Description |
|-------|------|-------------|
| `users` | 5 | Platform users (admin, developer, risk, RM, analyst) |
| `tenants` | 1 | Partner Bank tenant |
| `portfolios` | 1 | SMB Pilot Portfolio |
| `tenant_users` | 5 | User-tenant membership with roles |
| `businesses` | 55 | SMB entities across 30+ industries |
| `portfolio_businesses` | 55 | All businesses linked to the portfolio |
| `cards` | 8 | Credit card products |
| `card_attributes` | 8 | Card terms (APR, fees, rewards) |
| `business_scores` | 55 | Bureau scores (Experian, SBSS, Equifax) |
| `business_recommendations` | 55 | AI card recommendations (JSONB) |
| `business_card_applications` | 25 | Card applications with status |
| `batch_jobs` | 2 | Batch scoring jobs |
| `batch_items` | 10 | Individual batch items |
| `audit_events` | 20 | Compliance audit trail |
| `ews_alerts` | 8 | Early warning system alerts |
| `tenant_api_keys` | 3 | Tenant-level API keys |
| `api_keys` | 3 | User-level API keys |
| `events` | 8 | User activity events |
| `alerts` | 5 | User notification alerts |

### Dashboard Seed (`dashboard-seed.sql`) — Dashboard-Only Tables

These tables support frontend features that don't have API endpoints yet:

| Table | Rows | Dashboard Feature |
|-------|------|-------------------|
| `credit_signals` | 70 | Signal-based credit intelligence panel |
| `bureau_indicators` | 30 | Bureau indicator cards (D&B, Experian, FICO) |
| `product_readiness` | 60 | Product eligibility assessment |
| `activity_history` | 50 | Business activity timeline |
| `prequal_offers` | 13 | Pre-qualification offers |
| `products` | 22 | Existing banking products per business |
| `report_templates` | 18 | Report builder templates |
| `generated_reports` | 6 | Previously generated reports |
| `portfolio_kpis` | 6 | Enterprise analytics KPIs |
| `score_distribution` | 5 | Score band distribution chart |
| `risk_drivers` | 5 | Top risk driver analysis |
| `pilot_metrics` | 1 | Pilot program summary metrics |
| `data_sources` | 7 | Data source connections |
| `model_versions` | 4 | ML model version tracking |
| `system_services` | 5 | System health monitoring |
| `webhook_events` | 4 | Webhook delivery log |

---

## Data Flow: API → Dashboard

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  PostgreSQL  │────▶│  NestJS API      │────▶│  React Dashboard│
│  (api-seed)  │     │  /api/v1/dashboard│     │  (BFF client)   │
└─────────────┘     └──────────────────┘     └─────────────────┘
```

### Authentication Flow

1. User authenticates via **Clerk** → gets JWT with `orgId` claim
2. Dashboard's BFF client (`src/services/bff/client.ts`) sends JWT in `Authorization` header
3. API's `ClerkGuard` validates JWT
4. API's `TenantGuard` resolves `orgId` → `tenantId`
5. All queries are scoped to `tenantId` + `portfolioId`

### API Endpoint → Table Mapping

| API Endpoint | Primary Table(s) | Dashboard Page |
|-------------|-------------------|----------------|
| `GET /dashboard/portfolios` | `portfolios`, `tenant_users` | Portfolio selector |
| `GET /dashboard/customers` | `businesses`, `portfolio_businesses` | Customer list |
| `GET /dashboard/customers/:id` | `businesses`, `business_scores`, `business_recommendations` | Customer detail |
| `GET /dashboard/scores` | `business_scores` | Score overview |
| `POST /dashboard/scores/pull` | `business_scores` (write) | Score refresh |
| `GET /dashboard/scores/distribution` | `business_scores` (aggregate) | Analytics charts |
| `GET /dashboard/offers` | `business_recommendations` | Pre-qual offers |
| `GET /dashboard/applications` | `business_card_applications`, `cards` | Application pipeline |
| `PUT /dashboard/applications/:id/status` | `business_card_applications` (write) | Decision workspace |
| `GET /dashboard/risk/summary` | `businesses` (aggregate by `riskTier`) | Risk dashboard |
| `GET /dashboard/risk/ews` | `ews_alerts` | Early warning signals |
| `POST /dashboard/risk/ews/:id/acknowledge` | `ews_alerts` (write) | Alert management |
| `POST /dashboard/batch/submit` | `batch_jobs`, `batch_items` (write) | Batch processing |
| `GET /dashboard/batch/:id/status` | `batch_jobs` | Batch monitor |
| `GET /dashboard/analytics/funnel` | `business_card_applications` (aggregate) | Analytics funnel |
| `GET /dashboard/audit-events` | `audit_events` | Audit trail |
| `GET /dashboard/health` | *(no table — runtime check)* | System status |

### Response Envelope

All API responses use this envelope format, which the dashboard's `useBffQuery` hook parses:

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "dataSources": ["prisma", "experian"],
    "lastUpdated": "2026-02-01T14:30:00.000Z"
  },
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "total": 142
  }
}
```

---

## Key Schema Differences

| Aspect | API (`api-seed.sql`) | Dashboard (`dashboard-seed.sql`) |
|--------|---------------------|----------------------------------|
| **IDs** | UUID v4 | Human-readable (`biz-001`) |
| **Column naming** | camelCase (`naicsCode`) | snake_case (`naics_code`) |
| **Enums** | Prisma enums (`'EXPERIAN'`) | Custom PG enums (`'experian_biz'`) |
| **Recommendations** | JSONB blob per business | Individual `prequal_offers` rows |
| **Scores** | `business_scores` with `EScoreType` | `credit_scores` with custom `score_source` |
| **Applications** | `business_card_applications` (card-linked) | `applications` (product-type-linked) |
| **Multi-tenant** | Full: Tenant → Portfolio → Business | Simplified: single tenant |
| **Owner data** | Inline on `businesses` table | Separate `business_owners` table |

---

## Replacing Test Data with Real Data

When transitioning from seed data to production:

### 1. Remove seed data
```bash
# The api-seed.sql TRUNCATE block can be run standalone to clear test data
psql -c "TRUNCATE users, tenants, portfolios, businesses CASCADE;" -d lumiq
```

### 2. Connect real Clerk organization
Update the tenant's `clerkOrgId` to match your real Clerk organization:
```sql
UPDATE "tenants" SET "clerkOrgId" = 'org_YOUR_REAL_ORG_ID' WHERE "slug" = 'partner-bank';
```

### 3. Import real businesses
The API's `POST /dashboard/batch/submit` endpoint processes CSV/JSON business data through the scoring pipeline:
1. Upload business data → creates `batch_jobs` + `batch_items`
2. Each item is scored → populates `business_scores`
3. Recommendations generated → populates `business_recommendations`
4. Businesses auto-linked to portfolio → `portfolio_businesses`

### 4. Bureau integration
Real scores come from:
- **Experian** → `EScoreType.EXPERIAN` (Intelliscore Plus)
- **FICO SBSS** → `EScoreType.SBSS` (SBA pre-screen)
- **Equifax** → `EScoreType.EQUIFAX_ONESCORE` / `EQUIFAX_MASTERSCORE`

The API's `POST /dashboard/scores/pull` endpoint triggers live bureau pulls.

### 5. Dashboard fallback
While migrating, the dashboard supports both modes:
- **API mode**: Set `VITE_API_URL` to point to the API → data comes from PostgreSQL
- **Mock mode**: Set `VITE_USE_MOCK_AUTH=true` → data comes from TypeScript mock files

---

## File Correlation

The two seed files are designed to work together. They represent the **same businesses** with complementary data:

```
api-seed.sql                          dashboard-seed.sql
─────────────                         ──────────────────
businesses (55)          ←matched→    businesses (41)
business_scores (55)     ←equiv→      credit_scores (10)
business_recommendations ←equiv→      prequal_offers (13)
business_card_applications ←equiv→    applications (5)
ews_alerts (8)           ←equiv→      ews_alerts (5)
audit_events (20)        ←equiv→      audit_logs (15)
tenant_api_keys (3)      ←equiv→      api_keys (3)
                                      credit_signals (70)      ← dashboard-only
                                      bureau_indicators (30)   ← dashboard-only
                                      product_readiness (60)   ← dashboard-only
                                      activity_history (50)    ← dashboard-only
                                      report_templates (18)    ← dashboard-only
                                      portfolio_kpis (6)       ← dashboard-only
                                      score_distribution (5)   ← dashboard-only
                                      risk_drivers (5)         ← dashboard-only
```

As the API grows to support more dashboard features, tables will migrate from `dashboard-seed.sql` into `api-seed.sql`.

---

## Business Diversity (55 businesses)

| Industry | Count | Risk Distribution |
|----------|-------|-------------------|
| Technology / SaaS | 6 | 5 low, 1 medium |
| Healthcare / Medical | 5 | 4 low, 1 medium |
| Construction / Solar | 6 | 4 low, 2 medium |
| Transportation / Logistics | 5 | 1 low, 3 medium, 1 high |
| Manufacturing | 3 | 3 low |
| Food & Beverage / Restaurant | 5 | 1 low, 3 medium, 1 high |
| Agriculture | 3 | 1 medium, 1 high, 1 medium |
| Financial / Insurance | 3 | 3 low |
| Retail / Services | 4 | 1 low, 2 medium, 1 high |
| Energy / Utilities | 2 | 2 low |
| Other (staffing, film, marine, etc.) | 13 | 8 low, 3 medium, 2 high |
| **Total** | **55** | **33 low, 16 medium, 6 high** |

### Segment Distribution
- **Micro** (< $500K revenue): 12 businesses
- **Small** ($500K – $5M): 22 businesses
- **Mid-market** ($5M+): 21 businesses

### Geographic Coverage
- **Northeast**: 9 businesses (NY, MA, CT, NJ, NH, RI)
- **Southeast**: 11 businesses (GA, FL, SC, NC, AL, VA)
- **Midwest**: 10 businesses (IL, MI, OH, WI, MN, IN, IA)
- **Southwest**: 9 businesses (TX, OK, NM, AZ)
- **West**: 16 businesses (CA, WA, OR, NV, CO, DC)
