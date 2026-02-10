import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, CheckCircle2, AlertCircle, Clock, Database } from "lucide-react";

interface FreshnessData {
  freshCount: number;
  staleCount: number;
  criticalCount: number;
  totalAccounts: number;
  avgRefreshTime: string;
  lastBatchRefresh: string;
  refreshRate: number;
}

interface DataFreshnessCardProps {
  data: FreshnessData;
  onRefreshAll?: () => void;
  className?: string;
}

export const DataFreshnessCard: React.FC<DataFreshnessCardProps> = ({
  data,
  onRefreshAll,
  className = "",
}) => {
  const freshnessPercentage = Math.round((data.freshCount / data.totalAccounts) * 100);

  return (
    <div className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-04/10 rounded-xl">
            <Database className="h-5 w-5 text-primary-04" />
          </div>
          <h3 className="text-h6 font-semibold text-foreground">Data Freshness</h3>
        </div>
        {onRefreshAll && (
          <button
            onClick={onRefreshAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh All
          </button>
        )}
      </div>

      {/* Progress Ring */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={`${
                freshnessPercentage >= 90 ? "text-success" :
                freshnessPercentage >= 70 ? "text-warning" : "text-destructive"
              }`}
              initial={{ strokeDasharray: "0 251.2" }}
              animate={{ strokeDasharray: `${freshnessPercentage * 2.512} 251.2` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-foreground">{freshnessPercentage}%</span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-body-2 text-muted-foreground mb-1">Account data up-to-date</p>
          <p className="text-h4 font-bold text-foreground">
            {data.freshCount.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              / {data.totalAccounts.toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-success/10 rounded-xl text-center">
          <CheckCircle2 className="h-5 w-5 text-success mx-auto mb-1" />
          <span className="text-h6 font-semibold text-foreground block">
            {data.freshCount.toLocaleString()}
          </span>
          <span className="text-caption text-muted-foreground">Fresh (&lt;24h)</span>
        </div>

        <div className="p-3 bg-warning/10 rounded-xl text-center">
          <Clock className="h-5 w-5 text-warning mx-auto mb-1" />
          <span className="text-h6 font-semibold text-foreground block">
            {data.staleCount.toLocaleString()}
          </span>
          <span className="text-caption text-muted-foreground">Stale (1-7d)</span>
        </div>

        <div className="p-3 bg-destructive/10 rounded-xl text-center">
          <AlertCircle className="h-5 w-5 text-destructive mx-auto mb-1" />
          <span className="text-h6 font-semibold text-foreground block">
            {data.criticalCount.toLocaleString()}
          </span>
          <span className="text-caption text-muted-foreground">Critical (&gt;7d)</span>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
        <div className="text-muted-foreground">
          Avg refresh: <span className="font-medium text-foreground">{data.avgRefreshTime}</span>
        </div>
        <div className="text-muted-foreground">
          Last batch: <span className="font-medium text-foreground">{data.lastBatchRefresh}</span>
        </div>
      </div>
    </div>
  );
};

export default DataFreshnessCard;
