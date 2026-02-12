// Enterprise Settings System Types - Bank-grade platform configuration

export type UserRole = 'admin' | 'developer' | 'risk' | 'rm' | 'readonly';

export type UserStatus = 'active' | 'pending' | 'inactive';

export type Environment = 'demo' | 'sandbox' | 'production';

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string | null;
  mfaEnabled: boolean;
  portfolioAccess: string[];
  allowExports: boolean;
  allowApiKeyCreation: boolean;
  createdAt: string;
}

export interface Permission {
  id: string;
  label: string;
  description: string;
}

export interface RolePermissions {
  role: UserRole;
  label: string;
  permissions: Record<string, boolean>;
}

export interface ApiKey {
  id: string;
  name: string;
  keyMasked: string;
  environment: Environment;
  scopes: string[];
  createdAt: string;
  lastUsed: string | null;
  status: 'active' | 'revoked';
  createdBy: string;
}

export interface OAuthClient {
  id: string;
  name: string;
  clientId: string;
  redirectUris: string[];
  scopes: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface IpAllowlistEntry {
  id: string;
  ipOrCidr: string;
  addedBy: string;
  addedOn: string;
  description?: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'aggregator' | 'bureau' | 'accounting';
  status: 'connected' | 'error' | 'disconnected';
  lastSync: string | null;
  errorRate: number;
  icon?: string;
}

export interface ModelVersion {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'deprecated' | 'testing';
  validatedOn: string;
  notes: string;
}

export interface AlertThreshold {
  id: string;
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}

export interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  ip: string;
  details?: string;
}

export interface BillingInfo {
  plan: string;
  tier: string;
  monthlyUsage: number;
  usageLimit: number;
  nextInvoiceDate: string;
  amountDue: number;
}

export interface SettingsSection {
  id: string;
  label: string;
  icon: string;
  category: string;
}

export interface SsoConfig {
  provider: 'saml' | 'oidc' | 'none';
  idpUrl: string;
  certificate: string | null;
  requireMfa: boolean;
  sessionTimeout: number;
}

export interface RetentionPolicy {
  rawDataDays: number;
  derivedMetricsOnly: boolean;
  retainRawData: boolean;
}

export interface ConsentDefaults {
  accountsRead: boolean;
  transactionsRead: boolean;
  identityRead: boolean;
  balancesRead: boolean;
  defaultExpirationDays: number;
}

export interface PiiMaskingConfig {
  maskSsn: boolean;
  maskAccountNumbers: boolean;
  maskEmail: boolean;
  maskPhone: boolean;
}
