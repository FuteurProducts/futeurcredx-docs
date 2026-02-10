import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Info, RefreshCw } from 'lucide-react';

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
// TYPES
// ============================================
export interface CreditScoreData {
  score: number;
  maxScore?: number;
  grade: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  lastUpdated: string;
  eligibleProducts?: number;
  totalProducts?: number;
}

export interface CreditScoreWidgetProps {
  data: CreditScoreData;
  variant?: 'full' | 'compact' | 'mini';
  showTrend?: boolean;
  showProducts?: boolean;
  onRefresh?: () => void;
  className?: string;
}

// Gauge arc data
const gaugeData = [
  { name: "Poor", value: 300 },
  { name: "Fair", value: 200 },
  { name: "Good", value: 200 },
  { name: "Excellent", value: 150 },
];

const GAUGE_COLORS = ["var(--primary-03)", "var(--primary-05)", "var(--primary-04)", "var(--primary-02)"];

// ============================================
// CREDIT SCORE WIDGET
// ============================================
export const CreditScoreWidget: React.FC<CreditScoreWidgetProps> = ({
  data,
  variant = 'full',
  showTrend = true,
  showProducts = true,
  onRefresh,
  className = '',
}) => {
  const animatedScore = useCountUp(data.score, 1500);
  const maxScore = data.maxScore || 850;
  
  const getGradeColor = (grade: string) => {
    if (grade === 'A' || grade === 'A+') return 'var(--primary-02)';
    if (grade === 'B' || grade === 'B+') return 'var(--primary-04)';
    if (grade === 'C' || grade === 'C+') return 'var(--primary-05)';
    return 'var(--primary-03)';
  };

  const getScoreCategory = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: 'var(--primary-02)' };
    if (score >= 650) return { label: 'Good', color: 'var(--primary-04)' };
    if (score >= 550) return { label: 'Fair', color: 'var(--primary-05)' };
    return { label: 'Poor', color: 'var(--primary-03)' };
  };

  const category = getScoreCategory(data.score);

  if (variant === 'mini') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-card rounded-xl p-4 shadow-sm border border-border ${className}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Credit Score</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{animatedScore}</span>
              <span 
                className="text-sm font-semibold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${getGradeColor(data.grade)}20`, color: getGradeColor(data.grade) }}
              >
                {data.grade}
              </span>
            </div>
          </div>
          {showTrend && (
            <div className={`flex items-center gap-1 text-sm ${data.trend === 'up' ? 'text-success' : data.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
              {data.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : data.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
              <span>{data.trend === 'up' ? '+' : data.trend === 'down' ? '-' : ''}{data.trendValue}</span>
            </div>
          )}
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
          <h3 className="text-sm font-semibold text-muted-foreground">Credit Intelligence</h3>
          {onRefresh && (
            <button onClick={onRefresh} className="p-1.5 hover:bg-accent rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          {/* Score Display */}
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">{animatedScore}</div>
            <div 
              className="text-sm font-semibold mt-1 px-2 py-0.5 rounded-full inline-block"
              style={{ backgroundColor: `${category.color}15`, color: category.color }}
            >
              {category.label}
            </div>
          </div>
          
          {/* Metrics */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Grade</span>
              <span className="font-semibold" style={{ color: getGradeColor(data.grade) }}>{data.grade}</span>
            </div>
            {showTrend && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Trend</span>
                <span className={`font-semibold flex items-center gap-1 ${data.trend === 'up' ? 'text-success' : data.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {data.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : data.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                  {data.trend === 'up' ? '+' : data.trend === 'down' ? '-' : ''}{data.trendValue} pts
                </span>
              </div>
            )}
            {showProducts && data.eligibleProducts !== undefined && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Products</span>
                <span className="font-semibold text-foreground">{data.eligibleProducts} of {data.totalProducts || 5}</span>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">Updated: {data.lastUpdated}</p>
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Credit Intelligence</h3>
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-xs text-success font-medium">Live</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-accent rounded-lg transition-colors group">
            <Info className="w-4 h-4 text-muted-foreground group-hover:text-muted-foreground" />
          </button>
          {onRefresh && (
            <button onClick={onRefresh} className="p-2 hover:bg-accent rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Gauge Chart */}
      <div className="relative h-44 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="85%"
              startAngle={180}
              endAngle={0}
              innerRadius={80}
              outerRadius={110}
              fill="hsl(var(--primary))"
              paddingAngle={2}
              dataKey="value"
              stroke="transparent"
            >
              {gaugeData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={GAUGE_COLORS[index % GAUGE_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Score in center */}
        <div className="absolute left-1/2 bottom-4 -translate-x-1/2 text-center">
          <div className="text-5xl font-bold text-foreground">{animatedScore}</div>
          <div className="text-sm text-muted-foreground">of {maxScore}</div>
        </div>
      </div>

      {/* Grade Badge */}
      <div className="flex justify-center mb-6">
        <div 
          className="px-4 py-2 rounded-full text-lg font-bold"
          style={{ backgroundColor: `${getGradeColor(data.grade)}15`, color: getGradeColor(data.grade) }}
        >
          Grade: {data.grade}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-muted rounded-xl p-4">
          <p className="text-xs text-muted-foreground font-medium mb-1">Category</p>
          <p className="text-lg font-semibold" style={{ color: category.color }}>{category.label}</p>
        </div>
        
        {showTrend && (
          <div className="bg-muted rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">Trend (30d)</p>
            <div className={`flex items-center gap-1 text-lg font-semibold ${data.trend === 'up' ? 'text-success' : data.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
              {data.trend === 'up' ? <TrendingUp className="w-5 h-5" /> : data.trend === 'down' ? <TrendingDown className="w-5 h-5" /> : null}
              {data.trend === 'up' ? '+' : data.trend === 'down' ? '-' : ''}{data.trendValue} pts
            </div>
          </div>
        )}
      </div>

      {/* Eligible Products */}
      {showProducts && data.eligibleProducts !== undefined && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Eligible Products</p>
              <p className="text-2xl font-bold text-foreground">{data.eligibleProducts} of {data.totalProducts || 5}</p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: data.totalProducts || 5 }).map((_, i) => (
                <div 
                  key={i}
                  className={`w-3 h-8 rounded-full ${i < (data.eligibleProducts || 0) ? 'bg-success' : 'bg-muted'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="text-xs text-muted-foreground text-center mt-4">Last updated: {data.lastUpdated}</p>
    </motion.div>
  );
};

export default CreditScoreWidget;
