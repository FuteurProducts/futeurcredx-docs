# Demo / Sandbox / Production — Implementation Plan

## Overview
- **69 total tasks** across 8 phases
- **Estimated effort**: 45-55 hours sequential, 15-18 hours with parallel workers
- **Zero breaking changes** to existing functionality
- **Goal**: Enable 3-mode environment (demo, sandbox, production) with bank-specific demo data

## Success Criteria
- Users can access demo mode via `?mode=demo` URL parameter
- Demo mode shows realistic bank data (Chase, Citi, Santander, Wells Fargo)
- Bank switcher allows instant data changes without reload
- Sandbox mode uses dedicated API endpoints with rate limiting
- Production mode remains unchanged and secure
- All modes coexist without interference

---

## Phase 1: Foundation (5 tasks)

### DEMO-001: Extend Environment type to include 'demo'
**File**: `src/contexts/EnvironmentContext.tsx`
**Effort**: 1 hour
**Changes**:
- Update type: `type Environment = 'demo' | 'sandbox' | 'production'`
- Add `defaultDemoConfig` with Chase as default bank
- Add URL-based mode resolution (read `?mode=` param on mount)
- Priority order: URL > localStorage > default
- ~45 lines changed

**Code example**:
```typescript
type Environment = 'demo' | 'sandbox' | 'production';

interface EnvironmentConfig {
  mode: Environment;
  apiUrl: string;
  features: string[];
  demoBank?: 'chase' | 'citi' | 'santander' | 'wellsfargo';
}

const defaultDemoConfig: EnvironmentConfig = {
  mode: 'demo',
  apiUrl: '',
  features: ['demo-mode', 'bank-switcher'],
  demoBank: 'chase'
};
```

### DEMO-002: Create useMode() hook
**File**: `src/hooks/useMode.ts` (NEW)
**Effort**: 30 minutes
**Changes**:
- Export `useMode()` hook that reads from EnvironmentContext
- Return current mode ('demo' | 'sandbox' | 'production')
- Export `isDemoMode()`, `isSandboxMode()`, `isProductionMode()` helper functions
- ~25 lines

**Code example**:
```typescript
export const useMode = () => {
  const { environment } = useEnvironment();
  return environment.mode;
};

export const isDemoMode = (mode: Environment) => mode === 'demo';
export const isSandboxMode = (mode: Environment) => mode === 'sandbox';
export const isProductionMode = (mode: Environment) => mode === 'production';
```

### DEMO-003: Add URL-based mode resolution
**File**: `src/contexts/EnvironmentContext.tsx`
**Effort**: 45 minutes
**Changes**:
- Read `?mode=demo` from URL params on EnvironmentProvider mount
- Read `?bank=chase` for initial demo bank selection
- Priority: URL > localStorage > default
- Set localStorage after URL resolution
- ~30 lines

**Code example**:
```typescript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const urlMode = params.get('mode') as Environment | null;
  const urlBank = params.get('bank') as DemoBank | null;

  if (urlMode && ['demo', 'sandbox', 'production'].includes(urlMode)) {
    const config = urlMode === 'demo'
      ? { ...defaultDemoConfig, demoBank: urlBank || 'chase' }
      : configs[urlMode];
    setEnvironment(config);
    localStorage.setItem('environment', JSON.stringify(config));
  }
}, []);
```

### DEMO-004: Update switchEnvironment for 3 modes
**File**: `src/contexts/EnvironmentContext.tsx`
**Effort**: 30 minutes
**Changes**:
- Handle demo ↔ non-demo mode switching
- Update document.title with mode indicator
- Add `switchDemoBank(bank)` function for bank changes
- ~20 lines changed

**Code example**:
```typescript
const switchEnvironment = (newMode: Environment) => {
  if (newMode === 'demo') {
    setEnvironment(defaultDemoConfig);
    document.title = 'Lumiq AI Dashboard (Demo - Chase)';
  } else {
    const config = configs[newMode];
    setEnvironment(config);
    document.title = `Lumiq AI Dashboard (${capitalize(newMode)})`;
  }
  localStorage.setItem('environment', JSON.stringify(environment));

  // Reload if switching between demo and non-demo
  if ((environment.mode === 'demo') !== (newMode === 'demo')) {
    window.location.reload();
  }
};
```

### DEMO-005: Create DemoDataRegistry type
**File**: `src/services/bff/demoRegistry.ts` (NEW)
**Effort**: 1.5 hours
**Changes**:
- Define `DemoDataRegistry` interface mapping endpoints to demo data
- Define bank-specific data hub structure
- Export type for use in useBffQuery
- ~80 lines

**Code example**:
```typescript
export interface DemoDataRegistry {
  campaigns: {
    list: Campaign[];
    summary: CampaignSummary;
    conversion: ConversionBySegment[];
  };
  products: {
    list: BankProduct[];
    penetration: ProductPenetration;
    performance: ProductPerformance[];
    eligibility: EligibilityRule[];
    prequal: PreQualReadiness;
    candidates: PreQualCandidate[];
  };
  // ... 37 more endpoints
}

export type DemoBank = 'chase' | 'citi' | 'santander' | 'wellsfargo';
```

---

## Phase 2: Auth Layer (4 tasks)

### DEMO-006: Create DemoAuthProvider
**File**: `src/contexts/AuthContext.tsx` (add to existing)
**Effort**: 1 hour
**Changes**:
- Add `DemoAuthProvider` component that mimics Clerk interface
- Always returns `isSignedIn: true`, `isLoaded: true`
- Provides mock user: `{ id: 'demo-user', email: 'demo@lumiq.ai', role: 'admin' }`
- Uses `DEMO_TOKEN` constant for auth headers
- ~60 lines

**Code example**:
```typescript
const DemoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const demoUser = {
    id: 'demo-user',
    email: 'demo@lumiq.ai',
    firstName: 'Demo',
    lastName: 'User',
    role: 'admin'
  };

  return (
    <AuthContext.Provider
      value={{
        isSignedIn: true,
        isLoaded: true,
        user: demoUser,
        getToken: async () => 'DEMO_TOKEN',
        signOut: () => Promise.resolve()
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

### DEMO-007: Restructure provider tree in main.tsx
**File**: `src/main.tsx`
**Effort**: 45 minutes
**Changes**:
- Move `EnvironmentProvider` to top of provider tree
- Conditionally render `DemoAuthProvider` or `ClerkProvider` based on mode
- ~40 lines changed

**Code example**:
```typescript
<EnvironmentProvider>
  <ModeBasedAuthProvider>
    <PortfolioProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </PortfolioProvider>
  </ModeBasedAuthProvider>
