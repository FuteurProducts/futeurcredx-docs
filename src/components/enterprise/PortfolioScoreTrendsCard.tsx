import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface TrendDataPoint {
  date: string;
  avgScore: number;
  improved: number;
  declined: number;
  stable: number;
}

interface PortfolioScoreTrendsCardProps {
  data: TrendDataPoint[];
  summary: {
    totalImproved: number;
    totalDeclined: number;
    totalStable: number;
    avgChange: number;
    period: string;
  };
  className?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
};

export const PortfolioScoreTrendsCard: React.FC<PortfolioScoreTrendsCardProps> = ({
  data,
  summary,
  className = "",
}) => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-title text-foreground">
              Portfolio Score Trends
            </h3>
            <p className="text-sm text-muted-foreground">
              Aggregate score changes over {summary.period}
            </p>
          </div>
        </div>
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                timeRange === range
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-success/10 rounded-xl">
          <div className="flex items-center gap-1 text-xs text-success mb-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Improved
          </div>
          <div className="text-lg font-bold text-success">
            {formatNumber(summary.totalImproved)}
          </div>
        </div>
        <div className="p-3 bg-destructive/10 rounded-xl">
          <div className="flex items-center gap-1 text-xs text-destructive mb-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Declined
          </div>
          <div className="text-lg font-bold text-destructive">
            {formatNumber(summary.totalDeclined)}
          </div>
        </div>
        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="text-xs text-muted-foreground mb-1">Stable</div>
          <div className="text-lg font-bold text-foreground">
            {formatNumber(summary.totalStable)}
          </div>
        </div>
        <div className="p-3 bg-blue-500/10 rounded-xl">
          <div className="text-xs text-blue-600 mb-1">Avg Change</div>
          <div className={`text-lg font-bold ${summary.avgChange >= 0 ? "text-success" : "text-destructive"}`}>
            {summary.avgChange >= 0 ? "+" : ""}{summary.avgChange} pts
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="avgScoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              domain={["dataMin - 10", "dataMax + 10"]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => [typeof value === "number" ? value : 0, "Avg Score"]}
            />
            <Area
              type="monotone"
              dataKey="avgScore"
              stroke="#3b82f6"
              fill="url(#avgScoreGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PortfolioScoreTrendsCard;
