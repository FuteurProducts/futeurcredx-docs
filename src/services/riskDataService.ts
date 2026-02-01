/**
 * Risk Data Service
 * Fetches and transforms risk data from BFF for the Risk page.
 * Provides graceful fallback to static reference data.
 */

import { riskService } from '@/services/bff';
import { withFallback } from '@/utils/withFallback';
import type { RiskSummary, EWSAlert } from '@/services/bff/types';
import type { BffResponse, BffListResponse } from '@/services/bff/client';

export interface RiskPageData {
  summary: RiskSummary | null;
  ewsAlerts: EWSAlert[];
  source: 'live' | 'fallback';
}

/**
 * Fetch risk summary from BFF
 */
export async function getRiskSummary(portfolioId: string) {
  return withFallback<BffResponse<RiskSummary>>(
    () => riskService.getSummary(portfolioId),
    {
      data: {
        portfolioId,
        totalExposure: 147200000,
        avgRiskScore: 724,
        riskDistribution: { low: 62, moderate: 24, elevated: 8, high: 4, critical: 2 },
        topRiskDrivers: [
          { factor: 'Payment Behavior', impact: 34, direction: 'increasing' },
          { factor: 'Credit Utilization', impact: 28, direction: 'increasing' },
          { factor: 'Bureau Score Drops', impact: 22, direction: 'stable' },
          { factor: 'Cash Flow Stress', impact: 16, direction: 'decreasing' },
        ],
        trends: [],
      },
      meta: { requestId: 'fallback' },
    },
    'Risk Summary'
  );
}

/**
 * Fetch EWS alerts from BFF
 */
export async function getEWSAlerts(portfolioId: string) {
  return withFallback<BffListResponse<EWSAlert>>(
    () => riskService.getEWSQueue(portfolioId, { acknowledged: false }),
    {
      data: [],
      meta: { requestId: 'fallback' },
    },
    'EWS Alerts'
  );
}

/**
 * Acknowledge an EWS alert
 */
export async function acknowledgeAlert(portfolioId: string, alertId: string, notes?: string) {
  return riskService.acknowledgeAlert(portfolioId, alertId, notes);
}
