/**
 * BFF API Client
 * Base client for all Backend-for-Frontend API calls
 * Handles auth (Clerk JWT), tenant isolation, and standardized response envelopes
 */

import { computeHasMore } from './normalizers';

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

// Clerk token getter — injected from AuthContext
// Initialize with safe default to prevent race condition on first load
let _getToken: (() => Promise<string | null>) | null = () => Promise.resolve('demo-init-pending');

/**
 * Set the auth token getter (called once from AuthContext initialization)
 */
export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  _getToken = getter;
}

// Get current session token via Clerk
async function getAuthToken(): Promise<string | null> {
  if (_getToken) {
    return _getToken();
  }
  // Fallback: try to import Clerk's useAuth if available in window context
  return null;
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

  if (!token) {
    throw {
      error: {
        code: 'UNAUTHORIZED',
        message: 'No active session. Please log in.',
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

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (options?.body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({
      error: { code: 'UNKNOWN', message: response.statusText },
      meta: { requestId: crypto.randomUUID() },
    }));
    throw errorBody as BffError;
  }

  const body = await response.json();

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
