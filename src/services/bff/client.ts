/**
 * BFF API Client
 * Base client for all Backend-for-Frontend edge function calls
 * Handles auth, tenant isolation, and standardized response envelopes
 */

import { supabase } from '@/integrations/supabase/client';

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

// Get current session token
async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
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

  // Build URL with portfolioId as mandatory query param for most endpoints
  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
  let url = `${baseUrl}${endpoint}`;

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
  // Edge functions wrap responses in { success, data, meta } — unwrap to match BFF types
  if ('success' in body && body.success === true) {
    return { data: body.data, meta: body.meta, ...(body.pagination ? { pagination: body.pagination } : {}) } as T;
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
