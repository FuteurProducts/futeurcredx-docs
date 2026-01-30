import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, AlertTriangle, Clock, ChevronRight, 
  CheckCircle2, XCircle, MessageSquare, ArrowUpRight, Search,
  TrendingDown, CreditCard, Building2, FileWarning, Activity
} from 'lucide-react';

export interface EWSIndicator {
  id: string;
  name: string;
  description: string;
  threshold: string;
  enabled: boolean;
  precision?: number;
  recall?: number;
}

export interface EWSQueueItem {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  businessId: string;
  businessName: string;
  primaryDriver: string;
  driverType: 'cashflow' | 'payment' | 'bureau' | 'utilization' | 'revenue' | 'filing';
  signals: string[];
  recommendedAction: string;
  exposure: number;
  riskScore: number;
  riskChange: number;
  slaTimer: string;
  slaDue: Date;
  slaBreached: boolean;
  assignee?: string;
  createdAt: Date;
  notes: { author: string; text: string; timestamp: Date }[];
}

export interface EWSWorkQueueProps {
  indicators: EWSIndicator[];
  queueItems: EWSQueueItem[];
  onAssign?: (itemId: string, assignee: string) => void;
  onAddNote?: (itemId: string, note: string) => void;
  onResolve?: (itemId: string, resolution: 'resolved' | 'dismissed' | 'escalated') => void;
  onToggleIndicator?: (indicatorId: string, enabled: boolean) => void;
  onViewEntity?: (businessId: string) => void;
  className?: string;
}

const formatCurrency = (num: number): string => {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
};

const getSeverityStyle = (severity: string) => {
  switch (severity) {
    case 'critical': return { bg: 'bg-rose-50', border: 'border-l-rose-500', badge: 'bg-rose-500 text-white', icon: 'text-rose-600' };
    case 'high': return { bg: 'bg-orange-50', border: 'border-l-orange-500', badge: 'bg-orange-500 text-white', icon: 'text-orange-600' };
    case 'medium': return { bg: 'bg-amber-50', border: 'border-l-amber-500', badge: 'bg-amber-500 text-white', icon: 'text-amber-600' };
    default: return { bg: 'bg-blue-50', border: 'border-l-blue-500', badge: 'bg-blue-500 text-white', icon: 'text-blue-600' };
  }
};

const getDriverIcon = (type: string) => {
  switch (type) {
    case 'cashflow': return <Activity className="w-4 h-4" />;
    case 'payment': return <CreditCard className="w-4 h-4" />;
    case 'bureau': return <TrendingDown className="w-4 h-4" />;
    case 'utilization': return <ArrowUpRight className="w-4 h-4" />;
    case 'revenue': return <TrendingDown className="w-4 h-4" />;
    case 'filing': return <FileWarning className="w-4 h-4" />;
    default: return <AlertTriangle className="w-4 h-4" />;
  }
};

