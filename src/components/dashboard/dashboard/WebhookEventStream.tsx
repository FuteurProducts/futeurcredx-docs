import { useState, useEffect } from 'react';
import { Zap, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface WebhookEvent {
  id: string;
  type: 'credit_score_updated' | 'application_submitted' | 'approval_granted' | 'credit_inquiry';
  business: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
  data: string;
}

const generateMockEvent = (): WebhookEvent => {
  const types = ['credit_score_updated', 'application_submitted', 'approval_granted', 'credit_inquiry'] as const;
  const businesses = ['TechCorp', 'FinanceFlow', 'RetailMax', 'StartupXYZ', 'DataAnalytics Co'];
  const statuses = ['success', 'success', 'success', 'pending'] as const;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    type: types[Math.floor(Math.random() * types.length)],
    business: businesses[Math.floor(Math.random() * businesses.length)],
    timestamp: new Date(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    data: '{ score: 720, change: +15 }'
  };
};

export function WebhookEventStream() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setEvents(prev => {
        const newEvent = generateMockEvent();
        return [newEvent, ...prev].slice(0, 10);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.type === filter);

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'approval_granted': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'credit_inquiry': return <AlertCircle className="w-4 h-4 text-warning" />;
      default: return <Zap className="w-4 h-4 text-primary" />;
    }
  };

  const getEventColor = (type: string) => {
    switch(type) {
      case 'approval_granted': return 'border-success/30 bg-success/5';
      case 'credit_inquiry': return 'border-warning/30 bg-warning/5';
      case 'application_submitted': return 'border-primary/30 bg-primary/5';
      default: return 'border-info/30 bg-info/5';
    }
  };

  return (
    <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="w-5 h-5 text-primary pulse-glow" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Webhook Event Stream</h2>
              <p className="text-sm text-muted-foreground">Live API activity feed</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'approval_granted' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('approval_granted')}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Approvals
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          </div>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border ${getEventColor(event.type)} hover:border-primary/50 transition-all animate-fade-in`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">
                          {event.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <Badge variant={event.status === 'success' ? 'default' : 'secondary'}>
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{event.business}</p>
                      <code className="text-xs font-code bg-background/50 px-2 py-1 rounded">
                        {event.data}
                      </code>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground ml-4">
                    <Clock className="w-3 h-3" />
                    {event.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No events to display</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
