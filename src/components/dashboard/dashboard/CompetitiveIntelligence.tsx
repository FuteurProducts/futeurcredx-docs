import { Target, TrendingDown, AlertTriangle, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CompetitorMetric {
  name: string;
  yourBank: number;
  industry: number;
  leader: number;
}

const metrics: CompetitorMetric[] = [
  { name: 'SMB Credit Activation', yourBank: 74, industry: 68, leader: 82 },
  { name: 'Application Conversion', yourBank: 17.3, industry: 14.2, leader: 21.5 },
  { name: 'Approval Rate', yourBank: 75, industry: 71, leader: 79 },
  { name: 'Avg Time to Approval (days)', yourBank: 2.3, industry: 3.5, leader: 1.8 },
];

export function CompetitiveIntelligence() {
  const marketShareLoss = 8.5; // %
  const fintechThreatScore = 72; // out of 100

  return (
    <div className="space-y-4 animate-fade-in" style={{ animationDelay: '600ms' }}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-warning/10 rounded-lg">
          <Target className="w-5 h-5 text-warning" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Competitive Intelligence</h2>
          <p className="text-sm text-muted-foreground">Compare against industry benchmarks</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass-card p-4 border-warning/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <p className="text-xs font-medium">Fintech Threat Score</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-warning">{fintechThreatScore}</p>
            <p className="text-sm text-muted-foreground">/ 100</p>
          </div>
          <Progress value={fintechThreatScore} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">High competitive pressure</p>
        </Card>

        <Card className="glass-card p-4 border-destructive/30">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-destructive" />
            <p className="text-xs font-medium">Est. Market Share Loss</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-destructive">{marketShareLoss}%</p>
            <p className="text-sm text-muted-foreground">YoY</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">$47M annual revenue impact</p>
        </Card>

        <Card className="glass-card p-4 border-primary/30">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-primary" />
            <p className="text-xs font-medium">Opportunity Score</p>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-success">87</p>
            <p className="text-sm text-muted-foreground">/ 100</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">High growth potential</p>
        </Card>
      </div>

      <Card className="glass-card p-6">
        <h3 className="font-semibold mb-4">Benchmark Comparison</h3>
        <div className="space-y-4">
          {metrics.map((metric, i) => (
            <div
              key={metric.name}
              className="space-y-2 animate-fade-in"
              style={{ animationDelay: `${700 + i * 100}ms` }}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{metric.name}</span>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-muted-foreground">You: <span className="font-bold">{metric.yourBank}{metric.name.includes('days') ? '' : '%'}</span></span>
                  <span className="text-muted-foreground">Industry: {metric.industry}{metric.name.includes('days') ? '' : '%'}</span>
                  <span className="text-primary">Leader: {metric.leader}{metric.name.includes('days') ? '' : '%'}</span>
                </div>
              </div>
              <div className="relative h-2 bg-background/30 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-muted/50"
                  style={{ width: `${(metric.industry / metric.leader) * 100}%` }}
                />
                <div
                  className="absolute h-full bg-primary"
                  style={{ width: `${(metric.yourBank / metric.leader) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
