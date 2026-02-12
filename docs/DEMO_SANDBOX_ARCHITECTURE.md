# Demo / Sandbox / Production — Architecture Guide

## 1. Executive Summary

The Lumiq AI Dashboard supports three operating modes to serve different user needs and deployment contexts:

- **Demo Mode**: Zero authentication, local data from 4-bank hub files (39 exports), admin RBAC, instant access for evaluation and testing
- **Sandbox Mode**: Real API at sandbox.lumiqai.com, optional Clerk auth, test data for development and integration testing
- **Production Mode**: Real API at api.lumiqai.com, mandatory Clerk auth, live data for actual customer operations

This architecture enables seamless switching between modes while maintaining type safety, consistent UX patterns, and clear separation of concerns.

---

## 2. Mode Detection & Resolution

### 2.1 Priority Chain

Mode is determined using the following priority order:

1. **URL parameter**: `?mode=demo` (highest priority, overrides everything)
2. **localStorage**: `lumiq-environment` key (persisted preference)
3. **Default**: `demo` (fallback if neither exists)

### 2.2 Valid Modes

```typescript
type EnvironmentMode = 'demo' | 'sandbox' | 'production';
```

### 2.3 Bank Switching

Bank selection is independent of mode:
- `?mode=demo&bank=wellsfargo` — Demo mode with Wells Fargo data
- `?mode=demo&bank=chase` — Demo mode with Chase data
- Bank switching only available in demo mode
- Sandbox and production use portfolio-based data selection

### 2.4 Persistence

- Mode is stored in localStorage as `lumiq-environment` for session persistence
- Mode survives navigation within the app
- Mode can be overridden at any time via URL parameter

---

## 3. Provider Tree Architecture

The provider tree is carefully structured to ensure the correct auth strategy is selected based on the environment mode:

```
ErrorBoundary
  └─ EnvironmentProvider (TOP-LEVEL — determines auth strategy)
       └─ ThemeProvider
            └─ BankProvider
                 └─ [Mode-Aware Auth Provider]
                      ├─ DemoAuthProvider (mode=demo)
                      ├─ FallbackAuthProvider (mode=sandbox, no Clerk)
                      └─ ClerkProvider → AuthProvider (mode=sandbox/production + Clerk)
                           └─ BrowserRouter
                                └─ PortfolioProvider
                                     └─ Routes...
```

### 3.1 Critical Ordering

**EnvironmentProvider MUST be above auth providers** so that mode state is available to determine which auth provider to render. This prevents circular dependencies and ensures clean mode-based branching.

### 3.2 Auth Provider Selection Logic

```typescript
{environment.mode === 'demo' ? (
  <DemoAuthProvider>
    <BrowserRouter>
      <PortfolioProvider>
        <Routes />
      </PortfolioProvider>
    </BrowserRouter>
  </DemoAuthProvider>
) : clerkPublishableKey ? (
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <AuthProvider>
      <BrowserRouter>
        <PortfolioProvider>
          <Routes />
        </PortfolioProvider>
      </BrowserRouter>
    </AuthProvider>
  </ClerkProvider>
) : (
  <FallbackAuthProvider>
    <BrowserRouter>
      <PortfolioProvider>
        <Routes />
      </PortfolioProvider>
    </BrowserRouter>
  </FallbackAuthProvider>
)}
```

---

## 4. Data Flow Architecture

### 4.1 Demo Mode Data Flow

```
Component → useBffQuery({ demoData }) → returns demoData immediately (50-150ms simulated delay) → no network
```

**Characteristics:**
- Zero network requests
- Data sourced from 39 bank-switched exports across 4 hub files
- Simulated latency (50-150ms) for realistic loading states
- Fully type-safe with TypeScript generics
- Bank switching changes data source at module import level

**Hub Files:**
- `src/data/chaseDemoData.ts` — 14 exports (campaigns, segments, underwriting, etc.)
- `src/data/portfolioSegments.ts` — 9 exports (KPIs, risk tiers, geographic distribution)
- `src/data/fallback/demoData.ts` — 3 exports (legacy entities, scores, offers)
- `src/components/enterprise/products/mockData.ts` — 13 exports (product eligibility matrices)

### 4.2 Sandbox/Production Data Flow

```
Component → useBffQuery({ queryFn }) → bffClient.get(endpoint) → HTTP fetch → NestJS API → normalize → render
```

**Characteristics:**
- Real HTTP requests to NestJS backend
- Response envelope normalization (BffResponse<T>, BffListResponse<T>)
- Error handling via BffError type
- Authentication token injection via Clerk
- Portfolio-scoped requests (portfolioId required)

**API Endpoints:**
- Sandbox: `https://sandbox.lumiqai.com/api/v1`
- Production: `https://api.lumiqai.com/api/v1`

### 4.3 Mode Check Location

**Critical Architecture Decision**: Mode checking happens at **HOOK LEVEL** (useBffQuery), NOT at BFF client level.

**Rationale:**
- Demo mode can bypass network layer entirely
- No network interceptors needed (simpler implementation)
- Clean separation between data-fetching patterns and transport layer
- Easier testing (mock at hook level vs. network level)

---

## 5. useBffQuery Enhancement

### 5.1 Enhanced Interface

```typescript
interface UseBffQueryOptions<T> {
  queryFn: (portfolioId: string) => Promise<T>;
  demoData?: T | (() => T);  // NEW: static or computed demo data
  enabled?: boolean;
  refetchOnPortfolioChange?: boolean;
}

function useBffQuery<T>(options: UseBffQueryOptions<T>): UseBffQueryResult<T>;
```

### 5.2 Behavior by Mode

**Demo Mode:**
- Skip `queryFn` execution entirely
- Return `demoData` (static value or function call result)
- Simulate network delay (50-150ms random)
- Set `isLoading: false` after delay

**Sandbox/Production Mode:**
- Call `queryFn` normally (existing behavior)
- Ignore `demoData` parameter
- Real loading states from network requests

### 5.3 Type Safety

The generic `T` ensures that `demoData` must match the return type of `queryFn`:

```typescript
// ✅ Valid - types match
useBffQuery<Campaign[]>({
  queryFn: (portfolioId) => campaignsService.list(portfolioId),
  demoData: CAMPAIGNS, // Campaign[]
});

// ❌ Type error - demoData type mismatch
useBffQuery<Campaign[]>({
  queryFn: (portfolioId) => campaignsService.list(portfolioId),
  demoData: { foo: 'bar' }, // Type error!
});
```

### 5.4 Usage Examples

