/**
 * useBffQuery Hook
 * Generic hook for BFF data fetching with loading/error states.
 *
 * Supports 3 operating modes via the `demoData` parameter:
 *   - Demo mode:  returns demoData immediately (no network call, 50-150ms simulated delay)
 *   - Sandbox:    calls queryFn against sandbox API
 *   - Production: calls queryFn against production API
 */

import { useState, useEffect, useCallback } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import type { BffError } from '@/services/bff';

interface UseBffQueryOptions<T> {
  queryFn: (portfolioId: string) => Promise<T>;
  /** Static data returned instantly in demo mode. Must match queryFn's return type. */
  demoData?: T;
  enabled?: boolean;
  refetchOnPortfolioChange?: boolean;
}

interface UseBffQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: BffError | null;
  refetch: () => Promise<void>;
  /** True when data comes from local demo data instead of API. */
  isDemoMode: boolean;
}

export function useBffQuery<T>(
  options: UseBffQueryOptions<T>
): UseBffQueryResult<T> {
  const { queryFn, demoData, enabled = true, refetchOnPortfolioChange = true } = options;
  const { portfolioId, isLoading: portfolioLoading } = usePortfolio();
  const { isDemoMode } = useEnvironment();

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<BffError | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    // DEMO MODE: return demoData with simulated delay (no network call)
    if (isDemoMode && demoData !== undefined) {
      setIsLoading(true);
      setError(null);
      // Simulate realistic delay (50-150ms)
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      setData(demoData);
      setIsLoading(false);
      return;
    }

    // SANDBOX / PRODUCTION: call real API
    if (!portfolioId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await queryFn(portfolioId);
      setData(result);
    } catch (err) {
      setError(err as BffError);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [portfolioId, queryFn, enabled, isDemoMode, demoData]);

  // Fetch on mount and portfolio change
  useEffect(() => {
    if (enabled && (isDemoMode || (portfolioId && !portfolioLoading))) {
      refetch();
    }
  }, [enabled, portfolioId, portfolioLoading, refetch, isDemoMode]);

  // Refetch when portfolio changes (only in non-demo modes)
  useEffect(() => {
    if (!isDemoMode && refetchOnPortfolioChange && portfolioId) {
      refetch();
    }
  }, [portfolioId, refetchOnPortfolioChange, refetch, isDemoMode]);

  return {
    data,
    isLoading: isLoading || (!isDemoMode && portfolioLoading),
    error,
    refetch,
    isDemoMode,
  };
}

/**
 * useBffMutation Hook
 * For BFF mutations (POST/PUT/DELETE) with optimistic updates
 */
interface UseBffMutationOptions<TData, TVariables> {
  mutationFn: (portfolioId: string, variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData) => void;
  onError?: (error: BffError) => void;
}

interface UseBffMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | null>;
  isLoading: boolean;
  error: BffError | null;
  data: TData | null;
  reset: () => void;
}

export function useBffMutation<TData, TVariables>(
  options: UseBffMutationOptions<TData, TVariables>
): UseBffMutationResult<TData, TVariables> {
  const { mutationFn, onSuccess, onError } = options;
  const { portfolioId } = usePortfolio();

  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<BffError | null>(null);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      if (!portfolioId) {
        const err: BffError = {
          error: { code: 'NO_PORTFOLIO', message: 'No portfolio selected' },
          meta: { requestId: crypto.randomUUID() },
        };
        setError(err);
        onError?.(err);
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await mutationFn(portfolioId, variables);
        setData(result);
        onSuccess?.(result);
        return result;
      } catch (err) {
        const bffError = err as BffError;
        setError(bffError);
        onError?.(bffError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [portfolioId, mutationFn, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    mutate,
    isLoading,
    error,
    data,
    reset,
  };
}
