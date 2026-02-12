# Citi Data Exports — TypeScript to JSON Mapping Guide

This document catalogs every exported constant from the Citi data loader files and maps them to their source data in `citi.json`.

**Source Files:**
- `/src/data/citi.json` — Raw JSON data (450K businesses, $98.4B exposure)
- `/src/data/citiDataLoader.ts` — PILOT_METRICS + DEMO_BUSINESSES
- `/src/data/citiPortfolioLoader.ts` — PORTFOLIO + SEGMENTS + RISK_TIERS
- `/src/data/citiCampaignLoader.ts` — CAMPAIGNS + CAMPAIGN_SUMMARY + CONVERSION_BY_SEGMENT
- `/src/data/citiRiskLoader.ts` — RISK_KPIS + CONCENTRATION + EWS_CLUSTERS + COMPLIANCE
- `/src/data/citiUnderwritingLoader.ts` — UNDERWRITING (queue + KPIs + rules)
- `/src/data/citiFilterLoader.ts` — FILTER_OPTIONS + SAVED_SEGMENTS + SAMPLE_BUSINESSES
- `/src/data/citiPortfolioSegments.ts` — Handcrafted segments + KPIs + EWS + campaigns

---

## 1. citiDataLoader.ts

### `CITI_PILOT_METRICS`

**Shape:** Object with 23 fields
**Source:** Computed from `citi.json` → `portfolio_summary` with derived values
**Purpose:** Top-level KPIs for Citi's entire portfolio scaled from pilot baseline

**Fields:**
```typescript
{
  totalBusinesses: 450000,              // portfolio_summary.total_businesses
  scoredBusinesses: 370800,             // derived: total * 0.824
  scoreCoverage: 82.4,                  // derived
  preQualifiedBusinesses: 279000,       // derived: total * pre_qual_rate
  preQualRate: 0.62,                    // portfolio_summary.pre_qual_rate
  applicationsStarted: 26505,           // derived
  applicationConversion: 26.5,          // derived
  approved: 20674,                      // derived
  approvalRate: 78.0,                   // derived
  funded: 19020,                        // derived
  fundingRate: 92.0,                    // derived
  ineligible: 79200,                    // derived
  avgLumiqScore: 69.5,                  // portfolio_summary.avg_composite_score
  medianLumiqScore: 71,                 // hardcoded
  totalApiCalls: 30775789,              // derived with scale factor 9.47
  dailyAvgCalls: 334519,                // derived
  successRate: 99.92,                   // hardcoded
  avgLatencyMs: 138,                    // hardcoded
  p99LatencyMs: 365,                    // hardcoded
  errorCount: 18443,                    // derived with scale factor
  avgPreQualLimit: 255000,              // portfolio_summary.avg_credit_limit
  projectedOriginations: 19930560000,   // derived formula
  avgRevenuePerBusiness: 4450,          // hardcoded
  projectedAnnualRevenue: 91999300      // derived: approved * 4450
}
```

---

### `CITI_DEMO_BUSINESSES`

**Shape:** Array of 10 objects (DemoBusinessEntity)
**Source:** First 10 items from `citi.json` → `sample_businesses`
**Purpose:** Mapped business entities for demo UI components

**Sample (first item):**
```typescript
{
  id: "biz-001",                        // sample_businesses[0].id (underscore → hyphen)
  name: "CloudScale Technologies Inc",  // sample_businesses[0].name
  legalName: "CloudScale Technologies Inc",
  industry: "Technology",               // mapped from segment "seg_tech"
  naicsCode: "000000",                  // placeholder
  city: "San Francisco",                // sample_businesses[0].city
  state: "CA",                          // sample_businesses[0].state
  annualRevenue: 18500000,              // sample_businesses[0].revenue
  employeeCount: 62,                    // derived: revenue / 300000
  yearsInBusiness: 11,                  // random 5-15
  lumiqScore: 76,                       // sample_businesses[0].score (rounded)
  ownerFico: 754,                       // derived: 640 + score * 1.5
  riskTier: "low",                      // derived from score (≥75 = low)
  scoreTrend: "up",                     // derived from score (≥78 = up)
  trendValue: 1,                        // derived formula
  segment: "mid-market",                // derived: revenue ≥ 5M
  hasActiveApplication: false,          // status check
  productType: "TERM",                  // based on status
  applicationAmount: 5550000            // revenue * 0.3
}
```

