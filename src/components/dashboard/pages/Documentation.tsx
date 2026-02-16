import React, { useState, useRef, useEffect } from 'react';
import { Book, ChevronRight, Search, Copy, Check, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Section {
  id: string;
  title: string;
  shortTitle?: string;
}

const SECTIONS: Section[] = [
  { id: 'platform-overview', title: '1. Platform Overview', shortTitle: 'Platform Overview' },
  { id: 'system-architecture', title: '2. System Architecture', shortTitle: 'Architecture' },
  { id: 'dashboard-capabilities', title: '3. Dashboard Capabilities', shortTitle: 'Dashboard' },
  { id: 'api-overview', title: '4. API Overview', shortTitle: 'API Overview' },
  { id: 'data-models', title: '5. Data Models & Concepts', shortTitle: 'Data Models' },
  { id: 'credit-risk-model', title: '6. Credit & Risk Intelligence Model', shortTitle: 'Credit & Risk' },
  { id: 'underwriting-model', title: '7. Underwriting Support Model', shortTitle: 'Underwriting' },
  { id: 'security-governance', title: '8. Security, Governance & Auditability', shortTitle: 'Security' },
  { id: 'demo-vs-production', title: '9. Demo vs Production Readiness', shortTitle: 'Readiness' },
  { id: 'known-limitations', title: '10. Known Limitations & TODOs', shortTitle: 'Limitations' },
  { id: 'appendix', title: '11. Appendix', shortTitle: 'Appendix' },
];

// ---------------------------------------------------------------------------
// Utility: Code block with copy
// ---------------------------------------------------------------------------

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({ title: 'Copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl border border-border bg-muted/50 overflow-hidden my-3">
      {language && (
        <div className="flex items-center justify-between px-4 py-1.5 bg-muted border-b border-border">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Utility: Table
// ---------------------------------------------------------------------------

const DocTable: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => (
  <div className="overflow-x-auto my-4 rounded-xl border border-border">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-muted/50">
          {headers.map((h, i) => (
            <th key={i} className="px-4 py-2.5 text-left font-semibold text-foreground border-b border-border whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
            {row.map((cell, ci) => (
              <td key={ci} className="px-4 py-2 text-muted-foreground">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ---------------------------------------------------------------------------
// Utility: Collapsible section
// ---------------------------------------------------------------------------

const Collapsible: React.FC<{ title: string; defaultOpen?: boolean; children: React.ReactNode }> = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl my-3 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <span className="font-medium text-sm text-foreground">{title}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 py-3 border-t border-border">{children}</div>}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

const SectionHeading: React.FC<{ id: string; title: string }> = ({ id, title }) => (
  <h2 id={id} className="text-xl font-bold text-foreground mt-10 mb-4 pb-2 border-b border-border scroll-mt-6">
    {title}
  </h2>
);

const SubHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-base font-semibold text-foreground mt-6 mb-2">{children}</h3>
);

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{children}</p>
);

const UL: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3 ml-2">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

const Note: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-sm text-blue-700 dark:text-blue-300 my-3">
    <span className="font-semibold shrink-0">Note:</span>
    <span>{children}</span>
  </div>
);

const Warning: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-sm text-amber-700 dark:text-amber-300 my-3">
    <span className="font-semibold shrink-0">Important:</span>
    <span>{children}</span>
  </div>
);

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------

const Documentation: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  // Filter sections by search
  const filteredSections = searchQuery
    ? SECTIONS.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : SECTIONS;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Left sidebar: Table of Contents */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 border-r border-border bg-card/50">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Book className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Documentation</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 h-12 text-xs rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {filteredSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeSection === section.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <ChevronRight className={`w-3 h-3 shrink-0 transition-transform ${activeSection === section.id ? 'rotate-90' : ''}`} />
              {section.title}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="text-[10px] text-muted-foreground">
            LumiqAI Platform Documentation<br />
            Version 1.0.0 &middot; February 2026
          </div>
        </div>
      </aside>

      {/* Right content */}
      <main ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">LumiqAI Enterprise Platform Documentation</h1>
            <P>
              Technical reference for the LumiqAI SMB Credit Intelligence Platform. This document covers system architecture,
              dashboard capabilities, API specifications, data models, security controls, and operational readiness.
            </P>
            <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
              <span className="px-2 py-0.5 rounded bg-muted border border-border">Version 1.0.0</span>
              <span className="px-2 py-0.5 rounded bg-muted border border-border">Last Updated: February 2026</span>
              <span className="px-2 py-0.5 rounded bg-muted border border-border">Classification: Internal</span>
            </div>
          </div>

          {/* ================================================================
              SECTION 1: PLATFORM OVERVIEW
              ================================================================ */}
          <SectionHeading id="platform-overview" title="1. Platform Overview" />

          <SubHeading>What is LumiqAI</SubHeading>
          <P>
            LumiqAI is a B2B credit intelligence platform designed for commercial banks and financial institutions.
            It provides unified SMB (Small and Medium Business) credit intelligence by aggregating data from
            multiple bureau sources, banking signals, and internal portfolio data into a single operational dashboard.
          </P>

          <SubHeading>Core Value Proposition</SubHeading>
          <UL items={[
            'Unified SMB credit intelligence from Experian, D&B, Equifax, FICO SBSS, and internal data',
            'Signal-based risk indicators (not composite scores) for bank-safe decision support',
            'Portfolio-level analytics with drill-down to individual business relationships',
            'Multi-tenant architecture with tenant-isolated data and audit controls',
            'Decision support only — LumiqAI does not replace bureau scores, credit committee judgment, or issue lending decisions',
          ]} />

          <SubHeading>Bank-First Positioning</SubHeading>
          <P>
            LumiqAI is purpose-built for regulated financial institutions. The platform uses signal-based intelligence
            rather than composite scoring to avoid conflicting with existing bureau score methodologies. All language,
            controls, and outputs are designed to align with how commercial banking teams operate: portfolio-first
            navigation, decision support (not automation), and comprehensive audit trails on every surface.
          </P>

          <SubHeading>Deployment Model</SubHeading>
          <P>
            The platform uses a three-tier architecture: a React single-page application (SPA) communicates with
            Backend-for-Frontend (BFF) edge functions hosted on Supabase, which in turn call a NestJS API backed by
            PostgreSQL. This separation was an intentional architectural decision (SD-001) to satisfy bank security
            review requirements — the frontend never accesses the database directly.
          </P>

          <SubHeading>Multi-Tenant Isolation</SubHeading>
          <P>
            Every data request is scoped to a tenant (derived from the authenticated user's organization) and a
            portfolio (selected in the UI). Row-Level Security (RLS) enforces tenant boundaries at the database level.
            A guard chain (AuthGuard, TenantGuard, PortfolioGuard) validates every request before it reaches the
            controller. Cross-tenant data access is architecturally impossible through the standard request path.
          </P>

          {/* ================================================================
              SECTION 2: SYSTEM ARCHITECTURE
              ================================================================ */}
          <SectionHeading id="system-architecture" title="2. System Architecture" />

          <SubHeading>Architecture Overview</SubHeading>
          <P>
            The system follows a layered architecture with clear separation of concerns. Each layer handles a specific
            responsibility and communicates through well-defined contracts.
          </P>

          <CodeBlock language="text" code={`Browser (React SPA)
    |
    v
BFF Layer (Supabase Edge Functions — Deno runtime)
    |
    v
API Layer (NestJS 10 + Prisma ORM)
    |
    v
Database (PostgreSQL with Row-Level Security)`} />

          <SubHeading>Frontend Layer</SubHeading>
          <DocTable
            headers={['Component', 'Technology', 'Notes']}
            rows={[
              ['Framework', 'React 19', 'Functional components with hooks'],
              ['Build Tool', 'Vite (rolldown-vite)', 'Fast HMR, ES module bundling'],
              ['Language', 'TypeScript (strict)', 'Full type coverage'],
              ['Styling', 'Tailwind CSS', 'Utility-first with design tokens'],
              ['Component Library', 'shadcn/ui (Radix primitives)', 'Accessible, composable'],
              ['State Management', 'React Context + useState', 'No external state library'],
              ['Routing', 'React Router v6', 'Tab-based within dashboard shell'],
              ['Authentication', 'Clerk (optional)', 'Fallback provider for no-auth mode'],
              ['Charts', 'Recharts', 'SVG-based, responsive'],
              ['Animations', 'Framer Motion', 'Page transitions, stagger effects'],
            ]}
          />

          <SubHeading>BFF Layer (Supabase Edge Functions)</SubHeading>
          <P>
            The BFF layer runs as Deno-based edge functions on Supabase infrastructure. Each edge function validates
            the JWT from the Authorization header, extracts the tenant context, enforces portfolio scoping, calls the
            NestJS API or Supabase database as needed, and wraps the response in a standardized envelope.
          </P>
          <UL items={[
            'Runtime: Deno (Supabase Edge Functions)',
            'Authentication: Validates Clerk JWT tokens from the Authorization header',
            'Tenant resolution: Extracts orgId from JWT, resolves to tenant record',
            'Response format: Standardized envelope with success, data, error, and meta fields',
            'Data lineage: Every response includes meta.dataSources and meta.lastUpdated',
          ]} />

          <SubHeading>API Layer (NestJS)</SubHeading>
          <DocTable
            headers={['Component', 'Technology', 'Notes']}
            rows={[
              ['Framework', 'NestJS 10', '524+ commits, 12 live modules'],
              ['ORM', 'Prisma', 'Type-safe database queries'],
              ['Database', 'PostgreSQL', 'RLS-enabled, multi-tenant'],
              ['Auth', 'Clerk JWT', 'orgId claim for tenant resolution'],
              ['API Style', 'REST', 'Versioned: /api/v1/dashboard/*'],
              ['Compiler', 'SWC', 'Fast TypeScript compilation'],
            ]}
          />

          <SubHeading>Guard Chain</SubHeading>
          <P>
            Every API request passes through a three-layer guard chain before reaching the controller:
          </P>
          <CodeBlock language="text" code={`Request → AuthGuard (Clerk JWT validation)
       → TenantGuard (orgId → tenantId resolution)
       → PortfolioGuard (portfolioId scoping)
       → Controller (business logic)
       → AuditInterceptor (logs mutations)
       → Response`} />
          <UL items={[
            'AuthGuard: Validates Clerk JWT. Returns 401 if missing or invalid.',
            'TenantGuard: Resolves orgId from JWT to a Tenant record. Returns 403 if not found. Auto-provisions TenantUser with viewer role on first access.',
            'PortfolioGuard: Validates the portfolioId query parameter against tenant ownership. Returns 422 if missing.',
            'AuditInterceptor: Automatically logs POST, PUT, DELETE operations to the audit_events table.',
          ]} />

          {/* ================================================================
              SECTION 3: DASHBOARD CAPABILITIES
              ================================================================ */}
          <SectionHeading id="dashboard-capabilities" title="3. Dashboard Capabilities" />

          <P>
            The dashboard is organized as a single-page application with a sidebar navigation. Each tab renders a
            full-page view within the dashboard shell. The active tab is tracked via URL query parameter
            (?tab=overview, ?tab=credit-intel, etc.) for deep-linking support.
          </P>

          <SubHeading>Navigation Tabs</SubHeading>
          <DocTable
            headers={['Tab', 'ID', 'Description']}
            rows={[
              ['Dashboard', 'overview', 'Portfolio-level KPIs: connected businesses, API usage, portfolio health, data freshness, recent activity, webhook events, integration health, and top businesses table.'],
              ['Credit Intelligence', 'credit-intel', 'Signal-based credit assessment for individual businesses. 7 signal categories with status/direction indicators, external bureau data, product readiness grid, and trajectory timeline.'],
              ['Underwriting', 'underwriting', 'Application review workspace with 5-state case management, policy checks, comparative benchmarks, decision support summaries, and analyst action workflow.'],
              ['Risk', 'risk', 'Executive risk summary, early warning signal (EWS) queue, risk concentration heatmaps, model governance, and audit controls.'],
              ['Customer', 'customer', 'Business engagement tracking with relationship health scores, interaction history, product penetration analysis, and portfolio-level engagement metrics.'],
              ['API Console', 'api-keys', 'Interactive API testing environment with key management, request builder, response viewer, and usage analytics.'],
              ['Partner Portal', 'partner-portal', 'Partner integration hub: credentials management, webhook configuration, API documentation, usage analytics, compliance status, and SLA monitoring.'],
              ['Analytics', 'analytics', '5 analysis modes — Performance, Risk, Growth, Conversion, Signals. Portfolio KPI tiles, risk indicator distribution, signal migration matrix, risk drivers, product penetration, cross-sell funnel, application funnel, feature importance, and signal drift monitoring.'],
              ['Products', 'products', 'API catalog with endpoint documentation, integration guides, SDK references, and product capability overview.'],
              ['Businesses', 'users', 'Business entity management: listing, search, filtering by segment/risk tier/geography, and entity detail views.'],
              ['Reports', 'reports', 'Report generation center with template library, custom report builder, configurable filters, async generation with polling, and download management.'],
              ['Settings', 'settings', 'Platform configuration: user management, role-based access control, SSO settings, API key management, data source configuration, model governance, and audit log viewer.'],
            ]}
          />

          <SubHeading>Environment Switching</SubHeading>
          <P>
            The dashboard supports two logical environments: Production and Sandbox. The environment toggle is
            available in the top header bar. In sandbox mode, all data operations use isolated test data and the
            API Console becomes the default landing tab. Environment state is managed through the EnvironmentContext.
          </P>

          <SubHeading>Key KPIs by Section</SubHeading>
          <Collapsible title="Portfolio Performance KPIs (Analytics)">
            <DocTable
              headers={['KPI', 'Description', 'Format']}
              rows={[
                ['Avg Risk Indicator', 'Exposure-weighted average across portfolio', 'Numeric (0-100)'],
                ['Indicator Momentum (90d)', 'Average change percentage over 90 days', 'Percentage (+/-)'],
                ['% Improving Clients', 'Clients with improvement >= 5 points in 90d', 'Percentage'],
                ['% Deteriorating Clients', 'Clients with decline >= 5 points in 90d', 'Percentage'],
                ['Portfolio Volatility', 'Standard deviation of changes across portfolio', 'Index'],
                ['Exp-Weighted Risk Index', 'Exposure-weighted aggregate risk metric', 'Index'],
              ]}
            />
          </Collapsible>
          <Collapsible title="Customer Relationship KPIs">
            <DocTable
              headers={['KPI', 'Description', 'Format']}
              rows={[
                ['Avg Relationship Health', 'Composite of credit posture, deposit growth, product usage, engagement, and risk flags', 'Numeric (0-100)'],
                ['Growing Relationships', 'Percentage showing positive health trajectory', 'Percentage'],
                ['At Risk Relationships', 'Percentage with declining health or negative signals', 'Percentage'],
                ['Cross-sell Penetration', 'Average products per business vs target wallet share', 'Percentage'],
              ]}
            />
          </Collapsible>
          <Collapsible title="Risk Intelligence KPIs">
            <DocTable
              headers={['KPI', 'Description', 'Format']}
              rows={[
                ['Expected Loss (EL)', 'Aggregate expected loss exposure across portfolio', 'Currency'],
                ['Delinquency Rate', 'Percentage of businesses with past-due obligations', 'Percentage'],
                ['Watch List Count', 'Number of businesses on active monitoring', 'Count'],
                ['Provision Coverage', 'Ratio of provisions to expected losses', 'Percentage'],
                ['Concentration Risk', 'HHI index across top exposure dimensions', 'Index'],
              ]}
            />
          </Collapsible>

          {/* ================================================================
              SECTION 4: API OVERVIEW
              ================================================================ */}
          <SectionHeading id="api-overview" title="4. API Overview" />

          <SubHeading>Base URL and Versioning</SubHeading>
          <CodeBlock language="text" code={`Base URL: https://api.lumiq.futeurcredx.com/api/v1
Prefix:   /api/v1/dashboard/
Content:  application/json (all requests and responses)
IDs:      UUID v4
Timestamps: ISO-8601 UTC (e.g., 2026-02-01T14:30:00.000Z)`} />

          <SubHeading>Authentication</SubHeading>
          <P>
            All /dashboard/* endpoints (except /dashboard/health) require a Clerk JWT with an orgId claim.
            The token is passed in the Authorization header.
          </P>
          <CodeBlock language="http" code={`Authorization: Bearer <clerk_jwt>
X-Portfolio-Id: <portfolio_uuid>`} />
          <UL items={[
            'The orgId claim is set when the user selects an organization in the Clerk frontend.',
            'TenantGuard resolves orgId to a Tenant record. 403 Forbidden if not found.',
            'Every data endpoint requires a portfolioId query parameter. 422 if omitted.',
            'Mutations (POST, PUT, DELETE) automatically create audit events via AuditInterceptor.',
          ]} />

          <SubHeading>Response Envelope</SubHeading>
          <P>Every response from /dashboard/* endpoints uses this exact envelope:</P>
          <CodeBlock language="jsonc" code={`// Success (single object)
{
  "success": true,
  "data": { /* T */ },
  "error": null,
  "meta": {
    "dataSources": ["prisma", "experian"],
    "lastUpdated": "2026-02-01T14:30:00.000Z"
  }
}

// Success (list with pagination)
{
  "success": true,
  "data": [ /* T[] */ ],
  "error": null,
  "meta": { "dataSources": ["prisma"], "lastUpdated": "..." },
  "pagination": { "page": 1, "pageSize": 25, "total": 142 }
}

// Error
{
  "success": false,
  "data": null,
  "error": "Portfolio ID is required",
  "meta": null
}`} />

          <SubHeading>Endpoint Reference</SubHeading>
          <P>
            The API exposes 19 endpoints grouped by domain. Pagination defaults to page=1, pageSize=25.
            Sorting accepts field names prefixed with - for descending (e.g., sort=-score).
          </P>

          <Collapsible title="Health & Portfolio Endpoints" defaultOpen>
            <DocTable
              headers={['Method', 'Path', 'Auth', 'Description']}
              rows={[
                ['GET', '/dashboard/health', 'None', 'System health check with DB ping, bureau status, uptime'],
                ['GET', '/dashboard/portfolios', 'JWT', 'List all portfolios for the current tenant'],
              ]}
            />
          </Collapsible>

          <Collapsible title="Business / Customer Endpoints">
            <DocTable
              headers={['Method', 'Path', 'Description']}
              rows={[
                ['GET', '/dashboard/customers', 'List SMB entities. Filters: segment, riskTier, state, search, sort, page, pageSize'],
                ['GET', '/dashboard/customers/:id', 'Full dossier with scores, applications, offers, owners. Triggers PII audit event.'],
              ]}
            />
          </Collapsible>

          <Collapsible title="Score / Credit Endpoints">
            <DocTable
              headers={['Method', 'Path', 'Description']}
              rows={[
                ['GET', '/dashboard/scores', 'List scores. Filters: source, smbEntityId, sort, page, pageSize'],
                ['POST', '/dashboard/scores/pull', 'Trigger bureau score pull. Body: { smbEntityId, source, consentId? }'],
                ['GET', '/dashboard/scores/distribution', 'Aggregate score distribution. Query: source (e.g., internal)'],
              ]}
            />
          </Collapsible>

          <Collapsible title="Offer Endpoints">
            <DocTable
              headers={['Method', 'Path', 'Description']}
              rows={[
                ['GET', '/dashboard/offers', 'List offers. Filters: status, smbEntityId, productType, sort, page, pageSize'],
                ['GET', '/dashboard/offers/:id', 'Get offer details with decision factors'],
              ]}
            />
          </Collapsible>

          <Collapsible title="Application Endpoints">
            <DocTable
              headers={['Method', 'Path', 'Description']}
              rows={[
                ['GET', '/dashboard/applications', 'List applications. Filters: status, smbEntityId, sort, page, pageSize'],
                ['PUT', '/dashboard/applications/:id/status', 'Update application status. Body: { status, decidedBy?, decisionData? }'],
              ]}
            />
          </Collapsible>

          <Collapsible title="Risk Endpoints">
            <DocTable
              headers={['Method', 'Path', 'Description']}
              rows={[
                ['GET', '/dashboard/risk/summary', 'Executive risk summary: exposure, distribution, top drivers, trends'],
                ['GET', '/dashboard/risk/ews', 'Early warning signal queue. Filters: severity, alertType, smbEntityId, sort, page, pageSize'],
                ['POST', '/dashboard/risk/ews/:id/acknowledge', 'Acknowledge an EWS alert. Body: { acknowledgedBy }'],
              ]}
            />
          </Collapsible>

          <Collapsible title="Batch, Analytics & Audit Endpoints">
            <DocTable
              headers={['Method', 'Path', 'Description']}
              rows={[
                ['POST', '/dashboard/batch/submit', 'Submit batch scoring job. Body: { smbEntityIds[], source }'],
                ['GET', '/dashboard/batch/:id/status', 'Check batch job status: queued, processing, completed, failed'],
                ['GET', '/dashboard/batch/:id/results', 'Get batch results after completion'],
                ['GET', '/dashboard/analytics/funnel', 'Application funnel metrics. Query: timeWindow (7d, 30d, 90d, 1y)'],
                ['GET', '/dashboard/audit-events', 'List audit events. Filters: action, resourceType, userId, startDate, endDate, sort, page, pageSize'],
              ]}
            />
          </Collapsible>

          <SubHeading>Rate Limiting</SubHeading>
          <P>
            API rate limits are enforced per API key and per tenant. Default limits are 1,000 requests per minute
            for production keys and 100 requests per minute for sandbox keys. Rate limit headers are included in
            every response: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.
          </P>

          {/* ================================================================
              SECTION 5: DATA MODELS & CONCEPTS
              ================================================================ */}
          <SectionHeading id="data-models" title="5. Data Models & Concepts" />

          <SubHeading>Core Entities</SubHeading>
          <P>
            The data model is organized around portfolios, businesses, and their associated financial data.
            All entities are tenant-scoped and portfolio-scoped at the database level via RLS policies.
          </P>

          <DocTable
            headers={['Entity', 'Description', 'Key Fields']}
            rows={[
              ['Portfolio', 'A logical grouping of businesses managed by a bank team', 'id, tenantId, name, productTypes[]'],
              ['SmbEntity (Business)', 'An SMB business relationship', 'id, tenantId, legalName, ein, naicsCode, industry, annualRevenue, riskTier, segment, relationshipStage'],
              ['CreditScore', 'A bureau or internal score for a business', 'id, smbEntityId, source, scoreType, score, riskClass, factors[], pulledAt'],
              ['PrequalOffer', 'A pre-qualification offer for a lending product', 'id, smbEntityId, portfolioId, productType, minAmount, maxAmount, estimatedRate, status'],
              ['Application', 'A loan or product application', 'id, smbEntityId, portfolioId, status, requestedAmount, applicationData, decidedAt, decidedBy'],
              ['ReportJob', 'An async report generation request', 'id, portfolioId, reportType, status, parameters, artifactUrl'],
              ['EWSAlert', 'An early warning signal for a business', 'id, smbEntityId, alertType, severity, message, triggeredAt, acknowledgedAt'],
              ['AuditEvent', 'An immutable audit log entry', 'id, tenantId, userId, action, resourceType, resourceId, details, ipAddress'],
              ['ApiKey', 'An API key for programmatic access', 'id, tenantId, name, keyPrefix, environment, scopes[], isActive'],
            ]}
          />

          <SubHeading>Entity Relationships</SubHeading>
          <CodeBlock language="text" code={`Tenant
  └── Portfolio (1:N)
        └── SmbEntity / Business (1:N)
              ├── CreditScore (1:N, from multiple bureau sources)
              ├── PrequalOffer (1:N)
              ├── Application (1:N)
              ├── EWSAlert (1:N)
              └── BusinessOwner (1:N)

Tenant
  └── AuditEvent (1:N, immutable log)
  └── ApiKey (1:N)`} />

          <SubHeading>Score Sources</SubHeading>
          <DocTable
            headers={['Source Key', 'Bureau / Source', 'Description']}
            rows={[
              ['dun_bradstreet', 'Dun & Bradstreet', 'PAYDEX score, D&B rating, trade credit data'],
              ['experian_biz', 'Experian Business', 'Intelliscore Plus, Financial Stability Risk Score'],
              ['equifax_biz', 'Equifax Business', 'Business credit report, payment index'],
              ['fico_sbss', 'FICO SBSS', 'Small Business Scoring Service pre-screen score'],
              ['internal', 'LumiqAI Signal Engine', 'Internal risk indicator based on aggregated signals'],
            ]}
          />

          <SubHeading>Risk Tier Classification</SubHeading>
          <DocTable
            headers={['Tier', 'Description', 'Typical Characteristics']}
            rows={[
              ['low', 'Low risk', 'Strong payment history, stable revenue, adequate coverage ratios'],
              ['moderate', 'Moderate risk', 'Generally positive signals with some areas requiring attention'],
              ['elevated', 'Elevated risk', 'Mixed signals, possible deterioration in one or more areas'],
              ['high', 'High risk', 'Multiple negative signals, active monitoring required'],
              ['critical', 'Critical risk', 'Severe deterioration, immediate intervention needed'],
            ]}
          />

          <SubHeading>Signal-Based Model</SubHeading>
          <P>
            LumiqAI uses a signal-based intelligence model rather than a single composite score. Each business
            is assessed across 7 signal categories, each with an independent status and direction indicator.
            See Section 6 for full details.
          </P>

          {/* ================================================================
              SECTION 6: CREDIT & RISK INTELLIGENCE MODEL
              ================================================================ */}
          <SectionHeading id="credit-risk-model" title="6. Credit & Risk Intelligence Model" />

          <Warning>
            LumiqAI provides decision-support signals only. It does not replace bureau scores, credit committee
            judgment, or issue lending decisions.
          </Warning>

          <SubHeading>Signal-Based Approach</SubHeading>
          <P>
            Instead of producing a single composite score that could conflict with existing bureau methodologies,
            LumiqAI provides 7 independent signal categories. Each signal has a status (the current state) and a
            direction (the trajectory), allowing credit analysts to assess both position and momentum independently.
          </P>

          <SubHeading>Signal Categories</SubHeading>
          <DocTable
            headers={['#', 'Signal Category', 'Measures', 'Example Detail']}
            rows={[
              ['1', 'Payment Behavior', 'Trade line payment patterns, delinquency history', '98.2% on-time across 12 trade lines'],
              ['2', 'Revenue Trajectory', 'Deposit activity trends, revenue growth patterns', '+8.3% QoQ from deposit activity'],
              ['3', 'Debt Service Coverage', 'DSCR ratio relative to policy minimums', 'DSCR 1.8x vs 1.25x policy minimum'],
              ['4', 'Trade Credit Standing', 'D&B PAYDEX, derogatory filings, trade references', 'D&B PAYDEX 78, no derogatory filings'],
              ['5', 'Cash Flow Consistency', 'Cash flow coefficient of variation, runway', 'CV 0.12, 18-month runway'],
              ['6', 'Collateral Position', 'Loan-to-value ratios on secured facilities', 'LTV 62% on primary secured facility'],
              ['7', 'Owner Credit Profile', 'Personal guarantor credit health', 'Personal guarantor FICO declined 15pts'],
            ]}
          />

          <SubHeading>Status System</SubHeading>
          <DocTable
            headers={['Status', 'Meaning', 'Visual Treatment']}
            rows={[
              ['Strong', 'Signal indicates favorable conditions', 'Green badge (emerald-50 background, emerald-700 text)'],
              ['Stable', 'Signal is within acceptable bounds', 'Amber badge (amber-50 background, amber-700 text)'],
              ['Weak', 'Signal indicates conditions requiring attention', 'Red badge (red-50 background, red-700 text)'],
            ]}
          />

          <SubHeading>Direction System</SubHeading>
          <DocTable
            headers={['Direction', 'Meaning', 'Visual Treatment']}
            rows={[
              ['Improving', 'Signal trajectory is positive', 'Green arrow up (emerald-600)'],
              ['Stable', 'Signal trajectory is flat', 'Amber dash (amber-600)'],
              ['Worsening', 'Signal trajectory is negative', 'Red arrow down (red-600)'],
            ]}
          />

          <SubHeading>External Bureau Indicators</SubHeading>
          <P>
            In addition to LumiqAI's signal categories, the Credit Intelligence tab displays external bureau
            indicators sourced directly from credit bureaus. These are clearly labeled as "Bureau-Reported — Not
            LumiqAI Generated" to maintain transparency.
          </P>
          <DocTable
            headers={['Indicator', 'Source', 'Format', 'Interpretation']}
            rows={[
              ['D&B PAYDEX', 'Dun & Bradstreet', '0-100 scale', 'Payment performance vs terms. 78 = above median for industry.'],
              ['Experian Intelliscore', 'Experian Business', 'Risk band', 'Low, Low-Medium, Medium, Medium-High, High risk classification.'],
              ['FICO SBSS', 'FICO', 'Pre-screen threshold', 'Binary eligibility indicator. Above 140 = pre-screen eligible.'],
            ]}
          />

          <SubHeading>Product Readiness</SubHeading>
          <P>
            For each business, LumiqAI categorizes readiness for lending products using three levels. These are
            categorical assessments, not numeric scores.
          </P>
          <DocTable
            headers={['Readiness', 'Meaning', 'Visual']}
            rows={[
              ['Likely', 'Signals generally support eligibility for this product', 'Green badge'],
              ['Borderline', 'Mixed signals; additional review or information may be needed', 'Amber badge'],
              ['Unlikely', 'One or more signals indicate this product is not suitable at this time', 'Red badge'],
            ]}
          />

          <SubHeading>Trust Signals</SubHeading>
          <P>
            Every data surface in the credit intelligence model includes trust signals:
          </P>
          <UL items={[
            'Data source badges indicating where each signal originates (e.g., "Experian Business", "Deposit Analysis")',
            'Last-updated timestamps on every KPI and signal card',
            'Data lineage footer on every page showing source systems and refresh times',
            'Disclaimer banner: "LumiqAI provides decision-support signals only"',
            'Coverage percentage indicating completeness of available data',
          ]} />

          {/* ================================================================
              SECTION 7: UNDERWRITING SUPPORT MODEL
              ================================================================ */}
          <SectionHeading id="underwriting-model" title="7. Underwriting Support Model" />

          <Warning>
            The underwriting workspace provides decision support. All actions are recommendations to be reviewed
            by qualified credit analysts. LumiqAI does not make or execute lending decisions.
          </Warning>

          <SubHeading>Case Workflow (5-State Model)</SubHeading>
          <P>
            Each application progresses through a defined 5-state workflow. Status transitions are tracked with
            analyst identity, timestamps, and rationale in the audit log.
          </P>
          <DocTable
            headers={['State', 'Description', 'Next States']}
            rows={[
              ['Pending Review', 'Application received, awaiting assignment to analyst', 'In Review'],
              ['In Review', 'Analyst is actively reviewing signals, policy checks, and benchmarks', 'Conditional Approval, Approved, Declined'],
              ['Conditional Approval', 'Approved pending satisfaction of specified conditions', 'Approved, Declined'],
              ['Approved', 'Application recommended for approval (terminal state)', '(none)'],
              ['Declined', 'Application recommended for decline (terminal state)', '(none)'],
            ]}
          />

          <SubHeading>Policy & Eligibility Checks</SubHeading>
          <P>
            The underwriting workspace includes 8 automated policy checks that validate the application against
            the institution's lending policy. Each check returns Pass, Review, or Fail.
          </P>
          <DocTable
            headers={['Check', 'Policy Threshold', 'Source']}
            rows={[
              ['Minimum Time in Business', '>= 2 years', 'Business Registration Records'],
              ['Revenue Floor', '>= $250K annual', 'Deposit Activity Analysis'],
              ['Owner FICO Floor', '>= 650', 'Personal Bureau Pull'],
              ['Industry Exclusion', 'Not in excluded SIC codes', 'NAICS/SIC Classification'],
              ['Collateral Coverage', '>= 1.0x LTV', 'Appraisal / Collateral Records'],
              ['UCC Filing Status', 'No conflicting liens', 'UCC Search Results'],
              ['OFAC/BSA Screening', 'Clear', 'Compliance Screening Service'],
              ['Debt-to-Income Ratio', '<= 43%', 'Financial Statements + Bureau Data'],
            ]}
          />

          <SubHeading>Decision Support Workspace</SubHeading>
          <P>
            The decision workspace provides comparative benchmarks, signal summaries, and structured action buttons.
            All elements use careful language — "Based on available signals, this application presents..." rather
            than "We recommend..." to maintain the decision-support positioning.
          </P>
          <UL items={[
            'Comparative Benchmarks: Application metrics vs portfolio peers (same segment, product) and industry peers (same SIC code)',
            'Signal Summary: Aggregated view of the 7 signal categories for the applicant business',
            'Supporting Factors: List of signals that support a favorable assessment',
            'Areas Requiring Attention: List of signals that warrant additional review',
            'Suggested Next Steps: 2-3 actionable recommendations for the analyst',
          ]} />

          <SubHeading>Analyst Actions</SubHeading>
          <P>
            All actions are recommendations, not decisions. Each action requires the analyst to provide a written
            rationale before submission. Every action triggers an audit event.
          </P>
          <DocTable
            headers={['Action', 'Description', 'Requires Rationale']}
            rows={[
              ['Recommend for Approval', 'Analyst recommends this application proceed to approval', 'Yes'],
              ['Request Additional Information', 'Analyst needs more data before making a recommendation', 'Yes'],
              ['Flag for Committee Review', 'Application should be escalated to the credit committee', 'Yes'],
              ['Recommend Decline', 'Analyst recommends declining this application', 'Yes'],
            ]}
          />

          {/* ================================================================
              SECTION 8: SECURITY, GOVERNANCE & AUDITABILITY
              ================================================================ */}
          <SectionHeading id="security-governance" title="8. Security, Governance & Auditability" />

          <SubHeading>Row-Level Security (RLS)</SubHeading>
          <P>
            PostgreSQL RLS policies enforce tenant isolation at the database level. Every table containing
            business data includes a tenantId column with an RLS policy that restricts access to rows
            matching the authenticated user's tenant. This is a defense-in-depth control — even if application
            code contains a bug, RLS prevents cross-tenant data leakage.
          </P>

          <SubHeading>Tenant Isolation via Guard Chain</SubHeading>
          <UL items={[
            'AuthGuard validates the Clerk JWT and extracts the orgId claim',
            'TenantGuard resolves orgId to a Tenant record and injects tenantId into the request',
            'PortfolioGuard verifies the requested portfolioId belongs to the authenticated tenant',
            'All database queries are scoped with WHERE tenantId = :tenantId AND portfolioId = :portfolioId',
            'Cross-tenant access is architecturally impossible through the standard request path',
          ]} />

          <SubHeading>Dual-Layer Auditing</SubHeading>
          <P>
            The platform implements dual-layer auditing to capture both server-side and client-side actions:
          </P>
          <DocTable
            headers={['Layer', 'Mechanism', 'Captures']}
            rows={[
              ['Server-side', 'AuditInterceptor (NestJS)', 'All POST, PUT, DELETE operations. Records: userId, action, resourceType, resourceId, IP, timestamp'],
              ['Client-side', 'useAuditEmit hook (React)', 'Analyst actions in the underwriting workspace, dossier views, report downloads. Sends event to /audit-events endpoint.'],
            ]}
          />
          <P>
            Audit events are immutable — once written, they cannot be modified or deleted. The audit log is
            accessible in Settings with search, filtering by action type, and CSV export capability.
          </P>

          <SubHeading>PII Handling</SubHeading>
          <UL items={[
            'Customer dossier access (GET /customers/:id) automatically triggers a PII audit event',
            'PII fields (SSN, EIN, owner personal data) are masked in the UI by default',
            'Unmasking requires explicit user action and generates an additional audit entry',
            'Data export operations are logged with the exporting user and scope of data',
          ]} />

          <SubHeading>Compliance Integration Points</SubHeading>
          <DocTable
            headers={['Control', 'Implementation', 'Status']}
            rows={[
              ['OFAC Screening', 'Compliance screening service check during underwriting policy checks', 'Integration point defined, requires production credentials'],
              ['BSA/AML', 'Screening integrated into application workflow', 'Integration point defined'],
              ['SR 11-7 Model Risk', 'Model governance panel with version tracking, validation dates, performance metrics', 'UI complete, model registry needs production data'],
              ['FFIEC Access Controls', 'Role-based access with audit trail, IP allowlisting support', 'RBAC implemented, IP allowlisting needs production endpoint'],
            ]}
          />

          <SubHeading>Authentication & Authorization</SubHeading>
          <UL items={[
            'Authentication: Clerk JWT with organization-scoped tokens',
            'Authorization: Role-based access control (viewer, analyst, manager, admin)',
            'Session management: Clerk-managed sessions with configurable timeout',
            'API keys: Scoped per-environment (sandbox/production) with optional expiration',
            'SSO: SAML/OIDC integration point available through Clerk enterprise features',
          ]} />

          <SubHeading>Environment Variable Security</SubHeading>
          <P>
            Secrets are managed through Supabase and never committed to source control. Frontend variables use the
            VITE_ prefix and are limited to public keys (Supabase anon key, Clerk publishable key). Service role
            keys and API secrets are only accessible to edge functions and the API server.
          </P>

          {/* ================================================================
              SECTION 9: DEMO VS PRODUCTION READINESS
              ================================================================ */}
          <SectionHeading id="demo-vs-production" title="9. Demo vs Production Readiness" />

          <SubHeading>Current State: Honest MVP</SubHeading>
          <P>
            The platform follows an "Honest MVP" approach (documented as System Decision SD-005). The frontend
            is pilot-ready with full UI rendering, navigation, and interactive features. The data layer uses a
            graceful fallback pattern — every BFF call attempts to fetch live data first, and falls back to
            realistic demo data if the backend is unavailable or returns an error.
          </P>

          <SubHeading>What is Live</SubHeading>
          <UL items={[
            'Full UI rendering across all 12 dashboard tabs',
            'Client-side navigation with deep-link support (URL-based tab tracking)',
            'Environment switching between production and sandbox modes',
            'BFF routing layer (Supabase Edge Functions) deployed and functional',
            'Core CRUD endpoints: customers, scores, offers, applications, reports, risk, API keys, audit events',
            'Authentication flow with Clerk (JWT-based, org-scoped)',
            'Mock data fallback for all data surfaces (withFallback utility)',
            'Interactive API Console for testing endpoints',
            'Report generation with async polling',
            'Signal-based Credit Intelligence with full signal taxonomy',
            'Underwriting workspace with case management and policy checks',
          ]} />

          <SubHeading>What is Mock / Stub</SubHeading>
          <DocTable
            headers={['Component', 'Current State', 'Production Requirement']}
            rows={[
              ['Bureau integrations', 'Simulated responses', 'Experian, D&B, Equifax API credentials and contracts'],
              ['Score pull (POST /scores/pull)', 'Returns mock score data', 'Live bureau API integration'],
              ['Webhook delivery', 'Mock event log', 'Webhook delivery infrastructure with retry logic'],
              ['Batch scoring', 'Endpoint defined, stub implementation', 'Queue-based processing with progress tracking'],
              ['Real-time alerts', 'Polling-based', 'WebSocket or SSE for push notifications'],
              ['Partner portal credentials', 'Mock data in UI', 'Partner credential management endpoints'],
              ['Partner usage analytics', 'Mock charts', 'Usage tracking and aggregation pipeline'],
              ['Settings: User management', 'Mock user list', 'Clerk user management API integration'],
              ['Settings: SSO configuration', 'UI only', 'SAML/OIDC provider configuration endpoints'],
              ['Settings: IP allowlisting', 'UI only', 'Network policy enforcement endpoints'],
              ['Data export (CSV/PDF)', 'Client-side file generation', 'Server-side export with proper formatting'],
            ]}
          />

          <SubHeading>The withFallback Pattern</SubHeading>
          <P>
            The frontend uses a consistent pattern for data fetching: every BFF call is wrapped in a withFallback()
            utility that attempts the live call, catches errors, and returns pre-configured demo data with a source
            indicator. This allows the dashboard to function identically in demo mode and production mode — the only
            difference is the data source.
          </P>
          <CodeBlock language="typescript" code={`const result = await withFallback(
  () => bffService.getData(portfolioId),  // Live data attempt
  mockData,                                 // Fallback demo data
  'Component Name',                         // Logging label
);
// result.data — the data (live or mock)
// result.source — 'live' | 'fallback'`} />

          <SubHeading>Path to Production</SubHeading>
          <UL items={[
            '1. API endpoint completion: Implement the ~20 endpoints listed in Known Limitations (Section 10)',
            '2. Bureau API credentials: Obtain and configure Experian, D&B, Equifax, FICO SBSS production keys',
            '3. Data pipeline: Set up ETL processes for scheduled bureau data pulls and refresh cycles',
            '4. Webhook infrastructure: Deploy reliable webhook delivery with retry, dead-letter, and monitoring',
            '5. Production secrets: Configure all environment variables listed in the Appendix',
            '6. Load testing: Validate performance under expected production load',
            '7. Security review: Complete penetration testing and bank security questionnaire',
            '8. Compliance sign-off: Model validation (SR 11-7), access controls (FFIEC), data handling (GLBA)',
          ]} />

          {/* ================================================================
              SECTION 10: KNOWN LIMITATIONS & TODOS
              ================================================================ */}
          <SectionHeading id="known-limitations" title="10. Known Limitations & TODOs" />

          <SubHeading>Unimplemented API Endpoints</SubHeading>
          <P>
            The following endpoint groups are defined in the UI but currently use mock data.
            They require backend implementation before production use.
          </P>

          <Collapsible title="Partner Portal Endpoints (~15 endpoints)" defaultOpen>
            <DocTable
              headers={['Group', 'Count', 'Priority']}
              rows={[
                ['Credentials management (CRUD + rotate)', '5', 'High'],
                ['Webhook management (CRUD + test + history)', '6', 'High'],
                ['Usage analytics (summary, per-endpoint, quotas, trends)', '4', 'High'],
                ['Compliance & testing (status, results, run, certifications)', '4', 'Medium'],
                ['SLA & support (metrics, incidents, tickets)', '4', 'Medium-Low'],
              ]}
            />
          </Collapsible>

          <Collapsible title="Settings Endpoints (~12 endpoints)">
            <DocTable
              headers={['Group', 'Count', 'Priority']}
              rows={[
                ['User management (list, invite, update, deactivate)', '4', 'High'],
                ['Roles & permissions (get matrix, update role)', '2', 'High'],
                ['SSO configuration (get, update)', '2', 'Medium'],
                ['OAuth client management (list, create)', '2', 'Medium'],
                ['IP allowlisting (list, add, remove)', '3', 'Medium'],
                ['Data source management (list, sync)', '2', 'High'],
                ['Model version management (list)', '1', 'Low'],
              ]}
            />
          </Collapsible>

          <SubHeading>Known API Stubs</SubHeading>
          <DocTable
            headers={['Stub', 'Current Behavior', 'Required Implementation']}
            rows={[
              ['Webhook delivery', 'Events logged to database only', 'HTTP delivery with retry (3x exponential backoff), dead-letter queue, signature verification'],
              ['Batch scoring', 'Endpoint accepts request, returns job ID', 'Queue-based processing (Bull/BullMQ), progress tracking, result aggregation'],
              ['Real-time alerts', 'Client polls /risk/ews periodically', 'WebSocket or SSE push for immediate alert delivery'],
              ['Data export', 'Client generates files in browser', 'Server-side PDF/CSV generation with proper formatting and streaming download'],
            ]}
          />

          <SubHeading>Missing External Integrations</SubHeading>
          <DocTable
            headers={['Integration', 'Status', 'Requirement']}
            rows={[
              ['Experian Business API', 'Credentials not configured', 'Production API key + secret from Experian contract'],
              ['D&B Direct+ API', 'Credentials not configured', 'Production API token from D&B partnership'],
              ['Equifax Business', 'Credentials not configured', 'Production client ID + API key'],
              ['FICO SBSS', 'Credentials not configured', 'Production access through FICO partnership'],
              ['Plaid', 'Credentials not configured', 'Client ID + secret for bank data aggregation'],
              ['Email (SMTP)', 'Not configured', 'SMTP host, credentials for notification delivery'],
              ['Slack', 'Not configured', 'Webhook URL for alerting integration'],
            ]}
          />

          <SubHeading>Frontend Limitations</SubHeading>
          <UL items={[
            'No real-time WebSocket or SSE updates — all data fetching is request-based or polling-based',
            'No offline mode or service worker caching',
            'Data export generates files client-side (not server-side rendering)',
            'Chart interactions limited to hover tooltips (no drill-through to filtered views)',
            'No internationalization (i18n) — English only',
            'Mobile layout is responsive but not optimized for touch-first workflows',
          ]} />

          <SubHeading>Data Pipeline Gaps</SubHeading>
          <UL items={[
            'No ETL pipeline for scheduled bureau data pulls',
            'No automated data quality checks or reconciliation',
            'No scheduled report generation (only on-demand)',
            'No data retention or archival policies implemented',
            'No CDC (Change Data Capture) for real-time data synchronization',
          ]} />

          {/* ================================================================
              SECTION 11: APPENDIX
              ================================================================ */}
          <SectionHeading id="appendix" title="11. Appendix" />

          {/* A: Environment Variables */}
          <SubHeading>A. Environment Variables</SubHeading>

          <Collapsible title="Frontend Variables (VITE_*)" defaultOpen>
            <DocTable
              headers={['Variable', 'Description', 'Required']}
              rows={[
                ['VITE_SUPABASE_URL', 'Supabase project URL', 'Yes (auto-provisioned)'],
                ['VITE_SUPABASE_PUBLISHABLE_KEY', 'Supabase anon key (public)', 'Yes (auto-provisioned)'],
                ['VITE_SUPABASE_PROJECT_ID', 'Supabase project identifier', 'Yes (auto-provisioned)'],
                ['VITE_CLERK_PUBLISHABLE_KEY', 'Clerk frontend publishable key', 'Yes (if using Clerk auth)'],
                ['VITE_USE_MOCK_AUTH', 'Enable mock auth mode (localStorage-based)', 'Optional (default: false)'],
              ]}
            />
          </Collapsible>

          <Collapsible title="Edge Function Variables">
            <DocTable
              headers={['Variable', 'Description', 'Access']}
              rows={[
                ['SUPABASE_URL', 'Project URL (auto-injected)', 'Deno.env.get()'],
                ['SUPABASE_ANON_KEY', 'Anon key (auto-injected)', 'Deno.env.get()'],
                ['SUPABASE_SERVICE_ROLE_KEY', 'Privileged key (auto-injected)', 'Deno.env.get()'],
              ]}
            />
          </Collapsible>

          <Collapsible title="Production Secrets (Future)">
            <DocTable
              headers={['Secret', 'Purpose', 'Required For']}
              rows={[
                ['EXPERIAN_API_KEY', 'Experian Business API key', 'Bureau score pulls'],
                ['EXPERIAN_API_SECRET', 'Experian authentication', 'Bureau score pulls'],
                ['EQUIFAX_API_KEY', 'Equifax API access', 'Bureau score pulls'],
                ['EQUIFAX_CLIENT_ID', 'Equifax OAuth', 'Bureau score pulls'],
                ['DNB_API_TOKEN', 'D&B Direct+ API token', 'Bureau score pulls'],
                ['PLAID_CLIENT_ID', 'Plaid integration', 'Bank data aggregation'],
                ['PLAID_SECRET', 'Plaid authentication', 'Bank data aggregation'],
                ['SMTP_HOST / SMTP_USER / SMTP_PASSWORD', 'Email server', 'Notifications'],
                ['SLACK_WEBHOOK_URL', 'Slack notifications', 'Alerting'],
              ]}
            />
          </Collapsible>

          {/* B: Terminology Glossary */}
          <SubHeading>B. Bank Terminology Glossary</SubHeading>
          <P>
            The platform enforces a consistent terminology map to ensure all language is bank-appropriate.
            The following translations are applied throughout the dashboard.
          </P>
          <DocTable
            headers={['Internal / Generic Term', 'Bank-Safe Term Used in UI']}
            rows={[
              ['Customer', 'Business'],
              ['Client', 'Relationship'],
              ['Score', 'Risk Indicator'],
              ['Alert', 'Early Warning Signal'],
              ['Approve', 'Recommend for Approval'],
              ['Decline', 'Flag for Review'],
              ['Reject', 'Flag for Committee Review'],
              ['Auto-approve', 'Pre-Qualification Eligible'],
              ['AI Recommendation', 'Decision Support Signal'],
              ['Prediction', 'Indicator'],
              ['Confidence', 'Signal Strength'],
              ['Model', 'Analytical Framework'],
            ]}
          />

          {/* C: Error Codes */}
          <SubHeading>C. Error Codes and Recovery</SubHeading>
          <DocTable
            headers={['HTTP Status', 'Error Type', 'Description', 'Recovery Action']}
            rows={[
              ['401', 'UNAUTHORIZED', 'JWT missing, expired, or invalid', 'Re-authenticate via Clerk login'],
              ['403', 'FORBIDDEN', 'Tenant not found for orgId, or insufficient permissions', 'Verify organization membership in Clerk'],
              ['422', 'VALIDATION_ERROR', 'Missing required parameter (usually portfolioId)', 'Select a portfolio in the UI'],
              ['429', 'RATE_LIMITED', 'Too many requests', 'Wait for X-RateLimit-Reset and retry'],
              ['500', 'INTERNAL_ERROR', 'Unexpected server error', 'Retry; if persistent, check /dashboard/health'],
              ['503', 'SERVICE_UNAVAILABLE', 'Database or upstream service unreachable', 'Check system health; wait for recovery'],
            ]}
          />

          <P>
            The frontend displays errors using the BffErrorBoundary component for page-level errors and toast
            notifications for inline errors. All error states include a "Try Again" option where applicable.
          </P>

          {/* D: API Quick Reference */}
          <SubHeading>D. API Endpoint Quick Reference</SubHeading>
          <DocTable
            headers={['Method', 'Endpoint', 'Status']}
            rows={[
              ['GET', '/dashboard/health', 'Live'],
              ['GET', '/dashboard/portfolios', 'Live'],
              ['GET', '/dashboard/customers', 'Live'],
              ['GET', '/dashboard/customers/:id', 'Live'],
              ['GET', '/dashboard/scores', 'Live'],
              ['POST', '/dashboard/scores/pull', 'Live (mock response)'],
              ['GET', '/dashboard/scores/distribution', 'Live'],
              ['GET', '/dashboard/offers', 'Live'],
              ['GET', '/dashboard/offers/:id', 'Live'],
              ['GET', '/dashboard/applications', 'Live'],
              ['PUT', '/dashboard/applications/:id/status', 'Live'],
              ['GET', '/dashboard/risk/summary', 'Live'],
              ['GET', '/dashboard/risk/ews', 'Live'],
              ['POST', '/dashboard/risk/ews/:id/acknowledge', 'Live'],
              ['POST', '/dashboard/batch/submit', 'Stub'],
              ['GET', '/dashboard/batch/:id/status', 'Stub'],
              ['GET', '/dashboard/batch/:id/results', 'Stub'],
              ['GET', '/dashboard/analytics/funnel', 'Live'],
              ['GET', '/dashboard/audit-events', 'Live'],
            ]}
          />

          <Note>
            For full endpoint specifications including request/response schemas, query parameters, and example
            payloads, refer to the API Contract document (DASHBOARD_API_CONTRACT.md) in the API repository.
          </Note>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-border">
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>LumiqAI Platform Documentation v1.0.0</span>
              <span className="hidden sm:inline">|</span>
              <span>February 2026</span>
              <span className="hidden sm:inline">|</span>
              <span>Classification: Internal</span>
              <span className="hidden sm:inline">|</span>
              <span>LumiqAI provides decision-support signals only.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documentation;
