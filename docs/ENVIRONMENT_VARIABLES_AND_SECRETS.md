# Environment Variables and Secrets Reference

This document provides a complete reference for all environment variables and secrets used in the LumiqAI platform.

---

## Document Authority

**Classification**: CONFIGURATION REFERENCE  
**Sensitivity**: Contains secret names but NOT secret values  
**Updates**: Must be updated when secrets change

---

## Environment Overview

LumiqAI operates in multiple environments with distinct configurations:

| Environment | Purpose | Data | URL Pattern |
|-------------|---------|------|-------------|
| Preview | Development/testing | Test data | `id-preview--*.lovable.app` |
| Production | Live users | Production data | `dash-nest-start.lovable.app` |
| Sandbox (logical) | Partner testing | Isolated test data | Same URL, toggle in UI |

---

## Automatically Managed Variables

These variables are automatically provisioned and managed by Lovable Cloud. **DO NOT EDIT MANUALLY.**

### Frontend Environment Variables

Located in `.env` (auto-generated):

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://pypvgvfkfxqybnydkegs.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key (public) | `eyJhbG...` (JWT) |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project identifier | `pypvgvfkfxqybnydkegs` |

**Usage in Frontend Code:**

```typescript
// These are available automatically via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// OR use the pre-configured client
import { supabase } from "@/integrations/supabase/client";
```

### Edge Function Environment Variables

Automatically injected into all Edge Functions:

| Variable | Description | Access |
|----------|-------------|--------|
| `SUPABASE_URL` | Project URL | `Deno.env.get("SUPABASE_URL")` |
| `SUPABASE_ANON_KEY` | Anon key | `Deno.env.get("SUPABASE_ANON_KEY")` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (privileged) | `Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")` |

**Usage in Edge Functions:**

```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// For user-scoped operations (respects RLS)
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!,
  {
    global: {
      headers: { Authorization: req.headers.get("Authorization")! },
    },
  }
);

// For admin operations (bypasses RLS - use carefully!)
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
```

---

## Lovable Cloud Secrets

Secrets are managed via the Lovable Cloud UI (Settings → Secrets) or via the `secrets--add_secret` tool.

### Current Secrets

| Secret Name | Purpose | Required For | Status |
|-------------|---------|--------------|--------|
| `SUPABASE_URL` | Supabase project URL | Edge Functions | Auto-provisioned |
| `SUPABASE_ANON_KEY` | Public API key | Edge Functions | Auto-provisioned |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged API key | Edge Functions | Auto-provisioned |

### Future Secrets (To Be Added)

These secrets will be needed for production external integrations:

| Secret Name | Purpose | Required For |
|-------------|---------|--------------|
| `EXPERIAN_API_KEY` | Experian Business API | Credit bureau pulls |
| `EXPERIAN_API_SECRET` | Experian authentication | Credit bureau pulls |
| `EQUIFAX_API_KEY` | Equifax API access | Credit bureau pulls |
| `EQUIFAX_CLIENT_ID` | Equifax OAuth | Credit bureau pulls |
| `DNB_API_TOKEN` | D&B Direct+ API | Credit bureau pulls |
| `PLAID_CLIENT_ID` | Plaid integration | Bank data aggregation |
| `PLAID_SECRET` | Plaid authentication | Bank data aggregation |
| `SMTP_HOST` | Email server | Notifications |
| `SMTP_USER` | Email authentication | Notifications |
| `SMTP_PASSWORD` | Email authentication | Notifications |
| `SLACK_WEBHOOK_URL` | Slack notifications | Alerting |
| `N8N_API_KEY` | n8n automation access | Workflow triggers |
| `LOVABLE_API_KEY` | Lovable AI Gateway | AI features |

---

## Secret Management Rules

### Adding New Secrets

1. **Never hardcode secrets in code**
2. **Use the secrets tool**: `secrets--add_secret` with the secret name
3. **User must enter value**: The system prompts for the actual value
4. **Secrets are encrypted**: Stored securely in Lovable Cloud

### Accessing Secrets in Edge Functions

```typescript
// Edge Functions access secrets via Deno.env
const apiKey = Deno.env.get("EXPERIAN_API_KEY");

if (!apiKey) {
  throw new Error("EXPERIAN_API_KEY not configured");
}
```

### Secret Rotation

1. **Update the secret value** via Lovable Cloud UI
2. **Redeploy Edge Functions** to pick up new value
3. **Verify functionality** with test requests
4. **Revoke old credentials** at the source

---

## Configuration Files

### supabase/config.toml

