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
import ApiTesting from './ApiTesting'
import MetricCards from '../../../components/dashboard/MetricCards';
import DashboardTabs from '../../../components/dashboard/DashboardTabs';
import OverviewTab from '../../../components/dashboard/OverviewTab';
import ApiKeysTab from '../../../components/dashboard/ApiKeysTab';
import dashboardService, { ApiStats } from '../../../services/dashboardService';

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
  const [apiStats, setApiStats] = useState<ApiStats>({ 
    totalCalls: 0, 
    monthlyLimit: 10000, 
    plan: 'Free', 
    thisMonth: 0, 
    lastMonth: 0, 
    growth: 0 
  })
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

  // Fetch API keys using the new service
  const fetchApiKeys = async () => {
    try {
      setIsLoadingKeys(true)
      setError('')
      
      const keys = await dashboardService.getApiKeys()
      setApiKeys(keys)
      
      // Calculate total calls from keys
      const totalCallsFromKeys = keys.reduce((sum: number, key: any) => sum + (key.callsUsed || 0), 0)
      setApiStats(prevStats => ({
        ...prevStats,
        totalCalls: totalCallsFromKeys,
      }))
      
    } catch (error: any) {
      console.error('Error fetching API keys:', error)
      setError(error.message || 'Failed to fetch API keys')
      setApiKeys([])
    } finally {
      setIsLoadingKeys(false)
    }
  }

  // Fetch API usage statistics using the new service
  const fetchApiStats = async () => {
    try {
      setIsLoadingStats(true)
      
      const stats = await dashboardService.getApiStats()
      setApiStats(prevStats => ({
        ...prevStats,
        ...stats,
      }))
      
    } catch (error) {
      console.error('An error occurred while fetching API stats:', error)
      // Set default stats on any error, but preserve totalCalls
      setApiStats(prevStats => ({
        ...prevStats,
        monthlyLimit: 10000,
        plan: 'Free',
        thisMonth: 0,
        lastMonth: 0,
        growth: 0,
      }))
    } finally {
      setIsLoadingStats(false)
    }
  }

  // Generate new API key using the new service
  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) return
    
    setIsGeneratingKey(true)
    setError('')
    
    try {
      const newKey = await dashboardService.createApiKey({
        name: newKeyName.trim(),
        scopes: keyConfig.scopes.length > 0 ? keyConfig.scopes : undefined,
        expiresInDays: keyConfig.expiresInDays !== 30 ? keyConfig.expiresInDays : undefined,
        ipWhitelist: keyConfig.ipWhitelist.length > 0 ? keyConfig.ipWhitelist : undefined,
        geoRestrictions: keyConfig.geoRestrictions.length > 0 ? keyConfig.geoRestrictions : undefined,
      })
      
      setApiKeys(prev => [...prev, newKey])
      setNewKeyName('')
      setKeyConfig({
        scopes: [],
        expiresInDays: 30,
        ipWhitelist: [],
        geoRestrictions: []
      })
      setShowAdvancedOptions(false)
      
      // Show the newly generated key
      setNewlyGeneratedKey({
        id: newKey.id,
        key: newKey.key,
        name: newKey.name
      })
      
    } catch (error: any) {
      console.error('Error generating API key:', error)
      setError(error.message || 'Failed to generate API key')
    } finally {
      setIsGeneratingKey(false)
    }
  }

  // Revoke API key using the new service
  const handleRevokeKey = async (keyId: string) => {
    try {
      await dashboardService.revokeApiKey(keyId)
      setApiKeys(prev => prev.filter((key: any) => key.id !== keyId))
    } catch (error: any) {
      console.error('Error revoking API key:', error)
      setError(error.message || 'Failed to revoke API key')
    }
  }

  // Copy API key to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Toggle API key visibility
  const toggleApiKeyVisibility = (keyId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
  }

  // Load data on component mount
  useEffect(() => {
    fetchApiKeys()
    fetchApiStats()
    fetchCurrentToken()
  }, [])

  // Get detailed information about a specific API key
  const getApiKeyDetails = async (keyId: string) => {
    try {
      const details = await dashboardService.getApiKeyDetails(keyId)
      console.log('API Key Details:', details)
      return details
    } catch (error: any) {
      console.error('Error fetching API key details:', error)
      setError(error.message || 'Failed to fetch API key details')
      return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {apiStats.plan} Plan
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <SignOutButton>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setError('')}
                    className="bg-red-100 px-2 py-1 rounded text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metric Cards */}
        <MetricCards 
          apiStats={apiStats}
          isLoadingStats={isLoadingStats}
        />

        {/* Dashboard Tabs */}
        <DashboardTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <OverviewTab 
              apiStats={apiStats}
              isLoadingStats={isLoadingStats}
              onRefreshStats={fetchApiStats}
            />
          )}
          
          {activeTab === 'api-keys' && (
            <ApiKeysTab
              apiKeys={apiKeys}
              isLoadingKeys={isLoadingKeys}
              showApiKey={showApiKey}
              newKeyName={newKeyName}
              setNewKeyName={setNewKeyName}
              isGeneratingKey={isGeneratingKey}
              keyConfig={keyConfig}
              setKeyConfig={setKeyConfig}
              showAdvancedOptions={showAdvancedOptions}
              setShowAdvancedOptions={setShowAdvancedOptions}
              newlyGeneratedKey={newlyGeneratedKey}
              setNewlyGeneratedKey={setNewlyGeneratedKey}
              onGenerateKey={handleGenerateKey}
              onRevokeKey={handleRevokeKey}
              onCopyKey={copyToClipboard}
              onToggleVisibility={toggleApiKeyVisibility}
              onRefreshKeys={fetchApiKeys}
            />
          )}
          
          {activeTab === 'api-testing' && (
            <ApiTesting 
              apiKeys={apiKeys}
              onTestEndpoint={dashboardService.testApiEndpoint}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