</EnvironmentProvider>

// ModeBasedAuthProvider checks environment.mode and renders correct provider
```

### DEMO-008: Update ProtectedRoute for demo mode
**File**: `src/App.tsx`
**Effort**: 20 minutes
**Changes**:
- Add mode check in ProtectedRoute
- Demo mode always allows access (bypass auth check)
- ~15 lines changed

**Code example**:
```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const mode = useMode();
  const { isSignedIn, isLoaded } = useAuth();

  if (isDemoMode(mode)) {
    return <>{children}</>;
  }

  // Existing auth logic for sandbox/production
  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) return <Navigate to="/login" />;
  return <>{children}</>;
};
```

### DEMO-009: Set demo RBAC role to admin
**File**: `src/hooks/usePermissions.ts`
**Effort**: 15 minutes
**Changes**:
- Check mode in usePermissions hook
- Force `admin` role in demo mode
- ~10 lines changed

**Code example**:
```typescript
export const usePermissions = () => {
  const mode = useMode();
  const { user } = useAuth();

  if (isDemoMode(mode)) {
    return {
      role: 'admin' as const,
      hasPermission: () => true,
      canAccess: () => true
    };
  }

  // Existing RBAC logic
};
```

---

## Phase 3: BFF Types (1 task, blocks Phase 4)

### SAND-001: Add all new type definitions to types.ts
**File**: `src/services/bff/types.ts`
**Effort**: 3 hours
**Blocking**: Phases 4, 5, 6, 7 depend on this
**Changes**:
- Add 55+ new interfaces for campaigns, products, underwriting, analytics, notifications, settings, portfolios
- Export all types for use in services and components
- ~400 lines added

**New types**:

#### Campaigns (8 types)
```typescript
export interface Campaign {
  id: string;
  name: string;
  type: 'cross-sell' | 'retention' | 'acquisition' | 'pre-qual';
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  targetSegment: string;
  targetSize: number;
  products: string[];
  channels: string[];
  budget: number;
  spent: number;
  roi: number;
  createdAt: string;
  createdBy: string;
}

export interface CampaignFunnel {
  stage: string;
  count: number;
  conversionRate: number;
  dropoffRate: number;
}

export interface CampaignSummary {
  total: number;
  active: number;
  draft: number;
  completed: number;
  totalBudget: number;
  totalSpent: number;
  averageROI: number;
}

export interface ConversionBySegment {
  segment: string;
  impressions: number;
  clicks: number;
  applications: number;
  approvals: number;
  ctr: number;
  conversionRate: number;
  approvalRate: number;
}

export interface CreateCampaignRequest {
  name: string;
  type: Campaign['type'];
  targetSegment: string;
  products: string[];
  channels: string[];
  budget: number;
  startDate: string;
  endDate: string;
}
```

#### Products (10 types)
```typescript
export interface BankProduct {
  id: string;
  name: string;
  category: 'credit-card' | 'loan' | 'line-of-credit' | 'deposit' | 'investment';
  description: string;
  status: 'active' | 'inactive' | 'discontinued';
  launchDate: string;
  terms: ProductTerms;
  eligibility: string[];
  features: string[];
  fees: Record<string, number>;
  apr: {
    min: number;
    max: number;
    average: number;
  };
  creditScoreRequired: {
    min: number;
    recommended: number;
  };
}

export interface ProductTerms {
  loanAmount?: { min: number; max: number };
  creditLimit?: { min: number; max: number };
  term?: { min: number; max: number; unit: 'months' | 'years' };
  repaymentSchedule?: string;
  collateralRequired?: boolean;
}

export interface ProductPenetration {
  productId: string;
  productName: string;
  totalCustomers: number;
  holdingProduct: number;
  penetrationRate: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface SegmentPenetration {
  segment: string;
  penetrationRate: number;
  count: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  applications: number;
  approvals: number;
  approvalRate: number;
  averageAmount: number;
  revenue: number;
  defaultRate: number;
  npl: number;
}

export interface EligibilityRule {
  id: string;
  productId: string;
  rule: string;
  priority: number;
  active: boolean;
}

export interface PreQualReadiness {
  eligible: number;
  ineligible: number;
  pending: number;
  totalScored: number;
  coverageRate: number;
}

export interface PreQualCandidate {
  customerId: string;
  customerName: string;
  currentScore: number;
  recommendedProduct: string;
  estimatedApprovalProbability: number;
  estimatedAmount: number;
  segment: string;
  lastContact: string;
  priority: 'high' | 'medium' | 'low';
}
```

#### Underwriting (6 types)
```typescript
export interface UnderwritingQueueItem {
  id: string;
  customerId: string;
  customerName: string;
  productType: string;
  requestedAmount: number;
  creditScore: number;
  riskTier: string;
  submittedAt: string;
  status: 'pending' | 'in-review' | 'approved' | 'declined' | 'needs-info';
  assignedTo?: string;
  priority: 'high' | 'medium' | 'low';
  automatedDecision?: 'approve' | 'decline' | 'refer';
  confidenceScore?: number;
}

export interface UnderwritingKPIs {
  totalApplications: number;
  pending: number;
  inReview: number;
  approved: number;
  declined: number;
  avgProcessingTime: number;
  avgApprovalAmount: number;
  automationRate: number;
  overrideRate: number;
}

export interface UnderwritingRule {
  id: string;
  name: string;
  condition: string;
  action: 'approve' | 'decline' | 'refer';
  priority: number;
  active: boolean;
}

export interface MakeDecisionRequest {
  applicationId: string;
  decision: 'approve' | 'decline' | 'request-info';
  approvedAmount?: number;
  reason?: string;
  conditions?: string[];
}
```

#### Analytics (12 types)
```typescript
export interface PortfolioKPI {
  name: string;
  value: number;
  unit?: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  sparkline?: number[];
}

export interface IndustrySegment {
  industry: string;
  count: number;
  percentage: number;
  avgScore: number;
  totalExposure: number;
  npl: number;
}

export interface ScoreBucket {
  range: string;
  count: number;
  percentage: number;
  avgExposure: number;
}

export interface ScoreMigrationMatrix {
  fromBucket: string;
  toBucket: string;
  count: number;
  percentage: number;
}

export interface CrossSellFunnelStage {
  stage: string;
  count: number;
  conversionRate: number;
  avgDays: number;
}

export interface ApplicationFunnelMetrics {
  stage: string;
  count: number;
  dropoffRate: number;
  avgTimeInStage: number;
}

export interface GeographicDistribution {
  region: string;
  count: number;
  percentage: number;
  avgScore: number;
  totalExposure: number;
}

export interface RiskTierDistribution {
  tier: string;
  count: number;
  percentage: number;
  avgScore: number;
  totalExposure: number;
  nplRate: number;
}
```

#### Notifications (5 types)
```typescript
export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'warning' | 'success';
  category: 'system' | 'risk' | 'underwriting' | 'campaign' | 'report';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  sms: boolean;
  categories: Record<string, boolean>;
  frequency: 'realtime' | 'daily' | 'weekly';
}

