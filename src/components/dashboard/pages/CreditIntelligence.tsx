import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// ============================================
// COUNT UP ANIMATION HOOK
// ============================================

const useCountUp = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return count;
};

// ============================================
// MOCK DATA
// ============================================

const balanceTrendData = [
  { date: 'Nov 1', value: 280000 },
  { date: 'Nov 15', value: 295000 },
  { date: 'Dec 1', value: 275000 },
  { date: 'Dec 15', value: 260000 },
  { date: 'Jan 1', value: 310000 },
  { date: 'Jan 15', value: 340000 },
];

const achReturnsData = [
  { week: 'W1', returns: 1 },
  { week: 'W2', returns: 1 },
  { week: 'W3', returns: 0 },
  { week: 'W4', returns: 0 },
  { week: 'W5', returns: 1 },
  { week: 'W6', returns: 0 },
  { week: 'W7', returns: 0 },
  { week: 'W8', returns: 0 },
  { week: 'W9', returns: 1 },
  { week: 'W10', returns: 0 },
  { week: 'W11', returns: 0 },
  { week: 'W12', returns: 0 },
];

const factorSubscores = [
  { name: 'Tradelines', score: 87, iconType: 'tradelines' },
  { name: 'Payments', score: 92, iconType: 'payments' },
  { name: 'Registry Status', score: 95, iconType: 'registry' },
  { name: 'Identity Match', score: 88, iconType: 'identity' },
  { name: 'Banking Health', score: 78, iconType: 'banking', substituted: true },
];

interface AlertRule {
  id: number;
  name: string;
  description: string;
  threshold?: number;
  enabled: boolean;
  lastTriggered: string | null;
}

interface AlertCategory {
  category: string;
  iconType: string;
  rules: AlertRule[];
}

const alertRules: AlertCategory[] = [
  {
    category: 'Score Change Alerts',
    iconType: 'chart',
    rules: [
      { id: 1, name: 'Score Drop Alert', description: 'When score decreases by 25 points', threshold: 25, enabled: true, lastTriggered: null },
      { id: 2, name: 'Score Improvement', description: 'When score increases by 15 points', threshold: 15, enabled: true, lastTriggered: '2024-01-15' },
    ]
  },
  {
    category: 'New Filings Alerts',
    iconType: 'file',
    rules: [
      { id: 3, name: 'New UCC Filing', description: 'When new filing detected', enabled: true, lastTriggered: '2024-01-10' },
      { id: 4, name: 'Lien Filed', description: 'When lien detected', enabled: true, lastTriggered: null },
      { id: 5, name: 'Judgment Filed', description: 'When judgment detected', enabled: true, lastTriggered: null },
    ]
  },
  {
    category: 'Payment Issue Alerts',
    iconType: 'payment',
    rules: [
      { id: 6, name: 'Late Payment', description: 'When payment is 30+ days late', enabled: true, lastTriggered: null },
      { id: 7, name: 'NSF Alert', description: 'When NSF detected', enabled: false, lastTriggered: null },
      { id: 8, name: 'ACH Return', description: 'When ACH return detected', enabled: true, lastTriggered: null },
    ]
  },
];

// Icon component using black icons library
const FactorIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "w-5 h-5" }) => {
  const iconPaths: Record<string, React.ReactNode> = {
    tradelines: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />,
    payments: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
    registry: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    identity: <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 12a3 3 0 100-6 3 3 0 000 6zm0 0v1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    banking: <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    chart: <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />,
    file: <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    payment: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  };
  
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      {iconPaths[type] || iconPaths.file}
    </svg>
  );
};

const positiveDrivers = [
  'Stable deposit patterns over 90 days',
  'Low DBT (Days Beyond Terms) average of 3.2 days',
  '47 active tradelines reporting on-time',
  'No derogatory marks in 24 months',
];

const riskDrivers = [
  '2 UCC filings detected (both current)',
  '3 ACH returns in last 90 days',
  'Credit utilization trending upward (32%)',
];

const substitutions = [
  { from: 'Revenue data missing', to: 'Banking deposit health used as proxy' },
  { from: 'D&B PAYDEX unavailable', to: 'Tradeline payment data substituted' },
];

