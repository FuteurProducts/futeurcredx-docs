import { Database, ArrowRight, Building2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const flowSteps = [
  { icon: Building2, label: 'SMB Customer', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { icon: Database, label: 'Experian Data', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { icon: Sparkles, label: 'LUMIQ AI API', color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
  { icon: Building2, label: 'Your Bank App', color: 'text-success', bgColor: 'bg-success/10' },
];

export function DataFlowVisualization() {
  return (
    <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
      <Card className="glass-card p-6 overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Credit Data Flow Pipeline</h2>
              <p className="text-sm text-muted-foreground">Real-time data processing architecture</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-8">
            {flowSteps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="flex flex-col items-center gap-3 animate-fade-in"
                  style={{ animationDelay: `${300 + index * 200}ms` }}
                >
                  <div className={`p-4 ${step.bgColor} rounded-xl border border-white/10`}>
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  <p className="text-sm font-semibold text-center">{step.label}</p>
                  {index === 0 && (
                    <Badge variant="outline" className="text-xs">Source</Badge>
                  )}
                  {index === flowSteps.length - 1 && (
                    <Badge variant="default" className="text-xs">Destination</Badge>
                  )}
                </div>

                {index < flowSteps.length - 1 && (
                  <div className="mx-4 flex-1 relative">
                    <div className="h-0.5 bg-gradient-to-r from-primary to-purple-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/50 data-flow" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary absolute -right-2 -top-2" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">12ms</p>
              <p className="text-xs text-muted-foreground">Avg Processing Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">99.99%</p>
              <p className="text-xs text-muted-foreground">Data Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-500">2.4M</p>
              <p className="text-xs text-muted-foreground">Requests/Day</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
