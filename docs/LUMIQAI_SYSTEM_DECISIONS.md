# LumiqAI System Decisions & Change Log

This document is the authoritative decision ledger for the LumiqAI platform.
It explains WHY architectural, product, and system decisions were made.
It exists to prevent confusion, accidental regressions, and AI or human agents
undoing intentional constraints.

---

## How to Use This Document

- Read this before proposing changes
- Read this before refactoring
- Read this before introducing new tools, agents, or architectures
- AI agents must treat this document as a hard constraint

---

## Decision Entry Template

Each decision must follow this exact format:

```
### Decision ID: SD-XXX
### Date:
### Status: (Active | Deprecated | Superseded)

#### Context
Explain the situation or problem that required a decision.

#### Options Considered
List the realistic options that were evaluated.

#### Decision Taken
Clearly state what was chosen.

#### Rationale
Explain WHY this option was chosen over others.

#### Tradeoffs Accepted
Explicitly list what was sacrificed or deprioritized.

#### Non-Goals
List what this decision intentionally does NOT try to solve.

#### Constraints Introduced
List any rules, limitations, or boundaries this decision creates.

#### Consequences
Describe the downstream effects on architecture, workflows, or teams.
```

---

## Initial System Decisions

---

### Decision ID: SD-001
### Date: 2025-01
### Status: Active

#### Context

LumiqAI required a clear separation between frontend presentation and backend data/logic to support enterprise-grade security reviews from Tier-1 banks.

#### Options Considered

1. Monolithic full-stack framework (Next.js, Remix)
2. Separate frontend (React SPA) with direct Supabase client access
3. Frontend (React SPA) communicating exclusively through BFF Edge Functions

#### Decision Taken

Option 3: React SPA frontend communicating exclusively through Backend-for-Frontend (BFF) Edge Functions hosted on Supabase.

#### Rationale

- BFF layer centralizes authentication, authorization, and audit logging
- Prevents frontend from having direct database access patterns that could bypass security
- Enables consistent response envelopes with data lineage metadata
- Allows backend logic changes without frontend redeployment
- Satisfies bank security review requirements for controlled data access

#### Tradeoffs Accepted

- Additional latency from extra network hop
- More complex debugging (frontend → BFF → database)
- Requires maintaining Edge Function code separately

#### Non-Goals

- This decision does not address real-time subscriptions (handled separately)
- This decision does not dictate frontend framework choice

#### Constraints Introduced

- All data fetching MUST go through BFF endpoints
- Frontend code MUST NOT contain direct Supabase queries for business data
- Every BFF response MUST include standardized `meta` envelope with lineage

#### Consequences

- Created `src/services/bff/` directory with domain-specific service files
- Established `useBffQuery` hook as the standard data fetching pattern
- Required `BffErrorBoundary` component for consistent error handling

---

### Decision ID: SD-002
### Date: 2025-01
### Status: Active

#### Context

The platform needed multi-tenant data isolation where each bank (tenant) has multiple portfolios of SMB customers, and users should only see data within their assigned scope.

#### Options Considered

1. Application-level filtering in frontend code
2. Application-level filtering in BFF layer only
3. Database-level Row Level Security (RLS) with dual-layer isolation

#### Decision Taken

Option 3: PostgreSQL Row Level Security with mandatory `tenant_id` and `portfolio_id` scoping at both BFF and database layers.

#### Rationale

- RLS provides defense-in-depth; even if BFF has bugs, database prevents cross-tenant access
- Dual-layer isolation (tenant + portfolio) matches the actual business hierarchy
- `portfolioId` as mandatory query parameter makes scope explicit in every request
- Enables fine-grained audit trails at the database level

#### Tradeoffs Accepted

- Increased complexity in RLS policy management
- Every new table requires explicit RLS policy creation
- 422 errors when `portfolioId` is missing (by design)

#### Non-Goals

- This does not handle row-level encryption (separate concern)
- This does not address cross-tenant data sharing (not a requirement)

#### Constraints Introduced

- Every data-fetching BFF endpoint MUST require `portfolioId` query parameter
- Every table with tenant data MUST have RLS policies using `has_tenant_access()` and `has_portfolio_access()` functions
- Frontend MUST use `PortfolioContext` to inject portfolio scope into all requests

#### Consequences

- Created `PortfolioSelector` component in header
- `BffErrorBoundary` handles 422 errors with "Select Portfolio" prompt
- All dashboard pages wrapped in portfolio context checks

---

### Decision ID: SD-003
### Date: 2025-01
### Status: Active

#### Context

