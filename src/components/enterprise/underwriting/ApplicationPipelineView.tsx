import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Building2,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';

export interface PipelineApplication {
  id: string;
  appId: string;
  companyName: string;
  amount: number;
  productType: string;
  customerSegment: 'micro' | 'small' | 'mid-market';
  riskTier: 'low' | 'medium' | 'high';
  aiRecommendation: 'approve' | 'review' | 'decline';
  confidence: number;
  geography: string;
  industry: string;
  yearsInBusiness: number;
  compositeScore: number;
  submittedAt: string;
  assignedTo?: string;
  tags: string[];
}

interface ApplicationPipelineViewProps {
  applications: PipelineApplication[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewDetails: (app: PipelineApplication) => void;
  viewMode: 'table' | 'cards';
}

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
};

const getSegmentConfig = (segment: PipelineApplication['customerSegment']) => {
  switch (segment) {
    case 'micro': return { label: 'Micro', color: 'bg-blue-100 text-blue-700' };
    case 'small': return { label: 'Small', color: 'bg-green-100 text-green-700' };
    case 'mid-market': return { label: 'Mid-Market', color: 'bg-purple-100 text-purple-700' };
  }
};

const getRiskConfig = (tier: PipelineApplication['riskTier']) => {
  switch (tier) {
    case 'low': return { label: 'Low', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    case 'medium': return { label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    case 'high': return { label: 'High', color: 'bg-red-100 text-red-700 border-red-200' };
  }
};

const getRecommendationConfig = (rec: PipelineApplication['aiRecommendation']) => {
  switch (rec) {
    case 'approve': return { 
      icon: CheckCircle2, 
      label: 'Approve', 
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200'
    };
    case 'review': return { 
      icon: AlertTriangle, 
      label: 'Review', 
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200'
    };
    case 'decline': return { 
      icon: XCircle, 
      label: 'Decline', 
      color: 'text-red-600',
      bg: 'bg-red-50 border-red-200'
    };
  }
};

export const ApplicationPipelineView: React.FC<ApplicationPipelineViewProps> = ({
  applications,
  selectedIds,
  onSelect,
  onSelectAll,
  onViewDetails,
  viewMode,
}) => {
  if (viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((app, index) => {
          const segment = getSegmentConfig(app.customerSegment);
          const risk = getRiskConfig(app.riskTier);
          const rec = getRecommendationConfig(app.aiRecommendation);
          const isSelected = selectedIds.includes(app.id);
          
          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200'
              }`}
              onClick={() => onViewDetails(app)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSelect(app.id);
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600"
                  />
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{app.companyName}</h3>
                    <p className="text-xs text-slate-500">{app.appId}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 hover:bg-slate-100 rounded"
                >
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Amount & Product */}
              <div className="mb-3">
                <div className="text-xl font-bold text-slate-800">{formatCurrency(app.amount)}</div>
                <div className="text-xs text-slate-500">{app.productType}</div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${segment.color}`}>
                  {segment.label}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${risk.color}`}>
                  {risk.label} Risk
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                  {app.geography}
                </span>
              </div>

              {/* AI Recommendation */}
              <div className={`flex items-center justify-between p-2.5 rounded-lg border ${rec.bg}`}>
                <div className="flex items-center gap-2">
                  <rec.icon className={`w-4 h-4 ${rec.color}`} />
                  <span className={`text-sm font-medium ${rec.color}`}>AI: {rec.label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">{app.confidence}%</span>
              </div>

              {/* Footer */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {app.submittedAt}
                </div>
                <div className="flex items-center gap-1">
                  Score: <span className="font-semibold text-slate-700">{app.compositeScore}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Table View
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === applications.length && applications.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Application
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Amount / Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Segment
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Risk
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                AI Decision
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Geography
              </th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app, index) => {
              const segment = getSegmentConfig(app.customerSegment);
              const risk = getRiskConfig(app.riskTier);
              const rec = getRecommendationConfig(app.aiRecommendation);
              const isSelected = selectedIds.includes(app.id);
              
              return (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/50' : ''
                  }`}
                  onClick={() => onViewDetails(app)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelect(app.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{app.companyName}</p>
                        <p className="text-xs text-slate-500">{app.appId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">{formatCurrency(app.amount)}</div>
                    <div className="text-xs text-slate-500">{app.productType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${segment.color}`}>
                      {segment.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${risk.color}`}>
                      {risk.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <rec.icon className={`w-4 h-4 ${rec.color}`} />
                      <span className={`text-sm font-medium ${rec.color}`}>{rec.label}</span>
                      <span className="text-xs text-slate-500">({app.confidence}%)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-800">{app.compositeScore}</span>
                      {app.compositeScore >= 700 ? (
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                      ) : app.compositeScore < 600 ? (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {app.geography}
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(app);
                      }}
                      className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
