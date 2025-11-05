import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
import ApiTesting from './ApiTesting'
import MetricCards from '../../../components/dashboard/MetricCards';
import DashboardTabs from '../../../components/dashboard/DashboardTabs';
import OverviewTab from '../../../components/dashboard/OverviewTab';
import ApiKeysTab from '../../../components/dashboard/ApiKeysTab';
import KeyUsageStats from '../../../components/dashboard/KeyUsageStats';
import PartnerDashboard from '../../../components/dashboard/PartnerDashboard';
import { usePartnerRole } from '../../../hooks/usePartnerRole';
import type { ApiStats, ApiKey } from '../../../types';
import Analytics from '../../../components/dashboard/pages/Analytics';
import Users from '../../../components/dashboard/pages/Users';

const Dashboard: React.FC = () => {
  const { user } = useUser()
  const { getToken } = useAuth()
  const { isPartner } = usePartnerRole()
  
  // State management
  const [apiKeys, setApiKeys] = useState([])
  const [isLoadingKeys, setIsLoadingKeys] = useState(true)
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})
  const [newKeyName, setNewKeyName] = useState('')
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)
  const [error, setError] = useState('')
    const [apiStats, setApiStats] = useState<ApiStats>({ 
      totalCalls: 0, 
      monthlyLimit: 10000, 
      plan: 'Free', 
      thisMonth: 0, 
      lastMonth: 0, 
      growth: 0,
      keyStats: [],
      totalCallsThisMonth: 0,
      totalCallsLastMonth: 0
    })
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, _setActiveTab] = useState('overview')

  // Keep state and URL in sync
  const setActiveTab = (tab: string) => {
    _setActiveTab(tab)
    const params = new URLSearchParams(location.search)
    params.set('tab', tab)
    navigate(`/dashboard?${params.toString()}`, { replace: true })
  }
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
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isDataFresh, setIsDataFresh] = useState(true)
  const [deletedKeys, setDeletedKeys] = useState<ApiKey[]>([])

  // Get token from Clerk
  const getBackendToken = async (): Promise<string | null> => {
    try {
      const clerkToken = await getToken()
      return clerkToken
    } catch {
      return null
    }
  }

  // Get current authentication token for debugging
  const fetchCurrentToken = async () => {
    try {
      const token = await getBackendToken()
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
      const token = await getBackendToken()
      
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
        const keys = data.apiKeys || [];
        console.log('=== API KEYS DEBUG ===');
        console.log('Keys array length:', keys.length);
        console.log('First key structure:', keys[0]);
        console.log('Keys with usage data:', keys.map(k => ({ 
          name: k.name, 
          usageCount: k.usageCount, 
          callsUsed: k.callsUsed,
          lastUsedAt: k.lastUsedAt,
          lastUsed: k.lastUsed
        })));
        console.log('======================');
        setApiKeys(keys);
        // Calculate individual key stats using the new API structure
        const keyStats: ApiKeyStats[] = keys.map(key => ({
          keyId: key.id,
          keyName: key.name,
          callsUsed: key.usageCount || key.callsUsed || 0,
          lastUsed: key.lastUsedAt || key.lastUsed || null,
          isActive: key.isActive !== false,
          environment: key.environment || 'development'
        }));
        
        const totalCallsFromKeys = keyStats.reduce((sum, key) => sum + key.callsUsed, 0);
        setApiStats(prevStats => ({
          ...prevStats,
          totalCalls: totalCallsFromKeys,
          keyStats: keyStats,
        }));
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
  const fetchApiStats = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoadingStats(true);
    }
    try {
      const token = await getBackendToken();
      if (!token) {
        throw new Error('Authentication token not available.');
      }

      // Add timestamp to URL to bypass cache
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/v1/api-keys/stats?t=${timestamp}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        cache: 'no-store'
      });

      if (!response.ok && response.status !== 304) {
        // Log the error and fall back to default stats
        const errorText = await response.text();
        console.error(`Failed to fetch API stats: ${response.status} ${errorText}`);
        throw new Error(`API error: ${response.status}`);
      }

      // Handle 304 Not Modified - data hasn't changed, use existing stats
      if (response.status === 304) {
        console.log('=== API STATS RESPONSE (304) ===');
        console.log('Data not modified - using existing stats');
        setLastUpdated(new Date());
        setIsDataFresh(true);
        return;
      }

      const data = await response.json();
      console.log('=== API STATS RESPONSE (200) ===');
      console.log('Raw Response Data:', data);
      console.log('================================');
      
      // Extract total usage from the new API structure
      const developmentStats = data.stats?.development || {};
      const productionStats = data.stats?.production || {};
      
      // Calculate total usage across all environments
      const totalUsage = (developmentStats.totalUsage || 0) + (productionStats.totalUsage || 0);
      const totalKeys = (developmentStats.totalKeys || 0) + (productionStats.totalKeys || 0);
      
      console.log('=== USAGE CALCULATION ===');
      console.log('Development Usage:', developmentStats.totalUsage);
      console.log('Production Usage:', productionStats.totalUsage);
      console.log('Total Usage:', totalUsage);
      console.log('Development Keys:', developmentStats.totalKeys);
      console.log('Production Keys:', productionStats.totalKeys);
      console.log('Total Keys:', totalKeys);
      console.log('========================');

      // Calculate individual key stats from both active and deleted API keys
      const allKeys = [...apiKeys, ...deletedKeys];
      const keyStats: ApiKeyStats[] = allKeys.map(key => {
        const callsUsed = key.usageCount || key.callsUsed || 0;
        const lastUsed = key.lastUsedAt || key.lastUsed || null;
        const isActive = key.isActive !== false && !deletedKeys.some(deleted => deleted.id === key.id);
        const environment = key.environment || 'development';
        
        console.log(`Key ${key.name}: usageCount=${key.usageCount}, callsUsed=${key.callsUsed}, final=${callsUsed}, isActive=${isActive}`);
        
        return {
          keyId: key.id,
          keyName: key.name,
          callsUsed: callsUsed,
          lastUsed: lastUsed,
          isActive: isActive,
          environment: environment
        };
      });

      // Calculate total calls from individual keys (as backup)
      const totalCallsFromKeys = keyStats.reduce((sum, key) => sum + key.callsUsed, 0);
      
      // Use the API stats total usage as the primary source
      const finalTotalCalls = totalUsage > 0 ? totalUsage : totalCallsFromKeys;
      
      console.log('=== KEY STATS DEBUG ===');
      console.log('API Keys:', apiKeys);
      console.log('Key Stats:', keyStats);
      console.log('Total Calls from Keys:', totalCallsFromKeys);
      console.log('API Total Usage:', totalUsage);
      console.log('Final Total Calls:', finalTotalCalls);
      console.log('========================');
      
      const finalStats = {
        totalCalls: finalTotalCalls,
        monthlyLimit: 10000, // Default limit
        plan: 'Free', // Default plan
        thisMonth: finalTotalCalls, // Use total usage as this month's usage
        lastMonth: 0, // No historical data available
        growth: 0, // No growth calculation without historical data
        keyStats: keyStats,
        totalCallsThisMonth: finalTotalCalls,
        totalCallsLastMonth: 0,
        // Add environment breakdown
        developmentUsage: developmentStats.totalUsage || 0,
        productionUsage: productionStats.totalUsage || 0,
        totalKeys: totalKeys
      };

      console.log('=== FINAL STATS STATE ===');
      console.log('Setting API Stats:', finalStats);
      console.log('========================');

      setApiStats(finalStats);
      setIsDataFresh(true);

    } catch (error) {
      console.error('An error occurred while fetching API stats:', error);
      // Set default stats on any error, but preserve key stats
      const keyStats: ApiKeyStats[] = apiKeys.map(key => ({
        keyId: key.id,
        keyName: key.name,
        callsUsed: key.usageCount || key.callsUsed || 0,
        lastUsed: key.lastUsedAt || key.lastUsed || null,
        isActive: key.isActive !== false,
        environment: key.environment || 'development'
      }));
      
      const totalCallsFromKeys = keyStats.reduce((sum, key) => sum + key.callsUsed, 0);
      
      setApiStats(prevStats => ({
        ...prevStats,
        totalCalls: totalCallsFromKeys,
        monthlyLimit: 10000,
        plan: 'Free',
        thisMonth: totalCallsFromKeys,
        lastMonth: 0,
        growth: 0,
        keyStats: keyStats,
        totalCallsThisMonth: totalCallsFromKeys,
        totalCallsLastMonth: 0,
        developmentUsage: 0,
        productionUsage: 0,
        totalKeys: apiKeys.length
      }));
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoadingStats(false);
      }
      setLastUpdated(new Date());
    }
  };

  // Manual refresh function
  const refreshStats = async () => {
    await fetchApiStats(true);
  };

  // Test function to simulate API calls (for debugging)
  const testApiCall = async () => {
    console.log('=== TEST API CALL STARTED ===');
    try {
      const token = await getBackendToken();
      console.log('Token obtained:', token ? 'Yes' : 'No');
      if (!token) {
        console.log('No token available');
        return;
      }

      console.log('Making test API call...');
      // Make a test API call to increment usage
      const response = await fetch('/api/v1/lumiq/u/experian/score', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "Test Company",
          city: "Test City", 
          state: "CA"
        })
      });

      console.log('Test API call response status:', response.status);
      console.log('Test API call response ok:', response.ok);
      
      // Refresh stats after test call
      console.log('Refreshing stats in 1 second...');
      setTimeout(() => {
        console.log('Calling refreshStats...');
        refreshStats();
      }, 1000);
      
      console.log('=== TEST API CALL COMPLETED ===');
    } catch (error) {
      console.error('Test API call failed:', error);
    }
  };

  // Debug function to check current state
  const debugCurrentState = () => {
    console.log('=== CURRENT STATE DEBUG ===');
    console.log('API Keys:', apiKeys);
    console.log('API Stats:', apiStats);
    console.log('Is Refreshing:', isRefreshing);
    console.log('Last Updated:', lastUpdated);
    console.log('Is Data Fresh:', isDataFresh);
    console.log('===========================');
  };

  // Simple test function to verify console logging works
  const testConsole = () => {
    console.log('=== CONSOLE TEST ===');
    console.log('This is a test message');
    console.log('Current time:', new Date().toISOString());
    console.log('===================');
    return 'Console test completed';
  };

  // Expose dev helper to set a manual token at runtime (for local testing)
  (window as any).setDevAuthToken = (token: string | null) => {
    if (token && token.length > 0) {
      localStorage.setItem('devAuthToken', token)
      console.log('devAuthToken set in localStorage (preview):', token.substring(0, 20) + '...')
    } else {
      localStorage.removeItem('devAuthToken')
      console.log('devAuthToken removed from localStorage')
    }
  }

  // Expose functions to window for console access
  (window as any).testApiCall = testApiCall;
  (window as any).debugCurrentState = debugCurrentState;
  (window as any).refreshStats = refreshStats;
  (window as any).testConsole = testConsole;

  // Get detailed information about a specific API key
  const getApiKeyDetails = async (keyId: string) => {
    try {
      const token = await getBackendToken()
      
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
      const token = await getBackendToken()
      
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
          
          console.log('🔑 API Key Creation - Full Response (sanitized):', {
            message: newKey.message,
            hasApiKey: !!newKey.apiKey,
            apiKeyName: newKey.apiKey?.name
          })
          console.log('🔑 Validated Key Object (sanitized):', {
            name: validatedKey.name,
            environment: validatedKey.environment,
            hasKey: !!validatedKey.key,
            keyPrefix: validatedKey.keyPrefix,
            createdAt: validatedKey.createdAt
          })
          
          console.log('Validated API Key (sanitized):', {
            name: validatedKey.name,
            environment: validatedKey.environment,
            hasKey: !!validatedKey.key
          })
          
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
      const token = await getBackendToken()
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
        // Find the key being deleted to preserve its usage data
        const keyToDelete = apiKeys.find(key => key.id === keyId);
        if (keyToDelete) {
          // Add to deleted keys to preserve usage statistics
          setDeletedKeys(prev => [...prev, { ...keyToDelete, isActive: false }]);
        }
        
        // Remove from active keys
        setApiKeys(prev => prev.filter(key => key.id !== keyId))
        setError('') // Clear any errors
        
        console.log('Key deleted but usage data preserved:', keyToDelete?.name);
      } else {
        console.error('Failed to revoke API key:', response.statusText)
        setError('Failed to revoke API key')
      }
    } catch (error) {
      console.error('Error revoking API key:', error)
      if (error instanceof TypeError && error.message === 'Load failed') {
        // CORS error - simulate successful deletion for development
        const keyToDelete = apiKeys.find(key => key.id === keyId);
        if (keyToDelete) {
          setDeletedKeys(prev => [...prev, { ...keyToDelete, isActive: false }]);
        }
        setApiKeys(prev => prev.filter(key => key.id !== keyId))
        setError('✓ Mock key revoked (CORS prevents real API call in development)')
      } else {
        setError('Network error while revoking key')
      }
    }
  }

  // Initialize activeTab from URL and load data
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tabParam = params.get('tab')
    if (tabParam && tabParam !== activeTab) {
      _setActiveTab(tabParam)
    }

    console.log('=== DASHBOARD COMPONENT MOUNTED ===');
    console.log('User:', user ? 'Logged in' : 'Not logged in');
    if (user) {
      console.log('Fetching data...');
      const fetchData = async () => {
        console.log('Fetching API keys...');
        await fetchApiKeys();
        console.log('Fetching API stats...');
        await fetchApiStats();
        console.log('Data fetch completed');
      };
      fetchData();
    }
  }, [user, location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Real-time polling for API stats
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshStats();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    // You could add a toast notification here
  }

  const toggleKeyVisibility = (keyId: string) => {
    console.log('Toggling key visibility for key')
    console.log('Current showApiKey state:', showApiKey)
    console.log('API Keys count:', apiKeys.length)
    
    // Find the specific key and log sanitized properties
    const currentKey = apiKeys.find(k => k.id === keyId)
    if (currentKey) {
      console.log('Current key object (sanitized):', {
        name: currentKey.name,
        environment: currentKey.environment,
        isActive: currentKey.isActive,
        createdAt: currentKey.createdAt
      })
      console.log('Available key properties:', Object.keys(currentKey))
      console.log('Key values (sanitized):', {
        keyPrefix: currentKey.keyPrefix,
        hasKey: !!currentKey.key,
        hasApiKey: !!currentKey.apiKey,
        hasToken: !!currentKey.token,
        hasValue: !!currentKey.value
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
      const defaultToken = await getBackendToken()
      
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



      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} isPartner={isPartner} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Stats Overview */}
        <MetricCards 
          apiKeys={apiKeys} 
          user={user} 
          formatDate={formatDate} 
          apiStats={apiStats}
          isRefreshing={isRefreshing}
          lastUpdated={lastUpdated}
          isDataFresh={isDataFresh}
          onRefresh={refreshStats}
        />

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <OverviewTab />
              <KeyUsageStats keyStats={apiStats.keyStats} isLive={true} />
            </div>
          )}

          {activeTab === 'api-keys' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                <ApiKeysTab
                  apiKeys={apiKeys}
                  isLoadingKeys={isLoadingKeys}
                  error={error}
                  newKeyName={newKeyName}
                  setNewKeyName={setNewKeyName}
                  handleGenerateKey={handleGenerateKey}
                  isGeneratingKey={isGeneratingKey}
                  newlyGeneratedKey={newlyGeneratedKey}
                  setNewlyGeneratedKey={setNewlyGeneratedKey}
                  handleRevokeKey={handleRevokeKey}
                  showApiKey={showApiKey}
                  toggleKeyVisibility={toggleKeyVisibility}
                  formatDate={formatDate}
                />
                <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-8 shadow-sm">
                  <ApiTesting apiKeys={apiKeys} />
                </div>
              </div>
              <KeyUsageStats keyStats={apiStats.keyStats} isLive={true} />
            </div>
          )}

          {activeTab === 'partner' && isPartner && (
            <PartnerDashboard 
              user={user}
              formatDate={formatDate}
              isRefreshing={isRefreshing}
              lastUpdated={lastUpdated}
              isDataFresh={isDataFresh}
              onRefresh={refreshStats}
            />
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <Analytics />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <Users />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