**Industry Mapping:**
- `seg_tech` → "Technology"
- `seg_professional` → "Professional Services"
- `seg_healthcare` → "Healthcare & Life Sciences"
- `seg_retail` → "Retail & E-Commerce"
- `seg_manufacturing` → "Manufacturing & Distribution"
- `seg_real_estate` → "Real Estate & Property Services"
- `seg_food_service` → "Food Service & Hospitality"
- `seg_other` → "Other Industries"

---

## 2. citiPortfolioLoader.ts

### `CITI_PORTFOLIO`

**Shape:** Object with 11 fields
**Source:** Direct camelCase mapping of `citi.json` → `portfolio_summary`

```typescript
{
  totalBusinesses: 450000,
  totalExposure: 98400000000,           // $98.4B
  preQualRate: 0.62,
  avgCompositeScore: 69.5,
  avgCompositeScorePrevMonth: 69.1,
  atRiskExposure: 7800000000,           // $7.8B
  atRiskPercent: 0.079,
  offerPotential: 84000000000,          // $84.0B
  quarterlyGrowth: 11200,
  bureauHitRate: 0.992,
  avgScoreRefreshDays: 14
}
```

---

### `CITI_SEGMENTS`

**Shape:** Array of 8 objects (Segment)
**Source:** `citi.json` → `segments[]` (camelCase transformation)

**Sample (first item):**
```typescript
{
  id: "seg_tech",
  name: "Technology",
  icon: "💻",
  businessCount: 68000,
  exposure: 17100000000,                // $17.1B
  avgScore: 71.2,
  preQualRate: 0.78,
  riskDistribution: {
    LOW: 0.42,
    MODERATE: 0.35,
    ELEVATED: 0.15,
    HIGH: 0.06,
    CRITICAL: 0.02
  },
  conversionRate: 0.118,
  status: "top_performer",              // "top_performer" | "performing" | "below_benchmark" | "at_risk"
  trend: "up",                          // "up" | "down" | "stable"
  productEligibility: {
    LOC: 53040,
    TERM: 48960,
    SBA: 23800,
    TRADE_FINANCE: 25840,
    CREDIT_CARD: 59500
  }
}
```

**Full List (8 segments):**
1. Technology (68K businesses, $17.1B)
2. Professional Services (72K, $17.6B)
3. Healthcare & Life Sciences (63K, $16.7B)
4. Retail & E-Commerce (81K, $14.0B)
5. Manufacturing & Distribution (54K, $17.3B)
6. Real Estate & Property Services (45K, $17.1B)
7. Food Service & Hospitality (36K, $5.2B)
8. Other Industries (31K, $5.4B)

---

### `CITI_RISK_TIERS`

**Shape:** Object with 5 keys (LOW | MODERATE | ELEVATED | HIGH | CRITICAL)
**Source:** `citi.json` → `risk_tiers`

```typescript
{
  LOW: {
    percent: 0.31,
    count: 139500,
    exposure: 31400000000,              // $31.4B
    label: "Low Risk"
  },
  MODERATE: {
    percent: 0.38,
    count: 171000,
    exposure: 37800000000,              // $37.8B
    label: "Moderate"
  },
  ELEVATED: {
    percent: 0.19,
    count: 85500,
    exposure: 19200000000,              // $19.2B
    label: "Elevated"
  },
  HIGH: {
    percent: 0.09,
    count: 40500,
    exposure: 7600000000,               // $7.6B
    label: "High Risk"
  },
  CRITICAL: {
    percent: 0.03,
    count: 13500,
    exposure: 2400000000,               // $2.4B
    label: "Critical"
  }
}
```

**Validation:** 139500 + 171000 + 85500 + 40500 + 13500 = 450,000 ✓

---

## 3. citiCampaignLoader.ts

### `CITI_CAMPAIGNS`

**Shape:** Array of 3 objects (Campaign)
**Source:** `citi.json` → `campaigns[]`

