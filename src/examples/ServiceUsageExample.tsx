/**
 * Service Usage Examples
 * Demonstrates how to use the centralized API services
 */

import React, { useState, useEffect } from 'react'
import { authService, dashboardService, apiService } from '../services'

const ServiceUsageExample: React.FC = () => {
  const [user, setUser] = useState(null)
  const [apiKeys, setApiKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Example: Login user
  const handleLogin = async () => {
    try {
      setLoading(true)
      setError('')
      
      const authResponse = await authService.login({
        email: 'user@example.com',
        password: 'password123'
      })
      
      setUser(authResponse.user)
      console.log('Login successful:', authResponse)
    } catch (error: any) {
      setError(error.message)
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Example: Register new user
  const handleRegister = async () => {
    try {
      setLoading(true)
      setError('')
      
      const authResponse = await authService.register({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      })
      
      setUser(authResponse.user)
      console.log('Registration successful:', authResponse)
    } catch (error: any) {
      setError(error.message)
      console.error('Registration failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Example: Get API keys
  const fetchApiKeys = async () => {
    try {
      setLoading(true)
      setError('')
      
      const keys = await dashboardService.getApiKeys()
      setApiKeys(keys)
      console.log('API keys fetched:', keys)
    } catch (error: any) {
      setError(error.message)
      console.error('Failed to fetch API keys:', error)
    } finally {
      setLoading(false)
    }
  }

  // Example: Create API key
  const createApiKey = async () => {
    try {
      setLoading(true)
      setError('')
      
      const newKey = await dashboardService.createApiKey({
        name: 'My Test Key',
        scopes: ['read', 'write'],
        expiresInDays: 30
      })
      
      setApiKeys(prev => [...prev, newKey])
      console.log('API key created:', newKey)
    } catch (error: any) {
      setError(error.message)
      console.error('Failed to create API key:', error)
    } finally {
      setLoading(false)
    }
  }

  // Example: Test API endpoint
  const testApiEndpoint = async () => {
    try {
      setLoading(true)
      setError('')
      
      const result = await dashboardService.testApiEndpoint(
        '/api/v1/credit-report',
        'GET',
        undefined,
        'your-api-key-here'
      )
      
      console.log('API test result:', result)
    } catch (error: any) {
      setError(error.message)
      console.error('API test failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Example: Direct API call using apiService
  const directApiCall = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Set API key for this request
      apiService.setApiKey('your-api-key-here')
      
      const response = await apiService.get('/api/v1/credit-report')
      console.log('Direct API call result:', response.data)
    } catch (error: any) {
      setError(error.message)
      console.error('Direct API call failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Example: Get API stats
  const fetchApiStats = async () => {
    try {
      setLoading(true)
      setError('')
      
      const stats = await dashboardService.getApiStats()
      console.log('API stats:', stats)
    } catch (error: any) {
      setError(error.message)
      console.error('Failed to fetch API stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Example: Logout
  const handleLogout = () => {
    authService.logout()
    setUser(null)
    setApiKeys([])
    console.log('User logged out')
  }

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
        } catch (error) {
          console.error('Failed to get current user:', error)
        }
      }
    }
    
    checkAuth()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Service Usage Examples</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authentication Examples */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Authentication</h2>
          
          {user ? (
            <div className="space-y-4">
              <p className="text-green-600">Logged in as: {user.email}</p>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Register'}
              </button>
            </div>
          )}
        </div>

        {/* API Keys Examples */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">API Keys</h2>
          
          <div className="space-y-4">
            <button
              onClick={fetchApiKeys}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch API Keys'}
            </button>
            
            <button
              onClick={createApiKey}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Create API Key'}
            </button>
            
            {apiKeys.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">API Keys ({apiKeys.length})</h3>
                <div className="space-y-2">
                  {apiKeys.map((key: any) => (
                    <div key={key.id} className="p-2 bg-gray-100 rounded text-sm">
                      <div className="font-medium">{key.name}</div>
                      <div className="text-gray-600">{key.key}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* API Testing Examples */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">API Testing</h2>
          
          <div className="space-y-4">
            <button
              onClick={testApiEndpoint}
              disabled={loading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Test API Endpoint'}
            </button>
            
            <button
              onClick={directApiCall}
              disabled={loading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Direct API Call'}
            </button>
            
            <button
              onClick={fetchApiStats}
              disabled={loading}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch API Stats'}
            </button>
          </div>
        </div>

        {/* Service Configuration */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Service Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Current Configuration</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Mock Mode: {import.meta.env.VITE_USE_MOCK_AUTH === 'true' ? 'Enabled' : 'Disabled'}</div>
                <div>API Base URL: {import.meta.env.VITE_API_BASE_URL || 'https://futeur.app'}</div>
                <div>Development Mode: {import.meta.env.DEV ? 'Yes' : 'No'}</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Environment Variables</h3>
              <div className="text-sm text-gray-600">
                <p>Set VITE_USE_MOCK_AUTH=true to enable mock mode</p>
                <p>Set VITE_API_BASE_URL to change API endpoint</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceUsageExample
