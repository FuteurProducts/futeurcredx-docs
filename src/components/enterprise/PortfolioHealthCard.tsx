import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ShieldCheck } from "lucide-react";

interface RiskSegment {
  name: string;
  count: number;
  percentage: number;
  color: string;
  [key: string]: string | number;
}

interface PortfolioHealthData {
  totalAssessed: number;
  segments: RiskSegment[];
  averageScore: number;
  lastUpdated: string;
}

interface PortfolioHealthCardProps {
  data: PortfolioHealthData;
  className?: string;
}

export const PortfolioHealthCard: React.FC<PortfolioHealthCardProps> = ({
  data,
  className = "",
}) => {
  return (
    <div className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-success/10 rounded-xl">
            <ShieldCheck className="h-5 w-5 text-success" />
          </div>
          <h3 className="text-h6 font-semibold text-foreground">Portfolio Health</h3>
        </div>
        <span className="text-xs text-muted-foreground">Updated {data.lastUpdated}</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Pie Chart */}
        <div className="w-32 h-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.segments}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                paddingAngle={2}
                dataKey="count"
              >
                {data.segments.map((segment, index) => (
                  <Cell key={`cell-${index}`} fill={segment.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                        <p className="text-xs font-medium text-foreground">{data.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {data.count.toLocaleString()} ({data.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {data.segments.map((segment, index) => (
            <motion.div
              key={segment.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-body-2 text-muted-foreground">{segment.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-body-2 font-medium text-foreground">
                  {segment.count.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({segment.percentage}%)
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Average Score Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-body-2 text-muted-foreground">Avg. LumiqAI Score</span>
          <div className="flex items-center gap-2">
            <span className="text-h5 font-bold text-foreground">{data.averageScore}</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioHealthCard;