**Sample (first item):**
```typescript
{
  id: "camp_001",
  name: "Q1 2026 Tech Working Capital — CitiBusiness Line of Credit",
  status: "active",
  health: "on_track",                   // "on_track" | "below_target" | "paused" | "completed"
  targetSegment: "seg_tech",
  targetCriteria: "Technology + Score >65 + Revenue >$5M + International trade",
  product: "CitiBusiness Line of Credit",
  startDate: "2026-01-15",
  endDate: "2026-03-31",
  owner: "M. Zhang",
  funnel: {
    pushed: 25840,
    viewed: 12920,
    applied: 3360,
    approved: 2856
  },
  viewRate: 0.50,
  applyRate: 0.13,
  approvalRate: 0.85,
  approvedVolume: 892000000,            // $892M
  warning: undefined                    // only if viewRate < 0.35
}
```

**Full List (3 active campaigns):**
1. Q1 2026 Tech Working Capital (Technology)
2. Professional Services Growth (Professional Services)
3. Import/Export Trade Finance Expansion (Retail + Manufacturing)

---

### `CITI_CAMPAIGN_SUMMARY`

**Shape:** Object with 6 fields
**Source:** `citi.json` → `campaign_summary`

```typescript
{
  activeCampaigns: 3,
  offersPushed: 79840,
  avgViewRate: 0.48,
  avgApplyRate: 0.12,
  avgApprovalRate: 0.83,
  revenueBooked: 2094000000              // $2.094B
}
```

---

### `CITI_CONVERSION_BY_SEGMENT`

**Shape:** Array of 8 objects (ConversionBySegment)
**Source:** Manually constructed from segment-level rates in `citi.json`

**Sample (first item):**
```typescript
{
  segment: "Professional Services",
  viewRate: 0.82,
  applyRate: 0.12,
  approvalRate: 0.84,
  endToEnd: 0.082656,                   // viewRate * applyRate * approvalRate
  status: "ok"                          // "ok" | "warning" | "at_risk"
}
```

**Full List (8 segments):**
1. Professional Services (82% / 12% / 84% = 8.3% end-to-end) — ok
2. Technology (78% / 13% / 85% = 8.6%) — ok
3. Healthcare & Life Sciences (71% / 9.2% / 83% = 5.4%) — ok
4. Real Estate (65% / 8.7% / 82% = 4.6%) — ok
5. Retail & E-Commerce (64% / 8.1% / 80% = 4.1%) — warning
6. Manufacturing (68% / 7.8% / 80% = 4.2%) — warning
7. Food Service (48% / 4.1% / 70% = 1.4%) — at_risk
8. Other Industries (56% / 6.3% / 78% = 2.8%) — warning

---

## 4. citiRiskLoader.ts

### `CITI_RISK_KPIS`

**Shape:** Object with 6 fields
**Source:** `citi.json` → `risk_metrics`

```typescript
{
  portfolioAtRisk: {
    value: 7800000000,                  // $7.8B
    percent: 0.079                      // 7.9%
  },
  industryConcentration: {
    value: 0.179,                       // 17.9%
    label: "Professional Services"
  },
  geographicConcentration: {
    value: 0.440,                       // 44.0%
    label: "Northeast (NYC metro)"
  },
  ewsAlerts: 2847,                      // Early Warning System alerts
  thirtyDayDeterioration: 3210,
  watchList: 12400
}
```

---

### `CITI_CONCENTRATION`

**Shape:** Object with 2 keys (industry, geography)
**Source:** `citi.json` → `concentration`

```typescript
{
  industry: {
    limit: 0.20,                        // 20% threshold
    values: [
      {
        name: "Professional Services",
        percent: 0.179,
        exposure: 17600000000,          // $17.6B
        status: "safe"                  // "safe" | "warning" | "breach"
      },
      {
        name: "Technology",
        percent: 0.174,
        exposure: 17100000000,
        status: "safe"
      },
      // ... 5 total entries
    ]
  },
  geography: {
    limit: 0.35,                        // 35% threshold
    values: [
      {
        name: "Northeast",
        percent: 0.440,                 // ⚠️ Exceeds limit
        exposure: 43300000000,          // $43.3B
        status: "warning"
      },
      {
        name: "West",
        percent: 0.286,
        exposure: 28100000000,
        status: "safe"
      },
      // ... 5 total entries
    ]
  }
}
```

---

### `CITI_EWS_CLUSTERS`

**Shape:** Array of 5 objects (EWSCluster)
**Source:** `citi.json` → `ews_clusters[]`

