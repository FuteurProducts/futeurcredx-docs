# WIRING NOTES — Bank Data Integration Guide

> How Chase was wired into the Lumiq AI Dashboard, and how to repeat for other banks.

---

## Overview

- **Goal**: Replace generic/fake mock data with real bank-specific data from demo-data research files.
- **Chase was the first bank wired** (6M businesses, $650B exposure).
- The approach uses a layered loader architecture: one canonical JSON source per bank, domain-specific TypeScript loaders that map raw JSON to existing interfaces, and thin re-export hubs that the UI components already consume. No component imports changed — only the data behind existing exports.

---

## Files Changed for Chase

### New Files Created

1. **`src/data/chase.json`** — Copy of `demo-data/chase/chase_dashboard_data.json` (1606 lines). Single source of truth for Chase quantitative data: `portfolio_summary`, `segments`, `risk_metrics`, `campaigns`, `underwriting_queue`, `filter_options`, `sample_businesses`, `bank_config`.

2. **`src/data/chaseDataLoader.ts`** — Maps `chase.json` → `CHASE_PILOT_METRICS` + `CHASE_DEMO_BUSINESSES` for the Overview tab.

3. **`src/data/chasePortfolioLoader.ts`** — Maps `CHASE_PORTFOLIO`, `CHASE_SEGMENTS`, `CHASE_RISK_TIERS` from `chase.json`.

4. **`src/data/chaseCampaignLoader.ts`** — Maps `CHASE_CAMPAIGNS`, `CHASE_CAMPAIGN_SUMMARY`, `CHASE_CONVERSION_BY_SEGMENT` from `chase.json`.

5. **`src/data/chaseRiskLoader.ts`** — Maps `CHASE_RISK_KPIS`, `CHASE_CONCENTRATION`, `CHASE_EWS_CLUSTERS`, `CHASE_COMPLIANCE` from `chase.json`.

6. **`src/data/chaseUnderwritingLoader.ts`** — Maps 15 underwriting queue entries with KPIs from `chase.json`.

7. **`src/data/chaseFilterLoader.ts`** — Maps `CHASE_FILTER_OPTIONS`, `CHASE_SAVED_SEGMENTS`, and all 50 sample businesses from `chase.json`.

### Files Modified

1. **`src/data/fallback/demoData.ts`** — `PILOT_METRICS` + `DEMO_BUSINESSES` now import from `chaseDataLoader`. `PILOT_CONFIG.bankName` set to `'Chase'`.

2. **`src/data/chaseDemoData.ts`** — Rewritten from 558 → 138 lines. All types preserved, all data now re-exported from the domain loader files.

3. **`src/data/portfolioSegments.ts`** — All values scaled 20.9x (287K → 6M businesses, $47.2B → $650B exposure).

4. **`src/components/finlab/FinlabOverview.tsx`** — Dynamic business count using `formatNumber(PILOT_METRICS.totalBusinesses)`, segment/freshness counts derived from `PILOT_METRICS`.

5. **`src/components/enterprise/products/mockData.ts`** — Complete rewrite: 18 fake generic products replaced with 18 real Chase products from `demo-data/chase/chase_qualitative.json`. All KPIs, penetration, pre-qual, performance, and eligibility data scaled to Chase's 6M businesses.

---

## Data Flow Architecture

```
demo-data/chase/chase_dashboard_data.json
  ↓ (copied at build time)
src/data/chase.json
  ↓ (imported by domain loaders)
src/data/chaseDataLoader.ts          → PILOT_METRICS, DEMO_BUSINESSES
src/data/chasePortfolioLoader.ts     → PORTFOLIO, SEGMENTS, RISK_TIERS
src/data/chaseCampaignLoader.ts      → CAMPAIGNS, CAMPAIGN_SUMMARY
src/data/chaseRiskLoader.ts          → RISK_KPIS, CONCENTRATION, EWS_CLUSTERS
src/data/chaseUnderwritingLoader.ts  → UNDERWRITING queue + KPIs
src/data/chaseFilterLoader.ts        → FILTER_OPTIONS, SAVED_SEGMENTS, SAMPLE_BUSINESSES
  ↓ (re-exported by)
src/data/chaseDemoData.ts            → All types + all data exports
src/data/fallback/demoData.ts        → PILOT_METRICS, DEMO_BUSINESSES
src/data/portfolioSegments.ts        → PORTFOLIO_KPIS, SEGMENTS, etc.
  ↓ (consumed by)
src/components/finlab/FinlabOverview.tsx     → Overview tab
src/components/enterprise/products/mockData.ts → Products tab
+ 16 other component files via chaseDemoData.ts
```

