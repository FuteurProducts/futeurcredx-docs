import { Clock, Database, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DemoMetaBadgeProps {
  lastUpdated?: string;
  dataSources?: string[];
  coverage?: number;
  className?: string;
}

function formatRelative(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function DemoMetaBadge({
  lastUpdated,
  dataSources,
  coverage,
  className,
}: DemoMetaBadgeProps) {
  const ts = lastUpdated ?? new Date().toISOString();

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'inline-flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-default select-none',
              className,
            )}
          >
            <Clock className="h-2.5 w-2.5" />
            <span>{formatRelative(ts)}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs text-xs space-y-1.5 p-3">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Updated: {new Date(ts).toLocaleString()}</span>
          </div>
          {dataSources && dataSources.length > 0 && (
            <div className="flex items-start gap-1.5">
              <Database className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span>Sources: {dataSources.join(', ')}</span>
            </div>
          )}
          {coverage !== undefined && (
            <div className="flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span>Coverage: {coverage}%</span>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default DemoMetaBadge;
