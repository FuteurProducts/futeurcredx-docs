# LumiqAI Deployment Modes

This document describes the deployment configurations, environments, and operational modes for the LumiqAI platform.

---

## Document Authority

**Classification**: INFRASTRUCTURE REFERENCE  
**Audience**: DevOps, Platform Engineers, Operators  
**Updates**: When deployment patterns change

---

## Environment Architecture

### Environment Types

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         LOVABLE CLOUD PLATFORM                          │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                        PREVIEW ENVIRONMENT                          ││
│  │                                                                      ││
│  │  URL: id-preview--71f13c93-d7ba-4960-b2fb-7c7f8b9e8b28.lovable.app ││
│  │                                                                      ││
│  │  Purpose: Development, testing, staging                             ││
│  │  Data: Test database                                                 ││
│  │  Secrets: Test credentials                                           ││
│  │  Auto-deploy: On every code change                                   ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                    │                                     │
│                                    │ Manual Publish                      │
│                                    ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                       PRODUCTION ENVIRONMENT                         ││
│  │                                                                      ││
│  │  URL: dash-nest-start.lovable.app                                   ││
│  │                                                                      ││
│  │  Purpose: Live user access                                           ││
│  │  Data: Production database (shared with Preview in current setup)   ││
│  │  Secrets: Production credentials                                     ││
│  │  Deploy: Manual publish required                                     ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

### Logical Environments (In-App Toggle)

Within the application, users can switch between logical environments:

| Mode | UI Control | Effect |
|------|------------|--------|
| Sandbox | Toggle in header | Uses test data patterns, mock bureau responses |
| Production | Toggle in header | Uses live data, real API calls |

**Important**: This is a logical toggle in the UI. Both modes currently access the same database. True environment isolation would require separate Supabase projects.

---

## Deployment Pipeline

### Current Flow

```
Developer/AI Change
        │
        ▼
┌───────────────────┐
│   Code Change     │
│   (Lovable AI)    │
└───────────────────┘
        │
        │ Automatic
        ▼
┌───────────────────┐
│   Preview Build   │
│   (Vite/React)    │
└───────────────────┘
        │
        │ Automatic
        ▼
┌───────────────────┐
│  Edge Functions   │
│  Deploy (Deno)    │
└───────────────────┘
        │
        │ Automatic
        ▼
┌───────────────────┐
│  Preview URL      │
│  Available        │
└───────────────────┘
        │
        │ Manual approval
        ▼
┌───────────────────┐
│  Publish to       │
│  Production       │
└───────────────────┘
```

### Deployment Artifacts

| Artifact | Build Process | Deployment Target |
|----------|---------------|-------------------|
| Frontend bundle | Vite build | Lovable CDN |
| Edge Functions | Deno bundle | Supabase Edge Runtime |
| Database migrations | SQL files | Supabase Postgres |
| Static assets | Copy | Lovable CDN |

---

## Frontend Deployment

### Build Configuration

**File**: `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
});
```

### Build Process

1. **TypeScript compilation**: `tsc` type checking
2. **Vite bundling**: Tree-shaking, minification
3. **Asset optimization**: Image compression, code splitting
4. **Output**: `dist/` directory (not committed)

### Environment Variable Injection

Build-time variables with `VITE_` prefix are embedded:

```typescript
// Available at runtime
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
import.meta.env.VITE_SUPABASE_PROJECT_ID
```

---

## Edge Function Deployment

### Function Structure

```
supabase/functions/
├── _shared/                    # Shared utilities (not deployed as function)
│   ├── auth.ts
│   ├── audit.ts
│   ├── cors.ts
│   └── response.ts
│
├── customers/                  # Deployed as /customers endpoint
│   └── index.ts
│
├── scores/                     # Deployed as /scores endpoint
│   └── index.ts
│
└── [function-name]/            # Each folder = one function
    └── index.ts
```

### Deployment Process

1. **Automatic**: Edge Functions deploy on every code change
2. **Manual trigger**: Use `supabase--deploy_edge_functions` tool
3. **Deletion**: Use `supabase--delete_edge_functions` for removed functions

### Function Configuration

Each function has implicit configuration:
- **Runtime**: Deno
- **Memory**: Default (varies by plan)
- **Timeout**: Default (varies by plan)
- **Environment**: Inherits project secrets

---

## Database Deployment

### Migration Strategy

**Type**: Forward-only migrations  
**Tool**: `supabase--migration`  
**Location**: `supabase/migrations/` (read-only history)

### Migration Process

1. **Create migration**: Use `supabase--migration` tool with SQL
2. **User approval**: Migration requires explicit approval
3. **Execution**: Applied to database immediately on approval
4. **Types regeneration**: `src/integrations/supabase/types.ts` updated automatically

### Migration Rules

| Rule | Description |
|------|-------------|
| Append-only | Never delete or modify existing migrations |
| Backward compatible | Avoid breaking changes to existing tables |
| RLS required | All new tables must have RLS policies |
| No reserved schemas | Never modify `auth`, `storage`, `realtime` |

---

## Health Monitoring

### Health Check Endpoint