**Static Demo Data:**
```typescript
const { data: campaigns } = useBffQuery({
  queryFn: (portfolioId) => campaignsService.list(portfolioId),
  demoData: CAMPAIGNS,
});
```

**Computed Demo Data:**
```typescript
const { data: products } = useBffQuery({
  queryFn: (portfolioId) => productsService.list(portfolioId),
  demoData: () => getBankProducts(ACTIVE_BANK_ID),
});
```

**No Demo Data (sandbox/production only):**
```typescript
const { data: apiKeys } = useBffQuery({
  queryFn: (portfolioId) => apiKeysService.list(portfolioId),
  // No demoData - only works in sandbox/production
});
```

---

## 6. Auth Architecture Per Mode

### 6.1 DemoAuthProvider

**Purpose**: Provide instant access with hardcoded credentials for demo mode.

**Implementation:**
```typescript
const DEMO_USER = {
  id: 'demo-user-001',
  email: 'demo@lumiqai.com',
  name: 'Demo User',
  role: 'admin' as const,
};

const DEMO_TOKEN = 'demo-token-no-verification';

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const authValue = {
    isSignedIn: true,
    isLoaded: true,
    user: DEMO_USER,
    role: 'admin',
  };

  useEffect(() => {
    bffClient.setAuthTokenGetter(async () => DEMO_TOKEN);
  }, []);

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}
```

**Characteristics:**
- Always returns `isSignedIn: true`, `isLoaded: true`
- Hardcoded admin role (full permissions)
- Injects `DEMO_TOKEN` into BFF client via `setAuthTokenGetter()`
- No Clerk dependency
- No sign-in/sign-out flow needed

### 6.2 Sandbox Auth

**Strategy**: Flexible authentication based on configuration.

**With Clerk Configured:**
- Uses `ClerkProvider` → `AuthProvider` (existing pattern)
- Requires `VITE_CLERK_PUBLISHABLE_KEY` in `.env`
- Full Clerk auth flow (sign-in, sign-up, profile management)

**Without Clerk (Development):**
- Uses `FallbackAuthProvider` (localStorage-based)
- Enabled when `VITE_CLERK_PUBLISHABLE_KEY` is missing
- Simple localStorage token persistence
- Mock user object

**DEV_BYPASS_AUTH:**
- Independent flag in `App.tsx`
- Allows bypassing auth checks for protected routes
- Works with any auth provider (Clerk, Fallback, Demo)
- Should be removed in production builds

### 6.3 Production Auth

**Strategy**: Mandatory Clerk authentication.

**Requirements:**
- Clerk must be configured (`VITE_CLERK_PUBLISHABLE_KEY` required)
- Shows error screen if Clerk not configured
- No fallback auth allowed
- Full audit trail for all actions

**Error Handling:**
```typescript
if (environment.mode === 'production' && !clerkPublishableKey) {
  return (
    <ErrorScreen
      title="Configuration Error"
      message="Clerk authentication is required for production mode."
    />
  );
}
```

### 6.4 ProtectedRoute Behavior

**Demo Mode:**
- Always allows access (no auth checks)
- All routes accessible immediately
- RBAC still enforced (admin role hardcoded)

**Sandbox Mode:**
- Checks `DEV_BYPASS_AUTH` first (if true, allow access)
- Then checks auth state (`isSignedIn` from provider)
- Redirects to `/login` if not authenticated

**Production Mode:**
- Requires Clerk sign-in (no bypass)
- Strict auth enforcement
- Audit logging for all protected route access

---

## 7. BFF Service Layer

### 7.1 Existing Services (9)

These services are already implemented and will continue to work in sandbox/production modes:

1. **customers** — `customersService.list()`, `.get()`, `.update()`
2. **scores** — `scoresService.list()`, `.get()`, `.history()`
3. **offers** — `offersService.list()`, `.get()`, `.create()`
4. **applications** — `applicationsService.list()`, `.get()`, `.update()`
5. **reports** — `reportsService.list()`, `.generate()`, `.download()`
6. **risk** — `riskService.getProfile()`, `.getDistribution()`
7. **audit** — `auditService.list()`, `.get()`
8. **apiKeys** — `apiKeysService.list()`, `.create()`, `.revoke()`
9. **batch** — `batchService.upload()`, `.status()`, `.results()`

### 7.2 New Services (7)

These services need to be created to support new dashboard features:

1. **campaigns** — Campaign management and tracking
2. **products** — Product catalog and eligibility
3. **underwriting** — Underwriting queue and decisions
4. **analytics** — KPIs, segments, risk distribution, geography
5. **notifications** — User notifications and alerts
6. **settings** — Application settings and preferences
7. **portfolios** — Portfolio management and switching

### 7.3 Service Pattern

All services follow this consistent pattern:

```typescript
// src/services/bff/campaigns.ts
import { bffClient } from './client';
import type { BffListResponse, Campaign, CampaignFilters } from './types';

export const campaignsService = {
  list: async (
    portfolioId: string,
    params?: CampaignFilters
  ): Promise<BffListResponse<Campaign>> => {
    return bffClient.get<BffListResponse<Campaign>>('/campaigns', {
      portfolioId,
      params,
    });
  },

  get: async (portfolioId: string, id: string): Promise<Campaign> => {
    return bffClient.get<Campaign>(`/campaigns/${id}`, { portfolioId });
  },

  create: async (portfolioId: string, data: CampaignCreate): Promise<Campaign> => {
    return bffClient.post<Campaign>('/campaigns', data, { portfolioId });
  },

  update: async (
    portfolioId: string,
    id: string,
    data: CampaignUpdate
  ): Promise<Campaign> => {
    return bffClient.patch<Campaign>(`/campaigns/${id}`, data, { portfolioId });
  },
};
```

**Pattern Elements:**
- Named export (not default export)
- Object with method properties (not class)
- `portfolioId` as first parameter (required for all endpoints)
- Typed request/response with generics
- Consistent verb mapping (list → GET, create → POST, update → PATCH)

---

## 8. Demo Data Registry

The demo data registry maps BFF endpoints to existing hub file exports, enabling zero-network demo mode.

### 8.1 Registry Structure

