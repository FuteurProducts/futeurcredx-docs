# Contexts Scope Rules

## Read First
- Root `CLAUDE.md` for full project rules
- Each existing context file for patterns

## Standards
- Contexts provide global state via React Context + useContext
- Each context exports: Provider component + custom hook
- Custom hooks throw if used outside Provider (pattern: check undefined)

## Existing Contexts (do not duplicate)
- `AuthContext.tsx` — Authentication (Clerk + FallbackAuthProvider)
  - Exports: `useAuth()`, `useUser()`, `AuthProvider`, `FallbackAuthProvider`
  - CRITICAL: All auth access goes through this — never import @clerk/clerk-react elsewhere
- `PortfolioContext.tsx` — Portfolio selection
  - Exports: `usePortfolio()`, `useRequiredPortfolio()`
  - Persists to localStorage, fallback demo portfolio
- `ThemeContext.tsx` — Theme management (light/dark/system)
  - Exports: `useTheme()`
- `EnvironmentContext.tsx` — Sandbox vs. production
  - Exports: `useEnvironment()`

## Adding a New Context
1. Create `src/contexts/XxxContext.tsx`
2. Define the interface, create context with undefined default
3. Create Provider component
4. Create `useXxx()` hook with undefined check
5. Add Provider to the provider tree in `src/main.tsx`