Enterprise bank customers require comprehensive audit trails for compliance with FFIEC guidelines, SR 11-7 model governance, and internal risk management policies.

#### Options Considered

1. Frontend-only event logging (analytics-style)
2. Server-only audit logging in BFF
3. Dual-layer auditing: server-side for sensitive actions, client-side for UI interactions

#### Decision Taken

Option 3: Dual-layer auditing with server-side logging via `_shared/audit.ts` and client-side emission via `useAuditEmit` hook.

#### Rationale

- Server-side logging captures actions regardless of client behavior
- Client-side logging captures user intent and UI interactions that don't reach server
- Dual approach provides complete visibility for compliance audits
- Standardized `audit_events` table enables consistent querying and reporting

#### Tradeoffs Accepted

- Some duplication of events between layers
- Client-side events can be missed if user closes browser mid-action
- Increased storage requirements for comprehensive logging

#### Non-Goals

- Real-time alerting on audit events (separate monitoring concern)
- Audit event immutability via blockchain or similar (not required)

#### Constraints Introduced

- Sensitive BFF actions MUST call `writeAuditEvent()` before returning
- UI components displaying PII MUST emit `VIEW_PII` event via `useAuditEmit`
- All audit events MUST include `user_id`, `tenant_id`, `action`, `resource_id`, `timestamp`

#### Consequences

- Created `audit_events` table with comprehensive schema
- Created `useAuditEmit` hook for frontend use
- Added `DataLineageFooter` component to display data freshness

---

### Decision ID: SD-004
### Date: 2025-01
### Status: Active

#### Context

The system needed an orchestration layer for background jobs, scheduled tasks, and coordination between different system components.

#### Options Considered

1. pg_cron for all background jobs (database-native)
2. External cron service (AWS Lambda scheduled, Cloud Functions)
3. n8n as central automation command center
4. Custom job queue with worker processes

#### Decision Taken

Option 3: n8n as the central automation and orchestration layer, with pg_cron for database-native scheduled tasks.

#### Rationale

- n8n provides visual workflow builder for non-developer operators
- Supports webhook triggers, scheduling, and multi-step orchestration
- Can trigger Claude Code for code generation tasks
- Provides built-in monitoring and execution history
- pg_cron handles simple database-level scheduling without external dependencies

#### Tradeoffs Accepted

- Additional infrastructure dependency (n8n instance)
- Learning curve for operators unfamiliar with n8n
- n8n is NOT in active MVP stack (future roadmap item per SD-005)

#### Non-Goals

- n8n does NOT write application code
- n8n does NOT access production database directly
- n8n does NOT make deployment decisions

#### Constraints Introduced

- n8n workflows MUST use BFF endpoints for all data operations
- n8n MUST NOT contain hardcoded secrets (use credential store)
- n8n workflows MUST be named using `CMD_[Category]_[Action]` convention
- All n8n-triggered actions MUST be logged to `agent_actions` table

#### Consequences

- Created `docs/N8N_COMMAND_CENTER_BLUEPRINT.md` defining workflow patterns
- n8n integration deferred to post-MVP roadmap
- Current MVP operates without n8n (React → BFF → Supabase flow)

---

### Decision ID: SD-005
### Date: 2025-01
### Status: Active

#### Context

During preparation for Tier-1 bank security reviews, the documented architecture included components (n8n, LangGraph) that were not yet implemented, creating credibility risk.

#### Options Considered

1. Accelerate implementation of all documented components
2. Remove unimplemented components from documentation entirely
3. Create "Honest MVP" model that clearly separates current state from roadmap

#### Decision Taken

Option 3: Establish "Honest MVP" architecture model that explicitly documents what is currently implemented versus future roadmap items.

#### Rationale

- Bank risk reviewers value accuracy over ambition
- Clear separation prevents auditors from testing non-existent features
- Maintains architectural vision while being truthful about current state
- Enables focused security review on actual implementation

#### Tradeoffs Accepted

- Some documented capabilities are explicitly labeled as "future"
- May appear less feature-complete to external evaluators
- Requires maintaining two views (current vs. planned)

#### Non-Goals

- This does not reduce the long-term vision
- This does not remove n8n/LangGraph from the architecture permanently

#### Constraints Introduced

- System Operator Handbook MUST clearly label MVP vs. future components
- Documentation MUST use "Current Flow" vs. "Future Flow" sections
- Demo environments MUST only showcase implemented features

#### Consequences

- Updated `docs/LUMIQAI_SYSTEM_OPERATOR_HANDBOOK.md` to v1.1 with Honest MVP model
- Current flow defined as: React → BFF (Edge Functions) → Supabase (Postgres)
- n8n moved to "Future Roadmap" section in documentation

