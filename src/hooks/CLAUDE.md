# Hooks Scope Rules

## Read First
- Root `CLAUDE.md` for full project rules
- Existing hooks in this directory before creating new ones

## Standards
- All hooks follow `useXxx` naming convention
- Use `useAuth()` from `@/contexts/AuthContext` — NEVER `@clerk/clerk-react`
- Use `usePortfolio()` from `@/contexts/PortfolioContext` for portfolio-scoped queries
- Use `usePermissions()` for RBAC checks — returns { role, hasPermission, hasAnyPermission, hasAllPermissions }
- Use `useAuditEmit()` for audit trail — has convenience methods (emitScoreViewed, emitDossierOpened, etc.)

## Existing Hooks (do not duplicate)
- `usePermissions.ts` — RBAC (5 roles, 16 permissions)
- `useAuditEmit.ts` — Audit event emission
- `useBffQuery.ts` — BFF API query wrapper
- `useDemoStore.ts` — Demo/mock data store
- `useReportPolling.ts` — Report generation polling
- `useSessionTimeout.ts` — Session timeout + auto-logout
- `use-toast.ts` — shadcn/ui toast notifications

## Adding a New Hook
1. Create `src/hooks/useXxx.ts`
2. Export a single named function `useXxx`
3. Keep hooks focused — one responsibility per hook
4. If it wraps a BFF call, use `useBffQuery` pattern internally
