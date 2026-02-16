import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  FileText,
  Check
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

const SCORE_COLORS = [
  "hsl(var(--destructive))",
  "hsl(var(--warning))",
  "hsl(var(--warning))",
  "hsl(var(--success))",
  "hsl(var(--success))"
];

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-success bg-success/10';
  if (grade.startsWith('B')) return 'text-success bg-success/10';
  if (grade.startsWith('C')) return 'text-warning bg-warning/10';
  return 'text-destructive bg-destructive/10';
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
  const [actionFeedback, setActionFeedback] = useState<'approved' | 'declined' | 'review' | null>(null);

  useEffect(() => {
    if (actionFeedback) {
      const timer = setTimeout(() => setActionFeedback(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [actionFeedback]);

  const handleApproveClick = () => {
    setActionFeedback('approved');
    onApprove();
  };

  const handleDeclineClick = () => {
    setActionFeedback('declined');
    onDecline();
  };

  const handleRequestInfoClick = () => {
    setActionFeedback('review');
    onRequestInfo();
  };

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
          color: 'bg-success',
          borderColor: 'border-success',
          textColor: 'text-success'
        };
      case 'review':
        return {
          icon: AlertTriangle,
          label: 'NEEDS REVIEW',
          color: 'bg-warning',
          borderColor: 'border-warning',
          textColor: 'text-warning'
        };
      case 'decline':
        return {
          icon: XCircle,
          label: 'DECLINE',
          color: 'bg-destructive',
          borderColor: 'border-destructive',
          textColor: 'text-destructive'
        };
    }
  };

  const recConfig = getRecConfig();
  const RecIcon = recConfig.icon;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-muted to-card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-foreground">{companyName}</h2>
                <span className="px-2 py-0.5 bg-accent text-muted-foreground rounded text-xs font-mono">
                  {appId}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {productType} • {formatCurrency(amount)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-foreground">AI Engine Active</span>
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
                  <div className="text-3xl font-bold text-foreground">{compositeScore}</div>
                </div>
              </div>
              
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(grade)}`}>
                  Grade {grade}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">LumiqAI Composite Score</p>
            </div>

            {/* AI Recommendation */}
            <div className={`p-4 rounded-xl border-2 ${recConfig.borderColor} bg-card`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg ${recConfig.color} flex items-center justify-center`}>
                  <RecIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">AI Recommendation</p>
                  <p className={`text-lg font-bold ${recConfig.textColor}`}>{recConfig.label}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Confidence</span>
                <span className="text-lg font-bold text-foreground">{confidence}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 space-y-2">
              <button
                onClick={handleApproveClick}
                disabled={actionFeedback !== null}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  actionFeedback === 'approved'
                    ? 'bg-success/80 text-white scale-95'
                    : 'bg-success hover:bg-success/90 text-white'
                } disabled:cursor-not-allowed`}
              >
                {actionFeedback === 'approved' ? (
                  <>
                    <Check className="w-5 h-5" />
                    Approved!
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Approve Application
                  </>
                )}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleRequestInfoClick}
                  disabled={actionFeedback !== null}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    actionFeedback === 'review'
                      ? 'bg-warning/20 border border-warning/40 text-warning scale-95'
                      : 'border border-border hover:bg-muted text-foreground'
                  } disabled:cursor-not-allowed`}
                >
                  {actionFeedback === 'review' ? (
                    <>
                      <Check className="w-4 h-4" />
                      Sent!
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Request Info
                    </>
                  )}
                </button>
                <button
                  onClick={handleDeclineClick}
                  disabled={actionFeedback !== null}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    actionFeedback === 'declined'
                      ? 'bg-destructive/20 border border-destructive/40 text-destructive scale-95'
                      : 'border border-destructive/20 hover:bg-destructive/10 text-destructive'
                  } disabled:cursor-not-allowed`}
                >
                  {actionFeedback === 'declined' ? (
                    <>
                      <Check className="w-4 h-4" />
                      Declined!
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Decline
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Signals & Analysis */}
          <div className="col-span-8">
            {/* Signal Breakdown */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-info" />
                Signal Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {signals.map((signal, i) => (
                  <motion.div
                    key={signal.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3 bg-muted rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{signal.name}</span>
                      <span className={`flex items-center gap-1 text-xs font-medium ${
                        signal.status === 'pass' ? 'text-success' :
                        signal.status === 'warning' ? 'text-warning' : 'text-destructive'
                      }`}>
                        {signal.status === 'pass' && <CheckCircle2 className="w-3 h-3" />}
                        {signal.status === 'warning' && <AlertTriangle className="w-3 h-3" />}
                        {signal.status === 'fail' && <XCircle className="w-3 h-3" />}
                        {signal.score}/100
                      </span>
                    </div>
                    <div className="h-2 bg-accent rounded-full overflow-hidden mb-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${signal.score}%` }}
                        transition={{ duration: 0.2, delay: i * 0.1 }}
                        className={`h-full rounded-full ${
                          signal.status === 'pass' ? 'bg-success' :
                          signal.status === 'warning' ? 'bg-warning' : 'bg-destructive'
                        }`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{signal.details}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Why This Decision */}
            <div className="p-4 bg-info/10 border border-info/20 rounded-xl mb-4">
              <h4 className="text-sm font-semibold text-info mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Analysis Summary
              </h4>
              <p className="text-sm text-info">{summary}</p>
            </div>

            {/* Factors Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Positive Factors */}
              <div className="p-4 bg-success/10 border border-success/20 rounded-xl">
                <h4 className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Positive Factors
                </h4>
                <ul className="space-y-2">
                  {positiveFactors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-success">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      {factor}
                    </li>
                  ))}
                  {positiveFactors.length === 0 && (
                    <li className="text-sm text-success italic">No positive factors identified</li>
                  )}
                </ul>
              </div>

              {/* Risk Factors */}
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <h4 className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Risk Factors
                </h4>
                <ul className="space-y-2">
                  {riskFactors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-destructive">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      {factor}
                    </li>
                  ))}
                  {riskFactors.length === 0 && (
                    <li className="text-sm text-destructive italic">No risk factors identified</li>
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
