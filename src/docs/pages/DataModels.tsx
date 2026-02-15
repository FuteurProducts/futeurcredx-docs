import { useCallback, useState } from 'react';

import {
  AlertTriangle,
  BarChart3,
  Building2,
  ChevronDown,
  CreditCard,
  FileText,
  Key,
  LayoutDashboard,
  ScrollText,
  ShoppingBag,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { SchemaViewer } from '@/docs/components/api/SchemaViewer';

interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface ModelDefinition {
  id: string;
  name: string;
  description: string;
  icon: typeof Building2;
  iconColor: string;
  fields: SchemaField[];
}

const models: ModelDefinition[] = [
  {
    id: 'business',
    name: 'Business',
    description:
      'Core entity representing an SMB customer. Contains firmographic data, credit metrics, and product relationships.',
    icon: Building2,
    iconColor: 'text-blue-400',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique business identifier (e.g., biz_001)' },
      { name: 'name', type: 'string', required: true, description: 'DBA (doing business as) name' },
      { name: 'legalName', type: 'string', required: true, description: 'Registered legal entity name' },
      { name: 'industry', type: 'string', required: true, description: 'Primary industry classification' },
      { name: 'naicsCode', type: 'string', required: false, description: '6-digit NAICS industry code' },
      { name: 'city', type: 'string', required: true, description: 'Business city' },
      { name: 'state', type: 'string', required: true, description: 'Business state (2-letter code)' },
      { name: 'annualRevenue', type: 'number', required: true, description: 'Annual revenue in USD' },
      { name: 'employeeCount', type: 'number', required: true, description: 'Number of full-time employees' },
      { name: 'yearsInBusiness', type: 'number', required: true, description: 'Years since incorporation' },
      { name: 'creditScore', type: 'number', required: true, description: 'Composite credit score (300-850)' },
      { name: 'riskTier', type: "'low' | 'medium' | 'high' | 'critical'", required: true, description: 'Calculated risk classification tier' },
      { name: 'ownerFico', type: 'number', required: false, description: 'Business owner personal FICO score' },
      { name: 'segment', type: 'string', required: true, description: 'Business segment (e.g., micro, small, mid-market)' },
      { name: 'productsHeld', type: 'string[]', required: true, description: 'List of current product IDs' },
      { name: 'eligibleProducts', type: 'string[]', required: true, description: 'List of products the business qualifies for' },
      { name: 'currentExposure', type: 'number', required: true, description: 'Total outstanding exposure in USD' },
    ],
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description:
      'A portfolio represents a bank tenant and its associated businesses, configuration, and aggregate metrics.',
    icon: LayoutDashboard,
    iconColor: 'text-purple-400',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique portfolio identifier' },
      { name: 'name', type: 'string', required: true, description: 'Portfolio display name (e.g., Chase Commercial)' },
      { name: 'code', type: 'string', required: true, description: 'Short portfolio code (e.g., chase_001)' },
      { name: 'config', type: 'PortfolioConfig', required: true, description: 'Portfolio configuration object (scoring model, thresholds)' },
      { name: 'totalBusinesses', type: 'number', required: true, description: 'Total number of businesses in portfolio' },
      { name: 'totalExposure', type: 'number', required: true, description: 'Aggregate exposure across all businesses (USD)' },
      { name: 'avgCreditScore', type: 'number', required: true, description: 'Average credit score across the portfolio' },
    ],
  },
  {
    id: 'credit-score',
    name: 'CreditScore',
    description:
      'Credit score record for a business, including historical trend data and contributing factors.',
    icon: CreditCard,
    iconColor: 'text-emerald-400',
    fields: [
      { name: 'businessId', type: 'string', required: true, description: 'Reference to the parent business' },
      { name: 'score', type: 'number', required: true, description: 'Current composite credit score (300-850)' },
      { name: 'previousScore', type: 'number', required: false, description: 'Previous score for trend comparison' },
      { name: 'trend', type: "'improving' | 'stable' | 'declining'", required: true, description: 'Score trend direction' },
      { name: 'factors', type: 'string[]', required: true, description: 'Top contributing factors to the score' },
      { name: 'updatedAt', type: 'string (ISO 8601)', required: true, description: 'Timestamp of last score calculation' },
    ],
  },
  {
    id: 'risk-alert',
    name: 'RiskAlert',
    description:
      'A risk event or alert triggered by monitoring rules for a business.',
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique alert identifier' },
      { name: 'businessId', type: 'string', required: true, description: 'Reference to the affected business' },
      { name: 'severity', type: "'low' | 'medium' | 'high' | 'critical'", required: true, description: 'Alert severity level' },
      { name: 'type', type: 'string', required: true, description: 'Alert type classification (e.g., score_drop, payment_delinquency)' },
      { name: 'message', type: 'string', required: true, description: 'Human-readable alert description' },
      { name: 'createdAt', type: 'string (ISO 8601)', required: true, description: 'When the alert was triggered' },
      { name: 'resolved', type: 'boolean', required: true, description: 'Whether the alert has been resolved' },
    ],
  },
  {
    id: 'application',
    name: 'Application',
    description:
      'A credit product application submitted by or on behalf of a business.',
    icon: FileText,
    iconColor: 'text-cyan-400',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique application identifier' },
      { name: 'businessId', type: 'string', required: true, description: 'Reference to the applicant business' },
      { name: 'portfolioId', type: 'string', required: true, description: 'Portfolio the application belongs to' },
      { name: 'type', type: 'string', required: true, description: 'Product type (e.g., line_of_credit, term_loan, sba_loan)' },
      { name: 'amount', type: 'number', required: true, description: 'Requested amount in USD' },
      { name: 'status', type: "'pending' | 'approved' | 'denied' | 'funded'", required: true, description: 'Current application status' },
      { name: 'submittedAt', type: 'string (ISO 8601)', required: true, description: 'Submission timestamp' },
      { name: 'decidedAt', type: 'string (ISO 8601) | null', required: false, description: 'Decision timestamp (null if pending)' },
    ],
  },
  {
    id: 'offer',
    name: 'Offer',
    description:
      'A pre-qualified or approved credit product offer for a business.',
    icon: ShoppingBag,
    iconColor: 'text-pink-400',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique offer identifier' },
      { name: 'businessId', type: 'string', required: true, description: 'Business the offer is for' },
      { name: 'portfolioId', type: 'string', required: true, description: 'Portfolio context' },
      { name: 'productType', type: 'string', required: true, description: 'Product type offered' },
      { name: 'amount', type: 'number', required: true, description: 'Maximum offer amount in USD' },
      { name: 'apr', type: 'number', required: true, description: 'Annual percentage rate' },
      { name: 'term', type: 'number', required: true, description: 'Term length in months' },
      { name: 'status', type: "'active' | 'accepted' | 'declined' | 'expired'", required: true, description: 'Current offer status' },
      { name: 'expiresAt', type: 'string (ISO 8601)', required: true, description: 'Offer expiration date' },
    ],
  },
  {
    id: 'audit-event',
    name: 'AuditEvent',
    description:
      'An immutable record of a user action within the system for compliance and auditing.',
    icon: ScrollText,
    iconColor: 'text-indigo-400',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique audit event identifier' },
      { name: 'action', type: 'string', required: true, description: 'Action type (e.g., SCORE_VIEWED, DOSSIER_OPENED, REPORT_DOWNLOADED)' },
      { name: 'userId', type: 'string', required: true, description: 'User who performed the action' },
      { name: 'resourceType', type: 'string', required: true, description: 'Type of resource acted upon (e.g., business, report)' },
      { name: 'resourceId', type: 'string', required: true, description: 'ID of the resource acted upon' },
      { name: 'metadata', type: 'Record<string, unknown>', required: false, description: 'Additional context about the action' },
      { name: 'timestamp', type: 'string (ISO 8601)', required: true, description: 'When the action occurred' },
    ],
  },
  {
    id: 'api-key',
    name: 'ApiKey',
    description:
      'An API key credential for authenticating server-to-server requests.',
    icon: Key,
    iconColor: 'text-yellow-400',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique key identifier' },
      { name: 'name', type: 'string', required: true, description: 'Human-readable key name' },
      { name: 'keyPrefix', type: 'string', required: true, description: 'Visible prefix of the key (e.g., sk_test_ceO5...)' },
      { name: 'environment', type: "'sandbox' | 'production'", required: true, description: 'Which environment this key is scoped to' },
      { name: 'createdAt', type: 'string (ISO 8601)', required: true, description: 'Key creation timestamp' },
      { name: 'lastUsedAt', type: 'string (ISO 8601) | null', required: false, description: 'Last time the key was used in a request' },
      { name: 'revokedAt', type: 'string (ISO 8601) | null', required: false, description: 'Revocation timestamp (null if active)' },
    ],
  },
  {
    id: 'report',
    name: 'Report',
    description:
      'A generated portfolio or business report in PDF or CSV format.',
    icon: BarChart3,
    iconColor: 'text-teal-400',
    fields: [
      { name: 'id', type: 'string', required: true, description: 'Unique report identifier' },
      { name: 'portfolioId', type: 'string', required: true, description: 'Portfolio the report belongs to' },
      { name: 'type', type: 'string', required: true, description: 'Report type (e.g., portfolio_summary, risk_analysis, compliance)' },
      { name: 'format', type: "'pdf' | 'csv' | 'xlsx'", required: true, description: 'Output format' },
      { name: 'status', type: "'pending' | 'processing' | 'completed' | 'failed'", required: true, description: 'Report generation status' },
      { name: 'createdAt', type: 'string (ISO 8601)', required: true, description: 'When the report was requested' },
      { name: 'completedAt', type: 'string (ISO 8601) | null', required: false, description: 'When generation finished' },
      { name: 'downloadUrl', type: 'string | null', required: false, description: 'Signed URL for downloading (expires in 1 hour)' },
    ],
  },
];

