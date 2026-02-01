/**
 * Batch Processing BFF Service
 * Handles bulk business submission, status polling, and result retrieval
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type { CreditScore, PrequalOffer } from './types';

// ============ Batch Types ============

export interface BatchBusinessInput {
  name: string;
  ein?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  ownerFirstName?: string;
  ownerLastName?: string;
  annualRevenue?: number;
  employeeCount?: number;
  yearFounded?: number;
  naicsCode?: string;
}

export interface BatchSubmitRequest {
  portfolioId: string;
  businesses: BatchBusinessInput[];
}

export type BatchJobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface BatchJob {
  id: string;
  status: BatchJobStatus;
  totalCount: number;
  processedCount: number;
  failedCount: number;
  startedAt?: string;
  completedAt?: string;
}

export interface BatchResultItem {
  businessId: string;
  businessName: string;
  status: 'scored' | 'recommended' | 'failed';
  score?: CreditScore;
  offers?: PrequalOffer[];
  error?: string;
}

// ============ Service ============

export const batchService = {
  /**
   * Submit a batch of businesses for processing
   */
  submit: async (
    portfolioId: string,
    businesses: BatchBusinessInput[]
  ): Promise<BffResponse<{ batchJobId: string; totalCount: number; status: 'queued' }>> => {
    return bffClient.post('/batch/submit', {
      portfolioId,
      body: { portfolioId, businesses },
    });
  },

  /**
   * Get batch job status (for polling)
   */
  getStatus: async (
    batchJobId: string
  ): Promise<BffResponse<BatchJob>> => {
    return bffClient.get(`/batch/${batchJobId}/status`);
  },

  /**
   * Get batch results (paginated)
   */
  getResults: async (
    batchJobId: string,
    params?: { page?: number; pageSize?: number }
  ): Promise<BffListResponse<BatchResultItem>> => {
    return bffClient.get(`/batch/${batchJobId}/results`, {
      params: {
        page: params?.page,
        pageSize: params?.pageSize,
      },
    });
  },
};

export default batchService;
