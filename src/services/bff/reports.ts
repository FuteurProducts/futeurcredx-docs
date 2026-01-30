/**
 * Reports BFF Service
 * Handles async report generation and polling
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type { ReportJob, CreateReportRequest, ReportType, ReportStatus } from './types';

export interface ReportFilters {
  reportType?: ReportType;
  status?: ReportStatus;
}

export interface ReportListParams extends ReportFilters {
  page?: number;
  pageSize?: number;
}

export const reportsService = {
  /**
   * List report jobs in a portfolio
   * Requires portfolioId (enforced server-side)
   */
  list: async (
    portfolioId: string,
    params?: ReportListParams
  ): Promise<BffListResponse<ReportJob>> => {
    return bffClient.get<BffListResponse<ReportJob>>('/reports', {
      portfolioId,
      params: {
        reportType: params?.reportType,
        status: params?.status,
        page: params?.page,
        pageSize: params?.pageSize,
      },
    });
  },

  /**
   * Get report job by ID (for polling status)
   */
  getById: async (
    portfolioId: string,
    reportId: string
  ): Promise<BffResponse<ReportJob>> => {
    return bffClient.get<BffResponse<ReportJob>>(
      `/reports/${reportId}`,
      { portfolioId }
    );
  },

  /**
   * Create a new report job (async)
   */
  create: async (
    portfolioId: string,
    request: CreateReportRequest
  ): Promise<BffResponse<ReportJob>> => {
    return bffClient.post<BffResponse<ReportJob>>('/reports', {
      portfolioId,
      body: request,
    });
  },

  /**
   * Download report artifact
   * Triggers REPORT_DOWNLOADED audit event server-side
   */
  download: async (
    portfolioId: string,
    reportId: string
  ): Promise<BffResponse<{ url: string; expiresAt: string }>> => {
    return bffClient.get(`/reports/${reportId}/download`, { portfolioId });
  },

  /**
   * Get available report templates
   */
  getTemplates: async (
    portfolioId: string
  ): Promise<BffResponse<{ id: string; name: string; description: string; type: ReportType }[]>> => {
    return bffClient.get('/reports/templates', { portfolioId });
  },
};

export default reportsService;
