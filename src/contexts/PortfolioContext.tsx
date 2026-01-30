/**
 * Portfolio Context
 * Manages active portfolio selection across the dashboard
 * All BFF calls require portfolioId - this context provides it globally
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Portfolio } from '@/services/bff/types';

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

export function PortfolioProvider({ children }: PortfolioProviderProps) {
  const [portfolioId, setPortfolioIdState] = useState<string | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch accessible portfolios for current user
  const refreshPortfolios = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Not authenticated - use demo portfolio for dev
        const demoPortfolio: Portfolio = {
          id: 'demo-portfolio-001',
          tenantId: 'demo-tenant',
          name: 'Demo Portfolio',
          description: 'Development demo portfolio',
          productTypes: ['LOC', 'Term Loan', 'SBA'],
          createdAt: new Date().toISOString(),
        };
        setPortfolios([demoPortfolio]);
        setPortfolioIdState(demoPortfolio.id);
        setIsLoading(false);
        return;
      }

      // Fetch portfolios the user has access to
      const { data, error: fetchError } = await supabase
        .from('portfolios')
        .select(`
          id,
          tenant_id,
          name,
          code,
          config,
          created_at
        `)
        .order('name');

      if (fetchError) {
        throw fetchError;
      }

      const mappedPortfolios: Portfolio[] = (data || []).map(p => ({
        id: p.id,
        tenantId: p.tenant_id,
        name: p.name,
        description: p.code,
        productTypes: (p.config as { productTypes?: string[] })?.productTypes,
        createdAt: p.created_at ?? '',
      }));

      setPortfolios(mappedPortfolios);

      // Auto-select first portfolio if none selected
      if (mappedPortfolios.length > 0 && !portfolioId) {
        setPortfolioIdState(mappedPortfolios[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch portfolios:', err);
      setError(err instanceof Error ? err.message : 'Failed to load portfolios');
      
      // Fallback to demo portfolio
      const demoPortfolio: Portfolio = {
        id: 'demo-portfolio-001',
        tenantId: 'demo-tenant',
        name: 'Demo Portfolio',
        description: 'Development demo portfolio',
        productTypes: ['LOC', 'Term Loan', 'SBA'],
        createdAt: new Date().toISOString(),
      };
      setPortfolios([demoPortfolio]);
      setPortfolioIdState(demoPortfolio.id);
    } finally {
      setIsLoading(false);
    }
  }, [portfolioId]);

  // Load portfolios on mount
  useEffect(() => {
    refreshPortfolios();
  }, [refreshPortfolios]);

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
