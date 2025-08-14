import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  DollarSign,
  Shield,
  Users,
  Settings,
  FileText,
  ExternalLink,
  TrendingUp,
  Calendar,
  CreditCard
} from 'lucide-react'
import { useUser, SignOutButton, useAuth } from '@clerk/clerk-react'

const Dashboard: React.FC = () => {
  const { user } = useUser()
  const { getToken } = useAuth()
  const navigate = useNavigate()
  // Real API keys data from backend
  const [apiKeys, setApiKeys] = useState([])
  const [isLoadingKeys, setIsLoadingKeys] = useState(true)
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})
  const [newKeyName, setNewKeyName] = useState('')
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)
  const [error, setError] = useState('')
  
  // API Statistics
  const [apiStats, setApiStats] = useState(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  
  // Show all keys for authenticated user (keys expire after 30 days)
  // Removed environment filtering since keys are user-specific
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')
  const [currentToken, setCurrentToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [keyConfig, setKeyConfig] = useState({
    scopes: [] as string[],
    expiresInDays: 30,
    ipWhitelist: [] as string[],
    geoRestrictions: [] as string[]
  })

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
    <div className="min-h-screen bg-[#0E0E10] text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url(/grid.png)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5"></div>
      
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0E0E10]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-black uppercase tracking-tight">
                FUTEURCREDX
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                <Link to="/dashboard" className="text-white font-bold uppercase tracking-wide text-sm">Dashboard</Link>
                <Link to="/docs" className="text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-wide text-sm">API Docs</Link>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-400 font-medium">Welcome, <span className="text-white font-bold">{user?.firstName || user?.emailAddresses[0]?.emailAddress}</span></span>
              <SignOutButton>
                <button className="text-sm text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-wide">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">API Dashboard</h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Monitor your API usage, manage keys, and track your business credit integration performance.
          </p>
        </div>



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
            <div className="text-3xl font-black capitalize">{user?.plan}</div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Keys Management */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
          >
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

            {/* Debug Panel */}
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-yellow-400">🔧 Authentication Debug</h4>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      await fetchCurrentToken()
                      setShowToken(true)
                    }}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium"
                  >
                    Show Token
                  </button>
                  <button
                    onClick={debugClerkToken}
                    className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm font-medium"
                  >
                    Debug Token
                  </button>
                </div>
              </div>
              
              {/* Token Display Section */}
              {showToken && currentToken && (
                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-blue-400 text-sm">🎫 Current Clerk JWT Token</h5>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(currentToken)
                          // Could add toast notification here
                        }}
                        className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                      <button
                        onClick={() => setShowToken(false)}
                        className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs hover:bg-gray-500/30 transition-colors"
                      >
                        Hide
                      </button>
                    </div>
                  </div>
                  <div className="bg-black/30 p-3 rounded border border-blue-500/20">
                    <code className="text-xs text-blue-200 break-all font-mono leading-relaxed">
                      {currentToken}
                    </code>
                  </div>
                  <p className="text-xs text-blue-300 mt-2">
                    💡 Use this token to test your backend API directly with tools like Postman or curl:
                    <br />
                    <code className="text-blue-200">curl -H "Authorization: Bearer [token]" https://staging.futeur.app/api/v1/api-keys</code>
                  </p>
                </div>
              )}
              
              {showToken && !currentToken && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">❌ No token available. Please ensure you're signed in.</p>
                </div>
              )}
              {showDebugInfo && (
                <pre className="text-xs text-yellow-200 bg-black/30 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                  {debugInfo}
                </pre>
              )}
              <p className="text-xs text-yellow-300 mt-2">
                Getting 401 "User not authenticated" errors? This means your backend doesn't recognize the Clerk JWT. Click "Debug Token" to see what's being sent.
              </p>
              
              {error.includes('User not authenticated') && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <h5 className="font-bold text-red-400 text-sm mb-2">🚨 Backend Authentication Issue</h5>
                  <p className="text-xs text-red-300 mb-2">
                    Your backend API doesn't recognize the Clerk JWT token. Common fixes:
                  </p>
                  <ul className="text-xs text-red-300 space-y-1 ml-4">
                    <li>• Backend needs Clerk JWT verification setup</li>
                    <li>• Wrong JWT audience/issuer configuration</li>
                    <li>• Backend expects different auth header format</li>
                    <li>• Clerk webhook/integration not configured</li>
                  </ul>
                </div>
              )}

              {error.includes('Authentication Success') && error.includes('User not found') && (
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h5 className="font-bold text-blue-400 text-sm mb-2">🚀 Redirecting to Complete Setup!</h5>
                  <p className="text-xs text-blue-300 mb-2">
                    Authentication successful! You need to complete your business profile to access the dashboard.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-blue-300">
                    <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                    Redirecting to business signup form in 2 seconds...
                  </div>
                  <button
                    onClick={() => navigate('/business-signup')}
                    className="mt-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-xs font-medium"
                  >
                    Go Now →
                  </button>
                </div>
              )}
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
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    Advanced
                  </button>
                </div>

                {showAdvancedOptions && (
                  <div className="space-y-6 p-4 bg-white/5 rounded-xl border border-white/10">
                    {/* Scopes */}
                    <div>
                      <label className="block text-sm font-bold text-white mb-3">API Scopes</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {availableScopes.map(scope => (
                          <button
                            key={scope}
                            onClick={() => handleScopeToggle(scope)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              keyConfig.scopes.includes(scope)
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {scope}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Expiration */}
                    <div>
                      <label className="block text-sm font-bold text-white mb-3">Expires In (Days)</label>
                      <input
                        type="number"
                        value={keyConfig.expiresInDays}
                        onChange={(e) => setKeyConfig(prev => ({ ...prev, expiresInDays: parseInt(e.target.value) || 30 }))}
                        min="1"
                        max="365"
                        className="w-32 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-white font-medium"
                      />
                    </div>

                    {/* IP Whitelist */}
                    <div>
                      <label className="block text-sm font-bold text-white mb-3">IP Whitelist</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="192.168.1.100"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddIP(e.currentTarget.value)
                              e.currentTarget.value = ''
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-white placeholder-gray-400 font-medium"
                        />
                        <button
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement
                            handleAddIP(input.value)
                            input.value = ''
                          }}
                          className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {keyConfig.ipWhitelist.map(ip => (
                          <span
                            key={ip}
                            className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium flex items-center gap-1"
                          >
                            {ip}
                            <button
                              onClick={() => handleRemoveIP(ip)}
                              className="text-green-400 hover:text-green-300"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Geo Restrictions */}
                    <div>
                      <label className="block text-sm font-bold text-white mb-3">Geo Restrictions</label>
                      <div className="flex flex-wrap gap-2">
                        {availableCountries.map(country => (
                          <button
                            key={country}
                            onClick={() => handleCountryToggle(country)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              keyConfig.geoRestrictions.includes(country)
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {country}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleGenerateKey}
                  disabled={!newKeyName.trim() || isGeneratingKey}
                  className="w-full px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-black uppercase tracking-wide"
                >
                  {isGeneratingKey ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Generate API Key
                </button>
              </div>
            </div>

            {/* API Keys List */}
            <div className="space-y-4">
              {isLoadingKeys ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                  <p className="font-bold text-lg mb-2">Loading API keys...</p>
                </div>
              ) : (!Array.isArray(apiKeys) || apiKeys.length === 0) ? (
                <div className="text-center py-12 text-gray-400">
                  <Key className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="font-bold text-lg mb-2">No API keys yet</p>
                  <p className="text-sm">Generate your first key to get started</p>
                </div>
              ) : (
                Array.isArray(apiKeys) ? apiKeys.map((apiKey: {
                  id: string;
                  name: string;
                  key: string;
                  createdAt: string;
                  lastUsed?: string;
                  callsUsed?: number;
                }) => (
                  <div key={apiKey.id} className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-black text-lg">{apiKey.name}</h4>
                        <p className="text-sm text-gray-400 font-medium">
                          Created {formatDate(apiKey.createdAt)}
                          {apiKey.lastUsed && ` • Last used ${formatDate(apiKey.lastUsed)}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide bg-green-500/20 text-green-400">
                          Active
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-3">
                      <div className="flex items-center gap-3">
                        <code className="flex-1 px-4 py-3 bg-black/50 rounded-xl border border-white/10 text-sm font-mono break-all overflow-hidden">
                          {showApiKey[apiKey.id] ? apiKey.key : '••••••••••••••••••••••••••••••••'}
                        </code>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="p-3 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/10"
                            title={showApiKey[apiKey.id] ? "Hide API Key" : "Show API Key"}
                          >
                            {showApiKey[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleCopyKey(apiKey.key)}
                            className="p-3 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/10"
                            title="Copy API Key"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRevokeKey(apiKey.id)}
                            className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                            title="Revoke API Key"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      Calls: {apiKey.callsUsed || 0}
                    </div>
                  </div>
                )) : null
              )}
            </div>
          </motion.div>

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
                <Link
                  to="/docs"
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
                >
                  <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black uppercase tracking-tight">API Documentation</div>
                    <div className="text-sm text-gray-400 font-medium">Test APIs and view examples</div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </Link>
                
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                    <BarChart3 className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black uppercase tracking-tight">Usage Analytics</div>
                    <div className="text-sm text-gray-400 font-medium">Member since {formatDate(user?.createdAt?.toISOString() || new Date().toISOString())}</div>
                  </div>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-bold uppercase tracking-wide">Coming Soon</span>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                    <CreditCard className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black uppercase tracking-tight">Billing & Subscriptions</div>
                    <div className="text-sm text-gray-400 font-medium">Manage your billing settings</div>
                  </div>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-bold uppercase tracking-wide">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Usage Warning */}
            {usagePercentage > 80 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <DollarSign className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="font-black uppercase tracking-tight text-yellow-400 text-xl">Usage Alert</h3>
                </div>
                <p className="text-sm text-yellow-200 mb-6 font-medium leading-relaxed">
                  You've used {usagePercentage.toFixed(1)}% of your monthly API limit. 
                  Consider upgrading your plan to avoid service interruption.
                </p>
                <button className="px-6 py-3 bg-yellow-400 text-black rounded-xl font-black text-sm hover:bg-yellow-300 transition-colors uppercase tracking-wide">
                  Upgrade Plan
                </button>
              </div>
            )}

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
      </main>
    </div>
  )
}

export default Dashboard
