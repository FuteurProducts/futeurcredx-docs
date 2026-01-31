import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  TrendingUp, 
  CreditCard,
  Building2,
  
  Calendar,
  FileText,
  ChevronRight,
  CheckCircle,
  Clock,
  User,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'loc-increase' | 'pre-qualify' | 'merchant-migration' | 'quarterly-review' | 'insights-report';
  title: string;
  description: string;
  rationale: string[];
  confidenceScore: number;
  riskAdjustedConfidence: number;
  estimatedRevenueImpact: number;
  priority: 'high' | 'medium' | 'low';
  expiresIn?: string;
}

interface NextBestActionsProps {
  recommendations: Recommendation[];
  onAssignTask: (recommendation: Recommendation, assignee: string) => void;
  onDismiss: (recommendationId: string) => void;
}

const TYPE_CONFIG = {
  'loc-increase': { 
    icon: TrendingUp, 
    color: 'hsl(var(--chart-2))',
    label: 'Line Increase'
  },
  'pre-qualify': { 
    icon: CreditCard, 
    color: 'hsl(var(--chart-1))',
    label: 'Pre-Qualification'
  },
  'merchant-migration': { 
    icon: Building2, 
    color: 'hsl(var(--chart-3))',
    label: 'Merchant Services'
  },
  'quarterly-review': { 
    icon: Calendar, 
    color: 'hsl(var(--chart-4))',
    label: 'Review Scheduled'
  },
  'insights-report': { 
    icon: FileText, 
    color: 'hsl(var(--primary))',
    label: 'Insights Report'
  },
};

const PRIORITY_CONFIG = {
  'high': { bg: 'bg-destructive/10', text: 'text-destructive', label: 'High Priority' },
  'medium': { bg: 'bg-warning/10', text: 'text-warning', label: 'Medium' },
  'low': { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Low' },
};

export const NextBestActions: React.FC<NextBestActionsProps> = ({
  recommendations,
  onAssignTask,
  onDismiss,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const RecommendationCard = ({ rec, index }: { rec: Recommendation; index: number }) => {
    const typeConfig = TYPE_CONFIG[rec.type];
    const priorityConfig = PRIORITY_CONFIG[rec.priority];
    const TypeIcon = typeConfig.icon;
    const isExpanded = expandedId === rec.id;
    const isAssigning = assigningId === rec.id;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div
          className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => setExpandedId(isExpanded ? null : rec.id)}
        >
          <div className="flex items-start gap-3">
            <div
              className="p-2.5 rounded-lg shrink-0"
              style={{ backgroundColor: `${typeConfig.color}15` }}
            >
              <TypeIcon className="h-5 w-5" style={{ color: typeConfig.color }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityConfig.bg} ${priorityConfig.text}`}>
                  {priorityConfig.label}
                </span>
                {rec.expiresIn && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {rec.expiresIn}
                  </span>
                )}
              </div>
              
              <h4 className="text-sm font-semibold text-foreground mb-1">
                {rec.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {rec.description}
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-lg font-bold text-success">
                +{formatCurrency(rec.estimatedRevenueImpact)}
              </div>
              <div className="text-xs text-muted-foreground">est. revenue</div>
            </div>

            <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border"
            >
              <div className="p-4 space-y-4">
                {/* Rationale */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Rationale</p>
                  <ul className="space-y-1.5">
                    {rec.rationale.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Confidence Scores */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">AI Confidence</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-foreground">{rec.confidenceScore}%</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${rec.confidenceScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <span className="text-xs text-muted-foreground">Risk-Adjusted</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-foreground">{rec.riskAdjustedConfidence}%</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-warning rounded-full"
                        style={{ width: `${rec.riskAdjustedConfidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!isAssigning ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAssigningId(rec.id)}
                      className="flex-1 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Assign Task
                    </button>
                    <button
                      onClick={() => onDismiss(rec.id)}
                      className="px-4 py-2.5 border border-border text-sm font-medium rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    >
                      Dismiss
                    </button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <p className="text-xs font-medium text-muted-foreground">Assign to:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Credit Review', 'Relationship Manager', 'Sales Team', 'Self'].map((assignee) => (
                        <button
                          key={assignee}
                          onClick={() => {
                            onAssignTask(rec, assignee);
                            setAssigningId(null);
                          }}
                          className="px-3 py-2 text-sm font-medium bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                        >
                          {assignee}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setAssigningId(null)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-warning" />
          <h3 className="text-sm font-semibold text-foreground">Next Best Actions</h3>
          <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
            {recommendations.length} active
          </span>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <RecommendationCard key={rec.id} rec={rec} index={index} />
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-8">
          <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No recommendations at this time</p>
        </div>
      )}
    </motion.div>
  );
};
