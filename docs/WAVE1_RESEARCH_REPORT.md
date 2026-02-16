# WAVE 1: DOCS.FUTEURCREDX.COM — CONSOLIDATED RESEARCH REPORT

**Date:** February 15, 2026
**Agents:** 5 research agents + manual verification
**Status:** RESEARCH COMPLETE — AWAITING WAVE 2 APPROVAL

---

## EXECUTIVE SUMMARY

We deployed 5 research agents simultaneously to analyze every aspect of the docs rebuild. Here's what we found:

| Dimension | Finding |
|-----------|---------|
| **API Surface** | 144 endpoints (sandbox), 141 (prod), 22 tags, 15 schemas |
| **Existing Docs Repo** | Vite + React 18 + Tailwind + Clerk + shadcn/ui (21,672 files) |
| **Current Docs Pages** | DocsLayout shell + API_Reference + Changelog + ContentRenderer |
| **Auth Model** | Dual: X-API-Key (sandbox) + Clerk JWT (production). Most endpoints need org context. |
| **Cross-Tenant** | Verified: Chase key → "Chase SMB National", WF key → "Wells Fargo Business Banking" |
| **Proposed Structure** | 3-panel Plaid-style layout, ~75 BFF endpoints, 16 API sections, ~30 components |
| **Build Approach** | Build-time OpenAPI parsing, 5-language code examples, Algolia search |

---

## 1. API ENDPOINT CATALOG (Agent 1: API Archaeologist)

### 1.1 Spec Comparison

| Metric | Production | Sandbox |
|--------|-----------|---------|
| Total paths | 118 | 120 |
| Total operations | 141 | 144 |
| Tags | 22 | 22 |
| Schemas | 14 | 15 |
| Security | Bearer JWT | Bearer JWT |

**Sandbox-only endpoints (3):**
- `POST /api/v1/dashboard/api-keys` — Create tenant API key
- `GET /api/v1/dashboard/api-keys` — List tenant API keys
- `DELETE /api/v1/dashboard/api-keys/{keyId}` — Revoke tenant API key

### 1.2 Full Endpoint Inventory by Tag

