import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';

// ============================================
// TYPES
// ============================================
export type Environment = 'demo' | 'sandbox' | 'production';

export interface EnvironmentConfig {
  apiUrl: string;
  keysAvailable: number;
  lastSync: string;
  status: 'active' | 'syncing' | 'error';
}

interface EnvironmentContextType {
  currentEnvironment: Environment;
  demoConfig: EnvironmentConfig;
  sandboxConfig: EnvironmentConfig;
  productionConfig: EnvironmentConfig;
  switchEnvironment: (env: Environment) => Promise<void>;
  isSwitching: boolean;
  getApiBaseUrl: () => string | null;
  isDemoMode: boolean;
  onSwitchCallback?: (env: Environment) => void;
  setOnSwitchCallback: (cb: ((env: Environment) => void) | undefined) => void;
}

// ============================================
// VALID MODES
// ============================================
const VALID_ENVIRONMENTS: readonly Environment[] = ['demo', 'sandbox', 'production'];

function isValidEnvironment(value: string): value is Environment {
  return VALID_ENVIRONMENTS.includes(value as Environment);
}

// ============================================
// DEFAULT CONFIGS
// ============================================
const defaultDemoConfig: EnvironmentConfig = {
  apiUrl: '',
  keysAvailable: 0,
  lastSync: new Date().toISOString().split('T')[0],
  status: 'active',
};

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

/** Resolve initial environment: URL param > localStorage > default 'demo' */
function resolveInitialEnvironment(): Environment {
  if (typeof window !== 'undefined') {
    const urlMode = new URLSearchParams(window.location.search).get('mode');
    if (urlMode && isValidEnvironment(urlMode)) {
      localStorage.setItem('lumiq-environment', urlMode);
      return urlMode;
    }
  }
  try {
    const saved = localStorage.getItem('lumiq-environment');
    if (saved && isValidEnvironment(saved)) return saved;
  } catch { /* restricted storage */ }
  return 'demo';
}

/** Document title prefix per mode */
const TITLE_MAP: Record<Environment, string> = {
  demo: '[DEMO] LUMIQ AI Dashboard',
  sandbox: '[SANDBOX] LUMIQ AI Dashboard',
  production: 'LUMIQ AI Dashboard',
};

export const EnvironmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment>(resolveInitialEnvironment);

  const [isSwitching, setIsSwitching] = useState(false);
  const [demoConfig] = useState<EnvironmentConfig>(defaultDemoConfig);
  const [sandboxConfig, setSandboxConfig] = useState<EnvironmentConfig>(defaultSandboxConfig);
  const [productionConfig, setProductionConfig] = useState<EnvironmentConfig>(defaultProductionConfig);

  // Callback ref for environment change listeners
  const onSwitchCallbackRef = useRef<((env: Environment) => void) | undefined>(undefined);

  const setOnSwitchCallback = useCallback((cb: ((env: Environment) => void) | undefined) => {
    onSwitchCallbackRef.current = cb;
  }, []);

  // Set document title on initial load based on persisted environment
  useEffect(() => {
    document.title = TITLE_MAP[currentEnvironment];
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const switchEnvironment = useCallback(async (env: Environment) => {
    if (env === currentEnvironment) return;

    setIsSwitching(true);

    // Detect auth provider change (demo ↔ non-demo requires page reload)
    const authProviderChanges =
      (currentEnvironment === 'demo' && env !== 'demo') ||
      (currentEnvironment !== 'demo' && env === 'demo');

    // Update environment immediately
    setCurrentEnvironment(env);
    localStorage.setItem('lumiq-environment', env);

    // Update document title
    document.title = TITLE_MAP[env];

    // Update config status
    if (env === 'sandbox') {
      setSandboxConfig(prev => ({ ...prev, status: 'active', lastSync: new Date().toISOString().split('T')[0] }));
    } else if (env === 'production') {
      setProductionConfig(prev => ({ ...prev, status: 'active', lastSync: new Date().toISOString().split('T')[0] }));
    }

    // Notify listeners
    onSwitchCallbackRef.current?.(env);

    // Auth provider change requires full reload
    if (authProviderChanges) {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', env);
      window.location.href = url.toString();
      return;
    }

    setIsSwitching(false);
  }, [currentEnvironment]);

  const getApiBaseUrl = useCallback((): string | null => {
    if (currentEnvironment === 'demo') return null;
    return currentEnvironment === 'sandbox'
      ? sandboxConfig.apiUrl
      : productionConfig.apiUrl;
  }, [currentEnvironment, sandboxConfig.apiUrl, productionConfig.apiUrl]);

  return (
    <EnvironmentContext.Provider
      value={{
        currentEnvironment,
        demoConfig,
        sandboxConfig,
        productionConfig,
        switchEnvironment,
        isSwitching,
        getApiBaseUrl,
        isDemoMode: currentEnvironment === 'demo',
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