const QueueItemCard: React.FC<{
  item: EWSQueueItem;
  onAssign?: () => void;
  onAddNote?: () => void;
  onResolve?: (resolution: 'resolved' | 'dismissed' | 'escalated') => void;
  onViewEntity?: () => void;
}> = ({ item, onAssign, onAddNote, onResolve, onViewEntity }) => {
  const [expanded, setExpanded] = useState(false);
  const style = getSeverityStyle(item.severity);
  
  const timeUntilSla = item.slaDue.getTime() - Date.now();
  const hoursLeft = Math.floor(timeUntilSla / (1000 * 60 * 60));
  const minsLeft = Math.floor((timeUntilSla % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-l-4 ${style.border} ${style.bg} rounded-r-xl overflow-hidden`}
    >
      {/* Main Row */}
      <div 
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-black/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Severity Badge */}
        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${style.badge}`}>
          {item.severity}
        </span>

        {/* Business Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{item.businessName}</span>
            <span className="text-xs text-muted-foreground font-mono">{item.businessId}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className={`flex items-center gap-1 ${style.icon}`}>
              {getDriverIcon(item.driverType)}
              <span className="text-sm font-medium">{item.primaryDriver}</span>
            </div>
          </div>
        </div>

        {/* Exposure */}
        <div className="text-right">
          <div className="text-sm font-semibold text-foreground">{formatCurrency(item.exposure)}</div>
          <div className="text-xs text-muted-foreground">exposure</div>
        </div>

        {/* Risk Change */}
        <div className="text-center w-20">
          <div className={`text-sm font-semibold ${item.riskChange > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {item.riskChange > 0 ? '+' : ''}{item.riskChange}%
          </div>
          <div className="text-xs text-muted-foreground">risk Δ</div>
        </div>

        {/* SLA Timer */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
          item.slaBreached ? 'bg-rose-100 text-rose-700' : 
          hoursLeft < 2 ? 'bg-amber-100 text-amber-700' : 'bg-muted text-foreground'
        }`}>
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">
            {item.slaBreached ? 'BREACHED' : hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m` : `${minsLeft}m`}
          </span>
        </div>

        {/* Assignee */}
        <div className="w-24 flex items-center gap-2">
          {item.assignee ? (
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">{item.assignee.charAt(0)}</span>
              </div>
              <span className="text-sm text-foreground truncate">{item.assignee}</span>
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onAssign?.(); }}
              className="text-sm text-primary hover:underline"
            >
              Assign
            </button>
          )}
        </div>

        {/* Expand Arrow */}
        <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50"
          >
            <div className="p-4 space-y-4">
              {/* Signals */}
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">TRIGGERED SIGNALS</div>
                <div className="flex flex-wrap gap-2">
                  {item.signals.map((signal, idx) => (
                    <span key={idx} className="px-2 py-1 bg-muted rounded text-xs font-medium text-foreground">
                      {signal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-xs font-medium text-primary mb-1">RECOMMENDED ACTION</div>
                <div className="text-sm text-foreground">{item.recommendedAction}</div>
              </div>

              {/* Notes */}
              {item.notes.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">NOTES & AUDIT TRAIL</div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {item.notes.map((note, idx) => (
                      <div key={idx} className="flex gap-2 p-2 bg-muted/50 rounded text-sm">
                        <span className="font-medium text-foreground">{note.author}:</span>
                        <span className="text-muted-foreground">{note.text}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {note.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <button
                  onClick={() => onViewEntity?.()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                >
                  <Building2 className="w-4 h-4" />
                  View Entity
                </button>
                <button
                  onClick={() => onAddNote?.()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80"
                >
                  <MessageSquare className="w-4 h-4" />
                  Add Note
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => onResolve?.('dismissed')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-muted-foreground hover:text-foreground rounded-lg text-sm font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Dismiss
                </button>
                <button
                  onClick={() => onResolve?.('resolved')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Resolve
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const EWSWorkQueue: React.FC<EWSWorkQueueProps> = ({
  indicators,
  queueItems,
  onAssign,
  onAddNote,
  onResolve,
  onToggleIndicator,
  onViewEntity,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'indicators'>('queue');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = queueItems.filter(item => {
    if (severityFilter !== 'all' && item.severity !== severityFilter) return false;
    if (searchQuery && !item.businessName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const criticalCount = queueItems.filter(i => i.severity === 'critical').length;
  const highCount = queueItems.filter(i => i.severity === 'high').length;
  const slaBreachedCount = queueItems.filter(i => i.slaBreached).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border rounded-xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Early Warning System</h3>
            <p className="text-sm text-muted-foreground">Proactive risk intervention queue</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {slaBreachedCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-500 text-white rounded-full text-sm font-semibold animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              {slaBreachedCount} SLA Breached
            </span>
          )}
          <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-semibold">
            {criticalCount} Critical
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
            {highCount} High
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-border">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'queue' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Work Queue ({queueItems.length})
        </button>
        <button
          onClick={() => setActiveTab('indicators')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'indicators' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Activity className="w-4 h-4" />
          Indicators ({indicators.filter(i => i.enabled).length}/{indicators.length})
        </button>
      </div>

      {activeTab === 'queue' ? (
        <>
          {/* Filters */}
          <div className="flex items-center gap-4 p-4 border-b border-border">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 bg-muted border-0 rounded-lg text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
              {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                    severityFilter === sev
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Items */}
          <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No alerts match your filters</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <QueueItemCard
                  key={item.id}
                  item={item}
                  onAssign={() => onAssign?.(item.id, '')}
                  onAddNote={() => onAddNote?.(item.id, '')}
                  onResolve={(res) => onResolve?.(item.id, res)}
                  onViewEntity={() => onViewEntity?.(item.businessId)}
                />
              ))
            )}
          </div>
        </>
      ) : (
        /* Indicators Tab */
        <div className="p-4 space-y-3">
          <div className="text-sm text-muted-foreground mb-4">
            Configure early warning indicators and thresholds for portfolio monitoring.
          </div>
          {indicators.map((indicator) => (
            <div
              key={indicator.id}
              className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl"
            >
              <button
                onClick={() => onToggleIndicator?.(indicator.id, !indicator.enabled)}
                className={`w-10 h-6 rounded-full transition-colors ${
                  indicator.enabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  indicator.enabled ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </button>
              <div className="flex-1">
                <div className="font-medium text-foreground">{indicator.name}</div>
                <div className="text-sm text-muted-foreground">{indicator.description}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{indicator.threshold}</div>
                {indicator.precision && indicator.recall && (
                  <div className="text-xs text-muted-foreground">
                    P: {indicator.precision}% | R: {indicator.recall}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EWSWorkQueue;
