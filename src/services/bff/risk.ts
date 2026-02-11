/**
 * Risk BFF Service
 * Handles risk monitoring and EWS operations
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type { RiskSummary, EWSAlert, RiskAggregate } from './types';
import { normalizeRiskSummary, normalizeEWSAlert, normalizeRiskAggregate } from './normalizers';

export interface EWSFilters {
  severity?: 'info' | 'warning' | 'critical';
  alertType?: string;
  acknowledged?: boolean;
}

export interface EWSListParams extends EWSFilters {
  page?: number;
  pageSize?: number;
}

export interface AggregateParams {
  dimension: 'industry' | 'segment' | 'riskTier' | 'state' | 'relationshipStage';
}

export const riskService = {
  /**
   * Get executive risk summary for a portfolio
   * Requires portfolioId (enforced server-side)
   */
  getSummary: async (
    portfolioId: string
  ): Promise<BffResponse<RiskSummary>> => {
    const response = await bffClient.get<BffResponse<RiskSummary>>('/risk/summary', {
      portfolioId,
    });

    return {
      ...response,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- API response shape converted to normalizer input
      data: normalizeRiskSummary(response.data as unknown as Record<string, unknown>),
    };
  },

  /**
   * Get EWS (Early Warning System) alerts queue
   */
  getEWSQueue: async (
    portfolioId: string,
    params?: EWSListParams
  ): Promise<BffListResponse<EWSAlert>> => {
    const response = await bffClient.get<BffListResponse<EWSAlert>>('/risk/ews', {
      portfolioId,
      params: {
        severity: params?.severity,
        alertType: params?.alertType,
        acknowledged: params?.acknowledged,
        page: params?.page,
        pageSize: params?.pageSize,
      },
    });

    // Normalize each alert through the normalizer layer
    return {
      ...response,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- API response shape converted to normalizer input
      data: response.data.map((a) => normalizeEWSAlert(a as unknown as Record<string, unknown>)),
    };
  },

  /**
   * Acknowledge an EWS alert
   */
  acknowledgeAlert: async (
    portfolioId: string,
    alertId: string,
    notes?: string
  ): Promise<BffResponse<EWSAlert>> => {
    const response = await bffClient.post<BffResponse<EWSAlert>>(
      `/risk/ews/${alertId}/acknowledge`,
      { portfolioId, body: { notes } }
    );

    return {
      ...response,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- API response shape converted to normalizer input
      data: normalizeEWSAlert(response.data as unknown as Record<string, unknown>),
    };
  },

  /**
   * Get risk aggregates by dimension
   */
  getAggregates: async (
    portfolioId: string,
    params: AggregateParams
  ): Promise<BffResponse<RiskAggregate[]>> => {
    const response = await bffClient.get<BffResponse<RiskAggregate[]>>('/risk/aggregates', {
      portfolioId,
      params: { dimension: params.dimension },
    });

    return {
      ...response,
      data: Array.isArray(response.data)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- API response shape converted to normalizer input
        ? response.data.map((a) => normalizeRiskAggregate(a as unknown as Record<string, unknown>))
        : [],
    };
  },

  /**
   * Get concentration risk analysis
   */
  getConcentration: async (
    portfolioId: string
  ): Promise<BffResponse<{
    byIndustry: { industry: string; exposure: number; percentage: number }[];
    byState: { state: string; exposure: number; percentage: number }[];
    byRiskTier: { tier: string; exposure: number; percentage: number }[];
  }>> => {
    return bffClient.get('/risk/concentration', { portfolioId });
  },

  /**
   * Get risk heatmap data
   */
  getHeatmap: async (
    portfolioId: string
  ): Promise<BffResponse<{
    rows: { label: string; cells: { value: number; count: number }[] }[];
    columnLabels: string[];
  }>> => {
    return bffClient.get('/risk/heatmap', { portfolioId });
  },

  /**
   * Get analytics funnel data
   */
  getFunnel: async (
    portfolioId: string
  ): Promise<BffResponse<{
    stages: { name: string; count: number; conversionRate: number }[];
    overall: { totalBusinesses: number; totalFunded: number; overallConversion: number };
  }>> => {
    return bffClient.get('/analytics/funnel', { portfolioId });
  },
};

export default riskService;
