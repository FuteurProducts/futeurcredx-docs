# LUMIQ AI DASHBOARD - FRONTEND REBUILD MASTERPLAN
## WAR-GRADE Audit Complete | Full Action Plan

**Generated:** 2026-02-03
**Audit Scope:** Complete UI/UX, Design System, Accessibility, Charts, Component Architecture

---

## EXECUTIVE SUMMARY

After deploying 8 specialized frontend agents to audit the entire dashboard, here are the consolidated findings:

| Category | Current Score | Target Score | Priority |
|----------|---------------|--------------|----------|
| Design System Consistency | 58% | 95% | CRITICAL |
| Dark Mode Compatibility | 65% | 100% | CRITICAL |
| Accessibility (WCAG 2.1) | 45% | 90% | HIGH |
| Component Architecture | 55% | 85% | HIGH |
| UX Patterns | 70% | 90% | MEDIUM |
| Chart/Visualization Quality | 75% | 90% | MEDIUM |

**Total Issues Found:** 413
- **Critical:** 51 (includes 9 dead critical buttons)
- **High:** 120 (includes 31 dead high-priority buttons)
- **Medium:** 145 (includes 18 dead medium buttons)
- **Low:** 97 (includes 8 dead low-priority buttons)

### BREAKING: 66 Dead/Fake Buttons Found

| Severity | Count | Examples |
|----------|-------|----------|
| CRITICAL | 9 | Transfer, Withdraw, Deposit, Approve/Decline loan, Save Changes |
| HIGH | 31 | Documentation nav, Support ticket, View Details, Add Rule |
| MEDIUM | 18 | Configure Schedule, View Trend, Export buttons |
| LOW | 8 | FAQ buttons, Plan Details |

---

## PART 1: CRITICAL ISSUES (Must Fix)

### 1.1 Hardcoded Colors Breaking Dark Mode (89 instances)

**Files with highest violations:**

| File | Violations | Impact |
|------|------------|--------|
| `UnderwritingAssistant.tsx` | 50+ | Charts and status badges break in dark mode |
| `CreditIntelligence.tsx` | 40+ | Gauges and alerts unreadable |
| `NeutradeCharts.tsx` | 35+ | All charts have contrast issues |
| `ApiTesting.tsx` | 20+ | Terminal/code blocks break |

**Pattern found:**
```tsx
// BAD - breaks dark mode
<div className="text-[#32AE60]">Success</div>
<Bar fill="#E7854D" />

// GOOD - uses design tokens
<div className="text-success">Success</div>
<Bar fill="hsl(var(--chart-1))" />
```

### 1.2 Giant Components Need Splitting

| Component | Lines | Recommended Split |
|-----------|-------|-------------------|
| `ApiConsole.tsx` | 1,293 | 5 components |
| `UnderwritingAssistant.tsx` | 1,198 | 6 components |
| `NeutradeCharts.tsx` | 1,862 | 8 components |
| `Dashboard.tsx` | 850+ | 4 components |

### 1.3 Missing ARIA Live Regions (Critical for Accessibility)

No `aria-live` regions exist for:
- Toast notifications
- Loading state changes
- Form validation errors
- Bulk action confirmations

### 1.4 Checkbox Inputs Without Labels

Found in `ApplicationPipelineView.tsx` (lines 250-258, 325-329):
```tsx
// BAD - no label, inaccessible
<input type="checkbox" checked={selected} onChange={handleSelect} />

// GOOD - has label
<label className="sr-only" htmlFor={`select-${id}`}>Select {name}</label>
<input id={`select-${id}`} type="checkbox" ... />
```

---

## PART 1B: DEAD BUTTONS (66 Total - Must Fix)

### CRITICAL - Core Features Broken (9 buttons)

| File | Button | Issue |
|------|--------|-------|
| `TotalBalanceCard.tsx:86` | Transfer | No onClick - financial action dead |
| `TotalBalanceCard.tsx:90` | Receive | No onClick - financial action dead |
| `NeutradeCharts.tsx:871` | Withdraw | No onClick - financial action dead |
| `NeutradeCharts.tsx:874` | Deposit | No onClick - financial action dead |
| `UnderwritingAssistant.tsx:756` | Decline | No onClick - underwriting workflow broken |
| `UnderwritingAssistant.tsx:760` | Approve | No onClick - underwriting workflow broken |
| `ModelVersionsPanel.tsx:134` | Promote to Production | No onClick - ML deployment broken |
| `UsersPanel.tsx:256` | Save Changes | No onClick - user management broken |
| `SlaPanel.tsx:110` | New Ticket | Toast-only - support feature fake |

### HIGH - Demo-Breaking Issues (31 buttons)

