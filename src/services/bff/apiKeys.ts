/**
 * API Keys BFF Service
 * Handles API key management and usage tracking
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type { ApiKey, CreateApiKeyRequest, ApiKeyUsage } from './types';

export interface ApiKeyFilters {
  environment?: 'development' | 'production';
  isActive?: boolean;
}

export interface ApiKeyListParams extends ApiKeyFilters {
  page?: number;
  pageSize?: number;
}

export const apiKeysService = {
  /**
   * List API keys for the tenant
   */
  list: async (
    params?: ApiKeyListParams
  ): Promise<BffListResponse<ApiKey>> => {
    return bffClient.get<BffListResponse<ApiKey>>('/api-keys', {
      params: {
        environment: params?.environment,
        isActive: params?.isActive,
        page: params?.page,
        pageSize: params?.pageSize,
      },
    });
  },

  /**
   * Get API key by ID
   */
  getById: async (
    keyId: string
  ): Promise<BffResponse<ApiKey>> => {
    return bffClient.get<BffResponse<ApiKey>>(`/api-keys/${keyId}`);
  },

  /**
   * Create a new API key
   * Returns the full key value ONCE (not stored after creation)
   */
  create: async (
    request: CreateApiKeyRequest
  ): Promise<BffResponse<ApiKey & { keyValue: string }>> => {
    return bffClient.post<BffResponse<ApiKey & { keyValue: string }>>('/api-keys', {
      body: request,
    });
  },

  /**
   * Revoke an API key
   */
  revoke: async (
    keyId: string
  ): Promise<BffResponse<ApiKey>> => {
    return bffClient.delete<BffResponse<ApiKey>>(`/api-keys/${keyId}`);
  },

  /**
   * Get usage statistics for an API key
   */
  getUsage: async (
    keyId: string,
    params?: { startDate?: string; endDate?: string }
  ): Promise<BffResponse<ApiKeyUsage>> => {
    return bffClient.get<BffResponse<ApiKeyUsage>>(`/api-keys/${keyId}/usage`, {
      params: {
        startDate: params?.startDate,
        endDate: params?.endDate,
      },
    });
  },

  /**
   * Get aggregate usage stats for all keys
   */
  getAggregateUsage: async (
    params?: { startDate?: string; endDate?: string }
  ): Promise<BffResponse<{
    totalCalls: number;
    successRate: number;
    avgLatencyMs: number;
    topEndpoints: { endpoint: string; count: number }[];
  }>> => {
    return bffClient.get('/api-keys/usage', {
      params: {
        startDate: params?.startDate,
        endDate: params?.endDate,
      },
    });
  },
};

export default apiKeysService;
