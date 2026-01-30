# LumiqAI Enterprise Platform Documentation

## Overview

LumiqAI is an enterprise-grade B2B credit intelligence platform designed for banks and lenders who need to assess SMB (Small and Medium Business) creditworthiness. The platform provides pre-qualification, underwriting assistance, portfolio risk monitoring, and compliance-ready audit trails.

---

## Quick Navigation

| Document | Purpose |
|----------|---------|
| [AI_OPERATOR_RULES.md](./AI_OPERATOR_RULES.md) | Constraints and behaviors for AI agents |
| [DEPLOYMENT_MODES.md](./DEPLOYMENT_MODES.md) | Environment configurations and deployment patterns |
| [ENVIRONMENT_VARIABLES_AND_SECRETS.md](./ENVIRONMENT_VARIABLES_AND_SECRETS.md) | Complete secrets and configuration reference |
| [LUMIQAI_SYSTEM_DECISIONS.md](./LUMIQAI_SYSTEM_DECISIONS.md) | Authoritative decision ledger (read before changing anything) |
| [LUMIQAI_SYSTEM_OPERATOR_HANDBOOK.md](./LUMIQAI_SYSTEM_OPERATOR_HANDBOOK.md) | Operations guide for platform administrators |
| [LUMIQAI_ENTERPRISE_DASHBOARD_FRONTEND_SPEC.md](./LUMIQAI_ENTERPRISE_DASHBOARD_FRONTEND_SPEC.md) | Frontend component specifications |
| [LUMIQAI_UI_COMPONENT_INVENTORY.md](./LUMIQAI_UI_COMPONENT_INVENTORY.md) | Complete UI component catalog |
| [LUMIQAI_ENTERPRISE_TRUST_SURFACE.md](./LUMIQAI_ENTERPRISE_TRUST_SURFACE.md) | Audit and reliability signals in UI |
| [LUMIQAI_ERROR_AND_RECOVERY_UX.md](./LUMIQAI_ERROR_AND_RECOVERY_UX.md) | Error handling patterns |
| [LUMIQAI_ENTERPRISE_USER_JOURNEY.md](./LUMIQAI_ENTERPRISE_USER_JOURNEY.md) | End-to-end user flow documentation |
| [LUMIQAI_ENTERPRISE_KPI_DEFINITION.md](./LUMIQAI_ENTERPRISE_KPI_DEFINITION.md) | KPI and metric definitions |
| [LUMIQAI_FRONTEND_IMPLIED_BACKEND_CONTRACT.md](./LUMIQAI_FRONTEND_IMPLIED_BACKEND_CONTRACT.md) | API contract between frontend and BFF |
| [API_INFRASTRUCTURE_REQUIREMENTS.md](./API_INFRASTRUCTURE_REQUIREMENTS.md) | Production infrastructure roadmap |
| [N8N_COMMAND_CENTER_BLUEPRINT.md](./N8N_COMMAND_CENTER_BLUEPRINT.md) | Automation orchestration patterns |
| [DEVOPS_ONBOARDING.md](./DEVOPS_ONBOARDING.md) | DevOps team onboarding guide |

---

## System Architecture

