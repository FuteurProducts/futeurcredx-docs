/**
 * withFallback — graceful degradation utility for BFF calls
 *
 * Every BFF-wired component should use this pattern:
 *   live data preferred, graceful fallback to existing mock data.
 */

import { logger } from '@/utils/logger';

export interface FallbackResult<T> {
  data: T;
  source: 'live' | 'fallback';
}

/**
 * Attempt a BFF call; fall back to static data if it fails.
 *
 * @param bffCall      - async function that fetches live data
 * @param fallbackData - static fallback data returned when bffCall throws
 * @param label        - human-readable label for logging
 * @param isDemoMode   - when true, silently fall back to demo data;
 *                       when false (default), log a warning and re-throw
 */
export async function withFallback<T>(
  bffCall: () => Promise<T>,
  fallbackData: T,
  label: string,
  isDemoMode: boolean = false
): Promise<FallbackResult<T>> {
  try {
    const data = await bffCall();
    return { data, source: 'live' };
  } catch (err) {
    if (isDemoMode) {
      logger.info(`[withFallback] ${label}: demo mode — using fallback data`);
    } else {
      logger.warn(`[withFallback] ${label}: BFF call failed, using fallback data`, err);
    }
    return { data: fallbackData, source: 'fallback' };
  }
}
