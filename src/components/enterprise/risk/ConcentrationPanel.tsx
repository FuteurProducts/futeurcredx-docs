import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, AlertTriangle, TrendingUp, Settings, ChevronRight, Building2, MapPin, User, Link2 } from 'lucide-react';

export interface ConcentrationItem {
  id: string;
  name: string;
  exposure: number;
  exposureLimit: number;
  utilizationPct: number;
  accountCount: number;
  riskScore: number;
  trend: number; // % change over period
  breachStatus: 'ok' | 'warning' | 'breach';
  trendToBreachDays?: number;
}

export interface ConcentrationCategory {
  id: string;
  title: string;
  icon: 'industry' | 'geography' | 'single_name' | 'correlated';
  items: ConcentrationItem[];
  totalExposure: number;
  totalLimit: number;
}

export interface ConcentrationPanelProps {
  categories: ConcentrationCategory[];
  onSetLimit?: (categoryId: string, itemId: string, newLimit: number) => void;
  onViewDetails?: (categoryId: string, itemId: string) => void;
  className?: string;
}

const formatCurrency = (num: number): string => {
  if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toLocaleString();
};

const getBreachColor = (status: string): { bg: string; text: string; badge: string } => {
  switch (status) {
    case 'breach': return { bg: 'bg-rose-50', text: 'text-rose-700', badge: 'bg-rose-500 text-white' };
    case 'warning': return { bg: 'bg-warning/10', text: 'text-warning', badge: 'bg-warning text-white' };
    default: return { bg: 'bg-success/10', text: 'text-success', badge: 'bg-success text-white' };
  }
};

const CategoryIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'industry': return <Building2 className="w-5 h-5" />;
    case 'geography': return <MapPin className="w-5 h-5" />;
    case 'single_name': return <User className="w-5 h-5" />;
    case 'correlated': return <Link2 className="w-5 h-5" />;
    default: return <Target className="w-5 h-5" />;
  }
};

const ConcentrationTable: React.FC<{
  items: ConcentrationItem[];
  onSetLimit?: (itemId: string) => void;
  onViewDetails?: (itemId: string) => void;
}> = ({ items, onSetLimit, onViewDetails }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Name</th>
            <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground">Exposure</th>
            <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground">Limit</th>
            <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Utilization</th>
            <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
            <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Trend</th>
            <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.slice(0, 10).map((item, index) => {
            const colors = getBreachColor(item.breachStatus);
            return (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer ${colors.bg}`}
                onClick={() => onViewDetails?.(item.id)}
              >
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground w-5">#{index + 1}</span>
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{formatNumber(item.accountCount)} accounts</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(item.exposure)}</span>
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="text-sm text-muted-foreground">{formatCurrency(item.exposureLimit)}</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          item.utilizationPct >= 100 ? 'bg-rose-500' :
                          item.utilizationPct >= 80 ? 'bg-warning' : 'bg-success'
                        }`}
                        style={{ width: `${Math.min(item.utilizationPct, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{item.utilizationPct}%</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${colors.badge}`}>
                    {item.breachStatus === 'breach' && <AlertTriangle className="w-3 h-3" />}
                    {item.breachStatus.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      item.trend > 0 ? 'text-rose-600' : item.trend < 0 ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      {item.trend > 0 ? <TrendingUp className="w-3 h-3" /> : null}
                      {item.trend > 0 ? '+' : ''}{item.trend}%
                    </div>
                    {item.trendToBreachDays && item.breachStatus === 'warning' && (
                      <span className="text-[10px] text-warning">~{item.trendToBreachDays}d to breach</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); onSetLimit?.(item.id); }}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors"
                      title="Set Limit"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onViewDetails?.(item.id); }}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors"
                      title="View Details"
                    >
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const ConcentrationPanel: React.FC<ConcentrationPanelProps> = ({
  categories,
  onSetLimit,
  onViewDetails,
  className = '',
}) => {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');

  const currentCategory = categories.find(c => c.id === activeCategory);
  
  const breachCount = categories.reduce((acc, cat) => 
    acc + cat.items.filter(i => i.breachStatus === 'breach').length, 0
  );
  const warningCount = categories.reduce((acc, cat) => 
    acc + cat.items.filter(i => i.breachStatus === 'warning').length, 0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card border border-border rounded-xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Concentration Risk</h3>
            <p className="text-sm text-muted-foreground">Portfolio exposure limits and thresholds</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {breachCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-500 text-white rounded-full text-sm font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              {breachCount} Breach{breachCount > 1 ? 'es' : ''}
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-3 py-1 bg-warning text-white rounded-full text-sm font-semibold">
              {warningCount} Warning{warningCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 p-4 border-b border-border overflow-x-auto">
        {categories.map((category) => {
          const catBreaches = category.items.filter(i => i.breachStatus === 'breach').length;
          const catWarnings = category.items.filter(i => i.breachStatus === 'warning').length;
          
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <CategoryIcon type={category.icon} />
              <span>{category.title}</span>
              {catBreaches > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeCategory === category.id ? 'bg-white/20' : 'bg-rose-500 text-white'
                }`}>
                  {catBreaches}
                </span>
              )}
              {catWarnings > 0 && catBreaches === 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeCategory === category.id ? 'bg-white/20' : 'bg-warning text-white'
                }`}>
                  {catWarnings}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Current Category Table */}
      {currentCategory && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Exposure: </span>
                <span className="font-semibold text-foreground">{formatCurrency(currentCategory.totalExposure)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Limit: </span>
                <span className="font-semibold text-foreground">{formatCurrency(currentCategory.totalLimit)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Utilization: </span>
                <span className={`font-semibold ${
                  (currentCategory.totalExposure / currentCategory.totalLimit * 100) >= 80 
                    ? 'text-warning'
                    : 'text-success'
                }`}>
                  {((currentCategory.totalExposure / currentCategory.totalLimit) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          
          <ConcentrationTable
            items={currentCategory.items}
            onSetLimit={(itemId) => onSetLimit?.(currentCategory.id, itemId, 0)}
            onViewDetails={(itemId) => onViewDetails?.(currentCategory.id, itemId)}
          />
        </div>
      )}
    </motion.div>
  );
};

export default ConcentrationPanel;
