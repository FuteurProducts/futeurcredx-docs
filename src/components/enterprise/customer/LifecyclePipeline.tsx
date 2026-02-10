import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  Award, 
  AlertTriangle,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface LifecycleStage {
  id: 'prospect' | 'new' | 'growing' | 'mature' | 'at-risk';
  label: string;
  count: number;
  avgRHS: number;
  avgRevenue: number;
  avgProductCount: number;
  trend: number;
}

interface LifecyclePipelineProps {
  stages: LifecycleStage[];
  onStageClick: (stageId: string) => void;
  totalClients: number;
}

const STAGE_CONFIG = {
  'prospect': { 
    icon: UserPlus, 
    color: 'hsl(var(--muted-foreground))',
    bgGradient: 'from-gray-500/10 to-gray-500/5',
  },
  'new': { 
    icon: Users, 
    color: 'hsl(var(--chart-1))',
    bgGradient: 'from-blue-500/10 to-blue-500/5',
  },
  'growing': { 
    icon: TrendingUp, 
    color: 'hsl(var(--chart-2))',
    bgGradient: 'from-emerald-500/10 to-emerald-500/5',
  },
  'mature': { 
    icon: Award, 
    color: 'hsl(var(--chart-3))',
    bgGradient: 'from-purple-500/10 to-purple-500/5',
  },
  'at-risk': { 
    icon: AlertTriangle, 
    color: 'hsl(var(--destructive))',
    bgGradient: 'from-red-500/10 to-red-500/5',
  },
};

export const LifecyclePipeline: React.FC<LifecyclePipelineProps> = ({
  stages,
  onStageClick,
  totalClients,
}) => {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Relationship Lifecycle</h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {totalClients.toLocaleString()} total clients
          </span>
        </div>
      </div>

      {/* Visual Pipeline */}
      <div className="p-5">
        <div className="flex items-stretch gap-1">
          {stages.map((stage, index) => {
            const config = STAGE_CONFIG[stage.id];
            const Icon = config.icon;
            

            return (
              <React.Fragment key={stage.id}>
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex-1 min-w-[80px] cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}
                  onClick={() => onStageClick(stage.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onStageClick(stage.id);
                    }
                  }}
                >
                  {/* Stage Bar */}
                  <div 
                    className={`relative h-16 rounded-lg bg-gradient-to-r ${config.bgGradient} border-2 transition-all group-hover:scale-105 overflow-hidden`}
                    style={{ borderColor: config.color }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="h-5 w-5 flex-shrink-0" style={{ color: config.color }} />
                    </div>
                  </div>

                  {/* Stage Label & Count */}
                  <div className="mt-2 text-center">
                    <p className="text-xs font-medium text-foreground">{stage.label}</p>
                    <p className="text-lg font-bold" style={{ color: config.color }}>
                      {stage.count.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {((stage.count / totalClients) * 100).toFixed(1)}%
                    </p>
                  </div>
                </motion.div>

                {/* Arrow Connector */}
                {index < stages.length - 1 && (
                  <div className="flex items-center justify-center w-6 h-16">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Stage Details Grid */}
      <div className="border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-border">
          {stages.map((stage) => {

            return (
              <div
                key={stage.id}
                className="p-4 hover:bg-muted/30 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                onClick={() => onStageClick(stage.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onStageClick(stage.id);
                  }
                }}
              >
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Avg RHS</p>
                    <p className="text-sm font-semibold text-foreground">{stage.avgRHS}/100</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Avg Revenue</p>
                    <p className="text-sm font-semibold text-foreground">{formatCurrency(stage.avgRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Avg Products</p>
                    <p className="text-sm font-semibold text-foreground">{stage.avgProductCount.toFixed(1)}</p>
                  </div>
                </div>

                {/* View Details Link */}
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View clients</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