export interface NotificationSummary {
  total: number;
  unread: number;
  byCategory: Record<string, number>;
}
```

#### Settings (12 types)
```typescript
export interface PlatformUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'developer' | 'risk' | 'rm' | 'readonly';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  portfolios: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface RolePermissions {
  role: string;
  permissions: string[];
  description: string;
}

export interface OAuthClient {
  id: string;
  name: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
  createdAt: string;
  lastUsed: string;
}

export interface IpAllowlistEntry {
  id: string;
  ipAddress: string;
  label: string;
  addedBy: string;
  addedAt: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'bureau' | 'internal' | 'partner' | 'public';
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  recordCount: number;
}

export interface ModelVersion {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'testing' | 'deprecated';
  accuracy: number;
  deployedAt: string;
  trainingData: string;
}

export interface AlertThreshold {
  id: string;
  metric: string;
  condition: 'above' | 'below';
  value: number;
  severity: 'critical' | 'warning' | 'info';
  recipients: string[];
}

export interface BillingInfo {
  plan: string;
  apiCalls: number;
  apiLimit: number;
  storage: number;
  storageLimit: number;
  nextBillingDate: string;
  amount: number;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: PlatformUser['role'];
  portfolios: string[];
}
```

#### Portfolios (3 types)
```typescript
export interface PortfolioSummary {
  id: string;
  name: string;
  entityCount: number;
  totalExposure: number;
  avgScore: number;
  riskDistribution: Record<string, number>;
  lastUpdated: string;
}

export interface PortfolioAccess {
  userId: string;
  portfolioId: string;
  role: string;
  grantedAt: string;
  grantedBy: string;
}
```

---

## Phase 4: BFF Services (7 tasks — ALL PARALLEL)

**Effort**: 8 hours (all parallel)
**Blocking**: Phase 5, 6, 7 depend on this

### SAND-002: Create campaigns service
**File**: `src/services/bff/campaigns.ts` (NEW)
**Effort**: 1.5 hours
**Methods**:
- `list(portfolioId)` → `BffListResponse<Campaign>`
- `getById(portfolioId, campaignId)` → `BffResponse<Campaign>`
- `create(portfolioId, request)` → `BffResponse<Campaign>`
- `getSummary(portfolioId)` → `BffResponse<CampaignSummary>`
- `getConversionBySegment(portfolioId, campaignId)` → `BffListResponse<ConversionBySegment>`
- ~180 lines

### SAND-003: Create products service
**File**: `src/services/bff/products.ts` (NEW)
**Effort**: 2 hours
**Methods**:
- `list(portfolioId)` → `BffListResponse<BankProduct>`
- `getById(portfolioId, productId)` → `BffResponse<BankProduct>`
- `getPenetration(portfolioId, productId)` → `BffResponse<ProductPenetration>`
- `getPenetrationBySegment(portfolioId, productId)` → `BffListResponse<SegmentPenetration>`
- `getPerformance(portfolioId)` → `BffListResponse<ProductPerformance>`
- `getEligibilityRules(portfolioId, productId)` → `BffListResponse<EligibilityRule>`
- `getPreQualReadiness(portfolioId)` → `BffResponse<PreQualReadiness>`
- `getPreQualCandidates(portfolioId, filters?)` → `BffListResponse<PreQualCandidate>`
- ~220 lines

### SAND-004: Create underwriting service
**File**: `src/services/bff/underwriting.ts` (NEW)
**Effort**: 1.5 hours
**Methods**:
- `getQueue(portfolioId, filters?)` → `BffListResponse<UnderwritingQueueItem>`
- `getKPIs(portfolioId)` → `BffResponse<UnderwritingKPIs>`
- `getRules(portfolioId)` → `BffListResponse<UnderwritingRule>`
- `makeDecision(portfolioId, request)` → `BffResponse<void>`
- `assign(portfolioId, applicationId, userId)` → `BffResponse<void>`
- ~160 lines

### SAND-005: Create analytics service
**File**: `src/services/bff/analytics.ts` (NEW)
**Effort**: 1.5 hours
**Methods**:
- `getKPIs(portfolioId)` → `BffListResponse<PortfolioKPI>`
- `getSegments(portfolioId)` → `BffListResponse<IndustrySegment>`
- `getScoreDistribution(portfolioId)` → `BffListResponse<ScoreBucket>`
- `getScoreMigration(portfolioId, period)` → `BffListResponse<ScoreMigrationMatrix>`
- `getCrossSellFunnel(portfolioId)` → `BffListResponse<CrossSellFunnelStage>`
- `getApplicationFunnel(portfolioId)` → `BffListResponse<ApplicationFunnelMetrics>`
- `getGeography(portfolioId)` → `BffListResponse<GeographicDistribution>`
- `getRiskTiers(portfolioId)` → `BffListResponse<RiskTierDistribution>`
- ~200 lines

### SAND-006: Create notifications service
**File**: `src/services/bff/notifications.ts` (NEW)
**Effort**: 1 hour
**Methods**:
- `list(portfolioId, filters?)` → `BffListResponse<Notification>`
- `getSummary(portfolioId)` → `BffResponse<NotificationSummary>`
- `markAsRead(portfolioId, notificationId)` → `BffResponse<void>`
- `markAllAsRead(portfolioId)` → `BffResponse<void>`
- `getPreferences(portfolioId)` → `BffResponse<NotificationPreferences>`
- `updatePreferences(portfolioId, prefs)` → `BffResponse<NotificationPreferences>`
- ~140 lines

### SAND-007: Create settings service
**File**: `src/services/bff/settings.ts` (NEW)
**Effort**: 1.5 hours
**Methods**:
- `listUsers(portfolioId)` → `BffListResponse<PlatformUser>`
- `createUser(portfolioId, request)` → `BffResponse<PlatformUser>`
- `updateUser(portfolioId, userId, updates)` → `BffResponse<PlatformUser>`
- `getPermissions()` → `BffListResponse<Permission>`
- `getRoles()` → `BffListResponse<RolePermissions>`
- `listOAuthClients(portfolioId)` → `BffListResponse<OAuthClient>`
- `listIpAllowlist(portfolioId)` → `BffListResponse<IpAllowlistEntry>`
- `listDataSources(portfolioId)` → `BffListResponse<DataSource>`
- `listModels(portfolioId)` → `BffListResponse<ModelVersion>`
- `getAlertThresholds(portfolioId)` → `BffListResponse<AlertThreshold>`
- `getBilling(portfolioId)` → `BffResponse<BillingInfo>`
- ~180 lines

### SAND-008: Create portfolios service
**File**: `src/services/bff/portfolios.ts` (NEW)
**Effort**: 1 hour
**Methods**:
- `list()` → `BffListResponse<PortfolioSummary>`
- `getById(portfolioId)` → `BffResponse<PortfolioSummary>`
- `create(name, description)` → `BffResponse<PortfolioSummary>`
- `getSummary(portfolioId)` → `BffResponse<PortfolioSummary>`
- `listAccess(portfolioId)` → `BffListResponse<PortfolioAccess>`
- `grantAccess(portfolioId, userId, role)` → `BffResponse<void>`
- ~120 lines

**Code pattern (example from campaigns.ts)**:
```typescript
import { bffClient } from './client';
import type { Campaign, CampaignSummary, ConversionBySegment, CreateCampaignRequest } from './types';
import type { BffResponse, BffListResponse } from './client';

