/**
 * Scores BFF Service
 * Handles credit score operations with data lineage
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type { CreditScore, ScorePullRequest, ScorePullResponse, ScoreSource } from './types';
import { normalizeScore, mapScoreSourceToApi } from './normalizers';

export interface ScoreFilters {
  smbEntityId?: string;
  source?: ScoreSource;
  minScore?: number;
  maxScore?: number;
  riskClass?: string;
}

export interface ScoreListParams extends ScoreFilters {
  page?: number;
  pageSize?: number;
}

export const scoresService = {
  /**
   * List credit scores in a portfolio
   * Requires portfolioId (enforced server-side)
   */
  list: async (
    portfolioId: string,
    params?: ScoreListParams
  ): Promise<BffListResponse<CreditScore>> => {
    const response = await bffClient.get<BffListResponse<CreditScore>>('/scores', {
      portfolioId,
      params: {
        smbEntityId: params?.smbEntityId,
        source: params?.source ? mapScoreSourceToApi(params.source) : undefined,
        minScore: params?.minScore,
        maxScore: params?.maxScore,
        riskClass: params?.riskClass,
        page: params?.page,
        pageSize: params?.pageSize,
      },
    });

    // Normalize each score through the normalizer layer
    return {
      ...response,
      data: response.data.map((s) => normalizeScore(s as unknown as Record<string, unknown>)),
    };
  },

  /**
   * Get score by ID with lineage info
   */
  getById: async (
    portfolioId: string,
    scoreId: string
  ): Promise<BffResponse<CreditScore>> => {
    const response = await bffClient.get<BffResponse<CreditScore>>(
      `/scores/${scoreId}`,
      { portfolioId }
    );

    return {
      ...response,
      data: normalizeScore(response.data as unknown as Record<string, unknown>),
    };
  },

  /**
   * Request a new credit pull
   * Triggers SOFT_PULL_REQUESTED audit event server-side
   */
  pull: async (
    portfolioId: string,
    request: ScorePullRequest
  ): Promise<BffResponse<ScorePullResponse>> => {
    // Map Dashboard source enum to API enum before sending
    const apiRequest = {
      ...request,
      source: mapScoreSourceToApi(request.source),
    };

    const response = await bffClient.post<BffResponse<ScorePullResponse>>('/scores/pull', {
      portfolioId,
      body: apiRequest,
    });

    // Normalize the returned score
    if (response.data?.score) {
      response.data.score = normalizeScore(response.data.score as unknown as Record<string, unknown>);
    }

    return response;
  },

  /**
   * Get score distribution for a portfolio
   */
  getDistribution: async (
    portfolioId: string,
    source?: ScoreSource
  ): Promise<BffResponse<{ ranges: { min: number; max: number; count: number }[] }>> => {
    return bffClient.get('/scores/distribution', {
      portfolioId,
      params: { source: source ? mapScoreSourceToApi(source) : undefined },
    });
  },

  /**
   * Get multi-bureau status for an entity
   */
  getMultiBureauStatus: async (
    portfolioId: string,
    smbEntityId: string
  ): Promise<BffResponse<Record<ScoreSource, { score?: number; lastPulled?: string; status: string }>>> => {
    return bffClient.get(`/scores/bureau-status/${smbEntityId}`, {
      portfolioId,
    });
  },
};

export default scoresService;
