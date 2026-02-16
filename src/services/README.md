# BFF Service Layer Guide

**LumiqAI Dashboard — Backend-for-Frontend (BFF) Service Architecture**

This guide covers the BFF service layer that handles all API communication between the Dashboard frontend and the NestJS backend. All services follow a standardized contract pattern with typed envelopes, portfolio scoping, and automatic auth injection.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Concepts](#core-concepts)
3. [Service Inventory](#service-inventory)
4. [Response Envelopes](#response-envelopes)
5. [How to Use Services](#how-to-use-services)
6. [How to Add a New Service](#how-to-add-a-new-service)
7. [Auth Integration](#auth-integration)
8. [Environment-Aware Routing](#environment-aware-routing)
9. [Error Handling](#error-handling)
10. [Demo Data Mode](#demo-data-mode)

---

## Architecture Overview

### BFF Pattern
The Dashboard uses a **Backend-for-Frontend (BFF)** pattern where:
- All API calls go through `bffClient` from `/src/services/bff/client.ts`
- Each domain (customers, scores, risk, etc.) has a dedicated service file
- All services return standardized response envelopes (`BffResponse`, `BffListResponse`, `BffError`)
- Auth tokens are injected automatically via `setAuthTokenGetter()` from `AuthContext`
- All requests require `portfolioId` for tenant isolation

### Key Files
| File | Purpose |
|------|---------|
| `client.ts` | Base HTTP client with auth, envelopes, and request/response handling |
| `types.ts` | All domain types (SmbEntity, CreditScore, Application, etc.) |
| `normalizers.ts` | Transforms API response shapes into Dashboard types |
| `index.ts` | Centralized exports for all services and types |
| `CLAUDE.md` | Agent scope rules for service layer modifications |

---

## Core Concepts

### 1. Portfolio Scoping
Every API request **requires** a `portfolioId` parameter. This enforces multi-tenancy at the API level.

```typescript
// ✅ Correct
const customers = await customersService.list(portfolioId, { search: 'Acme' });

// ❌ Wrong — missing portfolioId
const customers = await customersService.list({ search: 'Acme' });
```

### 2. Response Envelopes
All responses follow a standard envelope:

```typescript
// Single item
interface BffResponse<T> {
  data: T;
  meta: BffResponseMeta;
}

// List with pagination
interface BffListResponse<T> {
  data: T[];
  meta: BffResponseMeta;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

// Error
interface BffError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta: {
    requestId: string;
  };
}
```

### 3. Normalizers
The API may return data in different shapes (snake_case, camelCase, nested objects, enum variations). **Normalizers** in `normalizers.ts` transform these into consistent Dashboard types.

Example:
```typescript
// API returns: { smb_entity_id, risk_class, pulled_at }
// Normalizer outputs: { smbEntityId, riskClass, pulledAt }
```

### 4. Type Safety
All services and responses are **fully typed**. Domain types live in `types.ts` and are exported from `index.ts`.

---

## Service Inventory

### Existing Services (9)

| Service | File | Key Methods | Domain Types |
|---------|------|-------------|-------------|
| **customers** | `customers.ts` | `list`, `getDossier`, `getLifecycleDistribution`, `getHealthMetrics` | `SmbEntity`, `CustomerDossier`, `BusinessOwner` |
| **scores** | `scores.ts` | `list`, `getById`, `pull`, `getDistribution`, `getMultiBureauStatus` | `CreditScore`, `ScoreFactor`, `ScoreSource`, `ScorePullRequest` |
| **offers** | `offers.ts` | `list`, `generate`, `getById`, `updateStatus` | `PrequalOffer`, `OfferStatus`, `GenerateOfferRequest` |
| **applications** | `applications.ts` | `list`, `getById`, `submit`, `updateStatus`, `getPipeline` | `Application`, `ApplicationStatus`, `SubmitApplicationRequest` |
| **reports** | `reports.ts` | `list`, `create`, `getById`, `download` | `ReportJob`, `ReportType`, `ReportStatus`, `CreateReportRequest` |
| **risk** | `risk.ts` | `getSummary`, `getEWSQueue`, `acknowledgeAlert`, `getAggregates`, `getConcentration`, `getHeatmap`, `getFunnel` | `RiskSummary`, `EWSAlert`, `RiskDriver`, `RiskTrend`, `RiskAggregate` |
| **audit** | `audit.ts` | `list`, `emit` | `AuditEvent`, `AuditAction`, `CreateAuditEventRequest` |
| **apiKeys** | `apiKeys.ts` | `list`, `create`, `revoke`, `getUsage` | `ApiKey`, `ApiKeyUsage`, `CreateApiKeyRequest` |
| **batch** | `batch.ts` | `submit`, `getStatus`, `list`, `cancel` | `BatchJob` (defined in `batch.ts`) |

### Service Method Patterns

All services follow these conventions:

```typescript
export const myService = {
  // List with filters + pagination
  list: async (portfolioId: string, params?: ListParams): Promise<BffListResponse<MyEntity>> => { ... },

  // Get single item by ID
  getById: async (portfolioId: string, id: string): Promise<BffResponse<MyEntity>> => { ... },

  // Create/submit
  create: async (portfolioId: string, request: CreateRequest): Promise<BffResponse<MyEntity>> => { ... },

  // Update
  update: async (portfolioId: string, id: string, updates: UpdateRequest): Promise<BffResponse<MyEntity>> => { ... },

  // Delete/revoke
  delete: async (portfolioId: string, id: string): Promise<BffResponse<void>> => { ... },
};
```

---

## Response Envelopes

### BffResponse<T> — Single Item
Used for endpoints that return a single entity (e.g., `getById`, `create`, `update`).

```typescript
interface BffResponse<T> {
  data: T;
  meta: BffResponseMeta;
}

interface BffResponseMeta {
  requestId: string;
  portfolioId?: string;
  lastUpdated?: string;
  dataSources?: string[];
}
```

**Example:**
```typescript
const response: BffResponse<CreditScore> = await scoresService.getById(portfolioId, scoreId);
console.log(response.data.score); // 720
console.log(response.meta.requestId); // "req_abc123"
```

### BffListResponse<T> — Lists with Pagination
Used for endpoints that return multiple items (e.g., `list` methods).

```typescript
interface BffListResponse<T> {
  data: T[];
  meta: BffResponseMeta;
  pagination?: {
    total: number;       // Total count across all pages
    page: number;        // Current page number (1-indexed)
    pageSize: number;    // Items per page
    hasMore: boolean;    // True if more pages exist
  };
}
```

**Example:**
```typescript
const response: BffListResponse<SmbEntity> = await customersService.list(portfolioId, {
  page: 1,
  pageSize: 25,
  search: 'Acme',
});

console.log(response.data.length); // 25
console.log(response.pagination?.total); // 142
console.log(response.pagination?.hasMore); // true
```

### BffError — Error Response
All errors follow this shape. Thrown as exceptions from `bffClient`.

```typescript
interface BffError {
  error: {
    code: string;           // "UNAUTHORIZED", "NOT_FOUND", "VALIDATION_ERROR", etc.
    message: string;        // Human-readable error message
    details?: Record<string, unknown>; // Optional additional context
  };
  meta: {
    requestId: string;     // Trace ID for debugging
  };
}
```

**Example:**
```typescript
try {
  const score = await scoresService.getById(portfolioId, 'invalid-id');
} catch (error) {
  const bffError = error as BffError;
  console.error(bffError.error.code); // "NOT_FOUND"
  console.error(bffError.error.message); // "Score not found"
  console.error(bffError.meta.requestId); // "req_xyz789"
}
```

---

## How to Use Services

### Pattern 1: With `useBffQuery` (Recommended)
The `useBffQuery` hook (from `@/hooks/useBffQuery`) provides React Query integration with automatic error handling, loading states, and caching.

```typescript
import { useBffQuery } from '@/hooks/useBffQuery';
import { customersService } from '@/services/bff';

function CustomerList() {
  const { data, isLoading, error } = useBffQuery({
    queryFn: (portfolioId) => customersService.list(portfolioId, { page: 1, pageSize: 25 }),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;

  return (
    <ul>
      {data?.data.map((customer) => (
        <li key={customer.id}>{customer.legalName}</li>
      ))}
    </ul>
  );
}
```

### Pattern 2: Direct Service Calls
For imperative operations (e.g., form submission, button clicks):

```typescript
import { scoresService } from '@/services/bff';
import { usePortfolio } from '@/contexts/PortfolioContext';
import toast from 'react-hot-toast';

function PullScoreButton({ smbEntityId }: { smbEntityId: string }) {
  const { portfolioId } = usePortfolio();

  const handlePull = async () => {
    try {
      const response = await scoresService.pull(portfolioId, {
        smbEntityId,
        source: 'experian_biz',
      });
      toast.success(`Score pulled: ${response.data.score.score}`);
    } catch (error) {
      const bffError = error as BffError;
      toast.error(bffError.error.message);
    }
  };

  return <Button onClick={handlePull}>Pull Credit Score</Button>;
}
```

### Pattern 3: With Demo Data (3-Mode Support)
For components that support **Demo / Sandbox / Production** modes, pass `demoData` to `useBffQuery`:

```typescript
import { useBffQuery } from '@/hooks/useBffQuery';
import { riskService } from '@/services/bff';
import { CHASE_RISK_SUMMARY } from '@/data/chaseDemoData';

function RiskOverview() {
  const { data, isLoading } = useBffQuery({
    queryFn: (portfolioId) => riskService.getSummary(portfolioId),
    demoData: {
      data: CHASE_RISK_SUMMARY,
      meta: { requestId: crypto.randomUUID() },
    },
  });

  // In Demo mode: uses demoData
  // In Sandbox/Production: calls API
}
```

---

## How to Add a New Service

Follow these steps to add a new BFF service (e.g., `campaigns`, `products`, `underwriting`).

### Step 1: Define Types in `types.ts`
Add domain interfaces to `src/services/bff/types.ts`:

```typescript
// ============ Campaign Types ============
export interface Campaign {
  id: string;
  portfolioId: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  targetSegment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignSummary {
  campaignId: string;
  totalReach: number;
  conversionRate: number;
  revenue: number;
}
```

### Step 2: Create Service File
Create `src/services/bff/campaigns.ts`:

```typescript
/**
 * Campaigns BFF Service
 * Handles marketing campaign operations
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type { Campaign, CampaignSummary } from './types';

export interface CampaignFilters {
  status?: 'draft' | 'active' | 'paused' | 'completed';
  targetSegment?: string;
}

export interface CampaignListParams extends CampaignFilters {
  page?: number;
  pageSize?: number;
}

export const campaignsService = {
  /**
   * List campaigns in a portfolio
   */
  list: async (
    portfolioId: string,
    params?: CampaignListParams
  ): Promise<BffListResponse<Campaign>> => {
    return bffClient.get<BffListResponse<Campaign>>('/campaigns', {
      portfolioId,
      params: {
        status: params?.status,
        targetSegment: params?.targetSegment,
        page: params?.page,
        pageSize: params?.pageSize,
      },
    });
  },

  /**
   * Get campaign by ID
   */
  getById: async (
    portfolioId: string,
    campaignId: string
  ): Promise<BffResponse<Campaign>> => {
    return bffClient.get<BffResponse<Campaign>>(
      `/campaigns/${campaignId}`,
      { portfolioId }
    );
  },

  /**
   * Get campaign performance summary
   */
  getSummary: async (
    portfolioId: string,
    campaignId: string
  ): Promise<BffResponse<CampaignSummary>> => {
    return bffClient.get<BffResponse<CampaignSummary>>(
      `/campaigns/${campaignId}/summary`,
      { portfolioId }
    );
  },
};

export default campaignsService;
```

### Step 3: Add Normalizer (If API Shape Differs)
If the API returns data in a different format (snake_case, nested objects, different enums), add a normalizer to `normalizers.ts`:

```typescript
/**
 * Normalize an API campaign response to Campaign
 */
export function normalizeCampaign(apiCampaign: Record<string, unknown>): Campaign {
  return {
    id: String(apiCampaign.id || ''),
    portfolioId: String(apiCampaign.portfolio_id || apiCampaign.portfolioId || ''),
    name: String(apiCampaign.name || ''),
    status: String(apiCampaign.status || 'draft') as Campaign['status'],
    startDate: String(apiCampaign.start_date || apiCampaign.startDate || ''),
    endDate: apiCampaign.end_date ? String(apiCampaign.end_date) : apiCampaign.endDate ? String(apiCampaign.endDate) : undefined,
    targetSegment: apiCampaign.target_segment ? String(apiCampaign.target_segment) : apiCampaign.targetSegment ? String(apiCampaign.targetSegment) : undefined,
    createdAt: String(apiCampaign.created_at || apiCampaign.createdAt || new Date().toISOString()),
    updatedAt: String(apiCampaign.updated_at || apiCampaign.updatedAt || new Date().toISOString()),
  };
}
```

Then update your service to use the normalizer:

```typescript
list: async (portfolioId: string, params?: CampaignListParams): Promise<BffListResponse<Campaign>> => {
  const response = await bffClient.get<BffListResponse<Campaign>>('/campaigns', {
    portfolioId,
    params: { ... },
  });

  return {
    ...response,
    data: response.data.map((c) => normalizeCampaign(c as unknown as Record<string, unknown>)),
  };
},
```

### Step 4: Export from `index.ts`
Add exports to `src/services/bff/index.ts`:

```typescript
export { default as campaignsService } from './campaigns';

// If you added a normalizer:
export { normalizeCampaign } from './normalizers';
```

### Step 5: Use in Components
Import and use:

```typescript
import { useBffQuery } from '@/hooks/useBffQuery';
import { campaignsService } from '@/services/bff';

function CampaignList() {
  const { data, isLoading } = useBffQuery({
    queryFn: (portfolioId) => campaignsService.list(portfolioId),
  });

  return <div>{data?.data.map((c) => c.name)}</div>;
}
```

---

## Auth Integration

### How Auth Works
1. The `AuthContext` (`@/contexts/AuthContext`) initializes Clerk and calls `setAuthTokenGetter()` with a function that retrieves the current Clerk JWT.
2. Every request made via `bffClient` automatically calls `getAuthToken()` and injects the token into the `Authorization` header.
3. **Demo mode**: Uses a hardcoded `DEMO_TOKEN` instead of Clerk JWT.
4. **No-auth mode**: `DEV_BYPASS_AUTH = true` in `App.tsx` skips auth checks for protected routes (frontend only).

### Token Flow
```
User logs in → Clerk issues JWT → AuthContext.setAuthTokenGetter(getToken)
→ Component calls service → bffClient.get() → getAuthToken() → fetch(url, { headers: { Authorization: `Bearer ${token}` } })
```

### Important: Never Import Clerk Directly
**NEVER** import from `@clerk/clerk-react` in components/services. **ALWAYS** use:
- `useAuth()` from `@/contexts/AuthContext`
- `useUser()` from `@/contexts/AuthContext`

This is the #1 cause of white-screen crashes in the Dashboard.

---

## Environment-Aware Routing

The BFF client routes requests based on the environment:

| Environment | Base URL | Prefix | Token |
|-------------|----------|--------|-------|
| **Demo** | N/A (local data) | N/A | `DEMO_TOKEN` (no validation) |
| **Sandbox** | `https://sandbox.lumiqai.com/v1` | `/dashboard` | Clerk JWT |
| **Production** | `https://api.lumiqai.com/v1` | `/dashboard` | Clerk JWT |

The environment is determined by:
1. `useEnvironment()` from `@/contexts/EnvironmentContext` (UI toggle)
2. `VITE_API_URL` in `.env` (defaults to Sandbox)

Example:
```typescript
// Request: bffClient.get('/customers', { portfolioId: 'port_123' })

// Sandbox mode:
// → GET https://sandbox.lumiqai.com/v1/dashboard/customers?portfolioId=port_123

// Production mode:
// → GET https://api.lumiqai.com/v1/dashboard/customers?portfolioId=port_123
```

---

## Error Handling

### Error Shape
All errors from `bffClient` are thrown as `BffError` objects:

```typescript
interface BffError {
  error: {
    code: string;          // Error code (UNAUTHORIZED, NOT_FOUND, etc.)
    message: string;       // Human-readable message
    details?: Record<string, unknown>; // Optional context
  };
  meta: {
    requestId: string;    // Trace ID for debugging
  };
}
```

### Common Error Codes
| Code | Meaning | Typical Cause |
|------|---------|---------------|
| `UNAUTHORIZED` | No active session | User not logged in, or token expired |
| `FORBIDDEN` | Insufficient permissions | User lacks required role/permission |
| `NOT_FOUND` | Resource not found | Invalid ID or portfolioId |
| `VALIDATION_ERROR` | Invalid request data | Missing required field, invalid format |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Client exceeded rate limit |
| `INTERNAL_SERVER_ERROR` | Server error | Backend issue (check logs) |

### Handling Errors in Components
```typescript
import { useBffQuery } from '@/hooks/useBffQuery';
import { customersService, type BffError } from '@/services/bff';
import toast from 'react-hot-toast';

function CustomerList() {
  const { data, error } = useBffQuery({
    queryFn: (portfolioId) => customersService.list(portfolioId),
  });

  // Option 1: Let useBffQuery handle errors (shows toast by default)
  if (error) {
    return <ErrorState message={error.error.message} />;
  }

  // Option 2: Custom error handling
  React.useEffect(() => {
    if (error) {
      const bffError = error as BffError;
      if (bffError.error.code === 'UNAUTHORIZED') {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error(bffError.error.message);
      }
    }
  }, [error]);

  return <div>...</div>;
}
```

### Handling Errors in Imperative Calls
```typescript
import { scoresService, type BffError } from '@/services/bff';
import toast from 'react-hot-toast';

async function pullScore(portfolioId: string, smbEntityId: string) {
  try {
    const response = await scoresService.pull(portfolioId, { smbEntityId, source: 'experian_biz' });
    toast.success('Score pulled successfully');
    return response.data;
  } catch (error) {
    const bffError = error as BffError;
    console.error('Score pull failed:', bffError.error.code, bffError.meta.requestId);
    toast.error(bffError.error.message);
    throw error; // Re-throw if caller needs to handle
  }
}
```

---

## Demo Data Mode

The Dashboard supports **3 operational modes**:

1. **Demo** — Local data from `src/data/chaseDemoData.ts` (no API calls)
2. **Sandbox** — Sandbox API (`https://sandbox.lumiqai.com/v1`)
3. **Production** — Production API (`https://api.lumiqai.com/v1`)

### How Demo Mode Works
Components that support demo mode use `useBffQuery` with a `demoData` parameter:

```typescript
import { useBffQuery } from '@/hooks/useBffQuery';
import { riskService } from '@/services/bff';
import { CHASE_RISK_SUMMARY } from '@/data/chaseDemoData';

function RiskOverview() {
  const { data, isLoading } = useBffQuery({
    queryFn: (portfolioId) => riskService.getSummary(portfolioId),
    demoData: {
      data: CHASE_RISK_SUMMARY,
      meta: { requestId: crypto.randomUUID() },
    },
  });

  // In Demo mode: data = CHASE_RISK_SUMMARY (no API call)
  // In Sandbox/Production: data = API response
}
```

### Creating Demo Data
For new services, add demo data to `src/data/chaseDemoData.ts` (or create a new hub file):

```typescript
import type { Campaign } from '@/services/bff/types';

export const CHASE_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp_1',
    portfolioId: 'port_chase',
    name: 'Q1 Small Business Loans',
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    targetSegment: 'small',
    createdAt: '2024-12-15T00:00:00Z',
    updatedAt: '2025-01-05T00:00:00Z',
  },
  // ... more campaigns
];
```

Then use in components:

```typescript
const { data } = useBffQuery({
  queryFn: (portfolioId) => campaignsService.list(portfolioId),
  demoData: { data: CHASE_CAMPAIGNS, meta: { requestId: crypto.randomUUID() } },
});
```

---

## Best Practices

### 1. Always Pass `portfolioId`
```typescript
// ✅ Correct
const customers = await customersService.list(portfolioId, { search: 'Acme' });

// ❌ Wrong
const customers = await customersService.list({ search: 'Acme' });
```

### 2. Use `useBffQuery` for Declarative Data Fetching
```typescript
// ✅ Recommended
const { data, isLoading } = useBffQuery({
  queryFn: (portfolioId) => customersService.list(portfolioId),
});

// ❌ Less ideal (no caching, no automatic refetch)
const [data, setData] = React.useState(null);
React.useEffect(() => {
  customersService.list(portfolioId).then(setData);
}, [portfolioId]);
```

### 3. Type Your Responses
```typescript
// ✅ Correct
const response: BffListResponse<SmbEntity> = await customersService.list(portfolioId);

// ❌ Wrong
const response = await customersService.list(portfolioId); // Loses type information
```

### 4. Add Normalizers for API Shape Mismatches
If the API returns `snake_case` or nested objects, **always** add a normalizer:

```typescript
// ✅ Correct
export function normalizeMyEntity(raw: Record<string, unknown>): MyEntity {
  return {
    id: String(raw.id),
    portfolioId: String(raw.portfolio_id || raw.portfolioId),
    createdAt: String(raw.created_at || raw.createdAt),
  };
}

// ❌ Wrong (leaks API inconsistencies into frontend)
const entity = response.data as MyEntity; // May have snake_case fields
```

### 5. Export Services from `index.ts`
Always export new services from `src/services/bff/index.ts` for centralized imports:

```typescript
// ✅ Correct
import { customersService, scoresService } from '@/services/bff';

// ❌ Wrong
import customersService from '@/services/bff/customers';
import scoresService from '@/services/bff/scores';
```

### 6. Handle Errors Gracefully
Never let `BffError` objects propagate to the UI unhandled:

```typescript
// ✅ Correct
try {
  const data = await myService.create(portfolioId, request);
  toast.success('Created successfully');
} catch (error) {
  const bffError = error as BffError;
  toast.error(bffError.error.message);
}

// ❌ Wrong (crashes UI)
const data = await myService.create(portfolioId, request); // No error handling
```

---

## FAQ

### Q: Why do all requests require `portfolioId`?
**A:** Multi-tenancy enforcement. The API isolates data by portfolio to ensure users only access resources they own.

### Q: Can I call the API without `bffClient`?
**A:** No. Always use `bffClient` or a service that wraps it. Direct `fetch()` calls bypass auth, error handling, and envelope normalization.

### Q: How do I test a service in isolation?
**A:** Use demo data mode with `useBffQuery`:

```typescript
const { data } = useBffQuery({
  queryFn: (portfolioId) => myService.list(portfolioId),
  demoData: { data: MY_DEMO_DATA, meta: { requestId: 'test' } },
});
```

### Q: What if the API returns `snake_case` fields?
**A:** Add a normalizer in `normalizers.ts` to transform the response. See [Step 3: Add Normalizer](#step-3-add-normalizer-if-api-shape-differs).

### Q: How do I handle pagination?
**A:** Use the `page` and `pageSize` params in `list()` methods, and check `pagination.hasMore` to determine if more pages exist:

```typescript
const response = await customersService.list(portfolioId, { page: 2, pageSize: 50 });
if (response.pagination?.hasMore) {
  // Fetch next page
}
```

### Q: Can I use services outside React components?
**A:** Yes, but you'll need to manually handle `portfolioId` and errors. Services are plain async functions.

```typescript
import { customersService } from '@/services/bff';

async function exportCustomers(portfolioId: string) {
  try {
    const response = await customersService.list(portfolioId, { pageSize: 1000 });
    // ... export logic
  } catch (error) {
    console.error('Export failed:', error);
  }
}
```

---

## Related Documentation

- **Root CLAUDE.md** — Full project rules and architecture
- **src/hooks/useBffQuery.ts** — React Query wrapper for BFF services
- **src/contexts/AuthContext.tsx** — Auth token management
- **src/contexts/PortfolioContext.tsx** — Portfolio selection
- **src/services/CLAUDE.md** — Agent scope rules for service modifications
- **src/data/chaseDemoData.ts** — Demo data for 3-mode support

---

## Summary

The BFF service layer provides:
- **9 production-ready services** covering all major domains
- **Standardized response envelopes** for consistent data handling
- **Automatic auth injection** via Clerk JWT
- **Portfolio-scoped requests** for multi-tenancy
- **Type-safe domain models** in `types.ts`
- **Normalizers** to handle API shape mismatches
- **Demo data support** for 3-mode operation
- **Error handling patterns** with `BffError`

To add a new service:
1. Define types in `types.ts`
2. Create service file in `bff/{domain}.ts`
3. Add normalizers if needed
4. Export from `index.ts`
5. Use with `useBffQuery` in components

All services follow the same pattern: `(portfolioId, params?) => Promise<BffResponse<T>>`.

---

**Last Updated:** 2025-02-12
**Maintained By:** LumiqAI Dashboard Team
