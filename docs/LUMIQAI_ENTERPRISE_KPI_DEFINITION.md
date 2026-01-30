# LumiqAI Enterprise Dashboard: KPI Definition Reference

This document defines every KPI visible in the enterprise dashboard from a frontend perspective.

---

## 1. Portfolio Performance KPIs

### 1.1 Avg LumiqAI Score

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Performance mode), Overview tiles, Portfolio Health Card |
| **Representation** | Exposure-weighted average credit score across all SMB entities in portfolio |
| **Directionality** | Higher is better |
| **Time Range** | Point-in-time with 90-day trend indicator |
| **Format** | Numeric score (0–100 scale) |
| **Confidence Signals** | Data source shown ("LumiqAI Score Engine"), last updated timestamp ("2 mins ago") |

---

### 1.2 Score Momentum (90d)

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Performance mode) KPI tiles |
| **Representation** | Average score change percentage over the last 90 days |
| **Directionality** | Higher is better (positive momentum preferred) |
| **Time Range** | 90 days |
| **Format** | Percentage with +/- indicator |
| **Confidence Signals** | Data source shown, tooltip explains calculation |

---

### 1.3 % Improving Clients

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Performance mode) KPI tiles |
| **Representation** | Percentage of clients with score improvement ≥5 points in 90 days |
| **Directionality** | Higher is better |
| **Time Range** | 90 days |
| **Format** | Percentage |
| **Confidence Signals** | Tooltip defines threshold (≥5 pts), data source shown |

---

### 1.4 % Deteriorating Clients

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Performance mode) KPI tiles |
| **Representation** | Percentage of clients with score decline ≥5 points in 90 days |
| **Directionality** | Lower is better |
| **Time Range** | 90 days |
| **Format** | Percentage |
| **Confidence Signals** | Tooltip defines threshold (≥5 pts), trend shows improvement when declining |

---

### 1.5 Portfolio Volatility

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Performance mode) KPI tiles |
| **Representation** | Standard deviation of score changes across portfolio |
| **Directionality** | Lower is better (stability preferred) |
| **Time Range** | Rolling calculation, 1-hour data refresh |
| **Format** | Numeric index |
| **Confidence Signals** | Data source ("Risk Analytics"), last updated timestamp |

---

### 1.6 Exp-Weighted Risk Index

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Performance mode) KPI tiles |
| **Representation** | Exposure-weighted aggregate risk metric across portfolio |
| **Directionality** | Lower is better |
| **Time Range** | Point-in-time with trend indicator |
| **Format** | Numeric score |
| **Confidence Signals** | Data source ("Risk Engine"), 15-minute refresh |

---

## 2. Customer Relationship KPIs

### 2.1 Avg Relationship Health (RHS)

| Attribute | Value |
|-----------|-------|
| **Location** | Customer page, Relationship Health Summary |
| **Representation** | Composite score combining credit posture, deposit growth, product usage, digital engagement, and risk flags |
| **Directionality** | Higher is better |
| **Time Range** | Point-in-time with trend over selected period |
| **Format** | Numeric score (0–100 scale, displayed as X/100) |
| **Confidence Signals** | Tooltip explains composite calculation, trend percentage shown |

---

### 2.2 Growing Relationships

| Attribute | Value |
|-----------|-------|
| **Location** | Customer page, Relationship Health Summary |
| **Representation** | Percentage of clients showing positive RHS trajectory |
| **Directionality** | Higher is better |
| **Time Range** | Selected time period (configurable) |
| **Format** | Percentage |
| **Confidence Signals** | Trend indicator, tooltip describes calculation |

---

### 2.3 At Risk Relationships

| Attribute | Value |
|-----------|-------|
| **Location** | Customer page, Relationship Health Summary |
| **Representation** | Percentage of clients with declining RHS or negative engagement signals |
| **Directionality** | Lower is better |
| **Time Range** | Selected time period |
| **Format** | Percentage |
| **Confidence Signals** | Trend indicator (improvement when decreasing), tooltip describes criteria |

---

### 2.4 Cross-sell Penetration

| Attribute | Value |
|-----------|-------|
| **Location** | Customer page, Relationship Health Summary, Analytics (Growth mode) |
| **Representation** | Average number of products per customer relative to target wallet share |
| **Directionality** | Higher is better |
| **Time Range** | Point-in-time |
| **Format** | Percentage |
| **Confidence Signals** | Trend percentage shown |

