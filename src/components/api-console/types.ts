// API Console Types - Enterprise-grade type definitions for API Connections management

export type ConnectionType = 
  | 'open-banking' 
  | 'aggregator' 
  | 'accounting' 
  | 'bureau' 
  | 'internal';

export type ConnectionStatus = 
  | 'connected' 
  | 'needs-reauth' 
  | 'degraded' 
  | 'down' 
  | 'pending';

export type AuthMethod = 
  | 'oauth' 
  | 'mtls' 
  | 'api-key' 
  | 'sftp' 
  | 'jwt';

export type Environment = 'demo' | 'sandbox' | 'production';

export type SLATier = 'standard' | 'premium' | 'enterprise';

export interface ConsentScope {
  id: string;
  name: string;
  description: string;
  category: 'accounts' | 'transactions' | 'identity' | 'payments' | 'payroll';
  granted: boolean;
}

export interface ConsentObject {
  id: string;
  connectionId: string;
  scopes: ConsentScope[];
  duration: {
    startDate: string;
    expiresAt: string;
    daysRemaining: number;
  };
  accountsPermitted: string[];
  revocable: boolean;
  createdAt: string;
  lastUpdated: string;
}

export interface TokenState {
  accessTokenAge: number; // in hours
  refreshSuccessRate: number; // percentage
  lastAuthEvent: string;
  expiresIn: number; // seconds
  tokenType: 'bearer' | 'jwt';
}

export interface Connection {
  id: string;
  name: string;
  type: ConnectionType;
  status: ConnectionStatus;
  authMethod: AuthMethod;
  environment: Environment;
  
  // OAuth/Auth details
  oauthClientId?: string;
  oauthAudience?: string;
  webhookEndpoint?: string;
  
  // Scopes & Consent
  scopesGranted: string[];
  consent?: ConsentObject;
  tokenState?: TokenState;
  
  // Data metrics
  dataFreshness: string; // last sync time
  errorRate24h: number; // percentage
  
  // Ownership
  owner: string;
  slaTier: SLATier;
  
  // Rate limits
  rateLimitUsage: number; // percentage
  rateLimitMax: number;
  
  // Metadata
  createdAt: string;
  lastUsed: string;
  
  // Data categories enabled
  dataCategories: string[];
  
  // Coverage
  coveragePercent?: number;
  
  // Logo/icon
  logo?: string;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  connectionId: string;
  connectionName: string;
  type: 'request' | 'response' | 'webhook' | 'error' | 'auth';
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint?: string;
  statusCode?: number;
  duration?: number; // ms
  errorType?: 'auth_error' | 'rate_limit' | 'upstream_down' | 'schema_mismatch' | 'timeout' | 'validation';
  payload?: string; // masked/truncated
  response?: string; // masked/truncated
  userId?: string;
}

export interface WebhookEvent {
  id: string;
  connectionId: string;
  eventType: string;
  timestamp: string;
  status: 'delivered' | 'failed' | 'pending' | 'retrying';
  deliveryTime?: number; // ms
  retryCount: number;
  payload?: string;
  responseCode?: number;
}

export interface WebhookConfig {
  id: string;
  connectionId: string;
  endpointUrl: string;
  secret: string;
  secretLastRotated: string;
  mtlsEnabled: boolean;
  eventTypes: string[];
  deliveryMetrics: {
    p50DeliveryTime: number;
    failureRate: number;
    totalDelivered: number;
    totalFailed: number;
  };
}

export interface RateLimitConfig {
  connectionId: string;
  quotaLimit: number;
  quotaUsed: number;
  quotaPeriod: 'minute' | 'hour' | 'day' | 'month';
  burstLimit: number;
  burstUsed: number;
  perEndpointLimits: {
    endpoint: string;
    limit: number;
    used: number;
  }[];
  limitExceededIncidents: {
    timestamp: string;
    endpoint: string;
    requestedCount: number;
  }[];
}

export interface ChangeLogEntry {
  id: string;
  connectionId: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'created' | 'updated' | 'scopes_changed' | 'endpoint_changed' | 'key_rotated' | 'disabled' | 'enabled';
  field?: string;
  oldValue?: string;
  newValue?: string;
  description: string;
}

export interface IncidentAlert {
  id: string;
  connectionId: string;
  connectionName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'outage' | 'degraded' | 'auth_expiring' | 'rate_limit' | 'data_stale';
  title: string;
  description: string;
  startTime: string;
  affectedEndpoints: string[];
  suggestedMitigations: string[];
  status: 'active' | 'investigating' | 'resolved';
  estimatedPortfolioImpact?: number;
}

export interface ApiPlaygroundRequest {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: Record<string, string>;
  body?: string;
  queryParams?: Record<string, string>;
}

export interface ApiPlaygroundResponse {
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number; // ms
  timestamp: string;
}

export interface DataCoverageMetrics {
  connectionId: string;
  totalSmbs: number;
  connectedSmbs: number;
  coveragePercent: number;
  freshnessDistribution: {
    p50: number; // hours since last refresh
    p90: number;
    p99: number;
  };
  missingFields: {
    field: string;
    missingCount: number;
    missingPercent: number;
  }[];
}

export interface HealthMetrics {
  connectionId: string;
  uptime24h: number;
  uptime7d: number;
  uptime30d: number;
  avgLatency: number;
  p95Latency: number;
  p99Latency: number;
  errorsByType: {
    type: string;
    count: number;
    percent: number;
  }[];
  requestsByEndpoint: {
    endpoint: string;
    count: number;
    errorRate: number;
  }[];
}
