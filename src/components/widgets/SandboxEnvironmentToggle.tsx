import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Beaker, Rocket, AlertTriangle, Check, 
  ChevronDown, Shield, RefreshCw, Info
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
export type Environment = 'sandbox' | 'production';

export interface EnvironmentConfig {
  apiUrl: string;
  keysAvailable: number;
  lastSync?: string;
  status: 'active' | 'syncing' | 'error';
}

export interface SandboxEnvironmentToggleProps {
  currentEnvironment: Environment;
  sandboxConfig: EnvironmentConfig;
  productionConfig: EnvironmentConfig;
  onSwitch: (env: Environment) => void;
  requireConfirmation?: boolean;
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
}

// ============================================
// SANDBOX ENVIRONMENT TOGGLE
// ============================================
export const SandboxEnvironmentToggle: React.FC<SandboxEnvironmentToggleProps> = ({
  currentEnvironment,
  sandboxConfig,
  productionConfig,
  onSwitch,
  requireConfirmation = true,
  variant = 'full',
  className = '',
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingEnvironment, setPendingEnvironment] = useState<Environment | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSwitch = (env: Environment) => {
    if (env === currentEnvironment) return;
    
    if (requireConfirmation && env === 'production') {
      setPendingEnvironment(env);
      setShowConfirmDialog(true);
    } else {
      onSwitch(env);
    }
  };

  const confirmSwitch = () => {
    if (pendingEnvironment) {
      onSwitch(pendingEnvironment);
      setShowConfirmDialog(false);
      setPendingEnvironment(null);
    }
  };

  const getConfig = (env: Environment) => 
    env === 'sandbox' ? sandboxConfig : productionConfig;

  if (variant === 'minimal') {
    return (
      <>
        <div className={`inline-flex items-center gap-1 p-1 bg-muted rounded-full ${className}`}>
          <button
            onClick={() => handleSwitch('sandbox')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              currentEnvironment === 'sandbox'
                ? 'bg-card text-warning shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Beaker className="w-3.5 h-3.5" />
            Sandbox
          </button>
          <button
            onClick={() => handleSwitch('production')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              currentEnvironment === 'production'
                ? 'bg-card text-success shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            Production
          </button>
        </div>

        {/* Confirmation Dialog (needed for minimal variant too) */}
        <AnimatePresence>
          {showConfirmDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Switch to Production?</h3>
                    <p className="text-sm text-muted-foreground">This will use live API endpoints</p>
                  </div>
                </div>

                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-6">
                  <p className="text-sm text-warning">
                    <strong>Warning:</strong> Production API calls are billed and affect real data.
                    Make sure your integration is fully tested.
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSwitch}
                    className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
                  >
                    Switch to Production
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <motion.div
          className={`bg-card rounded-xl p-4 shadow-sm border border-border ${className}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                currentEnvironment === 'sandbox'
                  ? 'bg-warning/10 text-warning'
                  : 'bg-success/10 text-success'
              }`}>
                {currentEnvironment === 'sandbox' ? (
                  <Beaker className="w-4 h-4" />
                ) : (
                  <Rocket className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground capitalize">
                  {currentEnvironment} Environment
                </p>
                <p className="text-xs text-muted-foreground">
                  {getConfig(currentEnvironment).keysAvailable} API keys active
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSwitch(currentEnvironment === 'sandbox' ? 'production' : 'sandbox')}
              className="text-sm font-medium text-info hover:text-info/80"
            >
              Switch
            </button>
          </div>
        </motion.div>

        {/* Confirmation Dialog */}
        <AnimatePresence>
          {showConfirmDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Switch to Production?</h3>
                    <p className="text-sm text-muted-foreground">This will use live API endpoints</p>
                  </div>
                </div>

                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-6">
                  <p className="text-sm text-warning">
                    <strong>Warning:</strong> Production API calls are billed and affect real data.
                    Make sure your integration is fully tested.
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSwitch}
                    className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
                  >
                    Switch to Production
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Full variant
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-card rounded-2xl shadow-lg border border-border overflow-hidden ${className}`}
      >
        {/* Header */}
        <div 
          className="p-6 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                currentEnvironment === 'sandbox' 
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                  : 'bg-gradient-to-br from-green-400 to-emerald-600'
              }`}>
                {currentEnvironment === 'sandbox' ? (
                  <Beaker className="w-6 h-6 text-white" />
                ) : (
                  <Rocket className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground capitalize">
                    {currentEnvironment} Environment
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    getConfig(currentEnvironment).status === 'active'
                      ? 'bg-success/10 text-success'
                      : getConfig(currentEnvironment).status === 'syncing'
                      ? 'bg-info/10 text-info'
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {getConfig(currentEnvironment).status === 'syncing' && (
                      <RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />
                    )}
                    {getConfig(currentEnvironment).status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  API: <code className="text-xs bg-muted px-1 rounded">{getConfig(currentEnvironment).apiUrl}</code>
                </p>
              </div>
            </div>
            
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border"
            >
              {/* Environment cards */}
              <div className="p-6 grid grid-cols-2 gap-4">
                {/* Sandbox */}
                <div 
                  onClick={() => handleSwitch('sandbox')}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    currentEnvironment === 'sandbox'
                      ? 'bg-warning/10 border-2 border-warning'
                      : 'bg-accent border-2 border-transparent hover:border-border'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      currentEnvironment === 'sandbox' ? 'bg-warning/10' : 'bg-muted'
                    }`}>
                      <Beaker className={`w-5 h-5 ${
                        currentEnvironment === 'sandbox' ? 'text-warning' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Sandbox</h4>
                      {currentEnvironment === 'sandbox' && (
                        <span className="text-xs text-warning flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      Test data only
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      No billing
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-success" />
                      Unlimited calls
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    {sandboxConfig.keysAvailable} keys · Last sync: {sandboxConfig.lastSync || 'Never'}
                  </p>
                </div>

                {/* Production */}
                <div 
                  onClick={() => handleSwitch('production')}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    currentEnvironment === 'production'
                      ? 'bg-success/10 border-2 border-success'
                      : 'bg-accent border-2 border-transparent hover:border-border'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      currentEnvironment === 'production' ? 'bg-success/10' : 'bg-muted'
                    }`}>
                      <Rocket className={`w-5 h-5 ${
                        currentEnvironment === 'production' ? 'text-success' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Production</h4>
                      {currentEnvironment === 'production' && (
                        <span className="text-xs text-success flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-info" />
                      Live data
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-info" />
                      Billed usage
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-info" />
                      SLA protected
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    {productionConfig.keysAvailable} keys · Last sync: {productionConfig.lastSync || 'Never'}
                  </p>
                </div>
              </div>

              {/* Info footer */}
              <div className="px-6 pb-6">
                <div className="flex items-start gap-3 p-3 bg-info/10 rounded-lg">
                  <Info className="w-5 h-5 text-info mt-0.5" />
                  <div className="text-sm text-info">
                    <strong>Tip:</strong> Use sandbox for development and testing. 
                    Switch to production only when your integration is fully tested.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Switch to Production?</h3>
                  <p className="text-sm text-muted-foreground">This will use live API endpoints</p>
                </div>
              </div>

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-6">
                <p className="text-sm text-warning">
                  <strong>Warning:</strong> Production API calls are billed and affect real data.
                  Make sure your integration is fully tested.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSwitch}
                  className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
                >
                  Switch to Production
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SandboxEnvironmentToggle;
