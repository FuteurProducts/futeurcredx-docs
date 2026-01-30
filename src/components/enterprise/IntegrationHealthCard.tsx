import React from "react";
import { motion } from "framer-motion";
import { Server, CheckCircle2, AlertCircle, Clock, RefreshCw } from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "outage" | "maintenance";
  latency?: number;
  uptime: number;
  lastCheck: string;
}

interface IntegrationHealthCardProps {
  services: ServiceStatus[];
  overallUptime: number;
  onRefresh?: () => void;
  className?: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  operational: { 
    label: "Operational", 
    color: "text-emerald-600", 
    bg: "bg-emerald-500",
    icon: <CheckCircle2 className="h-4 w-4" />
  },
  degraded: { 
    label: "Degraded", 
    color: "text-amber-600", 
    bg: "bg-amber-500",
    icon: <AlertCircle className="h-4 w-4" />
  },
  outage: { 
    label: "Outage", 
    color: "text-red-600", 
    bg: "bg-red-500",
    icon: <AlertCircle className="h-4 w-4" />
  },
  maintenance: { 
    label: "Maintenance", 
    color: "text-blue-600", 
    bg: "bg-blue-500",
    icon: <Clock className="h-4 w-4" />
  },
};

export const IntegrationHealthCard: React.FC<IntegrationHealthCardProps> = ({
  services,
  overallUptime,
  onRefresh,
  className = "",
}) => {
  const operationalCount = services.filter(s => s.status === "operational").length;

  return (
    <div className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl">
            <Server className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">System Status</h3>
            <p className="text-xs text-muted-foreground">
              {operationalCount}/{services.length} services operational
            </p>
          </div>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Overall Uptime */}
      <div className="mb-6 p-4 bg-muted/50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">30-day Uptime</span>
          <span className={`text-xl font-bold ${
            overallUptime >= 99.9 ? "text-emerald-600" :
            overallUptime >= 99 ? "text-amber-600" : "text-red-600"
          }`}>
            {overallUptime.toFixed(2)}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallUptime}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${
              overallUptime >= 99.9 ? "bg-emerald-500" :
              overallUptime >= 99 ? "bg-amber-500" : "bg-red-500"
            }`}
          />
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {services.map((service, index) => {
          const config = statusConfig[service.status];
          
          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${config.bg}`} />
                <span className="text-sm font-medium text-foreground">{service.name}</span>
              </div>
              
              <div className="flex items-center gap-4">
                {service.latency && (
                  <span className="text-xs text-muted-foreground">
                    {service.latency}ms
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {service.uptime}%
                </span>
                <span className={`text-xs font-medium ${config.color}`}>
                  {config.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default IntegrationHealthCard;