**Sample (first item):**
```typescript
{
  id: "ews_score_drop",
  type: "SCORE_DROP",
  severity: "critical",                 // "critical" | "high" | "medium" | "low"
  title: "Score Drop >15 Points (30 Days)",
  businessCount: 1247,
  exposure: 218000000,                  // $218M
  heaviestSegments: [
    { segment: "Retail & E-Commerce", count: 389 },
    { segment: "Food Service & Hospitality", count: 312 },
    { segment: "Manufacturing & Distribution", count: 221 },
    { segment: "Other Industries", count: 186 },
    { segment: "Technology", count: 139 }
  ],
  actions: ["View Segment", "Add All to Watch List", "Assign to Team"]
}
```

**Full List (5 clusters):**
1. Score Drop >15 Points (1,247 businesses, $218M) — critical
2. Delinquency Reported (387, $124M) — critical
3. Lien Filed (189, $67M) — warning
4. Bankruptcy Watch (94, $52M) — critical
5. International Trade Risk (930, $412M) — warning (Citi-specific)

---

### `CITI_COMPLIANCE`

**Shape:** Object with 4 fields
**Source:** `citi.json` → `compliance`

```typescript
{
  approvalVariance: [
    {
      segment: "Professional Services",
      applications: 8640,
      approved: 7257,
      rate: 0.84,
      variance: 0.05,                   // vs baseline
      status: "ok"                      // "ok" | "review" | "flag"
    },
    // ... 8 total segments
  ],
  portfolioApprovalRate: 0.79,          // 79%
  adverseActionsSent: 10120,
  fairLendingStatus: "pass"             // "pass" | "review" | "fail"
}
```

---

## 5. citiUnderwritingLoader.ts

### `CITI_UNDERWRITING`

**Shape:** Object with 3 keys (kpis, queue, rules)
**Source:** `citi.json` → `underwriting_queue[]` + computed KPIs

**Structure:**
```typescript
{
  kpis: {
    queueDepth: 15,                     // queue.length
    avgDecisionTime: 3.29,              // hours (derived)
    autoApproveRate: 0.40,              // derived: LOW risk count / total
    manualReviewRate: 0.47,             // derived: MODERATE + ELEVATED / total
    declineRate: 0.13,                  // derived: (total - approve - review) / total
    slaCompliance: 0.87                 // derived: sla_status "ok" / total
  },
  queue: [
    {
      id: "uw_001",
      business: "CloudScale Technologies Inc",
      product: "Commercial Term Loan",
      amount: 1200000,
      score: 76,
      risk: "LOW",                      // "LOW" | "MODERATE" | "ELEVATED" | "HIGH" | "CRITICAL"
      timeInQueue: 1.2,                 // hours
      slaStatus: "ok"                   // "ok" | "warning" | "breach"
    },
    // ... 15 total items
  ],
  rules: {
    autoApprove: [
      "Composite Score ≥ 75",
      "No delinquencies in 24 months",
      "Business age ≥ 3 years",
      "Amount ≤ $100,000"
    ],
    autoDecline: [
      "Composite Score < 25",
      "Active bankruptcy",
      "Industry: Cannabis, Gaming, Adult Entertainment"
    ]
  }
}
```

---

## 6. citiFilterLoader.ts

### `CITI_FILTER_OPTIONS`

**Shape:** Object with 6 fields
**Source:** `citi.json` → `filter_options`

```typescript
{
  industries: [
    "Technology",
    "Professional Services",
    "Healthcare & Life Sciences",
    "Retail & E-Commerce",
    "Manufacturing & Distribution",
    "Real Estate & Property Services",
    "Food Service & Hospitality",
    "Other Industries"
  ],
  states: ["NY", "CA", "FL", "IL", "WA", "DC", "MA", "NJ", "PA", "TX", "GA", "CT"],
  riskTiers: ["LOW", "MODERATE", "ELEVATED", "HIGH", "CRITICAL"],
  products: [
    "CitiBusiness Line of Credit",
    "Commercial Term Loan",
    "SBA 7(a) Loan",
    "Trade Finance & Working Capital",
    "Commercial Real Estate Loan",
    "Equipment Financing",
    "CitiBusiness Credit Card"
  ],
  scoreRange: { min: 0, max: 100 },
  revenueRange: { min: 1000000, max: 50000000 }
}
```