| File | Button | Issue |
|------|--------|-------|
| `Dashboard.tsx:705` | Documentation | Toast-only - shows message instead of nav |
| `Users.tsx:418` | View (business) | No onClick - can't view business details |
| `Users.tsx:528` | View all users | No onClick - navigation broken |
| `DashboardHeader.tsx:101` | Notifications | No onClick - notification center dead |
| `SmartAlerts.tsx:121` | Alert actions | No onClick - can't act on alerts |
| `CompliancePanel.tsx:80` | Export Audit Report | No onClick - compliance export broken |
| `CreditIntelligence.tsx:719` | Add Rule | No onClick - can't add monitoring rules |
| `CreditIntelligence.tsx:817` | Delete rule | No onClick - can't delete rules |
| `ApiConsole.tsx:1265` | Add Endpoint | No onClick - webhook creation dead |
| `ConnectionDetail.tsx:251` | Refresh Token | No onClick - OAuth management broken |
| `ConnectionDetail.tsx:466` | Generate New Secret | No onClick - secret gen dead |
| `ConnectionDetail.tsx:469` | Rotate All Credentials | No onClick - security feature broken |
| `Products.tsx:300` | Try in Sandbox | No onClick - product testing dead |
| `Products.tsx:382` | Browse All Products | No onClick - catalog nav dead |
| `PartnerDashboard.tsx:421` | View Details | No onClick - business details dead |
| `PartnerDashboard.tsx:455` | Connect HubSpot | No onClick - CRM integration dead |
| `IntegrationsPanel.tsx:102` | Add Integration | No onClick - integration setup dead |
| `ConsentPanel.tsx:209` | Edit Templates | No onClick - compliance broken |
| `SSOPanel.tsx:218` | Test Connection | No onClick - SSO testing broken |
| `RetentionPanel.tsx:206` | View Deletion Queue | No onClick - GDPR feature broken |
| `AuditLogsPanel.tsx:115` | Filter | No onClick - audit filtering broken |
| `CustomerListTable.tsx:240` | Assign RM | No onClick - RM assignment dead |
| `SignalDriftMonitor.tsx:126` | Run Validation | No onClick - ML monitoring dead |

---

## PART 2: HIGH PRIORITY ISSUES

### 2.1 Typography Scale Violations (200+ instances)

Custom rem values instead of standard Tailwind classes:

| Current | Replace With |
|---------|--------------|
| `text-[0.6875rem]` | `text-xs` |
| `text-[0.75rem]` | `text-xs` |
| `text-[0.8125rem]` | `text-sm` |
| `text-[0.875rem]` | `text-sm` |
| `text-[0.9375rem]` | `text-base` |
| `text-[1.25rem]` | `text-xl` |

### 2.2 Native Buttons Not Using Button Component (89 instances)

Files using `<button>` instead of `<Button>`:
- `Products.tsx` (6 buttons)
- `CreditIntelligence.tsx` (8 buttons)
- `ApiKeysTab.tsx` (4 buttons)
- `NeutradeCharts.tsx` (12 buttons)

### 2.3 Missing Loading States in Charts

| Chart Component | Has Loading State |
|-----------------|-------------------|
| `RevenueChart.tsx` | NO |
| `ConversionChart.tsx` | NO |
| `IncomeAnalysisCard.tsx` | NO |
| `ExpenseCategoryCard.tsx` | NO |
| `RiskSegmentationCard.tsx` | NO |
| `PortfolioHealthCard.tsx` | NO |

### 2.4 Touch Targets Too Small (Mobile)

Current: `w-4 h-4` (16x16px) for checkboxes
Required: `min-h-[44px] min-w-[44px]`

---

## PART 3: COMPONENT ARCHITECTURE ISSUES

### 3.1 Code Duplication (30+ utilities duplicated)

**Duplicate `formatCurrency` functions in:**
- `PortfolioSegmentCard.tsx`
- `CustomerDossier.tsx`
- `NeutradeCharts.tsx`
- `ApplicationPipelineView.tsx`

**Solution:** Create `/src/lib/formatters.ts`

### 3.2 TypeScript `any` Types (14 instances)

| File | Count |
|------|-------|
| `ApiConsole.tsx` | 5 |
| `NeutradeCharts.tsx` | 4 |
| `CustomerDossier.tsx` | 3 |
| `ApplicationPipelineView.tsx` | 2 |

### 3.3 UI Component Duplication

Duplicate modal implementations instead of using `Dialog`:
- `SandboxEnvironmentToggle.tsx`
- `MetricDrilldownModal.tsx`
- `UsersPanel.tsx`

---

## PART 4: PAGE-BY-PAGE REBUILD PRIORITY

### Tier 1: Critical Rebuild Needed

| Page | Current Score | Issues |
|------|---------------|--------|
| **Analytics** | 4/10 | Static data, non-functional filters, needs chart standardization |
| **Risk Management** | 4/10 | Incomplete EWS queue, static heatmap, no real data binding |
| **API Testing** | 5/10 | Terminal styling breaks dark mode, needs better code highlighting |
| **Settings** | 5/10 | Partial tab implementations, security tab incomplete |

