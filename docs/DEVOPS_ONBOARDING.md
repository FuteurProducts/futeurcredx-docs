# LumiqAI DevOps Onboarding Guide

> **Purpose**: Get your DevOps team productive in 30 minutes.

---

## 🏗️ Architecture at a Glance

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   React SPA     │────▶│  BFF Edge Functions  │────▶│    Supabase     │
│  (Lovable/Vite) │     │   (Deno Runtime)     │     │   (Postgres)    │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
        │                        │                          │
   src/services/bff/      supabase/functions/         RLS Policies
```

**Key Principle**: Frontend NEVER queries the database directly. All data flows through BFF Edge Functions.

---

## 📁 Repository Structure

### Frontend (`src/`)

| Path | Purpose |
|------|---------|
| `src/App.tsx` | Route definitions, auth wrapper |
| `src/contexts/AuthContext.tsx` | Session management (mock mode for dev) |
| `src/contexts/PortfolioContext.tsx` | Global portfolio selection state |
| `src/services/bff/` | **API client layer** - all backend calls |
| `src/services/bff/client.ts` | Base HTTP client with JWT injection |
| `src/services/bff/customers.ts` | Customer CRUD operations |
| `src/services/bff/scores.ts` | Credit score pulls and queries |
| `src/services/bff/risk.ts` | Risk monitoring and EWS alerts |
| `src/components/enterprise/` | Bank-grade dashboard modules |
| `src/hooks/useBffQuery.ts` | React hook for BFF data fetching |

### Backend (`supabase/`)

| Path | Purpose |
|------|---------|
| `supabase/functions/_shared/auth.ts` | JWT validation, tenant extraction, RBAC |
| `supabase/functions/_shared/response.ts` | Standard response envelope |
| `supabase/functions/_shared/cors.ts` | CORS headers |
| `supabase/functions/_shared/audit.ts` | Audit event logging |
| `supabase/functions/customers/` | Customer list/dossier endpoints |
| `supabase/functions/scores/` | Score pull/query endpoints |
| `supabase/functions/reports/` | Async report generation |
| `supabase/functions/health/` | Health check endpoint |
| `supabase/migrations/` | Database schema + RLS policies |

---

## 🔐 Security Model

### Tenant Isolation (Critical)

Every request is scoped by TWO mandatory identifiers:

1. **`tenant_id`** - Extracted from JWT claims (automatic)
2. **`portfolio_id`** - Passed as query parameter (required)

```typescript
// Example: GET /customers?portfolioId=abc-123
// The BFF validates:
// 1. User's JWT is valid
// 2. User belongs to the tenant that owns portfolio abc-123
// 3. User has portfolio-level access (via portfolio_access table)
```

### RLS Policy Pattern

All tables use this pattern:

```sql
-- Read policy
CREATE POLICY "tenant_isolation_select" ON public.smb_entities
FOR SELECT USING (
  public.has_tenant_access(auth.uid(), tenant_id) AND
  public.has_portfolio_access(auth.uid(), portfolio_id)
);
```

### Security Functions (in Postgres)

| Function | Purpose |
|----------|---------|
| `has_tenant_access(user_id, tenant_id)` | Checks user belongs to tenant |
| `has_portfolio_access(user_id, portfolio_id)` | Checks user can access portfolio |
| `has_role(user_id, tenant_id, role)` | Checks user has specific role |
| `get_user_tenant_id(user_id)` | Returns user's tenant |

---

## 🔄 Data Flow Example

### Frontend → BFF → Database

```typescript
// 1. Frontend (src/services/bff/customers.ts)
const customers = await customersService.list(portfolioId, { page: 1 });

// 2. BFF Client (src/services/bff/client.ts)
// - Gets JWT from Supabase session
// - Adds Authorization header
// - Appends portfolioId to query string
fetch(`${SUPABASE_URL}/functions/v1/customers?portfolioId=${portfolioId}`)

