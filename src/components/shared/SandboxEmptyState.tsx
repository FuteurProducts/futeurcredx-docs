/**
 * SandboxEmptyState
 * Reusable empty state for sandbox/production modes when no data is available.
 * Wraps the base EmptyState component with sandbox-specific defaults.
 */

import { Database } from 'lucide-react';

import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';
import { logger } from '@/utils/logger';

interface SandboxEmptyStateProps {
  title?: string;
  description?: string;
  showApiConsoleLink?: boolean;
  onRetry?: () => void;
  className?: string;
}

const DEFAULT_TITLE = 'No Data Available';
const DEFAULT_DESCRIPTION =
  'Connect your API to see live data. In sandbox mode, configure your API keys in Settings to start receiving data.';

export function SandboxEmptyState({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  showApiConsoleLink = false,
  onRetry,
  className,
}: SandboxEmptyStateProps) {
  const handleOpenApiConsole = () => {
    logger.info('[SandboxEmptyState] Navigate to API Console requested');
  };

  return (
    <EmptyState
      icon={Database}
      title={title}
      description={description}
      action={onRetry ? { label: 'Retry', onClick: onRetry } : undefined}
      secondaryAction={
        showApiConsoleLink
          ? { label: 'Open API Console', onClick: handleOpenApiConsole, variant: 'outline' }
          : undefined
      }
      variant="card"
      size="lg"
      className={cn(className)}
    />
  );
}
