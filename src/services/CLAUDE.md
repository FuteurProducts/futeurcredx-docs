# Services Scope Rules

## Read First
- Root `CLAUDE.md` for full project rules
- `src/services/bff/client.ts` for the BFF client pattern
- `src/services/bff/types.ts` for all domain types

## Standards
- All API calls go through `bffClient` from `./bff/client.ts`
- Response envelope: `BffResponse<T>` (single item), `BffListResponse<T>` (lists), `BffError` (errors)
- All requests require `portfolioId` parameter
- Add response normalizers in `./bff/normalizers.ts` for API→frontend type transforms
- Export new services from `./bff/index.ts`
- Domain types go in `./bff/types.ts` — keep them flat, no deep nesting
- Error shape: `{ error: { code: string, message: string, details?: Record<string, unknown> }, meta: { requestId } }`
- Auth tokens are injected automatically via `setAuthTokenGetter()` — never handle tokens manually

## Existing Services (do not duplicate)
- `customers.ts` — Get customers, customer dossier
- `scores.ts` — Credit scores, distribution, bureau pulls
- `offers.ts` — Pre-qual offers, generate offers
- `applications.ts` — Application pipeline, status updates
- `reports.ts` — Report generation, download, listing
- `risk.ts` — Risk summary, EWS alerts, acknowledge
- `audit.ts` — Audit events, client-side emission
- `apiKeys.ts` — API key CRUD + usage
- `batch.ts` — Batch job submission + status

## Adding a New Service
1. Create `src/services/bff/{domain}.ts`
2. Add types to `src/services/bff/types.ts`
3. Add normalizers to `src/services/bff/normalizers.ts` if needed
4. Export from `src/services/bff/index.ts`