---

### `CITI_SAVED_SEGMENTS`

**Shape:** Array of 5 objects
**Source:** `citi.json` → `saved_segments[]`

**Sample (first item):**
```typescript
{
  id: "saved_001",
  name: "High-Value Tech NYC/SF",
  businessCount: 24800,
  exposure: 8200000000,                 // $8.2B
  createdAt: "2026-01-12"
}
```

**Full List (5 saved segments):**
1. High-Value Tech NYC/SF (24.8K, $8.2B)
2. International Trade Focus (45.6K, $14.2B)
3. Professional Services Metro (36K, $10.8B)
4. Cross-Border Retailers (18.9K, $4.7B)
5. Miami Gateway Clients (14.2K, $3.1B)

---

### `CITI_SAMPLE_BUSINESSES`

**Shape:** Array of 50 objects
**Source:** `citi.json` → `sample_businesses[]` (ALL 50 items)

**Sample (first item):**
```typescript
{
  id: "biz_001",
  name: "CloudScale Technologies Inc",
  revenue: 18500000,
  score: 76,
  risk: "LOW",
  status: "Offer Sent",                // "Offer Sent" | "Applied" | "Approved" | "Under Review" | "Qualified"
  segment: "seg_tech",
  state: "CA"
}
```

---

## 7. citiPortfolioSegments.ts

**NOTE:** This file is **handcrafted**, not loaded from `citi.json`. It contains enriched segment data with detailed breakdowns.

### `CITI_INDUSTRY_SEGMENTS`

**Shape:** Array of 8 objects (IndustrySegment)
**Source:** Handcrafted from `citi.json` + Citi banking research

**Sample (first item):**
```typescript
{
  id: "seg_tech",
  name: "Technology",
  icon: "Laptop",                       // lucide-react icon name
  businessCount: 68000,
  totalExposure: 17100000000,           // $17.1B
  qualRate: 78.0,
  avgScore: 71,                         // FICO 712 → Lumiq 71
  highRiskPct: 8.0,
  trend: { direction: "up", value: 14.0 },
  topProducts: [
    { name: "CitiBusiness Line of Credit", eligible: 53040 },
    { name: "Commercial Term Loan", eligible: 48960 },
    { name: "Trade Finance & Working Capital", eligible: 25840 },
    { name: "SBA 7(a) Loan", eligible: 23800 }
  ],
  region: {
    Northeast: 23800,                   // NYC (35%)
    Southeast: 6120,
    Midwest: 4760,
    Southwest: 4420,
    West: 28900                         // SF Bay Area (40%)
  },
  riskDistribution: {
    LOW: 28560,
    MODERATE: 23800,
    ELEVATED: 10200,
    HIGH: 4080,
    CRITICAL: 1360
  },
  avgRevenue: 12500000,
  avgYearsInBusiness: 7.2
}
```

---

### `CITI_PORTFOLIO_KPIS`

**Shape:** Array of 6 objects (PortfolioKPI)
**Source:** Handcrafted summary metrics

**Sample (first item):**
```typescript
{
  id: "total-portfolio",
  label: "Total Portfolio",
  value: 450000,
  format: "number",                     // "number" | "currency" | "percent" | "score"
  trend: {
    direction: "up",                    // "up" | "down" | "stable"
    value: 2.5,
    label: "+2.5% vs last quarter"
  },
  status: "positive",                   // "positive" | "negative" | "neutral" | "warning"
  tooltip: "Total number of businesses in portfolio",
  dataSource: "Portfolio Management System"
}
```

**Full List (6 KPIs):**
1. Total Portfolio (450K)
2. Total Exposure ($98.4B)
3. Qualification Rate (62%)
4. Avg Credit Score (69.5)
5. At-Risk Businesses (54K, 12%)
6. Offer Pipeline ($84.0B)

---

### `CITI_GEOGRAPHIC_DISTRIBUTION`

**Shape:** Array of 5 objects (GeographicDistribution)
**Source:** `citi.json` → `geographic_distribution[]` (camelCase)

**Sample (first item):**
```typescript
{
  region: "Northeast",
  states: ["NY", "CT", "NJ", "PA", "MA", "DC"],
  businessCount: 198000,                // 44% of total
  exposure: 43300000000,                // $43.3B
  avgScore: 71.8,
  qualRate: 68.0
}
```

