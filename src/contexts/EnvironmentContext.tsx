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

/**
 * Resolve initial environment: pathname > URL param > localStorage > default 'sandbox'
 * SECURITY: 'demo' can ONLY be activated by pathname (/demo/*), never by URL param or localStorage.
 * This prevents ?mode=demo on /dashboard from activating DemoAuthProvider.
 */
function resolveInitialEnvironment(): Environment {
  const nonDemoValid: readonly Environment[] = ['sandbox', 'production'];
  if (typeof window !== 'undefined') {
    // PATHNAME IS AUTHORITATIVE — /demo/* routes are always demo mode
    if (window.location.pathname.startsWith('/demo/')) {
      return 'demo';
    }

    const urlMode = new URLSearchParams(window.location.search).get('mode');
    if (urlMode && nonDemoValid.includes(urlMode as Environment)) {
      localStorage.setItem('lumiq-environment', urlMode);
      return urlMode as Environment;
    }
  }
  try {
    const saved = localStorage.getItem('lumiq-environment');
    if (saved && nonDemoValid.includes(saved as Environment)) return saved as Environment;
  } catch { /* restricted storage */ }
  return 'sandbox';
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
    // Don't persist 'demo' to localStorage — pathname is authoritative for demo mode
    if (env !== 'demo') {
      localStorage.setItem('lumiq-environment', env);
    }

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

    // Auth provider change requires full reload with clean URL
    if (authProviderChanges) {
      if (currentEnvironment === 'demo' && env !== 'demo') {
        // Leaving demo -> clean redirect to dashboard with new mode
        window.location.href = `/dashboard?mode=${env}`;
      } else {
        // Entering demo -> redirect to demo route with default bank
        window.location.href = '/demo/chase';
      }
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
