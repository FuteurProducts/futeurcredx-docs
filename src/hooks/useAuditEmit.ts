/**
 * useAuditEmit Hook
 * Emits client-side audit events to complement server-side auditing
 * Provides UI context that server can't capture
 */

import { useCallback } from 'react';
import { auditService, type ClientAuditEventType } from '@/services/bff';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { logger } from '@/utils/logger';

interface AuditEmitOptions {
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
}

export function useAuditEmit() {
  const { portfolioId } = usePortfolio();

  const emit = useCallback(
    async (eventType: ClientAuditEventType, options: AuditEmitOptions) => {
      try {
        // Add portfolio context to all events
        const enrichedDetails = {
          ...options.details,
          portfolioId,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        };

        await auditService.emit(
          eventType,
          options.resourceType,
          options.resourceId,
          enrichedDetails
        );
      } catch (error) {
        // Audit failures should not break the UI
        logger.warn('[useAuditEmit] Failed to emit audit event:', eventType, error);
      }
    },
    [portfolioId]
  );

  // Convenience methods for common events
  const emitScoreViewed = useCallback(
    (smbEntityId: string, source?: string) =>
      emit('SCORE_VIEWED', {
        resourceType: 'credit_score',
        resourceId: smbEntityId,
        details: { source },
      }),
    [emit]
  );

  const emitDossierOpened = useCallback(
    (smbEntityId: string, businessName?: string) =>
      emit('DOSSIER_OPENED', {
        resourceType: 'smb_entity',
        resourceId: smbEntityId,
        details: { businessName },
      }),
    [emit]
  );

  const emitReportDownloaded = useCallback(
    (reportId: string, reportType?: string) =>
      emit('REPORT_DOWNLOADED', {
        resourceType: 'report',
        resourceId: reportId,
        details: { reportType },
      }),
    [emit]
  );

  const emitApplyClicked = useCallback(
    (offerId: string, productType?: string) =>
      emit('APPLY_CLICKED', {
        resourceType: 'prequal_offer',
        resourceId: offerId,
        details: { productType },
      }),
    [emit]
  );

  const emitOfferPresented = useCallback(
    (offerId: string, smbEntityId: string) =>
      emit('OFFER_PRESENTED', {
        resourceType: 'prequal_offer',
        resourceId: offerId,
        details: { smbEntityId },
      }),
    [emit]
  );

  const emitFilterApplied = useCallback(
    (filterType: string, filterValues: Record<string, unknown>) =>
      emit('FILTER_APPLIED', {
        resourceType: 'filter',
        details: { filterType, filterValues },
      }),
    [emit]
  );

  const emitExportInitiated = useCallback(
    (exportType: string, recordCount?: number) =>
      emit('EXPORT_INITIATED', {
        resourceType: 'export',
        details: { exportType, recordCount },
      }),
    [emit]
  );

  const emitBulkActionExecuted = useCallback(
    (action: string, entityIds: string[]) =>
      emit('BULK_ACTION_EXECUTED', {
        resourceType: 'bulk_action',
        details: { action, entityCount: entityIds.length, entityIds: entityIds.slice(0, 10) },
      }),
    [emit]
  );

  return {
    emit,
    emitScoreViewed,
    emitDossierOpened,
    emitReportDownloaded,
    emitApplyClicked,
    emitOfferPresented,
    emitFilterApplied,
    emitExportInitiated,
    emitBulkActionExecuted,
  };
}
