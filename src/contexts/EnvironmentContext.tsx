import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';

// ============================================
// TYPES
// ============================================
export type Environment = 'sandbox' | 'production';

export interface EnvironmentConfig {
  apiUrl: string;
  keysAvailable: number;
  lastSync: string;
  status: 'active' | 'syncing' | 'error';
}

interface EnvironmentContextType {
  currentEnvironment: Environment;
  sandboxConfig: EnvironmentConfig;
  productionConfig: EnvironmentConfig;
  switchEnvironment: (env: Environment) => Promise<void>;
  isSwitching: boolean;
  getApiBaseUrl: () => string;
  onSwitchCallback?: (env: Environment) => void;
  setOnSwitchCallback: (cb: ((env: Environment) => void) | undefined) => void;
}

// ============================================
// DEFAULT CONFIGS
// ============================================
const defaultSandboxConfig: EnvironmentConfig = {
  apiUrl: "https://sandbox.lumiqai.com/v1",
  keysAvailable: 3,
  lastSync: new Date().toISOString().split('T')[0],
  status: "active",
};

const defaultProductionConfig: EnvironmentConfig = {
  apiUrl: "https://api.lumiqai.com/v1",
  keysAvailable: 2,
  lastSync: new Date().toISOString().split('T')[0],
  status: "active",
};

// ============================================
// CONTEXT
// ============================================
const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export const EnvironmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment>(() => {
    // Persist environment choice in localStorage
    const saved = localStorage.getItem('lumiq-environment');
    return (saved === 'production' ? 'production' : 'sandbox') as Environment;
  });

  const [isSwitching, setIsSwitching] = useState(false);
  const [sandboxConfig, setSandboxConfig] = useState<EnvironmentConfig>(defaultSandboxConfig);
  const [productionConfig, setProductionConfig] = useState<EnvironmentConfig>(defaultProductionConfig);

  // Callback ref for environment change listeners
  const onSwitchCallbackRef = useRef<((env: Environment) => void) | undefined>(undefined);

  const setOnSwitchCallback = useCallback((cb: ((env: Environment) => void) | undefined) => {
    onSwitchCallbackRef.current = cb;
  }, []);

  // Set document title on initial load based on persisted environment
  useEffect(() => {
    document.title = currentEnvironment === 'sandbox'
      ? '[SANDBOX] LUMIQ AI Dashboard'
      : 'LUMIQ AI Dashboard';
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const switchEnvironment = useCallback(async (env: Environment) => {
    if (env === currentEnvironment) return;

    setIsSwitching(true);

    // Update environment immediately
    setCurrentEnvironment(env);
    localStorage.setItem('lumiq-environment', env);

    // Update document title
    document.title = env === 'sandbox'
      ? '[SANDBOX] LUMIQ AI Dashboard'
      : 'LUMIQ AI Dashboard';

    // Update config status
    if (env === 'sandbox') {
      setSandboxConfig(prev => ({ ...prev, status: 'active', lastSync: new Date().toISOString().split('T')[0] }));
    } else {
      setProductionConfig(prev => ({ ...prev, status: 'active', lastSync: new Date().toISOString().split('T')[0] }));
    }

    // Notify listeners
    onSwitchCallbackRef.current?.(env);

    setIsSwitching(false);
  }, [currentEnvironment]);

  const getApiBaseUrl = useCallback(() => {
    return currentEnvironment === 'sandbox' 
      ? sandboxConfig.apiUrl 
      : productionConfig.apiUrl;
  }, [currentEnvironment, sandboxConfig.apiUrl, productionConfig.apiUrl]);

  return (
    <EnvironmentContext.Provider
      value={{
        currentEnvironment,
        sandboxConfig,
        productionConfig,
        switchEnvironment,
        isSwitching,
        getApiBaseUrl,
        onSwitchCallback: onSwitchCallbackRef.current,
        setOnSwitchCallback,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
};

export default EnvironmentContext;