**Full List (5 regions):**
1. Northeast (198K, $43.3B, 44%)
2. West (108K, $28.1B, 24%)
3. Southeast (81K, $16.4B, 18%)
4. Midwest (45K, $8.9B, 10%)
5. Southwest (18K, $1.7B, 4%)

**Validation:** 198K + 108K + 81K + 45K + 18K = 450K ✓

---

### `CITI_RISK_TIER_DISTRIBUTION`

**Shape:** Array of 5 objects (RiskTierDistribution)
**Source:** `citi.json` → `risk_tiers` + enriched with color + avgScore

**Sample (first item):**
```typescript
{
  tier: "LOW",
  count: 139500,
  percentage: 31.0,
  exposure: 31400000000,                // $31.4B
  avgScore: 85,                         // FICO 790+ → Lumiq 85
  color: "bg-green-500"
}
```

**Full List (5 tiers):**
1. LOW (139.5K, 31%, $31.4B, score 85)
2. MODERATE (171K, 38%, $37.8B, score 73)
3. ELEVATED (85.5K, 19%, $19.2B, score 64)
4. HIGH (40.5K, 9%, $7.6B, score 52)
5. CRITICAL (13.5K, 3%, $2.4B, score 37)

**Validation:** 139.5K + 171K + 85.5K + 40.5K + 13.5K = 450K ✓

---

### `CITI_CONCENTRATION_METRICS`

**Shape:** Array of 3 objects (ConcentrationMetric)
**Source:** Handcrafted from `citi.json` concentration data

**Sample (first item):**
```typescript
{
  dimension: "Industry",
  segments: [
    { name: "Retail & E-Commerce", percentage: 18.0, exposure: 14000000000 },
    { name: "Professional Services", percentage: 16.0, exposure: 17600000000 },
    { name: "Technology", percentage: 15.1, exposure: 17100000000 },
    { name: "Healthcare & Life Sciences", percentage: 14.0, exposure: 16700000000 },
    { name: "Manufacturing & Distribution", percentage: 12.0, exposure: 17300000000 },
    { name: "Other Industries", percentage: 24.9, exposure: 15700000000 }
  ],
  threshold: 20.0,                      // 20% limit
  status: "within"                      // "within" | "approaching" | "exceeded"
}
```

**Full List (3 dimensions):**
1. Industry (threshold 20%, status: within)
2. Geographic (threshold 35%, status: exceeded — Northeast at 44%)
3. Revenue Band (threshold 25%, status: approaching — $5M-$10M at 26.4%)

---

### `CITI_EWS_ALERT_CLUSTERS`

**Shape:** Array of 5 objects (EWSAlertCluster)
**Source:** `citi.json` → `ews_clusters[]` (enriched with topIndustries array)

**Sample (first item):**
```typescript
{
  type: "Score Drop >15pts",
  severity: "critical",                 // "critical" | "high" | "medium" | "low"
  businessCount: 1247,
  totalExposure: 218000000,             // $218M
  topIndustries: [
    { name: "Retail & E-Commerce", count: 389 },
    { name: "Food Service & Hospitality", count: 312 },
    { name: "Manufacturing & Distribution", count: 221 },
    { name: "Other Industries", count: 186 },
    { name: "Technology", count: 139 }
  ],
  trend: "increasing"                   // "increasing" | "decreasing" | "stable"
}
```

**Full List (5 clusters):**
1. Score Drop >15pts (1,247, $218M) — critical, increasing
2. Delinquency Reported (387, $124M) — critical, stable
3. Lien Filed (189, $67M) — warning, decreasing
4. Bankruptcy Watch (94, $52M) — critical, stable
5. International Trade Risk (930, $412M) — warning, increasing (Citi-specific)

---

### `CITI_ACTIVE_CAMPAIGNS`

**Shape:** Array of 3 objects (CampaignData)
**Source:** `citi.json` → `campaigns[]` (enriched format)

