import { AlertTriangle, TrendingUp, Shield, Sparkles, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Alert {
  id: string;
  type: 'anomaly' | 'prediction' | 'compliance' | 'recommendation';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action?: string;
}

const alerts: Alert[] = [
  {
    id: '1',
    type: 'anomaly',
    severity: 'high',
    title: 'Unusual spike in ineligible ratio',
    description: 'Ineligible applications increased by 23% in the last 4 hours. This is 3.2σ above normal.',
    action: 'Review criteria'
  },
  {
    id: '2',
    type: 'prediction',
    severity: 'medium',
    title: 'High churn risk detected',
    description: '127 accounts showing behavior patterns consistent with 78% churn probability within 30 days.',
    action: 'View accounts'
  },
  {
    id: '3',
    type: 'recommendation',
    severity: 'low',
    title: 'Optimization opportunity',
    description: 'Approving applications in under 2 days could increase conversion rate by estimated 4.2%.',
    action: 'Learn more'
  },
  {
    id: '4',
    type: 'compliance',
    severity: 'high',
    title: 'FCRA compliance check required',
    description: 'Quarterly adverse action notice review due in 3 days for 45 accounts.',
    action: 'Schedule review'
  }
];

export function SmartAlerts() {
  const getIcon = (type: string) => {
    switch(type) {
      case 'anomaly': return AlertTriangle;
      case 'prediction': return TrendingUp;
      case 'compliance': return Shield;
      case 'recommendation': return Sparkles;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'border-destructive/30 bg-destructive/5';
      case 'medium': return 'border-warning/30 bg-warning/5';
      case 'low': return 'border-primary/30 bg-primary/5';
      default: return 'border-muted/30 bg-muted/5';
    }
  };

  return (
    <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Smart Alerts & Insights</h2>
              <p className="text-sm text-muted-foreground">AI-powered anomaly detection</p>
            </div>
          </div>
          <Badge variant="destructive">{alerts.length} Active</Badge>
        </div>

        <div className="space-y-3">
          {alerts.map((alert, i) => {
            const Icon = getIcon(alert.type);
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} hover:border-primary/50 transition-colors animate-fade-in`}
                style={{ animationDelay: `${600 + i * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 ${
                    alert.severity === 'high' ? 'text-destructive' :
                    alert.severity === 'medium' ? 'text-warning' : 'text-primary'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{alert.title}</h3>
                          <Badge variant={
                            alert.severity === 'high' ? 'destructive' :
                            alert.severity === 'medium' ? 'default' : 'secondary'
                          } className="text-xs">
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {alert.description}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    {alert.action && (
                      <Button size="sm" variant="outline" className="mt-2">
                        {alert.action}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
