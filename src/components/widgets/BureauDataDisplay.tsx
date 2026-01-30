import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, TrendingUp, TrendingDown, RefreshCw, 
  ChevronDown, ExternalLink, AlertCircle, CheckCircle, Clock
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
export interface BureauScore {
  bureau: 'dnb' | 'experian' | 'equifax';
  scoreName: string;
  score: number;
  maxScore: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  lastUpdated: string;
  status: 'active' | 'pending' | 'unavailable';
  details?: {
    label: string;
    value: string | number;
  }[];
}

export interface BureauDataDisplayProps {
  scores: BureauScore[];
  variant?: 'grid' | 'list' | 'compact';
  showDetails?: boolean;
  onRefresh?: (bureau: string) => void;
  onViewReport?: (bureau: string) => void;
  className?: string;
}

// Bureau branding
const bureauConfig: Record<string, { name: string; color: string; lightColor: string }> = {
  dnb: { name: 'D&B PAYDEX®', color: '#00539B', lightColor: '#E6EEF5' },
  experian: { name: 'Experian Intelliscore℠', color: '#D71635', lightColor: '#FCEEF1' },
  equifax: { name: 'Equifax Business', color: '#BE1E2D', lightColor: '#FBECED' },
};

// ============================================
// BUREAU DATA DISPLAY
// ============================================
export const BureauDataDisplay: React.FC<BureauDataDisplayProps> = ({
  scores,
  variant = 'grid',
  showDetails = true,
  onRefresh,
  onViewReport,
  className = '',
}) => {
  const [expandedBureau, setExpandedBureau] = useState<string | null>(null);

  const getScoreColor = (score: number, maxScore: number) => {
    const percent = (score / maxScore) * 100;
    if (percent >= 75) return '#10B981';
    if (percent >= 50) return '#8B5CF6';
    if (percent >= 25) return '#F59E0B';
    return '#EF4444';
  };

  const renderScoreRing = (score: number, maxScore: number, size: number = 80) => {
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / maxScore) * circumference;
    const color = getScoreColor(score, maxScore);

    return (
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${progress} ${circumference}` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
    );
  };

  if (variant === 'compact') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-200 ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700">Multi-Bureau Summary</h3>
          <span className="text-xs text-slate-500">{scores.length} sources</span>
        </div>

        <div className="flex justify-between">
          {scores.map(bureau => {
            const config = bureauConfig[bureau.bureau];
            return (
              <div key={bureau.bureau} className="text-center">
                <div className="relative inline-block">
                  {renderScoreRing(bureau.score, bureau.maxScore, 60)}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-900">{bureau.score}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">{config.name.split(' ')[0]}</p>
                <div className={`flex items-center justify-center gap-1 text-xs ${
                  bureau.trend === 'up' ? 'text-green-600' : bureau.trend === 'down' ? 'text-red-600' : 'text-slate-500'
                }`}>
                  {bureau.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                   bureau.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                  {bureau.trend !== 'stable' && `${bureau.trend === 'up' ? '+' : '-'}${bureau.trendValue}`}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  if (variant === 'list') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200 ${className}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Building className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">Bureau Reports</h3>
        </div>

        <div className="space-y-4">
          {scores.map(bureau => {
            const config = bureauConfig[bureau.bureau];
            const isExpanded = expandedBureau === bureau.bureau;
            
            return (
              <div 
                key={bureau.bureau}
                className="border border-slate-200 rounded-xl overflow-hidden"
              >
                <div 
                  className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedBureau(isExpanded ? null : bureau.bureau)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-3 h-10 rounded-full"
                        style={{ backgroundColor: config.color }}
                      />
                      <div>
                        <h4 className="font-semibold text-slate-800">{config.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {bureau.status === 'active' && (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle className="w-3 h-3" /> Active
                            </span>
                          )}
                          {bureau.status === 'pending' && (
                            <span className="flex items-center gap-1 text-xs text-amber-600">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                          {bureau.status === 'unavailable' && (
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <AlertCircle className="w-3 h-3" /> Unavailable
                            </span>
                          )}
                          <span className="text-xs text-slate-400">
                            Updated: {bureau.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-2xl font-bold text-slate-900">{bureau.score}</span>
                        <span className="text-sm text-slate-400">/{bureau.maxScore}</span>
                        <div className={`flex items-center justify-end gap-1 text-sm ${
                          bureau.trend === 'up' ? 'text-green-600' : bureau.trend === 'down' ? 'text-red-600' : 'text-slate-500'
                        }`}>
                          {bureau.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : 
                           bureau.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
                          {bureau.trend !== 'stable' && `${bureau.trend === 'up' ? '+' : '-'}${bureau.trendValue}`}
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {isExpanded && showDetails && bureau.details && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 bg-slate-50"
                    >
                      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {bureau.details.map((detail, i) => (
                          <div key={i}>
                            <p className="text-xs text-slate-500">{detail.label}</p>
                            <p className="text-sm font-semibold text-slate-800">{detail.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 pb-4 flex gap-2">
                        {onRefresh && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); onRefresh(bureau.bureau); }}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                          </button>
                        )}
                        {onViewReport && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); onViewReport(bureau.bureau); }}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Full Report
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Grid variant (default)
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className}`}
    >
      <div className="flex items-center gap-2 mb-6">
        <Building className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900">Multi-Bureau Credit Data</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {scores.map((bureau, index) => {
          const config = bureauConfig[bureau.bureau];
          
          return (
            <motion.div
              key={bureau.bureau}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: config.lightColor, color: config.color }}
                >
                  {config.name.split(' ')[0]}
                </div>
                {bureau.status === 'active' && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-600 font-medium">Live</span>
                  </div>
                )}
              </div>

              {/* Score Display */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  {renderScoreRing(bureau.score, bureau.maxScore, 100)}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900">{bureau.score}</span>
                    <span className="text-xs text-slate-400">of {bureau.maxScore}</span>
                  </div>
                </div>
              </div>

              {/* Score name */}
              <h4 className="text-center font-medium text-slate-800 mb-2">{bureau.scoreName}</h4>

              {/* Trend */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  bureau.trend === 'up' ? 'text-green-600' : bureau.trend === 'down' ? 'text-red-600' : 'text-slate-500'
                }`}>
                  {bureau.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : 
                   bureau.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
                  {bureau.trend === 'up' ? '+' : bureau.trend === 'down' ? '-' : ''}{bureau.trendValue} pts
                </span>
                <span className="text-xs text-slate-400">(30d)</span>
              </div>

              {/* Details */}
              {showDetails && bureau.details && (
                <div className="space-y-2 mb-4 pt-4 border-t border-slate-100">
                  {bureau.details.slice(0, 3).map((detail, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-500">{detail.label}</span>
                      <span className="font-medium text-slate-800">{detail.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                {onRefresh && (
                  <button 
                    onClick={() => onRefresh(bureau.bureau)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                )}
                {onViewReport && (
                  <button 
                    onClick={() => onViewReport(bureau.bureau)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Report
                  </button>
                )}
              </div>

              {/* Last updated */}
              <p className="text-xs text-slate-400 text-center mt-3">
                Updated: {bureau.lastUpdated}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BureauDataDisplay;
