import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertTriangle, Target, ChevronRight, Zap, Shield, TrendingUp } from 'lucide-react';

// ============================================
// TYPES
// ============================================
export interface UnlockAction {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending' | 'blocked';
  impact: 'high' | 'medium' | 'low';
  estimatedDays?: number;
  category: 'identity' | 'banking' | 'credit' | 'compliance';
}

export interface ApprovalPathData {
  currentProduct?: string;
  targetProduct: string;
  approvalProbability: number;
  actions: UnlockAction[];
  estimatedUnlockDate?: string;
  blockers?: string[];
}

export interface ApprovalPathWidgetProps {
  data: ApprovalPathData;
  variant?: 'full' | 'compact' | 'list';
  showEstimates?: boolean;
  onActionClick?: (actionId: string) => void;
  className?: string;
}

// Category icons
const categoryIcons: Record<string, React.ReactNode> = {
  identity: <Shield className="w-4 h-4" />,
  banking: <TrendingUp className="w-4 h-4" />,
  credit: <Target className="w-4 h-4" />,
  compliance: <Check className="w-4 h-4" />,
};

// ============================================
// APPROVAL PATH WIDGET
// ============================================
export const ApprovalPathWidget: React.FC<ApprovalPathWidgetProps> = ({
  data,
  variant = 'full',
  showEstimates = true,
  onActionClick,
  className = '',
}) => {
  const completedActions = data.actions.filter(a => a.status === 'completed').length;
  const progressPercent = (completedActions / data.actions.length) * 100;

  const getStatusIcon = (status: UnlockAction['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-success" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-info animate-pulse" />;
      case 'blocked':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-border" />;
    }
  };

  const getStatusStyle = (status: UnlockAction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 border-success/20';
      case 'in_progress':
        return 'bg-info/10 border-info/20';
      case 'blocked':
        return 'bg-destructive/10 border-destructive/20';
      default:
        return 'bg-muted border-border';
    }
  };

  const getImpactBadge = (impact: UnlockAction['impact']) => {
    const styles = {
      high: 'bg-[var(--primary-04)]/10 text-[var(--primary-04)]',
      medium: 'bg-info/10 text-info',
      low: 'bg-accent text-muted-foreground',
    };
    return styles[impact];
  };

  if (variant === 'compact') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-card rounded-2xl p-5 shadow-sm border border-border ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Unlock Path</h3>
            <p className="text-xs text-muted-foreground">{data.targetProduct}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-foreground">{data.approvalProbability}%</span>
            <p className="text-xs text-muted-foreground">Approval odds</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{completedActions} of {data.actions.length} steps</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            />
          </div>
        </div>

        {/* Next action */}
        {data.actions.find(a => a.status === 'in_progress' || a.status === 'pending') && (
          <div className="bg-info/10 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-info" />
              <span className="text-sm font-medium text-foreground">
                {data.actions.find(a => a.status === 'in_progress')?.title || 
                 data.actions.find(a => a.status === 'pending')?.title}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </motion.div>
    );
  }

  if (variant === 'list') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-card rounded-2xl p-6 shadow-sm border border-border ${className}`}
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Actions to Unlock {data.targetProduct}</h3>
        
        <div className="space-y-2">
          {data.actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onActionClick?.(action.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${getStatusStyle(action.status)}`}
            >
              {getStatusIcon(action.status)}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{action.title}</p>
                {action.estimatedDays && action.status !== 'completed' && (
                  <p className="text-xs text-muted-foreground">~{action.estimatedDays} days</p>
                )}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getImpactBadge(action.impact)}`}>
                {action.impact}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Full variant
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card rounded-2xl p-6 shadow-sm border border-border ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--primary-04)]" />
            <h3 className="text-lg font-semibold text-foreground">Unlock Path</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {data.currentProduct ? `${data.currentProduct} → ` : ''}{data.targetProduct}
          </p>
        </div>
        
        {/* Approval probability gauge */}
        <div className="text-center">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="35"
                stroke="hsl(var(--border))"
                strokeWidth="6"
                fill="none"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="35"
                stroke="url(#gradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 220" }}
                animate={{ strokeDasharray: `${(data.approvalProbability / 100) * 220} 220` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--primary-01)" />
                  <stop offset="100%" stopColor="var(--primary-04)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-foreground">{data.approvalProbability}%</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Approval odds</p>
        </div>
      </div>

      {/* Progress summary */}
      <div className="bg-muted rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm font-semibold text-foreground">{completedActions}/{data.actions.length} steps</span>
        </div>
        <div className="h-3 bg-accent rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full"
          />
        </div>
        {showEstimates && data.estimatedUnlockDate && (
          <p className="text-xs text-muted-foreground mt-2">
            Estimated unlock: <span className="font-medium text-foreground">{data.estimatedUnlockDate}</span>
          </p>
        )}
      </div>

      {/* Actions list */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground mb-2">Required Actions</h4>
        {data.actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onActionClick?.(action.id)}
            className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${getStatusStyle(action.status)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getStatusIcon(action.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">{action.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getImpactBadge(action.impact)}`}>
                    {action.impact} impact
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{action.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {categoryIcons[action.category]}
                    {action.category}
                  </span>
                  {action.estimatedDays && action.status !== 'completed' && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      ~{action.estimatedDays} days
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Blockers */}
      {data.blockers && data.blockers.length > 0 && (
        <div className="mt-6 p-4 bg-destructive/10 rounded-xl border border-destructive/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm font-semibold text-destructive">Blockers</span>
          </div>
          <ul className="space-y-1">
            {data.blockers.map((blocker, i) => (
              <li key={i} className="text-sm text-destructive flex items-center gap-2">
                <span className="w-1 h-1 bg-destructive rounded-full" />
                {blocker}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default ApprovalPathWidget;
