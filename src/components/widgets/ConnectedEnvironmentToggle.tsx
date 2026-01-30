import React from 'react';
import { SandboxEnvironmentToggle as BaseToggle } from './SandboxEnvironmentToggle';
import { useEnvironment } from '@/contexts/EnvironmentContext';

interface ConnectedToggleProps {
  variant?: 'full' | 'compact' | 'minimal';
  requireConfirmation?: boolean;
  className?: string;
}

/**
 * Connected version of SandboxEnvironmentToggle that uses the global EnvironmentContext.
 * Use this component when you want the toggle to affect the global environment state.
 */
export const ConnectedEnvironmentToggle: React.FC<ConnectedToggleProps> = ({
  variant = 'minimal',
  requireConfirmation = true,
  className = '',
}) => {
  const { 
    currentEnvironment, 
    sandboxConfig, 
    productionConfig, 
    switchEnvironment 
  } = useEnvironment();

  return (
    <BaseToggle
      currentEnvironment={currentEnvironment}
      sandboxConfig={sandboxConfig}
      productionConfig={productionConfig}
      onSwitch={switchEnvironment}
      requireConfirmation={requireConfirmation}
      variant={variant}
      className={className}
    />
  );
};

export default ConnectedEnvironmentToggle;
