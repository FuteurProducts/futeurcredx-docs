// Enterprise Settings Mock Data - Bank-grade platform configuration

import type {
  PlatformUser,
  Permission,
  RolePermissions,
  ApiKey,
  OAuthClient,
  IpAllowlistEntry,
  DataSource,
  ModelVersion,
  AlertThreshold,
  AuditLogEntry,
  BillingInfo,
  SettingsSection,
} from './types';

export const mockUsers: PlatformUser[] = [
  {
    id: 'usr-001',
    name: 'John Administrator',
    email: 'john.admin@bank.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15T14:30:00Z',
    mfaEnabled: true,
    portfolioAccess: ['all'],
    allowExports: true,
    allowApiKeyCreation: true,
    createdAt: '2023-06-01T00:00:00Z',
  },
  {
    id: 'usr-002',
    name: 'Sarah Developer',
    email: 'sarah.dev@bank.com',
    role: 'developer',
    status: 'active',
    lastLogin: '2024-01-15T12:00:00Z',
    mfaEnabled: true,
    portfolioAccess: ['all'],
    allowExports: true,
    allowApiKeyCreation: true,
    createdAt: '2023-08-15T00:00:00Z',
  },
  {
    id: 'usr-003',
    name: 'Mike Risk Analyst',
    email: 'mike.risk@bank.com',
    role: 'risk',
    status: 'active',
    lastLogin: '2024-01-14T16:45:00Z',
    mfaEnabled: true,
    portfolioAccess: ['loc', 'cards'],
    allowExports: true,
    allowApiKeyCreation: false,
    createdAt: '2023-09-01T00:00:00Z',
  },
  {
    id: 'usr-004',
    name: 'Lisa Relationship Manager',
    email: 'lisa.rm@bank.com',
    role: 'rm',
    status: 'active',
    lastLogin: '2024-01-15T09:00:00Z',
    mfaEnabled: false,
    portfolioAccess: ['nyc-region'],
    allowExports: true,
    allowApiKeyCreation: false,
    createdAt: '2023-10-01T00:00:00Z',
  },
  {
    id: 'usr-005',
    name: 'Tom Analyst',
    email: 'tom.analyst@bank.com',
    role: 'readonly',
    status: 'pending',
    lastLogin: null,
    mfaEnabled: false,
    portfolioAccess: [],
    allowExports: false,
    allowApiKeyCreation: false,
    createdAt: '2024-01-10T00:00:00Z',
  },
];

export const mockPermissions: Permission[] = [
  { id: 'view-analytics', label: 'View Analytics', description: 'Access portfolio analytics and dashboards' },
  { id: 'export-reports', label: 'Export Reports', description: 'Download reports in various formats' },
  { id: 'manage-api-keys', label: 'Manage API Keys', description: 'Create, rotate, and revoke API keys' },
  { id: 'edit-settings', label: 'Edit Settings', description: 'Modify platform configuration' },
  { id: 'view-pii', label: 'View PII', description: 'Access personally identifiable information' },
  { id: 'view-audit-logs', label: 'View Audit Logs', description: 'Access system audit trail' },
  { id: 'manage-users', label: 'Manage Users', description: 'Add, edit, and remove users' },
  { id: 'manage-integrations', label: 'Manage Integrations', description: 'Configure third-party connections' },
];

export const mockRolePermissions: RolePermissions[] = [
  {
    role: 'admin',
    label: 'Administrator',
    permissions: {
      'view-analytics': true,
      'export-reports': true,
      'manage-api-keys': true,
      'edit-settings': true,
      'view-pii': true,
      'view-audit-logs': true,
      'manage-users': true,
      'manage-integrations': true,
    },
  },
  {
    role: 'developer',
    label: 'Developer',
    permissions: {
      'view-analytics': true,
      'export-reports': true,
      'manage-api-keys': true,
      'edit-settings': false,
      'view-pii': false,
      'view-audit-logs': true,
      'manage-users': false,
      'manage-integrations': true,
    },
  },
  {
    role: 'risk',
    label: 'Risk Analyst',
    permissions: {
      'view-analytics': true,
      'export-reports': true,
      'manage-api-keys': false,
      'edit-settings': false,
      'view-pii': true,
      'view-audit-logs': true,
      'manage-users': false,
      'manage-integrations': false,
    },
  },
  {
    role: 'rm',
    label: 'Relationship Manager',
    permissions: {
      'view-analytics': true,
      'export-reports': true,
      'manage-api-keys': false,
      'edit-settings': false,
      'view-pii': false,
      'view-audit-logs': false,
      'manage-users': false,
      'manage-integrations': false,
    },
  },
  {
    role: 'readonly',
    label: 'Read-only',
    permissions: {
      'view-analytics': true,
      'export-reports': false,
      'manage-api-keys': false,
      'edit-settings': false,
      'view-pii': false,
      'view-audit-logs': false,
      'manage-users': false,
      'manage-integrations': false,
    },
  },
];