### Current Production Architecture (Honest MVP)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                     React SPA (Vite + TypeScript)                   │ │
│  │                                                                      │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │ │
│  │  │PortfolioCtx  │  │ AuthContext  │  │ EnvironmentContext       │  │ │
│  │  │(Scope)       │  │(Identity)    │  │(Sandbox/Prod)            │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘  │ │
│  │                           │                                          │ │
│  │                           ▼                                          │ │
│  │  ┌──────────────────────────────────────────────────────────────┐   │ │
│  │  │              useBffQuery / useBffMutation Hooks              │   │ │
│  │  └──────────────────────────────────────────────────────────────┘   │ │
│  │                           │                                          │ │
│  │                           ▼                                          │ │
│  │  ┌──────────────────────────────────────────────────────────────┐   │ │
│  │  │                   BFF Service Layer                          │   │ │
│  │  │  src/services/bff/{customers,scores,reports,risk,...}.ts    │   │ │
│  │  └──────────────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS + JWT
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SUPABASE EDGE FUNCTIONS                          │
│                        (Backend-for-Frontend Layer)                      │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  _shared/                                                           │ │
│  │  ├── auth.ts      (JWT validation, tenant extraction)              │ │
│  │  ├── audit.ts     (Server-side audit logging)                      │ │
│  │  ├── cors.ts      (CORS configuration)                             │ │
│  │  └── response.ts  (Standardized response envelope)                 │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ /customers  │ │ /scores     │ │ /reports    │ │ /risk       │       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ /api-keys   │ │ /audit-evts │ │ /offers     │ │ /health     │       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
│  ┌─────────────┐                                                        │
│  │/applications│                                                        │
│  └─────────────┘                                                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Postgres Protocol + RLS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SUPABASE POSTGRES                                │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    Row Level Security (RLS)                         │ │
│  │                                                                      │ │
│  │  has_tenant_access(user_id, tenant_id) → boolean                   │ │
│  │  has_portfolio_access(user_id, portfolio_id) → boolean             │ │
│  │  has_role(user_id, tenant_id, role) → boolean                      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ tenants     │ │ portfolios  │ │ profiles    │ │ user_roles  │       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ smb_entities│ │credit_scores│ │ applications│ │prequal_offrs│       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ report_jobs │ │ audit_evnts │ │ data_lineage│ │ ews_queue   │       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ api_keys    │ │api_usage_log│ │webhook_confg│ │ ai_insights │       │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │
│  ┌─────────────┐ ┌─────────────┐                                        │
│  │risk_aggregts│ │score_history│                                        │
│  └─────────────┘ └─────────────┘                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Future Architecture (With Automation Layer)

