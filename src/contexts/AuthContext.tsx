import React, { createContext, useContext, useEffect } from 'react';
import {
  useAuth as useClerkAuth,
  useUser as useClerkUser,
  useClerk,
  SignedIn,
  SignedOut,
} from '@clerk/clerk-react';
import { setAuthTokenGetter } from '@/services/bff/client';

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