---

## 3. Risk Intelligence KPIs

### 3.1 Expected Loss (EL)

| Attribute | Value |
|-----------|-------|
| **Location** | Risk page, Executive Risk Summary |
| **Representation** | Aggregate expected loss exposure across portfolio |
| **Directionality** | Lower is better |
| **Time Range** | Point-in-time with period-over-period change |
| **Format** | Currency (displayed in millions) |
| **Confidence Signals** | Trend direction, change percentage, sparkline chart |

---

### 3.2 Deteriorations

| Attribute | Value |
|-----------|-------|
| **Location** | Risk page, Executive Risk Summary trend strip |
| **Representation** | Count of accounts showing score deterioration |
| **Directionality** | Lower is better |
| **Time Range** | 30-day trend |
| **Format** | Count |
| **Confidence Signals** | Sparkline showing 30-day trend, percentage change |

---

### 3.3 Delinquencies

| Attribute | Value |
|-----------|-------|
| **Location** | Risk page, Executive Risk Summary trend strip |
| **Representation** | Count of accounts in delinquent status |
| **Directionality** | Lower is better |
| **Time Range** | 30-day trend |
| **Format** | Count |
| **Confidence Signals** | Sparkline chart, percentage change indicator |

---

### 3.4 Cashflow Stress

| Attribute | Value |
|-----------|-------|
| **Location** | Risk page, Executive Risk Summary trend strip |
| **Representation** | Count of accounts exhibiting cashflow stress signals |
| **Directionality** | Lower is better |
| **Time Range** | 30-day trend |
| **Format** | Count |
| **Confidence Signals** | Sparkline chart, percentage change |

---

### 3.5 Bureau Drops

| Attribute | Value |
|-----------|-------|
| **Location** | Risk page, Executive Risk Summary trend strip |
| **Representation** | Count of accounts with significant bureau score declines |
| **Directionality** | Lower is better |
| **Time Range** | 30-day trend |
| **Format** | Count |
| **Confidence Signals** | Sparkline chart, percentage change |

---

### 3.6 Deterioration Driver Impact

| Attribute | Value |
|-----------|-------|
| **Location** | Risk page, Executive Risk Summary |
| **Representation** | Relative contribution of each risk driver to portfolio deterioration |
| **Directionality** | Lower is better for individual drivers |
| **Time Range** | Current period |
| **Format** | Percentage of total impact |
| **Confidence Signals** | Trend direction (increasing/decreasing/stable), affected accounts count |

---

## 4. Underwriting Performance KPIs

### 4.1 AI Accuracy

| Attribute | Value |
|-----------|-------|
| **Location** | Underwriting Assistant page, metrics card |
| **Representation** | Model prediction accuracy rate |
| **Directionality** | Higher is better |
| **Time Range** | Current month vs. previous month |
| **Format** | Percentage |
| **Confidence Signals** | Change percentage vs last month, sparkline trend |

---

### 4.2 Avg Decision Time

| Attribute | Value |
|-----------|-------|
| **Location** | Underwriting Assistant page, metrics card |
| **Representation** | Average time from application to decision |
| **Directionality** | Lower is better |
| **Time Range** | Current period |
| **Format** | Time (minutes) |
| **Confidence Signals** | Comparison to manual process, sparkline trend showing improvement |

---

### 4.3 Auto-Approved Today

| Attribute | Value |
|-----------|-------|
| **Location** | Underwriting Assistant page, metrics card |
| **Representation** | Count of applications auto-approved by AI decisioning |
| **Directionality** | Context-dependent (efficiency indicator) |
| **Time Range** | Today |
| **Format** | Count |
| **Confidence Signals** | Change percentage vs yesterday |

---

### 4.4 Human Override Rate

| Attribute | Value |
|-----------|-------|
| **Location** | Underwriting Assistant page, metrics card |
| **Representation** | Percentage of AI decisions overridden by human underwriters |
| **Directionality** | Lower is better (indicates model trust) |
| **Time Range** | Current period |
| **Format** | Percentage |
| **Confidence Signals** | Trend indicator showing "improving" when decreasing |

---

### 4.5 Applications Received

| Attribute | Value |
|-----------|-------|
| **Location** | Underwriting Assistant page, daily stats |
| **Representation** | Total application volume received |
| **Directionality** | Context-dependent (pipeline health indicator) |
| **Time Range** | Today |
| **Format** | Count |
| **Confidence Signals** | Change percentage indicator |

