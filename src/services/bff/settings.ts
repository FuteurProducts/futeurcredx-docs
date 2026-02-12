/**
 * Settings BFF Service
 * Handles platform settings, user management, permissions, integrations, models, alerts, and billing
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type {
  AlertThreshold,
  BillingInfo,
  CreateUserRequest,
  DataSource,
  ModelVersion,
  PlatformPermission,
  PlatformUser,
  RolePermissions,
} from './types';

export interface UserListParams {
  page?: number;
  pageSize?: number;
}

export const settingsService = {
  /**
   * List users in the platform
   */
  listUsers: async (
    portfolioId: string,
    page?: number,
    pageSize?: number
  ): Promise<BffListResponse<PlatformUser>> => {
    return bffClient.get<BffListResponse<PlatformUser>>('/settings/users', {
      portfolioId,
      params: {
        page,
        pageSize,
      },
    });
  },

  /**
   * Create a new platform user
   */
  createUser: async (
    portfolioId: string,
    request: CreateUserRequest
  ): Promise<BffResponse<PlatformUser>> => {
    return bffClient.post<BffResponse<PlatformUser>>('/settings/users', {
      portfolioId,
      body: request,
    });
  },

  /**
   * Update an existing platform user
   */
  updateUser: async (
    portfolioId: string,
    userId: string,
    updates: Partial<PlatformUser>
  ): Promise<BffResponse<PlatformUser>> => {
    return bffClient.patch<BffResponse<PlatformUser>>(`/settings/users/${userId}`, {
      portfolioId,
      body: updates,
    });
  },

  /**
   * Get permissions list
   */
  getPermissions: async (
    portfolioId: string
  ): Promise<BffResponse<PlatformPermission[]>> => {
    return bffClient.get<BffResponse<PlatformPermission[]>>('/settings/permissions', {
      portfolioId,
    });
  },

  /**
   * Get role permissions matrix
   */
  getRoles: async (
    portfolioId: string
  ): Promise<BffResponse<RolePermissions[]>> => {
    return bffClient.get<BffResponse<RolePermissions[]>>('/settings/roles', {
      portfolioId,
    });
  },

  /**
   * List data sources
   */
  listDataSources: async (
    portfolioId: string
  ): Promise<BffListResponse<DataSource>> => {
    return bffClient.get<BffListResponse<DataSource>>('/settings/data-sources', {
      portfolioId,
    });
  },

  /**
   * List model versions
   */
  listModels: async (
    portfolioId: string
  ): Promise<BffListResponse<ModelVersion>> => {
    return bffClient.get<BffListResponse<ModelVersion>>('/settings/models', {
      portfolioId,
    });
  },

  /**
   * Get alert thresholds
   */
  getAlertThresholds: async (
    portfolioId: string
  ): Promise<BffResponse<AlertThreshold[]>> => {
    return bffClient.get<BffResponse<AlertThreshold[]>>('/settings/alerts', {
      portfolioId,
    });
  },

  /**
   * Get billing information
   */
  getBilling: async (
    portfolioId: string
  ): Promise<BffResponse<BillingInfo>> => {
    return bffClient.get<BffResponse<BillingInfo>>('/settings/billing', {
      portfolioId,
    });
  },
};

export default settingsService;
