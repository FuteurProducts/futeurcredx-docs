/**
 * Analytics BFF Service
 * Handles portfolio analytics and insights
 */

import bffClient, { BffResponse } from './client';
import type {
  PortfolioKPI,
  IndustrySegment,
  ScoreBucket,
  ScoreMigrationMatrix,
  GeographicDistribution,
  RiskTierDistribution,
} from './types';

export const analyticsService = {
  /**
   * Get portfolio KPIs
   * Requires portfolioId (enforced server-side)
   */
  getKPIs: async (
    portfolioId: string,
    timeWindow?: string
  ): Promise<BffResponse<PortfolioKPI[]>> => {
    return bffClient.get<BffResponse<PortfolioKPI[]>>('/analytics/kpis', {
      portfolioId,
      params: {
        timeWindow,
      },
    });
  },

  /**
   * Get industry segments breakdown
   */
  getSegments: async (
    portfolioId: string
  ): Promise<BffResponse<IndustrySegment[]>> => {
    return bffClient.get<BffResponse<IndustrySegment[]>>('/analytics/segments', {
      portfolioId,
    });
  },

  /**
   * Get credit score distribution
   */
  getScoreDistribution: async (
    portfolioId: string
  ): Promise<BffResponse<ScoreBucket[]>> => {
    return bffClient.get<BffResponse<ScoreBucket[]>>('/analytics/score-distribution', {
      portfolioId,
    });
  },

  /**
   * Get score migration matrix
   */
  getScoreMigration: async (
    portfolioId: string,
    period?: string
  ): Promise<BffResponse<ScoreMigrationMatrix>> => {
    return bffClient.get<BffResponse<ScoreMigrationMatrix>>('/analytics/score-migration', {
      portfolioId,
      params: {
        period,
      },
    });
  },

  /**
   * Get geographic distribution
   */
  getGeography: async (
    portfolioId: string
  ): Promise<BffResponse<GeographicDistribution[]>> => {
    return bffClient.get<BffResponse<GeographicDistribution[]>>('/analytics/geography', {
      portfolioId,
    });
  },

  /**
   * Get risk tier distribution
   */
  getRiskTiers: async (
    portfolioId: string
  ): Promise<BffResponse<RiskTierDistribution[]>> => {
    return bffClient.get<BffResponse<RiskTierDistribution[]>>('/analytics/risk-tiers', {
      portfolioId,
    });
  },
};

export default analyticsService;
