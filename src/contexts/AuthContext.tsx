import React, { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react';
import { logger } from '@/utils/logger';
import {
  useAuth as useClerkAuth,
  useUser as useClerkUser,
  useClerk,
  SignedIn,
  SignedOut,
} from '@clerk/clerk-react';
import { setAuthTokenGetter, setApiKey } from '@/services/bff/client';
import { useApiKeyStore } from '@/stores/apiKeyStore';
import { ACTIVE_BANK_ID } from '@/data/bankConfig';
import type { BankId } from '@/data/bankConfig';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  username?: string;
  imageUrl?: string;
  emailAddresses?: Array<{ emailAddress: string }>;
}

interface AuthContextType {
  isSignedIn: boolean;
  isLoaded: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
  /** True when Clerk JWT alone resolves a tenant on the API (no API key needed). */
  jwtAuthWorks: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Returns true when a real Clerk key is set (not empty and not the placeholder). */
export function isClerkConfigured(publishableKey: string | undefined): boolean {
  return Boolean(
    publishableKey &&
    publishableKey !== 'pk_test_placeholder' &&
    publishableKey !== 'pk_test_your_key_here'
  );
}

const FALLBACK_VALUE: AuthContextType = {
  isSignedIn: false,
  isLoaded: true,
  user: null,
  signIn: async () => {
    logger.warn('[Lumiq] Clerk is not configured. Set VITE_CLERK_PUBLISHABLE_KEY in .env to enable sign-in.');
  },
  signUp: async () => {
    logger.warn('[Lumiq] Clerk is not configured. Set VITE_CLERK_PUBLISHABLE_KEY in .env to enable sign-up.');
  },
  signOut: async () => {},
  getToken: async () => null,
  jwtAuthWorks: false,
};

// ── Demo Auth Provider ─────────────────────────────────────────────────
const DEMO_USERS: Record<BankId, User> = {
  chase: {
    id: 'demo-chase-001',
    email: 'sarah.chen@chase.demo',
    firstName: 'Sarah',
    lastName: 'Chen',
    fullName: 'Sarah Chen',
    username: 'sarah.chen',
    imageUrl: '/lumiq-avatar.png',
    emailAddresses: [{ emailAddress: 'sarah.chen@chase.demo' }],
  },
  wellsfargo: {
    id: 'demo-wf-001',
    email: 'm.torres@wellsfargo.demo',
    firstName: 'Michael',
    lastName: 'Torres',
    fullName: 'Michael Torres',
    username: 'm.torres',
    imageUrl: '/lumiq-avatar.png',
    emailAddresses: [{ emailAddress: 'm.torres@wellsfargo.demo' }],
  },
  santander: {
    id: 'demo-sant-001',
    email: 'a.garcia@santander.demo',
    firstName: 'Ana',
    lastName: 'García',
    fullName: 'Ana García',
    username: 'a.garcia',
    imageUrl: '/lumiq-avatar.png',
    emailAddresses: [{ emailAddress: 'a.garcia@santander.demo' }],
  },
  citi: {
    id: 'demo-citi-001',
    email: 'd.park@citi.demo',
    firstName: 'David',
    lastName: 'Park',
    fullName: 'David Park',
    username: 'd.park',
    imageUrl: '/lumiq-avatar.png',
    emailAddresses: [{ emailAddress: 'd.park@citi.demo' }],
  },
};

const DEMO_USER: User = DEMO_USERS[ACTIVE_BANK_ID];

const DEMO_TOKEN = 'demo-token-no-validation';

const DEMO_AUTH_VALUE: AuthContextType = {
  isSignedIn: true,
  isLoaded: true,
  user: DEMO_USER,
  signIn: async () => { /* no-op in demo mode */ },
  signUp: async () => { /* no-op in demo mode */ },
  signOut: async () => { /* no-op in demo mode */ },
  getToken: async () => DEMO_TOKEN,
  jwtAuthWorks: false,
};

/** Auto-authenticated provider for demo mode. Always signed in with admin role. */
export const DemoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Set token getter synchronously to avoid race condition with BFF calls
  setAuthTokenGetter(DEMO_AUTH_VALUE.getToken);
  return (
    <AuthContext.Provider value={DEMO_AUTH_VALUE}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Use when Clerk is not configured: sandbox/production with X-API-Key auth.
 *
 * When an API key is stored (via API Console), this provider:
 * 1. Sets `isSignedIn: true` so ProtectedRoute allows access
 * 2. Injects the API key into the BFF client via `setApiKey()`
 * 3. Subscribes to API key changes so they propagate immediately
 */
export const FallbackAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedApiKey = useApiKeyStore((s) => s.apiKey);
  const [authValue, setAuthValue] = useState<AuthContextType>(() => buildFallbackAuthValue(storedApiKey));

  // Wire the API key into the BFF client whenever it changes
  useEffect(() => {
    setApiKey(storedApiKey);
    setAuthTokenGetter(FALLBACK_VALUE.getToken);
    setAuthValue(buildFallbackAuthValue(storedApiKey));
  }, [storedApiKey]);

  // Subscribe to Zustand store changes outside React (for BFF client sync)
  useEffect(() => {
    const unsub = useApiKeyStore.subscribe((state) => {
      setApiKey(state.apiKey);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

/** Build auth context value based on whether an API key is configured. */
function buildFallbackAuthValue(apiKey: string | null): AuthContextType {
  if (apiKey) {
    return {
      isSignedIn: true,
      isLoaded: true,
      user: {
        id: 'sandbox-user',
        email: 'sandbox@lumiqai.com',
        firstName: 'Sandbox',
        lastName: 'User',
        fullName: 'Sandbox User',
        username: 'sandbox',
        imageUrl: '/lumiq-avatar.png',
      },
      signIn: FALLBACK_VALUE.signIn,
      signUp: FALLBACK_VALUE.signUp,
      signOut: async () => {
        useApiKeyStore.getState().clearApiKey();
        setApiKey(null);
      },
      getToken: async () => null,
      jwtAuthWorks: false,
    };
  }
  return FALLBACK_VALUE;
}

function mapClerkUser(clerkUser: ReturnType<typeof useClerkUser>['user']): User | null {
  if (!clerkUser) return null;
  return {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    firstName: clerkUser.firstName || undefined,
    lastName: clerkUser.lastName || undefined,
    fullName: clerkUser.fullName || undefined,
    username: clerkUser.username || clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] || undefined,
    imageUrl: clerkUser.imageUrl || undefined,
    emailAddresses: clerkUser.emailAddresses?.map(e => ({ emailAddress: e.emailAddress })) || [],
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoaded, getToken: clerkGetToken } = useClerkAuth();
  const { user: clerkUser } = useClerkUser();
  const clerk = useClerk();
  const storedApiKey = useApiKeyStore((s) => s.apiKey);
  const [jwtAuthWorks, setJwtAuthWorks] = useState(false);
  const jwtProbeAttemptedRef = useRef(false);

  const user = mapClerkUser(clerkUser || null);

  // ── Ref to always hold the LATEST clerkGetToken ──
  // This prevents stale closure bugs. The ref is updated on every render,
  // so the stable getToken callback always calls the most current Clerk function.
  const clerkGetTokenRef = useRef(clerkGetToken);
  clerkGetTokenRef.current = clerkGetToken;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signIn = async (_email: string, _password: string) => {
    clerk.redirectToSignIn();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signUp = async (_email: string, _password: string) => {
    clerk.redirectToSignUp();
  };

  const signOut = async () => {
    useApiKeyStore.getState().clearApiKey();
    setApiKey(null);
    await clerk.signOut();
  };

  // Stable token getter — always calls the latest clerkGetToken via ref
  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      const fn = clerkGetTokenRef.current;
      if (!fn) {
        logger.error('[AUTH] clerkGetTokenRef.current is null/undefined');
        return null;
      }
      const token = await fn();
      if (!token) {
        logger.error('[AUTH] clerkGetToken() returned null — session may not be loaded');
      }
      return token;
    } catch (err) {
      logger.error('[AUTH] clerkGetToken() threw:', err);
      return null;
    }
  }, []);

  // Inject Clerk token getter into BFF client ONCE (stable via useCallback)
  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  // Wire API key from store into BFF client (takes priority over Clerk JWT)
  useEffect(() => {
    setApiKey(storedApiKey);
  }, [storedApiKey]);

  // Subscribe to Zustand store changes outside React (for BFF client sync)
  useEffect(() => {
    const unsub = useApiKeyStore.subscribe((state) => {
      setApiKey(state.apiKey);
    });
    return unsub;
  }, []);

  // ── Smart auth detection: probe API with JWT to check if tenant is wired ──
  // When user signs in via Clerk but has no API key, try fetching /portfolios
  // with just the JWT. If it works, the Clerk org is wired to a tenant.
  useEffect(() => {
    if (!isSignedIn || !isLoaded || storedApiKey || jwtProbeAttemptedRef.current) return;
    jwtProbeAttemptedRef.current = true;

    const probeJwtAuth = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) return;

      try {
        const token = await getToken();
        if (!token) return;

        const response = await fetch(`${apiUrl}/dashboard/portfolios`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const body = await response.json();
          if (body.success && Array.isArray(body.data) && body.data.length > 0) {
            logger.info('[AUTH] JWT auth works — Clerk org wired to tenant, skipping API key onboarding');
            setJwtAuthWorks(true);
          }
        }
      } catch {
        // JWT probe failed — user needs API key
      }
    };

    probeJwtAuth();
  }, [isSignedIn, isLoaded, storedApiKey, getToken]);

  return (
    <AuthContext.Provider
      value={{
        isSignedIn: !!isSignedIn,
        isLoaded: !!isLoaded,
        user,
        signIn,
        signUp,
        signOut,
        getToken,
        jwtAuthWorks,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useUser = () => {
  const { user, isSignedIn, isLoaded } = useAuth();
  return { user, isSignedIn, isLoaded };
};

// Re-export Clerk components for convenience
export { SignedIn, SignedOut };
