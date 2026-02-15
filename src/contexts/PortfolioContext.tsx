/**
 * Portfolio Context
 * Manages active portfolio selection across the dashboard
 * All BFF calls require portfolioId - this context provides it globally
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import type { Portfolio } from '@/services/bff/types';
import { useAuth } from '@/contexts/AuthContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { useApiKeyStore } from '@/stores/apiKeyStore';
import bffClient, { BffResponse } from '@/services/bff/client';
import { normalizePortfolio } from '@/services/bff/normalizers';
import { logger } from '@/utils/logger';

interface PortfolioContextValue {
  // Current selected portfolio
  portfolioId: string | null;
  portfolio: Portfolio | null;

  // All accessible portfolios
  portfolios: Portfolio[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setPortfolioId: (id: string) => void;
  refreshPortfolios: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined);

interface PortfolioProviderProps {
  children: ReactNode;
}

const DEMO_PORTFOLIO: Portfolio = {
  id: 'demo-portfolio-001',
  tenantId: 'demo-tenant',
  name: 'Demo Portfolio',
  description: 'Development demo portfolio',
  productTypes: ['LOC', 'Term Loan', 'SBA'],
  createdAt: new Date().toISOString(),
};

export function PortfolioProvider({ children }: PortfolioProviderProps) {
  const [portfolioId, setPortfolioIdState] = useState<string | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, isLoaded } = useAuth();
  const { isDemoMode } = useEnvironment();
  const apiKey = useApiKeyStore((s) => s.apiKey);
  const prevApiKeyRef = useRef<string | null>(apiKey);

  // Fetch accessible portfolios for current user
  const refreshPortfolios = useCallback(async (forceReselect = false) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isDemoMode || !isSignedIn) {
        // Demo mode or not authenticated — use demo portfolio
        setPortfolios([DEMO_PORTFOLIO]);
        setPortfolioIdState(DEMO_PORTFOLIO.id);
        setIsLoading(false);
        return;
      }

      // Fetch portfolios from API via BFF client
      const response = await bffClient.get<BffResponse<Portfolio[]>>('/portfolios');

      const mappedPortfolios: Portfolio[] = Array.isArray(response.data)
        ? response.data.map((p: unknown) => normalizePortfolio(p as Record<string, unknown>))
        : [];

      setPortfolios(mappedPortfolios);

      // Auto-select first portfolio if none selected or if forced (API key change)
      if (mappedPortfolios.length > 0 && (forceReselect || !portfolioId)) {
        setPortfolioIdState(mappedPortfolios[0].id);
      }
    } catch (err) {
      logger.error('[PortfolioContext] Failed to fetch portfolios:', err);
      setError(err instanceof Error ? err.message : 'Failed to load portfolios');

      // Fallback to demo portfolio
      setPortfolios([DEMO_PORTFOLIO]);
      setPortfolioIdState(DEMO_PORTFOLIO.id);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, isDemoMode, portfolioId]);

  // Load portfolios when auth state is ready
  useEffect(() => {
    if (isLoaded) {
      refreshPortfolios();
    }
  }, [isLoaded, refreshPortfolios]);

  // Re-fetch portfolios when API key changes (switching banks)
  useEffect(() => {
    if (apiKey !== prevApiKeyRef.current) {
      prevApiKeyRef.current = apiKey;
      if (apiKey && isLoaded) {
        logger.info('[PortfolioContext] API key changed, refreshing portfolios');
        refreshPortfolios(true);
      }
    }
  }, [apiKey, isLoaded, refreshPortfolios]);

  // Persist selected portfolio to localStorage
  useEffect(() => {
    if (portfolioId) {
      localStorage.setItem('lumiq_selected_portfolio', portfolioId);
    }
  }, [portfolioId]);

  // Restore from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('lumiq_selected_portfolio');
    if (stored) {
      setPortfolioIdState(stored);
    }
  }, []);

  const setPortfolioId = useCallback((id: string) => {
    setPortfolioIdState(id);
  }, []);

  const portfolio = portfolios.find(p => p.id === portfolioId) || null;

  const value: PortfolioContextValue = {
    portfolioId,
    portfolio,
    portfolios,
    isLoading,
    error,
    setPortfolioId,
    refreshPortfolios,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio(): PortfolioContextValue {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

/**
 * Hook that returns portfolioId or throws if not selected
 * Use in components that require a portfolio to function
 */
export function useRequiredPortfolio(): string {
  const { portfolioId, isLoading } = usePortfolio();

  if (!isLoading && !portfolioId) {
    throw new Error('No portfolio selected. Please select a portfolio to continue.');
  }

  return portfolioId!;
}