The key insight: components never import from `chase.json` directly. They import from the re-export hubs (`chaseDemoData.ts`, `demoData.ts`, `portfolioSegments.ts`), which import from domain loaders, which import from the canonical JSON. Swapping banks means swapping loaders, not touching components.

---

## Product Mapping Approach

### Source → Target Type Mapping

| Chase qualitative JSON category | ProductFamily type | Count |
|---|---|---|
| `deposit` | Deposits | 5 |
| `credit_card` | Credit Cards | 4 |
| `line_of_credit` | Lines of Credit | 2 |
| `sba_loan` | SBA Programs | 3 |
| `term_loan` | Term Loans | 1 |
| `equipment_financing` | Equipment Finance | 1 |
| `merchant_services` | Treasury | 2 |
| **Total** | | **18** |

### Key Decisions

- **Used trademarked names** (Ink Business Preferred®, Chase Business Complete Banking℠) to make the demo feel authentic.
- **Eligibility criteria** mapped from qualitative JSON's `eligibility_criteria` fields — these drive the eligibility matrix view.
- **Real rates, fees, credit ranges** sourced from qualitative research — not fabricated.
- **2 products marked as "Pilot"** for UI variety: Ink Business Premier℠ (launched 2024), Chase Payment Solutions℠.

### KPI Scaling Approach

