import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  FileText
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface SignalScore {
  name: string;
  score: number;
  weight: number;
  status: 'pass' | 'warning' | 'fail';
  details: string;
}

interface AIDecisioningPanelProps {
  companyName: string;
  appId: string;
  amount: number;
  productType: string;
  compositeScore: number;
  grade: string;
  aiRecommendation: 'approve' | 'review' | 'decline';
  confidence: number;
  signals: SignalScore[];
  positiveFactors: string[];
  riskFactors: string[];
  summary: string;
  onApprove: () => void;
  onDecline: () => void;
  onRequestInfo: () => void;
}

const scoreGaugeData = [
  { name: "Red", value: 150 },
  { name: "Orange", value: 100 },
  { name: "Yellow", value: 150 },
  { name: "Light Green", value: 150 },
  { name: "Green", value: 150 },
];

const SCORE_COLORS = ["#ef4444", "#f97316", "#fbbf24", "#84cc16", "#22c55e"];

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-emerald-600 bg-emerald-100';
  if (grade.startsWith('B')) return 'text-green-600 bg-green-100';
  if (grade.startsWith('C')) return 'text-amber-600 bg-amber-100';
  return 'text-red-600 bg-red-100';
};

export const AIDecisioningPanel: React.FC<AIDecisioningPanelProps> = ({
  companyName,
  appId,
  amount,
  productType,
  compositeScore,
  grade,
  aiRecommendation,
  confidence,
  signals,
  positiveFactors,
  riskFactors,
  summary,
  onApprove,
  onDecline,
  onRequestInfo,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(val);
  };

  const getRecConfig = () => {
    switch (aiRecommendation) {
      case 'approve':
        return { 
          icon: CheckCircle2, 
          label: 'APPROVE', 
          color: 'bg-emerald-600',
          borderColor: 'border-emerald-500',
          textColor: 'text-emerald-600'
        };
      case 'review':
        return { 
          icon: AlertTriangle, 
          label: 'NEEDS REVIEW', 
          color: 'bg-amber-500',
          borderColor: 'border-amber-500',
          textColor: 'text-amber-600'
        };
      case 'decline':
        return { 
          icon: XCircle, 
          label: 'DECLINE', 
          color: 'bg-red-600',
          borderColor: 'border-red-500',
          textColor: 'text-red-600'
        };
    }
  };

  const recConfig = getRecConfig();
  const RecIcon = recConfig.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-slate-800">{companyName}</h2>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-mono">
                  {appId}
                </span>
              </div>
              <div className="text-sm text-slate-500">
                {productType} • {formatCurrency(amount)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700">AI Engine Active</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Score & Recommendation */}
          <div className="col-span-4">
            {/* Score Gauge */}
            <div className="text-center mb-6">
              <div className="relative w-40 h-24 mx-auto">
                <ResponsiveContainer width="100%" height={100}>
                  <PieChart>
                    <Pie
                      data={scoreGaugeData}
                      cx="50%"
                      cy="100%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="transparent"
                    >
                      {scoreGaugeData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={SCORE_COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="absolute left-1/2 bottom-2 -translate-x-1/2 text-center">
                  <div className="text-3xl font-bold text-slate-800">{compositeScore}</div>
                </div>
              </div>
              
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(grade)}`}>
                  Grade {grade}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">LumiqAI Composite Score</p>
            </div>

            {/* AI Recommendation */}
            <div className={`p-4 rounded-xl border-2 ${recConfig.borderColor} bg-white`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${recConfig.color} flex items-center justify-center`}>
                  <RecIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">AI Recommendation</p>
                  <p className={`text-lg font-bold ${recConfig.textColor}`}>{recConfig.label}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Confidence</span>
                <span className="text-lg font-bold text-slate-800">{confidence}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 space-y-2">
              <button
                onClick={onApprove}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
              >
                <CheckCircle2 className="w-5 h-5" />
                Approve Application
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onRequestInfo}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Request Info
                </button>
                <button
                  onClick={onDecline}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-sm font-medium transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Decline
                </button>
              </div>
            </div>
          </div>

          {/* Right: Signals & Analysis */}
          <div className="col-span-8">
            {/* Signal Breakdown */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                Signal Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {signals.map((signal, i) => (
                  <motion.div
                    key={signal.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3 bg-slate-50 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{signal.name}</span>
                      <span className={`flex items-center gap-1 text-xs font-medium ${
                        signal.status === 'pass' ? 'text-emerald-600' :
                        signal.status === 'warning' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {signal.status === 'pass' && <CheckCircle2 className="w-3 h-3" />}
                        {signal.status === 'warning' && <AlertTriangle className="w-3 h-3" />}
                        {signal.status === 'fail' && <XCircle className="w-3 h-3" />}
                        {signal.score}/100
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${signal.score}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`h-full rounded-full ${
                          signal.status === 'pass' ? 'bg-emerald-500' :
                          signal.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                    <p className="text-xs text-slate-500">{signal.details}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Why This Decision */}
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Analysis Summary
              </h4>
              <p className="text-sm text-blue-700">{summary}</p>
            </div>

            {/* Factors Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Positive Factors */}
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <h4 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Positive Factors
                </h4>
                <ul className="space-y-2">
                  {positiveFactors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      {factor}
                    </li>
                  ))}
                  {positiveFactors.length === 0 && (
                    <li className="text-sm text-emerald-600 italic">No positive factors identified</li>
                  )}
                </ul>
              </div>

              {/* Risk Factors */}
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <h4 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Risk Factors
                </h4>
                <ul className="space-y-2">
                  {riskFactors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      {factor}
                    </li>
                  ))}
                  {riskFactors.length === 0 && (
                    <li className="text-sm text-red-600 italic">No risk factors identified</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