---

### 4.6 Approved Count

| Attribute | Value |
|-----------|-------|
| **Location** | Underwriting Assistant page, daily stats |
| **Representation** | Number of applications approved |
| **Directionality** | Higher is generally better (conversion) |
| **Time Range** | Today |
| **Format** | Count |
| **Confidence Signals** | Change percentage |

---

### 4.7 In Review Count

| Attribute | Value |
|-----------|-------|
| **Location** | Underwriting Assistant page, daily stats |
| **Representation** | Applications currently pending human review |
| **Directionality** | Lower is better (reduced queue backlog) |
| **Time Range** | Point-in-time |
| **Format** | Count |
| **Confidence Signals** | Change percentage |

---

### 4.8 Declined Count

| Attribute | Value |
|-----------|-------|
| **Location** | Underwriting Assistant page, daily stats |
| **Representation** | Number of applications declined |
| **Directionality** | Context-dependent (risk management indicator) |
| **Time Range** | Today |
| **Format** | Count |
| **Confidence Signals** | Change percentage |

---

## 5. Conversion & Funnel KPIs

### 5.1 Pre-Qual to Apply Rate

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Conversion mode), Application Funnel Chart |
| **Representation** | Percentage of pre-qualified offers that convert to applications |
| **Directionality** | Higher is better |
| **Time Range** | Selected period |
| **Format** | Percentage |
| **Confidence Signals** | None explicit (derived calculation) |

---

### 5.2 Apply to Approve Rate

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Conversion mode), Application Funnel Chart |
| **Representation** | Approval rate for submitted applications |
| **Directionality** | Context-dependent (quality vs volume trade-off) |
| **Time Range** | Selected period |
| **Format** | Percentage |
| **Confidence Signals** | Segmented by product type |

---

### 5.3 Avg Time to Decision

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Conversion mode), Application Funnel metrics |
| **Representation** | Average days from application to decision |
| **Directionality** | Lower is better |
| **Time Range** | Selected period |
| **Format** | Days (decimal) |
| **Confidence Signals** | Product-level breakdown available |

---

### 5.4 Approval Rate by Segment

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Conversion mode), Approval by Segment table |
| **Representation** | Approval percentage broken down by business segment |
| **Directionality** | Context-dependent |
| **Time Range** | Selected period |
| **Format** | Percentage per segment |
| **Confidence Signals** | Volume shown alongside rate, avg limit approved |

---

## 6. API & System KPIs

### 6.1 Total API Requests

| Attribute | Value |
|-----------|-------|
| **Location** | Overview page, API Usage Card |
| **Representation** | Total API call volume |
| **Directionality** | Context-dependent (usage vs capacity) |
| **Time Range** | Last 30 days |
| **Format** | Count (formatted as K/M) |
| **Confidence Signals** | Percentage change indicator |

---

### 6.2 API Success Rate

| Attribute | Value |
|-----------|-------|
| **Location** | Overview page, API Usage Card |
| **Representation** | Percentage of API calls returning success responses |
| **Directionality** | Higher is better (99%+ is green, 95%+ is amber) |
| **Time Range** | Last 30 days |
| **Format** | Percentage with progress bar |
| **Confidence Signals** | Color-coded threshold indicators |

---

### 6.3 Avg API Latency

| Attribute | Value |
|-----------|-------|
| **Location** | Overview page, API Usage Card |
| **Representation** | Average response time for API calls |
| **Directionality** | Lower is better |
| **Time Range** | Last 30 days |
| **Format** | Milliseconds |
| **Confidence Signals** | None explicit |

---

### 6.4 API Error Count

| Attribute | Value |
|-----------|-------|
| **Location** | Overview page, API Usage Card |
| **Representation** | Total count of API errors |
| **Directionality** | Lower is better |
| **Time Range** | Last 30 days |
| **Format** | Count |
| **Confidence Signals** | None explicit |

---

### 6.5 Rate Limit Hits

| Attribute | Value |
|-----------|-------|
| **Location** | Overview page, API Usage Card |
| **Representation** | Count of requests hitting rate limits |
| **Directionality** | Lower is better |
| **Time Range** | Last 30 days |
| **Format** | Count |
| **Confidence Signals** | None explicit |

---

### 6.6 Daily Avg Requests