export const campaignsService = {
  list: (portfolioId: string): Promise<BffListResponse<Campaign>> =>
    bffClient.get(`/portfolios/${portfolioId}/campaigns`),

  getById: (portfolioId: string, campaignId: string): Promise<BffResponse<Campaign>> =>
    bffClient.get(`/portfolios/${portfolioId}/campaigns/${campaignId}`),

  create: (portfolioId: string, request: CreateCampaignRequest): Promise<BffResponse<Campaign>> =>
    bffClient.post(`/portfolios/${portfolioId}/campaigns`, request),

  getSummary: (portfolioId: string): Promise<BffResponse<CampaignSummary>> =>
    bffClient.get(`/portfolios/${portfolioId}/campaigns/summary`),

  getConversionBySegment: (
    portfolioId: string,
    campaignId: string
  ): Promise<BffListResponse<ConversionBySegment>> =>
    bffClient.get(`/portfolios/${portfolioId}/campaigns/${campaignId}/conversion-by-segment`),
};
```

---

## Phase 5: Demo Data Layer (3 tasks)

### DEMO-010: Build demo data registry
**File**: `src/services/bff/demoRegistry.ts`
**Effort**: 2.5 hours
**Changes**:
- Import all 39 demo data exports from `src/data/` (chase, citi, santander, wellsfargo)
- Create bank-specific data hubs mapping endpoints to data
- Export `getDemoData(bank, endpoint)` function
- ~250 lines

**Code structure**:
```typescript
import { chaseCampaigns, chaseCampaignSummary, chaseConversionBySegment } from '@/data/chaseCampaignLoader';
import { citiCampaigns, citiCampaignSummary, citiConversionBySegment } from '@/data/citiCampaignLoader';
// ... 35 more imports

const chaseData: DemoDataRegistry = {
  campaigns: {
    list: chaseCampaigns,
    summary: chaseCampaignSummary,
    conversion: chaseConversionBySegment,
  },
  products: {
    list: chaseProducts,
    penetration: chaseProductPenetration,
    performance: chaseProductPerformance,
    // ... 5 more
  },
  // ... 8 more service domains
};

const citiData: DemoDataRegistry = { /* same structure */ };
const santanderData: DemoDataRegistry = { /* same structure */ };
const wellsfargoData: DemoDataRegistry = { /* same structure */ };

export const getDemoData = (
  bank: DemoBank,
  service: keyof DemoDataRegistry,
  endpoint: string
): any => {
  const dataHub = {
    chase: chaseData,
    citi: citiData,
    santander: santanderData,
    wellsfargo: wellsfargoData,
  }[bank];

  return dataHub[service]?.[endpoint];
};
```

### DEMO-011: Enhance useBffQuery with demoData parameter
**File**: `src/hooks/useBffQuery.ts`
**Effort**: 1 hour
**Changes**:
- Add `demoData` optional parameter to useBffQuery
- Check mode via useMode() hook
- If demo mode + demoData provided, return mock response immediately
- Add simulated 300-500ms delay for realism
- ~50 lines changed

**Code example**:
```typescript
interface UseBffQueryOptions<T> {
  queryFn: () => Promise<BffResponse<T> | BffListResponse<T>>;
  dependencies?: any[];
  demoData?: T | T[]; // NEW
}

export const useBffQuery = <T>({ queryFn, dependencies = [], demoData }: UseBffQueryOptions<T>) => {
  const mode = useMode();
  const [data, setData] = useState<T | T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<BffError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Demo mode shortcut
      if (isDemoMode(mode) && demoData !== undefined) {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 300)); // 300-500ms
        setData(demoData);
        setLoading(false);
        return;
      }

      // Existing production fetch logic
      try {
        const response = await queryFn();
        if ('data' in response) setData(response.data);
        else if ('items' in response) setData(response.items);
      } catch (err) {
        setError(err as BffError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [...dependencies, mode, demoData]);

  return { data, loading, error };
};
```

### DEMO-020: Handle mode change with page reload
**File**: `src/contexts/EnvironmentContext.tsx`
**Effort**: 30 minutes
**Changes**:
- In `switchEnvironment`, detect demo ↔ non-demo transitions
- Trigger `window.location.reload()` to clear React state + re-initialize auth
- ~30 lines changed

**Code example**:
```typescript
const switchEnvironment = (newMode: Environment) => {
  const wasDemoMode = environment.mode === 'demo';
  const willBeDemoMode = newMode === 'demo';

  // Update environment
  const newConfig = newMode === 'demo' ? defaultDemoConfig : configs[newMode];
  setEnvironment(newConfig);
  localStorage.setItem('environment', JSON.stringify(newConfig));

  // Reload if crossing demo boundary
  if (wasDemoMode !== willBeDemoMode) {
    window.location.reload();
  }
};
```

---

## Phase 6: UI Layer (9 tasks — ALL PARALLEL)

**Effort**: 6 hours (all parallel)

### DEMO-021: Add demo mode banner to Dashboard
**File**: `src/pages/Dashboard/Dashboard.tsx`
**Effort**: 30 minutes
**Changes**:
- Add blue banner at top: "You are viewing demo data. Switch to sandbox or production for live data."
- Show current demo bank with switcher button
- ~40 lines

**Code example**:
```typescript
{isDemoMode(mode) && (
  <div className="bg-blue-500/10 border-b border-blue-500/30 px-6 py-3">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <InfoIcon className="w-5 h-5 text-blue-500" />
        <span className="text-sm text-blue-700 dark:text-blue-300">
          You are viewing demo data for <strong>{demoBank.toUpperCase()}</strong>.
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={() => setShowBankSwitcher(true)}>
        Switch Bank
      </Button>
    </div>
  </div>
)}
```

### DEMO-022: Update environment toggle for 3 modes
**File**: `src/components/shared/SandboxEnvironmentToggle.tsx`
**Effort**: 45 minutes
**Changes**:
- Replace binary toggle with dropdown selector (demo | sandbox | production)
- Add confirmation dialog for mode switches
- Use `createPortal` to avoid z-index trap
- ~60 lines changed

**Code example**:
```typescript
<Select value={environment.mode} onValueChange={handleModeChange}>
  <SelectTrigger className="w-40">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="demo">Demo</SelectItem>
    <SelectItem value="sandbox">Sandbox</SelectItem>
    <SelectItem value="production">Production</SelectItem>
  </SelectContent>
