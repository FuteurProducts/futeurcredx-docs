/**
 * BFF API Client
 * Base client for all Backend-for-Frontend API calls
 * Handles auth (Clerk JWT + X-API-Key), tenant isolation, and standardized response envelopes
 */

import { computeHasMore } from './normalizers';
import { getRequestLogStore } from '@/stores/apiRequestLogStore';

// Standard BFF response envelope
export interface BffResponseMeta {
  requestId: string;
  portfolioId?: string;
  lastUpdated?: string;
  dataSources?: string[];
}

export interface BffResponse<T> {
  data: T;
  meta: BffResponseMeta;
}

export interface BffListResponse<T> {
  data: T[];
  meta: BffResponseMeta;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

export interface BffError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta: BffResponseMeta;
}

export interface BffRequestOptions {
  portfolioId: string;
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

// ── Auth: Clerk JWT ──────────────────────────────────────────────────────
// Injected from AuthContext. Starts null — AuthProvider sets the real getter on mount.
let _getToken: (() => Promise<string | null>) | null = null;

export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  _getToken = getter;
}

async function getAuthToken(): Promise<string | null> {
  if (_getToken) {
    return _getToken();
  }
  return null;
}

// ── Auth: X-API-Key (sandbox mode) ──────────────────────────────────────
let _apiKey: string | null = null;

/**
 * Set the active API key for X-API-Key authentication (sandbox mode).
 * When set, requests use X-API-Key header instead of Authorization: Bearer.
 */
export function setApiKey(key: string | null) {
  _apiKey = key;
}

/** Get the current API key (non-React). */
export function getApiKey(): string | null {
  return _apiKey;
}

// Build query string from params
function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const filtered = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  return filtered.length > 0 ? `?${filtered.join('&')}` : '';
}

// Core request function
async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  endpoint: string,
  options?: Partial<BffRequestOptions>
): Promise<T> {
  const token = await getAuthToken();

  // Determine auth mode: X-API-Key (sandbox) or Bearer token (production)
  const hasApiKey = Boolean(_apiKey);
  const hasToken = Boolean(token);

  if (!hasApiKey && !hasToken) {
    const hint = `Auth failed: apiKey=${hasApiKey ? 'SET' : 'NULL'}, jwt=${hasToken ? 'SET' : 'NULL'}, tokenGetter=${typeof _getToken === 'function' ? 'FUNCTION' : 'NULL'}. ${
      !_getToken
        ? 'Auth not initialized — token getter not set. Refresh the page.'
        : 'Clerk session returned no token. Try signing out and back in, or set an API key in the API Console.'
    }`;
    throw {
      error: {
        code: 'UNAUTHORIZED',
        message: hint,
      },
      meta: { requestId: crypto.randomUUID() },
    } as BffError;
  }

  // Build URL — use VITE_API_URL for the new NestJS API, fallback to Supabase
  const baseUrl = import.meta.env.VITE_API_URL
    || `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

  // Prefix endpoints with /dashboard for the new API
  const prefix = import.meta.env.VITE_API_URL ? '/dashboard' : '';
  let url = `${baseUrl}${prefix}${endpoint}`;

  const queryParams: Record<string, string | number | boolean | undefined> = {
    ...options?.params,
  };

  // Add portfolioId to query params if provided
  if (options?.portfolioId) {
    queryParams.portfolioId = options.portfolioId;
  }

  url += buildQueryString(queryParams);

  // Build headers — X-API-Key takes priority over Bearer token
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (hasApiKey) {
    headers['X-API-Key'] = _apiKey!;
  } else {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (options?.body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(options.body);
  }

  // ── Instrumentation: capture timing ────────────────────────────────
  const startTime = performance.now();

  let response: Response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (networkErr) {
    const elapsed = Math.round(performance.now() - startTime);
    const rawMsg = networkErr instanceof Error ? networkErr.message : String(networkErr);

    // Detect mixed content (HTTPS page → HTTP API)
    const isMixed = typeof window !== 'undefined'
      && window.location.protocol === 'https:'
      && url.startsWith('http://');
    const diagnostic = isMixed
      ? `Mixed content blocked: Dashboard is HTTPS but API URL is HTTP (${url.split('/').slice(0, 3).join('/')}). The browser refuses to send HTTP requests from an HTTPS page.`
      : `Network error: ${rawMsg}`;

    logRequest(method, endpoint, 0, elapsed, options?.body, diagnostic, rawMsg);

    throw {
      error: {
        code: 'NETWORK_ERROR',
        message: `[${method} ${endpoint}] ${diagnostic}`,
        details: { url, rawError: rawMsg, authMode: hasApiKey ? 'api-key' : 'bearer-jwt' },
      },
      meta: { requestId: crypto.randomUUID() },
    } as BffError;
  }
  const responseTime = Math.round(performance.now() - startTime);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({
      error: { code: 'UNKNOWN', message: response.statusText },
      meta: { requestId: crypto.randomUUID() },
    }));

    // Log failed request
    logRequest(method, endpoint, response.status, responseTime, options?.body, JSON.stringify(errorBody), errorBody.error?.message);

    throw errorBody as BffError;
  }

  const body = await response.json();
  const bodyStr = JSON.stringify(body);

  // Log successful request
  logRequest(method, endpoint, response.status, responseTime, options?.body, bodyStr);

  // Edge functions / NestJS API wraps responses in { success, data, meta } — unwrap to match BFF types
  if ('success' in body && body.success === true) {
    const result: Record<string, unknown> = { data: body.data, meta: body.meta || {} };

    // Normalize pagination — compute hasMore if missing
    if (body.pagination) {
      result.pagination = {
        ...body.pagination,
        hasMore: computeHasMore(body.pagination),
      };
    }

    return result as T;
  }

  // If response already has pagination, ensure hasMore is computed
  if ('pagination' in body && body.pagination) {
    body.pagination.hasMore = computeHasMore(body.pagination);
  }

  return body as T;
}

/** Push request entry into the Zustand request log store. */
function logRequest(
  method: string,
  endpoint: string,
  statusCode: number,
  responseTime: number,
  requestBody?: unknown,
  responseBody?: string,
  error?: string,
): void {
  try {
    const store = getRequestLogStore();
    store.addRequest({
      method,
      endpoint,
      statusCode,
      responseTime,
      requestBody: requestBody ? JSON.stringify(requestBody) : null,
      responseBody: responseBody ?? '',
      error,
    });
  } catch {
    // Store not available — silently ignore
  }
}

// Typed request methods
export const bffClient = {
  get: <T>(endpoint: string, options?: Partial<BffRequestOptions>) =>
    request<T>('GET', endpoint, options),

  post: <T>(endpoint: string, options?: Partial<BffRequestOptions>) =>
    request<T>('POST', endpoint, options),

  put: <T>(endpoint: string, options?: Partial<BffRequestOptions>) =>
    request<T>('PUT', endpoint, options),

  patch: <T>(endpoint: string, options?: Partial<BffRequestOptions>) =>
    request<T>('PATCH', endpoint, options),

  delete: <T>(endpoint: string, options?: Partial<BffRequestOptions>) =>
    request<T>('DELETE', endpoint, options),
};

export default bffClient;
