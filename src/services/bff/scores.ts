/**
 * Scores BFF Service
 * Handles credit score operations with data lineage
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type { CreditScore, ScorePullRequest, ScorePullResponse, ScoreSource } from './types';

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
    return bffClient.get<BffListResponse<CreditScore>>('/scores', {
      portfolioId,
      params: {
        smbEntityId: params?.smbEntityId,
        source: params?.source,
        minScore: params?.minScore,
        maxScore: params?.maxScore,
        riskClass: params?.riskClass,
        page: params?.page,
        pageSize: params?.pageSize,
      },
    });
  },

  /**
   * Get score by ID with lineage info
   */
  getById: async (
    portfolioId: string,
    scoreId: string
  ): Promise<BffResponse<CreditScore>> => {
    return bffClient.get<BffResponse<CreditScore>>(
      `/scores/${scoreId}`,
      { portfolioId }
    );
  },

  /**
   * Request a new credit pull
   * Triggers SOFT_PULL_REQUESTED audit event server-side
   */
  pull: async (
    portfolioId: string,
    request: ScorePullRequest
  ): Promise<BffResponse<ScorePullResponse>> => {
    return bffClient.post<BffResponse<ScorePullResponse>>('/scores/pull', {
      portfolioId,
      body: request,
    });
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
      params: { source },
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
