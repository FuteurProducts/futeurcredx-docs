/**
 * Dashboard Service
 * Handles API keys management and dashboard statistics
 */

import apiService from './api';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed?: string;
  callsUsed: number;
  isActive: boolean;
  createdAt: string;
  scopes?: string[];
  expiresInDays?: number;
  ipWhitelist?: string[];
  geoRestrictions?: string[];
}

export interface ApiKeyConfig {
  scopes: string[];
  expiresInDays: number;
  ipWhitelist: string[];
  geoRestrictions: string[];
}

export interface ApiStats {
  totalCalls: number;
  monthlyLimit: number;
  plan: string;
  thisMonth: number;
  lastMonth: number;
  growth: number;
}

export interface ApiKeyResponse {
  apiKeys: ApiKey[];
}

export interface CreateApiKeyRequest {
  name: string;
  scopes?: string[];
  expiresInDays?: number;
  ipWhitelist?: string[];
  geoRestrictions?: string[];
}

export interface ApiKeyError {
  message: string;
  code?: string;
  field?: string;
}

class DashboardService {
  private readonly MOCK_MODE = import.meta.env.VITE_USE_MOCK_AUTH === 'true' || import.meta.env.DEV;

  /**
   * Get all API keys for the current user
   */
  async getApiKeys(): Promise<ApiKey[]> {
    if (this.MOCK_MODE) {
      return this.mockGetApiKeys();
    }

    try {
      const response = await apiService.get<ApiKeyResponse>('/api/v1/api-keys');
      return response.data.apiKeys || [];
    } catch (error: any) {
      throw this.handleApiKeyError(error);
    }
  }

  /**
   * Create a new API key
   */
  async createApiKey(request: CreateApiKeyRequest): Promise<ApiKey> {
    if (this.MOCK_MODE) {
      return this.mockCreateApiKey(request);
    }

    try {
      const response = await apiService.post<ApiKey>('/api/v1/api-keys', request);
      return response.data;
    } catch (error: any) {
      throw this.handleApiKeyError(error);
    }
  }

  /**
   * Revoke an API key
   */
  async revokeApiKey(keyId: string): Promise<void> {
    if (this.MOCK_MODE) {
      return this.mockRevokeApiKey(keyId);
    }

    try {
      await apiService.delete(`/api/v1/api-keys/${keyId}`);
    } catch (error: any) {
      throw this.handleApiKeyError(error);
    }
  }

  /**
   * Get API usage statistics
   */
  async getApiStats(): Promise<ApiStats> {
    if (this.MOCK_MODE) {
      return this.mockGetApiStats();
    }

    try {
      const response = await apiService.get<ApiStats>('/api/v1/api-keys/stats');
      return response.data;
    } catch (error: any) {
      // Return default stats on error
      console.error('Failed to fetch API stats:', error);
      return {
        totalCalls: 0,
        monthlyLimit: 10000,
        plan: 'Free',
        thisMonth: 0,
        lastMonth: 0,
        growth: 0,
      };
    }
  }

  /**
   * Get detailed information about a specific API key
   */
  async getApiKeyDetails(keyId: string): Promise<ApiKey> {
    if (this.MOCK_MODE) {
      return this.mockGetApiKeyDetails(keyId);
    }

    try {
      const response = await apiService.get<ApiKey>(`/api/v1/api-keys/${keyId}`);
      return response.data;
    } catch (error: any) {
      throw this.handleApiKeyError(error);
    }
  }

  /**
   * Test an API endpoint
   */
  async testApiEndpoint(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    data?: any,
    apiKey?: string
  ): Promise<any> {
    // Set API key for this request if provided
    if (apiKey) {
      apiService.setApiKey(apiKey);
    }

    try {
      let response;
      switch (method) {
        case 'GET':
          response = await apiService.get(endpoint);
          break;
        case 'POST':
          response = await apiService.post(endpoint, data);
          break;
        case 'PUT':
          response = await apiService.put(endpoint, data);
          break;
        case 'DELETE':
          response = await apiService.delete(endpoint);
          break;
        case 'PATCH':
          response = await apiService.patch(endpoint, data);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      return response.data;
    } catch (error: any) {
      throw this.handleApiKeyError(error);
    } finally {
      // Clear API key after request
      if (apiKey) {
        apiService.setApiKey(null);
      }
    }
  }

  /**
   * Get business insights with optional filters
   */
  async getBusinessInsights(filters?: {
    search?: string;
    limit?: number;
    page?: number;
    order?: 'asc' | 'desc';
    hasRecommendation?: boolean;
    hasScore?: boolean;
    hasApplications?: boolean;
  }): Promise<{ 
    data: any[]; 
    metadata?: {
      totalDocs: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      currentPage: number;
      totalDocsInPage: number;
    };
    total?: number;
    page?: number;
    limit?: number;
  }> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.search) {
        params.append('search', filters.search);
      }
      if (filters?.limit !== undefined) {
        params.append('limit', String(filters.limit));
      }
      if (filters?.page !== undefined) {
        params.append('page', String(filters.page));
      }
      if (filters?.order) {
        params.append('order', filters.order);
      }
      if (filters?.hasRecommendation !== undefined) {
        params.append('hasRecommendations', String(filters.hasRecommendation));
      }
      if (filters?.hasScore !== undefined) {
        params.append('hasScore', String(filters.hasScore));
      }
      if (filters?.hasApplications !== undefined) {
        params.append('hasApplications', String(filters.hasApplications));
      }
      
