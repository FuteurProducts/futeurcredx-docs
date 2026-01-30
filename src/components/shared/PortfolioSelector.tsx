/**
 * Portfolio Selector Component
 * Global dropdown for selecting active portfolio
 * All BFF calls require portfolioId - this provides the selection UI
 */

import { useState } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { ChevronDown, Briefcase, Check, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PortfolioSelectorProps {
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
}

export function PortfolioSelector({ variant = 'default', className }: PortfolioSelectorProps) {
  const { portfolio, portfolios, portfolioId, setPortfolioId, isLoading, error } = usePortfolio();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
        <Loader2 className="h-4 w-4 animate-spin" />
        {variant !== 'minimal' && <span className="text-sm">Loading portfolios...</span>}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex items-center gap-2 text-destructive', className)}>
        <Briefcase className="h-4 w-4" />
        {variant !== 'minimal' && <span className="text-sm">Error loading portfolios</span>}
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
        <Briefcase className="h-4 w-4" />
        {variant !== 'minimal' && <span className="text-sm">No portfolios available</span>}
      </div>
    );
  }

  // Single portfolio - just show it, no dropdown
  if (portfolios.length === 1) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Briefcase className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">{portfolio?.name || 'Portfolio'}</span>
      </div>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={variant === 'compact' ? 'sm' : 'default'}
          className={cn(
            'flex items-center gap-2',
            variant === 'minimal' && 'h-8 px-2',
            className
          )}
        >
          <Briefcase className="h-4 w-4 text-primary" />
          {variant !== 'minimal' && (
            <span className="max-w-[150px] truncate">{portfolio?.name || 'Select portfolio'}</span>
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px]">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Switch Portfolio
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {portfolios.map((p) => (
          <DropdownMenuItem
            key={p.id}
            onClick={() => {
              setPortfolioId(p.id);
              setOpen(false);
            }}
            className="flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="font-medium">{p.name}</span>
              {p.description && (
                <span className="text-xs text-muted-foreground">{p.description}</span>
              )}
            </div>
            {p.id === portfolioId && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default PortfolioSelector;
