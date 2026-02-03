import React from "react";
import { motion } from "framer-motion";
import { Building2, TrendingUp, TrendingDown, Users, LinkIcon, AlertCircle } from "lucide-react";

interface ConnectedBusinessesData {
  totalBusinesses: number;
  activeConnections: number;
  newThisMonth: number;
  monthlyGrowth: number;
  disconnectedCount: number;
  pendingReconnect: number;
}

interface ConnectedBusinessesCardProps {
  data: ConnectedBusinessesData;
  className?: string;
}

export const ConnectedBusinessesCard: React.FC<ConnectedBusinessesCardProps> = ({
  data,
  className = "",
}) => {
  const isPositiveGrowth = data.monthlyGrowth >= 0;

  return (
    <div className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-h6 font-semibold text-foreground">Connected Businesses</h3>
        </div>
        <span className="text-xs text-muted-foreground">Real-time</span>
      </div>

      {/* Main Metric */}
      <div className="mb-6">
        <div className="flex items-end gap-3">
          <span className="text-4xl font-bold text-foreground">
            {data.totalBusinesses.toLocaleString()}
          </span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isPositiveGrowth
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive"
          }`}>
            {isPositiveGrowth ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{Math.abs(data.monthlyGrowth)}%</span>
          </div>
        </div>
        <p className="text-body-2 text-muted-foreground mt-1">SMB accounts connected via API</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-muted/50 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Active</span>
          </div>
          <span className="text-h5 font-semibold text-foreground">
            {data.activeConnections.toLocaleString()}
          </span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-muted/50 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-success" />
            <span className="text-caption text-muted-foreground">New MTD</span>
          </div>
          <span className="text-h5 font-semibold text-foreground">
            +{data.newThisMonth.toLocaleString()}
          </span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-muted/50 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            <span className="text-caption text-muted-foreground">Disconnected</span>
          </div>
          <span className="text-h5 font-semibold text-foreground">
            {data.disconnectedCount.toLocaleString()}
          </span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-muted/50 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon className="h-4 w-4 text-warning" />
            <span className="text-caption text-muted-foreground">Pending</span>
          </div>
          <span className="text-h5 font-semibold text-foreground">
            {data.pendingReconnect.toLocaleString()}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default ConnectedBusinessesCard;
