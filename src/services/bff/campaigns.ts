/**
 * Campaigns BFF Service
 * Handles campaign management and conversion tracking operations
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type {
  Campaign,
  CampaignSummary,
  ConversionBySegment,
  CreateCampaignRequest,
  CampaignStatus,
} from './types';

export interface CampaignFilters {
  status?: CampaignStatus;
  product?: string;
  targetSegment?: string;
  owner?: string;
}

export interface CampaignListParams extends CampaignFilters {
  page?: number;
  pageSize?: number;
}

export const campaignsService = {
  /**
   * List campaigns for a portfolio
   * Requires portfolioId (enforced server-side)
   */
  list: async (
    portfolioId: string,
    params?: CampaignListParams
  ): Promise<BffListResponse<Campaign>> => {
    return bffClient.get<BffListResponse<Campaign>>('/campaigns', {
      portfolioId,
      params: {
        status: params?.status,
        product: params?.product,
        targetSegment: params?.targetSegment,
        owner: params?.owner,
        page: params?.page,
        pageSize: params?.pageSize,
      },
    });
  },

  /**
   * Get a single campaign by ID
   */
  getById: async (
    portfolioId: string,
    campaignId: string
  ): Promise<BffResponse<Campaign>> => {
    return bffClient.get<BffResponse<Campaign>>(`/campaigns/${campaignId}`, {
      portfolioId,
    });
  },

  /**
   * Get campaign summary for a portfolio
   */
  getSummary: async (
    portfolioId: string
  ): Promise<BffResponse<CampaignSummary>> => {
    return bffClient.get<BffResponse<CampaignSummary>>('/campaigns/summary', {
      portfolioId,
    });
  },

  /**
   * Get conversion rates by segment
   */
  getConversionBySegment: async (
    portfolioId: string
  ): Promise<BffResponse<ConversionBySegment[]>> => {
    return bffClient.get<BffResponse<ConversionBySegment[]>>('/campaigns/conversion-by-segment', {
      portfolioId,
    });
  },

  /**
   * Create a new campaign
   */
  create: async (
    portfolioId: string,
    request: CreateCampaignRequest
  ): Promise<BffResponse<Campaign>> => {
    return bffClient.post<BffResponse<Campaign>>('/campaigns', {
      portfolioId,
      body: request,
    });
  },
};

export default campaignsService;
