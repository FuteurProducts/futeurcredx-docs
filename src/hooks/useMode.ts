/**
 * useMode Hook — Operating mode detection
 *
 * Returns the current operating mode: 'demo' | 'sandbox' | 'production'.
 * Reads from EnvironmentContext, which resolves mode from:
 *   1. URL param: ?mode=demo
 *   2. localStorage: lumiq-environment
 *   3. Default: demo
 */

import { useEnvironment, type Environment } from '@/contexts/EnvironmentContext';

export type OperatingMode = Environment;

/** Returns the current operating mode. */
export function useMode(): OperatingMode {
  const { currentEnvironment } = useEnvironment();
  return currentEnvironment;
}

/** Returns mode along with derived flags for convenience. */
export function useModeConfig() {
  const { currentEnvironment, getApiBaseUrl, isDemoMode } = useEnvironment();

  return {
    mode: currentEnvironment,
    isDemoMode,
    isSandboxMode: currentEnvironment === 'sandbox',
    isProductionMode: currentEnvironment === 'production',
    apiUrl: getApiBaseUrl(),
    requiresAuth: currentEnvironment !== 'demo',
    requiresPortfolio: currentEnvironment !== 'demo',
  };
}