export const mockApiKeys: ApiKey[] = [
  {
    id: 'key-001',
    name: 'Production API Key',
    keyMasked: 'sk_live_****************************1234',
    environment: 'production',
    scopes: ['read:scores', 'read:businesses', 'write:webhooks'],
    createdAt: '2024-01-01T00:00:00Z',
    lastUsed: '2024-01-15T14:30:00Z',
    status: 'active',
    createdBy: 'john.admin@bank.com',
  },
  {
    id: 'key-002',
    name: 'Sandbox Test Key',
    keyMasked: 'sk_test_****************************5678',
    environment: 'sandbox',
    scopes: ['read:scores', 'read:businesses', 'write:webhooks', 'read:pii'],
    createdAt: '2024-01-05T00:00:00Z',
    lastUsed: '2024-01-15T10:00:00Z',
    status: 'active',
    createdBy: 'sarah.dev@bank.com',
  },
  {
    id: 'key-003',
    name: 'Legacy Key (Deprecated)',
    keyMasked: 'sk_live_****************************9012',
    environment: 'production',
    scopes: ['read:scores'],
    createdAt: '2023-06-01T00:00:00Z',
    lastUsed: '2023-12-01T00:00:00Z',
    status: 'revoked',
    createdBy: 'john.admin@bank.com',
  },
];

