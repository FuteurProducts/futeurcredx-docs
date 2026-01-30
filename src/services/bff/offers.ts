/**
 * Offers BFF Service
 * Handles prequal offer operations
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type { PrequalOffer, GenerateOfferRequest, OfferStatus } from './types';

export interface OfferFilters {
  smbEntityId?: string;
  productType?: string;
  status?: OfferStatus;
  minAmount?: number;
  maxAmount?: number;
}

export interface OfferListParams extends OfferFilters {
  page?: number;
  pageSize?: number;
}

export const offersService = {
  /**
   * List prequal offers in a portfolio
   * Requires portfolioId (enforced server-side)
   */
  list: async (
    portfolioId: string,
    params?: OfferListParams
  ): Promise<BffListResponse<PrequalOffer>> => {
    return bffClient.get<BffListResponse<PrequalOffer>>('/offers', {
      portfolioId,
      params: {
        smbEntityId: params?.smbEntityId,
        productType: params?.productType,
        status: params?.status,
        minAmount: params?.minAmount,
        maxAmount: params?.maxAmount,
        page: params?.page,
        pageSize: params?.pageSize,
      },
    });
  },

  /**
   * Get offer by ID
   */
  getById: async (
    portfolioId: string,
    offerId: string
  ): Promise<BffResponse<PrequalOffer>> => {
    return bffClient.get<BffResponse<PrequalOffer>>(
      `/offers/${offerId}`,
      { portfolioId }
    );
  },

  /**
   * Generate a new prequal offer
   */
  generate: async (
    portfolioId: string,
    request: GenerateOfferRequest
  ): Promise<BffResponse<PrequalOffer>> => {
    return bffClient.post<BffResponse<PrequalOffer>>('/offers', {
      portfolioId,
      body: request,
    });
  },

  /**
   * Accept an offer (creates application)
   */
  accept: async (
    portfolioId: string,
    offerId: string
  ): Promise<BffResponse<{ applicationId: string }>> => {
    return bffClient.post<BffResponse<{ applicationId: string }>>(
      `/offers/${offerId}/accept`,
      { portfolioId }
    );
  },

  /**
   * Decline an offer
   */
  decline: async (
    portfolioId: string,
    offerId: string,
    reason?: string
  ): Promise<BffResponse<PrequalOffer>> => {
    return bffClient.post<BffResponse<PrequalOffer>>(
      `/offers/${offerId}/decline`,
      { portfolioId, body: { reason } }
    );
  },
};

export default offersService;