// 3. Edge Function (supabase/functions/customers/index.ts)
// - Validates JWT via authenticateRequest()
// - Extracts tenant_id from claims
// - Queries with RLS enforcement
const { data } = await supabase
  .from('smb_entities')
  .select('*')
  .eq('portfolio_id', portfolioId);  // RLS adds tenant check automatically

// 4. Response envelope
return { success: true, data, meta: { requestId, timestamp } }
```

---

## 🗄️ Database Schema Overview

### Core Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `tenants` | Bank/customer organizations | `id`, `name`, `settings` |
| `portfolios` | SMB loan portfolios | `id`, `tenant_id`, `name` |
| `profiles` | User profiles | `id`, `tenant_id`, `email` |
| `user_roles` | RBAC assignments | `user_id`, `tenant_id`, `role` |
| `portfolio_access` | Portfolio permissions | `user_id`, `portfolio_id` |
| `smb_entities` | SMB customers | `id`, `portfolio_id`, `ein`, `legal_name` |
| `credit_scores` | Score records | `id`, `smb_entity_id`, `score`, `source` |
| `applications` | Loan applications | `id`, `smb_entity_id`, `status`, `amount` |
| `audit_events` | Compliance log | `user_id`, `action`, `resource_type` |

### Role Hierarchy

```
super_admin (100) → admin (80) → developer (60) → risk_analyst (50) → rm (40) → readonly (10)
```

---

## 🚀 Local Development

### Prerequisites

```bash
# Install dependencies
bun install

# Start dev server
bun run dev
```

### Environment Variables (auto-provided by Lovable Cloud)

```env
VITE_SUPABASE_URL=https://pypvgvfkfxqybnydkegs.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
```

### Auth Bypass (Dev Mode)

In `src/App.tsx`, there's a dev bypass flag:

```typescript
const DEV_BYPASS_AUTH = true; // Set to false for production auth testing
```

---

## 🔍 Debugging Checklist

### "Data not loading"

1. Check browser console for errors
2. Check Network tab for 401/403/422 responses
3. Verify `portfolioId` is being passed
4. Check Edge Function logs in Lovable Cloud UI

### "Access denied"

1. Verify user has role in `user_roles` table
2. Verify portfolio access in `portfolio_access` table
3. Check RLS policies are not blocking

### "Edge function failing"

```bash
# View logs in Lovable Cloud UI (Cloud tab → Edge Functions → Logs)
# Or check the health endpoint:
curl https://pypvgvfkfxqybnydkegs.supabase.co/functions/v1/health
```

---

## 📋 Key Files to Review First

1. **Start here**: `docs/LUMIQAI_SYSTEM_OPERATOR_HANDBOOK.md` - Full system documentation
2. **Auth flow**: `supabase/functions/_shared/auth.ts`
3. **API contract**: `src/services/bff/client.ts`
4. **Database schema**: `supabase/migrations/` (look for CREATE TABLE and CREATE POLICY)
5. **Main dashboard**: `src/pages/Dashboard/Dashboard.tsx`

---

## 🛡️ Production Checklist

- [ ] `DEV_BYPASS_AUTH` set to `false` in `src/App.tsx`
- [ ] All tables have RLS enabled
- [ ] Audit logging active for PII access
- [ ] Session timeout configured (default: 30 min)
- [ ] Health endpoint returning 200

---

## 📞 Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | System health check |
| `/customers` | GET | List SMB entities |
| `/customers/:id` | GET | Customer dossier |
| `/scores` | GET | List credit scores |
| `/scores/pull` | POST | Request bureau pull |
| `/applications` | GET/POST | Application workflow |
| `/reports` | GET/POST | Async report jobs |
| `/risk/summary` | GET | Portfolio risk overview |
| `/audit-events` | GET/POST | Compliance logging |

All endpoints require:
- `Authorization: Bearer <jwt>`
- `?portfolioId=<uuid>` (except /health and /api-keys)