- Chase has **6M businesses** (vs old mock's 9,500 or 47,500).
- **Penetration counts**: scaled proportionally (e.g., 8,420 checking → 4,400,000).
- **Revenue/Pipeline**: scaled to Chase-level volumes ($47.2M pipeline → $29.5B).
- **Percentages (rates, scores)**: kept realistic, **not** scaled (approval rate 78.2%, not 78.2% × 631).
- **Pre-qual count**: used actual `chase.json` value (4,020,000 = 67% pre-qual rate).

---

## How to Repeat for Another Bank

### Step 1: Identify Source Data

Look in `demo-data/{bankname}/` for:

- **`{prefix}_dashboard_data.json`** — Quantitative data (portfolio, segments, risk, campaigns, underwriting, samples)
- **`{prefix}_qualitative.json`** — Products catalog, strategy, competitive analysis

These files are the research artifacts. If they don't exist yet, they need to be created first by researching the bank's public data, annual reports, and product pages.

### Step 2: Copy Dashboard JSON

```bash
cp demo-data/{bankname}/{prefix}_dashboard_data.json src/data/{bankname}.json
```

This becomes the single source of truth for quantitative data. The file lives in `src/data/` so Vite can import it as a JSON module.

### Step 3: Create Domain Loaders

Create `src/data/{bankname}DataLoader.ts` (and optionally separate portfolio/campaign/risk/underwriting/filter loaders). Each loader:

1. Imports from `src/data/{bankname}.json`
2. Maps to existing TypeScript interfaces (`PILOT_METRICS` shape, `Segment`, `Campaign`, etc.)
3. Exports named constants

Pattern to follow — each loader file should:

```typescript
import bankData from './bankname.json';

// Map JSON → typed interface
export const BANK_PILOT_METRICS = {
  totalBusinesses: bankData.portfolio_summary.total_businesses,
  totalExposure: bankData.portfolio_summary.total_exposure,
  averageCreditScore: bankData.portfolio_summary.avg_credit_score,
  // ... all fields from the PilotMetrics interface
};
```

Use the Chase loaders as templates. The interfaces are already defined in `src/data/chaseDemoData.ts` — reuse those types.

### Step 4: Update Data Hub Files

- **`src/data/fallback/demoData.ts`** — Point `PILOT_METRICS` + `DEMO_BUSINESSES` to new bank's loader exports.
- **`src/data/chaseDemoData.ts`** → rename/swap to new bank's loader exports (or create `src/data/{bankname}DemoData.ts` and update imports).
- **`src/data/portfolioSegments.ts`** — Scale all values to new bank's numbers (total businesses, total exposure, segment counts).

### Step 5: Update Products Page

- Read `demo-data/{bankname}/{prefix}_qualitative.json` for real products.
- Map each product to `BankProduct` type in `src/components/enterprise/products/mockData.ts`.
- Scale all KPIs, penetration, performance data to new bank's business count.
- Use real product names, rates, eligibility criteria.
- The `ProductFamily` type has 9 values: Deposits, Credit Cards, Lines of Credit, SBA Programs, Term Loans, Equipment Finance, Treasury, Insurance, Payroll. Not all banks will have all families — empty families just won't show in filters.

### Step 6: Verify

```bash
# Type check — catches interface mismatches
npx tsc --noEmit

# Build check — catches import errors and JSON parse issues
npx vite build

# Visual verification — check every tab
npm run dev
```

Check these tabs specifically:
- **Overview** — Business count, exposure, credit score should match bank data
- **Products** — All products should render with correct names, rates, KPIs
- **Portfolio** — Segments, risk tiers should reflect bank's distribution
- **Risk** — KPIs, concentration, EWS clusters should be bank-specific
- **Campaigns** — Campaign names and metrics should match bank data
- **Underwriting** — Queue entries should be realistic for the bank

---

## Troubleshooting

- **White screen**: Check for direct `@clerk/clerk-react` imports — always use `@/contexts/AuthContext`. This is the #1 cause of white-screen crashes in this codebase.

- **Type errors in loaders**: Ensure all mapped fields match interfaces in `chaseDemoData.ts` types and `products/types.ts`. The TypeScript compiler will catch missing or mistyped fields — pay attention to optional vs required fields.

- **Stacking context traps**: Dialogs inside `backdrop-blur` elements need `createPortal(dialog, document.body)`. If a modal or confirmation dialog appears but buttons are unclickable, this is almost certainly the cause.

- **Missing product families**: The `ProductFamily` type has 9 values. Not all banks will have all families — that's OK, empty families just won't show in filters. Do not add new family values without updating the type.

- **JSON import issues**: Vite imports JSON as ES modules. If the JSON file has syntax errors, the dev server will fail silently. Validate JSON with `python3 -m json.tool src/data/{bankname}.json` before running.

- **Scaling math**: When scaling from one bank to another, always scale counts (businesses, applications, approvals) but keep percentages and rates as-is. A 78% approval rate is a 78% approval rate regardless of bank size.

---

## Appendix: File Inventory

| File | Lines | Purpose |
|---|---|---|
| `src/data/chase.json` | 1606 | Canonical quantitative data |
| `src/data/chaseDataLoader.ts` | ~80 | Overview tab metrics + businesses |
| `src/data/chasePortfolioLoader.ts` | ~120 | Portfolio segments + risk tiers |
| `src/data/chaseCampaignLoader.ts` | ~100 | Campaign metrics + conversion |
| `src/data/chaseRiskLoader.ts` | ~110 | Risk KPIs + concentration + EWS |
| `src/data/chaseUnderwritingLoader.ts` | ~90 | Underwriting queue + KPIs |
| `src/data/chaseFilterLoader.ts` | ~80 | Filter options + saved segments |
| `src/data/chaseDemoData.ts` | 138 | Re-export hub (types + data) |
| `src/data/fallback/demoData.ts` | ~200 | Global fallback data |
| `src/data/portfolioSegments.ts` | ~150 | Portfolio KPIs + segments |
| `src/components/enterprise/products/mockData.ts` | ~600 | 18 Chase products |
| `src/components/finlab/FinlabOverview.tsx` | ~300 | Overview tab component |