| Tag | Count | Key Endpoints |
|-----|-------|--------------|
| **dashboard** | 20-23 | health, portfolios, customers, scores, offers, applications, batch, risk, analytics, audit-events |
| **businesses** | 13 | CRUD for businesses, insights, stats, me/* pattern |
| **stripe** | 11 | subscriptions, checkout, billing portal, invoices, products, webhooks |
| **developer** | 9 | api-keys, usage, daily usage, batches, prequalifications, quick-score |
| **users** | 9 | CRUD, by-email, change-password, score history, download PDF |
| **portfolios** | 8 | CRUD, add/remove businesses, list businesses |
| **tenants** | 8 | CRUD, members management |
| **webhooks** | 8 | CRUD, rotate-secret, test, delivery stats |
| **security** | 7 | ip-whitelist CRUD, security settings, audit |
| **auth** | 6 | login, refresh-token, profile, send-otp, verify-otp, reset-password |
| **compliance** | 6 | audit-export, decisions, adverse-action, data-export, data-deletion, fair-lending |
| **sandbox** | 6 | info, generate-test-data, mock-score, test-webhook, cleanup, run-tests |
| **API Keys** | 5 | CRUD + stats |
| **ingestion** | 5 | upload CSV/JSON, download templates, history |
| **recommendations** | 4 | list, by-business, applications, stats |
| **experian** | 4 | score, pdf, ext/score, ext/pdf |
| **api-usage** | 3 | analytics, unbilled, bill-now |
| **agreements** | 2 | fetch, fetch-all |
| **audit** | 2 | list by tenant, resource trail |
| **untagged** | 2 | root (/), health |
| **user-event-log** | 1 | getUserEventLogs |
| **sbss** | 1 | getSbssScore |

### 1.3 Schema Inventory (15 DTOs)

| Schema | Props | Required | Key Fields |
|--------|-------|----------|------------|
| CreateUserDto | 20 | 18 | clerkId, email, password, businessName, streetAddress, city, state... |
| UpdateUserDto | 18 | 0 | All user fields optional |
| ChangePasswordDto | 2 | 2 | oldPassword, newPassword |
| CreatePortfolioDto | 3 | 2 | name, code, config |
| UpdatePortfolioDto | 4 | 0 | name, code, config, isActive |
| CreateTenantDto | 3 | 1 | name, clerkOrgId, config |
| UpdateTenantDto | 4 | 0 | name, clerkOrgId, config, isActive |
| CreateCrsCreditDto | 3 | 3 | name, city, state |
| CreateCheckoutSession | 5 | 5 | priceId, customerId, successUrl, cancelUrl, isTrial |
| CreateSubscriptionDto | 2 | 2 | priceId, customerId |
| UpdateSubscriptionDto | 1 | 1 | priceId |
| CreateCustomerBillingPortal | 2 | 2 | customerId, returnUrl |
| CreateTicketDTO | 2 | 2 | issue, message |
| RevenueCatWebHook | 2 | 2 | app_user_id, type |
| CreateTenantApiKeyDto | 0 | 0 | (sandbox-only) |

---

## 2. EXISTING DOCS REPO STRUCTURE (Agent 2: Repo Surgeon)

### 2.1 Tech Stack

| Component | Version |
|-----------|---------|
| React | 18.3 |
| Vite | 5.4 |
| TypeScript | 5.5 |
| Tailwind CSS | 3.4 |
| shadcn/ui (Radix) | Full suite (50+ components) |
| Clerk | 5.49 |
| Recharts | 2.12 |
| Framer Motion | 12.23 |
| react-syntax-highlighter | 15.6 |
| Zustand | 5.0 |
| TanStack React Query | 5.56 |

### 2.2 Routing Architecture

The app uses **hostname-based routing**:

```
docs.futeurcredx.com → DocsLayout (full takeover)
institutions.futeurcredx.com → Enterprise page
platform.futeurcredx.com → Fintech page
www.futeurcredx.com → MainLayout (all routes)
```

**DocsLayout routes:**
```
/             → DocsPage (ContentRenderer)
/api-docs     → ApiReferencePage
/changelog    → ChangelogPage
```

### 2.3 Key Documentation Files

| File | Lines | Purpose |
|------|-------|---------|
| `src/pages/Documentation/DocsLayout.tsx` | 25 | Shell: Header + Routes + Footer |
| `src/pages/Documentation/DocsHeader.tsx` | 111 | Search bar, theme toggle, nav |
| `src/pages/Documentation/Docs.tsx` | 71 | Content page with section nav |
| `src/pages/Documentation/API_Reference.tsx` | 296 | Endpoint docs with code examples |
| `src/pages/Documentation/Changelog.tsx` | 61 | Single entry (Aug 2025 launch) |
| `src/pages/Documentation/CleanFooter.tsx` | 240 | Links to www.futeurcredx.com |
| `src/components/content/ContentRenderer.tsx` | — | Renders doc sections (intro, dashboard, quickstart) |
| `src/data/api-data.ts` | — | Hardcoded API endpoint data |
| `src/data/mock-responses.ts` | — | Mock API response examples |
| `src/data/docs-data.ts` | — | Documentation content |

### 2.4 Existing API Reference Implementation

`API_Reference.tsx` already has:
- Method badges (GET/POST/PUT/DELETE)
- Code generation (curl examples via `generateCurl()`)
- Mock responses display
- Syntax highlighting (Prism/vscDarkPlus)
- Copy button
- Base URL: `https://futeur.app/api/v1`

**Limitations:**
- Hardcoded endpoint data (not from OpenAPI spec)
- Single language (curl only)
- No "Try It" functionality
- No collapsible schema trees
- No right-side TOC

### 2.5 Vercel Config

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://staging.futeur.app/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Note:** API proxy goes to `staging.futeur.app`, NOT `api.sandbox.futeurcredx.com`. This needs updating.

### 2.6 Build Status

Build FAILS: Missing `@rollup/rollup-darwin-arm64`. Standard `npm install` needed before build.

### 2.7 Footer Cross-Links

CleanFooter links to `www.futeurcredx.com`:
- Products: FuteurCredX App, LumiqAI
- Solutions: Consumers, Institutions, Fintechs
- Partners: Ecosystem, Technology
- Company: About Us, Legal, Support, Contact

---

## 3. INDUSTRY PATTERNS (Agent 3: Plaid/Stripe Reverse Engineer)

### 3.1 Layout Pattern: Three-Panel Design

```
┌──────────────────────────────────────────────────┐
│ Header (sticky): Logo | Search | Dark/Light      │
├──────────┬──────────────────────┬────────────────┤
│ SIDEBAR  │ CONTENT              │ TABLE OF       │
│ (280px)  │ (flexible)           │ CONTENTS       │
│          │                      │ (250px)        │
│ Nav tree │ Endpoint docs        │ H2 scroll spy  │
│ (sticky) │ Code examples        │ (sticky)       │
│          │ Schema viewers       │                │
│          │ Try It button        │                │
└──────────┴──────────────────────┴────────────────┘
```

### 3.2 Navigation: Domain-First Organization

**Recommended structure (maps to FuteurCredX API):**

```
Getting Started
├── Quickstart (5 min to first call)
├── Authentication (JWT + API Key)
├── Rate Limits & Quotas
└── SDK Installation

Core Concepts
├── Portfolios & Tenant Isolation
├── SMB Entities (Customers)
├── RBAC (5 roles, 16 permissions)
├── Audit Trail
└── Data Models

API Reference (by domain)
├── Customers API (5 endpoints)
├── Credit Scores API (4 endpoints)
├── Offers API (3 endpoints)
├── Applications API (5 endpoints)
├── Reports API (5 endpoints)
├── Risk Management API (6 endpoints)
├── Analytics API (8 endpoints)
├── API Keys API (6 endpoints)
├── Batch Operations (3 endpoints)
├── Audit & Compliance (2 endpoints)
├── Campaigns API (5 endpoints)
├── Products API (2 endpoints)
├── Portfolios API (4 endpoints)
├── Notifications API (5 endpoints)
├── Settings API (9 endpoints)
└── Underwriting API (5 endpoints)

Guides & Tutorials
├── Customer Onboarding Flow
├── Credit Score Analysis
├── Building Offer Engines
├── Risk Monitoring & Alerts
├── Batch Processing
└── Webhook Integration

Error Reference
├── HTTP Status Codes
├── Error Codes by Domain
└── Retry Strategy

Webhooks & Events
├── Event Types
├── Subscribing to Events
├── Testing Webhooks
└── Retry Logic & Signatures

SDKs & Tools
├── Node.js / Python / Go / Java
├── Postman Collection
└── OpenAPI Specification

API Console (Interactive)
├── Test Any Endpoint
└── Debug Errors

Changelog
```

### 3.3 Key Design Patterns to Adopt

| Pattern | Source | Description |
|---------|--------|-------------|
| Language switcher | Plaid/Stripe | Global toggle: curl, Node, Python, Go, Java — persists via localStorage |
| Collapsible schema | Both | Recursive tree for nested JSON objects |
| "Try It" console | Stripe | Side drawer with form fields, execute button, live response |
| Scroll spy TOC | Both | Right sidebar highlights current H2 as user scrolls |
| API key injection | Stripe | Logged-in users see real test keys in code examples |
| Search | Both | Algolia DocSearch (free for docs, industry standard) |
| Dark mode | Both | System-aware default, manual toggle, persisted |

### 3.4 Component Inventory for Build

**Layout (5):** DocsLayout, Sidebar, NavTree, TableOfContents, Header
**Content (7):** EndpointHeader, ParametersSection, RequestBodySection, ResponseSection, CodeExamplesSection, SchemaViewer, RelatedLinks
**Interactive (6):** LanguageSelector, CodeBlockWithCopy, TryItConsole, RequestBuilder, ResponseViewer, SearchBar
**Total: ~25-30 custom components**

---

## 4. LIVE API TESTING (Agent 4 + Manual Verification)

### 4.1 Authentication Architecture

| Auth Method | Header | Endpoints | Status |
|-------------|--------|-----------|--------|
| **X-API-Key** | `X-API-Key: sk_test_*` | API Keys CRUD, stats | Working |
| **Bearer JWT** | `Authorization: Bearer <token>` | Most dashboard endpoints | Requires org context |
| **None** | — | `/`, `/health` | Working |

**Critical Finding:** Most dashboard/domain endpoints return `403 "Organization context required"` with API key alone. They need a Clerk JWT with organization context, OR the BFF client's tenant isolation headers.

### 4.2 Live Response Examples

**GET /** (No auth)
```json
"Welcome to LumiqAI API v1.0"
// HTTP 200, ~0.07s
```

**GET /health** (No auth)
```json
{
  "status": "ok",
  "message": "API is healthy",
  "timestamp": "2026-02-15T22:28:09.445Z"
}
// HTTP 200, ~0.08s
```

**GET /api/v1/dashboard/health** (API Key)
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-02-15T22:27:27.323Z",
    "version": "1.0.0"
  },
  "error": null,
  "meta": {
    "dataSources": ["prisma"],
    "lastUpdated": "2026-02-15T22:27:27.323Z"
  }
}
// HTTP 200, ~0.30s
```

**GET /api/v1/api-keys** (API Key)
```json
{
  "apiKeys": [],
  "total": 0
}
// HTTP 200, ~0.18s
```

**GET /api/v1/api-keys/stats** (API Key)
```json
{
  "stats": {
    "development": { "totalKeys": 0, "totalUsage": 0 },
    "production": { "totalKeys": 0, "totalUsage": 0 }
  },
  "message": "API key usage statistics retrieved successfully"
}
// HTTP 200, ~0.25s
```

**403 Error Pattern** (Most dashboard endpoints with API key only)
```json
{
  "success": false,
  "data": null,
  "error": "Organization context required",
  "meta": null
}
// HTTP 403
```

**401 Error Pattern** (Invalid credentials)
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### 4.3 Auth Method Testing

| Test | Status | Response Time |
|------|--------|--------------|
| Valid API Key → dashboard/health | 200 | 0.093s |
| Invalid API Key → dashboard/health | 403 | 0.098s |
| No Auth → dashboard/health | 403 | 0.078s |
| Fake JWT → dashboard/health | 401 | 0.069s |

### 4.4 Cross-Tenant Isolation (VERIFIED)

| Bank | API Key Prefix | Portfolio Response |
|------|---------------|-------------------|
| Chase | `sk_test_3DTx...9284` | "Chase SMB National" |
| Wells Fargo | `sk_test_PUjL...ad66` | "Wells Fargo Business Banking" |

Tenant isolation is working correctly — each API key returns only its own bank's data.

---

## 5. ECOSYSTEM MAP (Agent 5 + Manual)

### 5.1 Current Docs Site Routes

All routes return 200 (SPA catches all paths):

| Route | Content |
|-------|---------|
| `/` | Documentation home (ContentRenderer) |
| `/api-docs` | API Reference page |
| `/docs` | Alias → Documentation home |
| `/changelog` | Single changelog entry |
| `/api-reference` | Alias → API Reference |
| `/quickstart` | SPA catch → 404 page |
| `/getting-started` | SPA catch → 404 page |
| `/pricing` | Pricing page |
| `/enterprise` | Enterprise page |
| `/business` | Business page |
| `/login` | Clerk login |
| `/signup` | Clerk signup |
| `/contact` | Contact form |
| `/about` | About page |

### 5.2 Cross-Site Link Map

| Domain | Purpose | Links To Docs? |
|--------|---------|----------------|
| `www.futeurcredx.com` | Marketing homepage | Footer → `/api-docs` |
| `docs.futeurcredx.com` | Documentation (THIS REBUILD) | Footer → www |
| `db.futeurcredx.com` | Lumiq AI Dashboard | Partner Portal → docs |
| `institutions.futeurcredx.com` | Enterprise/banks landing | — |
| `enterprise.futeurcredx.com` | Enterprise web app | — |
| `chase.futeurcredx.com` | Chase bank site | — |
| `wells-fargo.futeurcredx.com` | Wells Fargo bank site | — |
| `santander.futeurcredx.com` | Santander bank site | — |
| `citibank.futeurcredx.com` | Citi bank site | — |
| `sandbox.futeurcredx.com` | Lumiq sandbox deployment | — |
| `api.sandbox.futeurcredx.com` | Sandbox API (NestJS) | Swagger UI at `/docs-json` |
| `api.lumiq.futeurcredx.com` | Production API | Swagger UI at `/docs-json` |

### 5.3 Vercel Project Config

| Project | Repo | Domain | Framework |
|---------|------|--------|-----------|
| `futeur-cred-website` | `FuteurProducts/futeurcredx-docs` | `docs.futeurcredx.com` | Vite |

---

## 6. WHAT EXISTS vs WHAT NEEDS BUILDING

### 6.1 Keep / Reuse

| Asset | Location | Reuse? |
|-------|----------|--------|
| React + Vite + Tailwind stack | Entire repo | YES — same foundation |
| shadcn/ui components (50+) | `src/components/ui/` | YES — core UI library |
| Dark mode (next-themes) | Already configured | YES |
| Clerk auth integration | `src/contexts/AuthContext.tsx` | YES — for API key injection |
| react-syntax-highlighter | Already installed | YES — code blocks |
| DocsHeader with search | `src/pages/Documentation/DocsHeader.tsx` | PARTIAL — needs sidebar |
| CleanFooter | `src/pages/Documentation/CleanFooter.tsx` | YES — update links |
| Domain routing logic | `src/App.tsx` | YES — hostname detection |

### 6.2 Gut / Replace

| Current | Problem | Replace With |
|---------|---------|-------------|
| Hardcoded `api-data.ts` | Static, incomplete | Build-time OpenAPI parsing |
| `mock-responses.ts` | Fake data | Real response examples |
| Single API_Reference.tsx (296 lines) | Monolithic, curl-only | Per-domain endpoint pages |
| ContentRenderer (introduction only) | Limited content | Full guide pages |
| DocsLayout (25 lines, flat routes) | No sidebar, no TOC | 3-panel layout |

### 6.3 Build New

| Component | Priority | Effort |
|-----------|----------|--------|
| **DocsLayout** (3-panel) | P0 | Medium |
| **Sidebar** (collapsible nav tree) | P0 | Medium |
| **TableOfContents** (scroll spy) | P1 | Small |
| **EndpointPage** (reusable template) | P0 | Large |
| **LanguageSelector** (5 langs) | P0 | Medium |
| **CodeBlockWithCopy** | P0 | Small |
| **SchemaViewer** (collapsible tree) | P1 | Medium |
| **TryItConsole** (side drawer) | P1 | Large |
| **RequestBuilder** (form from params) | P1 | Medium |
| **ResponseViewer** (JSON viewer) | P1 | Small |
| **SearchBar** (Algolia or fuse.js) | P2 | Medium |
| **Quickstart page** | P0 | Medium |
| **Authentication guide** | P0 | Medium |
| **Error reference** | P1 | Small |
| **16 API domain pages** | P0 | Large (templated) |
| **OpenAPI parser script** | P0 | Medium |

---

## 7. RECOMMENDED BUILD APPROACH

### 7.1 Option A: Rebuild In-Place (RECOMMENDED)

**Modify the existing `FuteurProducts/futeurcredx-docs` repo:**
- Keep: Vite, React, Tailwind, shadcn/ui, Clerk, package.json
- Replace: `src/pages/Documentation/` entirely
- Add: `src/docs/` directory with new component tree
- Update: `src/App.tsx` DocsLayout routing

**Pros:** No migration, same Vercel project, same domain config
**Cons:** Legacy code to clean up

### 7.2 Option B: Fresh Repo

**Create new `FuteurProducts/futeurcredx-api-docs` repo:**
- Fresh Vite + React 19 + Tailwind 4 setup
- Copy only shadcn/ui components needed
- No legacy baggage

**Pros:** Clean start, latest versions
**Cons:** New Vercel project needed, domain reconfiguration

### 7.3 Recommendation

**Option A (in-place)** — the existing repo already has the right stack, domain routing, Clerk auth, and 50+ shadcn components. Rebuilding the `src/pages/Documentation/` directory is faster than starting fresh.

### 7.4 Tech Stack Additions

```json
{
  "new_dependencies": {
    "@docsearch/react": "^3.5.0",      // Algolia search (or fuse.js for client-side)
    "shiki": "^1.0.0"                   // Better syntax highlighting (replaces react-syntax-highlighter)
  },
  "new_devDependencies": {
    "@apidevtools/swagger-parser": "^10.1.0"  // OpenAPI spec validation & parsing
  }
}
```

### 7.5 API Base URL Fix

Current: `https://staging.futeur.app/api/:path*`
Should be: `https://api.sandbox.futeurcredx.com/api/:path*`

---

## 8. AUTH DOCUMENTATION ARCHITECTURE

### 8.1 Two Auth Flows for Docs

**Flow 1: Sandbox (Developers)**
```
1. Sign up at docs.futeurcredx.com
2. Get API key from dashboard
3. Use X-API-Key header
4. Access: API Keys, health, basic endpoints
5. Dashboard endpoints: Need portfolioId + org context
```

**Flow 2: Production (Partners)**
```
1. Clerk account with organization
2. Get JWT from Clerk
3. Use Authorization: Bearer header
4. Full access to all endpoints
```

### 8.2 "Try It" Console Auth

The interactive console should:
1. Check if user is logged in (Clerk)
2. If yes: Use JWT automatically
3. If no: Prompt for API key input
4. Show which auth method is being used
5. Display real responses

---

## 9. CRITICAL FINDINGS & RISKS

| Finding | Impact | Mitigation |
|---------|--------|------------|
| Most endpoints need org context, not just API key | Sandbox "Try It" limited | Document which endpoints work with API key vs JWT |
| OpenAPI spec exists at `/docs-json` but has generic controller names | Auto-generated docs will have bad names | Post-process: map controller names to human-readable |
| Existing repo has 21K files (huge) | Slow clones, large bundles | Clean up node_modules, dist from git history |
| API proxy points to wrong host | "Try It" would hit staging.futeur.app | Update vercel.json to api.sandbox.futeurcredx.com |
| Build fails (missing rollup module) | Can't deploy immediately | `npm install` + fix lockfile before any changes |
| Only 1 changelog entry (Aug 2025) | Looks abandoned | Add entries for API updates, new endpoints |
| Footer links point to non-existent routes | Broken links | Update footer to real routes |

---

## 10. PROPOSED WAVE 2 AGENT ALLOCATION

Based on this research, here's the recommended Wave 2 (Design) swarm:

| Agent | Task | Files |
|-------|------|-------|
| **Agent A: Layout Architect** | Build 3-panel DocsLayout, Sidebar, TOC, responsive breakpoints | `src/docs/components/DocsLayout.tsx`, `Sidebar.tsx`, `TableOfContents.tsx` |
| **Agent B: Design System** | Theme tokens, code block styling, dark mode, typography | `src/docs/styles/`, `tailwind.config.ts` updates |
| **Agent C: Endpoint Template** | Reusable EndpointPage component, ParametersSection, ResponseSection | `src/docs/components/EndpointPage.tsx` and children |
| **Agent D: Interactive Console** | TryItConsole drawer, RequestBuilder, ResponseViewer, LanguageSelector | `src/docs/components/TryIt/` |
| **Agent E: Content Strategy** | OpenAPI parser script, quickstart content, auth guide, error reference | `src/docs/lib/`, `src/docs/pages/` |

---

## END OF WAVE 1 REPORT

**Next Steps:**
1. Review this report
2. Approve/modify proposed navigation structure
3. Decide: Option A (in-place) or Option B (fresh repo)
4. Decide: Algolia DocSearch vs client-side search (fuse.js)
5. Approve Wave 2 agent allocation
6. Launch Wave 2 (Design + Build)