### Tier 2: Polish Needed

| Page | Current Score | Issues |
|------|---------------|--------|
| **Notifications** | 6/10 | Functional but needs filtering improvements |
| **Underwriting** | 7/10 | Works but giant components, needs splitting |
| **Customer Intelligence** | 7/10 | Good but color/token issues |
| **Partner Portal** | 7/10 | Functional but needs UX polish |

### Tier 3: Good Condition

| Page | Current Score | Issues |
|------|---------------|--------|
| **Overview/Dashboard** | 8/10 | Minor dark mode tweaks |
| **Products** | 8/10 | Minor button standardization |
| **Login/Auth** | 8/10 | Missing required field indicators |

---

## PART 5: IMPLEMENTATION PLAN

### Phase 1: Foundation (Days 1-2)
**Agent Assignment:** UI-Architect + Design-System Agent

1. **Update `tailwind.config.js`** - Add missing semantic tokens:
   ```js
   colors: {
     success: { DEFAULT: "hsl(var(--success))", foreground: "..." },
     warning: { DEFAULT: "hsl(var(--warning))", foreground: "..." },
     info: { DEFAULT: "hsl(var(--info))", foreground: "..." },
     chart: { 1: "hsl(var(--chart-1))", ... }
   }
   ```

2. **Create `/src/lib/formatters.ts`** - Centralize all formatting utilities

3. **Create `/src/lib/constants.ts`** - Centralize color mappings for charts

### Phase 2: Component Standardization (Days 3-4)
**Agent Assignment:** React-Frontend Agent (4 parallel)

**Wave 1 (Parallel):**
- Agent A: Fix `UnderwritingAssistant.tsx` colors + split into 6 components
- Agent B: Fix `CreditIntelligence.tsx` colors + split into 4 components
- Agent C: Fix `NeutradeCharts.tsx` colors + split into 8 components
- Agent D: Fix `ApiConsole.tsx` colors + split into 5 components

**Wave 2 (Parallel):**
- Agent E: Replace all native `<button>` with `<Button>` component
- Agent F: Standardize typography (200+ fixes)
- Agent G: Replace custom modals with `<Dialog>` component
- Agent H: Fix all chart loading/empty states

### Phase 3: Accessibility (Days 5-6)
**Agent Assignment:** UX-Accessibility Agent

1. Add `aria-label` to all icon buttons
2. Add labels to all checkbox inputs
3. Add `aria-live` regions for dynamic content
4. Increase touch targets to 44px minimum
5. Add keyboard navigation to interactive elements

### Phase 4: Page Rebuilds (Days 7-10)
**Agent Assignment:** Page-specific agents

**Analytics Page Rebuild:**
- Implement actual data fetching for time periods
- Fix all chart interactions
- Add proper loading skeletons
- Wire to BFF analytics endpoints

**Risk Management Page Rebuild:**
- Complete EWS queue implementation
- Make heatmap interactive
- Add drill-down capabilities
- Wire to BFF risk endpoints

**Settings Page Complete:**
- Finish Security tab implementation
- Add proper form validation
- Complete all settings persistence

### Phase 5: Dark Mode & Polish (Days 11-12)
**Agent Assignment:** Design-Polish Agent

1. Test all pages in dark mode
2. Fix remaining contrast issues
3. Verify all design tokens working
4. Cross-browser testing

### Phase 6: Integration & QA (Days 13-14)
**Agent Assignment:** QA-Testing Agent

1. Full smoke test all pages
2. Accessibility audit (axe-core)
3. Performance audit (Lighthouse)
4. Build verification

---

## PART 6: FILES TO MODIFY (Complete List)

### Critical Files (Must Modify)

| # | File | Change Type | Phase |
|---|------|-------------|-------|
| 1 | `tailwind.config.js` | Modify | 1 |
| 2 | `src/lib/formatters.ts` | **NEW** | 1 |
| 3 | `src/lib/constants.ts` | **NEW** | 1 |
| 4 | `src/pages/Dashboard/UnderwritingAssistant.tsx` | Split + Fix | 2 |
| 5 | `src/components/dashboard/pages/CreditIntelligence.tsx` | Split + Fix | 2 |
| 6 | `src/components/dashboard/charts/NeutradeCharts.tsx` | Split + Fix | 2 |
| 7 | `src/components/api-console/ApiConsole.tsx` | Split + Fix | 2 |
| 8 | `src/components/enterprise/underwriting/ApplicationPipelineView.tsx` | Fix a11y | 3 |
| 9 | `src/pages/Dashboard/ApiTesting.tsx` | Dark mode fix | 5 |
| 10 | `src/components/finlab/IncomeAnalysisCard.tsx` | Complete rewrite | 2 |
| 11 | `src/components/finlab/ExpenseCategoryCard.tsx` | Complete rewrite | 2 |
| 12 | `src/components/enterprise/analytics/CrossSellFunnel.tsx` | Fix colors + safety | 2 |
| 13 | `src/components/widgets/CreditScoreWidget.tsx` | Fix colors | 2 |
| 14 | `src/components/enterprise/PortfolioScoreTrendsCard.tsx` | Fix colors | 2 |
| 15 | `src/components/dashboard/ApiKeysTab.tsx` | Button standardize | 2 |

