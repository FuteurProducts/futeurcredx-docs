# JPMorgan Chase Metrics Reconciliation

**Date:** 2026-02-11
**Purpose:** Reconcile differences between CHASE-QUANT and CHASE-QUANT-2 research

---

## KEY DIFFERENCES SUMMARY

| Metric | CHASE-QUANT (Original) | CHASE-QUANT-2 (Web Search) | Recommendation |
|--------|------------------------|----------------------------|----------------|
| **Total Customers** | 6.5M (midpoint estimate) | 7.0M (confirmed) | **Use 7.0M** ✅ |
| **Total Exposure** | $650B (deposits only) | $350B (loan-focused) | **Use $350B loans** ✅ |
| **Avg Exposure** | $100K (deposits) | $50K (loans) | **Use $50K** ✅ |
| **NCO Rate** | 0.28% (estimate) | 0.50% (Fed data) | **Use 0.50%** ✅ |
| **Pre-Qual Rate** | 67% | 65% | **Use 65%** ✅ |
| **Growth Rate** | 4.5% (estimate) | 10% (confirmed) | **Use 10%** ✅ |

---

## DETAILED RECONCILIATION

### 1. Total Business Customers

**CHASE-QUANT:** 6,500,000
- Source: "JPMorgan Chase serves 6-7 million small businesses"
- Method: Used midpoint of range
- Confidence: MEDIUM (range estimate)

**CHASE-QUANT-2:** 7,000,000
- Source: "JPMorgan Chase Consumer & Community Banking 2024 Annual Report"
- Exact quote: "7 million small business clients"
- "up 10% year-over-year"
- Confidence: HIGH (direct confirmation)

**DECISION:** **Use 7,000,000** ✅

**Rationale:**
- Direct quote from official 2024 annual report
- Specific number, not a range
- Confirmed across multiple 2024 sources
- Aligns with "ended 2024 with...7 million small business clients"

---

### 2. Total Exposure Definition

**CHASE-QUANT:** $650 billion (deposits)
- Focused on business deposits as primary metric
- Calculation: 27% of $2.406T total deposits
- Rationale: Deposits are stickier, relationship metric

**CHASE-QUANT-2:** $350 billion (loans)
- Focused on business loans/lending exposure
- Calculation: 7M customers × $50K avg
- Validation: ~24% of $1.467T total loans
- Rationale: Credit risk exposure, lending opportunity

**DECISION:** **Use $350 billion LOANS** ✅

**Rationale:**
- Dashboard is credit/risk-focused (Credit Intelligence)
- Metrics are about lending opportunity, not deposits
- Pre-qualified offers are loan products
- At-risk exposure relates to credit exposure
- Revenue opportunity is from net interest on loans
- Aligns with "offer potential" concept

**Note:** Both metrics are valid but serve different purposes:
- **Deposits ($650B):** Relationship value, funding base
- **Loans ($350B):** Credit exposure, lending opportunity ← **Dashboard focus**

---

### 3. Average Exposure per Business

**CHASE-QUANT:** $100,000
- Calculation: $650B deposits / 6.5M = $100K
- Represents average deposits per customer
- Notes: "total relationship value higher when including loans"

**CHASE-QUANT-2:** $50,000
- Based on industry data: 94.9% of SMB loans under $100K
- Chase product limits: $500K max for business loans
- PPP averages: $81K-$120K by state
- Industry average: $663K (skewed by large commercial)
- Conservative estimate for SMB-focused portfolio

**DECISION:** **Use $50,000** ✅

**Rationale:**
- More realistic for small business lending exposure
- Supported by FDIC data (94.9% < $100K)
- Aligns with Chase's focus on smaller SMB segment
- Accounts for:
  - Not all customers have loans (some deposits only)
  - Lines of credit with partial utilization
  - Mix heavily weighted to smaller loans
- $100K deposit average is separate metric

---

### 4. Net Charge-Off Rate

**CHASE-QUANT:** 0.28%
- Source: "Industry benchmark for large bank commercial lending"
- Range: 0.20-0.35% typical for large banks
- Confidence: MEDIUM (estimated)

**CHASE-QUANT-2:** 0.50%
- Source: Federal Reserve - Business loan charge-off rate (Oct 2024)
- Official government data
- Confidence: HIGH (authoritative source)

**DECISION:** **Use 0.50%** ✅

**Rationale:**
- Official Federal Reserve data
- Specific to business loans
- Current (Oct 2024)
- Industry benchmark vs. estimate
- Still better than overall industry average (0.67%)

**Reconciliation Note:**
- 0.28% may have been large bank average
- 0.50% is broader business loan market
- Chase likely performs at/below 0.50% given credit quality
- Using 0.50% is conservative (safer estimate)

---

### 5. Pre-Qualified Rate

