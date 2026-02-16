// =============================================================================
// Lumiq Developer Docs — Changelog
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ChangeType = 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';

export interface ChangelogEntry {
  type: ChangeType;
  description: string;
  endpoints?: string[];
}

export interface ChangelogRelease {
  version: string;
  date: string;
  title: string;
  summary: string;
  entries: ChangelogEntry[];
}

// ---------------------------------------------------------------------------
// Badge metadata for rendering
// ---------------------------------------------------------------------------

export const changeTypeMeta: Record<ChangeType, { label: string; color: string; icon: string }> = {
  added: { label: 'Added', color: 'emerald', icon: 'plus-circle' },
  changed: { label: 'Changed', color: 'blue', icon: 'refresh-cw' },
  deprecated: { label: 'Deprecated', color: 'amber', icon: 'alert-triangle' },
  removed: { label: 'Removed', color: 'red', icon: 'minus-circle' },
  fixed: { label: 'Fixed', color: 'purple', icon: 'wrench' },
  security: { label: 'Security', color: 'rose', icon: 'shield' },
};

// ---------------------------------------------------------------------------
// Releases
// ---------------------------------------------------------------------------

export const releases: ChangelogRelease[] = [
  {
    version: '1.1.0',
    date: '2026-02-16',
    title: 'Security, Compliance & API Accuracy Release',
    summary:
      'Major security hardening across all platform surfaces, expanded API documentation with 34 new endpoints, improved credit score accuracy with dual-scale detection, and enhanced tenant data isolation.',
    entries: [
      {
        type: 'security',
        description:
          'Enhanced tenant data isolation with ownership verification on all tenant management endpoints. All CRUD operations now validate that the requesting user has authorized access to the specified tenant.',
        endpoints: ['tenants'],
      },
      {
        type: 'security',
        description:
          'Replaced all non-cryptographic random number generation with cryptographically secure alternatives across the platform, strengthening credential generation and session management.',
      },
      {
        type: 'security',
        description:
          'Added comprehensive security headers (Content-Security-Policy, X-Frame-Options, Referrer-Policy, Permissions-Policy) across all customer-facing web properties.',
      },
      {
        type: 'fixed',
        description:
          'Improved credit score classification accuracy with dual-scale detection. The API now correctly distinguishes between LUMIQ proprietary scores (0\u2013100) and traditional FICO scores (300\u2013850), ensuring accurate risk class assignments.',
        endpoints: ['dashboard'],
      },
      {
        type: 'fixed',
        description:
          'Removed inaccurate regulatory compliance claims from the registration flow. All compliance references now reflect actual certifications and capabilities.',
      },
      {
        type: 'added',
        description:
          'Expanded API documentation from 20 to 54 fully documented endpoints, covering compliance reporting, fair lending analysis, batch processing status, risk concentration, and campaign management.',
        endpoints: ['compliance', 'reports', 'products', 'campaigns', 'settings', 'notifications'],
      },
      {
        type: 'added',
        description:
          'Published SEO-optimized sitemap and search engine directives for the developer documentation portal, improving discoverability for integration engineers.',
      },
      {
        type: 'changed',
        description:
          'Upgraded platform infrastructure to improve API reliability, including persistent memory management, automated process recovery, and a permanent static IP address for stable integrations.',
      },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-02-15',
    title: 'Initial Public Release',
    summary:
      'First public release of the Lumiq SMB Credit Intelligence API. Includes 22 endpoints across 11 domain areas, multi-tenant sandbox with 4 bank tenants, and full developer documentation.',
    entries: [
      // Added
      {
        type: 'added',
        description:
          'Health check endpoint (GET /dashboard/health) for monitoring API connectivity and version.',
        endpoints: ['health-check'],
      },
      {
        type: 'added',
        description:
          'Portfolio management endpoints: list portfolios and get portfolio summary with KPIs.',
        endpoints: ['list-portfolios', 'portfolio-summary'],
      },
      {
        type: 'added',
        description:
          'Business (customer) endpoints: paginated list with filtering by industry, risk tier, and search; detailed single-business view with credit history and eligible products.',
        endpoints: ['list-customers', 'get-customer'],
      },
      {
        type: 'added',
        description:
          'Credit score endpoints: paginated score list and portfolio-wide score distribution histogram with mean and median.',
        endpoints: ['list-scores', 'score-distribution'],
      },
      {
        type: 'added',
        description:
          'Risk monitoring endpoints: portfolio risk summary with delinquency, default, and concentration metrics; paginated risk events and alerts with severity filtering.',
        endpoints: ['risk-summary', 'risk-events'],
      },
      {
        type: 'added',
        description:
          'Underwriting endpoints: list applications with status filtering and list active offers.',
        endpoints: ['list-applications', 'list-offers'],
      },
      {
        type: 'added',
        description:
          'Analytics endpoints: conversion funnel, KPIs, and conversion trend over configurable time periods.',
        endpoints: ['analytics-funnel', 'kpis', 'conversion-trend'],
      },
      {
        type: 'added',
        description:
          'API key management: list, create, and revoke API keys. Full key value shown only at creation time.',
        endpoints: ['list-api-keys', 'create-api-key', 'delete-api-key'],
      },
      {
        type: 'added',
        description:
          'Report generation: list existing reports and trigger asynchronous report generation in PDF or CSV format.',
        endpoints: ['list-reports', 'create-report'],
      },
      {
        type: 'added',
        description:
          'Audit trail endpoint: paginated audit events with action and date range filtering for compliance.',
        endpoints: ['list-audit-events'],
      },
      {
        type: 'added',
        description:
          'Webhook subscriptions: create and list webhook endpoints with HMAC-SHA256 signature verification.',
        endpoints: ['list-webhooks', 'create-webhook'],
      },
      {
        type: 'added',
        description:
          'Multi-tenant sandbox with pre-seeded data for 4 bank tenants: Chase (6M businesses), Wells Fargo (4.2M), Santander (1.8M), and Citi (3.5M).',
      },
      {
        type: 'added',
        description:
          'Standard response envelope (BffResponse / BffListResponse) with success, data, error, and meta fields across all endpoints.',
      },
      {
        type: 'added',
        description:
          'Rate limiting: 100 req/min for sandbox, 1,000 req/min for production. X-RateLimit-* response headers included.',
      },
      {
        type: 'added',
        description:
          'Comprehensive error handling with machine-readable error codes (UNAUTHORIZED, FORBIDDEN, NOT_FOUND, VALIDATION_ERROR, UNPROCESSABLE_ENTITY, RATE_LIMITED, INTERNAL_ERROR).',
      },
      {
        type: 'added',
        description:
          'Developer documentation portal at docs.futeurcredx.com with interactive API explorer, 4-language code examples, and live sandbox response previews.',
      },
      // Security
      {
        type: 'security',
        description:
          'Tenant isolation enforced at API gateway level. API keys are scoped to tenants and cannot access cross-tenant data.',
      },
      {
        type: 'security',
        description:
          'API keys are hashed at rest using SHA-256. Full key values are never stored and cannot be retrieved after creation.',
      },
      {
        type: 'security',
        description:
          'Webhook payloads signed with HMAC-SHA256 using per-subscription shared secrets for delivery verification.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Derived exports
// ---------------------------------------------------------------------------

/** Latest release for quick access */
export const latestRelease = releases[0];

/** All versions for navigation */
export const versions = releases.map((r) => ({
  version: r.version,
  date: r.date,
  title: r.title,
}));
