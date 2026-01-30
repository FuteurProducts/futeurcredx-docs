/**
 * useBffQuery Hook
 * Generic hook for BFF data fetching with loading/error states
 */

import { useState, useEffect, useCallback } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import type { BffError } from '@/services/bff';

interface UseBffQueryOptions<T> {
  queryFn: (portfolioId: string) => Promise<T>;
  enabled?: boolean;
  refetchOnPortfolioChange?: boolean;
}

interface UseBffQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: BffError | null;
  refetch: () => Promise<void>;
}

export function useBffQuery<T>(
  options: UseBffQueryOptions<T>
): UseBffQueryResult<T> {
  const { queryFn, enabled = true, refetchOnPortfolioChange = true } = options;
  const { portfolioId, isLoading: portfolioLoading } = usePortfolio();

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<BffError | null>(null);

  const refetch = useCallback(async () => {
    if (!portfolioId || !enabled) return;

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
  }, [portfolioId, queryFn, enabled]);

  // Fetch on mount and portfolio change
  useEffect(() => {
    if (enabled && portfolioId && !portfolioLoading) {
      refetch();
    }
  }, [enabled, portfolioId, portfolioLoading, refetch]);

  // Refetch when portfolio changes
  useEffect(() => {
    if (refetchOnPortfolioChange && portfolioId) {
      refetch();
    }
  }, [portfolioId, refetchOnPortfolioChange, refetch]);

  return {
    data,
    isLoading: isLoading || portfolioLoading,
    error,
    refetch,
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