```
                    ┌─────────────────────────────────────────┐
                    │              OPERATORS                   │
                    │      (Slack Commands / Manual Triggers)  │
                    └─────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              n8n COMMAND CENTER                          │
│                         (Automation Orchestration)                       │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │ CMD_JOB_*       │  │ CMD_FEATURE_*   │  │ CMD_HEALTH_*    │         │
│  │ (Scheduled Jobs)│  │ (Trigger Claude)│  │ (Monitoring)    │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
└─────────────────────────────────────────────────────────────────────────┘
          │                         │                      │
          │                         ▼                      │
          │         ┌───────────────────────────┐          │
          │         │      CLAUDE CODE          │          │
          │         │  (GitHub PR Generation)   │          │
          │         └───────────────────────────┘          │
          │                         │                      │
          │                         ▼                      │
          │         ┌───────────────────────────┐          │
          │         │        GITHUB             │          │
          │         │  (Code Review + Merge)    │          │
          │         └───────────────────────────┘          │
          │                                                │
          └────────────────────┬───────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   BFF EDGE FUNCTIONS │
                    │   (Data Operations)  │
                    └─────────────────────┘
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| TypeScript | Latest | Type safety |
| Vite | Latest | Build tooling |
| Tailwind CSS | Latest | Styling |
| shadcn/ui | Latest | Component library |
| Framer Motion | 12.x | Animations |
| React Router | 7.x | Routing |
| Zustand | 5.x | State management |
| React Hook Form | 7.x | Form handling |
| Zod | 4.x | Validation |
| Recharts | 3.x | Charts |
| Lucide React | Latest | Icons |

### Backend

| Technology | Purpose |
|------------|---------|
| Supabase Edge Functions | BFF layer (Deno runtime) |
| Supabase PostgreSQL | Primary database |
| Supabase Auth | Authentication |
| Supabase Realtime | Live subscriptions |
| Row Level Security | Multi-tenant isolation |

### Infrastructure

| Component | Provider |
|-----------|----------|
| Hosting | Lovable Cloud |
| Database | Supabase (managed Postgres) |
| Edge Functions | Supabase (Deno) |
| Secrets | Supabase Vault + Lovable Secrets |
| Monitoring | Supabase Logs |

---

## Directory Structure

```
lumiqai/
├── docs/                          # Documentation (you are here)
│   ├── README.md                  # This file
│   ├── AI_OPERATOR_RULES.md       # AI agent constraints
│   ├── DEPLOYMENT_MODES.md        # Environment configurations
│   ├── ENVIRONMENT_VARIABLES_AND_SECRETS.md
│   ├── LUMIQAI_SYSTEM_DECISIONS.md
│   └── ...                        # Other documentation
│
├── public/                        # Static assets
│   ├── icons/                     # UI icons (light theme)
│   ├── icons-black/               # UI icons (dark theme)
│   ├── fintech-logos/             # Partner logos
│   └── lumiqlogo.png              # Brand logo
│
├── src/
│   ├── adapters/                  # Data transformation adapters
│   │   └── customerAdapter.ts     # BFF → Component data mapping
│   │
│   ├── assets/                    # Bundled assets
│   │   └── dashboard-assets/      # Dashboard images
│   │
│   ├── components/
│   │   ├── dashboard/             # Dashboard-specific components
│   │   │   ├── dashboard/         # Core dashboard widgets
│   │   │   ├── pages/             # Tab content components
│   │   │   └── ui/                # Dashboard UI primitives
│   │   │
│   │   ├── enterprise/            # Enterprise feature components
│   │   │   ├── analytics/         # Analytics pillar
│   │   │   ├── customer/          # Customer management
│   │   │   ├── reports/           # Report generation
│   │   │   ├── risk/              # Risk monitoring
│   │   │   ├── settings/          # Platform settings
│   │   │   └── underwriting/      # Underwriting assistant
│   │   │
│   │   ├── finlab/                # Financial lab components
│   │   ├── partner-portal/        # Partner API portal
│   │   ├── shared/                # Cross-cutting components
│   │   ├── ui/                    # Base UI primitives (shadcn)
│   │   └── widgets/               # Reusable widget components
│   │
│   ├── contexts/                  # React contexts
│   │   ├── AuthContext.tsx        # Authentication state
│   │   ├── EnvironmentContext.tsx # Sandbox/Production toggle
│   │   └── PortfolioContext.tsx   # Portfolio scope
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useBffQuery.ts         # BFF data fetching
│   │   ├── useAuditEmit.ts        # Client-side audit logging
│   │   ├── useReportPolling.ts    # Async report status
│   │   └── useSessionTimeout.ts   # Session management
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts          # Supabase client (auto-generated)
│   │       └── types.ts           # Database types (auto-generated)
│   │
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   │
│   ├── pages/
│   │   ├── Authentication/        # Login, Register, Signup
│   │   └── Dashboard/             # Dashboard route components
│   │
│   ├── services/
│   │   ├── bff/                   # BFF service layer
│   │   │   ├── client.ts          # HTTP client configuration
│   │   │   ├── customers.ts       # Customer endpoints
│   │   │   ├── scores.ts          # Score endpoints
│   │   │   ├── reports.ts         # Report endpoints
│   │   │   ├── risk.ts            # Risk endpoints
│   │   │   ├── apiKeys.ts         # API key management
│   │   │   ├── audit.ts           # Audit logging
│   │   │   ├── offers.ts          # Pre-qual offers
│   │   │   ├── applications.ts    # Applications
│   │   │   └── types.ts           # Shared BFF types
│   │   │
│   │   ├── api.ts                 # Legacy API service
│   │   ├── authService.ts         # Auth helpers
│   │   └── dashboardService.ts    # Dashboard data
│   │
│   ├── types/                     # TypeScript type definitions
│   ├── utils/                     # Utility modules
│   ├── App.tsx                    # Root component
│   ├── App.css                    # Global styles
│   ├── index.css                  # Tailwind base + tokens
│   └── main.tsx                   # Entry point
│
├── supabase/
│   ├── config.toml                # Supabase configuration (auto-managed)
│   ├── functions/
│   │   ├── _shared/               # Shared Edge Function utilities
│   │   │   ├── auth.ts            # Authentication helpers
│   │   │   ├── audit.ts           # Audit logging
│   │   │   ├── cors.ts            # CORS configuration
│   │   │   └── response.ts        # Response envelope
│   │   │
│   │   ├── api-keys/              # API key management
│   │   ├── applications/          # Application processing
│   │   ├── audit-events/          # Audit event logging
│   │   ├── customers/             # Customer CRUD
│   │   ├── health/                # Health check endpoint
│   │   ├── offers/                # Pre-qual offers
│   │   ├── reports/               # Report generation
│   │   ├── risk/                  # Risk aggregates
│   │   └── scores/                # Score management
│   │
│   └── migrations/                # Database migrations (read-only)
│
├── .env                           # Environment variables (auto-managed)
├── components.json                # shadcn/ui configuration
├── eslint.config.js               # ESLint configuration
├── index.html                     # HTML entry point
├── package.json                   # Dependencies (managed by Lovable)
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
└── vitest.config.ts               # Vitest configuration
```

---

## Multi-Tenant Data Model

### Hierarchy

```
Tenant (Bank/Organization)
    │
    ├── Portfolios (Groups of SMB customers)
    │       │
    │       ├── SMB Entities (Businesses)
    │       │       │
    │       │       ├── Business Owners
    │       │       ├── Credit Scores
    │       │       ├── Applications
    │       │       └── Pre-qual Offers
    │       │
    │       └── Risk Aggregates
    │
    ├── Users (Platform users)
    │       │
    │       ├── Profiles
    │       ├── User Roles
    │       └── Portfolio Access
    │
    ├── API Keys
    ├── Webhook Configs
    ├── Audit Events
    └── Report Jobs