</Select>
```

### DEMO-023: Create useFeatureFlags hook
**File**: `src/hooks/useFeatureFlags.ts` (NEW)
**Effort**: 30 minutes
**Changes**:
- Return feature flags based on mode
- Demo mode flags: `{ apiConsole: false, teamManagement: false, bankSwitcher: true }`
- ~35 lines

**Code example**:
```typescript
export const useFeatureFlags = () => {
  const mode = useMode();

  const flags = {
    demo: {
      apiConsole: false,
      teamManagement: false,
      bankSwitcher: true,
      realTimeSync: false,
    },
    sandbox: {
      apiConsole: true,
      teamManagement: true,
      bankSwitcher: false,
      realTimeSync: true,
    },
    production: {
      apiConsole: true,
      teamManagement: true,
      bankSwitcher: false,
      realTimeSync: true,
    },
  };

  return flags[mode];
};
```

### DEMO-024: Hide API Console tab in demo mode
**File**: `src/pages/Dashboard/Dashboard.tsx`
**Effort**: 15 minutes
**Changes**:
- Filter out API Console tab if `!featureFlags.apiConsole`
- ~10 lines

**Code example**:
```typescript
const featureFlags = useFeatureFlags();

const visibleTabs = dashboardTabs.filter(tab => {
  if (tab.id === 'api-console' && !featureFlags.apiConsole) return false;
  return true;
});
```

### DEMO-025: Hide Team Management in Settings (demo mode)
**File**: `src/components/enterprise/settings/SettingsNavigation.tsx`
**Effort**: 15 minutes
**Changes**:
- Filter out Team Management section if `!featureFlags.teamManagement`
- ~10 lines

**Code example**:
```typescript
const featureFlags = useFeatureFlags();

const visibleSections = settingsSections.filter(section => {
  if (section.id === 'team-management' && !featureFlags.teamManagement) return false;
  return true;
});
```

### DEMO-026: Add data source badge for demo mode
**File**: `src/components/shared/DataSourceBadge.tsx` (NEW)
**Effort**: 30 minutes
**Changes**:
- Create badge component showing "Demo Data", "Sandbox", or "Production"
- Color coded: blue (demo), yellow (sandbox), green (production)
- ~50 lines

**Code example**:
```typescript
export const DataSourceBadge = () => {
  const mode = useMode();
  const { environment } = useEnvironment();

  const variants = {
    demo: { bg: 'bg-blue-500/10', text: 'text-blue-700', label: `Demo (${environment.demoBank})` },
    sandbox: { bg: 'bg-yellow-500/10', text: 'text-yellow-700', label: 'Sandbox' },
    production: { bg: 'bg-green-500/10', text: 'text-green-700', label: 'Production' },
  };

  const variant = variants[mode];

  return (
    <Badge className={cn(variant.bg, variant.text)}>
      {variant.label}
    </Badge>
  );
};
```

### DEMO-027: Add demo mode indicator to sidebar logo
**File**: `src/components/layout/Sidebar.tsx`
**Effort**: 20 minutes
**Changes**:
- Add small blue dot or "DEMO" label next to logo in demo mode
- ~15 lines

**Code example**:
```typescript
<div className="flex items-center gap-2">
  <Logo />
  {isDemoMode(mode) && (
    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
      Demo
    </span>
  )}
</div>
```

### DEMO-028: Add "Try Demo" button to login page
**File**: `src/pages/Login/Login.tsx`
**Effort**: 30 minutes
**Changes**:
- Add button below login form: "Try Demo Mode"
- Navigates to `/?mode=demo` on click
- ~30 lines

**Code example**:
```typescript
<Button
  variant="outline"
  onClick={() => {
    window.location.href = '/?mode=demo';
  }}
  className="w-full"
>
  Try Demo Mode
</Button>
```

### DEMO-042: Add bank switcher dropdown to demo mode header
**File**: `src/components/shared/DemoBankSwitcher.tsx` (NEW)
**Effort**: 1 hour
**Changes**:
- Create dropdown selector for Chase, Citi, Santander, Wells Fargo
- Call `switchDemoBank(bank)` from EnvironmentContext
- Reload page after switch to reset data
- ~80 lines

**Code example**:
```typescript
export const DemoBankSwitcher = () => {
  const { environment, switchDemoBank } = useEnvironment();
  const mode = useMode();

  if (!isDemoMode(mode)) return null;

  return (
    <Select value={environment.demoBank} onValueChange={switchDemoBank}>
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="chase">Chase</SelectItem>
        <SelectItem value="citi">Citi</SelectItem>
        <SelectItem value="santander">Santander</SelectItem>
        <SelectItem value="wellsfargo">Wells Fargo</SelectItem>
      </SelectContent>
    </Select>
  );
};
```

---

## Phase 7: Component Wiring (13 tasks — ALL PARALLEL)

**Effort**: 5 hours (all parallel)

Each task follows same pattern:
1. Import service from `@/services/bff/[service]`
2. Import demo data from `@/services/bff/demoRegistry`
3. Get current demo bank from EnvironmentContext
4. Pass `demoData: getDemoData(bank, service, endpoint)` to useBffQuery

### DEMO-030: Wire Campaigns page
**File**: `src/pages/Campaigns/Campaigns.tsx`
**Effort**: 30 minutes
**Changes**:
- Import `campaignsService` + `getDemoData`
- Wire 3 queries: list, summary, conversionBySegment
- ~30 lines

**Code example**:
```typescript
import { campaignsService } from '@/services/bff/campaigns';
import { getDemoData } from '@/services/bff/demoRegistry';
import { useEnvironment } from '@/contexts/EnvironmentContext';

