import { Activity, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EndpointStatus {
  name: string;
  region: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  uptime: number;
}

const endpoints: EndpointStatus[] = [
  { name: 'US-East', region: 'Virginia', status: 'healthy', latency: 12, uptime: 99.99 },
  { name: 'US-West', region: 'Oregon', status: 'healthy', latency: 15, uptime: 99.98 },
  { name: 'EU-West', region: 'Ireland', status: 'healthy', latency: 23, uptime: 99.97 },
  { name: 'APAC', region: 'Singapore', status: 'healthy', latency: 45, uptime: 99.96 },
];

export function ApiHealthMonitor() {
  const avgLatency = Math.round(endpoints.reduce((sum, e) => sum + e.latency, 0) / endpoints.length);
  const avgUptime = (endpoints.reduce((sum, e) => sum + e.uptime, 0) / endpoints.length).toFixed(2);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-success/10 rounded-lg">
            <Activity className="w-5 h-5 text-success" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Live API Health Monitor</h2>
            <p className="text-sm text-muted-foreground">Real-time status across all regions</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Avg Latency</p>
            <p className="text-lg font-bold">{avgLatency}ms</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">SLA Uptime</p>
            <p className="text-lg font-bold text-success">{avgUptime}%</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {endpoints.map((endpoint, i) => (
          <div
            key={endpoint.name}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <Card className="glass-card p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {endpoint.status === 'healthy' ? (
                      <CheckCircle className="w-4 h-4 text-success pulse-glow" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-warning" />
                    )}
                    <span className="font-semibold">{endpoint.name}</span>
                  </div>
                  <Badge variant={endpoint.status === 'healthy' ? 'default' : 'destructive'}>
                    {endpoint.status}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground">{endpoint.region}</p>
                
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Latency
                    </div>
                    <p className="text-sm font-bold font-code">{endpoint.latency}ms</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      Uptime
                    </div>
                    <p className="text-sm font-bold text-success">{endpoint.uptime}%</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