**Status**: Auto-managed by Lovable Cloud  
**Location**: `supabase/config.toml`  
**Contents**: Project configuration including auth settings

```toml
# Example structure (DO NOT EDIT)
[project]
id = "pypvgvfkfxqybnydkegs"

[auth]
# Auth configuration managed via supabase--configure-auth tool
```

### components.json

**Status**: shadcn/ui configuration  
**Location**: `components.json`  
**Purpose**: UI component library settings

```json
{
  "style": "default",
  "rsc": false,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### tailwind.config.ts

**Status**: Manually maintained  
**Location**: `tailwind.config.ts`  
**Purpose**: Tailwind CSS configuration including design tokens

Key sections:
- `theme.extend.colors`: Semantic color tokens
- `theme.extend.borderRadius`: Border radius tokens
- `theme.extend.keyframes`: Animation definitions

### vite.config.ts

**Status**: Manually maintained  
**Location**: `vite.config.ts`  
**Purpose**: Build configuration

Key settings:
- Path aliases (`@/` → `src/`)
- Development server configuration
- Build optimization

---

## Environment-Specific Behavior

### Sandbox vs Production Toggle

The `EnvironmentContext` manages logical environment switching:

```typescript
// src/contexts/EnvironmentContext.tsx
const { environment, toggleEnvironment } = useEnvironment();
// environment: "sandbox" | "production"
```

**Behavior Differences:**

| Feature | Sandbox | Production |
|---------|---------|------------|
| Data source | Test data | Live data |
| API keys | Sandbox keys | Production keys |
| Bureau calls | Mock responses | Real API calls |
| Webhooks | Test endpoints | Live endpoints |
| Audit logging | Full logging | Full logging |

### Feature Flags

Currently implemented via environment context, not a dedicated feature flag system:

```typescript
// Example: Checking environment for conditional behavior
if (environment === "sandbox") {
  // Use mock data
  return mockBureauResponse();
} else {
  // Call real API
  return fetchFromBureau();
}
```

---

## Database Connection

### Connection String

**Not exposed to frontend.** Database access is exclusively through:
1. Supabase client (frontend) → Uses anon key with RLS
2. Edge Functions → Uses service role key for admin operations

### Connection Pool

Managed by Supabase. Configuration via Supabase dashboard (not accessible in Lovable Cloud).

Default settings:
- Pool mode: Transaction
- Pool size: Auto-scaled

---

## Logging Configuration

### Console Logs

- Development: Full logging to browser console
- Production: Errors only (recommended)

### Audit Logs

Always enabled. Configuration via:
- Server-side: `_shared/audit.ts`
- Client-side: `useAuditEmit` hook

### Edge Function Logs

Available via:
- Lovable Cloud UI (Cloud tab → Logs)
- `supabase--edge-function-logs` tool

---

## Security Considerations

### Public Variables

These are safe to expose in frontend code:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

### Sensitive Variables

These must NEVER appear in frontend code:
- `SUPABASE_SERVICE_ROLE_KEY`
- Any external API keys
- Any credentials or tokens

### Variable Naming Conventions

| Prefix | Meaning | Exposure |
|--------|---------|----------|
| `VITE_` | Vite build-time variable | Bundled into frontend |
| `SUPABASE_` | Supabase-specific | Edge Functions only |
| No prefix | Edge Function secret | Edge Functions only |

---

## Troubleshooting

### "Secret not found" Errors

1. Verify secret exists: Check Lovable Cloud Secrets panel
2. Verify secret name: Exact match required (case-sensitive)
3. Redeploy function: Edge Functions may need redeployment

### "Unauthorized" Errors

1. Check JWT expiration: Tokens expire after configured time
2. Check secret rotation: Was the key recently changed?
3. Check environment: Sandbox vs Production keys

### Environment Variable Not Available

1. Frontend vars: Must use `VITE_` prefix
2. Edge Function vars: Use `Deno.env.get()`
3. Build required: Changes may need a rebuild

---

## Checklist for New Integrations

When adding a new external integration:

1. [ ] Identify required secrets
2. [ ] Add secrets via `secrets--add_secret` tool
3. [ ] Create Edge Function to wrap API calls
4. [ ] Add error handling for missing secrets
5. [ ] Update this document with new secret names
6. [ ] Test in Sandbox environment first
7. [ ] Document any environment-specific behavior

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-28 | Initial document creation |

---

**Document Classification**: CONFIGURATION REFERENCE  
**Sensitivity**: Secret names only (no values)  
**Last Updated**: 2025-01-28  
**Maintainer**: DevOps Team
