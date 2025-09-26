import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import authService, { User, AuthError } from '../services/authService'
import dashboardService, { ApiKey, CreateApiKeyRequest } from '../services/dashboardService'

interface AuthContextType {
  user: User | null
  apiKeys: ApiKey[]
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  generateApiKey: (name: string, config?: Partial<CreateApiKeyRequest>) => Promise<ApiKey>
  revokeApiKey: (keyId: string) => Promise<void>
  refreshApiKeys: () => Promise<void>
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!user

  useEffect(() => {
    // Check if user is logged in on app start
    if (authService.isAuthenticated()) {
      refreshUser()
    } else {
      setIsLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      setIsLoading(true)
      
      const authResponse = await authService.login({ email, password })
      setUser(authResponse.user)
      await refreshApiKeys()
    } catch (error: any) {
      const authError = error as AuthError
      setError(authError.message)
      console.error('Login error:', authError)
      throw authError
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null)
      setIsLoading(true)
      
      const authResponse = await authService.register({ name, email, password })
      setUser(authResponse.user)
      await refreshApiKeys()
    } catch (error: any) {
      const authError = error as AuthError
      setError(authError.message)
      console.error('Registration error:', authError)
      throw authError
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setApiKeys([])
    setError(null)
  }

  const refreshUser = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const user = await authService.refreshUser()
      if (user) {
        setUser(user)
        await refreshApiKeys()
      } else {
        setUser(null)
        setApiKeys([])
      }
    } catch (error: any) {
      const authError = error as AuthError
      setError(authError.message)
      console.error('Refresh user error:', authError)
      setUser(null)
      setApiKeys([])
    } finally {
      setIsLoading(false)
    }
  }

  const generateApiKey = async (name: string, config?: Partial<CreateApiKeyRequest>): Promise<ApiKey> => {
    try {
      setError(null)
      
      const newApiKey = await dashboardService.createApiKey({
        name,
        ...config
      })
      
      setApiKeys(prev => [...prev, newApiKey])
      return newApiKey
    } catch (error: any) {
      const apiError = error as any
      setError(apiError.message)
      console.error('Generate API key error:', apiError)
      throw apiError
    }
  }

  const revokeApiKey = async (keyId: string) => {
    try {
      setError(null)
      
      await dashboardService.revokeApiKey(keyId)
      setApiKeys(prev => prev.filter(key => key.id !== keyId))
    } catch (error: any) {
      const apiError = error as any
      setError(apiError.message)
      console.error('Revoke API key error:', apiError)
      throw apiError
    }
  }

  const refreshApiKeys = async () => {
    try {
      if (!authService.isAuthenticated()) return

      const keys = await dashboardService.getApiKeys()
      setApiKeys(keys)
    } catch (error: any) {
      const apiError = error as any
      setError(apiError.message)
      console.error('Refresh API keys error:', apiError)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    apiKeys,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    generateApiKey,
    revokeApiKey,
    refreshApiKeys,
    error,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
