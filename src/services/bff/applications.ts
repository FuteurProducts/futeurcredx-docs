/**
 * Applications BFF Service
 * Handles application workflow operations
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type { Application, SubmitApplicationRequest, ApplicationStatus } from './types';

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
    return bffClient.get<BffListResponse<Application>>('/applications', {
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
  },

  /**
   * Get application by ID with full details
   */
  getById: async (
    portfolioId: string,
    applicationId: string
  ): Promise<BffResponse<Application>> => {
    return bffClient.get<BffResponse<Application>>(
      `/applications/${applicationId}`,
      { portfolioId }
    );
  },

  /**
   * Submit a new application (one-tap from offer or fresh)
   */
  submit: async (
    portfolioId: string,
    request: SubmitApplicationRequest
  ): Promise<BffResponse<Application>> => {
    return bffClient.post<BffResponse<Application>>('/applications', {
      portfolioId,
      body: request,
    });
  },

  /**
   * Update application status (for underwriters)
   */
  updateStatus: async (
    portfolioId: string,
    applicationId: string,
    status: ApplicationStatus,
    decisionData?: Record<string, unknown>
  ): Promise<BffResponse<Application>> => {
    return bffClient.patch<BffResponse<Application>>(
      `/applications/${applicationId}`,
      {
        portfolioId,
        body: { status, decisionData },
      }
    );
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