export default function DataModels() {
  const [expandedModels, setExpandedModels] = useState<Set<string>>(
    () => new Set(['business']),
  );

  const toggleModel = useCallback((modelId: string) => {
    setExpandedModels((prev) => {
      const next = new Set(prev);
      if (next.has(modelId)) {
        next.delete(modelId);
      } else {
        next.add(modelId);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedModels(new Set(models.map((m) => m.id)));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedModels(new Set());
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Data Models
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Complete schema reference for all domain entities in the LumiqAI
          platform.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={expandAll}
          className={cn(
            'rounded-lg px-3 py-1.5 text-xs font-medium',
            'border border-gray-800 bg-gray-900/50 text-gray-400',
            'transition-all duration-200',
            'hover:border-gray-700 hover:text-white',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          )}
        >
          Expand All
        </button>
        <button
          type="button"
          onClick={collapseAll}
          className={cn(
            'rounded-lg px-3 py-1.5 text-xs font-medium',
            'border border-gray-800 bg-gray-900/50 text-gray-400',
            'transition-all duration-200',
            'hover:border-gray-700 hover:text-white',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          )}
        >
          Collapse All
        </button>
        <span className="text-xs text-gray-600">
          {models.length} models
        </span>
      </div>

      {/* Model List */}
      <div className="space-y-4">
        {models.map((model) => {
          const Icon = model.icon;
          const isExpanded = expandedModels.has(model.id);

          return (
            <div
              key={model.id}
              id={model.id}
              className={cn(
                'overflow-hidden rounded-xl border transition-all duration-200',
                isExpanded
                  ? 'border-gray-700 bg-gray-900/50'
                  : 'border-gray-800 bg-gray-900/30',
              )}
            >
              {/* Model Header */}
              <button
                type="button"
                onClick={() => toggleModel(model.id)}
                className={cn(
                  'flex w-full items-center gap-4 px-5 py-4 text-left',
                  'transition-all duration-200',
                  'hover:bg-gray-800/30',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
                )}
                aria-expanded={isExpanded}
              >
                <Icon
                  className={cn('h-5 w-5 flex-shrink-0', model.iconColor)}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-white">
                      {model.name}
                    </h2>
                    <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
                      {model.fields.length} fields
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {model.description}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 flex-shrink-0 text-gray-500 transition-transform duration-200',
                    isExpanded && 'rotate-180',
                  )}
                />
              </button>

              {/* Model Fields */}
              {isExpanded && (
                <div className="border-t border-gray-800/50 px-5 py-4">
                  <SchemaViewer
                    schema={model.fields}
                    title={model.name}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