```typescript
// src/services/bff/demoRegistry.ts
import {
  CAMPAIGNS,
  CAMPAIGN_SUMMARY,
  UNDERWRITING,
  SEGMENTS,
} from '@/data/chaseDemoData';
import {
  PORTFOLIO_KPIS,
  RISK_TIER_DISTRIBUTION,
  GEOGRAPHIC_DISTRIBUTION,
} from '@/data/portfolioSegments';
import { mockBankProducts } from '@/components/enterprise/products/mockData';

export const DEMO_DATA_REGISTRY = {
  '/campaigns': () => CAMPAIGNS,
  '/campaigns/summary': () => CAMPAIGN_SUMMARY,
  '/products': () => mockBankProducts,
  '/underwriting/queue': () => UNDERWRITING,
  '/analytics/kpis': () => PORTFOLIO_KPIS,
  '/analytics/segments': () => SEGMENTS,
  '/analytics/risk-tiers': () => RISK_TIER_DISTRIBUTION,
  '/analytics/geography': () => GEOGRAPHIC_DISTRIBUTION,
  // ... 31 more mappings
};
```

### 8.2 Complete Registry Map

| Endpoint | Hub File | Export | Bank-Switched |
|----------|----------|--------|---------------|
| `/campaigns` | chaseDemoData.ts | CAMPAIGNS | ✅ |
| `/campaigns/summary` | chaseDemoData.ts | CAMPAIGN_SUMMARY | ✅ |
| `/campaigns/:id/performance` | chaseDemoData.ts | CAMPAIGN_PERFORMANCE | ✅ |
| `/products` | products/mockData.ts | mockBankProducts | ✅ |
| `/products/:id/eligibility` | products/mockData.ts | ELIGIBILITY_MATRIX | ✅ |
| `/underwriting/queue` | chaseDemoData.ts | UNDERWRITING | ✅ |
| `/underwriting/decisions` | chaseDemoData.ts | UNDERWRITING_DECISIONS | ✅ |
| `/analytics/kpis` | portfolioSegments.ts | PORTFOLIO_KPIS | ✅ |
| `/analytics/segments` | chaseDemoData.ts | SEGMENTS | ✅ |
| `/analytics/risk-tiers` | portfolioSegments.ts | RISK_TIER_DISTRIBUTION | ✅ |
| `/analytics/geography` | portfolioSegments.ts | GEOGRAPHIC_DISTRIBUTION | ✅ |
| `/analytics/trends` | portfolioSegments.ts | PORTFOLIO_TRENDS | ✅ |
| `/notifications` | chaseDemoData.ts | NOTIFICATIONS | ✅ |
| `/settings/risk-rules` | chaseDemoData.ts | RISK_RULES | ✅ |
| `/settings/credit-policies` | chaseDemoData.ts | CREDIT_POLICIES | ✅ |
| `/customers` | fallback/demoData.ts | DEMO_ENTITIES | ❌ |
| `/scores/:id` | fallback/demoData.ts | DEMO_SCORE | ❌ |
| `/offers` | fallback/demoData.ts | DEMO_OFFERS | ❌ |

**Total: 39 exports across 4 hub files**

### 8.3 Bank Switching Mechanism

Bank-switched exports use the `ACTIVE_BANK_ID` from `bankConfig.ts`:

```typescript
// src/data/bankConfig.ts
export const ACTIVE_BANK_ID: BankId = 'chase'; // 'chase' | 'citi' | 'wellsfargo' | 'santander'

// src/data/chaseDemoData.ts
export const CAMPAIGNS = BANK_DATA_MAP[ACTIVE_BANK_ID].campaigns;
export const SEGMENTS = BANK_DATA_MAP[ACTIVE_BANK_ID].segments;
// ... etc
```

**Switching Process:**
1. User clicks bank in UI
2. Update `ACTIVE_BANK_ID` in `bankConfig.ts`
3. Trigger page reload
4. All imports resolve to new bank's data

---

## 9. Visual Mode Indicators

### 9.1 Demo Mode

**Top Banner:**
- Background: `bg-blue-500/10` (semi-transparent blue)
- Border: `border-b border-blue-500/20`
- Text: "DEMO MODE — Sample data from [Bank Name]. No authentication required."
- Icon: Info circle (blue)
- Action: Bank switcher dropdown

**Logo Badge:**
- Position: Top-right of Lumiq logo in header
- Badge: "DEMO" in `bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full`

**DataSourceBadge Component:**
- Position: Bottom-right of charts/tables
- Badge: `bg-blue-500/10 text-blue-700 border border-blue-500/20`
- Text: "Demo Data"

### 9.2 Sandbox Mode

**Top Banner:**
- Background: `bg-amber-500/10` (semi-transparent amber)
- Border: `border-b border-amber-500/20`
- Text: "SANDBOX MODE — Test data only. Changes will not affect production."
- Icon: Alert triangle (amber)
- Action: "Switch to Production" button (if admin)

**Logo Badge:**
- None (Sandbox is default dev environment)

**DataSourceBadge Component:**
- Badge: `bg-amber-500/10 text-amber-700 border border-amber-500/20`
- Text: "Sandbox Data"

### 9.3 Production Mode

**Top Banner:**
- None (clean production UI)

**Logo Badge:**
- None (production is default state)

**DataSourceBadge Component:**
- None (assumed to be live data)

### 9.4 Mode Toggle Component

**Location**: Header next to user profile

**Design**: 3-way segmented control
```
┌──────┬─────────┬────────────┐
│ Demo │ Sandbox │ Production │  ← Active highlighted
└──────┴─────────┴────────────┘
```

**Behavior:**
- Demo → Sandbox: Show confirmation ("You will need to sign in")
- Sandbox → Production: Show confirmation ("Switch to live data?")
- Production → Demo: Show confirmation ("Switch to demo mode?")
- Confirmation uses Portal to avoid z-index issues

**Permission:**
- All users can switch to Demo
- Sandbox ↔ Production requires appropriate Clerk role

---

## 10. Feature Flags Per Mode

Certain features should only be available in specific modes to prevent confusion or accidental production changes.

| Feature | Demo | Sandbox | Production | Notes |
|---------|------|---------|-----------|-------|
| **API Console** | ❌ Hidden | ✅ Visible | ✅ Visible | No API in demo mode |
| **Team Management** | ❌ Hidden | ❌ Hidden | ✅ Visible (admin) | Only real teams in production |
| **Billing** | ❌ Hidden | ❌ Hidden | ✅ Visible | Only real billing in production |
| **CSV Export** | ✅ Visible | ✅ Visible | ✅ Visible (audited) | Export demo/sandbox data for testing |
| **PDF Export** | ✅ Visible | ✅ Visible | ✅ Visible (audited) | Export demo/sandbox reports for testing |
| **Bank Switcher** | ✅ Visible | ❌ Hidden | ❌ Hidden | Demo-only feature |
| **Mode Toggle** | ✅ Visible | ✅ Visible | ✅ Visible | All modes can switch |
| **Audit Trail** | ❌ Disabled | ✅ Enabled | ✅ Enabled | No audit in demo (simulated only) |
| **Settings: Risk Rules** | ✅ Read-only | ✅ Editable | ✅ Editable | Can view in demo, edit in sandbox/prod |
| **Settings: API Keys** | ❌ Hidden | ✅ Visible | ✅ Visible | No keys in demo mode |
| **Settings: Webhooks** | ❌ Hidden | ✅ Visible | ✅ Visible | No webhooks in demo mode |
| **Settings: Integrations** | ❌ Hidden | ✅ Visible | ✅ Visible | No real integrations in demo |
| **Notifications** | ✅ Visible (static) | ✅ Visible (real) | ✅ Visible (real) | Demo shows static notifications |
| **Support Chat** | ✅ Visible | ✅ Visible | ✅ Visible | All modes can access support |

