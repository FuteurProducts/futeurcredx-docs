/**
 * Audit BFF Service
 * Handles audit event logging (client-side context events)
 */

import bffClient, { BffResponse, BffListResponse } from './client';
import type { AuditEvent } from './types';

export interface AuditFilters {
  action?: string;
  resourceType?: string;
  resourceId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface AuditListParams extends AuditFilters {
  page?: number;
  pageSize?: number;
}

// Client-side audit event types for UI context
export type ClientAuditEventType =
  | 'SCORE_VIEWED'
  | 'DOSSIER_OPENED'
  | 'REPORT_DOWNLOADED'
  | 'APPLY_CLICKED'
  | 'OFFER_PRESENTED'
  | 'FILTER_APPLIED'
  | 'EXPORT_INITIATED'
  | 'BULK_ACTION_EXECUTED';

export const auditService = {
  /**
   * List audit events (for compliance dashboard)
   */
  list: async (
    portfolioId: string,
    params?: AuditListParams
  ): Promise<BffListResponse<AuditEvent>> => {
    return bffClient.get<BffListResponse<AuditEvent>>('/audit-events', {
      portfolioId,
      params: {
        action: params?.action,
        resourceType: params?.resourceType,
        resourceId: params?.resourceId,
        userId: params?.userId,
        startDate: params?.startDate,
        endDate: params?.endDate,
        page: params?.page,
        pageSize: params?.pageSize,
      },
    });
  },

  /**
   * Emit a client-side context audit event
   * These complement server-side audit events with UI context
   */
  emit: async (
    eventType: ClientAuditEventType,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, unknown>
  ): Promise<BffResponse<{ eventId: string }>> => {
    return bffClient.post<BffResponse<{ eventId: string }>>('/audit-events', {
      body: {
        action: eventType,
        resourceType,
        resourceId,
        details: {
          ...details,
          clientTimestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        },
      },
    });
  },
};

export default auditService;
