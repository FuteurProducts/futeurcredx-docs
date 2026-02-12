/**
 * Bank-Specific API Console Mock Data
 *
 * Customizes API Console mock data for each bank while maintaining all exports.
 * Uses ACTIVE_BANK_ID pattern for runtime switching.
 */

import {
  mockConnections as _baseConnections,
  mockActivityLogs as _baseActivityLogs,
  mockIncidents,
  mockConsent,
  mockRateLimits,
  mockCoverageMetrics,
  mockHealthMetrics,
  mockChangeLogs,
  mockWebhookConfigs as _baseWebhookConfigs,
  mockWebhookEvents,
  apiEndpoints,
} from './mockData';
import { ACTIVE_BANK_ID } from '@/data/bankConfig';
import type { BankId } from '@/data/bankConfig';
import type { Connection, ActivityLogEntry, WebhookConfig } from '../types';

// Bank-specific connection names
const BANK_CONNECTION_NAMES: Record<BankId, string> = {
  chase: 'Chase Business Banking API',
  wellsfargo: 'Wells Fargo Commercial API',
  santander: 'Santander Business Connect',
  citi: 'CitiBusiness API Gateway',
};

// Bank-specific API domain prefixes
const BANK_API_DOMAINS: Record<BankId, string> = {
  chase: 'api.chase.com',
  wellsfargo: 'api.wellsfargo.com',
  santander: 'api.santander.com',
  citi: 'api.citi.com',
};

// Bank-specific OAuth client ID prefixes
const BANK_OAUTH_PREFIXES: Record<BankId, string> = {
  chase: 'chase_prod',
  wellsfargo: 'wf_prod',
  santander: 'sant_prod',
  citi: 'citi_prod',
};

// Customize the primary bank connection
export const mockConnections: Connection[] = _baseConnections.map((conn, i) => {
  if (i === 1) {
    // The "Bank Secure Data Sharing" connection (index 1)
    const bankDomain = BANK_API_DOMAINS[ACTIVE_BANK_ID];
    return {
      ...conn,
      name: BANK_CONNECTION_NAMES[ACTIVE_BANK_ID],
      oauthClientId: `${BANK_OAUTH_PREFIXES[ACTIVE_BANK_ID]}_xxx`,
      oauthAudience: `https://${bankDomain}`,
      webhookEndpoint: `https://api.yourapp.com/webhooks/${ACTIVE_BANK_ID}`,
    };
  }
  return conn;
});

// Customize activity logs to reference bank connection
export const mockActivityLogs: ActivityLogEntry[] = _baseActivityLogs.map((log) => {
  if (log.connectionId === 'conn-bank-001') {
    return {
      ...log,
      connectionName: BANK_CONNECTION_NAMES[ACTIVE_BANK_ID],
      endpoint: log.endpoint?.replace('/bank', `/${ACTIVE_BANK_ID}`) ?? log.endpoint,
    };
  }
  return log;
});

// Customize webhook configs for bank connection
export const mockWebhookConfigs: WebhookConfig[] = _baseWebhookConfigs.map((config) => {
  if (config.connectionId === 'conn-bank-001') {
    return {
      ...config,
      endpointUrl: `https://api.yourapp.com/webhooks/${ACTIVE_BANK_ID}`,
    };
  }
  return config;
});

// Re-export all other exports unchanged
export {
  mockIncidents,
  mockConsent,
  mockRateLimits,
  mockCoverageMetrics,
  mockHealthMetrics,
  mockChangeLogs,
  mockWebhookEvents,
  apiEndpoints,
};
