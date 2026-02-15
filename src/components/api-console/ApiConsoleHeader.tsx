// API Console Header - Environment selector, status banner
import React from 'react';
import {
  CheckCircle,
  Clock,
  Building2,
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

export const ApiConsoleHeader: React.FC<ApiConsoleHeaderProps> = ({
  currentEnvironment: environment,
  switchEnvironment: onEnvironmentChange,
  timeRange,
  onTimeRangeChange,
}) => {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Environment + Organization */}
        <div className="flex items-center gap-3">
          {/* Environment Toggle - Stripe-style */}
          <div className="flex items-center bg-muted rounded-xl p-1">
            <button
              onClick={() => onEnvironmentChange('sandbox')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                environment === 'sandbox'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sandbox
            </button>
            <button
              onClick={() => onEnvironmentChange('production')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                environment === 'production'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Production
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-border" />

          {/* Organization Label (static) */}
          <div className="flex items-center gap-2 px-3 py-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Chase SMB National</span>
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

        {/* Right: System Status — always operational */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 text-success border border-success/20">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-semibold">All Systems Operational</span>
        </div>
      </div>
    </div>
  );
};

export default ApiConsoleHeader;
