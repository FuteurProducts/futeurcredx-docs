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
 * @param bffCall   - async function that fetches live data
 * @param fallbackData - static fallback data returned when bffCall throws
 * @param label     - human-readable label for console logging
 */
export async function withFallback<T>(
  bffCall: () => Promise<T>,
  fallbackData: T,
  label: string
): Promise<FallbackResult<T>> {
  try {
    const data = await bffCall();
    return { data, source: 'live' };
  } catch (err) {
    logger.warn(`[withFallback] ${label}: BFF unavailable, using fallback data`, err);
    return { data: fallbackData, source: 'fallback' };
  }
}
