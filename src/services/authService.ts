/**
 * Authentication Service
 * Handles login, register, and user management operations
 */

import apiService from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  customerId: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  apiCallsUsed: number;
  apiCallsLimit: number;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

class AuthService {
  private readonly MOCK_MODE = import.meta.env.VITE_USE_MOCK_AUTH === 'true' || import.meta.env.DEV;

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (this.MOCK_MODE) {
      return this.mockLogin(credentials);
    }

    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      
      // Store token and user data
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('currentUserEmail', response.data.user.email);
      
      return response.data;
    } catch (error: unknown) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Register new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    if (this.MOCK_MODE) {
      return this.mockRegister(credentials);
    }

    try {
      const response = await apiService.post<AuthResponse>('/auth/register', credentials);
      
      // Store token and user data
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('currentUserEmail', response.data.user.email);
      
      return response.data;
    } catch (error: unknown) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return null;
    }

    if (this.MOCK_MODE) {
      return this.mockGetCurrentUser();
    }

    try {
      const response = await apiService.get<User>('/auth/me');
      return response.data;
    } catch (error: unknown) {
      // If token is invalid, clear it
      const apiError = error as { status?: number };
      if (apiError.status === 401) {
        this.logout();
      }
      throw this.handleAuthError(error);
    }
  }

  /**
   * Refresh user data
   */
  async refreshUser(): Promise<User | null> {
    return this.getCurrentUser();
  }

  /**
   * Logout user
   */
  logout(): void {
    apiService.clearAuth();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: unknown): AuthError {
    const apiError = error as { status?: number; data?: { message?: string; field?: string }; message?: string };

    if (apiError.status === 401) {
      return {
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      };
    } else if (apiError.status === 409) {
      return {
        message: 'User already exists with this email',
        code: 'USER_EXISTS',
        field: 'email'
      };
    } else if (apiError.status === 422) {
      return {
        message: apiError.data?.message || 'Validation failed',
        code: 'VALIDATION_ERROR',
        field: apiError.data?.field
      };
    } else if (apiError.status === 0) {
      return {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR'
      };
    } else {
      return {
        message: apiError.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * SHA-256 hash a password string via Web Crypto API
   */
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Mock implementations for development/testing
  private async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('mockUsers') || '{}');
    const user = users[credentials.email];

    const hashedInput = await this.hashPassword(credentials.password);

    // Support both legacy plaintext and new hashed passwords
    const passwordMatch =
      user?.password === hashedInput ||
      user?.password === credentials.password;

    if (!user || !passwordMatch) {
      throw {
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      };
    }

    // Migrate plaintext password to hash on successful login
    if (user.password === credentials.password && user.password !== hashedInput) {
      user.password = hashedInput;
      users[credentials.email] = user;
      localStorage.setItem('mockUsers', JSON.stringify(users));
    }

    // Generate mock token
    const token = `mock_token_${Date.now()}`;
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUserEmail', credentials.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        customerId: user.customerId,
        plan: user.plan,
        apiCallsUsed: user.apiCallsUsed,
        apiCallsLimit: user.apiCallsLimit,
        createdAt: user.createdAt,
      },
      token
    };
  }

  private async mockRegister(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('mockUsers') || '{}');
    if (users[credentials.email]) {
      throw {
        message: 'User already exists with this email',
        code: 'USER_EXISTS',
        field: 'email'
      };
    }

    // Create new mock user with hashed password
    const hashedPassword = await this.hashPassword(credentials.password);
    const newUser = {
      id: `user_${Date.now()}`,
      email: credentials.email,
      name: credentials.name,
      password: hashedPassword,
      customerId: `cust_${Date.now()}`,
      plan: 'free' as const,
      apiCallsUsed: 0,
      apiCallsLimit: 1000,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    users[credentials.email] = newUser;
    localStorage.setItem('mockUsers', JSON.stringify(users));

    // Generate mock token
    const token = `mock_token_${Date.now()}`;
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUserEmail', credentials.email);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        customerId: newUser.customerId,
        plan: newUser.plan,
        apiCallsUsed: newUser.apiCallsUsed,
        apiCallsLimit: newUser.apiCallsLimit,
        createdAt: newUser.createdAt,
      },
      token
    };
  }

  private async mockGetCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('authToken');
    if (!token || !token.startsWith('mock_token_')) {
      return null;
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get user from localStorage based on token
    const users = JSON.parse(localStorage.getItem('mockUsers') || '{}');
    const userEmail = localStorage.getItem('currentUserEmail');

    if (!userEmail || !users[userEmail]) {
      this.logout();
      return null;
    }

    return {
      id: users[userEmail].id,
      email: users[userEmail].email,
      name: users[userEmail].name,
      customerId: users[userEmail].customerId,
      plan: users[userEmail].plan,
      apiCallsUsed: users[userEmail].apiCallsUsed,
      apiCallsLimit: users[userEmail].apiCallsLimit,
      createdAt: users[userEmail].createdAt,
    };
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;
