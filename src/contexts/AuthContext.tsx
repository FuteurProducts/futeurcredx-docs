import React, { createContext, useContext, useEffect } from 'react';
import { logger } from '@/utils/logger';
import {
  useAuth as useClerkAuth,
  useUser as useClerkUser,
  useClerk,
  SignedIn,
  SignedOut,
} from '@clerk/clerk-react';
import { setAuthTokenGetter } from '@/services/bff/client';
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

/** Use when Clerk is not configured: provides same context with no-auth state so the app still runs. */
export const FallbackAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    setAuthTokenGetter(FALLBACK_VALUE.getToken);
  }, []);
  return (
    <AuthContext.Provider value={FALLBACK_VALUE}>
      {children}
    </AuthContext.Provider>
  );
};

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

  const user = mapClerkUser(clerkUser || null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signIn = async (_email: string, _password: string) => {
    // Clerk handles sign-in via its own UI components (SignIn, RedirectToSignIn)
    clerk.redirectToSignIn();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signUp = async (_email: string, _password: string) => {
    clerk.redirectToSignUp();
  };

  const signOut = async () => {
    await clerk.signOut();
  };

  const getToken = async (): Promise<string | null> => {
    try {
      return await clerkGetToken();
    } catch {
      return null;
    }
  };

  // Inject token getter into BFF client so it can authenticate requests
  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [clerkGetToken]);

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