**CHASE-QUANT:** 67%
- Source: "Industry benchmark 60-70%"
- Rationale: "Chase at high end due to credit quality"
- Assumption: Premium positioning justifies higher rate

**CHASE-QUANT-2:** 65%
- Source: Industry benchmark 60-70%
- Rationale: Used midpoint for conservative estimate
- Method: Standard benchmark application

**DECISION:** **Use 65%** ✅

**Rationale:**
- More conservative (avoids over-optimism)
- Midpoint of 60-70% range is defensible
- Difference is only 130K customers (2%)
- Better to under-promise, over-deliver
- 67% assumes Chase significantly outperforms (needs validation)

**Impact:**
- 67%: 4,355,000 pre-qualified
- 65%: 4,550,000 pre-qualified
- Difference: +195,000 customers
- **Wait, 65% yields MORE customers because base is 7M vs 6.5M**

**Actual Comparison:**
- CHASE-QUANT: 6.5M × 67% = 4,355,000
- CHASE-QUANT-2: 7.0M × 65% = 4,550,000
- Net difference: +195,000 (4.5% more)

---

### 6. Portfolio Growth Rate

**CHASE-QUANT:** 4.5% YoY
- Source: "Estimated from branch expansion and customer acquisition"
- Method: Inferred from 875 new branches
- Confidence: MEDIUM (estimated)

**CHASE-QUANT-2:** 10% YoY
- Source: "JPMorgan Chase Consumer & Community Banking 2024 report"
- Exact quote: "up 10% year-over-year"
- Confidence: HIGH (direct confirmation)

**DECISION:** **Use 10%** ✅

**Rationale:**
- Directly stated in official report
- Not estimated or inferred
- Specific to small business client count
- Represents actual performance, not estimate
- Strong growth exceeds industry average

---

### 7. At-Risk Calculations

**CHASE-QUANT:**
- At-risk rate: 13%
- Calculation: NCO (0.28%) + NPL (0.65%) + Watch list (12%)
- At-risk count: 845,000
- At-risk exposure: $84.5B

**CHASE-QUANT-2:**
- At-risk rate: 3.5%
- Calculation: Delinquency 30+ (2.5%) + Delinquency 90+ (1.0%)
- At-risk count: 245,000
- At-risk exposure: $12.25B

**DECISION:** **Use 3.5% / $12.25B** ✅

**Rationale:**
- 13% at-risk rate seems extremely high for Chase's quality
- CHASE-QUANT double-counted components:
  - Watch list (12%) already includes NPL (0.65%)
  - Should be: MAX of (Watch + NPL) or (Delinq 30+), not sum
- 3.5% aligns with:
  - Industry delinquency benchmarks
  - Chase's strong credit quality reputation
  - NCO rate of 0.50% (typically 15-20% of delinquencies charge off)
- More realistic: 2.5% early delinq + 1.0% serious delinq = 3.5% total risk

**Correction to CHASE-QUANT:**
The 12% "watch list" likely included all non-prime credits, not just at-risk.
- Prime (25%) + Low Risk (45%) = 70% not at risk
- 30% below prime doesn't mean "at risk"
- True at-risk: only serious delinquencies (2.5-3.5%)

---

### 8. Offer Potential

**CHASE-QUANT:** $145 billion
- Calculation: 4.355M × $100K × 33% = $143.7B ≈ $145B
- Avg offer size: $100K
- Acceptance rate: 33%

**CHASE-QUANT-2:** $136.5 billion
- Calculation: 4.55M × $50K × 60% = $136.5B
- Avg offer size: $50K
- Acceptance rate: 60%

**DECISION:** **Use CHASE-QUANT-2 methodology** ✅

**Rationale:**
- Offer size should match average exposure ($50K) for consistency
- 60% acceptance for targeted pre-qualified offers is reasonable
- Lower offer size × higher acceptance = more realistic conversion
- $50K offers are:
  - More accessible to small businesses
  - Higher likelihood of full utilization
  - Better for risk management
- $100K offers assume:
  - Larger credit lines
  - Lower acceptance due to higher commitment
  - May not align with typical SMB needs

**Alternative Scenario:**
If using $100K offer with 30% acceptance (more realistic than 33%):
- 4.55M × $100K × 30% = $136.5B (same result!)

**Conclusion:** Both arrive at ~$136-145B range, CHASE-QUANT-2 is more conservative

---

### 9. Revenue Opportunity

**CHASE-QUANT:** Not calculated in original file

**CHASE-QUANT-2:** $4.095 billion
- Calculation: $136.5B × 3.0% NIM = $4.095B
- Based on 3.0% net interest margin

**DECISION:** **Add this metric** ✅

**Rationale:**
- Key metric for dashboard
- Shows financial impact of opportunity
- 3.0% NIM is reasonable:
  - JPM firmwide NIM: 2.91%
  - Commercial lending typically 3.0-3.5%
  - Using lower bound is conservative

