# Data Wiring Architecture

## Overview
The Lumiq AI Dashboard supports 4 bank demos (Chase, Wells Fargo, Santander, Citibank) with full data isolation. Each bank has its own dataset, product catalog, portfolio segments, risk metrics, campaigns, and underwriting queue. Bank switching is resolved at module load time via `ACTIVE_BANK_ID` from `src/data/bankConfig.ts`.

## Supported Banks

| Bank | ID | Businesses | Exposure | Products | JSON Source |
|------|-----|-----------|----------|----------|-------------|
| Chase | `chase` | 6M | $650B | 18 | `src/data/chase.json` |
| Wells Fargo | `wellsfargo` | 3.3M | $670B | 17 | `src/data/wellsfargo.json` |
| Santander | `santander` | 180K | $8B | 15 | `src/data/santander.json` |
| Citibank | `citi` | 450K | $98.4B | 14 | `src/data/citi.json` |

## Bank Selection Priority

`src/data/bankConfig.ts` resolves the active bank in this order:

1. **URL parameter**: `?bank=wellsfargo` (highest priority)
2. **Environment variable**: `VITE_BANK_ID=wellsfargo npm run dev`
3. **Default**: `chase`

## Architecture

```
bankConfig.ts (resolves ACTIVE_BANK_ID)
    │
    ├── chaseDemoData.ts          ← 14 exports (segments, campaigns, risk, underwriting, filters)
    │   ├── chasePortfolioLoader.ts
    │   ├── chaseCampaignLoader.ts
    │   ├── chaseRiskLoader.ts
    │   ├── chaseUnderwritingLoader.ts
    │   ├── chaseFilterLoader.ts
    │   ├── wellsfargoDemoData.ts → wellsfargo*Loader.ts
    │   ├── santanderDemoData.ts  → santander*Loader.ts
    │   └── citiDemoData.ts       → citi*Loader.ts
    │
    ├── portfolioSegments.ts      ← 9 exports (industry segments, KPIs, geo, risk tiers, campaigns)
    │   ├── [Chase data inline]
    │   ├── wellsfargoPortfolioSegments.ts
    │   ├── santanderPortfolioSegments.ts
    │   └── citiPortfolioSegments.ts
    │
    ├── fallback/demoData.ts      ← 3 exports (pilot metrics, demo businesses, config)
    │   ├── chaseDataLoader.ts
    │   ├── wellsfargoDemoData.ts
    │   ├── santanderDataLoader.ts
    │   └── citiDataLoader.ts
    │
    └── products/mockData.ts      ← 13 exports (products, KPIs, penetration, eligibility)
        ├── [Chase data inline]
        ├── wellsfargoProductData.ts
        ├── santanderProductData.ts
        └── citiProductData.ts
```

## Switching Pattern

All hub files use the same map-based lookup pattern:

```typescript
import { ACTIVE_BANK_ID } from './bankConfig';

export const DATA = ({
  chase: CHASE_DATA,
  wellsfargo: WF_DATA,
  santander: SANT_DATA,
  citi: CITI_DATA,
} as Record<string, DataType[]>)[ACTIVE_BANK_ID] ?? CHASE_DATA;
```

## Hub File Summary

| Hub File | Exports | Scope |
|----------|---------|-------|
| `src/data/chaseDemoData.ts` | 14 | Segments, campaigns, risk, underwriting, filters |
| `src/data/portfolioSegments.ts` | 9 | Industry segments, KPIs, geo distribution, risk tiers |
| `src/data/fallback/demoData.ts` | 3 | Pilot metrics, demo businesses, bank config |
| `src/components/enterprise/products/mockData.ts` | 13 | Product catalog, penetration, eligibility rules |

**Total: 39 bank-switched exports**

## Per-Bank File Structure

Each bank follows the same loader pattern:

| Loader | Prefix | Scope |
|--------|--------|-------|
| `{bank}DataLoader.ts` | pilot metrics, demo businesses | Dashboard KPIs |
| `{bank}PortfolioLoader.ts` | portfolio, segments, risk tiers | Portfolio analytics |
| `{bank}CampaignLoader.ts` | campaigns, summary, conversion | Campaign management |
| `{bank}RiskLoader.ts` | risk KPIs, concentration, EWS, compliance | Risk dashboard |
| `{bank}UnderwritingLoader.ts` | underwriting queue | Underwriting tab |
| `{bank}FilterLoader.ts` | filter options, saved segments, sample businesses | Segment explorer |
| `{bank}PortfolioSegments.ts` | industry segments, KPIs, geo, campaigns | Portfolio deep analytics |
| `{bank}ProductData.ts` | products, KPIs, eligibility | Products tab |
| `{bank}DemoData.ts` | typed re-exports from all loaders | Aggregation hub |

## React Integration

`src/contexts/BankContext.tsx` provides React-side access:

```typescript
const { bankId, bankName, allBanks, switchBank } = useBankContext();
```

`switchBank(id)` sets `?bank=xxx` in the URL and triggers a full page reload (required because data is resolved at module load time).

`BankProvider` wraps the app in `src/App.tsx`.

## Usage Examples

```bash
# Default (Chase)
npm run dev

# URL-based switching
http://localhost:8080/?bank=wellsfargo
http://localhost:8080/?bank=santander
http://localhost:8080/?bank=citi

# Environment variable
VITE_BANK_ID=santander npm run dev
```

## Adding a New Bank

1. Create `src/data/{bank}.json` with the bank's dataset
2. Create 6 loaders: `{bank}DataLoader.ts`, `{bank}PortfolioLoader.ts`, `{bank}CampaignLoader.ts`, `{bank}RiskLoader.ts`, `{bank}UnderwritingLoader.ts`, `{bank}FilterLoader.ts`
3. Create `{bank}DemoData.ts` aggregation hub
4. Create `{bank}PortfolioSegments.ts` for portfolio analytics
5. Create `{bank}ProductData.ts` in `src/components/enterprise/products/`
6. Add the bank ID to `BankId` type in `bankConfig.ts`
7. Add entries to all 4 hub file switch maps
8. Add entry to `BANK_DISPLAY_NAMES` in `bankConfig.ts`