const { environment } = useEnvironment();
const demoBank = environment.demoBank || 'chase';

const { data: campaigns } = useBffQuery({
  queryFn: () => campaignsService.list(portfolioId),
  dependencies: [portfolioId],
  demoData: getDemoData(demoBank, 'campaigns', 'list'),
});
```

### DEMO-031: Wire Products page
**File**: `src/pages/Products/Products.tsx`
**Effort**: 30 minutes
**Changes**: Same pattern, 8 queries (list, penetration, performance, etc.)

### DEMO-032: Wire Underwriting page
**File**: `src/pages/Underwriting/Underwriting.tsx`
**Effort**: 30 minutes
**Changes**: Same pattern, 3 queries (queue, kpis, rules)

### DEMO-033: Wire Risk page
**File**: `src/pages/Risk/Risk.tsx`
**Effort**: 30 minutes
**Changes**: Same pattern, use analyticsService

### DEMO-034: Wire Credit Intelligence page
**File**: `src/pages/CreditIntelligence/CreditIntelligence.tsx`
**Effort**: 30 minutes
**Changes**: Same pattern, use existing services + demo data

### DEMO-035: Wire Customer page
**File**: `src/pages/Customer/Customer.tsx`
**Effort**: 30 minutes
**Changes**: Same pattern, use existing customersService

### DEMO-036: Wire Segment Explorer page
**File**: `src/pages/SegmentExplorer/SegmentExplorer.tsx`
**Effort**: 30 minutes
**Changes**: Same pattern, use analyticsService

### DEMO-037: Wire Reports page
**File**: `src/pages/Reports/Reports.tsx`
**Effort**: 30 minutes
**Changes**: Same pattern, use existing reportsService

### DEMO-038: Wire Notifications page
**File**: `src/pages/Notifications/Notifications.tsx`
**Effort**: 30 minutes
**Changes**: Wire notificationsService with demo data

### DEMO-039: Wire Settings page
**File**: `src/pages/Settings/Settings.tsx`
**Effort**: 30 minutes
**Changes**: Wire settingsService with demo data

### DEMO-040: Wire FinlabOverview component
**File**: `src/components/finlab/FinlabOverview.tsx`
**Effort**: 20 minutes
**Changes**: Add demo data for portfolio metrics

### DEMO-041: Wire PortfolioContext with demo portfolio
**File**: `src/contexts/PortfolioContext.tsx`
**Effort**: 20 minutes
**Changes**: In demo mode, provide hardcoded demo portfolio

**Code example**:
```typescript
const demoPortfolio = {
  id: 'demo-portfolio',
  name: 'Demo Portfolio',
  entityCount: 12847,
  totalExposure: 487000000,
  avgScore: 682,
};

if (isDemoMode(mode)) {
  setPortfolio(demoPortfolio);
}
```

---

## Phase 8: Sandbox Enhancements + Testing (10 tasks)

**Effort**: 5 hours

### SAND-009: Wire BFF client to read API URL from EnvironmentContext
**File**: `src/services/bff/client.ts`
**Effort**: 30 minutes
**Changes**:
- Import useEnvironment hook
- Read `environment.apiUrl` instead of hardcoded value
- ~20 lines changed

**Code example**:
```typescript
const { environment } = useEnvironment();
const baseURL = environment.apiUrl || import.meta.env.VITE_API_URL;
```

### SAND-010: Add rate limit header parsing + indicator
**File**: `src/services/bff/client.ts` + new component
**Effort**: 1 hour
**Changes**:
- Parse `X-RateLimit-Remaining`, `X-RateLimit-Reset` from responses
- Store in Zustand store
- Create `<RateLimitIndicator>` component for header
- ~120 lines

**Code example**:
```typescript
// In BFF client
const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
const rateLimitReset = response.headers.get('X-RateLimit-Reset');
useRateLimitStore.setState({ remaining: rateLimitRemaining, reset: rateLimitReset });

// In header component
export const RateLimitIndicator = () => {
  const { remaining, reset } = useRateLimitStore();
  if (!remaining) return null;
  return <Badge>API: {remaining} calls remaining</Badge>;
};
```

### SAND-011: Add environment badges to API key management
**File**: `src/components/enterprise/settings/ApiConsole.tsx`
**Effort**: 30 minutes
**Changes**:
- Show badge next to each API key indicating environment
- ~20 lines

### SAND-012: Namespace localStorage keys per environment
**File**: `src/lib/storage.ts` (NEW)
**Effort**: 45 minutes
**Changes**:
- Create `storage.set(key, value)` and `storage.get(key)` wrappers
- Prefix all keys with environment mode: `demo:`, `sandbox:`, `production:`
- Update all localStorage calls to use wrapper
- ~100 lines + refactor

**Code example**:
```typescript
export const storage = {
  set: (key: string, value: any) => {
    const mode = getCurrentMode();
    const namespacedKey = `${mode}:${key}`;
    localStorage.setItem(namespacedKey, JSON.stringify(value));
  },
  get: (key: string) => {
    const mode = getCurrentMode();
    const namespacedKey = `${mode}:${key}`;
    const value = localStorage.getItem(namespacedKey);
    return value ? JSON.parse(value) : null;
  },
};
```

### SAND-013: Add sandbox error simulation for testing
**File**: `src/services/bff/client.ts`
**Effort**: 30 minutes
**Changes**:
- Add `?simulateError=true` URL param support in sandbox mode
- Throw synthetic BffError for testing error boundaries
- ~30 lines

**Code example**:
```typescript
if (isSandboxMode(mode) && url.includes('simulateError=true')) {
  throw {
    error: {
      code: 'SIMULATED_ERROR',
      message: 'This is a simulated error for testing',
    },
    meta: { requestId: 'sim-' + Math.random() },
  } as BffError;
}
```

### SAND-014: Create Zod validation schemas for all types
**File**: `src/services/bff/schemas.ts` (NEW)
**Effort**: 2 hours
**Changes**:
- Create Zod schemas for all 55+ types from types.ts
- Export for use in forms + API response validation
- ~500 lines

**Code example**:
```typescript
export const CampaignSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(100),
  type: z.enum(['cross-sell', 'retention', 'acquisition', 'pre-qual']),
  status: z.enum(['draft', 'active', 'paused', 'completed']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  targetSegment: z.string(),
  targetSize: z.number().int().positive(),
  products: z.array(z.string()),
  channels: z.array(z.string()),
  budget: z.number().positive(),
  spent: z.number().nonnegative(),
  roi: z.number(),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
});

