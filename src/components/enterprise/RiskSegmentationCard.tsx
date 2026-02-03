import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface RiskSegment {
  name: string;
  count: number;
  percentage: number;
  color: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
}

interface RiskSegmentationCardProps {
  segments: RiskSegment[];
  totalBusinesses: number;
  riskScore: number;
  className?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return (
        <svg className="w-3 h-3 text-destructive" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    case "down":
      return (
        <svg className="w-3 h-3 text-success" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    default:
      return (
        <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      );
  }
};

export const RiskSegmentationCard: React.FC<RiskSegmentationCardProps> = ({
  segments,
  totalBusinesses,
  riskScore,
  className = "",
}) => {
  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
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
          <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-warning"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-title text-foreground">
              Risk Segmentation
            </h3>
            <p className="text-body-2 text-muted-foreground">
              Portfolio risk distribution
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-caption text-muted-foreground">Portfolio Risk Score</div>
          <div className={`text-h4 font-bold ${getRiskScoreColor(riskScore)}`}>
            {riskScore}
          </div>
        </div>
      </div>

      {/* Chart + Legend */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segments.map((s) => ({ ...s }))}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="count"
              >
                {segments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
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
                  const name = props?.payload?.name ?? "";
                  return [`${formatNumber(numVal)} (${pct}%)`, name];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {segments.map((segment) => (
            <div key={segment.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-body-2 text-foreground">{segment.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-body-2 font-medium text-foreground">
                  {formatNumber(segment.count)}
                </span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(segment.trend)}
                  <span
                    className={`text-xs ${
                      segment.trend === "up"
                        ? "text-destructive"
                        : segment.trend === "down"
                        ? "text-success"
                        : "text-muted-foreground"
                    }`}
                  >
                    {segment.trendValue}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-body-2 text-muted-foreground">Total Assessed</span>
        <span className="text-h6 font-bold text-foreground">
          {formatNumber(totalBusinesses)}
        </span>
      </div>
    </motion.div>
  );
};

export default RiskSegmentationCard;
