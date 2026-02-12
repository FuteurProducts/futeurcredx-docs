/**
 * Portfolios BFF Service
 * Handles portfolio operations and access control
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type { Portfolio, PortfolioAccess, PortfolioSummary, CreatePortfolioRequest } from './types';

export const portfoliosService = {
  /**
   * List all portfolios for the current tenant
   */
  list: async (
    portfolioId: string
  ): Promise<BffListResponse<Portfolio>> => {
    return bffClient.get<BffListResponse<Portfolio>>('/portfolios', {
      portfolioId,
    });
  },

  /**
   * Get portfolio by ID
   */
  getById: async (
    portfolioId: string,
    id: string
  ): Promise<BffResponse<Portfolio>> => {
    return bffClient.get<BffResponse<Portfolio>>(
      `/portfolios/${id}`,
      { portfolioId }
    );
  },

  /**
   * Create a new portfolio
   */
  create: async (
    portfolioId: string,
    request: CreatePortfolioRequest
  ): Promise<BffResponse<Portfolio>> => {
    return bffClient.post<BffResponse<Portfolio>>('/portfolios', {
      portfolioId,
      body: request,
    });
  },

  /**
   * Get portfolio summary with aggregated metrics
   */
  getSummary: async (
    portfolioId: string
  ): Promise<BffResponse<PortfolioSummary>> => {
    return bffClient.get<BffResponse<PortfolioSummary>>(
      '/portfolios/summary',
      { portfolioId }
    );
  },

  /**
   * List access grants for a portfolio
   */
  listAccess: async (
    portfolioId: string
  ): Promise<BffListResponse<PortfolioAccess>> => {
    return bffClient.get<BffListResponse<PortfolioAccess>>(
      '/portfolios/access',
      { portfolioId }
    );
  },

  /**
   * Grant access to a user for a portfolio
   */
  grantAccess: async (
    portfolioId: string,
    userId: string,
    role: 'viewer' | 'analyst' | 'manager' | 'admin'
  ): Promise<BffResponse<PortfolioAccess>> => {
    return bffClient.post<BffResponse<PortfolioAccess>>('/portfolios/access', {
      portfolioId,
      body: { userId, role },
    });
  },
};

export default portfoliosService;
