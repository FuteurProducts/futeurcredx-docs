import React, { createContext, useContext, useState, useEffect } from 'react';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsSignedIn(true);
      }
      setIsLoaded(true);
    };
    loadUser();
  }, []);

  const signIn = async (email: string, _password: string) => {
    const mockUser: User = {
      id: 'mock-user-id',
      email,
      firstName: 'Demo',
      lastName: 'User',
      fullName: 'Demo User',
      username: 'demouser',
      imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
      emailAddresses: [{ emailAddress: email }],
    };
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsSignedIn(true);
  };

  const signUp = async (email: string, password: string) => {
    await signIn(email, password);
  };

  const signOut = async () => {
    localStorage.removeItem('mockUser');
    setUser(null);
    setIsSignedIn(false);
  };

  const getToken = async () => {
    return 'mock-token-for-ui-testing';
  };

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        isLoaded,
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

