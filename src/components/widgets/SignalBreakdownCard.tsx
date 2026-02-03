import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, Building, Users, Shield, TrendingUp, 
  AlertCircle, CheckCircle, Info, ChevronDown 
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
export interface SignalFactor {
  id: string;
  name: string;
  score: number;
  maxScore?: number;
  status: 'strong' | 'good' | 'fair' | 'weak' | 'missing';
  category: 'tradelines' | 'payments' | 'banking' | 'identity' | 'registry';
  description?: string;
  isSubstituted?: boolean;
  substitutedFrom?: string;
  details?: string[];
}

export interface SignalBreakdownData {
  overallScore: number;
  overallGrade: string;
  factors: SignalFactor[];
  substitutions?: { from: string; to: string }[];
  lastUpdated: string;
}

export interface SignalBreakdownCardProps {
  data: SignalBreakdownData;
  variant?: 'full' | 'compact' | 'minimal';
  showDetails?: boolean;
  expandable?: boolean;
  className?: string;
}

// Category icons
const categoryIcons: Record<string, React.ReactNode> = {
  tradelines: <CreditCard className="w-4 h-4" />,
  payments: <TrendingUp className="w-4 h-4" />,
  banking: <Building className="w-4 h-4" />,
  identity: <Users className="w-4 h-4" />,
  registry: <Shield className="w-4 h-4" />,
};

// ============================================
// SIGNAL BREAKDOWN CARD
// ============================================
export const SignalBreakdownCard: React.FC<SignalBreakdownCardProps> = ({
  data,
  variant = 'full',
  showDetails = true,
  expandable = false,
  className = '',
}) => {
  const [expandedFactors, setExpandedFactors] = React.useState<Set<string>>(new Set());

  const toggleFactor = (factorId: string) => {
    setExpandedFactors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(factorId)) {
        newSet.delete(factorId);
      } else {
        newSet.add(factorId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: SignalFactor['status']) => {
    switch (status) {
      case 'strong': return { bg: 'var(--primary-02)', text: 'var(--primary-02)', light: 'hsl(var(--success) / 0.15)' };
      case 'good': return { bg: 'var(--primary-04)', text: 'var(--primary-04)', light: 'hsl(var(--primary) / 0.15)' };
      case 'fair': return { bg: 'var(--primary-05)', text: 'var(--primary-05)', light: 'hsl(var(--warning) / 0.15)' };
      case 'weak': return { bg: 'var(--primary-03)', text: 'var(--primary-03)', light: 'hsl(var(--destructive) / 0.15)' };
      case 'missing': return { bg: 'var(--shade-06)', text: 'var(--shade-05)', light: 'var(--shade-09)' };
    }
  };

  const getScoreBarWidth = (score: number, maxScore: number = 100) => {
    return Math.min(100, (score / maxScore) * 100);
  };

  if (variant === 'minimal') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-card rounded-xl p-4 shadow-sm border border-border ${className}`}
      >
        <div className="grid grid-cols-5 gap-2">
          {data.factors.slice(0, 5).map(factor => {
            const colors = getStatusColor(factor.status);
            return (
              <div key={factor.id} className="text-center">
                <div 
                  className="w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-1"
                  style={{ backgroundColor: colors.light }}
                >
                  <span className="text-sm font-bold" style={{ color: colors.text }}>
                    {factor.score}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{factor.name}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-card rounded-2xl p-5 shadow-sm border border-border ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Factor Subscores</h3>
          <span className="text-xs text-muted-foreground">{data.factors.length} signals</span>
        </div>

        <div className="space-y-3">
          {data.factors.map(factor => {
            const colors = getStatusColor(factor.status);
            return (
              <div key={factor.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{categoryIcons[factor.category]}</span>
                    <span className="text-sm font-medium text-foreground">{factor.name}</span>
                    {factor.isSubstituted && (
                      <span className="text-xs bg-warning/10 text-warning px-1.5 py-0.5 rounded">
                        Substituted
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: colors.text }}>
                    {factor.score}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getScoreBarWidth(factor.score, factor.maxScore)}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors.bg }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Full variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card rounded-2xl p-6 shadow-lg border border-border ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Signal Breakdown</h3>
            <p className="text-sm text-muted-foreground">Factor analysis for credit decision</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-foreground">{data.overallScore}</div>
          <span className={`text-sm font-semibold px-2 py-0.5 rounded ${
            data.overallGrade.startsWith('A') ? 'bg-success/10 text-success' :
            data.overallGrade.startsWith('B') ? 'bg-[var(--primary-04)]/10 text-[var(--primary-04)]' :
            data.overallGrade.startsWith('C') ? 'bg-warning/10 text-warning' :
            'bg-destructive/10 text-destructive'
          }`}>
            {data.overallGrade}
          </span>
        </div>
      </div>

      {/* Factors */}
      <div className="space-y-4">
        {data.factors.map((factor, index) => {
          const colors = getStatusColor(factor.status);
          const isExpanded = expandedFactors.has(factor.id);
          
          return (
            <motion.div
              key={factor.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-border rounded-xl overflow-hidden"
            >
              <div 
                className={`p-4 ${expandable ? 'cursor-pointer hover:bg-accent' : ''}`}
                onClick={() => expandable && toggleFactor(factor.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: colors.light }}
                    >
                      <span style={{ color: colors.text }}>{categoryIcons[factor.category]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{factor.name}</span>
                        {factor.isSubstituted && (
                          <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            Substituted
                          </span>
                        )}
                      </div>
                      {factor.description && (
                        <p className="text-xs text-muted-foreground">{factor.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xl font-bold" style={{ color: colors.text }}>
                        {factor.score}
                      </span>
                      {factor.maxScore && (
                        <span className="text-sm text-muted-foreground">/{factor.maxScore}</span>
                      )}
                    </div>
                    {factor.status === 'strong' && <CheckCircle className="w-5 h-5 text-success" />}
                    {factor.status === 'weak' && <AlertCircle className="w-5 h-5 text-destructive" />}
                    {expandable && (
                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getScoreBarWidth(factor.score, factor.maxScore)}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors.bg }}
                  />
                </div>
              </div>
              
              {/* Expanded details */}
              {expandable && isExpanded && showDetails && factor.details && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border bg-accent p-4"
                >
                  <ul className="space-y-2">
                    {factor.details.map((detail, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  {factor.isSubstituted && factor.substitutedFrom && (
                    <p className="text-xs text-warning mt-3 p-2 bg-warning/10 rounded-lg">
                      <Info className="w-3 h-3 inline mr-1" />
                      Original data "{factor.substitutedFrom}" was unavailable
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Substitutions notice */}
      {data.substitutions && data.substitutions.length > 0 && (
        <div className="mt-6 p-4 bg-warning/10 rounded-xl border border-warning/20">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold text-warning">Signal Substitutions</span>
          </div>
          <div className="space-y-1">
            {data.substitutions.map((sub, i) => (
              <p key={i} className="text-sm text-warning">
                <span className="line-through opacity-60">{sub.from}</span>
                <span className="mx-2">→</span>
                <span className="font-medium">{sub.to}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        Last updated: {data.lastUpdated}
      </p>
    </motion.div>
  );
};

export default SignalBreakdownCard;
