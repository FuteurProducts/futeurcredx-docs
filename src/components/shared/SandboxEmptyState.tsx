/**
 * SandboxEmptyState
 * Reusable empty state for sandbox/production modes when no data is available.
 * ALWAYS shows an action button to guide users to the API Console.
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { Database } from 'lucide-react';

import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

interface SandboxEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const DEFAULT_TITLE = 'No Data Available';
const DEFAULT_DESCRIPTION =
  'Connect your API to see live data. Configure your API keys in the API Console to start receiving data.';

export function SandboxEmptyState({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  actionLabel = 'Open API Console',
  onAction,
  className,
}: SandboxEmptyStateProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAction = () => {
    if (onAction) {
      onAction();
      return;
    }
    // Navigate to API Console tab, preserving demo bank path if present
    const basePath = location.pathname.match(/^\/demo\/[^/]+/)?.[0] || '/dashboard';
    navigate(`${basePath}?tab=api-keys`);
  };

  return (
    <EmptyState
      icon={Database}
      title={title}
      description={description}
      action={{ label: actionLabel, onClick: handleAction }}
      variant="card"
      size="lg"
      className={cn(className)}
    />
  );
}