**Sample (first item):**
```typescript
{
  id: "camp_citi_tech_wc_q1",
  name: "Q1 2026 Tech Working Capital — CitiBusiness Line of Credit",
  segment: "Technology",
  product: "CitiBusiness Line of Credit",
  status: "active",                     // "active" | "completed" | "paused"
  startDate: "2026-01-15",
  endDate: "2026-03-31",
  funnel: {
    pushed: 25840,
    viewed: 12920,
    applied: 3360,
    approved: 2856
  },
  approvedVolume: 892000000             // $892M
}
```

**Conversion Rates:**
- View Rate: 50.0% (viewed / pushed)
- Apply Rate: 26.0% (applied / viewed)
- Approval Rate: 85.0% (approved / applied)

---

### `CITI_COMPLETED_CAMPAIGNS`

**Shape:** Array of 6 objects (CampaignData)
**Source:** Handcrafted historical campaign data (not in `citi.json`)

**Sample (first item):**
```typescript
{
  id: "camp_citi_c01",
  name: "Q4 2025 Healthcare Equipment Finance",
  segment: "Healthcare & Life Sciences",
  product: "Equipment Financing",
  status: "completed",
  startDate: "2025-10-01",
  endDate: "2025-12-31",
  funnel: {
    pushed: 17640,
    viewed: 8820,
    applied: 1764,
    approved: 1411
  },
  approvedVolume: 342500000             // $342.5M
}
```

**Full List (6 completed campaigns):**
1. Q4 2025 Healthcare Equipment Finance ($342.5M)
2. Real Estate Fall 2025 CRE Loan ($648M)
3. Manufacturing Trade Finance Summer ($487M)
4. Technology Term Loan Q2 ($1.028B)
5. Retail E-Commerce Spring LOC ($624M)
6. Professional Services LOC Winter ($744M)

---

### `CITI_PRODUCT_ELIGIBILITY`

**Shape:** Object with 7 product keys
**Source:** `citi.json` → `product_eligibility` (enriched with conversion rates)

```typescript
{
  "CitiBusiness Line of Credit": {
    eligible: 317270,                   // 70.5% of portfolio
    conversionRate: 15.2
  },
  "Commercial Term Loan": {
    eligible: 281360,                   // 62.5%
    conversionRate: 13.8
  },
  "SBA 7(a) Loan": {
    eligible: 132210,                   // 29.4%
    conversionRate: 19.4
  },
  "Trade Finance & Working Capital": {
    eligible: 132030,                   // 29.3% — Citi differentiator
    conversionRate: 11.7
  },
  "Commercial Real Estate Loan": {
    eligible: 67500,                    // 15.0%
    conversionRate: 22.8
  },
  "Equipment Financing": {
    eligible: 189000,                   // 42.0%
    conversionRate: 17.1
  },
  "CitiBusiness Credit Card": {
    eligible: 389310,                   // 86.5%
    conversionRate: 9.4
  }
}
```

---

## Summary Statistics

### From citi.json (Raw Data)
- **Total Businesses:** 450,000
- **Total Exposure:** $98.4B
- **Segments:** 8 industry segments
- **Geographic Regions:** 5 (Northeast 44%, West 24%, Southeast 18%, Midwest 10%, Southwest 4%)
- **Risk Tiers:** 5 (LOW 31%, MODERATE 38%, ELEVATED 19%, HIGH 9%, CRITICAL 3%)
- **Products:** 7 products
- **Campaigns:** 3 active
- **Sample Businesses:** 50
- **Underwriting Queue:** 15 items
- **EWS Clusters:** 5 alert types
- **Saved Segments:** 5

### Derived Exports (Computed)
- **PILOT_METRICS:** 23 KPIs (scale factor 9.47× from pilot baseline)
- **DEMO_BUSINESSES:** 10 entities (first 10 sample businesses)
- **CONVERSION_BY_SEGMENT:** 8 segment conversion metrics
- **COMPLETED_CAMPAIGNS:** 6 historical campaigns (handcrafted)
- **INDUSTRY_SEGMENTS:** 8 enriched segments with regional + risk distribution
- **PORTFOLIO_KPIS:** 6 top-level KPIs
- **CONCENTRATION_METRICS:** 3 dimensions (Industry, Geographic, Revenue Band)
- **PRODUCT_ELIGIBILITY:** 7 products with eligibility + conversion

---

## File Dependencies

