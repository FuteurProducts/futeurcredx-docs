import React from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  AlertCircle, 
  Link2, 
  Link2Off, 
  RefreshCw, 
  ShieldAlert,
  ArrowRight,
  Clock
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "connection" | "disconnection" | "refresh" | "alert" | "success" | "error";
  title: string;
  description: string;
  businessId?: string;
  businessName?: string;
  timestamp: string;
  metadata?: Record<string, string | number>;
}

interface RecentActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
  onViewAll?: () => void;
  className?: string;
}

const activityIcons: Record<string, { icon: React.ReactNode; bgColor: string }> = {
  connection: {
    icon: <Link2 className="h-4 w-4 text-success" />,
    bgColor: "bg-success/10"
  },
  disconnection: {
    icon: <Link2Off className="h-4 w-4 text-destructive" />,
    bgColor: "bg-destructive/10"
  },
  refresh: {
    icon: <RefreshCw className="h-4 w-4 text-info" />,
    bgColor: "bg-info/10"
  },
  alert: {
    icon: <ShieldAlert className="h-4 w-4 text-warning" />,
    bgColor: "bg-warning/10"
  },
  success: {
    icon: <CheckCircle2 className="h-4 w-4 text-success" />,
    bgColor: "bg-success/10"
  },
  error: {
    icon: <AlertCircle className="h-4 w-4 text-destructive" />,
    bgColor: "bg-destructive/10"
  },
};

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  activities,
  maxItems = 5,
  onViewAll,
  className = "",
}) => {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-h6 font-semibold text-foreground">Recent Activity</h3>
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

      <div className="space-y-4">
        {displayedActivities.map((activity, index) => {
          const iconConfig = activityIcons[activity.type];
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className={`p-2 rounded-lg ${iconConfig.bgColor} flex-shrink-0`}>
                {iconConfig.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-body-2 font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <p className="text-caption text-muted-foreground mt-0.5">
                      {activity.description}
                    </p>
                    {activity.businessName && (
                      <p className="text-xs text-primary mt-1">
                        {activity.businessName}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-body-2 text-muted-foreground">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivityFeed;
