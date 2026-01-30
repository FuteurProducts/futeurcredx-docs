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
        <div className={`inline-flex items-center gap-1 p-1 bg-slate-100 rounded-full ${className}`}>
          <button
            onClick={() => handleSwitch('sandbox')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              currentEnvironment === 'sandbox'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Beaker className="w-3.5 h-3.5" />
            Sandbox
          </button>
          <button
            onClick={() => handleSwitch('production')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              currentEnvironment === 'production'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
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
                className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Switch to Production?</h3>
                    <p className="text-sm text-slate-500">This will use live API endpoints</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-amber-800">
                    <strong>Warning:</strong> Production API calls are billed and affect real data.
                    Make sure your integration is fully tested.
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSwitch}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
          className={`bg-white rounded-xl p-4 shadow-sm border border-slate-200 ${className}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                currentEnvironment === 'sandbox' 
                  ? 'bg-amber-100 text-amber-600' 
                  : 'bg-green-100 text-green-600'
              }`}>
                {currentEnvironment === 'sandbox' ? (
                  <Beaker className="w-4 h-4" />
                ) : (
                  <Rocket className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 capitalize">
                  {currentEnvironment} Environment
                </p>
                <p className="text-xs text-slate-500">
                  {getConfig(currentEnvironment).keysAvailable} API keys active
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handleSwitch(currentEnvironment === 'sandbox' ? 'production' : 'sandbox')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
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
                className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Switch to Production?</h3>
                    <p className="text-sm text-slate-500">This will use live API endpoints</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-amber-800">
                    <strong>Warning:</strong> Production API calls are billed and affect real data. 
                    Make sure your integration is fully tested.
                  </p>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSwitch}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
        className={`bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden ${className}`}
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
                  <h3 className="text-lg font-semibold text-slate-900 capitalize">
                    {currentEnvironment} Environment
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    getConfig(currentEnvironment).status === 'active' 
                      ? 'bg-green-100 text-green-700'
                      : getConfig(currentEnvironment).status === 'syncing'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {getConfig(currentEnvironment).status === 'syncing' && (
                      <RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />
                    )}
                    {getConfig(currentEnvironment).status}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  API: <code className="text-xs bg-slate-100 px-1 rounded">{getConfig(currentEnvironment).apiUrl}</code>
                </p>
              </div>
            </div>
            
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-100"
            >
              {/* Environment cards */}
              <div className="p-6 grid grid-cols-2 gap-4">
                {/* Sandbox */}
                <div 
                  onClick={() => handleSwitch('sandbox')}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    currentEnvironment === 'sandbox'
                      ? 'bg-amber-50 border-2 border-amber-400'
                      : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      currentEnvironment === 'sandbox' ? 'bg-amber-100' : 'bg-slate-200'
                    }`}>
                      <Beaker className={`w-5 h-5 ${
                        currentEnvironment === 'sandbox' ? 'text-amber-600' : 'text-slate-500'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Sandbox</h4>
                      {currentEnvironment === 'sandbox' && (
                        <span className="text-xs text-amber-600 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      Test data only
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      No billing
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      Unlimited calls
                    </li>
                  </ul>
                  <p className="text-xs text-slate-400 mt-3">
                    {sandboxConfig.keysAvailable} keys · Last sync: {sandboxConfig.lastSync || 'Never'}
                  </p>
                </div>

                {/* Production */}
                <div 
                  onClick={() => handleSwitch('production')}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    currentEnvironment === 'production'
                      ? 'bg-green-50 border-2 border-green-400'
                      : 'bg-slate-50 border-2 border-transparent hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      currentEnvironment === 'production' ? 'bg-green-100' : 'bg-slate-200'
                    }`}>
                      <Rocket className={`w-5 h-5 ${
                        currentEnvironment === 'production' ? 'text-green-600' : 'text-slate-500'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">Production</h4>
                      {currentEnvironment === 'production' && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      Live data
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      Billed usage
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      SLA protected
                    </li>
                  </ul>
                  <p className="text-xs text-slate-400 mt-3">
                    {productionConfig.keysAvailable} keys · Last sync: {productionConfig.lastSync || 'Never'}
                  </p>
                </div>
              </div>

              {/* Info footer */}
              <div className="px-6 pb-6">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
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
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Switch to Production?</h3>
                  <p className="text-sm text-slate-500">This will use live API endpoints</p>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-amber-800">
                  <strong>Warning:</strong> Production API calls are billed and affect real data. 
                  Make sure your integration is fully tested.
                </p>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSwitch}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
