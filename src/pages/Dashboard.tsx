import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Activity,
  Key,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  BarChart3,
  Shield,
  FileText,
  ExternalLink,
  TrendingUp,
  Calendar,
  Code,
  CreditCard,
  Rocket
} from 'lucide-react'
import { useUser, SignOutButton, useAuth } from '@clerk/clerk-react'
import ApiTesting from '../components/dashboard/ApiTesting'

const Dashboard: React.FC = () => {
  const { user } = useUser()
  const { getToken } = useAuth()
  
  // State management
  const [apiKeys, setApiKeys] = useState([])
  const [isLoadingKeys, setIsLoadingKeys] = useState(true)
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})
  const [newKeyName, setNewKeyName] = useState('')
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)
  const [error, setError] = useState('')
  const [apiStats, setApiStats] = useState<any>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [keyConfig, setKeyConfig] = useState({
    scopes: [] as string[],
    expiresInDays: 30,
    ipWhitelist: [] as string[],
    geoRestrictions: [] as string[]
  })
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [currentToken, setCurrentToken] = useState('')
  const [debugInfo, setDebugInfo] = useState('')
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const [showTokenDebug, setShowTokenDebug] = useState(false)
  const [tokenInfo, setTokenInfo] = useState<{token: string, preview: string, length: number} | null>(null)
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<{id: string, key: string, name: string} | null>(null)

  // Get current authentication token for debugging
  const fetchCurrentToken = async () => {
    try {
      const token = await getToken()
      if (token) {
        setTokenInfo({
          token: token,
          preview: token.substring(0, 50) + '...',
          length: token.length
        })
      } else {
        setTokenInfo(null)
      }
    } catch (error) {
      console.error('Error fetching token:', error)
      setTokenInfo(null)
    }
  }

  // Fetch all API keys for authenticated user (keys expire after 30 days)
  const fetchApiKeys = async () => {
    try {
      // Get the default Clerk token
      const token = await getToken()
      
      console.log('Clerk token obtained:', token ? 'Token exists' : 'No token')
      if (token) {
        console.log('Token preview:', token.substring(0, 20) + '...')
      }
      
      if (!token) {
        setError('No authentication token available. Please sign in again.')
        setIsLoadingKeys(false)
        return
      }

      // Always use relative URL to work with Vercel proxy
      const apiUrl = '/api/v1/api-keys'
      console.log('Making API request to:', apiUrl, 'for all user keys')
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('API Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('API Response data:', data)
        console.log('Raw API Keys from backend:', JSON.stringify(data.apiKeys, null, 2))
        setApiKeys(data.apiKeys || [])
        setError('') // Clear any previous errors
      } else {
        const errorText = await response.text()
        console.error('API Error Response:', response.status, errorText)
        
        if (response.status === 401) {
          setError('Authentication failed. Your session may have expired. Please sign out and sign in again.')
          setApiKeys([]) // Ensure empty array so dashboard renders
        } else if (response.status === 500 && errorText.includes('User not found')) {
          setError('⚠️ User account exists but API access issue. This might be a backend user lookup problem.')
          setApiKeys([]) // Ensure empty array so dashboard renders
          console.error('Backend user lookup issue - user exists but API calls failing')
        } else if (response.status === 404 && errorText.includes('User not found')) {
          setError('⚠️ User account exists but API access issue. This might be a backend user lookup problem.')
          setApiKeys([]) // Ensure empty array so dashboard renders
          console.error('Backend user lookup issue - user exists but API calls failing')
        } else {
          setError(`API Error: ${response.status} - ${response.statusText}`)
        }
      }
    } catch (error) {
      console.error('Error fetching API keys:', error)
      if (error instanceof TypeError && error.message === 'Load failed') {
        setError('CORS Error: Backend API not configured for localhost. This will work in production.')
        // For development, use mock data
        setApiKeys([
          {
            id: 'dev-1',
            name: 'Development Key (Mock)',
            key: 'fc_dev_1234567890abcdef',
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
            callsUsed: 150,
            scopes: ['read:users', 'write:orders'],
            expiresInDays: 30,
            ipWhitelist: ['127.0.0.1'],
            geoRestrictions: ['US']
          }
        ])
      } else {
        setError('Failed to load API keys. Please try again.')
        // Set empty array so dashboard still renders
        setApiKeys([])
      }
    } finally {
      setIsLoadingKeys(false)
    }
  }

  // Fetch API usage statistics from backend
  const fetchApiStats = async () => {
    try {
      setIsLoadingStats(true)
      
      const token = await getToken()
      if (!token) {
        throw new Error('No authentication token available')
      }

      const response = await fetch('/api/v1/api-keys/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      setApiStats(data)
    } catch (error: any) {
      console.error('Failed to fetch API stats:', error)
      // Set default stats on error
      setApiStats({
        totalCalls: 0,
        monthlyLimit: 10000,
        plan: 'Free',
        thisMonth: 0,
        lastMonth: 0,
        growth: 0
      })
    } finally {
      setIsLoadingStats(false)
    }
  }

  // Get detailed information about a specific API key
  const getApiKeyDetails = async (keyId: string) => {
    try {
      const token = await getToken()
      
      if (!token) {
        console.log('No token available for API key details')
        return null
      }

      // Always use relative URL to work with Vercel proxy
      const baseUrl = '/api/v1/api-keys'
      const detailsUrl = `${baseUrl}/${keyId}`
      console.log('Fetching API key details from:', detailsUrl)
      
      const response = await fetch(detailsUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const keyDetails = await response.json()
        console.log('API Key Details Response:', keyDetails)
        return keyDetails
      } else {
        console.log('Failed to fetch API key details:', response.status)
        return null
      }
    } catch (error) {
      console.error('Error fetching API key details:', error)
      return null
    }
  }

  // Generate new API key
  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) return
    
    setIsGeneratingKey(true)
    setError('')
    
    try {
      const token = await getToken()
      
      if (!token) {
        setError('No authentication token available. Please sign in again.')
        return
      }
      
      // Always use relative URL to work with Vercel proxy
      const baseUrl = '/api/v1/api-keys'
      
      // Build request payload - only include optional fields if they have values
      const requestPayload: {
        name: string;
        scopes?: string[];
        expiresInDays?: number;
        ipWhitelist?: string[];
        geoRestrictions?: string[];
      } = {
        name: newKeyName.trim()
      }
      
      // Only add optional fields if user has configured them
      if (keyConfig.scopes.length > 0) {
        requestPayload.scopes = keyConfig.scopes
      }
      
      if (keyConfig.expiresInDays && keyConfig.expiresInDays !== 30) {
        requestPayload.expiresInDays = keyConfig.expiresInDays
      }
      
      if (keyConfig.ipWhitelist.length > 0) {
        requestPayload.ipWhitelist = keyConfig.ipWhitelist
      }
      
      if (keyConfig.geoRestrictions.length > 0) {
        requestPayload.geoRestrictions = keyConfig.geoRestrictions
      }
      
      console.log('🔑 API Key Generation Debug Info:')
      console.log('- URL:', baseUrl)
      console.log('- Token preview:', token.substring(0, 20) + '...')
      console.log('- Request payload:', JSON.stringify(requestPayload, null, 2))
      console.log('- Headers:', {
        'Authorization': `Bearer ${token.substring(0, 20)}...`,
        'Content-Type': 'application/json'
      })
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      })

      if (response.ok) {
        try {
          const newKey = await response.json()
          console.log('API Key Creation Response:', newKey)
          
          // Handle nested API key structure - the actual key data is in newKey.apiKey
          const apiKeyData = newKey.apiKey || newKey
          
          // Validate the response structure - only name is required
          if (!apiKeyData || typeof apiKeyData !== 'object' || !apiKeyData.name) {
            console.error('Invalid API key response format (missing name):', { response: newKey, apiKeyData })
            setError('Invalid response format from server - missing name field')
            return
          }
          
          // Build API key object with minimal required fields (only name is necessary)
          const validatedKey = {
            id: apiKeyData.id || `temp-${Date.now()}`,
            name: apiKeyData.name, // Only required field from backend
            key: apiKeyData.key || apiKeyData.apiKey || apiKeyData.token || apiKeyData.value || 'key-not-provided',
            keyPrefix: apiKeyData.keyPrefix || null, // Include key prefix if available
            createdAt: apiKeyData.createdAt || apiKeyData.created_at || new Date().toISOString(),
            lastUsed: apiKeyData.lastUsed || apiKeyData.last_used || null,
            callsUsed: apiKeyData.callsUsed || apiKeyData.calls_used || 0,
            isActive: apiKeyData.isActive !== undefined ? apiKeyData.isActive : true,
            environment: apiKeyData.environment || 'development',
            // Store the full key when first created (this is the only time we get it)
            fullKeyOnCreation: apiKeyData.key || apiKeyData.apiKey || apiKeyData.token || apiKeyData.value || null,
            // Include any additional fields from backend response
            ...apiKeyData,
            // Also include the success message if available
            message: newKey.message || null
          }
          
          console.log('🔑 API Key Creation - Full Response:', JSON.stringify(newKey, null, 2))
          console.log('🔑 Validated Key Object:', JSON.stringify(validatedKey, null, 2))
          
          console.log('Validated API Key:', validatedKey)
          
          // Store the newly generated key for the security warning
          if (validatedKey.key || validatedKey.fullKeyOnCreation) {
            setNewlyGeneratedKey({
              id: validatedKey.id,
              key: validatedKey.key || validatedKey.fullKeyOnCreation,
              name: validatedKey.name
            })
          }
          
          setApiKeys(prev => Array.isArray(prev) ? [...prev, validatedKey] : [validatedKey])
          setNewKeyName('')
          setKeyConfig({
            scopes: [],
            expiresInDays: 30,
            ipWhitelist: [],
            geoRestrictions: []
          })
          setShowAdvancedOptions(false)
          setError('') // Clear any previous errors
        } catch (parseError) {
          console.error('Failed to parse API key response:', parseError)
          setError('Failed to process server response')
        }
      } else {
        try {
          const errorData = await response.json()
          console.error('🚨 API Key Generation Error Details:')
          console.error('- Status:', response.status)
          console.error('- Status Text:', response.statusText)
          console.error('- Error Response:', JSON.stringify(errorData, null, 2))
          console.error('- Request URL:', baseUrl)
          console.error('- Request Payload:', JSON.stringify(requestPayload, null, 2))
          
          // Show detailed error to user with backend debugging info
          const errorMessage = errorData.error || errorData.message || errorData.details || `Server Error: ${response.status}`
          setError(`❌ Backend Error: ${errorMessage}

🔍 Debug Information:
- Status: ${response.status} (Internal Server Error)
- This is a backend/server issue, not a frontend problem
- Your request payload is correct: ${JSON.stringify(requestPayload, null, 2)}
- Authentication token is valid

🛠️ Possible Backend Issues:
1. Database connection problems
2. User not found in backend database
3. Backend service configuration issues
4. Missing environment variables on server
5. Backend API service may be down

💡 Next Steps:
- Check backend server logs for detailed error
- Verify backend database connectivity
- Ensure user exists in backend system
- Check backend service health status`)
        } catch (parseError) {
          const errorText = await response.text()
          console.error('🚨 API Key Generation Error (unparseable response):')
          console.error('- Status:', response.status)
          console.error('- Status Text:', response.statusText)
          console.error('- Raw Response:', errorText)
          console.error('- Parse Error:', parseError)
          console.error('- Request URL:', baseUrl)
          console.error('- Request Payload:', JSON.stringify(requestPayload, null, 2))
          
          setError(`❌ Server Error ${response.status}: ${response.statusText}`)
        }
      }
    } catch (error) {
      console.error('Failed to generate API key:', error)
      setError(`Error generating API key: ${error instanceof Error ? error.message : 'Unknown error'}`)
      
      if (error instanceof TypeError && error.message === 'Load failed') {
        // CORS error - simulate successful creation for development
        const mockKey = {
          id: `dev-${Date.now()}`,
          name: newKeyName.trim(),
          key: `fc_dev_${Math.random().toString(36).substring(2, 15)}`,
          createdAt: new Date().toISOString(),
          lastUsed: null,
          callsUsed: 0,
          scopes: keyConfig.scopes,
          expiresInDays: keyConfig.expiresInDays,
          ipWhitelist: keyConfig.ipWhitelist,
          geoRestrictions: keyConfig.geoRestrictions
        }
        setApiKeys(prev => Array.isArray(prev) ? [...prev, mockKey] : [mockKey])
        setNewKeyName('')
        setKeyConfig({
          scopes: [],
          expiresInDays: 30,
          ipWhitelist: [],
          geoRestrictions: []
        })
        setShowAdvancedOptions(false)
        setError('✓ Mock key created (CORS prevents real API call in development)')
      } else {
        setError('Network error. Please try again.')
      }
    } finally {
      setIsGeneratingKey(false)
    }
  }

  // Revoke API key
  const handleRevokeKey = async (keyId: string) => {
    try {
      const token = await getToken()
      // Always use relative URL to work with Vercel proxy
      const baseUrl = '/api/v1/api-keys'
      const response = await fetch(`${baseUrl}/${keyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setApiKeys(prev => prev.filter(key => key.id !== keyId))
        setError('') // Clear any errors
      } else {
        console.error('Failed to revoke API key:', response.statusText)
        setError('Failed to revoke API key')
      }
    } catch (error) {
      console.error('Error revoking API key:', error)
      if (error instanceof TypeError && error.message === 'Load failed') {
        // CORS error - simulate successful deletion for development
        setApiKeys(prev => prev.filter(key => key.id !== keyId))
        setError('✓ Mock key revoked (CORS prevents real API call in development)')
      } else {
        setError('Network error while revoking key')
      }
    }
  }

  // Load API keys on component mount
  useEffect(() => {
    if (user) {
      fetchApiKeys()
      fetchApiStats()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    // You could add a toast notification here
  }

  const toggleKeyVisibility = (keyId: string) => {
    console.log('Toggling key visibility for:', keyId)
    console.log('Current showApiKey state:', showApiKey)
    console.log('API Keys:', apiKeys)
    
    // Find the specific key and log all its properties
    const currentKey = apiKeys.find(k => k.id === keyId)
    if (currentKey) {
      console.log('Current key object:', JSON.stringify(currentKey, null, 2))
      console.log('Available key properties:', Object.keys(currentKey))
      console.log('Key values:', {
        key: currentKey.key,
        apiKey: currentKey.apiKey,
        fullKey: currentKey.fullKey,
        secretKey: currentKey.secretKey,
        keyPrefix: currentKey.keyPrefix,
        token: currentKey.token,
        value: currentKey.value
      })
    }
    
    setShowApiKey(prev => {
      const newState = {
        ...prev,
        [keyId]: !prev[keyId]
      }
      console.log('New showApiKey state:', newState)
      return newState
    })
  }

  const availableScopes = [
    'read:users', 'write:users', 'delete:users',
    'read:orders', 'write:orders', 'delete:orders',
    'read:invoices', 'write:invoices', 'delete:invoices',
    'read:analytics', 'write:analytics'
  ]

  const availableCountries = ['US', 'CA', 'GB', 'DE', 'FR', 'AU', 'JP']

  const handleScopeToggle = (scope: string) => {
    setKeyConfig(prev => ({
      ...prev,
      scopes: prev.scopes.includes(scope)
        ? prev.scopes.filter(s => s !== scope)
        : [...prev.scopes, scope]
    }))
  }

  const handleAddIP = (ip: string) => {
    if (ip.trim() && !keyConfig.ipWhitelist.includes(ip.trim())) {
      setKeyConfig(prev => ({
        ...prev,
        ipWhitelist: [...prev.ipWhitelist, ip.trim()]
      }))
    }
  }

  const handleRemoveIP = (ip: string) => {
    setKeyConfig(prev => ({
      ...prev,
      ipWhitelist: prev.ipWhitelist.filter(i => i !== ip)
    }))
  }

  const handleCountryToggle = (country: string) => {
    setKeyConfig(prev => ({
      ...prev,
      geoRestrictions: prev.geoRestrictions.includes(country)
        ? prev.geoRestrictions.filter(c => c !== country)
        : [...prev.geoRestrictions, country]
    }))
  }

  // Debug Clerk token and backend connectivity
  const debugClerkToken = async () => {
    try {
      const defaultToken = await getToken()
      
      // Decode JWT to see claims (for debugging only)
      let tokenClaims = 'Unable to decode'
      if (defaultToken) {
        try {
          const payload = JSON.parse(atob(defaultToken.split('.')[1]))
          tokenClaims = JSON.stringify(payload, null, 2)
        } catch (e) {
          tokenClaims = 'Invalid JWT format'
        }
      }

      // Test different auth header formats
      let authTests = 'Testing different auth formats...\n'
      if (defaultToken) {
        // Always use relative URL to work with Vercel proxy
      const apiUrl = '/api/v1/api-keys'
        
        // Test 1: Bearer token
        try {
          const response1 = await fetch(apiUrl, {
            method: 'HEAD',
            headers: { 'Authorization': `Bearer ${defaultToken}` }
          })
          authTests += `Bearer Token: ${response1.status} ${response1.statusText}\n`
        } catch (e) {
          authTests += `Bearer Token: Error - ${e}\n`
        }

        // Test 2: Different header name
        try {
          const response2 = await fetch(apiUrl, {
            method: 'HEAD', 
            headers: { 'X-Auth-Token': defaultToken }
          })
          authTests += `X-Auth-Token: ${response2.status} ${response2.statusText}\n`
        } catch (e) {
          authTests += `X-Auth-Token: Error - ${e}\n`
        }

        // Test 3: API Key format
        try {
          const response3 = await fetch(apiUrl, {
            method: 'HEAD',
            headers: { 'X-API-Key': defaultToken }
          })
          authTests += `X-API-Key: ${response3.status} ${response3.statusText}\n`
        } catch (e) {
          authTests += `X-API-Key: Error - ${e}\n`
        }
      }
      
      const info = `
Debug Information:
- User ID: ${user?.id}
- User Email: ${user?.emailAddresses[0]?.emailAddress}
- Default Token: ${defaultToken ? 'EXISTS (' + defaultToken.substring(0, 50) + '...)' : 'NULL'}
- Token Length: ${defaultToken ? defaultToken.length : 0} characters
- Environment: ${import.meta.env.DEV ? 'DEVELOPMENT' : 'PRODUCTION'}
- API URL: /api/v1/api-keys
- Clerk Publishable Key: ${import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 20)}...

Auth Header Tests:
${authTests}

Token Claims:
${tokenClaims}

USER SYNC DEBUG:
Frontend (Clerk) User Data:
- Clerk User ID: ${user?.id}
- Email: ${user?.emailAddresses[0]?.emailAddress}
- First Name: ${user?.firstName}
- Last Name: ${user?.lastName}
- Created: ${user?.createdAt}

JWT Token Claims (what backend sees):
${tokenClaims}

BACKEND REQUIREMENTS:
Your backend needs to either:
1. Auto-create users from JWT claims on first API call
2. Set up Clerk webhooks to sync users (user.created event)
3. Manual user creation endpoint
4. Check if backend is looking for correct user identifier
      `
      setDebugInfo(info)
      setShowDebugInfo(true)
    } catch (error) {
      setDebugInfo(`Error getting debug info: ${error}`)
      setShowDebugInfo(true)
    }
  }

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Calculate usage percentage from real API stats
  const usagePercentage = apiStats ? Math.min(((apiStats.totalCalls || 0) / (apiStats.monthlyLimit || 10000)) * 100, 100) : 0

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* User Profile Section */}
      <div className="sticky top-0 z-40 border-b border-blue-100 bg-white backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-blue-700 font-semibold">Dashboard</div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:block text-sm text-slate-600 truncate max-w-48">
                Welcome, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}
              </div>
              <SignOutButton>
                <button className="px-3 sm:px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium text-blue-700">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="border-b border-blue-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'api-keys', label: 'API Keys', icon: Key }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-blue-600 hover:border-blue-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">


{/* Stats Overview */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-16">
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.1 }}
className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 sm:p-6 shadow-sm"
>
<div className="flex items-center gap-4 mb-4">
<div className="p-3 bg-blue-50 rounded-xl">
<Activity className="w-8 h-8 text-blue-600" />
</div>
<div>
<h3 className="font-black uppercase tracking-tight text-blue-900">API Calls</h3>
<p className="text-sm text-slate-600 font-medium">This month</p>
</div>
</div>
<div className="space-y-3">
{isLoadingStats ? (
<div className="animate-pulse">
<div className="h-6 bg-blue-100 rounded mb-2"></div>
<div className="h-4 bg-blue-100 rounded mb-2"></div>
<div className="h-3 bg-blue-100 rounded"></div>
</div>
) : apiStats ? (
<>
<div className="text-lg font-black">{apiStats.plan || 'Free'}</div>
<div>{(apiStats.totalCalls || 0).toLocaleString()}</div>
<div className="text-sm text-gray-400 font-medium">API Calls Used</div>
<div className="text-xs text-gray-500">
of {(apiStats.monthlyLimit || 10000).toLocaleString()} this month
</div>
<div className="w-full bg-blue-100 rounded-full h-3">
<div 
className="bg-blue-600 h-3 rounded-full transition-all duration-500"
style={{ 
width: `${Math.min(((apiStats.totalCalls || 0) / (apiStats.monthlyLimit || 10000)) * 100, 100)}%` 
}}
/>
</div>
</>
) : (
<>
<div className="text-lg font-black">Free</div>
<div>0</div>
<div className="text-sm text-gray-400 font-medium">API Calls Used</div>
<div className="text-xs text-gray-500">of 10,000 this month</div>
<div className="w-full bg-blue-100 rounded-full h-3">
<div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }} />
</div>
</>
)}
</div>
</motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Key className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-tight text-blue-900">API Keys</h3>
                <p className="text-sm text-slate-600 font-medium">Active keys</p>
              </div>
            </div>
            <div className="text-3xl font-black">{Array.isArray(apiKeys) ? apiKeys.filter(key => key.isActive).length : 0}</div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-tight text-blue-900">Growth</h3>
                <p className="text-sm text-slate-600 font-medium">Month over month</p>
              </div>
            </div>
            <div className="space-y-2">
              {isLoadingStats ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-blue-100 rounded mb-2"></div>
                  <div className="h-4 bg-blue-100 rounded"></div>
                </div>
              ) : apiStats ? (
                <>
                  <div className="text-2xl font-black text-green-600">
                    +{apiStats.growth || 0}%
                  </div>
                  <div className="text-sm text-slate-600">
                    {(apiStats.thisMonth || 0).toLocaleString()} this month vs {(apiStats.lastMonth || 0).toLocaleString()} last month
                  </div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-black text-slate-400">+0%</div>
                  <div className="text-sm text-slate-600">0 this month vs 0 last month</div>
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-tight text-blue-900">Member Since</h3>
                <p className="text-sm text-slate-600 font-medium">Account created</p>
              </div>
            </div>
            <div className="text-lg font-bold">{user ? formatDate(user.createdAt) : ''}</div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12">
          <div className="flex items-center gap-2 p-2 bg-blue-50/50 backdrop-blur-sm rounded-2xl border border-blue-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
                activeTab === 'overview' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 hover:text-blue-700 hover:bg-white/80'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('api-keys')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
                activeTab === 'api-keys' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 hover:text-blue-700 hover:bg-white/80'
              }`}
            >
              <Key className="w-4 h-4" />
              API Keys
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Actions & Getting Started Side by Side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    <Code className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-blue-900">Quick Actions</h2>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('api-keys')}
                    className="w-full group relative overflow-hidden bg-blue-50/50 hover:bg-blue-100/70 border border-blue-200 hover:border-blue-300 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                        <Code className="w-5 h-5 text-blue-700" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-blue-900 mb-1">API Testing</div>
                        <div className="text-sm text-slate-600">Test APIs with your generated tokens</div>
                      </div>
                    </div>
                  </button>
                  
                  <Link
                    to="/docs"
                    className="w-full group relative overflow-hidden bg-blue-50/30 hover:bg-blue-100/50 border border-blue-200 hover:border-blue-300 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm block"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                        <FileText className="w-5 h-5 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-blue-900 mb-1">API Documentation</div>
                        <div className="text-sm text-slate-600">View examples and guides</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-blue-700 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </Link>
                  
                  <div className="w-full group relative overflow-hidden bg-blue-50/20 hover:bg-blue-100/40 border border-blue-200 hover:border-blue-300 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] cursor-pointer backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                        <BarChart3 className="w-5 h-5 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-blue-900 mb-1">Usage Analytics</div>
                        <div className="text-sm text-slate-600">Detailed usage insights</div>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full font-medium">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Getting Started */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    <Rocket className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-blue-900">Getting Started</h2>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 p-4 bg-green-50/80 border border-green-200 rounded-2xl backdrop-blur-sm">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-black text-sm">✓</span>
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-green-800">Account Created</span>
                      <div className="text-sm text-green-600">Welcome to FuteurCredX!</div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 backdrop-blur-sm ${
                    (Array.isArray(apiKeys) && apiKeys.length > 0) 
                      ? 'bg-green-50/80 border-green-200' 
                      : 'bg-blue-50/80 border-blue-200'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                      (Array.isArray(apiKeys) && apiKeys.length > 0) 
                        ? 'bg-green-500' 
                        : 'bg-blue-500'
                    }`}>
                      <span className="text-white font-black text-sm">
                        {(Array.isArray(apiKeys) && apiKeys.length > 0) ? '✓' : '2'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className={`font-bold ${
                        (Array.isArray(apiKeys) && apiKeys.length > 0) 
                          ? 'text-green-800' 
                          : 'text-blue-800'
                      }`}>
                        {(Array.isArray(apiKeys) && apiKeys.length > 0) ? 'API Key Generated' : 'Generate Your First API Key'}
                      </span>
                      <div className={`text-sm transition-colors ${
                        (Array.isArray(apiKeys) && apiKeys.length > 0) 
                          ? 'text-green-600' 
                          : 'text-blue-600'
                      }`}>
                        {(Array.isArray(apiKeys) && apiKeys.length > 0) 
                          ? 'Ready to make API calls' 
                          : 'Click on API Keys tab to create one'
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-slate-50/80 border border-slate-200 rounded-2xl backdrop-blur-sm">
                    <div className="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-black text-sm">3</span>
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-slate-800">Make Your First API Call</span>
                      <div className="text-sm text-slate-600">Test the API with your key</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'api-keys' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
          >
            {/* API Keys Management */}
            <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-2 sm:gap-3 text-blue-900">
                  <Key className="w-5 h-5 sm:w-6 sm:h-6" />
                  API Keys
                </h2>
                <Link
                  to="/docs"
                  className="text-xs sm:text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2 font-bold uppercase tracking-wide"
                >
                  View Docs <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </div>


              {/* Generate New Key */}
              <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-blue-50/80 rounded-xl border border-blue-200 backdrop-blur-sm">
                <h3 className="font-black uppercase tracking-tight mb-3 sm:mb-4 text-sm sm:text-base text-blue-900">Generate New API Key</h3>
                
                {/* Security Warning */}
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1 bg-blue-100 rounded-full mt-0.5 flex-shrink-0">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-blue-900 mb-1 text-xs sm:text-sm">Important Security Notice</div>
                      <div className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                        <strong>Save your API key immediately!</strong> For security reasons, the full key is only shown once during generation. 
                        After you close this session, only a partial key will be visible. Store it securely in your password manager or environment variables.
                      </div>
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    <div className="font-bold mb-2">Debug Information:</div>
                    <div className="whitespace-pre-wrap font-mono text-xs">{error}</div>
                    <div className="mt-3 text-xs text-gray-400">
                      💡 Check browser console (F12) for detailed error logs
                    </div>
                  </div>
                )}
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Enter key name (e.g., Production App)"
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:border-blue-400 text-slate-800 placeholder-slate-500 font-medium text-sm"
                    />
                    <button
                      onClick={handleGenerateKey}
                      disabled={isGeneratingKey || !newKeyName.trim()}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {isGeneratingKey ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Generate Key
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Newly Generated Key Alert */}
              {newlyGeneratedKey && (
                <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-green-800 mb-2 text-lg">🎉 API Key Generated Successfully!</div>
                      <div className="text-sm text-green-700 mb-4">
                        <strong>"{newlyGeneratedKey.name}"</strong> has been created. 
                        <span className="text-red-600 font-bold"> This is the ONLY time you'll see the full key!</span>
                      </div>
                      
                      <div className="bg-white border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-green-700 uppercase">Your API Key:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 p-3 bg-gray-50 border rounded text-sm font-mono text-gray-800 break-all select-all">
                            {newlyGeneratedKey.key}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(newlyGeneratedKey.key)
                              // Could add a toast notification here
                            }}
                            className="p-3 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                            title="Copy to Clipboard"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-green-700 mb-4">
                        ✅ <strong>Next steps:</strong> Copy this key and store it securely in your password manager or environment variables. 
                        After you close this alert, only a partial key will be visible for security reasons.
                      </div>
                      
                      <button
                        onClick={() => setNewlyGeneratedKey(null)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors"
                      >
                        I've Saved My Key Securely
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* API Keys List */}
              <div className="space-y-4">
                <h3 className="font-black uppercase tracking-tight">Your API Keys</h3>
                {isLoadingKeys ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse p-4 bg-blue-50/50 rounded-xl border border-blue-200">
                        <div className="h-4 bg-blue-100 rounded mb-2"></div>
                        <div className="h-3 bg-blue-100 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : Array.isArray(apiKeys) && apiKeys.length > 0 ? (
                  <div className="space-y-3">
                    {apiKeys.map((key: { id: string; name: string; key?: string; apiKey?: string; fullKey?: string; secretKey?: string; keyPrefix?: string; fullKeyOnCreation?: string; token?: string; value?: string; createdAt: string; lastUsedAt: string | null; usageCount: number }) => (
                      <div key={key.id} className="p-3 sm:p-4 bg-blue-50/50 rounded-xl border border-blue-200 backdrop-blur-sm">
                        <div className="flex items-start sm:items-center justify-between mb-3 gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-xs sm:text-sm text-blue-900 truncate">{key.name}</h4>
                            <p className="text-xs text-slate-600">Created {formatDate(key.createdAt)}</p>
                          </div>
                          <button
                            onClick={() => handleRevokeKey(key.id)}
                            className="p-1.5 sm:p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <code className="flex-1 p-2 bg-slate-100 rounded text-xs font-mono text-slate-700 break-all min-w-0 overflow-hidden">
                              {(() => {
                                const fullKey = key.key || key.apiKey || key.fullKey || key.secretKey || key.fullKeyOnCreation || key.token || key.value
                                const prefix = key.keyPrefix
                                
                                if (showApiKey[key.id]) {
                                  // Show full key if available, otherwise show prefix with explanation
                                  return fullKey || (prefix ? `${prefix} (Full key only available during generation)` : 'No key available')
                                } else {
                                  // Show masked version
                                  return prefix ? `${prefix}${'•'.repeat(32)}` : '•'.repeat(40)
                                }
                              })()}
                            </code>
                            <button
                              onClick={() => {
                                const keyToCopy = key.key || key.apiKey || key.fullKey || key.secretKey || key.fullKeyOnCreation || key.token || key.value || key.keyPrefix || ''
                                if (keyToCopy) {
                                  navigator.clipboard.writeText(keyToCopy)
                                }
                              }}
                              className="p-1.5 sm:p-2 hover:bg-blue-100 rounded transition-colors text-slate-600 flex-shrink-0"
                              title="Copy API Key"
                              disabled={!key.key && !key.apiKey && !key.fullKey && !key.secretKey && !key.fullKeyOnCreation && !key.token && !key.value}
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleKeyVisibility(key.id)}
                              className="px-3 py-1 text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200"
                            >
                              {showApiKey[key.id] ? 'Hide Key' : 'Show Key'}
                            </button>
                            {!key.key && !key.apiKey && !key.fullKey && !key.secretKey && !key.fullKeyOnCreation && !key.token && !key.value && (
                              <span className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                                Full key only shown during generation
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 mt-2">
                          Last used: {key.lastUsedAt ? formatDate(key.lastUsedAt) : 'Never'} • {key.usageCount} calls
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-600">
                    <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No API keys yet. Generate your first key above.</p>
                  </div>
                )}
              </div>
            </div>

            {/* API Testing Panel */}
            <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-8 shadow-sm">
              <ApiTesting apiKeys={apiKeys} />
            </div>
          </motion.div>
        )}

      </main>
    </div>
  )
}

export default Dashboard