export const CreateCampaignRequestSchema = CampaignSchema.pick({
  name: true,
  type: true,
  targetSegment: true,
  products: true,
  channels: true,
  budget: true,
  startDate: true,
  endDate: true,
});
```

### DEMO-043: E2E test for demo mode
**File**: `__tests__/e2e/demo-mode.spec.ts` (NEW)
**Effort**: 1 hour
**Changes**:
- Test `?mode=demo` URL navigation
- Verify demo banner appears
- Test bank switcher
- Verify demo data loads
- ~80 lines

**Code example**:
```typescript
describe('Demo Mode', () => {
  it('should activate demo mode via URL param', () => {
    cy.visit('/?mode=demo');
    cy.contains('You are viewing demo data').should('be.visible');
    cy.contains('CHASE').should('be.visible');
  });

  it('should switch banks without error', () => {
    cy.visit('/?mode=demo');
    cy.get('[data-testid="bank-switcher"]').click();
    cy.contains('Citi').click();
    cy.contains('CITI').should('be.visible');
  });

  it('should hide API Console tab', () => {
    cy.visit('/?mode=demo');
    cy.contains('API Console').should('not.exist');
  });
});
```

### DEMO-044: Unit tests for useMode + demoRegistry
**File**: `__tests__/unit/useMode.test.ts`, `__tests__/unit/demoRegistry.test.ts` (NEW)
**Effort**: 1 hour
**Changes**:
- Test useMode hook returns correct mode
- Test getDemoData returns correct bank data
- Test mode switching logic
- ~100 lines total

**Code example**:
```typescript
describe('useMode', () => {
  it('should return current mode from context', () => {
    const wrapper = createWrapper({ mode: 'demo' });
    const { result } = renderHook(() => useMode(), { wrapper });
    expect(result.current).toBe('demo');
  });

  it('should detect demo mode correctly', () => {
    expect(isDemoMode('demo')).toBe(true);
    expect(isDemoMode('sandbox')).toBe(false);
  });
});

describe('demoRegistry', () => {
  it('should return chase data for chase bank', () => {
    const data = getDemoData('chase', 'campaigns', 'list');
    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].name).toContain('Chase');
  });

  it('should return different data for each bank', () => {
    const chaseData = getDemoData('chase', 'campaigns', 'list');
    const citiData = getDemoData('citi', 'campaigns', 'list');
    expect(chaseData).not.toEqual(citiData);
  });
});
```

### DEMO-045: Update README with demo mode instructions
**File**: `README.md`
**Effort**: 30 minutes
**Changes**:
- Add "Demo Mode" section to README
- Document `?mode=demo` URL param
- Document bank switching
- Document feature limitations in demo mode
- ~80 lines added

### DEMO-029: Update documentation page
**File**: `src/pages/Documentation/Documentation.tsx`
**Effort**: 30 minutes
**Changes**:
- Add section explaining demo mode
- Add visual diagram of 3 modes
- ~50 lines

---

## Dependency Graph

```
Phase 1 (Foundation)
  ├─> Phase 2 (Auth)
  │     └─> Phase 5 (Demo Data)
  │           └─> Phase 6 (UI)
  │           └─> Phase 7 (Wiring)
  └─> Phase 3 (Types)
        └─> Phase 4 (Services)
              └─> Phase 5 (Demo Data)
                    └─> Phase 7 (Wiring)

