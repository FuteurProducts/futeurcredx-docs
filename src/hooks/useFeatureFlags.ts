/**
 * useFeatureFlags Hook — Mode-aware feature visibility
 *
 * Controls which features are visible based on operating mode.
 * Demo mode hides API-dependent features; production shows everything.
 */

import { useEnvironment } from '@/contexts/EnvironmentContext';

export interface FeatureFlags {
  /** API Console / API Testing page */
  showApiConsole: boolean;
  /** Team management in Settings */
  showTeamManagement: boolean;
  /** Billing section in Settings */
  showBilling: boolean;
  /** Webhook configuration */
  showWebhooks: boolean;
  /** Demo mode banner */
  showDemoBanner: boolean;
}

export function useFeatureFlags(): FeatureFlags {
  const { currentEnvironment } = useEnvironment();

  if (currentEnvironment === 'demo') {
    return {
      showApiConsole: false,
      showTeamManagement: false,
      showBilling: false,
      showWebhooks: false,
      showDemoBanner: true,
    };
  }

  if (currentEnvironment === 'sandbox') {
    return {
      showApiConsole: true,
      showTeamManagement: false,
      showBilling: false,
      showWebhooks: true,
      showDemoBanner: false,
    };
  }

  // production
  return {
    showApiConsole: true,
    showTeamManagement: true,
    showBilling: true,
    showWebhooks: true,
    showDemoBanner: false,
  };
}
