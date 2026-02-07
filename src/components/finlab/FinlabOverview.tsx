import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useEnvironment } from "@/contexts/EnvironmentContext";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { getDashboardKPIs } from "@/services/dashboardMetrics";
import { logger } from "@/utils/logger";
import { getEnrichedBusiness } from "@/data/demoData";
import { BankDisclaimer } from '@/components/shared/BankDisclaimer';
import { DemoMetaBadge } from '@/components/shared/DemoMetaBadge';
import { DataLineageFooter } from '@/components/shared/DataLineageFooter';

// Import enterprise components for bank staff monitoring SMB customers
import {
  ConnectedBusinessesCard,
  ApiUsageCard,
  PortfolioHealthCard,
  DataFreshnessCard,
  RecentActivityFeed,
  WebhookEventsCard,
  IntegrationHealthCard,
  TopBusinessesTable,
} from "@/components/enterprise";

import {
  PILOT_METRICS,
  DEMO_BUSINESSES,
  RECENT_ACTIVITIES,
  WEBHOOK_EVENTS,
  WEBHOOK_STATS,
  SYSTEM_SERVICES,
} from "@/data/demoData";

// Fallback data derived from centralized pilot metrics (used when live data is unavailable)
const FALLBACK_connectedBusinessesData = {
  totalBusinesses: PILOT_METRICS.totalBusinesses,
  activeConnections: PILOT_METRICS.scoredBusinesses,
  newThisMonth: 2840,
  monthlyGrowth: 8.4,
  disconnectedCount: PILOT_METRICS.totalBusinesses - PILOT_METRICS.scoredBusinesses,
  pendingReconnect: 1250,
};

const FALLBACK_apiUsageData = {
  totalRequests: PILOT_METRICS.totalApiCalls,
  requestsChange: 12.3,
  successRate: PILOT_METRICS.successRate,
  avgLatency: PILOT_METRICS.avgLatencyMs,
  errorCount: PILOT_METRICS.errorCount,
  rateLimitHits: 23,
  peakHour: "2:00 PM EST",
  dailyAvg: PILOT_METRICS.dailyAvgCalls,
};

const FALLBACK_portfolioHealthData = {
  totalAssessed: PILOT_METRICS.scoredBusinesses,
  segments: [
    { name: "Low Risk", count: 25976, percentage: 68, color: "hsl(var(--success))" },
    { name: "Medium Risk", count: 7640, percentage: 20, color: "hsl(var(--warning))" },
    { name: "High Risk", count: 3820, percentage: 10, color: "hsl(var(--primary-05))" },
    { name: "Critical", count: 764, percentage: 2, color: "hsl(var(--destructive))" },
  ],
  averageScore: PILOT_METRICS.avgLumiqScore,
  lastUpdated: "2 min ago",
};

const FALLBACK_dataFreshnessData = {
  freshCount: 34380,
  staleCount: 2674,
  criticalCount: 1146,
  totalAccounts: PILOT_METRICS.scoredBusinesses,
  avgRefreshTime: "4.2 hours",
  lastBatchRefresh: "12 min ago",
  refreshRate: 94.7,
};

const topBusinesses = DEMO_BUSINESSES.slice(0, 5).map((biz, idx) => {
  const enriched = getEnrichedBusiness(biz.id);
  return {
    id: biz.id,
    name: biz.name,
    industry: biz.industry,
    lumiqScore: biz.lumiqScore,
    scoreTrend: biz.scoreTrend,
    trendValue: biz.trendValue,
    apiCalls: [4820, 3650, 2940, 2180, 1870][idx],
    lastActivity: enriched?.activityHistory[0]?.date
      ? `${Math.max(1, Math.floor((Date.now() - new Date(enriched.activityHistory[0].date).getTime()) / (1000 * 60 * 60 * 24)))}d ago`
      : ["2m ago", "5m ago", "12m ago", "18m ago", "25m ago"][idx],
    riskLevel: biz.riskTier,
  };
});