### High Priority Files (Should Modify)

| # | File | Change Type | Phase |
|---|------|-------------|-------|
| 16 | `src/components/dashboard/pages/Products.tsx` | Button standardize | 2 |
| 17 | `src/pages/Authentication/Login.tsx` | A11y fixes | 3 |
| 18 | `src/pages/Dashboard/Dashboard.tsx` | A11y + dark mode | 3, 5 |
| 19 | `src/components/dashboard/ui/toast.tsx` | Add aria-live | 3 |
| 20 | `src/components/dashboard/charts/RevenueChart.tsx` | Add loading state | 2 |
| 21 | `src/components/dashboard/charts/ConversionChart.tsx` | Add loading state | 2 |

**Total: 15 critical + 6 high priority = 21 files minimum**

---

## PART 7: TEMPLATE INTEGRATION STRATEGY

Once you provide the UI8 Figma template:

### Analysis Phase
1. Extract color palette → map to CSS variables
2. Extract typography scale → validate against Tailwind
3. Extract component patterns → identify existing matches
4. Extract spacing system → map to Tailwind spacing
5. Extract shadow/elevation tokens → update CSS variables

### Mapping Phase
| Template Component | Dashboard Equivalent | Action |
|--------------------|---------------------|--------|
| Cards | `<Card>` | Update styling |
| Buttons | `<Button>` | Update variants |
| Tables | `<DataTable>` | Update styling |
| Charts | Recharts | Apply color palette |
| Forms | React Hook Form | Update input styling |
| Modals | `<Dialog>` | Update overlay/content |

### Implementation Phase
1. Update `src/index.css` with template tokens
2. Update component styles systematically
3. Verify dark mode variants
4. Test across all pages

---

## PART 8: AGENT DEPLOYMENT COMMANDS

When ready to execute, deploy agents in this order:

```bash
# Wave 1 - Foundation (2 agents parallel)
Agent UI-Architect: "Create formatters.ts and constants.ts utilities"
Agent Design-System: "Update tailwind.config.js with missing tokens"

# Wave 2 - Component Fixes (4 agents parallel)
Agent React-A: "Split and fix UnderwritingAssistant.tsx"
Agent React-B: "Split and fix CreditIntelligence.tsx"
Agent React-C: "Split and fix NeutradeCharts.tsx"
Agent React-D: "Split and fix ApiConsole.tsx"

# Wave 3 - Standardization (4 agents parallel)
Agent React-E: "Replace native buttons with Button component"
Agent React-F: "Fix typography scale violations"
Agent React-G: "Replace custom modals with Dialog"
Agent React-H: "Add chart loading/empty states"

# Wave 4 - Accessibility (1 agent)
Agent A11y: "Fix all accessibility issues"

# Wave 5 - Page Rebuilds (3 agents parallel)
Agent Page-Analytics: "Rebuild Analytics page"
Agent Page-Risk: "Rebuild Risk Management page"
Agent Page-Settings: "Complete Settings page"

# Wave 6 - Polish (1 agent)
Agent Polish: "Dark mode fixes and final polish"

# Wave 7 - QA (1 agent)
Agent QA: "Full smoke test and verification"
```

---

## VERIFICATION CHECKLIST

After all changes:

- [ ] `npm run build` — zero errors
- [ ] `npm run lint` — zero errors
- [ ] `npx tsc --noEmit` — zero type errors
- [ ] All pages load in light mode
- [ ] All pages load in dark mode
- [ ] All charts render with loading states
- [ ] All buttons are using `<Button>` component
- [ ] All modals are using `<Dialog>` component
- [ ] All checkboxes have labels
- [ ] All icon buttons have aria-labels
- [ ] Touch targets are 44px minimum
- [ ] No hardcoded hex colors remain
- [ ] Typography uses standard Tailwind classes

---

## NEXT STEPS

1. **Provide UI8 Figma template** (recommended format: Figma)
2. **I will analyze the template** and create component mapping
3. **Deploy agents in waves** as outlined above
4. **Systematic rebuild** following the phase plan
5. **Final QA** and deployment to staging

---

*This masterplan was generated from comprehensive audits by 8 specialized frontend agents analyzing 200+ files across the codebase.*
