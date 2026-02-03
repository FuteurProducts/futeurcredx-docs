import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'muted' | 'card';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className = '',
  size = 'md',
  variant = 'default'
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8 px-4',
      icon: 'w-12 h-12',
      iconSize: 'w-6 h-6',
      title: 'text-base',
      description: 'text-sm max-w-xs',
    },
    md: {
      container: 'py-16 px-6',
      icon: 'w-16 h-16',
      iconSize: 'w-8 h-8',
      title: 'text-title',
      description: 'text-body max-w-sm',
    },
    lg: {
      container: 'py-24 px-8',
      icon: 'w-20 h-20',
      iconSize: 'w-10 h-10',
      title: 'text-xl font-semibold',
      description: 'text-base max-w-md',
    },
  };

  const variantClasses = {
    default: '',
    muted: 'bg-muted/50 rounded-xl',
    card: 'bg-card border border-border rounded-xl',
  };

  const sizes = sizeClasses[size];
  const variantClass = variantClasses[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizes.container,
        variantClass,
        className
      )}
    >
      <div className={cn(
        'rounded-2xl bg-muted flex items-center justify-center mb-4',
        sizes.icon
      )}>
        <Icon className={cn('text-muted-foreground', sizes.iconSize)} />
      </div>
      <h3 className={cn('text-foreground mb-2', sizes.title)}>{title}</h3>
      <p className={cn('text-muted-foreground mb-6', sizes.description)}>{description}</p>
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              size={size === 'sm' ? 'sm' : 'default'}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || 'outline'}
              size={size === 'sm' ? 'sm' : 'default'}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}

/**
 * NoResultsState - Pre-configured empty state for no search/filter results
 */
export function NoResultsState({
  icon,
  title = 'No results found',
  description = 'Try adjusting your search or filter criteria',
  onClearFilters,
  className = ''
}: {
  icon: LucideIcon;
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      action={onClearFilters ? { label: 'Clear filters', onClick: onClearFilters, variant: 'outline' } : undefined}
      className={className}
      size="md"
    />
  );
}

/**
 * NoDataState - Pre-configured empty state for empty data sets
 */
export function NoDataState({
  icon,
  title = 'No data available',
  description = 'Data will appear here once available',
  onRefresh,
  className = ''
}: {
  icon: LucideIcon;
  title?: string;
  description?: string;
  onRefresh?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      action={onRefresh ? { label: 'Refresh', onClick: onRefresh, variant: 'outline' } : undefined}
      className={className}
      size="md"
    />
  );
}