| Attribute | Value |
|-----------|-------|
| **Location** | Overview page, API Usage Card |
| **Representation** | Average daily request volume |
| **Directionality** | Context-dependent |
| **Time Range** | Last 30 days (averaged) |
| **Format** | Count |
| **Confidence Signals** | None explicit |

---

## 7. Data Quality KPIs

### 7.1 Data Freshness Percentage

| Attribute | Value |
|-----------|-------|
| **Location** | Overview page, Data Freshness Card |
| **Representation** | Percentage of accounts with data refreshed within 24 hours |
| **Directionality** | Higher is better (90%+ is green, 70%+ is amber) |
| **Time Range** | Point-in-time |
| **Format** | Percentage (circular progress indicator) |
| **Confidence Signals** | Color-coded thresholds, count breakdown |

---

### 7.2 Fresh Account Count

| Attribute | Value |
|-----------|-------|
| **Location** | Overview page, Data Freshness Card |
| **Representation** | Number of accounts with data less than 24 hours old |
| **Directionality** | Higher is better |
| **Time Range** | Point-in-time |
| **Format** | Count |
| **Confidence Signals** | Status badge "Fresh (<24h)" |

---

### 7.3 Stale Account Count

| Attribute | Value |
|-----------|-------|
| **Location** | Overview page, Data Freshness Card |
| **Representation** | Number of accounts with data 1-7 days old |
| **Directionality** | Lower is better |
| **Time Range** | Point-in-time |
| **Format** | Count |
| **Confidence Signals** | Status badge "Stale (1-7d)" |

---

### 7.4 Critical Freshness Count

| Attribute | Value |
|-----------|-------|
| **Location** | Overview page, Data Freshness Card |
| **Representation** | Number of accounts with data older than 7 days |
| **Directionality** | Lower is better (zero preferred) |
| **Time Range** | Point-in-time |
| **Format** | Count |
| **Confidence Signals** | Status badge "Critical (>7d)", red color indicator |

---

## 8. Portfolio Overview KPIs

### 8.1 Connected Businesses

| Attribute | Value |
|-----------|-------|
| **Location** | Overview page, Connected Businesses Card |
| **Representation** | Total count of SMB accounts connected via API |
| **Directionality** | Higher is better (growth indicator) |
| **Time Range** | Point-in-time with monthly growth |
| **Format** | Count |
| **Confidence Signals** | Real-time label, monthly growth percentage |

---

### 8.2 Active Connections

| Attribute | Value |
|-----------|-------|
| **Location** | Overview page, Connected Businesses Card |
| **Representation** | Count of currently active data connections |
| **Directionality** | Higher is better |
| **Time Range** | Point-in-time |
| **Format** | Count |
| **Confidence Signals** | None explicit |

---

### 8.3 New Connections MTD

| Attribute | Value |
|-----------|-------|
| **Location** | Overview page, Connected Businesses Card |
| **Representation** | New business connections added month-to-date |
| **Directionality** | Higher is better (growth indicator) |
| **Time Range** | Month-to-date |
| **Format** | Count with + prefix |
| **Confidence Signals** | None explicit |

---

### 8.4 Disconnected Count

| Attribute | Value |
|-----------|-------|
| **Location** | Overview page, Connected Businesses Card |
| **Representation** | Count of businesses with broken data connections |
| **Directionality** | Lower is better |
| **Time Range** | Point-in-time |
| **Format** | Count |
| **Confidence Signals** | Amber warning indicator |

---

## 9. Model Governance KPIs (Signal Effectiveness)

### 9.1 Feature Importance

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Signals mode), Feature Importance Chart |
| **Representation** | Relative contribution of each feature to model predictions |
| **Directionality** | Context-dependent (stability preferred) |
| **Time Range** | Current model version |
| **Format** | Percentage (0-100) |
| **Confidence Signals** | Trend indicator (stable/increasing/decreasing), category grouping |

---

### 9.2 Signal Drift - Mean Shift

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Signals mode), Signal Drift Monitor |
| **Representation** | Deviation of signal mean from training baseline |
| **Directionality** | Lower is better (stability) |
| **Time Range** | Current observation window |
| **Format** | Decimal |
| **Confidence Signals** | Status indicator (healthy/warning/critical), color coding |

---

### 9.3 Signal Drift - Variance Shift

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Signals mode), Signal Drift Monitor |
| **Representation** | Change in signal variance from training baseline |
| **Directionality** | Lower is better |
| **Time Range** | Current observation window |
| **Format** | Decimal |
| **Confidence Signals** | Status indicator |