export const mockOAuthClients: OAuthClient[] = [
  {
    id: 'oauth-001',
    name: 'Mobile App',
    clientId: 'client_abc123',
    redirectUris: ['https://app.bank.com/callback', 'myapp://callback'],
    scopes: ['openid', 'profile', 'read:scores'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'oauth-002',
    name: 'Partner Portal',
    clientId: 'client_def456',
    redirectUris: ['https://partners.bank.com/auth/callback'],
    scopes: ['openid', 'profile', 'read:scores', 'read:businesses'],
    status: 'active',
    createdAt: '2024-01-10T00:00:00Z',
  },
];

export const mockIpAllowlist: IpAllowlistEntry[] = [
  { id: 'ip-001', ipOrCidr: '192.168.1.0/24', addedBy: 'john.admin@bank.com', addedOn: '2024-01-01T00:00:00Z', description: 'Corporate HQ' },
  { id: 'ip-002', ipOrCidr: '10.0.0.0/8', addedBy: 'john.admin@bank.com', addedOn: '2024-01-01T00:00:00Z', description: 'Internal VPN' },
  { id: 'ip-003', ipOrCidr: '203.0.113.50', addedBy: 'sarah.dev@bank.com', addedOn: '2024-01-10T00:00:00Z', description: 'Dev Office' },
];

export const mockDataSources: DataSource[] = [
  { id: 'ds-001', name: 'Plaid', type: 'aggregator', status: 'connected', lastSync: '2024-01-15T14:00:00Z', errorRate: 0.2 },
  { id: 'ds-002', name: 'MX', type: 'aggregator', status: 'connected', lastSync: '2024-01-15T13:45:00Z', errorRate: 0.5 },
  { id: 'ds-003', name: 'Yodlee', type: 'aggregator', status: 'disconnected', lastSync: null, errorRate: 0 },
  { id: 'ds-004', name: 'Experian', type: 'bureau', status: 'connected', lastSync: '2024-01-15T12:00:00Z', errorRate: 0.1 },
  { id: 'ds-005', name: 'Equifax', type: 'bureau', status: 'connected', lastSync: '2024-01-15T11:30:00Z', errorRate: 0.3 },
  { id: 'ds-006', name: 'QuickBooks', type: 'accounting', status: 'error', lastSync: '2024-01-14T00:00:00Z', errorRate: 15.2 },
  { id: 'ds-007', name: 'Xero', type: 'accounting', status: 'connected', lastSync: '2024-01-15T10:00:00Z', errorRate: 0.8 },
];

export const mockModelVersions: ModelVersion[] = [
  { id: 'model-001', name: 'LumiqAI Score Engine', version: 'v3.2.1', status: 'active', validatedOn: '2024-01-10T00:00:00Z', notes: 'Production model with improved cash flow features' },
  { id: 'model-002', name: 'LumiqAI Score Engine', version: 'v3.1.0', status: 'deprecated', validatedOn: '2023-11-15T00:00:00Z', notes: 'Previous stable version' },
  { id: 'model-003', name: 'Early Warning System', version: 'v2.0.0', status: 'active', validatedOn: '2024-01-05T00:00:00Z', notes: 'Enhanced deterioration detection' },
  { id: 'model-004', name: 'Cross-sell Propensity', version: 'v1.5.0', status: 'testing', validatedOn: '2024-01-12T00:00:00Z', notes: 'A/B testing in progress' },
];

export const mockAlertThresholds: AlertThreshold[] = [
  { id: 'alert-001', label: 'Cash Flow Drop Trigger', description: 'Alert when cash flow drops by this percentage', value: 20, min: 5, max: 50, unit: '%' },
  { id: 'alert-002', label: 'Score Drop Trigger', description: 'Alert when score drops by this many points', value: 10, min: 5, max: 30, unit: 'pts' },
  { id: 'alert-003', label: 'Utilization Spike', description: 'Alert when utilization exceeds this threshold', value: 75, min: 50, max: 95, unit: '%' },
  { id: 'alert-004', label: 'Payment Delay Days', description: 'Alert when payment is delayed by this many days', value: 15, min: 7, max: 45, unit: 'days' },
];

export const mockAuditLogs: AuditLogEntry[] = [
  { id: 'log-001', user: 'john.admin@bank.com', action: 'user.created', resource: 'tom.analyst@bank.com', timestamp: '2024-01-15T14:30:00Z', ip: '192.168.1.100' },
  { id: 'log-002', user: 'sarah.dev@bank.com', action: 'api_key.created', resource: 'Sandbox Test Key', timestamp: '2024-01-15T12:00:00Z', ip: '192.168.1.105' },
  { id: 'log-003', user: 'john.admin@bank.com', action: 'settings.updated', resource: 'alert_thresholds', timestamp: '2024-01-14T16:45:00Z', ip: '192.168.1.100' },
  { id: 'log-004', user: 'mike.risk@bank.com', action: 'report.exported', resource: 'Portfolio Risk Summary', timestamp: '2024-01-14T15:30:00Z', ip: '192.168.1.110' },
  { id: 'log-005', user: 'lisa.rm@bank.com', action: 'customer.viewed', resource: 'Business ID: BIZ-12345', timestamp: '2024-01-14T14:00:00Z', ip: '192.168.1.115' },
  { id: 'log-006', user: 'john.admin@bank.com', action: 'role.updated', resource: 'Risk Analyst', timestamp: '2024-01-13T10:00:00Z', ip: '192.168.1.100' },
];

export const mockBillingInfo: BillingInfo = {
  plan: 'Enterprise',
  tier: 'Growth',
  monthlyUsage: 2450000,
  usageLimit: 5000000,
  nextInvoiceDate: '2024-02-01T00:00:00Z',
  amountDue: 12500,
};

export const settingsSections: SettingsSection[] = [
  // Access & Users
  { id: 'users', label: 'Users', icon: 'users', category: 'Access & Users' },
  { id: 'roles', label: 'Roles & Permissions', icon: 'shield', category: 'Access & Users' },
  { id: 'sso', label: 'SSO & Authentication', icon: 'key', category: 'Access & Users' },
  // API & Security
  { id: 'api-keys', label: 'API Keys', icon: 'key', category: 'API & Security' },
  { id: 'oauth', label: 'OAuth Clients', icon: 'lock', category: 'API & Security' },
  { id: 'ip-allowlist', label: 'IP Allowlist', icon: 'globe', category: 'API & Security' },
  { id: 'webhook-security', label: 'Webhook Security', icon: 'webhook', category: 'API & Security' },
  // Data & Privacy
  { id: 'data-sources', label: 'Data Sources', icon: 'database', category: 'Data & Privacy' },
  { id: 'retention', label: 'Retention Policies', icon: 'clock', category: 'Data & Privacy' },
  { id: 'consent', label: 'Consent Defaults', icon: 'check-circle', category: 'Data & Privacy' },
  { id: 'pii', label: 'PII Masking', icon: 'eye-off', category: 'Data & Privacy' },
  // Risk & Models
  { id: 'models', label: 'Model Versions', icon: 'cpu', category: 'Risk & Models' },
  { id: 'alerts', label: 'Alert Thresholds', icon: 'bell', category: 'Risk & Models' },
  // Integrations
  { id: 'integrations', label: 'Integrations', icon: 'plug', category: 'Integrations' },
  // Notifications
  { id: 'notifications', label: 'Notification Preferences', icon: 'mail', category: 'Notifications' },
  // Billing
  { id: 'billing', label: 'Plan & Usage', icon: 'credit-card', category: 'Billing & Usage' },
  // Audit
  { id: 'audit-logs', label: 'Audit Logs', icon: 'file-text', category: 'Audit & Logs' },
];

export const roleLabels: Record<string, string> = {
  admin: 'Administrator',
  developer: 'Developer',
  risk: 'Risk Analyst',
  rm: 'Relationship Manager',
  readonly: 'Read-only',
};
