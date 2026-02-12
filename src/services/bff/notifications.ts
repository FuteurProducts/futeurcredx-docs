/**
 * Notifications BFF Service
 * Handles notification operations
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type {
  Notification,
  NotificationPreferences,
  NotificationSummary,
  NotificationType,
  NotificationPriority,
} from './types';

export interface NotificationFilters {
  isRead?: boolean;
  priority?: NotificationPriority;
  type?: NotificationType;
}

export interface NotificationListParams extends NotificationFilters {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export const notificationsService = {
  /**
   * List notifications in a portfolio with filters and pagination
   * Requires portfolioId (enforced server-side)
   */
  list: async (
    portfolioId: string,
    params?: NotificationListParams
  ): Promise<BffListResponse<Notification>> => {
    return bffClient.get<BffListResponse<Notification>>('/notifications', {
      portfolioId,
      params: {
        isRead: params?.isRead,
        priority: params?.priority,
        type: params?.type,
        page: params?.page,
        pageSize: params?.pageSize,
        sortField: params?.sortField,
        sortDirection: params?.sortDirection,
      },
    });
  },

  /**
   * Get notification summary (counts by priority/type)
   */
  getSummary: async (
    portfolioId: string
  ): Promise<BffResponse<NotificationSummary>> => {
    return bffClient.get<BffResponse<NotificationSummary>>(
      '/notifications/summary',
      { portfolioId }
    );
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (
    portfolioId: string,
    notificationId: string
  ): Promise<BffResponse<Notification>> => {
    return bffClient.patch<BffResponse<Notification>>(
      `/notifications/${notificationId}/read`,
      { portfolioId }
    );
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (
    portfolioId: string
  ): Promise<BffResponse<{ markedCount: number }>> => {
    return bffClient.patch<BffResponse<{ markedCount: number }>>(
      '/notifications/read-all',
      { portfolioId }
    );
  },

  /**
   * Get notification preferences for the current user
   */
  getPreferences: async (
    portfolioId: string
  ): Promise<BffResponse<NotificationPreferences>> => {
    return bffClient.get<BffResponse<NotificationPreferences>>(
      '/notifications/preferences',
      { portfolioId }
    );
  },

  /**
   * Update notification preferences
   */
  updatePreferences: async (
    portfolioId: string,
    prefs: NotificationPreferences
  ): Promise<BffResponse<NotificationPreferences>> => {
    return bffClient.put<BffResponse<NotificationPreferences>>(
      '/notifications/preferences',
      {
        portfolioId,
        body: prefs,
      }
    );
  },
};

export default notificationsService;