---

### 9.4 Signal Missingness Rate

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Signals mode), Signal Drift Monitor |
| **Representation** | Percentage of missing values for a signal |
| **Directionality** | Lower is better |
| **Time Range** | Current observation window |
| **Format** | Percentage |
| **Confidence Signals** | Critical threshold triggers alert status |

---

### 9.5 Data Freshness by Signal

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Signals mode), Signal Drift Monitor |
| **Representation** | How recently signal data was refreshed |
| **Directionality** | More recent is better |
| **Time Range** | Point-in-time |
| **Format** | Time duration (hours) |
| **Confidence Signals** | Status badge tied to freshness thresholds |

---

## 10. Score Distribution KPIs

### 10.1 Score Bucket Distribution

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics, Credit Intelligence, Score Distribution Chart |
| **Representation** | Count and percentage of accounts in each score range |
| **Directionality** | Higher concentration in upper buckets is better |
| **Time Range** | Point-in-time |
| **Format** | Count per bucket with percentage and exposure |
| **Confidence Signals** | Exposure amounts shown, bucket ranges defined |

---

### 10.2 Score Migration Rate

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics (Performance mode), Score Migration Matrix |
| **Representation** | Percentage of accounts moving between score bands |
| **Directionality** | Higher upgrade rate is better, lower downgrade rate is better |
| **Time Range** | 90 days (configurable) |
| **Format** | Percentage matrix |
| **Confidence Signals** | Direction indicated (upgrade/downgrade/stable), summary statistics |

---

### 10.3 Upgrade Percentage

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics, Score Migration Matrix summary |
| **Representation** | Percentage of accounts that improved score band |
| **Directionality** | Higher is better |
| **Time Range** | 90 days |
| **Format** | Percentage |
| **Confidence Signals** | Part of summary calculation |

---

### 10.4 Downgrade Percentage

| Attribute | Value |
|-----------|-------|
| **Location** | Analytics, Score Migration Matrix summary |
| **Representation** | Percentage of accounts that declined score band |
| **Directionality** | Lower is better |
| **Time Range** | 90 days |
| **Format** | Percentage |
| **Confidence Signals** | Part of summary calculation |

---

## Summary: KPI Clarity and Ambiguity

### KPIs with Strong Confidence Signals

The following KPIs display adequate confidence indicators:

| KPI | Confidence Elements |
|-----|---------------------|
| Avg LumiqAI Score | Data source, timestamp, tooltip |
| Score Momentum | Data source, trend, tooltip definition |
| % Improving/Deteriorating Clients | Threshold defined in tooltip |
| Relationship Health Score | Composite calculation explained |
| Data Freshness | Color-coded thresholds, count breakdown |
| API Success Rate | Color-coded progress bar |
| Signal Drift | Status indicators with severity levels |

### KPIs with Missing Confidence Signals

The following KPIs lack adequate confidence indicators:

| KPI | Missing Elements |
|-----|------------------|
| Expected Loss (EL) | No model version, no confidence interval |
| AI Accuracy | No validation methodology shown |
| Human Override Rate | No context on acceptable range |
| Avg API Latency | No threshold for acceptable performance |
| Rate Limit Hits | No capacity context |
| Feature Importance | No statistical significance shown |
| Approval Rate by Segment | No volume weighting indicator |

### Ambiguous Directionality

These KPIs have context-dependent directionality that may confuse users:

| KPI | Ambiguity |
|-----|-----------|
| Applications Received | High volume may indicate demand or marketing spend |
| Auto-Approved Today | High rate may indicate efficiency or low scrutiny |
| Declined Count | Lower could mean better decisioning or looser criteria |
| Cross-sell Penetration | Target benchmark not visible |

### Time Range Inconsistencies

| Issue | KPIs Affected |
|-------|---------------|
| Mixed granularity | Some show "today" vs "30 days" vs "90 days" |
| Unclear refresh | API metrics show 30d but no refresh indicator |
| Point-in-time ambiguity | Portfolio metrics lack "as of" timestamp |

### Recommendations for Frontend Clarity

Without suggesting changes, the following patterns would improve KPI clarity:

1. Consistent timestamp display across all tiles
2. Data source attribution on all derived metrics
3. Benchmark or target indicators where directionality is ambiguous
4. Model version tagging on all AI-generated scores
5. Confidence intervals on predictive metrics
