/**
 * Customers BFF Service
 * Handles SMB entity/customer operations
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type { SmbEntity, CustomerDossier } from './types';

export interface CustomerFilters {
  search?: string;
  segment?: string;
  riskTier?: string;
  relationshipStage?: string;
  industry?: string;
  state?: string;
}

export interface CustomerListParams extends CustomerFilters {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export const customersService = {
  /**
   * List customers in a portfolio with filters and pagination
   * Requires portfolioId (enforced server-side)
   */
  list: async (
    portfolioId: string,
    params?: CustomerListParams
  ): Promise<BffListResponse<SmbEntity>> => {
    return bffClient.get<BffListResponse<SmbEntity>>('/customers', {
      portfolioId,
      params: {
        search: params?.search,
        segment: params?.segment,
        riskTier: params?.riskTier,
        relationshipStage: params?.relationshipStage,
        industry: params?.industry,
        state: params?.state,
        page: params?.page,
        pageSize: params?.pageSize,
        sortField: params?.sortField,
        sortDirection: params?.sortDirection,
      },
    });
  },

  /**
   * Get customer dossier with full details
   * Triggers VIEW_PII audit event server-side
   */
  getDossier: async (
    portfolioId: string,
    customerId: string
  ): Promise<BffResponse<CustomerDossier>> => {
    return bffClient.get<BffResponse<CustomerDossier>>(
      `/customers/${customerId}`,
      { portfolioId }
    );
  },

  /**
   * Get customer lifecycle distribution for pipeline view
   */
  getLifecycleDistribution: async (
    portfolioId: string
  ): Promise<BffResponse<Record<string, number>>> => {
    return bffClient.get<BffResponse<Record<string, number>>>(
      '/customers/lifecycle',
      { portfolioId }
    );
  },

  /**
   * Get relationship health metrics
   */
  getHealthMetrics: async (
    portfolioId: string
  ): Promise<BffResponse<{
    avgRHS: number;
    rhsTrend: number;
    growingCount: number;
    atRiskCount: number;
    crossSellPenetration: number;
  }>> => {
    return bffClient.get('/customers/health', { portfolioId });
  },
};

export default customersService;
