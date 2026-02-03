/**
 * BFF Error Boundary Component
 * Handles 422 (missing portfolioId), 403 (forbidden), and other BFF errors
 */

import { Component, ReactNode } from 'react';
import { AlertTriangle, Lock, Briefcase, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BffError } from '@/services/bff';
import { logger } from '@/utils/logger';

interface BffErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
}

interface BffErrorBoundaryState {
  error: BffError | Error | null;
}

export class BffErrorBoundary extends Component<BffErrorBoundaryProps, BffErrorBoundaryState> {
  constructor(props: BffErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): BffErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    logger.error('BffErrorBoundary caught error:', error);
  }

  handleRetry = () => {
    this.setState({ error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <BffErrorDisplay error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

// Standalone error display component
interface BffErrorDisplayProps {
  error: BffError | Error | null;
  onRetry?: () => void;
  className?: string;
}

export function BffErrorDisplay({ error, onRetry, className }: BffErrorDisplayProps) {
  if (!error) return null;

  const isBffError = (err: unknown): err is BffError => {
    return typeof err === 'object' && err !== null && 'error' in err && 'meta' in err;
  };

  const bffError = isBffError(error) ? error : null;
  const errorCode = bffError?.error?.code || 'UNKNOWN';
  const errorMessage = bffError?.error?.message || (error as Error)?.message || 'An unexpected error occurred';

  // Determine error type and display
  const getErrorConfig = () => {
    switch (errorCode) {
      case 'VALIDATION_ERROR':
        return {
          icon: Briefcase,
          title: 'Portfolio Required',
          description: 'Please select a portfolio to view this data.',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
        };
      case 'FORBIDDEN':
        return {
          icon: Lock,
          title: 'Access Denied',
          description: 'You don\'t have permission to access this portfolio.',
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
        };
      case 'UNAUTHORIZED':
        return {
          icon: Lock,
          title: 'Session Expired',
          description: 'Please log in again to continue.',
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Error',
          description: errorMessage,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <div
      className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-6 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-full ${config.bgColor}`}>
          <Icon className={`h-6 w-6 ${config.color}`} />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${config.color}`}>{config.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
          
          {bffError?.meta?.requestId && (
            <p className="text-xs text-muted-foreground mt-2">
              Request ID: {bffError.meta.requestId}
            </p>
          )}

          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BffErrorBoundary;
