// API Console Header - Environment selector, tenant selector, status banner
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  ChevronDown,
  Clock,
  Building2,
  Briefcase
} from 'lucide-react';
import type { Environment, IncidentAlert } from './types';

interface ApiConsoleHeaderProps {
  currentEnvironment: Environment;
  switchEnvironment: (env: Environment) => void;
  incidents: IncidentAlert[];
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

const timeRanges = [
  { id: '1h', label: '1 Hour' },
  { id: '24h', label: '24 Hours' },
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
];

const tenants = [
  { id: 'main', name: 'Main Organization', type: 'org' },
  { id: 'sba', name: 'SBA Lending Unit', type: 'unit' },
  { id: 'cards', name: 'Business Cards', type: 'unit' },
];

export const ApiConsoleHeader: React.FC<ApiConsoleHeaderProps> = ({
  currentEnvironment: environment,
  switchEnvironment: onEnvironmentChange,
  incidents,
  timeRange,
  onTimeRangeChange,
}) => {
  const [tenantOpen, setTenantOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(tenants[0]);

  const activeIncidents = incidents.filter(i => i.status === 'active' || i.status === 'investigating');
  const criticalIncidents = activeIncidents.filter(i => i.severity === 'critical');

  const getSystemStatus = () => {
    if (criticalIncidents.length > 0) return 'critical';
    if (activeIncidents.length > 0) return 'degraded';
    return 'operational';
  };

  const systemStatus = getSystemStatus();

  return (
    <div className="bg-card rounded-2xl border border-border p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Environment + Tenant + Portfolio */}
        <div className="flex items-center gap-3">
          {/* Environment Toggle - Stripe-style */}
          <div className="flex items-center bg-muted rounded-xl p-1">
            <button
              onClick={() => onEnvironmentChange('sandbox')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                environment === 'sandbox'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sandbox
            </button>
            <button
              onClick={() => onEnvironmentChange('production')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                environment === 'production'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Production
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-border" />

          {/* Tenant Selector */}
          <div className="relative">
            <button
              onClick={() => setTenantOpen(!tenantOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted transition-colors"
            >
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{selectedTenant.name}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${tenantOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {tenantOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setTenantOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 mt-2 z-50 w-56 bg-card rounded-xl border border-border shadow-lg overflow-hidden"
                  >
                    {tenants.map(tenant => (
                      <button
                        key={tenant.id}
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setTenantOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors ${
                          selectedTenant.id === tenant.id ? 'bg-muted/50' : ''
                        }`}
                      >
                        {tenant.type === 'org' ? (
                          <Building2 className="w-4 h-4 text-primary" />
                        ) : (
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">{tenant.name}</span>
                        {selectedTenant.id === tenant.id && (
                          <CheckCircle className="w-4 h-4 text-primary ml-auto" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center: Time Range */}
        <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
          {timeRanges.map(range => (
            <button
              key={range.id}
              onClick={() => onTimeRangeChange(range.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeRange === range.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {range.id === timeRange && <Clock className="w-3.5 h-3.5" />}
              {range.label}
            </button>
          ))}
        </div>

        {/* Right: System Status */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
          systemStatus === 'operational'
            ? 'bg-success/10 text-success border border-success/20'
            : systemStatus === 'degraded'
            ? 'bg-warning/10 text-warning border border-warning/20'
            : 'bg-destructive/10 text-destructive border border-destructive/20'
        }`}>
          {systemStatus === 'operational' ? (
            <>
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">All Systems Operational</span>
            </>
          ) : systemStatus === 'degraded' ? (
            <>
              <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-semibold">{activeIncidents.length} Active Incident{activeIncidents.length > 1 ? 's' : ''}</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">{criticalIncidents.length} Critical Issue{criticalIncidents.length > 1 ? 's' : ''}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiConsoleHeader;
