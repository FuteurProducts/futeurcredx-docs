import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import toast from 'react-hot-toast';

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

  const switchEnvironment = useCallback(async (env: Environment) => {
    if (env === currentEnvironment) return;
    
    setIsSwitching(true);
    
    // Update the config status to syncing
    if (env === 'sandbox') {
      setSandboxConfig(prev => ({ ...prev, status: 'syncing' }));
    } else {
      setProductionConfig(prev => ({ ...prev, status: 'syncing' }));
    }

    try {
      // Simulate API sync/validation (in production, this would validate credentials)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update environment
      setCurrentEnvironment(env);
      localStorage.setItem('lumiq-environment', env);
      
      // Update config status
      if (env === 'sandbox') {
        setSandboxConfig(prev => ({ 
          ...prev, 
          status: 'active',
          lastSync: new Date().toISOString().split('T')[0]
        }));
        toast.success('Switched to Sandbox environment', {
          icon: '🧪',
          duration: 3000,
        });
      } else {
        setProductionConfig(prev => ({ 
          ...prev, 
          status: 'active',
          lastSync: new Date().toISOString().split('T')[0]
        }));
        toast.success('Switched to Production environment', {
          icon: '🚀',
          duration: 3000,
        });
      }
    } catch (error) {
      // Handle error
      if (env === 'sandbox') {
        setSandboxConfig(prev => ({ ...prev, status: 'error' }));
      } else {
        setProductionConfig(prev => ({ ...prev, status: 'error' }));
      }
      toast.error('Failed to switch environment');
    } finally {
      setIsSwitching(false);
    }
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