---

### Decision ID: SD-006
### Date: 2025-01
### Status: Active

#### Context

Code changes to the LumiqAI platform needed a controlled, auditable process that prevents accidental or unauthorized modifications.

#### Options Considered

1. Direct commits to main branch by developers
2. Feature branches with automated merge on CI pass
3. Feature branches with mandatory human PR approval
4. AI-generated PRs via Claude Code with mandatory human approval

#### Decision Taken

Option 4: Claude Code generates pull requests via GitHub; all PRs require human approval before merge.

#### Rationale

- AI acceleration for code generation while maintaining human oversight
- PR review process provides natural audit point
- GitHub's existing review workflow well-understood by teams
- Prevents "AI gone wrong" scenarios from reaching production

#### Tradeoffs Accepted

- Slower deployment velocity due to human review requirement
- Reviewers must understand AI-generated code patterns
- Claude Code may generate suboptimal code requiring iteration

#### Non-Goals

- This does not automate deployment (separate process)
- This does not replace human code review skills

#### Constraints Introduced

- Claude Code MUST open PRs, never commit directly
- All PRs MUST have at least one human approval
- Automated merges are PROHIBITED
- Claude Code instructions MUST be scoped and explicit

#### Consequences

- Established GitHub PR workflow as the single path to production
- Created instruction templates for Claude Code in command center docs
- n8n can trigger Claude Code but cannot approve resulting PRs

---

### Decision ID: SD-007
### Date: 2025-01
### Status: Active

#### Context

The platform needed to prevent automation layers from bypassing security controls or making unauthorized data modifications.

#### Options Considered

1. Give automation full database access for flexibility
2. Restrict automation to read-only database access
3. Require automation to use BFF layer for all data operations

#### Decision Taken

Option 3: All automation (n8n, future AI agents) MUST use BFF Edge Functions for data operations; direct database access is prohibited.

#### Rationale

- BFF layer enforces authentication, authorization, and audit logging
- Prevents automation from bypassing tenant isolation
- Ensures all operations are logged consistently
- Reduces attack surface if automation credentials are compromised

#### Tradeoffs Accepted

- Automation is limited to operations exposed via BFF
- Some operations may require new BFF endpoints
- Slightly higher latency for automation workflows

#### Non-Goals

- This does not prevent database administrators from direct access
- This does not address read-only analytics queries (separate concern)

#### Constraints Introduced

- n8n workflows MUST NOT contain database connection strings
- Automation MUST authenticate using API keys, not service accounts
- All automation data access MUST go through documented BFF endpoints

#### Consequences

- Edge Functions become the single data access layer
- Created `agent_actions` table for automation audit trail
- BFF endpoints must be designed for both human UI and automation use

---

### Decision ID: SD-008
### Date: 2025-01
### Status: Active

#### Context

LumiqAI is a complex system with multiple components, workflows, and constraints. New team members and AI agents needed comprehensive documentation to operate effectively.

#### Options Considered

1. Inline code comments only
2. Wiki-style documentation (Confluence, Notion)
3. Documentation as code in the repository
4. Combination of repo docs and external knowledge base

#### Decision Taken

Option 3: Documentation as first-class system artifact, stored in `docs/` directory within the repository.

#### Rationale

- Documentation versioned alongside code ensures consistency
- AI agents can read docs directly from repository context
- PRs can include both code and documentation changes
- No external dependencies for documentation access

#### Tradeoffs Accepted

- Markdown limitations compared to rich documentation platforms
- No built-in search across documentation
- Diagrams require ASCII art or external image hosting

#### Non-Goals

- This does not replace API reference documentation (generated from code)
- This does not address end-user documentation (separate concern)

#### Constraints Introduced

- Major architectural decisions MUST be documented in `docs/`
- Documentation MUST be updated when related code changes
- AI agents MUST consult documentation before making changes
- This decisions document (SD-XXX entries) is append-only

#### Consequences

- Created comprehensive `docs/` directory structure
- Established documentation templates for consistency
- AI assistants instructed to check docs before code changes

---

### Decision ID: SD-009
### Date: 2025-01
### Status: Active

#### Context

The BFF layer needed to provide consistent, predictable responses that support both data display and compliance requirements like data lineage.

#### Options Considered

1. Return raw database query results
2. Standardized success/error envelope
3. Standardized envelope with metadata including data lineage

#### Decision Taken

Option 3: All BFF responses use standardized envelope with `success`, `data`, `error`, and `meta` (containing `dataSources` and `lastUpdated`) fields.

#### Rationale

