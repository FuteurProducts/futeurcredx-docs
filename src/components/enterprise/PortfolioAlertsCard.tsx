import React, { useState } from "react";
import { motion } from "framer-motion";

interface AlertRule {
  id: string;
  name: string;
  description: string;
  type: "score_drop" | "score_improve" | "risk_change" | "data_stale";
  threshold: number;
  enabled: boolean;
  triggered24h: number;
}

interface AlertEvent {
  id: string;
  ruleName: string;
  businessCount: number;
  severity: "info" | "warning" | "critical";
  timestamp: string;
  message: string;
}

interface PortfolioAlertsCardProps {
  rules: AlertRule[];
  recentAlerts: AlertEvent[];
  onToggleRule?: (ruleId: string, enabled: boolean) => void;
  className?: string;
}

const getSeverityColors = (severity: string) => {
  switch (severity) {
    case "critical":
      return { bg: "bg-destructive/10", text: "text-destructive", dot: "bg-destructive" };
    case "warning":
      return { bg: "bg-warning/10", text: "text-warning", dot: "bg-warning" };
    default:
      return { bg: "bg-info/10", text: "text-info", dot: "bg-info" };
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "score_drop":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    case "score_improve":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    case "risk_change":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

export const PortfolioAlertsCard: React.FC<PortfolioAlertsCardProps> = ({
  rules,
  recentAlerts,
  onToggleRule,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<"rules" | "history">("rules");
  const activeRulesCount = rules.filter((r) => r.enabled).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-destructive"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-h6 font-semibold text-foreground">
              Portfolio Alerts
            </h3>
            <p className="text-body-2 text-muted-foreground">
              Monitor score & risk changes at scale
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-success/10 text-success rounded-full text-body-2 font-medium">
          {activeRulesCount} Active Rules
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-6">
        <button
          onClick={() => setActiveTab("rules")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "rules"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Alert Rules
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "history"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Recent Alerts
        </button>
      </div>

      {/* Rules Tab */}
      {activeTab === "rules" && (
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No alert rules configured
            </div>
          ) : (
            rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <button
                  onClick={() => onToggleRule?.(rule.id, !rule.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    rule.enabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                      rule.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <div className="w-9 h-9 bg-card rounded-lg flex items-center justify-center border border-border">
                  {getTypeIcon(rule.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">{rule.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {rule.description}
                  </div>
                </div>
                {rule.triggered24h > 0 && (
                  <span className="px-2 py-1 bg-warning/10 text-warning rounded text-xs font-medium">
                    {rule.triggered24h} triggered
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {recentAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent alerts
            </div>
          ) : (
            recentAlerts.map((alert) => {
              const colors = getSeverityColors(alert.severity);
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl ${colors.bg}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                      <span className={`text-sm font-medium ${colors.text}`}>
                        {alert.ruleName}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-body-2 text-foreground">{alert.message}</p>
                  <div className="mt-2 text-caption text-muted-foreground">
                    Affected: {alert.businessCount.toLocaleString()} businesses
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </motion.div>
  );
};

export default PortfolioAlertsCard;
