import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Webhook, Plus, Trash2, Eye, EyeOff, 
  CheckCircle, XCircle, RefreshCw, Copy, AlertTriangle,
  Send, History, Settings
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
export interface WebhookEvent {
  id: string;
  name: string;
  description: string;
  category: 'score' | 'application' | 'alert' | 'account';
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  secretKey: string;
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  failureCount: number;
}

export interface WebhookConfigPanelProps {
  endpoints: WebhookEndpoint[];
  availableEvents: WebhookEvent[];
  onAdd?: (data: { url: string; events: string[] }) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string, active: boolean) => void;
  onTest?: (id: string) => void;
  className?: string;
}

// Event categories
const eventCategories: Record<string, { color: string; lightColor: string }> = {
  score: { color: 'var(--primary-01)', lightColor: 'hsl(var(--info) / 0.1)' },
  application: { color: 'var(--primary-04)', lightColor: 'hsl(var(--primary) / 0.1)' },
  alert: { color: 'var(--primary-05)', lightColor: 'hsl(var(--warning) / 0.1)' },
  account: { color: 'var(--primary-02)', lightColor: 'hsl(var(--success) / 0.1)' },
};

// Default events if not provided
const defaultEvents: WebhookEvent[] = [
  { id: 'score.updated', name: 'Score Updated', description: 'When a credit score changes', category: 'score' },
  { id: 'score.threshold', name: 'Score Threshold', description: 'When score crosses a threshold', category: 'score' },
  { id: 'application.submitted', name: 'Application Submitted', description: 'New application received', category: 'application' },
  { id: 'application.approved', name: 'Application Approved', description: 'Application approved', category: 'application' },
  { id: 'application.declined', name: 'Application Declined', description: 'Application declined', category: 'application' },
  { id: 'alert.risk', name: 'Risk Alert', description: 'Risk indicator detected', category: 'alert' },
  { id: 'alert.filing', name: 'New Filing', description: 'New public filing detected', category: 'alert' },
  { id: 'account.created', name: 'Account Created', description: 'New business account', category: 'account' },
];

// ============================================
// WEBHOOK CONFIG PANEL
// ============================================
export const WebhookConfigPanel: React.FC<WebhookConfigPanelProps> = ({
  endpoints,
  availableEvents = defaultEvents,
  onAdd,
  onDelete,
  onToggle,
  onTest,
  className = '',
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  const [testingEndpoint, setTestingEndpoint] = useState<string | null>(null);

  const toggleSecret = (id: string) => {
    setVisibleSecrets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const handleAdd = () => {
    if (newUrl && selectedEvents.size > 0 && onAdd) {
      onAdd({ url: newUrl, events: Array.from(selectedEvents) });
      setNewUrl('');
      setSelectedEvents(new Set());
      setIsAdding(false);
    }
  };

  const handleTest = async (id: string) => {
    setTestingEndpoint(id);
    if (onTest) {
      await onTest(id);
    }
    setTimeout(() => setTestingEndpoint(null), 2000);
  };

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card rounded-2xl p-6 shadow-sm border border-border ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Webhook className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Webhooks</h3>
            <p className="text-sm text-muted-foreground">Configure event notifications</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Endpoint
        </button>
      </div>

      {/* Add new endpoint form */}
      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 bg-accent rounded-xl border border-border"
        >
          <h4 className="font-semibold text-foreground mb-4">Add New Webhook</h4>
          
          {/* URL input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-1">
              Endpoint URL
            </label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://your-server.com/webhook"
              className="w-full px-4 py-2 border border-border rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring outline-none"
            />
          </div>
          
          {/* Event selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Events to Subscribe
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableEvents.map(event => {
                const catConfig = eventCategories[event.category];
                const isSelected = selectedEvents.has(event.id);
                return (
                  <button
                    key={event.id}
                    onClick={() => toggleEvent(event.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected 
                        ? 'border-ring bg-info/10'
                        : 'border-border hover:border-border/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: catConfig.color }}
                      />
                      <span className="text-sm font-medium text-foreground">{event.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{event.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setIsAdding(false); setNewUrl(''); setSelectedEvents(new Set()); }}
              className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newUrl || selectedEvents.size === 0}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Webhook
            </button>
          </div>
        </motion.div>
      )}

      {/* Endpoints list */}
      <div className="space-y-4">
        {endpoints.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Webhook className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No webhooks configured</p>
            <p className="text-sm">Add an endpoint to receive event notifications</p>
          </div>
        ) : (
          endpoints.map((endpoint, index) => (
            <motion.div
              key={endpoint.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${
                endpoint.isActive ? 'border-border' : 'border-border bg-accent opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded">
                      {endpoint.url}
                    </code>
                    {endpoint.isActive ? (
                      <span className="flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" /> Inactive
                      </span>
                    )}
                    {endpoint.failureCount > 0 && (
                      <span className="flex items-center gap-1 text-xs text-warning bg-warning/10 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> {endpoint.failureCount} failures
                      </span>
                    )}
                  </div>
                  
                  {/* Events */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {endpoint.events.map(eventId => {
                      const event = availableEvents.find(e => e.id === eventId);
                      const catConfig = event ? eventCategories[event.category] : { color: 'var(--shade-06)', lightColor: 'var(--shade-09)' };
                      return (
                        <span 
                          key={eventId}
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: catConfig.lightColor, color: catConfig.color }}
                        >
                          {eventId}
                        </span>
                      );
                    })}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTest(endpoint.id)}
                    disabled={testingEndpoint === endpoint.id}
                    className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                    title="Send test event"
                  >
                    {testingEndpoint === endpoint.id ? (
                      <RefreshCw className="w-4 h-4 text-info animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => onToggle?.(endpoint.id, !endpoint.isActive)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title={endpoint.isActive ? 'Disable' : 'Enable'}
                  >
                    <Settings className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => onDelete?.(endpoint.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
              
              {/* Secret key */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">Secret:</span>
                <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded flex-1">
                  {visibleSecrets.has(endpoint.id) ? endpoint.secretKey : '••••••••••••••••'}
                </code>
                <button
                  onClick={() => toggleSecret(endpoint.id)}
                  className="p-1 hover:bg-muted rounded"
                >
                  {visibleSecrets.has(endpoint.id) ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => copySecret(endpoint.secretKey)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <Copy className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              
              {/* Metadata */}
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>Created: {endpoint.createdAt}</span>
                {endpoint.lastTriggered && (
                  <span className="flex items-center gap-1">
                    <History className="w-3 h-3" />
                    Last triggered: {endpoint.lastTriggered}
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default WebhookConfigPanel;