### 10.1 Implementation Pattern

```typescript
// src/hooks/useFeatureFlag.ts
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { usePermissions } from '@/hooks/usePermissions';

export function useFeatureFlag(feature: FeatureFlag): boolean {
  const { mode } = useEnvironment();
  const { can } = usePermissions();

  const flags: Record<FeatureFlag, (mode: EnvironmentMode) => boolean> = {
    apiConsole: (m) => m !== 'demo',
    teamManagement: (m) => m === 'production' && can('users:manage'),
    billing: (m) => m === 'production',
    bankSwitcher: (m) => m === 'demo',
    auditTrail: (m) => m !== 'demo',
    // ... etc
  };

  return flags[feature]?.(mode) ?? false;
}

// Usage in component
function SettingsNav() {
  const showApiKeys = useFeatureFlag('apiConsole');

  return (
    <nav>
      {/* ... other nav items ... */}
      {showApiKeys && <NavItem to="/settings/api-keys">API Keys</NavItem>}
    </nav>
  );
}
```

---

## 11. State Reset on Mode Switch

### 11.1 Demo ↔ Non-Demo (Full Reload)

**Trigger**: Switching between demo and sandbox/production

**Reason**: Auth provider changes (DemoAuthProvider vs. ClerkProvider/FallbackAuthProvider)

**Behavior**:
```typescript
function switchMode(newMode: EnvironmentMode) {
  localStorage.setItem('lumiq-environment', newMode);
  window.location.href = `/?mode=${newMode}`; // Full page reload
}
```

**State Cleared**:
- React component tree (full remount)
- Auth context
- Portfolio context
- All component state
- All query cache (useBffQuery results)

**State Preserved**:
- localStorage (theme, preferences)
- sessionStorage (form drafts, if any)

### 11.2 Sandbox ↔ Production (Hot Swap)

**Trigger**: Switching between sandbox and production

**Reason**: Same auth provider (Clerk or Fallback), only API URL changes

**Behavior**:
```typescript
function switchMode(newMode: EnvironmentMode) {
  setMode(newMode); // State update, no reload
  // BFF client will use new API URL on next request
}
```

**State Cleared**:
- Query cache (all useBffQuery results invalidated)
- Portfolio context (if portfolios differ between environments)

**State Preserved**:
- Auth context (user stays signed in)
- Theme
- UI state (open panels, filters, etc.)

### 11.3 localStorage Namespacing

Some state should be namespaced per mode to avoid conflicts:

```typescript
// ❌ Shared across modes (can cause issues)
localStorage.setItem('portfolio-id', 'portfolio-123');

// ✅ Namespaced per mode
localStorage.setItem(`portfolio-id-${mode}`, 'portfolio-123');

// ✅ Shared across modes (by design)
localStorage.setItem('theme', 'dark');
localStorage.setItem('sidebar-collapsed', 'true');
```

**Namespaced Keys**:
- `portfolio-id-${mode}` — Last selected portfolio
- `filters-${mode}-${page}` — Saved filters per page
- `column-visibility-${mode}-${table}` — Table column preferences

**Shared Keys**:
- `theme` — Theme preference (light/dark/system)
- `sidebar-collapsed` — Sidebar state
- `lumiq-environment` — Current mode

---

## 12. URL Routing

### 12.1 Mode Parameter

**Format**: `?mode=demo|sandbox|production`

**Examples**:
- `https://app.lumiqai.com/?mode=demo` — Demo mode
- `https://app.lumiqai.com/?mode=demo&bank=wellsfargo` — Demo with Wells Fargo data
- `https://app.lumiqai.com/?mode=sandbox` — Sandbox mode
- `https://app.lumiqai.com/dashboard?mode=production` — Production mode

**Behavior**:
- URL parameter overrides localStorage
- Mode persists in localStorage after initial resolution
- Removing URL parameter uses localStorage value
- Deep links work: `https://app.lumiqai.com/dashboard/campaigns?mode=demo`

### 12.2 Bank Parameter (Demo Only)

**Format**: `?bank=chase|citi|wellsfargo|santander`

**Examples**:
- `/?mode=demo&bank=chase` — Chase demo data
- `/?mode=demo&bank=citi` — Citi demo data
- `/?mode=demo&bank=wellsfargo` — Wells Fargo demo data
- `/?mode=demo&bank=santander` — Santander demo data

**Behavior**:
- Only respected in demo mode (ignored in sandbox/production)
- Triggers page reload to switch data imports
- Persists in localStorage as `active-bank-id`

### 12.3 Login Page Behavior

**Demo Mode**:
- Visiting `/login?mode=demo` auto-redirects to `/dashboard?mode=demo`
- No login screen shown (instant access)

**Sandbox Mode**:
- Shows login form (Clerk or Fallback)
- "Try Demo" button links to `/?mode=demo`

**Production Mode**:
- Shows Clerk login form (mandatory)
- No "Try Demo" button (production users should use production)

### 12.4 Protected Routes

All dashboard routes are protected based on mode:

```typescript
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route index element={<Navigate to="overview" replace />} />
    <Route path="overview" element={<Overview />} />
    <Route path="campaigns" element={<Campaigns />} />
    <Route path="products" element={<Products />} />
    {/* ... 10 more routes ... */}
  </Route>
</Route>
```

**ProtectedRoute Logic**:
```typescript
function ProtectedRoute() {
  const { mode } = useEnvironment();
  const { isSignedIn, isLoaded } = useAuth();

  // Demo mode: always allow
  if (mode === 'demo') {
    return <Outlet />;
  }

  // Sandbox mode: allow if DEV_BYPASS_AUTH or signed in
  if (mode === 'sandbox' && (DEV_BYPASS_AUTH || isSignedIn)) {
    return <Outlet />;
  }

  // Production mode: require sign-in
  if (mode === 'production' && isSignedIn) {
    return <Outlet />;
  }

  // Not authorized: redirect to login
  if (!isLoaded) return <LoadingScreen />;
  return <Navigate to="/login" replace />;
}
```

