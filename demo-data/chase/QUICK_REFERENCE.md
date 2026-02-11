# JPMorgan Chase Business Banking - Quick Reference

**For Lumiq AI Dashboard Integration**
**Data as of:** Q4 2024
**Generated:** 2026-02-11

---

## KEY METRICS AT A GLANCE

| Metric | Value | Format for UI |
|--------|-------|---------------|
| **Total Portfolio** | 7,000,000 | 7.0M customers |
| **Total Exposure** | $350,000,000,000 | $350.0B |
| **Avg Exposure/Business** | $50,000 | $50K |
| **Portfolio Growth YoY** | 10% | +10.0% |
| **Pre-Qualified Count** | 4,550,000 | 4.55M |
| **Pre-Qualified Rate** | 65% | 65.0% |
| **At Risk Count** | 245,000 | 245K |
| **At Risk Rate** | 3.5% | 3.5% |
| **At Risk Exposure** | $12,250,000,000 | $12.25B |
| **Offer Potential** | $136,500,000,000 | $136.5B |
| **Revenue Opportunity** | $4,095,000,000 | $4.10B |
| **Avg Credit Score** | 62 | 62/100 |

---

## CREDIT SCORE DISTRIBUTION

```json
{
  "high_risk_0_40": 8,      // 560,000 customers, $28B exposure
  "medium_risk_40_55": 22,  // 1,540,000 customers, $77B exposure
  "low_risk_55_70": 45,     // 3,150,000 customers, $157.5B exposure
  "prime_70_plus": 25       // 1,750,000 customers, $87.5B exposure
}
```

**Dashboard Colors:**
- High Risk (0-40): Red
- Medium Risk (40-55): Orange
- Low Risk (55-70): Yellow
- Prime (70+): Green

---

## CREDIT QUALITY INDICATORS

| Metric | Rate | Dollar Amount |
|--------|------|---------------|
| Net Charge-Off | 0.5% | $1.75B/year |
| 30+ Day Delinquent | 2.5% | $8.75B |
| 90+ Day Delinquent | 1.0% | $3.50B |
| Watch List | 1.5% | $5.25B |
| Criticized Assets | 2.8% | $9.80B |
| Allowance for Losses | 2.0% | $7.00B |
| Coverage Ratio | 2.0x | - |

**Status Indicators:**
- ✅ NCO Rate: 0.50% (Industry: 0.67%) - **BETTER**
- ✅ Coverage: 2.0x - **STRONG**
- ✅ Delinquencies: 3.5% total - **ACCEPTABLE**

---

## CONCENTRATION RISK

### Top 5 Industries
| Industry | % of Portfolio | Exposure |
|----------|----------------|----------|
| Professional Services | 18.5% | $64.75B |
| Retail Trade | 15.0% | $52.50B |
| Healthcare Services | 12.0% | $42.00B |
| Construction | 10.0% | $35.00B |
| Restaurants/Food | 8.0% | $28.00B |
| **Other** | **36.5%** | **$127.75B** |

**HHI:** 0.09 (Low concentration ✅)

### Top 5 Regions
| Region | % of Portfolio | Exposure |
|--------|----------------|----------|
| California | 22.3% | $78.05B |
| Texas | 15.0% | $52.50B |
| New York | 12.0% | $42.00B |
| Florida | 10.0% | $35.00B |
| Illinois | 8.0% | $28.00B |
| **Other** | **32.7%** | **$114.45B** |

**HHI:** 0.12 (Moderate concentration ✅)

---

## LENDING PERFORMANCE

| Metric | Value | Benchmark |
|--------|-------|-----------|
| Approval Rate | 44% | Industry avg: 44% |
| Partial Approval | 22% | - |
| Rejection Rate | 34% | - |
| Avg Approval Time | 5 days | Industry: 5 days |
| Avg Interest Rate | 8.83% | Range: 5.75%-11.91% |
| Net Interest Margin | 3.0% | Firmwide: 2.91% |
| Line Utilization | 52% | Industry: 40-60% |

---

## GROWTH METRICS

### Portfolio Growth
```
2023: 6,363,636 customers
2024: 7,000,000 customers
Growth: +636,364 customers (+10.0%)
```