```

### Isolation Rules

| Level | Enforcement Point | Mechanism |
|-------|-------------------|-----------|
| Tenant | Database (RLS) | `has_tenant_access(auth.uid(), tenant_id)` |
| Portfolio | BFF + Database | Mandatory `portfolioId` param + `has_portfolio_access()` |
| User | Auth + RLS | JWT `user_id` + role-based policies |

---

## Getting Started

### For Developers

1. **Read the Decision Ledger**: Start with [LUMIQAI_SYSTEM_DECISIONS.md](./LUMIQAI_SYSTEM_DECISIONS.md)
2. **Understand the Architecture**: Review this README and the system diagrams
3. **Check AI Rules**: If using AI assistance, read [AI_OPERATOR_RULES.md](./AI_OPERATOR_RULES.md)
4. **Environment Setup**: See [ENVIRONMENT_VARIABLES_AND_SECRETS.md](./ENVIRONMENT_VARIABLES_AND_SECRETS.md)

### For DevOps

1. **Onboarding Guide**: [DEVOPS_ONBOARDING.md](./DEVOPS_ONBOARDING.md)
2. **Deployment Modes**: [DEPLOYMENT_MODES.md](./DEPLOYMENT_MODES.md)
3. **Infrastructure Requirements**: [API_INFRASTRUCTURE_REQUIREMENTS.md](./API_INFRASTRUCTURE_REQUIREMENTS.md)

### For Product/Design

1. **UI Inventory**: [LUMIQAI_UI_COMPONENT_INVENTORY.md](./LUMIQAI_UI_COMPONENT_INVENTORY.md)
2. **User Journeys**: [LUMIQAI_ENTERPRISE_USER_JOURNEY.md](./LUMIQAI_ENTERPRISE_USER_JOURNEY.md)
3. **KPI Definitions**: [LUMIQAI_ENTERPRISE_KPI_DEFINITION.md](./LUMIQAI_ENTERPRISE_KPI_DEFINITION.md)

---

## Key Concepts

### Backend-for-Frontend (BFF)

All frontend data access goes through Edge Functions. The frontend NEVER queries the database directly. This enables:
- Centralized authentication/authorization
- Consistent audit logging
- Data transformation and lineage tracking
- Decoupled frontend/backend evolution

### Portfolio-Scoped Operations

Every data operation requires an explicit `portfolioId`. This is not optional. Missing portfolio scope returns a 422 error. This ensures:
- Clear data boundaries
- Audit trail clarity
- Prevention of accidental cross-portfolio access

### Dual-Layer Auditing

- **Server-side**: Edge Functions log sensitive operations via `writeAuditEvent()`
- **Client-side**: UI components emit events via `useAuditEmit()` hook
- Both layers write to the `audit_events` table

### Standardized Response Envelope

All BFF responses follow this structure:
```typescript
{
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    dataSources: string[];
    lastUpdated: string;
  };
}
```

---

## Important Links

| Resource | URL |
|----------|-----|
| Preview Environment | https://id-preview--71f13c93-d7ba-4960-b2fb-7c7f8b9e8b28.lovable.app |
| Published App | https://dash-nest-start.lovable.app |
| Supabase Project ID | pypvgvfkfxqybnydkegs |

---

## Document Maintenance

This documentation is maintained as code within the repository. Changes to documentation should accompany related code changes.

**Version**: 1.0  
**Last Updated**: 2025-01-28  
**Maintainer**: System Architecture Team