      const queryString = params.toString();
      const endpoint = `/api/v1/businesses/insights${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiService.get<{ 
        data: any[]; 
        metadata?: {
          totalDocs: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          currentPage: number;
          totalDocsInPage: number;
        };
      }>(endpoint);
      
      // Return with metadata and also set total for backward compatibility
      return {
        ...response.data,
        total: response.data.metadata?.totalDocs,
        page: response.data.metadata?.currentPage,
        limit: response.data.metadata?.totalDocsInPage,
      };
    } catch (error: any) {
      console.error('Failed to fetch business insights:', error);
      throw this.handleApiKeyError(error);
    }
  }

  /**
   * Get application statistics
   */
  async getApplicationStats(): Promise<any> {
    try {
      const response = await apiService.get<any>('/api/v1/recommendations/applications/stats');
      // API returns { message: "...", data: { totalBusinesses, totalApplications, ... } }
      // Return the nested data property if it exists, otherwise return the full response
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Failed to fetch application stats:', error);
      throw this.handleApiKeyError(error);
    }
  }

  /**
   * Get applications for a specific business
   */
  async getBusinessApplications(businessId: string): Promise<any[]> {
    try {
      const response = await apiService.get<{ data: any[] }>(`/api/v1/recommendations/${businessId}/applications`);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Failed to fetch business applications:', error);
      throw this.handleApiKeyError(error);
    }
  }

  /**
   * Handle API key related errors
   */
  private handleApiKeyError(error: any): ApiKeyError {
    if (error.status === 401) {
      return {
        message: 'Authentication failed. Please sign in again.',
        code: 'UNAUTHORIZED'
      };
    } else if (error.status === 403) {
      return {
        message: 'Access forbidden. Please check your permissions.',
        code: 'FORBIDDEN'
      };
    } else if (error.status === 404) {
      return {
        message: 'API key not found.',
        code: 'NOT_FOUND'
      };
    } else if (error.status === 409) {
      return {
        message: 'API key name already exists.',
        code: 'CONFLICT',
        field: 'name'
      };
    } else if (error.status === 422) {
      return {
        message: error.data?.message || 'Validation failed',
        code: 'VALIDATION_ERROR',
        field: error.data?.field
      };
    } else if (error.status === 0) {
      return {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR'
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  // Mock implementations for development/testing
  private async mockGetApiKeys(): Promise<ApiKey[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const keys = JSON.parse(localStorage.getItem('mockApiKeys') || '[]');
    return keys;
  }

  private async mockCreateApiKey(request: CreateApiKeyRequest): Promise<ApiKey> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newApiKey: ApiKey = {
      id: `key_${Date.now()}`,
      name: request.name,
      key: `sk_test_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      callsUsed: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      scopes: request.scopes,
      expiresInDays: request.expiresInDays,
      ipWhitelist: request.ipWhitelist,
      geoRestrictions: request.geoRestrictions,
    };

    // Save to localStorage
    const currentKeys = JSON.parse(localStorage.getItem('mockApiKeys') || '[]');
    currentKeys.push(newApiKey);
    localStorage.setItem('mockApiKeys', JSON.stringify(currentKeys));

    return newApiKey;
  }

  private async mockRevokeApiKey(keyId: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Remove from localStorage
    const currentKeys = JSON.parse(localStorage.getItem('mockApiKeys') || '[]');
    const updatedKeys = currentKeys.filter((key: ApiKey) => key.id !== keyId);
    localStorage.setItem('mockApiKeys', JSON.stringify(updatedKeys));
  }

  private async mockGetApiStats(): Promise<ApiStats> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const keys = JSON.parse(localStorage.getItem('mockApiKeys') || '[]');
    const totalCalls = keys.reduce((sum: number, key: ApiKey) => sum + (key.callsUsed || 0), 0);

    return {
      totalCalls,
      monthlyLimit: 10000,
      plan: 'Free',
      thisMonth: totalCalls,
      lastMonth: Math.floor(totalCalls * 0.8),
      growth: 25,
    };
  }

  private async mockGetApiKeyDetails(keyId: string): Promise<ApiKey> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const keys = JSON.parse(localStorage.getItem('mockApiKeys') || '[]');
    const key = keys.find((k: ApiKey) => k.id === keyId);

    if (!key) {
      throw {
        message: 'API key not found',
        code: 'NOT_FOUND'
      };
    }

    return key;
  }
}

// Create and export singleton instance
const dashboardService = new DashboardService();
export default dashboardService;
