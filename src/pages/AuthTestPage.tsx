import React, { useState } from 'react'
import { authService, dashboardService } from '../services'
import { debugApiConnection } from '../utils/debugApiConnection'
import { testLiveApiConnection, testLiveApiWithKey, testLiveAuth, testLiveRegister } from '../utils/liveApiTest'
import { debugClerkConfiguration, testClerkConnection } from '../utils/debugClerk'

const AuthTestPage: React.FC = () => {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('password123')
  const [name, setName] = useState('Test User')
  const [apiKey, setApiKey] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError('')
      setResult(null)
      
      // Test live API directly
      const liveResult = await testLiveAuth(email, password)
      if (liveResult.success) {
        setResult({ type: 'live-login', data: liveResult.data })
      } else {
        // Fallback to service
        const response = await authService.login({ email, password })
        setResult({ type: 'service-login', data: response })
      }
    } catch (err: any) {
      setError(`Login failed: ${err.message}`)
      setResult({ type: 'login', error: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    try {
      setLoading(true)
      setError('')
      setResult(null)
      
      // Test live API directly
      const liveResult = await testLiveRegister(name, email, password)
      if (liveResult.success) {
        setResult({ type: 'live-register', data: liveResult.data })
      } else {
        // Fallback to service
        const response = await authService.register({ name, email, password })
        setResult({ type: 'service-register', data: response })
      }
    } catch (err: any) {
      setError(`Registration failed: ${err.message}`)
      setResult({ type: 'register', error: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleTestApiKeys = async () => {
    try {
      setLoading(true)
      setError('')
      setResult(null)
      
      const keys = await dashboardService.getApiKeys()
      setResult({ type: 'api-keys', data: keys })
    } catch (err: any) {
      setError(`API Keys test failed: ${err.message}`)
      setResult({ type: 'api-keys', error: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleTestWithApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key')
      return
    }

    try {
      setLoading(true)
      setError('')
      setResult(null)
      
      // Test live API with key
      const liveResult = await testLiveApiWithKey(apiKey)
      if (liveResult.success) {
        setResult({ type: 'live-api-test', data: liveResult.data })
      } else {
        // Fallback to service
        const response = await dashboardService.testApiEndpoint(
          '/api/v1/api-keys',
          'GET',
          undefined,
          apiKey
        )
        setResult({ type: 'service-api-test', data: response })
      }
    } catch (err: any) {
      setError(`API test failed: ${err.message}`)
      setResult({ type: 'api-test', error: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleDebugConnection = () => {
    debugApiConnection()
  }

  const handleTestLiveConnection = async () => {
    try {
      setLoading(true)
      setError('')
      setResult(null)
      
      const liveResult = await testLiveApiConnection()
      setResult({ type: 'live-connection', data: liveResult })
    } catch (err: any) {
      setError(`Live connection test failed: ${err.message}`)
      setResult({ type: 'live-connection', error: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleDebugClerk = () => {
    const clerkDebug = debugClerkConfiguration()
    setResult({ type: 'clerk-debug', data: clerkDebug })
  }

  const handleTestClerk = async () => {
    try {
      setLoading(true)
      setError('')
      setResult(null)
      
      const clerkResult = await testClerkConnection()
      setResult({ type: 'clerk-test', data: clerkResult })
    } catch (err: any) {
      setError(`Clerk test failed: ${err.message}`)
      setResult({ type: 'clerk-test', error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Auth & API Test Page</h1>
        
        {/* Environment Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Environment Info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Mode:</strong> {import.meta.env.DEV ? 'Development' : 'Production'}
            </div>
            <div>
              <strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'https://futeur.app'}
            </div>
            <div>
              <strong>Current Host:</strong> {window.location.host}
            </div>
            <div>
              <strong>Protocol:</strong> {window.location.protocol}
            </div>
            <div>
              <strong>Mock Mode:</strong> {import.meta.env.VITE_USE_MOCK_AUTH === 'true' ? 'Enabled' : 'Disabled'}
            </div>
          </div>
        </div>

        {/* Debug Buttons */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={handleDebugConnection}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
          >
            🔍 Debug API
          </button>
          <button
            onClick={handleTestLiveConnection}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
          >
            {loading ? 'Testing...' : '🚀 Test API'}
          </button>
          <button
            onClick={handleDebugClerk}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            🔍 Debug Clerk
          </button>
          <button
            onClick={handleTestClerk}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 text-sm"
          >
            {loading ? 'Testing...' : '🧪 Test Clerk'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Authentication Tests */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Authentication Tests</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (for registration)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Test Login'}
                </button>
                
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Test Register'}
                </button>
              </div>
            </div>
          </div>

          {/* API Tests */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">API Tests</h2>
            
            <div className="space-y-4">
              <button
                onClick={handleTestApiKeys}
                disabled={loading}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Test Get API Keys'}
              </button>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key (for testing)
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key here"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <button
                onClick={handleTestWithApiKey}
                disabled={loading || !apiKey.trim()}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Test API with Key'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {(result || error) && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="text-red-800 font-medium">Error:</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {result && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-gray-800 font-medium mb-2">
                  {result.type.toUpperCase()} Result:
                </h3>
                <pre className="text-sm text-gray-700 overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Troubleshooting Tips */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-medium mb-2">Troubleshooting Tips:</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• If login/register works but API calls fail, it's likely a CORS or domain restriction issue</li>
            <li>• Check the browser console for detailed error messages</li>
            <li>• Make sure you're using the correct API key for your domain</li>
            <li>• Try the "Debug API Connection" button to see detailed logs</li>
            <li>• In development, make sure Vite proxy is working (check for proxy logs in terminal)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AuthTestPage
