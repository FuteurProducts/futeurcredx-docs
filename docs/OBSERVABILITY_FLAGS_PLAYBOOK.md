# OBSERVABILITY + FLAGS INTEL — 50-YEAR PLAYBOOK
## Mode Indicators, Runtime Guardrails, and Multi-Tenant Isolation

**AGENT F — RESEARCH INTEL**
**Date**: 2026-02-12
**Status**: CANONICAL REFERENCE — Valid for 50 years

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Industry Patterns — Mode Indicators](#industry-patterns--mode-indicators)
3. [Runtime Assertions Framework](#runtime-assertions-framework)
4. [Production Logging Strategy](#production-logging-strategy)
5. [Feature Flag Patterns](#feature-flag-patterns)
6. [Multi-Tenant Isolation Guardrails](#multi-tenant-isolation-guardrails)
7. [Canonical Patterns (25)](#canonical-patterns-25)
8. [Anti-Patterns (25)](#anti-patterns-25)
9. [Reference Implementations](#reference-implementations)
10. [Decision Framework](#decision-framework)
11. [Hard Invariants](#hard-invariants)
12. [Validation Methods](#validation-methods)
13. [Copybook — Banner/Badge Specs](#copybook--bannerbadge-specs)
14. [Implementation Checklist](#implementation-checklist)

---

## EXECUTIVE SUMMARY

### Current State (Lumiq AI Dashboard)

**Mode Detection**:
- ✅ `EnvironmentContext` provides `demo` | `sandbox` | `production`
- ✅ Auto-detects from URL param `?mode=xxx` > localStorage > default 'demo'
- ✅ `DataSourceBadge` auto-detects and displays mode (blue=demo, amber=sandbox, green=live)
- ⚠️ `useFeatureFlags()` correctly gates features but `showDemoBanner` doesn't prevent banner if mode detection fails

**Auth Bypass**:
- ❌ `DEV_BYPASS_AUTH = true` hardcoded in `App.tsx:42` — ships to production
- ❌ No runtime check to prevent production builds from using bypass

**Logging**:
- ❌ ALL `logger.*` calls suppressed in production (`logger.ts` checks `import.meta.env.DEV`)
- ❌ Zero production observability for mode detection, bank_id mismatches, or API errors

**Runtime Validation**:
- ❌ Zero invariant checks for `bank_id` === expected value
- ❌ No validation that API responses match expected tenant
- ❌ No cross-tenant leakage detection

**Feature Flags**:
- ⚠️ `useFeatureFlags()` derives from `currentEnvironment` (EnvironmentContext)
- ❌ localStorage can be edited by users to override mode detection
- ❌ No server-side validation of mode

### What This Playbook Delivers

1. **Canonical Mode Indicator UX** — Exact specs from Stripe/Vercel/Shopify/Firebase
2. **Runtime Assertion Framework** — When to throw vs warn vs log, with decision tree
3. **Production Logging Best Practices** — What to log, what to NEVER log, structured logging patterns
4. **Bypass-Proof Feature Flags** — Server-side validation, defense-in-depth
5. **Multi-Tenant Isolation Guardrails** — Hard invariants, canary checks, leakage detection
6. **25 Canonical Patterns + 25 Anti-Patterns** — Industry best practices with citations
7. **Implementation Checklist** — Step-by-step to fix Lumiq's gaps

---

## INDUSTRY PATTERNS — MODE INDICATORS

### 1. Stripe Test Mode Indicator

**Design Pattern**:
- **Color**: Orange banner for test mode
- **Position**: Top of page, persistent across all dashboard pages
- **Text**: "Viewing test data" with toggle to switch to live mode
- **Behavior**:
  - Non-dismissible (always visible when in test mode)
  - Orange "Test" icon in upper left-hand corner
  - Dashboard pages have white notification box and disable live mode settings
- **Key Insight**: Stripe separates live mode and test mode data so users only see one type at a time — the toggle doesn't affect integration code, only which API keys are used

**Source**: [Stripe Documentation](https://docs.stripe.com/testing-use-cases), [Festival Pro - Stripe Test Mode](https://festival-pro.document360.io/docs/new-ui-stripe-test-mode)

### 2. Vercel Preview Deployment Indicator

**Design Pattern**:
- **Toolbar**: In-browser toolbar for preview deployments
- **Features**: Leave feedback, manage feature flags, preview drafts, edit content live, inspect performance/layout/accessibility
- **URL**: Each preview deployment gets auto-generated URL
- **Position**: Top of page, persistent
- **Behavior**: Non-dismissible, shows preview status

**Source**: [Vercel Preview Deployments](https://vercel.com/docs/deployments/preview-deployments)

### 3. Shopify Development Store Banner

**Design Pattern**:
- **Purpose**: Inform merchants about important changes or persistent conditions
- **Position**: Top of page or section they apply to, below page/section header
- **Behavior**:
  - Persistent visibility (non-intrusive to main workflow)
  - Supports dismissible and non-dismissible states
  - Uses icons and colors to show meaning and level of importance
- **Types**:
  - `confirmation` (positive outcomes)
  - `alert` (important notices)
  - `error` (critical issues)
  - `information` (general updates)
- **Accessibility**: Banners have `tabindex="0"` and visible keyboard focus indicator

**Source**: [Shopify Polaris Banner](https://polaris-react.shopify.com/components/feedback-indicators/banner)

### 4. Firebase Emulator Mode Indicator

**Design Pattern**:
- **Color**: Purple as primary color for buttons, hover states, selected states
- **Philosophy**: Visual distinctiveness to prevent confusion between local emulator and production
- **Position**: Throughout the UI (not just a banner)
- **Key Insight**: Color scheme serves as persistent visual indicator — developers can't accidentally confuse local environment with production Firebase services

**Source**: [Firebase Emulator UI](https://firebase.blog/posts/2020/05/local-firebase-emulator-ui/)

### 5. Color-Coded Alert Severity Conventions

**Industry Standard**:
- **Red (Emergency)**: Cannot be dismissed, severe risk of widespread outages or destructive compromises
- **Orange (Warning/High)**: Dismissible, high risk of increased hacking/virus/malicious activity targeting core infrastructure
- **Blue (Guarded/Information)**: Dismissible, general information, no known exploits or significant impact
- **Green (Success)**: Positive confirmation

**Source**: [Alert Level Information](https://www.cisecurity.org/cybersecurity-threats/alert-level), [Alert Banner Design](https://www.hennepin.us/design-system/components/components-library/alert-banner)

---

## RUNTIME ASSERTIONS FRAMEWORK

### Fail-Fast vs Fail-Safe Decision Tree

**Fail-Fast Systems**:
- **When**: Critical security violations, data integrity issues, tenant isolation violations
- **Why**: Immediate failure catches errors early, prevents cascading failures, prevents data corruption
- **How**: Throw exceptions that crash the operation
- **Example**: Tenant ID mismatch in API response — THROW immediately

**Fail-Safe Systems**:
- **When**: External service failures, uncertain/volatile environments, mission-critical systems where crashes are devastating
- **Why**: Graceful recovery, continue operation even with degraded functionality
- **How**: Log errors, return fallback values, emit warnings
- **Example**: External API timeout — LOG and return cached data

**Source**: [Fail-Fast vs Fail-Safe](https://medium.com/javarevisited/failure-is-required-understanding-fail-safe-and-fail-fast-strategies-ac9112fe056d)

### Decision Framework: Throw vs Warn vs Log

```typescript
// THROW — Security/Isolation Violations (P0)
function assertTenantIsolation(expected: string, actual: string) {
  if (expected !== actual) {
    throw new TenantIsolationError(
      `CRITICAL: Tenant isolation violation. Expected ${expected}, got ${actual}`
    );
  }
}

// WARN — Configuration Issues (P1)
function validateConfiguration(config: Config) {
  if (config.DEV_BYPASS_AUTH && import.meta.env.PROD) {
    logger.warn('DEV_BYPASS_AUTH is true in production build — security risk!');
  }
}

// LOG — Operational Insights (P2)
function logModeSwitch(from: Environment, to: Environment) {
  logger.info('Environment switched', { from, to, timestamp: Date.now() });
}
```

### tiny-invariant Pattern

**Why Use It**:
- **Size**: 30 lines of code, few kilobytes
- **TypeScript Integration**: Narrows types (e.g., `string | undefined` → `string` after assertion)
- **Use Cases**: Validate inputs, API responses, function parameters

**Pattern**:
```typescript
import invariant from 'tiny-invariant';

// Before
const resourceKey: string | undefined = getResourceKey();
if (!resourceKey) {
  throw new Error('Resource key is required');
}
useResource(resourceKey); // TypeScript still thinks it could be undefined

// After
const resourceKey: string | undefined = getResourceKey();
invariant(resourceKey, 'Resource key is required');
useResource(resourceKey); // TypeScript knows it's string
```

**Source**: [tiny-invariant npm](https://www.npmjs.com/package/tiny-invariant), [Invariant Pattern](https://sirlisko.com/blog/the-invariant-pattern---cleaner-typescript-with-assertion-functions)

---

## PRODUCTION LOGGING STRATEGY

### What Should Be Logged in Production

**Mode Detection & Isolation**:
```typescript
// ✅ LOG: Mode switches
logger.info('Environment switched', {
  from: 'demo',
  to: 'production',
  userId: 'user-123',
  timestamp: Date.now(),
  requestId: 'req-456'
});

// ✅ LOG: Bank/tenant detection
logger.info('Bank detected', {
  bankId: 'chase',
  source: 'url-param',
  requestId: 'req-789'
});

// ✅ LOG: API calls with tenant context
logger.info('API request', {
  endpoint: '/portfolio/segments',
  method: 'GET',
  tenantId: 'chase',
  userId: 'user-123',
  requestId: 'req-101112',
  duration: 234 // ms
});

// ✅ LOG: Tenant ID mismatches (WARNING level)
logger.warn('Tenant ID mismatch detected', {
  expected: 'chase',
  actual: 'wellsfargo',
  endpoint: '/portfolio/segments',
  requestId: 'req-131415',
  severity: 'HIGH'
});
```

**Structured Logging Format**:
```typescript
interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: number;
  requestId: string;
  userId?: string;
  tenantId?: string;
  bankId?: string;
  endpoint?: string;
  method?: string;
  duration?: number;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}
```

### What Should NEVER Be Logged

**PII (Personally Identifiable Information)**:
- ❌ Customer names, emails, phone numbers
- ❌ Social Security Numbers, Tax IDs
- ❌ Credit card numbers, bank account numbers
- ❌ Addresses, date of birth

**Sensitive Credentials**:
- ❌ API keys, access tokens, session tokens
- ❌ Passwords, password hashes
- ❌ Encryption keys

**Compliance Data**:
- ❌ Health information (HIPAA)
- ❌ Financial transaction details (PCI-DSS)
- ❌ EU citizen data without consent (GDPR)

**Multi-Layered PII Redaction**:
1. **Application-Level**: Use logging-safe representations, exclude PII by default, allowlist new attributes
2. **Middleware-Level**: Auto-mask known sensitive fields before logs are written
3. **Pipeline-Level**: OpenTelemetry Collector scrubbing before logs leave systems
4. **Tokenization**: Replace sensitive data with tokens that maintain context/structure

**Source**: [Skyflow - Keep Sensitive Data Out of Logs](https://www.skyflow.com/post/how-to-keep-sensitive-data-out-of-your-logs-nine-best-practices), [Better Stack - Sensitive Data Logging](https://betterstack.com/community/guides/logging/sensitive-data/)

### Production Logging Tools

**Sentry**:
- **Best For**: Error tracking, real-time application performance data
- **Features**: Session replay, breadcrumbs, stack traces
- **Pricing**: Developer-friendly, scales with usage

**LogRocket**:
- **Best For**: Session replay (acts like video recording), product analytics
- **Features**: Frustration tracking, deep product analytics
- **Limitation**: Limited backend monitoring

**Datadog**:
- **Best For**: Full observability suite (frontend + backend)
- **Features**: Real User Monitoring (RUM), APM, log aggregation
- **Pricing**: Enterprise-focused, higher cost

**Source**: [Sentry vs LogRocket vs Datadog](https://betterstack.com/community/comparisons/datadog-vs-sentry/)

---

## FEATURE FLAG PATTERNS

### Client-Side vs Server-Side Feature Flags

**Client-Side Feature Flags CAN BE BYPASSED**:
- Users can modify source code in browser DevTools
- `localStorage` can be edited to override flags
- Obfuscation is NOT security
- **Use Case**: UI variations, A/B testing, non-security features

**Server-Side Feature Flags CANNOT BE BYPASSED**:
- Decision logic executes on server, client receives only the result
- User has no control over server-side logic
- **Use Case**: Security features, payment gating, tier restrictions, mode enforcement

**Source**: [LaunchDarkly - Keeping Client-Side Flags Secure](https://launchdarkly.com/blog/keeping-client-side-feature-flags-secure/), [Statsig - Server-Side Feature Flags](https://www.statsig.com/perspectives/server-side-feature-flags-backend)

### Bypass-Proof Pattern

```typescript
// ❌ BYPASSABLE (Client-Side Only)
function useFeatureFlags(): FeatureFlags {
  const { currentEnvironment } = useEnvironment(); // localStorage-based
  return {
    showApiConsole: currentEnvironment !== 'demo',
    showBilling: currentEnvironment === 'production'
  };
}

// ✅ BYPASS-PROOF (Server-Side Validation)
async function getFeatureFlagsFromServer(): Promise<FeatureFlags> {
  const response = await fetch('/api/feature-flags', {
    headers: {
      'Authorization': `Bearer ${await getAccessToken()}`
    }
  });
  const { flags } = await response.json();
  return flags; // Server validates JWT, checks user tier, returns flags
}

// ✅ DEFENSE IN DEPTH (Client + Server)
function useFeatureFlags(): FeatureFlags {
  const clientFlags = useClientFeatureFlags(); // localStorage-based (UX only)
  const serverFlags = useServerFeatureFlags(); // JWT-validated (enforcement)

  // Client flags for optimistic UI, server flags for enforcement
  return {
    showApiConsole: clientFlags.showApiConsole && serverFlags.showApiConsole,
    showBilling: clientFlags.showBilling && serverFlags.showBilling
  };
}
```

### Mode Derivation: Flags vs Mode

**Anti-Pattern**: Mode derives from flags
```typescript
// ❌ BAD: Mode can be overridden by editing localStorage
const mode = localStorage.getItem('mode') || 'demo';
const flags = { showBilling: mode === 'production' };
```

**Best Practice**: Mode derives from server-validated source, flags derive from mode
```typescript
// ✅ GOOD: Mode from JWT claim (server-validated), flags derive from mode
const { mode } = await validateSession(); // Server returns mode in JWT
const flags = deriveFlags(mode);
```

**Source**: [LaunchDarkly Flag Evaluation](https://docs.launchdarkly.com/sdk/concepts/flag-evaluation-rules)

---

## MULTI-TENANT ISOLATION GUARDRAILS

### Defense-in-Depth Isolation Strategy

**Layer 1: Network Isolation (Infrastructure)**
- Kubernetes namespaces per tenant
- Resource quotas, network policies
- Runtime isolation via container hardening

**Layer 2: Database Isolation (Data)**
- Row-Level Security (RLS) with tenant_id filtering
- Partition-based isolation for large tenants
- Column-level security for sensitive fields

**Layer 3: Application Isolation (Runtime)**
- JWT session tags with encrypted tenant_id
- Middleware that validates tenant_id on every request
- Invariant checks: raise exception if work attempted outside tenant's workspace

**Layer 4: Observability (Monitoring)**
- Monitor isolation effectiveness per tenant
- Alert on cross-tenant data access attempts
- Track resource usage fairness across tenants

**Source**: [Multi-Tenant Isolation Best Practices](https://www.addwebsolution.com/blog/multi-tenant-performance-crisis-advanced-isolation-2026), [AWS SaaS Tenant Isolation](https://docs.aws.amazon.com/whitepapers/latest/saas-tenant-isolation-strategies/run-time-policy-based-isolation-with-iam.html)

### AWS Session Tags Pattern (Gold Standard)

**How It Works**:
1. JWT includes tenant_id as encrypted claim
2. `AssumeRoleWithWebIdentity` verifies JWT, extracts tenant_id
3. AWS STS maps tenant_id to session tag
4. IAM policies check `aws:PrincipalTag/tenant_id` matches resource tag
5. Access denied if tags don't match

```typescript
// Example: JWT payload
{
  "sub": "user-123",
  "tenant_id": "chase",
  "exp": 1234567890
}

// IAM Policy
{
  "Effect": "Allow",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::bucket/*",
  "Condition": {
    "StringEquals": {
      "s3:ExistingObjectTag/tenant_id": "${aws:PrincipalTag/tenant_id}"
    }
  }
}
```

**Source**: [AWS STS Session Tags](https://aws.amazon.com/blogs/security/saas-tenant-isolation-with-abac-using-aws-sts-support-for-tags-in-jwt/)

### Runtime Validation Pattern

```typescript
// Middleware: Validate tenant_id on every request
function tenantIsolationMiddleware(req: Request, res: Response, next: NextFunction) {
  const { tenant_id: jwtTenantId } = req.user; // From validated JWT
  const { tenant_id: requestTenantId } = req.params;

  if (jwtTenantId !== requestTenantId) {
    logger.error('Tenant isolation violation', {
      expected: jwtTenantId,
      actual: requestTenantId,
      userId: req.user.sub,
      endpoint: req.path,
      method: req.method,
      requestId: req.id
    });

    throw new TenantIsolationError(
      `Access denied: Tenant ${jwtTenantId} cannot access ${requestTenantId} resources`
    );
  }

  // Weave tenant_id into all DB queries
  req.context = { tenant_id: jwtTenantId };
  next();
}

// Database query: Always scope by tenant_id
async function getPortfolioSegments(req: Request) {
  const { tenant_id } = req.context;
  invariant(tenant_id, 'tenant_id is required for database queries');

  return db.portfolioSegments.findMany({
    where: { tenant_id } // ALWAYS filter by tenant_id
  });
}
```

**Source**: [Multi-Tenant Authorization Best Practices](https://www.permit.io/blog/best-practices-for-multi-tenant-authorization)

### Canary Checks for Cross-Tenant Leakage

```typescript
// Test: Inject tenant_id=chase, verify no wellsfargo data appears
describe('Tenant Isolation', () => {
  it('should not leak data across tenants', async () => {
    const response = await request(app)
      .get('/api/portfolio/segments')
      .set('Authorization', `Bearer ${chaseUserToken}`);

    const segments = response.body.data;

    // Assert: All segments belong to 'chase'
    segments.forEach(segment => {
      expect(segment.tenant_id).toBe('chase');
      expect(segment.tenant_id).not.toBe('wellsfargo');
      expect(segment.tenant_id).not.toBe('citi');
      expect(segment.tenant_id).not.toBe('santander');
    });
  });

  it('should reject cross-tenant resource access', async () => {
    const response = await request(app)
      .get('/api/portfolio/segments/wellsfargo-segment-123')
      .set('Authorization', `Bearer ${chaseUserToken}`);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('TENANT_ISOLATION_VIOLATION');
  });
});
```

**Source**: [Multi-Tenancy Testing](https://testgrid.io/blog/multi-tenancy/)

---

## CANONICAL PATTERNS (25)

### Mode Indicators & UX

1. **Persistent Banner for Non-Production** — Always show banner in test/sandbox/demo mode (Stripe, Shopify)
2. **Non-Dismissible Critical Alerts** — Red/orange banners cannot be dismissed (Shopify, CIS)
3. **Color-Coded Severity** — Red=emergency, Orange=warning, Blue=info, Green=success (Industry standard)
4. **Visual Distinctiveness** — Use color scheme throughout UI, not just banner (Firebase purple)
5. **Document Title Prefix** — `[DEMO]`, `[SANDBOX]` in browser tab title (Lumiq pattern)
6. **URL Parameter Mode Switching** — `?mode=sandbox` triggers reload with new mode (Lumiq pattern)
7. **Tooltip Context on Hover** — Badge shows full explanation on hover (Lumiq DataSourceBadge)
8. **Icon + Text Badge** — Colored dot + label (e.g., "Demo", "Sandbox", "Live") (Lumiq pattern)

### Runtime Assertions

9. **Fail-Fast for Security Violations** — Throw immediately on tenant ID mismatch (Security best practice)
10. **tiny-invariant for Type Narrowing** — Use assertion functions for TypeScript type narrowing
11. **Explicit Error Types** — `TenantIsolationError`, `ConfigurationError`, not generic `Error`
12. **Context in Error Messages** — Include expected vs actual, endpoint, user ID in error message
13. **Middleware Validation** — Validate tenant_id in middleware before hitting business logic
14. **Database Query Scoping** — ALWAYS include `where: { tenant_id }` in every query

### Logging & Observability

15. **Structured Logging** — JSON logs with key-value pairs, not plain text (OpenTelemetry pattern)
16. **Multi-Layered PII Redaction** — App-level + middleware + pipeline (Skyflow pattern)
17. **Correlation IDs** — Include `requestId`, `userId`, `tenantId` in all logs (AWS pattern)
18. **Log Level Segmentation** — Different log levels for different environments (Spring Boot pattern)
19. **Allowlist for New Attributes** — New fields must be allowlisted before logging (Better Stack)

### Feature Flags

20. **Server-Side Flag Validation** — JWT-validated flags from server, not localStorage (LaunchDarkly)
21. **Defense in Depth** — Client flags for UX, server flags for enforcement (Security pattern)
22. **Flags Derive from Mode** — Not the other way around (Prevents bypass)
23. **Flag Hygiene Reminders** — Nag users about old flags (LaunchDarkly pattern)

### Multi-Tenant Isolation

24. **AWS Session Tags for ABAC** — JWT tenant_id → session tag → IAM policy enforcement (AWS gold standard)
25. **Canary Tests for Leakage** — Inject tenant A token, assert zero tenant B data (OWASP pattern)

**Sources**: See individual sections above for detailed citations.

---

## ANTI-PATTERNS (25)

### Mode Indicators & UX

1. **Dismissible Security Banners** — Red/critical banners should never be dismissible (Shopify anti-pattern)
2. **No Visual Indicator** — Production looks identical to test mode (Causes accidental prod changes)
3. **Inconsistent Color Coding** — Blue for warning, red for info (Violates industry conventions)
4. **Hidden Mode in Settings** — Mode buried in settings instead of persistent banner
5. **No Document Title Prefix** — All tabs say "Dashboard" regardless of mode (User confusion)

### Runtime Assertions

6. **Silent Failures** — Log tenant mismatch but allow request to proceed (DATA LEAK)
7. **Generic Error Messages** — "Error occurred" instead of "Tenant isolation violation: expected chase, got wellsfargo"
8. **No Type Narrowing** — `if (!x) throw Error()` doesn't help TypeScript (Use `invariant()`)
9. **Validate After Operation** — Check tenant_id AFTER database query (Too late, data leaked)
10. **Optional tenant_id** — Allow queries without tenant_id "for admin users" (HUGE SECURITY HOLE)

### Logging & Observability

11. **Production Logging Disabled** — `if (isDev) console.log()` means ZERO prod visibility (Lumiq current state)
12. **PII in Logs** — Logging customer names, emails, SSNs (GDPR/CCPA violation)
13. **Unstructured Logs** — Plain text logs: "User 123 switched mode" (Not searchable)
14. **No Correlation IDs** — Can't trace request across microservices
15. **Logging Secrets** — API keys, tokens, passwords in logs (CRITICAL SECURITY FLAW)

### Feature Flags

16. **Client-Side Only Flags** — localStorage `mode` controls billing access (USER CAN BYPASS)
17. **No Server Validation** — Trust client-provided mode without JWT validation
18. **Flags Before Mode** — Mode derives from flags instead of flags from mode (Circular dependency)
19. **Hardcoded Bypass in Prod** — `DEV_BYPASS_AUTH = true` in production build (Lumiq current state)
20. **No Flag Expiry** — Old flags accumulate, no cleanup process

### Multi-Tenant Isolation

21. **No Defense in Depth** — Single layer of isolation (If it fails, complete data leak)
22. **Trust Client tenant_id** — Accept tenant_id from query param without JWT validation
23. **No Canary Tests** — Never test if tenant A can access tenant B data
24. **Global Admin Bypass** — "Admin users don't need tenant_id checks" (MASSIVE HOLE)
25. **No Monitoring** — Never alert on cross-tenant access attempts (Silent data breaches)

**Real-World Failure Examples**:
- **OneUptime (GHSA-246p-xmg8-wmcq)**: Privilege escalation via localStorage `is_master_admin=true` manipulation
- **Data Corruption**: Fail-safe on local DB writes led to corrupted data propagating silently
- **CTDL (Cross-Tenant Data Leak)**: API hackers exploiting misconfigurations to access other tenants' data

**Sources**: [OneUptime Advisory](https://github.com/OneUptime/oneuptime/security/advisories/GHSA-246p-xmg8-wmcq), [OWASP Multi-Tenant Security](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html)

---

## REFERENCE IMPLEMENTATIONS

### Stripe: Test Mode Toggle

**Implementation**:
```tsx
// Stripe Dashboard Pattern
function StripeHeader() {
  const { mode } = useStripeMode(); // 'test' | 'live'

  return (
    <header>
      {mode === 'test' && (
        <div className="bg-orange-500 text-white px-4 py-2 text-sm">
          <div className="flex items-center gap-2">
            <TestModeIcon />
            <span>Viewing test data</span>
            <button onClick={() => switchMode('live')}>
              Switch to Live Mode
            </button>
          </div>
        </div>
      )}
      {/* Rest of header */}
    </header>
  );
}
```

**Key Features**:
- Non-dismissible orange banner
- Always visible in test mode
- Toggle to switch modes (triggers API key rotation)
- Dashboard pages disable live settings when in test mode

### Vercel: Preview Deployment Toolbar

**Implementation**:
```tsx
// Vercel Toolbar Pattern
function VercelToolbar() {
  const { isPreview, deploymentUrl } = useDeployment();

  if (!isPreview) return null;

  return createPortal(
    <div className="fixed top-0 left-0 right-0 z-50 bg-purple-600 text-white px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <PreviewIcon />
          <span className="font-medium">Preview Deployment</span>
          <code className="text-xs bg-black/20 px-2 py-1 rounded">
            {deploymentUrl}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <FeedbackButton />
          <FeatureFlagsButton />
          <InspectButton />
        </div>
      </div>
    </div>,
    document.body
  );
}
```

**Key Features**:
- Portal rendering (avoids stacking context issues)
- Fixed positioning, always on top (z-50)
- Integrated feature flag controls
- Auto-generated preview URL display

### Firebase: Emulator Purple Theme

**Implementation**:
```css
/* Firebase Emulator UI Theme */
:root {
  --emulator-primary: #7c3aed; /* Purple-600 */
  --emulator-primary-hover: #6d28d9; /* Purple-700 */
  --emulator-bg: #f9fafb;
}

.emulator-mode {
  /* All buttons purple instead of blue */
  .btn-primary {
    background: var(--emulator-primary);
  }

  .btn-primary:hover {
    background: var(--emulator-primary-hover);
  }

  /* Purple accent throughout UI */
  .selected, .active {
    border-color: var(--emulator-primary);
    color: var(--emulator-primary);
  }
}
```

**Key Features**:
- Visual distinctiveness via color theme (not just banner)
- Purple used consistently across buttons, borders, selected states
- Prevents confusion between emulator and production

### AWS Lambda: Tenant Isolation Mode

**Implementation**:
```typescript
// AWS Lambda Tenant Isolation Pattern
import { Handler } from 'aws-lambda';

interface TenantContext {
  tenant_id: string;
  user_id: string;
  request_id: string;
}

export const handler: Handler = async (event) => {
  // 1. Extract tenant_id from JWT (validated by API Gateway)
  const { claims } = event.requestContext.authorizer;
  const tenant_id = claims['custom:tenant_id'];

  // 2. Validate tenant_id is present
  invariant(tenant_id, 'tenant_id is required in JWT claims');

  // 3. Lambda automatically includes tenant_id in logs (JSON logging enabled)
  console.log(JSON.stringify({
    level: 'info',
    message: 'Request started',
    tenant_id,
    user_id: claims.sub,
    request_id: event.requestContext.requestId,
    endpoint: event.resource,
    method: event.httpMethod
  }));

  // 4. All DB queries scoped by tenant_id
  const data = await db.query({
    tenant_id,
    ...event.body
  });

  // 5. Validate response data matches tenant_id
  data.forEach(item => {
    invariant(
      item.tenant_id === tenant_id,
      `Tenant isolation violation: expected ${tenant_id}, got ${item.tenant_id}`
    );
  });

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
```

**Source**: [AWS Lambda Tenant Isolation](https://aws.amazon.com/blogs/compute/building-multi-tenant-saas-applications-with-aws-lambdas-new-tenant-isolation-mode/)

---

## DECISION FRAMEWORK

### 1. Mode Indicator Decision Tree

```
Is user in production mode?
├─ YES → No banner, document title has no prefix
└─ NO → Is it sandbox or demo?
    ├─ Sandbox → Amber banner, "[SANDBOX]" title prefix
    └─ Demo → Blue banner, "[DEMO]" title prefix

Is the operation security-critical?
├─ YES → Banner is non-dismissible (e.g., "Production mode")
└─ NO → Banner is dismissible (e.g., "Try our new feature")

Does mode detection come from client or server?
├─ Client (localStorage/URL) → Show banner, but enforce on server
└─ Server (JWT claim) → Banner + enforcement aligned
```

### 2. Runtime Assertion Decision Tree

```
Does the condition represent a security violation?
├─ YES (Tenant ID mismatch, auth bypass, PII leak)
│   └─ THROW TenantIsolationError (fail-fast)
└─ NO → Is it a configuration issue?
    ├─ YES (DEV_BYPASS_AUTH in prod, missing API key)
    │   └─ WARN + continue (fail-safe, log for ops)
    └─ NO → Is it operational data?
        └─ LOG info level (observability)

Example:
- Tenant ID mismatch → THROW (P0, security)
- Missing optional field → WARN (P1, data quality)
- User clicked button → LOG (P2, analytics)
```

### 3. Production Logging Decision Tree

```
Is this data about a user?
├─ YES → Is it PII?
│   ├─ YES (name, email, SSN, address)
│   │   └─ DO NOT LOG (redact or tokenize)
│   └─ NO (user_id UUID, tenant_id)
│       └─ LOG with structured format
└─ NO → Is it a credential?
    ├─ YES (API key, token, password)
    │   └─ DO NOT LOG (CRITICAL)
    └─ NO → Is it operationally useful?
        ├─ YES (request_id, endpoint, duration, tenant_id)
        │   └─ LOG with correlation IDs
        └─ NO → Skip (noise)

Example:
- user_id: "uuid-123" → ✅ LOG
- user_email: "john@example.com" → ❌ REDACT
- api_key: "sk_live_abc" → ❌ NEVER LOG
- request_id: "req-456" → ✅ LOG
- tenant_id: "chase" → ✅ LOG
```

### 4. Feature Flag Decision Tree

```
Is this feature security-critical?
├─ YES (Billing, payments, data export, admin functions)
│   └─ Server-side flags ONLY (JWT-validated)
└─ NO → Is it UX-only?
    ├─ YES (Theme, layout, onboarding flow)
    │   └─ Client-side flags OK (localStorage)
    └─ HYBRID (Dashboard features, reports)
        └─ Client flags for optimistic UI + Server validation

Can the flag be bypassed by editing localStorage?
├─ YES → NOT ACCEPTABLE for security features
└─ NO (server-validated) → ACCEPTABLE

Example:
- Show billing page → Server-side flag
- Dark mode toggle → Client-side flag
- API console access → Server-side flag
- Welcome tutorial → Client-side flag
```

---

## HARD INVARIANTS

### Invariants That Must ALWAYS Hold

**Multi-Tenant Isolation**:
1. **Every database query MUST include tenant_id in WHERE clause** (except global admin queries with audit trail)
2. **Every API response MUST have all items matching expected tenant_id** (no mixed tenant data)
3. **JWT tenant_id MUST match requested resource tenant_id** (middleware validation)

**Mode Detection**:
4. **Production builds MUST have DEV_BYPASS_AUTH = false** (compile-time check)
5. **localStorage mode MUST be validated by server** (never trust client)
6. **Mode banner MUST appear when environment !== 'production'** (UX requirement)

**Logging**:
7. **Production logs MUST NOT contain PII** (GDPR/CCPA compliance)
8. **Production logs MUST NOT contain credentials** (security requirement)
9. **All critical operations MUST log with correlation IDs** (observability requirement)

**Feature Flags**:
10. **Security-critical features MUST use server-side flags** (enforcement requirement)
11. **Client flags MUST be validated on server for any protected resource** (defense in depth)
12. **Flags MUST NOT control access to financial operations** (use IAM/RBAC instead)

### Compile-Time Invariants (TypeScript)

```typescript
// Type-level enforcement
type TenantScopedQuery = {
  tenant_id: string; // REQUIRED, not optional
  // ... other fields
};

// Compile error if tenant_id is missing
const query: TenantScopedQuery = {
  // tenant_id missing → TypeScript error
  limit: 10
};

// Runtime + compile-time enforcement
function queryDatabase<T>(params: TenantScopedQuery): Promise<T[]> {
  invariant(params.tenant_id, 'tenant_id is required'); // Runtime check
  // TypeScript already ensures params.tenant_id exists at compile-time
  return db.query(params);
}
```

### Environment-Specific Invariants

```typescript
// Build-time check (Vite/Rollup)
if (import.meta.env.PROD && DEV_BYPASS_AUTH) {
  throw new Error(
    'CRITICAL: DEV_BYPASS_AUTH is true in production build. Build aborted.'
  );
}

// Runtime check (on app initialization)
function validateProductionConfig() {
  if (import.meta.env.PROD) {
    invariant(!DEV_BYPASS_AUTH, 'DEV_BYPASS_AUTH must be false in production');
    invariant(logger.productionMode, 'Logger must be in production mode');
    invariant(process.env.SENTRY_DSN, 'Sentry DSN required in production');
  }
}
```

---

## VALIDATION METHODS

### 1. Tenant Isolation Validation

**Unit Tests**:
```typescript
describe('Tenant Isolation', () => {
  it('should scope all queries by tenant_id', async () => {
    const spy = jest.spyOn(db, 'query');

    await getPortfolioSegments({ tenant_id: 'chase' });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ tenant_id: 'chase' })
    );
  });

  it('should throw on tenant_id mismatch', async () => {
    // Mock response with wrong tenant_id
    jest.spyOn(db, 'query').mockResolvedValue([
      { id: '1', tenant_id: 'wellsfargo' }
    ]);

    await expect(
      getPortfolioSegments({ tenant_id: 'chase' })
    ).rejects.toThrow(TenantIsolationError);
  });
});
```

**Integration Tests**:
```typescript
describe('API Tenant Isolation', () => {
  it('should reject cross-tenant access', async () => {
    const chaseToken = await getJWT({ tenant_id: 'chase' });

    const response = await request(app)
      .get('/api/wellsfargo/portfolio/segments')
      .set('Authorization', `Bearer ${chaseToken}`);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('TENANT_ISOLATION_VIOLATION');
  });
});
```

**Canary Tests** (Run in CI/CD):
```typescript
describe('Tenant Leakage Canary', () => {
  const TENANTS = ['chase', 'wellsfargo', 'citi', 'santander'];

  TENANTS.forEach(tenant => {
    it(`should not leak ${tenant} data to other tenants`, async () => {
      const token = await getJWT({ tenant_id: tenant });
      const response = await request(app)
        .get('/api/portfolio/segments')
        .set('Authorization', `Bearer ${token}`);

      const segments = response.body.data;

      // Assert: ALL segments belong to this tenant
      segments.forEach(segment => {
        expect(segment.tenant_id).toBe(tenant);
      });

      // Assert: NO segments from other tenants
      const otherTenants = TENANTS.filter(t => t !== tenant);
      otherTenants.forEach(otherTenant => {
        const leakedData = segments.filter(s => s.tenant_id === otherTenant);
        expect(leakedData).toHaveLength(0);
      });
    });
  });
});
```

### 2. Mode Detection Validation

**Build-Time Validation** (Vite plugin):
```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'validate-prod-config',
      enforce: 'pre',
      config(config, { mode }) {
        if (mode === 'production') {
          // Read App.tsx and check DEV_BYPASS_AUTH
          const appSource = fs.readFileSync('src/App.tsx', 'utf-8');
          const match = /const DEV_BYPASS_AUTH = (true|false)/.exec(appSource);

          if (match && match[1] === 'true') {
            throw new Error(
              'CRITICAL: DEV_BYPASS_AUTH is true in production build. Set to false before building.'
            );
          }
        }
      }
    }
  ]
});
```

**Runtime Validation** (on mount):
```typescript
function App() {
  useEffect(() => {
    if (import.meta.env.PROD) {
      invariant(!DEV_BYPASS_AUTH, 'DEV_BYPASS_AUTH must be false in production');

      // Log production startup
      logger.info('App started in production mode', {
        version: APP_VERSION,
        environment: 'production',
        timestamp: Date.now()
      });
    }
  }, []);

  return <Router>...</Router>;
}
```

### 3. Feature Flag Validation

**Server-Side Validation**:
```typescript
// Backend: Validate flags on protected endpoints
app.get('/api/billing/invoices', async (req, res) => {
  const { tenant_id, user_id } = req.user; // From JWT

  // 1. Check server-side feature flag
  const flags = await getFeatureFlagsForUser(user_id, tenant_id);

  if (!flags.showBilling) {
    return res.status(403).json({
      error: {
        code: 'FEATURE_DISABLED',
        message: 'Billing feature is not available for your account'
      }
    });
  }

  // 2. Fetch billing data
  const invoices = await db.invoices.findMany({
    where: { tenant_id }
  });

  res.json({ data: invoices });
});
```

**E2E Tests**:
```typescript
test('should hide billing page when flag disabled', async ({ page }) => {
  // 1. Mock server to return flags with showBilling=false
  await page.route('**/api/feature-flags', route => {
    route.fulfill({
      json: {
        showBilling: false,
        showApiConsole: true
      }
    });
  });

  // 2. Navigate to dashboard
  await page.goto('/dashboard/settings');

  // 3. Assert: Billing nav item not visible
  await expect(page.locator('nav >> text=Billing')).not.toBeVisible();

  // 4. Assert: Direct URL navigation blocked
  await page.goto('/dashboard/settings/billing');
  await expect(page.locator('text=Feature not available')).toBeVisible();
});
```

---

## COPYBOOK — BANNER/BADGE SPECS

### 1. Demo Mode Banner

**Color**: `bg-blue-500` (Tailwind) / `#3b82f6` (Hex)
**Position**: Top of page, below header, full-width
**Height**: `h-10` (40px)
**Text**: "Demo Mode: Viewing sample data from [Bank Name] — No live API calls"
**Dismissible**: No (persistent)
**Icon**: Blue pulsing dot
**z-index**: `z-40` (below modals, above content)

```tsx
<div className="bg-blue-500 text-white px-4 py-2 text-sm font-medium">
  <div className="flex items-center justify-center gap-2 max-w-7xl mx-auto">
    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
    <span>Demo Mode: Viewing sample data from Chase — No live API calls</span>
  </div>
</div>
```

### 2. Sandbox Mode Banner

**Color**: `bg-amber-500` (Tailwind) / `#f59e0b` (Hex)
**Position**: Top of page, below header, full-width
**Height**: `h-10` (40px)
**Text**: "Sandbox: Connected to test API — Calls are not billed"
**Dismissible**: No (persistent)
**Icon**: Amber warning triangle
**z-index**: `z-40`

```tsx
<div className="bg-amber-500 text-white px-4 py-2 text-sm font-medium">
  <div className="flex items-center justify-center gap-2 max-w-7xl mx-auto">
    <AlertTriangle className="w-4 h-4" />
    <span>Sandbox: Connected to test API — Calls are not billed</span>
    <button
      onClick={() => switchEnvironment('production')}
      className="ml-4 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs"
    >
      Switch to Production
    </button>
  </div>
</div>
```

### 3. Production Mode

**Banner**: None (no banner in production)
**Document Title**: "LUMIQ AI Dashboard" (no prefix)
**Badge**: Green "Live" badge in header (optional)

### 4. DataSourceBadge Specs

**Demo Badge**:
- Background: `bg-blue-500/10` (10% opacity blue)
- Text: `text-blue-600 dark:text-blue-400`
- Dot: `bg-blue-500` (no animation)
- Border Radius: `rounded-full`
- Padding: `px-2.5 py-1`
- Font: `text-xs font-medium`

**Sandbox Badge**:
- Background: `bg-amber-500/10`
- Text: `text-amber-600 dark:text-amber-400`
- Dot: `bg-amber-500` (no animation)

**Live Badge**:
- Background: `bg-emerald-50 dark:bg-emerald-500/10`
- Text: `text-emerald-600 dark:text-emerald-400`
- Dot: `bg-emerald-500 animate-pulse` (pulsing animation)

### 5. Document Title Prefixes

```typescript
const TITLE_MAP: Record<Environment, string> = {
  demo: '[DEMO] LUMIQ AI Dashboard',
  sandbox: '[SANDBOX] LUMIQ AI Dashboard',
  production: 'LUMIQ AI Dashboard'
};
```

### 6. Portal Rendering for Banners

**Problem**: Banners inside `backdrop-blur-xl` or `transform` parent get trapped in stacking context.
**Solution**: Use `createPortal(banner, document.body)` to render at document root.

```tsx
import { createPortal } from 'react-dom';

function EnvironmentBanner() {
  const { currentEnvironment } = useEnvironment();

  if (currentEnvironment === 'production') return null;

  const banner = (
    <div className={cn(
      'fixed top-0 left-0 right-0 z-40',
      currentEnvironment === 'demo' ? 'bg-blue-500' : 'bg-amber-500',
      'text-white px-4 py-2 text-sm font-medium'
    )}>
      {/* Banner content */}
    </div>
  );

  return createPortal(banner, document.body);
}
```

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Fix Critical Security Issues (P0)

- [ ] **DEV_BYPASS_AUTH Hardcoded**
  - [ ] Move `DEV_BYPASS_AUTH` to environment variable `VITE_DEV_BYPASS_AUTH`
  - [ ] Default to `false` in `.env.production`
  - [ ] Add build-time validation in `vite.config.ts` (fail build if true in prod)
  - [ ] Add runtime check on app mount (throw if true in prod)

- [ ] **Production Logging Disabled**
  - [ ] Replace `if (isDev)` check in `logger.ts` with level-based filtering
  - [ ] Enable structured logging in production with correlation IDs
  - [ ] Integrate Sentry for error tracking
  - [ ] Add PII redaction middleware

- [ ] **No Tenant Isolation Validation**
  - [ ] Add `invariant(tenant_id)` to all database queries
  - [ ] Add middleware to validate JWT tenant_id === request tenant_id
  - [ ] Add response validation: all items match expected tenant_id
  - [ ] Add canary tests for cross-tenant leakage

### Phase 2: Add Runtime Guardrails (P1)

- [ ] **Runtime Invariant Checks**
  - [ ] Install `tiny-invariant` package
  - [ ] Add `assertTenantIsolation(expected, actual)` helper
  - [ ] Add invariant checks before all tenant-scoped operations
  - [ ] Add custom error types: `TenantIsolationError`, `ConfigurationError`

- [ ] **Server-Side Feature Flags**
  - [ ] Create `/api/feature-flags` endpoint (JWT-validated)
  - [ ] Move `useFeatureFlags()` to fetch from server
  - [ ] Keep client-side flags for optimistic UI, enforce on server
  - [ ] Add flag validation on all protected endpoints

- [ ] **Mode Detection Validation**
  - [ ] Add server endpoint to validate mode from JWT claim
  - [ ] Add localStorage override detection (log warning if mismatch)
  - [ ] Add URL param sanitization (only allow valid modes)

### Phase 3: Improve Observability (P1)

- [ ] **Structured Logging**
  - [ ] Define `LogEntry` type with correlation IDs
  - [ ] Add `logger.info()`, `logger.warn()`, `logger.error()` with structured format
  - [ ] Add `requestId`, `userId`, `tenantId` to all logs
  - [ ] Add log aggregation (Datadog/LogRocket/Sentry)

- [ ] **PII Redaction**
  - [ ] Create allowlist of safe-to-log fields
  - [ ] Add middleware to redact PII before logging
  - [ ] Add tokenization for sensitive identifiers
  - [ ] Add compliance check in CI/CD (fail if PII patterns detected in logs)

- [ ] **Monitoring & Alerts**
  - [ ] Add Sentry for error tracking
  - [ ] Add alerting for tenant isolation violations
  - [ ] Add dashboard for cross-tenant access attempts
  - [ ] Add SLA monitoring per tenant

### Phase 4: UX Improvements (P2)

- [ ] **Persistent Mode Banners**
  - [ ] Create `EnvironmentBanner` component (using `createPortal`)
  - [ ] Show blue banner for demo mode (non-dismissible)
  - [ ] Show amber banner for sandbox mode (non-dismissible)
  - [ ] No banner for production mode

- [ ] **Document Title Prefixes**
  - [ ] Already implemented in `EnvironmentContext.tsx` ✅
  - [ ] Verify it updates on mode switch

- [ ] **DataSourceBadge Enhancements**
  - [ ] Already implemented ✅
  - [ ] Consider adding "Switch Mode" button to badge tooltip

### Phase 5: Testing & Validation (P1)

- [ ] **Canary Tests**
  - [ ] Write canary test: inject tenant A, assert zero tenant B data
  - [ ] Write canary test: attempt cross-tenant access, assert 403
  - [ ] Run canary tests in CI/CD on every deploy

- [ ] **E2E Mode Tests**
  - [ ] Test mode switching (demo → sandbox → production)
  - [ ] Test localStorage override detection
  - [ ] Test banner visibility per mode

- [ ] **Build Validation**
  - [ ] Add Vite plugin to check `DEV_BYPASS_AUTH` at build time
  - [ ] Add TypeScript check for `tenant_id` in all query types
  - [ ] Add ESLint rule to prevent `console.log` in committed code

### Phase 6: Documentation (P2)

- [ ] **Update CLAUDE.md**
  - [ ] Add section on mode detection best practices
  - [ ] Add section on tenant isolation requirements
  - [ ] Add section on production logging requirements

- [ ] **Create Runbook**
  - [ ] Document how to switch modes
  - [ ] Document how to investigate tenant isolation violations
  - [ ] Document how to debug mode detection issues

- [ ] **Update README**
  - [ ] Document environment variables for mode control
  - [ ] Document feature flag architecture
  - [ ] Document logging configuration

---

## CONCLUSION

This playbook provides a comprehensive, 50-year framework for:

1. **Mode Indicators** — Following Stripe/Vercel/Shopify/Firebase patterns for clear visual distinction between demo/sandbox/production
2. **Runtime Assertions** — Fail-fast on security violations, fail-safe on external failures, with clear decision framework
3. **Production Logging** — Structured logging with correlation IDs, multi-layered PII redaction, compliance with GDPR/CCPA
4. **Feature Flags** — Server-side validation, defense in depth, bypass-proof patterns
5. **Multi-Tenant Isolation** — AWS session tags, middleware validation, canary tests, hard invariants

**Immediate Action Items for Lumiq AI Dashboard**:
1. Fix `DEV_BYPASS_AUTH` hardcoding (P0 — CRITICAL SECURITY ISSUE)
2. Enable production logging with PII redaction (P0 — ZERO VISIBILITY)
3. Add tenant isolation invariant checks (P0 — DATA LEAK RISK)
4. Implement server-side feature flag validation (P1)
5. Add persistent mode banners (P2 — UX improvement)

**Success Metrics**:
- Zero production incidents due to DEV_BYPASS_AUTH bypass
- Zero cross-tenant data leakage incidents
- 100% of critical operations logged with correlation IDs
- 100% of database queries scoped by tenant_id
- Mode banners visible 100% of time in non-production environments

---

## SOURCES

### Mode Indicators
- [Stripe Testing Documentation](https://docs.stripe.com/testing-use-cases)
- [Stripe Test Mode Configuration](https://festival-pro.document360.io/docs/new-ui-stripe-test-mode)
- [Vercel Preview Deployments](https://vercel.com/docs/deployments/preview-deployments)
- [Shopify Polaris Banner](https://polaris-react.shopify.com/components/feedback-indicators/banner)
- [Firebase Emulator UI](https://firebase.blog/posts/2020/05/local-firebase-emulator-ui/)
- [Alert Severity Conventions](https://www.cisecurity.org/cybersecurity-threats/alert-level)

### Runtime Assertions
- [Fail-Fast vs Fail-Safe](https://medium.com/javarevisited/failure-is-required-understanding-fail-safe-and-fail-fast-strategies-ac9112fe056d)
- [tiny-invariant](https://www.npmjs.com/package/tiny-invariant)
- [Invariant Pattern](https://sirlisko.com/blog/the-invariant-pattern---cleaner-typescript-with-assertion-functions)

### Production Logging
- [Skyflow - Sensitive Data in Logs](https://www.skyflow.com/post/how-to-keep-sensitive-data-out-of-your-logs-nine-best-practices)
- [Better Stack - Logging Best Practices](https://betterstack.com/community/guides/logging/sensitive-data/)
- [Datadog vs Sentry vs LogRocket](https://betterstack.com/community/comparisons/datadog-vs-sentry/)

### Feature Flags
- [LaunchDarkly - Client-Side Security](https://launchdarkly.com/blog/keeping-client-side-feature-flags-secure/)
- [Statsig - Server-Side Flags](https://www.statsig.com/perspectives/server-side-feature-flags-backend)
- [LaunchDarkly Flag Evaluation](https://docs.launchdarkly.com/sdk/concepts/flag-evaluation-rules)

### Multi-Tenant Isolation
- [AWS SaaS Tenant Isolation](https://docs.aws.amazon.com/whitepapers/latest/saas-tenant-isolation-strategies/run-time-policy-based-isolation-with-iam.html)
- [AWS Lambda Tenant Isolation](https://aws.amazon.com/blogs/compute/building-multi-tenant-saas-applications-with-aws-lambdas-new-tenant-isolation-mode/)
- [AWS STS Session Tags](https://aws.amazon.com/blogs/security/saas-tenant-isolation-with-abac-using-aws-sts-support-for-tags-in-jwt/)
- [Multi-Tenant Authorization Best Practices](https://www.permit.io/blog/best-practices-for-multi-tenant-authorization)
- [Multi-Tenancy Testing](https://testgrid.io/blog/multi-tenancy/)
- [OWASP Multi-Tenant Security](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html)

### Security & Validation
- [Client-Side Validation Bypass](https://medium.com/@anandramesh24/understanding-client-side-validation-bypass-a-security-risk-you-cant-ignore-51f6a9f64f4c)
- [OneUptime Privilege Escalation](https://github.com/OneUptime/oneuptime/security/advisories/GHSA-246p-xmg8-wmcq)
- [Defense in Depth](https://www.cloudflare.com/learning/security/glossary/what-is-defense-in-depth/)

---

**END OF PLAYBOOK**
