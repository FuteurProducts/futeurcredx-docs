import React from "react";
import { motion } from "framer-motion";

interface BureauSource {
  name: string;
  shortName: string;
  status: "connected" | "degraded" | "disconnected";
  coverage: number;
  lastSync: string;
  recordsAvailable: number;
  avgLatency: number;
}

interface MultiBureauStatusCardProps {
  bureaus: BureauSource[];
  totalRecords: number;
  overallCoverage: number;
  className?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "connected":
      return { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" };
    case "degraded":
      return { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" };
    case "disconnected":
      return { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" };
    default:
      return { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" };
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
};

export const MultiBureauStatusCard: React.FC<MultiBureauStatusCardProps> = ({
  bureaus,
  totalRecords,
  overallCoverage,
  className = "",
}) => {
  const connectedCount = bureaus.filter((b) => b.status === "connected").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-violet-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Multi-Bureau Integration
            </h3>
            <p className="text-sm text-muted-foreground">
              Credit data source connectivity
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-sm font-medium">
            {connectedCount}/{bureaus.length} Connected
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="text-xs text-muted-foreground mb-1">Total Records</div>
          <div className="text-xl font-bold text-foreground">
            {formatNumber(totalRecords)}
          </div>
        </div>
        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="text-xs text-muted-foreground mb-1">Data Coverage</div>
          <div className="text-xl font-bold text-foreground">
            {overallCoverage}%
          </div>
        </div>
      </div>

      {/* Bureau List */}
      <div className="space-y-3">
        {bureaus.map((bureau) => {
          const statusColors = getStatusColor(bureau.status);
          return (
            <div
              key={bureau.name}
              className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-card rounded-lg flex items-center justify-center font-semibold text-sm text-foreground border border-border">
                    {bureau.shortName}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{bureau.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Last sync: {bureau.lastSync}
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusColors.bg}`}>
                  <div className={`w-2 h-2 rounded-full ${statusColors.dot} animate-pulse`} />
                  <span className={`text-xs font-medium capitalize ${statusColors.text}`}>
                    {bureau.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Coverage</div>
                  <div className="font-medium text-foreground">{bureau.coverage}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Records</div>
                  <div className="font-medium text-foreground">
                    {formatNumber(bureau.recordsAvailable)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Latency</div>
                  <div className="font-medium text-foreground">{bureau.avgLatency}ms</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MultiBureauStatusCard;
