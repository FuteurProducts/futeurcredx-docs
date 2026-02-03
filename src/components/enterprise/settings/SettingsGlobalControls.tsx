// Enterprise Settings Global Controls - Sticky top bar

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Building2 } from 'lucide-react';
import type { Environment } from './types';

interface SettingsGlobalControlsProps {
  environment: Environment;
  onEnvironmentChange: (env: Environment) => void;
  tenantName: string;
  tenantId: string;
  ssoEnabled: boolean;
}

export const SettingsGlobalControls: React.FC<SettingsGlobalControlsProps> = ({
  environment,
  onEnvironmentChange,
  tenantName,
  tenantId,
  ssoEnabled,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10"
    >
      <div className="flex items-center justify-between">
        {/* Left - Title */}
        <h1 className="text-h5 font-semibold text-foreground">Platform Settings</h1>

        {/* Right - Controls */}
        <div className="flex items-center gap-4">
          {/* Environment Toggle */}
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <button
              onClick={() => onEnvironmentChange('sandbox')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                environment === 'sandbox'
                  ? 'bg-warning/10 text-warning'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sandbox
            </button>
            <button
              onClick={() => onEnvironmentChange('production')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                environment === 'production'
                  ? 'bg-success/10 text-success'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Production
            </button>
          </div>

          {/* Tenant Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="font-medium text-foreground">{tenantName}</span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{tenantId}</span>
          </div>

          {/* SSO Badge */}
          {ssoEnabled && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-success/10 text-success rounded-md text-xs font-medium">
              <Shield className="h-3 w-3" />
              SSO Enabled
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsGlobalControls;
