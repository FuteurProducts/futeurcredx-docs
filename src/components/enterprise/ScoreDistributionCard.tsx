import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ScoreDistributionData {
  totalScored: number;
  averageScore: number;
  medianScore: number;
  distribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  lastUpdated: string;
}

interface ScoreDistributionCardProps {
  data: ScoreDistributionData;
  className?: string;
}

const getBarColor = (range: string): string => {
  if (range.includes("800") || range.includes("750")) return "hsl(var(--success))";
  if (range.includes("700") || range.includes("650")) return "hsl(var(--success))";
  if (range.includes("600") || range.includes("550")) return "hsl(var(--warning))";
  if (range.includes("500") || range.includes("450")) return "hsl(var(--warning))";
  return "hsl(var(--destructive))";
};

export const ScoreDistributionCard: React.FC<ScoreDistributionCardProps> = ({
  data,
  className = "",
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
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
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-h6 font-semibold text-foreground">
              Portfolio Score Distribution
            </h3>
            <p className="text-body-2 text-muted-foreground">
              LUMIQ AI scores across {formatNumber(data.totalScored)} businesses
            </p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          Updated {data.lastUpdated}
        </span>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="text-caption text-muted-foreground mb-1">
            Total Scored
          </div>
          <div className="text-h5 font-bold text-foreground">
            {formatNumber(data.totalScored)}
          </div>
        </div>
        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="text-caption text-muted-foreground mb-1">
            Average Score
          </div>
          <div className="text-h5 font-bold text-foreground">
            {data.averageScore}
          </div>
        </div>
        <div className="p-3 bg-muted/50 rounded-xl">
          <div className="text-caption text-muted-foreground mb-1">
            Median Score
          </div>
          <div className="text-h5 font-bold text-foreground">
            {data.medianScore}
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.distribution}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="range"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) => formatNumber(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value, _name, props) => {
                const numVal = typeof value === "number" ? value : 0;
                const pct = props?.payload?.percentage ?? 0;
                return [`${formatNumber(numVal)} (${pct}%)`, "Businesses"];
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.range)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ScoreDistributionCard;
