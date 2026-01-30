import React from "react";
import { motion } from "framer-motion";
import { Building2, TrendingUp, TrendingDown, ArrowRight, Eye } from "lucide-react";

interface BusinessRow {
  id: string;
  name: string;
  industry: string;
  lumiqScore: number;
  scoreTrend: "up" | "down" | "stable";
  trendValue: number;
  apiCalls: number;
  lastActivity: string;
  riskLevel: "low" | "medium" | "high" | "critical";
}

interface TopBusinessesTableProps {
  businesses: BusinessRow[];
  title?: string;
  onViewBusiness?: (businessId: string) => void;
  onViewAll?: () => void;
  className?: string;
}

const riskColors: Record<string, { text: string; bg: string }> = {
  low: { text: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  medium: { text: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
  high: { text: "text-orange-700 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30" },
  critical: { text: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
};

export const TopBusinessesTable: React.FC<TopBusinessesTableProps> = ({
  businesses,
  title = "Top Active Businesses",
  onViewBusiness,
  onViewAll,
  className = "",
}) => {
  return (
    <div className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider pb-3">
                Business
              </th>
              <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider pb-3">
                Score
              </th>
              <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider pb-3">
                API Calls
              </th>
              <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider pb-3">
                Risk
              </th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider pb-3">
                Last Activity
              </th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {businesses.map((business, index) => {
              const risk = riskColors[business.riskLevel];
              
              return (
                <motion.tr
                  key={business.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3">
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {business.name}
                      </span>
                      <span className="text-xs text-muted-foreground block">
                        {business.industry}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm font-semibold text-foreground">
                        {business.lumiqScore}
                      </span>
                      {business.scoreTrend === "up" && (
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                      )}
                      {business.scoreTrend === "down" && (
                        <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <span className="text-sm text-muted-foreground">
                      {business.apiCalls.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${risk.text} ${risk.bg}`}>
                      {business.riskLevel.charAt(0).toUpperCase() + business.riskLevel.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-xs text-muted-foreground">
                      {business.lastActivity}
                    </span>
                  </td>
                  <td className="py-3">
                    {onViewBusiness && (
                      <button
                        onClick={() => onViewBusiness(business.id)}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopBusinessesTable;