```
citi.json (450K rows)
    ↓
    ├── citiDataLoader.ts
    │       → CITI_PILOT_METRICS (23 fields)
    │       → CITI_DEMO_BUSINESSES (10 items)
    │
    ├── citiPortfolioLoader.ts
    │       → CITI_PORTFOLIO (11 fields)
    │       → CITI_SEGMENTS (8 items)
    │       → CITI_RISK_TIERS (5 tiers)
    │
    ├── citiCampaignLoader.ts
    │       → CITI_CAMPAIGNS (3 items)
    │       → CITI_CAMPAIGN_SUMMARY (6 fields)
    │       → CITI_CONVERSION_BY_SEGMENT (8 items)
    │
    ├── citiRiskLoader.ts
    │       → CITI_RISK_KPIS (6 fields)
    │       → CITI_CONCENTRATION (2 dimensions)
    │       → CITI_EWS_CLUSTERS (5 items)
    │       → CITI_COMPLIANCE (4 fields)
    │
    ├── citiUnderwritingLoader.ts
    │       → CITI_UNDERWRITING (kpis, queue[15], rules)
    │
    ├── citiFilterLoader.ts
    │       → CITI_FILTER_OPTIONS (6 fields)
    │       → CITI_SAVED_SEGMENTS (5 items)
    │       → CITI_SAMPLE_BUSINESSES (50 items)
    │
    └── citiPortfolioSegments.ts (handcrafted)
            → CITI_INDUSTRY_SEGMENTS (8 items, enriched)
            → CITI_PORTFOLIO_KPIS (6 items)
            → CITI_GEOGRAPHIC_DISTRIBUTION (5 items)
            → CITI_RISK_TIER_DISTRIBUTION (5 items)
            → CITI_CONCENTRATION_METRICS (3 items)
            → CITI_EWS_ALERT_CLUSTERS (5 items)
            → CITI_ACTIVE_CAMPAIGNS (3 items)
            → CITI_COMPLETED_CAMPAIGNS (6 items, handcrafted)
            → CITI_PRODUCT_ELIGIBILITY (7 products)
```

---

## Usage Examples

### Example 1: Load Portfolio Summary
```typescript
import { CITI_PORTFOLIO } from '@/data/citiPortfolioLoader';

console.log(CITI_PORTFOLIO.totalBusinesses);  // 450000
console.log(CITI_PORTFOLIO.totalExposure);    // 98400000000 ($98.4B)
console.log(CITI_PORTFOLIO.preQualRate);      // 0.62 (62%)
```

### Example 2: Load Campaign Funnel Metrics
```typescript
import { CITI_CAMPAIGNS } from '@/data/citiCampaignLoader';

const techCampaign = CITI_CAMPAIGNS[0];
const viewRate = techCampaign.funnel.viewed / techCampaign.funnel.pushed;
const applyRate = techCampaign.funnel.applied / techCampaign.funnel.viewed;
console.log(`View: ${viewRate.toFixed(2)} | Apply: ${applyRate.toFixed(2)}`);
// Output: "View: 0.50 | Apply: 0.26"
```

### Example 3: Render Risk Tier Distribution Chart
```typescript
import { CITI_RISK_TIER_DISTRIBUTION } from '@/data/citiPortfolioSegments';

const chartData = CITI_RISK_TIER_DISTRIBUTION.map((tier) => ({
  name: tier.tier,
  value: tier.count,
  percentage: tier.percentage,
  color: tier.color,
}));

// Use with Recharts PieChart
```

### Example 4: Filter Businesses by State
```typescript
import { CITI_SAMPLE_BUSINESSES } from '@/data/citiFilterLoader';

const nyBusinesses = CITI_SAMPLE_BUSINESSES.filter((biz) => biz.state === 'NY');
console.log(`Found ${nyBusinesses.length} businesses in NY`);
```

---

## Changelog

| Date       | Change                                                                 |
|------------|------------------------------------------------------------------------|
| 2026-02-12 | Initial documentation — mapped all 7 loader files + citiPortfolioSegments |
| 2026-02-12 | Added validation checks for totals (450K businesses, $98.4B exposure) |
| 2026-02-12 | Documented all 39 exported constants with sample values                |

---

**Last Updated:** 2026-02-12
**Maintained By:** DevOps + Data Team
**Source of Truth:** `/src/data/citi.json` (checked into git)
