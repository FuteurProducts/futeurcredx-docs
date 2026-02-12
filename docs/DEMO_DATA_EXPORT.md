# LUMIQ AI Dashboard — Complete Demo Data Architecture & Export

> Generated: 2026-02-12
> Total files: 48 | Banks: 4 | Domains: 13 dashboard tabs

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Bank Resolution Logic](#bank-resolution-logic)
3. [File Inventory](#file-inventory)
4. [Data Schema Reference](#data-schema-reference)
5. [Per-Bank Data Summary](#per-bank-data-summary)
6. [Shared/Cross-Bank Data](#shared-cross-bank-data)
7. [Demo Data Registry (BFF Mapping)](#demo-data-registry)
8. [Session Store (Mutable State)](#session-store)
9. [API Sync Guide](#api-sync-guide)

---

## 1. Architecture Overview

```
                        bankConfig.ts
                     (subdomain/pathname → BankId)
                              │
                              ▼
              ┌──────────────────────────────┐
              │      ACTIVE_BANK_ID          │
              │  'chase' | 'wellsfargo'      │
              │  'santander' | 'citi'        │
              └──────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        Hub Files         Portfolio       Fallback
    chaseDemoData.ts    Segments.ts    fallback/demoData.ts
    (14 exports)        (9 exports)    (shared data)
              │               │               │
    ┌─────┬──┴──┬─────┐     bank-switched    bank-switched
    ▼     ▼     ▼     ▼
  Risk  Campaign UW  Filter
  Loader Loader Loader Loader
    │     │     │     │
    └─────┴─────┴─────┘
              │
         Source JSON
      (chase/wf/sant/citi.json)
```

### Data Flow
1. `bankConfig.ts` resolves `ACTIVE_BANK_ID` from subdomain → pathname → query → env → default
2. Hub files (`chaseDemoData.ts`) use `ACTIVE_BANK_ID` in `Record<BankId, T>` map lookups
3. Loaders transform raw JSON into typed TypeScript objects
4. `demoDataRegistry.ts` maps BFF service domains to demo data exports
5. `useBffQuery` uses registry to serve demo data when `isDemoMode === true`
6. `demoDataStore.ts` provides session-level mutations (approve/decline/score pull)

---

## 2. Bank Resolution Logic

### Environment Detection (`EnvironmentContext.tsx`)
| Priority | Check | Result |
|----------|-------|--------|
| 1 | `pathname.startsWith('/demo/')` | `demo` |
| 2 | `hostname.match(/\.demo\./)` | `demo` |
| 3 | `hostname.startsWith('sandbox.')` | `sandbox` |
| 4 | `hostname.startsWith('app.')` | `production` |
| 5 | `?mode=sandbox\|production` | that mode |
| 6 | `localStorage('lumiq-environment')` | that mode |
| 7 | default | `sandbox` |

### Bank Detection (`bankConfig.ts`)
| Priority | Check | Example | Result |
|----------|-------|---------|--------|
| 1 | Subdomain | `santander.demo.futeurcredx.com` | `santander` |
| 2 | Route path | `/demo/santander` | `santander` |
| 3 | Query param | `?bank=santander` | `santander` |
| 4 | Env var | `VITE_BANK_ID=santander` | `santander` |
| 5 | Default | — | `chase` |

### Live URLs
| URL | Environment | Bank |
|-----|-------------|------|
| `chase.demo.futeurcredx.com` | demo | chase |
| `wellsfargo.demo.futeurcredx.com` | demo | wellsfargo |
| `santander.demo.futeurcredx.com` | demo | santander |
| `citi.demo.futeurcredx.com` | demo | citi |
| `sandbox.futeurcredx.com` | sandbox | N/A (empty states) |
| `app.futeurcredx.com` | production | N/A (real API) |

---

## 3. File Inventory

### Source JSON (raw bank data)
| File | Lines | Businesses | Exposure | Key Differentiation |
|------|-------|-----------|----------|---------------------|
| `chase.json` | 1607 | 6M | $650B | Largest US bank, 48 states, $4T assets |
| `wellsfargo.json` | 1416 | 3.3M | $670B | Agricultural focus, SBA rural lending |
| `santander.json` | 1334 | 180K | $8B | Northeast regional, Hispanic business focus |
| `citi.json` | 974 | 450K | $98.4B | International trade, cross-border focus |

### Per-Bank Loaders (6 per bank = 24 total)
| Loader | Exports | Description |
|--------|---------|-------------|
| `{bank}DataLoader.ts` | `{PREFIX}_PILOT_METRICS`, `{PREFIX}_DEMO_BUSINESSES` | Dashboard KPIs + first 10 enriched businesses |
| `{bank}PortfolioLoader.ts` | `{PREFIX}_PORTFOLIO`, `{PREFIX}_SEGMENTS`, `{PREFIX}_RISK_TIERS` | Portfolio overview, segments, risk tiers |
| `{bank}CampaignLoader.ts` | `{PREFIX}_CAMPAIGNS`, `{PREFIX}_CAMPAIGN_SUMMARY`, `{PREFIX}_CONVERSION_BY_SEGMENT` | Campaign funnels + segment conversion |
| `{bank}RiskLoader.ts` | `{PREFIX}_RISK_KPIS`, `{PREFIX}_CONCENTRATION`, `{PREFIX}_EWS_CLUSTERS`, `{PREFIX}_COMPLIANCE` | Risk intelligence, EWS, fair lending |
| `{bank}UnderwritingLoader.ts` | `{PREFIX}_UNDERWRITING` (.kpis, .queue, .rules) | Underwriting queue + auto-approve/decline rules |
| `{bank}FilterLoader.ts` | `{PREFIX}_FILTER_OPTIONS`, `{PREFIX}_SAVED_SEGMENTS`, `{PREFIX}_SAMPLE_BUSINESSES` | Filters, saved segments, 50 sample businesses |

### Per-Bank Portfolio Segments (1 per non-Chase bank = 3 total)
| File | Lines | Exports |
|------|-------|---------|
| `wellsfargoPortfolioSegments.ts` | 772 | 9 exports (WF_INDUSTRY_SEGMENTS, WF_PORTFOLIO_KPIS, etc.) |
| `santanderPortfolioSegments.ts` | 839 | 9 exports (SANT_INDUSTRY_SEGMENTS, SANT_PORTFOLIO_KPIS, etc.) |
| `citiPortfolioSegments.ts` | 785 | 9 exports (CITI_INDUSTRY_SEGMENTS, CITI_PORTFOLIO_KPIS, etc.) |

### Hub Files (bank-switched exports)
| File | Lines | Purpose |
|------|-------|---------|
| `chaseDemoData.ts` | ~200 | Hub: types + 14 bank-switched exports via ACTIVE_BANK_ID map |
| `wellsfargoDemoData.ts` | 43 | Re-export hub with WF_ prefix |
| `santanderDemoData.ts` | 79 | Re-export hub with SANT_ prefix |
| `citiDemoData.ts` | 43 | Re-export hub with CITI_ prefix |
| `portfolioSegments.ts` | 1224 | Bank-switched portfolio analytics (Chase baseline + 3 variants) |

### Shared Data Files
| File | Lines | Purpose |
|------|-------|---------|
| `fallback/demoData.ts` | 762 | PILOT_METRICS, DEMO_BUSINESSES, enriched businesses, API trends, system services, activities, webhooks |
| `demoData.ts` | 6 | Re-export from `fallback/demoData.ts` (backwards compat) |
| `demoDataStore.ts` | ~200 | Session-aware mutable store (approve/decline/score pull) |
| `demoDataRegistry.ts` | ~150 | BFF domain → demo data mapping |
| `bankConfig.ts` | 63 | Runtime bank resolution |
| `customerDemoData.ts` | 474 | 41 customer records for Customer Engagement tab |
| `customerPageDemoData.ts` | 266 | 8 customers + health summary + lifecycle + recommendations |
| `creditSignalsData.ts` | 171 | Signal-based credit profiles (2 detailed profiles) |
| `riskDemoData.ts` | 315 | Risk Intelligence tab (KPIs, heatmaps, EWS, models, stress) |
| `underwritingDemoData.ts` | 396 | 5 underwriting cases with signals, policy checks, benchmarks |
| `productCatalogData.tsx` | ~100 | 7 API products (Credit Score, Report, Experian, etc.) |

---

## 4. Data Schema Reference

### Core Types (from `chaseDemoData.ts`)

```typescript
interface Segment {
  id: string;              // 'seg_professional'
  name: string;            // 'Professional Services'
  businesses: number;      // 1080000
  exposure: string;        // '$97.2B'
  avgScore: number;        // 74.2
  riskDistribution: { low: number; moderate: number; elevated: number; high: number; critical: number; };
  topProducts: string[];   // ['Business Line of Credit', ...]
  conversionRate: number;  // 42.1
  trend: 'up' | 'down' | 'stable';
  status: 'healthy' | 'watch' | 'at_risk';
}

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'scheduled';
  segment: string;
  targetAudience: string;
  offerType: string;
  startDate: string;       // ISO date
  endDate: string;
  funnel: { pushed: number; viewed: number; applied: number; approved: number; };
  viewRate: number;
  applyRate: number;
  approvalRate: number;
  estimatedRevenue: string;
  health: 'excellent' | 'good' | 'needs_attention' | 'at_risk';
}

interface EWSCluster {
  id: string;
  type: string;            // 'REVENUE_DECLINE'
  severity: 'low' | 'moderate' | 'high' | 'critical';
  businessCount: number;
  exposure: string;
  heaviestSegment: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  actions: string[];
}

interface UnderwritingQueueItem {
  id: string;
  businessName: string;
  product: string;         // 'EQUIPMENT' | 'LOC' | 'TERM' | 'SBA'
  amount: string;
  lumiqScore: number;
  riskLevel: string;       // 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL'
  hoursInQueue: number;
  slaStatus: string;       // 'ok' | 'warning' | 'breach'
  industry: string;
  state: string;
}

interface SampleBusiness {
  id: string;
  name: string;
  industry: string;
  state: string;
  revenue: string;
  lumiqScore: number;
  riskTier: string;
  status: string;          // 'Approved' | 'Offer Sent' | 'Qualified' | 'Under Review' | 'Not Eligible'
  productsHeld: number;
  segment: string;
}

interface SavedSegment {
  id: string;
  name: string;
  description: string;
  criteria: string;
  businessCount: number;
  exposure: string;
}
```

### Enriched Business (from `fallback/demoData.ts`)
```typescript
interface EnrichedBusiness {
  id: string;              // 'biz-001'
  name: string;            // 'Stellar Dynamics LLC'
  industry: string;
  type: string;            // 'LLC', 'Corp', etc.
  state: string;
  city: string;
  annualRevenue: number;
  employees: number;
  yearsInBusiness: number;
  creditScore: number;     // LUMIQ composite (0-100)
  riskTier: string;
  relationshipHealth: number; // RHS (0-100)
  products: string[];      // Products held
  owner: DemoBusinessOwner;
  creditHistory: DemoCreditScore[];
  applications: DemoApplication[];
  documents: DemoDocument[];
}
```

### Customer Demo Record (from `customerDemoData.ts`)
```typescript
interface CustomerDemoRecord {
  id: string;              // 'biz-001'
  businessName: string;
  legalName: string;
  industry: string;
  naicsCode: string;
  city: string;
  state: string;
  annualRevenue: number;
  employeeCount: number;
  yearsInBusiness: number;
  riskTier: string;
  segment: string;         // 'micro' | 'small' | 'mid-market'
  region: string;          // 'Northeast' | 'Southeast' | 'Midwest' | 'Southwest' | 'West'
  relationshipStage: string; // 'prospect' | 'new' | 'growing' | 'mature' | 'at-risk'
  rhs: number;             // Relationship Health Score
  rhsChange: number;
  products: string[];
  primaryProduct: string;
  assignedRM: string;
  depositBalance: number;
  totalExposure: number;
  productCount: number;
  lastActivity: string;    // ISO date
}
```

### Credit Signal Profile (from `creditSignalsData.ts`)
```typescript
interface CreditSignal {
  category: string;        // 'Trade Credit' | 'Financial' | 'Banking' | 'Secured' | 'Personal Guarantor'
  label: string;
  strength: 'strong' | 'moderate' | 'weak';
  detail: string;
  source: string;          // 'D&B' | 'Experian' | 'Plaid' | 'Internal'
  updatedAt: string;
}

interface BureauIndicator {
  bureau: string;          // 'D&B' | 'Experian' | 'FICO'
  scoreName: string;       // 'PAYDEX' | 'Intelliscore Plus' | 'SBSS'
  value: number;
  range: string;           // '0-100' | '1-100' | '0-300'
  trend: 'up' | 'down' | 'stable';
  asOf: string;
}

interface ProductReadinessItem {
  product: string;
  readiness: 'likely' | 'borderline' | 'unlikely';
  factors: string[];
  estimatedLimit: string;
}
```

### Underwriting Case (from `underwritingDemoData.ts`)
```typescript
interface CaseApplication {
  caseId: string;          // 'CASE-2026-001'
  businessName: string;
  businessId: string;
  product: string;
  requestedAmount: number;
  status: string;          // 'in_review' | 'pending_review' | 'conditional' | 'declined'
  assignedTo: string | null;
  daysInQueue: number;
  riskLevel: string;       // 'LOW' | 'MODERATE' | 'ELEVATED'
  signals: SignalSummary[];
  policyChecks: PolicyCheck[];
  comparatives: ComparativeBenchmark[];
  recommendation: string;
  recommendationRationale: string;
  notes: string[];
}
```

---

## 5. Per-Bank Data Summary

### Chase (Prefix: `CHASE_`)
| Metric | Value |
|--------|-------|
| Total Businesses | 6,000,000 |
| Total Exposure | $650B |
| Avg LUMIQ Score | 71.4 |
| Pre-Qualified Rate | 67% |
| Branches | 4,827 |
| States | 48 |
| Assets | $4T |
| Industry Segments | 8 (Professional, Retail, Food, Healthcare, Construction, Tech, Manufacturing, Transportation) |
| Risk Tiers | 5 (LOW 40%, MODERATE 28%, ELEVATED 18%, HIGH 10%, CRITICAL 4%) |
| Active Campaigns | 3 (Healthcare LOC Q1, Tech Term Loan, Retail Equipment) |
| Underwriting Queue | 15 applications ($165K-$625K) |
| Sample Businesses | 50 |
| Saved Segments | 4 (High Value Professional 540K, Texas Focus 360K, At Risk Construction 94K, Cross-Sell 2.01M) |
| EWS Clusters | 4 (Revenue Decline, Payment Stress, Industry Headwind, Geographic Risk) |
| Portfolio At Risk | $84.5B (13%) |
| Fair Lending Approval Rate | 72% |

### Wells Fargo (Prefix: `WF_`)
| Metric | Value |
|--------|-------|
| Total Businesses | 3,300,000 |
| Total Exposure | $670B |
| Avg LUMIQ Score | ~70 |
| Industry Segments | 8 (Tech, Professional, Manufacturing, Retail, Healthcare, Construction, Food/Agriculture, Transportation) |
| Active Campaigns | 3 (BusinessLine LOC, SBA 7(a) Rural, Equipment Finance) |
| Underwriting Queue | 15 applications |
| Sample Businesses | 50 |
| Saved Segments | 4 (High Value Tech, California Focus, At Risk Construction, Agricultural Lending) |
| EWS Clusters | 3 clusters |
| Key Differentiator | Agricultural lending focus, SBA rural programs |

### Santander (Prefix: `SANT_`)
| Metric | Value |
|--------|-------|
| Total Businesses | 180,000 |
| Total Exposure | $8B |
| Avg LUMIQ Score | 64.8 (FICO 648) |
| Pre-Qualified Rate | 62% |
| HQ | Boston, MA |
| Focus | Northeast Regional, Top 25 US Bank |
| Industry Segments | 4 primary (Pre-Qualified, Growth Opportunity, Needs Monitoring, At Risk) + 12 industry |
| Risk Tiers | 5 (LOW 41%, MODERATE 27.9%, ELEVATED 18.2%, HIGH 10%, CRITICAL 2.9%) |
| Active Campaigns | 3 (Northeast Growth, Hispanic Partnership, Multifamily Real Estate) |
| Underwriting Queue | 15 applications |
| Sample Businesses | 50 |
| Saved Segments | 4 (Northeast Professional 21.6K, Hispanic Growth 14.4K, Multifamily 7.2K, SBA Eligible 18K) |
| Geographic Concentration | Northeast 63.5% |
| Industry Concentration | Real Estate 21.4% |
| Key Differentiator | Hispanic business community, Northeast concentration, multifamily real estate |

### Citi (Prefix: `CITI_`)
| Metric | Value |
|--------|-------|
| Total Businesses | 450,000 |
| Total Exposure | $98.4B |
| Industry Segments | 8 (Technology, Professional, Healthcare, Retail, Manufacturing, Real Estate, Food Service, Other) |
| Active Campaigns | 3 |
| Underwriting Queue | 15 applications |
| Sample Businesses | 50 |
| Saved Segments | 5 |
| EWS Clusters | 5 (Score Drop, Delinquency, Lien, Bankruptcy, International Trade Risk) |
| Product Eligibility | 7 products |
| Geographic Distribution | Northeast 44%, West 24%, Southeast 18%, Midwest 10%, Southwest 4% |
| Key Differentiator | International trade risk cluster (unique to Citi), cross-border focus |

---

## 6. Shared/Cross-Bank Data

### Enriched Businesses (10 core businesses used across all banks)
| ID | Name | Industry | State | Revenue | LUMIQ Score | RHS | Products |
|----|------|----------|-------|---------|-------------|-----|----------|
| biz-001 | Stellar Dynamics LLC | Tech Services | CA | varies by bank | 82 | 82 | LOC $250K |
| biz-002 | Metro Logistics Corp | Transportation | TX | varies | 68 | 68 | Working Capital $500K |
| biz-003 | Apex Construction Group | Construction | FL | varies | 86 | 86 | Equipment $350K |
| biz-004 | Garden Fresh Bistro | Food Service | NY | varies | 45 | 45 | — |
| biz-005 | Pacific Health Partners | Healthcare | WA | varies | 91 | 91 | — |
| biz-006 | Midwest Manufacturing Co | Manufacturing | OH | varies | 73 | 73 | — |
| biz-007 | Sunrise Retail Group | Retail | GA | varies | 62 | 62 | — |
| biz-008 | Alpine Financial Advisors | Professional Services | CO | varies | 88 | 88 | — |
| biz-009 | Bayshore Marine Services | Marine/Construction | MA | varies | 77 | 77 | — |
| biz-010 | Desert Sun Energy | Energy/Technology | AZ | varies | 70 | 70 | — |

### Customer Demo Data (41 records)
- First 10 mirror enriched businesses above
- Remaining 31 (biz-011 to biz-041) provide full filter coverage
- Distribution: ~10 micro, ~14 small, ~12 mid-market
- All 5 regions represented (7-8 each)
- All 5 lifecycle stages (prospect 4, new 7, growing 11, mature 9, at-risk 5)
- Every product ID appears on at least 6 customers

### Credit Signal Profiles (2 detailed)
| Business | Bureau Scores | Signals | Products | Trajectory |
|----------|--------------|---------|----------|------------|
| biz-001 (Stellar Dynamics) | PAYDEX 82, Intelliscore 78, SBSS 215 | 7 signals (1 weak: owner credit) | 6 products (3 likely, 2 borderline, 1 unlikely) | 5 events |
| biz-002 (Metro Logistics) | PAYDEX 68, Intelliscore 62, SBSS 178 | 7 signals (2 weak: utilization, receivables) | 6 products (2 likely, 3 borderline, 1 unlikely) | 7 events |

### Underwriting Cases (5 cases)
| Case ID | Business | Product | Amount | Status | Risk | Recommendation |
|---------|----------|---------|--------|--------|------|----------------|
| CASE-2026-001 | Stellar Dynamics | LOC | $250K | in_review | LOW | Approve with guarantor PFS |
| CASE-2026-002 | GreenTech | Equipment | $150K | pending_review | ELEVATED | Request DTI exception (48% > 43%) |
| CASE-2026-003 | Metro Logistics | Working Capital | $500K | conditional | LOW | Conditional on fleet appraisal |
| CASE-2026-004 | QuickServe Restaurants | Term Loan | $75K | declined | ELEVATED | 3 policy failures (FICO 580, DTI 62%, tax lien) |
| CASE-2026-005 | Apex Construction | Equipment | $350K | in_review | MODERATE | Seasonal adjustment needed |

### Risk Intelligence Data
| Category | Data Points |
|----------|-------------|
| KPIs | 6 (Portfolio Risk Indicator 724, Expected Loss 1.2%, Unexpected Loss 0.8%, VaR 99%, Concentration Low, Stress Pass) |
| Deterioration Drivers | 4 (Payment 34%, Utilization 28%, Bureau 22%, Cash Flow 16%) |
| Risk Heatmaps | Segment x Product grid (Micro/Small/Mid-Market x LOC/Working Capital/Credit Card/SBA) |
| EWS Indicators | 4 with precision/recall metrics |
| Risk Models | 3 (SMB Risk v3.2, PD v2.1, EWS v1.5) |
| Stress Scenarios | 3 (Mild/Moderate/Severe recession) |
| Data Sources | 4 (Experian, D&B, Plaid, QuickBooks) |

### Product Catalog (7 API products)
| Product | Status | Category |
|---------|--------|----------|
| Credit Score API | GA | Credit |
| Credit Report API | GA | Credit |
| Lumiq Experian | GA | Credit |
| Credit Journey | Beta | Credit |
| Identity Verification API | GA | Identity |
| Banking Health API | Beta | Banking |
| KYB Compliance API | Coming Soon | Compliance |

---

## 7. Demo Data Registry

The `demoDataRegistry.ts` maps BFF service domains to demo data exports:

```
Domain                    Export Key              Source File
─────────────────────────────────────────────────────────────
overview.pilotMetrics     PILOT_METRICS           fallback/demoData.ts (bank-switched)
overview.pilotConfig      PILOT_CONFIG            fallback/demoData.ts (bank-switched)
campaigns.list            CAMPAIGNS               chaseDemoData.ts (bank-switched)
campaigns.summary         CAMPAIGN_SUMMARY        chaseDemoData.ts (bank-switched)
campaigns.conversion      CONVERSION_BY_SEGMENT   chaseDemoData.ts (bank-switched)
products.list             mockBankProducts        (enterprise products)
underwriting.queue        UNDERWRITING            chaseDemoData.ts (bank-switched)
analytics.portfolioKPIs   PORTFOLIO_KPIS          portfolioSegments.ts (bank-switched)
analytics.scoreDistrib    SCORE_DISTRIBUTION      portfolioSegments.ts
analytics.*               (9 analytics exports)   portfolioSegments.ts
risk.portfolio            PORTFOLIO               chaseDemoData.ts (bank-switched)
risk.kpis                 RISK_KPIS               chaseDemoData.ts (bank-switched)
risk.tiers                RISK_TIERS              chaseDemoData.ts (bank-switched)
risk.concentration        CONCENTRATION           chaseDemoData.ts (bank-switched)
risk.ewsClusters          EWS_CLUSTERS            chaseDemoData.ts (bank-switched)
risk.compliance           COMPLIANCE              chaseDemoData.ts (bank-switched)
customers.list            CUSTOMER_DEMO_DATA      customerDemoData.ts
customers.businesses      DEMO_BUSINESSES         fallback/demoData.ts (bank-switched)
notifications.*           (self-contained)        demoDataRegistry.ts
reports.*                 (templates, generated)  (enterprise reports)
portfolioSegments.*       (8 exports)             portfolioSegments.ts (bank-switched)
settings.users            (5 demo platform users) demoDataRegistry.ts
store.demoDataStore       demoDataStore           demoDataStore.ts
```

---

## 8. Session Store

`demoDataStore.ts` provides session-aware mutable state:

### Capabilities
| Operation | Method | Effect |
|-----------|--------|--------|
| Get all businesses | `getBusinesses()` | Returns enriched businesses with session overrides |
| Get single business | `getBusinessById(id)` | Single business lookup |
| Get applications | `getApplications()` | All apps with status overrides |
| Approve/Decline | `updateApplicationStatus(appId, status)` | Mutates status, persists to localStorage |
| Score pull | `simulateScorePull(bizId)` | Generates new credit score with random variation |
| Reset session | `reset()` | Clears all session data |
| Subscribe | `subscribe(callback)` | React hook integration for re-renders |

### Persistence
- Key: `lumiq_demo_session`
- Storage: `localStorage`
- Scope: Per-browser session (survives refresh, cleared on explicit reset)

---

## 9. API Sync Guide

### How to replicate this data in a real API

Each dashboard tab maps to specific BFF endpoints. To sync demo data with a real API, populate these endpoints:

| Tab | BFF Endpoint Pattern | Demo Data Source | Record Count |
|-----|---------------------|------------------|--------------|
| Overview | `GET /portfolio/:id/overview` | `PILOT_METRICS` + `PILOT_CONFIG` | 1 object each |
| Analytics | `GET /portfolio/:id/analytics/*` | `portfolioSegments.ts` exports | 9 export groups |
| Risk | `GET /portfolio/:id/risk/*` | `RISK_KPIS`, `CONCENTRATION`, `EWS_CLUSTERS`, `COMPLIANCE` | 4 objects |
| Customers | `GET /portfolio/:id/customers` | `CUSTOMER_DEMO_DATA` (41 records) | 41 |
| Customer (detail) | `GET /portfolio/:id/customers/:bizId` | `customerPageDemoData.ts` | 8 + health + lifecycle |
| Scores | `GET /portfolio/:id/scores` | `DEMO_BUSINESSES` (enriched) | 10 core businesses |
| Credit Intelligence | `GET /portfolio/:id/signals/:bizId` | `creditSignalsData.ts` | 2 detailed profiles |
| Campaigns | `GET /portfolio/:id/campaigns` | `CAMPAIGNS`, `CAMPAIGN_SUMMARY`, `CONVERSION_BY_SEGMENT` | 3 + 1 + 8-12 segments |
| Segment Explorer | `GET /portfolio/:id/segments` | `SEGMENTS`, `FILTER_OPTIONS`, `SAVED_SEGMENTS`, `SAMPLE_BUSINESSES` | varies + 50 businesses |
| Underwriting | `GET /portfolio/:id/underwriting` | `UNDERWRITING` (kpis + queue + rules) | 15 queue items |
| Products | `GET /portfolio/:id/products` | `mockBankProducts` | 7 products |
| Settings | `GET /settings/users` | Registry `settings.users` | 5 users |
| Reports | `GET /portfolio/:id/reports` | Registry `reports.*` | templates + generated |

### FICO to LUMIQ Score Conversion
All loaders use this conversion when transforming source JSON:
```
LUMIQ = ((FICO - 300) / 550) * 100
```
- FICO 300 → LUMIQ 0
- FICO 575 → LUMIQ 50
- FICO 850 → LUMIQ 100

### Scale Factors (from pilot to production)
| Bank | Pilot Size | Production Size | Scale Factor |
|------|-----------|-----------------|-------------|
| Chase | 47,500 | 6,000,000 | 126.3x |
| Wells Fargo | 47,500 | 3,300,000 | 69.5x |
| Santander | 47,500 | 180,000 | 3.79x |
| Citi | 47,500 | 450,000 | 9.47x |

### Data Uniqueness Per Bank
| Data Point | Chase | Wells Fargo | Santander | Citi |
|-----------|-------|-------------|-----------|------|
| Industry focus | Broad (48 states) | Agriculture, Rural SBA | Real Estate, Hispanic biz | International trade |
| Geographic weight | Even distribution | California heavy | Northeast 63.5% | Northeast 44%, West 24% |
| Unique EWS | Geographic Risk | Standard 3 | Standard 4 | International Trade Risk |
| Campaign themes | Healthcare LOC, Tech Term | BusinessLine LOC, SBA Rural | Northeast Growth, Hispanic | Cross-border, Tech |
| Saved segments | Texas Focus, Cross-Sell | Agricultural, California | Hispanic Growth, Multifamily | International |
| Products | 12 products | Standard | 6 products | 7 products |
| Compliance | 72% approval rate | Standard | 72% approval rate | Standard |

---

## Appendix: Complete File List (48 files)

```
src/data/
├── bankConfig.ts                     # Runtime bank resolution
├── chase.json                        # Chase raw data (1607 lines)
├── wellsfargo.json                   # Wells Fargo raw data (1416 lines)
├── santander.json                    # Santander raw data (1334 lines)
├── citi.json                         # Citi raw data (974 lines)
├── chaseDemoData.ts                  # Hub: types + 14 bank-switched exports
├── wellsfargoDemoData.ts             # WF re-export hub
├── santanderDemoData.ts              # Santander re-export hub
├── citiDemoData.ts                   # Citi re-export hub
├── chaseDataLoader.ts                # CHASE_PILOT_METRICS, CHASE_DEMO_BUSINESSES
├── chasePortfolioLoader.ts           # CHASE_PORTFOLIO, CHASE_SEGMENTS, CHASE_RISK_TIERS
├── chaseCampaignLoader.ts            # CHASE_CAMPAIGNS, CHASE_CAMPAIGN_SUMMARY
├── chaseRiskLoader.ts                # CHASE_RISK_KPIS, CHASE_CONCENTRATION, CHASE_EWS_CLUSTERS
├── chaseUnderwritingLoader.ts        # CHASE_UNDERWRITING (.kpis, .queue, .rules)
├── chaseFilterLoader.ts              # CHASE_FILTER_OPTIONS, CHASE_SAVED_SEGMENTS, CHASE_SAMPLE_BUSINESSES
├── wellsfargoDataLoader.ts           # WF_PILOT_METRICS, WF_DEMO_BUSINESSES
├── wellsfargoPortfolioLoader.ts      # WF_PORTFOLIO, WF_SEGMENTS, WF_RISK_TIERS
├── wellsfargoCampaignLoader.ts       # WF_CAMPAIGNS, WF_CAMPAIGN_SUMMARY
├── wellsfargoRiskLoader.ts           # WF_RISK_KPIS, WF_CONCENTRATION, WF_EWS_CLUSTERS
├── wellsfargoUnderwritingLoader.ts   # WF_UNDERWRITING
├── wellsfargoFilterLoader.ts         # WF_FILTER_OPTIONS, WF_SAVED_SEGMENTS, WF_SAMPLE_BUSINESSES
├── wellsfargoPortfolioSegments.ts    # 9 WF_ portfolio analytics exports
├── santanderDataLoader.ts            # SANT_PILOT_METRICS, SANT_DEMO_BUSINESSES
├── santanderPortfolioLoader.ts       # SANT_PORTFOLIO, SANT_SEGMENTS, SANT_RISK_TIERS
├── santanderCampaignLoader.ts        # SANT_CAMPAIGNS, SANT_CAMPAIGN_SUMMARY
├── santanderRiskLoader.ts            # SANT_RISK_KPIS, SANT_CONCENTRATION, SANT_EWS_CLUSTERS
├── santanderUnderwritingLoader.ts    # SANT_UNDERWRITING
├── santanderFilterLoader.ts          # SANT_FILTER_OPTIONS, SANT_SAVED_SEGMENTS, SANT_SAMPLE_BUSINESSES
├── santanderPortfolioSegments.ts     # 9 SANT_ portfolio analytics exports
├── citiDataLoader.ts                 # CITI_PILOT_METRICS, CITI_DEMO_BUSINESSES
├── citiPortfolioLoader.ts            # CITI_PORTFOLIO, CITI_SEGMENTS, CITI_RISK_TIERS
├── citiCampaignLoader.ts             # CITI_CAMPAIGNS, CITI_CAMPAIGN_SUMMARY
├── citiRiskLoader.ts                 # CITI_RISK_KPIS, CITI_CONCENTRATION, CITI_EWS_CLUSTERS
├── citiUnderwritingLoader.ts         # CITI_UNDERWRITING
├── citiFilterLoader.ts               # CITI_FILTER_OPTIONS, CITI_SAVED_SEGMENTS, CITI_SAMPLE_BUSINESSES
├── citiPortfolioSegments.ts          # 9 CITI_ portfolio analytics exports
├── portfolioSegments.ts              # Bank-switched master (Chase baseline, 1224 lines)
├── fallback/
│   └── demoData.ts                   # Shared: PILOT_METRICS, DEMO_BUSINESSES, enriched, API trends
├── demoData.ts                       # Re-export from fallback/ (compat)
├── demoDataStore.ts                  # Session-aware mutable store
├── demoDataRegistry.ts               # BFF domain → demo data mapping
├── customerDemoData.ts               # 41 customer records
├── customerPageDemoData.ts           # 8 customers + health + lifecycle + recommendations
├── creditSignalsData.ts              # Signal-based credit profiles (2 detailed)
├── riskDemoData.ts                   # Risk Intelligence tab (KPIs, heatmaps, EWS, stress)
├── underwritingDemoData.ts           # 5 underwriting cases with full detail
└── productCatalogData.tsx            # 7 API products
```
