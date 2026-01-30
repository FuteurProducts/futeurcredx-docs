import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUser, useAuth } from '@/contexts/AuthContext'
import SignOutButton from '@/components/SignOutButton'
import { ApiConsole } from '@/components/api-console';

import type { ApiStats, ApiKey } from '@/types';
import Analytics from '@/pages/Dashboard/Analytics';
import Users from '@/pages/Dashboard/Users';
import Products from '@/pages/Dashboard/Products';
import Reports from '@/pages/Dashboard/Reports';
import CreditIntelligence from '@/pages/Dashboard/CreditIntelligence';
import UnderwritingAssistant from '@/pages/Dashboard/UnderwritingAssistant';
import Risk from '@/pages/Dashboard/Risk';
import Customer from '@/pages/Dashboard/Customer';
import Notifications from '@/pages/Dashboard/Notifications';
import { PartnerPortalEnterprise } from '@/components/partner-portal';
import Settings from '@/pages/Dashboard/Settings';

// Import Connected Environment Toggle (uses global context)
import { ConnectedEnvironmentToggle } from '@/components/widgets';

// Import Finlab Overview
import { FinlabOverview } from '@/components/finlab';

const withBaseUrl = (rawSrc: string) => {
  // For public assets, ensure they work in both dev and production
  if (rawSrc.startsWith('/')) {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    // Remove leading slash, add baseUrl, then add back the slash for the path
    const pathWithoutLeadingSlash = rawSrc.slice(1);
    return `${normalizedBaseUrl}${pathWithoutLeadingSlash}`;
  }
  return rawSrc;
};

// Simple Icon component
const Icon = ({ name, className = "" }: { name: string; className?: string }) => {
  const iconMap: Record<string, string> = {
    'arrow-left': '/icons/chevron-right.svg',
    'arrow-right': '/icons/chevron-right.svg',
    'search': '/icons/search-md.svg',
    'bell': '/icons/recording-01.svg',
    'menu': '/icons/sliders-04.svg',
    'home': '/icons/home-smile.svg',
    'key': '/icons/lock-03.svg',
    'chart': '/icons/disc-02.svg',
    'users': '/icons/building-01.svg',
    'file': '/icons/file-02.svg',
    'close': '/icons/plus-square.svg',
    'shield': '/icons/check.svg',
  };

  const rawSrc = name.startsWith('/') ? name : (iconMap[name] || '/icons/file-02.svg');
  const src = withBaseUrl(rawSrc);
  const shouldApplyFilter = !rawSrc.startsWith('/icons-black/');

  return (
    <img
      src={src}
      alt={name}
      className={`w-5 h-5 ${className}`}
      style={shouldApplyFilter ? { filter: 'brightness(0) opacity(0.7)' } : undefined}
    />
  );
};

interface ApiKeyStats {
  keyId: string;
  keyName: string;
  callsUsed: number;
  lastUsed: string | null;
  isActive: boolean;
  environment: string;
}

// Navigation items
const navigation = [
  { id: 'overview', title: 'Dashboard', icon: 'home' },
  { id: 'credit-intel', title: 'Credit Intelligence', icon: '/icons-black/idea.svg' },
  { id: 'underwriting', title: 'Underwriting', icon: '/icons-black/document.svg' },
  { id: 'risk', title: 'Risk', icon: '/icons-black/Binoculars.svg' },
  { id: 'customer', title: 'Customer', icon: '/icons-black/Briefcase.svg' },
  { id: 'api-keys', title: 'API Console', icon: 'key' },
  { id: 'partner-portal', title: 'Partner Portal', icon: '/icons-black/connection.svg' },
  { id: 'analytics', title: 'Analytics', icon: '/icons-black/growth.svg' },
  { id: 'products', title: 'Products', icon: 'file' },
  { id: 'users', title: 'Users', icon: 'users' },
  { id: 'reports', title: 'Reports', icon: '/icons-black/presentations.svg' },
  { id: 'settings', title: 'Settings', icon: '/icons/sliders-04.svg' },
];



