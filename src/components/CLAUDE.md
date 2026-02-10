# Components Scope Rules

## Read First
- Root `CLAUDE.md` for full project rules
- `src/components/ui/` for existing shadcn/ui primitives — never duplicate

## Standards
- All components use TypeScript with explicit prop interfaces
- Use `cn()` from `@/lib/utils` for conditional classNames
- Use shadcn/ui primitives from `src/components/ui/` — never roll custom versions
- Icons: `lucide-react` only
- Gate restricted UI with `<RbacGate>` from `@/components/ui/rbac-gate`
- Show data provenance with `<DataSourceFooter>` from `@/components/ui/data-source-footer`
- Use `useAuth()` / `useUser()` from `@/contexts/AuthContext` — NEVER from `@clerk/clerk-react`
- Use `usePortfolio()` from `@/contexts/PortfolioContext` for portfolio-scoped data
- Emit audit events via `useAuditEmit()` for sensitive data views (scores, dossiers, exports)

## Directory Layout
- `ui/` — shadcn/ui base primitives (60+ components)
- `dashboard/pages/` — Dashboard tab page components
- `enterprise/` — Bank-grade feature components (products, settings, analytics, risk, customer, reports, underwriting)
- `api-console/` — API sandbox console
- `partner-portal/` — Partner management panels
- `widgets/` — Reusable feature widgets
- `shared/` — Cross-cutting shared components
- `command-palette/` — Cmd+K navigation
- `finlab/` — Financial analysis widgets

## Patterns
- Enterprise components go in `enterprise/{domain}/`
- Shared cross-cutting components go in `shared/`
- New shadcn/ui primitives go in `ui/`
- Page-level components for dashboard tabs go in `dashboard/pages/`