**URL**: `GET /functions/v1/health`

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-28T12:00:00Z",
  "database": "connected",
  "latency_ms": 45
}
```

### Monitoring Points

| Component | Check Type | Frequency |
|-----------|------------|-----------|
| Frontend | HTTP 200 on `/` | External uptime monitor |
| Edge Functions | `/health` endpoint | Every 5 minutes |
| Database | Connection pool status | Via Supabase dashboard |
| Auth | Token validation | On each request |

---

## Rollback Procedures

### Frontend Rollback

1. **Via Lovable**: Use version history to restore previous code
2. **Automatic rebuild**: Triggers new deployment

**Note**: There is no "unpublish" — you must publish a previous version to rollback production.

### Edge Function Rollback

1. **Revert code**: Restore previous function code
2. **Redeploy**: Functions redeploy automatically

### Database Rollback

**Warning**: Database migrations are NOT automatically reversible.

For rollback:
1. **Create inverse migration**: New migration that undoes changes
2. **Data backup**: Ensure data is preserved if needed
3. **Apply migration**: Use `supabase--migration` tool

### Rollback Decision Matrix

| Severity | Component | Action |
|----------|-----------|--------|
| Critical (site down) | Frontend | Publish previous version immediately |
| Critical (data issue) | Database | Create inverse migration; coordinate data recovery |
| High (feature broken) | Edge Function | Revert and redeploy |
| Medium (UI bug) | Frontend | Fix forward or rollback based on impact |

---

## Scaling Configuration

### Current Setup

LumiqAI runs on Lovable Cloud with Supabase backend:

| Component | Scaling Model |
|-----------|---------------|
| Frontend | CDN auto-scaling |
| Edge Functions | Auto-scaling (Supabase-managed) |
| Database | Supabase plan-based limits |

### Supabase Limits (Plan-Dependent)

| Resource | Free Tier | Pro Tier |
|----------|-----------|----------|
| Database size | 500MB | 8GB+ |
| Edge Function invocations | 500K/month | 2M/month |
| Realtime connections | 200 | 500+ |
| Storage | 1GB | 100GB+ |

### Performance Considerations

| Concern | Mitigation |
|---------|------------|
| Large query results | Default 1000 row limit; use pagination |
| Slow Edge Functions | Optimize database queries; use indexes |
| High traffic | CDN caching for static assets |
| Database connections | Connection pooling (auto-managed) |

---

## Security Configuration

### Authentication

**Provider**: Supabase Auth  
**Methods**: Email/password (auto-confirm enabled for non-production)

Configuration via `supabase--configure-auth`:
```typescript
{
  auto_confirm_email: true,  // Non-production only
  disable_signup: false,
  external_anonymous_users_enabled: false
}
```

### Row Level Security

**Status**: Enabled on all tables with tenant data

Verification via `supabase--linter`:
- Checks for disabled RLS
- Identifies overly permissive policies

### Secrets Management

**Storage**: Supabase Vault (encrypted)  
**Access**: Edge Functions only via `Deno.env.get()`

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests pass (if applicable)
- [ ] No console errors in preview
- [ ] Database migrations approved and applied
- [ ] Secrets configured for new integrations
- [ ] Documentation updated

### During Deployment

- [ ] Monitor Edge Function deployment logs
- [ ] Verify health check endpoint
- [ ] Test critical user flows

### Post-Deployment

- [ ] Check production health
- [ ] Monitor error rates
- [ ] Verify audit logging
- [ ] Update deployment log

---

## Environment-Specific Configurations

### Preview Environment

```
URL: id-preview--71f13c93-d7ba-4960-b2fb-7c7f8b9e8b28.lovable.app
Purpose: Development and testing
Auto-deploy: Yes (on every change)
```

**Behaviors**:
- Immediate deployment on code changes
- Shares database with production (current setup)
- Full console logging enabled

### Production Environment

```
URL: dash-nest-start.lovable.app
Purpose: Live user access
Auto-deploy: No (manual publish required)
```

**Behaviors**:
- Manual publish required
- Same database as preview (current setup)
- Production-ready error handling

### Recommended Future Setup

For true environment isolation:

```
┌─────────────────────────────────────┐
│         DEVELOPMENT                  │
│  • Separate Supabase project        │
│  • Test data only                   │
│  • Mock external APIs               │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│          STAGING                     │
│  • Separate Supabase project        │
│  • Anonymized production data       │
│  • Real external API sandbox        │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         PRODUCTION                   │
│  • Production Supabase project      │
│  • Live data                        │
│  • Production API credentials       │
└─────────────────────────────────────┘
```

---

## Disaster Recovery

### Backup Strategy

| Component | Backup Method | Frequency |
|-----------|---------------|-----------|
| Database | Supabase automatic backups | Daily |
| Code | Git version control | Every commit |
| Secrets | Supabase Vault | N/A (managed) |

### Recovery Time Objectives

| Scenario | RTO Target | Procedure |
|----------|------------|-----------|
| Frontend down | 5 minutes | Publish previous version |
| Edge Function error | 10 minutes | Revert and redeploy |
| Database corruption | 1 hour | Restore from backup |
| Full platform outage | 2 hours | Coordinate with Lovable/Supabase |

### Incident Response

1. **Detect**: Monitor health endpoints, error rates
2. **Assess**: Determine scope and severity
3. **Contain**: Disable affected features if needed
4. **Recover**: Apply fix or rollback
5. **Document**: Post-mortem and prevention measures

---

## Operational Commands

### Deploy Edge Functions

```typescript
// Deploy specific functions
supabase--deploy_edge_functions({
  function_names: ["customers", "scores"]
})
```

### Check Function Logs

```typescript
// Get recent logs
supabase--edge-function-logs({
  function_name: "customers",
  search: "error"
})
```

### Run Database Migration

```typescript
// Create and apply migration
supabase--migration({
  query: "CREATE TABLE..."
})
```

### Test Edge Function

```typescript
// Call deployed function
supabase--curl_edge_functions({
  path: "/customers",
  method: "GET",
  query_params: { portfolioId: "abc-123" }
})
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-28 | Initial document creation |

---

**Document Classification**: INFRASTRUCTURE REFERENCE  
**Audience**: DevOps, Platform Engineers  
**Last Updated**: 2025-01-28  
**Maintainer**: DevOps Team
