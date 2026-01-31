import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useEnvironment } from "@/contexts/EnvironmentContext";

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

// Derived data from centralized pilot metrics
const connectedBusinessesData = {
  totalBusinesses: PILOT_METRICS.totalBusinesses,
  activeConnections: PILOT_METRICS.scoredBusinesses,
  newThisMonth: 2840,
  monthlyGrowth: 8.4,
  disconnectedCount: PILOT_METRICS.totalBusinesses - PILOT_METRICS.scoredBusinesses,
  pendingReconnect: 1250,
};

const apiUsageData = {
  totalRequests: PILOT_METRICS.totalApiCalls,
  requestsChange: 12.3,
  successRate: PILOT_METRICS.successRate,
  avgLatency: PILOT_METRICS.avgLatencyMs,
  errorCount: PILOT_METRICS.errorCount,
  rateLimitHits: 23,
  peakHour: "2:00 PM EST",
  dailyAvg: PILOT_METRICS.dailyAvgCalls,
};

const portfolioHealthData = {
  totalAssessed: PILOT_METRICS.scoredBusinesses,
  segments: [
    { name: "Low Risk", count: 25976, percentage: 68, color: "#10b981" },
    { name: "Medium Risk", count: 7640, percentage: 20, color: "#f59e0b" },
    { name: "High Risk", count: 3820, percentage: 10, color: "#f97316" },
    { name: "Critical", count: 764, percentage: 2, color: "#ef4444" },
  ],
  averageScore: PILOT_METRICS.avgLumiqScore,
  lastUpdated: "2 min ago",
};

const dataFreshnessData = {
  freshCount: 34380,
  staleCount: 2674,
  criticalCount: 1146,
  totalAccounts: PILOT_METRICS.scoredBusinesses,
  avgRefreshTime: "4.2 hours",
  lastBatchRefresh: "12 min ago",
  refreshRate: 94.7,
};

const topBusinesses = DEMO_BUSINESSES.slice(0, 5).map((biz, idx) => ({
  id: biz.id,
  name: biz.name,
  industry: biz.industry,
  lumiqScore: biz.lumiqScore,
  scoreTrend: biz.scoreTrend,
  trendValue: biz.trendValue,
  apiCalls: [4820, 3650, 2940, 2180, 1870][idx],
  lastActivity: ["2m ago", "5m ago", "12m ago", "18m ago", "25m ago"][idx],
  riskLevel: biz.riskTier,
}));

export const FinlabOverview: React.FC = () => {
  const { toast } = useToast();
  const { currentEnvironment } = useEnvironment();
  const [, setIsRefreshing] = useState(false);

  const handleRefreshAll = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({ title: "Data refreshed", description: "All scores and bureau data have been refreshed." });
    }, 1500);
  };

  const handleViewBusiness = (id: string) => {
    const biz = DEMO_BUSINESSES.find(b => b.id === id);
    toast({ title: "Business selected", description: `Viewing ${biz?.name || id} — navigate to Customers tab for full details.` });
  };

  const handleViewAllBusinesses = () => {
    toast({ title: "View all businesses", description: "Navigate to the Customers tab for the full portfolio list." });
  };

  return (
    <div className="space-y-6 md:space-y-8 w-full overflow-hidden">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-display">
            SMB Portfolio Overview
          </h1>
          {currentEnvironment === 'sandbox' && (
            <span className="px-2 py-0.5 text-overline rounded bg-warning/10 text-warning">SANDBOX</span>
          )}
          {currentEnvironment === 'production' && (
            <span className="px-2 py-0.5 text-overline rounded bg-success/10 text-success">LIVE</span>
          )}
        </div>
        <p className="text-body text-muted-foreground mt-1">
          Monitor your connected businesses and API performance via LUMIQ AI
        </p>
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
            onViewAll={() => toast({ title: "Activity log", description: "Navigate to Audit Logs in Settings for the full activity stream." })}
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
            onViewLogs={() => toast({ title: "Webhook logs", description: "Navigate to Partner Portal → Webhooks for full delivery logs." })}
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
        <TopBusinessesTable
          businesses={topBusinesses}
          onViewBusiness={handleViewBusiness}
          onViewAll={handleViewAllBusinesses}
          className="shadow-lg bg-card rounded-2xl border border-border"
        />
      </motion.div>
    </div>
  );
};

export default FinlabOverview;
