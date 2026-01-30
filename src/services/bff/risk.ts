/**
 * Risk BFF Service
 * Handles risk monitoring and EWS operations
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type { RiskSummary, EWSAlert, RiskAggregate } from './types';

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
    return bffClient.get<BffResponse<RiskSummary>>('/risk/summary', {
      portfolioId,
    });
  },

  /**
   * Get EWS (Early Warning System) alerts queue
   */
  getEWSQueue: async (
    portfolioId: string,
    params?: EWSListParams
  ): Promise<BffListResponse<EWSAlert>> => {
    return bffClient.get<BffListResponse<EWSAlert>>('/risk/ews', {
      portfolioId,
      params: {
        severity: params?.severity,
        alertType: params?.alertType,
        acknowledged: params?.acknowledged,
        page: params?.page,
        pageSize: params?.pageSize,
      },
    });
  },

  /**
   * Acknowledge an EWS alert
   */
  acknowledgeAlert: async (
    portfolioId: string,
    alertId: string,
    notes?: string
  ): Promise<BffResponse<EWSAlert>> => {
    return bffClient.post<BffResponse<EWSAlert>>(
      `/risk/ews/${alertId}/acknowledge`,
      { portfolioId, body: { notes } }
    );
  },

  /**
   * Get risk aggregates by dimension
   */
  getAggregates: async (
    portfolioId: string,
    params: AggregateParams
  ): Promise<BffResponse<RiskAggregate[]>> => {
    return bffClient.get<BffResponse<RiskAggregate[]>>('/risk/aggregates', {
      portfolioId,
      params: { dimension: params.dimension },
    });
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
};

export default riskService;
