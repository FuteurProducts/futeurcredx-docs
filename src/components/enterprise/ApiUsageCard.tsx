import React from "react";
import { motion } from "framer-motion";
import { Activity, Zap, AlertTriangle, Clock, BarChart3 } from "lucide-react";

interface ApiUsageData {
  totalRequests: number;
  requestsChange: number;
  successRate: number;
  avgLatency: number;
  errorCount: number;
  rateLimitHits: number;
  peakHour: string;
  dailyAvg: number;
}

interface ApiUsageCardProps {
  data: ApiUsageData;
  className?: string;
}

export const ApiUsageCard: React.FC<ApiUsageCardProps> = ({
  data,
  className = "",
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-info/10 rounded-xl">
            <Activity className="h-5 w-5 text-info" />
          </div>
          <h3 className="text-h6 font-semibold text-foreground">API Usage</h3>
        </div>
        <span className="text-xs text-muted-foreground">Last 30 days</span>
      </div>

      {/* Main Metric */}
      <div className="mb-6">
        <div className="flex items-end gap-3">
          <span className="text-4xl font-bold text-foreground">
            {formatNumber(data.totalRequests)}
          </span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            data.requestsChange >= 0
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive"
          }`}>
            <span>{data.requestsChange >= 0 ? "+" : ""}{data.requestsChange}%</span>
          </div>
        </div>
        <p className="text-body-2 text-muted-foreground mt-1">Total API requests</p>
      </div>

      {/* Success Rate Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-body-2 text-muted-foreground">Success Rate</span>
          <span className="text-body-2 font-semibold text-foreground">{data.successRate}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.successRate}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${
              data.successRate >= 99 ? "bg-success" :
              data.successRate >= 95 ? "bg-warning" : "bg-destructive"
            }`}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-caption text-muted-foreground">Avg Latency</span>
          </div>
          <span className="text-h6 font-semibold text-foreground">{data.avgLatency}ms</span>
        </div>

        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            <span className="text-caption text-muted-foreground">Errors</span>
          </div>
          <span className="text-h6 font-semibold text-foreground">{formatNumber(data.errorCount)}</span>
        </div>

        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3.5 w-3.5 text-warning" />
            <span className="text-caption text-muted-foreground">Rate Limits</span>
          </div>
          <span className="text-h6 font-semibold text-foreground">{data.rateLimitHits}</span>
        </div>

        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-3.5 w-3.5 text-primary" />
            <span className="text-caption text-muted-foreground">Daily Avg</span>
          </div>
          <span className="text-h6 font-semibold text-foreground">{formatNumber(data.dailyAvg)}</span>
        </div>
      </div>
    </div>
  );
};

export default ApiUsageCard;