const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  // State management
  
  // State management
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
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
  // Keep apiStats and isLoadingStats available for future use
  void apiStats; void isLoadingStats;
  const [activeTab, _setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)

  // Keep state and URL in sync
  const setActiveTab = (tab: string) => {
    _setActiveTab(tab)
    const params = new URLSearchParams(location.search)
    params.set('tab', tab)
    navigate(`/dashboard?${params.toString()}`, { replace: true })
    setSidebarOpen(false) // Close mobile menu when tab changes
  }

  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<{id: string, key: string, name: string} | null>(null)
  const [, setIsRefreshing] = useState(false)
  const [, setLastUpdated] = useState<Date | null>(null)
  const [, setIsDataFresh] = useState(true)
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

  // Fetch all API keys for authenticated user
  const fetchApiKeys = async () => {
    try {
      const token = await getBackendToken()
      
      if (!token) {
        setError('No authentication token available. Please sign in again.')
        setIsLoadingKeys(false)
        return
      }

      const apiUrl = '/api/v1/api-keys'
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        const keys = data.apiKeys || [];
        setApiKeys(keys);
        const keyStats: ApiKeyStats[] = keys.map((key: ApiKey) => ({
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
        setError('')
      } else {
        if (response.status === 401) {
          setError('Authentication failed. Your session may have expired.')
          setApiKeys([])
        } else {
          setError(`API Error: ${response.status}`)
        }
      }
    } catch (error) {
      console.error('Error fetching API keys:', error)
      if (error instanceof TypeError && error.message === 'Load failed') {
        setError('CORS Error: Backend API not configured for localhost.')
        setApiKeys([
          {
            id: 'dev-1',
            name: 'Development Key (Mock)',
            key: 'fc_dev_1234567890abcdef',
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
            callsUsed: 150,
          }
        ] as ApiKey[])
      } else {
        setError('Failed to load API keys.')
        setApiKeys([])
      }
    } finally {
      setIsLoadingKeys(false)
    }
  }

  // Fetch API usage statistics
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

      const timestamp = new Date().getTime();
      const response = await fetch(`/api/v1/api-keys/stats?t=${timestamp}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        cache: 'no-store'
      });

      if (!response.ok && response.status !== 304) {
        throw new Error(`API error: ${response.status}`);
      }

      if (response.status === 304) {
        setLastUpdated(new Date());
        setIsDataFresh(true);
        return;
      }

      const data = await response.json();
      const developmentStats = data.stats?.development || {};
      const productionStats = data.stats?.production || {};
      
      const totalUsage = (developmentStats.totalUsage || 0) + (productionStats.totalUsage || 0);

      const allKeys = [...apiKeys, ...deletedKeys];
      const keyStats: ApiKeyStats[] = allKeys.map(key => ({
        keyId: key.id,
        keyName: key.name,
        callsUsed: key.usageCount || key.callsUsed || 0,
        lastUsed: key.lastUsedAt || key.lastUsed || null,
        isActive: key.isActive !== false && !deletedKeys.some(deleted => deleted.id === key.id),
        environment: key.environment || 'development'
      }));
      
      const totalCallsFromKeys = keyStats.reduce((sum, key) => sum + key.callsUsed, 0);
      const finalTotalCalls = totalUsage > 0 ? totalUsage : totalCallsFromKeys;
      
      setApiStats({
        totalCalls: finalTotalCalls,
        monthlyLimit: 10000,
        plan: 'Free',
        thisMonth: finalTotalCalls,
        lastMonth: 0,
        growth: 0,
        keyStats: keyStats,
        totalCallsThisMonth: finalTotalCalls,
        totalCallsLastMonth: 0,
      });
      setIsDataFresh(true);

    } catch (error) {
      console.error('Error fetching API stats:', error);
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoadingStats(false);
      }
      setLastUpdated(new Date());
    }
  };

  const refreshStats = async () => {
    await fetchApiStats(true);
  };

  // Generate new API key
  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) return
    
    setIsGeneratingKey(true)
    setError('')
    
    try {
      const token = await getBackendToken()
      
      if (!token) {
        setError('No authentication token available.')
        return
      }
      
      const baseUrl = '/api/v1/api-keys'
      const requestPayload: { name: string } = { name: newKeyName.trim() }
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      })

      if (response.ok) {
          const newKey = await response.json()
          const apiKeyData = newKey.apiKey || newKey
          
          if (!apiKeyData || typeof apiKeyData !== 'object' || !apiKeyData.name) {
          setError('Invalid response format from server')
            return
          }
          
          const validatedKey = {
            id: apiKeyData.id || `temp-${Date.now()}`,
          name: apiKeyData.name,
          key: apiKeyData.key || apiKeyData.apiKey || 'key-not-provided',
          keyPrefix: apiKeyData.keyPrefix || null,
          createdAt: apiKeyData.createdAt || new Date().toISOString(),
          lastUsed: apiKeyData.lastUsed || null,
          callsUsed: apiKeyData.callsUsed || 0,
            isActive: apiKeyData.isActive !== undefined ? apiKeyData.isActive : true,
            environment: apiKeyData.environment || 'development',
            ...apiKeyData,
        }
        
        if (validatedKey.key) {
            setNewlyGeneratedKey({
              id: validatedKey.id,
            key: validatedKey.key,
              name: validatedKey.name
            })
          }
          
        setApiKeys(prev => [...prev, validatedKey])
          setNewKeyName('')
        setError('')
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || `Server Error: ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to generate API key:', error)
        setError('Network error. Please try again.')
    } finally {
      setIsGeneratingKey(false)
    }
  }

  // Revoke API key
  const handleRevokeKey = async (keyId: string) => {
    try {
      const token = await getBackendToken()
      const baseUrl = '/api/v1/api-keys'
      const response = await fetch(`${baseUrl}/${keyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const keyToDelete = apiKeys.find(key => key.id === keyId);
        if (keyToDelete) {
          setDeletedKeys(prev => [...prev, { ...keyToDelete, isActive: false }]);
        }
        setApiKeys(prev => prev.filter(key => key.id !== keyId))
        setError('')
      } else {
        setError('Failed to revoke API key')
      }
    } catch (error) {
      console.error('Error revoking API key:', error)
        setError('Network error while revoking key')
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tabParamRaw = params.get('tab')
    const tabParam = tabParamRaw === 'api-console' ? 'api-keys' : tabParamRaw

    if (tabParam && tabParam !== activeTab) {
      _setActiveTab(tabParam)

      // Normalize legacy/alias tab names back into the URL
      if (tabParamRaw !== tabParam) {
        params.set('tab', tabParam)
        navigate(`/dashboard?${params.toString()}`, { replace: true })
      }
    }

    if (user) {
      const fetchData = async () => {
        await fetchApiKeys();
        await fetchApiStats();
      };
      fetchData();
    }
  }, [user, location.search]);

  // Real-time polling
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      refreshStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const toggleKeyVisibility = (keyId: string) => {
    setShowApiKey(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const currentTitle = (
    activeTab === 'customer'
      ? 'Customer Engagement'
      : navigation.find(n => n.id === activeTab)?.title || 'Dashboard'
  )


    return (
    <div className="flex h-screen overflow-hidden bg-[#F4F4F4]">
      {/* ======================= SIDEBAR ======================= */}
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full z-50 bg-white
          transform transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${sidebarCollapsed ? 'lg:w-[80px]' : 'lg:w-[280px]'}
          w-[280px]
        `}
      >
        {/* Logo & Toggle */}
        <div className={`${sidebarCollapsed ? 'h-20' : 'h-[140px]'} flex items-center shrink-0 ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-6'}`}>
          <Link to="/" className="flex items-center">
            <img 
              src={withBaseUrl('/lumiqlogo.png')}
              alt="LumiqAI" 
              className={`object-contain transition-all duration-300 ${sidebarCollapsed ? 'w-14 h-14' : 'w-[120px] h-[120px]'}`}
              onError={(e) => {
                // Fallback if logo fails to load
                const target = e.target as HTMLImageElement;
                target.src = withBaseUrl('/futeur.png');
              }}
            />
          </Link>
          {/* Collapse/Close toggle button */}
          {!sidebarCollapsed && (
            <button
              className="p-2.5 hover:bg-[#F4F4F4] rounded-xl transition-colors hidden lg:flex"
              onClick={() => setSidebarCollapsed(true)}
              title="Collapse sidebar"
            >
              <svg className="w-5 h-5 text-[#6F767E]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
          {/* Mobile close button */}
          <button
            className="p-2.5 hover:bg-[#F4F4F4] rounded-xl transition-colors lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-5 h-5 text-[#6F767E]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Expand button when collapsed */}
        {sidebarCollapsed && (
          <div className="hidden lg:flex justify-center px-2 mb-2">
            <button
              className="p-2.5 hover:bg-[#F4F4F4] rounded-xl transition-colors"
              onClick={() => setSidebarCollapsed(false)}
              title="Expand sidebar"
            >
              <svg className="w-5 h-5 text-[#6F767E]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Navigation - grows to fill available space */}
        <nav className={`flex-1 space-y-1 overflow-y-auto ${sidebarCollapsed ? 'px-2' : 'p-3'}`}>
          {navigation.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              title={sidebarCollapsed ? link.title : undefined}
              className={`
                w-full flex items-center rounded-xl text-left transition-all duration-200
                ${sidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3.5'}
                ${activeTab === link.id 
                  ? 'bg-[#F4F4F4]' 
                  : 'text-[#6F767E] hover:bg-[#F4F4F4]/50'
                }
              `}
            >
              <div className={`w-6 h-6 flex items-center justify-center shrink-0 ${activeTab === link.id ? '' : 'opacity-75'}`}>
                <Icon name={link.icon} />
              </div>
              {!sidebarCollapsed && (
                <>
                  <span className={`text-[0.9375rem] font-semibold ${activeTab === link.id ? 'text-[#1A1D1F]' : ''}`}>
                    {link.title}
                  </span>
                  {activeTab === link.id && (
                    <svg className="w-5 h-5 ml-auto text-[#1A1D1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* ======================= MAIN CONTENT ======================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header - Neutrade style - Fixed/Sticky */}
        <header 
          className="sticky top-0 z-[100] bg-[#F4F4F4] shrink-0"
        >
          <div 
            className="flex items-center h-16 lg:h-20 mx-auto px-4 lg:px-10"
          >
            {/* Left: Hamburger (mobile) + Logo (mobile) / Back + Title (desktop) */}
            <div className="flex items-center mr-auto gap-3">
              {/* Mobile: Hamburger menu */}
              <button 
                className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-white/50 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <svg className="w-6 h-6 text-[#1A1D1F]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Mobile: Title */}
              <span className="lg:hidden text-[1.125rem] font-semibold text-[#1A1D1F]">
                {currentTitle}
              </span>
              
              {/* Desktop: Back arrow + Title */}
              <button
                className="group hidden lg:inline-flex items-center text-[1.5rem] leading-[2rem] font-semibold text-[#1A1D1F]"
                onClick={() => setActiveTab('overview')}
              >
                <div className="flex justify-center items-center w-10 h-10 mr-3.5">
                  <svg 
                    className="w-6 h-6 text-[#1A1D1F] transition-transform group-hover:-translate-x-0.5" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </div>
                {currentTitle}
              </button>
            </div>

            {/* Right: Environment Toggle + Docs + User Info */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Sandbox/Production Toggle */}
              <div className="relative z-[200] pointer-events-auto">
                <ConnectedEnvironmentToggle variant="minimal" />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-[#EFEFEF]" />

              {/* Docs Link */}
              <a
                href="https://docs.futeurcredx.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-white hover:bg-[#EFEFEF] border border-[#EFEFEF] transition-all duration-200 group"
                title="Documentation"
              >
                <svg 
                  className="w-5 h-5 text-[#6F767E] group-hover:text-[#0C68E9] transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth={1.75} 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </a>

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-[#EFEFEF]" />

              {/* User Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-3 px-2 py-1 -mx-2 rounded-xl hover:bg-white/50 transition-colors"
                >
                  {/* User name and email - desktop */}
                  <div className="hidden md:block text-right">
                    <div className="text-[0.9375rem] font-semibold text-[#1A1D1F]">
                      {user?.firstName || user?.username || 'User'}
                    </div>
                    <div className="text-[0.8125rem] text-[#6F767E] truncate max-w-[200px]">
                      {user?.emailAddresses?.[0]?.emailAddress || ''}
                    </div>
                  </div>
                  
                  {/* Avatar */}
                  <img 
                    src={user?.imageUrl || '/futeur.png'} 
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-transparent hover:border-[#0C68E9] transition-colors"
                  />
                </button>

                {/* Account Dropdown Menu */}
                {accountMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-[150]" 
                      onClick={() => setAccountMenuOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 z-[160] w-72 bg-white rounded-2xl shadow-lg border border-[#EFEFEF] overflow-hidden">
                      {/* User Info */}
                      <div className="p-5 border-b border-[#EFEFEF]">
                        <div className="flex items-center gap-4">
                          <img 
                            src={user?.imageUrl || '/futeur.png'} 
                            alt="Avatar"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[1.125rem] font-semibold text-[#1A1D1F] truncate">
                              {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username || 'Display Name'}
                            </div>
                            <div className="text-[0.875rem] text-[#6F767E] truncate">
                              @{user?.username || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'username'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-3 space-y-1">
                        {/* Contact Support */}
                        <a
                          href="https://www.futeurcredx.com/contact-us"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-[#F4F4F4] transition-colors"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          <svg className="w-6 h-6 text-[#6F767E]" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[0.9375rem] font-semibold text-[#1A1D1F]">Contact support</span>
                        </a>

                        {/* Notifications */}
                        <button
                          onClick={() => {
                            setActiveTab('notifications');
                            setAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-[#F4F4F4] transition-colors text-left"
                        >
                          <Icon name="bell" className="w-6 h-6" />
                          <span className="text-[0.9375rem] font-semibold text-[#1A1D1F]">Notifications</span>
                        </button>

                        {/* Dark Mode Toggle */}
                        <div className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-[#F4F4F4] transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
                            <svg className="w-6 h-6 text-[#6F767E]" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                            <span className="text-[0.9375rem] font-semibold text-[#1A1D1F]">Dark</span>
            </div>
                          <div className="w-12 h-7 bg-[#EFEFEF] rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform" />
              </div>
                        </div>

                        {/* Log out */}
                        <SignOutButton>
                          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-[#F4F4F4] transition-colors text-left">
                            <svg className="w-6 h-6 text-[#6F767E]" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="text-[0.9375rem] font-semibold text-[#1A1D1F]">Log out</span>
                </button>
              </SignOutButton>
            </div>
          </div>
                  </>
                )}
        </div>
      </div>
          </div>
        </header>

        {/* Main Content - scrollable area below sticky header */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-[#F4F4F4]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
          {activeTab === 'overview' && (
            <FinlabOverview />
          )}

          {activeTab === 'api-keys' && (
            <ApiConsole
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
          )}

            {activeTab === 'credit-intel' && <CreditIntelligence />}
            {activeTab === 'underwriting' && <UnderwritingAssistant />}
            {activeTab === 'risk' && <Risk />}
            {activeTab === 'customer' && <Customer />}
            {activeTab === 'partner-portal' && <PartnerPortalEnterprise />}
            {activeTab === 'analytics' && <Analytics />}
            {activeTab === 'products' && <Products />}
            {activeTab === 'users' && <Users />}
            {activeTab === 'reports' && <Reports />}
            {activeTab === 'notifications' && <Notifications />}
            {activeTab === 'settings' && <Settings />}
          </motion.div>
      </main>
      </div>
    </div>
  );
};

export default Dashboard;

