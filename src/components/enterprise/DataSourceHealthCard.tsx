import React from "react";
import { motion } from "framer-motion";

interface DataSource {
  name: string;
  type: "bureau" | "banking" | "registry" | "identity";
  recordsCovered: number;
  freshness: "fresh" | "stale" | "critical";
  lastUpdate: string;
  coverage: number;
}

interface DataSourceHealthCardProps {
  sources: DataSource[];
  overallHealth: number;
  totalRecords: number;
  onRefreshSource?: (sourceName: string) => void;
  className?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
};

const getFreshnessColors = (freshness: string) => {
  switch (freshness) {
    case "fresh":
      return { bg: "bg-emerald-500/10", text: "text-emerald-600", label: "Fresh" };
    case "stale":
      return { bg: "bg-amber-500/10", text: "text-amber-600", label: "Stale" };
    case "critical":
      return { bg: "bg-red-500/10", text: "text-red-600", label: "Critical" };
    default:
      return { bg: "bg-muted", text: "text-muted-foreground", label: "Unknown" };
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "bureau":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case "banking":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case "registry":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case "identity":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      );
    default:
      return null;
  }
};

export const DataSourceHealthCard: React.FC<DataSourceHealthCardProps> = ({
  sources,
  overallHealth,
  totalRecords,
  onRefreshSource,
  className = "",
}) => {
  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-emerald-600";
    if (health >= 70) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-cyan-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Data Source Health
            </h3>
            <p className="text-sm text-muted-foreground">
              {sources.length} active sources
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Overall Health</div>
          <div className={`text-2xl font-bold ${getHealthColor(overallHealth)}`}>
            {overallHealth}%
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="text-xs text-muted-foreground mb-1">Total Records</div>
          <div className="text-xl font-bold text-foreground">
            {formatNumber(totalRecords)}
          </div>
        </div>
        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="text-xs text-muted-foreground mb-1">Active Sources</div>
          <div className="text-xl font-bold text-foreground">{sources.length}</div>
        </div>
      </div>

      {/* Sources List */}
      <div className="space-y-3 max-h-[280px] overflow-y-auto">
        {sources.map((source) => {
          const freshnessColors = getFreshnessColors(source.freshness);
          return (
            <div
              key={source.name}
              className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-card rounded-lg flex items-center justify-center border border-border">
                    {getTypeIcon(source.type)}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{source.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {source.type} • {source.lastUpdate}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${freshnessColors.bg} ${freshnessColors.text}`}
                  >
                    {freshnessColors.label}
                  </span>
                  {source.freshness !== "fresh" && onRefreshSource && (
                    <button
                      onClick={() => onRefreshSource(source.name)}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Records</div>
                  <div className="font-medium text-foreground">
                    {formatNumber(source.recordsCovered)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Coverage</div>
                  <div className="font-medium text-foreground">{source.coverage}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DataSourceHealthCard;