export const FinlabOverview: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentEnvironment } = useEnvironment();
  const { portfolioId } = usePortfolio();
  const [, setIsRefreshing] = useState(false);

  // State for card data, initialized to static fallback values
  const [connectedBusinessesData, setConnectedBusinessesData] = useState(FALLBACK_connectedBusinessesData);
  const [apiUsageData, setApiUsageData] = useState(FALLBACK_apiUsageData);
  const [portfolioHealthData, setPortfolioHealthData] = useState(FALLBACK_portfolioHealthData);
  const [dataFreshnessData, setDataFreshnessData] = useState(FALLBACK_dataFreshnessData);

  // Fetch live KPIs and map them onto card data shapes
  const loadLiveData = useCallback(async () => {
    if (!portfolioId) return;

    try {
      const result = await getDashboardKPIs(portfolioId);
      const kpis = result.data;

      if (result.source === 'live') {
        setConnectedBusinessesData(prev => ({
          ...prev,
          totalBusinesses: kpis.totalBusinesses,
          activeConnections: kpis.scoredBusinesses,
          disconnectedCount: kpis.totalBusinesses - kpis.scoredBusinesses,
        }));

        setApiUsageData(prev => ({
          ...prev,
          totalRequests: kpis.totalApiCalls,
          dailyAvg: kpis.dailyAvgCalls,
        }));

        setPortfolioHealthData(prev => ({
          ...prev,
          totalAssessed: kpis.scoredBusinesses,
          averageScore: kpis.avgLumiqScore,
          lastUpdated: "just now",
        }));

        setDataFreshnessData(prev => ({
          ...prev,
          totalAccounts: kpis.scoredBusinesses,
        }));
      }
    } catch (err) {
      logger.warn('[FinlabOverview] Failed to load live data, keeping fallback', err);
    }
  }, [portfolioId]);

  // Reload live data when the selected portfolio changes
  useEffect(() => {
    loadLiveData();
  }, [loadLiveData]);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await loadLiveData();
      toast({ title: "Data refreshed", description: "All risk indicators and bureau data have been refreshed." });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleViewBusiness = (id: string) => {
    const biz = DEMO_BUSINESSES.find(b => b.id === id);
    toast({ title: "Business selected", description: `Viewing ${biz?.name || id} in Customers.` });
    navigate('/dashboard?tab=customer');
  };

  const handleViewAllBusinesses = () => {
    toast({ title: "View all businesses", description: "Opening full portfolio list." });
    navigate('/dashboard?tab=customer');
  };

  return (
    <div className="space-y-6 md:space-y-8 w-full overflow-hidden relative">
      <BankDisclaimer compact />
      {/* Premium Welcome Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 md:p-8 shadow-xl"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff1_1px,transparent_1px),linear-gradient(to_bottom,#fff1_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              SMB Portfolio Overview
            </h1>
            {currentEnvironment === 'sandbox' && (
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30 backdrop-blur-sm">
                SANDBOX
              </span>
            )}
            {currentEnvironment === 'production' && (
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 backdrop-blur-sm flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <p className="text-base md:text-lg text-blue-100 mt-2 max-w-2xl">
            Monitor your connected businesses and API performance via LUMIQ AI
          </p>

          {/* Quick stats row */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{connectedBusinessesData.totalBusinesses.toLocaleString()}</div>
                <div className="text-xs text-blue-200">Total Businesses</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{apiUsageData.successRate}%</div>
                <div className="text-xs text-blue-200">Success Rate</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{portfolioHealthData.averageScore}</div>
                <div className="text-xs text-blue-200">Avg Risk Indicator</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Row 1: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="min-w-0"
        >
          <ConnectedBusinessesCard
            data={connectedBusinessesData}
            className="h-full shadow-lg bg-card rounded-2xl border border-border"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="min-w-0"
        >
          <ApiUsageCard
            data={apiUsageData}
            className="h-full shadow-lg bg-card rounded-2xl border border-border"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="min-w-0 md:col-span-2 xl:col-span-1"
        >
          <PortfolioHealthCard
            data={portfolioHealthData}
            className="h-full shadow-lg bg-card rounded-2xl border border-border"
          />
        </motion.div>
      </div>

      {/* Row 2: Data Quality + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="min-w-0"
        >
          <DataFreshnessCard
            data={dataFreshnessData}
            onRefreshAll={handleRefreshAll}
            className="shadow-lg bg-card rounded-2xl border border-border"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="min-w-0"
        >
          <RecentActivityFeed
            activities={RECENT_ACTIVITIES}
            onViewAll={() => {
              toast({ title: "Activity log", description: "Opening Audit Logs in Settings." });
              navigate('/dashboard?tab=settings');
            }}
            className="shadow-lg bg-card rounded-2xl border border-border"
          />
        </motion.div>
      </div>

      {/* Row 3: Webhooks + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="min-w-0"
        >
          <WebhookEventsCard
            events={WEBHOOK_EVENTS}
            stats={WEBHOOK_STATS}
            onViewLogs={() => {
              toast({ title: "Webhook logs", description: "Opening Partner Portal webhook logs." });
              navigate('/dashboard?tab=partner-portal');
            }}
            className="shadow-lg bg-card rounded-2xl border border-border"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="min-w-0"
        >
          <IntegrationHealthCard
            services={SYSTEM_SERVICES}
            overallUptime={99.96}
            onRefresh={() => {
              toast({ title: "Status refreshed", description: "All service health checks updated." });
            }}
            className="shadow-lg bg-card rounded-2xl border border-border"
          />
        </motion.div>
      </div>

      {/* Row 4: Top Businesses Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.45 }}
        className="min-w-0"
      >
        <div className="text-xs text-muted-foreground mb-2">Showing top 25 of 47,500 businesses</div>
        <TopBusinessesTable
          businesses={topBusinesses}
          onViewBusiness={handleViewBusiness}
          onViewAll={handleViewAllBusinesses}
          className="shadow-lg bg-card rounded-2xl border border-border"
        />
      </motion.div>

      {/* Data Source Footer */}
      <DataLineageFooter
        meta={{
          lastUpdated: new Date().toISOString(),
          dataSources: ['LUMIQ AI Signal Engine', 'Experian Business', 'Plaid Banking'],
        }}
      />
    </div>
  );
};

export default FinlabOverview;