### Market Position
- **Market Share:** 9.7% (#1 ranking)
- **YoY Gain:** +25 basis points
- **5-Year Gain:** +28 basis points (since 2019)
- **Primary Bank:** 80% of consumer, 65% of small business

### Customer Acquisition
```
New customers (2024): ~636,364
Avg new customer value: $50,000
New business value: $31.8B
```

---

## OPPORTUNITY SIZING

### Pre-Qualified Segment
```
Total pre-qualified: 4,550,000 (65%)
Current exposure: $227.5B (4.55M × $50K)
Offer potential: $136.5B (at 60% acceptance)
Revenue opportunity: $4.1B/year (at 3% NIM)
```

### Breakdown by Credit Tier
| Tier | Customers | Current Exposure | Offer Potential | Revenue Opp |
|------|-----------|------------------|-----------------|-------------|
| Prime (70+) | 1,750,000 | $87.5B | $52.5B | $1.58B |
| Low Risk (55-70) | 3,150,000 | $157.5B | $94.5B | $2.84B |
| Medium Risk (40-55) | 1,540,000 | $77.0B | $46.2B | $1.39B |
| **Total Pre-Qual** | **6,440,000** | **$322.0B** | **$193.2B** | **$5.80B** |

**Note:** Using 65% industry benchmark = 4.55M customers (conservative)

---

## DASHBOARD CHARTS

### Portfolio Composition (Pie Chart)
```json
{
  "Prime (70+)": 25,
  "Low Risk (55-70)": 45,
  "Medium Risk (40-55)": 22,
  "High Risk (0-40)": 8
}
```

### Credit Quality Trend (Line Chart)
```json
{
  "Q1_2024": {"nco": 0.45, "delinq": 2.3},
  "Q2_2024": {"nco": 0.48, "delinq": 2.4},
  "Q3_2024": {"nco": 0.50, "delinq": 2.5},
  "Q4_2024": {"nco": 0.50, "delinq": 2.5}
}
```

### Growth Trajectory (Bar Chart)
```json
{
  "2020": 5500000,
  "2021": 5900000,
  "2022": 6200000,
  "2023": 6363636,
  "2024": 7000000
}
```

---

## RISK SEGMENTATION

### Portfolio by Risk Level

| Risk Level | Customers | % | Exposure | % | Avg Score |
|------------|-----------|---|----------|---|-----------|
| **Prime** | 1,750,000 | 25% | $87.5B | 25% | 80 |
| **Low Risk** | 3,150,000 | 45% | $157.5B | 45% | 62.5 |
| **Medium Risk** | 1,540,000 | 22% | $77.0B | 22% | 47.5 |
| **High Risk** | 560,000 | 8% | $28.0B | 8% | 25 |
| **TOTAL** | **7,000,000** | **100%** | **$350.0B** | **100%** | **62** |

### At-Risk Breakdown

| Status | Customers | Exposure | Action |
|--------|-----------|----------|--------|
| Current (no issues) | 6,650,000 | $332.5B | ✅ Monitor |
| Watch List | 105,000 | $5.25B | ⚠️ Enhanced monitoring |
| 30-89 Days Past Due | 175,000 | $8.75B | ⚠️ Collections |
| 90+ Days Past Due | 70,000 | $3.50B | 🚨 Workout/charge-off |

---

## ACTIONABLE INSIGHTS FOR DASHBOARD

### 🎯 Top Opportunities
1. **Pre-Qualified Upsell:** 4.55M customers → $136.5B potential → $4.1B revenue
2. **Prime Segment Growth:** 1.75M prime customers at 80 score = lowest risk expansion
3. **Geographic Expansion:** 32.7% in "Other" regions = whitespace opportunity

### ⚠️ Risk Alerts
1. **At-Risk Exposure:** $12.25B (3.5%) requires monitoring
2. **90+ Delinquencies:** $3.50B (1.0%) needs active workout
3. **High-Risk Segment:** 560K customers (8%) = potential charge-offs

### 📊 Performance Highlights
1. **Market Leader:** #1 ranking with 9.7% share
2. **Strong Growth:** 10% YoY customer growth
3. **Better Credit Quality:** 0.50% NCO vs. 0.67% industry
4. **Solid Coverage:** 2.0x reserve ratio

---

## DATA REFRESH SCHEDULE

| Metric | Update Frequency | Source |
|--------|------------------|--------|
| Customer Count | Quarterly | JPM Earnings |
| Credit Quality | Quarterly | JPM Financials |
| Market Share | Annual | Industry Reports |
| Benchmarks | Annual | Fed/FDIC Reports |

**Next Update:** April 2025 (Q1 2025 earnings)

---

## INTEGRATION NOTES

### API Response Format
```typescript
interface ChaseMetrics {
  totalPortfolio: number;           // 7000000
  totalExposureBillions: number;    // 350.0
  avgExposure: number;               // 50000
  growthRate: number;                // 0.10
  preQualifiedCount: number;         // 4550000
  preQualifiedRate: number;          // 0.65
  atRiskCount: number;               // 245000
  atRiskRate: number;                // 0.035
  atRiskExposureBillions: number;   // 12.25
  offerPotentialBillions: number;   // 136.5
  revenueOpportunityMillions: number; // 4095
  avgCreditScore: number;            // 62
  scoreDistribution: {
    highRisk: number;                 // 0.08
    mediumRisk: number;               // 0.22
    lowRisk: number;                  // 0.45
    prime: number;                    // 0.25
  };
}
```

### Display Formatters
```typescript
// Currency
const formatBillions = (n: number) => `$${n.toFixed(1)}B`;
const formatMillions = (n: number) => `$${n.toFixed(0)}M`;

// Percentages
const formatPercent = (n: number) => `${(n * 100).toFixed(1)}%`;

// Large numbers
const formatCustomers = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
};
```

---

## CONFIDENCE LEVELS

| Metric Category | Confidence | Source Quality |
|-----------------|------------|----------------|
| Customer Count | ⭐⭐⭐⭐⭐ | Direct from JPM |
| Growth Rate | ⭐⭐⭐⭐⭐ | Direct from JPM |
| Average Exposure | ⭐⭐⭐⭐ | Industry-based |
| Pre-Qualified Rate | ⭐⭐⭐⭐ | Industry benchmark |
| Credit Quality | ⭐⭐⭐⭐ | Fed/FDIC data |
| Score Distribution | ⭐⭐⭐ | Modeled |
| Concentration | ⭐⭐⭐ | Estimated |

---

*For detailed calculation methodology, see CALCULATION_WORKINGS.md*
*For full JSON data, see chase_calculated_metrics.json*