- Consistent response structure simplifies frontend error handling
- `meta` envelope provides data lineage for compliance display
- Enables `DataLineageFooter` component to work across all pages
- Supports future additions to metadata without breaking changes

#### Tradeoffs Accepted

- Slightly larger response payloads
- All endpoints must implement envelope (no shortcuts)
- Frontend must unwrap envelope to access data

#### Non-Goals

- This does not define the internal structure of `data` field
- This does not address streaming responses (separate pattern)

#### Constraints Introduced

- All BFF responses MUST use `_shared/response.ts` helpers
- `meta.dataSources` MUST list all data sources contributing to response
- `meta.lastUpdated` MUST reflect the most recent data modification time

#### Consequences

- Created `_shared/response.ts` with `successResponse` and `errorResponse` helpers
- Frontend `useBffQuery` hook expects and unwraps this envelope
- `DataLineageFooter` component reads `meta` for display

---

### Decision ID: SD-010
### Date: 2025-01
### Status: Active

#### Context

The frontend codebase needed a consistent approach to visual design that supports theming, dark mode, and maintainability.

#### Options Considered

1. Inline styles and arbitrary Tailwind classes
2. CSS modules with component-specific styles
3. Semantic design tokens in CSS variables with Tailwind configuration

#### Decision Taken

Option 3: Semantic design tokens defined in `index.css` and `tailwind.config.ts`, with components using only token-based classes.

#### Rationale

- Enables consistent theming across the application
- Supports light/dark mode via CSS variable switching
- Prevents color drift from arbitrary hex/rgb values
- Simplifies design system updates

#### Tradeoffs Accepted

- Requires discipline to avoid arbitrary color classes
- Initial setup overhead for token system
- Some Tailwind flexibility reduced

#### Non-Goals

- This does not define specific color palette choices
- This does not address responsive design patterns

#### Constraints Introduced

- Components MUST NOT use direct color values (e.g., `text-white`, `bg-black`)
- All colors MUST be defined as HSL values in CSS variables
- New colors MUST be added to both `index.css` and `tailwind.config.ts`

#### Consequences

- Established semantic tokens: `--background`, `--foreground`, `--primary`, etc.
- Components use classes like `bg-background`, `text-foreground`
- Dark mode implemented via `:root` and `.dark` CSS variable overrides

---

## Rules for Adding New Decisions

- Every major architectural or system change MUST add a new entry
- Decisions must be append-only (never delete history)
- Deprecated decisions must be marked `Status: Deprecated`, not removed
- Superseded decisions must reference the new decision ID
- AI agents must never override decisions marked as Active
- Decision IDs follow format SD-XXX (three-digit, zero-padded)

---

## AI Agent Behavior Rules

- AI agents MUST consult this document before proposing changes
- AI agents MUST flag conflicts with existing Active decisions
- AI agents MUST NOT recommend violating active constraints
- When a proposed change conflicts with a decision, the agent MUST:
  1. Identify the conflicting decision by ID
  2. Explain the conflict clearly
  3. Ask for human clarification before proceeding
- AI agents MAY suggest deprecating a decision, but humans MUST approve
- AI agents MUST NOT modify this document without explicit instruction

---

## System Stability Principles

These core beliefs guide LumiqAI's evolution:

### 1. Safety Over Speed

Production stability takes precedence over deployment velocity. Human approval gates exist to catch issues before they reach users. We accept slower iteration in exchange for fewer incidents.

### 2. Clarity Over Cleverness

Code and architecture should be understandable by new team members and AI agents. We prefer explicit patterns over implicit magic. Documentation is not optional.

### 3. Auditability Is Non-Negotiable

Every action that touches sensitive data must leave a trace. Compliance is built into the architecture, not bolted on afterward. We log before we act.

### 4. Explicit Scope, Always

Multi-tenant systems fail silently when scope is implicit. Every request declares its portfolio. Every query is filtered by tenant. We reject ambiguity.

### 5. Human-in-the-Loop Control

Automation amplifies human capability; it does not replace human judgment. AI agents propose; humans approve. The merge button requires a human click.

### 6. Defense in Depth

Security controls exist at multiple layers. If the BFF fails, RLS protects. If authentication fails, authorization blocks. We assume each layer might fail.

### 7. Honest Architecture

We document what exists, not what we wish existed. Roadmap items are labeled as such. Bank auditors review reality, not aspirations.

### 8. Append-Only History

Decisions are not erased; they are superseded. Audit logs are not deleted; they expire. We maintain institutional memory even when we change direction.

---

*Document Version: 1.0*
*Last Updated: 2025-01-28*
*Maintainer: System Architecture Team*
