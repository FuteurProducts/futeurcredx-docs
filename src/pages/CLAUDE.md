# Pages Scope Rules

## Read First
- Root `CLAUDE.md` for full project rules
- `src/pages/Dashboard/Dashboard.tsx` for the main shell structure
- `src/App.tsx` for route definitions

## Standards
- All dashboard pages are lazy-loaded in `App.tsx`
- Page components are thin wrappers — delegate to enterprise components in `src/components/enterprise/`
- Use `usePermissions()` for role-based content gating
- Use `usePortfolio()` for portfolio-scoped data
- Use `useAuditEmit()` for audit-sensitive page views

## Page Structure
- `Authentication/` — Login, Register, BusinessSignup
- `Dashboard/` — All 18 dashboard tab pages
  - Dashboard.tsx — Main shell with 13-tab navigation
  - Index.tsx, Analytics.tsx, CreditIntelligence.tsx, Risk.tsx, Customer.tsx, etc.

## Adding a New Dashboard Page
1. Create `src/pages/Dashboard/NewPage.tsx`
2. Add lazy import in `src/App.tsx`
3. Add route in the dashboard routes section of `App.tsx`
4. Add navigation item in `Dashboard.tsx` navigation array
5. Create enterprise components in `src/components/enterprise/{domain}/`