---

## RECOMMENDED FINAL METRICS

### Use CHASE-QUANT-2 calculations with following values:

```json
{
  "total_portfolio": 7000000,
  "total_exposure_billions": 350.0,
  "avg_exposure_per_business": 50000,
  "portfolio_growth_rate_yoy": 0.10,
  "pre_qualified_count": 4550000,
  "pre_qualified_rate": 0.65,
  "at_risk_count": 245000,
  "at_risk_rate": 0.035,
  "at_risk_exposure_billions": 12.25,
  "offer_potential_billions": 136.5,
  "revenue_opportunity_millions": 4095.0,
  "avg_credit_score": 62,
  "net_charge_off_rate": 0.005
}
```

---

## METHODOLOGY ALIGNMENT

### CHASE-QUANT Strengths:
- Deep dive into SEC filings
- Comprehensive segment analysis
- Multiple data points triangulation
- Strong deposit analysis

### CHASE-QUANT-2 Strengths:
- Web search validation
- Direct confirmation of key metrics
- Industry benchmark grounding
- Conservative assumptions
- Focus on lending (dashboard purpose)

### Combined Approach:
Use CHASE-QUANT-2 core metrics (confirmed via web search) with CHASE-QUANT contextual data (segment breakdown, trends, strategic insights).

---

## VALIDATION CHECKS

### Internal Consistency
✅ 7M customers × $50K = $350B ✓
✅ $12.25B / $350B = 3.5% ✓
✅ 245K / 7M = 3.5% ✓
✅ Credit scores sum to 100% ✓
✅ NCO (0.5%) < Delinquency (3.5%) ✓

### External Benchmarks
✅ Growth rate (10%) > industry (3-5%) ✓
✅ NCO (0.5%) < industry (0.67%) ✓
✅ Pre-qual rate (65%) in range (60-70%) ✓
✅ Avg loan ($50K) aligns with FDIC data ✓

---

## CONFIDENCE ASSESSMENT

| Metric | Confidence | Basis |
|--------|-----------|-------|
| Total Customers (7M) | ⭐⭐⭐⭐⭐ | Direct from annual report |
| Growth Rate (10%) | ⭐⭐⭐⭐⭐ | Direct from CCB report |
| Total Exposure ($350B) | ⭐⭐⭐⭐ | Calculated + validated |
| Avg Exposure ($50K) | ⭐⭐⭐⭐ | Industry data backed |
| NCO Rate (0.5%) | ⭐⭐⭐⭐⭐ | Federal Reserve official |
| Pre-Qual Rate (65%) | ⭐⭐⭐⭐ | Industry benchmark |
| At-Risk Rate (3.5%) | ⭐⭐⭐ | Estimated from industry |
| Credit Distribution | ⭐⭐⭐ | Modeled from indicators |

---

## UPDATED DATA SOURCES

Combine both research efforts:

**Primary Sources (CHASE-QUANT-2):**
1. JPMorgan Chase 2024 Annual Report - Consumer & Community Banking
2. Federal Reserve - Business Loan Charge-Off Rates
3. FDIC Small Business Lending Survey 2024
4. Federal Reserve Small Business Credit Survey 2025

**Supporting Sources (CHASE-QUANT):**
1. JPMorgan Chase 10-K 2024
2. Q4 2024 Earnings Release
3. Investor Day Presentations
4. SBA Office of Advocacy data

---

## ACTION ITEMS

1. ✅ Use 7.0M customers (not 6.5M)
2. ✅ Use $350B loan exposure (not $650B deposits)
3. ✅ Use $50K average (not $100K)
4. ✅ Use 0.50% NCO rate (not 0.28%)
5. ✅ Use 3.5% at-risk rate (not 13%)
6. ✅ Use 10% growth rate (not 4.5%)
7. ✅ Use 65% pre-qualified rate (not 67%)
8. ⏭️ Keep CHASE-QUANT segment analysis for context
9. ⏭️ Keep CHASE-QUANT trends data for dashboard
10. ⏭️ Merge both source lists for comprehensive documentation

---

## CONCLUSION

**Primary Dataset:** CHASE-QUANT-2 (chase_calculated_metrics.json)

**Supporting Context:** CHASE-QUANT (chase_quantitative.json)

**Rationale:**
- CHASE-QUANT-2 has more recent, specific confirmations
- Direct quotes from 2024 annual report
- Official government benchmark data
- Conservative assumptions appropriate for dashboard
- Focused on lending (dashboard purpose)

**Use Case:**
- **Dashboard metrics:** CHASE-QUANT-2
- **Strategic context:** CHASE-QUANT
- **Trends/segments:** CHASE-QUANT
- **Market positioning:** Both (complementary)

---

*End of Reconciliation Document*
