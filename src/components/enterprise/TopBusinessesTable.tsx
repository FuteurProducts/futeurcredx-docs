import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, TrendingUp, TrendingDown, ArrowRight, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  low: { text: "text-success", bg: "bg-success/10" },
  medium: { text: "text-warning", bg: "bg-warning/10" },
  high: { text: "text-warning", bg: "bg-warning/10" },
  critical: { text: "text-destructive", bg: "bg-destructive/10" },
};

export const TopBusinessesTable: React.FC<TopBusinessesTableProps> = ({
  businesses,
  title = "Top Active Businesses",
  onViewBusiness,
  onViewAll,
  className = "",
}) => {
  const [sortField, setSortField] = useState<string>("lumiqScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const RISK_ORDER: Record<string, number> = { low: 0, medium: 1, high: 2, critical: 3 };

  const sortedBusinesses = useMemo(() => {
    const sorted = [...businesses];
    sorted.sort((a, b) => {
      let comparison = 0;
      if (sortField === "riskLevel") {
        comparison = (RISK_ORDER[a.riskLevel] ?? 0) - (RISK_ORDER[b.riskLevel] ?? 0);
      } else {
        const fieldA = a[sortField as keyof BusinessRow];
        const fieldB = b[sortField as keyof BusinessRow];
        if (fieldA == null && fieldB == null) return 0;
        if (fieldA == null) return 1;
        if (fieldB == null) return -1;
        if (typeof fieldA === "number" && typeof fieldB === "number") {
          comparison = fieldA - fieldB;
        } else {
          comparison = String(fieldA).localeCompare(String(fieldB));
        }
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
    return sorted;
  }, [businesses, sortField, sortDirection]);

  const SortHeader = ({ field, label, align = "left" }: { field: string; label: string; align?: "left" | "center" | "right" }) => (
    <th className={`text-${align} text-xs font-medium text-muted-foreground uppercase tracking-wider pb-3 select-none`}>
      <button
        onClick={() => handleSort(field)}
        className={cn(
          "w-full flex items-center gap-1 transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded px-1 py-0.5",
          "hover:text-foreground",
          align === "center" ? "justify-center" : align === "right" ? "justify-end" : ""
        )}
      >
        <span>{label}</span>
        {sortField === field && (
          sortDirection === "asc"
            ? <ChevronUp className="h-3 w-3" />
            : <ChevronDown className="h-3 w-3" />
        )}
      </button>
    </th>
  );

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
              <SortHeader field="name" label="Business" align="left" />
              <SortHeader field="lumiqScore" label="Score" align="center" />
              <SortHeader field="apiCalls" label="Usage" align="center" />
              <SortHeader field="riskLevel" label="Risk" align="center" />
              <SortHeader field="lastActivity" label="Last Activity" align="right" />
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedBusinesses.map((business, index) => {
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
                        <TrendingUp className="h-3.5 w-3.5 text-success" />
                      )}
                      {business.scoreTrend === "down" && (
                        <TrendingDown className="h-3.5 w-3.5 text-destructive" />
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
