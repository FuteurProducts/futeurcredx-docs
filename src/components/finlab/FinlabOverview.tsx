import React from "react";
import { motion } from "framer-motion";

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

// Mock data for enterprise dashboard
const connectedBusinessesData = {
  totalBusinesses: 2847392,
  activeConnections: 2712458,
  newThisMonth: 23847,
  monthlyGrowth: 8.4,
  disconnectedCount: 12847,
  pendingReconnect: 3291,
};

const apiUsageData = {
  totalRequests: 847293847,
  requestsChange: 12.3,
  successRate: 99.87,
  avgLatency: 142,
  errorCount: 1847,
  rateLimitHits: 23,
  peakHour: "2:00 PM EST",
  dailyAvg: 28243128,
};

const portfolioHealthData = {
  totalAssessed: 2712458,
  segments: [
    { name: "Low Risk", count: 1847293, percentage: 68, color: "#10b981" },
    { name: "Medium Risk", count: 542371, percentage: 20, color: "#f59e0b" },
    { name: "High Risk", count: 271246, percentage: 10, color: "#f97316" },
    { name: "Critical", count: 51548, percentage: 2, color: "#ef4444" },
  ],
  averageScore: 74,
  lastUpdated: "2 min ago",
};

const dataFreshnessData = {
  freshCount: 2441212,
  staleCount: 203847,
  criticalCount: 67399,
  totalAccounts: 2712458,
  avgRefreshTime: "4.2 hours",
  lastBatchRefresh: "12 min ago",
  refreshRate: 94.7,
};

const recentActivities = [
  { id: "1", type: "connection" as const, title: "New business connected", description: "OAuth flow completed successfully", businessName: "TechStart Inc.", timestamp: "2m ago" },
  { id: "2", type: "refresh" as const, title: "Batch data refresh", description: "12,847 accounts updated", timestamp: "5m ago" },
  { id: "3", type: "alert" as const, title: "High risk detected", description: "Business risk score dropped below threshold", businessName: "Retail Solutions LLC", timestamp: "12m ago" },
  { id: "4", type: "success" as const, title: "Webhook delivered", description: "risk.score.updated event sent", timestamp: "15m ago" },
  { id: "5", type: "disconnection" as const, title: "Connection expired", description: "Token refresh failed - reauth required", businessName: "Metro Services", timestamp: "23m ago" },
];

const webhookEvents = [
  { id: "1", eventType: "business.connected", status: "delivered" as const, endpoint: "https://api.bank.com/webhooks", timestamp: "2m ago", responseTime: 89 },
  { id: "2", eventType: "risk.score.updated", status: "delivered" as const, endpoint: "https://api.bank.com/webhooks", timestamp: "5m ago", responseTime: 124 },
  { id: "3", eventType: "data.refreshed", status: "failed" as const, endpoint: "https://api.bank.com/webhooks", timestamp: "8m ago", retryCount: 2 },
  { id: "4", eventType: "account.disconnected", status: "retrying" as const, endpoint: "https://api.bank.com/webhooks", timestamp: "12m ago", retryCount: 1 },
];

const webhookStats = {
  totalSent: 847293,
  deliveryRate: 99.2,
  avgResponseTime: 112,
  failedCount: 847,
};

const systemServices = [
  { name: "Core API", status: "operational" as const, latency: 45, uptime: 99.99, lastCheck: "1m ago" },
  { name: "Data Aggregation", status: "operational" as const, latency: 234, uptime: 99.95, lastCheck: "1m ago" },
  { name: "Risk Engine", status: "operational" as const, latency: 89, uptime: 99.97, lastCheck: "1m ago" },
  { name: "Webhook Delivery", status: "degraded" as const, latency: 312, uptime: 98.7, lastCheck: "1m ago" },
  { name: "Authentication", status: "operational" as const, latency: 28, uptime: 99.99, lastCheck: "1m ago" },
];

const topBusinesses = [
  { id: "1", name: "Acme Corporation", industry: "Manufacturing", lumiqScore: 87, scoreTrend: "up" as const, trendValue: 3, apiCalls: 284729, lastActivity: "2m ago", riskLevel: "low" as const },
  { id: "2", name: "TechStart Inc.", industry: "Technology", lumiqScore: 92, scoreTrend: "up" as const, trendValue: 5, apiCalls: 198472, lastActivity: "5m ago", riskLevel: "low" as const },
  { id: "3", name: "Retail Solutions LLC", industry: "Retail", lumiqScore: 54, scoreTrend: "down" as const, trendValue: 8, apiCalls: 156847, lastActivity: "8m ago", riskLevel: "high" as const },
  { id: "4", name: "Metro Services", industry: "Services", lumiqScore: 71, scoreTrend: "stable" as const, trendValue: 0, apiCalls: 142938, lastActivity: "12m ago", riskLevel: "medium" as const },
  { id: "5", name: "HealthPlus Medical", industry: "Healthcare", lumiqScore: 83, scoreTrend: "up" as const, trendValue: 2, apiCalls: 128374, lastActivity: "15m ago", riskLevel: "low" as const },
];

export const FinlabOverview: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-8 w-full overflow-hidden">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-xl md:text-2xl font-semibold text-foreground">
          SMB Portfolio Overview
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Monitor your connected businesses and API performance via LumiqAI
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
            onRefreshAll={() => console.log("Refresh all")}
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
            activities={recentActivities}
            onViewAll={() => console.log("View all activity")}
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
            events={webhookEvents}
            stats={webhookStats}
            onViewLogs={() => console.log("View webhook logs")}
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
            services={systemServices}
            overallUptime={99.84}
            onRefresh={() => console.log("Refresh status")}
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
          onViewBusiness={(id) => console.log("View business", id)}
          onViewAll={() => console.log("View all businesses")}
          className="shadow-lg bg-card rounded-2xl border border-border"
        />
      </motion.div>
    </div>
  );
};

export default FinlabOverview;
