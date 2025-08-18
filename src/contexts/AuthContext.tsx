import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  customerId: string
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  apiCallsUsed: number
  apiCallsLimit: number
  createdAt: string
}

interface ApiKey {
  id: string
  name: string
  key: string
  lastUsed?: string
  callsUsed: number
  isActive: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  apiKeys: ApiKey[]
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  generateApiKey: (name: string) => Promise<ApiKey>
  revokeApiKey: (keyId: string) => Promise<void>
  refreshApiKeys: () => Promise<void>
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

  const isAuthenticated = !!user

  // API base URL - replace with your actual backend URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.futeurcredx.com'

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('authToken')
    if (token) {
      refreshUser()
    } else {
      setIsLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email: string, password: string) => {
    try {
      // MOCK LOGIN FOR TESTING - Replace with real API call later
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('mockUsers') || '{}')
      const user = users[email]
      
      if (!user || user.password !== password) {
        throw new Error('Invalid email or password')
      }
      
      // Generate mock token
      const token = `mock_token_${Date.now()}`
      localStorage.setItem('authToken', token)
      localStorage.setItem('currentUserEmail', email) // Store current user email
      setUser(user)
      await refreshApiKeys()
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      // MOCK REGISTRATION FOR TESTING - Replace with real API call later
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('mockUsers') || '{}')
      if (users[email]) {
        throw new Error('User already exists with this email')
      }
      
      // Create new mock user
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        name,
        password, // In real app, this would be hashed
        customerId: `cust_${Date.now()}`,
        plan: 'free' as const,
        apiCallsUsed: 0,
        apiCallsLimit: 1000,
        createdAt: new Date().toISOString()
      }
      
      // Save to localStorage
      users[email] = newUser
      localStorage.setItem('mockUsers', JSON.stringify(users))
      
      // Generate mock token
      const token = `mock_token_${Date.now()}`
      localStorage.setItem('authToken', token)
      localStorage.setItem('currentUserEmail', email) // Store current user email
      setUser(newUser)
      await refreshApiKeys()
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUserEmail')
    setUser(null)
    setApiKeys([])
  }

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token || !token.startsWith('mock_token_')) {
        setIsLoading(false)
        return
      }

      // MOCK USER REFRESH FOR TESTING
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Get user from localStorage based on token
      const users = JSON.parse(localStorage.getItem('mockUsers') || '{}')
      const userEmail = localStorage.getItem('currentUserEmail')
      
      if (!userEmail || !users[userEmail]) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('currentUserEmail')
        setUser(null)
        setIsLoading(false)
        return
      }

      setUser(users[userEmail])
      await refreshApiKeys()
    } catch (error) {
      console.error('Refresh user error:', error)
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUserEmail')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const generateApiKey = async (name: string): Promise<ApiKey> => {
    try {
      // MOCK API KEY GENERATION FOR TESTING
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newApiKey: ApiKey = {
        id: `key_${Date.now()}`,
        name,
        key: `sk_test_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        callsUsed: 0,
        isActive: true,
        createdAt: new Date().toISOString()
      }
      
      // Save to localStorage
      const currentKeys = JSON.parse(localStorage.getItem('mockApiKeys') || '[]')
      currentKeys.push(newApiKey)
      localStorage.setItem('mockApiKeys', JSON.stringify(currentKeys))
      
      setApiKeys(prev => [...prev, newApiKey])
      return newApiKey
    } catch (error) {
      console.error('Generate API key error:', error)
      throw error
    }
  }

  const revokeApiKey = async (keyId: string) => {
    try {
      // MOCK API KEY REVOCATION FOR TESTING
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Remove from localStorage
      const currentKeys = JSON.parse(localStorage.getItem('mockApiKeys') || '[]')
      const updatedKeys = currentKeys.filter((key: ApiKey) => key.id !== keyId)
      localStorage.setItem('mockApiKeys', JSON.stringify(updatedKeys))
      
      setApiKeys(prev => prev.filter(key => key.id !== keyId))
    } catch (error) {
      console.error('Revoke API key error:', error)
      throw error
    }
  }

  const refreshApiKeys = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return

      // MOCK API KEYS REFRESH FOR TESTING
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const keys = JSON.parse(localStorage.getItem('mockApiKeys') || '[]')
      setApiKeys(keys)
    } catch (error) {
      console.error('Refresh API keys error:', error)
    }
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
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
