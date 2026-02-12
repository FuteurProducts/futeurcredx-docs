/**
 * Underwriting BFF Service
 * Handles underwriting queue and decision workflow operations
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type {
  UnderwritingQueueItem,
  UnderwritingKPIs,
  UnderwritingRules,
  MakeDecisionRequest,
  SLAStatus,
} from './types';

export interface UnderwritingFilters {
  slaStatus?: SLAStatus;
  risk?: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  assignedTo?: string;
}

export interface UnderwritingQueueParams extends UnderwritingFilters {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export const underwritingService = {
  /**
   * Get underwriting queue items
   * Requires portfolioId (enforced server-side)
   */
  getQueue: async (
    portfolioId: string,
    params?: UnderwritingQueueParams
  ): Promise<BffListResponse<UnderwritingQueueItem>> => {
    return bffClient.get<BffListResponse<UnderwritingQueueItem>>('/underwriting/queue', {
      portfolioId,
      params: {
        slaStatus: params?.slaStatus,
        risk: params?.risk,
        assignedTo: params?.assignedTo,
        page: params?.page,
        pageSize: params?.pageSize,
        sortField: params?.sortField,
        sortDirection: params?.sortDirection,
      },
    });
  },

  /**
   * Get underwriting KPIs
   */
  getKPIs: async (portfolioId: string): Promise<BffResponse<UnderwritingKPIs>> => {
    return bffClient.get<BffResponse<UnderwritingKPIs>>('/underwriting/kpis', {
      portfolioId,
    });
  },

  /**
   * Get underwriting rules (auto-approve/auto-decline criteria)
   */
  getRules: async (portfolioId: string): Promise<BffResponse<UnderwritingRules>> => {
    return bffClient.get<BffResponse<UnderwritingRules>>('/underwriting/rules', {
      portfolioId,
    });
  },

  /**
   * Make an underwriting decision
   */
  makeDecision: async (
    portfolioId: string,
    queueItemId: string,
    request: MakeDecisionRequest
  ): Promise<BffResponse<UnderwritingQueueItem>> => {
    return bffClient.post<BffResponse<UnderwritingQueueItem>>(
      `/underwriting/queue/${queueItemId}/decision`,
      {
        portfolioId,
        body: request,
      }
    );
  },

  /**
   * Assign a queue item to an underwriter
   */
  assign: async (
    portfolioId: string,
    queueItemId: string,
    assignedTo: string
  ): Promise<BffResponse<UnderwritingQueueItem>> => {
    return bffClient.patch<BffResponse<UnderwritingQueueItem>>(
      `/underwriting/queue/${queueItemId}`,
      {
        portfolioId,
        body: { assignedTo },
      }
    );
  },
};

export default underwritingService;
