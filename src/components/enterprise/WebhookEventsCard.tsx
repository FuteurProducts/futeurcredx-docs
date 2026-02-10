import React from "react";
import { motion } from "framer-motion";
import { Webhook, CheckCircle2, XCircle, Clock, ArrowRight, Send } from "lucide-react";

interface WebhookEvent {
  id: string;
  eventType: string;
  status: "delivered" | "failed" | "pending" | "retrying";
  endpoint: string;
  timestamp: string;
  responseTime?: number;
  retryCount?: number;
}

interface WebhookStats {
  totalSent: number;
  deliveryRate: number;
  avgResponseTime: number;
  failedCount: number;
}

interface WebhookEventsCardProps {
  events: WebhookEvent[];
  stats: WebhookStats;
  maxEvents?: number;
  onViewLogs?: () => void;
  className?: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  delivered: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "text-success",
    bg: "bg-success/10"
  },
  failed: {
    icon: <XCircle className="h-4 w-4" />,
    color: "text-destructive",
    bg: "bg-destructive/10"
  },
  pending: {
    icon: <Clock className="h-4 w-4" />,
    color: "text-warning",
    bg: "bg-warning/10"
  },
  retrying: {
    icon: <Send className="h-4 w-4" />,
    color: "text-info",
    bg: "bg-info/10"
  },
};

export const WebhookEventsCard: React.FC<WebhookEventsCardProps> = ({
  events,
  stats,
  maxEvents = 4,
  onViewLogs,
  className = "",
}) => {
  const displayedEvents = events.slice(0, maxEvents);

  return (
    <div className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
            <Webhook className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-h6 font-semibold text-foreground">Webhook Events</h3>
        </div>
        {onViewLogs && (
          <button
            onClick={onViewLogs}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View logs
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
        <div className="text-center p-2 bg-muted/50 rounded-lg">
          <span className="text-h6 font-semibold text-foreground block">
            {stats.totalSent.toLocaleString()}
          </span>
          <span className="text-caption text-muted-foreground">Sent</span>
        </div>
        <div className="text-center p-2 bg-muted/50 rounded-lg">
          <span className="text-h6 font-semibold text-success block">
            {stats.deliveryRate}%
          </span>
          <span className="text-caption text-muted-foreground">Delivered</span>
        </div>
        <div className="text-center p-2 bg-muted/50 rounded-lg">
          <span className="text-h6 font-semibold text-foreground block">
            {stats.avgResponseTime}ms
          </span>
          <span className="text-caption text-muted-foreground">Avg Time</span>
        </div>
        <div className="text-center p-2 bg-muted/50 rounded-lg">
          <span className="text-h6 font-semibold text-destructive block">
            {stats.failedCount}
          </span>
          <span className="text-caption text-muted-foreground">Failed</span>
        </div>
      </div>

      {/* Recent Events */}
      <div className="space-y-3">
        {displayedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No webhook events available</p>
          </div>
        ) : (
          displayedEvents.map((event, index) => {
            const config = statusConfig[event.status];

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
              >
                <div className={`p-1.5 rounded ${config.bg} ${config.color}`}>
                  {config.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {event.eventType}
                    </span>
                    {event.retryCount && event.retryCount > 0 && (
                      <span className="text-xs px-1.5 py-0.5 bg-warning/10 text-warning rounded">
                        Retry #{event.retryCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {event.endpoint}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs text-muted-foreground block">
                    {event.timestamp}
                  </span>
                  {event.responseTime && (
                    <span className="text-xs text-muted-foreground">
                      {event.responseTime}ms
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WebhookEventsCard;
