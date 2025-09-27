import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // In a real app, you would validate the token with your backend
          // For now, we'll just check if it exists
          const userData = localStorage.getItem('user_data');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // In a real app, you would make an API call to your backend
      // For now, we'll simulate a successful login
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe'
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would get the token from your backend response
      const token = 'mock_token_' + Date.now();
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      setUser(mockUser);

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Sign in failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // In a real app, you would make an API call to your backend
      // For now, we'll simulate a successful registration
      const mockUser: User = {
        id: '1',
        email,
        firstName: firstName || 'User',
        lastName: lastName || '',
        fullName: `${firstName || 'User'} ${lastName || ''}`.trim()
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would get the token from your backend response
      const token = 'mock_token_' + Date.now();
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      setUser(mockUser);

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Sign up failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // In a real app, you would make an API call to your backend
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: 'Failed to send reset email. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // In a real app, you would make an API call to your backend
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Failed to reset password. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isSignedIn: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};