---

## 13. Migration Path

The migration from the current 2-mode system (sandbox/production) to the 3-mode system (demo/sandbox/production) follows a phased approach to minimize risk and enable incremental testing.

### Phase 1: Foundation (Types, Hooks)

**Goal**: Establish type system and mode detection without breaking changes.

**Tasks**:
- Add `'demo'` to `EnvironmentMode` type in `src/contexts/EnvironmentContext.tsx`
- Update `useEnvironment()` hook to support 3 modes
- Create `src/hooks/useMode.ts` for mode detection logic
- Add demo-related types to `src/services/bff/types.ts`
- Create `src/services/bff/demoRegistry.ts` (empty initially)

**Breaking Changes**: None

**Testing**: Existing sandbox/production flows continue to work

### Phase 2: Auth Layer

**Goal**: Enable demo authentication and login bypass.

**Tasks**:
- Create `DemoAuthProvider` in `src/contexts/AuthContext.tsx`
- Update provider tree in `src/main.tsx` to branch on mode
- Update `ProtectedRoute` in `src/App.tsx` to allow demo access
- Add demo token injection to `bffClient`

**Breaking Changes**: None (demo mode is additive)

**Testing**:
- Demo mode login bypass works
- Sandbox/production auth unchanged
- RBAC works in demo mode (admin role)

### Phase 3: Data Layer

**Goal**: Enable zero-network demo data fetching.

**Tasks**:
- Enhance `useBffQuery` to accept `demoData` parameter
- Populate `demoRegistry.ts` with 39 endpoint mappings
- Create 7 new BFF services (campaigns, products, underwriting, analytics, notifications, settings, portfolios)
- Add simulated latency logic (50-150ms)

**Breaking Changes**: None (existing queryFn calls continue to work)

**Testing**:
- Demo mode returns local data instantly
- Sandbox/production use real API
- Type safety enforced (demoData matches queryFn return type)

### Phase 4: UI Layer

**Goal**: Add visual mode indicators and feature flags.

**Tasks**:
- Create demo mode banner component
- Create `DataSourceBadge` component
- Add logo badge for demo mode
- Create 3-way mode toggle component
- Implement `useFeatureFlag` hook
- Hide/show features per mode

**Breaking Changes**: Visual changes only (no functional impact)

**Testing**:
- Banners render correctly per mode
- Mode toggle switches between modes
- Feature flags hide/show correct UI

### Phase 5: Component Wiring

**Goal**: Connect all 13 dashboard pages to new data architecture.

**Tasks**:
- Update Overview page with demo data
- Update Campaigns page with demo data
- Update Products page with demo data
- Update Underwriting page with demo data
- Update Analytics pages with demo data
- Update Risk pages with demo data
- Update Customer pages with demo data
- Update Reports pages with demo data
- Update Settings pages with demo data (13 panels)

**Breaking Changes**: None (fallback to existing patterns if demo data missing)

**Testing**:
- Each page works in all 3 modes
- Data fetching uses correct strategy per mode
- Loading states work correctly

### Phase 6: Testing and Cleanup

**Goal**: Comprehensive testing and polish.

**Tasks**:
- E2E tests for mode switching
- Unit tests for useBffQuery mode branching
- Integration tests for auth per mode
- Performance testing (demo latency, API response times)
- Documentation updates (CLAUDE.md, README.md)
- Cleanup deprecated code

**Breaking Changes**: Removal of deprecated patterns

**Testing**:
- Full regression suite
- Mode switching in all combinations
- Auth flows in all modes

---

## 14. Key Files Reference

### 14.1 Core Architecture

| File | Role | Owner |
|------|------|-------|
| `src/contexts/EnvironmentContext.tsx` | Mode state management, switching logic, localStorage persistence | Backend |
| `src/hooks/useMode.ts` | Mode detection from URL/localStorage, default fallback | Backend |
| `src/hooks/useBffQuery.ts` | Data fetching hook with demo bypass logic | Backend |
| `src/contexts/AuthContext.tsx` | Auth provider branching (Demo/Fallback/Clerk) | Backend |
| `src/main.tsx` | Provider tree root, mode-based auth rendering | Backend |
| `src/App.tsx` | Route definitions, ProtectedRoute wrapper | Backend |

### 14.2 Data Layer

| File | Role | Owner |
|------|------|-------|
| `src/services/bff/client.ts` | HTTP client, auth token injection, API URL resolution | Backend |
| `src/services/bff/types.ts` | All domain types, envelopes (BffResponse, BffError) | Backend |
| `src/services/bff/demoRegistry.ts` | Endpoint → demo data mapping for 39 exports | Backend |
| `src/data/bankConfig.ts` | Active bank resolution, bank switching logic | Backend |
| `src/data/chaseDemoData.ts` | Primary hub file (14 exports) | Backend |
| `src/data/portfolioSegments.ts` | Secondary hub file (9 exports) | Backend |
| `src/data/fallback/demoData.ts` | Legacy hub file (3 exports) | Backend |
| `src/components/enterprise/products/mockData.ts` | Product hub file (13 exports) | Frontend |

### 14.3 New Services (7)

| File | Endpoints | Owner |
|------|-----------|-------|
| `src/services/bff/campaigns.ts` | `/campaigns`, `/campaigns/:id`, `/campaigns/summary` | Backend |
| `src/services/bff/products.ts` | `/products`, `/products/:id`, `/products/:id/eligibility` | Backend |
| `src/services/bff/underwriting.ts` | `/underwriting/queue`, `/underwriting/:id`, `/underwriting/decisions` | Backend |
| `src/services/bff/analytics.ts` | `/analytics/kpis`, `/analytics/segments`, `/analytics/risk-tiers` | Backend |
| `src/services/bff/notifications.ts` | `/notifications`, `/notifications/:id`, `/notifications/mark-read` | Backend |
| `src/services/bff/settings.ts` | `/settings/risk-rules`, `/settings/credit-policies` | Backend |
| `src/services/bff/portfolios.ts` | `/portfolios`, `/portfolios/:id` | Backend |

### 14.4 UI Components

