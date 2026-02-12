/**
 * Products BFF Service
 * Handles bank product operations, penetration, performance, eligibility, and pre-qual readiness
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type {
  BankProduct,
  ProductPenetration,
  SegmentPenetration,
  ProductPerformance,
  EligibilityRule,
  PreQualReadiness,
  PreQualCandidate,
  ProductFamily,
  ProductStatus,
  EligibilityTier,
} from './types';

export interface ProductFilters {
  family?: ProductFamily;
  status?: ProductStatus;
  eligibilityTier?: EligibilityTier;
}

export interface ProductListParams extends ProductFilters {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PreQualCandidateParams {
  product?: string;
  page?: number;
  pageSize?: number;
}

export const productsService = {
  /**
   * List products in a portfolio with filters and pagination
   * Requires portfolioId (enforced server-side)
   */
  list: async (
    portfolioId: string,
    params?: ProductListParams
  ): Promise<BffListResponse<BankProduct>> => {
    return bffClient.get<BffListResponse<BankProduct>>('/products', {
      portfolioId,
      params: {
        family: params?.family,
        status: params?.status,
        eligibilityTier: params?.eligibilityTier,
        page: params?.page,
        pageSize: params?.pageSize,
        sortField: params?.sortField,
        sortDirection: params?.sortDirection,
      },
    });
  },

  /**
   * Get product by ID with full details
   */
  getById: async (
    portfolioId: string,
    productId: string
  ): Promise<BffResponse<BankProduct>> => {
    return bffClient.get<BffResponse<BankProduct>>(
      `/products/${productId}`,
      { portfolioId }
    );
  },

  /**
   * Get product penetration metrics across portfolio
   */
  getPenetration: async (
    portfolioId: string
  ): Promise<BffResponse<ProductPenetration[]>> => {
    return bffClient.get<BffResponse<ProductPenetration[]>>(
      '/products/penetration',
      { portfolioId }
    );
  },

  /**
   * Get product penetration by customer segment
   */
  getPenetrationBySegment: async (
    portfolioId: string
  ): Promise<BffResponse<SegmentPenetration[]>> => {
    return bffClient.get<BffResponse<SegmentPenetration[]>>(
      '/products/penetration/segments',
      { portfolioId }
    );
  },

  /**
   * Get product performance metrics
   */
  getPerformance: async (
    portfolioId: string
  ): Promise<BffResponse<ProductPerformance[]>> => {
    return bffClient.get<BffResponse<ProductPerformance[]>>(
      '/products/performance',
      { portfolioId }
    );
  },

  /**
   * Get eligibility rules for a specific product
   */
  getEligibilityRules: async (
    portfolioId: string,
    productId: string
  ): Promise<BffResponse<EligibilityRule[]>> => {
    return bffClient.get<BffResponse<EligibilityRule[]>>(
      `/products/${productId}/eligibility-rules`,
      { portfolioId }
    );
  },

  /**
   * Get pre-qualification readiness summary across products
   */
  getPreQualReadiness: async (
    portfolioId: string
  ): Promise<BffResponse<PreQualReadiness[]>> => {
    return bffClient.get<BffResponse<PreQualReadiness[]>>(
      '/products/prequal-readiness',
      { portfolioId }
    );
  },

  /**
   * Get pre-qualification candidates with optional product filter
   */
  getPreQualCandidates: async (
    portfolioId: string,
    params?: PreQualCandidateParams
  ): Promise<BffListResponse<PreQualCandidate>> => {
    return bffClient.get<BffListResponse<PreQualCandidate>>(
      '/products/prequal-candidates',
      {
        portfolioId,
        params: {
          product: params?.product,
          page: params?.page,
          pageSize: params?.pageSize,
        },
      }
    );
  },
};

export default productsService;
