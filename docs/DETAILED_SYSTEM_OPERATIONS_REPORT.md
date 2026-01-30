# LumiqAI Dashboard - Detailed System Operations Report

**Version:** 1.0  
**Generated:** January 28, 2026  
**Classification:** Technical Architecture Document

---

## Executive Summary

This report provides a comprehensive guide on how all components of the LumiqAI dashboard work together—from the frontend React application through the BFF (Backend-for-Frontend) layer to the Supabase database, and what infrastructure is needed to make everything production-live.

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Data Flow Diagrams](#2-data-flow-diagrams)
3. [API Layer - How It Works](#3-api-layer---how-it-works)
4. [Database Schema & Relationships](#4-database-schema--relationships)
5. [Authentication & Authorization Flow](#5-authentication--authorization-flow)
6. [Tenant & Portfolio Isolation](#6-tenant--portfolio-isolation)
7. [Audit & Compliance System](#7-audit--compliance-system)
8. [Current vs Required Endpoints](#8-current-vs-required-endpoints)
9. [External Integrations](#9-external-integrations)
10. [Background Jobs & Async Processing](#10-background-jobs--async-processing)
11. [SDK Integration Guide](#11-sdk-integration-guide)
12. [Infrastructure Checklist](#12-infrastructure-checklist)

---

## 1. System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           BROWSER (React App)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ Dashboard   │  │ Customer    │  │ Risk        │  │ Partner     │    │
│  │ Pages       │  │ Management  │  │ Analytics   │  │ Portal      │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                │                │                │           │
│         └────────────────┴────────────────┴────────────────┘           │
│                                   │                                     │
│                    ┌──────────────┴──────────────┐                     │
│                    │      BFF Service Layer      │                     │
│                    │   (src/services/bff/*)      │                     │
│                    └──────────────┬──────────────┘                     │
└────────────────────────────────────┼────────────────────────────────────┘
                                     │ HTTPS + JWT
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       SUPABASE EDGE FUNCTIONS (BFF)                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │/customers  │ │/scores     │ │/risk       │ │/api-keys   │          │
│  ├────────────┤ ├────────────┤ ├────────────┤ ├────────────┤          │
│  │/offers     │ │/applications│ │/reports   │ │/audit-events│          │
│  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘          │
│        │              │              │              │                  │
│        └──────────────┴──────────────┴──────────────┘                  │
│                              │                                          │
│               ┌──────────────┴──────────────┐                          │
│               │    Shared Middleware         │                          │
│               │  • JWT Validation            │                          │
│               │  • Tenant Resolution         │                          │
│               │  • Portfolio Access Check    │                          │
│               │  • Audit Event Writing       │                          │
│               └──────────────┬──────────────┘                          │
└────────────────────────────────┼────────────────────────────────────────┘
                                 │ Service Role Key
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SUPABASE POSTGRESQL                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    ROW LEVEL SECURITY (RLS)                      │   │
│  │  • has_tenant_access(user_id, tenant_id)                        │   │
│  │  • has_portfolio_access(user_id, portfolio_id)                  │   │
│  │  • has_role(user_id, tenant_id, role)                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │ Identity     │ │ Credit       │ │ Workflow     │ │ Compliance   │  │
│  │ • tenants    │ │ • smb_entities│ │ • offers    │ │ • audit_events│  │
│  │ • profiles   │ │ • credit_scores│ │ • applications│ │ • data_lineage│  │
│  │ • user_roles │ │ • score_history│ │ • report_jobs│ │ • ai_insights│  │
│  │ • portfolios │ │ • business_owners│            │ │              │  │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| **React Frontend** | User interface, state management, routing | React 19 + Vite + Tailwind |
| **BFF Service Layer** | HTTP client, auth token injection, error handling | TypeScript fetch wrapper |
| **Edge Functions** | Request validation, auth, tenant isolation, audit | Deno (Supabase Edge) |
| **PostgreSQL + RLS** | Data storage, row-level security, constraints | Supabase Postgres |

---

## 2. Data Flow Diagrams

### 2.1 Customer List Flow

```
┌──────────┐  1. User clicks    ┌──────────────┐
│ Customer │────"Customers"────▶│ CustomerBff  │
│   Tab    │    tab             │  Component   │
└──────────┘                    └──────┬───────┘
                                       │
                     2. useBffQuery('/customers')
                        + portfolioId from context
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────┐
│                    BFF Client (client.ts)                     │
│  • Get JWT from supabase.auth.getSession()                   │
│  • Build URL: /functions/v1/customers?portfolioId=xxx        │
│  • Add Authorization: Bearer <jwt>                            │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTPS POST
                       ▼
┌──────────────────────────────────────────────────────────────┐
│              Edge Function: /customers                        │
│                                                               │
│  1. handleCors(req) → CORS headers                           │
│  2. authenticateRequest(req) → {userId, tenantId, roles}     │
│  3. Validate portfolioId present (422 if missing)            │
│  4. hasPortfolioAccess(auth, portfolioId) (403 if denied)    │
│  5. Query: SELECT * FROM smb_entities WHERE                  │
│            tenant_id = auth.tenantId AND                     │
│            portfolio_id = portfolioId                        │
│  6. Join latest credit_scores for each entity                │
│  7. Return successResponse({data, meta: {pagination}})       │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                    Supabase PostgreSQL                        │
│                                                               │
│  RLS Policy Applied:                                         │
│  "Users can view SMBs in accessible portfolios"              │
│  USING (                                                      │
│    has_tenant_access(auth.uid(), tenant_id) AND              │
│    has_portfolio_access(auth.uid(), portfolio_id)            │
│  )                                                            │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Credit Score Pull Flow

```
┌─────────────┐  1. Click "Pull  ┌─────────────────┐
│ Customer    │────Score" btn───▶│ Score Pull      │
│ Dossier     │                  │ Handler         │
└─────────────┘                  └────────┬────────┘
                                          │
           2. POST /scores/pull {smbEntityId, bureaus}
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────┐
│              Edge Function: /scores/pull                      │
│                                                               │
│  1. Authenticate request                                     │
│  2. Verify smb_entity exists and user has portfolio access   │
│  3. Write SOFT_PULL_REQUESTED audit event                    │
│  4. Call bureau API (currently mock)                         │
│  5. Store scores in credit_scores table (service role)       │
│  6. Store score_history record                               │
│  7. Write data_lineage record                                │
│  8. Return new scores with lineage metadata                  │
└──────────────────────┬───────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
  ┌──────────┐  ┌──────────────┐  ┌─────────────┐
  │credit_   │  │score_history │  │data_lineage │
  │scores    │  │              │  │             │
  └──────────┘  └──────────────┘  └─────────────┘
  
        │
        ▼ (Future: Replace mock with real bureau API)
  ┌─────────────────────────────────────┐
  │  EXTERNAL BUREAUS                   │
  │  • Experian Business                │
  │  • Dun & Bradstreet                 │
  │  • Equifax Business                 │
  │  • FICO SBSS                        │
  └─────────────────────────────────────┘
```

### 2.3 Report Generation Flow (Async)

```
┌─────────────┐  1. Request     ┌─────────────────┐
│ Reports     │────report───────▶│ reportsService. │
│ Page        │                  │ create()        │
└─────────────┘                  └────────┬────────┘
                                          │
              2. POST /reports {reportType, parameters}
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────┐
│              Edge Function: /reports                          │
│                                                               │
│  1. Authenticate, check portfolio access                     │
│  2. Insert report_jobs record with status='pending'          │
│  3. Write REPORT_GENERATED audit event                       │
│  4. Return jobId immediately                                 │
└──────────────────────────────────────────────────────────────┘
              │
              │  3. Frontend polls with useReportPolling hook
              ▼
┌──────────────────────────────────────────────────────────────┐
│              Background Process (Future: n8n/pg_cron)         │
│                                                               │
│  1. Pick up pending jobs from report_jobs                    │
│  2. Generate report (PDF/CSV)                                │
│  3. Upload to storage bucket                                 │
│  4. Update report_jobs: status='ready', artifact_url=...    │
└──────────────────────────────────────────────────────────────┘
              │
              │  4. Poll detects status='ready'
              ▼
┌─────────────┐
│ Download    │
│ Link Ready  │
└─────────────┘
```

---

## 3. API Layer - How It Works

### 3.1 BFF Client Architecture

The frontend uses a centralized BFF client (`src/services/bff/client.ts`):

```typescript
// How the BFF client works:

// 1. Get JWT from current Supabase session
const token = await supabase.auth.getSession();

// 2. Build request with mandatory portfolioId
const url = `${SUPABASE_URL}/functions/v1/customers?portfolioId=${portfolioId}`;

// 3. Add auth header
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

// 4. Make request
const response = await fetch(url, { headers });

// 5. Handle standardized response envelope
const { data, meta, error } = await response.json();
```

### 3.2 Edge Function Template

Every Edge Function follows this pattern:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { authenticateRequest, createAuthenticatedClient, createServiceClient } from '../_shared/auth.ts';
import { successResponse, errorResponse } from '../_shared/response.ts';
import { writeAuditEvent } from '../_shared/audit.ts';

serve(async (req) => {
  // 1. CORS handling
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // 2. Authentication
    const authResult = await authenticateRequest(req);
    if ('error' in authResult) {
      return errorResponse(authResult.code, authResult.error, authResult.status);
    }
    const auth = authResult;

    // 3. Create Supabase clients
    const supabase = createAuthenticatedClient(req);      // Uses user's JWT (RLS applied)
    const serviceClient = createServiceClient();           // Bypasses RLS for audit writes

    // 4. Validate portfolioId (mandatory for most endpoints)
    const portfolioId = url.searchParams.get('portfolioId');
    if (!portfolioId) {
      return validationErrorResponse('portfolioId is required');
    }

    // 5. Check portfolio access
    if (!hasPortfolioAccess(auth, portfolioId)) {
      return forbiddenResponse('No access to this portfolio');
    }

    // 6. Business logic with authenticated client
    const { data, error } = await supabase
      .from('table')
      .select('*')
      .eq('tenant_id', auth.tenantId)
      .eq('portfolio_id', portfolioId);

    // 7. Write audit events (uses service client to bypass RLS)
    await writeAuditEvent({
      tenantId: auth.tenantId,
      userId: auth.userId,
      action: 'ACTION_TYPE',
      resourceType: 'resource',
      resourceId: id,
      ...extractClientInfo(req)
    });

    // 8. Return standardized response
    return successResponse(data, {
      lastUpdated: new Date().toISOString(),
      pagination: { page, pageSize, totalCount }
    });

  } catch (err) {
    console.error('Endpoint error:', err);
    return errorResponse('INTERNAL_ERROR', 'Internal server error', 500);
  }
});
```

### 3.3 Response Envelope Standard

All API responses follow this structure:

```json
// Success Response
{
  "success": true,
  "data": { /* payload */ },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-01-28T10:30:00Z",
    "lastUpdated": "2026-01-28T10:00:00Z",
    "dataSources": [
      { "name": "Experian", "type": "bureau", "pulledAt": "...", "coveragePct": 95 }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 50,
      "totalCount": 1234,
      "totalPages": 25
    }
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "portfolioId is required",
    "details": { "field": "portfolioId" }
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-01-28T10:30:00Z"
  }
}
```

---

## 4. Database Schema & Relationships

### 4.1 Entity Relationship Diagram

```
                    ┌────────────────┐
                    │    tenants     │
                    │ (Bank Orgs)    │
                    └───────┬────────┘
                            │ 1:N
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │  profiles    │ │  portfolios  │ │  user_roles  │
    │  (Users)     │ │  (Loan Pools)│ │  (RBAC)      │
    └──────┬───────┘ └──────┬───────┘ └──────────────┘
           │                │
           │                │ 1:N
           │    ┌───────────┴───────────┐
           │    ▼                       ▼
           │ ┌──────────────┐    ┌──────────────┐
           │ │ portfolio_   │    │ smb_entities │
           │ │ access       │    │ (Customers)  │
           │ └──────────────┘    └──────┬───────┘
           │                            │
           └────────────────────────────┤
                                        │ 1:N
    ┌───────────────────┬───────────────┼───────────────┬───────────────┐
    ▼                   ▼               ▼               ▼               ▼
┌──────────┐    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐
│business_ │    │credit_scores │ │prequal_offers│ │applications  │ │ai_insights│
│owners    │    │              │ │              │ │              │ │          │
└──────────┘    └──────┬───────┘ └──────────────┘ └──────────────┘ └──────────┘
                       │
                       │ 1:N
                       ▼
                ┌──────────────┐
                │score_history │
                └──────────────┘
```

### 4.2 Table Categories

#### Identity & Access (5 tables)
| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `tenants` | Bank/Lender organizations | Root entity |
| `profiles` | User accounts (linked to auth.users) | → tenants |
| `user_roles` | RBAC role assignments | → profiles, tenants |
| `portfolios` | Loan portfolio segmentation | → tenants |
| `portfolio_access` | User-to-portfolio permissions | → profiles, portfolios |

#### SMB & Credit (4 tables)
| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `smb_entities` | Business customer records | → tenants, portfolios |
| `business_owners` | Owners/guarantors | → smb_entities |
| `credit_scores` | Bureau score records | → smb_entities, tenants |
| `score_history` | Score changes over time | → credit_scores |

#### Workflow (4 tables)
| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `prequal_offers` | Pre-qualification offers | → smb_entities, portfolios |
| `applications` | Loan applications | → smb_entities, offers |
| `report_jobs` | Async report generation | → portfolios |
| `underwriting_rulesets` | Decision rules | → tenants, portfolios |

#### Risk & Monitoring (3 tables)
| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `ews_queue` | Early Warning System alerts | → smb_entities, portfolios |
| `risk_aggregates` | Pre-computed risk metrics | → portfolios |
| `webhook_configs` | Event delivery endpoints | → tenants |

#### Integration (2 tables)
| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `api_keys` | Tenant API credentials | → tenants |
| `api_usage_logs` | API call tracking | → api_keys, tenants |

#### Compliance (3 tables)
| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `audit_events` | Compliance audit trail | → tenants |
| `data_lineage` | Data source tracking | → tenants |
| `ai_insights` | AI-generated explanations | → smb_entities |

---

## 5. Authentication & Authorization Flow

### 5.1 Login Flow

```
┌─────────────┐  1. Email/Password  ┌─────────────────┐
│  Login      │────────────────────▶│  Supabase Auth  │
│  Page       │                     │  (auth.users)   │
└─────────────┘                     └────────┬────────┘
                                             │
                        2. JWT Token Issued  │
                        (contains: sub, email, role)
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │  AuthContext    │
                                    │  (React)        │
                                    └────────┬────────┘
                                             │
                   3. Lookup user profile    │
                   (get tenant_id, full_name)│
                                             ▼
                                    ┌─────────────────┐
                                    │  profiles       │
                                    │  table          │
                                    └────────┬────────┘
                                             │
                   4. Load user roles        │
                                             ▼
                                    ┌─────────────────┐
                                    │  user_roles     │
                                    │  table          │
                                    └────────┬────────┘
                                             │
                   5. Load accessible portfolios
                                             ▼
                                    ┌─────────────────┐
                                    │  portfolio_     │
                                    │  access table   │
                                    └────────┬────────┘
                                             │
                   6. User Session Ready     │
                                             ▼
                                    ┌─────────────────┐
                                    │  Dashboard      │
                                    │  (Redirect)     │
                                    └─────────────────┘
```

### 5.2 JWT Claims Structure

```json
{
  "sub": "user-uuid-here",              // User ID
  "email": "user@bank.com",             // User email
  "role": "authenticated",              // Supabase role
  "aud": "authenticated",
  "exp": 1738000000,                    // Expiration
  "iat": 1737996400                     // Issued at
}
```

**Note**: `tenant_id` is NOT in the JWT. It's resolved by BFF from `profiles` table.

### 5.3 Authorization Checks in BFF

```typescript
// 1. Extract auth from JWT
const authResult = await authenticateRequest(req);
// Returns: { userId, tenantId, roles, portfolioScopes }

// 2. Check portfolio access
if (!hasPortfolioAccess(auth, portfolioId)) {
  return forbiddenResponse('NO_PORTFOLIO_ACCESS');
}

// 3. Check role requirements
if (!auth.roles.includes('risk_analyst') && !auth.roles.includes('admin')) {
  return forbiddenResponse('INSUFFICIENT_ROLE');
}
```

### 5.4 RBAC Role Permissions

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| `super_admin` | Everything, cross-tenant | - |
| `admin` | Manage users, keys, settings | Cross-tenant access |
| `developer` | API access, create keys | Manage users |
| `risk_analyst` | Approve/decline apps, acknowledge EWS | Create API keys |
| `relationship_manager` | View customers, trigger reports | Risk decisions |
| `readonly` | View-only access | Any write operations |

---

## 6. Tenant & Portfolio Isolation

### 6.1 Two-Layer Isolation Model

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TENANT LAYER                                 │
│   (Bank A sees only Bank A's data)                                  │
│                                                                      │
│   Enforced by:                                                       │
│   • tenant_id column on all data tables                             │
│   • has_tenant_access(auth.uid(), tenant_id) RLS function           │
│   • BFF resolves tenant_id from user's profile                      │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        PORTFOLIO LAYER                               │
│   (User in Bank A sees only assigned portfolios)                    │
│                                                                      │
│   Enforced by:                                                       │
│   • portfolio_id column on data tables                              │
│   • has_portfolio_access(auth.uid(), portfolio_id) RLS function     │
│   • BFF requires portfolioId parameter on most endpoints            │
│   • 422 error if portfolioId missing                                │
│   • 403 error if user lacks portfolio access                        │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 RLS Policy Examples

```sql
-- SMB Entities: Must have both tenant AND portfolio access
CREATE POLICY "Users can view SMBs in accessible portfolios" 
ON public.smb_entities
FOR SELECT USING (
  has_tenant_access(auth.uid(), tenant_id) 
  AND has_portfolio_access(auth.uid(), portfolio_id)
);

-- Credit Scores: Tenant access only (service role writes)
CREATE POLICY "Users can view scores in their tenant" 
ON public.credit_scores
FOR SELECT USING (
  has_tenant_access(auth.uid(), tenant_id)
);

-- Audit Events: Read-only for users (service role writes)
CREATE POLICY "Users can view tenant audit events" 
ON public.audit_events
FOR SELECT USING (
  has_tenant_access(auth.uid(), tenant_id)
);
```

### 6.3 Error Handling for Isolation Violations

| Scenario | Error Code | HTTP Status | User Message |
|----------|------------|-------------|--------------|
| No portfolioId provided | `VALIDATION_ERROR` | 422 | "Please select a portfolio" |
| User lacks portfolio access | `NO_PORTFOLIO_ACCESS` | 403 | "You don't have access to this portfolio" |
| User lacks tenant access | `FORBIDDEN` | 403 | "Access denied" |
| Resource not found | `NOT_FOUND` | 404 | "Resource not found" |

---

## 7. Audit & Compliance System

### 7.1 Dual-Layer Auditing

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SERVER-SIDE AUDITING                             │
│   (Edge Functions - cannot be bypassed)                             │
│                                                                      │
│   Triggered automatically for:                                       │
│   • VIEW_PII (opening customer dossier)                             │
│   • SOFT_PULL_REQUESTED (credit bureau request)                     │
│   • PREQUAL_GENERATED (offer generation)                            │
│   • APPLICATION_SUBMITTED (loan application)                        │
│   • REPORT_GENERATED (async report request)                         │
│   • REPORT_DOWNLOADED (artifact download)                           │
│   • API_KEY_CREATED / API_KEY_REVOKED                               │
│   • SETTINGS_CHANGED                                                │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     CLIENT-SIDE AUDITING                             │
│   (useAuditEmit hook - UI context events)                           │
│                                                                      │
│   Supplements server auditing with UI context:                       │
│   • SCORE_VIEWED (user viewed score details)                        │
│   • DOSSIER_OPENED (user opened customer panel)                     │
│   • FILTER_APPLIED (user changed filter settings)                   │
│   • EXPORT_INITIATED (user started data export)                     │
│   • BULK_ACTION_EXECUTED (user performed bulk operation)            │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Audit Event Structure

```typescript
interface AuditEvent {
  id: string;
  tenant_id: string;
  user_id: string;
  action: AuditAction;          // Enum: VIEW_PII, SOFT_PULL_REQUESTED, etc.
  resource_type: string;        // 'smb_entity', 'credit_score', 'application'
  resource_id: string | null;   // UUID of affected resource
  details: {
    // Context-specific data
    businessName?: string;
    bureaus?: string[];
    count?: number;
  };
  ip_address: string;
  user_agent: string;
  session_id: string | null;
  created_at: string;
}
```

### 7.3 Data Lineage Tracking

```typescript
interface DataLineage {
  id: string;
  tenant_id: string;
  resource_type: string;        // 'credit_score', 'smb_entity'
  resource_id: string;
  source_name: string;          // 'Experian', 'D&B', 'User Upload'
  source_type: string;          // 'bureau', 'api', 'manual'
  pulled_at: string;
  coverage_pct: number;         // 0-100 data completeness
  freshness_hours: number;      // Hours since data was pulled
  consent_reference: string;    // Consent tracking ID
}
```

---

## 8. Current vs Required Endpoints

### 8.1 Currently Implemented (✅ Live)

| Domain | Endpoints | Status |
|--------|-----------|--------|
| **Customers** | GET /customers, GET /customers/:id, POST /customers | ✅ Live |
| **Scores** | GET /scores, GET /scores/:id, POST /scores/pull | ✅ Live (mock bureau) |
| **Offers** | GET /offers, POST /offers/generate, PATCH /offers/:id | ✅ Live |
| **Applications** | GET /applications, POST /applications, PATCH /applications/:id | ✅ Live |
| **Reports** | GET /reports, GET /reports/:id, POST /reports | ✅ Live |
| **Risk** | GET /risk/summary, GET /risk/ews, GET /risk/aggregates | ✅ Live |
| **API Keys** | GET /api-keys, POST /api-keys, DELETE /api-keys/:id | ✅ Live |
| **Audit** | GET /audit-events, POST /audit-events | ✅ Live |
| **Health** | GET /health | ✅ Live |

### 8.2 Required for Partner Portal (🔲 TODO)

| Endpoint | Purpose | Priority |
|----------|---------|----------|
| GET /partner/credentials | List all credentials | High |
| POST /partner/credentials | Create credential | High |
| POST /partner/credentials/:id/rotate | Rotate credential | High |
| GET /partner/webhooks | List webhooks | High |
| POST /partner/webhooks | Create webhook | High |
| POST /partner/webhooks/:id/test | Test webhook delivery | Medium |
| GET /partner/webhooks/:id/deliveries | Delivery history | Medium |
| GET /partner/usage/summary | Usage analytics | High |
| GET /partner/usage/endpoints | Per-endpoint breakdown | Medium |
| GET /partner/compliance | Compliance status | Medium |

### 8.3 Required for Settings Panels (🔲 TODO)

| Endpoint | Purpose | Panel |
|----------|---------|-------|
| GET/PATCH /settings/sso | SSO configuration | SSO Panel |
| GET/POST/DELETE /settings/oauth-clients | OAuth clients | OAuth Panel |
| GET/POST/DELETE /settings/ip-allowlist | IP whitelist | IP Allowlist Panel |
| GET/PATCH /settings/retention | Data retention | Retention Panel |
| GET/PATCH /settings/pii-masking | PII masking rules | PII Masking Panel |
| GET/PATCH /settings/alert-thresholds | Alert thresholds | Alert Thresholds Panel |
| GET /settings/model-versions | Model versions | Model Versions Panel |

### 8.4 Required for Analytics (🔲 TODO)

| Endpoint | Purpose | Component |
|----------|---------|-----------|
| GET /analytics/portfolio-kpis | KPI tiles | PortfolioKPITiles |
| GET /analytics/score-distribution | Distribution chart | ScoreDistributionChart |
| GET /analytics/score-migration | Migration matrix | ScoreMigrationMatrix |
| GET /analytics/application-funnel | Funnel metrics | ApplicationFunnelChart |
| GET /analytics/feature-importance | Feature importance | FeatureImportanceChart |
| GET /analytics/signal-drift | Signal drift | SignalDriftMonitor |

---

## 9. External Integrations

### 9.1 Credit Bureau Integration Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ POST /scores/   │────▶│  Bureau         │────▶│  CREDIT BUREAU  │
│ pull            │     │  Adapter        │     │  API            │
└─────────────────┘     │  Service        │     │                 │
                        │                 │     │  • Experian     │
                        │  • Request      │     │  • D&B          │
                        │    formatting   │     │  • Equifax      │
                        │  • Response     │     │  • FICO         │
                        │    parsing      │     │                 │
                        │  • Error        │     │                 │
                        │    handling     │     │                 │
                        └─────────────────┘     └─────────────────┘
```

**Current State**: Mock bureau responses  
**Production Need**: Real bureau API integrations

### 9.2 Required Credentials for Production

| Service | Credential Type | Where Stored |
|---------|----------------|--------------|
| Experian Business | API Key + Client ID | Supabase Secrets |
| D&B | API Token | Supabase Secrets |
| Equifax Business | OAuth Client | Supabase Secrets |
| FICO SBSS | API Key | Supabase Secrets |

### 9.3 Data Aggregator Integration (Future)

| Service | Purpose | Use Case |
|---------|---------|----------|
| **Plaid** | Bank account verification | Cash flow analysis |
| **Finicity** | Financial data aggregation | Income verification |
| **MX** | Open banking connections | Account linking |

### 9.4 Accounting Integration (Future)

| Service | Purpose | Use Case |
|---------|---------|----------|
| **QuickBooks** | Financial statements | Revenue verification |
| **Xero** | Accounting data | Balance sheet access |
| **Sage** | Enterprise accounting | Large business data |

---

## 10. Background Jobs & Async Processing

### 10.1 Required Background Jobs

| Job Name | Schedule | Purpose | Implementation |
|----------|----------|---------|----------------|
| `score-refresh` | Daily @ 2am | Refresh stale credit scores | pg_cron + Edge Function |
| `ews-evaluation` | Every hour | Evaluate EWS trigger conditions | pg_cron + Edge Function |
| `report-generator` | On-demand | Process async report jobs | Queue-based worker |
| `webhook-retry` | Every 5 min | Retry failed webhook deliveries | pg_cron + Edge Function |
| `data-retention` | Daily @ 3am | Apply data retention policies | pg_cron + Edge Function |
| `aggregate-metrics` | Every hour | Update risk_aggregates table | pg_cron + Edge Function |

### 10.2 Report Generation Queue

```
┌─────────────────┐  1. POST /reports  ┌─────────────────┐
│ User Request    │──────────────────▶│ report_jobs     │
│ (Sync)          │                    │ status='pending'│
└─────────────────┘                    └────────┬────────┘
                                                │
                            2. Background picks up
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │ report_jobs     │
                                       │ status='processing'
                                       └────────┬────────┘
                                                │
                            3. Generate PDF/CSV │
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │ Storage Bucket  │
                                       │ 'reports'       │
                                       └────────┬────────┘
                                                │
                            4. Update job       │
                                                ▼
                                       ┌─────────────────┐
                                       │ report_jobs     │
                                       │ status='ready'  │
                                       │ artifact_url=...│
                                       └─────────────────┘
```

### 10.3 Webhook Delivery System

```
┌─────────────────┐  1. Event occurs   ┌─────────────────┐
│ System Event    │──────────────────▶│ webhook_configs │
│ (score.created) │                    │ (find matching) │
└─────────────────┘                    └────────┬────────┘
                                                │
                            2. Queue delivery   │
                                                ▼
                                       ┌─────────────────┐
                                       │ webhook_deliveries
                                       │ status='pending'│
                                       └────────┬────────┘
                                                │
                            3. POST to webhook URL
                                                │
                                   ┌────────────┴────────────┐
                                   ▼                         ▼
                          ┌──────────────┐          ┌──────────────┐
                          │ 200 OK       │          │ Error/Timeout│
                          │ status='delivered'     │ retry_at=...  │
                          └──────────────┘          │ attempts++   │
                                                    └──────────────┘
```

---

## 11. SDK Integration Guide

### 11.1 SDK Structure

Your SDK should wrap BFF endpoints:

```typescript
// lumiq-sdk.ts

class LumiqSDK {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: { apiKey: string; environment: 'sandbox' | 'production' }) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.environment === 'production' 
      ? 'https://api.lumiq.ai/v1'
      : 'https://sandbox.lumiq.ai/v1';
  }

  // Customers
  customers = {
    list: (portfolioId: string, options?: ListOptions) => 
      this.get(`/customers?portfolioId=${portfolioId}`, options),
    
    get: (customerId: string) => 
      this.get(`/customers/${customerId}`),
    
    create: (portfolioId: string, data: CustomerData) =>
      this.post('/customers', { portfolioId, ...data })
  };

  // Scores
  scores = {
    list: (portfolioId: string, options?: { smbEntityId?: string }) =>
      this.get(`/scores?portfolioId=${portfolioId}`, options),
    
    pull: (smbEntityId: string, bureaus: string[]) =>
      this.post('/scores/pull', { smbEntityId, bureaus }),
    
    get: (scoreId: string) =>
      this.get(`/scores/${scoreId}`)
  };

  // Offers
  offers = {
    list: (portfolioId: string) =>
      this.get(`/offers?portfolioId=${portfolioId}`),
    
    generate: (smbEntityId: string, portfolioId: string) =>
      this.post('/offers/generate', { smbEntityId, portfolioId }),
    
    accept: (offerId: string) =>
      this.patch(`/offers/${offerId}`, { status: 'accepted' })
  };

  // Applications
  applications = {
    list: (portfolioId: string) =>
      this.get(`/applications?portfolioId=${portfolioId}`),
    
    submit: (smbEntityId: string, offerId: string) =>
      this.post('/applications', { smbEntityId, offerId }),
    
    updateStatus: (appId: string, status: string, notes?: string) =>
      this.patch(`/applications/${appId}`, { status, notes })
  };

  // Risk
  risk = {
    getSummary: (portfolioId: string) =>
      this.get(`/risk/summary?portfolioId=${portfolioId}`),
    
    getEWSQueue: (portfolioId: string) =>
      this.get(`/risk/ews?portfolioId=${portfolioId}`),
    
    acknowledgeAlert: (alertId: string) =>
      this.post(`/risk/ews/${alertId}/acknowledge`)
  };

  // Reports
  reports = {
    create: (portfolioId: string, reportType: string, params?: object) =>
      this.post('/reports', { portfolioId, reportType, parameters: params }),
    
    getStatus: (reportId: string) =>
      this.get(`/reports/${reportId}`),
    
    download: (reportId: string) =>
      this.getBlob(`/reports/${reportId}/download`)
  };
}
```

### 11.2 SDK Authentication

```typescript
// Authentication with SDK

// 1. Initialize with API key
const lumiq = new LumiqSDK({
  apiKey: 'lq_prod_xxx...',
  environment: 'production'
});

// 2. All requests automatically include:
// - Authorization: Bearer lq_prod_xxx...
// - Content-Type: application/json

// 3. Responses are standardized:
const { data, meta, error } = await lumiq.customers.list('portfolio-id');

if (error) {
  console.error(`Error ${error.code}: ${error.message}`);
} else {
  console.log(`Found ${meta.pagination.totalCount} customers`);
  data.forEach(customer => console.log(customer.businessName));
}
```

### 11.3 Webhook Event Types

Your SDK should handle these webhook events:

| Event | Payload | When Triggered |
|-------|---------|----------------|
| `score.created` | Score object | New score pulled |
| `score.changed` | Score with delta | Score updated |
| `offer.generated` | Offer object | Prequal offer created |
| `offer.accepted` | Offer with application | Offer converted |
| `application.submitted` | Application object | New application |
| `application.decided` | Application with decision | Status changed |
| `ews.alert` | Alert object | EWS threshold breached |
| `report.ready` | Report with download URL | Report generation complete |

---

## 12. Infrastructure Checklist

### 12.1 Database Tables Needed

| Table | Purpose | Status |
|-------|---------|--------|
| `webhooks` | Webhook endpoint configuration | 🔲 TODO |
| `webhook_deliveries` | Delivery history/retry queue | 🔲 TODO |
| `oauth_clients` | OAuth 2.0 client credentials | 🔲 TODO |
| `ip_allowlist` | IP whitelisting for API access | 🔲 TODO |
| `sso_config` | SSO/SAML configuration per tenant | 🔲 TODO |
| `alert_thresholds` | Configurable alert thresholds | 🔲 TODO |
| `compliance_status` | Compliance tracking (SOC2, FFIEC) | 🔲 TODO |

### 12.2 Storage Buckets Needed

| Bucket | Purpose | Access |
|--------|---------|--------|
| `reports` | Generated PDF/CSV reports | Tenant-scoped |
| `documents` | Uploaded business documents | Entity-scoped |
| `bureau-responses` | Raw bureau response cache | Tenant-scoped |

### 12.3 Secrets to Configure

| Secret | Purpose | Source |
|--------|---------|--------|
| `EXPERIAN_API_KEY` | Experian bureau access | Experian developer portal |
| `DNB_API_TOKEN` | D&B bureau access | D&B developer portal |
| `EQUIFAX_CLIENT_ID` | Equifax OAuth | Equifax developer portal |
| `EQUIFAX_CLIENT_SECRET` | Equifax OAuth | Equifax developer portal |
| `FICO_API_KEY` | FICO SBSS access | FICO developer portal |

### 12.4 pg_cron Jobs to Create

```sql
-- Score refresh job (daily at 2am)
SELECT cron.schedule('score-refresh', '0 2 * * *', $$
  SELECT net.http_post(
    url := 'https://pypvgvfkfxqybnydkegs.supabase.co/functions/v1/score-refresh',
    headers := '{"Authorization": "Bearer <service_key>"}'::jsonb
  );
$$);

-- EWS evaluation (every hour)
SELECT cron.schedule('ews-evaluation', '0 * * * *', $$
  SELECT net.http_post(
    url := 'https://pypvgvfkfxqybnydkegs.supabase.co/functions/v1/ews-evaluate',
    headers := '{"Authorization": "Bearer <service_key>"}'::jsonb
  );
$$);

-- Webhook retry (every 5 minutes)
SELECT cron.schedule('webhook-retry', '*/5 * * * *', $$
  SELECT net.http_post(
    url := 'https://pypvgvfkfxqybnydkegs.supabase.co/functions/v1/webhook-retry',
    headers := '{"Authorization": "Bearer <service_key>"}'::jsonb
  );
$$);
```

### 12.5 Implementation Priority

#### Phase 1: Core Infrastructure (Week 1-2)
- [ ] Create missing database tables (webhooks, oauth_clients, etc.)
- [ ] Wire Partner Portal to existing /api-keys endpoint
- [ ] Implement webhook management endpoints
- [ ] Wire Settings panels to database

#### Phase 2: Analytics & Monitoring (Week 2-3)
- [ ] Create analytics aggregate endpoints
- [ ] Implement usage tracking for API keys
- [ ] Add real-time usage monitoring
- [ ] Create dashboard metrics endpoints

#### Phase 3: External Integrations (Week 3-4)
- [ ] Integrate first bureau (Experian recommended)
- [ ] Replace mock score pull with real API
- [ ] Add consent management
- [ ] Implement data lineage for bureau data

#### Phase 4: Compliance & Operations (Week 4+)
- [ ] Add compliance tracking
- [ ] Implement SLA monitoring
- [ ] Create background job system
- [ ] Add support ticket integration

---

## Summary

This system is architected for **bank-grade security and compliance**:

1. **Never bypass the BFF** - All data flows through Edge Functions
2. **Always require portfolioId** - Mandatory tenant + portfolio isolation
3. **Audit everything** - Server-side audit events for all sensitive actions
4. **RLS is defense-in-depth** - Even if BFF fails, database enforces access
5. **Standardized responses** - Every response includes lineage and metadata

The dashboard UI is complete and production-ready. The remaining work is:
- Creating ~20 new API endpoints for Partner Portal and Settings
- Adding ~7 database tables for enterprise features
- Integrating real credit bureau APIs
- Setting up background job processing

---

*Document generated: January 28, 2026*