| File | Role | Owner |
|------|------|-------|
| `src/components/shared/DemoModeBanner.tsx` | Top banner for demo mode | Frontend |
| `src/components/shared/SandboxModeBanner.tsx` | Top banner for sandbox mode | Frontend |
| `src/components/shared/ModeToggle.tsx` | 3-way mode switcher in header | Frontend |
| `src/components/shared/DataSourceBadge.tsx` | Badge for charts/tables (demo/sandbox indicator) | Frontend |
| `src/components/shared/BankSwitcher.tsx` | Bank selection dropdown (demo only) | Frontend |
| `src/hooks/useFeatureFlag.ts` | Feature flag hook for mode-based UI gating | Frontend |

---

## 15. Architecture Decisions Log

This section documents key architectural decisions, alternatives considered, and rationale for choices made.

### 15.1 Mode Check Location: Hook Level vs. Client Level

**Decision**: Perform mode checking at hook level (`useBffQuery`), not at BFF client level.

**Alternatives Considered**:
1. **BFF Client Interceptor** — Add interceptor to `bffClient` that checks mode and returns demo data
2. **React Query Wrapper** — Use React Query with custom fetcher that branches on mode
3. **Hook Level** — Check mode in `useBffQuery` and bypass network entirely

**Chosen**: Hook Level

**Rationale**:
- Demo mode can bypass network layer completely (zero HTTP requests)
- No need for network interceptors (simpler implementation)
- Clean separation: hooks handle data-fetching patterns, client handles transport
- Easier testing: mock at hook level vs. mocking network layer
- Better type safety: `demoData` parameter enforces type matching via generics

**Trade-offs**:
- Requires passing `demoData` to every `useBffQuery` call (more boilerplate)
- Demo logic lives in hook, not centralized in client
- But: boilerplate is offset by improved type safety and simpler testing

---

### 15.2 State Management: EnvironmentContext vs. New ModeContext

**Decision**: Extend existing `EnvironmentContext` with mode state.

**Alternatives Considered**:
1. **New ModeContext** — Create separate context for mode state
2. **Zustand Store** — Use Zustand for mode state
3. **Extend EnvironmentContext** — Add mode to existing environment context

**Chosen**: Extend EnvironmentContext

**Rationale**:
- Mode and environment are semantically related (sandbox/production already in EnvironmentContext)
- Fewer contexts = less provider nesting
- Mode switching logic naturally lives with environment switching logic
- Consistent API: `useEnvironment().mode` vs. `useMode().mode`

**Trade-offs**:
- EnvironmentContext now does double duty (mode + environment config)
- But: context is still cohesive (all environment-related state)

---

### 15.3 Data Fetching: Enhance useBffQuery vs. Add React Query

**Decision**: Enhance existing `useBffQuery` hook.

**Alternatives Considered**:
1. **React Query** — Replace useBffQuery with React Query + TanStack Query
2. **SWR** — Use SWR for data fetching
3. **Enhance useBffQuery** — Add demoData parameter to existing hook

**Chosen**: Enhance useBffQuery

**Rationale**:
- Minimal refactor (existing code continues to work)
- No new dependencies (React Query is 45kb, SWR is 15kb)
- Existing patterns preserved (no need to retrain team)
- `useBffQuery` already handles loading, error, refetch patterns

**Trade-offs**:
- Miss out on React Query's advanced features (cache persistence, optimistic updates)
- But: current needs don't require these features
- Can migrate to React Query later if needed (additive change)

---

### 15.4 Auth Per Mode: DemoAuthProvider vs. Extend FallbackAuthProvider

**Decision**: Create separate `DemoAuthProvider`.

**Alternatives Considered**:
1. **Extend FallbackAuthProvider** — Add demo mode flag to FallbackAuthProvider
2. **Conditional Logic in AuthProvider** — Check mode inside existing AuthProvider
3. **New DemoAuthProvider** — Separate provider for demo mode

**Chosen**: New DemoAuthProvider

**Rationale**:
- Clean separation of concerns (demo auth is fundamentally different)
- No conditional logic inside existing providers (simpler code)
- Demo provider can be ultra-simple (hardcoded user, no sign-in/out)
- Easier to remove demo code later if needed (isolated file)

**Trade-offs**:
- More code (3 providers instead of 2)
- But: each provider is simpler and more focused

---

### 15.5 Mode Persistence: localStorage vs. URL Only

**Decision**: Persist mode in localStorage, with URL parameter override.

**Alternatives Considered**:
1. **URL Only** — Mode only from `?mode=` parameter
2. **localStorage Only** — Mode only from localStorage
3. **URL + localStorage** — URL overrides localStorage

**Chosen**: URL + localStorage

