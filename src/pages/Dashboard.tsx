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
  CreditCard
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
  const [apiStats, setApiStats] = useState(null)
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

      const apiUrl = import.meta.env.DEV ? '/api/v1/api-keys' : 'https://staging.futeur.app/api/v1/api-keys'
      console.log('Making API request to:', apiUrl, 'for all user keys')
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('API Response status:', response.status)
      
      if (response.ok) {
        const keys = await response.json()
        setApiKeys(keys)
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

  // Fetch API statistics from backend
  const fetchApiStats = async () => {
    try {
      const token = await getToken()
      
      if (!token) {
        console.log('No token available for stats')
        return
      }

      const baseUrl = import.meta.env.DEV ? '/api/v1/api-keys' : 'https://staging.futeur.app/api/v1/api-keys'
      const statsUrl = `${baseUrl}/stats`
      console.log('Fetching API statistics from:', statsUrl)
      
      const response = await fetch(statsUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const stats = await response.json()
        console.log('API Statistics Response:', stats)
        setApiStats(stats)
      } else {
        console.log('Failed to fetch API stats:', response.status)
      }
    } catch (error) {
      console.error('Error fetching API stats:', error)
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

      const baseUrl = import.meta.env.DEV ? '/api/v1/api-keys' : 'https://staging.futeur.app/api/v1/api-keys'
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
      
      const baseUrl = import.meta.env.DEV ? '/api/v1/api-keys' : 'https://staging.futeur.app/api/v1/api-keys'
      console.log('Generating API key with token preview:', token.substring(0, 20) + '...')
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newKeyName.trim(),
          scopes: keyConfig.scopes,
          expiresInDays: keyConfig.expiresInDays,
          ipWhitelist: keyConfig.ipWhitelist,
          geoRestrictions: keyConfig.geoRestrictions
        }),
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
            key: apiKeyData.key || apiKeyData.apiKey || 'key-not-provided',
            keyPrefix: apiKeyData.keyPrefix || null, // Include key prefix if available
            createdAt: apiKeyData.createdAt || apiKeyData.created_at || new Date().toISOString(),
            lastUsed: apiKeyData.lastUsed || apiKeyData.last_used || null,
            callsUsed: apiKeyData.callsUsed || apiKeyData.calls_used || 0,
            isActive: apiKeyData.isActive !== undefined ? apiKeyData.isActive : true,
            environment: apiKeyData.environment || 'development',
            // Include any additional fields from backend response
            ...apiKeyData,
            // Also include the success message if available
            message: newKey.message || null
          }
          
          console.log('Validated API Key:', validatedKey)
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
          setError(errorData.message || 'Failed to generate API key')
        } catch (parseError) {
          setError(`Failed to generate API key: ${response.status} ${response.statusText}`)
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
      const baseUrl = import.meta.env.DEV ? '/api/v1/api-keys' : 'https://staging.futeur.app/api/v1/api-keys'
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
    setShowApiKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
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

  const fetchCurrentToken = async () => {
    try {
      const token = await getToken()
      setCurrentToken(token || '')
      return token
    } catch (error) {
      console.error('Error fetching token:', error)
      setCurrentToken('')
      return null
    }
  }

  const debugClerkToken = async () => {
    try {
      const defaultToken = await fetchCurrentToken()
      
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
        const apiUrl = import.meta.env.DEV ? '/api/v1/api-keys' : 'https://staging.futeur.app/api/v1/api-keys'
        
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
- API URL: ${import.meta.env.DEV ? '/api/v1/api-keys' : 'https://staging.futeur.app/api/v1/api-keys'}
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

  // Mock usage data - in real app this would come from your backend
  const mockUsage = { used: 1250, limit: 10000 }
  const usagePercentage = (mockUsage.used / mockUsage.limit) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                FUTEURCREDX
              </Link>
              <div className="hidden sm:block text-sm text-gray-400 font-medium">
                Dashboard
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:block text-sm text-gray-400 truncate max-w-48">
                Welcome, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}
              </div>
              <SignOutButton>
                <button className="px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="sticky top-16 z-40 border-b border-white/10 bg-black/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'api-keys', label: 'API Keys', icon: Key },
              { id: 'api-testing', label: 'API Testing', icon: Code }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
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
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.1 }}
className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
>
<div className="flex items-center gap-4 mb-4">
<div className="p-3 bg-blue-500/20 rounded-xl">
<Activity className="w-8 h-8 text-blue-400" />
</div>
<div>
<h3 className="font-black uppercase tracking-tight">API Calls</h3>
<p className="text-sm text-gray-400 font-medium">This month</p>
</div>
</div>
<div className="space-y-3">
{isLoadingStats ? (
<div className="animate-pulse">
<div className="h-6 bg-white/10 rounded mb-2"></div>
<div className="h-4 bg-white/10 rounded mb-2"></div>
<div className="h-3 bg-white/10 rounded"></div>
</div>
) : apiStats ? (
<>
<div className="text-lg font-black">{apiStats.plan || 'Free'}</div>
<div>{(apiStats.totalCalls || 0).toLocaleString()}</div>
<div className="text-sm text-gray-400 font-medium">API Calls Used</div>
<div className="text-xs text-gray-500">
of {(apiStats.monthlyLimit || 10000).toLocaleString()} this month
</div>
<div className="w-full bg-white/10 rounded-full h-3">
<div 
className="bg-blue-400 h-3 rounded-full transition-all duration-500"
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
<div className="w-full bg-white/10 rounded-full h-3">
<div className="bg-blue-400 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }} />
</div>
</>
)}
</div>
</motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-tight">API Calls</h3>
                <p className="text-sm text-gray-400 font-medium">This month</p>
              </div>
            </div>
            <div className="space-y-3">
              {isLoadingStats ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded"></div>
                </div>
              ) : apiStats ? (
                <>
                  <div className="text-lg font-black">{apiStats.plan || 'Free'}</div>
                  <div>{(apiStats.totalCalls || 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-400 font-medium">API Calls Used</div>
                  <div className="text-xs text-gray-500">
                    of {(apiStats.monthlyLimit || 10000).toLocaleString()} this month
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="bg-blue-400 h-3 rounded-full transition-all duration-500"
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
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div className="bg-blue-400 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }} />
                  </div>
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Key className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-tight">API Keys</h3>
                <p className="text-sm text-gray-400 font-medium">Active keys</p>
              </div>
            </div>
            <div className="text-3xl font-black">{Array.isArray(apiKeys) ? apiKeys.filter(key => key.isActive).length : 0}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-tight">Plan</h3>
                <p className="text-sm text-gray-400 font-medium">Current tier</p>
              </div>
            </div>
            <div className="text-3xl font-black capitalize">{"Pro"}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Calendar className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-tight">Member Since</h3>
                <p className="text-sm text-gray-400 font-medium">Account created</p>
              </div>
            </div>
            <div className="text-lg font-bold">{user ? formatDate(user.createdAt) : ''}</div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-12">
          <div className="flex items-center gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
                activeTab === 'overview' 
                  ? 'bg-white text-black' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('api-keys')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
                activeTab === 'api-keys' 
                  ? 'bg-white text-black' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Key className="w-4 h-4" />
              API Keys
            </button>
            <button
              onClick={() => setActiveTab('api-testing')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
                activeTab === 'api-testing' 
                  ? 'bg-white text-black' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Code className="w-4 h-4" />
              API Testing
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions & Billing */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-8"
            >
              {/* Quick Actions */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Quick Actions</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => setActiveTab('api-testing')}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
                  >
                    <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                      <Code className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-black uppercase tracking-tight">API Testing</div>
                      <div className="text-sm text-gray-400 font-medium">Test APIs with your generated tokens</div>
                    </div>
                  </button>
                  
                  <Link
                    to="/docs"
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
                  >
                    <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                      <FileText className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-black uppercase tracking-tight">API Documentation</div>
                      <div className="text-sm text-gray-400 font-medium">View examples and guides</div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </Link>
                  
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                      <BarChart3 className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-black uppercase tracking-tight">Usage Analytics</div>
                      <div className="text-sm text-gray-400 font-medium">Detailed usage insights</div>
                    </div>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-bold uppercase tracking-wide">Coming Soon</span>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="p-3 bg-orange-500/20 rounded-xl group-hover:bg-orange-500/30 transition-colors">
                      <CreditCard className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-black uppercase tracking-tight">Billing & Subscriptions</div>
                      <div className="text-sm text-gray-400 font-medium">Manage your billing settings</div>
                    </div>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-bold uppercase tracking-wide">Coming Soon</span>
                  </div>
                </div>
              </div>

              {/* Getting Started */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Getting Started</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-black text-sm">
                      ✓
                    </div>
                    <span className="font-medium">Account created</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-black font-black text-sm ${
                      (Array.isArray(apiKeys) && apiKeys.length > 0) ? 'bg-green-500' : 'bg-gray-500'
                    }`}>
                      {(Array.isArray(apiKeys) && apiKeys.length > 0) ? '✓' : '2'}
                    </div>
                    <span className="font-medium">
                      {(Array.isArray(apiKeys) && apiKeys.length > 0) ? 'API key generated' : 'Generate your first API key'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-black font-black text-sm">
                      3
                    </div>
                    <span className="font-medium">Make your first API call</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'api-keys' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* API Keys Management */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                  <Key className="w-6 h-6" />
                  API Keys
                </h2>
                <Link
                  to="/docs"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-bold uppercase tracking-wide"
                >
                  View Docs <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Generate New Key */}
              <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
                <h3 className="font-black uppercase tracking-tight mb-4">Generate New API Key</h3>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Enter key name (e.g., Production App)"
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-gray-400 font-medium"
                    />
                    <button
                      onClick={handleGenerateKey}
                      disabled={isGeneratingKey || !newKeyName.trim()}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm uppercase tracking-wide transition-colors flex items-center gap-2"
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

              {/* API Keys List */}
              <div className="space-y-4">
                <h3 className="font-black uppercase tracking-tight">Your API Keys</h3>
                {isLoadingKeys ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse p-4 bg-white/5 rounded-xl">
                        <div className="h-4 bg-white/10 rounded mb-2"></div>
                        <div className="h-3 bg-white/10 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : Array.isArray(apiKeys) && apiKeys.length > 0 ? (
                  <div className="space-y-3">
                    {apiKeys.map((key: { id: string; name: string; key: string; created: string; lastUsed: string; requests: number }) => (
                      <div key={key.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-sm">{key.name}</h4>
                            <p className="text-xs text-gray-400">Created {formatDate(key.created)}</p>
                          </div>
                          <button
                            onClick={() => handleRevokeKey(key.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 p-2 bg-black/30 rounded text-xs font-mono text-gray-300">
                            {showApiKey[key.id] ? key.key : '•'.repeat(40)}
                          </code>
                          <button
                            onClick={() => toggleKeyVisibility(key.id)}
                            className="p-2 hover:bg-white/10 rounded transition-colors"
                          >
                            {showApiKey[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleCopyKey(key.key)}
                            className="p-2 hover:bg-white/10 rounded transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No API keys found. Generate your first API key to get started.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Usage Statistics</h2>
              
              {isLoadingStats ? (
                <div className="space-y-4">
                  <div className="animate-pulse">
                    <div className="h-6 bg-white/10 rounded mb-2"></div>
                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/10 rounded"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-400">API Calls This Month</span>
                      <span className="text-lg font-black">{apiStats?.totalCalls || 0}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className="bg-blue-400 h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(((apiStats?.totalCalls || 0) / (apiStats?.monthlyLimit || 10000)) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      of {(apiStats?.monthlyLimit || 10000).toLocaleString()} monthly limit
                    </div>
                  </div>
                  
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm">More detailed analytics coming soon!</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'api-testing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ApiTesting apiKeys={apiKeys} />
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
