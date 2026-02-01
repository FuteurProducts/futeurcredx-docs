/**
 * Applications BFF Service
 * Handles application workflow operations
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type { Application, SubmitApplicationRequest, ApplicationStatus } from './types';
import { normalizeApplication, mapAppStatusToApi } from './normalizers';

export interface ApplicationFilters {
  smbEntityId?: string;
  status?: ApplicationStatus;
  offerId?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface ApplicationListParams extends ApplicationFilters {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export const applicationsService = {
  /**
   * List applications in a portfolio
   * Requires portfolioId (enforced server-side)
   */
  list: async (
    portfolioId: string,
    params?: ApplicationListParams
  ): Promise<BffListResponse<Application>> => {
    const response = await bffClient.get<BffListResponse<Application>>('/applications', {
      portfolioId,
      params: {
        smbEntityId: params?.smbEntityId,
        status: params?.status,
        offerId: params?.offerId,
        minAmount: params?.minAmount,
        maxAmount: params?.maxAmount,
        page: params?.page,
        pageSize: params?.pageSize,
        sortField: params?.sortField,
        sortDirection: params?.sortDirection,
      },
    });

    // Normalize each application through the normalizer layer
    return {
      ...response,
      data: response.data.map((a) => normalizeApplication(a as unknown as Record<string, unknown>)),
    };
  },

  /**
   * Get application by ID with full details
   */
  getById: async (
    portfolioId: string,
    applicationId: string
  ): Promise<BffResponse<Application>> => {
    const response = await bffClient.get<BffResponse<Application>>(
      `/applications/${applicationId}`,
      { portfolioId }
    );

    return {
      ...response,
      data: normalizeApplication(response.data as unknown as Record<string, unknown>),
    };
  },

  /**
   * Submit a new application (one-tap from offer or fresh)
   */
  submit: async (
    portfolioId: string,
    request: SubmitApplicationRequest
  ): Promise<BffResponse<Application>> => {
    const response = await bffClient.post<BffResponse<Application>>('/applications', {
      portfolioId,
      body: request,
    });

    return {
      ...response,
      data: normalizeApplication(response.data as unknown as Record<string, unknown>),
    };
  },

  /**
   * Update application status (for underwriters)
   * Uses PATCH per API contract (PATCH /applications/:id)
   */
  updateStatus: async (
    portfolioId: string,
    applicationId: string,
    status: ApplicationStatus,
    decisionData?: Record<string, unknown>
  ): Promise<BffResponse<Application>> => {
    // Map Dashboard status to API status
    const apiStatus = mapAppStatusToApi(status);

    const response = await bffClient.patch<BffResponse<Application>>(
      `/applications/${applicationId}`,
      {
        portfolioId,
        body: { status: apiStatus, decisionData },
      }
    );

    return {
      ...response,
      data: normalizeApplication(response.data as unknown as Record<string, unknown>),
    };
  },

  /**
   * Get application pipeline stats
   */
  getPipelineStats: async (
    portfolioId: string
  ): Promise<BffResponse<Record<ApplicationStatus, number>>> => {
    return bffClient.get('/applications/pipeline', { portfolioId });
  },
};

export default applicationsService;