// ============================================
// CREDIT SCORE GAUGE COMPONENT (Same style as UsageLimitGauge)
// ============================================

// Static gauge data - matching UsageLimitGauge style
const scoreGaugeData = [
  { name: "Red", value: 400 },
  { name: "Yellow", value: 250 },
  { name: "Pink", value: 350 },
  { name: "Green", value: 300 },
];

const SCORE_GAUGE_COLORS = ["#F04D1A", "#FBA94B", "#B981DA", "#32AE60"];

interface CreditScoreGaugeProps {
  score: number;
  grade: string;
  maxScore?: number;
}

const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({ score, grade }) => {
  const animatedScore = useCountUp(score, 1500);
  
  const getGradeColor = (g: string) => {
    if (g === 'A' || g === 'A+') return '#32AE60';
    if (g === 'B' || g === 'B+') return '#B981DA';
    if (g === 'C' || g === 'C+') return '#FBA94B';
    return '#F04D1A';
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-80 h-40 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={800} height={400}>
            <Pie
              data={scoreGaugeData}
              cx={155}
              cy={160}
              startAngle={180}
              endAngle={0}
              innerRadius={100}
              outerRadius={130}
              fill="#8884d8"
              paddingAngle={1}
              dataKey="value"
              stroke="transparent"
            >
              {scoreGaugeData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SCORE_GAUGE_COLORS[index % SCORE_GAUGE_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Score in center */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 text-center">
          <div className="text-[3rem] font-semibold text-[#1A1D1F]">{animatedScore}</div>
        </div>
      </div>
      
      {/* Grade Badge */}
      <div 
        className="mt-4 px-8 py-2.5 rounded-full text-[1rem] font-semibold"
        style={{ 
          backgroundColor: `${getGradeColor(grade)}15`, 
          color: getGradeColor(grade) 
        }}
      >
        Grade {grade}
      </div>
    </div>
  );
};

// ============================================
// STAT CARD COMPONENT
// ============================================

interface StatCardProps {
  label: string;
  value: string | number;
  color?: 'default' | 'success' | 'warning' | 'danger';
  badge?: string;
  badgeColor?: 'green' | 'blue' | 'yellow' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color = 'default', badge, badgeColor = 'green' }) => {
  const valueColorClass = {
    default: 'text-[#1A1D1F]',
    success: 'text-[#32AE60]',
    warning: 'text-[#FBA94B]',
    danger: 'text-[#F04D1A]',
  }[color];
  
  const badgeColorClass = {
    green: 'bg-[#32AE60] text-white',
    blue: 'bg-[#0C68E9] text-white',
    yellow: 'bg-[#FBA94B] text-white',
    red: 'bg-[#F04D1A] text-white',
  }[badgeColor];
  
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EFEFEF]">
      <div className="text-[0.875rem] text-[#6F767E] mb-2">{label}</div>
      <div className="flex items-center gap-3">
        <span className={`text-[1.5rem] font-semibold ${valueColorClass}`}>{value}</span>
        {badge && (
          <span className={`px-3 py-1 rounded-full text-[0.75rem] font-medium ${badgeColorClass}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};

// ============================================
// TOGGLE SWITCH COMPONENT
// ============================================

interface ToggleSwitchProps {
  enabled: boolean;
  onChange?: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange }) => {
  return (
    <button
      onClick={() => onChange?.(!enabled)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
        enabled ? 'bg-[#0C68E9]' : 'bg-[#EFEFEF]'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

// ============================================
// VOLATILITY METER COMPONENT (Matching theme)
// ============================================

interface VolatilityMeterProps {
  value: number; // 0-100
  status: 'Stable' | 'Moderate' | 'Volatile';
}

const VolatilityMeter: React.FC<VolatilityMeterProps> = ({ value, status }) => {
  const getStatusColor = (s: string) => {
    if (s === 'Stable') return '#32AE60';
    if (s === 'Moderate') return '#FBA94B';
    return '#F04D1A';
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#EFEFEF]">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-[#F4F4F4] rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-[#1A1D1F]" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-[1.125rem] font-semibold text-[#1A1D1F]">Deposit Volatility Meter</h3>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <div className="flex justify-between text-[0.8125rem] font-medium mb-3">
            <span className="text-[#32AE60]">Stable</span>
            <span className="text-[#FBA94B]">Moderate</span>
            <span className="text-[#F04D1A]">Volatile</span>
          </div>
          <div className="relative h-4 rounded-full overflow-hidden bg-[#F4F4F4]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#32AE60] via-[#FBA94B] to-[#F04D1A]" />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500"
              style={{ 
                left: `calc(${value}% - 12px)`,
                border: `3px solid ${getStatusColor(status)}`
              }}
            />
          </div>
        </div>
        <div className="text-right shrink-0 w-28">
          <div 
            className="text-[1.5rem] font-bold"
            style={{ color: getStatusColor(status) }}
          >
            {status}
          </div>
          <div className="text-[0.8125rem] text-[#6F767E]">Low variance detected</div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN CREDIT INTELLIGENCE COMPONENT
// ============================================

const CreditIntelligence: React.FC = () => {
  const [alertTab, setAlertTab] = useState<'rules' | 'history'>('rules');
  const [alertStates, setAlertStates] = useState<Record<number, boolean>>(
    Object.fromEntries(alertRules.flatMap(cat => cat.rules.map(r => [r.id, r.enabled])))
  );
  
  const toggleAlert = (id: number) => {
    setAlertStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#EFEFEF]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[1.5rem] font-semibold text-[#1A1D1F]">Credit Intelligence</h1>
            <p className="text-[#6F767E] text-[0.9375rem]">Comprehensive business credit analysis and fundability assessment</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-[#F4F4F4] rounded-xl">
              <div className="w-8 h-8 bg-[#1A1D1F] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div className="text-[0.9375rem] font-semibold text-[#1A1D1F]">TechFlow Solutions Inc.</div>
                <div className="text-[0.75rem] text-[#6F767E]">Software & Technology</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[0.8125rem] text-[#6F767E]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Signals updated: 1h ago
            </div>
          </div>
        </div>
      </div>

      {/* Score Card + Why This Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#EFEFEF]">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#0C68E9]/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-[#0C68E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-[1.125rem] font-semibold text-[#1A1D1F]">LumiqAI Composite Fundability Score</h2>
          </div>
          
          <CreditScoreGauge score={742} grade="A" />
          
          {/* Factor Subscores */}
          <div className="mt-8">
            <div className="text-center text-[0.875rem] text-[#6F767E] mb-4">Factor Subscores</div>
            <div className="space-y-3">
              {factorSubscores.map((factor) => (
                <div key={factor.name} className="flex items-center justify-between py-3 border-b border-[#EFEFEF] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F4F4F4] rounded-lg flex items-center justify-center">
                      <FactorIcon type={factor.iconType} className="w-4 h-4 text-[#1A1D1F]" />
                    </div>
                    <span className="text-[0.9375rem] font-medium text-[#1A1D1F]">{factor.name}</span>
                    {factor.substituted && (
                      <span className="px-2 py-0.5 bg-[#FBA94B]/10 text-[#FBA94B] rounded text-[0.75rem] font-medium">
                        Substituted
                      </span>
                    )}
                  </div>
                  <span className={`text-[1rem] font-semibold ${
                    factor.score >= 90 ? 'text-[#32AE60]' : factor.score >= 80 ? 'text-[#32AE60]' : 'text-[#FBA94B]'
                  }`}>
                    {factor.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-[#EFEFEF] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[0.9375rem] text-[#6F767E]">Owner FICO</span>
              <div className="flex items-center gap-2">
                <span className="text-[1rem] font-semibold text-[#1A1D1F]">758</span>
                <span className="px-2 py-0.5 border border-[#32AE60] text-[#32AE60] rounded-full text-[0.75rem] font-medium">
                  Excellent
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[0.9375rem] text-[#6F767E]">KYB Status</span>
              <span className="px-3 py-1 bg-[#32AE60] text-white rounded-full text-[0.75rem] font-medium">
                Pass
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[0.9375rem] text-[#6F767E]">Banking Data</span>
              <span className="text-[0.9375rem] text-[#1A1D1F]">Updated 1h ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[0.9375rem] text-[#6F767E]">Confidence</span>
              <span className="px-3 py-1 bg-[#0C68E9] text-white rounded-full text-[0.75rem] font-medium">
                94%
              </span>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-[#EFEFEF] flex justify-between text-[0.8125rem] text-[#6F767E]">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Data sources: 8/9
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Updated: 1h ago
            </div>
          </div>
        </div>

        {/* Why This Score */}
        <div className="bg-white rounded-2xl p-6 border border-[#EFEFEF]">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-[#6F767E]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-[1.125rem] font-semibold text-[#1A1D1F]">Why This Score?</h2>
          </div>
          <p className="text-[0.875rem] text-[#6F767E] mb-6">Detailed breakdown of factors influencing the fundability assessment</p>
          
          {/* Positive Drivers */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-[#32AE60]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-[0.9375rem] font-semibold text-[#32AE60]">Positive Drivers</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {positiveDrivers.map((driver, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-[#DFF9E8]/50 rounded-xl">
                  <svg className="w-5 h-5 text-[#32AE60] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[0.875rem] text-[#1A1D1F]">{driver}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Risk Drivers */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-[#FBA94B]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
              </svg>
              <span className="text-[0.9375rem] font-semibold text-[#FBA94B]">Risk Drivers</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {riskDrivers.map((driver, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-[#FBA94B]/10 rounded-xl">
                  <svg className="w-5 h-5 text-[#FBA94B] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-[0.875rem] text-[#1A1D1F]">{driver}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Substitutions Applied */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-[#0C68E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-[0.9375rem] font-semibold text-[#0C68E9]">Substitutions Applied</span>
            </div>
            <div className="space-y-2">
              {substitutions.map((sub, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-[#F4F4F4] rounded-xl">
                  <svg className="w-4 h-4 text-[#6F767E] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  <span className="text-[0.875rem] text-[#6F767E]">{sub.from}</span>
                  <span className="text-[#6F767E]">→</span>
                  <span className="text-[0.875rem] text-[#1A1D1F]">{sub.to}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* AI Recommendation */}
          <div className="p-4 bg-[#DFF9E8] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#32AE60] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-[0.8125rem] text-[#6F767E]">AI Recommendation</div>
                <div className="text-[1.25rem] font-semibold text-[#32AE60]">Approve</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[0.8125rem] text-[#6F767E]">Decision Confidence</div>
              <div className="text-[1.5rem] font-bold text-[#1A1D1F]">94%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Banking Health Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Average 30d Balance" value="$284,750" />
        <StatCard label="Average 90d Balance" value="$312,400" />
        <StatCard label="Lowest 30d Balance" value="$125,800" color="danger" />
        <StatCard label="Cash Runway Estimate" value="4.2 months" color="success" />
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="NSF / Returned (90d)" value="3" />
        <StatCard label="ACH Return Codes (90d)" value="2" />
        <StatCard label="Deposit Consistency" value="" badge="Stable" badgeColor="green" />
        <StatCard label="Fraud/Auth Check" value="" badge="Pass" badgeColor="green" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Trend */}
        <div className="bg-white rounded-2xl p-6 border border-[#EFEFEF]">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-[#0C68E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h3 className="text-[1.125rem] font-semibold text-[#1A1D1F]">Balance Trend (90 Days)</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0C68E9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0C68E9" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEF" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6F767E' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6F767E' }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #EFEFEF', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value: number | undefined) => value !== undefined ? [`$${value.toLocaleString()}`, 'Balance'] : ['$0', 'Balance']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0C68E9" 
                  fill="url(#balanceGradient)"
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ACH Returns */}
        <div className="bg-white rounded-2xl p-6 border border-[#EFEFEF]">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-[#FBA94B]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-[1.125rem] font-semibold text-[#1A1D1F]">ACH Returns Timeline (12 Weeks)</h3>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={achReturnsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEF" vertical={false} />
                <XAxis 
                  dataKey="week" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6F767E' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6F767E' }}
                  domain={[0, 1]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #EFEFEF', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="returns" 
                  fill="#FBA94B" 
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Volatility Meter */}
      <VolatilityMeter value={25} status="Stable" />

      {/* Credit Monitoring Alerts */}
      <div className="bg-white rounded-2xl p-6 border border-[#EFEFEF]">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#6F767E]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <div>
              <h2 className="text-[1.125rem] font-semibold text-[#1A1D1F]">Credit Monitoring Alerts</h2>
              <p className="text-[0.875rem] text-[#6F767E]">Configure thresholds and notification preferences for credit events</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 border border-[#32AE60] text-[#32AE60] rounded-full text-[0.875rem] font-medium">
              8 Active Rules
            </span>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1D1F] text-white rounded-xl text-[0.875rem] font-medium hover:bg-[#272B30] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Rule
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#F4F4F4] rounded-xl w-fit mb-6">
          <button
            onClick={() => setAlertTab('rules')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium transition-colors ${
              alertTab === 'rules' ? 'bg-white text-[#1A1D1F] shadow-sm' : 'text-[#6F767E] hover:text-[#1A1D1F]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Alert Rules
          </button>
          <button
            onClick={() => setAlertTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[0.875rem] font-medium transition-colors ${
              alertTab === 'history' ? 'bg-white text-[#1A1D1F] shadow-sm' : 'text-[#6F767E] hover:text-[#1A1D1F]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Alert History
          </button>
        </div>
        
        {/* Alert Rules */}
        {alertTab === 'rules' && (
          <div className="space-y-6">
            {alertRules.map((category) => (
              <div key={category.category}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-[#F4F4F4] rounded-lg flex items-center justify-center">
                    <FactorIcon type={category.iconType} className="w-4 h-4 text-[#1A1D1F]" />
                  </div>
                  <span className="text-[0.9375rem] font-semibold text-[#1A1D1F]">{category.category}</span>
                  <span className="px-2 py-0.5 bg-[#F4F4F4] text-[#6F767E] rounded text-[0.75rem] font-medium">
                    {category.rules.length} rules
                  </span>
                </div>
                <div className="space-y-2">
                  {category.rules.map((rule) => (
                    <div key={rule.id} className="flex items-center gap-4 p-4 bg-[#F4F4F4] rounded-xl">
                      <ToggleSwitch 
                        enabled={alertStates[rule.id]} 
                        onChange={() => toggleAlert(rule.id)} 
                      />
                      <div className="w-10 h-10 bg-[#0C68E9]/10 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#0C68E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-[0.9375rem] font-semibold text-[#1A1D1F]">{rule.name}</div>
                        <div className="text-[0.8125rem] text-[#6F767E]">{rule.description}</div>
                        {rule.lastTriggered && (
                          <div className="text-[0.75rem] text-[#6F767E] mt-1">Last triggered: {rule.lastTriggered}</div>
                        )}
                      </div>
                      {rule.threshold && (
                        <div className="flex items-center gap-2">
                          <span className="text-[0.8125rem] text-[#6F767E]">Threshold:</span>
                          <input 
                            type="range" 
                            min="5" 
                            max="50" 
                            defaultValue={rule.threshold}
                            className="w-24 accent-[#0C68E9]"
                          />
                          <span className="text-[0.875rem] font-medium text-[#1A1D1F] w-12">{rule.threshold} pts</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 bg-[#0C68E9] rounded-lg flex items-center justify-center text-white">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button className="w-8 h-8 bg-[#0C68E9] rounded-lg flex items-center justify-center text-white">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button className="w-8 h-8 bg-[#0C68E9] rounded-lg flex items-center justify-center text-white">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </button>
                        <button className="w-8 h-8 text-[#F04D1A] hover:bg-[#F04D1A]/10 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Alert History */}
        {alertTab === 'history' && (
          <div className="text-center py-12 text-[#6F767E]">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[0.9375rem]">No alerts triggered in the last 30 days</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditIntelligence;