Phase 4 + Phase 7 → Phase 8 (Testing)
```

**Critical path**: Phase 1 → Phase 3 → Phase 4 → Phase 5 → Phase 7 (36 hours sequential)

---

## Parallel Execution Groups

### Group A: Phase 4 BFF Services (7 workers)
- SAND-002: campaigns.ts
- SAND-003: products.ts
- SAND-004: underwriting.ts
- SAND-005: analytics.ts
- SAND-006: notifications.ts
- SAND-007: settings.ts
- SAND-008: portfolios.ts

**Parallelizable**: YES (no file conflicts)
**Effort**: 1.5 hours with 7 workers

### Group B: Phase 6 UI Components (9 workers)
- DEMO-021: Demo banner
- DEMO-022: Environment toggle
- DEMO-023: Feature flags hook
- DEMO-024: Hide API Console
- DEMO-025: Hide Team Management
- DEMO-026: Data source badge
- DEMO-027: Sidebar indicator
- DEMO-028: Try Demo button
- DEMO-042: Bank switcher

**Parallelizable**: YES (different files)
**Effort**: 1 hour with 9 workers

### Group C: Phase 7 Component Wiring (13 workers)
- DEMO-030 through DEMO-041

**Parallelizable**: YES (different page components)
**Effort**: 30 minutes with 13 workers

### Group D: Phase 8 Testing + Sandbox (5 workers)
- SAND-009: BFF client API URL
- SAND-010: Rate limit indicator
- SAND-011: Environment badges
- DEMO-043: E2E tests
- DEMO-044: Unit tests

**Parallelizable**: MOSTLY (careful with client.ts)
**Effort**: 1.5 hours with 5 workers

---

## Rollback Strategy

Each phase is independently revertable. To disable demo mode without removing code:

1. **Remove URL handling**: Comment out `?mode=demo` parsing in EnvironmentContext
2. **Remove auth override**: Comment out DemoAuthProvider in main.tsx
3. **Hide UI elements**: Add `return null` to demo banner component

All other code stays dormant and can be re-enabled by reversing these changes.

**Git strategy**:
- Each phase gets its own commit with prefix: `feat(demo-mode/phase-N): description`
- Tag milestone after Phase 5: `demo-mode-mvp`
- Tag final: `demo-mode-complete`

---

## Testing Checklist

### Functional Testing
- [ ] Demo mode activates via `?mode=demo` URL
- [ ] Demo mode activates via environment toggle
- [ ] Bank switcher changes data immediately
- [ ] All 13 page components load demo data
- [ ] Demo banner displays with correct bank
- [ ] API Console tab hidden in demo mode
- [ ] Team Management hidden in Settings (demo mode)
- [ ] Sidebar shows "DEMO" indicator
- [ ] Login page shows "Try Demo" button
- [ ] Mode switching triggers reload when crossing demo boundary
- [ ] Demo mode forces admin role + all permissions
- [ ] Demo portfolio auto-selects in PortfolioContext
- [ ] Switching from demo → sandbox clears demo data
- [ ] Switching from demo → production clears demo data
- [ ] localStorage namespaced per environment

### Visual Testing
- [ ] Demo banner styling matches design system (blue-500/10 bg)
- [ ] Bank switcher dropdown renders correctly
- [ ] Environment toggle shows 3 options (demo | sandbox | production)
- [ ] Data source badges color-coded correctly (blue=demo, yellow=sandbox, green=production)
- [ ] Sidebar "DEMO" label doesn't break layout
- [ ] "Try Demo" button styled consistently with other CTAs
- [ ] All demo data renders without layout shifts
- [ ] Demo mode works in both light and dark themes

### Performance Testing
- [ ] Demo data loads in < 500ms (simulated delay)
- [ ] Bank switching completes in < 1s
- [ ] Mode switching reload completes in < 3s
- [ ] No memory leaks when switching banks 10+ times
- [ ] useBffQuery doesn't re-fetch unnecessarily in demo mode
- [ ] Page navigation smooth with demo data

### Accessibility Testing
- [ ] Demo banner dismissible with keyboard (if applicable)
- [ ] Bank switcher keyboard navigable
- [ ] Environment toggle keyboard navigable
- [ ] Focus states visible on all new interactive elements
- [ ] Screen reader announces mode changes
- [ ] ARIA labels present on bank switcher
- [ ] Color contrast meets WCAG AA (demo banner text)

### Security Testing
- [ ] Demo mode never sends requests to production API
- [ ] Demo auth token ("DEMO_TOKEN") rejected by production backend
- [ ] No PII in demo data
- [ ] localStorage properly namespaced (no cross-environment leaks)
- [ ] Switching to production requires real auth
- [ ] Demo mode restrictions enforced (no write operations in UI)

### Error Handling Testing
- [ ] Invalid `?mode=` param falls back to default
- [ ] Missing demo data shows graceful empty state
- [ ] Bank switcher handles API errors (if any)
- [ ] Demo mode error boundary catches crashes
- [ ] BffErrorBoundary works with demo data
- [ ] Console logs no errors in demo mode

### Integration Testing
- [ ] Demo mode + dark theme works
- [ ] Demo mode + responsive layouts work (mobile, tablet, desktop)
- [ ] Demo mode + RBAC gating works (admin role forced)
- [ ] Demo mode + audit trail (no events emitted in demo)
- [ ] Demo mode + export functions work (demo data exported)
- [ ] Demo mode + search/filter components work
- [ ] Demo mode + sort/pagination work

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Regression Testing
- [ ] Production mode unchanged
- [ ] Sandbox mode unchanged
- [ ] All existing pages work in non-demo modes
- [ ] Auth flow unchanged for non-demo modes
- [ ] API calls unchanged for non-demo modes
- [ ] No breaking changes to existing components

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Demo data doesn't match production schema | Medium | High | Phase 3 (types) establishes contract; validate demo data against Zod schemas |
| Bank switcher causes state bugs | Medium | Medium | Use `window.location.reload()` to fully reset app state |
| Mode switching breaks auth flow | Low | High | Comprehensive testing in Phase 2; fallback to localStorage mode detection |
| Demo mode leaks into production | Low | Critical | Environment check in BFF client; demo token rejected by backend |
| Parallel workers create merge conflicts | Low | Medium | Strict file ownership in groups; workers assigned non-overlapping files |
| Demo mode performance issues | Low | Low | Simulated delay < 500ms; demo data pre-loaded, no network calls |

---

## Success Metrics

- **User adoption**: % of new users who try demo mode before signing up
- **Time to value**: Time from landing page → demo mode insights (target: < 30 seconds)
- **Conversion rate**: % of demo users who sign up for sandbox/production
- **Support ticket reduction**: Fewer "how do I use this?" tickets due to demo onboarding
- **Zero production incidents**: No demo mode code affects production users

---

## Maintenance Plan

- **Demo data refresh**: Update bank datasets quarterly to match product roadmap
- **Schema sync**: Run validation script monthly to ensure demo data matches BFF types
- **Dependency updates**: Test demo mode after React/Vite/Tailwind updates
- **Performance monitoring**: Track demo mode load times in analytics
- **User feedback**: Monitor Hotjar/FullStory for demo mode UX issues

---

## Open Questions

1. **Should demo mode allow creating/editing entities?**
   - Proposal: Allow in-memory mutations (reset on bank switch or reload)
   - Decision: TBD

2. **Should we add demo mode analytics?**
   - Proposal: Track which pages users visit in demo mode (privacy-safe)
   - Decision: TBD

3. **Should demo mode support custom date ranges?**
   - Proposal: Allow filtering demo data by date (hard to maintain)
   - Decision: TBD

4. **Should we add more banks (BofA, US Bank)?**
   - Proposal: Start with 4, add more based on user requests
   - Decision: TBD

---

## Appendix: File Manifest

### New Files (14)
- `src/hooks/useMode.ts`
- `src/hooks/useFeatureFlags.ts`
- `src/services/bff/demoRegistry.ts`
- `src/services/bff/campaigns.ts`
- `src/services/bff/products.ts`
- `src/services/bff/underwriting.ts`
- `src/services/bff/analytics.ts`
- `src/services/bff/notifications.ts`
- `src/services/bff/settings.ts`
- `src/services/bff/portfolios.ts`
- `src/services/bff/schemas.ts`
- `src/components/shared/DataSourceBadge.tsx`
- `src/components/shared/DemoBankSwitcher.tsx`
- `src/lib/storage.ts`

### Modified Files (20+)
- `src/contexts/EnvironmentContext.tsx` (4 tasks)
- `src/contexts/AuthContext.tsx` (1 task)
- `src/main.tsx` (1 task)
- `src/App.tsx` (1 task)
- `src/hooks/usePermissions.ts` (1 task)
- `src/hooks/useBffQuery.ts` (1 task)
- `src/services/bff/types.ts` (1 task, +400 lines)
- `src/services/bff/client.ts` (3 tasks)
- `src/pages/Dashboard/Dashboard.tsx` (2 tasks)
- `src/components/shared/SandboxEnvironmentToggle.tsx` (1 task)
- `src/components/enterprise/settings/SettingsNavigation.tsx` (1 task)
- `src/components/enterprise/settings/ApiConsole.tsx` (1 task)
- `src/components/layout/Sidebar.tsx` (1 task)
- `src/pages/Login/Login.tsx` (1 task)
- `src/pages/Campaigns/Campaigns.tsx` (1 task)
- `src/pages/Products/Products.tsx` (1 task)
- `src/pages/Underwriting/Underwriting.tsx` (1 task)
- ... (10 more page components)
- `README.md` (1 task)

### Test Files (2)
- `__tests__/e2e/demo-mode.spec.ts`
- `__tests__/unit/useMode.test.ts`
- `__tests__/unit/demoRegistry.test.ts`

---

**Total LOC estimate**: ~3,500 new lines, ~800 modified lines

**End of Implementation Plan**
