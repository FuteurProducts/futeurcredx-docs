# LUMIQ AI DASHBOARD — OPERATIONAL DNA
# Every agent reads this on spawn. Follow every rule exactly.

## IDENTITY
- **Project**: Lumiq AI Dashboard (futeur-api-dashboard)
- **Stack**: React 19 + Vite (rolldown-vite) + TypeScript + Tailwind CSS 3.4 + shadcn/ui (Radix)
- **Auth**: Clerk 5 (optional) with FallbackAuthProvider for no-auth mode
- **Backend**: NestJS API via BFF client (`src/services/bff/client.ts`)
- **State**: React Context (Auth, Portfolio, Theme, Environment) + Zustand + useBffQuery
- **Charts**: Recharts 3.6
- **Forms**: react-hook-form + Zod
- **DB**: PostgreSQL (Prisma schema) — seed data in `database/`
- **Dev Server**: localhost:8080

## RULES OF ENGAGEMENT — ALL AGENTS MUST FOLLOW

### Code Standards
- TypeScript strict mode. No `any` types. No `as` casts unless justified with a comment.
- All functions under 50 lines. Extract a helper if longer.
- No `console.log` in committed code. Use `src/utils/logger.ts` for logging.
- Imports: external libs first, then `@/` internal paths, then relative, then types. Alphabetical within groups.
- Use `cn()` from `@/lib/utils` for conditional classNames (never raw string concatenation).
- Tailwind only — no custom CSS files. Use design tokens from `tailwind.config.ts`.
- All new UI components use shadcn/ui primitives from `src/components/ui/`.

### Auth — CRITICAL
- **NEVER** import from `@clerk/clerk-react` directly in components/pages/hooks.
- **ALWAYS** use `useAuth()` and `useUser()` from `@/contexts/AuthContext`.
- This is the #1 cause of white-screen crashes. Violating this breaks the entire app.

### BFF API Contract
- All API calls go through `bffClient` from `@/services/bff/client.ts`.
- Response envelope: `BffResponse<T>` (single), `BffListResponse<T>` (list), `BffError` (error).
- All requests require `portfolioId` — get it from `usePortfolio()` in `@/contexts/PortfolioContext`.
- Error shape: `{ error: { code, message, details? }, meta: { requestId } }`.
- Domain types live in `src/services/bff/types.ts` — always import from there.

### RBAC
- Use `usePermissions()` from `@/hooks/usePermissions` for permission checks.
- Gate UI with `<RbacGate>` from `@/components/ui/rbac-gate` for declarative gating.
- 5 roles: admin, developer, risk, rm, readonly.
- 16 permissions across credentials, export, underwriting, risk, customer, reports, settings, users.

### Audit Trail
- Use `useAuditEmit()` from `@/hooks/useAuditEmit` for client-side audit events.
- Required events: SCORE_VIEWED, DOSSIER_OPENED, REPORT_DOWNLOADED, EXPORT_INITIATED.
- CSV exports use `exportToCSV()` from `@/lib/export.ts` — includes PII redaction + audit.

### Error Handling
- Wrap async operations in try/catch with typed BffError handling.
- Use `<BffErrorBoundary>` from `@/components/shared/BffErrorBoundary` for component-level error boundaries.
- Toast notifications via `react-hot-toast` or `sonner` — never `alert()`.

### Environment
- `useEnvironment()` from `@/contexts/EnvironmentContext` for sandbox/production switching.
- `useTheme()` from `@/contexts/ThemeContext` for light/dark/system theming.
- Check `DEV_BYPASS_AUTH` in `App.tsx` for auth bypass during development.

## FILE OWNERSHIP — PREVENTS MERGE CONFLICTS

### Frontend Agents
ONLY touch:
- `src/components/` (all subdirectories)
- `src/pages/`
- `src/hooks/` (UI hooks only)
- `src/styles/`

### Backend Agents
ONLY touch:
- `src/services/`
- `src/lib/`
- `src/adapters/`
- `src/utils/`
- `src/data/`

### Test Agents
ONLY touch:
- `__tests__/`
- `*.test.ts`, `*.test.tsx`
- `*.spec.ts`, `*.spec.tsx`
- `test-utils/`

### Config / Schema — LEAD ONLY
- `package.json`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `eslint.config.js`
- `database/*.sql`

## GIT DISCIPLINE
- Commit messages: `type(scope): description` — e.g., `feat(products): add eligibility matrix view`
- Types: feat, fix, refactor, test, docs, chore, perf
- No force pushes. No rebasing shared branches.
- Run `scripts/validate.sh` before marking any task complete.

## COMMUNICATION PROTOCOL
- When you finish a task: update task status + send summary to Lead.
- When blocked: immediately flag the blocking issue AND the Lead.
- When you find a bug outside your scope: create a new task, do NOT fix it yourself.
- NEVER modify files outside your assigned scope. Flag it and move on.

## KEY FILES (read these for context)
| File | What It Tells You |
|------|-------------------|
| `src/services/bff/types.ts` | All domain types (SmbEntity, CreditScore, etc.) |
| `src/services/bff/client.ts` | API contract envelope (BffResponse, BffError) |
| `src/hooks/usePermissions.ts` | RBAC roles + permission matrix |
| `src/hooks/useAuditEmit.ts` | Audit event types + emission pattern |
| `src/contexts/AuthContext.tsx` | Auth pattern (Clerk wrapper + fallback) |
| `src/contexts/PortfolioContext.tsx` | Portfolio selection + portfolioId requirement |
| `src/components/ui/rbac-gate.tsx` | Permission gating component |
| `src/lib/export.ts` | CSV export with PII redaction |
| `src/pages/Dashboard/Dashboard.tsx` | 13-tab navigation shell |
| `tailwind.config.ts` | Design tokens, colors, typography |

## ARCHITECTURE DECISIONS (do not reinvent)
- State management: React Context + Zustand (useDemoStore)
- Data fetching: Custom useBffQuery hook (wraps fetch + BFF client)
- Validation: Zod (shared schemas)
- Styling: Tailwind CSS only (no CSS modules, no styled-components)
- Components: shadcn/ui (Radix primitives) — never roll custom for existing primitives
- Charts: Recharts — use existing chart-utils.tsx patterns
- Icons: lucide-react exclusively