**Rationale**:
- URL parameter enables deep linking (`/dashboard?mode=demo`)
- localStorage enables persistence (user doesn't lose mode on navigation)
- URL override allows forced mode switching via link
- Follows existing pattern (environment toggle uses localStorage)

**Trade-offs**:
- More complex logic (priority chain: URL → localStorage → default)
- But: complexity is localized to one hook (`useMode`)

---

### 15.6 Bank Switching: Page Reload vs. Hot Swap

**Decision**: Trigger page reload when switching banks in demo mode.

**Alternatives Considered**:
1. **Hot Swap** — Change `ACTIVE_BANK_ID` and invalidate cache
2. **Page Reload** — Change `ACTIVE_BANK_ID` and reload page
3. **Dynamic Imports** — Lazy load bank data per request

**Chosen**: Page Reload

**Rationale**:
- Demo data resolves at module load time (static imports)
- Changing `ACTIVE_BANK_ID` doesn't affect already-imported modules
- Page reload ensures all imports re-resolve with new bank
- Simpler than dynamic imports (no import() calls needed)

**Trade-offs**:
- Slower UX (page reload instead of instant swap)
- But: bank switching is rare (once per demo session)
- Can optimize later with dynamic imports if needed

---

### 15.7 Service Pattern: Object with Methods vs. Class

**Decision**: Use object with methods (not class) for BFF services.

**Alternatives Considered**:
1. **Class** — `class CampaignsService { async list() {} }`
2. **Object with Methods** — `const campaignsService = { list: async () => {} }`
3. **Individual Functions** — `export async function listCampaigns() {}`

**Chosen**: Object with Methods

**Rationale**:
- Matches existing pattern (9 services already use this)
- Easier to mock in tests (just mock the object)
- No need for `new` keyword (simpler imports)
- Tree-shakeable (unused methods can be eliminated)

**Trade-offs**:
- Less "OOP" (but TypeScript isn't Java)
- But: consistency with existing code is more valuable

---

### 15.8 Demo Data Registry: Static Map vs. Function Per Endpoint

**Decision**: Use static map with functions as values.

**Alternatives Considered**:
1. **Static Map** — `{ '/campaigns': () => CAMPAIGNS }`
2. **Function Per Endpoint** — `export function getCampaigns() {}`
3. **Class Registry** — `class DemoRegistry { get(endpoint) {} }`

**Chosen**: Static Map

**Rationale**:
- Single source of truth (all mappings in one file)
- Easy to audit (see all 39 mappings at a glance)
- Supports computed data (functions as values)
- Simple lookup in useBffQuery (`DEMO_DATA_REGISTRY[endpoint]?.()`)

**Trade-offs**:
- Large file (39 entries)
- But: file is read-only (rarely modified)

---

### 15.9 Feature Flags: Hook vs. HOC vs. Component

**Decision**: Use hook (`useFeatureFlag`) for feature gating.

**Alternatives Considered**:
1. **Hook** — `const showFeature = useFeatureFlag('apiConsole')`
2. **HOC** — `withFeatureFlag('apiConsole')(Component)`
3. **Component** — `<FeatureFlag flag="apiConsole"><Component /></FeatureFlag>`

**Chosen**: Hook

**Rationale**:
- Most flexible (can use in any component or conditional)
- Composable (can combine multiple flags: `showA && showB`)
- Consistent with RBAC pattern (`usePermissions().can()`)
- No extra DOM elements (unlike component wrapper)

**Trade-offs**:
- Requires manual conditional rendering (`{showFeature && <Component />}`)
- But: this is standard React pattern (no learning curve)

---

### 15.10 State Reset: Full Reload vs. Hot Swap

**Decision**: Full reload for demo ↔ non-demo, hot swap for sandbox ↔ production.

**Alternatives Considered**:
1. **Always Reload** — Full page reload for any mode switch
2. **Always Hot Swap** — State update for any mode switch
3. **Conditional** — Reload if auth changes, hot swap otherwise

**Chosen**: Conditional

**Rationale**:
- Demo mode requires different auth provider (must reload)
- Sandbox ↔ production use same auth provider (can hot swap)
- Hot swap preserves UI state (better UX)
- Reload ensures clean auth state (prevents bugs)

**Trade-offs**:
- More complex logic (mode-dependent reload decision)
- But: prevents auth bugs from trying to hot-swap incompatible providers

---

## 16. Future Enhancements

This section captures potential future improvements beyond the initial 3-mode architecture.

### 16.1 Dynamic Bank Switching (Hot Swap)

**Current**: Bank switching in demo mode triggers page reload.

**Enhancement**: Use dynamic imports to enable hot-swapping bank data without reload.

**Implementation**:
```typescript
// src/data/bankLoader.ts
export async function loadBankData(bankId: BankId) {
  switch (bankId) {
    case 'chase':
      return import('./chaseDemoData');
    case 'citi':
      return import('./citiDemoData');
    case 'wellsfargo':
      return import('./wellsfargoDemoData');
    case 'santander':
      return import('./santanderDemoData');
  }
}

// In useBffQuery
const bankData = await loadBankData(ACTIVE_BANK_ID);
const demoData = bankData.CAMPAIGNS;
```

**Benefits**:
- Instant bank switching (no reload)
- Better UX for rapid bank comparisons
- Smaller initial bundle (load banks on-demand)

**Trade-offs**:
- More complex import logic
- Harder to type-check (dynamic imports)

---

### 16.2 Hybrid Mode (Demo + Real API)

**Current**: Demo mode is 100% local data, no API calls.

**Enhancement**: Allow demo mode to call specific API endpoints for live features (e.g., AI chat, report generation).

**Implementation**:
```typescript
const HYBRID_ENDPOINTS = ['/ai/chat', '/reports/generate'];

// In useBffQuery
if (mode === 'demo' && HYBRID_ENDPOINTS.includes(endpoint)) {
  // Call real API even in demo mode
  return queryFn(portfolioId);
} else {
  // Use demo data
  return demoData;
}
```

**Benefits**:
- Demo mode can showcase advanced features (AI, real-time reports)
- Better sales demos (show live AI without exposing customer data)

**Trade-offs**:
- Requires backend API to accept demo tokens
- Blurs line between demo and sandbox

---

### 16.3 Multi-Portfolio Demo Mode

**Current**: Demo mode uses single hardcoded portfolio.

**Enhancement**: Support multiple demo portfolios (e.g., "Small Business", "Enterprise", "Community Bank").

**Implementation**:
```typescript
// src/data/demoPortfolios.ts
export const DEMO_PORTFOLIOS = {
  'demo-smb': { name: 'Small Business Portfolio', size: 5000 },
  'demo-enterprise': { name: 'Enterprise Portfolio', size: 50000 },
  'demo-community': { name: 'Community Bank Portfolio', size: 500 },
};

// In DemoAuthProvider
const [demoPortfolio, setDemoPortfolio] = useState('demo-smb');
```

**Benefits**:
- Demo different use cases (SMB vs. enterprise)
- Better sales demos (tailor to prospect size)

**Trade-offs**:
- 3x demo data maintenance
- More complex demo data registry

---

### 16.4 Time-Travel Demo Mode

**Current**: Demo data is static (no time progression).

**Enhancement**: Allow "time travel" in demo mode to simulate portfolio changes over time.

**Implementation**:
```typescript
// src/contexts/DemoTimeContext.tsx
const [demoDate, setDemoDate] = useState(new Date('2026-02-12'));

// In demo data
export function getCampaigns(date: Date) {
  return CAMPAIGNS.filter(c => c.startDate <= date);
}
```

**Benefits**:
- Demo historical trends (portfolio growth, risk changes)
- Better training material (show cause-and-effect)

**Trade-offs**:
- Complex time-dependent data generation
- Hard to maintain consistency across datasets

---

### 16.5 Demo Mode Recordings

**Current**: Demo mode is interactive but not recorded.

**Enhancement**: Record user interactions in demo mode for playback/sharing.

**Implementation**:
```typescript
// Use rrweb (session replay library)
import { record } from 'rrweb';

if (mode === 'demo') {
  const events = record({
    emit: (event) => sendToBackend(event),
  });
}
```

**Benefits**:
- Share demo sessions with prospects (async demos)
- Internal training (show new hires how to use features)
- Bug reporting (attach demo recording to bug report)

**Trade-offs**:
- Privacy concerns (even demo data)
- Storage costs (recordings are large)

---

### 16.6 Customizable Demo Data

**Current**: Demo data is hardcoded in hub files.

**Enhancement**: Allow users to customize demo data (e.g., change portfolio size, risk distribution).

**Implementation**:
```typescript
// src/components/demo/DemoConfigurator.tsx
function DemoConfigurator() {
  return (
    <form>
      <input label="Portfolio Size" value={portfolioSize} />
      <input label="Default Rate %" value={defaultRate} />
      <button onClick={regenerateDemoData}>Regenerate Demo Data</button>
    </form>
  );
}
```

**Benefits**:
- Sales demos tailored to prospect's portfolio characteristics
- Training scenarios (test edge cases)

**Trade-offs**:
- Complex data generation logic
- Risk of generating invalid/inconsistent data

---

## 17. Glossary

**BFF (Backend for Frontend)**: Service layer that wraps backend APIs, providing normalized responses and type safety. Located in `src/services/bff/`.

**Demo Mode**: Operating mode with zero authentication, local data from hub files, and instant access. Intended for evaluation, sales demos, and testing.

**Demo Data Registry**: Static mapping from API endpoints to demo data exports. Located in `src/services/bff/demoRegistry.ts`.

**EnvironmentContext**: React context providing environment state (mode, API URL, features). Located in `src/contexts/EnvironmentContext.tsx`.

**Feature Flag**: Boolean flag determining if a feature is available in the current mode. Accessed via `useFeatureFlag()` hook.

**Hot Swap**: Mode switch without page reload (sandbox ↔ production). Preserves UI state and auth session.

**Hub File**: TypeScript file containing demo data exports for multiple related features. Examples: `chaseDemoData.ts`, `portfolioSegments.ts`.

**Mode**: Operating environment of the dashboard (demo, sandbox, or production). Determines auth strategy, data source, and available features.

**Production Mode**: Operating mode with mandatory Clerk authentication, live API at `api.lumiqai.com`, and real customer data.

**Protected Route**: Route requiring authentication (except in demo mode). Implemented via `<ProtectedRoute>` wrapper in `App.tsx`.

**Sandbox Mode**: Operating mode with optional Clerk authentication, test API at `sandbox.lumiqai.com`, and test data.

**useBffQuery**: Custom React hook for data fetching. Supports demo mode bypass via `demoData` parameter. Located in `src/hooks/useBffQuery.ts`.

---

## 18. FAQ

**Q: Why three modes instead of two?**

A: Demo mode enables instant evaluation without sign-up barriers. Sandbox and production serve different purposes (testing vs. live operations) and have different auth/API requirements.

---

**Q: Can I use demo mode for development?**

A: Yes, demo mode is ideal for UI development and testing without backend dependencies. Use sandbox mode when testing API integrations.

---

**Q: How do I add a new feature to demo mode?**

A:
1. Add demo data export to appropriate hub file (e.g., `chaseDemoData.ts`)
2. Map endpoint to demo data in `demoRegistry.ts`
3. Create BFF service function if needed
4. Use `useBffQuery({ queryFn, demoData })` in component
5. Test in all three modes

---

**Q: What happens if I forget to provide demoData?**

A: The component will show an error in demo mode ("No demo data provided"). In sandbox/production, it works normally using the API.

---

**Q: How do I hide a feature in demo mode?**

A: Use `useFeatureFlag()` hook:

```typescript
const showApiKeys = useFeatureFlag('apiConsole');

return (
  <div>
    {showApiKeys && <ApiKeysPanel />}
  </div>
);
```

---

**Q: Can I switch modes without signing out?**

A:
- Demo ↔ Non-demo: No (requires page reload, clears auth)
- Sandbox ↔ Production: Yes (hot swap preserves auth)

---

**Q: How do I test mode switching locally?**

A:
1. Start dev server: `npm run dev`
2. Open `http://localhost:8080/?mode=demo`
3. Use mode toggle in header to switch
4. Verify banners, auth state, and data source

---

**Q: What's the difference between DEV_BYPASS_AUTH and demo mode?**

A:
- `DEV_BYPASS_AUTH`: Skips auth checks but still uses real API (sandbox/production data)
- Demo mode: Skips auth AND uses local demo data (no API calls)

---

**Q: Can I export demo data?**

A: Yes, CSV/PDF export works in demo mode. The exported file includes a watermark: "DEMO DATA - NOT FOR PRODUCTION USE".

---

**Q: How do I add a new bank to demo mode?**

A:
1. Create `src/data/{bank}DemoData.ts` with all required exports
2. Add bank to `BANK_DATA_MAP` in existing hub files
3. Add bank to `BankId` type in `bankConfig.ts`
4. Add bank option to `BankSwitcher` component

---

**Q: Why does bank switching reload the page?**

A: Demo data is imported statically at module load time. Changing `ACTIVE_BANK_ID` doesn't affect already-imported modules, so a reload is required. This can be optimized with dynamic imports in the future.

---

**Q: Can I use demo mode in production builds?**

A: Yes, demo mode works in production builds. It's useful for public-facing demos and onboarding flows. However, consider hiding the mode toggle for production users.

---

**Q: How do I audit demo mode usage?**

A: Demo mode emits simulated audit events (not persisted). In sandbox/production, all audit events are real and persisted to the audit log.

---

**Q: What's the performance impact of demo mode?**

A: Demo mode is faster than sandbox/production (no network requests). Initial load is the same (all demo data is bundled). Bank switching is slower (page reload).

---

**Q: How do I handle errors in demo mode?**

A: Demo mode doesn't generate errors (data is hardcoded). If you need to test error states in demo mode, add explicit error objects to demo data:

```typescript
useBffQuery({
  queryFn: (portfolioId) => api.getCampaigns(portfolioId),
  demoData: { error: 'Simulated error for testing' },
});
```

---

## 19. Related Documentation

- **[CLAUDE.md](../CLAUDE.md)**: Project operational DNA (stack, rules, auth, RBAC, audit)
- **[MEMORY.md](../.claude/projects/-Users-devaccount-Lumiq-AI-Dashboard/memory/MEMORY.md)**: Project memory (setup, fixes, architecture, gotchas)
- **[WIRING_NOTES.md](./WIRING_NOTES.md)**: Multi-bank demo data wiring details
- **src/contexts/CLAUDE.md**: Context layer scope and rules
- **src/services/CLAUDE.md**: Service layer scope and BFF contract
- **src/hooks/CLAUDE.md**: Custom hooks scope and patterns
- **src/components/CLAUDE.md**: Component layer scope and UI rules

---

**Last Updated**: 2026-02-12
**Version**: 1.0
**Authors**: 12 Research/Design Agents + Lead Agent
**Status**: Approved for Implementation