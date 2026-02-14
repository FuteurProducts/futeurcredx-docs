import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUser, useAuth } from '@/contexts/AuthContext'
import SignOutButton from '@/components/SignOutButton'
import { ApiConsole } from '@/components/api-console';
import {
  Home, Lightbulb, FileText, Eye, Layers,
  KeyRound, Link2, Megaphone, Package, Building2,
  BarChart3, SlidersHorizontal, Bell, Book,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { ApiStats, ApiKey } from '@/types';
import { apiKeysService } from '@/services/bff/apiKeys';
import Users from '@/pages/Dashboard/Users';
import Products from '@/pages/Dashboard/Products';
import Reports from '@/pages/Dashboard/Reports';
import CreditIntelligence from '@/components/dashboard/pages/CreditIntelligence';
import UnderwritingQueue from '@/components/dashboard/pages/UnderwritingQueue';
import Risk from '@/components/dashboard/pages/Risk';
import Campaigns from '@/components/dashboard/pages/Campaigns';
import SegmentExplorer from '@/components/dashboard/pages/SegmentExplorer';
import Notifications from '@/pages/Dashboard/Notifications';
import { PartnerPortalEnterprise } from '@/components/partner-portal';
import Settings from '@/pages/Dashboard/Settings';
import Documentation from '@/components/dashboard/pages/Documentation';

// Import Connected Environment Toggle (uses global context)
import { ConnectedEnvironmentToggle } from '@/components/widgets';
import { DataSourceBadge } from '@/components/shared/DataSourceBadge';

import { logger } from '@/utils/logger';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { ACTIVE_BANK_NAME } from '@/data/bankConfig';

// Import Finlab Overview
import { FinlabOverview } from '@/components/finlab';

// Import Command Palette
import { CommandPalette } from '@/components/command-palette';

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

interface ApiKeyStats {
  keyId: string;
  keyName: string;
  callsUsed: number;
  lastUsed: string | null;
  isActive: boolean;
  environment: string;
}

// Navigation items — Lucide React icon components
const navigation: { id: string; title: string; icon: LucideIcon }[] = [
  { id: 'overview', title: 'Dashboard', icon: Home },
  { id: 'credit-intel', title: 'Credit Intelligence', icon: Lightbulb },
  { id: 'underwriting', title: 'Underwriting', icon: FileText },
  { id: 'risk', title: 'Risk', icon: Eye },
  { id: 'campaigns', title: 'Campaigns', icon: Megaphone },
  { id: 'segments', title: 'Segment Explorer', icon: Layers },
  { id: 'api-keys', title: 'API Console', icon: KeyRound },
  { id: 'partner-portal', title: 'Partner Portal', icon: Link2 },
  { id: 'products', title: 'Products', icon: Package },
  { id: 'users', title: 'Businesses', icon: Building2 },
  { id: 'reports', title: 'Reports', icon: BarChart3 },
  { id: 'settings', title: 'Settings', icon: SlidersHorizontal },
  { id: 'documentation', title: 'Documentation', icon: Book },
];



const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive base path from current route — preserves /demo/:bankId prefix
  const basePath = location.pathname.match(/^\/demo\/[^/]+/)?.[0] || '/dashboard';
  const { user } = useUser();
  const { getToken } = useAuth();
  const { toast: _toast } = useToast();
  const { resolvedTheme, setTheme } = useTheme();
  const { currentEnvironment, switchEnvironment } = useEnvironment();
  const featureFlags = useFeatureFlags();


  // Filter navigation based on feature flags (hide API Console in demo mode, etc.)
  const filteredNavigation = navigation.filter(item => {
    if (item.id === 'api-keys' && !featureFlags.showApiConsole) return false;
    return true;
  });

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

  // Track previous environment to detect sandbox entry
  const prevEnvironmentRef = useRef<string>(currentEnvironment);

  // Auto-navigate to API Console when entering sandbox mode
  useEffect(() => {
    const prevEnv = prevEnvironmentRef.current;
    if (currentEnvironment === 'sandbox' && prevEnv === 'production') {
      _setActiveTab('api-keys');
      const params = new URLSearchParams(location.search);
      params.set('tab', 'api-keys');
      navigate(`${basePath}?${params.toString()}`, { replace: true });
    }
    prevEnvironmentRef.current = currentEnvironment;
  }, [currentEnvironment]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep state and URL in sync
  const setActiveTab = (tab: string) => {
    _setActiveTab(tab)
    const params = new URLSearchParams(location.search)
    params.set('tab', tab)
    navigate(`${basePath}?${params.toString()}`, { replace: true })
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

  // Fetch all API keys for authenticated user via BFF client
  const fetchApiKeys = async () => {
    try {
      const result = await apiKeysService.list();
      const bffKeys = result.data || [];
      const keys: ApiKey[] = bffKeys.map((k) => ({
        id: k.id,
        name: k.name,
        keyPrefix: k.keyPrefix,
        createdAt: k.createdAt,
        isActive: k.isActive,
        environment: k.environment,
        scopes: k.scopes || [],
        lastUsedAt: k.lastUsedAt,
        expiresAt: k.expiresAt,
      }));
      setApiKeys(keys);
      const keyStats: ApiKeyStats[] = keys.map((key) => ({
        keyId: key.id,
        keyName: key.name,
        callsUsed: 0,
        lastUsed: key.lastUsedAt || null,
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
    } catch (error) {
      logger.error('[Dashboard] Error fetching API keys:', error)
      setApiKeys([])
      setError('')
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
      logger.error('[Dashboard] Error fetching API stats:', error);
      // Sandbox mode fallback — set reasonable demo stats
      setApiStats({
        totalCalls: 3739,
        monthlyLimit: 10000,
        plan: 'Pro',
        thisMonth: 3739,
        lastMonth: 2104,
        growth: 77.7,
        keyStats: [],
        totalCallsThisMonth: 3739,
        totalCallsLastMonth: 2104,
      });
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

  // Generate new API key via BFF client (uses X-API-Key auth automatically)
  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) return

    setIsGeneratingKey(true)
    setError('')

    try {
      const result = await apiKeysService.create({
        name: newKeyName.trim(),
        environment: 'sandbox',
        scopes: ['read', 'write'],
        expiresInDays: 30,
      });

      const created = result.data;
      // The create response may include the full key as `keyValue` — only available once
      const rawData = result.data as unknown as Record<string, string>;
      const fullKey = rawData.keyValue || rawData.key || '';

      if (fullKey) {
        setNewlyGeneratedKey({
          id: created.id,
          key: fullKey,
          name: created.name,
        });
      }

      const newKey: ApiKey = {
        id: created.id,
        name: created.name,
        key: fullKey,
        keyPrefix: created.keyPrefix,
        createdAt: created.createdAt,
        isActive: created.isActive,
        environment: created.environment,
        scopes: created.scopes || [],
      };
      setApiKeys(prev => [...prev, newKey]);
      setNewKeyName('');
      setError('');
    } catch (error) {
      logger.error('[Dashboard] Failed to generate API key:', error);
      const bffErr = error as { error?: { message?: string } };
      setError(bffErr?.error?.message || 'Failed to create API key. Ensure an API key is set as active.');
    } finally {
      setIsGeneratingKey(false)
    }
  }

  // Revoke API key
  const handleRevokeKey = async (keyId: string) => {
    try {
      await apiKeysService.revoke(keyId);
      const keyToDelete = apiKeys.find(key => key.id === keyId);
      if (keyToDelete) {
        setDeletedKeys(prev => [...prev, { ...keyToDelete, isActive: false }]);
      }
      setApiKeys(prev => prev.filter(key => key.id !== keyId))
      setError('')
    } catch (error) {
      logger.error('[Dashboard] Error revoking API key:', error)
      const bffErr = error as { error?: { message?: string } };
      setError(bffErr?.error?.message || 'Failed to revoke API key. Ensure an API key is set as active.');
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
        navigate(`${basePath}?${params.toString()}`, { replace: true })
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
    navigation.find(n => n.id === activeTab)?.title || 'Dashboard'
  )


    return (
    <div className="flex h-screen overflow-hidden bg-muted">
      {/* Command Palette - Global keyboard shortcut Cmd/Ctrl+K */}
      <CommandPalette onNavigate={setActiveTab} />
      {/* ======================= SIDEBAR ======================= */}
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - Premium gradient background */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
          transform transition-all duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto flex flex-col
          border-r border-white/5
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${sidebarCollapsed ? 'lg:w-[80px]' : 'lg:w-[280px]'}
          w-[280px]
        `}
      >
        {/* Logo & Toggle */}
        <div className={`${sidebarCollapsed ? 'h-16' : 'h-20'} flex items-center shrink-0 ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-6'} border-b border-white/5`}>
          <Link to="/" className="flex items-center group">
            <div className={`relative ${sidebarCollapsed ? '' : 'p-2'}`}>
              <img
                src={withBaseUrl('/lumiq-logo.svg')}
                alt="LUMIQ AI"
                className={`object-contain transition-all duration-200 group-hover:scale-105 ${sidebarCollapsed ? 'h-8 w-auto' : 'h-12 w-auto'}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = withBaseUrl('/lumiqlogo.png');
                }}
              />
              {!sidebarCollapsed && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-60" />
              )}
            </div>
          </Link>
          {/* Collapse/Close toggle button */}
          {!sidebarCollapsed && (
            <button
              className="p-2.5 hover:bg-white/10 rounded-xl transition-colors hidden lg:flex"
              onClick={() => setSidebarCollapsed(true)}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
          {/* Mobile close button */}
          <button
            className="p-2.5 hover:bg-white/10 rounded-xl transition-colors lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Expand button when collapsed */}
        {sidebarCollapsed && (
          <div className="hidden lg:flex justify-center px-2 mb-2">
            <button
              className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"
              onClick={() => setSidebarCollapsed(false)}
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Navigation - grows to fill available space */}
        <nav className={`flex-1 space-y-1.5 overflow-y-auto ${sidebarCollapsed ? 'px-2' : 'p-3'}`}>
          {filteredNavigation.map((link, idx) => {
            // Premium icon gradient colors for each nav item
            const iconColors = [
              'from-blue-500 to-indigo-600',      // Dashboard
              'from-amber-400 to-orange-500',     // Credit Intelligence
              'from-emerald-400 to-teal-500',     // Underwriting
              'from-rose-400 to-pink-500',        // Risk
              'from-violet-400 to-purple-500',    // Customer
              'from-cyan-400 to-blue-500',        // API Console
              'from-fuchsia-400 to-pink-500',     // Partner Portal
              'from-green-400 to-emerald-500',    // Analytics
              'from-orange-400 to-red-500',       // Products
              'from-indigo-400 to-violet-500',    // Users
              'from-teal-400 to-cyan-500',        // Reports
              'from-slate-400 to-gray-500',       // Settings
            ];
            const gradientClass = iconColors[idx % iconColors.length];
            const isActive = activeTab === link.id;

            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                title={sidebarCollapsed ? link.title : undefined}
                className={`
                  w-full flex items-center rounded-xl text-left transition-all duration-200 group
                  ${sidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-3'}
                  ${isActive
                    ? 'bg-gradient-to-r from-primary/15 to-transparent border-l-2 border-primary'
                    : 'text-muted-foreground hover:bg-white/8 hover:text-white'
                  }
                `}
              >
                <div className={`
                  w-9 h-9 flex items-center justify-center shrink-0 rounded-lg transition-all duration-200
                  ${isActive
                    ? `bg-gradient-to-br ${gradientClass}`
                    : `bg-white/5 group-hover:bg-gradient-to-br group-hover:${gradientClass}`
                  }
                `}>
                  <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-white'}`} />
                </div>
                {!sidebarCollapsed && (
                  <>
                    <span className={`text-[0.9375rem] font-semibold ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
                      {link.title}
                    </span>
                    {isActive && (
                      <div className="ml-auto flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ======================= MAIN CONTENT ======================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Demo Mode Banner */}
        {currentEnvironment === 'demo' && (
          <div className="sticky top-0 z-20 bg-blue-500 dark:bg-blue-600 text-white px-4 py-1.5 flex items-center justify-center gap-2 text-sm font-medium shrink-0">
            <Lightbulb className="w-4 h-4" />
            <span>DEMO MODE — {ACTIVE_BANK_NAME} sample data</span>
            <span className="mx-1 opacity-50">|</span>
            <button
              onClick={() => switchEnvironment('sandbox')}
              className="underline underline-offset-2 hover:opacity-80 transition-opacity text-sm font-semibold"
            >
              Switch to Sandbox
            </button>
          </div>
        )}

        {/* Sandbox Environment Banner */}
        {currentEnvironment === 'sandbox' && (
          <div className="sticky top-0 z-20 bg-amber-500 text-white px-4 py-1.5 flex items-center justify-center gap-2 text-sm font-medium shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span>SANDBOX MODE — Test data only. API calls are not billed.</span>
            <button
              onClick={() => switchEnvironment('production')}
              className="ml-2 underline underline-offset-2 hover:opacity-80 transition-opacity text-sm font-semibold"
            >
              Switch to Production
            </button>
          </div>
        )}

        {/* Header - Fixed/Sticky with premium gradient */}
        <header
          className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shrink-0"
        >
          <div
            className="flex items-center h-18 lg:h-22 mx-auto px-4 lg:px-10"
          >
            {/* Left: Hamburger (mobile) + Logo (mobile) / Back + Title (desktop) */}
            <div className="flex items-center mr-auto gap-3">
              {/* Mobile: Hamburger menu */}
              <button
                className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-card/50 transition-colors"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation menu"
              >
                <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Mobile: Title + DataSourceBadge */}
              <span className="lg:hidden text-[1.125rem] font-semibold text-foreground">
                {currentTitle}
              </span>
              <DataSourceBadge className="lg:hidden" />

              {/* Desktop: Back arrow + Title + DataSourceBadge */}
              <button
                className="group hidden lg:inline-flex items-center text-[1.5rem] leading-[2rem] font-semibold text-foreground"
                onClick={() => setActiveTab('overview')}
              >
                <div className="flex justify-center items-center w-10 h-10 mr-3.5">
                  <svg
                    className="w-6 h-6 text-foreground transition-transform group-hover:-translate-x-0.5"
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
              <DataSourceBadge className="hidden lg:inline-flex" />
            </div>

            {/* Right: Environment Toggle + Docs + User Info */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Sandbox/Production Toggle */}
              <div className="relative z-10 pointer-events-auto">
                <ConnectedEnvironmentToggle variant="minimal" />
              </div>

              {/* Command Palette Keyboard Hint */}
              <button
                className="hidden md:flex items-center gap-1 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-card/50"
                onClick={() => {
                  // Dispatch keyboard event to open command palette
                  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
                }}
                title="Open command palette"
                aria-label="Open command palette"
              >
                <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-medium border border-border">Cmd</kbd>
                <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-medium border border-border">K</kbd>
              </button>

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-border" />

              {/* Docs Link */}
              <button
                onClick={() => setActiveTab('documentation')}
                className="flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-card hover:bg-muted border border-border transition-all duration-200 group"
                title="Documentation"
                aria-label="View documentation"
              >
                <svg
                  className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </button>

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-border" />

              {/* User Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-3 px-2 py-1 -mx-2 rounded-xl hover:bg-card/50 transition-colors"
                >
                  {/* User name and email - desktop */}
                  <div className="hidden md:block text-right">
                    <div className="text-[0.9375rem] font-semibold text-foreground">
                      {user?.firstName || user?.username || 'User'}
                    </div>
                    <div className="text-[0.8125rem] text-muted-foreground truncate max-w-[200px]">
                      {user?.emailAddresses?.[0]?.emailAddress || ''}
                    </div>
                  </div>
                  
                  {/* Avatar */}
                  <img 
                    src={user?.imageUrl || '/lumiq-avatar.png'}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-transparent hover:border-primary transition-colors"
                  />
                </button>

                {/* Account Dropdown Menu */}
                {accountMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAccountMenuOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-card/95 backdrop-blur-xl rounded-3xl shadow-[var(--shadow-dropdown)] border border-white/[0.08] overflow-hidden">
                      {/* User Info */}
                      <div className="p-5 border-b border-border">
                        <div className="flex items-center gap-4">
                          <img 
                            src={user?.imageUrl || '/lumiq-avatar.png'}
                            alt="Avatar"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[1.125rem] font-semibold text-foreground truncate">
                              {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.username || 'Display Name'}
                            </div>
                            <div className="text-[0.875rem] text-muted-foreground truncate">
                              @{user?.username || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'username'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-3 space-y-1">
                        {/* Contact Support */}
                        <a
                          href="https://www.lumiq.ai/contact"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-muted/50 transition-colors duration-150"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[0.9375rem] font-semibold text-foreground">Contact support</span>
                        </a>

                        {/* Notifications */}
                        <button
                          onClick={() => {
                            setActiveTab('notifications');
                            setAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-muted/50 transition-colors duration-150 text-left"
                        >
                          <Bell className="w-6 h-6 text-muted-foreground" />
                          <span className="text-[0.9375rem] font-semibold text-foreground">Notifications</span>
                        </button>

                        {/* Dark Mode Toggle */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'); }}
                          className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-muted/50 transition-colors duration-150 cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            {resolvedTheme === 'dark' ? (
                              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            )}
                            <span className="text-[0.9375rem] font-semibold text-foreground">
                              {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
                            </span>
                          </div>
                          <div className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${resolvedTheme === 'dark' ? 'bg-primary' : 'bg-muted'}`}>
                            <div className={`absolute left-1 top-1 w-5 h-5 bg-card rounded-full shadow transition-transform ${resolvedTheme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
                          </div>
                        </div>

                        {/* Log out */}
                        <SignOutButton>
                          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-muted/50 transition-colors duration-150 text-left">
                            <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="text-[0.9375rem] font-semibold text-foreground">Log out</span>
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

        {/* Main Content - scrollable area below sticky header with premium background */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-background relative">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20 dark:opacity-[0.04]" />
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
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
            {activeTab === 'underwriting' && <UnderwritingQueue />}
            {activeTab === 'risk' && <Risk />}
            {activeTab === 'campaigns' && <Campaigns />}
            {activeTab === 'segments' && <SegmentExplorer />}
            {activeTab === 'partner-portal' && <PartnerPortalEnterprise />}
            {activeTab === 'products' && <Products />}
            {activeTab === 'users' && <Users />}
            {activeTab === 'reports' && <Reports />}
            {activeTab === 'notifications' && <Notifications />}
            {activeTab === 'settings' && <Settings />}
            {activeTab === 'documentation' && <Documentation />}
          </motion.div>
      </main>
      </div>
    </div>
  );
};

export default Dashboard;

